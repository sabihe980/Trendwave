"use client";

import { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Calendar, 
  BarChart3, 
  Zap, 
  Award, 
  Globe, 
  Plus, 
  MessageSquare, 
  Send, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Menu, 
  X, 
  ChevronDown, 
  CheckCircle2,
  DollarSign
} from "lucide-react";
import confetti from "canvas-confetti";
import { PostrickLogo } from "./icons";

interface LandingPageProps {
  onEnterApp: () => void;
  isDarkMode: boolean;
}

// Custom SVG Brand Icons to guarantee stable compile and bypass webpack issues
function Youtube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function Facebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

// Custom Pinterest Icon Components because Lucide doesn't have it
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.43.21-.92 1.35-5.74 1.35-5.74s-.35-.69-.35-1.72c0-1.61.93-2.81 2.09-2.81 1 0 1.47.74 1.47 1.63 0 1-.63 2.49-.96 3.88-.27 1.15.57 2.09 1.7 2.09 2.04 0 3.61-2.15 3.61-5.26 0-2.75-1.98-4.67-4.8-4.67-3.27 0-5.19 2.44-5.19 4.97 0 .99.38 2.05.85 2.62.1.11.11.2.08.31l-.32 1.31c-.05.21-.17.26-.39.16-1.44-.67-2.34-2.77-2.34-4.45 0-3.63 2.64-6.96 7.6-6.96 4 0 7.1 2.85 7.1 6.65 0 3.97-2.51 7.17-5.99 7.17-1.17 0-2.27-.61-2.65-1.33l-.72 2.74c-.26 1-1 2.25-1.49 3.05C10.74 23.82 11.36 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  );
}

// Custom TikTok Icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.1-.43 6.3 6.3 0 0 0-5.25 5 6.31 6.31 0 0 0 5.25 7.55 6.32 6.32 0 0 0 7.29-4.79 6.38 6.38 0 0 0 .11-1V8.56A7.07 7.07 0 0 0 19.59 11V6.69z"/>
    </svg>
  );
}

