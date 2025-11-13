"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitFoundationModal } from "./SubmitFoundationModal";
import { useAccount } from "wagmi";
import { useUser } from "~~/hooks/useUser";

export const SubmitFoundationButton = () => {
  const submitModalRef = useRef<HTMLDialogElement>(null);
  const { address: connectedAddress } = useAccount();
  const { data: user, isLoading: isLoadingUser } = useUser(connectedAddress);
  const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);

  // Check if user is authenticated with GitHub (same as other challenges)
  useEffect(() => {
    const checkGithubAuth = async () => {
      try {
        const response = await fetch("/api/auth/github/status");
        const data = await response.json();
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
      submitModalRef.current?.showModal();
    } else {
      // If not authenticated, redirect to GitHub auth (same flow as other challenges)
      window.location.href = `/api/auth/github?challenge_id=erc20-foundation`;
    }
  };

  return (
    <>
      <button
        className="btn btn-sm sm:btn-md btn-primary text-secondary px-3 sm:px-4 text-xs sm:text-sm"
        disabled={!user || isLoadingUser}
        onClick={handleSubmitClick}
      >
        Submit challenge
      </button>
      <SubmitFoundationModal ref={submitModalRef} closeModal={() => submitModalRef.current?.close()} />
    </>
  );
};
