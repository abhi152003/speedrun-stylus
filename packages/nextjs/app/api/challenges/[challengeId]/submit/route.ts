import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { submitToAutograder } from "~~/services/autograder";
import { ChallengeId, ReviewAction } from "~~/services/database/config/types";
import { getChallengeById } from "~~/services/database/repositories/challenges";
import { createUserChallenge, updateUserChallengeById } from "~~/services/database/repositories/userChallenges";
import { getUserByAddress } from "~~/services/database/repositories/users";
import { isValidEIP712ChallengeSubmitSignature } from "~~/services/eip712/challenge";
import { PlausibleEvent, trackPlausibleEvent } from "~~/services/plausible";
import { getRepoOwnerFromUrl } from "~~/utils/github";

// This function can run for a maximum of 60 seconds in Vercel
export const maxDuration = 60;

export type ChallengeSubmitPayload = {
  userAddress: string;
  frontendUrl?: string;
  githubRepoUrl: string;
  signature: `0x${string}`;
};

export async function POST(req: NextRequest, { params }: { params: { challengeId: ChallengeId } }) {
  try {
    const challengeId = params.challengeId;
    const { userAddress, frontendUrl, githubRepoUrl, signature } = (await req.json()) as ChallengeSubmitPayload;

    if (!userAddress || !githubRepoUrl || !signature) {
      return NextResponse.json(
        { error: "Missing required fields (userAddress, githubRepoUrl, signature)" },
        { status: 400 },
      );
    }

    // Check GitHub authentication
    const githubUsername = cookies().get("github_username")?.value;
    if (!githubUsername) {
      return NextResponse.json({ error: "GitHub authentication required" }, { status: 401 });
    }

    // Verify GitHub repository ownership
    const repoOwner = getRepoOwnerFromUrl(githubRepoUrl);
    if (!repoOwner) {
      return NextResponse.json({ error: "Invalid GitHub repository URL format" }, { status: 400 });
    }

    if (githubUsername.toLowerCase() !== repoOwner.toLowerCase()) {
      return NextResponse.json(
        { error: `Repository owner (${repoOwner}) does not match authenticated GitHub user (${githubUsername})` },
        { status: 403 }, // Forbidden
      );
    }

    const isValidSignature = await isValidEIP712ChallengeSubmitSignature({
      address: userAddress,
      signature,
      challengeId,
      frontendUrl: frontendUrl || "",
      githubRepoUrl,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const user = await getUserByAddress(userAddress);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const challenge = await getChallengeById(challengeId);
    if (!challenge || challenge.disabled) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const submissionResult = await createUserChallenge({
      userAddress,
      challengeId,
      frontendUrl: frontendUrl || null,
      githubRepoUrl,
      signature,
      githubUsername,
      reviewAction: ReviewAction.SUBMITTED,
      reviewComment: "Your submission is being processed by the autograder...",
    });

    // Get the ID of the newly created submission
    const submissionId = submissionResult?.id;
    if (!submissionId) {
      return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
    }

    // Use waitUntil for background processing
    waitUntil(
      (async () => {
        try {
          await trackPlausibleEvent(PlausibleEvent.CHALLENGE_SUBMISSION, { challengeId }, req);
          const autoGraderChallengeId = challenge.sortOrder;

          const gradingResult = await submitToAutograder({
            challengeId: autoGraderChallengeId,
            githubRepoUrl: githubRepoUrl,
          });

          // Update the existing submission with the grading result
          const updateResult = await updateUserChallengeById(submissionId, {
            reviewAction: gradingResult.success ? ReviewAction.ACCEPTED : ReviewAction.REJECTED,
            reviewComment: gradingResult.feedback,
          });

          // // Update the existing submission with the grading result
          // const updateResult = await updateUserChallengeById(submissionId, {
          //   reviewAction: ReviewAction.ACCEPTED,
          //   reviewComment: "Your submission was accepted.",
          // });

          // Check if the update was successful
          if (!updateResult) {
            return NextResponse.json({ error: "Failed to update submission with grading result" }, { status: 500 });
          }

          console.log(`Background autograding completed for user ${userAddress}, challenge ${challengeId}`);
        } catch (error) {
          console.error("Error in background autograding:", error);
          // Update the existing submission with the grading result
          const updateResult = await updateUserChallengeById(submissionId, {
            reviewAction: ReviewAction.REJECTED,
            reviewComment: "There was an error while grading your submission. Please try again later.",
          });
          if (!updateResult) {
            return NextResponse.json(
              { error: "Failed to update submission with grading result in error" },
              { status: 500 },
            );
          }
        }
      })(),
    );

    // Return response immediately
    return NextResponse.json({
      success: true,
      message: "Challenge submitted successfully. Autograding in progress...",
      status: "SUBMITTED", // Updated to match ReviewAction.SUBMITTED
    });
  } catch (error) {
    console.error("Error submitting challenge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
