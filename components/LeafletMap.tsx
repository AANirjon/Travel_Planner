"use client"; // make sure this is client-side

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Location } from "@/app/generated/prisma";

interface MapProps {
  itineraries: Location[];
}

// Fix default marker icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMap({ itineraries }: MapProps) {
  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <MapContainer center={center} zoom={8} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {itineraries.map((location, idx) => (
        <Marker
          key={idx}
          position={{ lat: location.lat, lng: location.lng }}
          icon={defaultIcon}
        >
          <Popup>{location.locationTitle}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
