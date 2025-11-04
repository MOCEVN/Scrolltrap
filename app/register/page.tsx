"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

	const handleRegister = () => {
		if (!username || !email || !password || !confirm) {
			toast.error("Please fill in all fields.");
			return;
		}

		if (password !== confirm) {
			toast.error("Passwords do not match.");
			return;
		}

		toast.success("Account created ✅");
		setTimeout(() => router.push("/login"), 1200);
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

				{/* Username */}
				<div className="mb-4">
					<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
						<HiOutlineUser className="text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Username"
							className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
				</div>

				{/* Email */}
				<div className="mb-4">
					<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
						<HiOutlineEnvelope className="text-gray-400" size={20} />
						<input
							type="email"
							placeholder="Email"
							className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>

				{/* Password */}
				<div className="mb-4">
					<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
						<HiOutlineLockClosed className="text-gray-400" size={20} />
						<input
							type="password"
							placeholder="Password"
							className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>

				{/* Confirm Password */}
				<div className="mb-6">
					<div className="flex items-center bg-gray-700 rounded-xl px-4 py-3">
						<HiOutlineLockClosed className="text-gray-400" size={20} />
						<input
							type="password"
							placeholder="Confirm Password"
							className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-gray-400"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
						/>
					</div>
				</div>

				{/* Register button */}
				<Button
					onClick={handleRegister}
					className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center transition"
				>
					Create Account
				</Button>

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
