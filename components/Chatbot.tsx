"use client";

import { useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string };

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>(() => [
        { id: "m1", role: "assistant", text: "Hi — I'm your travel assistant. Ask me about planning trips, destinations, or itineraries." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function send() {
        if (!input.trim()) return;
        const userMsg: Message = { id: String(Date.now()), role: "user", text: input.trim() };
        const next = [...messages, userMsg];
        setMessages(next);
        setInput("");
        setLoading(true);

        try {
            const resp = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.text })) }),
            });

            const data = await resp.json();
            const text = data?.text || data?.error || "No response";
            const assistantMsg: Message = { id: String(Date.now() + 1), role: "assistant", text };
            setMessages((s) => [...s, assistantMsg]);
        } catch (err) {
            setMessages((s) => [...s, { id: String(Date.now()), role: "assistant", text: "Error: " + String(err) }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-lg p-4 space-y-4">
                <div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
                    {messages.map((m) => (
                        <div key={m.id} className={`p-3 rounded-md ${m.role === "user" ? "bg-[var(--input)] text-[var(--foreground)] self-end" : "bg-[var(--background)] text-[var(--foreground)]"}`}>
                            <div className="text-sm">{m.text}</div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-[var(--border)] rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about destinations, itineraries, packing, or suggestions..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send();
                            }
                        }}
                    />

                    <button
                        onClick={send}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-60"
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
