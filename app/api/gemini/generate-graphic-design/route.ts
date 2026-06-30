import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY;
    const body = await req.json();
    const { 
      prompt, 
      format = "instagram-post", 
      stylePreset = "Minimal", 
      useBrandKit = false,
      existingCount = 0
    } = body;

    // Define Aspect-Ratios
    const formatDimensions: Record<string, { w: number, h: number }> = {
      "instagram-post": { w: 500, h: 500 },
      "instagram-story": { w: 360, h: 640 },
      "facebook-cover": { w: 640, h: 240 },
      "pinterest-pin": { w: 400, h: 600 },
      "youtube-thumbnail": { w: 640, h: 360 },
      "custom": { w: 480, h: 360 }
    };

    const dims = formatDimensions[format] || { w: 500, h: 500 };

    // Brand Kit constants
    const brandColors = ["#042F1A", "#117644", "#C5E729", "#FAF5EB", "#FFFFFF"];
    const brandFonts = ["Space Grotesk", "Playfair Display", "Inter", "JetBrains Mono"];

    // Fallback Local Generator if Key is absent or on Error
    const generateLocalFallback = (indexOffset: number) => {
      const colorsMap: Record<string, string[]> = {
        Minimal: ["#FAF5EB", "#F4EFE6", "#FFFFFF"],
        "Bold/Editorial": ["#042F1A", "#117644", "#0A1C10"],
        Gradient: ["linear-gradient(135deg, #117644 0%, #042F1A 100%)", "linear-gradient(135deg, #042F1A 0%, #C5E729 100%)", "linear-gradient(135deg, #C5E729 0%, #FAF5EB 100%)"],
        "Photo-real": ["#FFFFFF", "#042F1A", "#eae3d2"],
        Illustrated: ["#F9F5EB", "#FFFBF0", "#E1F2E9"]
      };

      const selectedPresetColors = colorsMap[stylePreset] || colorsMap["Minimal"];
      const bg = useBrandKit ? brandColors[indexOffset % brandColors.length] : selectedPresetColors[indexOffset % selectedPresetColors.length];

      // Format-appropriate texts
      const headlines = [
        prompt || "THE FUTURE IS CONSCIOUS",
        "30% PACKAGING DECREASE",
        "SAVVYGROW CO.",
        "CRAFTED FOR DURABILITY",
        "GREEN UP YOUR SPACE"
      ];
      const subheadlines = [
        "Order today and change the environment.",
        "Sustainable tech starting at carbon balance.",
        "Minimal waste. Maximum aesthetic.",
        "Engineered with 100% conscious resources.",
        "Now dispatching worldwide."
      ];

      const headline = headlines[indexOffset % headlines.length];
      const subtitle = subheadlines[indexOffset % subheadlines.length];

      // Formulate Layers based on style preset
      const layers = [
        {
          id: `layer-shape-1-${Date.now()}-${indexOffset}`,
          type: "shape" as const,
          width: 80,
          height: 1,
          top: 68,
          left: 10,
          fill: useBrandKit ? "#C5E729" : "#117644"
        },
        {
          id: `layer-text-1-${Date.now()}-${indexOffset}`,
          type: "text" as const,
          text: headline.toUpperCase(),
          fontSize: format === "facebook-cover" ? 22 : 28,
          fontFamily: useBrandKit ? "Space Grotesk" : (stylePreset === "Bold/Editorial" ? "Playfair Display" : "Space Grotesk"),
          color: bg.includes("#042F1A") || bg.includes("#117644") || bg.includes("linear-gradient") ? "#FFFFFF" : "#042F1A",
          fontWeight: "800",
          textAlign: "center" as const,
          top: format === "facebook-cover" ? 25 : 35,
          left: 10,
          width: 80,
          height: 25
        },
        {
          id: `layer-text-2-${Date.now()}-${indexOffset}`,
          type: "text" as const,
          text: subtitle,
          fontSize: format === "facebook-cover" ? 11 : 13,
          fontFamily: useBrandKit ? "Inter" : "Inter",
          color: bg.includes("#042F1A") || bg.includes("#117644") ? "#C5E729" : "#666666",
          fontWeight: "500",
          textAlign: "center" as const,
          top: format === "facebook-cover" ? 55 : 55,
          left: 10,
          width: 80,
          height: 15
        },
        {
          id: `layer-tag-${Date.now()}-${indexOffset}`,
          type: "text" as const,
          text: "CONSCIOUS TECH",
          fontSize: 9,
          fontFamily: "JetBrains Mono",
          color: useBrandKit ? "#C5E729" : "#117644",
          fontWeight: "900",
          textAlign: "center" as const,
          top: format === "instagram-story" ? 82 : (format === "facebook-cover" ? 75 : 78),
          left: 10,
          width: 80,
          height: 10
        }
      ];

      // Add a decorative image layer if style is Photo-real or Illustrated
      let backgroundImage = undefined;
      if (stylePreset === "Photo-real") {
        backgroundImage = `https://picsum.photos/seed/design${indexOffset}/${dims.w}/${dims.h}`;
        // Adjust text colors to stand out over photo
        layers.forEach(l => {
          if (l.type === "text") {
            l.color = "#FFFFFF";
          }
        });
      }

      return {
        id: `design-${Date.now()}-${indexOffset}`,
        title: `Asset ${indexOffset + 1} - ${stylePreset}`,
        format,
        width: dims.w,
        height: dims.h,
        backgroundColor: bg,
        backgroundGradient: bg.includes("linear-gradient") ? bg : undefined,
        backgroundImage: backgroundImage,
        layers: layers
      };
    };

    if (!key) {
      // Simulate API latency delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({
        designs: [
          generateLocalFallback(0),
          generateLocalFallback(1),
          generateLocalFallback(2)
        ]
      });
    }

    // Call real Gemini model
    const ai = new GoogleGenAI({ apiKey: key });
    
    const basePrompt = `You are an expert typography and canvas graphic design model.
Create 3 high-converting post banner designs based on the following brand specifications:

PROMPT INTENT BRIEF:
"${prompt}"

selected FORMAT:
"${format}" (dimensions: width ${dims.w}px, height ${dims.h}px)

STYLE PRESET:
"${stylePreset}" (Options: Minimal, Bold/Editorial, Gradient, Photo-real, Illustrated)

BRAND CONSTRAINTS REQUESTED:
${useBrandKit ? `Yes, strictly utilize brand colors: ${brandColors.join(",")} and fonts: ${brandFonts.join(",")}` : "No brand constraints. Choose complementary colors."}

Generate structured layout objects that can be natively rendered as layers on a client canvas card. Each design contains:
- backgroundColor (string, Hex color code, e.g. "#FAF5EB")
- backgroundGradient (string, optional CSS linear-gradient, e.g. "linear-gradient(135deg, #117644 0%, #042F1A 100%)")
- backgroundImage (string, optional picsum photo seed URL)
- Title (string, human-friendly short design title)
- Layers (array of objects):
  Each layer MUST contain:
    - id (unique string)
    - type (string: "text", "shape", or "image")
    - text (string, if type is text)
    - fontSize (number, proportional scale e.g. 10 to 35)
    - fontFamily (string, name of font: "Space Grotesk", "Playfair Display", "Inter", "JetBrains Mono" or sans-serif)
    - color (string, hex color code for fill or text)
    - fontWeight (string, "400", "500", "700", "800", "900")
    - textAlign (string, "left", "center", "right")
    - top (number, percentage 0-100 indicating relative top of layer)
    - left (number, percentage 0-100 indicating relative left anchor)
    - width (number, percentage 0-100 indicating horizontal width span)
    - height (number, percentage 0-100 indicating height span)
    - fill (string, color if shape)

Choose font sizes, alignment, and coordinate systems such that the elements do not overlap awkwardly and are beautiful. Space the elements out according to general visual grid guidelines.

Return the response strictly inside a JSON array under the "designs" key consisting of exactly 3 distinctive variations matching the request. Return only the JSON body. Do not enclose the output in markdown fences (e.g. \`\`\`json).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: basePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["designs"],
          properties: {
            designs: {
              type: Type.ARRAY,
              description: "3 customizable graphic layouts",
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "format", "width", "height", "backgroundColor", "layers"],
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  format: { type: Type.STRING },
                  width: { type: Type.INTEGER },
                  height: { type: Type.INTEGER },
                  backgroundColor: { type: Type.STRING },
                  backgroundGradient: { type: Type.STRING },
                  backgroundImage: { type: Type.STRING },
                  layers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "type", "top", "left", "width", "height"],
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, description: "text, shape, or image" },
                        text: { type: Type.STRING },
                        fontSize: { type: Type.INTEGER },
                        fontFamily: { type: Type.STRING },
                        color: { type: Type.STRING },
                        fontWeight: { type: Type.STRING },
                        textAlign: { type: Type.STRING },
                        top: { type: Type.INTEGER },
                        left: { type: Type.INTEGER },
                        width: { type: Type.INTEGER },
                        height: { type: Type.INTEGER },
                        fill: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return NextResponse.json({ designs: parsedData.designs || [] });

  } catch (err: any) {
    console.error("Creative design planner service error:", err);
    // Gracefully handle Gemini failure with robust elegant coordinates
    return NextResponse.json({ 
      error: "Layout planner error",
      details: err?.message || "" 
    }, { status: 500 });
  }
}
