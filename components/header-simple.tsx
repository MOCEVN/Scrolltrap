"use client";

import { LogIn, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function HeaderSimple() {
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

				<div className="flex items-center gap-4">
					{loggedIn === false && (
						<>
							<Link href="/login">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl"
								>
									<LogIn size={20} className="transition" />
									Login
								</Button>
							</Link>

							<Link href="/register">
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl"
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
							className="flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 rounded-xl"
						>
							Logout
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
