import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const getAllExperiences = async () => {
  const experiences = await prisma.experience.findMany({
    include: { slots: true },
  });
  return NextResponse.json(experiences);
};

export const getExperienceById = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
  }

  const experience = await prisma.experience.findUnique({
    where: { id },
    include: { slots: true },
  });

  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  return NextResponse.json(experience, { status: 200 });
};

export async function CreateNewExperience(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, image, slots } = body;

    // ✅ Validate required fields
    if (!title || !description || !price || !image) {
      return NextResponse.json(
        { message: "All fields (title, description, price, image) are required." },
        { status: 400 }
      );
    }

    // ✅ Create experience with slots
    const newExperience = await prisma.experience.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        slots: {
          create: (slots || []).map(
            (slot: { date: string; time: string; totalSeats?: number }) => ({
              date: new Date(slot.date),
              time: slot.time,
              totalSeats: slot.totalSeats ?? 10, // default to 10 seats per slot
              bookedSeats: 0,
            })
          ),
        },
      },
      include: { slots: true },
    });

    return NextResponse.json(
      { message: "Experience created successfully!", experience: newExperience },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
