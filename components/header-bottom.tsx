"use client";

import ScenarioSwitch from "./scenario-switch";
import { Button } from "./ui/button";

interface HeaderBottomProps {
    heading: string;
    subheading: string | boolean;
    likedCount: number;
    loggedIn: boolean | null;
    showLikedOnly: boolean;
    onToggleShowLiked: () => void;
}


export default function HeaderBottom({
    heading,
    subheading,
    likedCount,
    loggedIn,
    showLikedOnly,
    onToggleShowLiked,
}: HeaderBottomProps) {
    return (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {heading}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    {subheading}
                </p>
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
                <ScenarioSwitch />

                {likedCount > 0 && loggedIn === true && (
                    <Button
                        type="button"
                        onClick={onToggleShowLiked}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                            showLikedOnly
                                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                                : "bg-border text-indigo-600 shadow-accent/25"
                        }`}
                    >
                        {showLikedOnly ? "Viewing likes" : "Show likes"}
                        <span className="text-base">❤️ {likedCount}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
