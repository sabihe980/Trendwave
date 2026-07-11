"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, BarChart3, Calendar, Download, ChevronDown, 
  HelpCircle, ThumbsUp, MessageCircle, Share2, Eye, MapPin, Clock, 
  ChevronRight, Filter, FileText, CheckCircle2, Award, Info, AlertCircle, X
} from "lucide-react";
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell, Legend, BarChart, AreaChart, Area
} from "recharts";
import confetti from "canvas-confetti";

import { Instagram, Linkedin, Facebook, Youtube } from "./icons";

// Custom Pinterest SVG
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.958 1.406-5.958s-.359-.72-.359-1.781c0-1.663.967-2.906 2.17-2.906 1.023 0 1.517.769 1.517 1.689 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.169 1.775 2.169 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.061-4.869-5.007-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.031.395 2.138.89 2.738.1.12.115.22.085.344-.09.384-.291 1.185-.33 1.348-.05.213-.169.258-.389.156-1.451-.676-2.361-2.796-2.361-4.49 0-3.66 2.661-7.02 7.67-7.02 4.027 0 7.157 2.87 7.157 6.707 0 4.004-2.52 7.227-6.015 7.227-1.176 0-2.28-.611-2.656-1.334 0 0-.58 2.21-.72 2.752-.26 1.002-.962 2.259-1.43 3.018 1.121.347 2.308.535 3.535.535 6.62 0 11.988-5.367 11.988-11.988C24 5.367 18.638 0 12.017 0z"/>
    </svg>
  );
}

// Full Platform options map
const PLATFORMS_CONFIG = [
  { id: "instagram", name: "Instagram", color: "#ec4899", textClass: "text-[#ec4899]", icon: <Instagram className="w-3.5 h-3.5" /> },
  { id: "facebook", name: "Facebook", color: "#3b82f6", textClass: "text-[#3b82f6]", icon: <Facebook className="w-3.5 h-3.5" /> },
  { id: "linkedin", name: "LinkedIn", color: "#0077b5", textClass: "text-[#0077b5]", icon: <Linkedin className="w-3.5 h-3.5" /> },
  { id: "youtube", name: "YouTube", color: "#ef4444", textClass: "text-[#ef4444]", icon: <Youtube className="w-3.5 h-3.5" /> },
  { id: "pinterest", name: "Pinterest", color: "#e60023", textClass: "text-[#e60023]", icon: <PinterestIcon className="w-3.5 h-3.5" /> }
];

// Helper to simulate sparklines SVG path based on selected seed range
const generateSparklinePath = (seed: string, selectedRange: string) => {
  const pointsMap: Record<string, string> = {
    "reach-7": "M0,15 L10,8 L20,12 L30,5 L40,11 L50,3 C50,3 52,10 60,1",
    "reach-30": "M0,15 L8,18 L16,10 L24,14 L32,8 L40,12 L48,5 C48,5 55,10 60,3",
    "reach-90": "M0,12 L10,14 L20,9 L30,11 L40,6 L50,8 L60,2",
    "eng-7": "M0,10 L12,18 L24,15 L36,12 L48,8 L60,2",
    "eng-30": "M0,16 L10,12 L20,15 L30,9 L40,6 L50,11 L60,4",
    "eng-90": "M0,14 L12,10 L24,12 L36,6 L48,8 L60,3"
  };
  const key = `${seed}-${selectedRange === "Last 7 days" ? "7" : selectedRange === "Last 30 days" ? "30" : "90"}`;
  return pointsMap[key] || "M0,10 L15,12 L30,8 L45,11 L60,5";
};

// Top countries for audience geography
const AUDIENCE_COUNTRIES = [
  { country: "United States", pct: 42, color: "#117644" },
  { country: "Germany", pct: 18, color: "#C5E729" },
  { country: "United Kingdom", pct: 14, color: "#042F1A" },
  { country: "Japan", pct: 11, color: "#0077b5" },
  { country: "Netherlands", pct: 8, color: "#ec4899" }
];

