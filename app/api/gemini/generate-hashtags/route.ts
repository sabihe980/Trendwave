import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/security";

// Fallback trending hashtags if API is unavailable
const fallbackHashtags = [
  "#viral", "#trending", "#socialmedia", "#growth", "#creators", 
  "#marketing", "#design", "#innovation", "#community", "#brand"
];

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) {
      throw error;
    }
    console.warn(`Gemini API call failed, retrying in ${delay}ms... (Error: ${error?.message || error})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * backoff, backoff);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const { caption, platform } = await req.json();
    
    if (!caption || caption.trim().length === 0) {
      return NextResponse.json({ hashtags: fallbackHashtags });
    }

    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return NextResponse.json({ hashtags: fallbackHashtags });
    }

    const ai = new GoogleGenAI({ 
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const instruction = `Given this social media post content: "${caption}".
    Generate 10 to 12 highly relevant, trending, and viral hashtags appropriate for the post and the target platform "${platform || 'any'}".
    Provide ONLY the space-separated list of hashtags starting with #, such as: "#tag1 #tag2 #tag3". Do not add any introductory or concluding text, code block wrappers, or other formatting.`;

    let response;
    try {
      response = await retryWithBackoff(() => 
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: instruction,
        })
      );
    } catch (primaryErr) {
      console.warn("Primary model 'gemini-3.5-flash' failed. Attempting fallback 'gemini-3.1-flash-lite'...", primaryErr);
      response = await retryWithBackoff(() => 
        ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: instruction,
        })
      );
    }

    const text = response.text || "";
    // Parse hashtags from response text
    const hashtags = text.split(/\s+/)
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith("#") && tag.length > 1);

    if (hashtags.length === 0) {
      return NextResponse.json({ hashtags: fallbackHashtags });
    }

    return NextResponse.json({ hashtags });
  } catch (err: any) {
    console.error("Gemini hashtag generation failed:", err);
    return NextResponse.json({ hashtags: fallbackHashtags });
  }
}
