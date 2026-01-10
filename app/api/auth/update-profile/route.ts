import { updateUserById } from "@/lib/users";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
	try {
		const cookie = request.cookies.get("demo_user_id");
		if (!cookie) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const userId = Number(cookie.value);
		if (Number.isNaN(userId)) {
			return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
		}

		const body = await request.json();
		console.log("📦 Received body:", body);

		// Filter lege velden eruit
		const updateData: Record<string, string> = {};
		Object.entries(body).forEach(([key, value]) => {
			if (value && value.toString().trim() !== "") {
				updateData[key] = value.toString().trim();
			}
		});

		console.log("✅ Filtered updateData:", updateData);

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
		}

		const updatedUser = await updateUserById(userId, updateData);
		console.log("👤 Updated user:", updatedUser);

		return NextResponse.json({ user: updatedUser });
	} catch (err) {
		console.error("❌ Update error:", err);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 },
		);
	}
}
