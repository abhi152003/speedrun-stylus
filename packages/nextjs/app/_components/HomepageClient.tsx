"use client";

import { ChallengeExpandedCard } from "./ChallengeExpandedCard";
import { Hero } from "./Hero";
import { JoinBGCard } from "./JoinBGCard";
import { useAccount } from "wagmi";
import { useUser } from "~~/hooks/useUser";
import { useUserChallenges } from "~~/hooks/useUserChallenges";
import { ChallengeId } from "~~/services/database/config/types";
import { Challenges } from "~~/services/database/repositories/challenges";

export const HomepageClient = ({ challenges }: { challenges: Challenges }) => {
  const { address: connectedAddress } = useAccount();

  const { data: user } = useUser(connectedAddress);

  const { data: userChallenges } = useUserChallenges(connectedAddress);

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

        {/* <div className="flex flex-col xl:flex-row justify-center mx-auto relative">  
          <AfterSreLine />  
          <div className="hidden xl:flex flex-grow bg-[#96EAEA] dark:bg-[#3AACAD]" />  
          <AfterSreCard  
            title="ETH Tech Tree"  
            description="Check this advanced Solidity challenges to test your Ethereum dev skills."  
            externalLink="https://www.ethtechtree.com"  
            buttonText="Join"  
            previewImage="/assets/challenges/techTree.svg"  
            bgClassName="bg-[#96EAEA] dark:bg-[#3AACAD]"  
          />  
          <AfterSreCard  
            title="Capture the Flag"  
            description="Join our CTF game and hack your way through 12 Smart Contract challenges."  
            externalLink="https://ctf.buidlguidl.com"  
            buttonText="Start"  
            previewImage="/assets/challenges/ctf.svg"  
            bgClassName="bg-base-300"  
          />  
          <div className="hidden xl:flex flex-grow bg-base-300" />  
        </div>   */}
      </div>
    </div>
  );
};
