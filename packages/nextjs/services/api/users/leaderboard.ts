import { eq } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { userChallenges, users } from "~~/services/database/config/schema";
import { ReviewAction } from "~~/services/database/config/types";

export async function getLeaderboard() {
  try {
    // First, get all users with accepted challenges and their GitHub usernames
    const rawLeaderboardData = await db
      .select({
        userAddress: users.userAddress,
        socialX: users.socialX,
        socialGithub: users.socialGithub,
        batchStatus: users.batchStatus,
        challengeId: userChallenges.challengeId,
        githubFromChallenge: userChallenges.githubUsername,
      })
      .from(users)
      .innerJoin(userChallenges, eq(userChallenges.userAddress, users.userAddress))
      .where(eq(userChallenges.reviewAction, ReviewAction.ACCEPTED));

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
      }
    >();

    // Process each entry to build the map grouped by GitHub username
    for (const entry of rawLeaderboardData) {
      // Determine the GitHub username (prioritize user's social GitHub, then challenge GitHub)
      const githubUsername = entry.socialGithub || entry.githubFromChallenge;

      // Skip entries without GitHub username
      if (!githubUsername) {
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
        });
      }

      const userEntry = githubUserMap.get(key);

      // This should always exist since we just checked/created it above
      if (userEntry) {
        // Add challenge to the set (automatically handles duplicates)
        userEntry.challengeIds.add(entry.challengeId);

        // Update challenge count
        userEntry.challengeCount = userEntry.challengeIds.size;

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

    // Convert map to array and sort by challenge count descending
    const processedData = Array.from(githubUserMap.values())
      .map(entry => ({
        userAddress: entry.userAddress,
        socialX: entry.socialX,
        socialGithub: entry.socialGithub,
        batchStatus: entry.batchStatus,
        challengeCount: entry.challengeCount,
      }))
      .sort((a, b) => b.challengeCount - a.challengeCount);

    return processedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
