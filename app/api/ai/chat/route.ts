import { NextResponse } from "next/server";

// Define the structure for a message part
type Part = { text: string };

// Define the structure for a content block in the API request
type Content = {
    role: "user" | "model"; // Gemini API uses 'model' for the assistant role
    parts: Part[];
};

// Define the incoming message type from the frontend
type IncomingMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

// BEST PRACTICE: Use a modern, chat-optimized Gemini model.
const DEFAULT_MODEL = "gemini-2.5-flash-preview-09-2025"; 

// MAX_OUTPUT_TOKENS for gemini-2.5-flash is 8192. We use this to prevent truncation.
const MAX_OUTPUT_TOKENS = 8192; 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const incomingMessages: IncomingMessage[] = body.messages || [];

        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY not set in environment." }, { status: 500 });
        }

        // --- Convert history to native Gemini 'contents' array and extract system instruction ---

        const systemInstruction = incomingMessages
            .filter((m) => m.role === "system")
            .map((m) => m.content)
            .join("\n");

        const contents: Content[] = incomingMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({
                // Map frontend 'assistant' role to backend 'model' role
                role: m.role === "assistant" ? "model" : m.role,
                parts: [{ text: m.content }],
            })) as Content[];

        // =================================================================
        // API Call Payload
        // =================================================================
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const apiPayload = {
            contents: contents, 
            
            // Apply system instruction if available
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,

            generationConfig: {
                temperature: 0.2,
                // FIX: Setting maxOutputTokens to the absolute maximum (8192)
                // This resolves the MAX_TOKENS error unless the conversation history itself is excessively long.
                maxOutputTokens: MAX_OUTPUT_TOKENS, 
            },
            // Enable search grounding for the Travel Planner context
            tools: [{ "google_search": {} }],
        };

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiPayload),
        });

        if (!res.ok) {
            const status = res.status;
            // Log full error on the server side
            console.error(`Gemini API Error (Status ${status}):`, await res.text()); 
            return NextResponse.json({ error: "Failed to communicate with the Gemini API." }, { status: status });
        }

        const data = await res.json();

        // Robustly parse the response (Fixing the JSON output bug)
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
            return NextResponse.json({ text: generatedText, raw: data });
        } else {
            // Handle cases where no text is returned (e.g., blocked content)
            const finishReason = data?.candidates?.[0]?.finishReason || 'UNKNOWN';
            return NextResponse.json({ 
                error: `Model returned no text content. Reason: ${finishReason}`, 
                raw: data 
            }, { status: 500 });
        }

    } catch (err) {
        console.error("Internal Server Error:", err);
        return NextResponse.json({ error: `Internal Server Error: ${String(err)}` }, { status: 500 });
    }
}