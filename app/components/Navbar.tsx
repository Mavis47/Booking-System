"use client";

import { useSearch } from "../contexts/SearchContexts";

export default function Navbar() {
  const { setQuery } = useSearch();

  return (
    <nav className="flex items-center justify-between px-10 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-gray-800">HD Highway Delite</h1>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search experiences"
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80"
        />
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg">
          Search
        </button>
      </div>
    </nav>
  );
}
