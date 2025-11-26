"use client";

import { useScenario } from "@/hooks/use-scenario";
import type { ImageItem } from "@/types/image";
import Image from "next/image";
import type React from "react";
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ShareInvite } from "./share";
import { DoomNotification } from "./ui/doom-notif";
import { DreamNotification } from "./ui/dream-notif";

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

const DREAM_BREAK_IMAGE_THRESHOLD = 24;
// const DREAM_BREAK_TIME_THRESHOLD = 10 * 1000;
const DOOM_BREAK_IMAGE_THRESHOLD = Number.POSITIVE_INFINITY;
const DOOM_BREAK_TIME_THRESHOLD = Number.POSITIVE_INFINITY;
const DREAM_SUGGESTED_BREAK_DURATION = 90 * 1000;
const DOOM_SUGGESTED_BREAK_DURATION = 45 * 1000;

const formatTime = (ms: number) => {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
	const [showBreakPoint, setShowBreakPoint] = useState(false);
	const [imagesViewedInSession, setImagesViewedInSession] = useState(0);

	const calmTimerRef = useRef<NodeJS.Timeout | null>(null);

	const { mode, isDream } = useScenario();
	const breakConfig = useMemo(
		() =>
			isDream
				? {
						time: Number.POSITIVE_INFINITY,
					}
				: {
						time: DOOM_BREAK_TIME_THRESHOLD,
					},
		[isDream],
	);
	const [timeUntilBreak, setTimeUntilBreak] = useState<number | null>(null);
	const [isOnBreak, setIsOnBreak] = useState(false);
	const [breakTimeRemaining, setBreakTimeRemaining] = useState<number | null>(
		null,
	);
	const [breakCompleted, setBreakCompleted] = useState(false);
	const countdownIntervalRef = useRef<number | null>(null);
	const breakIntervalRef = useRef<number | null>(null);
	const previousModeRef = useRef(mode);
	const breakCountdownDisplay =
		breakTimeRemaining !== null && breakTimeRemaining > 0
			? formatTime(breakTimeRemaining)
			: null;
	const breakHeadline = breakCompleted
		? "Nice work taking a breather"
		: "Take a mindful pause";
	const breakDescription = breakCompleted
		? "Notice how you feel before you dive back in. Give yourself a moment to process what you just explored."
		: "Step away from the feed for a moment. Try this light grounding exercise to support your nervous system.";
	const resumeButtonLabel = breakCompleted ? "Return to feed" : "Skip break";

	const lastInterestsKeyRef = useRef<string>("");
	const imagesRef = useRef<ImageItem[]>([]);
	const timeoutsRef = useRef<number[]>([]);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);
	const lastBreakTimestampRef = useRef<number>(0);
	const imagesSinceLastBreakRef = useRef(0);
	const breakEndsAtRef = useRef<number | null>(null);
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
		if (!isDream) {
			setTimeUntilBreak(null);
			return;
		}

		const elapsed = Date.now() - lastBreakTimestampRef.current;
		const remaining = Math.max(breakConfig.time - elapsed, 0);
		setTimeUntilBreak(remaining);

		if (remaining <= 0) {
			stopCountdown();
			setTimeUntilBreak(null);
			if (!showBreakPoint) {
				setShowBreakPoint(true);
				setImagesViewedInSession(imagesSinceLastBreakRef.current);
			}
		}
	}, [breakConfig.time, isDream, showBreakPoint, stopCountdown]);

	const startCountdown = useCallback(() => {
		if (!isDream) {
			setTimeUntilBreak(null);
			stopCountdown();
			return;
		}

		stopCountdown();
		updateTimeRemaining();

		countdownIntervalRef.current = window.setInterval(() => {
			updateTimeRemaining();
		}, 500);
	}, [isDream, stopCountdown, updateTimeRemaining]);

	const resetBreakCooldown = useCallback(() => {
		resetBreakMetrics();

		if (isDream) {
			startCountdown();
		} else {
			setTimeUntilBreak(null);
			stopCountdown();
		}
	}, [isDream, resetBreakMetrics, startCountdown, stopCountdown]);

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
			if (isDream) {
				startCountdown();
			}
		}
	}, [isDream, startCountdown]);

	useEffect(() => {
		if (previousModeRef.current !== mode) {
			previousModeRef.current = mode;
			resetBreakCooldown();
			setShowBreakPoint(false);
			setImagesViewedInSession(0);
			setIsOnBreak(false);
			setBreakCompleted(false);
			setBreakTimeRemaining(null);
			stopBreakTimer();
		}
	}, [mode, resetBreakCooldown, stopBreakTimer]);

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
				const shouldOpenBreak = false;
				let viewedSinceLastBreak = imagesSinceLastBreakRef.current;

				setImages((prevImages) => {
					const moreImages = generateImages(count, prevImages.length);
					if (moreImages.length === 0) {
						return prevImages;
					}

					const combined = [...prevImages, ...moreImages];
					imagesRef.current = combined;
					imagesSinceLastBreakRef.current += moreImages.length;
					viewedSinceLastBreak = imagesSinceLastBreakRef.current;

					const timeSinceLastBreak = Date.now() - lastBreakTimestampRef.current;
					const reachedTimeThreshold = timeSinceLastBreak >= breakConfig.time;

					return combined;
				});

				setLoadingMore(false);

				if (shouldOpenBreak) {
					stopCountdown();
					setTimeUntilBreak(null);
					setImagesViewedInSession(viewedSinceLastBreak);
				}
			}, 300);

			registerTimeout(timeoutId);
		},
		[breakConfig, generateImages, isDream, registerTimeout, stopCountdown],
	);

	useEffect(() => {
		const interestsKey = createKeyForInterests(userInterests);

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

	const loadMoreImages = useCallback(() => {
		if (
			loadingMore ||
			showBreakPoint ||
			isOnBreak ||
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
		showBreakPoint,
		isOnBreak,
		showLikedOnly,
		userInterests.length,
	]);

	const handleContinueScrolling = useCallback(() => {
		resetBreakCooldown();
		setShowBreakPoint(false);
		setImagesViewedInSession(0);
		scheduleImageAppend(10);
	}, [resetBreakCooldown, scheduleImageAppend]);

	const handleTakeBreak = useCallback(() => {
		const suggestedDuration = isDream
			? DREAM_SUGGESTED_BREAK_DURATION
			: DOOM_SUGGESTED_BREAK_DURATION;

		setShowBreakPoint(false);
		setIsOnBreak(true);
		setBreakCompleted(false);
		setImagesViewedInSession(0);
		setTimeUntilBreak(null);
		stopCountdown();
		clearScheduledTimeouts();
		resetBreakMetrics();
		startBreakTimer(suggestedDuration);
	}, [
		clearScheduledTimeouts,
		isDream,
		resetBreakMetrics,
		startBreakTimer,
		stopCountdown,
	]);

	const handleResumeFromBreak = useCallback(() => {
		stopBreakTimer();
		setBreakTimeRemaining(null);
		setBreakCompleted(false);
		setIsOnBreak(false);
		resetBreakCooldown();
	}, [resetBreakCooldown, stopBreakTimer]);

	useEffect(() => {
		const target = loadMoreRef.current;
		if (!target || showBreakPoint || showLikedOnly || isDream) {
			return;
		}

		const scrollContainer = target.closest(
			"[data-scroll-container]",
		) as HTMLElement | null;

		if (typeof IntersectionObserver === "undefined") {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadMoreImages();
					}
				});
			},
			{
				root: scrollContainer ?? null,
				rootMargin: "220px",
			},
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [loadMoreImages, showBreakPoint, showLikedOnly, isDream]);

	const displayImages = showLikedOnly ? likedImages : images;

	const [showDoomWarning, setShowDoomWarning] = useState(false);

	useEffect(() => {
		if (isDream) {
			setShowDoomWarning(false);
			return;
		}

		const timer = setTimeout(() => {
			setShowDoomWarning(true);
		}, 30_000); 

		return () => clearTimeout(timer);
	}, [isDream]);

	const columns = useMemo(() => {
		const buckets: Array<Array<{ item: ImageItem; priority: boolean }>> =
			Array.from({ length: numColumns }, () => []);

		displayImages.forEach((item, index) => {
			const bucketIndex = index % numColumns;
			buckets[bucketIndex].push({ item, priority: index < numColumns });
		});

		return buckets;
	}, [displayImages, numColumns]);

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
			<section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 px-6 py-16">
				<div className="w-full max-w-xl rounded-3xl bg-white/85 p-8 shadow-2xl backdrop-blur">
					<div className="flex flex-col items-center text-center">
						<span className="mb-4 text-5xl" aria-hidden>
							🌿
						</span>
						<h2 className="text-2xl font-bold text-zinc-900">
							{breakHeadline}
						</h2>
						<p className="mt-3 max-w-md text-sm text-zinc-600">
							{breakDescription}
						</p>
						{breakCountdownDisplay && (
							<div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
								<span className="text-xs font-medium uppercase tracking-wide text-emerald-500">
									Breathe
								</span>
								<span>{breakCountdownDisplay} remaining</span>
							</div>
						)}
						<button
							type="button"
							onClick={handleResumeFromBreak}
							className="mt-8 inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow transition-transform hover:translate-y-0.5 hover:bg-indigo-600"
						>
							{resumeButtonLabel}
						</button>
						{!breakCompleted && (
							<p className="mt-3 text-xs text-zinc-400">
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
			<DoomNotification
				visible={showDoomWarning}
				onClose={() => setShowDoomWarning(false)}
			/>

			<DreamNotification
				visible={showBreakPoint}
				imagesViewedInSession={imagesViewedInSession}
				onContinue={handleContinueScrolling}
				onTakeBreak={handleTakeBreak}
			/>

			<section className="bg-slate-50">
				<div className="mx-auto max-w-6xl px-4 pb-12">
					{isDream && timeUntilBreak !== null && !showBreakPoint && (
						<div className="mb-4 flex justify-end">
							{/* <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-600 shadow">
								<span>Next check-in in {formatTime(timeUntilBreak)}</span>
							</div> */}
						</div>
					)}
					<div className="flex flex-row gap-4">
						{columns.map((column, columnIndex) => (
							<div
								key={columnIndex}
								className="flex flex-1 flex-col"
								style={{
									gap: spacing,
									paddingLeft: spacing / 2,
									paddingRight: spacing / 2,
								}}
							>
								{column.map(({ item: image, priority }) => {
									const aspectRatio = (image.height / image.width) * 100;
									const liked = isImageLiked(image.id);

									return (
										<article
											key={image.id}
											className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
										>
											<div
												className="relative w-full"
												style={{ paddingBottom: `${aspectRatio}%` }}
											>
												<Image
													src={image.url}
													alt={`${image.topic} ${image.id}`}
													fill
													sizes={`(max-width: 768px) 100vw, ${100 / numColumns}%`}
													className="object-cover"
													priority={priority}
												/>
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
												<ShareInvite 
													imageUrl={image.url} 
													imageTitle={`${image.topic} afbeelding`} 
												/>
											</div>
										</article>
									);
								})}
							</div>
						))}
					</div>

					<div ref={loadMoreRef} className="h-12" aria-hidden />

					{loadingMore && (
						<div className="flex justify-center py-6">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
						</div>
					)}

					{isDream && !loadingMore && !showBreakPoint && !showLikedOnly && (
						<div className="flex flex-col items-center gap-3 py-8">
							<p className="text-sm text-slate-500">
								Je hebt <span className="font-semibold text-slate-700">{images.length}</span> afbeeldingen bekeken
							</p>
							<button
								type="button"
								onClick={loadMoreImages}
								className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
							>
								<span>Laad 10 meer</span>
								<span className="text-xs text-slate-400">→</span>
							</button>
							<p className="max-w-xs text-center text-xs text-slate-400">
								Jij bepaalt wanneer je meer laadt. Neem je tijd.
							</p>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default MasonryGrid;
