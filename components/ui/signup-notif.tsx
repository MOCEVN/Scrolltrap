"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "./button";

export type SignupNotificationProps = {
	visible: boolean;
	onClose: () => void;
};

export const SignupNotification: React.FC<SignupNotificationProps> = ({
	visible,
}) => {
	const [step, setStep] = useState<"signup" | "email">("signup");

	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fadeIn">
			<div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 shadow-2xl overflow-hidden p-6">
				{step === "signup" && (
					<div className="flex flex-col items-center text-center gap-4 mt-10 ">
						<div className="text-6xl animate-bounce">🎁</div>

						<h2 className="text-2xl font-extrabold text-white">
							Sign-up for more shorts! 🎉
						</h2>

						<p className="text-white text-sm">
							Explore a fresh collection of inspired shorts — don’t it miss out!
						</p>

						<button
							onClick={() => setStep("email")}
							type="button"
							className="mt-2 w-60 rounded-xl bg-indigo-500 px-6 py-2 text-white font-semibold shadow-lg
                border-2 border-indigo-500
                transition-transform hover:-translate-y-1 hover:bg-indigo-600 hover:border-indigo-700
                focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:text-white"
						>
							Join Scroll Trap
						</button>
					</div>
				)}

				{step === "email" && (
					<div className="flex flex-col items-center text-center gap-4 animate-fadeIn">
						<h1 className="text-3xl font-bold text-white">
							Join The Community!
						</h1>
             <p className="text-xs mb-4">Scroll Trap Community is a community of 10,987,346 amazing members</p>

						<input
							type="email"
							placeholder="you@example.com"
							className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>

						<Button className="w-60 mt-2 rounded-xl bg-indigo-500 text-white px-6 py-3 font-semibold border-2 border-indigo-500 shadow-lg hover:bg-indigo-700 transition hover:text-white">
							Submit
						</Button>

              <p className="text-gray-300 text-xs">
                By signing up, you agree to our{" "}
                <a
                  href="/pdf/privacy-policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline hover:text-indigo-600"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/pdf/terms.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline hover:text-indigo-600"
                >
                  Terms of Use
                </a>
                .
              </p>

						<Button
							onClick={() => setStep("signup")}
							className="text-sm text-gray-500 hover:text-gray-700 mt-2"
						>
							← Back
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
