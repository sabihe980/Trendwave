"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Sliders, ChevronDown, ChevronUp, Image as ImageIcon,
  Palette, Grid, Download, Trash2, Edit3, ArrowUpRight, Share2, 
  RotateCw, RefreshCw, Layers, Check, Plus, Star, X, Underline,
  Type, ShoppingBag, Radio, MessageSquare, Megaphone, Calendar, ArrowLeft, ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface DesignLayer {
  id: string;
  type: "text" | "shape" | "image";
  text?: string;
  fontSize?: number; // relative scaling unit e.g. 10 to 45
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  top: number; // percentage
  left: number; // percentage
  width: number; // percentage
  height: number; // percentage
  fill?: string;
  imageUrl?: string;
}

interface GraphicDesign {
  id: string;
  title: string;
  format: string; // instagram-post, instagram-story, facebook-cover, pinterest-pin, youtube-thumbnail, custom
  width: number;
  height: number;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  category?: string; // For templates: Sale/Promo, Quote, Announcement, Product, Event
  layers: DesignLayer[];
}

// Pre-packaged high-end curated templates
const CURATED_TEMPLATES: GraphicDesign[] = [
  {
    id: "temp-1",
    title: "Conscious Summer Promo",
    format: "instagram-post",
    width: 500,
    height: 500,
    backgroundColor: "#042F1A",
    backgroundGradient: "linear-gradient(135deg, #117644 0%, #042F1A 100%)",
    category: "Sale/Promo",
    layers: [
      {
        id: "l-shape-1",
        type: "shape",
        top: 10,
        left: 10,
        width: 80,
        height: 80,
        fill: "transparent"
      },
      {
        id: "l-text-tag",
        type: "text",
        text: "POSTRICK SPECIALS",
        fontSize: 10,
        fontFamily: "Space Grotesk",
        color: "#C5E729",
        fontWeight: "900",
        textAlign: "center",
        top: 25,
        left: 10,
        width: 80,
        height: 6
      },
      {
        id: "l-text-head",
        type: "text",
        text: "30% PACKAGING\nREDUCTION",
        fontSize: 26,
        fontFamily: "Playfair Display",
        color: "#FAF5EB",
        fontWeight: "800",
        textAlign: "center",
        top: 36,
        left: 10,
        width: 80,
        height: 24
      },
      {
        id: "l-text-body",
        type: "text",
        text: "Minimalist engineering. Built for carbon stability.",
        fontSize: 11,
        fontFamily: "Inter",
        color: "#FAF5EB/80",
        fontWeight: "500",
        textAlign: "center",
        top: 66,
        left: 15,
        width: 70,
        height: 10
      }
    ]
  },
  {
    id: "temp-2",
    title: "Eco Quote Pinterest Board",
    format: "pinterest-pin",
    width: 400,
    height: 600,
    backgroundColor: "#FAF5EB",
    category: "Quote",
    layers: [
      {
        id: "q-shape-deco",
        type: "shape",
        top: 20,
        left: 15,
        width: 70,
        height: 60,
        fill: "transparent"
      },
      {
        id: "q-title",
        type: "text",
        text: "“",
        fontSize: 55,
        fontFamily: "Playfair Display",
        color: "#117644",
        fontWeight: "900",
        textAlign: "center",
        top: 14,
        left: 10,
        width: 80,
        height: 10
      },
      {
        id: "q-quote",
        type: "text",
        text: "Every design choice holds a consequence. Simplify the outer materials to safeguard the core spaces.",
        fontSize: 18,
        fontFamily: "Playfair Display",
        color: "#042F1A",
        fontWeight: "700",
        textAlign: "center",
        top: 30,
        left: 12,
        width: 76,
        height: 30
      },
      {
        id: "q-author",
        type: "text",
        text: "— POSTRICK TEAM",
        fontSize: 10,
        fontFamily: "JetBrains Mono",
        color: "#117644",
        fontWeight: "800",
        textAlign: "center",
        top: 72,
        left: 10,
        width: 80,
        height: 5
      }
    ]
  },
  {
    id: "temp-3",
    title: "Conscious Workspace Release",
    format: "instagram-story",
    width: 360,
    height: 640,
    backgroundColor: "#117644",
    backgroundGradient: "linear-gradient(180deg, #117644 0%, #042F1A 100%)",
    backgroundImage: "https://picsum.photos/seed/office-minimal/360/640",
    category: "Product",
    layers: [
      {
        id: "ps-tint",
        type: "shape",
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        fill: "rgba(4, 47, 26, 0.55)"
      },
      {
        id: "ps-flag",
        type: "text",
        text: "NEW ERA IN TECH",
        fontSize: 10,
        fontFamily: "JetBrains Mono",
        color: "#C5E729",
        fontWeight: "900",
        textAlign: "center",
        top: 15,
        left: 10,
        width: 80,
        height: 5
      },
      {
        id: "ps-headline",
        type: "text",
        text: "AESTHETICS\nOF PURE FLOW",
        fontSize: 32,
        fontFamily: "Space Grotesk",
        color: "#FFFFFF",
        fontWeight: "900",
        textAlign: "center",
        top: 26,
        left: 5,
        width: 90,
        height: 30
      },
      {
        id: "ps-cta",
        type: "text",
        text: "ORDER IN BIO",
        fontSize: 12,
        fontFamily: "Space Grotesk",
        color: "#042F1A",
        fontWeight: "900",
        textAlign: "center",
        top: 78,
        left: 25,
        width: 50,
        height: 8,
        fill: "#C5E729"
      }
    ]
  },
  {
    id: "temp-4",
    title: "Launch Event Announcement",
    format: "youtube-thumbnail",
    width: 640,
    height: 360,
    backgroundColor: "#FFFFFF",
    backgroundGradient: "linear-gradient(135deg, #FFFFFF 0%, #FAF5EB 100%)",
    category: "Event",
    layers: [
      {
        id: "ev-line",
        type: "shape",
        top: 10,
        left: 10,
        width: 2,
        height: 80,
        fill: "#117644"
      },
      {
        id: "ev-header",
        type: "text",
        text: "POSTRICK LIVE KEYNOTE",
        fontSize: 12,
        fontFamily: "JetBrains Mono",
        color: "#117644",
        fontWeight: "900",
        textAlign: "left",
        top: 18,
        left: 15,
        width: 70,
        height: 6
      },
      {
        id: "ev-topic",
        type: "text",
        text: "THE CONSCIOUS UPGRADE",
        fontSize: 27,
        fontFamily: "Space Grotesk",
        color: "#042F1A",
        fontWeight: "900",
        textAlign: "left",
        top: 30,
        left: 15,
        width: 75,
        height: 18
      },
      {
        id: "ev-date",
        type: "text",
        text: "JUNE 25, 2026 • 10:00 AM UTC",
        fontSize: 10,
        fontFamily: "Inter",
        color: "#666666",
        fontWeight: "700",
        textAlign: "left",
        top: 64,
        left: 15,
        width: 70,
        height: 6
      },
      {
        id: "ev-badge",
        type: "text",
        text: "STREAMING LIVE",
        fontSize: 8,
        fontFamily: "Space Grotesk",
        color: "#042F1A",
        fontWeight: "900",
        textAlign: "center",
        top: 76,
        left: 15,
        width: 25,
        height: 8,
        fill: "#C5E729"
      }
    ]
  },
  {
    id: "temp-5",
    title: "Bento Announcement Slide",
    format: "facebook-cover",
    width: 640,
    height: 240,
    backgroundColor: "#FAF5EB",
    category: "Announcement",
    layers: [
      {
        id: "ba-bg",
        type: "shape",
        top: 15,
        left: 60,
        width: 35,
        height: 70,
        fill: "#C5E729/15"
      },
      {
        id: "ba-title",
        type: "text",
        text: "WORLDWIDE DELIVERY CONNECTED",
        fontSize: 11,
        fontFamily: "Space Grotesk",
        color: "#117644",
        fontWeight: "900",
        textAlign: "left",
        top: 24,
        left: 8,
        width: 50,
        height: 10
      },
      {
        id: "ba-head",
        type: "text",
        text: "Dispatched from Zero-Emission Grid",
        fontSize: 18,
        fontFamily: "Playfair Display",
        color: "#042F1A",
        fontWeight: "800",
        textAlign: "left",
        top: 42,
        left: 8,
        width: 48,
        height: 15
      },
      {
        id: "ba-right",
        type: "text",
        text: "30% weight savings in transport packaging allows globally balanced shipping tracks.",
        fontSize: 10,
        fontFamily: "Inter",
        color: "#042F1A",
        fontWeight: "500",
        textAlign: "left",
        top: 30,
        left: 64,
        width: 27,
        height: 40
      }
    ]
  },
  {
    id: "temp-6",
    title: "Bolder Design Pitch",
    format: "instagram-post",
    width: 500,
    height: 500,
    backgroundColor: "#042F1A",
    category: "Product",
    layers: [
      {
        id: "bd-block",
        type: "shape",
        top: 15,
        left: 15,
        width: 70,
        height: 70,
        fill: "#117644"
      },
      {
        id: "bd-text-tag",
        type: "text",
        text: "01. ECO-UPGRADES",
        fontSize: 10,
        fontFamily: "JetBrains Mono",
        color: "#C5E729",
        fontWeight: "900",
        textAlign: "center",
        top: 26,
        left: 20,
        width: 60,
        height: 6
      },
      {
        id: "bd-head",
        type: "text",
        text: "REJECT\nWASTE",
        fontSize: 38,
        fontFamily: "Space Grotesk",
        color: "#FFFFFF",
        fontWeight: "900",
        textAlign: "center",
        top: 36,
        left: 20,
        width: 60,
        height: 30
      }
    ]
  }
];

