"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChallengeStatus } from "./ChallengeStatus";
import { useAccount } from "wagmi";
import { DateWithTooltip } from "~~/components/DateWithTooltip";
import { ReviewAction } from "~~/services/database/config/types";
import { UserChallenges } from "~~/services/database/repositories/userChallenges";

// API base URL - read from environment variable or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_CODE_REVIEW_API_URL || "http://localhost:8000";
const API_UPDATE_ENDPOINT = "/api/user-challenges/update-score";

// Status check interval in milliseconds
const STATUS_CHECK_INTERVAL = 10000; // 10 seconds

// Local storage key prefix for processing state
const STORAGE_PREFIX = "score_processing_";

const ChallengeRow = ({ challenge, isOwnProfile }: { challenge: UserChallenges[number]; isOwnProfile: boolean }) => {
  const isDisabled = challenge.challenge.disabled;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(() => {
    // Try to restore processing status from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(`${STORAGE_PREFIX}${challenge.challengeId}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Only restore if the saved state is less than 24 hours old
          const now = new Date().getTime();
          if (now - parsedState.timestamp < 24 * 60 * 60 * 1000) {
            return parsedState.status;
          }
        } catch (e) {
          console.error("Error parsing saved processing state:", e);
        }
      }
    }
    return "idle";
  });

  const [processingId, setProcessingId] = useState<string | null>(() => {
    // Try to restore processing ID from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(`${STORAGE_PREFIX}${challenge.challengeId}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          return parsedState.processingId || null;
        } catch (e) {
          console.error("Error parsing saved processing ID:", e);
        }
      }
    }
    return null;
  });

  const [, setReviewResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(() => {
    // Try to restore elapsed time from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(`${STORAGE_PREFIX}${challenge.challengeId}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          const now = new Date().getTime();
          const startTime = parsedState.startTime || parsedState.timestamp;
          return Math.floor((now - startTime) / 1000);
        } catch (e) {
          console.error("Error parsing saved elapsed time:", e);
        }
      }
    }
    return 0;
  });

  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(() => {
    // Try to restore estimated time from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(`${STORAGE_PREFIX}${challenge.challengeId}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          return parsedState.estimatedTimeRemaining || null;
        } catch (e) {
          console.error("Error parsing saved estimated time:", e);
        }
      }
    }
    return null;
  });

  const [localChallengeData, setLocalChallengeData] = useState<UserChallenges[number]>({ ...challenge });
  const MAX_CHARS = 1000;

  const hasRepoUrl = !!challenge.githubRepoUrl;
  const canSubmitForReview = hasRepoUrl && !isDisabled && isOwnProfile;
  const modalRef = useRef<HTMLDivElement>(null);

  // Save processing state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && processingStatus !== "idle") {
      const storageData = {
        status: processingStatus,
        processingId,
        timestamp: new Date().getTime(),
        startTime: new Date().getTime() - elapsedTime * 1000,
        estimatedTimeRemaining,
      };
      localStorage.setItem(`${STORAGE_PREFIX}${challenge.challengeId}`, JSON.stringify(storageData));
    }
  }, [processingStatus, processingId, elapsedTime, estimatedTimeRemaining, challenge.challengeId]);

  // Clean up localStorage when processing is done
  useEffect(() => {
    if (typeof window !== "undefined" && (processingStatus === "completed" || processingStatus === "failed")) {
      // Wait a bit before clearing so the user can see the final state
      const timer = setTimeout(() => {
        localStorage.removeItem(`${STORAGE_PREFIX}${challenge.challengeId}`);
      }, 60000); // 1 minute delay

      return () => clearTimeout(timer);
    }
  }, [processingStatus, challenge.challengeId]);

  // Timer effect for tracking elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (processingStatus === "processing") {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processingStatus]);

  // Status checking effect
  useEffect(() => {
    let statusCheckInterval: NodeJS.Timeout | null = null;

    const checkProcessingStatus = async () => {
      if (!processingId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/processing-status/${processingId}`);

        if (!response.ok) {
          throw new Error("Failed to check processing status");
        }

        const data = await response.json();

        if (data.status === "completed") {
          setProcessingStatus("completed");
          setReviewResult({
            success: true,
            message: data.result?.answer || "Review completed successfully",
          });

          // Save score to database if found
          if (data.result?.score) {
            const saveScoreToDatabase = async (score: number) => {
              try {
                const response = await fetch(API_UPDATE_ENDPOINT, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    challengeId: localChallengeData.challengeId,
                    userAddress: localChallengeData.userAddress,
                    score,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to update score");
                }

                return true;
              } catch (error) {
                console.error("Error saving score:", error);
                return false;
              }
            };

            const saveResult = await saveScoreToDatabase(data.result.score);
            if (saveResult) {
              // Update local state to show the score immediately
              setLocalChallengeData(prev => ({
                ...prev,
                score: data.result.score,
              }));
            }
          }

          // Clear interval
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
          }
        } else if (data.status === "failed") {
          setProcessingStatus("failed");
          setReviewResult({
            success: false,
            message: data.error || "Review processing failed",
          });

          // Clear interval
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
          }
        } else if (data.status === "processing") {
          // Update estimated time remaining if provided
          if (data.estimatedTimeRemaining) {
            setEstimatedTimeRemaining(data.estimatedTimeRemaining);
          }
        }
      } catch (error) {
        console.error("Error checking processing status:", error);
      }
    };

    if (processingStatus === "processing" && processingId) {
      // Initial check
      checkProcessingStatus();

      // Set up interval
      statusCheckInterval = setInterval(checkProcessingStatus, STATUS_CHECK_INTERVAL);
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [processingStatus, processingId, localChallengeData.challengeId, localChallengeData.userAddress]);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModalOpen = () => {
    if (!canSubmitForReview) return;
    setIsModalOpen(true);
    setDescription("");
    setCharCount(0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setDescription(value);
      setCharCount(value.length);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmitForReview = async () => {
    if (!localChallengeData.githubRepoUrl || description.trim().length === 0) return;

    setIsSubmitting(true);
    setReviewResult(null);
    setProcessingStatus("submitted");
    setIsModalOpen(false); // Close modal immediately

    try {
      // Determine folders array based on challenge sort order
      let folderArray: string[] = ["packages/nextjs/app/debug"];

      switch (localChallengeData.challenge.sortOrder) {
        case 0: // Counter
          folderArray = ["packages/nextjs/app/debug", "packages/stylus-demo/src"];
          break;
        case 1: // NFT
          folderArray = ["packages/nextjs/app/debug", "packages/cargo-stylus/nft/src"];
          break;
        case 2: // Vending Machine
          folderArray = ["packages/nextjs/app/debug", "packages/cargo-stylus/vending_machine/src"];
          break;
        case 3: // Multisig Wallet
          folderArray = ["packages/nextjs/app/debug", "packages/cargo-stylus/multi-sig/src"];
          break;
        case 4: // Uniswap V2
          folderArray = ["packages/nextjs/app/debug", "packages/cargo-stylus/stylus-uniswap-v2/src"];
          break;
        case 5: // ZKP - Age Verifier
          folderArray = ["packages/nextjs/app/ageVerifier", "packages/cargo-stylus/contracts"];
          break;
        case 6: // ZKP - Balance Checker
          folderArray = ["packages/nextjs/app/balanceChecker", "packages/cargo-stylus/contracts"];
          break;
        case 7: // ZKP - Password Verifier
          folderArray = ["packages/nextjs/app/passwordVerifier", "packages/cargo-stylus/contracts"];
          break;
        case 8: // ZKP - Location Verifier
          folderArray = ["packages/nextjs/app/locationVerifier", "packages/cargo-stylus/contracts"];
          break;
        case 9: // ZKP - Model Verifier
          folderArray = ["packages/nextjs/app/modelVerifier", "packages/cargo-stylus/contracts"];
          break;
        case 10: // ZKP - Anon Aadhaar
          folderArray = ["packages/nextjs/app/anon-aadhaar", "packages/cargo-stylus/contracts"];
          break;
        default:
          folderArray = ["packages/nextjs/app/debug"];
          break;
      }

      // Submit task for background processing
      const response = await fetch(`${API_BASE_URL}/begin-processing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo_url: localChallengeData.githubRepoUrl,
          description: description,
          challenge_name: localChallengeData.challenge.challengeName,
          folders: folderArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit for processing");
      }

      const data = await response.json();
      setProcessingId(data.processing_id);
      setProcessingStatus("processing");

      // Set initial estimated time
      if (data.estimatedTimeRemaining) {
        setEstimatedTimeRemaining(data.estimatedTimeRemaining);
      } else {
        // Default estimate if not provided
        setEstimatedTimeRemaining(600); // 10 minutes
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting for review:", error);
      setReviewResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit for review",
      });
      setProcessingStatus("failed");
      setIsSubmitting(false);
    }
  };

  // Calculate progress percentage for the progress bar
  const calculateProgress = () => {
    if (!estimatedTimeRemaining) return 0;
    const totalTime = estimatedTimeRemaining;
    const progress = Math.min(100, (elapsedTime / totalTime) * 100);
    return progress;
  };

  const renderScoreColumn = () => {
    if (localChallengeData.score) {
      return (
        <div className="inline-flex items-center justify-center font-bold rounded-lg px-3 py-1.5 text-sm text-white bg-teal-600">
          {localChallengeData.score}/100
        </div>
      );
    }

    if (processingStatus === "processing") {
      return (
        <div className="flex flex-col w-full items-center gap-1">
          <div className="w-32 bg-base-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="text-xs font-medium text-base-content/80">
            {formatTime(elapsedTime)} / ~{formatTime(estimatedTimeRemaining || 0)}
          </div>
          <div className="text-xs text-base-content/60">Processing...</div>
        </div>
      );
    }

    if (processingStatus === "completed") {
      return (
        <div className="inline-flex items-center justify-center text-success font-medium rounded-lg px-3 py-1.5 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Processed
        </div>
      );
    }

    if (processingStatus === "failed") {
      return (
        <div className="inline-flex items-center justify-center text-error font-medium rounded-lg px-3 py-1.5 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        </div>
      );
    }

    // Only show Review button if it's the user's own profile
    if (isOwnProfile) {
      return (
        <div className="group relative inline-block">
          <button
            onClick={handleModalOpen}
            disabled={!canSubmitForReview || isSubmitting}
            className={`text-sm font-semibold rounded-lg px-3 py-1.5 text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm ${
              isSubmitting ? "opacity-70" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="loading loading-spinner loading-xs mr-1"></span> Submitting...
              </span>
            ) : (
              "Review"
            )}
          </button>
          <div className="invisible group-hover:visible absolute right-full mr-2 top-1/2 -translate-y-1/2 w-48 p-1 bg-base-100 dark:bg-base-300 shadow-md rounded-lg z-50 border border-base-300">
            <div className="text-xs font-medium flex items-start gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="text-warning w-4 h-4 mt-0.5 flex-shrink-0"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Submit your code for review. Ensure it&apos;s ready as you can do it only once!</span>
            </div>
          </div>
        </div>
      );
    }

    // Show "-" for other users' profiles when no score is available
    return <span className="text-base-content/60">-</span>;
  };

  return (
    <>
      <tr key={localChallengeData.challengeId} className={`hover py-4 ${isDisabled ? "opacity-60" : ""}`}>
        <td className="py-6">
          {isDisabled ? (
            <span>{localChallengeData.challenge.challengeName}</span>
          ) : (
            <Link href={`/challenge/${localChallengeData.challengeId}`} className="hover:underline">
              🚩 Challenge {localChallengeData.challenge.sortOrder}: {localChallengeData.challenge.challengeName}
            </Link>
          )}
        </td>
        <td>
          {localChallengeData.githubRepoUrl ? (
            <a href={localChallengeData.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="link">
              Code
            </a>
          ) : (
            "-"
          )}
        </td>
        <td>
          {localChallengeData.frontendUrl ? (
            <a href={localChallengeData.frontendUrl} target="_blank" rel="noopener noreferrer" className="link">
              Demo
            </a>
          ) : (
            "-"
          )}
        </td>
        <td>
          <DateWithTooltip timestamp={localChallengeData.submittedAt} />
        </td>
        <td>
          <ChallengeStatus
            reviewAction={localChallengeData.reviewAction ?? ReviewAction.SUBMITTED}
            comment={localChallengeData.reviewComment}
            score={localChallengeData.score}
          />
        </td>
        <td className="text-center relative">{renderScoreColumn()}</td>
      </tr>

      {/* Description Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={modalRef} className="bg-base-100 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-base-300">
            <h3 className="font-bold text-xl mb-3">Describe Your Solution</h3>
            <div className="alert alert-warning mb-4 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>You can only submit for review once. Make sure your code is ready!</span>
            </div>
            <div className="alert alert-info mb-4 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                This review process may take 10+ minutes to complete. Progress will be shown in the score column.
              </span>
            </div>
            <p className="text-sm mb-5 text-base-content/80">
              Please describe the features you&apos;ve added or improvements you&apos;ve made in this challenge. Be
              specific but brief.
            </p>
            <div className="relative">
              <textarea
                className="w-full min-h-[160px] p-4 bg-base-200/50 rounded-lg border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder="Describe your solution here..."
                value={description}
                onChange={handleDescriptionChange}
                maxLength={MAX_CHARS}
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded-md bg-base-100/80 backdrop-blur-sm">
                <span className={charCount >= MAX_CHARS * 0.9 ? "text-error" : "text-base-content/70"}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn btn-sm btn-outline" onClick={handleModalClose}>
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSubmitForReview}
                disabled={isSubmitting || description.trim().length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="loading loading-spinner loading-xs mr-1"></span> Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const UserChallengesTable = ({ challenges }: { challenges: UserChallenges }) => {
  const { address: connectedAddress } = useAccount();
  const sortedChallenges = challenges.sort((a, b) => a.challenge.sortOrder - b.challenge.sortOrder);

  // Check if the profile being viewed belongs to the connected user
  const isOwnProfile = Boolean(
    connectedAddress &&
      challenges.length > 0 &&
      challenges[0].userAddress.toLowerCase() === connectedAddress?.toLowerCase(),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="table bg-base-100 shadow-lg min-w-full overflow-hidden">
          <thead>
            <tr className="text-sm">
              <th>NAME</th>
              <th>GITHUB REPO</th>
              <th>LIVE DEMO</th>
              <th>UPDATED</th>
              <th>STATUS</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {sortedChallenges.map(challenge => (
              <ChallengeRow key={challenge.challengeId} challenge={challenge} isOwnProfile={isOwnProfile} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
