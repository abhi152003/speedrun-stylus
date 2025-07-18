import { forwardRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { InputBase } from "~~/components/scaffold-eth";
import { useSubmitChallenge } from "~~/hooks/useSubmitChallenge";

type SubmitChallengeModalProps = {
  challengeId: string;
  closeModal: () => void;
};

export const SubmitChallengeModal = forwardRef<HTMLDialogElement, SubmitChallengeModalProps>(
  ({ closeModal, challengeId }, ref) => {
    const [frontendUrl, setFrontendUrl] = useState("");
    const [githubRepoUrl, setGithubRepoUrl] = useState("");
    const [deployedContractAddress, setDeployedContractAddress] = useState("");
    const [timeDifference, setTimeDifference] = useState("");
    const [gasDifference, setGasDifference] = useState("");

    const { submitChallenge, isPending } = useSubmitChallenge({
      onSuccess: closeModal,
    });

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box flex flex-col space-y-3">
          <form method="dialog" className="bg-secondary -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl m-0">Submit Challenge</p>
            </div>
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost text-xl h-auto">
              ✕
            </button>
          </form>

          <h1 className="text-2xl font-semibold ml-2">{challengeId}</h1>

          <div className="flex flex-col space-y-5">
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-base ml-2">
                <span className="text-sm font-medium mr-2 leading-none">GitHub Repository</span>
                <div className="tooltip" data-tip="Your GitHub repository URL containing the challenge code">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </div>
              </div>
              <InputBase
                placeholder="https://github.com/yourusername/your-repo"
                value={githubRepoUrl}
                onChange={e => setGithubRepoUrl(e)}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-base ml-2">
                <span className="text-sm font-medium mr-2 leading-none">Deployed URL (Optional)</span>
                <div className="tooltip" data-tip="Your deployed challenge URL (e.g., on Vercel)">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </div>
              </div>
              <InputBase
                placeholder="https://your-site.vercel.app"
                value={frontendUrl}
                onChange={e => setFrontendUrl(e)}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-base ml-2">
                <span className="text-sm font-medium mr-2 leading-none">Deployed Contract Address (Optional)</span>
                <div className="tooltip" data-tip="Your deployed contract address on Arbitrum Sepolia">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </div>
              </div>
              <InputBase
                placeholder="0x..."
                value={deployedContractAddress}
                onChange={e => setDeployedContractAddress(e)}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-base ml-2">
                <span className="text-sm font-medium mr-2 leading-none">Performance Improvement (Optional)</span>
                <div
                  className="tooltip"
                  data-tip="Performance improvement percentage you got after running the provided script - latency saving after caching the contract"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </div>
              </div>
              <InputBase placeholder="e.g., 25%" value={timeDifference} onChange={e => setTimeDifference(e)} />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-base ml-2">
                <span className="text-sm font-medium mr-2 leading-none">Gas Savings (Optional)</span>
                <div className="tooltip" data-tip="Gas saving you achieved after caching the contract">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </div>
              </div>
              <InputBase placeholder="e.g., 50000 gas" value={gasDifference} onChange={e => setGasDifference(e)} />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary self-center"
                disabled={!githubRepoUrl || isPending}
                onClick={() =>
                  submitChallenge({
                    challengeId,
                    frontendUrl,
                    githubRepoUrl,
                    deployedContractAddress,
                    timeDifference,
                    gasDifference,
                  })
                }
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Challenge"
                )}
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
        <Toaster />
      </dialog>
    );
  },
);

SubmitChallengeModal.displayName = "SubmitChallengeModal";
