"use client";

import {
	ScenarioModeContext,
	type ScenarioMode,
} from "@/hooks/use-scenario-mode";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function ScenarioModeProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const isFeedPath = pathname === "/" || pathname === "/doom";
	const feedMode: ScenarioMode = pathname === "/doom" ? "doom" : "dream";
	const [mode, setMode] = useState<ScenarioMode>(feedMode);

	useEffect(() => {
		if (pathname !== "/" || typeof window === "undefined") return;
		if (sessionStorage.getItem("first_visit") === "true") return;

		sessionStorage.setItem("first_visit", "true");
		setMode("doom");
		router.replace("/doom");
	}, [pathname, router]);

	useEffect(() => {
		if (!isFeedPath) return;
		setMode(feedMode);
	}, [feedMode, isFeedPath]);

	const toggleMode = () => {
		const next = mode === "doom" ? "dream" : "doom";

		if (isFeedPath) {
			router.push(next === "doom" ? "/doom" : "/");
		}

		setMode(next);
	};

	return (
		<ScenarioModeContext.Provider
			value={{ mode, setMode, toggleMode, isDoom: mode === "doom" }}
		>
			{children}
		</ScenarioModeContext.Provider>
	);
}
