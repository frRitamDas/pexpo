"use client";

import Logo from "./logo";
import Search from "./search";
import SettingsPanel from "./settings-panel";
import { ChevronLeft, Compass, Library, ListMusic, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const tabs = [
  { key: "play", label: "Play", icon: ListMusic },
  { key: "library", label: "Library", icon: Library },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "account", label: "Account", icon: UserRound },
];

function TabBar({ active, onSelect, compact = false }) {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === active));
  return (
    <div className={`pexpo-tabs ${compact ? "pexpo-tabs-compact" : ""}`} role="tablist" aria-label="PEXPO sections">
      <span className="pexpo-tab-indicator" style={{ transform: `translateX(${activeIndex * 100}%)` }} aria-hidden="true" />
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          className={`pexpo-tab ${active === key ? "is-active" : ""}`}
          onClick={() => onSelect(key)}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("play");
  const isHome = path === "/";

  useEffect(() => {
    const onTab = (event) => setActive(event.detail?.tab || "play");
    window.addEventListener("pexpo-tab-change", onTab);
    return () => window.removeEventListener("pexpo-tab-change", onTab);
  }, []);

  const selectTab = (key) => {
    setActive(key);
    window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab: key } }));
    if (!isHome) router.push("/");
  };

  return (
    <header className="pexpo-header">
      <nav className="pexpo-nav">
        <div className="pexpo-brand-wrap"><Logo /></div>

        <div className="hidden md:flex flex-1 justify-center min-w-0">
          <TabBar active={active} onSelect={selectTab} />
        </div>

        <div className="pexpo-nav-actions">
          <div className="hidden lg:block w-[250px] xl:w-[290px]"><Search /></div>
          {!isHome && (
            <button type="button" className="pexpo-icon-button" onClick={() => router.push("/")} aria-label="Back to PEXPO">
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </button>
          )}
          <SettingsPanel />
        </div>
      </nav>

      <div className="md:hidden pexpo-mobile-tools">
        <div className="pexpo-mobile-search"><Search /></div>
        <TabBar active={active} onSelect={selectTab} compact />
      </div>
    </header>
  );
}
