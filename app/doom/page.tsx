"use client";

import HeaderDoom from "@/components/header-doom";
import IntroPopup from "@/components/intro-popup";
import { DoomShare } from "@/components/share/doom-share";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { DoomNotification } from "@/components/ui/doom-notif";
import { SignupNotification } from "@/components/ui/signup-notif";
import { Bookmark, Heart, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Short {
	id: string;
	title: string;
	type?: "short" | "ad";
	video?: string;
	creator?: string;
	caption?: string;
	likes?: number;
	comments?: number;
	shares?: number;
}

const demoShorts: Short[] = [
	{
		id: "dQw4w9WgXcQ",
		title: "Rick Astley – Never Gonna Give You Up",
		creator: "@rickastley",
		caption: "Never gonna give you up, never gonna let you down 🎵",
		likes: 1234567,
		comments: 45623,
		shares: 23456,
	},
	{
		id: "LPChtaKsVgU",
		title: "Funny Cat Chase Fail",
		creator: "@catvideos",
		caption: "He really thought he could make that jump 😹",
		likes: 567890,
		comments: 23456,
		shares: 12345,
	},
	{
		id: "4DPFfsYF9yM",
		title: "Cat vs Laser",
		creator: "@petfails",
		caption: "The eternal battle continues... 🔴",
		likes: 445678,
		comments: 15623,
		shares: 9876,
	},
	{
		id: "I5z1eYo8SLw",
		title: "DIY Life Hack Gone Wrong",
		creator: "@lifehacks",
		caption: "Maybe I should've read the instructions first... 😅",
		likes: 789012,
		comments: 34567,
		shares: 15678,
	},

	// AD #1
	{
		id: "ad-1",
		title: "Sponsored: DoomScroll Premium",
		type: "ad",
		video:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		creator: "@doomscroll",
		caption: "Upgrade to Premium for ad-free scrolling! 🚀",
		likes: 234567,
		comments: 8934,
		shares: 5678,
	},

	{
		id: "Cd5v14yJC4k",
		title: "Quick Street Food Recipe",
		creator: "@streetfood",
		caption: "This is how they make it in Thailand 🇹🇭",
		likes: 923456,
		comments: 28901,
		shares: 18234,
	},
	{
		id: "RfH9uQRzO8I",
		title: "Epic Skateboard Trick",
		creator: "@skatelife",
		caption: "Only took me 47 tries to land this 🛹",
		likes: 345678,
		comments: 12345,
		shares: 7890,
	},
	{
		id: "lFibEYEv3nM",
		title: "Viral Dance Challenge 2024",
		creator: "@dancemoves",
		caption: "Try this challenge and tag me! 💃",
		likes: 1567890,
		comments: 67890,
		shares: 34567,
	},

	// AD #2
	{
		id: "ad-2",
		title: "Sponsored: Limited Time Offer!",
		type: "ad",
		video:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		creator: "@sponsor",
		caption: "Get 50% off now! Link in bio 🎁",
		likes: 156789,
		comments: 4567,
		shares: 3456,
	},

	{
		id: "G3GIh42weTo",
		title: "Dance Challenge",
		creator: "@viraltrends",
		caption: "This song is stuck in my head 24/7 🎶",
		likes: 678901,
		comments: 23456,
		shares: 12345,
	},
	{
		id: "s_3qEGBo-FA",
		title: "Hidden iPhone Features",
		creator: "@techtriks",
		caption: "iPhone trick you didn't know about 📱",
		likes: 1123456,
		comments: 45678,
		shares: 23456,
	},
];

// Helper function to format numbers
const formatCount = (num: number): string => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
};

