"use client";

import { forwardRef, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

type SubmitFoundationModalProps = {
  closeModal: () => void;
};

export const SubmitFoundationModal = forwardRef<HTMLDialogElement, SubmitFoundationModalProps>(
  ({ closeModal }, ref) => {
    const { address: connectedAddress } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [githubUsername, setGithubUsername] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      githubRepo: "",
      deployedUrl: "",
      contractAddress: "",
    });
    const [errors, setErrors] = useState({
      githubRepo: "",
      contractAddress: "",
    });

    // Get GitHub username from auth status (same as other challenges)
    useEffect(() => {
      const fetchGithubUsername = async () => {
        try {
          const response = await fetch("/api/auth/github/status");
          const data = await response.json();
          if (data.authenticated && data.username) {
            setGithubUsername(data.username);
          }
        } catch (error) {
          console.error("Failed to fetch GitHub username:", error);
        }
      };

      fetchGithubUsername();
    }, []);

    const validateGithubRepo = (repo: string): boolean => {
      // Format: owner/repo or full GitHub URL
      const githubRegex = /^(?:https?:\/\/github\.com\/)?([a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+)(?:\/.*)?$/;
      return githubRegex.test(repo.trim());
    };

    const validateContractAddress = (address: string): boolean => {
      // Ethereum address: 0x followed by 40 hexadecimal characters
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      return addressRegex.test(address.trim());
    };

    const validateForm = (): boolean => {
      const newErrors = {
        githubRepo: "",
        contractAddress: "",
      };

      if (!formData.githubRepo.trim()) {
        newErrors.githubRepo = "GitHub repository is required";
      } else if (!validateGithubRepo(formData.githubRepo)) {
        newErrors.githubRepo = "Invalid GitHub repository format (e.g., username/repo)";
      }

      if (!formData.contractAddress.trim()) {
        newErrors.contractAddress = "Contract address is required";
      } else if (!validateContractAddress(formData.contractAddress)) {
        newErrors.contractAddress = "Invalid contract address (must be 42 characters starting with 0x)";
      }

      setErrors(newErrors);
      return !newErrors.githubRepo && !newErrors.contractAddress;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // Extract repository path
        const githubRepoMatch = formData.githubRepo.match(
          /^(?:https?:\/\/github\.com\/)?([a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+)/,
        );
        const repoPath = githubRepoMatch ? githubRepoMatch[1] : formData.githubRepo;

        // Submit to MongoDB via API (repository verification will be done server-side with authentication)
        const response = await fetch("/api/foundation/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-wallet-address": connectedAddress || "",
          },
          body: JSON.stringify({
            githubRepo: repoPath,
            githubUsername: githubUsername,
            deployedUrl: formData.deployedUrl.trim() || undefined,
            contractAddress: formData.contractAddress.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit challenge");
        }

        notification.success("Foundation Challenge submitted successfully! 🎉");

        // Reset form
        setFormData({
          githubRepo: "",
          deployedUrl: "",
          contractAddress: "",
        });
        setErrors({
          githubRepo: "",
          contractAddress: "",
        });

        closeModal();
      } catch (error: any) {
        console.error("Error submitting challenge:", error);
        notification.error(error.message || "Failed to submit challenge. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    };

    return (
      <dialog id="foundation-submit-modal" className="modal" ref={ref}>
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
              ✕
            </button>
          </form>

          <h3 className="font-bold text-2xl mb-4">🏆 Submit Foundation Challenge</h3>
          <p className="text-sm opacity-70 mb-2">
            Complete all required fields to submit your Foundation Challenge and earn your NFT certificate!
          </p>
          {githubUsername && (
            <div className="alert alert-success mb-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Authenticated as <strong>@{githubUsername}</strong>
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub Repository */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  GitHub Repository <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="username/repository or https://github.com/username/repository"
                className={`input input-bordered w-full ${errors.githubRepo ? "input-error" : ""}`}
                value={formData.githubRepo}
                onChange={e => handleInputChange("githubRepo", e.target.value)}
                disabled={isLoading}
              />
              {errors.githubRepo && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.githubRepo}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt">Format: username/repo or full GitHub URL</span>
              </label>
            </div>

            {/* Deployed URL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Deployed URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://your-app.vercel.app"
                className="input input-bordered w-full"
                value={formData.deployedUrl}
                onChange={e => handleInputChange("deployedUrl", e.target.value)}
                disabled={isLoading}
              />
              <label className="label">
                <span className="label-text-alt">Your deployed frontend application URL</span>
              </label>
            </div>

            {/* Contract Address */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Deployed Contract Address <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                className={`input input-bordered w-full font-mono ${errors.contractAddress ? "input-error" : ""}`}
                value={formData.contractAddress}
                onChange={e => handleInputChange("contractAddress", e.target.value)}
                disabled={isLoading}
              />
              {errors.contractAddress && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.contractAddress}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt">Your ERC20 contract address on Arbitrum Sepolia</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Challenge"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    );
  },
);

SubmitFoundationModal.displayName = "SubmitFoundationModal";
