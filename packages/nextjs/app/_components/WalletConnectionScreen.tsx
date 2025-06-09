"use client";

import Image from "next/image";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const WalletConnectionScreen = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/speedrun-home-bg.png"
        alt="Speedrun Stylus Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />

      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/55"></div>

      {/* Content overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20">
          <p className="text-white text-lg mb-8">Connect your wallet to start building with Arbitrum Stylus</p>

          <button
            onClick={e => {
              e.stopPropagation();
              openConnectModal?.();
            }}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
