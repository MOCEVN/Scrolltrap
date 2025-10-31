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
		<header className="border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 items-center gap-3">
					<div className="relative w-full max-w-md">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							type="search"
							name="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							placeholder="Search..."
							aria-label="Search images"
							className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
						/>
					</div>
					<Button
						type="button"
						className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 sm:flex"
						title="Messages (coming soon)"
					>
						<MessageSquare className="h-5 w-5" />
					</Button>
					<Link href="/login">
						<Button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
							<HiOutlineLockOpen size={20} className="mr-2" />
							Login
						</Button>
					</Link>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
						{showLikedOnly ? "Your liked images" : "Explore"}
					</h1>
					{/* Optional subtitle can be passed in or computed inside the page */}
				</div>

				{likedCount > 0 && (
					<button
						type="button"
						onClick={onToggleShowLiked}
						className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
							showLikedOnly
								? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
								: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
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
