import { NextResponse } from "next/server";

type Message = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: Message[] = body.messages || [];

        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || "text-bison-001";

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
        }

        // Build a single prompt from the conversation. Keep it simple for now.
        const systemPart = messages
            .filter((m) => m.role === "system")
            .map((m) => m.content)
            .join("\n");

        const conversationPart = messages
            .filter((m) => m.role !== "system")
            .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
            .join("\n");

        const promptText = [systemPart, conversationPart].filter(Boolean).join("\n\n");

        const tryGenerate = async (modelName: string) => {
            const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

            return await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: promptText }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 512,
                    },
                }),
            });
        };

        // Try the configured model first. If user passed a name like "text-bison-001" this works.
        let res = await tryGenerate(model);

        // If not found, try some common fallbacks (prefix/suffix variations).
        if (res.status === 404) {
            // Try with and without 'models/' prefix
            const modelToTry = model.startsWith("models/") ? model.replace(/^models\//, "") : `models/${model}`;
            try {
                res = await tryGenerate(modelToTry);
            } catch {
                // ignore and continue with error handling
            }
        }

        if (!res.ok) {
            const status = res.status;
            const errText = await res.text();

            // If the model wasn't found, try to list available models to give a helpful message.
            if (status === 404) {
                try {
                    const listUrl = `https://generativelanguage.googleapis.com/v1beta2/models?key=${apiKey}`;
                    const listRes = await fetch(listUrl);
                    const listData = await listRes.json();
                    const names = (listData?.models || []).map((m: unknown) => {
                        const mm = m as { name?: string; model?: string };
                        return mm?.name || mm?.model || String(m);
                    });
                    return NextResponse.json({ error: 'Model not found', details: errText, availableModels: names }, { status: 404 });
                } catch {
                    return NextResponse.json({ error: 'Model not found', details: errText }, { status: 404 });
                }
            }

            return NextResponse.json({ error: errText }, { status });
        }

        const data = await res.json();

        // The response shape may vary; try to extract the main generated text.
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

        return NextResponse.json({ text, raw: data });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
