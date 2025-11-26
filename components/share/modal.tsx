"use client";

import type { ReactNode } from "react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	variant?: "light" | "dark";
};

export function Modal({ isOpen, onClose, children, variant = "light" }: ModalProps) {
	if (!isOpen) return null;

	const bgColor = variant === "dark" ? "bg-zinc-900" : "bg-white";
	const overlayColor = variant === "dark" ? "bg-black/60" : "bg-black/50";

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center ${overlayColor} p-4`}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={`w-full max-w-md rounded-2xl ${bgColor} p-6 shadow-2xl`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
