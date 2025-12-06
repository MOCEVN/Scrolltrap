"use client";

import { Button } from "@/components/ui/button";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
} from "react-icons/hi2";

export default function DarkRegister() {
	const { isDoom } = useScenarioMode();
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSubmitting) {
			return;
		}

		if (!username || !email || !password || !confirm) {
			toast.error("Please fill in all fields.");
			return;
		}

		if (password !== confirm) {
			toast.error("Passwords do not match.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ username, email, password }),
			});

			const payload = await response.json();

			if (!response.ok) {
				const message =
					typeof payload.error === "string"
						? payload.error
						: "We couldn't create your account.";
				toast.error(message);
				return;
			}

			toast.success("Account created ✅");
			setTimeout(() => router.push("/profile"), 800);
		} catch (error) {
			console.error("Register failed", error);
			toast.error("Unable to reach the server. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={`relative min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
			isDoom ? "bg-slate-950" : "bg-slate-100"
		}`}>
			{/* Register card */}
			<div className={`w-full max-w-md rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
				isDoom ? "bg-slate-800" : "bg-white"
			}`}>
				<h1 className={`text-4xl font-bold text-center mb-6 transition-colors duration-300 ${
					isDoom ? "text-white" : "text-slate-900"
				}`}>
					Register
				</h1>

				<p className={`text-center mb-8 transition-colors duration-300 ${
					isDoom ? "text-slate-400" : "text-slate-600"
				}`}>
					Create your account to get started.
				</p>

				<form onSubmit={handleRegister} className="space-y-5">
					{/* Username */}
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
								minLength={3}
								maxLength={30}
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<div className={`flex items-center rounded-xl px-4 py-3 transition-colors duration-300 ${
							isDoom ? "bg-slate-700" : "bg-slate-100"
						}`}>
							<HiOutlineEnvelope className={`transition-colors duration-300 ${
								isDoom ? "text-slate-400" : "text-slate-500"
							}`} size={20} />
							<input
								type="email"
								placeholder="Email"
								className={`ml-3 flex-1 bg-transparent outline-none transition-colors duration-300 ${
									isDoom ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-500"
								}`}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
							/>
						</div>
					</div>

					{/* Password */}
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
								autoComplete="new-password"
							/>
						</div>
					</div>

					{/* Confirm Password */}
					<div>
						<div className={`flex items-center rounded-xl px-4 py-3 transition-colors duration-300 ${
							isDoom ? "bg-slate-700" : "bg-slate-100"
						}`}>
							<HiOutlineLockClosed className={`transition-colors duration-300 ${
								isDoom ? "text-slate-400" : "text-slate-500"
							}`} size={20} />
							<input
								type="password"
								placeholder="Confirm Password"
								className={`ml-3 flex-1 bg-transparent outline-none transition-colors duration-300 ${
									isDoom ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-500"
								}`}
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								autoComplete="new-password"
							/>
						</div>
					</div>

					{/* Register button */}
					<Button
						type="submit"
						disabled={isSubmitting}
						className={`w-full py-3 disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center transition ${
							isDoom ? "bg-red-600 hover:bg-red-500" : "bg-emerald-500 hover:bg-emerald-600"
						}`}
					>
						{isSubmitting ? "Creating account..." : "Create Account"}
					</Button>
				</form>

				{/* Extra tekst */}
				<div className={`mt-6 text-center transition-colors duration-300 ${
					isDoom ? "text-slate-400" : "text-slate-600"
				}`}>
					<span>Already have an account?</span>
					<Button
						onClick={() => router.push("/login")}
						className={`font-semibold ml-1 ${
							isDoom ? "text-red-400" : "text-emerald-600"
						}`}
						variant="ghost"
					>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
