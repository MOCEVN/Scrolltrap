"use client";

import Header from "@/components/header";
import IntroPopup from "@/components/intro-popup";
import { DoomShare } from "@/components/share/doom-share";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { DoomNotification } from "@/components/ui/doom-notif";
import { RevenueNotification } from "@/components/ui/rev-notif";
import { SignupNotification } from "@/components/ui/signup-notif";
import { Heart, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Short {
	id: string;
	title: string;
	caption?: string;
	type?: "short" | "ad";
	video?: string;
}

const demoShorts: Short[] = [
	{
		id: "6xS1EZG0fwg",
		title: "Thuishaven December 2025",
		type: "ad",
	},
	{ id: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
	{ id: "keOaQm6RpBg", title: "Heinz Add" },
	{ id: "LPChtaKsVgU", title: "Funny Cat Chase Fail" },
	{ id: "4DPFfsYF9yM", title: "Cat vs Laser" },
	{
		id: "t1cJfe0C-z4",
		title: "DoomScroll Premium",
		type: "ad",
	},

	{ id: "I5z1eYo8SLw", title: "DIY Life Hack Gone Wrong" },
	{ id: "Cd5v14yJC4k", title: "Quick Street Food Recipe" },
	{ id: "RfH9uQRzO8I", title: "Epic Skateboard Trick" },
	{ id: "lFibEYEv3nM", title: "Viral Dance Challenge 2024" },
	{
		id: "GH0jISu4tr8",
		title: "Limited Time Offer!",
		type: "ad",
	},

	{ id: "G3GIh42weTo", title: "Dance Challenge" },
	{ id: "s_3qEGBo-FA", title: "Hidden iPhone Features" },
	{ id: "Z7UKBN0TwjQ", title: "Random Animal Facts" },
	{ id: "w4-TTbZ8zC0", title: "Budget Travel Tips" },
	{
		id: "OFW_1mQMG_A",
		title: "Get 50% Off Now!",
		type: "ad",
	},
	{ id: "WMfOaOSz0R4", title: "ASMR Whisper Challenge" },
	{ id: "1sTWZ2ViKAs", title: "Ivete Sangalo Live" },
	{ id: "VCcmLaApMCo", title: "Universidad Meme" },
	{ id: "DmbnuVHQ96U", title: "Campus Life" },
	{
		id: "8P2NW35HZDo",
		title: "Try AirUp Now!",
		type: "ad",
	},
	{ id: "jyIDhIXKsW8", title: "Quick Guitar Lesson" },
	{ id: "BdpdKqm1G6w", title: "Guitar Cover" },
	{ id: "9Gqz6nYA4Ls", title: "Urban Photography Tips" },
	{ id: "dzq7zgXwWeY", title: "Funny Pet Reactions" },
	{
		id: "mSRikeS0ChU",
		title: "Subscribe Today!",
		type: "ad",
	},
	{ id: "ybQ53LrxUJE", title: "Easy Vegan Snack Ideas" },
	{ id: "oDh58oNhJLs", title: "Retro Game Speedrun" },
	{ id: "48kPGspthjQ", title: "Book Review in 60 Seconds" },
	{ id: "LUwlemQNUL0", title: "Home Workout for Abs" },
	{
		id: "d51cpyc5exw",
		title: "Do you speak Oreo?",
		type: "ad",
	},
	{ id: "oDTWnzFM-bw", title: "AI Art Tutorial" },
	{ id: "nvkB_gsAK0k", title: "Street Magic Illusion" },
	{ id: "31max-5gvcA", title: "Sustainable Fashion Haul" },
	{ id: "7oy1PyaewmU", title: "Coding Tip for Noobs" },
	{ id: "XKYMGepj7Y8", title: "Code Snippet" },
	{
		id: "WZ-GZCNEuPw",
		title: "Download Free Today",
		type: "ad",
	},
	{
		id: "TK73GsEJXVM",
		title: "New Collection Drop",
		type: "ad",
	},
	{ id: "0JqslJv4ktk", title: "Vintage Car Restoration" },
	{ id: "6C_xFde9_lc", title: "Beach Cleanup Challenge" },
	{
		id: "IP5xf2nU81s",
		title: "Join 1M+ Users",
		type: "ad",
	},
	{
		id: "aQG8KodNMwo",
		title: "Upgrade Your Life",
		type: "ad",
	},
	{ id: "7D3aZQiDudA", title: "Vintage Car Restoration" },
	{ id: "8fI_Olyw3tE", title: "Beach Cleanup Challenge" },
	{ id: "YgJoiA2D4Jo", title: "Vintage Car Restoration" },
	{ id: "wTYUwuiwc2Q", title: "Beach Cleanup Challenge" },
	{ id: "kE_ALbCi7pE", title: "Vintage Car Restoration" },
	{ id: "WnvWbj9cTO8", title: "Beach Cleanup Challenge" },
	{ id: "9BySXemFBPg", title: "Vintage Car Restoration" },
	{ id: "uvxhT6yrUv4", title: "Beach Cleanup Challenge" },
];

export default function Doom() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [liked, setLiked] = useState<Set<string>>(new Set());
	const [unmuted, setUnmuted] = useState<Set<string>>(new Set());
	const [showDoomWarning, setShowDoomWarning] = useState(false);
	const [showSignup, setShowSignup] = useState(false);
	const [showIntro, setShowIntro] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [showRevenue, setShowRevenue] = useState(false);

	useEffect(() => {
		const hasSeen = sessionStorage.getItem("intro_seen");
		if (!hasSeen) setShowIntro(true);
	}, []);

	const closeIntro = () => {
		sessionStorage.setItem("intro_seen", "true");
		setShowIntro(false);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setShowRevenue(true);
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	// Doom popup timer
	useEffect(() => {
		const timer = setTimeout(() => setShowDoomWarning(true), 60000);
		return () => clearTimeout(timer);
	}, []);

	// Signup popup timer
	useEffect(() => {
		const hasSeen = sessionStorage.getItem("signup_seen");
		if (hasSeen) return;

		const timer = setTimeout(() => {
			setShowSignup(true);
			sessionStorage.setItem("signup_seen", "true");
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	// Scroll snapping logic
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

	// Scroll to active short
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
		<div className="flex min-h-screen bg-black text-white">
			{showIntro && <IntroPopup onClose={closeIntro} />}

			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />

				<DoomNotification
					visible={showDoomWarning}
					onClose={() => setShowDoomWarning(false)}
				/>

				<SignupNotification
					visible={showSignup}
					onClose={() => setShowSignup(false)}
				/>

				<RevenueNotification
					visible={showRevenue}
					onClose={() => setShowRevenue(false)}
				/>

				<div
					ref={containerRef}
					className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black px-0 py-4"
				>
					<div className="max-w-[420px] mx-auto space-y-10">
						{demoShorts.map((short, idx) => {
							const isMuted = !unmuted.has(short.id);

							return (
								<div
									key={short.id}
									data-index={idx}
									className="snap-center relative w-full h-[90vh] bg-black rounded-xl overflow-hidden shadow-xl border border-white/10"
								>
									{/* Video container more full-screen */}

									{/* SPONSOR BADGE */}
									{short.type === "ad" && (
										<div className="absolute top-4 left-4 z-30 bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-bold shadow">
											SPONSORED
										</div>
									)}
									<div className="absolute inset-0">
										{short.type === "ad" && short.video ? (
											<video
												src={short.video}
												autoPlay
												muted={isMuted}
												loop
												playsInline
												className="w-full h-full object-cover"
											/>
										) : (
											<iframe
												className="w-full h-full object-cover"
												src={`https://www.youtube.com/embed/${short.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${short.id}`}
												title={short.title}
												allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
											/>
										)}
									</div>

									{/* Right-side TikTok-style buttons */}
									<div className="absolute right-4 bottom-24 flex flex-col items-center gap-4">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleLike(short.id)}
											className="bg-black/40 backdrop-blur-md hover:bg-black/60 p-3 rounded-full"
										>
											<Heart
												className={`w-7 h-7 ${liked.has(short.id) ? "text-red-500 fill-red-500" : "text-white"}`}
											/>
										</Button>

										<DoomShare
											imageUrl={`https://img.youtube.com/vi/${short.id}/0.jpg`}
											imageTitle={short.title}
										/>

										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleSound(short.id)}
											className="bg-black/40 backdrop-blur-md hover:bg-black/60 p-3 rounded-full"
										>
											{isMuted ? (
												<VolumeX className="w-7 h-7" />
											) : (
												<Volume2 className="w-7 h-7" />
											)}
										</Button>
									</div>

									{/* Title + Caption overlay */}
									<div className="absolute bottom-6 left-4 right-20 text-white drop-shadow-lg">
										<h3 className="text-lg font-bold">{short.title}</h3>
										{short.caption && (
											<p className="text-sm opacity-90 mt-1">{short.caption}</p>
										)}
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
