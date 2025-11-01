import Chatbot from "@/components/Chatbot";
import { auth } from "@/auth";

export default async function ChatPage() {
    await auth(); // ensure user is authenticated server-side (ignored if not used)

    return (
        <div className="fixed inset-0 top-[57px] bg-[var(--background)] transition-colors duration-300">
            <div className="absolute inset-0 overflow-hidden">
                <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex flex-col h-full">
                        {/* Fixed Header */}
                        {/* <div className="sticky top-0 z-30 bg-[var(--background)] pt-4 pb-3 sm:pt-5 sm:pb-4">
                            <div className="space-y-1.5">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)] transition-colors">
                                    Travel Assistant
                                </h1>
                                <p className="text-[var(--muted-foreground)] text-sm sm:text-base lg:text-lg max-w-2xl">
                                    Ask the assistant about destinations, itineraries, budgets, and packing tips.
                                </p>
                            </div>
                        </div> */}

                        {/* Chat Container */}
                        <div className="flex-1 min-h-0 -mt-1">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
