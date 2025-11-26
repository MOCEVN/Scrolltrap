"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

import Header from '@/components/header';
import InterestSelector from '@/components/interest-selector';
import IntroPopup from '@/components/intro-popup';
import MasonryGrid from '@/components/masonry-grid';
import Sidebar from '@/components/sidebar';
import { useInterests } from '@/hooks/use-interests';
import { useLikedImages } from '@/hooks/use-liked-images';
import { useScenario } from '@/hooks/use-scenario';

const AVAILABLE_INTERESTS = [
  'nature',
  'office',
  'people',
  'technology',
  'abstract',
  'food',
  'sport',
  'science',
];

const getRandomInterests = () => {
  const shuffled = [...AVAILABLE_INTERESTS].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 4);
  return shuffled.slice(0, count);
};

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
	const { mode, isDream } = useScenario();

	const isBootstrapping = interestsLoading || likesLoading;

	const handleInterestsUpdate = useCallback(
		(next: string[]) => {
			if (!isDream) {
				return;
			}
			updateInterests(next);
			if (next.length === 0) setShowLikedOnly(false);
		},
		[isDream, updateInterests],
	);

	const handleToggleShowLiked = useCallback(() => {
		setShowLikedOnly((prev) => !prev);
	}, []);

	const handleSearch = useCallback(() => {
		if (!searchQuery.trim()) return;
		console.info("Search is not wired up yet", searchQuery.trim());
	}, [searchQuery]);

	const gridColumns = mode === "doom" ? 1 : 4;
	const gridSpacing = mode === "doom" ? 10 : 12;

	const doomInterests = useMemo(() => getRandomInterests(), []);
	const activeInterests = isDream ? interests : doomInterests;

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* === Intro Popup === */}
      {showIntro && (
        <IntroPopup onClose={closeIntro} />
      )}

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
        <main className="flex-1 overflow-y-auto" data-scroll-container>
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            {/* Interest Selector */}
            {!showLikedOnly && isDream && (
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
