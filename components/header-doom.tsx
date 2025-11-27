"use client";

import { LogIn, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function HeaderDoom(){
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
		<header className="border-b border-red-900/30 bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900 px-4 py-4 shadow-lg backdrop-blur sm:px-6">
			<div className="flex w-full items-center justify-between gap-3">
				<div className="flex items-center flex-1"></div>

				<div className="flex items-center gap-4">
					{loggedIn === false && (
						<>
							<Link href="/login">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 transition hover:bg-red-500/30 hover:text-white rounded-xl border border-red-500/30"
								>
									<LogIn size={20} className="transition" />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 transition hover:bg-red-500/30 hover:text-white rounded-xl border border-red-500/30"
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
							className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 transition hover:bg-red-500/30 hover:text-white rounded-xl border border-red-500/30"
						>
							Logout
						</Button>
					)}
				</div>
			</div>
		</header>
	)}
      