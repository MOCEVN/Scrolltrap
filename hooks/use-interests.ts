'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'scrolltrap_interests';

const readStoredInterests = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? (parsed.filter((item) => typeof item === 'string') as string[])
      : [];
  } catch (error) {
    console.error('Failed to parse stored interests', error);
    return [];
  }
};

export const useInterests = () => {
  const [interests, setInterests] = useState<string[]>(() => readStoredInterests());
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(interests));
    } catch (error) {
      console.error('Failed to store interests', error);
    }
  }, [interests]);

  const updateInterests = useCallback((newInterests: string[]) => {
    setInterests(newInterests);
  }, []);

  const clearInterests = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    setInterests([]);
  }, []);

  return {
    interests,
    updateInterests,
    clearInterests,
    isLoading: false as const,
  } as const;
};
