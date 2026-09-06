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

function TabBar({ active, isHome }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-secondary/55 p-1 shadow-sm backdrop-blur-md">
      {tabs.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          href={`/?tab=${key}`}
          className={`relative flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all duration-200 sm:px-3.5 ${isHome && active === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/60 hover:text-foreground"}`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Header() {
  const path = usePathname();
  const [active, setActive] = useState("play");

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
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 md:px-8 lg:px-12 pointer-events-none">
      <nav className="liquid-nav pointer-events-auto mx-auto flex w-full max-w-[1280px] items-center gap-2 p-2">
        <Logo />

        <div className="hidden lg:flex flex-1 justify-center">
          <TabBar active={active} isHome={path === "/"} />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden xl:block w-[280px]"><Search /></div>
          {path !== "/" && (
            <Button asChild variant="ghost" size="icon" className="liquid-icon" aria-label="Back home">
              <Link href="/"><ChevronLeft className="h-[18px] w-[18px]" /></Link>
            </Button>
          )}
          <SettingsPanel />
        </div>
      </nav>

      <div className="mx-auto mt-2 max-w-[1280px] pointer-events-auto xl:hidden sm:flex hidden justify-center">
        <TabBar active={active} isHome={path === "/"} />
      </div>

      <div className="mx-auto mt-2 max-w-[1280px] sm:hidden pointer-events-auto">
        <div className="liquid-search"><Search /></div>
      </div>

      <div className="mx-auto mt-2 max-w-[1280px] sm:hidden pointer-events-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-1 rounded-full border border-border/60 bg-background/80 p-1 backdrop-blur-md">
          {tabs.map(({ key, label, icon: Icon }) => (
            <Link key={key} href={`/?tab=${key}`} className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium ${path === "/" && active === key ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Icon className="h-4 w-4" /><span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
