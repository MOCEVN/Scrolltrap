"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import FriendNotifications from "@/components/friend-notifications";
import { useFriends } from "@/hooks/use-friends";
import { ScenarioProvider } from "@/hooks/use-scenario";

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
		<ScenarioProvider>
			<Toaster position="top-right" />
			<NotificationsWrapper>{children}</NotificationsWrapper>
		</ScenarioProvider>
	);
};

export default Providers;
