'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type Friend = {
  id: number;
  name: string;
  avatar: string;
  mutual: number;
};

const MESSAGES = [
  'shared a photo with you!',
  'sent you a message 💬',
  'liked your post ❤️',
  'mentioned you in a comment',
  'started following you',
  'invited you to an event 🎉',
];

type FriendNotificationsProps = {
  friends: Friend[];
};

export default function FriendNotifications({ friends }: FriendNotificationsProps) {
  const pathname = usePathname();
  const isDoom = pathname === '/doom';
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDoom || friends.length === 0) return;

    const scheduleNotification = () => {
      const delay = 5000 + Math.random() * 5000; 

      timeoutRef.current = setTimeout(() => {
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-zinc-900 p-4 text-white shadow-lg`}
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-600">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{friend.name}</p>
                <p className="truncate text-xs text-zinc-400">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="flex-shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
              >
                View
              </button>
            </div>
          ),
          { duration: 8000, position: 'top-right' },
        );

        scheduleNotification();
      }, delay);
    };

    scheduleNotification();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDoom, friends, router]);

  return null;
}
