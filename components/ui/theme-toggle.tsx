"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";

export default function ThemeToggle() {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const saved = localStorage.getItem("theme");
		if (saved) {
			setTheme(saved);
			document.documentElement.classList.toggle("dark", saved === "dark");
		}
	}, []);

	const toggleTheme = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.classList.toggle("dark", next === "dark");
	};

	return (
		<Button 
			onClick={toggleTheme}
			className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
		>
			{theme === "dark" ? "Light Mode" : "Dark Mode"}
		</Button>
	);
}
