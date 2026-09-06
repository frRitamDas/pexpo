import Player from "@/components/cards/player";
import Footer from "@/components/page/footer";
import Header from "@/components/page/header";

export default function RootLayout({ children }) {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="page-shell">{children}</div>
      <Player />
      <Footer />
    </main>
  );
}
