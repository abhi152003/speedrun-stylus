import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "@rainbow-me/rainbowkit/styles.css";
import PlausibleProvider from "next-plausible";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = getMetadata({
  title: "Speed Run Stylus",
  description: "Learn how to build on Arbitrum using Stylus.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={spaceGrotesk.className}>
      <head>
        <PlausibleProvider domain="speedrunstylus.com" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-X6K9227V5J" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X6K9227V5J');
          `}
        </Script>

        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
