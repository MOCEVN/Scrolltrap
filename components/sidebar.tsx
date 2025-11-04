"use client";

import type { LucideIcon } from "lucide-react";
import { Compass, Home as HomeIcon, Info, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavKey = "home" | "explore" | "create" | "profile" | "info";

const NAV_ITEMS: Array<{
  key: NavKey;
  label: string;
  icon: LucideIcon;
  isReady: boolean;
  href: string;
}> = [
  { key: 'home', label: 'Home', icon: HomeIcon, isReady: true, href: '/' },
  { key: 'explore', label: 'Explore', icon: Compass, isReady: false, href: '/explore' },
  { key: 'create', label: 'Create', icon: PlusCircle, isReady: true, href: '/create' },
  { key: 'profile', label: 'Profile', icon: User, isReady: true, href: '/profile' },
  { key: 'info', label: 'Info', icon: Info, isReady: false, href: '/info' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const activeNav: NavKey | undefined = NAV_ITEMS.find(item => item.href === pathname)?.key;

  return (
    <aside className="hidden min-h-screen w-24 flex-col items-center border-r border-sidebar-border bg-sidebar px-3 py-6 shadow-sm sm:flex lg:w-32">
      
      {/* Logo */}
      <div className="flex flex-col items-center text-xs font-semibold uppercase tracking-[0.35em] text-sidebar-foreground/70">
        <span>Scroll</span>
        <span className="text-sidebar-primary">Trap</span>
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon, isReady, href }) => {
          const isActive = activeNav === key;

          const classes = `
            flex w-full flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition
            ${
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }
            ${!isReady ? "cursor-not-allowed opacity-40" : ""}
          `;

          const inner = (
            <div className={classes} title={isReady ? label : `${label} (coming soon)`}>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
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
