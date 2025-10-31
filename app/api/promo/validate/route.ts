import { validatePromo } from "@/app/controllers/promoController";

export async function POST(req: Request) {
  const { code, amount } = await req.json();
  return await validatePromo(code, amount);
}
