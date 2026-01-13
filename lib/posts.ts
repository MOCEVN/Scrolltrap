import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { posts } from "./schema";

export const createPost = async (userId: number, title: string, mediaUrl: string, mode: "dream" | "doom") => {
  const db = getDb();

  const result = await db.insert(posts).values({
    userId,
    title,
    mediaUrl,
  }).returning();

  return Number(result);
};

export const getUserPosts = async (userId: number) => {
  const db = getDb();
  return db.select().from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
};

export const deletePost = async (postId: number) => {
  const db = getDb();
  await db.delete(posts).where(eq(posts.id, postId));
};

