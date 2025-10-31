"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ExperienceCard from "./components/ExperienceCard";
import { useSearch } from "./contexts/SearchContexts";
;

interface Experience {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  slots: {
    id: number;
    date: string;
    time: string;
    available: boolean;
    experienceId: number;
  }[];
}

export default function Home() {
  const { query } = useSearch();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const url = query
          ? `/api/search?q=${encodeURIComponent(query)}`
          : `/api/experience`;
        const res = await axios.get(url);
        setExperiences(res.data);
      } catch (err) {
        setError("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [query]);

  if (loading)
    return (
      <main className="min-h-screen flex justify-center items-center text-lg">
        Loading experiences...
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            id={exp.id}
            image={exp.image}
            title={exp.title}
            description={exp.description}
            location={exp.slots?.[0]?.time || "N/A"}
            price={exp.price.toString()}
          />
        ))}
      </section>
    </main>
  );
}
