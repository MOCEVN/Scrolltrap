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
												<label htmlFor="Voornaam">
													<span>Voornaam</span>
													<input
														type="text"
														name="txt_Voornaam"
														id="Voornaam"
														placeholder="Voornaam"
													/>
												</label>
											</td>
											<td>
												<label htmlFor="Achternaam">
													<span>Achternaam</span>
													<input
														type="text"
														name="txt_Achternaam"
														id="Achternaam"
														placeholder="Achternaam"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td>
												<label htmlFor="straat">
													<span>Straat</span>
													<input
														type="text"
														name="txt_straat"
														id="straat"
														placeholder="Straat"
													/>
												</label>
											</td>

											<td>
												<label htmlFor="huisnummer">
													<span>Huisnummer</span>
													<input
														type="text"
														name="txt_huisnummer"
														id="huisnummer"
														placeholder="Huisnummer"
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
												<label htmlFor="woonplaats">
													<span>Woonplaats</span>
													<input
														type="text"
														name="txt_woonplaats"
														id="woonplaats"
														placeholder="Woonplaats"
													/>
												</label>
											</td>
										</tr>

										<tr>
											<td colSpan={2}>
												<label htmlFor="Telefoon">
													<span>Telefoon</span>
													<input
														type="tel"
														name="txt_Telefoon"
														id="Telefoon"
														placeholder="Telefoon"
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
												<label htmlFor="wachtwoord">
													<span>Wachtwoord</span>
													<input
														type="password"
														name="txt_wachtwoord"
														id="wachtwoord"
														placeholder="Wachtwoord"
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
