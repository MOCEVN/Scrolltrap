import type React from "react";

type DreamCheckInProps = {
	visible: boolean;
	imagesViewedInSession: number;
	timeUntilBreak?: number | null;
	onContinue: () => void;
	onTakeBreak: () => void;
};

export const DreamNotification: React.FC<DreamCheckInProps> = ({
	visible,
	imagesViewedInSession,
	timeUntilBreak,
	onContinue,
	onTakeBreak,
}) => {
	if (!visible) return null;

	return (
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
						onClick={onContinue}
						className="rounded-xl bg-indigo-500 px-6 py-3 text-base font-bold text-white shadow-md transition-transform hover:translate-y-0.5 hover:bg-indigo-600"
					>
						Continue exploring
					</button>
					<button
						type="button"
						onClick={onTakeBreak}
						className="rounded-xl border border-slate-200 bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-white"
					>
						Take a break
					</button>
				</div>
			</div>
		</div>
	);
};
