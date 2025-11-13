import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  console.log("process.env.GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
  console.log("process.env.GITHUB_CLIENT_SECRET", process.env.GITHUB_CLIENT_SECRET);
  console.log("process.env.NEXT_PUBLIC_HOST", process.env.NEXT_PUBLIC_HOST);
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/error?message=No code provided`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/error?message=Failed to get access token`);
    }

    // Get user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Store GitHub info in a cookie or session
    cookies().set("github_username", userData.login, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect back to the challenge page
    const challengeId = url.searchParams.get("challenge_id");

    // Handle Foundation challenge redirect differently
    if (challengeId === "erc20-foundation") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/foundation`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/challenge/${challengeId}`);
  } catch (error) {
    console.error("GitHub auth error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/error?message=Authentication failed`);
  }
}
