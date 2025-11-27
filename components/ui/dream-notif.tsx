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
		<div className="fixed inset-0 z-20 flex items-center justify-center bg-emerald-900/30 backdrop-blur-sm px-6">
			<div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-white via-emerald-50 to-indigo-50 p-8 shadow-2xl border border-emerald-100">
				<p className="mb-4 text-center text-5xl">🌿</p>
				<p className="mb-3 text-center text-2xl font-bold text-emerald-800">
					Fancy a quick break?
				</p>
				<p className="mb-4 text-center text-base font-medium text-emerald-600">
					You&apos;ve explored {imagesViewedInSession} images
				</p>
				<p className="mb-6 text-center text-sm text-slate-500">
					Taking breaks helps you stay present and mindful.
				</p>
				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={onContinue}
						className="rounded-xl bg-emerald-500 px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg"
					>
						Continue exploring
					</button>
					<button
						type="button"
						onClick={onTakeBreak}
						className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
					>
						🧘 Take a mindful break
					</button>
				</div>
			</div>
		</div>
	);
};
