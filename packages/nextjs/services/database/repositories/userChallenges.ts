import { InferInsertModel, and, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { lower, userChallenges, users } from "~~/services/database/config/schema";

export type UserChallengeInsert = InferInsertModel<typeof userChallenges>;
export type UserChallenges = Awaited<ReturnType<typeof getLatestSubmissionPerChallengeByUser>>;
export type UserChallengesWithGithub = Awaited<ReturnType<typeof getLatestSubmissionPerChallengeByGithubId>>;

export async function getLatestSubmissionPerChallengeByUser(userAddress: string) {
  const allChallenges = await db.query.userChallenges.findMany({
    where: eq(lower(userChallenges.userAddress), userAddress.toLowerCase()),
    with: {
      challenge: true,
    },
    orderBy: (userChallenges, { desc }) => [desc(userChallenges.id)],
  });

  const latestChallenges = new Map<string, (typeof allChallenges)[number]>();

  for (const challenge of allChallenges) {
    if (!latestChallenges.has(challenge.challengeId)) {
      latestChallenges.set(challenge.challengeId, challenge);
    }
  }

  return Array.from(latestChallenges.values());
}

export async function getTotalSubmissionsCount(): Promise<number> {
  const totalCount = await db.$count(userChallenges);
  return totalCount;
}

export async function getTotalDeployedContractsCount(): Promise<number> {
  const totalCount = await db.$count(
    userChallenges,
    and(isNotNull(userChallenges.deployedContractAddress), ne(userChallenges.deployedContractAddress, "")),
  );
  return totalCount;
}

export async function getLatestSubmissionPerChallengeByGithubId(githubUsername: string) {
  try {
    // Get all user challenges with their associated user data, similar to leaderboard logic
    const rawChallengeData = await db
      .select({
        id: userChallenges.id,
        userAddress: userChallenges.userAddress,
        challengeId: userChallenges.challengeId,
        frontendUrl: userChallenges.frontendUrl,
        contractUrl: userChallenges.contractUrl,
        githubRepoUrl: userChallenges.githubRepoUrl,
        deployedContractAddress: userChallenges.deployedContractAddress,
        timeDifference: userChallenges.timeDifference,
        gasDifference: userChallenges.gasDifference,
        reviewComment: userChallenges.reviewComment,
        submittedAt: userChallenges.submittedAt,
        reviewAction: userChallenges.reviewAction,
        signature: userChallenges.signature,
        githubUsername: userChallenges.githubUsername,
        score: userChallenges.score,
        socialGithub: users.socialGithub,
      })
      .from(userChallenges)
      .innerJoin(users, eq(userChallenges.userAddress, users.userAddress))
      .orderBy(userChallenges.id);

    // Get challenge data separately to join
    const challengeDataMap = new Map();
    const challengeIds = [...new Set(rawChallengeData.map(c => c.challengeId))];

    if (challengeIds.length > 0) {
      const challengeData = await db.query.challenges.findMany({
        where: (challenges, { inArray }) => inArray(challenges.id, challengeIds),
      });

      challengeData.forEach(challenge => {
        challengeDataMap.set(challenge.id, challenge);
      });
    }

    // Filter challenges by GitHub username and get latest per challenge
    const githubChallenges = rawChallengeData.filter(entry => {
      const effectiveGithub = entry.socialGithub || entry.githubUsername;
      return effectiveGithub?.toLowerCase() === githubUsername.toLowerCase();
    });

    const latestChallenges = new Map<string, any>();

    // Process each entry to get the latest submission per challenge
    for (const entry of githubChallenges) {
      const existing = latestChallenges.get(entry.challengeId);
      if (!existing || entry.id > existing.id) {
        const challenge = challengeDataMap.get(entry.challengeId);
        if (challenge) {
          latestChallenges.set(entry.challengeId, {
            ...entry,
            challenge,
            user: {
              userAddress: entry.userAddress,
              socialGithub: entry.socialGithub,
            },
          });
        }
      }
    }

    return Array.from(latestChallenges.values());
  } catch (error) {
    console.error("Error fetching challenges by GitHub ID:", error);
    throw error;
  }
}

export async function createUserChallenge(challenge: UserChallengeInsert) {
  const result = await db.insert(userChallenges).values(challenge).returning();
  return result[0];
}

export async function updateUserChallengeById(id: number, updates: Partial<UserChallengeInsert>) {
  const result = await db.update(userChallenges).set(updates).where(eq(userChallenges.id, id)).returning();
  return result[0];
}

export async function getSubmissionCountForChallengeByAddress(
  userAddress: string,
  challengeId: string,
): Promise<number> {
  const count = await db.$count(
    userChallenges,
    eq(lower(userChallenges.userAddress), userAddress.toLowerCase()) && eq(userChallenges.challengeId, challengeId),
  );
  return count;
}

export async function getSubmissionCountForChallengeByGithubId(
  githubUsername: string,
  challengeId: string,
): Promise<number> {
  // Count all submissions for this challenge by this github username (across all addresses)
  const allChallenges = await db.query.userChallenges.findMany({
    where: eq(userChallenges.challengeId, challengeId),
    with: {
      user: true,
    },
  });
  return allChallenges.filter(entry => {
    const effectiveGithub = entry.user?.socialGithub || entry.githubUsername;
    return effectiveGithub?.toLowerCase() === githubUsername.toLowerCase();
  }).length;
}
