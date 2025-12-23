'use client';

import { useMindfulBreak } from '@/hooks/use-mindful-break';
import { getDreamPostText } from '@/lib/dream-post-text';
import type { ImageItem } from '@/types/image';
import Image from 'next/image';
import type React from 'react';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DreamShare } from './share/dream-share';
import { DreamNotification } from './ui/dream-notif';

type MasonryGridProps = {
  numColumns: number;
  spacing: number;
  userInterests: string[];
  likedImages: ImageItem[];
  toggleLike: (imageId: string, imageData: ImageItem) => void;
  isImageLiked: (imageId: string) => boolean;
  showLikedOnly?: boolean;
  onToggleShowLiked?: () => void;
};

const createKeyForInterests = (interests: string[]) =>
  JSON.stringify([...interests].sort());

const MINDFUL_CHECKIN_AFTER_MS = 5 * 60_000; // 5 minutes
const SUGGESTED_BREAK_DURATION_MS = 90_000; // 1.5 minutes

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const MasonryGrid: React.FC<MasonryGridProps> = ({
  numColumns,
  spacing,
  userInterests,
  likedImages,
  toggleLike,
  isImageLiked,
  showLikedOnly = false,
  onToggleShowLiked,
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastInterestsKeyRef = useRef<string>('');
  const imagesRef = useRef<ImageItem[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const mindfulBreak = useMindfulBreak({
    enabled: userInterests.length > 0 && !showLikedOnly,
    thresholdMs: MINDFUL_CHECKIN_AFTER_MS,
    breakDurationMs: SUGGESTED_BREAK_DURATION_MS,
  });

  const breakCountdownDisplay =
    mindfulBreak.breakTimeRemaining !== null && mindfulBreak.breakTimeRemaining > 0
      ? formatTime(mindfulBreak.breakTimeRemaining)
      : null;

  const breakHeadline = mindfulBreak.breakCompleted
    ? 'Nice work taking a breather'
    : 'Take a mindful pause';

  const breakDescription = mindfulBreak.breakCompleted
    ? 'Notice how you feel before you dive back in. Give yourself a moment to process what you just explored.'
    : 'Step away from the feed for a moment.';

  const resumeButtonLabel = mindfulBreak.breakCompleted ? 'Return to feed' : 'Skip break';

  const registerTimeout = useCallback((timeoutId: number) => {
    timeoutsRef.current.push(timeoutId);
  }, []);

  const clearScheduledTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearScheduledTimeouts();
    };
  }, [clearScheduledTimeouts]);

  const generateImages = useCallback(
    (count: number, startIndex = 0): ImageItem[] => {
      if (userInterests.length === 0) {
        return [];
      }

      return Array.from({ length: count }, (_, index) => {
        const width = 640;
        const height = 360;
        const globalIndex = startIndex + index;
        const topic = userInterests[globalIndex % userInterests.length];

        return {
          id: `${topic}-${globalIndex}`,
          url: `https://static.photos/${topic}/${width}x${height}/${globalIndex}`,
          width,
          height,
          topic,
        } satisfies ImageItem;
      });
    },
    [userInterests],
  );

  const scheduleImageAppend = useCallback(
    (count: number) => {
      setLoadingMore(true);

      const timeoutId = window.setTimeout(() => {
        setImages((prevImages) => {
          const moreImages = generateImages(count, prevImages.length);
          if (moreImages.length === 0) {
            return prevImages;
          }

          const combined = [...prevImages, ...moreImages];
          imagesRef.current = combined;
          mindfulBreak.addToSessionCount(moreImages.length);

          return combined;
        });

        setLoadingMore(false);
      }, 300);

      registerTimeout(timeoutId);
    },
    [generateImages, mindfulBreak, registerTimeout],
  );

  useEffect(() => {
    const interestsKey = createKeyForInterests(userInterests);

    if (userInterests.length === 0) {
      clearScheduledTimeouts();
      startTransition(() => {
        setImages([]);
        setLoading(false);
      });
      imagesRef.current = [];
      lastInterestsKeyRef.current = interestsKey;
      return;
    }

    if (interestsKey === lastInterestsKeyRef.current && imagesRef.current.length > 0) {
      return;
    }

    clearScheduledTimeouts();
    startTransition(() => {
      setLoading(true);
    });

    const timeoutId = window.setTimeout(() => {
      const freshImages = generateImages(10);
      imagesRef.current = freshImages;
      mindfulBreak.resetCooldown();
      mindfulBreak.setSessionCount(freshImages.length);
      startTransition(() => {
        setImages(freshImages);
        setLoading(false);
      });
      lastInterestsKeyRef.current = interestsKey;
    }, 400);

    registerTimeout(timeoutId);
  }, [
    clearScheduledTimeouts,
    generateImages,
    mindfulBreak,
    registerTimeout,
    userInterests,
  ]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const loadMoreImages = useCallback(() => {
    if (
      loadingMore ||
      mindfulBreak.showBreakPoint ||
      mindfulBreak.isOnBreak ||
      showLikedOnly ||
      userInterests.length === 0 ||
      imagesRef.current.length === 0
    ) {
      return;
    }

    scheduleImageAppend(10);
  }, [
    loadingMore,
    scheduleImageAppend,
    mindfulBreak.showBreakPoint,
    mindfulBreak.isOnBreak,
    showLikedOnly,
    userInterests.length,
  ]);

  const handleContinueScrolling = useCallback(() => {
    mindfulBreak.continueFeed();
    scheduleImageAppend(10);
  }, [mindfulBreak, scheduleImageAppend]);

  const handleTakeBreak = useCallback(() => {
    clearScheduledTimeouts();
    mindfulBreak.takeBreak();
  }, [clearScheduledTimeouts, mindfulBreak]);

  const handleResumeFromBreak = useCallback(() => {
    mindfulBreak.resumeFromBreak();
  }, [mindfulBreak]);

  const displayImages = showLikedOnly ? likedImages : images;

  const columns = useMemo(() => {
    const buckets: Array<Array<{ item: ImageItem; priority: boolean }>> = Array.from(
      { length: numColumns },
      () => [],
    );

    displayImages.forEach((item, index) => {
      const bucketIndex = index % numColumns;
      buckets[bucketIndex].push({ item, priority: index < numColumns });
    });

    return buckets;
  }, [displayImages, numColumns]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </section>
    );
  }

  if (userInterests.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-transparent px-6 text-center">
        <p className="max-w-sm text-sm text-zinc-600">
          Select a few interests to populate your feed with tailored images.
        </p>
      </section>
    );
  }

  if (showLikedOnly && likedImages.length === 0) {
    return (
      <section className="bg-transparent">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <button
            type="button"
            onClick={onToggleShowLiked}
            className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50"
          >
            ← Back to all images
          </button>
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/80 px-8 py-12 text-center">
            <p className="text-lg font-semibold text-zinc-700">No liked images yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Tap the heart icon while exploring to save favourites here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (mindfulBreak.isOnBreak) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 px-6 py-16">
        <div className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur border border-emerald-100">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-5xl" aria-hidden>
              🧘
            </span>
            <h2 className="text-2xl font-bold text-emerald-800">{breakHeadline}</h2>
            <p className="mt-3 max-w-md text-sm text-slate-600">{breakDescription}</p>
            {breakCountdownDisplay && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                  Breathe
                </span>
                <span>{breakCountdownDisplay} remaining</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleResumeFromBreak}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:translate-y-0.5 hover:bg-emerald-600"
            >
              {resumeButtonLabel}
            </button>
            {!mindfulBreak.breakCompleted && (
              <p className="mt-3 text-xs text-slate-400">
                It is okay to step away for longer—your feed will be right where you left
                it.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <DreamNotification
        visible={mindfulBreak.showBreakPoint}
        imagesViewedInSession={mindfulBreak.imagesViewedInSession}
        onContinue={handleContinueScrolling}
        onTakeBreak={handleTakeBreak}
      />

      <section className="bg-transparent">
        <div className="mx-auto w-full max-w-none px-2 pb-12 sm:px-4">
          {mindfulBreak.timeUntilBreak !== null && !mindfulBreak.showBreakPoint && (
            <div className="mb-4 flex justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                <span className="text-emerald-500">🌿</span>
                <span>
                  Next mindful check-in in {formatTime(mindfulBreak.timeUntilBreak)}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-row" style={{ gap: spacing }}>
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="flex flex-1 flex-col"
                style={{ gap: spacing }}
              >
                {column.map(({ item: image, priority }) => {
                  const aspectRatio = (image.height / image.width) * 100;
                  const liked = isImageLiked(image.id);
                  const postText = getDreamPostText(image);
                  const dialogId = `${image.topic} ${image.id}`;

                  const openDialog = () => {
                    const dialog = document.getElementById(
                      dialogId,
                    ) as HTMLDialogElement | null;
                    dialog?.showModal();
                  };

                  const closeDialog = () => {
                    const dialog = document.getElementById(
                      dialogId,
                    ) as HTMLDialogElement | null;
                    dialog?.close();
                  };

                  return (
                    <article
                      key={image.id}
                      className="post group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={openDialog}
                        aria-label={`Open post: ${postText.title}`}
                      >
                        <div
                          className="imageContainer relative"
                          style={{ paddingBottom: `${aspectRatio}%` }}
                        >
                          <Image
                            src={image.url}
                            alt={`${image.topic} ${image.id}`}
                            fill
                            sizes={`(max-width: 768px) 100vw, ${100 / numColumns}%`}
                            className="object-cover transition-transform duration-300 lg:group-hover:scale-[1.02]"
                            priority={priority}
                          />
                        </div>

                        <div className="contentContainer px-3 py-3">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {postText.title}
                          </h3>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                JD
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-slate-700">
                                  John Doe
                                </p>
                                <p className="truncate text-[11px] text-slate-500">
                                  {postText.teaser}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      <div className="pointer-events-none absolute inset-0" aria-hidden>
                        <div className="absolute left-3 top-3">
                          <div className="rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700 shadow-sm">
                            {image.topic}
                          </div>
                        </div>
                        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                          <div className="pointer-events-auto">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleLike(image.id, image);
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-base shadow-sm transition-transform hover:scale-105"
                              aria-pressed={liked}
                              aria-label={liked ? 'Unsave' : 'Save'}
                            >
                              {liked ? '❤️' : '🤍'}
                            </button>
                          </div>
                          <div className="pointer-events-auto">
                            <DreamShare
                              imageUrl={image.url}
                              imageTitle={`${image.topic} image`}
                            />
                          </div>
                        </div>
                      </div>

                      <dialog id={dialogId}>
                        <Image
                          src={image.url}
                          alt={`${image.topic} ${image.id}`}
                          className="rounded-xl"
                          width={600}
                          height={338}
                        />
                        <h2 className="text-xl font-semibold">{postText.title}</h2>
                        <div className="flex justify-between">
                          <span className="text-sm">John Doe</span>
                          <i className="text-sm">01-01-2025</i>
                        </div>
                        <hr className="border-gray-200" />
                        <p>{postText.body}</p>
                        <button type="button" autoFocus onClick={closeDialog}>
                          Close
                        </button>
                      </dialog>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>

          <div ref={loadMoreRef} className="h-12" aria-hidden />

          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          )}

          {!loadingMore && !mindfulBreak.showBreakPoint && !showLikedOnly && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-slate-500">
                You have viewed{' '}
                <span className="font-semibold text-slate-700">{images.length}</span>{' '}
                images
              </p>
              <button
                type="button"
                onClick={loadMoreImages}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
              >
                <span>Load 10 more</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
              <p className="max-w-xs text-center text-xs text-slate-400">
                You decide when to load more. Take your time.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MasonryGrid;
