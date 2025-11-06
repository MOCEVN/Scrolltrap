import { NextRequest, NextResponse } from "next/server";

import { findUserById } from "@/lib/users";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("demo_user_id");

  if (!cookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const id = Number.parseInt(cookie.value, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await findUserById(id);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
