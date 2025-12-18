'use client';

import { useScenarioMode } from '@/hooks/use-scenario-mode';
import type React from 'react';

interface InterestSelectorProps {
  interests: string[];
  onInterestsUpdate?: (next: string[]) => void;
}

const AVAILABLE_INTERESTS = [
  'nature',
  'office',
  'people',
  'technology',
  'abstract',
  'food',
  'sport',
  'science',
] as const;

export const InterestSelector: React.FC<InterestSelectorProps> = ({
  interests,
  onInterestsUpdate,
}) => {
  const { isDoom } = useScenarioMode();

  const toggleInterest = (interest: string) => {
    const includes = interests.includes(interest);
    const next = includes
      ? interests.filter((item) => item !== interest)
      : [...interests, interest];

    onInterestsUpdate?.(next);
  };

  return (
    <section className={`mx-auto mb-6 w-full max-w-5xl rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
      isDoom 
        ? "border-red-900/30 bg-slate-800" 
        : "border-slate-200 bg-white"
    }`}>
      <header className="mb-4">
        <p className={`text-sm font-semibold transition-colors duration-300 ${
          isDoom ? "text-slate-200" : "text-slate-800"
        }`}>Your Interests</p>
        {interests.length > 0 ? (
          <p className={`text-xs transition-colors duration-300 ${
            isDoom ? "text-slate-400" : "text-slate-500"
          }`}>
            {interests.length} {interests.length === 1 ? 'topic' : 'topics'} selected
          </p>
        ) : (
          <p className={`text-xs font-medium transition-colors duration-300 ${
            isDoom ? "text-red-400" : "text-emerald-600"
          }`}>
            👋 Select topics to get started
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_INTERESTS.map((interest) => {
          const isActive = interests.includes(interest);

          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? isDoom
                    ? "border-red-500 bg-red-950 text-red-300"
                    : "border-emerald-400 bg-emerald-100 text-emerald-700"
                  : isDoom
                    ? "border-slate-600 bg-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-300"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
              }`}
              aria-pressed={isActive}
            >
              {interest}
            </button>
          );
        })}
      </div>
      <p className={`mt-3 text-xs leading-5 transition-colors duration-300 ${
        isDoom ? "text-slate-400" : "text-slate-500"
      }`}>
        Tap a chip to select or deselect the topics you want to explore.
      </p>
    </section>
  );
};

export default InterestSelector;
