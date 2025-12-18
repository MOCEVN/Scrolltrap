"use client";

import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { Moon, Sun } from "lucide-react";

export function ScenarioToggle() {
	const { toggleMode, isDoom } = useScenarioMode();

	return (
		<button
			onClick={toggleMode}
			className={`flex items-center gap-1 p-1 rounded-full transition-all ${
				isDoom ? "bg-slate-800" : "bg-slate-200"
			}`}
		>
			<div
				className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
					!isDoom ? "bg-white text-emerald-700" : "text-slate-500"
				}`}
			>
				<Sun size={14} />
				Dream
			</div>
			<div
				className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
					isDoom ? "bg-red-500/20 text-red-300" : "text-slate-500"
				}`}
			>
				<Moon size={14} />
				Doom
			</div>
		</button>
	);
}
