"use client";

import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { HiOutlineLockOpen } from "react-icons/hi";
import { Button } from "./ui/button";

interface HeaderProps {
  showLikedOnly: boolean;
  likedCount: number;
  onToggleShowLiked: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export default function Header({
  showLikedOnly,
  likedCount,
  onToggleShowLiked,
  searchQuery,
  setSearchQuery,
  handleSearch,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      {/* Top row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search..."
              aria-label="Search images"
              className="w-full rounded-full border border-border bg-background px-3 py-2 pl-10 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Messages button */}
          <Button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-accent hover:text-accent sm:flex"
            title="Messages (coming soon)"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Login button */}
          <Link href="/login">
            <Button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
              <HiOutlineLockOpen size={20} className="mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          {showLikedOnly ? "Your liked images" : "Explore"}
        </h1>

        {likedCount > 0 && (
          <button
            type="button"
            onClick={onToggleShowLiked}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              showLikedOnly
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "bg-border text-accent hover:bg-accent/10"
            }`}
          >
            {showLikedOnly ? "Viewing likes" : "Show likes"}
            <span className="text-base">❤️ {likedCount}</span>
          </button>
        )}
      </div>
    </header>
  );
}
