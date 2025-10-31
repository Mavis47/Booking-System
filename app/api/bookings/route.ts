import { createBooking } from "@/app/controllers/bookingController";

export async function POST(req: Request) {
  const data = await req.json();
  return await createBooking(data);
}
