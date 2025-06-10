import { countDistinct, desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { userChallenges, users } from "~~/services/database/config/schema";
import { ReviewAction } from "~~/services/database/config/types";
import { getGithubUsernameFromChallenges } from "~~/services/database/repositories/users";

export async function getLeaderboard() {
  try {
    // Get all users with counts of their accepted challenges
    // Using countDistinct to count unique challenges per user
    const leaderboardData = await db
      .select({
        userAddress: users.userAddress,
        socialX: users.socialX,
        socialGithub: users.socialGithub,
        batchStatus: users.batchStatus,
        challengeCount: countDistinct(userChallenges.challengeId).as("challengeCount"),
      })
      .from(users)
      .leftJoin(userChallenges, eq(userChallenges.userAddress, users.userAddress))
      .where(inArray(userChallenges.reviewAction, [ReviewAction.ACCEPTED]))
      .groupBy(users.userAddress)
      .orderBy(desc(countDistinct(userChallenges.challengeId)));

    // Process data to add GitHub username from challenges if not set in user profile
    const processedData = await Promise.all(
      leaderboardData.map(async entry => {
        let githubUsername = entry.socialGithub;

        // If no GitHub username in user profile, try to get it from challenges
        if (!githubUsername) {
          githubUsername = await getGithubUsernameFromChallenges(entry.userAddress);
        }

        return {
          ...entry,
          socialGithub: githubUsername,
        };
      }),
    );

    return processedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