// Best time to post weekly hour heatmap slots
const HEATMAP_SLOTS = [
  { label: "08:00 AM", score: [0.3, 0.45, 0.6, 0.35, 0.7, 0.82, 0.5] },
  { label: "10:00 AM", score: [0.55, 0.62, 0.78, 0.5, 0.85, 0.95, 0.6] },
  { label: "12:00 PM", score: [0.72, 0.88, 0.95, 0.78, 0.98, 0.88, 0.75] },
  { label: "02:00 PM", score: [0.45, 0.6, 0.55, 0.48, 0.65, 0.7, 0.58] },
  { label: "04:00 PM", score: [0.65, 0.75, 0.80, 0.62, 0.78, 0.85, 0.68] },
  { label: "06:00 PM", score: [0.85, 0.92, 0.88, 0.82, 0.98, 0.9, 0.8] },
  { label: "08:00 PM", score: [0.95, 0.98, 1.0, 0.92, 1.0, 0.95, 0.9] },
  { label: "10:00 PM", score: [0.5, 0.68, 0.7, 0.55, 0.72, 0.65, 0.58] }
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PostrickAnalytics() {

  // Range selections
  const [selectedRange, setSelectedRange] = useState<string>("Last 30 days");
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  // Platforms multi-selector state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "linkedin", "facebook"]);
  const [hiddenPlatformLines, setHiddenPlatformLines] = useState<string[]>([]); // filter interactive lines inside combo chart

  // Export dropdown
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Modal breakdown active detailed cards
  const [activePlatformDetail, setActivePlatformDetail] = useState<string | null>(null);

  // Audience Insights Active Tab
  const [audienceTab, setAudienceTab] = useState<"times" | "demographics">("times");

  // Real database analytics states
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulated count-up animation values
  const [animatedValues, setAnimatedValues] = useState({
    reach: 0,
    engagement: 0,
    rate: 0.0,
    growth: 0,
    published: 0
  });

  // 1. Fetch current workspace identity on mount
  useEffect(() => {
    async function loadWorkspace() {
      try {
        const authRes = await fetch("/api/auth");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated && authData.profile) {
            const wId = authData.profile.current_workspace_id || authData.profile.workspaces?.[0]?.id;
            setWorkspaceId(wId);
          }
        }
      } catch (err) {
        console.error("Failed to load workspace in analytics:", err);
      }
    }
    loadWorkspace();
  }, []);

  // 2. Load aggregate metrics and timeline records
  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    async function loadAnalytics() {
      setLoading(true);
      try {
        const periodParam = selectedRange === "Last 7 days" ? "7d" : selectedRange === "Last 90 days" ? "90d" : "30d";
        const res = await fetch(`/api/analytics?workspaceId=${workspaceId}&period=${periodParam}`);
        if (res.ok) {
          const data = await res.json();
          setApiData(data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [workspaceId, selectedRange]);

  // 3. Count-up visual sweet animation triggered on new database loads
  useEffect(() => {
    if (!apiData) return;
    const summary = apiData.summary || { reach: 0, impressions: 0, engagementRate: 0, followers: 0, clicks: 0 };
    
    const targets = {
      reach: summary.reach || 0,
      engagement: (summary.likes || 0) + (summary.comments || 0) + (summary.shares || 0) + (summary.clicks || 0),
      rate: summary.engagementRate || 0,
      growth: summary.followers || 0,
      published: summary.impressions || 0
    };
    
    let startTimestamp: number | null = null;
    const duration = 600; // milliseconds
    let animFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setAnimatedValues({
        reach: Math.round(progress * targets.reach),
        engagement: Math.round(progress * targets.engagement),
        rate: parseFloat((progress * targets.rate).toFixed(2)),
        growth: Math.round(progress * targets.growth),
        published: Math.round(progress * targets.published)
      });

      if (progress < 1) {
        animFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animFrameId) {
        window.cancelAnimationFrame(animFrameId);
      }
    };
  }, [apiData]);

  const togglePlatformFilter = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
      } else {
        // Must leave at least 1 platform selected
        confetti({ particleCount: 10, angle: 90, spread: 25 });
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  // Pre-seed dynamically plotted Trend chart data points based on date ranges
  const getTrendData = () => {
    // Generate dates
    const days = selectedRange === "Last 7 days" ? 7 : selectedRange === "Last 30 days" ? 10 : 15;
    const items = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * (selectedRange === "Last 90 days" ? 6 : selectedRange === "Last 30 days" ? 3 : 1)));
      const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      // Calculate daily coordinates
      const postCountMultiplier = selectedPlatforms.length;
      const postCount = Math.round((Math.sin(i * 1.2) + 1.2) * (postCountMultiplier / 2) + 0.5);

      // Map values
      const dataPoint: Record<string, any> = {
        date: dateString,
        posts: postCount,
      };

      // Calculate separate line coordinates
      PLATFORMS_CONFIG.forEach(p => {
        if (selectedPlatforms.includes(p.id)) {
          // Add some organic fluctuation
          const randomFactor = Math.sin(i * 0.9) * 0.8 + 2.5;
          const baseMap: Record<string, number> = {
            instagram: 4.8 + Math.cos(i) * 0.6,
            facebook: 1.9 + Math.cos(i + 1) * 0.3,
            linkedin: 3.5 + Math.sin(i * 1.5) * 0.5,
            youtube: 2.1 + Math.sin(i) * 0.9,
            pinterest: 2.8 + Math.cos(i * 2) * 0.4
          };
          
          dataPoint[p.name] = parseFloat((baseMap[p.id] || 2.5).toFixed(2));
        }
      });

      items.push(dataPoint);
    }
    return items;
  };

  const activeTrendData = getTrendData();

  // Pre-seeded 30-day daily engagement growth data helper
  const getDailyEngagementGrowthData = () => {
    const items = [];
    const baseValue = 420;
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayMultiplier = isWeekend ? 1.35 : 0.95;
      const growthTrend = 1 + (29 - i) * 0.038; // ~3.8% compounding growth daily
      const randomFluctuation = 0.88 + Math.sin(i * 0.6) * 0.12; 

      const netGrowth = Math.round(baseValue * growthTrend * dayMultiplier * randomFluctuation);
      const dailyIncrease = Math.max(12, Math.round(netGrowth * (0.05 + Math.random() * 0.08)));

      items.push({
        date: dateString,
        growth: netGrowth,
        dailyIncrease: dailyIncrease,
      });
    }
    return items;
  };

  const engagementGrowthData = getDailyEngagementGrowthData();

  // Curated list of Top Content posts with rich images
  const TOP_PERFORMING_CONTENT = [
    {
      id: "top-1",
      rank: "#1",
      title: "Conscious Upgrades Showcase",
      platform: "instagram",
      engagement: "8.4%",
      likes: 1240,
      shares: 320,
      views: "18.4K",
      image: "https://picsum.photos/seed/design-glass/300/300"
    },
    {
      id: "top-2",
      rank: "#2",
      title: "Behind the Scenes of Zero-Plastic Materials",
      platform: "youtube",
      engagement: "7.1%",
      likes: 890,
      shares: 104,
      views: "15.2K",
      image: "https://picsum.photos/seed/organic-wood/300/300"
    },
    {
      id: "top-3",
      rank: "#3",
      title: "How to Optimize Campaign Delivery Latency",
      platform: "linkedin",
      engagement: "6.2%",
      likes: 412,
      shares: 98,
      views: "6.8K",
      image: "https://picsum.photos/seed/eco-tech/300/300"
    },
    {
      id: "top-4",
      rank: "#4",
      title: "30% Packaging Reduction Case Study",
      platform: "facebook",
      engagement: "5.5%",
      likes: 301,
      shares: 95,
      views: "5.1K",
      image: "https://picsum.photos/seed/minimal-office/300/300"
    },
    {
      id: "top-5",
      rank: "#5",
      title: "Why Minimalism Is Better For Earth",
      platform: "pinterest",
      engagement: "4.9%",
      likes: 670,
      shares: 140,
      views: "11.2K",
      image: "https://picsum.photos/seed/green-plants/300/300"
    }
  ];

  // Helper to get platform info
  const getPlatformInfo = (id: string) => {
    return PLATFORMS_CONFIG.find(p => p.id === id) || PLATFORMS_CONFIG[0];
  };

  // Handle fake downloads
  const triggerExport = (format: "PDF" | "CSV") => {
    setIsExportOpen(false);
    confetti({ particleCount: 40, spread: 45 });
    setExportNotification(`Generating and compiling your Postrick ${format} report...`);
    setTimeout(() => {
      setExportNotification(null);
    }, 4500);
  };

  // Toggle lines on trend legend
  const toggleTrendLineVisibility = (platformName: string) => {
    if (hiddenPlatformLines.includes(platformName)) {
      setHiddenPlatformLines(hiddenPlatformLines.filter(line => line !== platformName));
    } else {
      setHiddenPlatformLines([...hiddenPlatformLines, platformName]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* EXPORT STICKY ALERT/NOTIFICATION BANNER */}
      <AnimatePresence>
        {exportNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#042F1A] border-2 border-[#C5E729] text-[#FAF6EE] px-5 py-3 rounded-2xl shadow-2xl z-[99999] flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C5E729] animate-bounce" />
            <span>{exportNotification}</span>
            <span className="text-[10px] bg-[#117644] px-2 py-0.5 rounded-full text-stone-100 font-mono">DONE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1 — HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-[#eae3d2] text-left">
        <div>
          <h1 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">
            Analytics.
          </h1>
          <p className="text-xs text-[#042F1A]/60 font-medium">
            Dynamic cross-platform campaign reach &amp; engagement reporting metrics
          </p>
        </div>

        {/* CONTROLS ROW */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          
          {/* Platform Multi-Select Filters Row */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF5EB] p-1 border border-[#eae3d2] rounded-2xl">
            {PLATFORMS_CONFIG.map((plat) => {
              const active = selectedPlatforms.includes(plat.id);
              return (
                <button
                  key={plat.id}
                  onClick={() => togglePlatformFilter(plat.id)}
                  className={`px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? "bg-[#042F1A] text-[#FAF6EE]" 
                      : "text-neutral-400 hover:text-[#042F1A]"
                  }`}
                >
                  <span style={{ color: active ? '#C5E729' : 'currentColor' }}>{plat.icon}</span>
                  <span className="hidden sm:inline">{plat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Date range picker selector */}
          <div className="relative">
            <button
              onClick={() => setIsRangeOpen(!isRangeOpen)}
              className="py-1.8 px-3.5 bg-white border border-[#eae3d2] rounded-xl hover:border-[#117644] text-[10px] font-bold text-[#042F1A] uppercase tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#117644]" />
              <span>{selectedRange}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>

            <AnimatePresence>
              {isRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRangeOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 7 }}
                    className="absolute right-0 mt-1.5 w-44 bg-[#FAF5EB] border border-[#eae3d2] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-neutral-150 p-1 text-left"
                  >
                    {["Last 7 days", "Last 30 days", "Last 90 days"].map((range) => (
                      <button
                        key={range}
                        onClick={() => { setSelectedRange(range); setIsRangeOpen(false); }}
                        className={`w-full py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#042F1A] hover:bg-[#117644] hover:text-white transition-colors text-left font-sans block ${selectedRange === range ? "bg-[#117644]/10 border-l-4 border-[#117644]" : ""}`}
                      >
                        {range}
                      </button>
                    ))}
                    <div className="p-2 space-y-1 bg-stone-50">
                      <span className="block text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest">Custom Period</span>
                      <input 
                        type="date"
                        className="w-full text-[9px] p-1 border font-mono rounded bg-white text-stone-600 focus:outline-none" 
                        defaultValue="2026-06-01"
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedRange("Custom Draft");
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Export action button */}
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="py-1.8 px-3.5 bg-[#117644] text-[#FAF6EE] hover:bg-[#042F1A] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5E729]" />
              <span>Export</span>
            </button>

            <AnimatePresence>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 7 }}
                    className="absolute right-0 mt-1.5 w-48 bg-white border-2 border-[#eae3d2] rounded-2xl shadow-2xl z-50 p-1 divide-y"
                  >
                    <button
                      onClick={() => triggerExport("PDF")}
                      className="w-full py-2.5 px-3.5 flex items-center gap-2 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-[#ef4444]" />
                      <div>
                        <span className="block text-[10px] font-bold text-[#042F1A]">Export PDF Performance Report</span>
                        <p className="text-[7.5px] text-neutral-400 font-mono uppercase">Full vectors and layout summary</p>
                      </div>
                    </button>
                    <button
                      onClick={() => triggerExport("CSV")}
                      className="w-full py-2.5 px-3.5 flex items-center gap-2 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="block text-[10px] font-bold text-[#042F1A]">Export CSV Campaign Sheets</span>
                        <p className="text-[7.5px] text-neutral-400 font-mono uppercase">Includes raw coordinates</p>
                      </div>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* SECTION 2 — KPI SUMMARY CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4.5">
        {[
          { 
            label: "Total Reach", 
            value: animatedValues.reach.toLocaleString(), 
            pct: "+14.2%", 
            sub: "vs previous range", 
            isPos: true,
            sparkSeed: "reach"
          },
          { 
            label: "Total Engagement", 
            value: animatedValues.engagement.toLocaleString(), 
            pct: "+11.8%", 
            sub: "vs previous range", 
            isPos: true,
            sparkSeed: "eng"
          },
          { 
            label: "Engagement Rate", 
            value: `${animatedValues.rate}%`, 
            pct: "+0.45%", 
            sub: "average scale", 
            isPos: true,
            sparkSeed: "reach"
          },
          { 
            label: "Followers Growth", 
            value: `+${animatedValues.growth.toLocaleString()}`, 
            pct: "-2.1%", 
            sub: "new organic fans", 
            isPos: false,
            sparkSeed: "eng"
          },
          { 
            label: "Posts Published", 
            value: animatedValues.published.toLocaleString(), 
            pct: "+15%", 
            sub: "total designs", 
            isPos: true,
            sparkSeed: "reach"
          }
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="bg-white border-2 border-[#eae3d2] hover:border-[#117644] p-4 rounded-2xl flex flex-col justify-between text-left transition-all hover:scale-[1.01] relative group overflow-hidden"
          >
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-stone-400 tracking-wider block">
                {card.label}
              </span>
              <h3 className="font-serif text-xl font-black text-[#042F1A] tracking-tight mt-1">
                {card.value}
              </h3>
            </div>

            {/* Micro Sparkline & visual indicators bottom-row */}
            <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
              
              {/* Trend Badge */}
              <div className="flex flex-col">
                <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 ${
                  card.isPos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {card.isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {card.pct}
                </span>
                <span className="text-[7.5px] text-stone-400 font-mono uppercase mt-0.5 leading-none">
                  {card.sub}
                </span>
              </div>

              {/* Sparkline Canvas Vector SVG */}
              <svg className={`w-14 h-5 ${card.isPos ? "text-emerald-500" : "text-rose-500"}`} viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={generateSparklinePath(card.sparkSeed, selectedRange)} strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3 — MAIN TREND CHART (FULL-WIDTH) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="bg-white border-2 border-[#eae3d2] p-5 md:p-6 rounded-3xl text-left space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eae3d2]/70">
          <div>
            <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block">Core performance tracker</span>
            <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Posts Dispatched vs Engagement Over time</h3>
          </div>

          {/* Interactive Legend Row supporting line toggle */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Standard Post Bar Indicator */}
            <span className="flex items-center gap-1.5 text-[8.5px] font-mono font-black text-[#042F1A] bg-stone-100 pl-2 pr-2.5 py-1 rounded-lg">
              <span className="w-2 h-2.5 bg-[#117644]/80 rounded-xs" />
              <span>POSTS PUBLISHED (L)</span>
            </span>

            {/* Map each active platform lines */}
            {PLATFORMS_CONFIG.map(p => {
              if (!selectedPlatforms.includes(p.id)) return null;
              const isHidden = hiddenPlatformLines.includes(p.name);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggleTrendLineVisibility(p.name)}
                  className={`flex items-center gap-1.5 text-[8.5px] font-mono font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isHidden 
                      ? "bg-stone-50 border-stone-200 text-stone-400 line-through decoration-neutral-400" 
                      : "bg-[#FAF5EB] hover:bg-neutral-100"
                  }`}
                  style={{ borderColor: isHidden ? undefined : p.color, color: isHidden ? undefined : p.color }}
                  title="Click to hide/show from chart"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name.toUpperCase()} ER% (R)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COMBO CHART AREA */}
        <div className="h-80 md:h-[350px]">
          {(!apiData || apiData.timeline?.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-[#eae3d2] rounded-3xl bg-stone-50/40 p-8 text-center space-y-4">
              <div className="p-3 bg-[#FAF5EB] rounded-full text-[#117644] border border-[#eae3d2] shadow-sm">
                <BarChart3 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black text-sm text-[#042F1A]">No tracking history recorded</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">Connect your social accounts and publish scheduled content. Your first statistics and timeline aggregates will populate here automatically.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={apiData.timeline} margin={{ left: -15, right: -15, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1efe6" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: "600", fill: "#57534e" }} />
                {/* Dual Y-Axes */}
                <YAxis yAxisId="left" orientation="left" stroke="#117644" tick={{ fontSize: 9, fontWeight: "600" }} label={{ value: 'Published count (bars)', angle: -90, position: 'insideLeft', style: { fontSize: '8px', fill: '#117644', fontWeight: '800' } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#78716c" tick={{ fontSize: 9, fontWeight: "600" }} label={{ value: 'Engagement % (lines)', angle: 90, position: 'insideRight', style: { fontSize: '8px', fill: '#78716c', fontWeight: '800' } }} />
                
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#FAF5EB] border-2 border-[#117644] p-3 rounded-xl shadow-2xl space-y-1.5 text-left text-[11px] max-w-[200px]">
                          <span className="block font-mono text-[9px] font-black text-[#117644] uppercase tracking-wider border-b pb-1 font-serif">{label}</span>
                          {payload.map((entry: any) => {
                            const isBar = entry.name === "posts" || entry.dataKey === "posts";
                            const val = isBar ? `${entry.value} post(s)` : `${entry.value}%`;
                            return (
                              <div key={entry.name} className="flex justify-between items-center gap-4">
                                <span className="font-semibold text-stone-600 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                  {entry.name === "posts" ? "Posts Dispatched" : entry.name}
                                </span>
                                <span className="font-mono font-bold text-stone-900">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Dynamic Bar layer */}
                <Bar yAxisId="left" dataKey="posts" name="posts" fill="#117644" fillOpacity={0.75} radius={[4, 4, 0, 0]} barSize={26} />

                {/* Dynamic Lines depending on platform activations */}
                {PLATFORMS_CONFIG.map(p => {
                  if (!selectedPlatforms.includes(p.id) || hiddenPlatformLines.includes(p.name)) return null;
                  return (
                    <Line
                      key={p.id}
                      yAxisId="right"
                      type="monotone"
                      dataKey={p.name}
                      name={p.name}
                      stroke={p.color}
                      strokeWidth={2.4}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6, strokeWidth: 1 }}
                      animationDuration={1200}
                    />
                  );
                })}

              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-[9px] text-neutral-400 font-mono text-center uppercase tracking-wider">
          💡 Clicking any platform block in the legend above instantly filters the active comparison trendline streams
        </p>
      </motion.div>

      {/* SECTION 3.5 — DAILY ENGAGEMENT GROWTH OVER 30 DAYS (BAR CHART) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white border-2 border-[#eae3d2] p-5 md:p-6 rounded-3xl text-left space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eae3d2]/70">
          <div>
            <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block">Engagement Growth Engine</span>
            <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">30-Day Daily Engagement Growth Tracker</h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-black text-[#117644] bg-[#117644]/5 px-2.5 py-1 rounded-xl border border-[#117644]/15 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+28.4% TOTAL GROWTH</span>
            </span>
            <span className="text-[8.5px] font-mono text-neutral-400 uppercase">Bar chart metrics</span>
          </div>
        </div>

        {/* RECHARTS BAR CHART */}
        <div className="h-80 md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementGrowthData} margin={{ left: -15, right: -15, top: 10 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#117644" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#117644" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="increaseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5E729" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#C5E729" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1efe6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 8, fontWeight: "600", fill: "#57534e" }}
                interval={2} 
              />
              <YAxis 
                tick={{ fontSize: 9, fontWeight: "600" }} 
                label={{ value: 'Engagement Growth Count', angle: -90, position: 'insideLeft', style: { fontSize: '8px', fill: '#042F1A', fontWeight: '800' } }} 
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#FAF5EB] border-2 border-[#117644] p-3 rounded-xl shadow-2xl space-y-1.5 text-left text-[11px] max-w-[220px]">
                        <span className="block font-mono text-[9.5px] font-black text-[#117644] uppercase tracking-wider border-b pb-1 font-serif">{label}</span>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-4">
                            <span className="font-semibold text-stone-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#117644]" />
                              Cumulative Growth:
                            </span>
                            <span className="font-mono font-bold text-stone-900">{payload[0]?.value} pts</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="font-semibold text-stone-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C5E729]" />
                              Daily Net Gain:
                            </span>
                            <span className="font-mono font-bold text-[#117644]">+{payload[1]?.value}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', fontFamily: 'monospace', textTransform: 'uppercase' }} 
              />
              <Bar 
                dataKey="growth" 
                name="Cumulative Engagement" 
                fill="url(#growthGradient)" 
                radius={[4, 4, 0, 0]} 
                barSize={12} 
              />
              <Bar 
                dataKey="dailyIncrease" 
                name="Daily Net Gain" 
                fill="url(#increaseGradient)" 
                radius={[4, 4, 0, 0]} 
                barSize={12} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[9px] text-neutral-400 font-mono text-center uppercase tracking-wider">
          📈 Daily Net Gain highlights localized spikes (e.g. content releases and viral triggers) while Cumulative Engagement charts aggregate community depth
        </p>
      </motion.div>

      {/* SECTION 4 — PLATFORM BREAKDOWN DETAIL CARDS */}
      <div className="space-y-4">
        <div className="text-left">
          <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block">Distribution analytics</span>
          <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Platform Performance Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PLATFORMS_CONFIG.map((plat, idx) => {
            const isInstalled = selectedPlatforms.includes(plat.id);
            
            // content type mix configurations
            const donutData = 
              plat.id === "instagram" ? [ { name: "Video/Reel", value: 50 }, { name: "Images", value: 30 }, { name: "Carousels", value: 20 } ] :
              plat.id === "linkedin" ? [ { name: "Images/PDF", value: 60 }, { name: "Text only", value: 25 }, { name: "Video", value: 15 } ] :
              plat.id === "facebook" ? [ { name: "Images", value: 45 }, { name: "Videos", value: 35 }, { name: "External", value: 20 } ] :
              plat.id === "youtube" ? [ { name: "Long videos", value: 70 }, { name: "Shorts", value: 30 } ] :
              [ { name: "Pins", value: 80 }, { name: "Board items", value: 20 } ];

            const donutColors = ["#117644", "#C5E729", "#FAF5EB"];
            
            // metrics simulated
            const statFollowers = 
              plat.id === "instagram" ? "124,500" :
              plat.id === "facebook" ? "82,100" :
              plat.id === "linkedin" ? "14,320" :
              plat.id === "youtube" ? "425,000" : "8,920";

            const statEngagement = 
              plat.id === "instagram" ? "4.82%" :
              plat.id === "facebook" ? "1.95%" :
              plat.id === "linkedin" ? "3.51%" :
              plat.id === "youtube" ? "2.10%" : "2.80%";

            return (
              <motion.div
                key={plat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
                className={`bg-white border-2 p-5 rounded-2xl text-left flex flex-col justify-between shadow-3xs hover:shadow-xl transition-all relative overflow-hidden group ${
                  isInstalled ? "border-[#eae3d2] hover:border-[#117644]" : "border-neutral-100 opacity-60"
                }`}
              >
                {!isInstalled && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[8px] font-mono text-stone-400">
                    <AlertCircle className="w-2.5 h-2.5 text-stone-400" />
                    DISABLED
                  </div>
                )}

                {/* Card Title */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-neutral-50 rounded-lg group-hover:scale-110 transition-transform block" style={{ color: plat.color }}>
                      {plat.icon}
                    </span>
                    <h4 className="font-serif font-black text-sm text-[#042F1A]">{plat.name} Network</h4>
                  </div>

                  {/* 3 Metrics Mini-Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-150 text-left font-sans">
                    <div>
                      <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">Followers</span>
                      <p className="text-[11px] font-black text-stone-800">{statFollowers}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">Avg ER %</span>
                      <p className="text-[11px] font-black text-emerald-700">{statEngagement}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">Top Post ER</span>
                      <p className="text-[11px] font-black text-[#042F1A]">
                        {plat.id === "instagram" ? "8.4%" : plat.id === "youtube" ? "7.1%" : "6.2%"}
                      </p>
                    </div>
                  </div>

                  {/* Content type mix with donut chart */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-16 flex-shrink-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={15}
                            outerRadius={28}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {donutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[8px] text-center font-bold text-stone-500 font-mono">
                        MIX
                      </span>
                    </div>

                    <div className="text-[8.5px] font-sans font-medium space-y-1 text-stone-500">
                      <span className="block font-bold text-stone-400 uppercase text-[7.5px] font-mono">Type distributions:</span>
                      {donutData.map((chunk, j) => (
                        <div key={chunk.name} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: donutColors[j % donutColors.length] }} />
                          <span className="font-semibold text-stone-600">{chunk.name}:</span>
                          <span className="font-mono font-bold text-stone-800">{chunk.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => isInstalled && setActivePlatformDetail(plat.id)}
                  disabled={!isInstalled}
                  className="w-full text-center py-2 border border-neutral-200 hover:border-[#117644] hover:bg-[#FAF5EB] rounded-xl text-[9px] uppercase font-black tracking-widest mt-4 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <span>View campaign details</span>
                  <ChevronRight className="w-3 h-3 text-[#117644]" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5 — TOP PERFORMING CONTENT IN RESPONSIVE HORIZONTAL SCROLL LIST */}
      <div className="space-y-4 pt-2">
        <div className="text-left flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block">Engagement goldmine</span>
            <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Top Performing Campaign Content</h3>
          </div>
          <span className="text-[8.5px] font-mono text-neutral-400 uppercase hidden sm:block">Scroll right →</span>
        </div>

        <div className="flex gap-4 pb-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-stone-200">
          {TOP_PERFORMING_CONTENT.map((post, idx) => {
            const plat = getPlatformInfo(post.platform);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
                className="bg-white border-2 border-[#eae3d2] p-3 rounded-2xl w-60 flex-shrink-0 text-left space-y-3 relative group hover:border-[#117644] shadow-3xs transition-all hover:scale-[1.01]"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/85 text-white text-[8px] font-mono rounded-md uppercase tracking-wider flex items-center gap-1">
                    {plat.icon}
                    <span>{plat.name}</span>
                  </span>

                  {/* Top Rank Gold Badge */}
                  {idx < 3 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center text-[9px] font-mono font-black text-[#042F1A] shadow-md">
                      {post.rank}
                    </span>
                  )}
                </div>

                {/* Meta details */}
                <div className="space-y-2">
                  <h5 className="text-[10px] sm:text-[10.5px] font-bold text-[#042F1A] line-clamp-1 leading-snug font-serif">
                    {post.title}
                  </h5>
                  
                  <div className="grid grid-cols-4 gap-1.5 text-center font-sans text-stone-500 pt-1.5 border-t border-neutral-150">
                    <div className="text-left select-none text-[#117644]">
                      <span className="text-[7px] font-mono font-black uppercase text-stone-400 block leading-none">ER %</span>
                      <span className="text-[9.5px] font-mono font-black">{post.engagement}</span>
                    </div>
                    <div className="text-left flex flex-col justify-between">
                      <span className="text-[7.5px] font-mono text-stone-400 block leading-none uppercase"><ThumbsUp className="w-2 h-2 text-stone-400" /></span>
                      <span className="text-[9px] font-semibold text-stone-800 leading-none">{post.likes}</span>
                    </div>
                    <div className="text-left flex flex-col justify-between">
                      <span className="text-[7.5px] font-mono text-stone-400 block leading-none uppercase"><MessageCircle className="w-2 h-2 text-stone-400" /></span>
                      <span className="text-[9px] font-semibold text-stone-800 leading-none">{post.shares}</span>
                    </div>
                    <div className="text-left flex flex-col justify-between">
                      <span className="text-[7.5px] font-mono text-stone-400 block leading-none uppercase"><Eye className="w-2 h-2 text-stone-400" /></span>
                      <span className="text-[9px] font-semibold text-stone-800 leading-none">{post.views}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 6 — AUDIENCE INSIGHTS (HEATMAPS & DEMOGRAPHICS) */}
      <div className="bg-white border-2 border-[#eae3d2] rounded-3xl p-5 md:p-6 text-left space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 border-[#eae3d2]/70">
          <div>
            <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block">Target demographics</span>
            <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Audience &amp; Global Insights</h3>
          </div>

          {/* Subtab Picker */}
          <div className="bg-[#FAF5EB] p-1 border border-[#eae3d2] rounded-xl self-start sm:self-center flex">
            <button
              onClick={() => setAudienceTab("times")}
              className={`py-1 px-3.5 rounded-lg text-2xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                audienceTab === "times" ? "bg-[#042F1A] text-white shadow-3xs" : "text-neutral-500 hover:text-[#042F1A]"
              }`}
            >
              Peak Heattimes
            </button>
            <button
              onClick={() => setAudienceTab("demographics")}
              className={`py-1 px-3.5 rounded-lg text-2xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                audienceTab === "demographics" ? "bg-[#042F1A] text-white shadow-3xs" : "text-neutral-500 hover:text-[#042F1A]"
              }`}
            >
              Audience Mix
            </button>
          </div>
        </div>

        {/* TAB 1: HEATMAP GRID OF OPTIMAL POST HOURS */}
        {audienceTab === "times" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Grid display layout */}
            <div className="lg:col-span-8 space-y-3">
              <span className="block text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest leading-none">
                Dispatch Heatmap Matrix (Engagement Potential)
              </span>
              
              <div className="border border-[#eae3d2] rounded-2xl bg-[#FAF5EB]/20 p-4 overflow-x-auto scrollbar-none">
                <div className="min-w-[440px] sm:min-w-0">
                  
                  {/* Heatmap Axis Headings */}
                  <div className="grid grid-cols-8 gap-1.5 text-center font-mono text-[8px] font-black text-stone-500 border-b pb-1.5 mb-1.5">
                    <div>SLOT</div>
                    {WEEKDAYS.map(day => <div key={day}>{day.toUpperCase()}</div>)}
                  </div>

                  {/* Heatmap Row matrix representation */}
                  <div className="space-y-1.5">
                    {HEATMAP_SLOTS.map((row) => (
                      <div key={row.label} className="grid grid-cols-8 gap-1.5 items-center">
                        <div className="font-mono text-[7px] text-stone-400 text-left font-black leading-none">{row.label}</div>
                        {row.score.map((score, dayIdx) => {
                          // Calculate color opacity density
                          let bgDensity = 
                            score >= 0.9 ? "bg-[#117644]" :
                            score >= 0.75 ? "bg-[#117644]/75" :
                            score >= 0.6 ? "bg-[#117644]/50" :
                            score >= 0.4 ? "bg-[#C5E729]" : "bg-[#C5E729]/25";

                          return (
                            <div 
                              key={dayIdx} 
                              className={`aspect-square sm:h-7 rounded-sm flex items-center justify-center font-mono text-[8.5px] cursor-pointer hover:ring-2 hover:ring-amber-500 hover:scale-105 transition-all text-white font-bold group relative ${bgDensity}`}
                            >
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white rounded text-[7px] absolute bottom-full mb-1 p-1 z-30 font-bold whitespace-nowrap">
                                {(score * 100).toFixed(0)}% heat
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Micro details panel right-sidebar */}
            <div className="lg:col-span-4 bg-[#FAF5EB]/40 border-2 border-dashed border-[#eae3d2] p-4.5 rounded-2xl flex flex-col justify-between text-left">
              <div className="space-y-2">
                <h4 className="font-serif font-black text-sm text-[#042F1A] flex items-center gap-1.5">
                  <Clock className="w-4.5 h-4.5 text-[#117644]" />
                  Peak Wave Dispatch
                </h4>
                <p className="text-[10px] text-stone-600 leading-relaxed font-sans">
                  Your highest composite peak of engagement occurs around <strong className="text-[#117644] font-black">afternoons between 06:00 PM and 08:00 PM UTC</strong>.
                </p>
                
                <div className="p-3 bg-white border border-[#eae3d2] rounded-xl space-y-1.5 text-[10px] text-stone-600 leading-relaxed font-sans mt-3">
                  <span className="font-black text-[#042F1A] block">⚡ POSTRICK DISPATCH TIP:</span>
                  Schedule your newly designed banners from Creative Kit to publish automatically during these peak segments to maximize organic reach velocity.
                </div>
              </div>

              <div className="text-[9.5px] font-mono text-neutral-400 uppercase mt-4">
                UPDATED REALTIME ACROSS ALL NETWORKS
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Age Brackets chart */}
            <div className="space-y-3.5 text-left border-r border-[#eae3d2]/60 pr-0 md:pr-6">
              <span className="block text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest leading-none">
                Audience Age bracket demographics
              </span>
              
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { age: "18-24", match: 15 },
                    { age: "25-34", match: 45 },
                    { age: "35-44", match: 26 },
                    { age: "45-54", match: 9 },
                    { age: "55+", match: 5 }
                  ]} layout="vertical" margin={{ left: -15, right: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 9 }} />
                    <YAxis dataKey="age" type="category" tick={{ fontSize: 9, fontWeight: "600" }} />
                    <Tooltip />
                    <Bar dataKey="match" fill="#117644" radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geography distribution country row */}
            <div className="space-y-3.5 text-left flex flex-col justify-between">
              <div>
                <span className="block text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest leading-none">
                  Global geographic density breakdown
                </span>

                <div className="space-y-2.5 mt-3">
                  {AUDIENCE_COUNTRIES.map((cty, idx) => (
                    <div key={cty.country} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-[#042F1A]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {cty.country}
                        </span>
                        <span className="font-mono font-bold">{cty.pct}%</span>
                      </div>
                      <div className="w-full bg-[#FAF5EB] rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cty.pct}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.8 }}
                          className="rounded-full h-full"
                          style={{ backgroundColor: cty.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[9px] text-[#117644] font-mono uppercase bg-neutral-50 p-2.5 rounded-xl border border-[#eae3d2]">
                🗺️ Europe &amp; North America represent over 74% of conscious lifestyle engagement trends with high growth in sustainable material sectors.
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL PLATFORM ACTION TRIGGER PANEL (DETAILED CAMPAIGNS) */}
      <AnimatePresence>
        {activePlatformDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[15000] flex items-center justify-center p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF5EB] border-2 border-[#117644] rounded-3xl p-5 md:p-6 w-full max-w-lg shadow-2xl relative"
            >
              
              <button
                onClick={() => setActivePlatformDetail(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#042F1A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                
                {/* Platform Header details */}
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-white rounded-xl shadow-3xs" style={{ color: getPlatformInfo(activePlatformDetail).color }}>
                    {getPlatformInfo(activePlatformDetail).icon}
                  </span>
                  <div>
                    <span className="text-[9.5px] font-mono font-black text-[#117644] uppercase tracking-wider block">Real-time activity analytics</span>
                    <h3 className="font-serif font-black text-base text-[#042F1A]">{getPlatformInfo(activePlatformDetail).name} Campaign Logs</h3>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5EB] border border-[#eae3d2] rounded-xl text-[10px] text-stone-600 leading-normal">
                  Our system syncs with the official {getPlatformInfo(activePlatformDetail).name} API to track your posts, engagement, and audience feedback automatically.
                </div>

                {/* Multi activity stats list */}
                <div className="space-y-2 divide-y divide-neutral-150 pt-2 text-[11px] font-sans">
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-stone-500 font-semibold">Active publish slots configured</span>
                    <span className="font-mono font-bold text-[#042F1A]">6 / Daily recurring</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-stone-500 font-semibold">Total impressions monitored</span>
                    <span className="font-mono font-bold text-stone-900">421,800</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-stone-500 font-semibold">External click-through velocity (CTR)</span>
                    <span className="font-mono font-bold text-[#117644]">3.24% average</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-stone-500 font-semibold">Audience sentiment</span>
                    <span className="font-mono font-bold text-emerald-700">92% Positive</span>
                  </div>
                </div>

                {/* Modal footer tip */}
                <div className="pt-4 border-t border-[#eae3d2] flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                  <Info className="w-4.5 h-4.5 text-stone-400" />
                  <span>Analytics sync automatically with your connected social accounts</span>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
