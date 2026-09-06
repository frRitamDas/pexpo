"use client";

import { Clock3, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STORAGE = "pexpo-search-history";

export default function SearchHome() {
  const router = useRouter();
  const input = useRef(null);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {}
    input.current?.focus();
  }, []);

  const save = (value) => {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...history.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 12);
    setHistory(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    router.push(`/search/${encodeURIComponent(clean)}`);
  };

  const remove = (value) => {
    const next = history.filter((item) => item !== value);
    setHistory(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  };

  return <main className="pexpo-search-screen">
    <div className="pexpo-search-title">Search</div>
    <form className="pexpo-search-box" onSubmit={(e) => { e.preventDefault(); save(query); }}>
      <Search />
      <input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Artists, Songs, Lyrics and More" aria-label="Search" autoComplete="off" />
    </form>
    <section className="pexpo-search-history">
      <div className="pexpo-search-history-head"><h1>Recent searches</h1>{history.length > 0 && <button type="button" onClick={() => { setHistory([]); localStorage.removeItem(STORAGE); }}>Clear</button>}</div>
      {history.length === 0 ? <p className="pexpo-search-empty">Your recent searches will appear here.</p> : history.map((item) => <div className="pexpo-search-history-row" key={item}><button type="button" onClick={() => save(item)}><Clock3 />{item}</button><button type="button" onClick={() => remove(item)} aria-label={`Remove ${item}`}><X /></button></div>)}
    </section>
  </main>;
}
