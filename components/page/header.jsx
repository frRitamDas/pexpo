"use client";

import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import SettingsPanel from "./settings-panel";
import { ChevronLeft, Compass, Library, ListMusic, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const tabs = [
  { key: "play", label: "Play", icon: ListMusic },
  { key: "library", label: "Library", icon: Library },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "account", label: "Account", icon: UserRound },
];

export default function Header() {
  const path = usePathname();
  const [active, setActive] = useState(path === "/" ? "play" : "play");

  useEffect(() => {
    const update = () => {
      const value = new URLSearchParams(window.location.search).get("tab");
      setActive(tabs.some((tab) => tab.key === value) ? value : "play");
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [path]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 md:px-10 lg:px-16 pointer-events-none">
      <nav className="liquid-nav pointer-events-auto mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-2 p-2">
        <Logo />

        <div className="hidden md:flex items-center justify-center">
          <div className="pexpo-tabs">
            {tabs.map(({ key, label, icon: Icon }) => (
              <Link key={key} href={`/?tab=${key}`} className={`pexpo-tab ${active === key && path === "/" ? "active" : ""}`}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden lg:block w-[280px] mr-1"><Search /></div>
          {path !== "/" && (
            <Button asChild variant="ghost" size="icon" className="liquid-icon" aria-label="Back home">
              <Link href="/"><ChevronLeft className="h-[18px] w-[18px]" /></Link>
            </Button>
          )}
          <SettingsPanel />
        </div>
      </nav>

      <div className="mx-auto mt-2 max-w-6xl sm:hidden pointer-events-auto">
        <div className="liquid-search"><Search /></div>
      </div>

      <div className="md:hidden mx-auto mt-2 max-w-6xl pointer-events-auto overflow-x-auto no-scrollbar">
        <div className="pexpo-tabs mobile-tabs min-w-max">
          {tabs.map(({ key, label, icon: Icon }) => (
            <Link key={key} href={`/?tab=${key}`} className={`pexpo-tab ${active === key && path === "/" ? "active" : ""}`}>
              <Icon className="h-4 w-4" /><span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
