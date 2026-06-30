"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { 
  Share2, 
  Calendar, 
  Sparkles, 
  Zap, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Send, 
  Globe, 
  Menu, 
  X, 
  Check, 
  ChevronRight, 
  Plus, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  LayoutGrid, 
  Smile, 
  Monitor, 
  Smartphone,
  Eye,
  Settings,
  Flame,
  FileText,
  MousePointerClick
} from "lucide-react";

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

// Inline Chart component from Recharts to ensure real, responsive analytics drawing
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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
      <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.19 1.11 1.25 2.62 2.07 4.22 2.37v3.89c-1.84-.03-3.64-.59-5.19-1.61-.26-.17-.51-.36-.75-.56v6.92c.04 2.1-.51 4.21-1.65 5.92-1.35 1.94-3.52 3.32-5.87 3.73-2.59.48-5.36-.18-7.38-1.85-2.24-1.85-3.51-4.71-3.37-7.6.1-2.63 1.34-5.15 3.37-6.84 2.01-1.7 4.76-2.4 7.35-1.88 1 .2 1.94.61 2.76 1.2V.02zm-3.9 10.97c-.2-.03-.4-.05-.6-.05-1.57.03-3.08.83-3.88 2.18-.87 1.4-1.02 3.19-.39 4.7.57 1.44 1.91 2.5 3.44 2.74 1.63.29 3.37-.17 4.54-1.32 1.28-1.2 1.9-3.04 1.69-4.83v-6.07c-.45.3-.92.56-1.42.77-1 .44-2.11.64-3.19.53l-.19-.05v1.13z"/>
    </svg>
  );
}

// Quick navigation tabs
const navTabs = [
  { id: "sync", label: "Instant Sync", target: "#sync" },
  { id: "calendar", label: "Calendar Planner", target: "#calendar" },
  { id: "ai-assist", label: "AI Copywriter", target: "#ai-assist" },
  { id: "creative-kit", label: "Creative Assets", target: "#creative-kit" },
  { id: "analytics", label: "Insights & Analytics", target: "#analytics" },
];

