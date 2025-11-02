"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isOpen, setIsOpen] = useState(false);

  // Load theme
  useEffect(() => {
    const local = localStorage.getItem("theme");
    if (local === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else if (local === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Auto-close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // stop click bubbling to other buttons
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[57px] backdrop-blur-md bg-[var(--background)]/95 dark:bg-[var(--card)]/95 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-[102]">
          <div className="rounded-md overflow-hidden w-10 h-10 flex items-center justify-center bg-[var(--card)]">
            <Image src="/logo.png" alt="logo" width={36} height={36} />
          </div>
          <span className="text-xl font-semibold tracking-tight">Travel Planner</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/trips" className="hover:text-[var(--primary)] transition-colors">Trips</Link>
          <Link href="/globe" className="hover:text-[var(--primary)] transition-colors">Globe</Link>
          <Link href="/chat" className="hover:text-[var(--primary)] transition-colors">Assistant</Link>
          {session ? (
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={login}
              className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 z-[103]">
          {/* Theme Toggle */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[var(--input)] transition-colors"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V2M12 22v-2M4.22 4.22L2.81 2.81M21.19 21.19l-1.41-1.41M2 12H4M20 12h2M4.22 19.78l1.41-1.41M21.19 2.81L19.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-[var(--input)] transition-colors relative z-[104]"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`h-0.5 bg-[var(--foreground)] rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-[var(--foreground)] rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-0.5 bg-[var(--foreground)] rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`fixed inset-x-0 top-[57px] z-[101] bg-[var(--card)] border-b border-[var(--border)] shadow-lg transform transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="p-4 flex flex-col gap-3">
          <Link href="/trips" onClick={() => setIsOpen(false)} className="py-2 px-3 rounded-lg hover:bg-[var(--input)] transition-colors">Trips</Link>
          <Link href="/globe" onClick={() => setIsOpen(false)} className="py-2 px-3 rounded-lg hover:bg-[var(--input)] transition-colors">Globe</Link>
          <Link href="/chat" onClick={() => setIsOpen(false)} className="py-2 px-3 rounded-lg hover:bg-[var(--input)] transition-colors">Assistant</Link>
          {session ? (
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 mt-2"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => { login(); setIsOpen(false); }}
              className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 mt-2"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
