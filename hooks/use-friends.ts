'use client';

import { useCallback, useEffect, useState } from 'react';

export type Friend = {
  id: number;
  name: string;
  avatar: string;
  mutual: number;
};

const STORAGE_KEY = 'scrolltrap_friends';
const ADDED_FRIENDS_KEY = 'scrolltrap_added_friends';

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Riley', 'Morgan', 'Casey', 'Jamie', 'Avery'];
const LAST_NAMES = ['Smith', 'Lee', 'Martinez', 'Johnson', 'Patel', 'Kim', 'Nguyen', 'Walker'];

const generateFriends = (count: number): Friend[] => {
  return Array.from({ length: count }, (_, i) => {
    const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
    return {
      id: i + 1,
      name,
      avatar: `https://api.dicebear.com/8.x/personas/svg?seed=${name.replace(' ', '')}`,
      mutual: Math.floor(Math.random() * 15),
    };
  });
};

const readStoredFriends = (key: string): Friend[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Friend[];
  } catch {
    return [];
  }
};

export const useFriends = () => {
  const [suggestions, setSuggestions] = useState<Friend[]>(() => {
    const stored = readStoredFriends(STORAGE_KEY);
    if (stored.length > 0) return stored;
    const generated = generateFriends(12);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
    }
    return generated;
  });

  const [addedFriends, setAddedFriends] = useState<Friend[]>(() =>
    readStoredFriends(ADDED_FRIENDS_KEY),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ADDED_FRIENDS_KEY, JSON.stringify(addedFriends));
  }, [addedFriends]);

  const addFriend = useCallback((friend: Friend) => {
    setAddedFriends((prev) => {
      if (prev.some((f) => f.id === friend.id)) return prev;
      return [...prev, friend];
    });
  }, []);

  const removeFriend = useCallback((friendId: number) => {
    setAddedFriends((prev) => prev.filter((f) => f.id !== friendId));
  }, []);

  const clearFriends = useCallback(() => {
    setAddedFriends([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADDED_FRIENDS_KEY);
    }
  }, []);

  const isFriendAdded = useCallback(
    (friendId: number) => addedFriends.some((f) => f.id === friendId),
    [addedFriends],
  );

  return {
    suggestions,
    addedFriends,
    addFriend,
    removeFriend,
    clearFriends,
    isFriendAdded,
  } as const;
};
