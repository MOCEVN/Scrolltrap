import { getDb } from "@/lib/db";
import { deletePost } from "@/lib/posts";
import { posts } from "@/lib/schema";
import { findUserById } from "@/lib/users";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const cookie = req.cookies.get("demo_user_id");
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = Number(cookie.value);
        if (isNaN(userId)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

        const user = await findUserById(userId);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: postId } = await req.json();
        if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

        const parsedPostId = Number(postId);
        if (isNaN(parsedPostId)) return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });

        const db = getDb();
        const post = await db.select().from(posts).where(eq(posts.id, parsedPostId)).limit(1);
        if (!post.length || post[0].userId !== userId) {
            return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
        }

        await deletePost(parsedPostId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete post error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
