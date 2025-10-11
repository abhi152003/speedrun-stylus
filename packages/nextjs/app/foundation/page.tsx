import TelegramButton from "../_components/TelegramButton";
import { SubmitFoundationButton } from "./_components/SubmitFoundationButton";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { fetchGithubReadme, parseGithubUrl } from "~~/services/github";

// No caching - always fetch fresh content
export const revalidate = 0;

export const metadata = {
  title: "Foundation Challenge - ERC20 Token",
  description: "Complete the Foundation Challenge to earn your NFT certificate",
};

export default async function FoundationPage() {
  // GitHub repo info: abhi152003/speedrun_stylus branch: erc20
  const githubString = "abhi152003/speedrun_stylus:erc20";

  let challengeReadme = "";
  let owner = "";
  let repo = "";
  let branch = "";

  try {
    challengeReadme = await fetchGithubReadme(githubString);
    const githubInfo = parseGithubUrl(githubString);
    owner = githubInfo.owner;
    repo = githubInfo.repo;
    branch = githubInfo.branch;
  } catch (error) {
    console.error("Failed to fetch challenge README:", error);
  }

  return (
    <div className="flex flex-col items-center py-8 px-5 xl:p-12 relative max-w-[100vw]">
      {/* Hero Section */}
      <div className="w-full max-w-[850px] mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">🏆 Foundation Challenge</h1>
        <p className="text-lg mb-6">
          Complete this challenge to earn your <span className="font-bold text-primary">NFT Certificate</span>!
        </p>
        <div className="alert alert-info mb-6">
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
            This is the <strong>Foundation Challenge</strong> - Build a complete ERC20 token system and mint your
            achievement certificate!
          </span>
        </div>
      </div>

      {/* Challenge Content */}
      {challengeReadme ? (
        <>
          <div className="prose dark:prose-invert max-w-fit break-words lg:max-w-[850px]">
            <MDXRemote
              source={challengeReadme}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeRaw],
                  remarkPlugins: [remarkGfm],
                  format: "md",
                },
              }}
            />
          </div>
          <a
            href={`https://github.com/${owner}/${repo}/tree/${branch}`}
            className="block mt-6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn btn-outline btn-sm sm:btn-md">
              <span className="text-xs sm:text-sm">View on GitHub</span>
              <ArrowTopRightOnSquareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </a>
        </>
      ) : (
        <div className="alert alert-error">
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
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Failed to load challenge content. Please try refreshing the page.</span>
        </div>
      )}

      {/* Fixed Submit Button at Bottom Center */}
      <div className="fixed bottom-8 inset-x-0 mx-auto w-fit z-10">
        <SubmitFoundationButton />
      </div>

      {/* Telegram Support Button */}
      <div className="fixed bottom-5 left-5">
        <TelegramButton channelLink="https://t.me/+G55xO-18czg5NDA1" label="Need help? Join Telegram" />
      </div>
    </div>
  );
}