export default function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("sync");
  const [activePreviewTab, setActivePreviewTab] = useState<"instagram" | "tiktok" | "youtube">("instagram");
  const [selectedTone, setSelectedTone] = useState<"witty" | "professional" | "bold" | "friendly">("witty");
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll spy helper
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const tab of navTabs) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(tab.id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleEnterApp = () => {
    window.location.href = "/?app=true";
  };

  // Simulated Tone Texts
  const tonePresets = {
    witty: {
      text: "We spent 48 hours designing this social calendar so you don't spend 48 minutes crying over your posting schedule. Standard sanity preservation metrics included. 😉 Let's talk scale.",
      tags: "#SocialPlan #SaaSLogic #TimeSavings",
      readTime: "12s read - 58 words"
    },
    professional: {
      text: "Announcing Trend Wave's unified content scheduling matrix. Re-engineer corporate distribution workflows, sequence multi-channel campaigns natively, and capture peak audience waves. Contact sales for custom team enterprise SLAs.",
      tags: "#CorporateStrategy #SLA #MarketingTech",
      readTime: "14s read - 64 words"
    },
    bold: {
      text: "STOP MANUAL CROSS-POSTING FATIGUE. Instantly pipeline, sync, and deploy your visual assets across 6 networks simultaneously. One core interface, total organic dominance. Power up your timeline now.",
      tags: "#BrandGrowth #MarketingSystems #TrendWave",
      readTime: "9s read - 45 words"
    },
    friendly: {
      text: "Hey everyone! 👋 Planning your weekly socials shouldn't feel like a chore. That's why we built Trend Wave to easily format and drag-and-drop drafts across all channels safely. Let us know how it powers your workflow!",
      tags: "#CommunityFocus #ContentLove #WorkflowSimplified",
      readTime: "13s read - 55 words"
    }
  };

  // Chart dataset for Analytics
  const chartData = [
    { name: "Week 1", YouTube: 1200, Instagram: 1800, LinkedIn: 950 },
    { name: "Week 2", YouTube: 2100, Instagram: 3400, LinkedIn: 1850 },
    { name: "Week 3", YouTube: 2800, Instagram: 4800, LinkedIn: 2400 },
    { name: "Week 4", YouTube: 4300, Instagram: 6900, LinkedIn: 3800 },
    { name: "Week 5", YouTube: 6200, Instagram: 9800, LinkedIn: 5120 },
    { name: "Week 6", YouTube: 8900, Instagram: 14200, LinkedIn: 7350 },
  ];

  return (
    <div className="font-sans antialiased text-[#052414] bg-[#FAF6EE] min-h-screen">
      
      {/* 1. Nav Area */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-[#FAF6EE]/90 border-[#eae3d2] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <span className="flex items-center justify-center w-8 h-8 rounded-full font-serif font-black italic text-xs border bg-[#042F1A] text-[#FAF6EE] border-[#042F1A]">
                T
              </span>
              <span className="font-serif font-black tracking-tight text-2xl italic text-[#02180c]">
                Trend Wave<span className="text-xs font-sans not-italic font-bold align-super">®</span>
              </span>
            </Link>

            {/* Desktop Navbar Menu Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-[#042F1A]">
              <Link href="/features" className="text-[#117644] pb-1 border-b-2 border-[#117644]">Features</Link>
              <Link href="/#comparison" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Before &amp; After</Link>
              <Link href="/#pricing" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Pricing</Link>
              <Link href="/#faq" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">FAQ</Link>
            </nav>

            {/* CTA action corner */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleEnterApp}
                className="inline-flex items-center justify-center py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#117644] transition-colors bg-[#042F1A] text-[#FAF6EE] shadow-md"
              >
                Launch Cockpit
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-current opacity-80"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer (AnimatePresence styled) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b overflow-hidden font-bold text-xs bg-[#FAF6EE] border-[#eae3d2]"
          >
            <div className="px-4 py-5 space-y-3.5 flex flex-col font-black uppercase tracking-widest text-[#042F1A]">
              <Link href="/features" className="py-1 text-[#117644]" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/#comparison" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Before &amp; After</Link>
              <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Pricing</Link>
              <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">FAQ</Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleEnterApp(); }}
                className="w-full py-3 px-4 rounded-full uppercase tracking-wider text-xs font-black bg-[#042F1A] text-[#FAF6EE]"
              >
                Go to Workspace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#eae3d2] bg-radial-at-t from-[#FAF6EE] to-[#F1EDE2]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#117644]/10 text-[#117644] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" /> Core Feature Deep-Dive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl text-[#042F1A] tracking-tight leading-none"
          >
            Everything you need to <span className="font-serif italic font-medium">scale content</span>, end to end.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#042F1A]/70 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A high-fidelity social cockpit configured to automate single-click cross-publishing compliance, algorithmic asset conversion, and professional-grade copy development.
          </motion.p>

          {/* Quick jump navigation pill bar with layout animations */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 bg-[#042F1A]/5 p-2 rounded-full border border-[#eae3d2] shadow-sm backdrop-blur">
              {navTabs.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                      isActive 
                        ? "text-[#FAF6EE] shadow-sm" 
                        : "text-[#042F1A]/70 hover:text-[#042F1A]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeFeaturePill"
                        className="absolute inset-0 bg-[#04331C] rounded-full -z-10"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Deep Dive alternating blocks */}
      <section className="py-24 space-y-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BLOCK A: Sync */}
        <div id="sync" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-28">
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 text-left">
            <span className="text-[10px] tracking-widest font-black uppercase text-[#117644] flex items-center gap-2">
              <Share2 className="w-4 h-4" /> 01 / LIVE ECOSYSTEM SYNC
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#042F1A] tracking-tight leading-none">
              Cross-Channel <br />
              <span className="font-serif italic font-medium text-[#117644]">Instant Sync.</span>
            </h2>
            <p className="text-[#042F1A]/80 text-base leading-relaxed">
              Format, preview, and deploy your content concurrently across 6 key native platforms. With instantaneous API validation, eliminate manual device preview fatigue entirely.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Single-Entry Formatting</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Natively configure headings, hashtags, and text styling parameters once.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Live Platform Mockups</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Review accurate mobile and desktop card overlays for iOS and Android.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Auto-Resize Engine</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Automatic viewport frame extraction and crop correction for Reels and grids.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive visual mockup */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#eae3d2] rounded-3xl p-6 shadow-xl relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#eae3d2]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-[#042F1A]/50 ml-4">Isomorphic Post Editor v1.0.4</span>
                </div>
                <div className="flex gap-1.5 bg-[#FAF6EE] p-1 rounded-lg border border-[#eae3d2]">
                  <button 
                    onClick={() => setActivePreviewTab("instagram")}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-md transition-all ${
                      activePreviewTab === "instagram" ? "bg-[#042F1A] text-white" : "text-[#042F1A]/60"
                    }`}
                  >
                    Instagram
                  </button>
                  <button 
                    onClick={() => setActivePreviewTab("tiktok")}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-md transition-all ${
                      activePreviewTab === "tiktok" ? "bg-[#042F1A] text-white" : "text-[#042F1A]/60"
                    }`}
                  >
                    TikTok
                  </button>
                  <button 
                    onClick={() => setActivePreviewTab("youtube")}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-md transition-all ${
                      activePreviewTab === "youtube" ? "bg-[#042F1A] text-white" : "text-[#042F1A]/60"
                    }`}
                  >
                    YouTube
                  </button>
                </div>
              </div>

              {/* Viewport Frame with real overlay aspect-ratio indicator */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video flex items-center justify-center border group">
                <img 
                  src="/auto_publish.jpg" 
                  alt="Interactive mockup" 
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    activePreviewTab === "instagram" ? "aspect-square max-h-[300px]" : activePreviewTab === "tiktok" ? "max-w-[280px] h-[340px]" : "w-full"
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid parameters */}
                <div className="absolute top-3 left-3 bg-[#042F1A]/95 text-white backdrop-blur text-[10px] font-mono px-3 py-1.5 rounded-lg border border-[#eae3d2]/20 flex items-center gap-1.5 uppercase font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5E729] animate-ping" />
                  {activePreviewTab === "instagram" ? "1080 × 1080 (Square)" : activePreviewTab === "tiktok" ? "1080 × 1920 (Portrait)" : "1920 × 1080 (16:9)"}
                </div>

                <div className="absolute bottom-3 right-3 bg-neutral-900/90 text-white backdrop-blur text-[9px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> 100% API COMPLIANT
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#eae3d2] flex items-center justify-between text-xs text-[#042F1A]/60">
                <div className="flex items-center gap-4">
                  <span>Aspect: <strong className="text-[#042F1A]">{activePreviewTab === "instagram" ? "1:1 Feed" : activePreviewTab === "tiktok" ? "9:16 Shorts" : "16:9 Video"}</strong></span>
                  <span>Safety Rails: <strong className="text-emerald-600 font-bold">PASS</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-600">Simulating Live Stream</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BLOCK B: Calendar */}
        <div id="calendar" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-28">
          {/* Calendar mockup illustration */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#eae3d2] rounded-3xl p-6 shadow-xl relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#eae3d2]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#117644]" />
                  <span className="font-mono text-xs font-black text-[#042F1A] uppercase tracking-wider">Campaign Planner Mockview</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-400/25 text-amber-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">7 Drafts Scheduled</span>
              </div>

              {/* Grid representation */}
              <div className="relative rounded-2xl overflow-hidden shadow-inner border border-[#eae3d2]/60">
                <img 
                  src="/schedule_calendar.jpg" 
                  alt="Calendar Scheduler Mockup" 
                  className="w-full aspect-video object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Peak Time Highlight Slot */}
                <div className="absolute top-1/4 left-[40%] bg-emerald-950/95 border-2 border-dashed border-[#C5E729] text-[#FAF6EE] p-4 rounded-xl shadow-lg w-[230px] backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5E729] font-black">BEST TIME IDENTIFIED</span>
                    <Flame className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-xs">🔥 peak traffic: 6:00 pm</h4>
                  <p className="text-[10px] text-white/70 mt-1">High conversion trigger for Lifestyle & Finance creators.</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#042F1A]/70">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> YouTube</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> Facebook</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-pink-500 rounded-full" /> Instagram</span>
                </div>
                <div className="bg-[#FAF6EE] px-2.5 py-1 rounded border border-[#eae3d2] text-[#117644]">
                  🎯 Drag cards to reschedule easily
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-8 text-left">
            <span className="text-[10px] tracking-widest font-black uppercase text-[#117644] flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 02 / GRAPHIC CAMPAIGN GRID
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#042F1A] tracking-tight leading-none">
              Weekly Calendar &amp; <br />
              <span className="font-serif italic font-medium text-[#117644]">Daily Planner.</span>
            </h2>
            <p className="text-[#042F1A]/80 text-base leading-relaxed">
              Plan and calendar-view your publishing pipeline. Color-code platforms, draft, sequence, and trigger drag-and-drop actions quickly on a responsive grid.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Draggable Grid Matrix</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Reorganize assets, change draft slots, and lock down monthly campaigns directly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Time-Optimized Queues</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Auto-align publishing with algorithmically structured golden hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Multi-Platform Color Coding</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Visually segregate campaigns by media formats inside a clean calendar matrix.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK C: AI Assist */}
        <div id="ai-assist" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-28">
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 text-left">
            <span className="text-[10px] tracking-widest font-black uppercase text-[#117644] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 03 / AI-POWERED ASYNC WRITER
            </span>
            <div className="space-y-3">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#042F1A] tracking-tight leading-none">
                AI Caption &amp; <br />
                <span className="font-serif italic font-medium text-[#117644]">Copywriting Copilot</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono tracking-widest bg-yellow-400/20 text-[#A07000] font-black uppercase">
                Powered by Advanced AI models
              </span>
            </div>
            <p className="text-[#042F1A]/80 text-base leading-relaxed">
              Generate platform-compliant captions, post copy, and visual prompts designed to convert. Fully customized for tone structures, hashtag maximums, and platform character limits.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Intrapersonal Tone Matching</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Adopt witty, bold, professional, or friendly presets corresponding to your profile.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Platform-Specific Formatting</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Generate thread structures, auto-shorten bios, and bold key concepts automatically.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">High-Conversion Hashtags</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Semantic extraction algorithms that map trending tags tailored to your prompt context.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded AI Copy mock interface */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#eae3d2] rounded-3xl p-6 shadow-xl text-left"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#eae3d2]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="text-amber-500 w-4 h-4 fill-amber-500 animate-pulse" />
                  <span className="font-mono text-xs font-black text-[#042F1A] uppercase tracking-wider">AI Assistant Sandbox UI</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md">Model-3.5-Flash Active</span>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#eae3d2] p-4 bg-[#FAF6EE]/50">
                  <span className="text-[9px] font-mono text-[#042F1A]/55 uppercase tracking-wider">System Copy Prompt</span>
                  <p className="text-xs font-black text-[#042F1A] mt-1">&quot;Create a launch announcement thread for our new marketing grid tools.&quot;</p>
                </div>

                {/* Interactive Tone Toggle chips */}
                <div>
                  <span className="text-[9px] font-mono text-[#042F1A]/55 uppercase tracking-wider mb-2.5 block">SELECT INTEGRATED GRAPH TONE PRESENTS</span>
                  <div className="flex flex-wrap gap-1.5 bg-[#FAF6EE] p-1 rounded-xl border border-[#eae3d2]">
                    {(["witty", "professional", "bold", "friendly"] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all ${
                          selectedTone === tone 
                            ? "bg-[#042F1A] text-[#FAF6EE] shadow-sm transform scale-102" 
                            : "text-[#042F1A]/60 hover:text-[#042F1A]"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mock output with Framer Animation */}
                <div className="rounded-xl border border-[#eae3d2] p-5 shadow-inner bg-white min-h-[160px] flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Subtle background image from public folder */}
                  <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none w-48 h-48 select-none">
                    <img src="/ai_caption.jpg" alt="Watermark" className="w-full h-full object-cover rounded-full" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTone}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4 relative z-10"
                    >
                      <p className="text-xs text-[#042F1A] leading-relaxed font-medium font-serif italic italic-600">
                        &quot;{tonePresets[selectedTone].text}&quot;
                      </p>
                      <p className="text-xs font-mono text-[#117644] font-black tracking-wide">
                        {tonePresets[selectedTone].tags}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="border-t border-[#eae3d2] pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono text-[#042F1A]/60">
                    <span>{tonePresets[selectedTone].readTime}</span>
                    <button 
                      onClick={() => {
                        if (typeof navigator !== "undefined") {
                          navigator.clipboard.writeText(tonePresets[selectedTone].text + " " + tonePresets[selectedTone].tags);
                        }
                        setCopiedNotification(true);
                        setTimeout(() => setCopiedNotification(false), 2000);
                      }}
                      className="text-[#117644] font-black uppercase hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNotification ? (
                        <>Copied! ✓</>
                      ) : (
                        <>Copy draft to clipboard →</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BLOCK D: Creative Kit */}
        <div id="creative-kit" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-28">
          {/* Creative Kit graphic gallery representation */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#eae3d2] rounded-3xl p-6 shadow-xl relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#eae3d2]">
                <span className="font-mono text-xs font-black text-[#042F1A] uppercase tracking-wider">CREATIVE KIT STUDIO CONSOLE</span>
                <span className="text-[10px] uppercase font-mono text-amber-600 tracking-wider bg-amber-400/10 px-2.5 py-1 rounded-md font-bold">Smart Rendering Engine v2.0</span>
              </div>

              {/* Bento Grid Gallery mimicking design kit */}
              <div className="grid grid-cols-12 gap-4">
                
                {/* Large main landscape showcase */}
                <div className="col-span-8 relative rounded-2xl overflow-hidden border border-[#eae3d2] shadow-sm aspect-video">
                  <img 
                    src="/forest_stream_flowers.jpg" 
                    alt="Main Showcase Render" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-[#042F1A] text-[#FAF6EE] text-[9px] font-mono px-2 py-1 rounded">
                    16:9 Banner Format
                  </div>
                </div>

                {/* Alternate crop portrait rendering */}
                <div className="col-span-4 relative rounded-2xl overflow-hidden border border-[#eae3d2] shadow-sm aspect-[3/4]">
                  <img 
                    src="/forest_stream_flowers.jpg" 
                    alt="Story Crop" 
                    className="w-full h-full object-cover scale-110 translate-y-3" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-[#042F1A] text-[#FAF6EE] text-[9px] font-mono px-2 py-1 rounded">
                    9:16 Custom Story
                  </div>
                </div>

                {/* Floating Editor Controls Mockup */}
                <div className="col-span-12 bg-[#FAF6EE] border border-[#eae3d2] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase text-[#042F1A]/60 font-medium">CUSTOM COLOR KIT:</span>
                    <div className="flex gap-1.5">
                      <span className="w-5.5 h-5.5 rounded-full bg-[#042F1A] border-2 border-white shadow-sm ring-1 ring-[#042F1A]/20 cursor-pointer" />
                      <span className="w-5.5 h-5.5 rounded-full bg-[#117644] border-2 border-white shadow-sm ring-1 ring-[#042F1A]/20 cursor-pointer" />
                      <span className="w-5.5 h-5.5 rounded-full bg-[#C5E729] border-2 border-white shadow-sm ring-1 ring-[#042F1A]/20 cursor-pointer" />
                      <span className="w-5.5 h-5.5 rounded-full bg-orange-400 border-2 border-white shadow-sm ring-1 ring-[#042F1A]/20 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#042F1A]/60 font-medium">FONT CODES:</span>
                    <div className="flex gap-1 rounded bg-white p-0.5 border border-[#eae3d2] text-[9px] font-bold uppercase">
                      <span className="bg-[#042F1A] text-white px-2 py-1 rounded whitespace-nowrap">Space Grotesk</span>
                      <span className="text-[#042F1A]/60 px-2 py-1 whitespace-nowrap">Inter</span>
                      <span className="text-[#042F1A]/60 px-2 py-1 whitespace-nowrap">Playfair Serif</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-8 text-left">
            <span className="text-[10px] tracking-widest font-black uppercase text-[#117644] flex items-center gap-2">
              <Award className="w-4 h-4" /> 04 / EXQUISITE GRAPHICS ENGINE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#042F1A] tracking-tight leading-none">
              Creative Kit <br />
              <span className="font-serif italic font-medium text-[#117644]">Asset Generator.</span>
            </h2>
            <p className="text-[#042F1A]/80 text-base leading-relaxed">
              Design professional templates, banners, or cover illustrations using standard keyword triggers. Synchronize your custom brand kit&apos;s color palettes and lock in visual margins natively.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Smart Banner Layouts</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Instantly generate high-resolution banner backdrops built for headers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Brand Kit Presets</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Force color combinations, font families, and visual filters onto images.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">On-Demand Layout Adaptation</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Prompt as a standard banner once and automatically scale crops safely.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK E: Analytics (NEW supporting module) */}
        <div id="analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-28">
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 text-left">
            <span className="text-[10px] tracking-widest font-black uppercase text-[#117644] flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> 05 / COMPILATION COCKPIT
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#042F1A] tracking-tight leading-none">
              Unified Analytics &amp; <br />
              <span className="font-serif italic font-medium text-[#117644]">Brand Insights.</span>
            </h2>
            <p className="text-[#042F1A]/80 text-base leading-relaxed">
              Consolidate marketing indices into a single analytics platform. Track cumulative impressions, click relative speeds, and active subscriber scaling indicators under unified parameters.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Cross-Platform Rollup Index</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Simultaneously evaluate total traction profiles across all active distribution channels.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Optimal Time Matrix Models</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Track actual user conversions over hour blocks and identify high traction trends.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white/60 border border-[#eae3d2] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#117644]/10 p-2.5 rounded-xl text-[#117644]">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#042F1A]">Exportable SLA PDF Sheets</h4>
                  <p className="text-xs text-[#042F1A]/70 mt-1">Format clean, highly structured, report templates formatted with single-click conversions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real Recharts Interactive Analytics Panel */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#eae3d2] rounded-3xl p-6 shadow-xl relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#eae3d2]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#117644]" />
                  <span className="font-mono text-xs font-black text-[#042F1A] uppercase tracking-wider">Traction Velocity Matrix</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#117644] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#042F1A]/50">Realtime aggregate feed</span>
                </div>
              </div>

              {/* Real Recharts Component wrapper */}
              <div className="h-64 sm:h-72 w-full mt-4">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientIG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5E729" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#C5E729" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="gradientYT" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#117644" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#117644" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ebd8" />
                      <XAxis dataKey="name" stroke="#042F1A" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#042F1A" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#042F1A", 
                          borderRadius: "12px", 
                          border: "none", 
                          color: "#FAF6EE", 
                          fontFamily: "monospace",
                          fontSize: "10px" 
                        }} 
                      />
                      <Area type="monotone" dataKey="Instagram" stroke="#C5E729" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientIG)" />
                      <Area type="monotone" dataKey="YouTube" stroke="#117644" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientYT)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-[#FAF6EE] flex items-center justify-center text-xs text-[#042F1A]/50 font-mono">
                    Constructing aggregate charts...
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#eae3d2] flex items-center justify-between text-xs font-mono text-[#042F1A]/70">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 bg-[#C5E729] rounded-full inline-block" />
                    Instagram Live (Conversion +12.4%)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 bg-[#117644] rounded-full inline-block" />
                    YouTube Reels (Conversion +8.9%)
                  </span>
                </div>
                <span className="text-emerald-600 font-bold">Aggregate: Active growth</span>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* 4. Integrations Strip */}
      <section className="py-24 bg-[#042F1A]/5 border-t border-b border-[#eae3d2]/80">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#117644]">NATIVE PLATFORM HOOKS</span>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-[#042F1A] tracking-tight">
              Works with the platforms you already use.
            </h3>
            <p className="text-xs text-[#042F1A]/60 max-w-md mx-auto">
              Synchronize, sequence, and automatically post directly to major distribution channels concurrently with one certified cockpit account.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
            {[
              { name: "YouTube", desc: "Shorts & Videos", status: "99.9% LIVE", themeColor: "text-red-500 hover:border-red-500/30", icon: <Youtube className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-red-500" /> },
              { name: "Facebook", desc: "Pages & Groups", status: "CERTIFIED", themeColor: "text-blue-600 hover:border-blue-600/30", icon: <Facebook className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-blue-600" /> },
              { name: "Instagram", desc: "Aspect Previews", status: "AUTO-SYNC", themeColor: "text-pink-500 hover:border-pink-500/30", icon: <Instagram className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-pink-500" /> },
              { name: "TikTok", desc: "Reels & Sync", status: "OAUTH2", themeColor: "text-black hover:border-black/30 dark:hover:border-white/30", icon: <TikTokIcon className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-neutral-900" /> },
              { name: "Pinterest", desc: "Pins & Boards", status: "CONNECTOR", themeColor: "text-red-600 hover:border-red-600/30", icon: <PinterestIcon className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-red-600" /> },
              { name: "LinkedIn", desc: "Professional Feed", status: "SECURE OAUTH", themeColor: "text-blue-500 hover:border-blue-500/30", icon: <Linkedin className="w-6 h-6 transition-colors duration-300 text-neutral-400 group-hover:text-blue-500" /> }
            ].map((p, idx) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className={`p-5 rounded-2xl border bg-white border-[#eae3d2] shadow-sm flex flex-col items-center justify-center text-center gap-3 transition-colors duration-300 group ${p.themeColor}`}
              >
                {p.icon}
                <div>
                  <h4 className="font-bold text-xs text-[#042F1A] tracking-tight group-hover:text-current transition-colors duration-300">{p.name}</h4>
                  <p className="text-[10px] text-[#042F1A]/50 mt-0.5">{p.desc}</p>
                </div>
                <span className="text-[8px] font-mono font-black uppercase bg-[#042F1A]/5 text-[#042F1A]/60 px-2.5 py-0.5 rounded-full inline-block group-hover:bg-neutral-100 group-hover:text-current">
                  {p.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA + Footer */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-t border-[#eae3d2]">
        
        {/* Soft background glow circles to reflect premium funded SaaS design */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-[#117644]/5 to-[#C5E729]/5 rounded-full blur-3xl pointer-events-none select-none" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#117644] bg-[#117644]/10 px-3.5 py-1 rounded-full">
            START DOMINATING CHANNELS TODAY
          </span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl text-[#042F1A] tracking-tight max-w-3xl mx-auto leading-none">
            Transform your social footprint <br />with <span className="font-serif italic font-medium text-[#117644]">absolute clarity</span>.
          </h2>
          <p className="text-sm text-[#042F1A]/70 max-w-xl mx-auto">
            Ready to integrate visual campaign editors, AI-optimized tone captions, and comprehensive aggregators? Start free. No credit card required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center py-4 px-8 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#117644] bg-[#042F1A] text-[#FAF6EE] shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center py-4 px-8 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer bg-white border border-[#eae3d2]/80 text-[#042F1A] shadow-md hover:bg-neutral-50 transition-all"
            >
              Book custom SLA Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer Area from components/landing-page.tsx */}
      <footer className="border-t border-[#042F1A] bg-[#042F1A] text-[#FAF6EE]/80 py-16 text-xs transition-colors text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10">
          
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C5E729] text-[#032011] font-serif font-black italic text-xs leading-none animate-pulse">
                T
              </span>
              <span className="font-serif font-black tracking-tight text-lg text-white">Trend Wave</span>
            </div>
            <p className="max-w-xs leading-relaxed opacity-70">
              Smart isomorphic multi-channel content scheduling cockpit for digital agencies, brand managers, and independent creators worldwide of the highest scale.
            </p>
            <p className="text-[10px] opacity-40 font-mono">
              © {new Date().getFullYear()} Trend Wave Inc. All registered rights reserved under SLA indexes.
            </p>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">Product Features</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><button onClick={handleEnterApp} className="hover:text-white transition-colors text-left">Auto-Publish</button></li>
              <li><button onClick={handleEnterApp} className="hover:text-white transition-colors text-left">Schedule Calendar</button></li>
              <li><button onClick={handleEnterApp} className="hover:text-white transition-colors text-left">Analytics</button></li>
              <li><button onClick={handleEnterApp} className="hover:text-white transition-colors text-left">Caption Generator</button></li>
              <li><button onClick={handleEnterApp} className="hover:text-white transition-colors text-left">AI Image Generator</button></li>
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
                  onClick={handleEnterApp} 
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
