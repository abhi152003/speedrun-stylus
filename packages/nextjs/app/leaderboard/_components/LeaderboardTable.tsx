"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLeaderboard } from "~~/hooks/useLeaderboard";
import { BatchUserStatus } from "~~/services/database/config/types";
import { formatAddress } from "~~/utils/formatAddress";

export const LeaderboardTable = () => {
  const { data: leaderboardData, isLoading, error } = useLeaderboard();

  const formattedData = useMemo(() => {
    if (!leaderboardData) return [];

    return leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      displayName: entry.socialX || entry.socialGithub || formatAddress(entry.userAddress),
    }));
  }, [leaderboardData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-error">Error loading leaderboard data. Please try again later.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="text-center">Rank</th>
            <th>Builder</th>
            <th className="text-center">Challenges Completed</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map(entry => (
            <tr key={entry.userAddress} className="hover">
              <td className="text-center font-bold">{entry.rank}</td>
              <td>
                <Link href={`/builders/${entry.userAddress}`} className="link link-hover link-primary">
                  {entry.displayName}
                </Link>
              </td>
              <td className="text-center">{entry.challengeCount}</td>
              <td className="text-center">
                {entry.batchStatus === BatchUserStatus.GRADUATE && <div className="badge badge-success">Graduate</div>}
                {entry.batchStatus === BatchUserStatus.CANDIDATE && <div className="badge badge-info">Candidate</div>}
                {entry.batchStatus === null && <div className="badge badge-ghost">Builder</div>}
              </td>
            </tr>
          ))}
          {formattedData.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
