"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Slot {
  id: number;
  date: string;
  time: string;
  totalSeats: number; 
  bookedSeats: number;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  slots: Slot[];
}

export default function ExperienceDetails({ id }: { id: string }) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchExperience = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, { cache: "no-store" });
        
      if (res.ok) {
        const data = await res.json();
        setExperience(data);
      }
    };
    fetchExperience();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time!");
      return;
    }

    const selectedSlot = experience?.slots.find(
    (s) => s.date === selectedDate && s.time === selectedTime
  );

  if (!selectedSlot) {
    alert("Invalid slot selected!");
    return;
  }

    const qty = 1;
    const subtotal = experience?.price || 0;
    const taxes = 59;
    const total = subtotal + taxes;

    router.push(
    `/checkout?experienceId=${experience?.id}` +
      `&title=${encodeURIComponent(experience?.title || "")}` +
      `&date=${encodeURIComponent(selectedDate)}` +
      `&time=${encodeURIComponent(selectedTime)}` +
      `&price=${subtotal}` +
      `&qty=${qty}` +
      `&tax=${taxes}` +
      `&total=${total}` + 
      `&slotId=${selectedSlot.id}`
    );
  };

  if (!experience) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Image
          src={experience.image}
          alt={experience.title}
          width={900}
          height={450}
          className="rounded-xl mb-6 object-cover"
        />

        <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
        <p className="text-gray-600 mb-4">{experience.description}</p>

        {/* Choose Date */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Choose date</h2>
          <div className="flex flex-wrap gap-2">
            {experience.slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedDate(slot.date)}
                className={`px-4 py-2 text-sm border rounded-md transition ${
                  selectedDate === slot.date ? "bg-yellow-300 border-yellow-400" : "hover:bg-yellow-100"
                }`}
              >
                {formatDate(slot.date)}
              </button>
            ))}
          </div>
        </div>

        {/* Choose Time */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Choose time</h2>
          <div className="flex flex-wrap gap-2">
            {experience.slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.time)}
                className={`px-4 py-2 text-sm border rounded-md transition ${
                  selectedTime === slot.time ? "bg-gray-200 border-gray-400" : "hover:bg-gray-100"
                }`}
              >
                {slot.time}{" "}
                <span className="text-xs text-gray-400 ml-1">
                  {slot.totalSeats > 0 ? `${slot.totalSeats} left` : "Sold out"}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            All times are in IST (GMT +5:30)
          </p>
        </div>

        {/* About */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-600 text-sm">
            {experience.description}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Summary Card) */}
      <div className="bg-gray-50 rounded-xl shadow-md p-6 h-fit">
        <h2 className="text-lg font-semibold mb-4">Starts at</h2>

        <div className="flex justify-between text-sm mb-2">
          <span>Quantity</span>
          <span>1</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>₹{experience.price}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Taxes</span>
          <span>₹59</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total</span>
          <span>₹{experience.price + 59}</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-md font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
