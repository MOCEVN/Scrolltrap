"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
	const [user, setUser] = useState<{
		username: string;
		email: string;
		createdAt: string;
	} | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const fetchUser = async () => {
			try {
				const response = await fetch("/api/auth/me", {
					method: "GET",
					credentials: "include",
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error(`Unexpected status ${response.status}`);
				}

				const payload = await response.json();

				if (isMounted) {
					setUser(payload.user);
				}
			} catch (error) {
				console.error("Failed to load session", error);
				if (isMounted) {
					setUser(null);
				}
			} finally {
				if (isMounted) {
					setIsLoadingUser(false);
				}
			}
		};

		void fetchUser();

		return () => {
			isMounted = false;
		};
	}, []);

	/*
	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Logout failed");
			}

			setUser(null);
			toast.success("You are logged out.");
		} catch (error) {
			console.error("Logout failed", error);
			toast.error("Unable to log out, please try again.");
		}
	};
	*/

	const handleDeleteAccount = async () => {
        const confirmationOnDelete = window.confirm(
     	 "Are you sure you want to delete your account?"
    );
     if (!confirmationOnDelete) return;

  const result = await fetch("/api/auth/delete", {
    method: "DELETE",
    credentials: "include",
  });

  const data = await result.json();

  if (!result.ok) {
    toast.error(data.error || "Failed to delete account");
    return;
  }

  toast.success("Your account has been successfully deleted");

  window.location.href = "/";
};

	const { isDoom } = useScenarioMode();

	return (
		<div className={`flex min-h-screen transition-colors duration-300 ${
			isDoom ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
		}`}>
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />

				<main className="flex-1 overflow-y-auto" data-scroll-container>
					<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
						<h1 className="text-2xl font-bold">Your Profile</h1>
						<p className={`mt-2 text-sm transition-colors duration-300 ${
							isDoom ? "text-slate-400" : "text-slate-600"
						}`}>
							Keep track of your demo account details below.
						</p>

						<div className={`mt-6 rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
							isDoom 
								? "border-red-900/30 bg-slate-800" 
								: "border-slate-200 bg-white"
						}`}>
							{isLoadingUser ? (
								<div className="flex items-center justify-center py-12">
									<div className={`h-8 w-8 animate-spin rounded-full border-4 border-t-transparent ${
										isDoom ? "border-red-500" : "border-indigo-500"
									}`} />
								</div>
							) : user ? (
								<dl className="grid gap-4 sm:grid-cols-2">
									<div>
										<dt className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
											isDoom ? "text-slate-400" : "text-slate-500"
										}`}>
											Username
										</dt>
										<dd className={`mt-1 text-base font-semibold transition-colors duration-300 ${
											isDoom ? "text-slate-100" : "text-slate-900"
										}`}>
											{user.username}
										</dd>
									</div>
									<div>
										<dt className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
											isDoom ? "text-slate-400" : "text-slate-500"
										}`}>
											Email
										</dt>
										<dd className={`mt-1 text-base font-semibold transition-colors duration-300 ${
											isDoom ? "text-slate-100" : "text-slate-900"
										}`}>
											{user.email}
										</dd>
									</div>
									<div>
										<dt className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
											isDoom ? "text-slate-400" : "text-slate-500"
										}`}>
											Joined
										</dt>
										<dd className={`mt-1 text-base font-semibold transition-colors duration-300 ${
											isDoom ? "text-slate-100" : "text-slate-900"
										}`}>
											{new Date(user.createdAt).toLocaleString()}
										</dd>
									</div>
								</dl>
							) : (
								<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
									<p className={`transition-colors duration-300 ${
										isDoom ? "text-slate-300" : "text-slate-600"
									}`}>
										You are not logged in. Log in to see your saved details.
									</p>
									<a
										href="/login"
										className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition ${
											isDoom 
												? "bg-red-600 hover:bg-red-500" 
												: "bg-emerald-500 hover:bg-emerald-600"
										}`}
									>
										Go to login
									</a>
								</div>
							)}

							{user && (
								<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ">
									<button
										type="button"
										onClick={handleDeleteAccount}
										className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
											isDoom 
												? "border-red-900/50 text-red-400 hover:border-red-700 hover:text-red-300" 
												: "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
										}`}
									>
										Remove my account
									</button>
								</div>
							)}
							
						</div>

						{/* Restored editable profile fields */}
						{/* Restored editable profile fields */}
						{user && (
							<div className={`mt-8 rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
								isDoom 
									? "border-red-900/30 bg-slate-800" 
									: "border-slate-200 bg-white/95"
							}`}>
								<h2 className="text-lg font-semibold">Edit details</h2>
								<p className={`mt-1 text-sm transition-colors duration-300 ${
									isDoom ? "text-slate-400" : "text-slate-500"
								}`}>
									These fields were previously on the profile page.
								</p>
								<form action="#" method="post" className="mt-4 user-details">
									<table className="w-full text-sm">
										<tbody className={`[&_td]:p-2 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:px-3 [&_input]:py-2 [&_label]:block transition-colors duration-300 ${
											isDoom 
												? "[&_input]:border-red-900/50 [&_input]:bg-slate-700 [&_input]:text-slate-100 [&_input]:placeholder-slate-500 [&_label]:text-slate-300" 
												: "[&_input]:border-slate-300 [&_input]:bg-white [&_label]:text-slate-600"
										}`}>
											<tr>
												<td className="align-top">
													<label
														htmlFor="Firstname"
													>
														<span className="block text-xs font-medium">
															First name
														</span>
														<input
															type="text"
															id="Firstname"
															name="txt_first_name"
															placeholder="First name"
														/>
													</label>
												</td>
												<td className="align-top">
													<label
														htmlFor="Lastname"
														
													>
														<span className="block text-xs font-medium">
															Last name
														</span>
														<input
															type="text"
															id="Lastname"
															name="txt_last_name"
															placeholder="Last name"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td className="align-top">
													<label
														htmlFor="street"
														
													>
														<span className="block text-xs font-medium">
															Street
														</span>
														<input
															type="text"
															id="street"
															name="txt_street"
															placeholder="Street"
														/>
													</label>
												</td>
												<td className="align-top">
													<label
														htmlFor="housenumber"
														
													>
														<span className="block text-xs font-medium">
															House number
														</span>
														<input
															type="text"
															id="housenumber"
															name="txt_house_number"
															placeholder="House number"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td className="align-top">
													<label
														htmlFor="postcode"
														
													>
														<span className="block text-xs font-medium">
															Postcode
														</span>
														<input
															type="text"
															id="postcode"
															name="txt_postcode"
															placeholder="Postcode"
														/>
													</label>
												</td>
												<td className="align-top">
													<label
														htmlFor="placeofresidence"
														
													>
														<span className="block text-xs font-medium">
															Place of Residence
														</span>
														<input
															type="text"
															id="placeofresidence"
															name="txt_place_of_residence"
															placeholder="Place of Residence"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label
														htmlFor="phonenumber"
														
													>
														<span className="block text-xs font-medium">
															Phone number
														</span>
														<input
															type="tel"
															id="phonenumber"
															name="txt_phone_number"
															placeholder="Phone number"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label
														htmlFor="email-edit"
														
													>
														<span className="block text-xs font-medium">
															Email
														</span>
														<input
															type="email"
															id="email-edit"
															name="txt_email"
															placeholder="Email"
															autoComplete="email"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label
														htmlFor="password-edit"
														
													>
														<span className="block text-xs font-medium">
															Password
														</span>
														<input
															type="password"
															id="password-edit"
															name="txt_password"
															placeholder="Password"
															autoComplete="new-password"
														/>
													</label>
												</td>
											</tr>
											<tr>
												<td colSpan={2} className="pt-2">
													<button
														type="submit"
														className={`rounded-full px-4 py-2 text-xs font-semibold text-white shadow transition ${
															isDoom 
																? "bg-red-600 hover:bg-red-500" 
																: "bg-emerald-500 hover:bg-emerald-600"
														}`}
													>
														Update
													</button>
												</td>
											</tr>
										</tbody>
									</table>
								</form>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
