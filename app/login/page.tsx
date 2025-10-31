"use client";

import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

interface UserMock {
	username: string;
	password: string;
}

const MOCK_USER: UserMock = {
	username: "testuser",
	password: "1234",
};

export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const handleLogin = () => {
		if (username === MOCK_USER.username && password === MOCK_USER.password) {
			toast.success("Welkom 👋 Je bent succesvol ingelogd!");

			setTimeout(() => {
				router.replace("/profile");
			}, 1000);
		} else {
			toast.error("Ongeldige gebruikersnaam of wachtwoord");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-8">
			<div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-lg">
				<h1 className="text-3xl font-extrabold text-center text-slate-800 mb-8">
					Inloggen
				</h1>

				{/* Gebruikersnaam */}
				<div className="w-full mb-4">
					<div className="flex items-center border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50">
						<User size={20} className="text-slate-500" />
						<input
							type="text"
							className="flex-1 ml-3 bg-transparent outline-none text-gray-700"
							placeholder="Gebruikersnaam"
							value={username}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setUsername(e.target.value)
							}
						/>
					</div>
				</div>

				{/* Wachtwoord */}
				<div className="w-full mb-2">
					<div className="flex items-center border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50">
						<Lock size={20} className="text-slate-500" />
						<input
							type="password"
							className="flex-1 ml-3 bg-transparent outline-none text-gray-700"
							placeholder="Wachtwoord"
							value={password}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setPassword(e.target.value)
							}
						/>
					</div>
				</div>

				{/* Wachtwoord vergeten */}
				<Button className="text-blue-600 text-sm font-medium mb-6 float-right">
					Wachtwoord vergeten?
				</Button>

				{/* Login knop */}
				<Button
					onClick={handleLogin}
					className="bg-blue-600 rounded-2xl w-full py-3 shadow-md text-white text-lg font-semibold"
				>
					Log in
				</Button>

				{/* Extra tekst */}
				<div className="flex justify-center mt-6">
					<p className="text-gray-500">Nog geen account?</p>
					<Button
						onClick={() => toast("Registratie komt later 😉")}
						className="text-blue-600 font-semibold ml-1"
					>
						Registreer
					</Button>
				</div>
			</div>
		</div>
	);
}
