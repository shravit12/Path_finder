"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Play, RotateCcw } from "lucide-react";
import { Search } from "lucide-react";
import LocationSearchDialog from "@/components/LocationSearchDialog";
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function Home() {
 const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [mode, setMode] = useState("start");
  
  // New States for Path Visualizer
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  // OSRM API Call to fetch Shortest Path
  async function handleVisualize() {
    if (!start || !end) {
      alert("Please select both Start and End points on the map!");
      return;
    }

    setLoading(true);
    try {
      // OSRM API URL Format: [lng],[lat];[lng],[lat]
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok") {
        // OSRM coordinates [lng, lat] format mein deta hai, hume Leaflet ke liye [lat, lng] chahiye
        const coords = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        
        setRouteCoordinates(coords);
        
        // Distance meters mein hota hai, use Kms mein convert kar rahe hain
        const distanceInKm = (data.routes[0].distance / 1000).toFixed(2);
        setDistance(distanceInKm);
      } else {
        alert("No route found between these points.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Failed to fetch route. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStart(null);
    setEnd(null);
    setMode("start");
    setRouteCoordinates([]);
    setDistance(null);
    setSelectedLocations([]); // ✅ correct
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <h1 className="text-2xl font-bold text-white">AlgoVision</h1>
            <p className="text-zinc-400">Path Finding Visualizer</p>
          </div>

          {/* Distance Display Section */}
          {distance && (
            <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl text-center">
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Shortest Distance</p>
              <p className="text-lg font-bold text-blue-400">{distance} km</p>
            </div>
          )}
   <LocationSearchDialog
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
  setStart={setStart}
  setEnd={setEnd}
   setSelectedLocations={setSelectedLocations}
/>
          <div className="flex flex-wrap gap-3">
       <Button
  variant="outline"
  onClick={() => {
    console.log("Search Clicked");
    setSearchOpen(true);
  }}
>
  <Search className="mr-2 h-4 w-4" />
  Search
</Button>
      <Button
              variant={mode === "start" ? "default" : "outline"}
              onClick={() => setMode("start")}
            >
              <MapPin className="mr-2 h-4 w-4" /> Start
            </Button>

            <Button
              variant={mode === "end" ? "default" : "outline"}
              onClick={() => setMode("end")}
            >
              <Navigation className="mr-2 h-4 w-4" /> End
            </Button>

            <Button 
              onClick={handleVisualize} 
              disabled={loading || !start || !end}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="mr-2 h-4 w-4" /> 
              {loading ? "Calculating..." : "Visualize"}
            </Button>

            <Button variant="destructive" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </header>

      <section className="h-[calc(100vh-80px)] p-4">
        <div className="h-full overflow-hidden rounded-2xl border border-zinc-800">
          <MapView
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            mode={mode}
            routeCoordinates={routeCoordinates}
            setRouteCoordinates={setRouteCoordinates}
            setDistance={setDistance}
             selectedLocations={selectedLocations}
          />
        </div>
      </section>
   
    </main>
  );
}