'use client';

import type { LucideIcon } from 'lucide-react';
import { Compass, Home as HomeIcon, Info, PlusCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavKey = 'home' | 'explore' | 'create' | 'profile' | 'info';

const NAV_ITEMS: Array<{
  key: NavKey;
  label: string;
  icon: LucideIcon;
  isReady: boolean;
  href: string;
}> = [
  { key: 'home', label: 'Home', icon: HomeIcon, isReady: true, href: '/' },
  { key: 'explore', label: 'Explore', icon: Compass, isReady: false, href: '/explore' },
  { key: 'create', label: 'Create', icon: PlusCircle, isReady: false, href: '/create' },
  { key: 'profile', label: 'Profile', icon: User, isReady: true, href: '/profile' },
  { key: 'info', label: 'Info', icon: Info, isReady: false, href: '/info' },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Determine which nav item is active based on current path
  const activeNav: NavKey | undefined = NAV_ITEMS.find(item => item.href === pathname)?.key;

  return (
    <aside className="hidden min-h-screen w-24 flex-col items-center border-r border-slate-200 bg-white px-3 py-6 shadow-sm sm:flex lg:w-32">
      <div className="flex flex-col items-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
        <span>Scroll</span>
        <span className="text-indigo-500">Trap</span>
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon, isReady, href }) => {
          const isActive = activeNav === key;

          const inner = (
            <div
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              } ${!isReady ? 'cursor-not-allowed opacity-40' : ''}`}
              title={isReady ? label : `${label} (coming soon)`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span>{label}</span>
            </div>
          );

          if (isReady) {
            return (
              <Link href={href} key={key} className="w-full">
                <div>{inner}</div>
              </Link>
            );
          }

          return (
            <div key={key} className="w-full" aria-disabled="true">
              {inner}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
