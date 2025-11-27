"use client";

import { LogIn, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
}: HeaderProps) {
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
		<header className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-indigo-50/80 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
			<div className="flex w-full items-center justify-between gap-3">
				<div className="flex items-center flex-1"></div>

				<div className="flex items-center gap-3">
					{likedCount > 0 && loggedIn === true && (
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
									className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl text-sm"
								>
									<LogIn size={18} className="transition" />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl text-sm"
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
							className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl text-sm"
						>
							Logout
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
