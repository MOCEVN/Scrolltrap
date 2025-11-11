"use client";

import clsx from "clsx";

import { useScenario } from "@/hooks/use-scenario";

const OPTIONS = [
	{ mode: "dream", label: "Dream" },
	{ mode: "doom", label: "Doom" },
] as const;

const ScenarioSwitch = () => {
	const { mode, setMode } = useScenario();

	return (
		<div className="inline-flex items-stretch rounded-full border border-slate-200 bg-white p-1 shadow-sm">
			{OPTIONS.map((option) => {
				const isActive = mode === option.mode;
				return (
					<button
						key={option.mode}
						type="button"
						onClick={() => setMode(option.mode)}
						className={clsx(
							"relative min-w-[120px] rounded-full px-4 py-2  text-xs font-semibold transition",
							isActive
								? "bg-slate-900 text-white shadow"
								: "text-slate-500 hover:text-slate-700",
						)}
						aria-pressed={isActive}
					>
						<span className="block text-sm font-bold leading-tight">
							{option.label}
						</span>
					</button>
				);
			})}
		</div>
	);
};

export default ScenarioSwitch;
