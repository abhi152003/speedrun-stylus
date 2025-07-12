import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignTypedData } from "wagmi";
import { submitChallenge } from "~~/services/api/challenges";
import { EIP_712_TYPED_DATA__CHALLENGE_SUBMIT } from "~~/services/eip712/challenge";
import { notification } from "~~/utils/scaffold-eth";

type SubmitChallengeParams = {
  challengeId: string;
  frontendUrl?: string;
  githubRepoUrl: string;
};

const VALID_GITHUB_HOSTS = ["github.com"];

// Update validation function
const validateUrls = (params: SubmitChallengeParams) => {
  try {
    // Only validate frontendUrl if it exists
    if (params.frontendUrl) {
      new URL(params.frontendUrl);
      // Potentially add more validation for frontendUrl if needed
    }

    const github = new URL(params.githubRepoUrl);

    if (!VALID_GITHUB_HOSTS.includes(github.host)) {
      throw new Error("Please use a valid GitHub repository URL");
    }

    // Validate the GitHub URL format (should be github.com/username/repo)
    const pathParts = github.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error(
        "Invalid GitHub repository format. Expected: https://github.com/username/repository or https://github.com/username/repository.git",
      );
    }

    return true;
  } catch (e) {
    throw new Error("Please enter valid URLs");
  }
};

export const useSubmitChallenge = ({ onSuccess }: { onSuccess?: () => void }) => {
  const router = useRouter();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const { mutate: submitChallengeMutation, isPending } = useMutation({
    mutationFn: async (submitChallengeParams: SubmitChallengeParams) => {
      if (!address) throw new Error("Wallet not connected");

      validateUrls(submitChallengeParams);

      const message = {
        ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT.message,
        challengeId: submitChallengeParams.challengeId,
        frontendUrl: submitChallengeParams.frontendUrl || "",
        githubRepoUrl: submitChallengeParams.githubRepoUrl,
      };

      const signature = await signTypedDataAsync({
        ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT,
        message,
      });

      return submitChallenge({
        userAddress: address,
        signature,
        challengeId: submitChallengeParams.challengeId,
        githubRepoUrl: submitChallengeParams.githubRepoUrl,
        ...(submitChallengeParams.frontendUrl && { frontendUrl: submitChallengeParams.frontendUrl }),
      });
    },
    onSuccess: () => {
      notification.success("Challenge submitted successfully!");
      router.push(`/builders/${address}`);
      router.refresh();
      onSuccess?.();
    },
    onError: (error: Error) => {
      notification.error(error.message);
    },
  });

  return {
    submitChallenge: submitChallengeMutation,
    isPending,
  };
};