export default function AiCreativeKit({ onSendToComposer }: { onSendToComposer: (text: string, mockupUrl: string) => void }) {
  
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<"my-designs" | "templates">("my-designs");
  const [isGenerationPanelExpanded, setIsGenerationPanelExpanded] = useState(true);

  // Brand Kit variables loadable from localStorage
  const [brandKitColors, setBrandKitColors] = useState<string[]>(["#042F1A", "#117644", "#C5E729", "#FAF5EB", "#FFFFFF", "#eae3d2"]);
  const [brandKitFonts, setBrandKitFonts] = useState<string[]>(["Space Grotesk", "Playfair Display", "Inter", "JetBrains Mono"]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColors = localStorage.getItem("postrick_brand_colors");
      const savedHeading = localStorage.getItem("postrick_brand_heading");
      const savedBody = localStorage.getItem("postrick_brand_body");
      if (savedColors) {
        try {
          const parsed = JSON.parse(savedColors);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBrandKitColors(parsed);
          }
        } catch(e) {}
      }
      if (savedHeading && savedBody) {
        setBrandKitFonts([savedHeading, savedBody, "Inter", "JetBrains Mono"]);
      } else if (savedHeading) {
        setBrandKitFonts([savedHeading, "Inter", "JetBrains Mono"]);
      }
    }
  }, []);

  // Generation Input States
  const [prompt, setPrompt] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("instagram-post");
  const [selectedStylePreset, setSelectedStylePreset] = useState("Minimal");
  const [useBrandKit, setUseBrandKit] = useState(false);

  // My saved designs & current generation count (or fallback to presets in DB)
  const [myDesigns, setMyDesigns] = useState<GraphicDesign[]>([]);

  // Category selection for templates
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<string>("All");

  // Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState("Sketching layout framework...");

  // Editor states
  const [editingDesign, setEditingDesign] = useState<GraphicDesign | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Rotation cycle of loading phrases
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const phrases = [
      "Sketching dynamic grid layout...",
      "Calibrating text hierarchy anchors...",
      "Weaving style color swatches...",
      "Applying your custom Brand Kit...",
      "Assembling responsive layers...",
      "Finalizing visual typography rendering..."
    ];
    if (isGenerating) {
      let index = 0;
      timer = setInterval(() => {
        index = (index + 1) % phrases.length;
        setLoadingPhrase(phrases[index]);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Load My Designs from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("postrick_creative_designs");
    if (saved) {
      try {
        setMyDesigns(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Pre-seed myDesigns with 2 cool initial editable copies
      const seeded = [
        { ...CURATED_TEMPLATES[0], id: `seeded-${Date.now()}-1`, title: "My First Conscious Poster" },
        { ...CURATED_TEMPLATES[1], id: `seeded-${Date.now()}-2`, title: "Aesthetic Sustainable Board" }
      ];
      setMyDesigns(seeded);
      localStorage.setItem("postrick_creative_designs", JSON.stringify(seeded));
    }
  }, []);

  const saveDesigns = (newList: GraphicDesign[]) => {
    setMyDesigns(newList);
    localStorage.setItem("postrick_creative_designs", JSON.stringify(newList));
  };

  // Trigger Design Generator
  const handleGenerateDesigns = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate-graphic-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          format: selectedFormat,
          stylePreset: selectedStylePreset,
          useBrandKit,
          existingCount: myDesigns.length
        })
      });

      const data = await response.json();
      if (data.designs && data.designs.length > 0) {
        // Stagger visual insertion
        const withUniqueIds = data.designs.map((d: any, idx: number) => ({
          ...d,
          id: `ai-${Date.now()}-${idx}`,
          title: d.title || `Asset ${myDesigns.length + idx + 1}`
        }));

        saveDesigns([...withUniqueIds, ...myDesigns]);
        confetti({ particleCount: 50, spread: 60 });
        setActiveSubTab("my-designs");
        
        // auto-scroll to results grid
        setTimeout(() => {
          document.getElementById("results-grid-header")?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        alert("Completed generation. Check guidelines and refine prompts!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete Design
  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this custom graphic?")) {
      const filtered = myDesigns.filter(d => d.id !== id);
      saveDesigns(filtered);
    }
  };

  // Duplicate or use Template
  const handleUseTemplate = (template: GraphicDesign) => {
    const copy: GraphicDesign = {
      ...template,
      id: `copy-${Date.now()}`,
      title: `${template.title} Copy`,
      layers: template.layers.map(l => ({ ...l, id: `layer-copy-${Date.now()}-${Math.random()}` }))
    };
    saveDesigns([copy, ...myDesigns]);
    setActiveSubTab("my-designs");
    confetti({ particleCount: 30, spread: 45 });
  };

  // Formats row layout config
  const formatOptions = [
    { id: "instagram-post", label: "Instagram Post", ratio: "1:1", w: 12, h: 12 },
    { id: "instagram-story", label: "Instagram Story", ratio: "9:16", w: 8, h: 14 },
    { id: "facebook-cover", label: "Facebook Cover", ratio: "16:6", w: 16, h: 6 },
    { id: "pinterest-pin", label: "Pinterest Pin", ratio: "2:3", w: 10, h: 15 },
    { id: "youtube-thumbnail", label: "YouTube Thumbnail", ratio: "16:9", w: 16, h: 9 },
    { id: "custom", label: "Custom Slate", ratio: "4:3", w: 12, h: 9 }
  ];

  // Visual presets
  const stylePresets = [
    { id: "Minimal", title: "Minimal", desc: "Pure Negative Space", previewBg: "bg-stone-50 border border-stone-200" },
    { id: "Bold/Editorial", title: "Bold/Editorial", desc: "Serif & Contrast", previewBg: "bg-[#042F1A] border border-[#117644]" },
    { id: "Gradient", title: "Gradient", desc: "Luminous Sweeps", previewBg: "bg-gradient-to-br from-[#117644] to-[#C5E729]" },
    { id: "Photo-real", title: "Photo-real", desc: "Cinematic Overlay", previewBg: "bg-stone-200 relative overflow-hidden" },
    { id: "Illustrated", title: "Illustrated", desc: "Creative Vector", previewBg: "bg-teal-50 border border-teal-150" }
  ];

  // Template categories
  const categories = ["All", "Sale/Promo", "Quote", "Announcement", "Product", "Event"];
  const filteredTemplates = selectedTemplateCat === "All" 
    ? CURATED_TEMPLATES 
    : CURATED_TEMPLATES.filter(t => t.category === selectedTemplateCat);

  // Active layer selection helper in editor
  const activeLayer = editingDesign?.layers.find(l => l.id === selectedLayerId);

  // Edit layer properties
  const handleUpdateLayer = (layerId: string, updates: Partial<DesignLayer>) => {
    if (!editingDesign) return;
    const updatedLayers = editingDesign.layers.map(l => {
      if (l.id === layerId) {
        return { ...l, ...updates };
      }
      return l;
    });
    setEditingDesign({ ...editingDesign, layers: updatedLayers });
  };

  // Reorder layers
  const handleMoveLayer = (layerId: string, direction: "up" | "down") => {
    if (!editingDesign) return;
    const layersCopy = [...editingDesign.layers];
    const index = layersCopy.findIndex(l => l.id === layerId);
    if (index === -1) return;
    
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < layersCopy.length) {
      const temp = layersCopy[index];
      layersCopy[index] = layersCopy[targetIdx];
      layersCopy[targetIdx] = temp;
      setEditingDesign({ ...editingDesign, layers: layersCopy });
    }
  };

  // Save changes from Editor to myDesigns list
  const handleSaveEditor = () => {
    if (!editingDesign) return;
    const updated = myDesigns.map(d => d.id === editingDesign.id ? editingDesign : d);
    saveDesigns(updated);
    setEditingDesign(null);
    confetti({ particleCount: 20 });
  };

  // Export Design as high-fidelity interactive SVG format!
  const handleDownloadSVG = (design: GraphicDesign, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Construct inline SVG markup
    let layersMarkup = "";
    design.layers.forEach(layer => {
      if (layer.type === "text" && layer.text) {
        // Separate multi-lines
        const lines = layer.text.split("\n");
        const dy = 1.25; // Line-height factor
        let tspanElements = "";
        lines.forEach((l, i) => {
          tspanElements += `<tspan x="${layer.left + layer.width/2}%" dy="${i === 0 ? 0 : dy}em">${l}</tspan>`;
        });

        // Map fonts to fallback safety
        const fontFamilyVal = layer.fontFamily || "sans-serif";
        const fillVal = layer.color || "#000000";

        layersMarkup += `
          <g style="font-family: '${fontFamilyVal}', sans-serif; font-size: ${layer.fontSize}px; font-weight: ${layer.fontWeight || 'bold'}; fill: ${fillVal};">
            <text x="${layer.left + layer.width/2}%" y="${layer.top}%" text-anchor="${layer.textAlign === 'center' ? 'middle' : (layer.textAlign === 'right' ? 'end' : 'start')}" dominant-baseline="hanging" width="${layer.width}%">
              ${tspanElements}
            </text>
          </g>
        `;
      } else if (layer.type === "shape") {
        const fillHex = layer.fill || "#C5E729";
        layersMarkup += `
          <rect x="${layer.left}%" y="${layer.top}%" width="${layer.width}%" height="${layer.height}%" fill="${fillHex}" rx="4" />
        `;
      }
    });

    let backgroundFill = `fill="${design.backgroundColor}"`;
    if (design.backgroundGradient) {
      // Simple parse default gradient or inject clean SVG gradient
      backgroundFill = `fill="url(#svg-gradient-${design.id})"`;
    }

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${design.width} ${design.height}" width="${design.width}" height="${design.height}">
        <defs>
          ${design.backgroundGradient ? `
            <linearGradient id="svg-gradient-${design.id}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#117644" />
              <stop offset="100%" stop-color="#042F1A" />
            </linearGradient>
          ` : ""}
        </defs>
        <rect width="100%" height="100%" ${backgroundFill} />
        ${design.backgroundImage ? `
          <image href="${design.backgroundImage}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" opacity="0.45" />
        ` : ""}
        ${layersMarkup}
      </svg>
    `;

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${design.title.toLowerCase().replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // High quality PNG Simulation URL generator (Uses Picsum with seed keywords)
  const getSimulatedImageURL = (design: GraphicDesign) => {
    // Generate a beautiful, stable mock image URL from Picsum corresponding to layout theme
    const themeKeyword = design.title.toLowerCase().includes("minimal") ? "space" : "vibrant";
    return `https://picsum.photos/seed/${design.id}/${design.width}/${design.height}`;
  };

  // Convert to Post / use in Composer
  const handleUseInPost = (design: GraphicDesign, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Assemble text preview from layers
    const texts = design.layers
      .filter(l => l.type === "text" && l.text)
      .map(l => l.text)
      .join(" - ");

    const finalImageURL = getSimulatedImageURL(design);

    onSendToComposer(
      `🎨 Designed Custom Graphic: "${design.title}" (${design.format.toUpperCase()} Layout in ${design.width}X${design.height}px)\n- Focus Keywords: ${texts ? `${texts.substring(0, 50)}...` : "Minimalist design"}`,
      finalImageURL
    );
    confetti({ particleCount: 30, spread: 45 });
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1 — HEADER & SEGMENTED CONTROLLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4.5 border-[#eae3d2]">
        <div>
          <h1 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">
            Creative Kit Studio
          </h1>
          <p className="text-xs text-[#042F1A]/60 font-medium">Design professional social graphics, banners, and vector cards instantly</p>
        </div>

        {/* Segmented Control Selector */}
        <div className="bg-[#FAF5EB] p-1 border border-[#eae3d2] rounded-full inline-flex self-start sm:self-center shadow-3xs">
          {[
            { id: "my-designs", label: "My Designs", count: myDesigns.length },
            { id: "templates", label: "Preset Templates", count: CURATED_TEMPLATES.length }
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                whileTap={{ scale: 0.95 }}
                className={`py-1.5 px-3.5 rounded-full text-2xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  active 
                    ? "bg-[#042F1A] text-[#FAF6EE] shadow-sm" 
                    : "text-neutral-500 hover:text-[#042F1A]"
                }`}
              >
                {tab.label}
                <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-sans font-bold leading-none ${active ? "bg-[#117644] text-white" : "bg-neutral-200 text-stone-500"}`}>
                  {tab.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 — DYNAMICAL GENERATION PANEL (COLLAPSIBLE) */}
      <div className="bg-white border-2 border-[#eae3d2] rounded-3xl overflow-hidden shadow-3xs">
        <button
          onClick={() => setIsGenerationPanelExpanded(!isGenerationPanelExpanded)}
          className="w-full p-4.5 bg-[#FAF5EB]/40 flex items-center justify-between border-b border-[#eae3d2] text-left hover:bg-[#FAF5EB]/80 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#117644]/10 rounded-lg text-[#117644]">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-[#117644] block">Campaign Designer</span>
              <h3 className="font-serif text-sm font-bold text-[#042F1A]">Asymmetrical Layouter &amp; Banner Planner</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase hidden sm:inline">
              {isGenerationPanelExpanded ? "Minimize generation options" : "Expand form to design"}
            </span>
            {isGenerationPanelExpanded ? (
              <ChevronUp className="w-4.5 h-4.5 text-neutral-500" />
            ) : (
              <ChevronDown className="w-4.5 h-4.5 text-neutral-500" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isGenerationPanelExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form onSubmit={handleGenerateDesigns} className="p-5 md:p-6 space-y-6">
                
                {/* Prompt row */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-wider block">
                    1. Describe the banner or graphic layout you want
                  </label>
                  <textarea
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., High contrast product banner announcing 30% packaging reduction with clean neon emerald vibes..."
                    maxLength={350}
                    className="w-full text-xs p-4 rounded-2xl border-2 border-neutral-100 bg-neutral-50/20 focus:bg-white focus:border-[#117644] focus:outline-none font-semibold min-h-[90px] text-[#042F1A] placeholder-neutral-400"
                  />
                </div>

                {/* Aspect ratio row with interactive rectangle indicators */}
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-wider block">
                    2. Select Dynamic format size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {formatOptions.map((opt) => {
                      const active = selectedFormat === opt.id;
                      return (
                        <motion.button
                          type="button"
                          key={opt.id}
                          onClick={() => setSelectedFormat(opt.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.96 }}
                          className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                            active 
                              ? "bg-[#042F1A] text-white border-transparent shadow-sm" 
                              : "bg-white border-[#eae3d2] text-neutral-500 hover:bg-neutral-50/30"
                          }`}
                        >
                          {/* Mini Aspect Ratio Visualizer Panel */}
                          <div 
                            className={`rounded-xs border-2 select-none pointer-events-none flex-shrink-0 transition-all ${
                              active ? "border-[#C5E729]" : "border-neutral-300"
                            }`}
                            style={{ 
                              width: `${opt.w * 1.5}px`, 
                              height: `${opt.h * 1.5}px`,
                              maxHeight: "26px",
                              maxWidth: "26px"
                            }}
                          />
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-tight block leading-none">{opt.label}</h4>
                            <span className="text-[8.5px] font-mono opacity-65 leading-none mt-1 block">{opt.ratio}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Style preset visual swatches */}
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-wider block">
                    3. Layout style presets &amp; colors
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {stylePresets.map((sty) => {
                      const active = selectedStylePreset === sty.id;
                      return (
                        <motion.button
                          type="button"
                          key={sty.id}
                          onClick={() => setSelectedStylePreset(sty.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                            active 
                              ? "bg-[#042F1A] text-white border-transparent" 
                              : "bg-white border-[#eae3d2] text-neutral-500 hover:bg-neutral-50/30"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            {/* Color swatch element */}
                            <span className={`w-6 h-4 rounded-md ${sty.previewBg}`}>
                              {sty.id === "Photo-real" && (
                                <span className="absolute inset-0 bg-neutral-400 opacity-60 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                              )}
                            </span>
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C5E729]" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-[10.5px] font-black uppercase tracking-wider block leading-none">{sty.title}</h4>
                            <p className={`text-[8.5px] leading-none mt-1 ${active ? "text-neutral-300" : "text-neutral-400"}`}>{sty.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom switch brand kit + generate button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-3 border-t border-[#eae3d2]/70 leading-none">
                  
                  {/* Brand Kit control */}
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useBrandKit}
                        onChange={(e) => setUseBrandKit(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:transition-all peer-checked:bg-[#117644]" />
                    </label>
                    <div className="text-left font-sans">
                      <span className="text-[11px] font-black uppercase tracking-tight text-[#042F1A] flex items-center gap-1.5">
                        <Palette className="w-3 h-3 text-[#117644]" />
                        Use my Brand Kit
                      </span>
                      <p className="text-[8.5px] text-neutral-400 font-mono uppercase mt-0.5">Applies Charcoal, Cream, &amp; Emerald colors</p>
                    </div>
                  </div>

                  {/* Primary launcher button */}
                  <motion.button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    whileHover={{ scale: 1.006 }}
                    whileTap={{ scale: 0.995 }}
                    className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center relative overflow-hidden transition-all shadow-sm ${
                      isGenerating 
                        ? "bg-stone-900 border border-stone-800 text-stone-300" 
                        : "bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] cursor-pointer"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2.5 z-10">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5E729]" />
                        <span className="font-serif italic animate-pulse">{loadingPhrase}</span>
                        {/* Shimmer sweep */}
                        <motion.div 
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5E729]" />
                        <span>Draw Vector Core Templates</span>
                      </div>
                    )}
                  </motion.button>

                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 3 — GRAPHIC RESULTS MASONRY GRID (My Designs vs Templates) */}
      <div id="results-grid-header" className="space-y-4">
        
        {/* Gallery context bar */}
        {activeSubTab === "templates" && (
          <div className="flex items-center justify-between border-b pb-2 text-left">
            <div>
              <span className="text-[9px] font-mono uppercase font-black text-[#117644] tracking-widest block">Standard Templates</span>
              <h3 className="font-serif font-black text-[#042F1A] text-sm mt-0.5">High Conversion Curator Gallery</h3>
            </div>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTemplateCat(cat)}
                  className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    selectedTemplateCat === cat 
                      ? "bg-[#117644] text-[#FAF6EE] border-transparent shadow-3xs" 
                      : "bg-white text-neutral-500 border-neutral-100 hover:text-[#042F1A]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MASONRY ASPECT RATIO PREVIEW GRID */}
        {activeSubTab === "my-designs" && myDesigns.length === 0 ? (
          <div className="border bg-neutral-50/50 p-12 text-center rounded-3xl font-serif text-stone-400 italic font-bold">
            No customized layouts yet. Enter standard keywords above to synthesize your responsive canvas models!
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            
            {/* Map actual displayed items (filtered templates vs user designs) */}
            {(activeSubTab === "my-designs" ? myDesigns : filteredTemplates).map((design, index) => {
              
              // Map format background
              const aspectClass = 
                design.format === "instagram-post" ? "aspect-square" :
                design.format === "instagram-story" ? "aspect-[9/16]" :
                design.format === "facebook-cover" ? "aspect-[16/6]" :
                design.format === "pinterest-pin" ? "aspect-[2/3]" :
                design.format === "youtube-thumbnail" ? "aspect-[16/9]" : "aspect-[4/3]";

              return (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="bg-white border-2 border-[#eae3d2] hover:border-[#117644] rounded-3xl p-3.5 space-y-3 shadow-3xs hover:shadow-2xl transition-all break-inside-avoid relative group"
                >
                  {/* Visual card header */}
                  <div className="flex items-center justify-between text-[8px] font-mono tracking-widest uppercase">
                    <span className="font-serif font-black lowercase italic text-[#042F1A]/70">&ldquo;{design.title}&rdquo;</span>
                    <span className="bg-neutral-150 rounded-full px-2 py-0.5 font-sans font-bold leading-none text-neutral-500">
                      {design.format.replace("-", " ")}
                    </span>
                  </div>

                  {/* DESIGN CANVAS FIELD CONTAINER WITH BLUR-TO-SHARP RENDER ON HOVER */}
                  <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-neutral-100 shadow-sm transition-all`}>
                    
                    {/* Design Background Layer */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ 
                        background: design.backgroundGradient || design.backgroundColor,
                        backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />

                    {/* Vector / Editable Shape & Text Layers */}
                    <div className="absolute inset-0 w-full h-full select-none pointer-events-none p-4">
                      {design.layers.map((layer) => {
                        if (layer.type === "shape") {
                          return (
                            <div 
                              key={layer.id}
                              className="absolute rounded-md"
                              style={{
                                top: `${layer.top}%`,
                                left: `${layer.left}%`,
                                width: `${layer.width}%`,
                                height: `${layer.height}%`,
                                backgroundColor: layer.fill || "#C5E729"
                              }}
                            />
                          );
                        } else if (layer.type === "text" && layer.text) {
                          return (
                            <div
                              key={layer.id}
                              className="absolute leading-snug whitespace-pre-wrap flex flex-col justify-center"
                              style={{
                                top: `${layer.top}%`,
                                left: `${layer.left}%`,
                                width: `${layer.width}%`,
                                height: `${layer.height}%`,
                                color: layer.color || "#042F1A",
                                fontSize: `${(layer.fontSize || 14) * 0.45}vw`, // dynamic font scaling relative to parent width viewport
                                fontWeight: layer.fontWeight || "800",
                                fontFamily: layer.fontFamily || "Space Grotesk",
                                textAlign: layer.textAlign || "center",
                              }}
                            >
                              <span>{layer.text}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* HOVER ACTION MOCKUP OVERLAY PANEL */}
                    <div className="absolute inset-0 bg-[#042F1A]/85 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2.5 p-4 z-20">
                      <span className="text-[10px] font-mono font-black text-[#C5E729] tracking-widest uppercase mb-1 drop-shadow-sm">
                        {activeSubTab === "templates" ? "Curated Template Set" : "Custom Vector Graphic"}
                      </span>

                      {activeSubTab === "templates" ? (
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(design)}
                          className="w-full max-w-[150px] py-2 bg-[#C5E729] hover:bg-white text-[#042F1A] rounded-full text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Use Template
                        </button>
                      ) : (
                        <div className="w-full max-w-[180px] grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDesign(design)}
                            className="py-1.8 bg-white hover:bg-neutral-100 text-[#042F1A] rounded-xl text-[9.5px] font-black uppercase tracking-tight flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-[#117644]" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleUseInPost(design, e)}
                            className="py-1.8 bg-[#C5E729] hover:bg-[#FAF5EB] text-[#042F1A] rounded-xl text-[9.5px] font-black uppercase tracking-tight flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <ArrowUpRight className="w-3 h-3" />
                            Use In Post
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDownloadSVG(design, e)}
                            className="col-span-2 py-1.8 border border-neutral-400 bg-transparent hover:bg-white/10 text-white rounded-xl text-[9.5px] font-semibold tracking-tight flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            <Download className="w-3 h-3 text-[#C5E729]" />
                            Download SVG Vector
                          </button>
                        </div>
                      )}

                      {activeSubTab === "my-designs" && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDesign(design.id, e)}
                          className="absolute bottom-3 right-3 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
                          title="Delete design"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
            
          </div>
        )}
      </div>

      {/* SECTION 4 — CANVA-LIKE LIGHTWEIGHT EDIT MODAL/PANEL (TRIGGERED BY EDIT) */}
      <AnimatePresence>
        {editingDesign && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[15000] flex items-center justify-center p-3 sm:p-5 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF5EB] border-2 border-[#117644] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              
              {/* CANVAS PREVIEW CENTER (LEFT SIDE) */}
              <div className="flex-1 bg-neutral-900 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between items-center relative min-h-[280px]">
                
                {/* Editor canvas header info */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className="text-[10px] uppercase font-mono font-black text-[#C5E729] tracking-widest">
                    Quick-Tweak Editor
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">
                    {editingDesign.width} X {editingDesign.height} ({editingDesign.format})
                  </span>
                </div>

                {/* THE ACTIVE EDIT CANVAS */}
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl select-none my-4 max-w-full"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    aspectRatio: 
                      editingDesign.format === "instagram-post" ? "1/1" :
                      editingDesign.format === "instagram-story" ? "9/16" :
                      editingDesign.format === "facebook-cover" ? "16/6" :
                      editingDesign.format === "pinterest-pin" ? "2/3" :
                      editingDesign.format === "youtube-thumbnail" ? "16/9" : "4/3",
                  }}
                >
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{ 
                      background: editingDesign.backgroundGradient || editingDesign.backgroundColor,
                      backgroundImage: editingDesign.backgroundImage ? `url(${editingDesign.backgroundImage})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />

                  {/* Rendering layer overlays natively inside Editor */}
                  <div className="absolute inset-0 w-full h-full p-4 relative">
                    {editingDesign.layers.map((layer) => {
                      const isSelected = selectedLayerId === layer.id;
                      
                      return (
                        <div
                          key={layer.id}
                          onClick={() => setSelectedLayerId(layer.id)}
                          className={`absolute group cursor-pointer transition-all ${
                            isSelected 
                              ? "ring-2 ring-amber-500 rounded-sm z-30 bg-amber-500/5" 
                              : "hover:ring-1 hover:ring-neutral-400"
                          }`}
                          style={{
                            top: `${layer.top}%`,
                            left: `${layer.left}%`,
                            width: `${layer.width}%`,
                            height: `${layer.height}%`
                          }}
                        >
                          {layer.type === "shape" ? (
                            <div 
                              className="w-full h-full"
                              style={{ backgroundColor: layer.fill || "#C5E729" }}
                            />
                          ) : layer.type === "text" && layer.text ? (
                            <div
                              className="w-full h-full leading-snug whitespace-pre-wrap flex flex-col justify-center"
                              style={{
                                color: layer.color || "#042F1A",
                                fontSize: `${(layer.fontSize || 14) * 0.35}vw`, // dynamic internal scale
                                fontWeight: layer.fontWeight || "800",
                                fontFamily: layer.fontFamily || "Space Grotesk",
                                textAlign: layer.textAlign || "center",
                              }}
                            >
                              <span>{layer.text}</span>
                            </div>
                          ) : null}

                          {isSelected && (
                            <span className="absolute -top-3.5 left-0 bg-amber-500 text-white text-[7.5px] font-mono leading-none tracking-widest px-1.5 py-0.5 rounded-sm uppercase z-40">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Layer edit hint */}
                <p className="text-[10px] text-neutral-400 font-bold uppercase z-10">
                  ⚡ Tap layers inside the canvas to configure typography &amp; layout coordinates
                </p>

              </div>

              {/* EDITOR CONTROL PANEL (RIGHT SIDE) */}
              <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-[#eae3d2] p-5 flex flex-col justify-between overflow-y-auto max-h-[550px] md:max-h-none">
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b pb-3 border-[#eae3d2]">
                    <h3 className="font-serif font-black text-[#042F1A] text-sm flex items-center gap-1.5">
                      <Sliders className="w-4.5 h-4.5 text-[#117644]" /> Edit Graphic Details
                    </h3>
                    <button
                      onClick={() => setEditingDesign(null)}
                      className="p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>

                  {/* Design Global Controls */}
                  <div className="space-y-3.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-black text-[#117644] block">Background Properties:</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8.5px] font-mono uppercase text-gray-500">Solid color:</label>
                        <input 
                          type="color" 
                          value={editingDesign.backgroundColor} 
                          onChange={(e) => setEditingDesign({ 
                            ...editingDesign, 
                            backgroundColor: e.target.value,
                            backgroundGradient: undefined // Reset gradient
                          })}
                          className="w-full h-8 rounded-lg border-2 bg-transparent cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] font-mono uppercase text-gray-500">Background preset:</label>
                        <select
                          onChange={(e) => {
                            if (e.target.value === "brand-gradient") {
                              setEditingDesign({
                                ...editingDesign,
                                backgroundGradient: "linear-gradient(135deg, #117644 0%, #042F1A 100%)"
                              });
                            } else if (e.target.value === "solid") {
                              setEditingDesign({
                                ...editingDesign,
                                backgroundGradient: undefined
                              });
                            }
                          }}
                          className="w-full text-[10.5px] border p-1 rounded-md"
                        >
                          <option value="solid">Solid Color</option>
                          <option value="brand-gradient">Brand Grad</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Layer Editor section */}
                  {activeLayer && activeLayer.type === "text" ? (
                    <div className="bg-white rounded-2xl p-4 border border-[#eae3d2] space-y-3.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest font-mono font-black text-[#117644]">Configure Text Layer</span>
                        <span className="text-[8px] font-mono bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500 font-bold">TEXT</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] font-semibold text-neutral-500 uppercase block">Layer Content Text:</label>
                        <textarea
                          rows={2}
                          value={activeLayer.text || ""}
                          onChange={(e) => handleUpdateLayer(activeLayer.id, { text: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl font-bold bg-neutral-50/50 text-[#042F1A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8.5px] font-semibold text-neutral-500 uppercase block">Font Family:</label>
                          <select
                            value={activeLayer.fontFamily}
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { fontFamily: e.target.value })}
                            className="w-full text-2xs p-1.5 border rounded bg-white text-stone-700"
                          >
                            {brandKitFonts.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8.5px] font-semibold text-neutral-500 uppercase block">Text Color:</label>
                          <input 
                            type="color" 
                            value={activeLayer.color || "#042F1A"} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { color: e.target.value })}
                            className="w-full h-7 rounded border bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <div className="space-y-1">
                          <label className="text-[7.5px] font-semibold text-neutral-500 uppercase block">Scale:</label>
                          <input 
                            type="range" 
                            min="8" 
                            max="45" 
                            value={activeLayer.fontSize || 14} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full accent-[#117644] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[7.5px] font-semibold text-neutral-500 uppercase block">Top Coordinate:</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={activeLayer.top} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { top: parseInt(e.target.value) })}
                            className="w-full accent-[#117644] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[7.5px] font-semibold text-neutral-500 uppercase block">Left Anchor:</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={activeLayer.left} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { left: parseInt(e.target.value) })}
                            className="w-full accent-[#117644] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Alignment selectors */}
                      <div className="flex gap-2 justify-between items-center pt-2 border-t border-dashed">
                        <span className="text-[8px] font-mono text-neutral-400">Alignment:</span>
                        <div className="flex gap-1.5">
                          {["left", "center", "right"].map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => handleUpdateLayer(activeLayer.id, { textAlign: align as any })}
                              className={`px-2 py-0.8 text-[8px] uppercase tracking-wider rounded-md border font-black ${
                                activeLayer.textAlign === align 
                                  ? "bg-[#117644] text-white border-transparent" 
                                  : "bg-white text-stone-500"
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : activeLayer && activeLayer.type === "shape" ? (
                    <div className="bg-white rounded-2xl p-4 border border-[#eae3d2] space-y-3.5 text-left animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest font-mono font-black text-[#117644]">Configure Shape Layer</span>
                        <span className="text-[8px] font-mono bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500 font-bold">SHAPE</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8.5px] font-semibold text-neutral-500 uppercase block">Shape Fill Color:</label>
                          <input 
                            type="color" 
                            value={activeLayer.fill || "#C5E729"} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { fill: e.target.value })}
                            className="w-full h-8 rounded border bg-transparent cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8.5px] font-semibold text-neutral-500 uppercase block">Quick Presets:</label>
                          <div className="grid grid-cols-2 gap-1 pt-0.5">
                            {brandKitColors.map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => handleUpdateLayer(activeLayer.id, { fill: c })}
                                className="w-5 h-4 rounded border"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-neutral-400 block mb-1">Height ({activeLayer.height}%)</span>
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={activeLayer.height} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { height: parseInt(e.target.value) })}
                            className="w-full accent-[#117644] h-1 bg-neutral-200 rounded"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-neutral-400 block mb-1">Width ({activeLayer.width}%)</span>
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={activeLayer.width} 
                            onChange={(e) => handleUpdateLayer(activeLayer.id, { width: parseInt(e.target.value) })}
                            className="w-full accent-[#117644] h-1 bg-neutral-200 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-neutral-50 p-4 rounded-2xl text-center border font-serif text-neutral-400 text-xs italic font-semibold">
                      Please select any text or shape layer inside the preview canvas box to tweak dimensions.
                    </div>
                  )}

                  {/* Layers sorting and arrangement */}
                  <div className="space-y-2 text-left bg-neutral-50 p-4.5 rounded-2xl border border-neutral-200 shadow-3xs">
                    <span className="text-[9px] uppercase tracking-widest font-mono font-black text-[#117644] block">Arrangement Layers:</span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {editingDesign.layers.map((l, idx) => {
                        const isSel = selectedLayerId === l.id;
                        return (
                          <div 
                            key={l.id}
                            onClick={() => setSelectedLayerId(l.id)}
                            className={`flex items-center justify-between p-2 rounded-xl text-[10px] cursor-pointer transition-colors ${
                              isSel ? "bg-[#117644] text-white" : "bg-white text-stone-600 hover:bg-neutral-100"
                            }`}
                          >
                            <span className="font-mono leading-none flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5 text-stone-400 inline" />
                              {l.type.toUpperCase()}: {l.text ? `${l.text.substring(0, 15)}...` : `Layer Block ${idx+1}`}
                            </span>
                            
                            {isSel && (
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleMoveLayer(l.id, "up")}
                                  disabled={idx === 0}
                                  className="p-1 rounded bg-white/20 hover:bg-white/40 leading-none text-white disabled:opacity-20 flex items-center justify-center"
                                  title="Bring standard layer forward"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveLayer(l.id, "down")}
                                  disabled={idx === editingDesign.layers.length - 1}
                                  className="p-1 rounded bg-white/20 hover:bg-white/40 leading-none text-white disabled:opacity-20 flex items-center justify-center"
                                  title="Send standard layer backward"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Editor Action keys */}
                <div className="pt-4 border-t border-[#eae3d2] mt-4 flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setEditingDesign(null)}
                    className="flex-1 py-2.5 rounded-full border border-[#eae3d2] hover:bg-neutral-50 text-[10px] font-black uppercase tracking-wider text-neutral-600 text-center transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditor}
                    className="flex-1 py-2.5 rounded-full bg-[#117644] hover:bg-[#042F1A] text-[#FAF5EB] text-[10px] font-black uppercase tracking-wider text-center transition-colors shadow-3xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
