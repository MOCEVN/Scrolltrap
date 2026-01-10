import { NextResponse } from "next/server";

import { createUser, isEmailTaken, isUsernameTaken } from "@/lib/users";

const sanitize = (value: unknown) =>
	typeof value === "string" ? value.trim() : "";

const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;

export async function POST(request: Request) {
	try {
		const payload = await request.json();
		const username = sanitize(payload.username);
		const email = sanitize(payload.email).toLowerCase();
		const password = sanitize(payload.password);

		if (!username || !email || !password) {
			return NextResponse.json(
				{ error: "Username, email, and password are required." },
				{ status: 400 },
			);
		}

		if (!usernamePattern.test(username)) {
			return NextResponse.json(
				{
					error:
						"Username should be 3-30 characters and contain only letters, numbers, or underscores.",
				},
				{ status: 400 },
			);
		}

		if (!email.includes("@") || email.length < 5) {
			return NextResponse.json(
				{ error: "Please provide a valid email address." },
				{ status: 400 },
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password should contain at least 6 characters." },
				{ status: 400 },
			);
		}

		const [usernameTaken, emailTaken] = await Promise.all([
			isUsernameTaken(username),
			isEmailTaken(email),
		]);

		if (usernameTaken) {
			return NextResponse.json(
				{ error: "That username is already in use." },
				{ status: 409 },
			);
		}

		if (emailTaken) {
			return NextResponse.json(
				{ error: "That email address already has an account." },
				{ status: 409 },
			);
		}

		const user = await createUser({ username, email, password });

		const response = NextResponse.json({ user }, { status: 201 });

		response.cookies.set({
			name: "demo_user_id",
			value: String(user.id),
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch (error) {
		console.error("Failed to register user", error);

		return NextResponse.json(
			{ error: "Something went wrong while creating your account." },
			{ status: 500 },
		);
	}
}
