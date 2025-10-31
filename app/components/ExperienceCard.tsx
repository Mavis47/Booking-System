"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ExperienceCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  location: string;
  price: string;
}

export default function ExperienceCard({
  id,
  image,
  title,
  description,
  location,
  price,
}: ExperienceCardProps) {
  const router = useRouter();

  const handleViewDetails = async (id: number) => {
    try {
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`);
    } catch (error) {
      console.error("Error fetching experience:", error);
      alert("Something went wrong while fetching experience details.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <Image
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        width={400}
        height={200}
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            {location}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-800 font-medium">From ₹{price}</p>
          <button
            onClick={() => handleViewDetails(id)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
