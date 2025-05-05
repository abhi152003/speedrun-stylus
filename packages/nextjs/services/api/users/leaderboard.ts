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

    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
