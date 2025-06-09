"use client";

import { ChallengeExpandedCard } from "./ChallengeExpandedCard";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ChallengeId } from "~~/services/database/config/types";
import { Challenges } from "~~/services/database/repositories/challenges";

type BlurredChallengeCardProps = {
  challengeId: ChallengeId;
  challenges: Challenges;
};

export const BlurredChallengeCard = ({ challengeId, challenges }: BlurredChallengeCardProps) => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="relative overflow-hidden">
      {/* Less blurred challenge card for better preview */}
      <div className="blur-[2px] brightness-50 pointer-events-none">
        <ChallengeExpandedCard challengeId={challengeId} userChallenges={[]} challenges={challenges} />
      </div>

      {/* Gradient overlay for better visual integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-teal-800/60 to-emerald-900/80"></div>

      {/* Main overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center max-w-lg mx-4 border border-white/20">
          {/* Lock icon with glow effect */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Unlock More Challenges!
          </h3>

          <p className="text-gray-700 mb-2 text-lg">
            Connect your wallet to access <span className="font-bold text-emerald-600">10+ challenges</span>
          </p>
          <p className="text-gray-600 mb-6">Build with Arbitrum Stylus • Join the community</p>

          <button
            onClick={openConnectModal}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Wallet to Continue
            </span>
          </button>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-500 ml-2">Challenge 1 of 10+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
