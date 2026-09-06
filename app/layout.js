import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "./pexpo-design.css";
import "./pexpo-player.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import MusicProvider from "@/components/providers/music-provider";

const bricolage_grotesque = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
export const metadata = { title: "PEXPO — Next-gen music experience", description: "Discover music, artists and sounds with PEXPO.", icons: "/favi-icon.jpg", manifest: "/manifest.json" };

export default function RootLayout({ children }) {
  return <html lang="en" className="dark"><body className={bricolage_grotesque.className}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <NextTopLoader color="#75ef8e" initialPosition={0.08} crawlSpeed={200} height={2} crawl showSpinner={false} easing="ease-out" speed={180} shadow="none" zIndex={1600} />
      <MusicProvider>{children}</MusicProvider>
      <Toaster position="top-center" visibleToasts={1} />
    </ThemeProvider>
  </body></html>;
}
