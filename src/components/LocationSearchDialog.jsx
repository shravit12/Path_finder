"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LocationSearchDialog({
  open,
  onClose,
  setStart,
  setEnd,
    setSelectedLocations,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function searchLocation() {
    if (!query) return;

  const res = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&polygon_geojson=1&limit=5`
);

    const data = await res.json();

    setResults(data);
  }

  if (!open) return null;

 return (
  <div
    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70"
    onClick={onClose}
  >
    <div
      className="w-[500px] z-[99999] rounded-xl bg-zinc-900 p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mb-4 text-xl font-bold text-white">
        Search Location
      </h2>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
          placeholder="Search city, place..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchLocation();
            }
          }}
        />

        <Button onClick={searchLocation}>
          Search
        </Button>
      </div>

      <div className="mt-5 max-h-[400px] space-y-3 overflow-y-auto">
        {results.map((item) => (
          <div
            key={item.place_id}
            className="rounded-lg border border-zinc-700 p-3"
          >
          <p
  className="cursor-pointer text-white hover:text-blue-400"
  onClick={() => {
    setSelectedLocations([
  {
    id: item.place_id,
    lat: Number(item.lat),
    lng: Number(item.lon),
    geojson: item.geojson,
  },
]);

    onClose();
  }}
>
  {item.display_name}
</p>

            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => {
                  setStart({
                    lat: Number(item.lat),
                    lng: Number(item.lon),
                  });

                  onClose();
                }}
              >
                Set Start
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setEnd({
                    lat: Number(item.lat),
                    lng: Number(item.lon),
                  });

                  onClose();
                }}
              >
                Set End
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}