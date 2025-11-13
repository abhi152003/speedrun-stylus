import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "~~/services/database/config/mongoClient";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { githubRepo, githubUsername, deployedUrl, contractAddress } = body;

    // Validate required fields
    if (!githubRepo || !contractAddress) {
      return NextResponse.json({ error: "GitHub repository and contract address are required" }, { status: 400 });
    }

    // Validate GitHub repo format
    const githubRegex = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/;
    if (!githubRegex.test(githubRepo)) {
      return NextResponse.json({ error: "Invalid GitHub repository format" }, { status: 400 });
    }

    // Validate contract address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(contractAddress)) {
      return NextResponse.json({ error: "Invalid contract address format" }, { status: 400 });
    }

    // Get user's wallet address from headers or session
    const walletAddress = request.headers.get("x-wallet-address");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address not found. Please connect your wallet." }, { status: 401 });
    }

    // Verify GitHub repository exists using OAuth app authentication to avoid rate limiting
    // Using client_id:client_secret gives 5,000 requests/hour vs 60/hour for unauthenticated
    // Reference: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
    try {
      const githubHeaders: HeadersInit = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      };

      // Use OAuth app credentials for authentication (same as other challenges)
      // This provides 5,000 requests/hour rate limit
      if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        const basicAuth = Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString(
          "base64",
        );
        githubHeaders["Authorization"] = `Basic ${basicAuth}`;
      }

      const githubCheckResponse = await fetch(`https://api.github.com/repos/${githubRepo}`, {
        headers: githubHeaders,
      });

      if (!githubCheckResponse.ok) {
        if (githubCheckResponse.status === 404) {
          return NextResponse.json(
            { error: "GitHub repository not found. Please verify the repository exists and is public." },
            { status: 400 },
          );
        }
        // If rate limited or other error, log but continue (don't block submission)
        console.warn(`GitHub API check failed for ${githubRepo}:`, githubCheckResponse.status);
      }
    } catch (githubError) {
      // Log error but don't block submission if GitHub API is down
      console.error("GitHub verification error:", githubError);
    }

    // Connect to MongoDB
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");

    // Check if user already submitted
    const existingSubmission = await collection.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    const submissionData = {
      walletAddress: walletAddress.toLowerCase(),
      githubRepo,
      githubUsername: githubUsername || null,
      deployedUrl: deployedUrl || null,
      contractAddress: contractAddress.toLowerCase(),
      submittedAt: new Date(),
      updatedAt: new Date(),
      status: "submitted",
    };

    if (existingSubmission) {
      // Update existing submission
      await collection.updateOne(
        { walletAddress: walletAddress.toLowerCase() },
        {
          $set: {
            ...submissionData,
            createdAt: existingSubmission.createdAt, // Preserve original creation date
          },
        },
      );
    } else {
      // Create new submission
      await collection.insertOne({
        ...submissionData,
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: existingSubmission
          ? "Foundation Challenge submission updated successfully!"
          : "Foundation Challenge submitted successfully!",
        data: submissionData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error submitting Foundation Challenge:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// GET endpoint to retrieve user's submission
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address not found" }, { status: 401 });
    }

    const db = await getMongoDb();
    const collection = db.collection("foundation-users");

    const submission = await collection.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    return NextResponse.json(
      {
        success: true,
        data: submission,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching Foundation Challenge submission:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
