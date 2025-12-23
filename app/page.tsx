'use client';

import { useCallback, useEffect, useState } from 'react';

import Header from '@/components/header';
import InterestSelector from '@/components/interest-selector';
import IntroPopup from '@/components/intro-popup';
import MasonryGrid from '@/components/masonry-grid';
import Sidebar from '@/components/sidebar';
import { useInterests } from '@/hooks/use-interests';
import { useLikedImages } from '@/hooks/use-liked-images';
import { useScenarioMode } from '@/hooks/use-scenario-mode';

const Home = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return !sessionStorage.getItem('intro_seen');
  });

  const closeIntro = () => {
    sessionStorage.setItem('intro_seen', 'true');
    setShowIntro(false);
  };

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
      if (next.length === 0) setShowLikedOnly(false);
    },
    [updateInterests],
  );

  const handleToggleShowLiked = useCallback(() => {
    setShowLikedOnly((prev) => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    console.info('Search is not wired up yet', searchQuery.trim());
  }, [searchQuery]);

  const [gridColumns, setGridColumns] = useState(() => {
    if (typeof window === 'undefined') {
      return 1;
    }

    return window.innerWidth >= 1024 ? 2 : 1;
  });
  const gridSpacing = 18;

  useEffect(() => {
    const onResize = () => {
      setGridColumns(window.innerWidth >= 1024 ? 2 : 1);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const activeInterests = interests;

  const { isDoom } = useScenarioMode();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDoom ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {showIntro && <IntroPopup onClose={closeIntro} />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header
          showLikedOnly={showLikedOnly}
          likedCount={likedCount}
          onToggleShowLiked={handleToggleShowLiked}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <main
          className={`flex-1 overflow-y-auto ${isDoom ? '' : 'dream-feed-pattern'}`}
          data-scroll-container
        >
          <div className="mx-auto w-full max-w-none px-4 py-6 sm:px-6 2xl:px-8">
            <div
              className={`gap-6 ${showLikedOnly ? '' : 'lg:grid lg:grid-cols-[240px_1fr]'}`}
            >
              {!showLikedOnly && (
                <aside className="mb-6 lg:mb-0">
                  <div className="lg:sticky lg:top-6">
                    <InterestSelector
                      interests={interests}
                      onInterestsUpdate={handleInterestsUpdate}
                    />
                  </div>
                </aside>
              )}

              <div>
                {isBootstrapping ? (
                  <section className="flex min-h-[50vh] items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  </section>
                ) : (
                  <MasonryGrid
                    numColumns={gridColumns}
                    spacing={gridSpacing}
                    userInterests={activeInterests}
                    likedImages={likedImages}
                    toggleLike={toggleLike}
                    isImageLiked={isImageLiked}
                    showLikedOnly={showLikedOnly}
                    onToggleShowLiked={handleToggleShowLiked}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
