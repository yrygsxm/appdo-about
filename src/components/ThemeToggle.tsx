"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    const nextIsLight = !isLight;
    setIsLight(nextIsLight);
    document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
    window.localStorage.setItem("appdo-theme", nextIsLight ? "light" : "dark");
  };

  const label = isLight ? "切换至深色模式" : "切换至浅色模式";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="header-icon-button theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-emerald-300/35"
      aria-label={label}
      title={label}
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
