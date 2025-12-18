"use client";

import { Button } from "@/components/ui/button";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";

export default function DarkLogin() {
	const { isDoom } = useScenarioMode();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const validateForm = (username: string, password: string) => {
		if (!username || !password) {
			toast.error("Please fill in both fields.");
			return false;
		}
		return true;
	};

	const sendLoginRequest = async (username: string, password: string) => {
		return await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ username, password }),
		});
	};

	const handleResponse = async (response: Response, router: any) => {
		const payload = await response.json();

		if (!response.ok) {
			const message =
				typeof payload.error === "string"
					? payload.error
					: "We couldn't log you in.";
			toast.error(message);
			return false;
		}

		toast.success(`Welcome back, ${payload.user.username}!`);
		setTimeout(() => router.push("/profile"), 800);
		return true;
	};

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSubmitting) return;

		if (!validateForm(username, password)) return;

		setIsSubmitting(true);

		try {
			const response = await sendLoginRequest(username, password);
			await handleResponse(response, router);
		} catch (error) {
			console.error("Login failed", error);
			toast.error("Unable to reach the server. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={`relative min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
			isDoom ? "bg-slate-950" : "bg-slate-100"
		}`}>
			{/* Login card */}
			<div className={`w-full max-w-md rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
				isDoom ? "bg-slate-800" : "bg-white"
			}`}>
				<h1 className={`text-4xl font-bold text-center mb-6 transition-colors duration-300 ${
					isDoom ? "text-white" : "text-slate-900"
				}`}>
					Login
				</h1>
				<p className={`text-center mb-8 transition-colors duration-300 ${
					isDoom ? "text-slate-400" : "text-slate-600"
				}`}>
					Welcome back! Please enter your credentials to log in.
				</p>

				<form onSubmit={handleLogin} className="space-y-6">
					{/* Gebruikersnaam */}
					<div>
						<div className={`flex items-center rounded-xl px-4 py-3 transition-colors duration-300 ${
							isDoom ? "bg-slate-700" : "bg-slate-100"
						}`}>
							<HiOutlineUser className={`transition-colors duration-300 ${
								isDoom ? "text-slate-400" : "text-slate-500"
							}`} size={20} />
							<input
								type="text"
								placeholder="Username"
								className={`ml-3 flex-1 bg-transparent outline-none transition-colors duration-300 ${
									isDoom ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-500"
								}`}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
							/>
						</div>
					</div>

					{/* Wachtwoord */}
					<div>
						<div className={`flex items-center rounded-xl px-4 py-3 transition-colors duration-300 ${
							isDoom ? "bg-slate-700" : "bg-slate-100"
						}`}>
							<HiOutlineLockClosed className={`transition-colors duration-300 ${
								isDoom ? "text-slate-400" : "text-slate-500"
							}`} size={20} />
							<input
								type="password"
								placeholder="Password"
								className={`ml-3 flex-1 bg-transparent outline-none transition-colors duration-300 ${
									isDoom ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-500"
								}`}
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
						className={`w-full py-3 disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center transition ${
							isDoom ? "bg-red-600 hover:bg-red-500" : "bg-emerald-500 hover:bg-emerald-600"
						}`}
					>
						{isSubmitting ? "Logging in..." : "Log in"}
					</Button>
				</form>

				{/* Extra tekst */}
				<div className={`mt-6 text-center transition-colors duration-300 ${
					isDoom ? "text-slate-400" : "text-slate-600"
				}`}>
					<span>No account yet? </span>
					<Link href="/register">
						<Button
							className={`font-semibold ml-1 ${
								isDoom ? "text-red-400" : "text-emerald-600"
							}`}
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
