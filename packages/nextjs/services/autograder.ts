export type AutogradingResult = {
  success: boolean;
  feedback: string;
};

export async function submitToAutograder({
  challengeId,
  githubRepoUrl,
}: {
  challengeId: number;
  githubRepoUrl: string;
}): Promise<AutogradingResult> {
  console.log(`Submitting to autograder for challenge ${challengeId} with repo URL: ${githubRepoUrl}`);
  const githubUrlObject = new URL(githubRepoUrl);
  const path = githubUrlObject.pathname.split("/").filter(Boolean);

  if (path.length < 2) {
    return {
      success: false,
      feedback: "Invalid GitHub repository URL format",
    };
  }

  const owner = path[0];
  const repo = path[1];

  try {
    const verifyResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        // Add GitHub token if needed for rate limiting
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      },
    });

    if (!verifyResponse.ok) {
      return {
        success: false,
        feedback: "GitHub repository does not exist or is not accessible",
      };
    }
    return {
      success: true,
      feedback: "GitHub repository verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      feedback: `Error verifying GitHub repository: ${error}`,
    };
  }
}
