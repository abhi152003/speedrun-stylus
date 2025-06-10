import { NextResponse } from "next/server";
import { backfillGithubUsernames } from "~~/services/database/repositories/users";

export async function POST() {
  try {
    console.log("Starting GitHub username backfill process...");
    const result = await backfillGithubUsernames();

    console.log(`GitHub backfill completed: ${result.updated} updated, ${result.errors} errors`);

    return NextResponse.json({
      success: true,
      message: `Backfill completed successfully`,
      result,
    });
  } catch (error) {
    console.error("Error in GitHub backfill process:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete GitHub backfill process",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
