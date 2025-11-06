"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { ScenarioProvider } from "@/hooks/use-scenario";

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ScenarioProvider>
			<Toaster />
			{children}
		</ScenarioProvider>
	);
};

export default Providers;
