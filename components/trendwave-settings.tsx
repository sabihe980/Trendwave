"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Sliders, CreditCard, Users, Bell, Code, Trash2, 
  Sparkles, HelpCircle, Check, Copy, RefreshCw, Plus, Trash, Eye, 
  EyeOff, Loader2, Mail, ExternalLink, Calendar, FileText, Download, 
  CheckCircle, AlertCircle, Info, ChevronRight, CheckSquare, MessageSquare,
  Globe2, CheckSquare as CheckIcon, ToggleLeft, ToggleRight, Settings
} from "lucide-react";
import confetti from "canvas-confetti";

// Constant arrays of fonts & presets
const AVAILABLE_FONTS = [
  { id: "Space Grotesk", name: "Space Grotesk (Tech/Modern)", className: "font-sans font-medium" },
  { id: "Playfair Display", name: "Playfair Display (Serif/Editorial)", className: "font-serif font-black" },
  { id: "Inter", name: "Inter (Humanist/Clean)", className: "font-sans font-normal" },
  { id: "JetBrains Mono", name: "JetBrains Mono (Console/Developer)", className: "font-mono text-xs" },
  { id: "Outfit", name: "Outfit (Geometric/Rounded)", className: "font-sans tracking-wide font-extrabold" },
  { id: "Cinzel", name: "Cinzel (Classic/Formal)", className: "font-serif tracking-widest font-light" }
];

const TIMEZONES = [
  { id: "UTC", name: "UTC (Coordinated Universal Time) - UTC±00:00" },
  { id: "America/New_York", name: "Eastern (NY/Toronto) - UTC-05:00 / UTC-04:00" },
  { id: "America/Chicago", name: "Central (Chicago/Dallas) - UTC-06:00 / UTC-05:00" },
  { id: "America/Denver", name: "Mountain (Denver/Calgary) - UTC-07:00 / UTC-06:00" },
  { id: "America/Los_Angeles", name: "Pacific (LA/Seattle) - UTC-08:00 / UTC-07:00" },
  { id: "Europe/London", name: "London (GMT/BST) - UTC±00:00 / UTC+01:00" },
  { id: "Europe/Paris", name: "Central European (Paris/Berlin) - UTC+01:00 / UTC+02:00" },
  { id: "Asia/Singapore", name: "Singapore/Hong Kong - UTC+08:00" },
  { id: "Asia/Tokyo", name: "Tokyo Standard Time - UTC+09:00" },
  { id: "Australia/Sydney", name: "Sydney Standard - UTC+10:00 / UTC+11:00" }
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  avatar: string;
  lastActive: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  invitedAt: string;
}

