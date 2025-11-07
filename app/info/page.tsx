"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

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
  ];

  return (
    <div className="flex min-h-screen bg-background text-slate-900">
     
      <Sidebar />

     
      <div className="flex-1 flex flex-col">
        <Header
          showLikedOnly={false}
          likedCount={0}
          onToggleShowLiked={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
          handleSearch={() => {}}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
              Dark Pattern vs. Our Approach
            </h1>

            {darkPatterns.map((pattern) => (
              <div key={pattern.title} className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
                  {pattern.title}
                </h2>

          
                <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-2 rounded-md">
                  <p className="text-red-800 text-sm">
                    ❌ <strong>Dark Pattern:</strong> {pattern.dark}
                  </p>
                </div>

        
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md">
                  <p className="text-green-800 text-sm">
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
