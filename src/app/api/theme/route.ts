import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    const cookieStore = await cookies();
    cookieStore.set("theme", theme, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 año
    });

    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Error saving theme to cookie:", error);
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}
