'use client';

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
  const toggleInterest = (interest: string) => {
    const includes = interests.includes(interest);
    const next = includes
      ? interests.filter((item) => item !== interest)
      : [...interests, interest];

    onInterestsUpdate?.(next);
  };

  return (
    <section className="mx-auto mb-6 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <p className="text-sm font-semibold text-slate-800">Your Interests</p>
        {interests.length > 0 ? (
          <p className="text-xs text-slate-500">
            {interests.length} {interests.length === 1 ? 'topic' : 'topics'} selected
          </p>
        ) : (
          <p className="text-xs font-medium text-indigo-600">
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
              className={`interestButton ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
            >
              {interest}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Tap a chip to select or deselect the topics you want to explore.
      </p>
    </section>
  );
};

export default InterestSelector;
