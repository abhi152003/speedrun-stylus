"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaGithub, FaMedal, FaSortDown, FaSortUp } from "react-icons/fa";
import { useLeaderboard } from "~~/hooks/useLeaderboard";
import { BatchUserStatus } from "~~/services/database/config/types";
import { formatAddress } from "~~/utils/formatAddress";

type SortField = "rank" | "displayName" | "challengeCount" | "batchStatus" | "github";
type SortDirection = "asc" | "desc";

export const LeaderboardTable = () => {
  const { data: leaderboardData, isLoading, error } = useLeaderboard();
  const [sortField, setSortField] = useState<SortField>("challengeCount");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formattedData = useMemo(() => {
    if (!leaderboardData) return [];

    const data = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      displayName: entry.socialX || entry.socialGithub || formatAddress(entry.userAddress),
      github: entry.socialGithub,
    }));

    return [...data].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "rank":
          comparison = a.rank - b.rank;
          break;
        case "displayName":
          comparison = (a.displayName || "").localeCompare(b.displayName || "");
          break;
        case "challengeCount":
          comparison = a.challengeCount - b.challengeCount;
          break;
        case "batchStatus":
          const statusOrder: Record<string, number> = {
            [BatchUserStatus.GRADUATE]: 0,
            [BatchUserStatus.CANDIDATE]: 1,
            null: 2,
          };
          const aStatus = a.batchStatus || "null";
          const bStatus = b.batchStatus || "null";
          comparison = statusOrder[aStatus] - statusOrder[bStatus];
          break;
        case "github":
          comparison = (a.github || "").localeCompare(b.github || "");
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [leaderboardData, sortField, sortDirection]);

  const renderRankCell = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex justify-center items-center">
          <div className="relative group" title="Gold">
            <div className="text-yellow-500 text-2xl">
              <FaMedal />
            </div>
          </div>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex justify-center items-center">
          <div className="relative group" title="Silver">
            <div className="text-gray-400 text-2xl">
              <FaMedal />
            </div>
          </div>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex justify-center items-center">
          <div className="relative group" title="Bronze">
            <div className="text-amber-700 text-2xl">
              <FaMedal />
            </div>
          </div>
        </div>
      );
    }
    return <span className="font-bold">{rank}</span>;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;

    return <span className="inline-block ml-1">{sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />}</span>;
  };

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
          <tr className="bg-base-200">
            <th
              className="text-center cursor-pointer hover:bg-base-300 transition-colors duration-200"
              onClick={() => handleSort("rank")}
            >
              Rank <SortIcon field="rank" />
            </th>
            <th
              className="cursor-pointer hover:bg-base-300 transition-colors duration-200"
              onClick={() => handleSort("displayName")}
            >
              Builder <SortIcon field="displayName" />
            </th>
            <th
              className="text-center cursor-pointer hover:bg-base-300 transition-colors duration-200"
              onClick={() => handleSort("challengeCount")}
            >
              Challenges Completed <SortIcon field="challengeCount" />
            </th>
            <th
              className="text-center cursor-pointer hover:bg-base-300 transition-colors duration-200"
              onClick={() => handleSort("batchStatus")}
            >
              Status <SortIcon field="batchStatus" />
            </th>
            <th
              className="text-center cursor-pointer hover:bg-base-300 transition-colors duration-200"
              onClick={() => handleSort("github")}
            >
              GitHub <SortIcon field="github" />
            </th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map(entry => (
            <tr key={entry.userAddress} className="hover:bg-base-200 transition-colors duration-200">
              <td className="text-center">{renderRankCell(entry.rank)}</td>
              <td>
                <Link href={`/builders/${entry.userAddress}`} className="link link-hover link-primary">
                  {entry.displayName}
                </Link>
              </td>
              <td className="text-center font-medium">{entry.challengeCount}</td>
              <td className="text-center">
                {entry.batchStatus === BatchUserStatus.GRADUATE && <div className="badge badge-success">Graduate</div>}
                {entry.batchStatus === BatchUserStatus.CANDIDATE && <div className="badge badge-info">Candidate</div>}
                {entry.batchStatus === null && <div className="badge badge-ghost">Builder</div>}
              </td>
              <td className="text-center">
                {entry.github ? (
                  <a
                    href={`https://github.com/${entry.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover flex items-center justify-center gap-1 group"
                  >
                    <div className="inline-block group-hover:text-primary transition-colors duration-200">
                      <FaGithub />
                    </div>
                    <span className="group-hover:text-primary transition-colors duration-200">{entry.github}</span>
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
          {formattedData.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
