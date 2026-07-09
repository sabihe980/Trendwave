"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, History, X, Copy, Check, RefreshCw, Send, Trash2, 
  HelpCircle, ChevronRight, Upload, Image as ImageIcon, Search,
  Briefcase, Heart, Smile, Flame, Feather, Award, Eye, Play, Plus, CornerDownLeft
} from "lucide-react";
import confetti from "canvas-confetti";

// Custom Social Icon Imports
import { Instagram, Linkedin, Facebook, Youtube } from "./icons";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.43.21-.92 1.35-5.74 1.35-5.74s-.35-.69-.35-1.72c0-1.61.93-2.81 2.09-2.81 1 0 1.47.74 1.47 1.63 0 1-.63 2.49-.96 3.88-.27 1.15.57 2.09 1.7 2.09 2.04 0 3.61-2.15 3.61-5.26 0-2.75-1.98-4.67-4.8-4.67-3.27 0-5.19 2.44-5.19 4.97 0 .99.38 2.05.85 2.62.1.11.11.2.08.31l-.32 1.31c-.05.21-.17.26-.39.16-1.44-.67-2.34-2.77-2.34-4.45 0-3.63 2.64-6.96 7.6-6.96 4 0 7.1 2.85 7.1 6.65 0 3.97-2.51 7.17-5.99 7.17-1.17 0-2.27-.61-2.65-1.33l-.72 2.74c-.26 1-1 2.25-1.49 3.05C10.74 23.82 11.36 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.1-.43 6.3 6.3 0 0 0-5.25 5 6.31 6.31 0 0 0 5.25 7.55 6.32 6.32 0 0 0 7.29-4.79 6.38 6.38 0 0 0 .11-1V8.56A7.07 7.07 0 0 0 19.59 11V6.69z"/>
    </svg>
  );
}

function RenderPlatformIcon({ platform, className }: { platform: string; className?: string }) {
  if (platform === "instagram") return <Instagram className={className} />;
  if (platform === "tiktok") return <TikTokIcon className={className} />;
  if (platform === "linkedin") return <Linkedin className={className} />;
  if (platform === "facebook") return <Facebook className={className} />;
  if (platform === "youtube") return <Youtube className={className} />;
  if (platform === "pinterest") return <PinterestIcon className={className} />;
  return <Sparkles className={className} />;
}

// Preset historical data
interface PastGeneration {
  id: string;
  topic: string;
  timestamp: string;
  tone: string;
  variants: Array<{
    text: string;
    hashtags: string[];
    toneTag: string;
    platform: string;
  }>;
}

const INITIAL_HISTORY: PastGeneration[] = [
  {
    id: "hist-1",
    topic: "Introducing conscious tech materials with 30% packaging reduction",
    timestamp: "10 mins ago",
    tone: "Professional",
    variants: [
      {
        text: "Efficiency meets environmental awareness. 🌿 We are proud to present our revised supply pipeline featuring critical packaging optimizations. By stripping away 30% of standard packaging volume, we maintain premium structural integrity with minimal resource footprints.",
        hashtags: ["ZeroWaste", "EcoDesign", "ProductDevelopment"],
        toneTag: "Professional",
        platform: "linkedin"
      },
      {
        text: "less friction. less waste. 🌱 our conscious materials feature a 30% structural reduction on outer templates. crafted with pure carbon balance in mind.",
        hashtags: ["minimalist", "designinspo", "ecosystem"],
        toneTag: "Minimal",
        platform: "instagram"
      },
      {
        text: "Unpacking is dead waste. 📦 We completely redesigned our packaging rules to save 30% volumetric bulk. High strength. Zero clutter.",
        hashtags: ["growthhack", "industrialdesign", "hustle"],
        toneTag: "Bold",
        platform: "tiktok"
      }
    ]
  },
  {
    id: "hist-2",
    topic: "Flash launch countdown for our premium social dispatch scheduler",
    timestamp: "2 hours ago",
    tone: "Witty",
    variants: [
      {
        text: "The rumors are true: scheduling multi-platform feeds manually in 2026 is officially classified as extreme sports. 🤫 Safeguard your schedules and let Postrick handle your dispatch queues seamlessly.",
        hashtags: ["Postrick", "SMMTips", "OfficeHumor"],
        toneTag: "Witty",
        platform: "twitter"
      },
      {
        text: "Stop scrolling! 🛑 This is your official 2-minute notice. Tap our smart launcher to hook real-time organic engagement maps now.",
        hashtags: ["growthmarketing", "foryoupage", "creators"],
        toneTag: "Persuasive",
        platform: "tiktok"
      },
      {
        text: "Your feed is your virtual lobby. Let's arrange it perfectly. Introducing automated visual timing calendars designed to look and work gracefully.",
        hashtags: ["aestheticspace", "socialplanner", "visualmarketing"],
        toneTag: "Friendly",
        platform: "instagram"
      }
    ]
  }
];

