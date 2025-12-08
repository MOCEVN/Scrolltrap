import { deleteUser } from "@/lib/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("demo_user_id")?.value;
  const scenarioMode = cookieStore.get("scenario_mode")?.value || 'dream'; 

  if (!userId) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const deleted = await deleteUser(Number(userId));

  if (!deleted) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (scenarioMode === 'doom') {
    return NextResponse.json({ 
      error: "Account removal is not available at the moment. Email the customerservice for more info." 
    }, { status: 403 });
  }

  const response = NextResponse.json(
    { message: "Account deleted successfully." },
    { status: 200 }
  );

  response.cookies.set("demo_user_id", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}