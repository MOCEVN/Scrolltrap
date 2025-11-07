"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function ProfilePage() {
	const [showLikedOnly, setShowLikedOnly] = useState(false);
	const [likedCount, setLikedCount] = useState(0); // or get from your hook
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex min-h-screen bg-slate-100 text-slate-900">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header
					showLikedOnly={showLikedOnly}
					likedCount={likedCount}
					onToggleShowLiked={() => setShowLikedOnly((prev) => !prev)}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					handleSearch={() => console.log("Search:", searchQuery)}
				/>

				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
						<h1 className="text-2xl font-bold">Your Profile</h1>
						<p className="mt-4">This is your profile page.</p>

						<div className="border-b border-slate-200 backdrop-blur bg-white/95 py-6 px-4">
							<form action="" method="post">
								<table>
									<tbody>
										<tr>
											<td>
												<label htmlFor="First name">
													<span>First name</span>
													<input
														type="text"
														name="txt_First_Name"
														id="Firstname"
														placeholder="First name"
													/>
												</label>
											</td>
											<td>
												<label htmlFor="Last name">
													<span>Achternaam</span>
													<input
														type="text"
														name="txt_Last_Name"
														id="Lastname"
														placeholder="Last name"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td>
												<label htmlFor="Street">
													<span>Street</span>
													<input
														type="text"
														name="txt_street"
														id="street"
														placeholder="street"
													/>
												</label>
											</td>

											<td>
												<label htmlFor="House number">
													<span>House number</span>
													<input
														type="text"
														name="txt_house_number"
														id="housenumber"
														placeholder="Housenumber"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td>
												<label htmlFor="postcode">
													<span>Postcode</span>
													<input
														type="text"
														name="txt_postcode"
														id="postcode"
														placeholder="Postcode"
													/>
												</label>
											</td>

											<td>
												<label htmlFor="place of residence">
													<span>Place of Residence</span>
													<input
														type="text"
														name="txt_place_of_residence"
														id="placeofresidence"
														placeholder="Place of Residence"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td colSpan={2}>
												<label htmlFor="Phone Number">
													<span>Phone number</span>
													<input
														type="tel"
														name="txt_phone_number"
														id="phonenumber"
														placeholder="Phone Number"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td colSpan={2}>
												<label htmlFor="email">
													<span>Email</span>
													<input
														type="email"
														name="txt_email"
														id="email"
														autoComplete="true"
														placeholder="Email"
														required
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td colSpan={2}>
												<label htmlFor="password">
													<span>Password</span>
													<input
														type="password"
														name="txt_password"
														id="password"
														placeholder="Password"
														required
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td colSpan={2}>
												<button
													type="submit"
													className="bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-3 py-2 text-xs font-medium transition"
												>
													Update
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</form>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
