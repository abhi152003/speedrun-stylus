import { eq } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { userChallenges, users } from "~~/services/database/config/schema";
import { ReviewAction } from "~~/services/database/config/types";
import {
  getAllFoundationSubmissions,
  getFoundationCertificateStatusBatch,
} from "~~/services/database/repositories/foundationUsers";

// Helper function to extract GitHub username from repo URL
function extractGithubUsername(repoUrl: string | null): string | null {
  if (!repoUrl) return null;

  // Match patterns like:
  // https://github.com/username/repo
  // github.com/username/repo
  // git@github.com:username/repo.git
  const patterns = [/github\.com[:/]([^/]+)/i, /github\.com\/([^/]+)/i];

  for (const pattern of patterns) {
    const match = repoUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function getLeaderboard() {
  try {
    // First, get all users with accepted challenges and their GitHub usernames
    const acceptedChallengesData = await db
      .select({
        userAddress: users.userAddress,
        socialX: users.socialX,
        socialGithub: users.socialGithub,
        batchStatus: users.batchStatus,
        challengeId: userChallenges.challengeId,
        githubFromChallenge: userChallenges.githubUsername,
        githubRepoUrl: userChallenges.githubRepoUrl,
        score: userChallenges.score,
      })
      .from(users)
      .innerJoin(userChallenges, eq(userChallenges.userAddress, users.userAddress))
      .where(eq(userChallenges.reviewAction, ReviewAction.ACCEPTED));

    // Get all submissions (including rejected ones) to count total submissions per GitHub user
    const allSubmissionsData = await db
      .select({
        userAddress: users.userAddress,
        socialGithub: users.socialGithub,
        challengeId: userChallenges.challengeId,
        githubFromChallenge: userChallenges.githubUsername,
        githubRepoUrl: userChallenges.githubRepoUrl,
      })
      .from(users)
      .innerJoin(userChallenges, eq(userChallenges.userAddress, users.userAddress));

    // Process data to determine GitHub username and group by GitHub ID
    const githubUserMap = new Map<
      string,
      {
        userAddress: string;
        socialX: string | null;
        socialGithub: string | null;
        batchStatus: any;
        challengeIds: Set<string>;
        challengeCount: number;
        totalSubmissions: number;
        totalScore: number;
      }
    >();

    // First, process accepted challenges to build the base map
    for (const entry of acceptedChallengesData) {
      // Determine the GitHub username (prioritize user's social GitHub, then challenge GitHub, then extract from repo URL)
      const githubUsername =
        entry.socialGithub || entry.githubFromChallenge || extractGithubUsername(entry.githubRepoUrl);

      // Skip entries without GitHub username
      if (!githubUsername) {
        console.log("Skipping entry without GitHub username:", entry);
        continue;
      }

      const key = githubUsername.toLowerCase();

      if (!githubUserMap.has(key)) {
        githubUserMap.set(key, {
          userAddress: entry.userAddress,
          socialX: entry.socialX,
          socialGithub: githubUsername,
          batchStatus: entry.batchStatus,
          challengeIds: new Set(),
          challengeCount: 0,
          totalSubmissions: 0,
          totalScore: 0,
        });
      }

      const userEntry = githubUserMap.get(key);

      // This should always exist since we just checked/created it above
      if (userEntry) {
        // Check if this is a new challenge for this user
        const isNewChallenge = !userEntry.challengeIds.has(entry.challengeId);

        // Add challenge to the set (automatically handles duplicates)
        userEntry.challengeIds.add(entry.challengeId);

        // Update challenge count
        userEntry.challengeCount = userEntry.challengeIds.size;

        // Add score to total only for new challenges (to avoid double counting)
        if (isNewChallenge && entry.score) {
          userEntry.totalScore += entry.score;
        }

        // If this address has batch status and the current entry doesn't, prefer this one
        if (entry.batchStatus && !userEntry.batchStatus) {
          userEntry.batchStatus = entry.batchStatus;
        }

        // If this address has socialX and the current entry doesn't, prefer this one
        if (entry.socialX && !userEntry.socialX) {
          userEntry.socialX = entry.socialX;
        }
      }
    }

    // Count total submissions per GitHub user (including all submission attempts)
    const githubSubmissionCounts = new Map<string, number>();

    console.log("Total submissions data entries:", allSubmissionsData.length);

    for (const entry of allSubmissionsData) {
      const githubUsername =
        entry.socialGithub || entry.githubFromChallenge || extractGithubUsername(entry.githubRepoUrl);

      if (!githubUsername) {
        console.log("Skipping entry without GitHub username:", entry);
        continue;
      }

      const key = githubUsername.toLowerCase();
      githubSubmissionCounts.set(key, (githubSubmissionCounts.get(key) || 0) + 1);
    }

    console.log("GitHub submission counts map size:", githubSubmissionCounts.size);
    console.log(
      "Total submissions across all GitHub users:",
      Array.from(githubSubmissionCounts.values()).reduce((sum, count) => sum + count, 0),
    );

    // Update total submissions for each GitHub user
    for (const [githubKey, userEntry] of githubUserMap.entries()) {
      userEntry.totalSubmissions = githubSubmissionCounts.get(githubKey) || 0;
    }

    // Convert map to array and sort by challenge count descending
    const processedData = Array.from(githubUserMap.values())
      .map(entry => ({
        userAddress: entry.userAddress,
        socialX: entry.socialX,
        socialGithub: entry.socialGithub,
        batchStatus: entry.batchStatus,
        challengeCount: entry.challengeCount,
        totalSubmissions: entry.totalSubmissions,
        totalScore: entry.totalScore,
      }))
      .sort((a, b) => b.challengeCount - a.challengeCount);

    // Get all foundation submissions from MongoDB
    const foundationSubmissions = await getAllFoundationSubmissions();

    // Get foundation certificate status for all users
    const addresses = processedData.map(entry => entry.userAddress);
    const foundationStatusMap = await getFoundationCertificateStatusBatch(addresses);

    // Create a map of existing users by wallet address (normalized)
    const existingUsersMap = new Map<string, (typeof processedData)[0]>();
    for (const entry of processedData) {
      existingUsersMap.set(entry.userAddress.toLowerCase(), entry);
    }

    // Add foundation-only users to the leaderboard
    const foundationOnlyUsers: Array<{
      userAddress: string;
      socialX: string | null;
      socialGithub: string | null;
      batchStatus: any;
      challengeCount: number;
      totalSubmissions: number;
      totalScore: number;
      hasFoundationCertificate: boolean;
    }> = [];

    for (const foundationUser of foundationSubmissions) {
      const normalizedAddress = foundationUser.walletAddress.toLowerCase();

      // If user is not already in the leaderboard from PostgreSQL, add them
      if (!existingUsersMap.has(normalizedAddress)) {
        // Extract GitHub username from githubUsername field or from githubRepo URL
        const githubUsername =
          foundationUser.githubUsername || extractGithubUsername(`https://github.com/${foundationUser.githubRepo}`);

        foundationOnlyUsers.push({
          userAddress: foundationUser.walletAddress,
          socialX: null,
          socialGithub: githubUsername,
          batchStatus: null,
          challengeCount: 1, // Foundation challenge counts as 1 completed challenge
          totalSubmissions: 1, // They submitted foundation challenge
          totalScore: 0, // Foundation challenge doesn't have a score in the regular system
          hasFoundationCertificate: true,
        });

        // Mark this address as having foundation certificate in the status map
        foundationStatusMap.set(normalizedAddress, true);
      }
    }

    // Add foundation certificate status to existing users
    const dataWithFoundationStatus = processedData.map(entry => ({
      ...entry,
      hasFoundationCertificate: foundationStatusMap.get(entry.userAddress.toLowerCase()) || false,
    }));

    // Merge foundation-only users with existing users
    const mergedData = [...dataWithFoundationStatus, ...foundationOnlyUsers];

    // Sort by challenge count descending, then by total score
    mergedData.sort((a, b) => {
      if (b.challengeCount !== a.challengeCount) {
        return b.challengeCount - a.challengeCount;
      }
      return b.totalScore - a.totalScore;
    });

    return mergedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
