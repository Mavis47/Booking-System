import { getExperienceById } from "@/app/controllers/experienceController";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const params = await context.params; 
  return await getExperienceById(req, { params });
}

export async function DELETE(
  req: Request,
  context : { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 
    const experienceId = Number(id);

    if (isNaN(experienceId)) {
      return NextResponse.json(
        { message: "Invalid experience ID." },
        { status: 400 }
      );
    }

    // Check if the experience exists
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
      include: { slots: true, bookings: true },
    });

    if (!experience) {
      return NextResponse.json(
        { message: "Experience not found." },
        { status: 404 }
      );
    }

    // ✅ Delete related data (bookings + slots) first to maintain referential integrity
    await prisma.booking.deleteMany({
      where: { experienceId },
    });

    await prisma.slot.deleteMany({
      where: { experienceId },
    });

    // ✅ Now delete the experience
    await prisma.experience.delete({
      where: { id: experienceId },
    });

    return NextResponse.json(
      { message: "Experience deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}