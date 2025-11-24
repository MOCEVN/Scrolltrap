"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
	HiOutlineEnvelope,
	HiOutlineLockClosed,
	HiOutlineUser,
} from "react-icons/hi2";

export default function DarkRegister() {
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
		<div className="relative min-h-screen bg-gray-900 flex items-center justify-center px-4">
			{/* Register card */}
			<div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-xl">
				<h1 className="text-4xl font-bold text-center mb-6 text-white">
					Register
				</h1>

				<p className="text-gray-400 text-center mb-8">
					Create your account to get started.
				</p>

				<form onSubmit={handleRegister} className="space-y-5">
					{/* Username */}
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
								minLength={3}
								maxLength={30}
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
							<HiOutlineEnvelope className="text-gray-400" size={20} />
							<input
								type="email"
								placeholder="Email"
								className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
							<HiOutlineLockClosed className="text-gray-400" size={20} />
							<input
								type="password"
								placeholder="Password"
								className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
							/>
						</div>
					</div>

					{/* Confirm Password */}
					<div>
						<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
							<HiOutlineLockClosed className="text-gray-400" size={20} />
							<input
								type="password"
								placeholder="Confirm Password"
								className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
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
						className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center transition"
					>
						{isSubmitting ? "Creating account..." : "Create Account"}
					</Button>
				</form>

				{/* Extra tekst */}
				<div className="mt-6 text-center text-gray-400">
					<span>Already have an account?</span>
					<Button
						onClick={() => router.push("/login")}
						className="text-indigo-500 font-semibold ml-1"
						variant="ghost"
					>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
