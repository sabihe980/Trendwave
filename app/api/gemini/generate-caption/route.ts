import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const mockCaptions: Record<string, string> = {
  linkedin: `🚀 Thrilled to announce the launch of our brand new automation pipeline! \n\nWith SavvyGrow, we are helping creator teams publish content seamlessly. Say goodbye to manual cross-posting and hello to organic growth.\n\n👇 Ready to transform your workflow? Let's connect below!\n#Automation #Productivity #DigitalMarketing #LinkedInCreators`,
  instagram: `Tired of spending hours scheduling posts? 🙄 \n\nSavvyGrow is here to elevate your visual strategy and keep your audience glued! From smart calendars to Smart AI assist. ✨\n\n🔗 Tap the link in our bio to log in to your Free Forever plan! \n#creators #aestheticfeed #socialautomation #contentdesigner`,
  youtube: `🎥 How we doubled our subscriber base using 100% automated analytics queues.\n\nIn this update, we delve into visual heatmaps, engagement triggers, and dynamic publication times. \n\nDon't forget to LIKE and SUBSCRIBE for more growth keys! 🔔`,
  tiktok: `Stop scrolling! 🛑 This is how successful creators build their queues in 2 minutes. Free trial link in bio! #growthhack #marketingtips #fyp #productivity`,
  facebook: `Transform your multi-page posting routine. Try SavvyGrow's Free Forever plan now! 👍`,
  pinterest: `The ultimate aesthetic workspace for visual scheduling. Safe boards, secure pins! 📌`
};

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
  const { prompt, platform } = await req.json();
  const targetPlatform = platform || "instagram";

  try {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      const caption = mockCaptions[targetPlatform] || `Grow your brand with SavvyGrow today. No card required!`;
      return NextResponse.json({ caption });
    }

    const ai = new GoogleGenAI({ 
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const instruction = `Write an engaging, highly persuasive and professional social media post about "${prompt}" for ${targetPlatform}. Adapt the tone, structure, emojis, and hashtags appropriately to get high click-through rates. Provide ONLY the text of the post.`;

    let response;
    try {
      // Primary attempt: try 'gemini-3.5-flash' with retries
      response = await retryWithBackoff(() => 
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: instruction,
        })
      );
    } catch (primaryErr) {
      console.warn("Primary model 'gemini-3.5-flash' failed or overloaded. Attempting fallback model 'gemini-3.1-flash-lite'...", primaryErr);
      
      // Secondary attempt: try 'gemini-3.1-flash-lite' with retries
      response = await retryWithBackoff(() => 
        ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: instruction,
        })
      );
    }

    return NextResponse.json({ caption: response.text });
  } catch (err: any) {
    console.error("Gemini caption generation failed entirely. Restoring premium design buffer.", err);
    const fallbackCaption = mockCaptions[targetPlatform] || `Grow your brand with SavvyGrow today! (Auto-recovered caption)`;
    return NextResponse.json({ caption: fallbackCaption });
  }
}
