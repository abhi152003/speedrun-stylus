import { getMongoDb } from "../config/mongoClient";

export type FoundationSubmission = {
  _id?: string;
  walletAddress: string;
  githubRepo: string;
  githubUsername: string | null;
  deployedUrl: string | null;
  contractAddress: string;
  submittedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  status: string;
};

/**
 * Get the total count of foundation challenge submissions
 */
export async function getFoundationSubmissionCount(): Promise<number> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");
    const count = await collection.countDocuments();
    return count;
  } catch (error) {
    console.error("Error getting foundation submission count:", error);
    return 0;
  }
}

/**
 * Get foundation submission by wallet address
 */
export async function getFoundationSubmissionByAddress(address: string): Promise<FoundationSubmission | null> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");
    const submission = await collection.findOne({
      walletAddress: address.toLowerCase(),
    });

    if (!submission) {
      return null;
    }

    return {
      _id: submission._id?.toString(),
      walletAddress: submission.walletAddress,
      githubRepo: submission.githubRepo,
      githubUsername: submission.githubUsername || null,
      deployedUrl: submission.deployedUrl || null,
      contractAddress: submission.contractAddress,
      submittedAt: submission.submittedAt,
      updatedAt: submission.updatedAt,
      createdAt: submission.createdAt,
      status: submission.status,
    };
  } catch (error) {
    console.error("Error getting foundation submission by address:", error);
    return null;
  }
}

/**
 * Get foundation submission by GitHub username
 */
export async function getFoundationSubmissionByGithubUsername(
  githubUsername: string,
): Promise<FoundationSubmission | null> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");

    const normalizedUsername = githubUsername.toLowerCase();

    let submission = await collection.findOne({
      $expr: {
        $eq: [{ $toLower: "$githubUsername" }, normalizedUsername],
      },
    });

    if (!submission) {
      const allSubmissions = await collection.find({}).toArray();
      const foundSubmission = allSubmissions.find(sub => {
        if (sub.githubRepo) {
          // Extract username from githubRepo (format: "username/repo")
          const repoUsername = sub.githubRepo.split("/")[0]?.toLowerCase();
          return repoUsername === normalizedUsername;
        }
        return false;
      });
      submission = foundSubmission || null;
    }

    if (!submission) {
      return null;
    }

    return {
      _id: submission._id?.toString(),
      walletAddress: submission.walletAddress,
      githubRepo: submission.githubRepo,
      githubUsername: submission.githubUsername || null,
      deployedUrl: submission.deployedUrl || null,
      contractAddress: submission.contractAddress,
      submittedAt: submission.submittedAt,
      updatedAt: submission.updatedAt,
      createdAt: submission.createdAt,
      status: submission.status,
    };
  } catch (error) {
    console.error("Error getting foundation submission by GitHub username:", error);
    return null;
  }
}

/**
 * Check if a wallet address has completed the foundation challenge
 */
export async function hasFoundationCertificate(address: string): Promise<boolean> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");
    const count = await collection.countDocuments({
      walletAddress: address.toLowerCase(),
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking foundation certificate:", error);
    return false;
  }
}

/**
 * Get foundation certificate status for multiple addresses
 */
export async function getFoundationCertificateStatusBatch(addresses: string[]): Promise<Map<string, boolean>> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");

    const normalizedAddresses = addresses.map(addr => addr.toLowerCase());

    const submissions = await collection
      .find({
        walletAddress: { $in: normalizedAddresses },
      })
      .toArray();

    const statusMap = new Map<string, boolean>();

    // Initialize all addresses to false
    for (const addr of normalizedAddresses) {
      statusMap.set(addr, false);
    }

    // Set true for addresses that have submissions
    for (const submission of submissions) {
      statusMap.set(submission.walletAddress, true);
    }

    return statusMap;
  } catch (error) {
    console.error("Error getting foundation certificate batch status:", error);
    return new Map();
  }
}

/**
 * Get all foundation submissions for leaderboard
 */
export async function getAllFoundationSubmissions(): Promise<FoundationSubmission[]> {
  try {
    const db = await getMongoDb();
    const collection = db.collection("foundation-users");

    const submissions = await collection.find({}).toArray();

    return submissions.map(submission => ({
      _id: submission._id?.toString(),
      walletAddress: submission.walletAddress,
      githubRepo: submission.githubRepo,
      githubUsername: submission.githubUsername || null,
      deployedUrl: submission.deployedUrl || null,
      contractAddress: submission.contractAddress,
      submittedAt: submission.submittedAt,
      updatedAt: submission.updatedAt,
      createdAt: submission.createdAt,
      status: submission.status,
    }));
  } catch (error) {
    console.error("Error getting all foundation submissions:", error);
    return [];
  }
}
