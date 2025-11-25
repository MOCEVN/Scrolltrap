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

const DREAM_BREAK_IMAGE_THRESHOLD = 24;
const DREAM_SUGGESTED_BREAK_DURATION = 90 * 1000;

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

	const { isDream } = useScenario();

	const timeoutsRef = useRef<number[]>([]);
	const registerTimeout = (id: number) => timeoutsRef.current.push(id);
	const clearTimeouts = () => {
		timeoutsRef.current.forEach((id) => clearTimeout(id));
		timeoutsRef.current = [];
	};

	const lastBreakTimestampRef = useRef(Date.now());
	const imagesSinceLastBreakRef = useRef(0);

	const loadMoreRef = useRef<HTMLDivElement | null>(null);
	const imagesRef = useRef<ImageItem[]>([]);

	const generateImages = useCallback(
		(count: number, startIndex = 0): ImageItem[] => {
			if (userInterests.length === 0) return [];

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
				setImages((prev) => {
					const more = generateImages(count, prev.length);
					const combined = [...prev, ...more];
					imagesRef.current = combined;

					imagesSinceLastBreakRef.current += more.length;

					return combined;
				});

				setLoadingMore(false);
			}, 300);

			registerTimeout(timeoutId);
		},
		[generateImages],
	);

	// initial load
	useEffect(() => {
		if (userInterests.length === 0) {
			startTransition(() => {
				setImages([]);
				setLoading(false);
			});
			imagesRef.current = [];
			return;
		}

		clearTimeouts();
		startTransition(() => setLoading(true));

		const timeoutId = window.setTimeout(() => {
			const fresh = generateImages(20);
			imagesRef.current = fresh;
			imagesSinceLastBreakRef.current = fresh.length;
			lastBreakTimestampRef.current = Date.now();

			startTransition(() => {
				setImages(fresh);
				setLoading(false);
				setImagesViewedInSession(fresh.length);
			});
		}, 400);

		registerTimeout(timeoutId);

		return () => clearTimeouts();
	}, [generateImages, userInterests]);

	const loadMoreImages = useCallback(() => {
		if (loadingMore || showBreakPoint || showLikedOnly) return;
		if (userInterests.length === 0 || imagesRef.current.length === 0) return;

		scheduleImageAppend(10);
	}, [
		loadingMore,
		scheduleImageAppend,
		showBreakPoint,
		showLikedOnly,
		userInterests.length,
	]);

	useEffect(() => {
		const target = loadMoreRef.current;
		if (!target || showBreakPoint || showLikedOnly) return;

		const scrollContainer = target.closest(
			"[data-scroll-container]",
		) as HTMLElement | null;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) loadMoreImages();
				});
			},
			{
				root: scrollContainer ?? null,
				rootMargin: "220px",
			},
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, [loadMoreImages, showBreakPoint, showLikedOnly]);

	const handleContinueScrolling = useCallback(() => {
		lastBreakTimestampRef.current = Date.now();
		imagesSinceLastBreakRef.current = 0;
		setShowBreakPoint(false);
		scheduleImageAppend(10);
	}, [scheduleImageAppend]);

	const handleTakeBreak = useCallback(() => {
		const suggested = DREAM_SUGGESTED_BREAK_DURATION;
		setShowBreakPoint(false);
		// Break UI stays inside DreamNotification (unchanged)
	}, []);

	const displayImages = showLikedOnly ? likedImages : images;

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
						className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
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
											className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl"
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

											<button
												type="button"
												onClick={() => toggleLike(image.id, image)}
												className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-lg shadow hover:scale-105"
												aria-pressed={liked}
											>
												{liked ? "❤️" : "🤍"}
											</button>
										</article>
									);
								})}
							</div>
						))}
					</div>

					<div ref={loadMoreRef} className="h-12" />

					{loadingMore && (
						<div className="flex justify-center py-6">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default MasonryGrid;
