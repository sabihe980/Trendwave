import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const { prompt, aspectRatio = "1:1" } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Elegant keyword matching fallback for the simulator or offline environments
      const query = prompt.toLowerCase();
      let sample = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"; // default minimalist abstract
      if (query.includes("tech") || query.includes("device") || query.includes("computer")) {
        sample = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";
      } else if (query.includes("leaves") || query.includes("nature") || query.includes("sustainable") || query.includes("eco")) {
        sample = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
      } else if (query.includes("workspace") || query.includes("office") || query.includes("sunset") || query.includes("room")) {
        sample = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80";
      } else if (query.includes("avatar") || query.includes("people") || query.includes("person") || query.includes("profile")) {
        sample = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80";
      } else if (query.includes("chart") || query.includes("analytics") || query.includes("graph")) {
        sample = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
      } else if (query.includes("desert") || query.includes("sand") || query.includes("minimal")) {
        sample = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
      } else {
        // Random interesting photo from picsum
        sample = `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 10))}/800/800`;
      }
      return NextResponse.json({ 
        success: true, 
        fallback: true,
        image: sample 
      });
    }

    const ai = new GoogleGenAI({ apiKey: key });
    
    try {
      // Primary attempt: call stable Imagen 3 model (imagen-3.0-generate-002)
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: aspectRatio,
        }
      });

      if (response && response.generatedImages && response.generatedImages[0] && response.generatedImages[0].image) {
        const base64Bytes = response.generatedImages[0].image.imageBytes;
        return NextResponse.json({
          success: true,
          image: `data:image/jpeg;base64,${base64Bytes}`
        });
      }
    } catch (innerError) {
      console.warn("Imagen SDK generation warning, activating fallback:", innerError);
    }

    // Secondary fallback
    const query = prompt.toLowerCase();
    let sample = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
    if (query.includes("tech") || query.includes("device") || query.includes("computer")) {
      sample = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";
    } else if (query.includes("leaves") || query.includes("nature") || query.includes("sustainable") || query.includes("eco")) {
      sample = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
    } else if (query.includes("workspace") || query.includes("office") || query.includes("sunset") || query.includes("room")) {
      sample = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80";
    } else if (query.includes("chart") || query.includes("analytics") || query.includes("graph")) {
      sample = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      image: sample
    });

  } catch (err: any) {
    console.error("AI Image Generation API root crashed:", err);
    return NextResponse.json({ error: err?.message || "Error generating images" }, { status: 500 });
  }
}
