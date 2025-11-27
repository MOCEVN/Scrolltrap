"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { Modal } from "./modal";

const FAKE_CONTACTS = [
	{ id: 1, name: "Mama", selected: true },
	{ id: 2, name: "Papa", selected: true },
	{ id: 3, name: "Beste vriend", selected: true },
	{ id: 4, name: "Ex-partner", selected: true },
	{ id: 5, name: "Baas", selected: true },
];

export function DoomShare(_props: { imageUrl: string; imageTitle: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [contacts, setContacts] = useState(FAKE_CONTACTS);
	const [sent, setSent] = useState(false);

	const selectedCount = contacts.filter((c) => c.selected).length;

	const reset = () => {
		setContacts(FAKE_CONTACTS);
		setSent(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/40 bg-red-950/80 text-red-400 shadow-lg shadow-red-500/20 transition-all hover:scale-105 hover:bg-red-900 hover:text-red-300"
				aria-label="Deel met vrienden"
			>
				<Users size={18} />
			</button>

			<Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset(); }} variant="dark">
				{sent ? (
					<div className="py-8 text-center">
						<span className="text-5xl">🎊</span>
						<h3 className="mt-3 text-lg font-bold text-white">
							{selectedCount} vrienden uitgenodigd!
						</h3>
						<p className="mt-2 text-sm text-zinc-400">
							We sturen ze een herinnering als ze niet reageren
						</p>
					</div>
				) : (
					<>
						<h3 className="mb-1 text-lg font-bold text-white">🎉 Deel met vrienden!</h3>
						<p className="mb-4 text-sm text-zinc-400">{contacts.length} contacten gevonden</p>

						<div className="mb-2 max-h-40 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800">
							{contacts.map((c) => (
								<label key={c.id} className="flex items-center gap-3 border-b border-zinc-700 px-3 py-2 last:border-0">
									<input
										type="checkbox"
										checked={c.selected}
										onChange={() => setContacts(prev => prev.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))}
										className="rounded border-zinc-600 bg-zinc-700 text-red-500"
									/>
									<span className="text-sm text-white">{c.name}</span>
								</label>
							))}
						</div>

						<button
							type="button"
							onClick={() => setContacts(prev => prev.map(c => ({ ...c, selected: false })))}
							className="mb-4 text-[10px] text-zinc-600 underline"
						>
							deselecteer alles
						</button>

						<button
							type="button"
							onClick={() => setSent(true)}
							className="w-full rounded-lg bg-gradient-to-r from-red-500 to-pink-500 py-2.5 text-sm font-bold text-white"
						>
							Deel met {selectedCount} vrienden! 🚀
						</button>

						<p className="mt-3 text-[8px] text-zinc-700">
							Door te delen ontvangen je contacten herinneringsmails en wordt je activiteit gedeeld met derden.
						</p>
					</>
				)}
			</Modal>
		</>
	);
}
