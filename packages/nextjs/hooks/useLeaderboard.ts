import { useQuery } from "@tanstack/react-query";
import { BatchUserStatus } from "~~/services/database/config/types";

export type LeaderboardEntry = {
  totalSubmissions: any;
  userAddress: string;
  socialX: string | null;
  socialGithub: string | null;
  batchStatus: BatchUserStatus | null;
  challengeCount: number;
  maxSubmissionsForSingleChallenge: number;
  totalScore: number;
  hasFoundationCertificate: boolean;
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/users/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      return data.leaderboardData as LeaderboardEntry[];
    },
  });
};
