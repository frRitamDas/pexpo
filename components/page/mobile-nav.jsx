"use client";

import { Compass, Library, Play, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { key: "play", label: "Play", icon: Play },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "library", label: "Library", icon: Library },
  { key: "search", label: "Search", icon: Search },
];

function readTab() {
  if (typeof window === "undefined") return "play";
  if (window.location.pathname === "/search" || window.location.pathname.startsWith("/search/")) return "search";
  const hash = window.location.hash.slice(1).toLowerCase();
  return ["play", "explore", "library"].includes(hash) ? hash : "play";
}

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(readTab);

  useEffect(() => {
    const sync = () => setActive(readTab());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  const choose = (key) => {
    if (key === "search") {
      setActive(key);
      router.push("/search");
      return;
    }
    if (pathname === "/") {
      window.history.pushState(null, "", `#${key}`);
      setActive(key);
      window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab: key } }));
    } else {
      router.push(`/#${key}`);
    }
  };

  return (
    <nav className="pexpo-bottom-nav" aria-label="Main navigation">
      <div className="pexpo-bottom-nav-inner">
        {items.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" className={`pexpo-bottom-item ${active === key ? "is-active" : ""}`} onClick={() => choose(key)} aria-current={active === key ? "page" : undefined}>
            <span className="pexpo-bottom-icon"><Icon strokeWidth={2.1} /></span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
