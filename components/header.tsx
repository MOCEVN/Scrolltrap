"use client";

import { useScenario } from "@/hooks/use-scenario";
import { LogIn, Search, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScenarioSwitch from "./scenario-switch";
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
	const { mode, isDream } = useScenario();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});

		setLoggedIn(false);
		window.location.href = "/";
	};

	const heading = showLikedOnly
		? "Your liked images"
		: mode === "doom"
			? "Explore (doomscroll mode)"
			: "Explore";

	const subheading = showLikedOnly;

	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		fetch("/api/auth/me", {
			method: "GET",
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				setLoggedIn(!!data.user);
			})
			.catch(() => setLoggedIn(false));
	}, []);

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
					{loggedIn === false && (
						<>
							<Link href="/login">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white transition hover:text-primary rounded-xl"
								>
									<LogIn size={20} className="transition" />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white transition hover:text-primary rounded-xl"
								>
									<UserRoundPlus size={20} className="transition" />
									Register
								</Button>
							</Link>
						</>
					)}

					{loggedIn === true && (
						<Button
							variant="ghost"
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white transition hover:text-primary rounded-xl"
						>
							Logout
						</Button>
					)}
				</div>
			</div>

			{/* ✅ Bottom row */}
			<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-semibold text-foreground sm:text-2xl">
						{heading}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground max-w-md">
						{subheading}
					</p>
				</div>

				<div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
					<ScenarioSwitch />

					{likedCount > 0 && loggedIn === true && (
						<Button
							type="button"
							onClick={onToggleShowLiked}
							className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
								showLikedOnly
									? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
									: "bg-border text-indigo-600 shadow-accent/25"
							}`}
						>
							{showLikedOnly ? "Viewing likes" : "Show likes"}
							<span className="text-base">❤️ {likedCount}</span>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
