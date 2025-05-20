import Image from "next/image";
import speedrunLogo from "../../../speedrun-logo-new.png";
import speedrunWhiteLogo from "../../../speedrun-stylus-dark-mode.svg";
import { useTheme } from "next-themes";

const HeroLogo = ({ className = "" }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? speedrunWhiteLogo.src : speedrunLogo.src;

  return <Image src={logoSrc} alt="Speedrun Logo" className={className} width={300} height={100} />;
};

export default HeroLogo;
