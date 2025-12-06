"use client";

import { createContext, useContext } from "react";

export type ScenarioMode = "dream" | "doom";

interface ScenarioModeContextValue {
  mode: ScenarioMode;
  setMode: (mode: ScenarioMode) => void;
  toggleMode: () => void;
  isDoom: boolean;
}

const ScenarioModeContext = createContext<ScenarioModeContextValue | null>(null);

export const useScenarioMode = () => useContext(ScenarioModeContext)!;

export { ScenarioModeContext };