// Lightweight Typewriter Reveal Component
function TypewriterText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIdx = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="text-xs font-serif leading-relaxed text-[#042F1A] whitespace-pre-wrap">{displayedText}</p>;
}

interface AiCaptionAssistantProps {
  isOverlay?: boolean;
  onClose?: () => void;
  onUseCaption: (caption: string) => void;
}

export default function AiCaptionAssistant({ 
  isOverlay = false, 
  onClose, 
  onUseCaption 
}: AiCaptionAssistantProps) {
  
  // Workspace States
  const [promptInput, setPromptInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [selectedTone, setSelectedTone] = useState("Witty");
  const [audienceInput, setAudienceInput] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  
  // Loading & Loading Copy States
  const [isGenerating, setIsGenerating] = useState(false);
  const [rotatingPhrase, setRotatingPhrase] = useState("Calibrating tone structures...");
  const phraseIndexRef = useRef(0);
  
  // Results & History
  const [generatedResults, setGeneratedResults] = useState<Array<{
    text: string;
    hashtags: string[];
    toneTag: string;
    platform: string;
  }> | null>(null);
  
  const [historyList, setHistoryList] = useState<PastGeneration[]>(INITIAL_HISTORY);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  
  // Copy indicators
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  
  // Refinement bar
  const [refinementInput, setRefinementInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  // Rotate loading text
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const phrases = [
      "Reading your campaign brief...",
      "Calibrating creator tone vectors...",
      "Polishing visual content hooks...",
      "Generating platform-specific variations...",
      "Weaving organic hashtags...",
      "Refining word metrics and line split aesthetics..."
    ];
    
    if (isGenerating) {
      timer = setInterval(() => {
        phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
        setRotatingPhrase(phrases[phraseIndexRef.current]);
      }, 1500);
    } else {
      phraseIndexRef.current = 0;
      setRotatingPhrase(phrases[0]);
    }
    
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Mock upload selector image
  const handleMockImageUpload = () => {
    const images = [
      "https://picsum.photos/seed/desk/300/300",
      "https://picsum.photos/seed/organic/300/300",
      "https://picsum.photos/seed/packaging/300/300",
      "https://picsum.photos/seed/workspace/300/300"
    ];
    const picked = images[Math.floor(Math.random() * images.length)];
    setImageFileUrl(picked);
    confetti({ particleCount: 15, spread: 20 });
  };

  // Perform Generation (real API call with mock fallback built-in)
  const handleGenerate = async (e?: React.FormEvent, isMoreVariants = false, refineText = "") => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setGeneratedResults(null);
    
    try {
      const response = await fetch("/api/gemini/generate-caption-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          platforms: selectedPlatforms,
          tone: selectedTone,
          audience: audienceInput,
          hasImage: !!imageFileUrl,
          refinement: refineText
        })
      });
      
      const data = await response.json();
      
      if (data.variants && data.variants.length > 0) {
        let resultsToSet = data.variants;
        
        // If loading "more variants", we can append or replace
        if (isMoreVariants && generatedResults) {
          resultsToSet = [...generatedResults, ...data.variants].slice(-6); // Cap at 6
        }
        
        setGeneratedResults(resultsToSet);

        // Save to past generations history
        const newHistEntry: PastGeneration = {
          id: `hist-${Date.now()}`,
          topic: promptInput.length > 40 ? `${promptInput.substring(0, 40)}...` : promptInput,
          timestamp: "Just now",
          tone: selectedTone,
          variants: data.variants
        };
        setHistoryList(p => [newHistEntry, ...p]);
        confetti({ particleCount: 40, spread: 60 });
      } else {
        alert("Generations completed silently. Try adjusting parameters.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regeneration of a single variant index
  const handleRegenerateSingleVariant = async (idx: number) => {
    if (!generatedResults) return;
    const targetVariant = generatedResults[idx];
    
    // Play transient shimmer animation
    const updated = [...generatedResults];
    updated[idx] = {
      ...targetVariant,
      text: "Refreshing copywriting insights from Postrick AI...",
      hashtags: [],
    };
    setGeneratedResults(updated);
    
    try {
      const response = await fetch("/api/gemini/generate-caption-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput || "Creative refresh campaign placeholder",
          platforms: [targetVariant.platform],
          tone: selectedTone,
          audience: audienceInput,
          hasImage: !!imageFileUrl,
          refinement: "Make this version distinctly fresh and highlight a different angle of the content"
        })
      });
      const data = await response.json();
      if (data.variants && data.variants.length > 0) {
        const fresh = [...generatedResults];
        fresh[idx] = data.variants[0];
        setGeneratedResults(fresh);
        confetti({ particleCount: 15, spread: 20 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle refinement submissions
  const handleRefineSubmit = async (text: string) => {
    if (!text.trim()) return;
    setIsRefining(true);
    setRefinementInput("");
    await handleGenerate(undefined, false, text);
    setIsRefining(false);
  };

  // Helper copy functions
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashtag(hash);
    setTimeout(() => setCopiedHashtag(null), 1500);
  };

  const handleCopyAll = (text: string, hashes: string[], idx: number) => {
    const fullCaption = `${text}\n\n${hashes.join(" ")}`;
    navigator.clipboard.writeText(fullCaption);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Use This Action (primary click) 
  const handleUseThis = (text: string, hashes: string[]) => {
    const payload = `${text}\n\n${hashes.map(h => h.startsWith("#") ? h : `#${h}`).join(" ")}`;
    onUseCaption(payload);
    confetti({ particleCount: 25, spread: 30 });
    
    if (isOverlay && onClose) {
      onClose();
    }
  };

  // Filtering histories
  const filteredHistories = historyList.filter(item => 
    item.topic.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    item.tone.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  // Platform chips configuration
  const platformChips = [
    { id: "instagram", name: "Instagram", hex: "#E1306C" },
    { id: "tiktok", name: "TikTok", hex: "#000000" },
    { id: "linkedin", name: "LinkedIn", hex: "#0077B5" },
    { id: "facebook", name: "Facebook", hex: "#3b5998" },
    { id: "youtube", name: "YouTube", hex: "#FF0000" },
    { id: "pinterest", name: "Pinterest", hex: "#BD081C" }
  ];

  // Tone options mapping with icons
  const toneOptions = [
    { id: "Witty", name: "Witty", desc: "Clever & light", icon: <Smile className="w-3.5 h-3.5" /> },
    { id: "Professional", name: "Professional", desc: "SLA executive", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "Bold", name: "Bold", desc: "Radical & direct", icon: <Flame className="w-3.5 h-3.5" /> },
    { id: "Friendly", name: "Friendly", desc: "Warm & open", icon: <Heart className="w-3.5 h-3.5" /> },
    { id: "Minimal", name: "Minimal", desc: "Quiet flow", icon: <Feather className="w-3.5 h-3.5" /> },
    { id: "Persuasive", name: "Persuasive", desc: "Closes sales", icon: <Award className="w-3.5 h-3.5" /> }
  ];

  const quickAudienceChips = ["Gen Z", "B2B Decision Makers", "Local Customers", "Tech Enthusiasts", "Eco Creators"];

  // Toggle platform selection (multi-select)
  const handleTogglePlatform = (pltId: string) => {
    if (selectedPlatforms.includes(pltId)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(p => p.filter(x => x !== pltId));
      }
    } else {
      setSelectedPlatforms(p => [...p, pltId]);
    }
  };

  // Overlay vs Standalone styles
  const containerClasses = isOverlay
    ? "h-full flex flex-col bg-[#FAF5EB] border-l border-[#eae3d2] overflow-y-auto text-left"
    : "max-w-4xl mx-auto space-y-8 py-4 px-2 lg:px-6 text-left";

  return (
    <div className={containerClasses}>
      
      {/* SECTION 1 — HEADER */}
      <div className="flex items-center justify-between border-b pb-4 border-[#eae3d2] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-black text-[#042F1A] tracking-tight">
              AI Caption Assistant
            </h1>
            <span className="bg-[#117644]/10 text-[#117644] text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full select-none flex items-center gap-1 border border-[#117644]/20">
              <Sparkles className="w-2.5 h-2.5 antialiased text-amber-500" />
              Powered by Postrick AI
            </span>
          </div>
          <p className="text-[11px] text-[#042F1A]/60 font-medium">
            Generate platform-tailored publishing copies in seconds
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* History triggering button */}
          <button
            onClick={() => setIsHistoryPanelOpen(true)}
            title="Open Historical Generations"
            className="p-2 border border-[#eae3d2] hover:border-[#141511] bg-white text-[#042F1A] rounded-full hover:bg-neutral-50 active:scale-95 transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <History className="w-4 h-4 text-[#117644]" />
            <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-wider">History</span>
          </button>
          
          {isOverlay && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-200/50 rounded-full transition-colors font-bold text-xs"
            >
              <X className="w-4.5 h-4.5 text-[#042F1A]" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="space-y-6 pt-4">

        {/* SECTION 2 — INPUT & CONFIGURATION CARD */}
        <form onSubmit={(e) => handleGenerate(e)} className="bg-white border-2 border-[#eae3d2] rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-widest block">
              1. Content &amp; campaign context brief
            </label>
            <div className="relative">
              <textarea
                required
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="What's this post about? Write a general idea, campaign goal, or paste a draft to refine..."
                maxLength={450}
                className="w-full text-xs p-4 rounded-2xl border-2 border-neutral-100 bg-neutral-50/20 focus:bg-white focus:border-[#117644] focus:outline-none font-semibold min-h-[105px] text-[#042F1A] leading-relaxed transition-all placeholder-neutral-400"
              />
              <div className="absolute bottom-3 right-3 text-[8.5px] font-mono text-neutral-400 font-bold uppercase select-none">
                {promptInput.length}/450
              </div>
            </div>
          </div>

          {/* IMAGE UPLOADING THUMBNAIL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono font-black text-[#117644] uppercase tracking-widest">
                2. Optical Visual Context (Optional)
              </span>
              {!imageFileUrl && (
                <button
                  type="button"
                  onClick={handleMockImageUpload}
                  className="text-[9px] uppercase tracking-wider font-extrabold text-[#117644] bg-[#117644]/5 border border-[#117644]/20 px-2 py-1 rounded-lg hover:bg-[#117644]/15 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Select Upload
                </button>
              )}
            </div>

            {imageFileUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3.5 bg-[#FAF5EB] border border-[#117644]/30 rounded-2xl p-2.5 relative pr-10"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border bg-white relative flex-shrink-0">
                  <img src={imageFileUrl} alt="Visual Brief Input" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="text-left font-sans">
                  <span className="text-[10px] font-bold text-[#117644] flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    AI Analysis Connected
                  </span>
                  <p className="text-[8.5px] text-neutral-500 font-mono uppercase mt-0.5">Caption matches image layout</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageFileUrl(null)}
                  className="absolute right-2.5 p-1 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-full border border-neutral-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <div 
                onClick={handleMockImageUpload}
                className="border-2 border-dashed border-neutral-200 hover:border-[#117644]/40 bg-neutral-50/30 rounded-2xl p-4.5 text-center cursor-pointer transition-all space-y-1 group"
              >
                <ImageIcon className="w-6 h-6 mx-auto text-neutral-300 group-hover:text-[#117644]/80 transition-colors" />
                <p className="text-[9.5px] font-bold text-neutral-400 group-hover:text-[#042F1A] transition-colors">Drag graphic here or tap to select image context</p>
                <p className="text-[8px] font-mono text-neutral-300 uppercase">Tells AI to &ldquo;look at&rdquo; visual content style</p>
              </div>
            )}
          </div>

          {/* CHANNELS ROW */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono font-black text-[#117644] uppercase tracking-widest block">
              3. Target dispatch Channels (Multi-Select)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {platformChips.map((plt) => {
                const isSelected = selectedPlatforms.includes(plt.id);
                return (
                  <motion.button
                    type="button"
                    key={plt.id}
                    onClick={() => handleTogglePlatform(plt.id)}
                    whileTap={{ scale: 0.94 }}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-bold tracking-tight ${
                      isSelected 
                        ? "bg-[#042F1A] text-[#FAF6EE] border-transparent shadow-xs" 
                        : "bg-white text-neutral-600 hover:text-[#042F1A] border-[#eae3d2] hover:bg-neutral-50"
                    }`}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: plt.hex }} 
                    />
                    {plt.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* TONE ROW */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono font-black text-[#117644] uppercase tracking-widest block">
              4. Writing Persona Style (Single-Select)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {toneOptions.map((tone) => {
                const isSelected = selectedTone === tone.id;
                return (
                  <motion.button
                    type="button"
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-18 space-y-1.5 relative overflow-hidden group ${
                      isSelected 
                        ? "bg-[#042F1A] text-white border-transparent shadow-sm" 
                        : "bg-white border-[#eae3d2] text-neutral-500 hover:bg-neutral-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`p-1 rounded-lg ${isSelected ? "bg-[#117644] text-white" : "bg-neutral-100 text-neutral-600"} transition-colors`}>
                        {tone.icon}
                      </span>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5E729]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider">{tone.name}</h4>
                      <p className={`text-[8.5px] font-medium leading-none ${isSelected ? "text-neutral-300" : "text-neutral-400 group-hover:text-neutral-500"}`}>{tone.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* AUDIENCE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5 text-left">
              <span className="text-[9.5px] font-mono font-black text-[#117644] uppercase tracking-widest block">
                5. Audience Alignment Segment (Optional)
              </span>
              <input
                type="text"
                value={audienceInput}
                onChange={e => setAudienceInput(e.target.value)}
                placeholder="E.g., Gen Z, B2B Decision Makers, Local Customers..."
                className="w-full text-xs p-3 rounded-xl border border-[#eae3d2] focus:border-[#117644] focus:outline-none font-semibold text-[#042F1A]"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Audience Quick-suggestions
              </span>
              <div className="flex flex-wrap gap-1">
                {quickAudienceChips.map(rec => (
                  <button
                    type="button"
                    key={rec}
                    onClick={() => setAudienceInput(rec)}
                    className="px-2 py-1 bg-neutral-150 border rounded-lg hover:border-[#117644]/55 text-[8.5px] font-black uppercase text-neutral-500 hover:text-black cursor-pointer transition-all"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GENERATE PRIMARY BUTTON WITH GRADIENT LOADING SWEEP */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isGenerating || !promptInput.trim()}
              whileHover={{ scale: 1.008 }}
              whileTap={{ scale: 0.995 }}
              className={`w-full py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-md group ${
                isGenerating 
                  ? "bg-stone-900 text-stone-100 border border-stone-800" 
                  : "bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] cursor-pointer"
              }`}
            >
              {isGenerating ? (
                <div className="space-y-1 text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center z-10 relative">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                    <span className="font-serif tracking-widest text-xs italic text-white animate-pulse">Running AI Intelligence Engines...</span>
                  </div>
                  <p className="text-[9px] font-mono font-black text-[#C5E729] uppercase tracking-widest z-10 relative">
                    {rotatingPhrase}
                  </p>
                  
                  {/* Premium animated gradient sweep background */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent z-0 pointer-events-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 z-10">
                  <Sparkles className="w-4.5 h-4.5 text-[#C5E729]" />
                  <span>Draft Caption Variants Landscape</span>
                </div>
              )}
            </motion.button>
          </div>
        </form>

        {/* SECTION 3 — GENERATED RESULTS SECTION */}
        <AnimatePresence>
          {generatedResults && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center justify-between border-dashed border-b pb-3 mb-1">
                <div>
                  <span className="text-[9px] font-mono uppercase font-black text-[#117644] tracking-widest block">
                    Fresh digital outputs
                  </span>
                  <h3 className="font-serif font-black text-[#042F1A] text-sm mt-0.5">
                    Tailored Content Variant Grid
                  </h3>
                </div>
                <span className="text-[9px] font-mono font-black text-neutral-400 bg-neutral-100 rounded-md px-2.5 py-1 uppercase">
                  {generatedResults.length} iterations generated
                </span>
              </div>

              {/* Variant Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {generatedResults.map((variant, ind) => {
                  return (
                    <motion.div
                      key={`${variant.platform}-${ind}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: ind * 0.12 }}
                      className="bg-[#FAF5EB]/50 border-2 border-[#eae3d2] hover:border-[#117644] focus-within:border-[#117644] rounded-3xl p-4 flex flex-col justify-between transition-all shadow-3xs hover:bg-white group"
                    >
                      {/* Variant Card Top */}
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#042F1A] text-white p-1.5 rounded-lg inline-flex items-center justify-center">
                            <RenderPlatformIcon platform={variant.platform} className="w-3.5 h-3.5 text-white" />
                          </span>
                          <span className="text-[8.5px] uppercase font-mono font-black text-[#117644] bg-[#117644]/5 tracking-widest px-2.5 py-0.5 rounded-full border border-[#117644]/25">
                            {variant.toneTag}
                          </span>
                        </div>

                        {/* Content Body with typewriter reveal */}
                        <div className="min-h-[145px] pt-1">
                          <TypewriterText text={variant.text} speed={1} />
                        </div>

                        {/* Hashtag list */}
                        {variant.hashtags && variant.hashtags.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[8px] uppercase tracking-widest font-mono text-neutral-400 font-extrabold block mb-1.5">Hashtags:</span>
                            <div className="flex flex-wrap gap-1">
                              {variant.hashtags.map((hash) => {
                                const cleanHashtag = hash.startsWith("#") ? hash : `#${hash}`;
                                const isHashtagCopied = copiedHashtag === cleanHashtag;
                                return (
                                  <button
                                    type="button"
                                    key={hash}
                                    onClick={() => handleCopyHash(cleanHashtag)}
                                    title="Copy Hashtag Only"
                                    className={`px-2 py-1 rounded-xl font-mono text-[9px] border transition-all cursor-pointer select-all flex items-center gap-1 ${
                                      isHashtagCopied 
                                        ? "bg-emerald-600 text-white border-transparent" 
                                        : "bg-white text-neutral-500 hover:text-black border-neutral-200"
                                    }`}
                                  >
                                    <span>{cleanHashtag}</span>
                                    {isHashtagCopied && <Check className="w-2.5 h-2.5" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Row */}
                      <div className="border-t border-dashed border-neutral-200 pt-3.5 mt-4 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyAll(variant.text, variant.hashtags, ind)}
                          className="p-2 aspect-square rounded-full border border-[#eae3d2] text-neutral-500 hover:text-[#042F1A] hover:bg-[#FAF6EE] flex items-center justify-center transition-all cursor-pointer relative"
                          title="Copy Full Caption + Hashtags"
                        >
                          {copiedIndex === ind ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedIndex === ind && (
                            <span className="absolute bottom-full mb-1 bg-[#042F1A] text-white text-[7px] py-0.5 px-1 rounded uppercase font-sans font-bold z-30">Copied!</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRegenerateSingleVariant(ind)}
                          className="p-2 aspect-square rounded-full border border-[#eae3d2] text-neutral-500 hover:text-[#042F1A] hover:bg-[#FAF6EE] flex items-center justify-center transition-all cursor-pointer"
                          title="Regenerate this single Variant"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUseThis(variant.text, variant.hashtags)}
                          className="flex-1 py-2 bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-all cursor-pointer select-none"
                        >
                          Use This
                          <ChevronRight className="w-3 h-3 text-[#C5E729]" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Generate More variants Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate(undefined, true)}
                  className="px-6 py-2.5 bg-[#FAF6EE] border border-[#117644]/40 hover:border-[#117644] text-[#117644] hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5E729]" />
                  Generate 3 More Variants
                </button>
              </div>

              {/* SECTION 4 — PERSISTENT REFINE BOTTOM BAR */}
              <div className="bg-[#FAF5EB] border-t-2 border-[#117644] rounded-3xl p-4.5 space-y-3 mt-8 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-[9px] font-mono font-black uppercase text-[#117644] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Quick Variants Refiners
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { l: "Shorter", v: "Make all variants significantly shorter and snappier" },
                      { l: "Longer", v: "Make all variants longer and add more engaging background context" },
                      { l: "More Casual", v: "Make the tone much more casual, humorous, and approachable" },
                      { l: "Add Emoji", v: "Infuse more organic, relevant emojis throughout the text" },
                      { l: "Remove Hashtags", v: "Strip out the hashtags entirely from the variant list" }
                    ].map((refChip) => (
                      <button
                        type="button"
                        key={refChip.l}
                        onClick={() => handleRefineSubmit(refChip.v)}
                        className="px-2.5 py-1 border border-[#eae3d2] bg-white text-stone-600 hover:text-black hover:border-black rounded-lg text-[8px] font-bold uppercase transition-all select-none cursor-pointer"
                      >
                        {refChip.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={refinementInput}
                    onChange={e => setRefinementInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRefineSubmit(refinementInput)}
                    placeholder="Refinement query: 'make it shorter', 'add more emojis', 'more formal'..."
                    className="flex-1 bg-white border border-[#eae3d2] text-xs px-3.5 py-2.5 rounded-xl font-semibold text-[#042F1A] focus:outline-[#117644] tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => handleRefineSubmit(refinementInput)}
                    className="p-2.5 bg-[#042F1A] hover:bg-[#117644] rounded-xl text-[#C5E729] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <CornerDownLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SEARCHABLE HISTORY SLIDE PANEL DRAWER OVERLAY */}
      <AnimatePresence>
        {isHistoryPanelOpen && (
          <div className="fixed inset-0 z-[10000] flex justify-end">
            {/* Backdrop click dismiss */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryPanelOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-3xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 210 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 text-left border-l border-[#eae3d2]"
            >
              {/* History Header */}
              <div className="flex items-center justify-between border-b pb-4.5 border-[#eae3d2]">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#117644]" />
                  <span className="font-serif font-black text-xs uppercase tracking-wider text-[#042F1A]">Creative Generation History</span>
                </div>
                <button
                  onClick={() => setIsHistoryPanelOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#042F1A]" />
                </button>
              </div>

              {/* History Filter input */}
              <div className="my-4 relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={e => setHistorySearchQuery(e.target.value)}
                  placeholder="Search previous triggers, topics, tones..."
                  className="w-full pl-9 pr-3 py-2 border rounded-xl bg-neutral-50/50 text-xs focus:outline-[#117644] font-medium"
                />
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                {filteredHistories.length > 0 ? (
                  filteredHistories.map((item) => (
                    <div 
                      key={item.id}
                      className="border border-[#eae3d2] bg-[#FAF5EB]/35 p-3.5 rounded-2xl space-y-2.5 text-xs hover:border-[#117644]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-serif font-black text-[#042F1A] line-clamp-1 italic">&ldquo;{item.topic}&rdquo;</p>
                          <span className="text-[8px] font-mono text-neutral-400 font-black uppercase mt-0.5 block">{item.timestamp} &middot; Tone: {item.tone}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Delete this historical record?")) {
                              setHistoryList(p => p.filter(x => x.id !== item.id));
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display variants in small snippet */}
                      <div className="space-y-1.5 border-t pt-2 border-dashed">
                        {item.variants.map((v, sIdx) => (
                          <div 
                            key={sIdx}
                            className="bg-white border rounded-xl p-2.5 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[8px] font-mono">
                              <span className="bg-[#117644]/10 text-[#117644] uppercase tracking-wider font-extrabold px-1 rounded inline-flex items-center gap-0.5">
                                <RenderPlatformIcon platform={v.platform} className="w-2 h-2" />
                                {v.platform}
                              </span>
                              <span className="text-neutral-400">{v.toneTag}</span>
                            </div>
                            <p className="text-[10px] text-stone-600 line-clamp-2 leading-relaxed font-serif">{v.text}</p>
                            
                            <button
                              onClick={() => {
                                setPromptInput(item.topic);
                                setSelectedTone(item.tone);
                                setGeneratedResults(item.variants);
                                setIsHistoryPanelOpen(false);
                                confetti({ particleCount: 15 });
                              }}
                              className="text-[8px] uppercase tracking-wider font-extrabold text-[#117644] hover:underline pt-1 block"
                            >
                              Load this generation set &rarr;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-neutral-400 text-xs font-bold font-serif italic">
                    No matching creative entries found.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
