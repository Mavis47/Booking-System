"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const experienceId = Number(searchParams.get("experienceId"));
  const title = searchParams.get("title") || "Experience";
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const qty = Number(searchParams.get("qty")) || 1;
  const price = Number(searchParams.get("price")) || 0;
  const tax = Number(searchParams.get("tax")) || 0;
  const total = Number(searchParams.get("total")) || price + tax;
  const slotId = Number(searchParams.get("slotId"));
  const router = useRouter();

  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);
  const [loading, setLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    const res = await fetch("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, amount: total }),
    });
    const data = await res.json();

    if (data.valid) {
      setDiscount(data.discount);
      setFinalTotal(data.total);
      setMessage(`Promo applied! You saved ₹${data.discount}`);
    } else {
      setMessage(data.message);
    }
  };

  const handleConfirmBooking = async () => {
    if (!userName || !email) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName,
        email,
        experienceId,
        date,
        time,
        slotId,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(`✅ Booking successful!`);
      router.push(
      `/success`
      );
    } else {
      setMessage(data.error || "Booking failed!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-10">
      <div className="w-11/12 max-w-5xl flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 bg-gray-50 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Checkout</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleApplyPromo}
              className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Apply
            </button>
          </div>

          {message && (
            <p className="text-sm text-green-600 mt-2">{message}</p>
          )}
        </div>

        {/* RIGHT SIDE — Summary */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-2xl shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-6">Booking Summary</h3>

          <div className="text-gray-700 space-y-1 mb-6">
            <p>
              <span className="font-medium">Experience:</span> {title}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {date ? new Date(date).toISOString().split("T")[0] : "N/A"}
            </p>
            <p>
              <span className="font-medium">Time:</span> {time}
            </p>
            <p>
              <span className="font-medium">Qty:</span> {qty}
            </p>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>₹{price}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Taxes</span>
            <span>₹{tax}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
          >
            {loading ? "Processing..." : "Pay and Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