export default function Doom() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [liked, setLiked] = useState<Set<string>>(new Set());
	const [unmuted, setUnmuted] = useState<Set<string>>(new Set());
	const [showDoomWarning, setShowDoomWarning] = useState(false);
	const [showSignup, setShowSignup] = useState(false);
	const [showIntro, setShowIntro] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		const timer = setTimeout(() => setShowDoomWarning(true), 30_000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const hasSeen = sessionStorage.getItem("signup_seen");
		if (hasSeen) return;

		const timer = setTimeout(() => {
			setShowSignup(true);
			sessionStorage.setItem("signup_seen", "true");
		}, 5000);

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
			container.scrollTo({ top: active.offsetTop, behavior: "smooth" });
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
		<div className="flex min-h-screen bg-black text-white">
			{showIntro && <IntroPopup onClose={closeIntro} />}
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<HeaderDoom />
				<DoomNotification
					visible={showDoomWarning}
					onClose={() => setShowDoomWarning(false)}
				/>
				<SignupNotification
					visible={showSignup}
					onClose={() => setShowSignup(false)}
				/>

				<div
					ref={containerRef}
					className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black flex items-center justify-center"
				>
					<div className="w-full max-w-[500px] h-full">
						{demoShorts.map((short, idx) => {
							const isMuted = !unmuted.has(short.id);
							const isLiked = liked.has(short.id);

							return (
								<div
									key={short.id}
									data-index={idx}
									className="snap-start relative w-full h-screen bg-black"
								>
									{/* VIDEO - FULL SCREEN */}
									<div className="absolute inset-0">
										{/* AD VIDEO */}
										{short.type === "ad" && short.video && (
											<video
												src={short.video}
												autoPlay
												muted={isMuted}
												loop
												playsInline
												className="w-full h-full object-cover"
											/>
										)}

										{/* YOUTUBE SHORT */}
										{short.type !== "ad" && (
											<iframe
												className="w-full h-full"
												src={`https://www.youtube.com/embed/${short.id}?autoplay=1&mute=${isMuted ? 1 : 0}&start=0&end=15&loop=1&playlist=${short.id}&controls=0&modestbranding=1&rel=0&fs=0`}
												title={short.title}
												allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
											/>
										)}
									</div>

									<DoomShare
										imageUrl={`https://img.youtube.com/vi/${short.id}/0.jpg`}
										imageTitle={short.title}
									/>

									{/* GRADIENT OVERLAY */}
									<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

									{/* TOP RIGHT - SOUND BUTTON */}
									<div className="absolute top-4 right-4 z-20">
										<Button
											onClick={() => toggleSound(short.id)}
											className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-3 rounded-full border border-white/20"
											size="icon"
										>
											{isMuted ? (
												<VolumeX className="w-5 h-5" />
											) : (
												<Volume2 className="w-5 h-5" />
											)}
										</Button>
									</div>

									{/* SPONSORED BADGE */}
									{short.type === "ad" && (
										<div className="absolute top-4 left-4 z-20">
											<div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
												SPONSORED
											</div>
										</div>
									)}

									{/* RIGHT SIDEBAR - ACTIONS */}
									<div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6">
										{/* LIKE */}
										<div className="flex flex-col items-center gap-1">
											<Button
												onClick={() => toggleLike(short.id)}
												className="bg-transparent hover:bg-white/10 p-3 rounded-full"
												size="icon"
											>
												<Heart
													className={`w-8 h-8 transition-all ${
														isLiked ? "fill-red-500 text-red-500" : "text-white"
													}`}
												/>
											</Button>
											<span className="text-white text-xs font-semibold">
												{formatCount(
													(short.likes || 323000) + (isLiked ? 1 : 0),
												)}
											</span>
										</div>

										{/* COMMENT */}
										<div className="flex flex-col items-center gap-1">
											<Button
												className="bg-transparent hover:bg-white/10 p-3 rounded-full"
												size="icon"
											>
												<MessageCircle className="w-8 h-8 text-white" />
											</Button>
											<span className="text-white text-xs font-semibold">
												{formatCount(short.comments || 1200)}
											</span>
										</div>

										{/* SHARE */}
										<div className="flex flex-col items-center gap-1">
											<DoomShare
												imageUrl={`https://img.youtube.com/vi/${short.id}/0.jpg`}
												imageTitle={short.title}
											/>
											<span className="text-white text-xs font-semibold">
												{formatCount(short.shares || 500)}
											</span>
										</div>

										{/* BOOKMARK */}
										<div className="flex flex-col items-center gap-1">
											<Button
												className="bg-transparent hover:bg-white/10 p-3 rounded-full"
												size="icon"
											>
												<Bookmark className="w-8 h-8 text-white" />
											</Button>
										</div>
									</div>

									{/* BOTTOM LEFT - INFO */}
									<div className="absolute bottom-6 left-4 right-20 z-20 text-white">
										{/* CREATOR */}
										<div className="flex items-center gap-2 mb-3">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-bold">
												{short.creator?.[1]?.toUpperCase() || "?"}
											</div>
											<span className="font-semibold text-base">
												{short.creator}
											</span>
											<Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-4 py-1 h-auto text-xs font-bold rounded-md">
												Follow
											</Button>
										</div>

										{/* CAPTION */}
										<p className="text-sm leading-relaxed mb-2">
											{short.caption || short.title}
										</p>

										{/* HASHTAGS */}
										<div className="flex flex-wrap gap-1 text-xs">
											<span className="text-blue-400">#doomscroll</span>
											<span className="text-blue-400">#viral</span>
											<span className="text-blue-400">#fyp</span>
										</div>
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
