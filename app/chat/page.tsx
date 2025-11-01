import Chatbot from "@/components/Chatbot";
import { auth } from "@/auth";

export default async function ChatPage() {
    await auth(); // ensure user is authenticated server-side (ignored if not used)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Travel Assistant</h1>
            <p className="text-[var(--muted-foreground)] mb-6">Ask the assistant about destinations, itineraries, budgets, and packing tips.</p>

            <Chatbot />
        </div>
    );
}
