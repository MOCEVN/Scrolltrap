import { NextResponse } from "next/server";

import { verifyCredentials } from "@/lib/users";

const sanitize = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const identifier = sanitize(payload.username ?? payload.email);
    const password = sanitize(payload.password);

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please provide your username (or email) and password." },
        { status: 400 },
      );
    }

    const normalizedIdentifier = identifier.includes("@")
      ? identifier.toLowerCase()
      : identifier;

    const user = await verifyCredentials(normalizedIdentifier, password);

    if (!user) {
      return NextResponse.json(
        { error: "We could not match those credentials." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ user });

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
    console.error("Failed to login user", error);
    return NextResponse.json(
      { error: "Something went wrong while logging you in." },
      { status: 500 },
    );
  }
}
