import { NextResponse } from "next/server";

type Promo = {
  type: "percentage" | "flat";
  value: number;
};

const PROMO_CODES: Record<string, Promo> = {
  SAVE10: { type: "percentage", value: 10 },
  FLAT100: { type: "flat", value: 100 },
};

export const validatePromo = async (code: string, amount: number) => {
  const promo = PROMO_CODES[code.toUpperCase()];

  if (!promo)
    return NextResponse.json({ valid: false, message: "Invalid promo code" });

  let discount = 0;
  if (promo.type === "percentage") discount = (amount * promo.value) / 100;
  else discount = promo.value;

  const total = amount - discount;
  return NextResponse.json({ valid: true, discount, total });
};
