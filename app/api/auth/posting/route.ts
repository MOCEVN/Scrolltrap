import { getUserPosts } from "@/lib/posts";
import { findUserById } from "@/lib/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("demo_user_id");
    if (!cookie || !Number.isInteger(Number(cookie.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(cookie.value);
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await getUserPosts(userId);
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
