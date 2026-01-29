import { NextRequest, NextResponse } from "next/server";
import { getFoundationSubmissionCount } from "~~/services/database/repositories/foundationUsers";
import {
  getTotalDeployedContractsCount,
  getTotalSubmissionsCount,
} from "~~/services/database/repositories/userChallenges";
import { getAllUsers } from "~~/services/database/repositories/users";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const search = searchParams.get("search") ?? "";

    const offset = (page - 1) * limit;

    const [{ users, totalCount }, totalSubmissions, totalDeployedContracts, foundationCount] = await Promise.all([
      getAllUsers({
        offset,
        limit,
        search,
      }),
      getTotalSubmissionsCount(),
      getTotalDeployedContractsCount(),
      getFoundationSubmissionCount(),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: page > 1,
      },
      stats: {
        totalUsers: totalCount,
        totalSubmissions,
        totalDeployedContracts,
        foundationCount,
      },
    });
  } catch (error) {
    console.error("Error fetching onboarded users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
