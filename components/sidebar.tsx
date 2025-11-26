"use client";

import type { LucideIcon } from "lucide-react";
import { Home as HomeIcon, Info, PlusCircle, User, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavKey = "home" | "create" | "profile" | "info" | "doom";

const NAV_ITEMS: Array<{
  key: NavKey;
  label: string;
  icon: LucideIcon;
  isReady: boolean;
  href: string;
  hasNotification?: boolean;
}> = [
  { key: 'home', label: 'Home', icon: HomeIcon, isReady: true, href: '/' },
  { key: 'create', label: 'Create', icon: PlusCircle, isReady: true, href: '/create' },
  { key: 'profile', label: 'Profile', icon: User, isReady: true, href: '/profile' },
  { key: 'info', label: 'Info', icon: Info, isReady: true, href: '/info' },
  { key: 'doom', label: 'Doom', icon: Video, isReady: true, href: '/doom', hasNotification: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const activeNav: NavKey | undefined = NAV_ITEMS.find(item => item.href === pathname)?.key;

  return (
    <aside className="hidden min-h-screen w-24 flex-col items-center border-r border-sidebar-border bg-sidebar px-3 py-6 shadow-sm sm:flex lg:w-32">
      
      <div className="flex flex-col items-center text-xs font-semibold uppercase tracking-[0.35em] text-sidebar-foreground/70">
        <span>Scroll</span>
        <span className="text-sidebar-primary">Trap</span>
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon, isReady, href, hasNotification }) => {
          const isActive = activeNav === key;

          const classes = `
            flex w-full flex-col items-center gap-1 rounded-xl px-3 py-2 text-s font-medium transition
            ${
              isActive
                ? "text-primary font-semibold"
                : "text-sidebar-foreground hover:text-sidebar-accent-foreground/60"
            }
            ${!isReady ? "cursor-not-allowed opacity-40" : ""}
          `;

          const inner = (
           <div className={classes} title={isReady ? label : `${label} (coming soon)`}>
      <div className="relative flex items-center justify-center">
        <Icon className="h-6 w-8" strokeWidth={isActive ? 2.4 : 1.8} />
        {hasNotification && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
      <span>{label}</span>
    </div>
          );

          if (isReady) {
            return (
              <Link href={href} key={key} className="w-full">
                {inner}
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
