"use client";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polyline, // ← Polyline import kiya
} from "react-leaflet";
import { GeoJSON } from "react-leaflet";
// Custom Icon Setup (Direct Import Method)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src || markerIcon,
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  shadowUrl: markerShadow.src || markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


function FlyToLocation({
    selectedLocations,
  start,
  end,
}) {
  const map = useMap();

useEffect(() => {
  if (selectedLocations?.length > 0) {
    const layer = L.geoJSON(selectedLocations[0].geojson);
    map.fitBounds(layer.getBounds(), { padding: [40, 40] });
    return;
  }

  let target = null;

  if (end) target = end;
  else if (start) target = start;

  if (!target) return;

  map.flyTo([target.lat, target.lng], 14, {
    animate: true,
    duration: 1.5,
  });

}, [selectedLocations, start, end, map]);

  return null;
}


function ClickHandler({ mode, setStart, setEnd }) {
  useMapEvents({
    click(e) {
      if (mode === "start") setStart(e.latlng);
      if (mode === "end") setEnd(e.latlng);
    },
  });
  return null;
}

function DraggableMarker({ position, setPosition, label }) {
  const map = useMap();
  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragstart() { map.dragging.disable(); },
        dragend(e) {
          setPosition(e.target.getLatLng());
          map.dragging.enable();
        },
      }}
    >
      <Popup>{label}</Popup>
    </Marker>
  );
}

// Yeh component map ko auto-zoom/center karega jab route milega
function ChangeMapView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function MapView({
    start,
    end,
    setStart,
    setEnd,
    mode,
    routeCoordinates,
    setRouteCoordinates,
    setDistance,
     selectedLocations,
}){
  
  // Jab bhi start ya end badle, ya user "Visualize" na kare tab tak purana route clear rakhein
  // Agar aap chahte hain ki click karte hi automatic path dikhe, toh is useEffect ko use kar sakte hain:
  useEffect(() => {
    if (!start || !end) {
      setRouteCoordinates([]);
      setDistance(null);
    }
  }, [start, end, setRouteCoordinates, setDistance]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      zoomControl={false}
      className="h-full w-full"
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler mode={mode} setStart={setStart} setEnd={setEnd} />
  <FlyToLocation
  start={start}
  end={end}
  selectedLocations={selectedLocations}
/>

      {start && <DraggableMarker position={start} setPosition={setStart} label="Start" />}
      {end && <DraggableMarker position={end} setPosition={setEnd} label="End" />}
{selectedLocations?.map((loc) => (
  <GeoJSON
    key={loc.id}
    data={loc.geojson}
    style={{
      color: "#2563eb",
      weight: 3,
      fillOpacity: 0.2,
    }}
  />
))}
      {/* Shortest Path line draw ho rahi hai yahan */}
      {routeCoordinates.length > 0 && (
        <>
          <Polyline pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.8 }} positions={routeCoordinates} />
          <ChangeMapView bounds={L.polyline(routeCoordinates).getBounds()} />
        </>
      )}
    </MapContainer>
  );
}