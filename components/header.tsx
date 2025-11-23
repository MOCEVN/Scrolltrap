"use client";

import { useScenario } from "@/hooks/use-scenario";
import { LogIn, Search, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderBottom from "./header-bottom";
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

	return (
		<header className="border-b border-border bg-card px-4 py-4 shadow-sm backdrop-blur sm:px-6">
			{/* TOP ROW (onveranderd) */}
			<div className="flex w-full items-center justify-between gap-3">
				<div className="flex items-center flex-1">
					<div className="relative w-full max-w-md">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							placeholder="Search..."
							className="w-full rounded-full border border-border bg-background px-3 py-2 pl-10 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
						/>
					</div>
				</div>

				<div className="flex items-center gap-4">
					{loggedIn === false && (
						<>
							<Link href="/login">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white transition hover:text-primary rounded-xl"
								>
									<LogIn size={20} />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white transition hover:text-primary rounded-xl"
								>
									<UserRoundPlus size={20} />
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

			<HeaderBottom
				heading={heading}
				subheading={subheading}
				likedCount={likedCount}
				loggedIn={loggedIn}
				showLikedOnly={showLikedOnly}
				onToggleShowLiked={onToggleShowLiked}
			/>
		</header>
	);
}
