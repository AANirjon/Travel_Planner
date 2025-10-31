"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trips data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/trips");
        const data: TransformedLocation[] = await res.json();
        setLocations(data);

        const countries = new Set<string>(data.map((loc) => loc.country));
        setVisitedCountries(countries);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Auto-rotate globe
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-center text-4xl font-bold mb-12">Your Travel Journey</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Globe Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">See where you&apos;ve been...</h2>
              <div className="h-[600px] w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                  </div>
                ) : (
                  <Globe
                    ref={globeRef}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="rgba(0,0,0,0)"
                    pointsData={locations}
                    pointLat={d => (d as TransformedLocation).lat}
                    pointLng={d => (d as TransformedLocation).lng}
                    pointColor={() => "#FF5733"}
                    pointLabel={d => (d as TransformedLocation).name}
                    pointAltitude={0.02}
                    pointRadius={0.5}
                    pointsMerge={true}
                    width={window.innerWidth * 0.65}
                    height={600}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Countries Visited */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Countries Visited</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You&apos;ve visited{" "}
                        <span className="font-bold">{visitedCountries.size}</span> countries.
                      </p>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {Array.from(visitedCountries)
                        .sort()
                        .map((country, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                          >
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span className="font-medium">{country}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
