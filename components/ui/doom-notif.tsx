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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
  <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">

    <button
      className="absolute inset-0 bg-transparent border-none p-0 m-0"
      onClick={onClose}
      type="button"
      aria-label="Close notification"
    />

    <div className="relative p-6 flex flex-col items-center text-center gap-4">
      <div className="text-6xl animate-bounce">🎬</div>
      <h2 className="text-2xl font-extrabold text-gray-900">
        Check this new video out!
      </h2>

      <p className="text-gray-600 text-sm">
        We've just added something special to your feed — don’t miss it!
      </p>

      <Button
        type="button"
        onClick={onClose}
        className="mt-2 w-full rounded-xl bg-[limegreen] px-6 py-3 text-white font-semibold shadow-lg transition-transform hover:-translate-y-1 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Watch Now
      </Button>
    </div>
  </div>
</div>

	);
};
