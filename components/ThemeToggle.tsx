"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button type="button" className="toggle" onClick={toggle} aria-label="テーマ切替">
      {theme === "dark" ? (
        <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.64 13A9 9 0 1111 2.36 7 7 0 0021.64 13z"/>
        </svg>
      ) : (
        <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 4a1 1 0 011 1v1h-2v-1a1 1 0 011-1zm0-22a1 1 0 00-1 1v1h2V1a1 1 0 00-1-1zM1 11H0v2h1a1 1 0 000-2zm23 0a1 1 0 000 2h1v-2h-1zM4.22 4.22L3.51 3.5l-1.41 1.41.71.71L4.22 4.22zm15.56 0l.71.71 1.41-1.41-.71-.71-1.41 1.41zM4.22 19.78l-1.41 1.41.71.71.71-.71-1.41-1.41zm16.97 1.41l-1.41-1.41-.71.71.71.71 1.41-1.41z"/>
        </svg>
      )}
      <span style={{ fontSize: 12 }}>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

