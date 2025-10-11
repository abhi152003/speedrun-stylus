"use client";

import { useRef } from "react";
import { SubmitFoundationModal } from "./SubmitFoundationModal";
import { useAccount } from "wagmi";
import { useUser } from "~~/hooks/useUser";

export const SubmitFoundationButton = () => {
  const submitModalRef = useRef<HTMLDialogElement>(null);
  const { address: connectedAddress } = useAccount();
  const { data: user, isLoading: isLoadingUser } = useUser(connectedAddress);

  const handleSubmitClick = () => {
    submitModalRef.current?.showModal();
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
