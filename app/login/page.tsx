"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";

export default function DarkLogin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSubmitting) {
			return;
		}

		if (!username || !password) {
			toast.error("Please fill in both fields.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ username, password }),
			});

			const payload = await response.json();

			if (!response.ok) {
				const message =
					typeof payload.error === "string"
						? payload.error
						: "We couldn't log you in.";
				toast.error(message);
				return;
			}

			toast.success(`Welcome back, ${payload.user.username}!`);
			setTimeout(() => router.push("/profile"), 800);
		} catch (error) {
			console.error("Login failed", error);
			toast.error("Unable to reach the server. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-gray-900 flex items-center justify-center px-4">
			{/* Terug naar Home knop linksboven */}
			{/* <div className="absolute top-4 left-4">
				<Button
					onClick={() => router.push("/")}
					className="flex items-center text-gray-400 hover:text-white"
					variant="default"
				>
					<HiOutlineArrowLeft size={20} className="mr-2" />
					Back to Home
				</Button>
			</div> */}

			{/* Login card */}
			<div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-xl">
				<h1 className="text-4xl font-bold text-center mb-6 text-white">
					Login
				</h1>
				<p className="text-gray-400 text-center mb-8">
					Welcome back! Please enter your credentials to log in.
				</p>

				<form onSubmit={handleLogin} className="space-y-6">
					{/* Gebruikersnaam */}
					<div>
						<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
							<HiOutlineUser className="text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Username"
								className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
							/>
						</div>
					</div>

					{/* Wachtwoord */}
					<div>
						<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
							<HiOutlineLockClosed className="text-gray-400" size={20} />
							<input
								type="password"
								placeholder="Password"
								className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
							/>
						</div>
					</div>

					{/* Login knop */}
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center transition"
					>
						{isSubmitting ? "Logging in..." : "Log in"}
					</Button>
				</form>

				{/* Extra tekst */}
				<div className="mt-6 text-center text-gray-400">
					<span>No account yet? </span>
					<Link href="/register">
						<Button
							className="text-indigo-500 font-semibold ml-1"
							variant="ghost"
						>
							Register
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
