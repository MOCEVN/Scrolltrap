"use client";

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

const BREAK_IMAGE_THRESHOLD = 100;
const BREAK_TIME_THRESHOLD = 3 * 60 * 1000;

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

	const lastInterestsKeyRef = useRef<string>("");
	const imagesRef = useRef<ImageItem[]>([]);
	const timeoutsRef = useRef<number[]>([]);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);
	const lastBreakTimestampRef = useRef<number>(Date.now());
	const imagesSinceLastBreakRef = useRef(0);

	const registerTimeout = useCallback((timeoutId: number) => {
		timeoutsRef.current.push(timeoutId);
	}, []);

	const clearScheduledTimeouts = useCallback(() => {
		timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
		timeoutsRef.current = [];
	}, []);

	const resetBreakCooldown = useCallback(() => {
		lastBreakTimestampRef.current = Date.now();
		imagesSinceLastBreakRef.current = 0;
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
				let shouldOpenBreak = false;
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
					if (
						imagesSinceLastBreakRef.current >= BREAK_IMAGE_THRESHOLD &&
						timeSinceLastBreak >= BREAK_TIME_THRESHOLD
					) {
						shouldOpenBreak = true;
					}

					return combined;
				});

				setLoadingMore(false);

				if (shouldOpenBreak) {
					setShowBreakPoint(true);
					setImagesViewedInSession(viewedSinceLastBreak);
				}
			}, 300);

			registerTimeout(timeoutId);
		},
		[generateImages, registerTimeout],
	);

	useEffect(() => {
		const interestsKey = createKeyForInterests(userInterests);

		if (userInterests.length === 0) {
			clearScheduledTimeouts();
			resetBreakCooldown();
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
				setShowBreakPoint(false);
				setImagesViewedInSession(freshImages.length);
			});
			lastInterestsKeyRef.current = interestsKey;
		}, 400);

		registerTimeout(timeoutId);
	}, [
		clearScheduledTimeouts,
		generateImages,
		registerTimeout,
		resetBreakCooldown,
		userInterests,
	]);

	useEffect(() => {
		imagesRef.current = images;
	}, [images]);

	const loadMoreImages = useCallback(() => {
		if (
			loadingMore ||
			showBreakPoint ||
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
		showLikedOnly,
		userInterests.length,
	]);

	const handleContinueScrolling = useCallback(() => {
		resetBreakCooldown();
		setShowBreakPoint(false);
		scheduleImageAppend(10);
	}, [resetBreakCooldown, scheduleImageAppend]);

	const handleTakeBreak = useCallback(() => {
		resetBreakCooldown();
		setShowBreakPoint(false);
		setImagesViewedInSession(0);
	}, [resetBreakCooldown]);

	useEffect(() => {
		const target = loadMoreRef.current;
		if (!target || showBreakPoint || showLikedOnly) {
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
			{ rootMargin: "280px" },
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [loadMoreImages, showBreakPoint, showLikedOnly]);

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

	return (
		<>
			{showBreakPoint && (
				<div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6">
					<div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
						<p className="mb-4 text-center text-5xl">🌸</p>
						<p className="mb-3 text-center text-2xl font-bold text-zinc-900">
							Fancy a quick break?
						</p>
						<p className="mb-4 text-center text-base font-medium text-indigo-600">
							You&apos;ve explored {imagesViewedInSession} images
						</p>
						<div className="flex flex-col gap-3">
							<button
								type="button"
								onClick={handleContinueScrolling}
								className="rounded-xl bg-indigo-500 px-6 py-3 text-base font-bold text-white shadow-md transition-transform hover:translate-y-0.5 hover:bg-indigo-600"
							>
								Continue exploring
							</button>
							<button
								type="button"
								onClick={handleTakeBreak}
								className="rounded-xl border border-slate-200 bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-white"
							>
								Take a break
							</button>
						</div>
					</div>
				</div>
			)}

			<section className="bg-slate-50">
				<div className="mx-auto max-w-6xl px-4 pb-12 bg-secondary">
					<div
						className="flex flex-row gap-4 "
						style={{ marginLeft: -spacing / 2, marginRight: -spacing / 2 }}
					>
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

											<button
												type="button"
												onClick={() => toggleLike(image.id, image)}
												className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-lg shadow transition-transform hover:scale-105"
												aria-pressed={liked}
												aria-label={
													liked ? "Remove from likes" : "Add to likes"
												}
											>
												{liked ? "❤️" : "🤍"}
											</button>
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
				</div>
			</section>
		</>
	);
};

export default MasonryGrid;
