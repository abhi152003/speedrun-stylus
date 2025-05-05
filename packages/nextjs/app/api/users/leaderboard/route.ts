import { NextResponse } from "next/server";
import { getLeaderboard } from "~~/services/api/users/leaderboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboardData = await getLeaderboard();
    return NextResponse.json({ leaderboardData });
  } catch (error) {
    console.error("Error in leaderboard API route:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}
