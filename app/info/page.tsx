"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useScenarioMode } from "@/hooks/use-scenario-mode";

interface DarkPattern {
  title: string;
  dark: string;
  light: string;
}

export default function Create() {
  const darkPatterns: DarkPattern[] = [
    {
      title: "Infinite Scroll",
      dark: "Never-ending content with no natural stopping points",
      light:
        "Natural break points every 20 images with pause prompts and time awareness",
    },
    {
      title: "Likes & Engagement",
      dark: "Addictive mechanics with public counters creating competition",
      light: "Likes are private and only for easier access later",
    },
    {
      title: "Content Algorithm",
      dark: "Engagement-maximizing content that addicts users using algorithms",
      light: "Diverse content based on your own interests",
    },
    {
      title: "Time Pressure",
      dark: "FOMO tactics, streaks, and urgent notifications",
      light: "Gentle time awareness and encouragement to take breaks",
    },
    {
      title: "Deleting your account",
      dark: "You can enjoy a long conversation with our customerservice 020-12345678910",
      light: "You have the power to do anything with your information",
    },
  ];

  const { isDoom } = useScenarioMode();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      isDoom ? "bg-slate-950 text-slate-100" : "bg-background text-slate-900"
    }`}>
     
      <Sidebar />

     
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <h1 className={`text-3xl font-bold mb-6 text-center transition-colors duration-300 ${
              isDoom ? "text-slate-100" : "text-slate-900"
            }`}>
              Dark Pattern vs. Our Approach
            </h1>

            {darkPatterns.map((pattern) => (
              <div key={pattern.title} className="mb-6">
                <h2 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDoom ? "text-slate-100" : "text-slate-900"
                }`}>
                  {pattern.title}
                </h2>

          
                <div className={`border-l-4 p-3 mb-2 rounded-md transition-colors duration-300 ${
                  isDoom 
                    ? "bg-red-950/50 border-red-500" 
                    : "bg-red-50 border-red-400"
                }`}>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDoom ? "text-red-300" : "text-red-800"
                  }`}>
                    ❌ <strong>Dark Pattern:</strong> {pattern.dark}
                  </p>
                </div>

        
                <div className={`border-l-4 p-3 rounded-md transition-colors duration-300 ${
                  isDoom 
                    ? "bg-emerald-950/50 border-emerald-500" 
                    : "bg-green-50 border-green-400"
                }`}>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDoom ? "text-emerald-300" : "text-green-800"
                  }`}>
                    ✅ <strong>Our Approach:</strong> {pattern.light}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
