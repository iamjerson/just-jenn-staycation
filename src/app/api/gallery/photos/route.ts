import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const photo = await prisma.photo.create({
      data: {
        url: body.url,
        caption: body.caption || null,
        albumId: parseInt(body.albumId),
      },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add photo" },
      { status: 500 }
    );
  }
}
