"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, Plus, Shield, RefreshCw, AlertTriangle, CheckCircle2, 
  Trash2, Sliders, Sparkles, MessageSquare, Tag, Image as ImageIcon, 
  ChevronDown, ChevronUp, Clock, HelpCircle, ArrowRight, Check, X, Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

import { Instagram, Linkedin, Facebook, Youtube } from "./dashboard-page";

// Custom Pinterest SVG
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.958 1.406-5.958s-.359-.72-.359-1.781c0-1.663.967-2.906 2.17-2.906 1.023 0 1.517.769 1.517 1.689 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.169 1.775 2.169 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.061-4.869-5.007-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.031.395 2.138.89 2.738.1.12.115.22.085.344-.09.384-.291 1.185-.33 1.348-.05.213-.169.258-.389.156-1.451-.676-2.361-2.796-2.361-4.49 0-3.66 2.661-7.02 7.67-7.02 4.027 0 7.157 2.87 7.157 6.707 0 4.004-2.52 7.227-6.015 7.227-1.176 0-2.28-.611-2.656-1.334 0 0-.58 2.21-.72 2.752-.26 1.002-.962 2.259-1.43 3.018 1.121.347 2.308.535 3.535.535 6.62 0 11.988-5.367 11.988-11.988C24 5.367 18.638 0 12.017 0z"/>
    </svg>
  );
}

// Custom TikTok SVG
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.19 1.11 1.25 2.62 2.07 4.22 2.37v3.89c-1.84-.03-3.64-.59-5.19-1.61-.26-.17-.51-.36-.75-.56v6.92c.04 2.1-.51 4.21-1.65 5.92-1.35 1.94-3.52 3.32-5.87 3.73-2.59.48-5.36-.18-7.38-1.85-2.24-1.85-3.51-4.71-3.37-7.6.1-2.63 1.34-5.15 3.37-6.84 2.01-1.7 4.76-2.4 7.35-1.88 1 .2 1.94.61 2.76 1.2V.02zm-3.9 10.97c-.2-.03-.4-.05-.6-.05-1.57.03-3.08.83-3.88 2.18-.87 1.4-1.02 3.19-.39 4.7.57 1.44 1.91 2.5 3.44 2.74 1.63.29 3.37-.17 4.54-1.32 1.28-1.2 1.9-3.04 1.69-4.83v-6.07c-.45.3-.92.56-1.42.77-1 .44-2.11.64-3.19.53l-.19-.05v1.13z"/>
    </svg>
  );
}

interface AccountConfig {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  postsThisMonth: number;
  status: "connected" | "needs_reauth" | "error";
  errorDetail?: string;
  brandColor: string;
  glowColor: string;
  icon: JSX.Element;
  textClass: string;
}

