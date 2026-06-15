import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/types";

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
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Failed to save theme",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
