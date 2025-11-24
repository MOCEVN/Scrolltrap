// DoomNotification.tsx
import type React from "react";

type DoomNotificationProps = {
	visible: boolean;
	onClose: () => void;
};

export const DoomNotification: React.FC<DoomNotificationProps> = ({
	visible,
	onClose,
}) => {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
			<div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          className="absolute inset-0 bg-transparent border-none p-0 m-0"
          onClick={onClose}
          type="button"
          aria-label="Close overlay"
        />

				<div className="relative text-center">
					<p className="mb-4 text-5xl">⚠️</p>
					<p className="mb-2 text-2xl font-bold text-zinc-900">Doom Warning!</p>
					<p className="text-base text-zinc-600">
						Something important just happened.
					</p>
					<button
						type="button"
						onClick={onClose}
						className="mt-4 rounded-xl bg-indigo-500 px-6 py-3 text-white font-bold shadow hover:bg-indigo-600"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};
