"use client";

import Logo from "./logo";
import SettingsPanel from "./settings-panel";
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
    if (!window.location.hash && path === "/") window.history.replaceState(null, "", "#play");
    const sync = () => setActive(path === "/search" ? "search" : getTabFromLocation());
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener("pexpo-tab-change", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("pexpo-tab-change", sync);
    };
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
      <nav className="pexpo-topbar" aria-label="Primary navigation">
        <Logo />
        <div className="pexpo-desktop-tabs">
          {TABS.map((tab) => (
            <button key={tab} className={active === tab ? "is-active" : ""} onClick={() => selectTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </div>
        <SettingsPanel />
      </nav>
    </header>
  );
}
