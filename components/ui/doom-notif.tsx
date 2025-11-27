import type React from "react";
import { Button } from "./button";

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
			<div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 shadow-2xl overflow-hidden border border-red-500/30">
				<button
					className="absolute inset-0 bg-transparent border-none p-0 m-0"
					onClick={onClose}
					type="button"
					aria-label="Close notification"
				/>

				<div className="relative px-12 p-10 flex flex-col items-center text-center gap-4">
					<div className="text-6xl animate-bounce">🔥</div>
					<h2 className="text-4xl font-extrabold text-white">
						Check this new video out!
					</h2>

					<p className="text-red-200 text-sm">
						We've just added something special to your feed — don’t miss it!
					</p>

					<Button
						variant="doom"
						size="l"
						onClick={onClose}
						className="bg-red-600 hover:bg-red-500 text-white font-bold"
					>
						Watch Now 🚀
					</Button>

				</div>
			</div>
		</div>
	);
};
