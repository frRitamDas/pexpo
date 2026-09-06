import Header from "@/components/page/header";
import Player from "@/components/cards/player";
import MobileNav from "@/components/page/mobile-nav";

export default function SettingsLayout({ children }) {
  return <main className="min-h-screen"><Header />{children}<Player /><MobileNav /></main>;
}
