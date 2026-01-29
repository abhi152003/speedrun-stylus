import { NextResponse } from "next/server";
import { getFoundationSubmissionCount } from "~~/services/database/repositories/foundationUsers";

export async function GET() {
  try {
    const count = await getFoundationSubmissionCount();

    return NextResponse.json(
      {
        success: true,
        count,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching foundation submission count:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch foundation submission count",
        count: 0,
      },
      { status: 500 },
    );
  }
}
