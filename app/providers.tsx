"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import FriendNotifications from "@/components/friend-notifications";
import { ScenarioModeProvider } from "@/components/scenario-mode-provider";
import { useFriends } from "@/hooks/use-friends";

const NotificationsWrapper = ({ children }: { children: ReactNode }) => {
	const { addedFriends } = useFriends();

	return (
		<>
			{children}
			<FriendNotifications friends={addedFriends} />
		</>
	);
};

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ScenarioModeProvider>
			<Toaster position="top-right" />
			<NotificationsWrapper>{children}</NotificationsWrapper>
		</ScenarioModeProvider>
	);
};

export default Providers;
