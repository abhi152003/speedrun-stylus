const GITHUB_RAW_BASE_URL = "https://raw.githubusercontent.com";

type GithubRepoInfo = {
  owner: string;
  repo: string;
  branch: string;
};

export function parseGithubUrl(githubString: string): GithubRepoInfo {
  const [repoPath, branch] = githubString.split(":");
  const [owner, repo] = repoPath.split("/");

  return {
    owner,
    repo,
    branch,
  };
}

export async function fetchGithubReadme(githubString: string): Promise<string> {
  const { owner, repo, branch } = parseGithubUrl(githubString);

  // Add cache-busting parameter and proper cache headers
  const cacheBuster = Date.now();
  const readmeUrl = `${GITHUB_RAW_BASE_URL}/${owner}/${repo}/${branch}/README.md?t=${cacheBuster}`;

  const response = await fetch(readmeUrl, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    // Force fresh content, bypass any cache
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.statusText}`);
  }

  return response.text();
}
