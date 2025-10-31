import React from "react";
import { Map as MapIcon } from "lucide-react";
import { auth } from "@/auth";
import AuthButton from "@/components/auth-button";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-blue-50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Plan your perfect trip, every time
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Create itineraries, organize destinations, and share your travel
                plans all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthButton
                  isLoggedIn={isLoggedIn}
                  className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoggedIn ? (
                    "Check it Out"
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                        />
                        <path
                          fill="#34A853"
                          d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                      </svg>
                      <span className="ml-2">Log in</span>
                    </>
                  )}
                </AuthButton>
              </div>
            </div>
          </div>
          {/* Decorative Clipped Background at the Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-white"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
          />
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Plan with confidence
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MapIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
                <p className="text-gray-600">
                  Visualize your trip with interactive maps. See your entire
                  itinerary at a glance.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-travel-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Day-by-Day Itineraries
                </h3>
                <p className="text-gray-600">
                  Organize your trip day by day. Never miss a beat with
                  structured planning.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-6.5L12 7" />
                    <path d="M15 5v4h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Drag & Drop Planning
                </h3>
                <p className="text-gray-600">
                  Easily rearrange your itinerary with simple drag and drop
                  functionality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to plan your next adventure?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who plan better trips with
              TripPlanner.
            </p>
            <AuthButton
              isLoggedIn={isLoggedIn}
              className="inline-block bg-white text-gray-800 hover:bg-blue-50 px-6 py-3 rounded-lg transition-colors duration-200"
            >
              {isLoggedIn ? "Check it out" : "Sign Up Now"}
            </AuthButton>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
