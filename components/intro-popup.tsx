"use client";

import { Button } from "./ui/button";

export default function IntroPopup({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="
        fixed inset-0 z-50 flex items-center justify-center p-4
        before:fixed before:inset-0 before:bg-black/50 before:backdrop-blur-sm
      "
    >
      <div
        className="
          relative w-full max-w-2xl rounded-xl bg-[var(--card)] p-8
          text-[var(--card-foreground)] shadow-2xl
          ring-1 ring-black/5
          md:max-w-3xl
        "
      >
        {/* Titel */}
        <h2
          className="
            mb-4 text-center text-2xl font-bold text-[var(--sidebar-primary)]
            md:text-3xl lg:text-4xl
          "
        >
          Welcome to Our Scroll Trap project!
        </h2>

        {/* Tekst */}
        <p className="mb-4 text-base leading-relaxed md:text-lg">
          This project is designed to demonstrate <strong>dark pattern techniques</strong> and what could be used as{" "}
          <strong>better alternatives</strong> by social media platforms and web development.
        </p>

        <p className="mb-4 text-base leading-relaxed md:text-lg">
          This project is made by a group of students attending the{" "}
          <a
            href="https://www.hva.nl/"
            target="_blank"
            rel="noopener"
            className="font-bold text-[var(--primary)] underline hover:no-underline"
          >
            HVA
          </a>
          .
        </p>

        <p className="mb-4 text-base leading-relaxed md:text-lg">
          This project is made for{" "}
          <a
            href="https://www.bitsoffreedom.nl/"
            target="_blank"
            rel="noopener"
            className="font-bold text-[var(--primary)] underline hover:no-underline"
          >
            Bits of Freedom
          </a>
          .
        </p>

        <p className="mb-6 text-base leading-relaxed md:text-lg">
          <strong>All data that is given is not used for any commercial purposes.</strong>
        </p>

        {/* Knop */}
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="
              rounded-md bg-[var(--primary)] px-6 py-3 text-base font-medium
              text-[var(--primary-foreground)] transition-all duration-200
              hover:bg-[var(--primary)/0.9] focus:outline-none focus:ring-2
              focus:ring-[var(--primary)] focus:ring-offset-2
              active:scale-95
            "
          >
            Close
          </Button>
        </div>
      </div>
    </section>
  );
}