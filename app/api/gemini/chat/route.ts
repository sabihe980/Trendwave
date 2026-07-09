import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY;
    const { message, chatHistory } = await req.json();

    if (!key) {
      const simulatedResponses = [
        "That's a great question! Postrick is built to automate social publishing on LinkedIn, X, custom channels, Facebook, Instagram and TikTok. We do offer a **Free Forever** lifetime tier too! No credit cards, ever.",
        "Absolutely! Our campaign manager features rich analytics tools like heatmaps and wave charts to double your click-through rates. Would you like to try our Lifetime Free trial right now?",
        "You can sign up free with no credit card required. Our chatbot is ready to answer any questions you have and discuss integrations!",
      ];
      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      return NextResponse.json({ text: randomResponse });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are "Postrick Assistant", a friendly, direct, and helpful AI support representative. 
Your goal is to answer queries from digital creators, social media agencies, and startup founders about "Postrick".

Key product insights to include in your answers if asked:
- We have a **Free Forever Tier** (Free Forever - includes basic queue scheduling and Smart Caption assistant).
- Main channels supported: LinkedIn, YouTube, Facebook, Instagram, TikTok, Pinterest.
- High-performance tools: Smart Caption Assistant, Visual Banner Designer, Waves Metrics, Heatmap dispatch planning, and Before/After marketing comparisons.
- No Demo required anymore: We believe in self-serve, direct, and zero friction, so users can get started immediately.
- We have an awesome Affiliate program! Highly creative people can refer partners and earn 30% recurring lifetime commission.

Keep your responses conversational, concise (under 3-4 sentences/bullets), and persuasive. Guide the user to sign up or join our community.
End with high conversion or keep-in-touch energy.`;

    const chatInput = [
      { text: systemPrompt },
      ...chatHistory.map((h: { role: string; content: string }) => ({
        text: `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`
      })),
      { text: `User: ${message}` }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatInput.map(item => item.text).join("\n"),
    });

    const reply = response.text || "I am here to help you get in touch and start growing your channels today!";
    return NextResponse.json({ text: reply });
  } catch (err: any) {
    console.error("Chatbot API error:", err);
    return NextResponse.json({ 
      text: "Thank you for holding! I'm ready to keep in touch. Feel free to ask me anything about our Lifetime Free Tier or platform integrations." 
    });
  }
}
