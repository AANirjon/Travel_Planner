"use client";

import dynamic from "next/dynamic";
import { Location } from "@/app/generated/prisma";

interface MapProps {
  itineraries: Location[];
}

// Dynamically import Leaflet map to disable SSR
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function Map({ itineraries }: MapProps) {
  return <LeafletMap itineraries={itineraries} />;
}
