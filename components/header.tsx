"use client";

import { LogIn, MessageSquare, Search, UserRoundPlus } from "lucide-react";
import Link from "next/link";
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
			{/* ✅ Top row: Search bar (left) + Message + Login (right) */}
			<div className="flex w-full items-center justify-between gap-3">
				{/* LEFT SIDE */}
				<div className="flex items-center flex-1">
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
				</div>

				{/* RIGHT SIDE */}
				<div className="flex items-center gap-4">
					{/* Messages button */}
					<button
						type="button"
						className="h-12 w-12 flex items-center justify-center rounded-xl text-white hover:opacity-80"
						title="Messages (coming soon)"
					>
						<MessageSquare className="h-5 w-5" />
					</button>

					{/* Login button */}
				<Link href="/login">
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:text-primary transition rounded-xl"
        >
          <LogIn size={20} className="transition" />
          Login
        </Button>
      </Link>

      <Link href="/register">
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:text-primary transition rounded-xl"
        >
          <UserRoundPlus size={20} className="transition" />
          Register
        </Button>
      </Link>


				</div>
			</div>

			{/* ✅ Bottom row */}
			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-xl font-semibold text-foreground sm:text-2xl">
					{showLikedOnly ? "Your liked images" : "Explore"}
				</h1>

				{likedCount > 0 && (
					<Button
						type="button"
						onClick={onToggleShowLiked}
						className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
							showLikedOnly
								? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
								: "bg-border text-accent text-white shadow-accent/25"
						}`}
					>
						{showLikedOnly ? "Viewing likes" : "Show likes"}
						<span className="text-base ">❤️ {likedCount}</span>
					</Button>
				)}
			</div>
		</header>
	);
}
