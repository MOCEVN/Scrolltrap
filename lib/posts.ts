import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { posts } from "./schema";

export const createPost = async (userId: number, title: string, mediaUrl: string, mode: "dream" | "doom") => {

  const result = await db.insert(posts).values({
    userId,
    title,
    mediaUrl,
  }).returning();

  return Number(result);
};

export const getUserPosts = async (userId: number) => {
  return db.select().from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
};

export const deletePost = async (postId: number) => {
  await db.delete(posts).where(eq(posts.id, postId));
};

