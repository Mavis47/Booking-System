import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get search query param
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // If no query, return all experiences
    if (!query) {
      const allExperiences = await prisma.experience.findMany();
      return NextResponse.json(allExperiences);
    }

    // Otherwise, filter by title or description
    const experiences = await prisma.experience.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive", // case-insensitive
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}
