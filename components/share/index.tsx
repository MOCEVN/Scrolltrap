"use client";

import { useScenario } from "@/hooks/use-scenario";
import { DoomShare } from "./doom-share";
import { DreamShare } from "./dream-share";

type ShareInviteProps = {
	imageUrl: string;
	imageTitle: string;
};

export function ShareInvite({ imageUrl, imageTitle }: ShareInviteProps) {
	const { isDream } = useScenario();

	if (isDream) {
		return <DreamShare imageUrl={imageUrl} imageTitle={imageTitle} />;
	}

	return <DoomShare imageUrl={imageUrl} imageTitle={imageTitle} />;
}

export default ShareInvite;
