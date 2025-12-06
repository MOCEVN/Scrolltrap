"use client";

import { useScenarioMode } from "@/hooks/use-scenario-mode";
import type { LucideIcon } from "lucide-react";
import { Home as HomeIcon, Info, PlusCircle, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavKey = "home" | "create" | "profile" | "friends" | "info";

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
  { key: 'friends', label: 'Friends', icon: Users, isReady: true, href: '/friends' },
  { key: 'info', label: 'Info', icon: Info, isReady: true, href: '/info' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDoom } = useScenarioMode();
  
  const getNavHref = (key: NavKey, originalHref: string): string => {
    if (key === "home") {
      return isDoom ? "/doom" : "/";
    }
    return originalHref;
  };

  const isActiveNav = (href: string): boolean => {
    if (href === "/") return pathname === "/" || pathname === "/doom";
    return pathname === href;
  };

  return (
    <aside className={`
      hidden min-h-screen w-24 flex-col items-center border-r px-3 py-6 shadow-sm sm:flex lg:w-32
      transition-colors duration-300
      ${isDoom 
        ? "border-red-900/30 bg-gradient-to-b from-slate-950 to-slate-900" 
        : "border-sidebar-border bg-sidebar"
      }
    `}>
      
      <div className={`
        flex flex-col items-center text-xs font-semibold uppercase tracking-[0.35em]
        transition-colors duration-300
        ${isDoom ? "text-slate-400" : "text-sidebar-foreground/70"}
      `}>
        <span>Scroll</span>
        <span className={`transition-colors duration-300 ${isDoom ? "text-red-500" : "text-sidebar-primary"}`}>
          Trap
        </span>
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon, isReady, href }) => {
          const navHref = getNavHref(key, href);
          const isActive = isActiveNav(href);

          const classes = `
            flex w-full flex-col items-center gap-1 rounded-xl px-3 py-2 text-s font-medium transition-colors duration-300
            ${
              isActive
                ? isDoom 
                  ? "text-red-400 font-semibold" 
                  : "text-primary font-semibold"
                : isDoom
                  ? "text-slate-400 hover:text-red-300"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground/60"
            }
            ${!isReady ? "cursor-not-allowed opacity-40" : ""}
          `;

          const inner = (
            <div className={classes} title={isReady ? label : `${label} (coming soon)`}>
              <div className="relative flex items-center justify-center">
                <Icon className="h-6 w-8" strokeWidth={isActive ? 2.4 : 1.8} />
              </div>
              <span>{label}</span>
            </div>
          );

          if (isReady) {
            return (
              <Link href={navHref} key={key} className="w-full">
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
