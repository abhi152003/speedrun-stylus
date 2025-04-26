import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const githubUsername = cookies().get("github_username")?.value;

  return NextResponse.json({
    authenticated: !!githubUsername,
    username: githubUsername || null,
  });
}
