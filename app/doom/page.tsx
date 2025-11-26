"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { DoomNotification } from "@/components/ui/doom-notif";
import { Heart, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Short {
	id: string;
	title: string;
}

const demoShorts: Short[] = [
	{ id: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
	{ id: "LPChtaKsVgU", title: "Funny Cat Chase Fail" },
	{ id: "4DPFfsYF9yM", title: "Cat vs Laser" },
	{ id: "I5z1eYo8SLw", title: "DIY Life Hack Gone Wrong" },
	{ id: "Cd5v14yJC4k", title: "Quick Street Food Recipe" },
	{ id: "RfH9uQRzO8I", title: "Epic Skateboard Trick" },
	{ id: "lFibEYEv3nM", title: "Viral Dance Challenge 2024" },
	{ id: "G3GIh42weTo", title: "Dance Challenge" },
	{ id: "s_3qEGBo-FA", title: "Hidden iPhone Features" },
	{ id: "Z7UKBN0TwjQ", title: "Random Animal Facts" },
	{ id: "w4-TTbZ8zC0", title: "Budget Travel Tips" },
	{ id: "WMfOaOSz0R4", title: "ASMR Whisper Challenge" },
	{ id: "1sTWZ2ViKAs", title: "Ivete Sangalo Live" },
	{ id: "VCcmLaApMCo", title: "Universidad Meme" },
	{ id: "DmbnuVHQ96U", title: "Campus Life" },
	{ id: "jyIDhIXKsW8", title: "Quick Guitar Lesson" },
	{ id: "BdpdKqm1G6w", title: "Guitar Cover" },
	{ id: "9Gqz6nYA4Ls", title: "Urban Photography Tips" },
	{ id: "dzq7zgXwWeY", title: "Funny Pet Reactions" },
	{ id: "ybQ53LrxUJE", title: "Easy Vegan Snack Ideas" },
	{ id: "oDh58oNhJLs", title: "Retro Game Speedrun" },
	{ id: "48kPGspthjQ", title: "Book Review in 60 Seconds" },
	{ id: "LUwlemQNUL0", title: "Home Workout for Abs" },
	{ id: "oDTWnzFM-bw", title: "AI Art Tutorial" },
	{ id: "nvkB_gsAK0k", title: "Street Magic Illusion" },
	{ id: "31max-5gvcA", title: "Sustainable Fashion Haul" },
	{ id: "7oy1PyaewmU", title: "Coding Tip for Noobs" },
	{ id: "XKYMGepj7Y8", title: "Code Snippet" },
	{ id: "0JqslJv4ktk", title: "Vintage Car Restoration" },
	{ id: "6C_xFde9_lc", title: "Beach Cleanup Challenge" },
];

export default function Doom() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [liked, setLiked] = useState<Set<string>>(new Set());
	const [unmuted, setUnmuted] = useState<Set<string>>(new Set());
	const [showDoomWarning, setShowDoomWarning] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => setShowDoomWarning(true), 30_000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let isScrolling = false;
		const handleScroll = () => {
			if (isScrolling) return;
			isScrolling = true;

			requestAnimationFrame(() => {
				const { scrollTop, scrollHeight, clientHeight } = container;
				const percent = (scrollTop + clientHeight) / scrollHeight;

				if (percent > 0.7 && currentIndex < demoShorts.length - 1) {
					setCurrentIndex((i) => i + 1);
				} else if (percent < 0.3 && currentIndex > 0) {
					setCurrentIndex((i) => i - 1);
				}
				isScrolling = false;
			});
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [currentIndex]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const active = container.querySelector(
			`[data-index="${currentIndex}"]`,
		) as HTMLElement;
		if (active) {
			container.scrollTo({ top: active.offsetTop - 20, behavior: "smooth" });
		}
	}, [currentIndex]);

	const toggleLike = (id: string) => {
		setLiked((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const toggleSound = (id: string) => {
		setUnmuted((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	return (
		<div className="flex min-h-screen bg-background text-slate-900">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header
					showLikedOnly={false}
					likedCount={0}
					onToggleShowLiked={() => {}}
					searchQuery=""
					setSearchQuery={() => {}}
					handleSearch={() => {}}
				/>

				<DoomNotification
					visible={showDoomWarning}
					onClose={() => setShowDoomWarning(false)}
				/>

				<div
					ref={containerRef}
					className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide px-4 py-6"
				>
					<div className="max-w-sm mx-auto space-y-6">
						{demoShorts.map((short, idx) => {
							const isMuted = !unmuted.has(short.id);

							return (
								<div
									key={short.id}
									data-index={idx}
									className="snap-start bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
								>
									<div className="relative aspect-[9/16] bg-black">
										<iframe
											className="w-full h-full"
											src={`https://www.youtube.com/embed/${short.id}?autoplay=1&mute=${isMuted ? 1 : 0}&start=0&end=15&loop=1&playlist=${short.id}&controls=0&modestbranding=1&rel=0&fs=0`}
											title={short.title}
											allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											loading="lazy"
										/>

										<Button
											onClick={() => toggleSound(short.id)}
											className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-md"
											size="icon"
										>
											{isMuted ? (
												<VolumeX className="w-6 h-6" />
											) : (
												<Volume2 className="w-6 h-6" />
											)}
										</Button>
									</div>

									<div className="p-4 flex items-center justify-between gap-3">
										<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate flex-1">
											{short.title}
										</h3>
										<Button
											variant="ghost"
											size="icon"
											className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
											onClick={() => toggleLike(short.id)}
										>
											<Heart
												className={`w-6 h-6 ${liked.has(short.id) ? "text-red-500 fill-red-500" : "text-gray-600"}`}
											/>
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
