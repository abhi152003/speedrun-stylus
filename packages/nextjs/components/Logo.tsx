import Image from "next/image";
import speedrunLogo from "../../nextjs/speedrun-logo-new.png";
import speedrunWhiteLogo from "../../nextjs/speedrunWhiteBG_transparent.png";
import { useTheme } from "next-themes";

const Logo = ({ className = "" }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? speedrunWhiteLogo.src : speedrunLogo.src;

  return <Image src={logoSrc} alt="Speedrun Logo" className={className} width={300} height={100} />;
};

export default Logo;
