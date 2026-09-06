import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "./pexpo-reference.css";
import "./pexpo-reference-v2.css";
import "./pexpo-reference-v3.css";
import "./pexpo-reference-v4.css";
import "./pexpo-reference-v5.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import MusicProvider from "@/components/providers/music-provider";

const bricolage_grotesque = Bricolage_Grotesque({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"] });
export const metadata = { title: "PEXPO — Next-gen music experience", description: "Discover music, artists and sounds with PEXPO.", icons: "/favi-icon.jpg", manifest: "/manifest.json" };

export default function RootLayout({ children }) {
  return <html lang="en"><body className={bricolage_grotesque.className}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextTopLoader color="hsl(var(--primary))" initialPosition={0.08} crawlSpeed={200} height={2} crawl showSpinner={false} easing="ease-out" speed={180} shadow="none" zIndex={1600} showAtBottom={false} />
      <MusicProvider>{children}</MusicProvider>
      <Toaster position="top-center" visibleToasts={1} />
    </ThemeProvider>
  </body></html>;
}
