"use client";

import { useCallback, useEffect, useState } from 'react';

import Header from '@/components/header';
import InterestSelector from '@/components/interest-selector';
import IntroPopup from '@/components/intro-popup';
import MasonryGrid from '@/components/masonry-grid';
import Sidebar from '@/components/sidebar';
import { useInterests } from '@/hooks/use-interests';
import { useLikedImages } from '@/hooks/use-liked-images';

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("intro_seen");
    if (!hasSeen) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    sessionStorage.setItem("intro_seen", "true");
    setShowIntro(false);
  };

  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    interests,
    updateInterests,
    isLoading: interestsLoading,
  } = useInterests();
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
    setShowLikedOnly(prev => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    console.info("Search is not wired up yet", searchQuery.trim());
  }, [searchQuery]);

  const gridColumns = 4;
  const gridSpacing = 12;

  const activeInterests = interests;

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {showIntro && (
        <IntroPopup onClose={closeIntro} />
      )}

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

        <main className="flex-1 overflow-y-auto" data-scroll-container>
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
        </main>
      </div>
    </div>
  );
};

export default Home;
