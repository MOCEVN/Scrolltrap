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
		<header className="border-b border-border bg-card px-4 py-10 shadow-sm backdrop-blur sm:px-6">
			<div className="flex w-full items-center justify-between gap-3">
				<div className="flex items-center flex-1"></div>

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
		</header>
	)}
      