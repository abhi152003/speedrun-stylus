import Image from "next/image";
import speedrunLogo from "../../nextjs/speedrun-logo-new.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return <Image src={speedrunLogo.src} alt="Speedrun Logo" className={className} width={300} height={100} />;
};

export default Logo;