function FeatureSimulation({ id, isDarkMode }: { id: string; isDarkMode: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  if (id === "feat-1") {
    const texts = [
      "Type prompt: Write a product announcement...",
      "Drafting: 🚀 Just launched our brand new creator toolkit! Maximize productivity in seconds...",
      "Polishing keywords and hashtag recommendations...",
      "Completed! 🌟 Ready to broadcast."
    ];
    return (
      <div className={`mt-4 p-4 rounded-2xl border font-mono text-[11px] leading-relaxed transition-all shadow-sm font-semibold ${
        isDarkMode ? "bg-[#02180c] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF5EB] border-[#b0a487] text-[#042F1A]"
      }`}>
        <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
          <span className="font-bold text-[#117644]">AI WRITER CLIP: AUTO-PLAYING</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] animate-ping" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#117644] font-bold">❯</span>
            <span className={step === 0 ? "font-bold text-[#117644]" : isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}>{texts[0]}</span>
          </div>
          <div className={`pl-3 border-l-2 transition-all duration-300 ${
            step >= 1 ? `border-[#117644] ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}` : "border-transparent opacity-25"
          }`}>
            {step >= 1 ? texts[1] : "..."}
          </div>
          <div className={`pl-3 text-[10px] transition-all duration-300 ${
            step >= 2 ? "text-[#117644] font-black" : "opacity-0"
          }`}>
            💡 Keywords matched: [launch, creator, direct]
          </div>
          <div className={`pt-1 text-right text-[9px] transition-all ${step === 3 ? "text-[#117644] font-bold" : `opacity-45 ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]"}`}`}>
            {step === 3 ? "✓ Loop restarted" : "Generating optimal draft..."}
          </div>
        </div>
      </div>
    );
  }

  if (id === "feat-2") {
    const platforms = [
      { name: "YouTube", pct: [0, 45, 100, 100] },
      { name: "Facebook", pct: [0, 20, 80, 100] },
      { name: "Instagram", pct: [0, 30, 90, 100] },
      { name: "TikTok", pct: [0, 10, 60, 100] },
      { name: "LinkedIn", pct: [0, 40, 100, 100] }
    ];
    return (
      <div className={`mt-4 p-4 rounded-2xl border font-mono text-[11px] leading-relaxed transition-all shadow-sm font-semibold ${
        isDarkMode ? "bg-[#02180c] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF5EB] border-[#b0a487] text-[#042F1A]"
      }`}>
        <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
          <span className="font-bold text-[#117644]">SYNC SCHEDULER: MULTI-DISPATCH LOOP</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] animate-ping" />
        </div>
        <div className="space-y-2">
          {platforms.map((p) => {
            const progress = p.pct[step];
            return (
              <div key={p.name} className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className={`font-bold ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}>{p.name} Router</span>
                  <span className={progress === 100 ? "text-[#117644] font-bold animate-pulse" : `${isDarkMode ? "text-[#FAF6EE]" : "text-[#02180c]"} font-black`}>
                    {progress === 100 ? "✓ Synchronized" : `Uploading ${progress}%`}
                  </span>
                </div>
                <div className={`w-full h-2 rounded overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-[#b0a487]/40"}`}>
                  <div 
                    className={`h-full transition-all duration-500 ${isDarkMode ? "bg-[#C5E729]" : "bg-[#117644]"}`} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (id === "feat-3") {
    const days = ["Mon", "Tue", "Wed", "Thu"];
    const posts = [
      "Image Post #1 (12:00 PM)",
      "Video Clip #2 (3:30 PM)",
      "Story Sync #3 (5:00 PM)",
      "Marketing Blast #4 (8:00 PM)"
    ];
    return (
      <div className={`mt-4 p-4 rounded-2xl border font-mono text-[11px] leading-relaxed transition-all shadow-sm font-semibold ${
        isDarkMode ? "bg-[#02180c] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF5EB] border-[#b0a487] text-[#042F1A]"
      }`}>
        <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
          <span className="font-bold text-[#117644]">CALENDAR PREVIEW GRID</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] animate-ping" />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {days.map((day, idx) => {
            const active = idx === step;
            return (
              <div 
                key={day} 
                className={`p-1.5 rounded-xl border text-center transition-all ${
                  active 
                    ? "bg-[#117644]/10 border-[#117644] text-[#117644] scale-[1.04] font-black" 
                    : `bg-[#042F1A]/5 border-transparent font-bold ${isDarkMode ? "text-neutral-300 bg-white/5" : "text-[#042F1A]"}`
                }`}
              >
                <div className="text-[9px] font-bold underline">{day}</div>
                <div className="text-[8px] truncate mt-1">
                  {posts[idx]}
                </div>
                <div className={`text-[7px] mt-0.5 font-black ${active ? "animate-pulse text-[#117644]" : isDarkMode ? "text-neutral-400" : "text-[#042F1A]/75"}`}>
                  {active ? "● DISPATCH" : "Queued"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (id === "feat-4") {
    const valueMap = [
      [30, 45, 90, 40],
      [40, 80, 50, 60],
      [50, 95, 30, 80],
      [90, 30, 70, 95]
    ];
    const hours = ["Mon", "Tue", "Wed", "Thu"];
    return (
      <div className={`mt-4 p-4 rounded-2xl border font-mono text-[11px] leading-relaxed transition-all shadow-sm font-semibold ${
        isDarkMode ? "bg-[#02180c] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF5EB] border-[#b0a487] text-[#042F1A]"
      }`}>
        <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
          <span className="font-bold text-[#117644]">OPTIMAL ENGAGEMENT FLOWS</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] animate-ping" />
        </div>
        <div className="space-y-2">
          <div className={`flex font-bold justify-between items-end h-16 pt-2 border-b ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
            {hours.map((hour, hIdx) => {
              const currentVal = valueMap[step][hIdx];
              return (
                <div key={hour} className="flex flex-col items-center w-full">
                  <div 
                    className={`w-4 rounded-t transition-all duration-700 ${isDarkMode ? "bg-[#C5E729]" : "bg-[#117644]"}`} 
                    style={{ height: `${currentVal}%` }} 
                  />
                  <span className={`text-[7px] mt-1 font-bold ${isDarkMode ? "text-[#FAF6EE]" : "text-[#042F1A]"}`}>{hour}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[9px] flex justify-between">
            <span className="text-[#117644] font-bold">Peak Engagement Active 🔥</span>
            <span className={`font-extrabold ${isDarkMode ? "text-white" : "text-[#042F1A]"}`}>Yield: +210% Reach</span>
          </div>
        </div>
      </div>
    );
  }

  const prompts = [
    'A minimalist organic tech device mockup, high-end studio lighting',
    'Generating with Postrick Image Engine...',
    'Rendering creative design layers...',
    'Creative draft image generated (1200ms)!'
  ];
  return (
    <div className={`mt-4 p-4 rounded-2xl border font-mono text-[11px] leading-relaxed transition-all shadow-sm font-semibold animate-none ${
      isDarkMode ? "bg-[#02180c] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF5EB] border-[#b0a487] text-[#042F1A]"
    }`}>
      <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDarkMode ? "border-white/10" : "border-[#042F1A]/10"}`}>
        <span className="font-bold text-[#117644]">AI IMAGE GENERATOR SIMULATOR</span>
        <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] animate-ping" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[#117644] font-bold">❯</span>
          <span className={step <= 1 ? `${isDarkMode ? "text-white" : "text-[#02180c]"} font-black` : "text-[#117644] font-black"}>
            {step === 0 ? prompts[0] : step === 1 ? prompts[1] : step === 2 ? prompts[2] : prompts[3]}
          </span>
        </div>
        <div className={`flex justify-center items-center h-24 rounded-xl border relative overflow-hidden transition-all duration-500 ${
          step >= 2 
            ? "bg-transparent border-[#117644]" 
            : isDarkMode ? "bg-[#031d10] border-[#115e34]" : "bg-[#FAF5EB] border-[#b0a487]"
        }`}>
          {step <= 1 ? (
            <div className={`flex items-center gap-2 text-[10px] font-black ${isDarkMode ? "text-[#FAF6EE]" : "text-[#02180c]"}`}>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#117644]" />
              <span>Synthesizing creative vectors...</span>
            </div>
          ) : (
            <img 
              src="/forest_stream_flowers.jpg"
              alt="Generated Creative Content"
              className="w-full h-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ChatbotBox({ isDarkMode }: { isDarkMode: boolean }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I am the Postrick Assistant helper. Ask me anything about our Lifetime / Forever Free tier, or how we can get started!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const userMsg = inputVal.trim();
    setInputVal("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsSending(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })).slice(-6)
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.text || "Thank you for getting in touch! Let's explore how we can grow together." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "I received your message! For further discussion keep in touch via our priority creators dashboard." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="faq-chatbot" className={`rounded-xl border shadow-xl overflow-hidden text-left relative z-10 max-w-lg mx-auto ${
      isDarkMode ? "bg-neutral-950 border-neutral-900" : "bg-white border-neutral-200"
    }`}>
      {/* Bot Header */}
      <div className="p-3.5 border-b border-neutral-900/10 dark:border-neutral-900/60 flex items-center justify-between bg-neutral-900 text-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase font-bold">TREND_BOT // LIVE DIRECT ANSWERS</span>
        </div>
        <span className="text-[9px] font-mono opacity-50">FAST SMART AI</span>
      </div>

      {/* Messages View */}
      <div className="p-4 h-64 overflow-y-auto space-y-3.5 scrollbar-thin">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
              m.role === "user" 
                ? "bg-black text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold rounded-tr-none" 
                : isDarkMode 
                  ? "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-800" 
                  : "bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              isDarkMode ? "bg-neutral-900 text-neutral-400" : "bg-neutral-100 text-neutral-600"
            }`}>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Thinking of the best response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Send Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-900/10 dark:border-neutral-900/60 flex items-center gap-2">
        <input 
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Ask a question about Postrick..."
          className={`flex-1 text-xs px-3 py-2 rounded-lg focus:outline-none border ${
            isDarkMode 
              ? "bg-neutral-900 border-neutral-800 focus:border-neutral-700 text-white placeholder-neutral-500" 
              : "bg-neutral-50 border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder-neutral-400"
          }`}
        />
        <button 
          type="submit"
          className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default function LandingPage({ onEnterApp, isDarkMode }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isMobIntegrationsOpen, setIsMobIntegrationsOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
  const [activeTab, setActiveTab] = useState<"time" | "workflows" | "audience">("time");

  // State to track collapsible FAQ indices
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  
  // State to track floating help chatbot popover
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Interactive Comparison Tool States
  const [timeWasted, setTimeWasted] = useState(15); // hours per week
  const [stressScale, setStressScale] = useState(8); // out of 10
  const [comparisonResult, setComparisonResult] = useState<"calculated" | "idle">("calculated");

  const features = [
    {
      id: "feat-2",
      title: "Auto-Publish",
      desc: "Format your content once, preview across channels, and publish directly to YouTube, Facebook, Instagram, TikTok, Pinterest, and LinkedIn.",
      icon: <Share2 className="w-6 h-6" />,
      badge: "Instant Sync",
      image: "/auto_publish.jpg"
    },
    {
      id: "feat-3",
      title: "Content Calendar",
      desc: "A neat and beautiful dashboard to sequence, drag, drop, and organize your media drafts on a weekly grid structure.",
      icon: <Calendar className="w-6 h-6" />,
      badge: "Daily Planner",
      image: "/schedule_calendar.jpg"
    },
    {
      id: "feat-4",
      title: "Analytics Heatmap",
      desc: "Visualizes exactly when your followers are online. Schedules posts at peak times to reach maximum viewers naturally.",
      icon: <BarChart3 className="w-6 h-6" />,
      badge: "Traffic Peaks",
      image: "/analytics_desk_flatlay.jpg"
    },
    {
      id: "feat-1",
      title: "Smart Captions",
      desc: "Instant copywriting tailored to your tone, audience, and platform guidelines. Generates tags and hashtags automatically.",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "AI Assist",
      image: "/ai_caption.jpg"
    },
    {
      id: "feat-5",
      title: "AI Image Generator",
      desc: "Instantly prompt and generate spectacular custom graphic designs, illustrations, and banners calibrated perfectly for your social feeds.",
      icon: <Zap className="w-6 h-6" />,
      badge: "Creative Kit",
      image: "/forest_stream_flowers.jpg"
    }
  ];

  const pricingPlans = [
    {
      name: "Free Forever Plan",
      desc: "Instant access with zero risk constraints.",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Up to 2 Active Social Channels",
        "AI Writing Assistant",
        "Visual Queuing Calendar",
        "Lifetime / Forever Free Access",
        "No Credit Card Required"
      ],
      popular: false,
      trialLabel: "Lifetime Free"
    },
    {
      name: "Creator Starter",
      desc: "Ideal for solo creators looking to accelerate their active social campaigns.",
      monthlyPrice: 24,
      annualPrice: 19,
      features: [
        "Connect up to 6 Social Channels",
        "Unlimited AI Writing Assistants",
        "Tactile Content Scheduling Grid",
        "Comprehensive Social Heatmaps",
        "14-Day Free Trial - No risk setup"
      ],
      popular: false,
      trialLabel: "14-Day Free Trial"
    },
    {
      name: "Studio Pro",
      desc: "Perfect for growing brands and content creators craving absolute speed.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Connect up to 15 Social Channels",
        "Team Co-creation Workspaces",
        "Smart Campaign Bulk Queuing",
        "Deep Analytics Wave Integration",
        "14-Day Free Trial - No risk setup"
      ],
      popular: true,
      trialLabel: "14-Day Free Trial"
    },
    {
      name: "Enterprise Agency",
      desc: "Built for massive agencies orchestrating major brand narratives.",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        "Unlimited Social Channel Indexes",
        "Dedicated Team Organization Keys",
        "Real-time Enterprise Integrations",
        "24/7 Dedicated Support Agents",
        "14-Day Free Trial - No risk setup"
      ],
      popular: false,
      trialLabel: "14-Day Free Trial"
    }
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className={`font-sans antialiased overflow-x-hidden min-h-screen ${
      isDarkMode ? "bg-[#032011] text-[#FAF6EE]" : "bg-[#FAF6EE] text-[#052414]"
    }`}>
      
      {/* Header Navigation */}
      <header className={`sticky top-0 z-50 transition-all ${
        isDarkMode ? "bg-[#032011]/80 backdrop-blur-md border-b border-[#083e22]/50 shadow-sm" : "glass-nav"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <PostrickLogo className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" color={isDarkMode ? "#C5E729" : "#1E3216"} bgStrokeColor={isDarkMode ? "#032011" : "#FAF6EE"} />
              <span className={`font-serif font-black tracking-tight text-lg sm:text-2xl italic ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
                Postrick<span className="text-[10px] font-sans not-italic font-bold align-super">®</span>
              </span>
            </div>

            {/* Desktop Links */}
            <nav className={`hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}>
              <a href="/features" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Features</a>
              
              {/* Desktop Integrations Dropdown triggered strictly on tap/click */}
              <div 
                className="relative cursor-pointer pb-1 select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsIntegrationsOpen(!isIntegrationsOpen);
                }}
              >
                <button
                  type="button"
                  className="hover:text-[#117644] flex items-center gap-1 transition-colors border-b-2 border-transparent uppercase font-black text-xs tracking-widest focus:outline-none"
                >
                  Integrations <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isIntegrationsOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isIntegrationsOpen && (
                  <div className={`absolute top-[22px] left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl shadow-xl p-4 z-50 text-left normal-case tracking-normal border ${isDarkMode ? "bg-neutral-950 border-neutral-800 text-white" : "glass-modal"}`}>
                    <p className="text-[10px] font-mono font-extrabold text-[#117644] uppercase tracking-wider mb-2.5">
                      6 Connected Platforms
                    </p>
                    <div className={`grid grid-cols-2 gap-2 text-[11px] font-bold ${isDarkMode ? "text-neutral-100" : "text-[#042F1A]"}`}>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><TikTokIcon className="w-3.5 h-3.5 text-slate-800 dark:text-[#FAF6EE]" /> TikTok</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><PinterestIcon className="w-3.5 h-3.5 text-red-600" /> Pinterest</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn</div>
                    </div>
                  </div>
                )}
              </div>

              <a href="#reviews" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Reviews</a>
              <a href="#how-it-works" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">How It Works</a>
              <a href="#comparison" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Before &amp; After</a>
              <a href="#pricing" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Pricing</a>
              <a href="#faq" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">FAQ</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <motion.button 
                onClick={onEnterApp}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center py-2 px-4 sm:py-2.5 sm:px-5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-pointer border-2 border-current text-current bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all font-extrabold"
              >
                Log In
              </motion.button>
              <motion.button 
                onClick={onEnterApp}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#117644] transition-colors bg-[#042F1A] text-[#FAF6EE] shadow-md"
              >
                Get Started
              </motion.button>

              {/* Mobile Menu Icon */}
              <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-1.5 text-current opacity-80"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden font-bold text-xs ${
              isDarkMode ? "bg-[#032011] border-[#115e34]" : "bg-[#FAF6EE] border-[#b0a487]"
            }`}
          >
            <div className={`px-4 py-5 space-y-3.5 flex flex-col font-black uppercase tracking-widest ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}>
              <a href="/features" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Features</a>
              
              {/* Integrations option showing channels ONLY after being tapped (clicked) */}
              <div className="py-1 border-t border-b border-[#b0a487]/60 my-1 py-1.5">
                <button
                  type="button"
                  onClick={() => setIsMobIntegrationsOpen(!isMobIntegrationsOpen)}
                  className={`w-full flex items-center justify-between text-[11px] font-black tracking-widest hover:text-[#117644] text-left uppercase py-1.5 focus:outline-none cursor-pointer ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}
                >
                  <span className="flex items-center gap-1.5">
                    Integrations
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isMobIntegrationsOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobIntegrationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`grid grid-cols-2 gap-2 mt-2 px-1 text-[10px] font-bold tracking-normal normal-case ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}
                  >
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube</div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook</div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram</div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><TikTokIcon className="w-3.5 h-3.5 text-slate-800 dark:text-[#FAF6EE]" /> TikTok</div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><PinterestIcon className="w-3.5 h-3.5 text-red-600" /> Pinterest</div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FAF5EB]/50"><Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn</div>
                  </motion.div>
                )}
              </div>

              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Reviews</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">How It Works</a>
              <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Before &amp; After</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">FAQ</a>
              <button 
                onClick={() => { setMobileMenuOpen(false); onEnterApp(); }}
                className="w-full py-3 px-4 rounded-full uppercase tracking-wider text-xs font-black bg-[#042F1A] text-[#FAF6EE]"
              >
                Start free for lifetime - no credit card required
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE PLATFORMS VISUAL BAR */}
      <div className={`border-b py-3.5 font-mono text-[9px] tracking-widest relative z-20 overflow-hidden ${
        isDarkMode ? "bg-[#02180c] border-[#115e34]" : "bg-[#FAF5EB]/80 border-[#b0a487]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-3 text-center lg:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#117644] dark:bg-[#C5E729] animate-pulse" />
            <span className="uppercase font-black tracking-widest opacity-80">ACTIVE CHANNELS INTEGRATION:</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            {[
              { name: "YouTube", icon: <Youtube className="w-3.5 h-3.5 text-red-500" />, status: "99.9% LIVE" },
              { name: "Facebook", icon: <Facebook className="w-3.5 h-3.5 text-blue-600" />, status: "CERTIFIED" },
              { name: "Instagram", icon: <Instagram className="w-3.5 h-3.5 text-pink-500" />, status: "AUTO-SYNC" },
              { name: "TikTok", icon: <TikTokIcon className="w-3.5 h-3.5 text-slate-800 dark:text-white" />, status: "REELS ENGINES" },
              { name: "Pinterest", icon: <PinterestIcon className="w-3.5 h-3.5 text-red-600" />, status: "BOARDS EN" },
              { name: "LinkedIn", icon: <Linkedin className="w-3.5 h-3.5 text-blue-500" />, status: "OAUTH2 SECURE" },
            ].map((p, idx) => (
              <motion.div 
                key={p.name}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                whileHover={{ y: -1, scale: 1.05 }}
                className="flex items-center gap-1.5 cursor-pointer group"
                onClick={onEnterApp}
              >
                <span className="group-hover:rotate-12 transition-transform duration-300">{p.icon}</span>
                <span className={`font-extrabold opacity-90 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-white" : "text-[#052414]"}`}>
                  {p.name}
                </span>
                <span className="opacity-40 text-[7px] bg-emerald-500/10 px-1 py-0.5 rounded font-mono hidden md:inline">
                  {p.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-10">
          
          {/* Headline and editorial subtitle */}
          <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`space-x-2 inline-flex items-center px-4 py-1.5 rounded-full border text-[10px] font-mono tracking-widest uppercase font-bold ${
                isDarkMode ? "bg-[#042813] border-[#115e34] text-[#C5E729]" : "bg-white border-[#b0a487] text-[#042F1A] shadow-sm"
              }`}
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#117644] dark:bg-[#C5E729] animate-ping" />
              <span>THE GLOBAL STANDARD IN SOCIAL MEDIA DEPLOYMENT</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl md:text-7.5xl font-extrabold tracking-tight text-[#042F1A] dark:text-[#FAF6EE] leading-[1.08] max-w-4xl text-center"
            >
              The World&apos;s Leading <br/>
              <span className="font-serif italic font-medium text-[#117644] dark:text-[#C5E729] block mt-1.5">
                Social Multi-Publishing Tool
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-[17px] max-w-2xl leading-relaxed text-black dark:text-black font-extrabold px-2 mt-4"
            >
              Automate multi-platform scheduling based on customer behavior. Reach the right subscribers on YouTube, Instagram, Facebook, and TikTok with high-impact precision campaigns.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto px-4 sm:px-0"
            >
              <motion.button 
                onClick={onEnterApp}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-8 rounded-full font-extrabold text-xs uppercase tracking-widest cursor-pointer border-2 border-[#042F1A] text-[#042F1A] hover:bg-black/5 dark:hover:bg-white/5 dark:border-[#FAF6EE] dark:text-[#FAF6EE] transition-all bg-transparent w-full sm:w-auto text-center"
              >
                Log In
              </motion.button>
              <motion.button 
                onClick={onEnterApp}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-6 rounded-full font-bold text-xs uppercase tracking-widest cursor-pointer hover:opacity-95 shadow-xl transition-all flex items-center justify-center gap-2 bg-[#042F1A] text-[#FAF6EE] w-full sm:w-auto text-center"
              >
                <span>Start free for lifetime- no credit card required</span> <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Features Grid Area */}
      <section id="features" className={`py-28 border-t transition-colors relative ${
        isDarkMode ? "bg-[#02180a] border-[#115e34]" : "bg-[#FAF5EB]/50 border-[#b0a487]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-20">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">PRECISION CONTROLS</span>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>Everything you need to scale multiple pages</h2>
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Ditch the scattered tabs and chaotic notes. Restructure your social engine with standard industrial capabilities engineered for modern teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all group ${
                  isDarkMode 
                    ? "bg-[#031d10]/75 backdrop-blur-md border-[#115e34]/50 hover:bg-[#042514]/90 hover:border-[#115e34] shadow-xs" 
                    : "glass-card glass-card-hover"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`p-3 rounded-full inline-flex ${
                      isDarkMode ? "bg-[#FAF6EE]/5 text-[#C5E729]" : "bg-[#042F1A] text-[#FAF6EE]"
                    }`}>
                      {feat.icon}
                    </span>
                    <span className={`text-[9px] font-mono font-black tracking-widest px-3 py-1 rounded-full uppercase ${isDarkMode ? "bg-white/10 text-[#C5E729]" : "bg-[#042F1A]/10 text-[#042F1A]"}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>{feat.title}</h3>
                    <p className={`text-[13px] leading-relaxed font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/75"}`}>
                      {feat.desc}
                    </p>
                  </div>
                </div>

                {/* Eye catching appealing images */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-neutral-950/20 relative group-hover:scale-[1.01] transition-transform duration-300">
                  <img 
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-40 object-cover filter hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                {/* Micro simulator clip representing how each feature works */}
                <FeatureSimulation id={feat.id} isDarkMode={isDarkMode} />

                {/* Custom CTA Action Button mapped directly to user specs */}
                <div className="mt-5 pt-3 border-t border-[#b0a487]/50">
                  <button
                    onClick={() => {
                      triggerConfetti();
                      onEnterApp();
                    }}
                    className="w-full py-2.5 bg-[#042F1A] hover:bg-[#117644] text-white rounded-xl text-[11px] font-sans font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>
                      {feat.id === "feat-2" ? "start posting" :
                       feat.id === "feat-3" ? "start schedualing" :
                       feat.id === "feat-1" ? "get started" :
                       feat.id === "feat-4" ? "view analytics" :
                       feat.id === "feat-5" ? "start generating" : "get started"}
                    </span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className={`py-24 border-t transition-colors relative ${
        isDarkMode ? "bg-[#032011] border-[#115e34] text-[#FAF6EE]" : "bg-[#FAF6EE] border-[#b0a487] text-[#042F1A]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-20 animate-fadeIn">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">THE TREND PIPELINE</span>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 ${isDarkMode ? "text-white" : "text-[#042F1A]"}`}>How Postrick Works</h2>
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Scale your entire social media engine dynamically across multiple channels in four seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative lg:px-6">
            {/* Draw a subtle connector line between steps on large screens */}
            <div className={`hidden lg:block absolute top-[48px] left-[15%] right-[15%] h-[2px] z-0 ${isDarkMode ? "bg-[#C5E729]/30" : "bg-[#117644]/20"}`} />
            
            {[
              {
                num: "01",
                title: "Generate Content",
                desc: "Give Aura a brief. AI writes the caption and generates the visual.",
                filled: true
              },
              {
                num: "02",
                title: "Connect Accounts",
                desc: "Link all social profiles via OAuth in under 2 minutes. No passwords stored.",
                filled: false
              },
              {
                num: "03",
                title: "Schedule Posts",
                desc: "Pick a slot or let Aura suggest the optimal time per platform.",
                filled: false
              },
              {
                num: "04",
                title: "Track & Grow",
                desc: "Real-time dashboards show what's working. Export reports in one click.",
                filled: false
              }
            ].map((step, idx) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center space-y-6 relative z-10 group"
              >
                {/* Visual Circle Indicator matching image specifications precisely with deep dark contrast */}
                <div className="w-24 h-24 rounded-full flex items-center justify-center font-serif text-3xl font-black transition-all shadow-md group-hover:scale-105 select-none bg-[#117644] text-[#FAF6EE]">
                  {step.num}
                </div>

                <div className="space-y-2 px-2">
                  <h3 className={`font-serif text-xl font-bold tracking-tight group-hover:text-[#117644] transition-colors ${isDarkMode ? "text-white" : "text-[#042F1A]"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-[13px] leading-relaxed font-normal max-w-[260px] mx-auto ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/75"}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. PERSUASIVE BEFORE & AFTER COMPARISON INTERACTIVE DYNAMIC TABLE */}
      <section id="comparison" className={`py-24 border-t relative overflow-hidden transition-colors ${
        isDarkMode ? "bg-[#02180a] border-[#115e34]" : "bg-[#FAF5EB]/50 border-[#b0a487]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">
              SAVINGS DIAGNOSTIC MATRIX
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
              Review What Happens Before &amp; After Postrick
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Analyze the manual social media workflow strain against our unified automated alternative.
            </p>
          </div>

          {/* Fancy, high-contrast side-by-side comparison table */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl border overflow-hidden mt-6 shadow-xl transition-all ${
              isDarkMode ? "border-[#115e34] bg-[#031d10]" : "border-[#b0a487] bg-white"
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between transition-colors ${
              isDarkMode ? "border-[#115e34] bg-[#02180c]" : "border-[#b0a487] bg-[#FAF5EB]"
            }`}>
              <span className={`font-mono text-[10px] uppercase tracking-wider font-extrabold ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]"}`}>
                Performance Audit Matrix &amp; Comparison
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                isDarkMode ? "bg-white/10 text-[#C5E729]" : "bg-[#042F1A]/10 text-[#042F1A]"
              }`}>
                95% Efficiency Boost
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b font-mono uppercase text-[9px] tracking-wider transition-colors ${
                    isDarkMode 
                      ? "border-[#115e34] text-neutral-300 bg-[#02180c]/50" 
                      : "border-[#b0a487] text-[#042F1A] bg-[#FAF5EB]/50"
                  }`}>
                    <th className={`p-4 sm:p-5 font-black w-[25%] ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>CAPABILITY</th>
                    <th className="p-4 sm:p-5 font-black w-[37%] text-red-650 dark:text-red-400 bg-red-500/5">✕ OLD MANUAL ROUTINE</th>
                    <th className={`p-4 sm:p-5 font-black w-[38%] bg-emerald-500/5 ${isDarkMode ? "text-[#C5E729]" : "text-[#02180c]"}`}>✓ THE AUTOMATED FLOW</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-[#115e34]" : "divide-[#b0a487]"}`}>
                  {[
                    {
                      cap: "Post Distribution",
                      icon: <Share2 className="w-4 h-4 text-sky-600" />,
                      manual: "Open 6 tabs, upload files, and copy text by hand. Takes over 45 minutes of draining work.",
                      savvy: "Draft once and queue. Dynamic formats dispatch to all feeds in under 60 seconds.",
                      metric: "SAVED 44 MINS"
                    },
                    {
                      cap: "Post Copywriting",
                      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
                      manual: "Struggle with writer's block, manually guessing tags, and tweaking line limits.",
                      savvy: "Built-in AI engine auto-crafts tailored captions, smart trending hooks, and hashtags.",
                      metric: "NO WRITER BLOCK"
                    },
                    {
                      cap: "Social Calendar",
                      icon: <Calendar className="w-4 h-4 text-rose-600" />,
                      manual: "Logging in manually at irregular/late-night hours or letting visual feed decay.",
                      savvy: "Set and forget. A draggable visual queue schedules and publishes at peak hours.",
                      metric: "100% AUTOPILOT"
                    },
                    {
                      cap: "Analytics Check",
                      icon: <BarChart3 className="w-4 h-4 text-emerald-600" />,
                      manual: "Scraping separate websites, typing analytics in spreadsheets, and debugging broken links.",
                      savvy: "Consolidated, beautiful graphs showing performance benchmarks in one neat summary.",
                      metric: "SINGLE SNAPSHOT"
                    }
                  ].map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-all duration-200 border-b ${
                        isDarkMode 
                          ? "hover:bg-white/5 border-[#083e22]" 
                          : "hover:bg-[#FAF5EB]/40 border-[#eae3d2]"
                      }`}
                    >
                      <td className={`p-4 sm:p-5 font-medium bg-transparent ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            {row.icon}
                            <span className={`font-serif text-sm tracking-tight font-bold ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>{row.cap}</span>
                          </div>
                          <span className={`inline-block text-[8px] font-mono tracking-[0.12em] px-2 py-0.5 rounded font-bold ${
                            isDarkMode ? "bg-white/10 text-[#C5E729]" : "bg-[#042F1A]/10 text-[#042F1A]"
                          }`}>
                            {row.metric}
                          </span>
                        </div>
                      </td>
                      <td className={`p-4 sm:p-5 bg-red-500/5 leading-relaxed text-[13px] font-normal ${isDarkMode ? "text-neutral-300" : "text-stone-600"}`}>
                        <div className="flex items-start gap-1.5">
                          <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 rounded-full bg-red-50/70 border border-red-200 text-red-600 font-extrabold font-mono text-[9px] mt-0.5">✕</span>
                          <span>{row.manual}</span>
                        </div>
                      </td>
                      <td className={`p-4 sm:p-5 bg-emerald-500/5 font-medium leading-relaxed text-[13px] ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]/90"}`}>
                        <div className={`flex items-start gap-1.5 ${isDarkMode ? "text-[#C5E729]" : "text-[#042F1A]"}`}>
                          <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 rounded-full bg-emerald-50/70 border border-emerald-200 text-[#117644] font-extrabold font-mono text-[9px] mt-0.5">✓</span>
                          <span className="font-medium">{row.savvy}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Persuasive Callout inside comparison block */}
          <div className="text-center mt-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={onEnterApp}
              className={`inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-6 py-3 rounded-xl border text-xs cursor-pointer font-bold shadow-sm transition-all ${
                isDarkMode 
                  ? "border-[#083e22] bg-[#031d10] text-white hover:bg-[#042514]" 
                  : "border-[#eae3d2] bg-white text-[#02180c] hover:bg-neutral-50"
              }`}
            >
              <span className="font-black decoration-2 underline text-[#117644]">Stop wasting precious growth hours.</span>
              <span>Connect your social accounts and dispatch updates concurrently on our Free tier today!</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#117644] shrink-0" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Pricing area */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Supported platforms strip above pricing */}
        <div className="mb-20 text-center space-y-6">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-500 block animate-pulse">
            MULTI-PLATFORM COMPATIBILITY BROADCASTS
          </span>
          <h3 className="font-display text-2xl font-black tracking-tight">
            Supported Social Networks
          </h3>
          <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            One unified workspace. Broadcast updates concurrently to the main organic distribution channels seamlessly:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto pt-3">
            {[
              { name: "YouTube", desc: "Video Reels Sync", icon: <Youtube className="w-5 h-5 text-red-500" /> },
              { name: "Facebook", desc: "Group Pages post", icon: <Facebook className="w-5 h-5 text-blue-600" /> },
              { name: "Instagram", desc: "Aspect preview", icon: <Instagram className="w-5 h-5 text-pink-500" /> },
              { name: "TikTok", desc: "Short video Sync", icon: <TikTokIcon className="w-5 h-5 text-neutral-800 dark:text-white" /> },
              { name: "Pinterest", desc: "Rich Pin boards", icon: <PinterestIcon className="w-5 h-5 text-red-600" /> },
              { name: "LinkedIn", desc: "Professional Feed", icon: <Linkedin className="w-5 h-5 text-blue-500" /> }
            ].map((plat) => (
              <motion.div
                key={plat.name}
                whileHover={{ y: -4, scale: 1.05 }}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 min-w-[100px] flex-1 ${
                  isDarkMode ? "bg-neutral-900/60 border-[#115e34]/50 hover:bg-neutral-900" : "bg-white border-[#b0a487] hover:shadow-sm"
                }`}
              >
                <div className="p-2 rounded-full bg-neutral-500/10 flex items-center justify-center shrink-0">
                  {plat.icon}
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-[11px] block text-neutral-800 dark:text-neutral-100">{plat.name}</span>
                  <span className="text-[8px] font-mono opacity-50 block tracking-tight uppercase whitespace-nowrap">{plat.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
          <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">HONEST PRICING PLANS</span>
          <h2 className={`font-serif text-3xl sm:text-4.5xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>One simple pricing, zero billing surprises</h2>
          <p className={`text-sm sm:text-base leading-relaxed max-w-md mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
            Banish locked models. Start entirely free of charge and update only when your social multi-posting demand scales.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold">
            <span 
              onClick={() => setBillingPeriod("monthly")}
              className={`cursor-pointer transition-all ${
                billingPeriod === "monthly" 
                  ? "text-black dark:text-black font-black text-[14px] border-b-2 border-black pb-0.5 opacity-100" 
                  : "text-black dark:text-black font-extrabold opacity-100 hover:opacity-100 text-[13px]"
              }`}
            >
              Monthly Billing
            </span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annually" : "monthly")}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                isDarkMode ? "bg-[#052d19]" : "bg-[#FAF5EB] border border-[#b0a487]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-all transform ${
                isDarkMode ? "bg-[#C5E729]" : "bg-[#042F1A]"
              } ${
                billingPeriod === "annually" ? "translate-x-6" : ""
              }`} />
            </button>
            <span 
              onClick={() => setBillingPeriod("annually")}
              className={`cursor-pointer transition-all flex items-center gap-1.5 ${
                billingPeriod === "annually" 
                  ? "text-[#117644] dark:text-[#C5E729] font-extrabold text-[13px] border-b-2 border-[#117644] dark:border-[#C5E729] pb-0.5" 
                  : "text-[#042F1A] dark:text-neutral-300 font-bold opacity-85 hover:opacity-100"
              }`}
            >
              Annual Billing <span className="text-[10px] bg-emerald-500/10 text-[#117644] dark:text-[#C5E729] font-bold px-1.5 py-0.5 rounded font-mono">SAVE 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`p-6 rounded-3xl border relative flex flex-col justify-between transition-all duration-300 ${
                plan.popular 
                  ? isDarkMode 
                    ? "bg-[#042F1A]/90 backdrop-blur-md border-[#C5E729]/60 shadow-xl" 
                    : "bg-[#FFFFFF]/85 backdrop-blur-md border-[#117644] shadow-xl"
                  : isDarkMode 
                    ? "bg-[#031d10]/75 backdrop-blur-md border-[#115e34]/50 hover:bg-[#031d10]/95" 
                    : "glass-card glass-card-hover"
              }`}
            >
              {plan.popular && (
                <span className={`absolute top-0 right-6 -translate-y-1/2 text-[8px] font-mono tracking-widest uppercase py-1 px-3.5 rounded-full border ${
                  isDarkMode ? "bg-[#C5E729] text-[#032011] border-[#C5E729]" : "bg-[#042F1A] text-[#FAF6EE] border-[#042F1A]"
                }`}>
                  RECOMMENDED
                </span>
              )}

              <div>
                <h3 className={`text-xs font-bold font-mono uppercase tracking-[0.15em] ${isDarkMode ? "text-[#C5E729]" : "text-[#117644]"}`}>{plan.name}</h3>
                <p className={`text-[13px] mt-1.5 min-h-12 leading-relaxed font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/75"}`}>
                  {plan.desc}
                </p>
                
                <div className="py-4">
                  <span className={`text-3xl font-serif font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
                    ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span className={`text-[11px] font-mono font-medium ml-1 ${isDarkMode ? "text-neutral-400" : "text-[#042F1A]/70"}`}>/ month</span>
                  <div className="mt-2.5">
                    <span className={`text-[9px] uppercase font-mono tracking-[0.1em] font-bold px-2.5 py-0.5 rounded-full ${
                      isDarkMode ? "bg-white/10 text-[#C5E729]" : "text-[#117644] bg-[#117644]/10"
                    }`}>
                      {plan.trialLabel}
                    </span>
                  </div>
                </div>

                <ul className={`space-y-3 pt-4 border-t ${isDarkMode ? "border-white/10" : "border-[#eae3d2]/60"}`}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-[#117644] shrink-0 mt-0.5" />
                      <span className={`font-sans font-medium leading-tight ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]/85"}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => { triggerConfetti(); onEnterApp(); }}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    plan.popular 
                      ? isDarkMode 
                        ? "bg-[#C5E729] text-[#032011] hover:opacity-90" 
                        : "bg-[#042F1A] text-white hover:opacity-95" 
                      : isDarkMode 
                        ? "bg-[#FAF6EE]/5 text-[#FAF6EE] hover:bg-[#FAF6EE]/10" 
                        : "bg-[#FAF5EB] text-[#042F1A] hover:bg-[#eae3d1]"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* Testimonials and Reviews Section */}
      <section id="reviews" className={`py-28 border-t transition-colors ${
        isDarkMode ? "bg-[#031d10] border-[#083e22]" : "bg-white border-[#eae3d1]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-20">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">CREATOR TESTIMONIALS</span>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>Verified Reviews from Top Operators</h2>
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              See what growing brands, digital creators, and professional agency teams say about coordinating and automating their multi-channel social posting schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Elena Rostova",
                role: "Studio Director @ BloomMedia",
                text: "Postrick transformed how our agency handles cross-posting. We used to spend hours copy-pasting posts across Instagram and LinkedIn. Now it takes under 2 minutes.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
                stars: 5,
                tag: "Agency"
              },
              {
                name: "Marcus Sterling",
                role: "Tech Creator & Youtuber",
                text: "The draggable scheduling calendar is a masterpiece. I can arrange my entire month of videos and posts in one pass. Seamless and extremely intuitive.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
                stars: 5,
                tag: "Creator"
              },
              {
                name: "Aisha Vance",
                role: "Head of Growth @ SaasFlow",
                text: "We used other tools but none had the peak engagement heatmap built right into the planner grid. That alone doubled our organic impressions in 3 weeks.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
                stars: 5,
                tag: "Brand"
              }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -7, scale: 1.03 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-[#02180c] border-[#115e34]" : "bg-[#FAF5EB]/50 border-[#b0a487]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <span key={i} className="text-[#C5E729] text-base">★</span>
                      ))}
                    </div>
                    <span className={`text-[9px] font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase ${
                      isDarkMode ? "bg-white/10 text-[#C5E729]" : "bg-[#042F1A]/10 text-[#042F1A]"
                    }`}>
                      {review.tag}
                    </span>
                  </div>
                  <p className={`text-[13px] leading-relaxed italic font-normal ${isDarkMode ? "text-neutral-200" : "text-[#042F1A]/85"}`}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className={`flex items-center gap-3 mt-6 pt-4 border-t ${isDarkMode ? "border-white/10" : "border-[#b0a487]/60"}`}>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#042F1A]/10 relative">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className={`font-serif text-sm font-bold ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>{review.name}</h4>
                    <p className={`text-[10px] font-medium leading-none mt-1 ${isDarkMode ? "text-neutral-400" : "text-[#042F1A]/75"}`}>{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Area */}
      <section id="faq" className={`py-28 border-t transition-colors ${
        isDarkMode ? "bg-[#02180c] border-[#083e22]" : "bg-[#FAF5EB]/50 border-[#eae3d1]"
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3.5 mb-20">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">FAQ BOARD</span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>Common answers on your social automated sync</h2>
            <p className={`text-sm leading-relaxed max-w-lg mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Clear specifications concerning our Lifetime Free plan, platform API limits, and cross-posting security routines.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                q: "What is included with the Free Forever plan?",
                a: "You get up to 2 social channels (for example, YouTube + LinkedIn), access to our basic visual scheduling calendar, and unlimited AI content drafting assistance. No credit cards are ever required to write or draft posts."
              },
              {
                q: "Is cross-platform posting authorized and safe?",
                a: "Yes. Postrick utilizes certified secure API connections for Instagram, YouTube, Facebook, Pinterest, LinkedIn, and TikTok, assuring your personal credentials are fully isolated."
              },
              {
                q: "Can I manage separate workgroups as an agency?",
                a: "Absolutely. With our Agency and Studio Pro tiers, you can purchase separate group keys, isolate social dashboard channels into spaces, and coordinate with stakeholders."
              },
              {
                q: "Can I refer associates to earn passive streams?",
                a: "Yes! Click the Affiliate link in the footer to register. You will gain a secure reference URL and earn a 30% recurring share on all plans paid for by your referred creators."
              }
            ].map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isDarkMode 
                      ? isOpen 
                        ? "border-[#C5E729] bg-[#031d10] shadow-md border-2" 
                        : "border-[#115e34] bg-[#031d10]/50 hover:border-[#C5E729]"
                      : isOpen
                        ? "border-[#117644] bg-white shadow-md border-2"
                        : "border-[#b0a487] bg-white hover:border-[#117644] hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className={`w-full p-5 flex items-center justify-between text-left font-serif cursor-pointer transition-colors ${
                      isDarkMode ? "hover:bg-white/5" : "hover:bg-[#FAF5EB]/50"
                    }`}
                  >
                    <span className={`flex items-center gap-3.5 font-bold text-sm tracking-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isDarkMode 
                          ? isOpen ? "bg-[#C5E729] text-[#032011]" : "bg-white/10 text-white"
                          : isOpen ? "bg-[#117644] text-white" : "bg-[#FAF5EB] text-[#117644]"
                      }`}>Q{idx+1}</span>
                      {item.q}
                    </span>
                    <span className={`text-xs transition-transform duration-200 ${
                      isOpen 
                        ? `rotate-180 font-bold ${isDarkMode ? "text-[#C5E729]" : "text-[#117644]"}` 
                        : `${isDarkMode ? "text-neutral-400" : "text-[#042F1A]"} font-medium`
                    }`}>
                      ▼
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`p-5 pt-0 text-[13px] leading-relaxed border-t font-normal font-sans ${
                          isDarkMode ? "border-white/10 text-neutral-300" : "border-[#eae3d2]/60 text-[#042F1A]/80"
                        }`}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CHATBOT SECTION */}
      <section className={`py-16 border-t ${
        isDarkMode ? "bg-[#032011] border-[#083e22]" : "bg-[#FAF5EB]/50 border-[#eae3d1]"
      }`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">TREND ASSISTANT</span>
            <h2 className={`font-serif text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>For further discussion keep in touch</h2>
            <p className={`text-sm leading-relaxed max-w-md mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Have granular questions about API quotas, premium custom calendars, enterprise integrations, or custom plans? Initiate a chat with our smart helpdesk assistant anytime:
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className={`py-3.5 px-8 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg transition-colors ${
                isDarkMode ? "bg-[#C5E729] text-[#032011]" : "bg-[#042F1A] text-[#FAF6EE]"
              }`}
            >
              <MessageSquare className="w-4 h-4 animate-bounce" />
              <span>Click to Start Live Chat!</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* FLOATING CHAT WIDGET */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl shadow-2xl border border-[#b0a487] dark:border-[#115e34] bg-white dark:bg-[#031d10]"
          >
            <div className="bg-[#042F1A] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#C5E729] animate-ping" />
                <span className="font-bold text-xs uppercase tracking-wider font-mono">Postrick Helpdesk Chat</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:opacity-80 font-bold text-sm cursor-pointer p-1 bg-transparent border-none"
              >
                ✕
              </button>
            </div>
            
            <ChatbotBox isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button When Closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsChatOpen(true)}
            className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-colors flex items-center justify-center cursor-pointer border-none ${
              isDarkMode ? "bg-[#C5E729] text-[#032011]" : "bg-[#042F1A] text-white"
            }`}
            title="Open Chat Support"
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero CTA Section */}
      <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`p-10 rounded-3xl border relative overflow-hidden ${
          isDarkMode ? "bg-[#031d10]/30 border-[#115e34] shadow-2xl" : "bg-white border-[#b0a487] shadow-sm"
        }`}>
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#117644] font-bold block mb-1">START POSTING TODAY</span>
            <h2 className={`font-serif text-3xl sm:text-4.5xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>
              Say goodbye to manual publishing fatigue
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-xl mx-auto ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Join thousands of creators, publicists, and growing brands already utilizing our tools to schedule schedules on autopilot. Live metrics, zero limits.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={onEnterApp}
                className="w-full sm:w-auto py-3.5 px-8 rounded-full font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg bg-[#042F1A] text-[#FAF6EE] hover:bg-[#117644] transition-colors"
              >
                Access Dashboard
              </button>
              <button 
                onClick={onEnterApp}
                className={`w-full sm:w-auto py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest border cursor-pointer transition-all ${
                  isDarkMode 
                    ? "border-[#FAF6EE] text-[#FAF6EE] hover:bg-white/10" 
                    : "border-[#042F1A] text-[#042F1A] hover:bg-[#042F1A]/10"
                }`}
              >
                Claim Lifetime Free Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Follow-Us Banner */}
      <section className={`py-12 border-t transition-colors ${
        isDarkMode ? "bg-[#02180c] border-[#115e34]" : "bg-[#FAF5EB]/50 border-[#b0a487]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#117644] font-bold block mb-1">WEEKLY INSIGHTS &amp; ALERTS</span>
            <h3 className={`font-serif text-2xl font-black ${isDarkMode ? "text-white" : "text-[#02180c]"}`}>Follow us on</h3>
            <p className={`text-sm leading-relaxed max-w-md mx-auto font-normal ${isDarkMode ? "text-neutral-300" : "text-[#042F1A]/80"}`}>
              Stay in the loop with active product updates, growth hacks, live platform metrics tutorials, and coupon alerts.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            {[
              { name: "YouTube", icon: <Youtube className="w-5 h-5 text-red-500" />, href: "#" },
              { name: "Facebook", icon: <Facebook className="w-5 h-5 text-blue-600" />, href: "#" },
              { name: "Instagram", icon: <Instagram className="w-5 h-5 text-pink-500" />, href: "#" },
              { name: "TikTok", icon: <TikTokIcon className="w-5 h-5 text-[#042F1A] dark:text-white" />, href: "#" },
              { name: "Pinterest", icon: <PinterestIcon className="w-5 h-5 text-red-600" />, href: "#" },
              { name: "LinkedIn", icon: <Linkedin className="w-5 h-5 text-blue-500" />, href: "#" }
            ].map((p, idx) => (
              <motion.a
                key={p.name}
                href={p.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 180 }}
                whileHover={{ y: -4, scale: 1.1, backgroundColor: isDarkMode ? "bg-[#031d10]" : "rgba(0,0,0,0.03)" }}
                className={`p-3.5 rounded-full border flex items-center justify-center transition-colors ${
                  isDarkMode ? "bg-[#031d10] border-[#115e34] text-[#FAF6EE]" : "bg-white border-[#b0a487] text-[#042F1A]"
                }`}
                title={`Follow us on ${p.name}`}
              >
                {p.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Area (Deep dark forest green for premium high-contrast contrast) */}
      <footer className="border-t border-[#042F1A] bg-[#042F1A] text-[#FAF6EE]/80 py-16 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10">
          
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <PostrickLogo className="w-8 h-8 flex-shrink-0" color="#C5E729" bgStrokeColor="#042F1A" />
              <span className="font-serif font-black tracking-tight text-lg text-white">Postrick</span>
            </div>
            <p className="max-w-xs leading-relaxed opacity-70">
              Smart isomorphic multi-channel content scheduling cockpit for digital agencies, brand managers, and independent creators worldwide.
            </p>
            <p className="text-[10px] opacity-40 font-mono">
              © {new Date().getFullYear()} Postrick Inc. All registered rights reserved under SLA indexes.
            </p>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">Product</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left">Auto-Publish</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left">Schedule Calendar</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left">Analytics</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left">Caption Generator</button></li>
              <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left">AI Image Generator</button></li>
              <li><a href="#pricing" className="hover:text-white transition-colors text-left block">Pricing List</a></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">Company</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Material</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Integrity</a></li>
              <li>
                <button 
                  onClick={onEnterApp} 
                  className="hover:text-white transition-colors text-left text-[#C5E729] font-bold flex items-center gap-1.5"
                >
                  Affiliate Program 
                  <span className="bg-[#C5E729]/15 text-[#C5E729] font-sans text-[8px] py-0.5 px-1.5 rounded uppercase font-bold tracking-wider">
                    30% RECUR
                  </span>
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors font-semibold">Contact Sales</a></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">General SLA</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><a href="/privacy" className="hover:text-white transition-colors text-[#C5E729] font-bold">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Usage Indemnity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Boundaries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Protocols</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Disapproval</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Opt-out Register</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
