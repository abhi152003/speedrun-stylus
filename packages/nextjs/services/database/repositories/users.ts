import { ReviewAction } from "../config/types";
import { UserRole } from "../config/types";
import { ColumnSort, SortingState } from "@tanstack/react-table";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, desc, eq, ilike, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { lower, userChallenges, users } from "~~/services/database/config/schema";

type PickSocials<T> = {
  [K in keyof T as K extends `social${string}` ? K : never]?: T[K] extends string | null ? string : never;
};

export type UserInsert = InferInsertModel<typeof users>;
export type UserSelect = InferSelectModel<typeof users>;
export type UserByAddress = UserSelect | null;
export type UserSocials = PickSocials<NonNullable<UserByAddress>>;
export type UserWithChallengesData = Awaited<ReturnType<typeof getSortedUsersWithChallengesInfo>>["data"][0];
export type UserLocation = NonNullable<UserByAddress>["location"];

export async function getGithubUsernameFromChallenges(userAddress: string): Promise<string | null> {
  const userChallenge = await db.query.userChallenges.findFirst({
    where: and(
      eq(lower(userChallenges.userAddress), userAddress.toLowerCase()),
      isNotNull(userChallenges.githubUsername),
    ),
    orderBy: [desc(userChallenges.submittedAt)],
    columns: {
      githubUsername: true,
    },
  });

  return userChallenge?.githubUsername || null;
}

export async function getUserByAddress(userAddress: string): Promise<UserSelect | null> {
  const userFound = await db.query.users.findFirst({
    where: eq(lower(users.userAddress), userAddress.toLowerCase()),
  });

  if (!userFound) {
    return null;
  }

  // If socialGithub is not set, try to get it from user challenges
  if (!userFound.socialGithub) {
    const githubFromChallenges = await getGithubUsernameFromChallenges(userAddress);
    if (githubFromChallenges) {
      return {
        ...userFound,
        socialGithub: githubFromChallenges,
      };
    }
  }

  return userFound;
}

