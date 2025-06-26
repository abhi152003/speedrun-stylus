import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ChallengeId } from "~~/services/database/config/types";

export async function POST(request: NextRequest, { params }: { params: { challengeId: ChallengeId } }) {
  try {
    const { challengeId } = params;

    // Revalidate the specific challenge page
    revalidatePath(`/challenge/${challengeId}`);

    return NextResponse.json({
      message: "Challenge page revalidated successfully",
      challengeId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating challenge page:", error);
    return NextResponse.json(
      {
        error: "Failed to revalidate challenge page",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
