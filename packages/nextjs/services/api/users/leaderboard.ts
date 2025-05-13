import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { userChallenges, users } from "~~/services/database/config/schema";
import { ReviewAction } from "~~/services/database/config/types";

export async function getLeaderboard() {
  try {
    // Get all users with counts of their accepted challenges
    const leaderboardData = await db
      .select({
        userAddress: users.userAddress,
        socialX: users.socialX,
        socialGithub: users.socialGithub,
        batchStatus: users.batchStatus,
        challengeCount: count(userChallenges.challengeId).as("challengeCount"),
      })
      .from(users)
      .leftJoin(userChallenges, eq(userChallenges.userAddress, users.userAddress))
      .where(inArray(userChallenges.reviewAction, [ReviewAction.ACCEPTED]))
      .groupBy(users.userAddress)
      .orderBy(desc(count(userChallenges.challengeId)));

    // Fetch GitHub usernames from challenges separately
    const githubData = await db
      .select({
        userAddress: userChallenges.userAddress,
        githubUsername: userChallenges.githubUsername,
      })
      .from(userChallenges)
      .where(inArray(userChallenges.reviewAction, [ReviewAction.ACCEPTED]))
      .groupBy(userChallenges.userAddress, userChallenges.githubUsername);

    // Process data to prioritize GitHub username from challenges if available
    const processedData = leaderboardData.map(entry => {
      let githubUsername = entry.socialGithub;
      const userGithubData = githubData.find(g => g.userAddress === entry.userAddress && g.githubUsername);
      if (userGithubData && userGithubData.githubUsername) {
        githubUsername = userGithubData.githubUsername;
      }
      return {
        ...entry,
        socialGithub: githubUsername,
      };
    });

    return processedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
