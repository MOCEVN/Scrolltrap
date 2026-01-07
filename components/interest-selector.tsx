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
    <section
      className={`w-full transition-colors duration-300 ${
        isDoom ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p
          className={`text-sm font-semibold transition-colors duration-300 ${
            isDoom ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          Topics
        </p>
        <p
          className={`text-xs transition-colors duration-300 ${
            interests.length === 0
              ? isDoom
                ? 'text-red-400'
                : 'text-emerald-600'
              : isDoom
                ? 'text-slate-400'
                : 'text-slate-500'
          }`}
        >
          {interests.length === 0
            ? 'Select a few to get started'
            : `${interests.length} selected`}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {AVAILABLE_INTERESTS.map((interest) => {
          const isActive = interests.includes(interest);

          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`inline-flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? isDoom
                    ? 'border-red-500 bg-red-950 text-red-300'
                    : 'border-emerald-400 bg-emerald-100 text-emerald-700'
                  : isDoom
                    ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'
              }`}
              aria-pressed={isActive}
            >
              <span className="capitalize">{interest}</span>
              <span className="text-xs opacity-70">{isActive ? 'On' : 'Off'}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default InterestSelector;