const ALL_PLATFORMS_DATA = [
  { 
    id: "instagram", 
    name: "Instagram Business", 
    handle: "@trendwave_lifestyle", 
    avatar: "https://picsum.photos/seed/insta-logo-avatar/150/150",
    followers: "124.5K", 
    postsThisMonth: 18,
    status: "connected" as const,
    brandColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.2)",
    icon: <Instagram className="w-5 h-5 text-pink-500" />,
    textClass: "text-pink-500"
  },
  { 
    id: "linkedin", 
    name: "LinkedIn Page", 
    handle: "Trend Wave Organics Inc.", 
    avatar: "https://picsum.photos/seed/linkedin-logo-avatar/150/150",
    followers: "14.3K", 
    postsThisMonth: 12,
    status: "connected" as const,
    brandColor: "#0077b5",
    glowColor: "rgba(0, 119, 181, 0.2)",
    icon: <Linkedin className="w-5 h-5 text-blue-600" />,
    textClass: "text-blue-600"
  },
  { 
    id: "facebook", 
    name: "Facebook Global Page", 
    handle: "Trend Wave Green Co.", 
    avatar: "https://picsum.photos/seed/fb-logo-avatar/150/150",
    followers: "82.1K", 
    postsThisMonth: 14,
    status: "needs_reauth" as const,
    brandColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.2)",
    icon: <Facebook className="w-5 h-5 text-blue-700" />,
    textClass: "text-blue-700"
  },
  { 
    id: "youtube", 
    name: "YouTube Brand Channel", 
    handle: "Trend Wave Solutions", 
    avatar: "https://picsum.photos/seed/yt-logo-avatar/150/150",
    followers: "425K", 
    postsThisMonth: 6,
    status: "error" as const,
    errorDetail: "Secret API token expired by OAuth policy (Code: 403_STALE_REFRESH).",
    brandColor: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.2)",
    icon: <Youtube className="w-5 h-5 text-red-600" />,
    textClass: "text-red-500"
  },
  { 
    id: "tiktok", 
    name: "TikTok Creator Account", 
    handle: "@trendwave_gardening", 
    avatar: "https://picsum.photos/seed/tiktok-logo-avatar/150/150",
    followers: "318.2K", 
    postsThisMonth: 22,
    status: "needs_reauth" as const,
    brandColor: "#111111",
    glowColor: "rgba(24, 24, 27, 0.2)",
    icon: <TikTokIcon className="w-5 h-5 text-stone-900" />,
    textClass: "text-neutral-800"
  },
  { 
    id: "pinterest", 
    name: "Pinterest Boards", 
    handle: "@trendwave_pins", 
    avatar: "https://picsum.photos/seed/pin-logo-avatar/150/150",
    followers: "8.9K", 
    postsThisMonth: 15,
    status: "connected" as const,
    brandColor: "#e60023",
    glowColor: "rgba(230, 0, 35, 0.2)",
    icon: <PinterestIcon className="w-5 h-5 text-rose-600" />,
    textClass: "text-rose-600"
  }
];

// Presets for scheduled posts inside disconnection warning
const SIMULATED_AFFECTED_SCHEDULED_POSTS: Record<string, Array<{title: string, date: string}>> = {
  instagram: [
    { title: "Essential Minerals Guide", date: "Tomorrow, 08:00 AM UTC" },
    { title: "Organic Watering Hacks", date: "June 25, 06:00 PM UTC" }
  ],
  linkedin: [
    { title: "B2B Organic Sustainable Supply Pipeline Brief", date: "June 24, 10:00 AM UTC" }
  ],
  facebook: [
    { title: "Summer Harvest Q&A Stream Announcement", date: "Tomorrow, 12:00 PM UTC" }
  ],
  youtube: [
    { title: "How to Build an Automatic Drip Line [Shorts]", date: "June 26, 08:00 PM UTC" }
  ],
  tiktok: [
    { title: "3 Quick Soil Aeration Tricks #shorts #foryou", date: "Tomorrow, 07:00 PM UTC" }
  ],
  pinterest: [
    { title: "Companion Planting Cheat Sheet Infographic", date: "June 27, 04:00 PM UTC" }
  ]
};

