import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function createBooking(data: any) {
  try {
    const { userName, email, experienceId, slotId, date, time } = data;

    if (!userName || !email || !experienceId || !slotId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slot exists
    const slot = await prisma.slot.findUnique({
      where: { id: Number(slotId) },
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.bookedSeats >= slot.totalSeats) {
      return NextResponse.json(
        { error: "This slot is sold out" },
        { status: 400 }
      );
    }

    // ✅ Create booking + update slot in one transaction
    const [booking, updatedSlot] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userName,
          email,
          experienceId: Number(experienceId),
          date: new Date(date),
          time,
          Slot: { connect: { id: slot.id } },
        },
      }),
      prisma.slot.update({
        where: { id: slot.id },
        data: {
          bookedSeats: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Booking successful ✅",
      booking,
      updatedSlot,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating booking" },
      { status: 500 }
    );
  }
}
