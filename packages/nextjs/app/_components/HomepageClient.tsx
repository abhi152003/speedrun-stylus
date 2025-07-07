"use client";

import { BlurredChallengeCard } from "./BlurredChallengeCard";
import { ChallengeExpandedCard } from "./ChallengeExpandedCard";
import { Hero } from "./Hero";
import { JoinBGCard } from "./JoinBGCard";
import TelegramButton from "./TelegramButton";
import { useAccount } from "wagmi";
import { useUser } from "~~/hooks/useUser";
import { useUserChallenges } from "~~/hooks/useUserChallenges";
import { ChallengeId } from "~~/services/database/config/types";
import { Challenges } from "~~/services/database/repositories/challenges";

export const HomepageClient = ({ challenges }: { challenges: Challenges }) => {
  const { address: connectedAddress } = useAccount();

  const { data: user } = useUser(connectedAddress);

  const { data: userChallenges } = useUserChallenges(connectedAddress);

  // Sort challenges by sortOrder and filter out disabled ones
  const enabledChallenges = challenges
    .filter(challenge => !challenge.disabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Find specific challenges for the disconnected wallet view
  const firstChallenge = enabledChallenges.find(c => c.id === ChallengeId.SIMPLE_COUNTER_EXAMPLE);
  const secondChallenge = enabledChallenges.find(c => c.id === ChallengeId.SIMPLE_NFT_EXAMPLE);

  // If wallet is not connected, show first challenge and blurred second challenge
  if (!connectedAddress) {
    return (
      <div>
        <Hero firstChallengeId={"simple-counter-example"} />
        <div className="bg-base-200">
          {firstChallenge && (
            <ChallengeExpandedCard
              key={firstChallenge.id}
              challengeId={firstChallenge.id as ChallengeId}
              userChallenges={userChallenges}
              challenges={challenges}
            />
          )}
          {secondChallenge && (
            <BlurredChallengeCard challengeId={secondChallenge.id as ChallengeId} challenges={challenges} />
          )}
        </div>
      </div>
    );
  }

  // Group challenges: main challenges (0-4), then join BG, then advanced challenges (5+)
  const mainChallenges = enabledChallenges.filter(c => c.sortOrder >= 0 && c.sortOrder <= 4);
  const advancedChallenges = enabledChallenges.filter(c => c.sortOrder >= 5 && c.sortOrder <= 20);

  // Show all challenges when wallet is connected
  return (
    <div>
      <Hero firstChallengeId={"simple-counter-example"} />
      <div className="bg-base-200">
        {/* Main challenges (0-4) */}
        {mainChallenges.map(challenge => (
          <ChallengeExpandedCard
            key={challenge.id}
            challengeId={challenge.id as ChallengeId}
            userChallenges={userChallenges}
            challenges={challenges}
          />
        ))}

        {/* Join BG Card (sort order 5) */}
        <JoinBGCard userChallenges={userChallenges} user={user} />

        {/* Telegram Button */}
        <div className="flex justify-center py-8 bg-accent">
          <TelegramButton channelLink="https://t.me/+G55xO-18czg5NDA1" />
        </div>

        {/* Advanced challenges (6+) */}
        {advancedChallenges.map(challenge => (
          <ChallengeExpandedCard
            key={challenge.id}
            challengeId={challenge.id as ChallengeId}
            userChallenges={userChallenges}
            challenges={challenges}
          />
        ))}
      </div>
    </div>
  );
};
