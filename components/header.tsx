"use client";

import { ScenarioToggle } from "@/components/scenario-toggle";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { LogIn, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface HeaderProps {
	showLikedOnly?: boolean;
	likedCount?: number;
	onToggleShowLiked?: () => void;
	searchQuery?: string;
	setSearchQuery?: (query: string) => void;
	handleSearch?: () => void;
}

export default function Header({
	showLikedOnly = false,
	likedCount = 0,
	onToggleShowLiked,
}: HeaderProps) {
	const { isDoom } = useScenarioMode();
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

	return (
		<header className={`
			border-b px-4 py-3 shadow-sm backdrop-blur sm:px-6 transition-colors duration-300
			${isDoom 
				? "border-red-900/30 bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900" 
				: "border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-indigo-50/80"
			}
		`}>
			<div className="flex w-full items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<ScenarioToggle />
				</div>

				<div className="flex items-center gap-3">
					{!isDoom && likedCount > 0 && onToggleShowLiked && (
						<Button
							type="button"
							onClick={onToggleShowLiked}
							className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
								showLikedOnly
									? "bg-pink-500 text-white shadow-md hover:bg-pink-600"
									: "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
							}`}
						>
							<span className="text-sm">❤️</span>
							{showLikedOnly ? `${likedCount} likes` : `${likedCount}`}
						</Button>
					)}

					{loggedIn === false && (
						<>
							<Link href="/login">
								<Button
									variant="ghost"
									className={`
										flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition
										${isDoom 
											? "bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white border border-red-500/30" 
											: "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
										}
									`}
								>
									<LogIn size={18} className="transition" />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className={`
										flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition
										${isDoom 
											? "bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white border border-red-500/30" 
											: "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
										}
									`}
								>
									<UserRoundPlus size={18} className="transition" />
									Register
								</Button>
							</Link>
						</>
					)}

					{loggedIn === true && (
						<Button
							variant="ghost"
							onClick={handleLogout}
							className={`
								flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition
								${isDoom 
									? "bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white border border-red-500/30" 
									: "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
								}
							`}
						>
							Logout
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
