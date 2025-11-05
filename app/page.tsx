'use client';

import { useCallback, useMemo, useState } from 'react';

import Header from '@/components/header';
import InterestSelector from '@/components/interest-selector';
import MasonryGrid from '@/components/masonry-grid';
import Sidebar from '@/components/sidebar';
import { useInterests } from '@/hooks/use-interests';
import { useLikedImages } from '@/hooks/use-liked-images';

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
      if (next.length === 0) setShowLikedOnly(false);
    },
    [updateInterests]
  );

  const handleToggleShowLiked = useCallback(() => {
    setShowLikedOnly((prev) => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    console.info('Search is not wired up yet', searchQuery.trim());
  }, [searchQuery]);

  const headerSubtitle = useMemo(() => {
    if (showLikedOnly) return 'Your saved favourites in one place.';
    if (interests.length === 0) return 'Pick a few topics to personalise your feed.';
    return '';
  }, [interests.length, showLikedOnly]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar component */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header component */}
        <Header
          showLikedOnly={showLikedOnly}
          likedCount={likedCount}
          onToggleShowLiked={handleToggleShowLiked}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <main className="flex-1 overflow-y-auto bg-secondary bg-secondary">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 ">
            {/* Interest Selector */}
            {!showLikedOnly && (
              <div className="mb-6">
                <InterestSelector
                  interests={interests}
                  onInterestsUpdate={handleInterestsUpdate}
                />
              </div>
            )}

            {/* Masonry Grid or Loading */}
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
