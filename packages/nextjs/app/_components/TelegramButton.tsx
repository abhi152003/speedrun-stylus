"use client";

import TelegramIcon from "../_assets/icons/TelegramIcon";

type TelegramButtonProps = {
  channelLink: string;
  label?: string;
};

const TelegramButton = ({ channelLink, label = "Join Our Telegram Channel" }: TelegramButtonProps) => {
  return (
    <a
      href={channelLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center text-[#088484] bg-[#C8F5FF] text-sm sm:text-lg px-4 py-1 border-2 border-[#088484] rounded-full hover:bg-white/80 transition-colors"
    >
      <TelegramIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-2 fill-[#088484]" />
      <span>{label}</span>
    </a>
  );
};

export default TelegramButton;