export default function TrendWaveSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // DATABASE SETUP STATE VARIABLES
  const [dbPassword, setDbPassword] = useState("");
  const [customConnStr, setCustomConnStr] = useState("");
  const [migrating, setMigrating] = useState(false);
  const [migResult, setMigResult] = useState<any>(null);
  const [migError, setMigError] = useState("");
  
  // TOAST FEEDBACK STATE
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. --- TAB STATE: PROFILE ---
  const [userProfile, setUserProfile] = useState({
    name: "John Trend",
    email: "ksabih314@gmail.com",
    avatar: "https://picsum.photos/seed/trendjohn/150/150",
    timezone: "America/New_York",
    language: "en-US",
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPassword: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // 2. --- TAB STATE: BRAND KIT ---
  const [brandColors, setBrandColors] = useState<string[]>([
    "#042F1A", "#117644", "#C5E729", "#FAF5EB", "#FFFFFF", "#eae3d2"
  ]);
  const [brandHeadingFont, setBrandHeadingFont] = useState("Space Grotesk");
  const [brandBodyFont, setBrandBodyFont] = useState("Inter");
  const [brandLogo, setBrandLogo] = useState<string>("https://picsum.photos/seed/brandlogo99/120/120");
  const [logoPosition, setLogoPosition] = useState<number>(8); // default to bottom-right (index 8/grid 3x3)
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState<number | null>(null);

  // Load Brand Kit from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColors = localStorage.getItem("trendwave_brand_colors");
      const savedHeading = localStorage.getItem("trendwave_brand_heading");
      const savedBody = localStorage.getItem("trendwave_brand_body");
      const savedLogo = localStorage.getItem("trendwave_brand_logo");
      const savedPos = localStorage.getItem("trendwave_brand_logo_pos");

      if (savedColors) {
        try { setBrandColors(JSON.parse(savedColors)); } catch(e) {}
      }
      if (savedHeading) setBrandHeadingFont(savedHeading);
      if (savedBody) setBrandBodyFont(savedBody);
      if (savedLogo) setBrandLogo(savedLogo);
      if (savedPos) setLogoPosition(parseInt(savedPos, 10));
    }
  }, []);

  // Save Brand Kit to LocalStorage & notify
  const handleSaveBrandKit = () => {
    localStorage.setItem("trendwave_brand_colors", JSON.stringify(brandColors));
    localStorage.setItem("trendwave_brand_heading", brandHeadingFont);
    localStorage.setItem("trendwave_brand_body", brandBodyFont);
    localStorage.setItem("trendwave_brand_logo", brandLogo);
    localStorage.setItem("trendwave_brand_logo_pos", logoPosition.toString());
    
    confetti({ particleCount: 30, spread: 40 });
    showToast("Brand Kit synced and stored. Available immediately in Creative Kit (Page 9)!", "success");
  };

  // 3. --- TAB STATE: BILLING & PLANS ---
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [meterTrigger, setMeterTrigger] = useState(false); // Used to re-trigger bar animation

  // Trigger meter animation whenever billing tab becomes active
  useEffect(() => {
    if (activeTab === "billing") {
      setMeterTrigger(false);
      const t = setTimeout(() => setMeterTrigger(true), 50);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  const [currentPlan, setCurrentPlan] = useState({
    name: "Trend Wave Professional Premium",
    price: "$79/mo",
    renewalDate: "July 24, 2026",
    paymentMethod: { type: "visa", last4: "4921", exp: "12/28" }
  });

  // Mock usage numbers
  const billingStats = [
    { name: "Posts Scheduled This Month", used: 114, limit: 150, color: "emerald", unit: "" },
    { name: "AI Generations Used", used: 462, limit: 500, color: "amber", unit: "" },
    { name: "Creative Kit Generations Used", used: 18, limit: 100, color: "emerald", unit: "" },
    { name: "Connected Channel Accounts", used: 4, limit: 6, color: "amber", unit: "" },
  ];

  const billingHistory = [
    { date: "June 24, 2026", amount: "$79.00", status: "Paid", id: "INV-2026-006" },
    { date: "May 24, 2026", amount: "$79.00", status: "Paid", id: "INV-2026-005" },
    { date: "April 24, 2026", amount: "$79.00", status: "Paid", id: "INV-2026-004" },
    { date: "March 24, 2026", amount: "$79.00", status: "Paid", id: "INV-2026-003" },
  ];

  // 4. --- TAB STATE: TEAM & PERMISSIONS ---
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "m1", name: "John Trend", email: "ksabih314@gmail.com", role: "Owner", avatar: "https://picsum.photos/seed/m1av/100/100", lastActive: "Active now" },
    { id: "m2", name: "Sarah Green", email: "s.green@trendwave.club", role: "Admin", avatar: "https://picsum.photos/seed/m2av/100/100", lastActive: "2 hours ago" },
    { id: "m3", name: "Alex Compost", email: "alex.c@trendwave.club", role: "Editor", avatar: "https://picsum.photos/seed/m3av/100/100", lastActive: "Yesterday" },
    { id: "m4", name: "Mia Sprout", email: "mia.sprout@trendwave.club", role: "Viewer", avatar: "https://picsum.photos/seed/m4av/100/100", lastActive: "3 days ago" },
  ]);

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    { id: "inv1", email: "growth@trendwave.club", role: "Editor", invitedAt: "June 19, 2026" },
    { id: "inv2", email: "seedling@trendwave.club", role: "Viewer", invitedAt: "June 20, 2026" }
  ]);

  const [hoveredRoleTooltip, setHoveredRoleTooltip] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Editor" as const, note: "" });

  const handleSendInvite = () => {
    if (!inviteForm.email) return;
    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: inviteForm.email,
      role: inviteForm.role,
      invitedAt: "Today"
    };
    setPendingInvites(prev => [...prev, newInvite]);
    setIsInviteModalOpen(false);
    setInviteForm({ email: "", role: "Editor", note: "" });
    showToast(`Invitation dispatched to ${newInvite.email}!`, "success");
  };

  const handleRemoveMember = (id: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast(`Removed ${name} from Brand workspace holdings.`, "info");
  };

  const handleRevokeInvite = (id: string, email: string) => {
    setPendingInvites(prev => prev.filter(inv => inv.id !== id));
    showToast(`Revoked pending invitation for ${email}`, "info");
  };

  const handleResendInvite = (email: string) => {
    showToast(`Re-dispatched invitation ping to ${email}`, "success");
  };

  // 5. --- TAB STATE: NOTIFICATIONS GRID ---
  // Rows: Post Published, Post Failed, Scheduled Post Reminder, Weekly Performance Summary, Team Activity, Product Updates
  // Columns: Email, Push, In-App
  const [notificationConfig, setNotificationConfig] = useState<Record<string, { email: boolean; push: boolean; app: boolean }>>({
    published: { email: true, push: false, app: true },
    failed: { email: true, push: true, app: true },
    reminder: { email: false, push: true, app: true },
    weekly: { email: true, push: false, app: false },
    team: { email: false, push: false, app: true },
    product: { email: true, push: false, app: false }
  });

  const handleToggleNotification = (rowKey: string, colKey: "email" | "push" | "app") => {
    setNotificationConfig(prev => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [colKey]: !prev[rowKey][colKey]
      }
    }));
  };

  // Toggle helpers
  const toggleSwitchAnimation = (val: boolean) => (
    <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all relative cursor-pointer ${val ? "bg-[#117644]" : "bg-neutral-200"}`}>
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
        style={{ left: val ? "calc(100% - 15px)" : "0px", position: "absolute" }}
      />
    </div>
  );

  // 6. --- TAB STATE: API & INTEGRATIONS ---
  const [apiKey, setApiKey] = useState("tw_live_73f9b20e11894a737f284eaccee1348bca6120");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [showKeyRegenConfirm, setShowKeyRegenConfirm] = useState(false);
  
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourdomain.com/webhooks/trendwave");
  const [webhookLogs, setWebhookLogs] = useState<Array<{ id: string; time: string; event: string; status: number }>>([
    { id: "wh-1", time: "2 hrs ago", event: "post.published", status: 200 },
    { id: "wh-2", time: "1 day ago", event: "post.failed", status: 500 }
  ]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const simulateWebhookPayload = () => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      const newWh = {
        id: `wh-${Date.now()}`,
        time: "Just now",
        event: "test.diagnostic_ping",
        status: 200
      };
      setWebhookLogs(prev => [newWh, ...prev]);
      setIsSimulatingWebhook(false);
      showToast("Diagnostic webhook delivered. Target server responded standard code 200 (SUCCESS).", "success");
      confetti({ particleCount: 15, spread: 25 });
    }, 1500);
  };

  const regenerateApiKey = () => {
    setIsRegeneratingKey(true);
    setShowKeyRegenConfirm(false);
    setTimeout(() => {
      const entropy = Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
      setApiKey(`sg_live_${entropy}`);
      setIsRegeneratingKey(false);
      showToast("API Access credentials re-seeded successfully.", "success");
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!", "success");
    }
  };

  // 7. --- TAB STATE: DANGER ZONE ---
  const [confirmModalType, setConfirmModalType] = useState<"export" | "deactivate" | "delete" | null>(null);
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const REQUIRED_CONFIRM_TEXT = "ksabih314@gmail.com";

  const executeDangerAction = () => {
    if (typedConfirmation !== REQUIRED_CONFIRM_TEXT) return;
    
    const actionName = confirmModalType === "export" ? "Data Package Exported" :
                       confirmModalType === "deactivate" ? "Account Deactivated" : "Account Deleted";
    
    showToast(`Authorized! ${actionName} initiated.`, "success");
    setConfirmModalType(null);
    setTypedConfirmation("");
  };

  const renderRoleTooltip = (role: string) => {
    const desc: Record<string, string> = {
      Owner: "Full access to brand assets, billing information, team management, and connected social accounts.",
      Admin: "Can customize all brand settings and publish content, but cannot edit billing methods.",
      Editor: "Can write captions, upload media, schedule posts on the calendar, and customize brand assets.",
      Viewer: "Read-only access to view charts and scheduled posts. Cannot create drafts or publish content."
    };
    return desc[role] || "";
  };


  return (
    <div className="space-y-6 relative">
      {/* GLOBAL BANNER NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl shadow-2xl z-[99999] flex items-center gap-3 text-xs font-semibold border-2 ${
              toast.type === "success" 
                ? "bg-[#042F1A] border-[#C5E729] text-white" 
                : "bg-stone-900 border-stone-700 text-white"
            }`}
          >
            <CheckCircle className="w-4 h-4 text-[#C5E729]" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-[#eae3d2] text-left">
        <div>
          <h1 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">
            Settings &amp; Workspaces.
          </h1>
          <p className="text-xs text-[#042F1A]/60 font-medium">
            Fine-tune dispatch schedules, brand aesthetics typography, invoice history, team roles, and webhook integrations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#117644] bg-[#FAF5EB] px-3 py-1.5 rounded-xl border border-[#eae3d2]">
          <Settings className="w-3.5 h-3.5 animate-spin" />
          <span>PRO CONSOLE ACTIVE</span>
        </div>
      </div>

      {/* DB Setup Reminder Alert to make it extremely visible as requested */}
      {activeTab !== "database" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left shadow-xs"
        >
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-700 border border-amber-200">
              <RefreshCw className="w-4 h-4 animate-spin-slow text-amber-600" />
            </div>
            <div>
              <h4 className="font-serif font-black text-xs text-amber-950">Supabase Database Setup Recommended</h4>
              <p className="text-[11px] text-amber-900/80 leading-relaxed mt-0.5">
                Execute schema tables, triggers, and migrations directly onto your live Supabase database instance with a single click.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("database");
              confetti({ particleCount: 30, spread: 40 });
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Configure Supabase Connection →
          </button>
        </motion.div>
      )}

      {/* CORE WRAPPER: SUB-NAVIGATION LEFT RAIL + CONTENT RIGHT SIDE */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT RAIL NAVIGATION PANEL */}
        <div className="w-full lg:w-64 bg-[#FAF5EB]/50 border-2 border-[#eae3d2] rounded-3xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible shrink-0 scrollbar-none">
          {[
            { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
            { id: "brand", label: "Brand Kit", icon: <Sliders className="w-4 h-4" /> },
            { id: "billing", label: "Billing & Plan", icon: <CreditCard className="w-4 h-4" /> },
            { id: "team", label: "Team & Roles", icon: <Users className="w-4 h-4" /> },
            { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
            { id: "api", label: "API & Webhooks", icon: <Code className="w-4 h-4" /> },
            { id: "database", label: "Database Setup ⚡", icon: <RefreshCw className="w-4 h-4 text-emerald-600" />, textClass: "text-[#117644] font-black" },
            { id: "danger", label: "Danger Zone", icon: <Trash2 className="w-4 h-4 text-rose-600" />, textClass: "text-rose-700 font-bold" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "billing") {
                    setMeterTrigger(false);
                    setTimeout(() => setMeterTrigger(true), 100);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-2.8 rounded-xl text-xs font-extrabold transition-all text-left whitespace-nowrap cursor-pointer flex-1 lg:flex-none ${
                  isSelected
                    ? "bg-[#117644] text-[#FAF6EE] shadow-sm transform translate-x-1"
                    : "hover:bg-[#FAF5EB] text-stone-600 hover:text-[#042F1A]"
                }`}
              >
                <span className={isSelected ? "text-[#C5E729]" : "text-stone-400"}>
                  {tab.icon}
                </span>
                <span className={tab.textClass || ""}>{tab.label}</span>
                <ChevronRight className={`w-3 h-3 ml-auto hidden lg:block transition-transform ${
                  isSelected ? "opacity-100 rotate-90 text-[#C5E729]" : "opacity-0"
                }`} />
              </button>
            );
          })}
        </div>

        {/* RIGHT PANEL: DISPLAY AREA WITH INTERACTIVE SMOOTH CROSSFADE */}
        <div className="flex-1 w-full min-h-[550px] relative">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: USER PROFILE PREFERENCES */}
            {activeTab === "profile" && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div>
                  <h3 className="font-serif font-black text-lg text-[#042F1A]">Workspace Administrator Profile</h3>
                  <p className="text-xs text-stone-500">Update personalized information, localize system timestamps, or seed secure private key resets.</p>
                </div>

                {/* Avatar upload section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-stone-100">
                  <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-[#117644] cursor-pointer bg-stone-50">
                    <img 
                      src={userProfile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[9px] text-[#C5E729] font-black uppercase tracking-wider text-center p-1 leading-none select-none">
                      <Plus className="w-4 h-4 mb-0.5 text-white" />
                      <span>Change photo</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-widest block font-bold">PROFILE AVATAR AV-7</span>
                    <h4 className="font-serif font-black text-xs text-[#042F1A]">{userProfile.name}</h4>
                    <p className="text-[10px] text-stone-500 font-mono">JPG, PNG, or GIF. Max payload 4MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">YOUR FULL NAME</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-semibold text-[#042F1A] p-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">CORRESPONDENCE EMAIL</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={e => setUserProfile(p => ({ ...p, email: e.target.value }))}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-semibold text-[#042F1A] p-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  {/* Timezone Selector with tooltipped explanation */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">TIMEZONE LOCALIZATION</label>
                      <div className="relative group">
                        <Info className="w-3.5 h-3.5 text-stone-400 hover:text-[#117644] cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 w-52 p-2 bg-stone-900 text-[9.5px] text-[#FAF5EB] font-serif font-light leading-normal rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50">
                          📌 CRITICAL: This parameter governs all dispatch intervals, optimal publishing heatmap hours, and scheduled slots!
                        </div>
                      </div>
                    </div>
                    <select
                      value={userProfile.timezone}
                      onChange={e => {
                        setUserProfile(p => ({ ...p, timezone: e.target.value }));
                        showToast(`Timezone offset recalculated for ${e.target.value}`, "info");
                      }}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-bold text-[#042F1A] p-2.5 rounded-xl focus:outline-[#117644]"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.id} value={tz.id}>{tz.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">SYSTEM LANGUAGE</label>
                    <select
                      value={userProfile.language}
                      onChange={e => setUserProfile(p => ({ ...p, language: e.target.value }))}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-bold text-[#042F1A] p-2.5 rounded-xl focus:outline-[#117644]"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="es-ES">Español (Castellano)</option>
                      <option value="fr-FR">Français (Standard)</option>
                      <option value="de-DE">Deutsch (Deutschland)</option>
                      <option value="ja-JP">日本語 (Standard)</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible password section */}
                <div className="border border-[#eae3d2] rounded-2xl p-4.5 bg-[#FAF5EB]/35 space-y-4">
                  <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#117644]" />
                      <span className="font-serif font-black text-xs text-[#042F1A]">Change Private Access Password</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-[#117644]/10 text-[#117644] px-2 py-0.8 rounded-md font-bold">
                      {showPasswordSection ? "HIDE OPTIONS ▲" : "EXPAND OPTIONS ▼"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showPasswordSection && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-3 pt-2"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">CURRENT PASSWORD</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={passwords.current}
                              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                              className="w-full text-xs bg-white border font-mono p-2 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">NEW PASSWORD</label>
                            <input
                              type="password"
                              value={passwords.newPassword}
                              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                              className="w-full text-xs bg-white border font-mono p-2 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">CONFIRM NEW PASSWORD</label>
                            <input
                              type="password"
                              value={passwords.confirm}
                              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                              className="w-full text-xs bg-white border font-mono p-2 rounded-lg"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!passwords.current || !passwords.newPassword) {
                              showToast("Please enter inputs completely.", "info");
                              return;
                            }
                            if (passwords.newPassword !== passwords.confirm) {
                              showToast("Passwords mismatch! Re-verify typing.", "info");
                              return;
                            }
                            setSavingProfile(true);
                            setTimeout(() => {
                              setSavingProfile(false);
                              setPasswords({ current: "", newPassword: "", confirm: "" });
                              setShowPasswordSection(false);
                              showToast("Access keys successfully cycled.", "success");
                            }, 1200);
                          }}
                          disabled={savingProfile}
                          className="py-1.8 px-4 bg-[#117644] text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          {savingProfile ? "SAVING..." : "COMMIT KEY SWAP"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <button
                    onClick={() => {
                      confetti({ particleCount: 20 });
                      showToast("Developer profile settings persisted natively.", "success");
                    }}
                    className="py-2.5 px-6 bg-[#117644] hover:bg-[#042F1A] text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: BRAND KIT */}
            {activeTab === "brand" && (
              <motion.div
                key="tab-brand"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div>
                  <h3 className="font-serif font-black text-lg text-[#042F1A]">Visual Identity &amp; Brand Kit</h3>
                  <p className="text-xs text-stone-500">
                    Fine-tune typography, color matrices, and logo watermarks. This kit feeds directly into <span className="font-bold text-[#117644]">Creative Kit&apos;s &quot;Use my Brand Colors &amp; Fonts&quot; model generators</span>!
                  </p>
                </div>

                {/* Row of Color Swatches */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">BRAND PALETTE COLOUR SEQUENCE</label>
                    <span className="text-[8px] font-mono text-emerald-800 uppercase px-1.5 py-0.5 bg-emerald-50 rounded font-bold">Dynamic Synchronization Active</span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
                    {brandColors.map((color, index) => (
                      <div key={index} className="relative group">
                        <div 
                          className="w-full h-12 rounded-2xl border-2 border-stone-200 cursor-pointer shadow-3xs flex items-center justify-center text-xs transition-transform group-hover:scale-[1.03] group-hover:border-stone-800"
                          style={{ backgroundColor: color }}
                          onClick={() => setActiveColorPickerIndex(activeColorPickerIndex === index ? null : index)}
                        >
                          <span className="px-1 py-0.5 bg-white/70 backdrop-blur-2xs rounded text-[9px] font-mono font-bold border truncate max-w-[80%] uppercase">
                            {color}
                          </span>
                        </div>

                        {/* Inline Color Picker Popover */}
                        <AnimatePresence>
                          {activeColorPickerIndex === index && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveColorPickerIndex(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                className="absolute left-0 top-full mt-2 bg-white border rounded-2xl shadow-xl p-3 z-50 space-y-1.5 w-36 text-center"
                              >
                                <span className="text-[8px] font-mono font-bold block text-stone-400">CHOOSE INSTANCE COLOR</span>
                                <input
                                  type="color"
                                  value={color}
                                  onChange={e => {
                                    const next = [...brandColors];
                                    next[index] = e.target.value;
                                    setBrandColors(next);
                                  }}
                                  className="w-full h-7 border bg-transparent rounded cursor-pointer"
                                />
                                <div className="text-[8px] font-mono text-stone-400 uppercase leading-none">Index #{index+1}</div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (brandColors.length < 8) {
                          setBrandColors([...brandColors, "#C5E729"]);
                        } else {
                          showToast("Maximum palette resolution capped at 8 swatches.", "info");
                        }
                      }}
                      className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#117644] hover:text-white rounded-lg border text-[8.5px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      + Add Swatch
                    </button>
                    <button
                      onClick={() => {
                        if (brandColors.length > 3) {
                          setBrandColors(brandColors.slice(0, -1));
                        } else {
                          showToast("Keep at least 3 color dimensions to sustain generator logic.", "info");
                        }
                      }}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-600 hover:text-white text-red-650 rounded-lg border text-[8.5px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      - Remove Swatch
                    </button>
                  </div>
                </div>

                {/* Font pairing selectors (dropdowns with preview in item itself) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2 border-t pt-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">DISPLAY HEADING FONT PRESET</label>
                    <select
                      value={brandHeadingFont}
                      onChange={e => setBrandHeadingFont(e.target.value)}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-bold text-[#042F1A] p-2.5 rounded-xl focus:outline-[#117644]"
                    >
                      {AVAILABLE_FONTS.map(f => (
                        <option key={f.id} value={f.id} className={f.className}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    <div className="p-3 bg-[#FAF5EB]/40 rounded-xl border border-dashed text-stone-700">
                      <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block leading-none mb-1">Live Heading Preview</span>
                      <h3 style={{ fontFamily: brandHeadingFont }} className="font-serif font-black text-base text-[#042F1A]">
                        This is beautiful content styled with {brandHeadingFont}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400">BODY PARAGRAPH TYPOGRAPHY</label>
                    <select
                      value={brandBodyFont}
                      onChange={e => setBrandBodyFont(e.target.value)}
                      className="w-full text-xs bg-white border border-[#eae3d2] font-bold text-[#042F1A] p-2.5 rounded-xl focus:outline-[#117644]"
                    >
                      {AVAILABLE_FONTS.map(f => (
                        <option key={f.id} value={f.id} className={f.className}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    <div className="p-3 bg-[#FAF5EB]/40 rounded-xl border border-dashed text-stone-700">
                      <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block leading-none mb-1">Live Body Preview</span>
                      <p style={{ fontFamily: brandBodyFont }} className="text-2xs font-light leading-normal text-stone-600">
                        Lorem ipsum dolor sit amet, conscious gardeners water organic root structures dynamic.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logo upload (for watermarking Creative Kit assets), corner 3x3 selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t pt-5">
                  <div className="space-y-3 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">WATERMARK BRAND EMBLEM LOGO</label>
                    
                    <div className="flex items-center gap-4.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-neutral-150 bg-stone-50 flex-shrink-0">
                        <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={brandLogo}
                          onChange={e => setBrandLogo(e.target.value)}
                          className="text-[10px] bg-white border p-1 rounded font-mono w-full min-w-56"
                          placeholder="Logo URL or asset source"
                        />
                        <p className="text-[8.5px] text-stone-400">Paste secure CDN link. Standard bounds: 120x120px.</p>
                      </div>
                    </div>
                  </div>

                  {/* Corner selector: visual 3x3 grid click-to-place */}
                  <div className="space-y-3 text-left">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block pb-1">
                      BRAND EMBLEM PLACEMENT ANCHOR (CREATIVE KIT)
                    </label>

                    <div className="flex gap-4 items-center">
                      {/* Visual 3x3 grid */}
                      <div className="grid grid-cols-3 gap-1 bg-[#FAF5EB] p-2 rounded-xl border-2 border-[#eae3d2] w-24 h-24 shrink-0">
                        {Array.from({ length: 9 }).map((_, index) => {
                          const isActive = logoPosition === index;
                          const labels = ["T-L", "T-C", "T-R", "M-L", "Center", "M-R", "B-L", "B-C", "B-R"];
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setLogoPosition(index);
                                showToast(`Watermark position set: ${labels[index]}`, "info");
                              }}
                              title={labels[index]}
                              className={`w-full h-full rounded transition-colors ${
                                isActive 
                                  ? "bg-[#117644] text-white border border-[#C5E729]" 
                                  : "bg-white hover:bg-[#FAF5EB] border"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mx-auto ${isActive ? "bg-[#C5E729]" : "bg-stone-300"}`} />
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-stone-500 leading-normal font-sans">
                        <span className="font-bold text-[#042F1A] block">Current corner:</span>
                        {["Top-Left", "Top-Center", "Top-Right", "Middle-Left", "Direct-Center", "Middle-Right", "Bottom-Left", "Bottom-Center", "Bottom-Right"][logoPosition]} Position
                        <p className="text-[8.5px] text-stone-400 mt-1">
                          Click any quadrant to update the watermark overlay destination automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={handleSaveBrandKit}
                    className="py-2.5 px-6 bg-[#117644] hover:bg-[#042F1A] text-[#FAF6EE] rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    Save &amp; Propagate Kit
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: BILLING & PLAN */}
            {activeTab === "billing" && (
              <motion.div
                key="tab-billing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div>
                  <h3 className="font-serif font-black text-lg text-[#042F1A]">Licenses &amp; Billing Meters</h3>
                  <p className="text-xs text-stone-500">Monitor active subscription quotas, download tax invoices, or update bound payout credit cards gracefully.</p>
                </div>

                {/* Plan card */}
                <div className="flex flex-col md:flex-row gap-5 justify-between items-start md:items-center p-5 bg-[#FAF5EB] border-2 border-[#eae3d2] rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-[#C5E729] text-[#042F1A] font-mono text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl border-l border-b border-[#eae3d2] animate-pulse">
                    CURRENT PRIMARY PLAN
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono font-black text-[#117644] uppercase tracking-wider block">ENTERPRISE SCALE BRAND LICENSING</span>
                    <h4 className="font-serif font-black text-sm text-[#042F1A]">{currentPlan.name}</h4>
                    <p className="text-[10px] text-stone-500 font-sans">Next automatic renewal charges: <strong className="text-stone-700">{currentPlan.renewalDate}</strong> on file.</p>
                  </div>

                  <div className="space-y-2 mt-4 md:mt-0">
                    <div className="text-right">
                      <span className="text-lg font-black text-[#042F1A]">{currentPlan.price}</span>
                      <span className="text-[10px] font-medium text-stone-400 block">per month (USD)</span>
                    </div>
                    
                    <button
                      onClick={() => setIsPlanModalOpen(true)}
                      className="py-1.8 px-3.5 bg-[#117644] hover:bg-[#042F1A] text-white rounded-xl text-[9px] uppercase font-black tracking-widest cursor-pointer transition-all"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>

                {/* Usage meter list (re-trigger fill animation on tab entry!) */}
                <div className="space-y-4">
                  <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">CURRENT QUOTA USAGE METRIC THRESHOLDS</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {billingStats.map((stat, idx) => {
                      const perc = (stat.used / stat.limit) * 100;
                      const isHigh = perc > 80;
                      const barColor = isHigh ? "bg-amber-500" : "bg-[#117644]";

                      return (
                        <div key={idx} className="p-4 bg-stone-50 border rounded-2xl space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-stone-700">{stat.name}</span>
                            <span className="font-mono text-stone-400">
                              {stat.used}/{stat.limit} {stat.unit}
                            </span>
                          </div>

                          {/* Animated progress bar container */}
                          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: meterTrigger ? `${perc}%` : "0%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${barColor}`}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className={`${isHigh ? "text-amber-600 font-black uppercase" : "text-emerald-700 font-semibold"}`}>
                              {isHigh ? "Approaching Limit Cap" : "Safe Quota Margin"}
                            </span>
                            <span className="text-stone-400">{Math.round(perc)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Billing History and Card Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t pt-5">
                  
                  {/* Card panel */}
                  <div className="p-4 border rounded-2xl bg-[#042F1A] text-[#FAF6EE] flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-28 h-28 bg-[#117644]/45 rounded-full blur-2xl" />
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <span className="text-[8px] font-mono font-black text-[#C5E729] uppercase tracking-wider block">Payout Card</span>
                        <h5 className="font-serif font-black text-xs text-white">Trend Wave Organics Inc.</h5>
                      </div>
                      <span className="font-mono text-[9px] bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold">VISA</span>
                    </div>

                    <div className="z-10">
                      <p className="font-mono text-sm tracking-widest text-[#FAF6EE]">•••• •••• •••• {currentPlan.paymentMethod.last4}</p>
                      <div className="flex justify-between items-center mt-2 text-[8px] font-mono text-stone-400">
                        <span>EXPIRES: {currentPlan.paymentMethod.exp}</span>
                        <button
                          onClick={() => showToast("Authorized payment methods modified.", "success")}
                          className="text-[#C5E729] hover:underline cursor-pointer uppercase font-bold"
                        >
                          Update Card
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table area */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">BILLING LOGS &amp; TAX DOCUMENTS</label>
                    <div className="border rounded-2xl overflow-hidden divide-y text-[10px] bg-stone-50">
                      {billingHistory.map((invoice, index) => (
                        <div key={index} className="p-3 flex justify-between items-center hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-3.5 h-3.5 text-[#117644]" />
                            <div>
                              <span className="font-sans font-bold text-stone-850 block">{invoice.date}</span>
                              <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">{invoice.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-stone-700">{invoice.amount}</span>
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-50 text-emerald-800 uppercase font-bold border">
                              {invoice.status}
                            </span>
                            <button
                              onClick={() => {
                                showToast(`Downloading PDF document payload: ${invoice.id}`, "info");
                                confetti({ particleCount: 15 });
                              }}
                              title="Download PDF Invoice"
                              className="p-1 hover:bg-stone-100 rounded text-[#117644]"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 4: TEAM & PERMISSIONS */}
            {activeTab === "team" && (
              <motion.div
                key="tab-team"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#042F1A]">Workspace Team &amp; Permissions</h3>
                    <p className="text-xs text-stone-500">Govern user access roles, check status logs, or launch fresh team member invitations.</p>
                  </div>

                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="py-2 px-3.5 bg-[#117644] hover:bg-[#042F1A] text-[#FAF6EE] text-[10px] uppercase font-black tracking-wider rounded-xl cursor-pointer flex items-center gap-1 inline-flex whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 text-[#C5E729]" />
                    <span>Invite Member</span>
                  </button>
                </div>

                {/* Team member table list */}
                <div className="space-y-2 text-left">
                  <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">ACTIVE SEEDED MEMBERS</label>
                  
                  <div className="border border-[#eae3d2] rounded-2xl overflow-x-auto bg-stone-50">
                    <table className="w-full text-left text-[10.5px]">
                      <thead>
                        <tr className="bg-[#FAF5EB]/50 border-b border-[#eae3d2] text-[8px] font-mono text-stone-400 uppercase tracking-wider select-none font-bold">
                          <th className="p-3 pl-4">Member Name &amp; Mail</th>
                          <th className="p-3">Role Level</th>
                          <th className="p-3">Last Active Session</th>
                          <th className="p-3 pr-4 text-center">Settings Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150">
                        {members.map((member) => (
                          <tr key={member.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-3 pl-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#eae3d2]">
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-serif font-black text-[#042F1A] block">{member.name}</span>
                                <span className="text-[8.5px] font-mono text-stone-400 block">{member.email}</span>
                              </div>
                            </td>
                            
                            {/* Role Dropdown with tooltipped explanation */}
                            <td className="p-3">
                              <div className="relative inline-block text-left">
                                <select
                                  value={member.role}
                                  onChange={e => {
                                    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: e.target.value as any } : m));
                                    showToast(`Persisted updated role clearance: ${e.target.value}`, "success");
                                  }}
                                  onMouseEnter={() => setHoveredRoleTooltip(member.id)}
                                  onMouseLeave={() => setHoveredRoleTooltip(null)}
                                  disabled={member.role === "Owner"}
                                  className={`font-semibold rounded-lg text-[10px] p-1 border cursor-pointer ${
                                    member.role === "Owner" 
                                      ? "bg-slate-100 text-slate-700 border-stone-200 cursor-not-allowed" 
                                      : "bg-white text-stone-850 hover:border-emerald-600 focus:outline-[#117644]"
                                  }`}
                                >
                                  <option value="Owner">Owner</option>
                                  <option value="Admin">Admin</option>
                                  <option value="Editor">Editor</option>
                                  <option value="Viewer">Viewer</option>
                                </select>

                                {/* Hover tooltip details */}
                                <AnimatePresence>
                                  {hoveredRoleTooltip === member.id && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 5 }}
                                      className="absolute left-0 bottom-full mb-1 w-52 p-2 bg-stone-900 text-[9px] text-[#FAF5EB] font-serif tracking-normal leading-normal rounded-lg shadow-xl z-50 pointer-events-none"
                                    >
                                      {renderRoleTooltip(member.role)}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                            
                            <td className="p-3 text-stone-500 font-mono text-[9px] uppercase font-bold">
                              {member.lastActive}
                            </td>

                            <td className="p-3 pr-4 text-center">
                              {member.role !== "Owner" ? (
                                <button
                                  onClick={() => handleRemoveMember(member.id, member.name)}
                                  className="p-1.5 hover:bg-red-50 text-red-650 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Member Workspace Access"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[8px] font-mono text-stone-400 font-black uppercase tracking-wider italic select-none">Immune</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pending Invites List */}
                <div className="space-y-2 text-left border-t pt-5">
                  <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-amber-600 block font-bold">
                    PENDING INVITATION PIN CODES ({pendingInvites.length})
                  </label>

                  <div className="border border-dashed border-stone-200 rounded-2xl bg-[#stone-50]/10 overflow-hidden divide-y">
                    {pendingInvites.length > 0 ? (
                      pendingInvites.map((invite) => (
                        <div key={invite.id} className="p-3.5 flex justify-between items-center hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-amber-500 animate-pulse" />
                            <div>
                              <span className="font-sans font-bold text-[#042F1A] text-2xs block">{invite.email}</span>
                              <span className="text-[8px] font-mono text-stone-450 uppercase block">ROLE ASSIGNED: {invite.role} | DISPATCHED: {invite.invitedAt}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResendInvite(invite.email)}
                              className="px-2 py-1 bg-[#FAF5EB] hover:bg-[#117644] hover:text-white border rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Resend Invite
                            </button>
                            <button
                              onClick={() => handleRevokeInvite(invite.id, invite.email)}
                              className="px-2 py-1 bg-red-50 hover:bg-red-600 hover:text-white border border-red-150 text-red-650 rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-stone-400 font-mono text-[9px] uppercase tracking-wider select-none italic">
                        No pending invites active inside this team pool.
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 5: NOTIFICATIONS GRID */}
            {activeTab === "notifications" && (
              <motion.div
                key="tab-notifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div>
                  <h3 className="font-serif font-black text-lg text-[#042F1A]">Granular Notification Matrix</h3>
                  <p className="text-xs text-stone-500">Configure alert routing across channels. Toggle target nodes dynamically for precise alerting behaviors.</p>
                </div>

                <div className="border border-[#eae3d2] rounded-2xl overflow-x-auto bg-stone-50">
                  <table className="w-full text-left text-[10.5px]">
                    <thead>
                      <tr className="bg-[#FAF5EB]/50 border-b border-[#eae3d2] text-[8px] font-mono text-stone-400 uppercase tracking-wider select-none font-bold">
                        <th className="p-4 pl-5">Notification Event Case</th>
                        <th className="p-4 text-center">Email Alerts</th>
                        <th className="p-4 text-center">Mobile Push</th>
                        <th className="p-4 text-center">In-App Alerts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150">
                      {[
                        { id: "published", label: "Media Post Published", desc: "Dispatch complete updates instantly on social feeds." },
                        { id: "failed", label: "Media Post Delivery Failed", desc: "Flag queue exceptions, API errors, and network failures." },
                        { id: "reminder", label: "Scheduled Post Reminder", desc: "Sustain queue calendar checkups before timeline ticks." },
                        { id: "weekly", label: "Weekly Performance Digest", desc: "Aggregate click trends, conversion rate metrics, and insights." },
                        { id: "team", label: "Team Activity Logs", desc: "Log role edits, brand metadata changes, and invite logs." },
                        { id: "product", label: "Trend Wave Product Updates", desc: "Occasional alerts regarding new generative templates." }
                      ].map((row) => (
                        <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4 pl-5">
                            <span className="font-serif font-black text-stone-850 block">{row.label}</span>
                            <span className="text-[8.5px] text-stone-400 block">{row.desc}</span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleNotification(row.id, "email")}
                              className="inline-block"
                            >
                              {toggleSwitchAnimation(notificationConfig[row.id]?.email)}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleNotification(row.id, "push")}
                              className="inline-block"
                            >
                              {toggleSwitchAnimation(notificationConfig[row.id]?.push)}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleNotification(row.id, "app")}
                              className="inline-block"
                            >
                              {toggleSwitchAnimation(notificationConfig[row.id]?.app)}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#FAF5EB]/50 border rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#117644]" />
                  <div className="space-y-1">
                    <h5 className="font-serif font-black text-[10px] text-[#042F1A] uppercase tracking-wider">Urgent Account SMS Alerts</h5>
                    <p className="text-[9.5px] text-stone-500 leading-normal">
                      If your account disconnects or requires immediate attention, we will send an automatic SMS to your phone line on file to restore publishing rights instantly.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 6: API & INTEGRATIONS */}
            {activeTab === "api" && (
              <motion.div
                key="tab-api"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left"
              >
                <div>
                  <h3 className="font-serif font-black text-lg text-[#042F1A]">Developer APIs &amp; External Integrations</h3>
                  <p className="text-xs text-stone-500">Configure Webhook endpoints, regenerate private API keys safely, or bridge automated Slack workflows.</p>
                </div>

                {/* API Key container */}
                <div className="p-5 bg-[#FAF5EB] border-2 border-[#eae3d2] rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-mono font-black text-[#117644] uppercase tracking-wider block">PRIVATE Workspace AUTH KEY</span>
                      <h4 className="font-serif font-black text-xs text-[#042F1A] mt-0.5">Sovereign REST Access Token</h4>
                    </div>
                    
                    <button
                      onClick={() => setShowKeyRegenConfirm(true)}
                      className="py-1 px-2.5 bg-white border border-[#eae3d2] hover:bg-[#117644] hover:text-white rounded-lg text-[8px] uppercase font-black tracking-widest transition-colors cursor-pointer inline-flex items-center gap-1 text-stone-700"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Regenerate Key</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1 bg-white border rounded-xl px-3.5 py-2.5 font-mono text-xs flex items-center justify-between overflow-hidden">
                      <span className="text-stone-700 select-all max-w-[80%] truncate">
                        {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                      </span>
                      
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      onClick={() => copyToClipboard(apiKey)}
                      className="p-3 bg-[#117644] hover:bg-[#042F1A] text-white rounded-xl transition-colors cursor-pointer"
                      title="Copy Key Payload"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[8.5px] text-stone-400 leading-normal">
                    ⚠️ Guard this secret key. It grants raw JSON parameters dispatch rights over all channels registered in this brand license pool.
                  </p>
                </div>

                {/* API Regeneration Confirm Modal/Alert nested overlay */}
                <AnimatePresence>
                  {showKeyRegenConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[10px] text-stone-700 space-y-3"
                    >
                      <div className="flex items-start gap-2 text-left">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-stone-900 block font-serif">Force Key Refactor?</strong>
                          This destroys the existing active API key. Any external background integrations or private Slack bots using this key will immediately generate HTTP 401 exceptions.
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={regenerateApiKey}
                          className="py-1 px-3 bg-[#117644] text-white rounded-lg font-black uppercase font-mono tracking-wider"
                        >
                          Confirm &amp; Refactor
                        </button>
                        <button
                          onClick={() => setShowKeyRegenConfirm(false)}
                          className="py-1 px-3 bg-white border rounded-lg font-black uppercase font-mono tracking-wider text-stone-700 hover:bg-stone-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Webhooks Section */}
                <div className="space-y-4 border-t pt-5">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">Workspace Webhook Endpoints</label>
                    <p className="text-xs text-stone-500">Dispatch live HTTP POST payload packages whenever media publish flows trigger or exceptions occur.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={e => setWebhookUrl(e.target.value)}
                      className="flex-1 text-xs bg-white border border-[#eae3d2] font-mono p-2.5 rounded-xl focus:outline-emerald-600"
                      placeholder="https://api.domain.com/webhooks"
                    />

                    <button
                      onClick={simulateWebhookPayload}
                      disabled={isSimulatingWebhook}
                      className="py-2.5 px-4 bg-[#FAF5EB] hover:bg-[#117644] hover:text-white border text-stone-700 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      {isSimulatingWebhook ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Delivering...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Simulate Ping</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest block">HISTORIC WEBHOOK DELIVERIES</span>
                    <div className="border rounded-2xl overflow-hidden divide-y text-[10px] bg-stone-50 font-mono">
                      {webhookLogs.map((log) => (
                        <div key={log.id} className="p-2.5 flex justify-between items-center hover:bg-neutral-50">
                          <div className="flex items-center gap-2 text-stone-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{log.event}</span>
                          </div>
                          
                          <div className="flex gap-4 items-center">
                            <span className="text-stone-400 text-[8.5px]">{log.time}</span>
                            <span className="px-1 py-0.5 bg-emerald-100/40 text-emerald-800 rounded font-bold">HTTP {log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Integration Grid cards (Slack, Zapier, Google Sheets) */}
                <div className="space-y-3.5 border-t pt-5">
                  <label className="text-[8.5px] font-mono font-black uppercase tracking-wider text-stone-400 block">SUPPORTED INTEGRATION NODES</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Zapier", desc: "Seed triggers, custom tasks, and bridge data to 6,000+ workspace platforms.", connected: true },
                      { name: "Slack", desc: "Establish channel notifications concerning scheduling and failure alerts.", connected: false },
                      { name: "Make.com", desc: "Construct granular visual logic maps and sync raw analytics metrics.", connected: false }
                    ].map((integ, index) => (
                      <div key={index} className="p-4 bg-stone-50 border rounded-2xl text-left flex flex-col justify-between h-36">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <h5 className="font-serif font-black text-xs text-[#042F1A]">{integ.name}</h5>
                            <span className={`text-[8px] font-mono px-1 rounded uppercase block font-bold ${
                              integ.connected 
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                                : "bg-neutral-100 text-stone-400"
                            }`}>
                              {integ.connected ? "Bound" : "Unbound"}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-normal line-clamp-2">{integ.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            showToast(`Authorized and updated bridge parameter for ${integ.name}`, "success");
                            confetti({ particleCount: 20 });
                          }}
                          className="w-full mt-2 py-1 bg-white border hover:bg-[#FAF5EB] text-[9px] font-black uppercase tracking-widest text-[#117644] hover:border-[#117644] rounded-lg transition-all cursor-pointer"
                        >
                          {integ.connected ? "Configure Bridge" : "Connect Adapter"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 7: DANGER ZONE */}
            {activeTab === "danger" && (
              <motion.div
                key="tab-danger"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-[#FFF5F5] border-2 border-red-200 rounded-3xl p-6 space-y-6 text-left relative overflow-hidden"
              >
                {/* Visual red glow filter */}
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 bg-red-400/10 rounded-full blur-2xl" />

                <div>
                  <span className="text-[8px] font-mono font-black text-red-650 uppercase tracking-widest block font-bold">RESTRICTED WORKSPACE SEGMENT</span>
                  <h3 className="font-serif font-black text-lg text-red-950 mt-0.5">Sovereign Danger Zone Operations</h3>
                  <p className="text-xs text-red-900 leading-normal">
                    These operations require typed email authorizations to verify administrator presence. Actions below immediately affect scheduled publishes forever.
                  </p>
                </div>

                <div className="divide-y divide-red-100">
                  {/* Operation 1 */}
                  <div className="py-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif font-black text-xs text-stone-900">Export All Profile &amp; Queue Meta</h4>
                      <p className="text-[10px] text-stone-500">Collects and bundles all brand campaign files, webhook logs, analytics details, and credentials into a portable zip file payload.</p>
                    </div>

                    <button
                      onClick={() => setConfirmModalType("export")}
                      className="py-1.8 px-4 bg-white border border-red-250 hover:bg-red-50 text-red-700 rounded-xl text-[9.5px] uppercase font-black tracking-widest transition-colors cursor-pointer"
                    >
                      Export Profile
                    </button>
                  </div>

                  {/* Operation 2 */}
                  <div className="py-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif font-black text-xs text-stone-900">Deactivate Current Workspace</h4>
                      <p className="text-[10px] text-stone-500">Temporarily pauses automated schedule engines. Prevents fresh post dispatches. Preserves all data records until reactive login.</p>
                    </div>

                    <button
                      onClick={() => setConfirmModalType("deactivate")}
                      className="py-1.8 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-[9.5px] uppercase font-black tracking-widest transition-colors cursor-pointer"
                    >
                      Deactivate License
                    </button>
                  </div>

                  {/* Operation 3 */}
                  <div className="py-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-serif font-black text-xs text-red-700 font-extrabold flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Personal Profile permanently</span>
                      </h4>
                      <p className="text-[10px] text-stone-500">Immediately purges active tokens, custom font sets, connected Slack integrations, and historical posts forever from backing servers.</p>
                    </div>

                    <button
                      onClick={() => setConfirmModalType("delete")}
                      className="py-1.8 px-4 bg-red-650 hover:bg-red-750 text-white rounded-xl text-[9.5px] uppercase font-black tracking-widest transition-colors cursor-pointer"
                    >
                      Destroy Profile
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: DATABASE SETUP */}
            {activeTab === "database" && (
              <motion.div
                key="tab-database"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="bg-[#FAF5EB]/40 border-2 border-[#eae3d2] rounded-3xl p-6 space-y-6 text-left relative overflow-hidden"
              >
                {/* Visual accent background */}
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 bg-[#117644]/5 rounded-full blur-2xl" />

                <div>
                  <span className="text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest block font-bold">RELIABILITY &amp; BACKEND PROVISIONING</span>
                  <h3 className="font-serif font-black text-lg text-[#042F1A] mt-0.5">Automated Database Provisioner</h3>
                  <p className="text-xs text-[#042F1A]/70 leading-normal">
                    Quickly deploy the entire relational database schema, Row-Level Security (RLS) policies, and performance indexes/triggers directly onto your active live Supabase project instance.
                  </p>
                </div>

                <div className="bg-[#117644]/5 border border-[#117644]/20 rounded-2xl p-4 flex gap-3.5 items-start">
                  <Info className="w-5 h-5 text-[#117644] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-xs text-[#042F1A]">Connected Supabase Target Meta</h4>
                    <div className="text-[10px] font-mono text-[#042F1A]/60 space-y-0.5">
                      <div><strong className="text-[#117644]">Project API Gateway:</strong> https://blunxlndlkbzizrtigyk.supabase.co</div>
                      <div><strong className="text-[#117644]">Relational Target Host:</strong> db.blunxlndlkbzizrtigyk.supabase.co</div>
                      <div><strong className="text-[#117644]">Primary Database:</strong> postgres (Port 5432)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-black uppercase text-[#042F1A]/70">
                      Supabase Database Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter the DB password you set during Supabase project creation"
                        value={dbPassword}
                        onChange={(e) => {
                          setDbPassword(e.target.value);
                          setMigError("");
                        }}
                        className="w-full text-xs bg-[#FAF5EB] border-2 border-[#eae3d2] rounded-xl px-4 py-3 outline-none focus:border-[#117644] transition-colors font-mono"
                      />
                    </div>
                    <p className="text-[9px] text-[#042F1A]/50">
                      We never store your database password. It is only used server-side to establish a brief connection to execute migration files.
                    </p>
                  </div>

                  {/* Custom Connection String (Optional) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-black uppercase text-[#042F1A]/70 flex items-center justify-between">
                      <span>Or Custom Connection URI (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="postgresql://postgres:[password]@db.your-ref.supabase.co:5432/postgres?sslmode=require"
                      value={customConnStr}
                      onChange={(e) => {
                        setCustomConnStr(e.target.value);
                        setMigError("");
                      }}
                      className="w-full text-xs bg-[#FAF5EB] border-2 border-[#eae3d2] rounded-xl px-4 py-3 outline-none focus:border-[#117644] transition-colors font-mono"
                    />
                  </div>

                  {/* Trigger Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={async () => {
                        if (!dbPassword && !customConnStr) {
                          setMigError("Please enter your database password or custom connection URI to begin.");
                          return;
                        }

                        setMigrating(true);
                        setMigError("");
                        setMigResult(null);

                        try {
                          const res = await fetch("/api/setup-db", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              dbPassword,
                              connectionString: customConnStr
                            })
                          });

                          const data = await res.json();
                          if (res.ok && data.success) {
                            setMigResult(data);
                            confetti({ particleCount: 60, spread: 50 });
                            showToast("Database fully built!", "success");
                          } else {
                            setMigError(data.error || "Failed to execute database migrations.");
                            setMigResult(data);
                          }
                        } catch (err: any) {
                          setMigError(err.message || "An unexpected error occurred during execution.");
                        } finally {
                          setMigrating(false);
                        }
                      }}
                      disabled={migrating}
                      className="flex items-center gap-2 py-3 px-6 bg-[#117644] hover:bg-[#0c5932] disabled:bg-[#117644]/50 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-colors cursor-pointer"
                    >
                      {migrating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Provisioning Database...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Run Database Setup</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Console */}
                {migError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-serif font-black text-xs text-rose-950">Database Setup Failure</h4>
                      <p className="text-[10px] text-rose-900 leading-relaxed font-mono bg-white/40 p-2 rounded border border-rose-100 whitespace-pre-wrap">
                        {migError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Live Output Console */}
                {migResult && (
                  <div className={`border rounded-2xl p-5 text-left space-y-4 ${
                    migResult.success ? "bg-[#117644]/5 border-[#117644]/20" : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-black text-xs text-[#042F1A] flex items-center gap-2">
                        {migResult.success ? (
                          <CheckIcon className="w-4 h-4 text-[#117644]" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-700" />
                        )}
                        <span>Provisioning Logs &amp; Status</span>
                      </h4>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        migResult.success ? "bg-[#117644]/20 text-[#117644]" : "bg-amber-100 text-amber-800"
                      }`}>
                        {migResult.success ? "Completed" : "Partial Sync Failure"}
                      </span>
                    </div>

                    <div className="space-y-2 divide-y divide-[#eae3d2]/30 text-xs">
                      {migResult.results && migResult.results.map((r: any, idx: number) => (
                        <div key={idx} className="pt-2 flex justify-between items-start gap-4">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] font-bold text-[#042F1A]/80">{r.file}</span>
                            {r.error && (
                              <p className="text-[10px] text-rose-700 font-mono bg-rose-50/50 p-2 rounded mt-1 border border-rose-100/50">
                                Error: {r.error}
                              </p>
                            )}
                          </div>
                          <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            r.success ? "bg-[#117644]/15 text-[#117644]" : "bg-rose-100 text-rose-700"
                          }`}>
                            {r.success ? "Success" : "Failed"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-[#042F1A]/60 font-medium">
                      {migResult.success 
                        ? "Success! The table schemas, roles, indexes, and triggers were created successfully on Supabase. Your Trend Wave application is fully dynamic and backed."
                        : "Some SQL commands failed. Ensure you didn't run the migrations twice on an already initialized database, which could raise 'already exists' constraints."
                      }
                    </p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* --- MODAL A: PRICING COMPARISON MODAL ("Change Plan" flow) --- */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[99000] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsPlanModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF5EB] border-2 border-[#eae3d2] p-6 rounded-3xl max-w-2xl w-full text-left space-y-5 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest block leading-none">Subscription Licensing Suite</span>
                  <h3 className="font-serif font-black text-lg text-[#042F1A] mt-1">Upgrade or Compare Plans</h3>
                </div>
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1">
                {[
                  { name: "Starter Sprout", price: "Free", limit: "15 posts/mo", feat: ["1 Connected profile", "Basic templates", "Local state metrics"], current: false },
                  { name: "Organic Grow", price: "$29/mo", limit: "50 posts/mo", feat: ["3 Connected profiles", "AI Auto-watermarks", "Weekly performance digest"], current: false },
                  { name: "Professional Premium", price: "$79/mo", limit: "150 posts/mo", feat: ["6 Connected profiles", "Unlimited AI generation", "Custom watermark placements", "Slack & REST API webhook keys"], current: true }
                ].map((tier, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between h-72 text-left bg-white relative ${
                    tier.current ? "border-2 border-[#117644] shadow-sm" : "border-[#eae3d2]"
                  }`}>
                    {tier.current && (
                      <span className="absolute top-0 right-0 bg-[#117644] text-white text-[7.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-bl">
                        ACTIVE PLAN
                      </span>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-serif font-black text-xs text-[#042F1A]">{tier.name}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-stone-900">{tier.price}</span>
                        {tier.price !== "Free" && <span className="text-[9px] text-stone-400">/mo</span>}
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-[#117644] uppercase block">{tier.limit}</span>
                      
                      <div className="space-y-1.5 pt-2 border-t">
                        {tier.feat.map((f, fIdx) => (
                          <div key={fIdx} className="flex gap-1 items-start text-[9px] text-stone-600">
                            <Check className="w-2.8 h-2.8 text-[#117644] mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (tier.current) {
                          setIsPlanModalOpen(false);
                        } else {
                          setCurrentPlan(p => ({ ...p, name: `Trend Wave ${tier.name}`, price: tier.price }));
                          setIsPlanModalOpen(false);
                          confetti({ particleCount: 35, spread: 30 });
                          showToast(`Swapped subscription plan: Trend Wave ${tier.name}!`, "success");
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-colors cursor-pointer ${
                        tier.current 
                          ? "bg-stone-100 font-bold text-stone-400 cursor-default" 
                          : "bg-[#117644] hover:bg-[#042F1A] text-white"
                      }`}
                    >
                      {tier.current ? "Current Standing" : `Switch to ${tier.name}`}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white rounded-xl border flex items-start gap-2.5 text-[9.5px] text-stone-400">
                <Shield className="w-5 h-5 text-[#117644] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Unused post quotas roll over indefinitely to next dynamic pay cycles. Subscriptions can be fully cancelled at any time by toggling billing anchors.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL B: INVITE TEAM MEMBER MODAL --- */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[99000] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsInviteModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF5EB] border-2 border-[#eae3d2] p-6 rounded-3xl max-w-sm w-full text-left space-y-4 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[8px] font-mono font-black text-[#117644] uppercase tracking-widest block leading-none">Access Control</span>
                  <h3 className="font-serif font-black text-lg text-[#042F1A] mt-1">Invite Workspace Colleague</h3>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[8px] font-mono font-black uppercase text-stone-400">INIVITATION DESTINATION EMAIL</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 bg-white border rounded-xl"
                    placeholder="colleague@yourcompany.com"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[8px] font-mono font-black uppercase text-stone-400">WORKSPACE ROLE TIERS</label>
                  <select
                    value={inviteForm.role}
                    onChange={e => setInviteForm(p => ({ ...p, role: e.target.value as any }))}
                    className="w-full text-xs font-bold text-[#042F1A] p-2 bg-white border rounded-xl focus:outline-none"
                  >
                    <option value="Admin">Admin (Full settings exception-free)</option>
                    <option value="Editor">Editor (Full publish schedules capabilities)</option>
                    <option value="Viewer">Viewer (Read-only analytics logs &amp; views)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[8px] font-mono font-black uppercase text-stone-400 block mb-0.5">OPTIONAL PERSONAL NOTE</label>
                  <textarea
                    rows={2}
                    value={inviteForm.note}
                    onChange={e => setInviteForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="Welcome to our gardening campaign planning workspace!"
                    className="w-full text-xs bg-white border p-2 rounded-xl"
                  />
                </div>

                <button
                  onClick={handleSendInvite}
                  className="w-full py-2.5 bg-[#117644] hover:bg-[#042F1A] text-white rounded-xl text-[10px] uppercase font-black tracking-widest text-center cursor-pointer"
                >
                  Dispatch Invite Pin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL C: DANGER ZONE TYPED CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmModalType && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[99000] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => { setConfirmModalType(null); setTypedConfirmation(""); }} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border-4 border-red-500/30 p-6 rounded-3xl max-w-sm w-full text-left space-y-4.5 shadow-2xl relative z-10"
            >
              <div className="flex items-center gap-1.5 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-serif font-black text-[#042F1A]">Destructive Action Authorization</h4>
              </div>

              <div className="p-3 bg-red-55/40 text-[10.5px] border border-red-100 rounded-xl leading-normal text-red-800">
                ⚠️ You are requesting: <strong className="uppercase">{confirmModalType} operation</strong>. 
                This action modifies backing profiles and can completely wipe scheduled queues.
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-mono text-stone-500 block leading-6 text-left">
                  To proceed, type Owner verification key <code className="bg-stone-100 text-stone-850 px-1 py-0.5 rounded text-[10px] font-extrabold">{REQUIRED_CONFIRM_TEXT}</code>:
                </span>

                <input
                  type="text"
                  value={typedConfirmation}
                  onChange={e => setTypedConfirmation(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 bg-stone-50 border rounded-xl block text-center uppercase"
                  placeholder="Type email validation token"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => { setConfirmModalType(null); setTypedConfirmation(""); }}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer"
                  >
                    Abort
                  </button>
                  <button
                    onClick={executeDangerAction}
                    disabled={typedConfirmation !== REQUIRED_CONFIRM_TEXT}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-colors cursor-pointer ${
                      typedConfirmation === REQUIRED_CONFIRM_TEXT 
                        ? "bg-red-650 hover:bg-red-700 text-white" 
                        : "bg-stone-100 text-stone-300 pointer-events-none"
                    }`}
                  >
                    Confirm Action
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

// Custom Close icon to bypass missing components
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
