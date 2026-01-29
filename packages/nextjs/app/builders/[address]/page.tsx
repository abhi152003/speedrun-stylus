import { notFound } from "next/navigation";
import { UpgradedToBGCard } from "./_components/UpgradedToBGCard";
import { UserChallengesTable } from "./_components/UserChallengesTable";
import { UserProfileCard } from "./_components/UserProfileCard";
import { Metadata } from "next";
import { isAddress } from "viem";
import { RouteRefresher } from "~~/components/RouteRefresher";
import { isBgMember } from "~~/services/api-bg/builders";
import {
  getFoundationSubmissionByAddress,
  getFoundationSubmissionByGithubUsername,
} from "~~/services/database/repositories/foundationUsers";
import {
  getLatestSubmissionPerChallengeByGithubId,
  getLatestSubmissionPerChallengeByUser,
  getSubmissionCountForChallengeByAddress,
  getSubmissionCountForChallengeByGithubId,
} from "~~/services/database/repositories/userChallenges";
import { getUserByAddress } from "~~/services/database/repositories/users";
import { getEnsOrAddress } from "~~/utils/ens-or-address";

type Props = {
  params: {
    address: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const address = params.address;
  const isValidAddress = isAddress(address);

  const { ensName, shortAddress } = await getEnsOrAddress(address);

  // Default title and description
  const title = `${ensName || shortAddress} | Speed Run Ethereum`;

  // Base URL - replace with your actual domain in production
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  // OG image URL
  const ogImageUrl = isValidAddress
    ? `${baseUrl}/api/og?address=${address}`
    : `${baseUrl}/api/og?address=0x0000000000000000000000000000000000000000`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    openGraph: {
      title,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `QR Code for ${address}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImageUrl],
    },
  };
}

export default async function BuilderPage({ params }: { params: { address: string } }) {
  const { address: userAddress } = params;
  const user = await getUserByAddress(userAddress);

  if (!user) {
    notFound();
  }

  // Get GitHub username (prioritize socialGithub, fallback to checking challenges)
  let githubUsername: string | null = user.socialGithub;
  if (!githubUsername) {
    // Fallback: get GitHub username from any challenge submission by this address
    const fallbackChallenges = await getLatestSubmissionPerChallengeByUser(userAddress);
    const challengeWithGithub = fallbackChallenges.find(c => c.githubUsername);
    githubUsername = challengeWithGithub?.githubUsername || null;
  }

  // Get challenges by GitHub ID if we have a GitHub username, otherwise use address
  const challenges = githubUsername
    ? await getLatestSubmissionPerChallengeByGithubId(githubUsername)
    : await getLatestSubmissionPerChallengeByUser(userAddress);

  // Get submission counts for each challenge
  const challengesWithCounts = await Promise.all(
    challenges.map(async challenge => {
      const submissionCount = githubUsername
        ? await getSubmissionCountForChallengeByGithubId(githubUsername, challenge.challengeId)
        : await getSubmissionCountForChallengeByAddress(challenge.userAddress, challenge.challengeId);

      return {
        ...challenge,
        submissionCount,
      };
    }),
  );

  const bgMemberExists = await isBgMember(userAddress);

  const foundationSubmission = githubUsername
    ? await getFoundationSubmissionByGithubUsername(githubUsername)
    : await getFoundationSubmissionByAddress(userAddress);

  // Add foundation submission as a special challenge if it exists
  const allChallenges = foundationSubmission
    ? [
        {
          id: 0,
          challengeId: "foundation",
          userAddress: foundationSubmission.walletAddress,
          githubRepoUrl: `https://github.com/${foundationSubmission.githubRepo}`,
          frontendUrl: foundationSubmission.deployedUrl || null,
          contractUrl: `https://sepolia.arbiscan.io/address/${foundationSubmission.contractAddress}`,
          deployedContractAddress: foundationSubmission.contractAddress,
          submittedAt: foundationSubmission.submittedAt,
          githubUsername: foundationSubmission.githubUsername || null,
          reviewAction: null,
          reviewComment: null,
          score: null,
          timeDifference: null,
          gasDifference: null,
          signature: null,
          challenge: {
            id: "foundation",
            challengeId: "foundation",
            challengeName: "Foundation - ERC20 Token",
            sortOrder: -1,
            disabled: false,
            description: "Complete the Foundation ERC20 Token challenge",
            previewImage: null,
            externalLink: null,
            isActive: true,
            createdAt: new Date(),
          },
          submissionCount: 1,
        },
        ...challengesWithCounts,
      ]
    : challengesWithCounts;

  return (
    <>
      <RouteRefresher />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <UserProfileCard user={user} address={userAddress} />
          </div>
          <div className="lg:col-span-4">
            {bgMemberExists && <UpgradedToBGCard user={user} />}
            <h2 className="text-2xl font-bold mb-0 text-neutral pb-4">Challenges</h2>
            {allChallenges.length > 0 ? (
              <UserChallengesTable
                challenges={allChallenges}
                currentUserAddress={userAddress}
                isGithubView={!!githubUsername}
              />
            ) : (
              <div className="bg-base-100 p-8 text-center rounded-lg text-neutral">
                This builder hasn&apos;t completed any challenges.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
