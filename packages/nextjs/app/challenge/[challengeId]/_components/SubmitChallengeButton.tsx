"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitChallengeModal } from "./SubmitChallengeModal";
import { useAccount } from "wagmi";
import { useUser } from "~~/hooks/useUser";

export const SubmitChallengeButton = ({ challengeId }: { challengeId: string }) => {
  const submitChallengeModalRef = useRef<HTMLDialogElement>(null);
  const { address: connectedAddress } = useAccount();
  const { data: user, isLoading: isLoadingUser } = useUser(connectedAddress);
  const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);

  // Check if user is authenticated with GitHub
  useEffect(() => {
    const checkGithubAuth = async () => {
      try {
        const response = await fetch("/api/auth/github/status");
        const data = await response.json();
        console.log("data", data);
        setIsGithubAuthenticated(data.authenticated);
      } catch (error) {
        console.error("Failed to check GitHub auth status:", error);
        setIsGithubAuthenticated(false);
      }
    };

    if (user) {
      checkGithubAuth();
    }
  }, [user]);

  const handleSubmitClick = () => {
    if (isGithubAuthenticated) {
      // If already authenticated, show the modal
      submitChallengeModalRef.current?.showModal();
    } else {
      // If not authenticated, redirect to GitHub auth
      window.location.href = `/api/auth/github?challenge_id=${challengeId}`;
    }
  };

  return (
    <>
      <button
        className="btn btn-sm sm:btn-md btn-primary text-secondary px-3 sm:px-4 mt-2 fixed bottom-8 inset-x-0 mx-auto w-fit text-xs sm:text-sm"
        disabled={!user || isLoadingUser}
        onClick={handleSubmitClick}
      >
        Submit challenge
      </button>
      <SubmitChallengeModal
        challengeId={challengeId}
        ref={submitChallengeModalRef}
        closeModal={() => submitChallengeModalRef.current?.close()}
      />
    </>
  );
};
