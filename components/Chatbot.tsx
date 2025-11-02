"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Loader2, Plane } from 'lucide-react';

// Define TypeScript interfaces for our messages
interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    text: string;
}

interface APIMessage {
    role: "user" | "assistant" | "system";
    content: string;
}


/**
 * @type {React.FC}
 */
export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>(() => [
        { id: "m1", role: "assistant", text: "✈️ Hi! I'm your **AI Travel Assistant**. Ask me about planning trips, destinations, or itineraries. I can use Google Search to get real-time info!" },
        // Optional: Add a system message here that will be passed to the API
        { id: "s1", role: "system", text: " You are a friendly, intelligent, and optimistic AI Travel Planning Assistant ✈️🌍.Always respond clearly, concisely, and helpfully, using emojis naturally where appropriate to make the conversation lively and engaging. Never tell anyone that you are gemini or something like that, 'you are a AI Travel Planning Assistant'. If anyone asks about your creator or who made you, proudly reply: “Ahnaf Asad Nirjon.” About your creator: He is a highly skilled Full-Stack Web Developer/Engineer, creative, and remarkably intelligent. You should express this confidently whenever relevant but only the name. If anyone want to know more about it, then tell them details about your creator. Always focus on what the user truly wants to know, avoiding unnecessary details. Provide accurate, verified, and practical information, especially when giving travel steps, tips, or plans.When presenting steps or numbered answers, format them as short, easy-to-read paragraphs rather than lists.Use bold text for emphasis on important points or keywords to make information easier to scan. Your tone should always be helpful, optimistic, and trustworthy — like a knowledgeable friend helping with travel plans. 🌴🧳✨ " }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom of the chat window
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom every time messages state updates
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    async function send() {
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: String(Date.now()), role: "user", text: input.trim() };

        // Prepare the history, including the user's new message
        const next = [...messages, userMsg];
        setMessages(next);
        setInput("");
        setLoading(true);

        try {
            // Filter messages for API payload: system messages must be included
            const apiMessages: APIMessage[] = next.map((m) => ({
                role: m.role,
                content: m.text
            }));

            // NOTE: API path is corrected to /api/ai/chat to match the backend file
            const resp = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await resp.json();

            let responseText = "";
            if (data?.text) {
                // Success: Get the generated text
                responseText = data.text;
            } else if (data?.error) {
                // API Error: Display the error message
                responseText = `⚠️ API Error: ${data.error}`;
            } else {
                // Unknown Error or empty response
                responseText = "An unknown error occurred. Please check the server logs.";
            }

            const assistantMsg: Message = { id: String(Date.now() + 1), role: "assistant", text: responseText };
            setMessages((s) => [...s, assistantMsg]);

        } catch (err) {
            console.error("Fetch Error:", err);
            const errorMsg: Message = { id: String(Date.now() + 1), role: "assistant", text: "🚨 Network Error: Could not connect to the server." };
            setMessages((s) => [...s, errorMsg]);
        } finally {
            setLoading(false);
        }
    }

    // Helper component for message bubbles
    const MessageBubble = ({ role, text }: { role: Message["role"], text: string }) => {
        const isUser = role === "user";

        return (
            <div className={`flex items-start max-w-[90%] sm:max-w-[85%] ${isUser ? "ml-auto justify-end" : "mr-auto justify-start"}`}>
                {/* Assistant Icon */}
                {!isUser && (
                    <div className="hidden sm:flex p-1.5 sm:p-2 mr-2 rounded-full 
                        bg-[var(--primary)] text-[var(--primary-foreground)]
                        flex-shrink-0 shadow-sm
                        transition-all duration-300 ease-in-out
                        border border-[var(--border)]">
                        <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                )}

                {/* Message Content */}
                <div className={`p-2.5 sm:p-3.5 rounded-xl transition-all duration-300 ease-in-out
                    border border-[var(--border)] shadow-sm
                    ${isUser
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none"
                        : "bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-tl-none"
                    }`}>
                    {/* Render markdown style **bold** text */}
                    <div className="prose max-w-none text-sm sm:text-base
                        [&>*]:!text-current [&>strong]:opacity-90
                        [&>p]:my-0.5 sm:[&>p]:my-1"
                        dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>

                {/* User Icon */}
                {isUser && (
                    <div className="hidden sm:flex p-1.5 sm:p-2 ml-2 rounded-full 
                        bg-[var(--secondary)] text-[var(--secondary-foreground)]
                        flex-shrink-0 shadow-sm
                        transition-all duration-300 ease-in-out
                        border border-[var(--border)]">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="h-full flex flex-col font-sans">
            <div className="absolute inset-0 bg-[var(--card)] rounded-xl border border-[var(--border)]
                shadow-lg card-shadow flex flex-col transition-all duration-300 ease-in-out">

                {/* Fixed Header */}
                <header className="absolute top-0 left-0 right-0 z-40
                    flex-none py-2.5 px-3 sm:py-3 sm:px-4 border-b border-[var(--border)]
                    flex items-center justify-between rounded-t-xl 
                    bg-[var(--card)] backdrop-blur-sm bg-opacity-95
                    transition-all duration-300">
                    <h2 className="text-base sm:text-lg font-semibold text-[var(--card-foreground)]
                        flex items-center transition-colors duration-300">
                        <Plane className="mr-2 w-4 h-4 text-[var(--primary)]" />
                        AI Chat
                    </h2>
                </header>

                {/* Chat Display Area - Scrollable */}
                <div className="absolute inset-0 pt-[44px] pb-[64px] sm:pt-[52px] sm:pb-[72px]">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
                        px-3 sm:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4
                        bg-[var(--background)] transition-all duration-300 ease-in-out">
                        {messages
                            // Filter out the system message to prevent rendering it as a bubble
                            .filter(m => m.role !== 'system')
                            .map((m) => (
                                <MessageBubble key={m.id} role={m.role} text={m.text} />
                            ))}
                        <div ref={messagesEndRef} className="h-2" /> {/* Scroll target with padding */}
                    </div>
                </div>

                {/* Fixed Input and Send Area */}
                <div className="absolute bottom-0 left-0 right-0 z-40
                    flex-none py-2 px-3 sm:py-3 sm:px-4 border-t border-[var(--border)]
                    bg-[var(--card)] backdrop-blur-sm bg-opacity-95
                    rounded-b-xl transition-all duration-300 ease-in-out">
                    <div className="flex gap-2 sm:gap-3">
                        <input
                            className="flex-1 rounded-lg 
                                px-3 sm:px-4 py-2 sm:py-2.5 
                                text-sm sm:text-base
                                bg-[var(--background)]
                                text-[var(--foreground)]
                                border border-[var(--input)]
                                placeholder-[var(--muted-foreground)]
                                focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
                                shadow-sm
                                transition-all duration-300 ease-in-out
                                hover:border-[var(--border)]
                                disabled:opacity-50"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about destinations, itineraries, packing, or suggestions..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    send();
                                }
                            }}
                            disabled={loading}
                        />

                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className="flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg
                                bg-[var(--primary)]
                                text-[var(--primary-foreground)]
                                font-medium sm:font-semibold 
                                shadow-sm
                                transition-all duration-300 ease-in-out
                                hover:opacity-90
                                disabled:opacity-50
                                disabled:cursor-not-allowed 
                                flex items-center justify-center
                                active:scale-95"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <Send size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