export async function getSortedUsersWithChallengesInfo(start: number, size: number, sorting: SortingState) {
  const sortingQuery = sorting[0] as ColumnSort;

  const challengesCompletedExpr = sql`(SELECT COUNT(DISTINCT uc.challenge_id) FROM ${userChallenges} uc WHERE uc.user_address = ${users.userAddress} AND uc.review_action = ${ReviewAction.ACCEPTED})`;
  const lastActivityIsoExpr = sql`to_char(
    COALESCE(
      (SELECT MAX(uc.submitted_at) FROM ${userChallenges} uc WHERE uc.user_address = ${users.userAddress}),
      ${users.createdAt}
    ),
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  )`;

  const query = db.query.users.findMany({
    limit: size,
    offset: start,
    orderBy: (users, { desc, asc }) => {
      if (!sortingQuery) return [];

      const sortOrder = sortingQuery.desc ? desc : asc;
      // Use the pre-defined SQL expressions for sorting
      if (sortingQuery.id === "challengesCompleted") {
        return sortOrder(challengesCompletedExpr);
      }

      if (sortingQuery.id === "lastActivity") {
        return sortOrder(lastActivityIsoExpr);
      }

      // For regular fields in the users table
      if (sortingQuery.id in users) {
        return sortOrder(users[sortingQuery.id as keyof typeof users]);
      }

      return [];
    },
    extras: {
      // Reuse the same SQL expressions for the extras
      challengesCompleted: challengesCompletedExpr.as("challengesCompleted"),
      lastActivity: lastActivityIsoExpr.as("lastActivity"),
    },
    with: {
      userChallenges: true,
    },
  });

  const [usersData, totalCount] = await Promise.all([query, db.$count(users)]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const preparedUsersData = usersData.map(({ userChallenges, ...restUser }) => ({
    ...restUser,
    challengesCompleted: Number(restUser.challengesCompleted),
    lastActivity: restUser.lastActivity as Date,
  }));

  return {
    data: preparedUsersData,
    meta: {
      totalRowCount: totalCount,
    },
  };
}

export async function isUserRegistered(address: string) {
  return Boolean(await db.$count(users, eq(users.userAddress, address)));
}

export async function createUser(user: UserInsert) {
  const result = await db.insert(users).values(user).returning();
  return result[0];
}

export async function updateUserSocials(userAddress: string, socials: UserSocials) {
  // Non-values on socials should be saved as NULL
  const socialsToUpdate = Object.fromEntries(Object.entries(socials).map(([key, value]) => [key, value || null]));

  // Update updatedAt whenever user data changes
  const result = await db
    .update(users)
    .set({
      ...socialsToUpdate,
      updatedAt: new Date(),
    })
    .where(eq(lower(users.userAddress), userAddress.toLowerCase()))
    .returning();

  return result[0];
}

export async function updateUserLocation(userAddress: string, location: UserLocation) {
  const result = await db
    .update(users)
    .set({
      location,
      updatedAt: new Date(),
    })
    .where(eq(lower(users.userAddress), userAddress.toLowerCase()))
    .returning();

  return result[0];
}

export async function updateUserRoleToBuilder(userAddress: string) {
  const result = await db
    .update(users)
    .set({
      role: UserRole.BUILDER,
      updatedAt: new Date(),
    })
    .where(eq(lower(users.userAddress), userAddress.toLowerCase()))
    .returning();

  return result[0];
}

export async function isUserAdmin(userAddress: string): Promise<boolean> {
  const user = await getUserByAddress(userAddress);
  return user?.role === UserRole.ADMIN;
}

export async function getAllUsers({
  offset = 0,
  limit = 20,
  search = "",
}: {
  offset?: number;
  limit?: number;
  search?: string;
}) {
  let whereCondition;
  let additionalUserAddresses: string[] = [];

  if (search) {
    // First, search in the users table
    whereCondition = or(
      ilike(users.userAddress, `%${search}%`),
      ilike(users.socialGithub, `%${search}%`),
      ilike(users.socialX, `%${search}%`),
      ilike(users.location, `%${search}%`),
    );

    // Also search for GitHub usernames in user challenges
    const challengesWithGithub = await db.query.userChallenges.findMany({
      where: ilike(userChallenges.githubUsername, `%${search}%`),
      columns: {
        userAddress: true,
      },
    });

    additionalUserAddresses = challengesWithGithub.map(c => c.userAddress);
  }

  // If we have additional user addresses from challenge search, include them
  if (additionalUserAddresses.length > 0) {
    const challengeBasedCondition = inArray(users.userAddress, additionalUserAddresses);
    whereCondition = whereCondition ? or(whereCondition, challengeBasedCondition) : challengeBasedCondition;
  }

  const [usersData, totalCount] = await Promise.all([
    db.query.users.findMany({
      where: whereCondition,
      limit,
      offset,
      orderBy: desc(users.createdAt),
    }),
    db.$count(users, whereCondition),
  ]);

  // Enhance users data with GitHub usernames from challenges if not set
  const enhancedUsersData = await Promise.all(
    usersData.map(async user => {
      if (!user.socialGithub) {
        const githubFromChallenges = await getGithubUsernameFromChallenges(user.userAddress);
        if (githubFromChallenges) {
          return {
            ...user,
            socialGithub: githubFromChallenges,
          };
        }
      }
      return user;
    }),
  );

  return {
    users: enhancedUsersData,
    totalCount,
  };
}

export async function backfillGithubUsernames(): Promise<{ updated: number; errors: number }> {
  let updated = 0;
  let errors = 0;

  try {
    // Get all users who don't have socialGithub set
    const usersWithoutGithub = await db.query.users.findMany({
      where: isNull(users.socialGithub),
      columns: {
        userAddress: true,
      },
    });

    for (const user of usersWithoutGithub) {
      try {
        const githubUsername = await getGithubUsernameFromChallenges(user.userAddress);
        if (githubUsername) {
          await updateUserSocials(user.userAddress, { socialGithub: githubUsername });
          updated++;
        }
      } catch (error) {
        console.error(`Failed to update GitHub for user ${user.userAddress}:`, error);
        errors++;
      }
    }

    return { updated, errors };
  } catch (error) {
    console.error("Error in backfillGithubUsernames:", error);
    throw error;
  }
}
