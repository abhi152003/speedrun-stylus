import { LeaderboardTable } from "./_components/LeaderboardTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpeedRunStylus - Leaderboard",
  description: "View the top builders ranked by completed challenges on SpeedRunStylus",
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-lg mt-2">Builders ranked by number of completed challenges</p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <LeaderboardTable />
          </div>
        </div>
      </div>
    </div>
  );
}
