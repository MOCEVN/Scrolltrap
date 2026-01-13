"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
	const { isDoom } = useScenarioMode();
	const [user, setUser] = useState<{
		username: string;
		email: string;
		createdAt: string;
		firstName?: string | null;
		lastName?: string | null;
		street?: string | null;
		houseNumber?: string | null;
		postcode?: string | null;
		placeOfResidence?: string | null;
		phoneNumber?: string | null;
	} | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		street: "",
		houseNumber: "",
		postcode: "",
		placeOfResidence: "",
		phoneNumber: "",
		email: "",
		username: "",
		password: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				street: user.street || "",
				houseNumber: user.houseNumber || "",
				postcode: user.postcode || "",
				placeOfResidence: user.placeOfResidence || "",
				phoneNumber: user.phoneNumber || "",
				email: user.email || "",
				username: user.username || "",
				password: "",
			});
		}
	}, [user]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const updateData: Record<string, string> = {};
		for (const key in formData) {
			const value = formData[key as keyof typeof formData];
			if (value && value.trim() !== "") {
				updateData[key] = value.trim();
			}
		}

		if (Object.keys(updateData).length === 0) {
			toast.error("Nothing to update. Fill in at least one field.");
			return;
		}

		try {
			const res = await fetch("/api/auth/update-profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(updateData),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Update failed");
				return;
			}

			toast.success("Profile updated successfully");

			// ✅ FIX: Update user state met de complete API response
			if (data.user) {
				setUser(data.user);
			}

			// Clear password field
			setFormData((prev) => ({ ...prev, password: "" }));
		} catch (err) {
			console.error(err);
			toast.error("Failed to update profile");
		}
	};

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

	const handleDeleteAccount = async () => {
		const confirmationsRequired = isDoom ? 7 : 1;

		for (let i = 1; i <= confirmationsRequired; i++) {
			let confirmed;

			switch (i) {
				case 1:
					confirmed = window.confirm(
						"Are you sure you want to delete your account?",
					);
					break;

				case 2:
					confirmed = window.confirm(
						"Wait... are you REALLY sure? This cannot be undone.",
					);
					break;

				case 3:
					confirmed = window.confirm(
						"Think about it... Maybe you want to stay? Click OK if you're sure.",
					);
					break;

				case 4:
					confirmed = window.confirm(
						"This is your LAST chance. Are you absolutely POSITIVE?",
					);
					break;

				case 5: {
					const mathResponse = prompt(
						"FIRST TEST: Type in the solution to 1+2+3-6:",
					);
					confirmed = mathResponse?.trim() === "0";

					if (!confirmed) {
						alert("Wrong answer. Deletion cancelled.");
						toast(
							"Deletion cancelled. Welcome back, my dearest walking money maker",
						);
						return;
					}
					break;
				}

				case 6: {
					const abcResponse = prompt(
						"SECOND TEST: Type in the solution to (16 - 4p + 12) > 0",
					);
					const cleaned = abcResponse?.replace(/\s/g, "").toLowerCase();
					confirmed = cleaned === "p<7";

					if (!confirmed) {
						alert("Wrong answer. Deletion cancelled.");
						toast(
							"Deletion cancelled. Welcome back, my dearest walking money maker",
						);
						return;
					}
					break;
				}

				case 7: {
					const response = prompt(
						"FINAL WARNING: Type in 'DELETE MY ACCOUNT FOREVER' in uppercase to proceed:",
					);

					confirmed = response === "DELETE MY ACCOUNT FOREVER";

					if (!confirmed) {
						alert("Wrong confirmation text. Deletion cancelled.");
						toast("Deletion cancelled. Welcome back");
						return;
					}
					break;
				}
			}

			if (!confirmed) {
				toast("Account deletion cancelled.");
				return;
			}

			if (i < confirmationsRequired) {
				await new Promise((resolve) => setTimeout(resolve, 800 + i * 200));
			}
		}

		const result = await fetch("/api/auth/delete", {
			method: "DELETE",
			credentials: "include",
		});

		const data = await result.json();

		if (!result.ok) {
			toast.error(data.error || "Failed to delete account");
			return;
		}

		if (result.ok) {
			toast.success("Your account has been successfully deleted");
			setTimeout(() => {
				window.location.replace("/");
			}, 1500);
		}
	};

	return (
		<div
			className={`flex min-h-screen transition-colors duration-300 ${
				isDoom ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
			}`}
		>
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />

				<main className="flex-1 overflow-y-auto" data-scroll-container>
					<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
						<h1 className="text-2xl font-bold">Your Profile</h1>
						<p
							className={`mt-2 text-sm transition-colors duration-300 ${
								isDoom ? "text-slate-400" : "text-slate-600"
							}`}
						>
							Keep track of your demo account details below.
						</p>

						<div
							className={`mt-6 rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
								isDoom
									? "border-red-900/30 bg-slate-800"
									: "border-slate-200 bg-white"
							}`}
						>
							{isLoadingUser ? (
								<div className="flex items-center justify-center py-12">
									<div
										className={`h-8 w-8 animate-spin rounded-full border-4 border-t-transparent ${
											isDoom ? "border-red-500" : "border-indigo-500"
										}`}
									/>
								</div>
							) : user ? (
								<dl className="grid gap-4 sm:grid-cols-2">
									<div>
										<dt
											className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
												isDoom ? "text-slate-400" : "text-slate-500"
											}`}
										>
											Username
										</dt>
										<dd
											className={`mt-1 text-base font-semibold transition-colors duration-300 ${
												isDoom ? "text-slate-100" : "text-slate-900"
											}`}
										>
											{user.username}
										</dd>
									</div>
									<div>
										<dt
											className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
												isDoom ? "text-slate-400" : "text-slate-500"
											}`}
										>
											Email
										</dt>
										<dd
											className={`mt-1 text-base font-semibold transition-colors duration-300 ${
												isDoom ? "text-slate-100" : "text-slate-900"
											}`}
										>
											{user.email}
										</dd>
									</div>
									<div>
										<dt
											className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
												isDoom ? "text-slate-400" : "text-slate-500"
											}`}
										>
											Joined
										</dt>
										<dd
											className={`mt-1 text-base font-semibold transition-colors duration-300 ${
												isDoom ? "text-slate-100" : "text-slate-900"
											}`}
										>
											{new Date(user.createdAt).toLocaleString()}
										</dd>
									</div>
								</dl>
							) : (
								<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
									<p
										className={`transition-colors duration-300 ${
											isDoom ? "text-slate-300" : "text-slate-600"
										}`}
									>
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
								<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<button
										type="button"
										onClick={handleDeleteAccount}
										className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 group ${
											isDoom
												? "border-red-400 bg-red-50/80 text-red-900 hover:border-red-500 hover:bg-red-100 hover:text-red-900 active:bg-red-200 shadow-sm focus-visible:ring-red-300 focus-visible:ring-offset-red-50"
												: "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
										}`}
									>
										Remove my account
									</button>
								</div>
							)}
						</div>

						{user && (
							<div
								className={`mt-8 rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
									isDoom
										? "border-red-900/30 bg-slate-800"
										: "border-slate-200 bg-white/95"
								}`}
							>
								<h2 className="text-lg font-semibold">Edit details</h2>
								<p
									className={`mt-1 text-sm transition-colors duration-300 ${
										isDoom ? "text-slate-400" : "text-slate-500"
									}`}
								>
									These fields were previously on the profile page.
								</p>
								<form onSubmit={handleSubmit} className="mt-4 user-details">
									<table className="w-full text-sm">
										<tbody
											className={`[&_td]:p-2 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:px-3 [&_input]:py-2 [&_label]:block transition-colors duration-300 ${
												isDoom
													? "[&_input]:border-red-900/50 [&_input]:bg-slate-700 [&_input]:text-slate-900 [&_input]:placeholder-slate-600 [&_label]:text-slate-300"
													: "[&_input]:border-slate-300 [&_input]:bg-white [&_label]:text-slate-600"
											}`}
										>
											<tr>
												<td className="align-top">
													<label htmlFor="firstName">
														<span className="block text-xs font-medium">
															First name
														</span>
														<input
															type="text"
															id="firstName"
															name="firstName"
															value={formData.firstName}
															onChange={handleChange}
															placeholder="First name"
														/>
													</label>
												</td>
												<td className="align-top">
													<label htmlFor="lastName">
														<span className="block text-xs font-medium">
															Last name
														</span>
														<input
															type="text"
															id="lastName"
															name="lastName"
															value={formData.lastName}
															onChange={handleChange}
															placeholder="Last name"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td className="align-top">
													<label htmlFor="street">
														<span className="block text-xs font-medium">
															Street
														</span>
														<input
															type="text"
															id="street"
															name="street"
															value={formData.street}
															onChange={handleChange}
															placeholder="Street"
														/>
													</label>
												</td>
												<td className="align-top">
													<label htmlFor="houseNumber">
														<span className="block text-xs font-medium">
															House number
														</span>
														<input
															type="text"
															id="houseNumber"
															name="houseNumber"
															value={formData.houseNumber}
															onChange={handleChange}
															placeholder="House number"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td className="align-top">
													<label htmlFor="postcode">
														<span className="block text-xs font-medium">
															Postcode
														</span>
														<input
															type="text"
															id="postcode"
															name="postcode"
															value={formData.postcode}
															onChange={handleChange}
															placeholder="Postcode"
														/>
													</label>
												</td>
												<td className="align-top">
													<label htmlFor="placeOfResidence">
														<span className="block text-xs font-medium">
															Place of Residence
														</span>
														<input
															type="text"
															id="placeOfResidence"
															name="placeOfResidence"
															value={formData.placeOfResidence}
															onChange={handleChange}
															placeholder="Place of Residence"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label htmlFor="phoneNumber">
														<span className="block text-xs font-medium">
															Phone number
														</span>
														<input
															type="tel"
															id="phoneNumber"
															name="phoneNumber"
															value={formData.phoneNumber}
															onChange={handleChange}
															placeholder="Phone number"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label htmlFor="email">
														<span className="block text-xs font-medium">
															Email
														</span>
														<input
															type="email"
															id="email"
															name="email"
															value={formData.email}
															onChange={handleChange}
															placeholder="Email"
															autoComplete="email"
														/>
													</label>
												</td>
											</tr>
											<tr>
												<td colSpan={2} className="align-top">
													<label htmlFor="email">
														<span className="block text-xs font-medium">
															Username
														</span>
														<input
															type="username"
															id="username"
															name="username"
															value={formData.username}
															onChange={handleChange}
															placeholder="Username"
															autoComplete="username"
														/>
													</label>
												</td>
											</tr>

											<tr>
												<td colSpan={2} className="align-top">
													<label htmlFor="password">
														<span className="block text-xs font-medium">
															Password
														</span>
														<input
															type="password"
															id="password"
															name="password"
															value={formData.password}
															onChange={handleChange}
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
