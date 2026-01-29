import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FoundationSubmission } from "~~/services/database/repositories/foundationUsers";

type FoundationSubmissionCardProps = {
  submission: FoundationSubmission;
};

export const FoundationSubmissionCard = ({ submission }: FoundationSubmissionCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mb-6 border-2 border-primary/30 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">🏆</div>
        <div>
          <h3 className="text-2xl font-bold text-primary">Foundation Challenge Completed</h3>
          <p className="text-sm text-base-content/70">ERC20 Token Implementation Certificate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* GitHub Repository */}
        <div className="bg-base-100 rounded-lg p-4">
          <div className="text-xs font-semibold text-base-content/60 mb-2">GitHub Repository</div>
          <a
            href={`https://github.com/${submission.githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline break-all"
          >
            <span className="font-mono text-sm">{submission.githubRepo}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>

        {/* Contract Address */}
        <div className="bg-base-100 rounded-lg p-4">
          <div className="text-xs font-semibold text-base-content/60 mb-2">Contract Address</div>
          <a
            href={`https://sepolia.arbiscan.io/address/${submission.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline break-all"
          >
            <span className="font-mono text-sm">
              {submission.contractAddress.slice(0, 6)}...{submission.contractAddress.slice(-4)}
            </span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>

        {/* Deployed URL (if available) */}
        {submission.deployedUrl && (
          <div className="bg-base-100 rounded-lg p-4">
            <div className="text-xs font-semibold text-base-content/60 mb-2">Deployed Application</div>
            <a
              href={submission.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline break-all"
            >
              <span className="text-sm">{submission.deployedUrl}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        )}

        {/* Submission Date */}
        <div className="bg-base-100 rounded-lg p-4">
          <div className="text-xs font-semibold text-base-content/60 mb-2">Completed On</div>
          <div className="text-sm text-base-content">{formatDate(submission.submittedAt)}</div>
        </div>
      </div>
    </div>
  );
};
