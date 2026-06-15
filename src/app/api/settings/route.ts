import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: { theme: "dark" },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error fetching settings",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;
    
    let settings = await prisma.settings.findFirst();
    
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { theme },
      });
    } else {
      settings = await prisma.settings.create({
        data: { theme },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error updating settings",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
