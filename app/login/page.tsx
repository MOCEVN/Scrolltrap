"use client";

import { Button } from "@/components/ui/button"; // jouw button component
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	HiOutlineArrowLeft,
	HiOutlineLockClosed,
	HiOutlineUser,
} from "react-icons/hi";

const MOCK_USER = {
	username: "testuser",
	password: "1234",
};

export default function DarkLogin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = () => {
		if (username === MOCK_USER.username && password === MOCK_USER.password) {
			toast.success("Welcome 👋 You're logged in!");
			setTimeout(() => router.push("/profile"), 1000);
		} else {
			toast.error("Invalid username or password.");
		}
	};

	return (
		<div className="relative min-h-screen bg-gray-900 flex items-center justify-center px-4">
			{/* Terug naar Home knop linksboven */}
			<div className="absolute top-4 left-4">
				<Button
					onClick={() => router.push("/")}
					className="flex items-center text-gray-400 hover:text-white"
					variant="default"
				>
					<HiOutlineArrowLeft size={20} className="mr-2" />
					Back to Home
				</Button>
			</div>

			{/* Login card */}
			<div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-xl">
				<h1 className="text-4xl font-bold text-center mb-6 text-white">
					Login
				</h1>
				<p className="text-gray-400 text-center mb-8">
					Welcome back! Please enter your credentials to log in.
				</p>

				{/* Gebruikersnaam */}
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

				{/* Wachtwoord */}
				<div className="mb-6">
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

				{/* Login knop */}
				<Button
					onClick={handleLogin}
					className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center transition"
				>
					Log in
				</Button>

				{/* Extra tekst */}
				<div className="mt-6 text-center text-gray-400">
					<span>No account yet? </span>
					<Button
						onClick={() => toast("Registratie komt later 😉")}
						className="text-indigo-500 font-semibold ml-1"
						variant="ghost"
					>
						Register
					</Button>
				</div>
			</div>
		</div>
	);
}
