"use client";

import { Link2, Send, X } from "lucide-react";
import { useState } from "react";
import { Modal } from "./modal";

export function DreamShare({ imageTitle }: { imageUrl: string; imageTitle: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [copied, setCopied] = useState(false);

	const reset = () => {
		setEmail("");
		setSent(false);
		setCopied(false);
	};

	const copyLink = async () => {
		await navigator.clipboard.writeText(`https://dreamscroll.app/s/${encodeURIComponent(imageTitle)}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-600 shadow hover:scale-105 hover:text-indigo-600"
				aria-label="Share"
			>
				<Send size={18} />
			</button>

			<Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset(); }}>
				{sent ? (
					<div className="py-6 text-center">
						<span className="text-4xl">✅</span>
						<h3 className="mt-2 text-lg font-semibold text-slate-900">Sent!</h3>
						<p className="mt-1 text-sm text-slate-500">Only this image, nothing more.</p>
					</div>
				) : (
					<>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-900">Share image</h3>
							<button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
								<X size={20} />
							</button>
						</div>

						<button
							onClick={copyLink}
							className="mb-3 flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left hover:bg-slate-50"
						>
							<Link2 size={20} className={copied ? "text-emerald-500" : "text-slate-400"} />
								<span className="text-sm font-medium text-slate-900">
									{copied ? "Link copied!" : "Copy link"}
								</span>
						</button>

						<div className="mb-3">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Or send to: friend@email.com"
								className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
							/>
						</div>

						<button
							onClick={() => setSent(true)}
							disabled={!email.includes("@")}
							className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
						>
							Send to 1 person
						</button>

						<p className="mt-4 text-xs text-slate-500">
							💡 No access to contacts • No reminder emails • No data sharing
						</p>
					</>
				)}
			</Modal>
		</>
	);
}
