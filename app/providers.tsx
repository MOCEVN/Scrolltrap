"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import FriendNotifications from "@/components/friend-notifications";
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
		<>
			<Toaster position="top-right" />
			<NotificationsWrapper>{children}</NotificationsWrapper>
		</>
	);
};

export default Providers;
