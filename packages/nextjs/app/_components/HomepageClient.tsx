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

  // If wallet is not connected, show first challenge and blurred second challenge
  if (!connectedAddress) {
    return (
      <div>
        <Hero firstChallengeId={"simple-counter-example"} />
        <div className="bg-base-200">
          <ChallengeExpandedCard
            key={ChallengeId.SIMPLE_COUNTER_EXAMPLE}
            challengeId={ChallengeId.SIMPLE_COUNTER_EXAMPLE}
            userChallenges={userChallenges}
            challenges={challenges}
          />
          <BlurredChallengeCard challengeId={ChallengeId.SIMPLE_NFT_EXAMPLE} challenges={challenges} />
        </div>
      </div>
    );
  }

  // Show all challenges when wallet is connected
  return (
    <div>
      <Hero firstChallengeId={"simple-counter-example"} />
      <div className="bg-base-200">
        <ChallengeExpandedCard
          key={ChallengeId.SIMPLE_COUNTER_EXAMPLE}
          challengeId={ChallengeId.SIMPLE_COUNTER_EXAMPLE}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.SIMPLE_NFT_EXAMPLE}
          challengeId={ChallengeId.SIMPLE_NFT_EXAMPLE}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.VENDING_MACHINE}
          challengeId={ChallengeId.VENDING_MACHINE}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.MULTISIG_WALLET}
          challengeId={ChallengeId.MULTISIG_WALLET}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.UNISWAP_V2_STYLUS}
          challengeId={ChallengeId.UNISWAP_V2_STYLUS}
          userChallenges={userChallenges}
          challenges={challenges}
        />

        <JoinBGCard userChallenges={userChallenges} user={user} />

        <div className="flex justify-center py-8 bg-accent">
          <TelegramButton channelLink="https://t.me/speedrun_stylus" />
        </div>

        <ChallengeExpandedCard
          key={ChallengeId.ZKP_AGE}
          challengeId={ChallengeId.ZKP_AGE}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.ZKP_BALANCE}
          challengeId={ChallengeId.ZKP_BALANCE}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.ZKP_PASSWORD}
          challengeId={ChallengeId.ZKP_PASSWORD}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.ZKP_LOCATION}
          challengeId={ChallengeId.ZKP_LOCATION}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.ZKP_MODEL}
          challengeId={ChallengeId.ZKP_MODEL}
          userChallenges={userChallenges}
          challenges={challenges}
        />
        <ChallengeExpandedCard
          key={ChallengeId.ZKP_PUBLIC_DOC_VERIFIER}
          challengeId={ChallengeId.ZKP_PUBLIC_DOC_VERIFIER}
          userChallenges={userChallenges}
          challenges={challenges}
        />
      </div>
    </div>
  );
};
