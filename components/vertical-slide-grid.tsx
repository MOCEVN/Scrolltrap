"use client";

import type { ImageItem } from "@/types/image";
import Image from "next/image";
import React, {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { DreamShare } from "./share/dream-share";
import { DreamNotification } from "./ui/dream-notif";

type VerticalSlideGridProps = {
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

const BREAK_TIME_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const SUGGESTED_BREAK_DURATION = 90 * 1000; // 1.5 minutes

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const VerticalSlideGrid: React.FC<VerticalSlideGridProps> = ({
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
    const [showBreakPoint, setShowBreakPoint] = useState(false);
    const [imagesViewedInSession, setImagesViewedInSession] = useState(0);

    const [timeUntilBreak, setTimeUntilBreak] = useState<number | null>(null);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [breakTimeRemaining, setBreakTimeRemaining] = useState<number | null>(null);
    const [breakCompleted, setBreakCompleted] = useState(false);

    const countdownIntervalRef = useRef<number | null>(null);
    const breakIntervalRef = useRef<number | null>(null);
    const lastInterestsKeyRef = useRef<string>("");
    const imagesRef = useRef<ImageItem[]>([]);
    const timeoutsRef = useRef<number[]>([]);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const lastBreakTimestampRef = useRef<number>(0);
    const imagesSinceLastBreakRef = useRef(0);
    const breakEndsAtRef = useRef<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [postsViewCounter, setPostViewCounter] = useState(0);
    const interestsKey = createKeyForInterests(userInterests);

  const breakCountdownDisplay =
    breakTimeRemaining !== null && breakTimeRemaining > 0
      ? formatTime(breakTimeRemaining)
      : null;

  const breakHeadline = breakCompleted
    ? "Nice work taking a breather"
    : "Take a mindful pause";

  const breakDescription = breakCompleted
    ? "Notice how you feel before you dive back in. Give yourself a moment to process what you just explored."
    : "Step away from the feed for a moment.";

  const resumeButtonLabel = breakCompleted ? "Return to feed" : "Skip break";

  const registerTimeout = useCallback((timeoutId: number) => {
    timeoutsRef.current.push(timeoutId);
  }, []);

  const clearScheduledTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const resetBreakMetrics = useCallback(() => {
    lastBreakTimestampRef.current = Date.now();
    imagesSinceLastBreakRef.current = 0;
  }, []);

  const stopBreakTimer = useCallback(() => {
    if (breakIntervalRef.current !== null) {
      window.clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
    breakEndsAtRef.current = null;
  }, []);

  const updateBreakRemaining = useCallback(() => {
    if (breakEndsAtRef.current === null) {
      setBreakTimeRemaining(null);
      return;
    }

    const remaining = breakEndsAtRef.current - Date.now();
    if (remaining <= 0) {
      stopBreakTimer();
      setBreakTimeRemaining(0);
      setBreakCompleted(true);
      return;
    }

    setBreakTimeRemaining(remaining);
  }, [stopBreakTimer]);

  const startBreakTimer = useCallback(
    (durationMs: number) => {
      stopBreakTimer();
      setBreakCompleted(false);
      const endsAt = Date.now() + durationMs;
      breakEndsAtRef.current = endsAt;
      setBreakTimeRemaining(durationMs);
      updateBreakRemaining();
      breakIntervalRef.current = window.setInterval(() => {
        updateBreakRemaining();
      }, 500);
    },
    [stopBreakTimer, updateBreakRemaining],
  );

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    const elapsed = Date.now() - lastBreakTimestampRef.current;
    const remaining = Math.max(BREAK_TIME_THRESHOLD - elapsed, 0);
    setTimeUntilBreak(remaining);

    if (remaining <= 0) {
      stopCountdown();
      setTimeUntilBreak(null);
      if (!showBreakPoint) {
        setShowBreakPoint(true);
        setImagesViewedInSession(imagesSinceLastBreakRef.current);
      }
    }
  }, [showBreakPoint, stopCountdown]);

  const startCountdown = useCallback(() => {
    stopCountdown();
    updateTimeRemaining();

    countdownIntervalRef.current = window.setInterval(() => {
      updateTimeRemaining();
    }, 500);
  }, [stopCountdown, updateTimeRemaining]);

  const resetBreakCooldown = useCallback(() => {
    resetBreakMetrics();
    startCountdown();
  }, [resetBreakMetrics, startCountdown]);
  
  const displayImages = showLikedOnly ? likedImages : images;

  const handlePrev = useCallback(() => {
  setCurrentIndex((prev) => Math.max(prev - 1, 0));
}, []);

const handleNext = useCallback(() => {
  setCurrentIndex((prev) => {
    const maxStart = Math.max(displayImages.length - 2, 0);
    const nextIndex = Math.min(prev + 1, maxStart);

    if (nextIndex > prev) {
      setPostViewCounter((prevViewed) =>
        Math.min(prevViewed + 1, displayImages.length),
      );
    }
    return nextIndex;
  });
}, [displayImages.length]);

  useEffect(() => {
    return () => {
      clearScheduledTimeouts();
      stopCountdown();
      stopBreakTimer();
    };
  }, [clearScheduledTimeouts, stopBreakTimer, stopCountdown]);

  useEffect(() => {
    if (lastBreakTimestampRef.current === 0) {
      lastBreakTimestampRef.current = Date.now();
      startCountdown();
    }
  }, [startCountdown]);

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
        if (moreImages.length === 0) return prevImages;
        
        const combined = [...prevImages, ...moreImages];
        imagesRef.current = combined;
        imagesSinceLastBreakRef.current += moreImages.length;
        return combined;
      });
      setLoadingMore(false);
    }, 300);
    registerTimeout(timeoutId);
  },
  [generateImages, registerTimeout],
);

  useEffect(() => {
    if (userInterests.length === 0) {
      clearScheduledTimeouts();
      resetBreakCooldown();
      stopCountdown();
      stopBreakTimer();
      setTimeUntilBreak(null);
      setIsOnBreak(false);
      setBreakCompleted(false);
      setBreakTimeRemaining(null);
      startTransition(() => {
        setImages([]);
        setLoading(false);
        setShowBreakPoint(false);
        setImagesViewedInSession(0);
      });
      imagesRef.current = [];
      lastInterestsKeyRef.current = interestsKey;
      return;
    }

    if (
      interestsKey === lastInterestsKeyRef.current &&
      imagesRef.current.length > 0
    ) {
      return;
    }

    clearScheduledTimeouts();
    startTransition(() => {
      setLoading(true);
    });

    const timeoutId = window.setTimeout(() => {
      const freshImages = generateImages(20);
      imagesRef.current = freshImages;
      resetBreakCooldown();
      imagesSinceLastBreakRef.current = freshImages.length;
      startTransition(() => {
        setImages(freshImages);
        setLoading(false);
        setImagesViewedInSession(freshImages.length);
        setIsOnBreak(false);
        setBreakCompleted(false);
        setBreakTimeRemaining(null);
        setPostViewCounter(0);
      });
      lastInterestsKeyRef.current = interestsKey;
    }, 400);

    registerTimeout(timeoutId);
  }, [
    clearScheduledTimeouts,
    generateImages,
    registerTimeout,
    resetBreakCooldown,
    stopCountdown,
    stopBreakTimer,
    userInterests,
  ]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleContinueScrolling = useCallback(() => {
    resetBreakCooldown();
    setShowBreakPoint(false);
    setImagesViewedInSession(0);
    scheduleImageAppend(10);
  }, [resetBreakCooldown, scheduleImageAppend]);

  const handleTakeBreak = useCallback(() => {
    setShowBreakPoint(false);
    setIsOnBreak(true);
    setBreakCompleted(false);
    setImagesViewedInSession(0);
    setTimeUntilBreak(null);
    stopCountdown();
    clearScheduledTimeouts();
    resetBreakMetrics();
    startBreakTimer(SUGGESTED_BREAK_DURATION);
  }, [clearScheduledTimeouts, resetBreakMetrics, startBreakTimer, stopCountdown]);

  const handleResumeFromBreak = useCallback(() => {
    stopBreakTimer();
    setBreakTimeRemaining(null);
    setBreakCompleted(false);
    setIsOnBreak(false);
    resetBreakCooldown();
  }, [resetBreakCooldown, stopBreakTimer]);

const visibleImages = useMemo(
  () => displayImages.slice(currentIndex, currentIndex + 2),
  [displayImages, currentIndex],
); 

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </section>
    );
  }

  if (userInterests.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 text-center">
        <p className="max-w-sm text-sm text-zinc-600">
          Select a few interests to populate your feed with tailored images.
        </p>
      </section>
    );
  }

  if (showLikedOnly && likedImages.length === 0) {
    return (
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <button
            type="button"
            onClick={onToggleShowLiked}
            className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
          >
            ← Back to all images
          </button>
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/80 px-8 py-12 text-center">
            <p className="text-lg font-semibold text-zinc-700">
              No liked images yet
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Tap the heart icon while exploring to save favourites here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isOnBreak) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 px-6 py-16">
        <div className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur border border-emerald-100">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-5xl" aria-hidden>
              🧘
            </span>
            <h2 className="text-2xl font-bold text-emerald-800">
              {breakHeadline}
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-600">
              {breakDescription}
            </p>
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
            {!breakCompleted && (
              <p className="mt-3 text-xs text-slate-400">
                It is okay to step away for longer—your feed will be right where
                you left it.
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
        visible={showBreakPoint}
        imagesViewedInSession={imagesViewedInSession}
        onContinue={handleContinueScrolling}
        onTakeBreak={handleTakeBreak}
      />
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          {timeUntilBreak !== null && !showBreakPoint && (
            <div className="mb-4 flex justify-end gap-2">
  <button
    type="button"
    onClick={handlePrev}
    disabled={currentIndex === 0}
    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
  >
     Previous
  </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                <span className="text-emerald-500">🌿</span>
                <span>
                  Next mindful check-in in {formatTime(timeUntilBreak)}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6">
            {visibleImages.map((image, index) => {
              const aspectRatio = (image.height / image.width) * 100;
              const liked = isImageLiked(image.id);
              const priority = index === 0;

              return (
                <article
                  key={image.id}
                  className="post group relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div
                    className="relative"
                    style={{ paddingBottom: `${aspectRatio}%` }}
                  >
                    <Image
                      src={image.url}
                      alt={`${image.topic} ${image.id}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={priority}
                    />
                  </div>
                  <div className="mb-1 flex justify-end gap-2">
                </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold capitalize text-primary">
                      {image.topic}
                    </h3>
                    <hr className="border-gray-200" />
                    <p className="mb-3 mt-3 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nunc eget sem ut leo tempor placerat varius aliquet nunc.
                    </p>
                    <a
                      href="#"
                      onClick={() => {
                        const dialog = document.getElementById(
                          `${image.topic} ${image.id}`,
                        ) as HTMLDialogElement | null;
                        dialog?.showModal();
                      }}
                    >
                      Read more
                    </a>
                  </div>

                  <div className="absolute left-4 top-4">
                    <div className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow">
                      {image.topic}
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => toggleLike(image.id, image)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-lg shadow transition-transform hover:scale-105"
                      aria-pressed={liked}
                      aria-label={
                        liked ? "Remove from likes" : "Add to likes"
                      }
                    >
                      {liked ? "❤️" : "🤍"}
                    </button>
                    <DreamShare
                      imageUrl={image.url}
                      imageTitle={`${image.topic} image`}
                    />
                  </div>

                  <dialog id={`${image.topic} ${image.id}`}>
                    <img
                      src={image.url}
                      alt={`${image.topic} ${image.id}`}
                      className="rounded-xl"
                      width="600"
                      height="338"
                    />
                    <h2 className="capitalize">{image.topic}</h2>
                    <div className="flex justify-between">
                      <span className="text-sm">John Doe</span>
                      <i className="text-sm">01-01-2025</i>
                    </div>
                    <hr className="border-gray-200" />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nunc eget sem ut leo tempor placerat varius aliquet nunc.
                      Sed euismod, nisl vel tincidunt lacinia, nunc est aliquam
                      nunc, eget aliquam nisl nunc euismod nunc.
                    </p>
                    <button
                      type="button"
                      autoFocus
                      onClick={() => {
                        const dialog = document.getElementById(
                          `${image.topic} ${image.id}`,
                        ) as HTMLDialogElement | null;
                        dialog?.close();
                      }}
                    >
                      Close
                    </button>
                  </dialog>
                </article>
              );
            })}
          </div>

          <div ref={loadMoreRef} className="h-8" aria-hidden />

          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          )}
         {!loadingMore && !showBreakPoint && ( 
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-slate-500">
                    You have viewed{" "}
                    <span className="font-semibold text-slate-700">
                        {postsViewCounter}
                    </span>{" "}
                    images
             </p>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= Math.max(displayImages.length - 2, 0)}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
              >
                <span>Next</span>
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

export default VerticalSlideGrid;
