'use client';

import { useCallback, useMemo, useState } from 'react';

import InterestSelector from '@/components/interest-selector';
import MasonryGrid from '@/components/masonry-grid';
import { useInterests } from '@/hooks/use-interests';
import { useLikedImages } from '@/hooks/use-liked-images';
import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Home as HomeIcon,
  Info,
  MessageSquare,
  PlusCircle,
  Search,
  User,
} from 'lucide-react';

type NavKey = 'home' | 'explore' | 'create' | 'profile' | 'info';

const NAV_ITEMS: Array<{
  key: NavKey;
  label: string;
  icon: LucideIcon;
  isReady: boolean;
}> = [
  { key: 'home', label: 'Home', icon: HomeIcon, isReady: true },
  { key: 'explore', label: 'Explore', icon: Compass, isReady: false },
  { key: 'create', label: 'Create', icon: PlusCircle, isReady: false },
  { key: 'profile', label: 'Profile', icon: User, isReady: false },
  { key: 'info', label: 'Info', icon: Info, isReady: false },
];

const Home = () => {
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { interests, updateInterests, isLoading: interestsLoading } = useInterests();
  const {
    likedImages,
    toggleLike,
    isImageLiked,
    likedCount,
    isLoading: likesLoading,
  } = useLikedImages();

  const isBootstrapping = interestsLoading || likesLoading;

  const handleInterestsUpdate = useCallback(
    (next: string[]) => {
      updateInterests(next);
      if (next.length === 0) {
        setShowLikedOnly(false);
      }
    },
    [updateInterests],
  );

  const handleToggleShowLiked = useCallback(() => {
    setShowLikedOnly((previous) => !previous);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      return;
    }

    console.info('Search is not wired up yet', searchQuery.trim());
  }, [searchQuery]);

  const headerSubtitle = useMemo(() => {
    if (showLikedOnly) {
      return 'Your saved favourites in one place.';
    }

    if (interests.length === 0) {
      return 'Pick a few topics to personalise your feed.';
    }

    return '';
  }, [interests.length, showLikedOnly]);

  const activeNav: NavKey = 'home';

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="hidden min-h-screen w-24 flex-col items-center border-r border-slate-200 bg-white px-3 py-6 shadow-sm sm:flex lg:w-32">
        <div className="flex flex-col items-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          <span>Scroll</span>
          <span className="text-indigo-500">Trap</span>
        </div>

        <div className="mt-10 flex flex-1 flex-col items-center gap-3">
          {NAV_ITEMS.map(({ key, label, icon: Icon, isReady }) => {
            const isActive = activeNav === key;

            return (
              <button
                key={key}
                type="button"
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                } ${!isReady ? 'cursor-not-allowed opacity-40' : ''}`}
                disabled={!isReady}
                aria-current={isActive ? 'page' : undefined}
                title={isReady ? label : `${label} (coming soon)`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Search..."
                  aria-label="Search images"
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 sm:flex"
                title="Messages (coming soon)"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {showLikedOnly ? 'Your liked images' : 'Explore'}
              </h1>
              {headerSubtitle && (
                <p className="text-sm text-slate-500">{headerSubtitle}</p>
              )}
            </div>

            {likedCount > 0 && (
              <button
                type="button"
                onClick={handleToggleShowLiked}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  showLikedOnly
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {showLikedOnly ? 'Viewing likes' : 'Show likes'}
                <span className="text-base">❤️ {likedCount}</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            {!showLikedOnly && (
              <div className="mb-6">
                <InterestSelector
                  interests={interests}
                  onInterestsUpdate={handleInterestsUpdate}
                />
              </div>
            )}

            {isBootstrapping ? (
              <section className="flex min-h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              </section>
            ) : (
              <MasonryGrid
                numColumns={4}
                spacing={12}
                userInterests={interests}
                likedImages={likedImages}
                toggleLike={toggleLike}
                isImageLiked={isImageLiked}
                showLikedOnly={showLikedOnly}
                onToggleShowLiked={handleToggleShowLiked}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
