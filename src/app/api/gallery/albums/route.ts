import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: { photos: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(albums);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const album = await prisma.album.create({
      data: {
        name: body.name,
        description: body.description || null,
        coverImage: body.coverImage || null,
      },
      include: { photos: true },
    });
    return NextResponse.json(album, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}
