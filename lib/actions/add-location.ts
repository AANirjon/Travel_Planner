"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Geocode an address using LocationIQ
 * Returns null if no results or on error
 */
async function geocodeAddress(address: string) {
  if (!process.env.LOCATIONIQ_KEY) {
    console.error("LOCATIONIQ_KEY is missing");
    return null;
  }

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Geocoding request failed:", text);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

/**
 * Attempt geocoding with fallback to partial address or default location
 */
async function geocodeWithFallback(address: string) {
  // 1️⃣ Try full address
  let result = await geocodeAddress(address);
  if (result) return result;

  // 2️⃣ Fallback: try progressively less specific parts
  const parts = address.split(",").map((p) => p.trim());
  for (let i = 0; i < parts.length; i++) {
    const partialAddress = parts.slice(i).join(", ");
    result = await geocodeAddress(partialAddress);
    if (result) return result;
  }

  // 3️⃣ Final fallback: return a default location (Dhaka, Bangladesh)
  console.warn(
    `No geocoding results for "${address}", using default location.`
  );
  return { lat: 23.8103, lng: 90.4125 };
}

export async function addLocation(formData: FormData, tripId: string) {
  // Authenticate user
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  // Get address from form
  const address = formData.get("address")?.toString();
  if (!address) throw new Error("Missing address");

  // Geocode address with fallback
  const { lat, lng } = await geocodeWithFallback(address);

  // Get current order
  const count = await prisma.location.count({ where: { tripId } });

  // Create location in DB
  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  // Redirect to trip page
  redirect(`/trips/${tripId}`);
}
