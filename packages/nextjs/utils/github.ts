/**
 * Parses a GitHub repository URL to extract the owner.
 * @param url The GitHub repository URL (e.g., https://github.com/owner/repo).
 * @returns The repository owner's username or null if the URL is invalid.
 */
export function getRepoOwnerFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url);
    // Ensure it's a github.com URL
    if (urlObject.hostname !== "github.com") {
      return null;
    }

    const pathParts = urlObject.pathname.split("/").filter(Boolean);

    // Basic validation: requires at least /owner/repo
    if (pathParts.length < 2) {
      return null;
    }

    // Owner is the first part of the path
    return pathParts[0];
  } catch (error) {
    // Handle invalid URLs
    console.error("Error parsing GitHub URL:", error);
    return null;
  }
}
