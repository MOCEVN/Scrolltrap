"use client";

import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export type ScenarioMode = "dream" | "doom";

type ScenarioContextValue = {
	mode: ScenarioMode;
	isDream: boolean;
	isDoom: boolean;
	setMode: Dispatch<SetStateAction<ScenarioMode>>;
	toggleMode: () => void;
};

const ScenarioContext = createContext<ScenarioContextValue | undefined>(undefined);

const STORAGE_KEY = "scrolltrap_scenario_mode";

export const ScenarioProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setModeState] = useState<ScenarioMode>(() => {
		if (typeof window === "undefined") {
			return "dream";
		}

		const stored = window.localStorage.getItem(STORAGE_KEY);
		return stored === "doom" ? "doom" : "dream";
	});
	const hasHydratedRef = useRef(false);

	useEffect(() => {
		hasHydratedRef.current = true;
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		if (!hasHydratedRef.current) {
			return;
		}

		window.localStorage.setItem(STORAGE_KEY, mode);
	}, [mode]);

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}

		const root = document.documentElement;
		const body = document.body;

		root.dataset.scenarioMode = mode;
		root.classList.toggle("scenario-dream", mode === "dream");
		root.classList.toggle("scenario-doom", mode === "doom");

		if (body) {
			body.dataset.scenarioMode = mode;
		}
	}, [mode]);

	const setMode = useCallback<Dispatch<SetStateAction<ScenarioMode>>>((next) => {
		setModeState((prev) => {
			const resolved = typeof next === "function" ? next(prev) : next;
			return prev === resolved ? prev : resolved;
		});
	}, []);

	const toggleMode = useCallback(() => {
		setModeState((prev) => (prev === "dream" ? "doom" : "dream"));
	}, []);

	const value = useMemo<ScenarioContextValue>(
		() => ({
			mode,
			isDream: mode === "dream",
			isDoom: mode === "doom",
			setMode,
			toggleMode,
		}),
		[mode, setMode, toggleMode],
	);

	return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
};

export const useScenario = () => {
	const context = useContext(ScenarioContext);
	if (!context) {
		throw new Error("useScenario must be used within a ScenarioProvider");
	}
	return context;
};
