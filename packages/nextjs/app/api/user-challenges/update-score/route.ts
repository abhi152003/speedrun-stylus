import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "~~/services/database/config/postgresClient";
import { userChallenges } from "~~/services/database/config/schema";

type UpdateScorePayload = {
  userAddress: string;
  challengeId: string;
  score: number;
};

export async function POST(req: Request) {
  try {
    const { userAddress, challengeId, score } = (await req.json()) as UpdateScorePayload;

    if (!userAddress || !challengeId || score === undefined) {
      return NextResponse.json({ error: "Missing required fields (userAddress, challengeId, score)" }, { status: 400 });
    }

    // Validate score is a number between 0-100
    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json({ error: "Score must be a number between 0 and 100" }, { status: 400 });
    }

    // Find and update the challenge
    const result = await db
      .update(userChallenges)
      .set({
        score: score,
      })
      .where(and(eq(userChallenges.userAddress, userAddress), eq(userChallenges.challengeId, challengeId)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "User challenge not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updatedChallenge: result[0],
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
