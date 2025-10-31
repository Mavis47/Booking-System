"use client";

import { useEffect, useState } from "react";

export default function BookingSuccess() {
  const [refId, setRefId] = useState<string>("");

  useEffect(() => {
    // Generate a random reference ID (like HUF56&SO)
    const generateRefId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };

    setRefId(generateRefId());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center">
        {/* Green tick */}
        <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Booking Confirmed</h1>
        <p className="text-gray-500 mb-8">Ref ID: {refId}</p>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