export default function TrendWaveAccounts() {
  
  // Array of currently linked accounts
  const [connectedList, setConnectedList] = useState<AccountConfig[]>([
    ALL_PLATFORMS_DATA[0], // Instagram
    ALL_PLATFORMS_DATA[1], // LinkedIn
    ALL_PLATFORMS_DATA[2], // Facebook (needs_reauth)
    ALL_PLATFORMS_DATA[3]  // YouTube (error)
  ]);

  // Activity events log
  const [logs, setLogs] = useState<Array<{ id: string; msg: string; time: string; type: "success" | "warning" | "error" | "info" }>>([
    { id: "log-1", msg: "Instagram accounts synchronized successfully with your profile", time: "10 mins ago", type: "success" },
    { id: "log-2", msg: "LinkedIn connection checked and refreshed automatically", time: "1 hour ago", type: "success" },
    { id: "log-3", msg: "YouTube connection expired: Please sign in again to refresh access", time: "3 hours ago", type: "error" },
    { id: "log-4", msg: "Facebook requires quick manual authorization to publish", time: "6 hours ago", type: "warning" }
  ]);
  const [isLogsCollapsed, setIsLogsCollapsed] = useState(false);

  // Connection settings panel states nested per platform
  const [activeDefaultsCard, setActiveDefaultsCard] = useState<string | null>(null);

  // Defaults form values
  const [defaultsState, setDefaultsState] = useState<Record<string, { tone: string; hashtags: string; tag: string; watermark: boolean }>>({
    instagram: { tone: "Inspiring & Friendly", hashtags: "#organiclife #consciousgardening #trendwave", tag: "General Public", watermark: true },
    linkedin: { tone: "Professional & Scientific", hashtags: "#sustainableliving #b2borganics #environmental", tag: "Industry Partners", watermark: false },
    facebook: { tone: "Informative", hashtags: "#growyourown #gogreen #trendwave", tag: "Subscribers", watermark: true },
    youtube: { tone: "Educational & Energetic", hashtags: "#gardeningtip #howtostart #sustainablefarming", tag: "All Ages", watermark: true }
  });

  // Action / Kebab Menu active index
  const [activeKebabMenu, setActiveKebabMenu] = useState<string | null>(null);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [platformToDisconnect, setPlatformToDisconnect] = useState<AccountConfig | null>(null);

  // OAuth Simulation state
  const [simulatingOAuth, setSimulatingOAuth] = useState<string | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<AccountConfig | null>(null);

  // Action status notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addLogEvent = (msg: string, type: "success" | "warning" | "error" | "info") => {
    const newLog = {
      id: `log-${Date.now()}`,
      msg,
      time: "Just now",
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Re-verify current connections
  const handleReconnect = (account: AccountConfig) => {
    addLogEvent(`Reconnecting and updating permissions for ${account.name}...`, "info");
    
    // Quick simulation
    setSimulatingOAuth(account.id);
    setTimeout(() => {
      setConnectedList(prev => prev.map(item => {
        if (item.id === account.id) {
          return { ...item, status: "connected", errorDetail: undefined };
        }
        return item;
      }));
      setSimulatingOAuth(null);
      confetti({ particleCount: 30, spread: 35 });
      triggerToast(`Successfully reconnected and authorized ${account.name}!`);
      addLogEvent(`${account.name} successfully connected and active.`, "success");
    }, 1500);
  };

  // Disconnect confirmation action
  const confirmDisconnect = () => {
    if (!platformToDisconnect) return;
    const item = platformToDisconnect;
    setConnectedList(prev => prev.filter(c => c.id !== item.id));
    addLogEvent(`${item.name} profile connection destroyed. affected scheduled publications flagged.`, "warning");
    triggerToast(`Disconnected ${item.name} from current Brand workspace.`);
    setIsDisconnectModalOpen(false);
    setPlatformToDisconnect(null);
  };

  // Connect new or disabled platform from either modal or row
  const startOAuthFlow = (id: string) => {
    const matched = ALL_PLATFORMS_DATA.find(p => p.id === id);
    if (!matched) return;
    
    setIsConnectModalOpen(false);
    setSimulatingOAuth(id);

    setTimeout(() => {
      // Create new fresh state clone
      const newAcc: AccountConfig = {
        ...matched,
        status: "connected",
        errorDetail: undefined
      };

      // Add to connected list if not already present
      setConnectedList(prev => {
        if (prev.some(x => x.id === id)) {
          // If already inside list but in degraded state, restore it
          return prev.map(x => x.id === id ? newAcc : x);
        } else {
          return [...prev, newAcc];
        }
      });

      // Default init for default values
      if (!defaultsState[id]) {
        setDefaultsState(prev => ({
          ...prev,
          [id]: { tone: "Friendly & Casual", hashtags: `#${id}style #consciousliving`, tag: "General Followers", watermark: true }
        }));
      }

      setSimulationSuccess(newAcc);
      setSimulatingOAuth(null);
      confetti({ particleCount: 60, spread: 50 });
      addLogEvent(`Connected new authorization channel for ${newAcc.name} handled as ${newAcc.handle}`, "success");
      
      // Clean success overlay after 2.5s
      setTimeout(() => {
        setSimulationSuccess(null);
      }, 2500);

    }, 2000);
  };

  const handleUpdateDefaults = (id: string, field: string, value: any) => {
    setDefaultsState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveDefaultsWithSuccess = (id: string) => {
    confetti({ particleCount: 15, spread: 20 });
    triggerToast(`Saved custom posting defaults for ${id.toUpperCase()}`);
    setActiveDefaultsCard(null);
  };

  // Get currently unconnected platforms
  const unconnectedPlatforms = ALL_PLATFORMS_DATA.filter(
    item => !connectedList.some(conn => conn.id === item.id)
  );

  return (
    <div className="space-y-6">

      {/* FLOATING SUCCESS NOTIFICATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#042F1A] border-2 border-[#C5E729] text-[#FAF6EE] px-5 py-3 rounded-2xl shadow-2xl z-[99999] flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C5E729]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SATISFYING NEW CONNECTION SUCCESS OVERLAY MODAL */}
      <AnimatePresence>
        {simulationSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-[#117644] p-8 rounded-3xl text-center max-w-sm w-full space-y-5 shadow-2xl"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                <Check className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-widest block">OAUTH COMPLETED AUTHORIZED</span>
                <h3 className="font-serif font-black text-lg text-[#042F1A]">Satisfaction Connected!</h3>
                <p className="text-xs text-stone-500 leading-normal">
                  Successfully synchronized <span className="font-bold text-stone-700">{simulationSuccess.name}</span> with secure Trend Wave background workers.
                </p>
              </div>

              <div className="p-3 bg-[#FAF5EB] rounded-2xl border flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                  <img src={simulationSuccess.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-serif font-black text-xs block text-[#042F1A]">{simulationSuccess.handle}</span>
                  <span className="text-[8.5px] font-mono uppercase text-stone-400">FOLLOWERS: {simulationSuccess.followers}</span>
                </div>
              </div>

              <div className="text-[9px] text-[#117644] font-mono uppercase font-bold tracking-wider animate-pulse pt-2">
                Integrating workspace feed logs...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAUTH LOADING SPINNER SIMULATION OVERLAY */}
      <AnimatePresence>
        {simulatingOAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-3xs z-[100000] flex items-center justify-center p-4"
          >
            <div className="bg-[#FAF5EB] border-2 border-[#eae3d2] p-6 rounded-2xl max-w-xs text-center space-y-4 shadow-xl">
              <Loader2 className="w-10 h-10 text-[#117644] animate-spin mx-auto" />
              <div className="space-y-1">
                <span className="block text-[8px] font-mono font-black uppercase text-[#117644] tracking-widest">Awaiting OAuth Handshake</span>
                <h4 className="font-serif font-black text-xs text-[#042F1A]">Connecting Secure Tunnel...</h4>
                <p className="text-[10px] text-stone-500">Communicating with official web authorization endpoints.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1 — HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-[#eae3d2] text-left">
        <div>
          <h1 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">
            Connected Accounts.
          </h1>
          <p className="text-xs text-[#042F1A]/60 font-medium">
            Manage your certified social media api connections, reauthorize expired tokens, and set global campaign posting defaults.
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="py-2.5 px-4 bg-[#117644] text-[#FAF6EE] hover:bg-[#042F1A] rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-[#C5E729]" />
          <span>Connect New Account</span>
        </button>
      </div>

      {/* SECTION 2 — CONNECTED ACCOUNTS GRID */}
      <div className="space-y-4.5">
        <div className="text-left">
          <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block font-bold">Active bound profiles</span>
          <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Your Brand Workspace Holdings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {connectedList.map((account) => {
              const hasDefaultsOpen = activeDefaultsCard === account.id;
              const hasKebabOpen = activeKebabMenu === account.id;

              return (
                <motion.div
                  key={account.id}
                  layoutId={`account-card-${account.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-2 border-[#eae3d2] hover:border-neutral-800 rounded-3xl p-5 text-left flex flex-col justify-between transition-all duration-300 relative group"
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                  }}
                  whileHover={{ 
                    y: -3, 
                    boxShadow: `0 10px 15px -3px ${account.glowColor}, 0 4px 6px -2px ${account.glowColor}`,
                    borderColor: account.brandColor 
                  }}
                >
                  
                  {/* Top line with picture & profile handle & kebab button */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between relative">
                      <div className="flex items-center gap-3">
                        {/* Profile avatar thumbnail with small platform icon overlay inside */}
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-neutral-150 bg-stone-50 flex-shrink-0">
                          <img 
                            src={account.avatar} 
                            alt={account.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-xs text-[10px] scale-90 translate-x-1 translate-y-1">
                            {account.icon}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif font-black text-xs text-[#042F1A] line-clamp-1">{account.name}</h4>
                          <span className="text-[10px] font-mono font-bold text-stone-400 block">{account.handle}</span>
                        </div>
                      </div>

                      {/* Action dropdown Kebab button */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveKebabMenu(hasKebabOpen ? null : account.id)}
                          className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {hasKebabOpen && (
                            <>
                              <div className="fixed inset-0 z-35" onClick={() => setActiveKebabMenu(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                className="absolute right-0 mt-1 w-44 bg-[#FAF5EB] border-2 border-[#eae3d2] rounded-2xl shadow-xl z-40 p-1 text-left overflow-hidden divide-y"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setActiveKebabMenu(null);
                                      setActiveDefaultsCard(hasDefaultsOpen ? null : account.id);
                                    }}
                                    className="w-full px-3 py-1.8 text-[10px] font-bold uppercase text-[#042F1A] hover:bg-stone-50 flex items-center gap-1.5 transition-colors text-left"
                                  >
                                    <Sliders className="w-3.5 h-3.5 text-stone-500" />
                                    <span>{hasDefaultsOpen ? "Hide Defaults" : "Set Defaults"}</span>
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setActiveKebabMenu(null);
                                      setPlatformToDisconnect(account);
                                      setIsDisconnectModalOpen(true);
                                    }}
                                    className="w-full px-3 py-1.8 text-[10px] font-bold uppercase text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Disconnect</span>
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Connection status line / alert */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      {account.status === "connected" && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                          <span className="text-[10px] font-mono font-black uppercase text-emerald-700 tracking-wider">Connected</span>
                        </div>
                      )}

                      {account.status === "needs_reauth" && (
                        <div className="flex items-center gap-1.5">
                          {/* Gentle glowing looping pulsing amber status dot */}
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-mono font-black uppercase text-amber-700 tracking-wider">Reauth Needed</span>
                          </div>
                        </div>
                      )}

                      {account.status === "error" && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-[10px] font-mono font-black uppercase text-rose-700 tracking-wider">Connection Error</span>
                        </div>
                      )}

                      {/* Reconnect inline callback button */}
                      {account.status !== "connected" && (
                        <button
                          onClick={() => handleReconnect(account)}
                          className="px-2 py-1 bg-[#FAF5EB] hover:bg-[#117644] hover:text-white rounded-lg border text-[8.5px] font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1 text-stone-700"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Reconnect</span>
                        </button>
                      )}
                    </div>

                    {/* Error details tooltip look-alike banner if failure detected */}
                    {account.status === "error" && account.errorDetail && (
                      <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-150 flex items-start gap-1.5 text-[9.5px] text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{account.errorDetail}</span>
                      </div>
                    )}

                    {/* Stats metrics mini-row */}
                    <div className="grid grid-cols-2 gap-4 py-3 bg-[#FAF5EB]/40 rounded-2xl border px-3 text-stone-600 text-left font-sans text-2xs">
                      <div>
                        <span className="text-[8.5px] font-mono font-black text-stone-400 uppercase tracking-wider block">Followers</span>
                        <p className="text-xs font-black text-stone-800 mt-0.5">{account.followers}</p>
                      </div>
                      <div>
                        <span className="text-[8.5px] font-mono font-black text-stone-400 uppercase tracking-wider block">Posts This Month</span>
                        <p className="text-xs font-black text-stone-800 mt-0.5">{account.postsThisMonth}</p>
                      </div>
                    </div>
                  </div>

                  {/* Kebab action buttons for fast inlineDefaults editing */}
                  <div className="mt-4 pt-1 flex justify-between items-center text-stone-500 font-mono text-[9px]">
                    <button
                      onClick={() => setActiveDefaultsCard(hasDefaultsOpen ? null : account.id)}
                      className="text-[#117644] hover:underline font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{hasDefaultsOpen ? "Hide Defaults ▲" : "Posting Defaults ▼"}</span>
                    </button>
                    <span>ID: {account.id.toUpperCase()}</span>
                  </div>

                  {/* SECTION 3 — EXPANDABLE DEFAULTS PANEL */}
                  <AnimatePresence>
                    {hasDefaultsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden border-t mt-4 pt-4 space-y-3"
                      >
                        <span className="block text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest leading-none">
                          Configure {account.name} Rules
                        </span>

                        <div className="space-y-3.5 p-3.5 bg-[#FAF5EB]/50 border border-[#eae3d2] rounded-2xl text-[10px]">
                          {/* Default writing tone */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[8px] font-mono font-black uppercase tracking-wider text-stone-400">DEFAULT POSTING TONE</label>
                            <select
                              value={defaultsState[account.id]?.tone || "Friendly & Casual"}
                              onChange={(e) => handleUpdateDefaults(account.id, "tone", e.target.value)}
                              className="w-full text-[10.5px] bg-white border font-bold p-1.5 rounded-lg text-[#042F1A] focus:outline-[#117644]"
                            >
                              <option value="Inspiring & Friendly">Inspiring &amp; Friendly (Eco-vibe)</option>
                              <option value="Professional & Scientific">Professional &amp; Scientific (SaaS/B2B)</option>
                              <option value="Informative">Informative &amp; Calm</option>
                              <option value="Educational & Energetic">Educational / Tutorial Oriented</option>
                              <option value="Witty & Bold">Witty &amp; Bold</option>
                            </select>
                          </div>

                          {/* Default hashtags append */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[8px] font-mono font-black uppercase tracking-wider text-stone-400 block">AUTO-APPENDED HASHTAG SET</label>
                            <input
                              type="text"
                              value={defaultsState[account.id]?.hashtags || ""}
                              onChange={(e) => handleUpdateDefaults(account.id, "hashtags", e.target.value)}
                              className="w-full text-[10.5px] bg-white border font-mono p-1.5 rounded-lg text-stone-700"
                              placeholder="#yourhashtags #here"
                            />
                          </div>

                          {/* Target audience tag */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[8px] font-mono font-black uppercase tracking-wider text-stone-400 block">DEFAULT AUDIENCE SEGMENT</label>
                            <input
                              type="text"
                              value={defaultsState[account.id]?.tag || ""}
                              onChange={(e) => handleUpdateDefaults(account.id, "tag", e.target.value)}
                              className="w-full text-[10.5px] bg-white border font-bold p-1.5 rounded-lg text-[#042F1A]"
                              placeholder="e.g. Backyard Gardeners"
                            />
                          </div>

                          {/* Auto watermark toggle */}
                          <div className="flex items-center justify-between pt-1 border-t">
                            <div className="flex items-center gap-1.5 text-left">
                              <ImageIcon className="w-3.5 h-3.5 text-[#117644]" />
                              <div>
                                <span className="block font-bold text-[#042F1A] leading-none text-[9.5px]">Auto Watermark</span>
                                <span className="text-[7.5px] text-stone-400 font-mono">APPEND EMBEDDED TREND WAVE LOGO</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleUpdateDefaults(account.id, "watermark", !defaultsState[account.id]?.watermark)}
                              className={`w-7 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                                defaultsState[account.id]?.watermark ? "bg-[#117644]" : "bg-stone-200"
                              }`}
                            >
                              <div className={`h-3.5 w-3.5 rounded-full bg-white transition-all transform ${
                                defaultsState[account.id]?.watermark ? "translate-x-2.5" : "translate-x-0"
                              }`} />
                            </button>
                          </div>

                          {/* Submit callback trigger */}
                          <button
                            onClick={() => saveDefaultsWithSuccess(account.id)}
                            className="w-full mt-2.5 py-1.8 bg-[#117644] text-[#FAF6EE] rounded-xl text-[9px] uppercase font-black tracking-widest text-center"
                          >
                            Save Account Settings
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 4 — AVAILABLE INTEGRATIONS (UNBOUND PLATFORMS) */}
      <div className="space-y-4 pt-4 border-t border-dashed">
        <div className="text-left">
          <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block font-bold">Expand your impact coverage</span>
          <h3 className="font-serif font-black text-sm text-[#042F1A] mt-0.5">Integrate Additional Networks</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {unconnectedPlatforms.map((plat) => (
              <motion.div
                key={plat.id}
                layoutId={`account-card-${plat.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF5EB]/10 border-2 border-dashed border-[#eae3d2] hover:border-neutral-500 rounded-2xl p-4.5 text-center flex flex-col justify-between items-center space-y-3.5 transition-colors group relative"
              >
                <span className="p-2.5 bg-[#FAF5EB] rounded-full group-hover:scale-105 transition-transform" style={{ color: plat.brandColor }}>
                  {plat.icon}
                </span>

                <div className="text-center">
                  <span className="text-[10px] font-serif font-black text-[#042F1A] block">{plat.name}</span>
                  <span className="text-[7.5px] font-mono uppercase text-stone-400">UNBOUND GATEWAY</span>
                </div>

                <button
                  onClick={() => startOAuthFlow(plat.id)}
                  className="w-full py-1.5 bg-white border hover:bg-[#FAF5EB] rounded-lg text-[9px] uppercase font-black tracking-widest text-[#117644] hover:border-[#117644] transition-colors cursor-pointer"
                >
                  Connect 
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 5 — CONNECTION ACTIVITY LOG */}
      <div className="bg-white border-2 border-[#eae3d2] rounded-3xl p-4 md:p-5 text-left">
        <button
          onClick={() => setIsLogsCollapsed(!isLogsCollapsed)}
          className="w-full flex items-center justify-between pb-1 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#117644]" />
            <span className="font-serif font-black text-xs text-[#042F1A]">
              Platform Authorization Activity Logs
            </span>
            <span className="text-[8px] font-mono bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full uppercase">
              {logs.length} EVENTS
            </span>
          </div>
          {isLogsCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <AnimatePresence>
          {!isLogsCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3.5 pt-3.5 border-t overflow-hidden space-y-2.5 max-h-48 overflow-y-auto"
            >
              {logs.map((log) => (
                <div key={log.id} className="flex justify-between items-start gap-4 text-[10px] font-sans">
                  <div className="flex items-start gap-2 text-stone-600">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      log.type === "success" ? "bg-emerald-500" :
                      log.type === "warning" ? "bg-amber-500" :
                      log.type === "error" ? "bg-rose-500" : "bg-blue-500"
                    }`} />
                    <span className="font-medium text-stone-700">{log.msg}</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-stone-400 uppercase whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL 1: PLATFORM OPTIONS SELECTION GRID (+ Connect New Account) */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[99000] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsConnectModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF5EB] border-2 border-[#eae3d2] p-6 rounded-3xl max-w-lg w-full text-left space-y-5 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[8.5px] font-mono font-black text-[#117644] uppercase tracking-widest block leading-none">
                    Multiplatform authentication
                  </span>
                  <h3 className="font-serif font-black text-[#042F1A] mt-1">Connect New Social Channel</h3>
                </div>
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {ALL_PLATFORMS_DATA.map((plat) => {
                  const alreadyChosen = connectedList.some(item => item.id === plat.id);
                  return (
                    <button
                      key={plat.id}
                      onClick={() => !alreadyChosen && startOAuthFlow(plat.id)}
                      disabled={alreadyChosen}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.02] shadow-3xs ${
                        alreadyChosen 
                          ? "bg-white border-neutral-100 opacity-50" 
                          : "bg-white border-[#eae3d2] hover:border-[#117644]"
                      }`}
                    >
                      <span className="p-2 bg-neutral-50 rounded-full mb-1" style={{ color: plat.brandColor }}>
                        {plat.icon}
                      </span>
                      <span className="text-[10px] font-serif font-black text-[#042F1A]">{plat.name}</span>
                      <span className={`text-[8px] font-mono px-1 rounded uppercase block font-bold ${
                        alreadyChosen 
                          ? "bg-emerald-50 text-emerald-800" 
                          : "bg-neutral-100 text-stone-500"
                      }`}>
                        {alreadyChosen ? "Bound" : "Unbound"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-white rounded-xl border flex items-start gap-2.5 text-left text-[10px] text-stone-500">
                <Shield className="w-4.5 h-4.5 text-[#117644] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  By completing authorize flows, you grant Trend Wave secure client credentials to dispatch automated campaigns. Connections may be fully disconnected at any time.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CONFIRM DISCONNECT (WARNING SCHEDULED POSTS LIST) */}
      <AnimatePresence>
        {isDisconnectModalOpen && platformToDisconnect && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[99000] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsDisconnectModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border-4 border-rose-500/30 p-6 rounded-3xl max-w-sm w-full text-left space-y-5 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-serif font-black text-[#042F1A]">Disconnect Channel?</h4>
                </div>
                <button
                  onClick={() => setIsDisconnectModalOpen(false)}
                  className="p-1 text-stone-300 hover:text-stone-500 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-stone-500 leading-normal">
                  Are you sure you want to disconnect <strong className="text-stone-700">{platformToDisconnect.name} ({platformToDisconnect.handle})</strong>?
                </p>
                <p className="text-[11px] text-red-650 leading-normal font-sans bg-red-50 p-2.5 rounded-xl border border-red-100 font-medium">
                  ⚠️ This action is irreversible. All tokens will be deleted immediately, and scheduled posts requiring this account cannot be published.
                </p>
              </div>

              {/* LIST OF AFFECTED SCHEDULED PUBLICATIONS */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-mono font-black text-[#117644] uppercase tracking-widest block leading-none">
                  Affected Scheduled Posts
                </span>
                
                <div className="max-h-24 overflow-y-auto border rounded-xl divide-y bg-stone-50 text-[10px]">
                  {SIMULATED_AFFECTED_SCHEDULED_POSTS[platformToDisconnect.id]?.length ? (
                    SIMULATED_AFFECTED_SCHEDULED_POSTS[platformToDisconnect.id].map((post, idx) => (
                      <div key={idx} className="p-2 flex justify-between items-center text-[#042F1A]">
                        <span className="font-black truncate max-w-[180px]">{post.title}</span>
                        <span className="text-[8px] font-mono text-amber-600 font-bold whitespace-nowrap select-none">{post.date}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-stone-400 font-mono text-[9px] uppercase">
                      No active publications will be affected.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsDisconnectModalOpen(false)}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDisconnect}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center"
                >
                  Confirm Disconnect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
