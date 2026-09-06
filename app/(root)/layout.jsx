import Player from "@/components/cards/player";
import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import MobileNav from "@/components/page/mobile-nav";

export default function RootLayout({ children }) {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="page-shell">{children}</div>
      <Player />
      <MobileNav />
      <Footer />
    </main>
  );
}
