"use client";

import Logo from "./logo";
import Search from "./search";
import SettingsPanel from "./settings-panel";
import { ChevronLeft, use } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = ["play", "explore", "library", "search"];

function setHash(tab, replace = false) {
  const next = `#${tab}`;
  if (replace) window.history.replaceState(null, "", next);
  else window.history.pushState(null, "", next);
  window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab } }));
}

export function getTabFromLocation() {
  if (typeof window === "undefined") return "play";
  const value = window.location.hash.replace(/^#/, "").toLowerCase();
  return TABS.includes(value) ? value : "play";
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(getTabFromLocation);

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#play");
    const sync = () => {
      const next = getTabFromLocation();
      setActive(next);
      window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab: next } }));
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    if (path === "/search") setActive("search");
  }, [path]);

  const selectTab = (tab) => {
    if (tab === "search") {
      router.push("/search");
      return;
    }
    if (path !== "/") router.push(`/#${tab}`);
    else setHash(tab);
    setActive(tab);
  };

  return (
    <header className="pexpo-header">
      <nav className="pexpo-topbar">
        <Logo />
        <div className="pexpo-topbar-search"><Search /></div>
        <SettingsPanel />
      </nav>
      <div className="pexpo-desktop-tabs" aria-hidden="true">
        {TABS.filter((t) => t !== "search").map((tab) => (
          <button key={tab} className={active === tab ? "is-active" : ""} onClick={() => selectTab(tab)} type="button">{tab}</button>
        ))}
      </div>
    </header>
  );
}
