// import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const challengeId = url.searchParams.get("challenge_id");
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_HOST}/api/auth/github/callback?challenge_id=${challengeId}`;
  const scope = "read:user";

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  return NextResponse.redirect(githubAuthUrl);
}
