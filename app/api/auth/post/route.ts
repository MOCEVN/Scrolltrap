import { createPost } from "@/lib/posts";
import { findUserById } from "@/lib/users";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get("demo_user_id");
    if (!cookie?.value || isNaN(Number(cookie.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(cookie.value);
    const user = await findUserById(userId);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title")?.toString()?.trim() || "";
    const file = formData.get("file") as File;

    if (!file || !title) {
      return NextResponse.json({ error: "Title and image required" }, { status: 400 });
    }

  const allowedTypes = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime'
];

if (!allowedTypes.includes(file.type)) {
  return NextResponse.json({ 
    error: "Please upload an image (JPEG, PNG, WebP, GIF) or video (MP4, WebM, MOV)" 
  }, { status: 400 });
}

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (10MB max)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);

    const mediaUrl = `/uploads/${filename}`;
    await createPost(userId, title, mediaUrl, "dream");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}