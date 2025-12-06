"use client";

import type React from "react";
import { Button } from "./button";

type RevenueNotificationProps = {
  visible: boolean;
  amount?: number;
  message?: string;
  onClose: () => void;
};

export const RevenueNotification: React.FC<RevenueNotificationProps> = ({
  visible,
  amount = 0,
  message = "We earned money from your scrolls!",
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 shadow-2xl overflow-hidden border border-green-500/30">
        <button
          className="absolute inset-0 bg-transparent border-none p-0 m-0"
          onClick={onClose}
          type="button"
          aria-label="Close notification"
        />

        <div className="relative px-12 p-10 flex flex-col items-center text-center gap-4">
          <div className="text-6xl animate-bounce text-green-400">💰</div>
          <h2 className="text-4xl font-extrabold text-white">
            +${amount} earned!
          </h2>

          <p className="text-green-200 text-sm">{message}</p>

          <Button
            variant="doom"
            size="l"
            onClick={onClose}
            className="bg-green-600 hover:bg-green-500 text-white font-bold"
          >
            Nice! 🎉
          </Button>
        </div>
      </div>
    </div>
  );
};
