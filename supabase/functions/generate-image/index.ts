import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai@0.1.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, aspect_ratio } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Simulate high-quality image generation using Imagen v3 via Google Gen AI SDK
    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: prompt || "Minimalist aesthetic social media banner with professional tone",
      config: {
        numberOfImages: 1,
        aspectRatio: aspect_ratio || "1:1",
        outputMimeType: "image/jpeg",
      },
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return new Response(
      JSON.stringify({ success: true, image: dataUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
