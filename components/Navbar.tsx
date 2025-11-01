"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const local = localStorage.getItem("theme");
      if (local === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else if (local === "light") {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--background)]/60 dark:bg-[var(--card)]/60 border-b border-[var(--border)]/60">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-md overflow-hidden w-10 h-10 flex items-center justify-center bg-[var(--card)]">
            <Image src="/logo.png" alt="logo" width={36} height={36} />
          </div>
          <span className="text-xl font-semibold tracking-tight">Travel Planner</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/trips" className="text-[var(--foreground)] hover:text-[var(--primary)]">
              Trips
            </Link>
            <Link href="/globe" className="text-[var(--foreground)] hover:text-[var(--primary)]">
              Globe
            </Link>
            <Link href="/chat" className="text-[var(--foreground)] hover:text-[var(--primary)]">
              Assistant
            </Link>
          </div>

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[var(--input)] transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              // sun icon
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V2M12 22v-2M4.22 4.22L2.81 2.81M21.19 21.19l-1.41-1.41M2 12H4M20 12h2M4.22 19.78l1.41-1.41M21.19 2.81L19.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              // moon icon
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {session ? (
            <>
              <button
                onClick={logout}
                className="ml-2 inline-flex items-center gap-2 rounded-md px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="ml-2 inline-flex items-center gap-2 rounded-md px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95"
            >
              <span>Sign In</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
