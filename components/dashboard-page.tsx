"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Sparkles, Calendar, Send, Plus, Copy, Check, BarChart3, 
  Zap, Clock, RefreshCw, FileText, Activity, Layout, LineChart, 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Volume2, 
  Loader2, Menu, X, ChevronLeft, ChevronRight, Search, Bell, 
  ChevronDown, Settings, HelpCircle, LogOut, Users, Target, 
  Image as ImageIcon, Flame, Info, Shield, ArrowUpRight, Compass,
  AlertCircle, Trash2, Eye, Edit2, Play, CheckCircle2, AlertTriangle, Undo, Filter, Grid, Upload, Home
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, 
  BarChart, Bar, CartesianGrid, ComposedChart, Line
} from "recharts";
import confetti from "canvas-confetti";
import AiCaptionAssistant from "./ai-caption-assistant";
import AiCreativeKit from "./ai-creative-kit";
import PostrickAnalytics from "./postrick-analytics";
import PostrickAccounts from "./postrick-accounts";
import PostrickSettings from "./postrick-settings";
import OnboardingWizard from "./onboarding-wizard";

import { Youtube, Facebook, Instagram, Linkedin, PostrickLogo } from "./icons";
export { Youtube, Facebook, Instagram, Linkedin };

interface DashboardPageProps {
  onExitApp: () => void;
  isDarkMode: boolean;
}

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

// Helper models for character limits & quick toolbar presets in composer
const PLATFORM_CHARACTER_LIMITS: Record<string, { label: string; max: number }> = {
  instagram: { label: "Instagram", max: 2200 },
  tiktok: { label: "TikTok Caption", max: 2200 },
  linkedin: { label: "LinkedIn Post", max: 3000 },
  youtube: { label: "YouTube Desc", max: 5000 },
  facebook: { label: "Facebook Feed", max: 5000 },
  pinterest: { label: "Pinterest Card", max: 500 }
};

const SUGGESTED_TRENDING_HASHTAGS = [
  "#Sustainability", "#Postrick", "#ConsciousTech", "#ModernDesign", 
  "#CircularAesthetics", "#EcoFriendly", "#ZeroWaste", "#MinimalLiving"
];

const QUICK_EMOJIS = ["🌱", "📦", "✨", "🔥", "🚀", "💡", "🌿", "💻", "🎨", "🌍"];

// React Custom Count-Up Component
function CountUp({ value, suffix = "", duration = 1000 }: { value: number | string; suffix?: string; duration?: number }) {
  const numericVal = typeof value === "number" ? value : parseFloat(value) || 0;
  const isFloat = typeof value === "string" && value.includes(".");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numericVal;
    if (end === 0) {
      setCount(0);
      return;
    }
    const totalSteps = duration / 25;
    const stepValue = end / totalSteps;
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [numericVal, duration]);

  return (
    <span>
      {isFloat ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function DashboardPage({ onExitApp, isDarkMode }: DashboardPageProps) {
  // Navigation & Shell State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [calendarTheme, setCalendarTheme] = useState({
    primary: "#117644",
    secondary: "#042F1A",
    bg: "#FAF6EE",
    text: "#042F1A",
    cardBg: "#FFFFFF",
    border: "#eae3d2"
  });
  const timelineScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOnboardingSimulator, setIsOnboardingSimulator] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
        dragCounter.current++;
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
        dragCounter.current--;
        if (dragCounter.current <= 0) {
          dragCounter.current = 0;
          setIsDraggingFile(false);
        }
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDraggingFile(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArr = Array.from(e.dataTransfer.files);
        const mediaFiles = filesArr.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
        if (mediaFiles.length > 0) {
          const formatted = mediaFiles.map((f, i) => ({
            id: `custom-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            url: URL.createObjectURL(f),
            type: f.type.startsWith("video") ? ("video" as const) : ("image" as const),
            name: f.name,
            cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
          }));
          setUploadedMedia(prev => [...prev, ...formatted]);
          setSelectedMediaId(formatted[0].id);
          setActiveTab("composer");
          confetti({ particleCount: 50, spread: 45 });
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("postrick_onboarding_completed");
      if (completed !== "true") {
        setShowOnboarding(true);
      }
    }
  }, []);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  
  // Search Pallette State (Cmd+K)
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWorkspace, setCurrentWorkspace] = useState("Postrick Main Brand");
  const [dashboardUserName, setDashboardUserName] = useState("Sabeeh");

  // Input states from previous version to keep functionality intact
  const [activePlatform, setActivePlatform] = useState<"youtube" | "facebook" | "instagram" | "tiktok" | "pinterest" | "linkedin">("instagram");
  const [prompt, setPrompt] = useState("Launch campaign for sustainable organic tech devices - 30% reduction in plastic packaging, modern minimal design, lifetime support.");
  const [platformCaption, setPlatformCaption] = useState(`🌱 The future is conscious. \n\nWe're incredibly excited to introduce our new range of conscious tech products featuring an incredible 30% packaging reduction! \n\n📦 Every design element has been customized for extreme durability and carbon balance. Rest up with lifetime support, too!\n\n👇 Order yours today and clean up our environment together.\n\n#Sustainability #DesignEvolution #ConsciousTech`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Enhanced Composer States
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "tiktok", "linkedin", "facebook"]);
  const [activePreviewTab, setActivePreviewTab] = useState<string>("instagram");
  const [uploadedMedia, setUploadedMedia] = useState<Array<{
    id: string;
    url: string;
    type: "image" | "video";
    name: string;
    cropFits: string[];
    cropWarning?: string;
  }>>([
    {
      id: "med-1",
      url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80",
      type: "image",
      name: "workspace_sustainable_device.jpg",
      cropFits: ["instagram", "tiktok", "linkedin", "youtube", "facebook"],
    },
    {
      id: "med-2",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80",
      type: "image",
      name: "carbon_blueprint_stats.png",
      cropFits: ["linkedin", "facebook", "youtube"],
      cropWarning: "Pinterest mismatch: needs vertical 2:3 crop"
    }
  ]);
  const [isAiOverlayOpen, setIsAiOverlayOpen] = useState(false);
  const [flashCaptionTextarea, setFlashCaptionTextarea] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([
    "#Sustainability", "#DesignEvolution", "#ConsciousTech", "#EcoFriendly", "#ZeroWaste", "#CircularEconomy", "#GreenTech"
  ]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);

  const fetchAIHashtags = async (captionText: string) => {
    if (!captionText || captionText.trim().length === 0) return;
    setIsGeneratingHashtags(true);
    try {
      const res = await fetch("/api/gemini/generate-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: captionText, platform: activePreviewTab }),
      });
      
      let data;
      try {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.warn("Hashtag API returned non-JSON / error response:", text);
          data = { hashtags: ["#viral", "#trending", "#socialmedia", "#growth", "#creators", "#marketing", "#community", "#brand"] };
        }
      } catch (parseErr) {
        console.warn("Failed to parse hashtag API response as JSON:", parseErr);
        data = { hashtags: ["#viral", "#trending", "#socialmedia", "#growth", "#creators", "#marketing", "#community", "#brand"] };
      }

      if (data.hashtags && data.hashtags.length > 0) {
        setSuggestedHashtags(data.hashtags);
      }
    } catch (err) {
      console.error("Failed to generate hashtags", err);
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  useEffect(() => {
    fetchAIHashtags(platformCaption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHashtagsFromCaption = (caption: string): string[] => {
    const matches = caption.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches.map(m => m.toLowerCase()) : [];
  };

  const toggleHashtagInCaption = (tag: string) => {
    const cleanTag = tag.startsWith("#") ? tag : `#${tag}`;
    const currentTagsLower = getHashtagsFromCaption(platformCaption);
    const isAdded = currentTagsLower.includes(cleanTag.toLowerCase());

    if (isAdded) {
      // Remove the hashtag from the text
      const escapedTag = cleanTag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedTag, 'gi');
      let updated = platformCaption.replace(regex, '').trim();
      updated = updated.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
      setPlatformCaption(updated);
    } else {
      // Append the hashtag
      if (platformCaption.trim().length === 0) {
        setPlatformCaption(cleanTag);
      } else {
        const hasHashtags = platformCaption.includes("#");
        if (hasHashtags) {
          setPlatformCaption(platformCaption.trim() + " " + cleanTag);
        } else {
          setPlatformCaption(platformCaption.trim() + "\n\n" + cleanTag);
        }
      }
    }
  };

  const handleUseCaption = (caption: string) => {
    setPlatformCaption(caption);
    setFlashCaptionTextarea(true);
    setTimeout(() => {
      setFlashCaptionTextarea(false);
    }, 1500);

    // Fetch related viral hashtags for the new caption
    fetchAIHashtags(caption);
  };
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);
  
  // Custom Scheduler Composer state
  const [composerScheduleDate, setComposerScheduleDate] = useState("2026-06-22");
  const [composerScheduleTime, setComposerScheduleTime] = useState("12:00");
  const [viewedYear, setViewedYear] = useState(2026);
  const [viewedMonth, setViewedMonth] = useState(5); // June (0-indexed)
  const [showComposerSchedulePopover, setShowComposerSchedulePopover] = useState(false);
  
  // 5-Step Publisher Wizard States
  const [publishStep, setPublishStep] = useState<number>(1);
  const [publishMode, setPublishMode] = useState<"single" | "steps">("steps");
  const [mediaSource, setMediaSource] = useState<"upload" | "ai" | "custom">("upload");
  const [customPostTitle, setCustomPostTitle] = useState<string>("Eco Workspace Showcase");
  const [customPostUrl, setCustomPostUrl] = useState<string>("");
  const [customPostType, setCustomPostType] = useState<"image" | "video">("image");
  const [showAiImageGenInStep1, setShowAiImageGenInStep1] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [composerScheduleTimezone, setComposerScheduleTimezone] = useState<string>("America/New_York (EST, GMT-5)");
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [aiImagePrompt, setAiImagePrompt] = useState<string>("A vibrant sustainable tech device presented on premium natural linen, dappled soft leaves shadows, 4k product render");
  const [aiImageAspectRatio, setAiImageAspectRatio] = useState<string>("1:1");
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState<boolean>(false);
  const [captionVariants, setCaptionVariants] = useState<Array<{ text: string; hashtags: string[]; toneTag: string; platform: string }>>([]);
  const [isGeneratingCaptionVariants, setIsGeneratingCaptionVariants] = useState<boolean>(false);
  const [aiCaptionPrompt, setAiCaptionPrompt] = useState<string>("Launch campaign for sustainable organic tech devices - 30% reduction in plastic packaging, modern minimal design, lifetime support.");

  // Publish celebration state
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [isPublishingNow, setIsPublishingNow] = useState(false);
  const [showAiWriter, setShowAiWriter] = useState(false);
  const [showAiImageGen, setShowAiImageGen] = useState(false);
  
  const [selectedMediaId, setSelectedMediaId] = useState<string>("med-1");

  // AI Assist custom tones & inputs
  const [aiTone, setAiTone] = useState<string>("Professional");
  const [aiGuidelines, setAiGuidelines] = useState<string>("Focus heavily on circular materials & carbon reduction percentage");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Creative Kit image state
  const [imagePrompt, setImagePrompt] = useState("A modern minimalist workspace layout, neon emerald theme, premium creative style, wide angle render");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Bind accounts state
  const [connectedChannels, setConnectedChannels] = useState<Record<string, boolean>>({
    youtube: false,
    facebook: false,
    instagram: false,
    tiktok: false,
    pinterest: false,
    linkedin: false
  });

  const [isComposerDragOver, setIsComposerDragOver] = useState(false);
  const [isPublisherDragOver, setIsPublisherDragOver] = useState(false);

  // ==========================================
  // AUTO-SAVE FEATURE FOR POST COMPOSER DRAFT
  // ==========================================
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");
  const [isComposerHydrated, setIsComposerHydrated] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCaption = localStorage.getItem("postrick_composer_caption");
      const savedMedia = localStorage.getItem("postrick_composer_media");
      const savedSelectedMediaId = localStorage.getItem("postrick_composer_selected_media_id");

      if (savedCaption !== null) {
        setPlatformCaption(savedCaption);
      }
      if (savedMedia !== null) {
        try {
          const parsedMedia = JSON.parse(savedMedia);
          if (Array.isArray(parsedMedia) && parsedMedia.length > 0) {
            setUploadedMedia(parsedMedia);
          }
        } catch (e) {
          console.error("Error parsing saved media draft:", e);
        }
      }
      if (savedSelectedMediaId !== null) {
        setSelectedMediaId(savedSelectedMediaId);
      }
      setIsComposerHydrated(true);
    }
  }, []);

  // Periodic/debounced auto-save to localStorage
  useEffect(() => {
    if (!isComposerHydrated || typeof window === "undefined") return;

    setAutoSaveStatus("Saving...");
    
    const handler = setTimeout(() => {
      try {
        localStorage.setItem("postrick_composer_caption", platformCaption);
        localStorage.setItem("postrick_composer_media", JSON.stringify(uploadedMedia));
        localStorage.setItem("postrick_composer_selected_media_id", selectedMediaId);
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setAutoSaveStatus(`Saved at ${timeString}`);
      } catch (e) {
        console.error("Failed to auto-save to localStorage:", e);
        setAutoSaveStatus("Save error");
      }
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [platformCaption, uploadedMedia, selectedMediaId, isComposerHydrated]);

  // 📅 Weekly Content Calendar Rich States
  const [calendarView, setCalendarView] = useState<"week" | "day" | "list">("list");
  const [calendarPlatformFilter, setCalendarPlatformFilter] = useState<string[]>([
    "instagram", "tiktok", "linkedin", "facebook", "youtube", "pinterest"
  ]);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [activeMobileDay, setActiveMobileDay] = useState<string>("Tue");
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(6);
  const [selectedCalendarPostId, setSelectedCalendarPostId] = useState<string | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [calendarToast, setCalendarToast] = useState<{ message: string; originalSlot: any } | null>(null);
  const handleUndo = () => {
    if (!calendarToast || !calendarToast.originalSlot) return;
    const { id, day, hour } = calendarToast.originalSlot;
    setScheduledSlots(prev => prev.map(p => p.id === id ? { ...p, day, hour } : p));
    setCalendarToast(null);
  };
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<number>(23);
  const [selectedScheduleMonth, setSelectedScheduleMonth] = useState<number>(5); // June
  const [selectedScheduleYear, setSelectedScheduleYear] = useState<number>(2026);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState<string>("09:00 AM");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ day: string; hour: string } | null>(null);
  const [isDraftPoolOpen, setIsDraftPoolOpen] = useState(true);
  const [draftPool, setDraftPool] = useState<Array<{
    id: string;
    text: string;
    platform: string;
    mediaUrl: string;
  }>>([]);
  
  // Quick Post modal fields
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState("Mon");
  const [newSlotHour, setNewSlotHour] = useState("12:00");
  const [newSlotText, setNewSlotText] = useState("");
  const [newSlotPlatforms, setNewSlotPlatforms] = useState<string[]>(["instagram"]);
  const [newSlotImage, setNewSlotImage] = useState<string>("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80");

  // 🕒 Daily Planner / Queue States
  const [dailySelectedDate, setDailySelectedDate] = useState<Date>(() => {
    // Current local time: Sunday, Jun 21, 2026.
    const date = new Date("2026-06-21T06:11:39-07:00");
    return isNaN(date.getTime()) ? new Date() : date;
  });
  const [dailyPlatformFilters, setDailyPlatformFilters] = useState<string[]>([
    "instagram", "tiktok", "linkedin", "facebook", "youtube", "pinterest"
  ]);
  const [dailyDragOverHour, setDailyDragOverHour] = useState<string | null>(null);
  const [dailyDraggedId, setDailyDraggedId] = useState<string | null>(null);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [quickAddHour, setQuickAddHour] = useState("12:00");
  const [quickAddText, setQuickAddText] = useState("");
  const [quickAddImage, setQuickAddImage] = useState("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80");
  const [quickAddPlatforms, setQuickAddPlatforms] = useState<string[]>(["instagram"]);
  const [highlightedSlotHour, setHighlightedSlotHour] = useState<string | null>(null);
  const [statusAnimationTarget, setStatusAnimationTarget] = useState<string | null>(null);

  const [newSlotColorPreset, setNewSlotColorPreset] = useState<"pink" | "blue" | "yellow" | "purple" | "gray">("pink");
  const [newSlotSubtitle, setNewSlotSubtitle] = useState("");
  const [newSlotAttachmentName, setNewSlotAttachmentName] = useState("");
  const [newSlotDate, setNewSlotDate] = useState("2026-06-22");

  // Secure User Auth State Indicators
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "", fullName: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const fetchSocialAccounts = async (workspaceId: string) => {
    try {
      const res = await fetch(`/api/social-accounts?workspaceId=${workspaceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.accounts) {
          const channelsMap: Record<string, boolean> = {
            youtube: false,
            facebook: false,
            instagram: false,
            tiktok: false,
            pinterest: false,
            linkedin: false
          };
          data.accounts.forEach((acct: any) => {
            if (acct.platform in channelsMap) {
              channelsMap[acct.platform] = true;
            }
          });
          setConnectedChannels(channelsMap);
        }
      }
    } catch (err) {
      console.error("Failed to load social accounts in dashboard:", err);
    }
  };

  const checkAuthSession = async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          setProfile(data.profile);
          const wName = data.profile?.workspaces?.[0]?.name || "My Workspace";
          setCurrentWorkspace(wName);
          
          const workspaceId = data.profile?.current_workspace_id || data.profile?.workspaces?.[0]?.id;
          if (workspaceId) {
            fetchUserCampaigns(workspaceId);
            fetchSocialAccounts(workspaceId);
          }
        }
      }
    } catch (err) {
      console.error("Session verification failed:", err);
    }
  };

  useEffect(() => {
    checkAuthSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserCampaigns = async (workspaceId: string) => {
    try {
      const res = await fetch(`/api/posts?workspaceId=${workspaceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.posts) {
          const drafts: any[] = [];
          const scheduled: any[] = [];
          
          data.posts.forEach((p: any) => {
            const mediaUrl = p.post_media?.[0]?.file_url || "";
            if (p.status === "draft") {
              drafts.push({
                id: p.id,
                text: p.content,
                platform: p.target_platforms?.[0] || "instagram",
                mediaUrl
              });
            } else {
              const scheduledAt = p.scheduled_posts?.[0]?.scheduled_at || p.created_at;
              const dateObj = new Date(scheduledAt);
              const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const dayName = daysOfWeek[dateObj.getDay()];
              const hourStr = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;
              const dateStr = dateObj.toISOString().substring(0, 10);
              
              scheduled.push({
                id: p.id,
                day: dayName,
                hour: hourStr,
                platform: p.target_platforms?.[0] || "instagram",
                platforms: p.target_platforms || ["instagram"],
                text: p.content,
                mediaUrl,
                status: p.status,
                title: p.title || p.content.substring(0, 30),
                startTime: hourStr,
                endTime: `${String((dateObj.getHours() + 1) % 24).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`,
                dayIndex: dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1,
                accentColor: p.colorPreset || "#117644",
                colorPreset: p.colorPreset || "pink",
                subtitle: p.subtitle || "Campaign Queue Item",
                attachmentName: p.attachmentName || "",
                date: dateStr
              });
            }
          });
          
          setDraftPool(drafts);
          setScheduledSlots(scheduled);
        }
      }
    } catch (err) {
      console.error("Failed to retrieve user campaigns:", err);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authTab,
          email: authForm.email,
          password: authForm.password,
          fullName: authForm.fullName
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setProfile(data.profile);
        setCurrentWorkspace(data.profile?.workspaces?.[0]?.name || "My Workspace");
        setShowAuthModal(false);
        setAuthForm({ email: "", password: "", fullName: "" });
        confetti({ particleCount: 50, spread: 45 });
        
        const workspaceId = data.profile?.current_workspace_id || data.profile?.workspaces?.[0]?.id;
        if (workspaceId) {
          fetchUserCampaigns(workspaceId);
        }
      } else {
        setAuthError(data.error || "Authentication processed with failure.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Network request failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (isAuthenticated && user) {
      try {
        const response = await fetch(`/api/posts?id=${id}&userId=${user.id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          setScheduledSlots(prev => prev.filter(s => s.id !== id));
          setDraftPool(prev => prev.filter(d => d.id !== id));
          confetti({ particleCount: 10, angle: 90 });
        }
      } catch (err) {
        console.error("Delete post error:", err);
      }
    } else {
      setScheduledSlots(prev => prev.filter(s => s.id !== id));
      setDraftPool(prev => prev.filter(d => d.id !== id));
    }
  };

  const [scheduledSlots, setScheduledSlots] = useState<Array<{
    id: string;
    day: string;
    hour: string;
    platform: string; // primary visual indicator
    platforms: string[]; // multi platform array
    text: string;
    mediaUrl?: string;
    status: "published" | "scheduled" | "draft" | "failed" | "publishing";
    likes?: number;
    comments?: number;
    shares?: number;
    subtitle?: string;
    attachmentName?: string;
    isLargeCard?: boolean;
    tagBadge?: string;
    description?: string;
    // Custom requested specifications
    title?: string;
    startTime?: string;
    endTime?: string;
    dayIndex?: number;
    accentColor?: string;
    colorPreset?: "pink" | "blue" | "yellow" | "purple" | "gray";
    date?: string;
  }>>([]);

  const handleAddScheduleSlot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSlotText.trim()) return;
    
    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    const dayIdx = idxs[newSlotDay] ?? 0;
    
    // Build real calendar date object
    const scheduledDateTime = new Date(`${newSlotDate}T${newSlotHour}:00`).toISOString();

    const newSlot: any = {
      id: "slot-" + Date.now().toString(),
      day: newSlotDay,
      hour: newSlotHour,
      platform: newSlotPlatforms[0] || "instagram",
      platforms: newSlotPlatforms.length > 0 ? newSlotPlatforms : ["instagram"],
      text: newSlotText,
      mediaUrl: newSlotImage,
      status: "scheduled" as const,
      // Custom specifications fields
      title: newSlotText,
      startTime: newSlotHour,
      endTime: (() => {
        const [h, m] = newSlotHour.split(":");
        return `${String(parseInt(h) + 1).padStart(2, "0")}:${m || "00"}`;
      })(),
      dayIndex: dayIdx,
      accentColor: newSlotColorPreset === "pink" ? "#E1528A" : newSlotColorPreset === "blue" ? "#57A1E3" : newSlotColorPreset === "yellow" ? "#F5C242" : newSlotColorPreset === "purple" ? "#A855F7" : "#042F1A",
      colorPreset: newSlotColorPreset,
      subtitle: newSlotSubtitle || "Primary Core",
      attachmentName: newSlotAttachmentName || "",
      date: newSlotDate
    };

    if (isAuthenticated && profile && user) {
      try {
        const workspaceId = profile.current_workspace_id || profile.workspaces?.[0]?.id;
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            userId: user.id,
            content: newSlotText,
            title: newSlotText.substring(0, 30),
            status: "scheduled",
            targetPlatforms: newSlotPlatforms.length > 0 ? newSlotPlatforms : ["instagram"],
            scheduledTime: scheduledDateTime,
            mediaUrls: newSlotImage ? [newSlotImage] : [],
            attachmentName: newSlotAttachmentName,
            colorPreset: newSlotColorPreset,
            subtitle: newSlotSubtitle || "Primary Core"
          })
        });
        if (response.ok) {
          const result = await response.json();
          const dbPost = result.post;
          newSlot.id = dbPost.id;
          setScheduledSlots(prev => [...prev, newSlot]);
          confetti({ particleCount: 30, spread: 40 });
        }
      } catch (err) {
        console.error("Save post error:", err);
      }
    } else {
      setScheduledSlots(prev => [...prev, newSlot]);
    }

    setNewSlotText("");
    setNewSlotSubtitle("");
    setNewSlotAttachmentName("");
    setIsQuickPostOpen(false);
    confetti({ particleCount: 70, spread: 50 });
  };

  // 🕒 DAILY PLANNER COMPREHENSIVE ENGINE GUIDES
  const getCellDateStringAtRoot = (day: string, offset: number) => {
    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    const base = new Date("2026-05-11T00:00:00");
    base.setDate(base.getDate() + idxs[day] + (offset * 7));
    const year = base.getFullYear();
    const month = String(base.getMonth() + 1).padStart(2, "0");
    const dateVal = String(base.getDate()).padStart(2, "0");
    return `${year}-${month}-${dateVal}`;
  };

  const getAbbrevDay = (date: Date) => {
    const daysKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysKeys[date.getDay()];
  };

  const format12Hour = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:00 ${ampm}`;
  };

  const getHeatVal = (hourNum: number, platform: string) => {
    if (platform === "instagram") {
      if (hourNum === 12) return 0.95;
      if (hourNum === 21) return 0.90;
      if (hourNum === 18) return 0.80;
      if (hourNum === 9) return 0.60;
      if (hourNum >= 10 && hourNum <= 22) return 0.40;
      return 0.15;
    }
    if (platform === "tiktok") {
      if (hourNum === 20) return 0.95;
      if (hourNum === 18) return 0.90;
      if (hourNum === 22) return 0.85;
      if (hourNum === 15) return 0.75;
      if (hourNum >= 14 && hourNum <= 23) return 0.45;
      return 0.10;
    }
    if (platform === "linkedin") {
      if (hourNum === 9) return 0.95;
      if (hourNum === 17) return 0.85;
      if (hourNum === 8) return 0.80;
      if (hourNum === 12) return 0.70;
      if (hourNum >= 8 && hourNum <= 18) return 0.50;
      return 0.05;
    }
    if (platform === "facebook") {
      if (hourNum === 13) return 0.85;
      if (hourNum === 15) return 0.80;
      if (hourNum === 19) return 0.75;
      if (hourNum === 11) return 0.70;
      if (hourNum >= 9 && hourNum <= 21) return 0.40;
      return 0.15;
    }
    if (platform === "youtube") {
      if (hourNum === 18) return 0.95;
      if (hourNum === 21) return 0.85;
      if (hourNum === 15) return 0.80;
      if (hourNum === 12) return 0.75;
      if (hourNum >= 11 && hourNum <= 22) return 0.45;
      return 0.15;
    }
    if (platform === "pinterest") {
      if (hourNum === 21) return 0.95;
      if (hourNum === 20) return 0.90;
      if (hourNum === 14) return 0.75;
      if (hourNum === 10) return 0.65;
      if (hourNum >= 10 && hourNum <= 23) return 0.40;
      return 0.10;
    }
    return 0.20;
  };

  const getCompositeHeatValue = useCallback((hourNum: number) => {
    if (dailyPlatformFilters.length === 0) return 0.15;
    let sum = 0;
    dailyPlatformFilters.forEach(p => {
      sum += getHeatVal(hourNum, p);
    });
    return sum / dailyPlatformFilters.length;
  }, [dailyPlatformFilters]);

  const [displayedHealthPct, setDisplayedHealthPct] = useState(0);

  useEffect(() => {
    if (activeTab === "planner") {
      const postsForSelectedDay = scheduledSlots.filter(s => s.day === getAbbrevDay(dailySelectedDate) && (s.platforms || [s.platform || "instagram"]).some(p => dailyPlatformFilters.includes(p)));
      const optimalCount = postsForSelectedDay.filter(p => getCompositeHeatValue(parseInt(p.hour.split(":")[0])) >= 0.55).length;
      const pct = postsForSelectedDay.length > 0 ? Math.round((optimalCount / postsForSelectedDay.length) * 100) : 100;
      
      setDisplayedHealthPct(0);
      const timer = setTimeout(() => {
        setDisplayedHealthPct(pct);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, dailySelectedDate, dailyPlatformFilters, scheduledSlots, getCompositeHeatValue]);

  const handleRetryPublish = (postId: string) => {
    setStatusAnimationTarget(postId);
    setScheduledSlots(prev => prev.map(p => p.id === postId ? { ...p, status: "publishing" } : p));
    
    setTimeout(() => {
      setScheduledSlots(prev => prev.map(p => p.id === postId ? { 
        ...p, 
        status: "published",
        likes: Math.floor(Math.random() * 25) + 12,
        comments: Math.floor(Math.random() * 8) + 2,
        shares: Math.floor(Math.random() * 4) + 1
      } : p));
      
      setStatusAnimationTarget(null);
      confetti({ particleCount: 30, spread: 25 });
    }, 1500);
  };

  const handleDropOnHour = (targetHour: string) => {
    if (!dailyDraggedId) return;
    
    setScheduledSlots(prev => prev.map(post => {
      if (post.id === dailyDraggedId) {
        const [hVal, mVal] = targetHour.split(":");
        const endHourVal = `${String(parseInt(hVal) + 1).padStart(2, "0")}:${mVal || "00"}`;
        return { 
          ...post, 
          hour: targetHour,
          startTime: targetHour,
          endTime: endHourVal
        };
      }
      return post;
    }));
    
    const movedCard = scheduledSlots.find(c => c.id === dailyDraggedId);
    if (movedCard) {
      setCalendarToast({
        message: `Rescheduled ${movedCard.platform} post to ${targetHour}`,
        originalSlot: { id: movedCard.id, day: movedCard.day, hour: movedCard.hour }
      });
    }
    
    setDailyDraggedId(null);
    setDailyDragOverHour(null);
    confetti({ particleCount: 25, spread: 20 });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, day: string, hour: string) => {
    e.preventDefault();
    setDragOverCell({ day, hour });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, day: string, hour: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedId;
    if (!id) return;
    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    const nextDate = getCellDateStringAtRoot(day, currentWeekOffset);

    if (id.startsWith("draft-")) {
      const draftItem = draftPool.find(d => d.id === id);
      if (draftItem) {
        const [hVal, mVal] = hour.split(":");
        const endHourVal = `${String(parseInt(hVal) + 1).padStart(2, "0")}:${mVal || "00"}`;
        const newSlot = {
          id: "slot-" + Date.now().toString(),
          day,
          hour,
          platform: draftItem.platform,
          platforms: [draftItem.platform],
          text: draftItem.text,
          mediaUrl: draftItem.mediaUrl,
          status: "scheduled" as const,
          // Custom specifications fields
          title: draftItem.text,
          startTime: hour,
          endTime: endHourVal,
          dayIndex: idxs[day] ?? 0,
          accentColor: "var(--accent-scheduled)",
          date: nextDate
        };
        setScheduledSlots(prev => [...prev, newSlot]);
        setDraftPool(prev => prev.filter(d => d.id !== id));
        setCalendarToast({
          message: `Scheduled draft as active campaign on ${day} at ${hour}!`,
          originalSlot: null
        });
        confetti({ particleCount: 40, spread: 45 });
      }
    } else {
      setScheduledSlots(prev => prev.map(post => {
        if (post.id === id) {
          const [hVal, mVal] = hour.split(":");
          const endHourVal = `${String(parseInt(hVal) + 1).padStart(2, "0")}:${mVal || "00"}`;
          return { 
            ...post, 
            day, 
            hour,
            title: post.title || post.text,
            startTime: hour,
            endTime: endHourVal,
            dayIndex: idxs[day] ?? 0,
            date: nextDate
          };
        }
        return post;
      }));

      const movedCard = scheduledSlots.find(c => c.id === id);
      if (movedCard) {
        setCalendarToast({
          message: `Rescheduled ${movedCard.platform} post to ${day} at ${hour}`,
          originalSlot: { id: movedCard.id, day: movedCard.day, hour: movedCard.hour }
        });
      }
    }

    setDraggedId(null);
    setDragOverCell(null);
    confetti({ particleCount: 25, spread: 20 });
  };

  const handleDropToDraftPool = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedId;
    if (!id) return;

    if (!id.startsWith("draft-")) {
      const scheduledItem = scheduledSlots.find(s => s.id === id);
      if (scheduledItem) {
        setScheduledSlots(prev => prev.filter(s => s.id !== id));
        const newDraft = {
          id: "draft-" + Date.now().toString(),
          text: scheduledItem.text,
          platform: scheduledItem.platform,
          mediaUrl: scheduledItem.mediaUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80"
        };
        setDraftPool(prev => [...prev, newDraft]);
        setCalendarToast({
          message: `Unscheduled item and moved back to Drafts Pool.`,
          originalSlot: null
        });
        confetti({ particleCount: 20 });
      }
    }
    setDraggedId(null);
  };

  const handleUseSlotHighlight = (hourLabel: string) => {
    const hNum = parseInt(hourLabel.split(":")[0]);
    setHighlightedSlotHour(hourLabel);
    
    setTimeout(() => {
      setHighlightedSlotHour(null);
    }, 1800);
    
    if (timelineScrollContainerRef.current) {
      const scrollOffset = hNum * 120 - 100;
      timelineScrollContainerRef.current.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: "smooth"
      });
    }
  };

  const handleCreateQuickAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddText.trim()) return;
    
    const abbrevDay = getAbbrevDay(dailySelectedDate);
    const newPost = {
      id: "quick-" + Date.now().toString(),
      day: abbrevDay,
      hour: quickAddHour,
      platform: quickAddPlatforms[0] || "instagram",
      platforms: quickAddPlatforms.length > 0 ? quickAddPlatforms : ["instagram"],
      text: quickAddText,
      mediaUrl: quickAddImage || undefined,
      status: "scheduled" as const
    };
    
    setScheduledSlots(prev => [...prev, newPost]);
    setIsQuickAddModalOpen(false);
    setQuickAddText("");
    confetti({ particleCount: 50, spread: 35 });
    setCalendarToast({ message: `Scheduled new post slot for ${quickAddHour}`, originalSlot: null });
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // API Call: Captions drafted via Gemini API
  const handleGenerateCaption = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform: activePlatform })
      });
      
      let data;
      try {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.warn("Caption generation API returned non-JSON / error:", text);
          data = { caption: `🚀 ${prompt}\n\nOur latest visual builder streamlines all your publishing workflows on one simple unified social dashboard. Let us know your thoughts!\n\n#SmartPosting #EnterpriseSaaS #Automation` };
        }
      } catch (parseErr) {
        console.warn("Failed to parse caption API response as JSON:", parseErr);
        data = { caption: `🚀 ${prompt}\n\nOur latest visual builder streamlines all your publishing workflows on one simple unified social dashboard. Let us know your thoughts!\n\n#SmartPosting #EnterpriseSaaS #Automation` };
      }

      if (data.caption) {
        setPlatformCaption(data.caption);
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Assist drawer generation using custom tone and specific user guidelines
  const handleAiAssistGenerate = async () => {
    if (isAiGenerating) return;
    setIsAiGenerating(true);
    try {
      const refinedPrompt = `Write a high-converting ${aiTone} post caption. Target platform is ${activePreviewTab}. Guidelines: ${aiGuidelines || 'none'}. Content brief context: ${prompt || platformCaption}. Ensure there are line splits, relevant emojis, and strategic organic appeal.`;
      const res = await fetch("/api/gemini/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: refinedPrompt, platform: activePreviewTab })
      });
      
      let data;
      try {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.warn("AI Assist API returned non-JSON / error:", text);
          data = { caption: `🚀 Refined Caption\n\nOptimized with ${aiTone} tone for ${activePreviewTab}. Guidelines: ${aiGuidelines || 'none'}.\n\n#SmartPosting #CreatorSuite` };
        }
      } catch (parseErr) {
        console.warn("Failed to parse AI Assist API response as JSON:", parseErr);
        data = { caption: `🚀 Refined Caption\n\nOptimized with ${aiTone} tone for ${activePreviewTab}. Guidelines: ${aiGuidelines || 'none'}.\n\n#SmartPosting #CreatorSuite` };
      }

      if (data.caption) {
        handleUseCaption(data.caption);
        confetti({ particleCount: 60, spread: 45 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // API Call: Creative design via image api
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      
      let data;
      try {
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.warn("Image API returned non-JSON / error:", text);
          data = { image: `https://picsum.photos/seed/${encodeURIComponent(imagePrompt)}/800/600` };
        }
      } catch (parseErr) {
        console.warn("Failed to parse Image API response as JSON:", parseErr);
        data = { image: `https://picsum.photos/seed/${encodeURIComponent(imagePrompt)}/800/600` };
      }

      if (data && data.image) {
        setGeneratedImage(data.image);
        confetti({ particleCount: 50, spread: 40, colors: ["#10b981", "#3b82f6"] });
      }
    } catch (e) {
      console.error("Failed to generate image:", e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(platformCaption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Analytics Snapshot Graph Filters
  const [snapshotFilters, setSnapshotFilters] = useState({
    Instagram: true,
    TikTok: true,
    LinkedIn: true,
    YouTube: false,
    Facebook: false
  });

  const toggleSnapshotFilter = (platform: keyof typeof snapshotFilters) => {
    setSnapshotFilters(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // Recent Performance Options & Best Time to Post states
  const [selectedPerformanceMetric, setSelectedPerformanceMetric] = useState<"engagement" | "reach" | "clicks">("engagement");
  const [selectedPerformancePlatform, setSelectedPerformancePlatform] = useState<string>("all");
  const [bestTimeActivePlatform, setBestTimeActivePlatform] = useState<string>("instagram");
  const [hoveredBestTimeSlot, setHoveredBestTimeSlot] = useState<string | null>(null);

  const recentPerformanceData: Record<string, Record<string, { value: number; change: string; positive: boolean; chart: { day: string; val: number }[] }>> = {
    all: {
      engagement: {
        value: 5.8,
        change: "+1.2%",
        positive: true,
        chart: [
          { day: "Mon", val: 4.2 }, { day: "Tue", val: 4.8 }, { day: "Wed", val: 5.1 },
          { day: "Thu", val: 4.9 }, { day: "Fri", val: 5.4 }, { day: "Sat", val: 5.6 }, { day: "Sun", val: 5.8 }
        ]
      },
      reach: {
        value: 142.5,
        change: "+14.3%",
        positive: true,
        chart: [
          { day: "Mon", val: 110 }, { day: "Tue", val: 115 }, { day: "Wed", val: 124 },
          { day: "Thu", val: 120 }, { day: "Fri", val: 132 }, { day: "Sat", val: 138 }, { day: "Sun", val: 142.5 }
        ]
      },
      clicks: {
        value: 12450,
        change: "+8.7%",
        positive: true,
        chart: [
          { day: "Mon", val: 8200 }, { day: "Tue", val: 8900 }, { day: "Wed", val: 9400 },
          { day: "Thu", val: 9100 }, { day: "Fri", val: 10500 }, { day: "Sat", val: 11200 }, { day: "Sun", val: 12450 }
        ]
      }
    },
    instagram: {
      engagement: {
        value: 6.4,
        change: "+1.8%",
        positive: true,
        chart: [
          { day: "Mon", val: 5.0 }, { day: "Tue", val: 5.5 }, { day: "Wed", val: 5.8 },
          { day: "Thu", val: 5.6 }, { day: "Fri", val: 6.0 }, { day: "Sat", val: 6.2 }, { day: "Sun", val: 6.4 }
        ]
      },
      reach: {
        value: 45.2,
        change: "+18.2%",
        positive: true,
        chart: [
          { day: "Mon", val: 32 }, { day: "Tue", val: 35 }, { day: "Wed", val: 39 },
          { day: "Thu", val: 37 }, { day: "Fri", val: 41 }, { day: "Sat", val: 43 }, { day: "Sun", val: 45.2 }
        ]
      },
      clicks: {
        value: 4230,
        change: "+12.1%",
        positive: true,
        chart: [
          { day: "Mon", val: 2800 }, { day: "Tue", val: 3100 }, { day: "Wed", val: 3400 },
          { day: "Thu", val: 3200 }, { day: "Fri", val: 3700 }, { day: "Sat", val: 3900 }, { day: "Sun", val: 4230 }
        ]
      }
    },
    linkedin: {
      engagement: {
        value: 4.2,
        change: "+0.5%",
        positive: true,
        chart: [
          { day: "Mon", val: 3.5 }, { day: "Tue", val: 3.8 }, { day: "Wed", val: 3.9 },
          { day: "Thu", val: 3.7 }, { day: "Fri", val: 4.0 }, { day: "Sat", val: 4.1 }, { day: "Sun", val: 4.2 }
        ]
      },
      reach: {
        value: 18.9,
        change: "+4.1%",
        positive: true,
        chart: [
          { day: "Mon", val: 15 }, { day: "Tue", val: 16 }, { day: "Wed", val: 17 },
          { day: "Thu", val: 16.5 }, { day: "Fri", val: 18 }, { day: "Sat", val: 18.5 }, { day: "Sun", val: 18.9 }
        ]
      },
      clicks: {
        value: 1840,
        change: "+3.2%",
        positive: true,
        chart: [
          { day: "Mon", val: 1400 }, { day: "Tue", val: 1500 }, { day: "Wed", val: 1600 },
          { day: "Thu", val: 1550 }, { day: "Fri", val: 1700 }, { day: "Sat", val: 1750 }, { day: "Sun", val: 1840 }
        ]
      }
    },
    youtube: {
      engagement: {
        value: 7.8,
        change: "+2.1%",
        positive: true,
        chart: [
          { day: "Mon", val: 6.2 }, { day: "Tue", val: 6.8 }, { day: "Wed", val: 7.1 },
          { day: "Thu", val: 6.9 }, { day: "Fri", val: 7.4 }, { day: "Sat", val: 7.6 }, { day: "Sun", val: 7.8 }
        ]
      },
      reach: {
        value: 62.4,
        change: "+15.6%",
        positive: true,
        chart: [
          { day: "Mon", val: 48 }, { day: "Tue", val: 51 }, { day: "Wed", val: 54 },
          { day: "Thu", val: 53 }, { day: "Fri", val: 58 }, { day: "Sat", val: 60 }, { day: "Sun", val: 62.4 }
        ]
      },
      clicks: {
        value: 5120,
        change: "+9.4%",
        positive: true,
        chart: [
          { day: "Mon", val: 3900 }, { day: "Tue", val: 4100 }, { day: "Wed", val: 4300 },
          { day: "Thu", val: 4200 }, { day: "Fri", val: 4600 }, { day: "Sat", val: 4800 }, { day: "Sun", val: 5120 }
        ]
      }
    },
    tiktok: {
      engagement: {
        value: 8.5,
        change: "-0.4%",
        positive: false,
        chart: [
          { day: "Mon", val: 9.1 }, { day: "Tue", val: 8.9 }, { day: "Wed", val: 8.7 },
          { day: "Thu", val: 8.8 }, { day: "Fri", val: 8.6 }, { day: "Sat", val: 8.4 }, { day: "Sun", val: 8.5 }
        ]
      },
      reach: {
        value: 12.8,
        change: "+22.4%",
        positive: true,
        chart: [
          { day: "Mon", val: 8.5 }, { day: "Tue", val: 9.2 }, { day: "Wed", val: 10.1 },
          { day: "Thu", val: 9.8 }, { day: "Fri", val: 11.2 }, { day: "Sat", val: 12.0 }, { day: "Sun", val: 12.8 }
        ]
      },
      clicks: {
        value: 1260,
        change: "+15.8%",
        positive: true,
        chart: [
          { day: "Mon", val: 850 }, { day: "Tue", val: 940 }, { day: "Wed", val: 1020 },
          { day: "Thu", val: 980 }, { day: "Fri", val: 1110 }, { day: "Sat", val: 1180 }, { day: "Sun", val: 1260 }
        ]
      }
    }
  };

  const bestTimesToPost = {
    instagram: {
      days: ["Wednesday", "Friday"],
      slots: [
        { time: "11:00 AM", score: 98, note: "Midday catch-up scroll peak" },
        { time: "3:00 PM", score: 85, note: "Afternoon slump dip check" },
        { time: "7:00 PM", score: 92, note: "Post-work wind-down prime" }
      ],
      desc: "Visual layout and rich reels perform exceptionally well mid-week."
    },
    linkedin: {
      days: ["Tuesday", "Thursday"],
      slots: [
        { time: "8:30 AM", score: 95, note: "Commute reading & industry check-in" },
        { time: "12:15 PM", score: 89, note: "Lunch break networking slot" },
        { time: "5:30 PM", score: 82, note: "End-of-day wrap-up & scrolling" }
      ],
      desc: "Professional insights, carousel posts, and corporate updates spike mid-morning."
    },
    youtube: {
      days: ["Thursday", "Saturday"],
      slots: [
        { time: "10:00 AM", score: 88, note: "Weekend hobbyist queue peak" },
        { time: "2:00 PM", score: 94, note: "Afternoon long-form viewing" },
        { time: "6:00 PM", score: 91, note: "Dinner-time entertainment spike" }
      ],
      desc: "In-depth video formats benefit from early evening publish schedules."
    },
    tiktok: {
      days: ["Monday", "Wednesday"],
      slots: [
        { time: "12:00 PM", score: 91, note: "Lunchtime high-speed scroll" },
        { time: "4:00 PM", score: 96, note: "After-school & end-of-work peak" },
        { time: "9:00 PM", score: 99, note: "Late-night immersive scrolling" }
      ],
      desc: "Fast trends and reels benefit from high-density late afternoon windows."
    },
    facebook: {
      days: ["Thursday", "Sunday"],
      slots: [
        { time: "9:00 AM", score: 84, note: "Morning community updates check" },
        { time: "1:00 PM", score: 90, note: "Sunday family & leisure scrolling" },
        { time: "8:00 PM", score: 87, note: "Evening community feed wind-down" }
      ],
      desc: "Community discussions and curated image albums peak on weekends."
    }
  };

  const recentPostsData: Record<string, { id: string; title: string; type: "reel" | "post"; views: string; likes: string; date: string; thumbnail: string; platform: string }[]> = {
    all: [
      {
        id: "p1",
        title: "🌱 10 Simple Ways to Reduce Plastic in Workspace",
        type: "reel",
        views: "18.4K",
        likes: "1.2K",
        date: "2 days ago",
        thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "instagram"
      },
      {
        id: "p2",
        title: "⚡ Switching to Solar Power: A 12-Month Case Study",
        type: "post",
        views: "12.8K",
        likes: "920",
        date: "3 days ago",
        thumbnail: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "linkedin"
      },
      {
        id: "p3",
        title: "📦 Unboxing our 100% Biodegradable Packaging",
        type: "reel",
        views: "42.1K",
        likes: "3.8K",
        date: "5 days ago",
        thumbnail: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "tiktok"
      },
      {
        id: "p4",
        title: "🌍 Ultimate Eco-Friendly Office Transformation Guide",
        type: "post",
        views: "8.5K",
        likes: "610",
        date: "1 week ago",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "youtube"
      }
    ],
    instagram: [
      {
        id: "ig1",
        title: "🌱 10 Simple Ways to Reduce Plastic in Workspace",
        type: "reel",
        views: "18.4K",
        likes: "1.2K",
        date: "2 days ago",
        thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "instagram"
      },
      {
        id: "ig2",
        title: "💚 Our team's weekly zero-waste challenge highlights!",
        type: "reel",
        views: "9.2K",
        likes: "580",
        date: "4 days ago",
        thumbnail: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "instagram"
      },
      {
        id: "ig3",
        title: "✨ Quick Aesthetic Setup Tour (Green-themed Desk)",
        type: "reel",
        views: "24.1K",
        likes: "1.9K",
        date: "5 days ago",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "instagram"
      }
    ],
    linkedin: [
      {
        id: "li1",
        title: "⚡ Switching to Solar Power: A 12-Month Case Study",
        type: "post",
        views: "12.8K",
        likes: "920",
        date: "3 days ago",
        thumbnail: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "linkedin"
      },
      {
        id: "li2",
        title: "📈 How corporate ESG scores directly impact hiring metrics in 2026",
        type: "post",
        views: "5.1K",
        likes: "340",
        date: "6 days ago",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "linkedin"
      }
    ],
    youtube: [
      {
        id: "yt1",
        title: "🌍 Ultimate Eco-Friendly Office Transformation Guide",
        type: "post",
        views: "8.5K",
        likes: "610",
        date: "1 week ago",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "youtube"
      },
      {
        id: "yt2",
        title: "🔋 Sustainable Tech of 2026: What's Worth Buying?",
        type: "post",
        views: "24.5K",
        likes: "2.1K",
        date: "2 weeks ago",
        thumbnail: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "youtube"
      }
    ],
    tiktok: [
      {
        id: "tt1",
        title: "📦 Unboxing our 100% Biodegradable Packaging",
        type: "reel",
        views: "42.1K",
        likes: "3.8K",
        date: "5 days ago",
        thumbnail: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "tiktok"
      },
      {
        id: "tt2",
        title: "🤫 Secret eco lifehack that corporations hate!",
        type: "reel",
        views: "110.2K",
        likes: "9.5K",
        date: "1 week ago",
        thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=150&h=150&q=80",
        platform: "tiktok"
      }
    ]
  };

  // Shared Data Arrays
  const sparkWeek = [{ value: 12 }, { value: 19 }, { value: 15 }, { value: 24 }, { value: 22 }, { value: 24 }];
  const sparkMonth = [{ value: 95 }, { value: 110 }, { value: 120 }, { value: 135 }, { value: 140 }, { value: 142 }];
  const sparkEngage = [{ value: 4.8 }, { value: 5.1 }, { value: 5.4 }, { value: 5.2 }, { value: 5.7 }, { value: 5.8 }];
  const sparkAccounts = [{ value: 2 }, { value: 3 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }];

  const performanceSnapshotData = [
    { name: "Mon", bar: 2400, Instagram: 800, TikTok: 1200, LinkedIn: 400, YouTube: 500, Facebook: 600 },
    { name: "Tue", bar: 2900, Instagram: 950, TikTok: 1450, LinkedIn: 500, YouTube: 620, Facebook: 710 },
    { name: "Wed", bar: 3300, Instagram: 1100, TikTok: 1720, LinkedIn: 480, YouTube: 700, Facebook: 800 },
    { name: "Thu", bar: 2800, Instagram: 1000, TikTok: 1300, LinkedIn: 500, YouTube: 600, Facebook: 650 },
    { name: "Fri", bar: 4500, Instagram: 1550, TikTok: 2150, LinkedIn: 800, YouTube: 1100, Facebook: 1210 },
    { name: "Sat", bar: 5800, Instagram: 2100, TikTok: 2900, LinkedIn: 800, YouTube: 1400, Facebook: 1500 },
    { name: "Sun", bar: 5100, Instagram: 1800, TikTok: 2500, LinkedIn: 700, YouTube: 1200, Facebook: 1300 },
  ];

  const optimalHeatmapData = [
    { hour: "08:00", ratio: 45 },
    { hour: "10:00", ratio: 75 },
    { hour: "12:00", ratio: 98 },
    { hour: "14:00", ratio: 60 },
    { hour: "16:00", ratio: 82 },
    { hour: "18:00", ratio: 115 },
    { hour: "20:00", ratio: 135 },
    { hour: "22:00", ratio: 70 }
  ];

  // List of Nav Items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Layout className="w-4 h-4" /> },
    { id: "publish", label: "Publish", icon: <Send className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "accounts", label: "Accounts", icon: <Users className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
  ];

  const bottomNavItems = [
    { id: "help", label: "Help", icon: <HelpCircle className="w-4 h-4" /> }
  ];

  // Quick Action triggers mapped to nav items
  const handleQuickAction = (tabId: string) => {
    setActiveTab(tabId);
    confetti({ particleCount: 20, spread: 25 });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF6EE] text-[#042F1A] font-sans antialiased selection:bg-[#C5E729]/30">
      
      {isDraggingFile && (
        <div className="fixed inset-0 z-[99999] bg-[#042F1A]/85 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center pointer-events-none transition-all duration-300">
          <div className="max-w-md bg-[#FAF6EE] p-10 rounded-[32px] border-4 border-dashed border-[#117644] shadow-2xl flex flex-col items-center gap-6 animate-bounce">
            <div className="w-20 h-20 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center">
              <Upload className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">Drop files to upload</h2>
              <p className="text-xs text-stone-500 mt-2 font-medium">Release multiple images or videos anywhere on the window to load them directly into your Postrick Composer.</p>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <OnboardingWizard
          isDarkMode={isDarkMode}
          onSkip={() => {
            setShowOnboarding(false);
          }}
          onComplete={(data) => {
            setShowOnboarding(false);
            if (data.workspaceName) {
              setCurrentWorkspace(data.workspaceName);
            }
            if (data.userName) {
              setDashboardUserName(data.userName);
            }
            if (data.connectedChannels) {
              setConnectedChannels(data.connectedChannels);
            }
            if (data.firstPostScheduled && data.postData) {
              const newPost = {
                id: `onb-post-${Date.now()}`,
                day: "Tue",
                hour: "12:00",
                platform: data.postData.platform,
                platforms: data.postData.platforms,
                text: data.postData.text,
                mediaUrl: data.postData.mediaUrl,
                status: "scheduled" as const,
                likes: 0,
                comments: 0,
                shares: 0,
              };
              setScheduledSlots(prev => [newPost, ...prev]);
            }
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 }
            });
          }}
        />
      )}
      
      {/* 1. COLLAPSIBLE LEFT SIDEBAR */}
      <aside 
        id="sidebar"
        className={`hidden md:flex flex-col justify-between border-r border-[#eae3d2] glass-sidebar transition-all duration-300 relative z-30 ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-[#FAF6EE]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <PostrickLogo className="w-8 h-8 flex-shrink-0" color="#1E3216" bgStrokeColor="#FAF6EE" />
              {!isSidebarCollapsed && (
                <span className="font-serif font-black text-sm tracking-tight text-[#042F1A] animate-fadeIn whitespace-nowrap">
                  Postrick<span className="text-[10px] font-sans align-super">®</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 space-y-1.5 pt-6">
            {navItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "home") {
                      onExitApp();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all group relative border ${
                    active 
                      ? "bg-[#042F1A]/5 text-[#042F1A] border-[#042F1A]/10 pl-4" 
                      : "text-[#042F1A]/75 border-transparent hover:bg-neutral-50 hover:text-black"
                  }`}
                >
                  {/* Left accent border on active */}
                  {active && (
                    <span id={`nav-active-pillar-${item.id}`} className="absolute left-0 top-2 bottom-2 w-1 rounded-r-lg bg-[#117644]" />
                  )}
                  <span className={`${active ? "text-[#117644] scale-110" : "text-[#042F1A]/60 group-hover:text-[#117644] group-hover:scale-115"} transition-transform duration-200`}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed ? (
                    <span className="animate-fadeIn">{item.label}</span>
                  ) : (
                    /* Tooltip for collapsed view */
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 bg-[#042F1A] text-white text-[10px] py-1 px-2.5 rounded-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50 shadow-md border border-[#FAF6EE]/10 font-sans tracking-wide">
                      {item.label}
                    </div>
                  )}
                  
                  {/* Visual bullet of subtle transition feedback for hover */}
                  {!active && !isSidebarCollapsed && (
                    <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#117644] font-bold text-[10px]">
                      ➔
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sizable Analytic Column on the side bar navigation of dashboard */}
          {!isSidebarCollapsed && (
            <div className="mx-4 my-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100/85">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#042F1A]/60 font-black">
                  Analytic Column
                </span>
                <span className="text-[8px] font-bold text-white bg-[#117644] px-1.5 py-0.5 rounded-full font-sans uppercase">
                  Live
                </span>
              </div>
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center justify-between text-[11px] font-black text-[#042F1A]">
                  <span className="opacity-75">Growth Profile</span>
                  <span className="text-[#117644]">+24.8%</span>
                </div>
                {/* Micro trendbar */}
                <div className="w-full bg-[#FAF6EE] h-1.5 rounded-full overflow-hidden border border-[#eae3d2]/40">
                  <div className="bg-[#117644] h-full rounded-full" style={{ width: "74%" }} />
                </div>
                
                {/* Key Social Stats Column Nodes */}
                <div className="pt-2 mt-1 border-t border-neutral-200/50 space-y-1 text-[10px] font-semibold text-[#042F1A]/80">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">📸 Instagram</span>
                    <span className="font-mono font-black text-[#117644]">24.5k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">💼 LinkedIn</span>
                    <span className="font-mono font-black text-[#117644]">8.2k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">🎬 TikTok</span>
                    <span className="font-mono font-black text-[#117644]">110.4k</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions of Sidebar + Collapse Trigger */}
        <div className="p-3 space-y-2 border-t border-[#FAF6EE] bg-[#FAF6EE]/20">
          {bottomNavItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all group relative border ${
                  active 
                    ? "bg-[#042F1A]/5 text-[#042F1A] pl-4 border-[#042F1A]/10" 
                    : "text-[#042F1A]/70 border-transparent hover:bg-neutral-50 hover:text-black"
                }`}
              >
                <span className={`${active ? "text-[#117644] scale-110" : "text-[#042F1A]/60 group-hover:text-[#117644] group-hover:scale-115"} transition-transform duration-200`}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed ? (
                  <span className="animate-fadeIn">{item.label}</span>
                ) : (
                  /* Tooltip for collapsed view */
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 bg-[#042F1A] text-white text-[10px] py-1 px-2.5 rounded-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50 shadow-md border border-[#FAF6EE]/10 font-sans tracking-wide">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-black mt-2 transition-colors duration-150"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WINDOW FRAME */}
      <div className="flex-1 flex flex-col min-w-0 pl-[72px] md:pl-0">
        
        {/* TOP COMPONENT HEADER BAR */}
        <header className="sticky top-0 z-20 border-b border-[#eae3d2] bg-white px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          
          {/* Breadcrumb path label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#117644] font-black">
              In-app
            </span>
            <span className="text-neutral-300">/</span>
            <span className="font-serif font-black text-sm text-[#042F1A] capitalize">
              {activeTab}
            </span>
          </div>

          {/* Center search (Cmd+K) trigger action bar */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-sm px-4">
            <button
              onClick={() => setShowCommandPalette(true)}
              className="w-full flex items-center justify-between px-4 py-1.8 rounded-full border border-[#eae3d2] bg-[#FAF5EB]/50 hover:border-[#117644]/40 text-neutral-400 text-xs transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-[11px] text-[#042F1A]/50">Search tools and logs...</span>
              </div>
              <kbd className="text-[9px] font-mono font-black border bg-white px-1.5 py-0.5 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Quick status actions corner items */}
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={onExitApp}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[10px] uppercase tracking-widest font-extrabold bg-[#FAF5EB] border-[#eae3d2] text-[#042F1A] hover:bg-[#eae3d1] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Webpage
            </button>

            {/* Switch workspace dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wide font-black uppercase text-[#042F1A]/70 hover:bg-neutral-50 hover:text-black">
                <span>{currentWorkspace.split(" ")[0]} 🚀</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#eae3d2] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20 p-1">
                {["Postrick Main Brand", "Personal Creator Account", "Brand Beta Testing"].map((ws) => (
                  <button
                    key={ws}
                    onClick={() => { setCurrentWorkspace(ws); confetti({ particleCount: 15 }); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold text-neutral-700 hover:bg-[#042F1A]/5 hover:text-black transition-colors"
                  >
                    {ws}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Bell overlay with unread indicators */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setUnreadNotifications(false); }}
                className="p-2 rounded-full border border-neutral-100 hover:bg-neutral-50 relative focus:outline-none transition-colors"
              >
                <Bell className="w-4 h-4 text-[#042F1A]" />
                {unreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-68 bg-white border border-[#eae3d2] rounded-2xl shadow-xl z-50 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="text-[9px] font-bold hover:underline text-[#117644]">Dismiss</button>
                    </div>
                    <div className="space-y-2.5 divide-y divide-[#FAF6EE] max-h-56 overflow-y-auto">
                      <div className="pt-2 text-[10.5px] leading-relaxed">
                        <p className="font-bold">🎉 Video published successfully</p>
                        <p className="text-[9px] text-[#042F1A]/50">YouTube API live · 45 mins ago</p>
                      </div>
                      <div className="pt-2 text-[10.5px] leading-relaxed">
                        <p className="font-bold">⚠️ Instagram connection alert</p>
                        <p className="text-[9px] text-amber-600 font-bold">API handshake token expiring in 2 days</p>
                      </div>
                      <div className="pt-2 text-[10.5px] leading-relaxed">
                        <p className="font-bold">💡 Design advice</p>
                        <p className="text-[9px] text-[#042F1A]/50">Ideal direct action trigger time is 18:00 today</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile widget bar info */}
            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => { if (!isAuthenticated) { setShowAuthModal(true); setAuthTab("login"); } }}>
              <div className="w-8 h-8 rounded-full bg-[#117644]/10 border border-[#117644]/25 flex items-center justify-center font-bold text-xs text-[#117644] uppercase shrink-0">
                {isAuthenticated ? (profile?.full_name?.substring(0, 2) || user?.email?.substring(0, 2) || "U") : "G"}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="hidden xl:inline text-[11px] font-black select-none text-[#042F1A] leading-tight truncate">
                  {isAuthenticated ? (profile?.full_name || user?.email) : "Guest Sandbox"}
                </span>
                {!isAuthenticated ? (
                  <span className="text-[9px] font-black text-[#117644] hover:underline uppercase tracking-wider block">Click to Access</span>
                ) : (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
                      setIsAuthenticated(false);
                      setUser(null);
                      setProfile(null);
                      setScheduledSlots([]);
                      setDraftPool([]);
                      setCurrentWorkspace("My Workspace");
                      confetti({ particleCount: 15 });
                    }}
                    className="text-[9px] text-red-600 hover:underline text-left font-black uppercase tracking-wider block mt-0.5"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            {/* Primary Command Post trigger button */}
            <button
              onClick={() => setActiveTab("publish")}
              className="bg-[#042F1A] text-white hover:bg-[#117644] px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> <span>New Post</span>
            </button>
          </div>
        </header>

        {/* 3. SCROLLABLE SCREEN CONTAINER CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl w-full mx-auto space-y-8 pb-16">
          
          <AnimatePresence mode="wait">
            
            {/* =============== TAB: DASHBOARD HOME =============== */}
            {(activeTab === "home" || activeTab === "dashboard") && (
              <motion.div
                key="dashboard-home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                
                {/* SECTION 1 — Welcome header row */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-card p-6 rounded-3xl shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-serif text-2xl font-bold text-[#042F1A] tracking-tight">
                        Good morning, {dashboardUserName} 👋
                      </h1>
                      
                      {/* Interactive Onboarding State Switch Pill */}
                      <div className="inline-flex rounded-full bg-[#FAF5EB] p-0.5 border border-[#eae3d2] select-none text-[9px] font-mono tracking-wider font-bold uppercase">
                        <button
                          onClick={() => setIsOnboardingSimulator(false)}
                          className={`px-3 py-1 rounded-full transition-all ${
                            !isOnboardingSimulator 
                              ? "bg-white text-[#117644] shadow-xs font-bold border border-[#eae3d2]/60" 
                              : "text-neutral-500 hover:text-[#042F1A]"
                          }`}
                        >
                          Standard View
                        </button>
                        <button
                          onClick={() => setIsOnboardingSimulator(true)}
                          className={`px-3 py-1 rounded-full transition-all ${
                            isOnboardingSimulator 
                              ? "bg-white text-rose-600 shadow-xs font-bold border border-red-200" 
                              : "text-neutral-500 hover:text-black"
                          }`}
                        >
                          Onboarding Simulator (Empty)
                        </button>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("postrick_onboarding_completed");
                              localStorage.removeItem("postrick_onboarding_wizard_step");
                            }
                            setShowOnboarding(true);
                          }}
                          className="px-3 py-1 rounded-full transition-all text-neutral-500 hover:text-[#042F1A] flex items-center gap-1 font-extrabold"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#117644]" /> Replay Onboarding
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#042F1A]/70 font-medium">
                      Here is what is happening across your customized multi-posting social loop today: <span className="font-mono text-xs font-semibold ml-1">June 21, 2026</span>
                    </p>
                  </div>

                  {/* 2-button Group cluster (primary + outline) */}
                  <div className="inline-flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-full border border-[#eae3d2] max-w-fit flex-wrap">
                    <button
                      onClick={() => handleQuickAction("publish")}
                      className="px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-[#042F1A] hover:bg-[#117644] transition-colors"
                    >
                      New Post
                    </button>
                    <button
                      onClick={() => handleQuickAction("analytics")}
                      className="px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-[#042F1A] border border-transparent hover:border-[#eae3d2] hover:bg-white transition-all flex items-center gap-1"
                    >
                      <BarChart3 className="w-3 h-3 text-[#117644]" /> View Analytics
                    </button>
                  </div>
                </motion.div>

                {/* SECTION 2 — Stat cards row (4 cards with sparklines & Count-ups) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { 
                      title: "Scheduled This Week", 
                      val: scheduledSlots.filter(s => s.status === "scheduled").length, 
                      suffix: "", 
                      trend: scheduledSlots.filter(s => s.status === "scheduled").length > 0 ? "Active schedule nodes" : "No scheduled posts", 
                      positive: true, 
                      spark: scheduledSlots.filter(s => s.status === "scheduled").length > 0 ? sparkWeek : [], 
                      color: "#117644" 
                    },
                    { 
                      title: "Published This Month", 
                      val: scheduledSlots.filter(s => s.status === "published").length, 
                      suffix: " posts", 
                      trend: scheduledSlots.filter(s => s.status === "published").length > 0 ? "Actively publishing" : "No published posts yet", 
                      positive: true, 
                      spark: scheduledSlots.filter(s => s.status === "published").length > 0 ? sparkMonth : [], 
                      color: "#3b82f6" 
                    },
                    { 
                      title: "Avg. Engagement Rate", 
                      val: Object.values(connectedChannels).some(Boolean) ? 5.8 : 0, 
                      suffix: "%", 
                      trend: Object.values(connectedChannels).some(Boolean) ? "↑ 0.4% from average" : "Binds required to track", 
                      positive: true, 
                      spark: Object.values(connectedChannels).some(Boolean) ? sparkEngage : [], 
                      color: "#a855f7" 
                    },
                    { 
                      title: "Connected Accounts", 
                      val: Object.values(connectedChannels).filter(Boolean).length, 
                      suffix: " / 6", 
                      trend: `${Object.values(connectedChannels).filter(Boolean).length} active binds`, 
                      positive: true, 
                      spark: Object.values(connectedChannels).filter(Boolean).length > 0 ? sparkAccounts : [], 
                      color: "#10b981" 
                    }
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9.5px] uppercase font-bold tracking-[0.12em] text-[#042F1A]/60">
                            {stat.title}
                          </span>
                          <span className="p-1 rounded-full bg-neutral-50/80 border border-neutral-100">
                            {idx === 0 && <Calendar className="w-3.5 h-3.5 text-[#117644]" />}
                            {idx === 1 && <Send className="w-3.5 h-3.5 text-blue-500" />}
                            {idx === 2 && <Target className="w-3.5 h-3.5 text-purple-500" />}
                            {idx === 3 && <Users className="w-3.5 h-3.5 text-emerald-500" />}
                          </span>
                        </div>
                        
                        <div id={`stat-val-wrapper-${idx}`} className="flex items-baseline gap-1">
                          <span className="font-serif text-2.5xl font-extrabold tracking-tight text-[#042F1A]">
                            <CountUp value={stat.val} suffix={stat.suffix} />
                          </span>
                        </div>
                      </div>

                      {/* Sparkline & trend wrapper */}
                      <div className="mt-4 pt-3 border-t border-dashed border-[#FAF6EE] flex items-end justify-between gap-4">
                        <span className="text-[10px] font-mono font-semibold text-[#117644]/90">
                          {stat.trend}
                        </span>

                        {/* Sparkline mini render in Recharts */}
                        <div className="h-6 w-16 opacity-75 flex items-center justify-end">
                          {stat.spark && stat.spark.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stat.spark}>
                                <Area 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke={stat.color} 
                                  fill={stat.color} 
                                  fillOpacity={0.15} 
                                  strokeWidth={1.5} 
                                  dot={false} 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <span className="text-[10px] font-mono text-neutral-300">--</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* VIEW DETERMINATOR (Standard Split vs Empty Onboarding Simulator) */}
                {!isOnboardingSimulator ? (
                  <>
                    {/* SECTION 3 — Two-column split: Upcoming Posts + Performance Snapshot */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      
                      {/* LEFT (Wider ~60%) Upcoming Posts List */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 glass-card p-6 rounded-3xl flex flex-col justify-between shadow-2xs"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-[#FAF6EE] pb-3">
                            <div>
                              <h3 className="font-serif text-base font-bold text-[#042F1A] flex items-center gap-2 tracking-tight">
                                <Clock className="w-4.5 h-4.5 text-[#117644]" /> Upcoming Posts Queue
                              </h3>
                              <p className="text-[11px] text-[#042F1A]/65 font-normal">High-probability dispatch queues registered this week</p>
                            </div>
                            <span className="text-[9px] font-mono tracking-[0.1em] uppercase font-bold px-2.5 py-1 bg-emerald-50 border border-emerald-150 text-[#117644] rounded-full">
                              {scheduledSlots.length} Queued Slots
                            </span>
                          </div>

                          {/* Dynamic staggered rows list */}
                          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                            {scheduledSlots.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-[#eae3d2] rounded-2xl bg-neutral-50/50">
                                <Clock className="w-8 h-8 text-stone-300 mb-2.5 animate-pulse" />
                                <h4 className="text-xs font-black text-[#042F1A] uppercase tracking-wider">Your queue is empty</h4>
                                <p className="text-[10px] text-stone-500 max-w-[260px] mt-1 leading-relaxed">
                                  Draft campaigns or lock in schedule times in the <strong>Publish</strong> or <strong>Calendar</strong> tabs to active launch loops.
                                </p>
                                <button 
                                  onClick={() => setActiveTab("publish")}
                                  className="mt-4 px-3 py-1.5 bg-[#042F1A] hover:bg-[#117644] text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                  Schedule First Post
                                </button>
                              </div>
                            ) : (
                              scheduledSlots.slice(0, 5).map((post, idx) => {
                                const title = post.title || post.text || "Untitled Post";
                                const textSnippet = post.text ? (post.text.length > 60 ? post.text.substring(0, 60) + "..." : post.text) : "No description text provided.";
                                const platformsList = post.platforms || [post.platform || "instagram"];
                                const statusLabel = post.status.charAt(0).toUpperCase() + post.status.slice(1);
                                const timeLabel = `${post.day || "Mon"} - ${post.hour || "12:00"}`;
                                const imgUrl = post.mediaUrl || "https://picsum.photos/seed/queue/150/100";
                                return (
                                  <motion.div
                                    key={post.id || idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group p-3 rounded-xl border border-transparent hover:border-[#eae3d2] hover:bg-[#FAF6EE]/40 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img 
                                        src={imgUrl} 
                                        alt="Thumbnail preview" 
                                        className="w-12 h-10 object-cover rounded-lg flex-shrink-0 bg-neutral-100 border border-neutral-100"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="min-w-0">
                                        <h4 className="text-xs font-bold truncate text-[#042F1A]">{title}</h4>
                                        <p className="text-[10px] text-neutral-400 truncate leading-relaxed">{textSnippet}</p>
                                        
                                        {/* Platform Badges */}
                                        <div className="flex items-center gap-1.5 mt-1">
                                          {platformsList.map(p => (
                                            <span key={p} className="p-0.5 rounded bg-neutral-50 inline-block">
                                              {p === "instagram" && <Instagram className="w-2.5 h-2.5 text-pink-500" />}
                                              {p === "linkedin" && <Linkedin className="w-2.5 h-2.5 text-blue-500" />}
                                              {p === "youtube" && <Youtube className="w-2.5 h-2.5 text-red-500" />}
                                              {p === "facebook" && <Facebook className="w-2.5 h-2.5 text-blue-700" />}
                                              {p === "tiktok" && <TikTokIcon className="w-2.5 h-2.5 text-indigo-400" />}
                                              {p === "pinterest" && <PinterestIcon className="w-2.5 h-2.5 text-red-650" />}
                                            </span>
                                          ))}
                                          <span className="text-[9px] font-mono text-neutral-400 ml-1">{timeLabel}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto pl-15 sm:pl-0">
                                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-mono uppercase tracking-wider font-extrabold ${
                                        post.status === "scheduled" ? "bg-emerald-50 text-[#117644]" :
                                        post.status === "published" ? "bg-blue-50 text-blue-600" :
                                        "bg-neutral-50 text-neutral-500"
                                      }`}>
                                        {statusLabel}
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        <div className="border-t border-[#FAF6EE] pt-4.5 mt-6 flex justify-end">
                          <button
                            onClick={() => setActiveTab("calendar")}
                            className="text-xs font-black text-[#117644] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            View full calendar schedule →
                          </button>
                        </div>
                      </motion.div>

                      {/* RIGHT (Compact ~40%) Performance Snapshot Combo Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="lg:col-span-5 glass-card p-6 rounded-3xl flex flex-col justify-between shadow-2xs"
                      >
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="font-serif text-base font-black text-[#042F1A] flex items-center gap-2">
                              <LineChart className="w-4.5 h-4.5 text-[#117644]" /> Performance Snapshot
                            </h3>
                            <p className="text-[10.5px] opacity-60">Engagement ratio across the last 7 days</p>
                          </div>

                          {/* Multi-select filter chips styled with brand colors when active */}
                          <div className="flex flex-wrap gap-1 md:gap-1.5 pb-2">
                            {[
                              { key: "Instagram", color: "#ec4899" },
                              { key: "TikTok", color: "#6366f1" },
                              { key: "LinkedIn", color: "#3b82f6" },
                              { key: "YouTube", color: "#ef4444" },
                              { key: "Facebook", color: "#1d4ed8" }
                            ].map(filter => {
                              const active = snapshotFilters[filter.key as keyof typeof snapshotFilters];
                              return (
                                <button
                                  key={filter.key}
                                  onClick={() => toggleSnapshotFilter(filter.key as keyof typeof snapshotFilters)}
                                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider font-extrabold border transition-all cursor-pointer ${
                                    active 
                                      ? "bg-white shadow-3xs" 
                                      : "bg-neutral-50 border-transparent text-neutral-400"
                                  }`}
                                  style={{ borderColor: active ? filter.color : "transparent", color: active ? filter.color : undefined }}
                                >
                                  ● {filter.key}
                                </button>
                              );
                            })}
                          </div>

                           {/* Recharts Combo Chart (Bar + line overlay) */}
                           <div className="h-56 relative overflow-hidden rounded-2xl">
                             {!Object.values(connectedChannels).some(Boolean) && (
                               <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 text-center">
                                 <Target className="w-7 h-7 text-stone-400 mb-1.5 animate-bounce" />
                                 <h4 className="text-xs font-black text-[#042F1A] uppercase tracking-wider">No active channel data</h4>
                                 <p className="text-[10px] text-stone-500 max-w-[220px] mt-0.5 leading-relaxed">
                                   Link your accounts in the <strong>Accounts</strong> tab to stream and visualize historical metrics.
                                 </p>
                                 <button 
                                   onClick={() => setActiveTab("accounts")}
                                   className="mt-3 px-3 py-1.5 bg-[#042F1A] hover:bg-[#117644] text-white rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                                 >
                                   Bind Social Accounts
                                 </button>
                               </div>
                             )}

                             <ResponsiveContainer width="100%" height="100%">
                               <ComposedChart data={Object.values(connectedChannels).some(Boolean) ? performanceSnapshotData : []}>
                                 <CartesianGrid stroke="#FAF6EE" strokeDasharray="3 3" />
                                 <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: "bold" }} />
                                 <YAxis tick={{ fontSize: 9, fontWeight: "bold" }} />
                                 <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, backgroundColor: "#fff", border: "1px solid #eae3d2" }} />
                                 
                                 {/* Base overall engagement metric bars */}
                                 <Bar dataKey="bar" fill="#FAF5EB" radius={[4, 4, 0, 0]} name="Total reach" />
                                 
                                 {/* Overlay active lines */}
                                 {snapshotFilters.Instagram && <Line type="monotone" dataKey="Instagram" stroke="#ec4899" strokeWidth={2} dot={{ r: 2 }} name="Instagram" />}
                                 {snapshotFilters.TikTok && <Line type="monotone" dataKey="TikTok" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} name="TikTok" />}
                                 {snapshotFilters.LinkedIn && <Line type="monotone" dataKey="LinkedIn" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} name="LinkedIn" />}
                                 {snapshotFilters.YouTube && <Line type="monotone" dataKey="YouTube" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 1 }} name="YouTube" />}
                                 {snapshotFilters.Facebook && <Line type="monotone" dataKey="Facebook" stroke="#1d4ed8" strokeWidth={1.5} dot={{ r: 1 }} name="Facebook" />}
                               </ComposedChart>
                             </ResponsiveContainer>
                           </div>
                        </div>

                        <div className="p-3 bg-[#FAF6EE]/50 rounded-xl border border-[#eae3d2]/60 mt-4">
                          <p className="text-[10px] text-[#042F1A]/80 leading-relaxed font-semibold flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#117644]" /> Peak weekend engagement spikes are driven organically through synchronized reels formats.
                          </p>
                        </div>
                      </motion.div>

                    </div>

                    {/* SECTION 4 — Platform health row */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-black text-[#042F1A] uppercase tracking-wider opacity-85">
                          Multi-Platform Node Integration Health
                        </h4>
                        <button onClick={() => setActiveTab("accounts")} className="text-[10px] font-mono uppercase tracking-widest text-[#117644] font-black hover:underline">
                          Configure bindings →
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[
                          { id: "instagram", name: "Instagram", icon: <Instagram className="w-4 h-4 text-pink-500" /> },
                          { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-4 h-4 text-blue-500" /> },
                          { id: "facebook", name: "Meta Grid", icon: <Facebook className="w-4 h-4 text-blue-700" /> },
                          { id: "youtube", name: "YouTube", icon: <Youtube className="w-4 h-4 text-red-500" /> },
                          { id: "tiktok", name: "TikTok Node", icon: <TikTokIcon className="w-4 h-4 text-indigo-400" /> },
                          { id: "pinterest", name: "Pinterest Board", icon: <PinterestIcon className="w-4 h-4 text-red-650" /> }
                        ].map((plat) => {
                          const isConnected = !!connectedChannels[plat.id];
                          return (
                            <motion.div 
                              key={plat.id}
                              initial={{ opacity: 0, scale: 0.93 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ duration: 0.4 }}
                              className="p-4 glass-card glass-card-hover rounded-2xl flex flex-col justify-between items-center text-center relative"
                            >
                              <span className="p-1.5 bg-neutral-50 rounded-full inline-block mb-2">{plat.icon}</span>
                              <div>
                                <h5 className="text-[10.5px] font-black text-[#042F1A]">{plat.name}</h5>
                                <p className="text-[9px] text-[#042F1A]/50 font-mono tracking-tighter">
                                  {isConnected ? "Active Bind" : "Not Connected"}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center justify-center gap-1.5 select-none text-[8.5px] font-mono uppercase tracking-wider font-extrabold">
                                <div className="relative flex h-2 w-2">
                                  {!isConnected && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                  )}
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
                                </div>
                                <span className={isConnected ? "text-emerald-700" : "text-amber-600"}>
                                  {isConnected ? "Connected" : "Unbound"}
                                </span>
                              </div>

                              <button 
                                onClick={() => setActiveTab(isConnected ? "analytics" : "accounts")} 
                                className="mt-2 text-[8px] text-[#117644] font-black opacity-80 hover:underline hover:opacity-100"
                              >
                                {isConnected ? "View Insights" : "Bind Now"}
                              </button>
                            </motion.div>
                          );
                        })}

                        {/* Dashed capsule add account card */}
                        <motion.button
                          onClick={() => setActiveTab("accounts")}
                          initial={{ opacity: 0, scale: 0.93 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="p-4 border border-dashed border-[#eae3d2] bg-neutral-50/40 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-[#117644]/50 hover:bg-white transition-all cursor-pointer min-h-[120px]"
                        >
                          <Plus className="w-5 h-5 text-[#042F1A]/40 group-hover:text-[#117644] mb-1" />
                          <span className="text-[9.5px] font-mono uppercase tracking-wider font-extrabold text-[#042F1A]/50 group-hover:text-[#042F1A]">
                            + Connect
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* SECTION 4.5 — Recent Performance & Best Time to Post (DASHBOARD HIGHLIGHTS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                      
                      {/* RECENT PERFORMANCE WIDGET */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="glass-card p-6 rounded-3xl flex flex-col justify-between shadow-2xs text-left"
                      >
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FAF6EE] pb-3 gap-2">
                            <div>
                              <h3 className="font-serif text-base font-black text-[#042F1A] flex items-center gap-2">
                                <BarChart3 className="w-4.5 h-4.5 text-[#117644]" /> Recent Performance
                              </h3>
                              <p className="text-[10.5px] opacity-60">Interactive platform analytics drill-down</p>
                            </div>
                            
                            {/* Metric Selector Tabs */}
                            <div className="flex gap-1 bg-[#FAF6EE] p-0.5 rounded-lg border border-[#eae3d2]">
                              {[
                                { id: "engagement", label: "Engage" },
                                { id: "reach", label: "Reach" },
                                { id: "clicks", label: "Clicks" }
                              ].map((m) => (
                                <button
                                  key={m.id}
                                  onClick={() => setSelectedPerformanceMetric(m.id as "engagement" | "reach" | "clicks")}
                                  className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider font-extrabold transition-all cursor-pointer border-none ${
                                    selectedPerformanceMetric === m.id
                                      ? "bg-[#117644] text-white shadow-3xs"
                                      : "text-neutral-500 hover:text-black"
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Platform filters for Performance */}
                          <div className="flex flex-wrap gap-1.5 pb-1">
                            {[
                              { id: "all", label: "✨ All Nodes" },
                              { id: "instagram", label: "Instagram" },
                              { id: "linkedin", label: "LinkedIn" },
                              { id: "youtube", label: "YouTube" },
                              { id: "tiktok", label: "TikTok" }
                            ].map((plat) => {
                              const isActive = selectedPerformancePlatform === plat.id;
                              return (
                                <button
                                  key={plat.id}
                                  onClick={() => {
                                    setSelectedPerformancePlatform(plat.id);
                                    confetti({ particleCount: 12, spread: 20 });
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-[#FAF5EB] border-[#117644] text-[#117644] shadow-3xs scale-102"
                                      : "bg-white border-[#eae3d2] text-neutral-400 hover:text-[#042F1A] hover:border-[#042F1A]"
                                  }`}
                                >
                                  {plat.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Metric KPI Banner & Micro Chart */}
                          {(() => {
                            const dataSet = recentPerformanceData[selectedPerformancePlatform]?.[selectedPerformanceMetric] || recentPerformanceData.all.engagement;
                            return (
                              <div className="space-y-4">
                                <div className="p-4 bg-[#FAF6EE]/50 rounded-2xl border border-[#eae3d2]/50 flex items-center justify-between">
                                  <div>
                                    <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-extrabold mb-0.5">
                                      Avg {selectedPerformanceMetric} Metric
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-serif font-black text-[#042F1A]">
                                        {selectedPerformanceMetric === "reach" ? `${dataSet.value}K` : 
                                         selectedPerformanceMetric === "clicks" ? dataSet.value.toLocaleString() : 
                                         `${dataSet.value}%`}
                                      </span>
                                      <span className={`text-[10px] font-mono font-black ${dataSet.positive ? "text-emerald-600" : "text-rose-500"}`}>
                                        {dataSet.change}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`p-2.5 rounded-xl ${dataSet.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                                    <Flame className="w-5 h-5 animate-pulse" />
                                  </div>
                                </div>

                                {/* Recharts Area Chart */}
                                <div className="h-32 bg-white rounded-xl border border-[#eae3d2]/40 p-2">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataSet.chart}>
                                      <defs>
                                        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#117644" stopOpacity={0.2} />
                                          <stop offset="95%" stopColor="#117644" stopOpacity={0} />
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid stroke="#FAF6EE" strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="day" tick={{ fontSize: 9, fontWeight: "bold", fill: "#888" }} />
                                      <YAxis hide />
                                      <Tooltip contentStyle={{ fontSize: 9, borderRadius: 8, backgroundColor: "#fff", border: "1px solid #eae3d2" }} />
                                      <Area
                                        type="monotone"
                                        dataKey="val"
                                        stroke="#117644"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#perfGrad)"
                                        dot={{ r: 3, fill: "#117644", strokeWidth: 1 }}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Recent Posted Reels & Posts List with thumbnails & views */}
                                <div className="pt-3.5 border-t border-dashed border-[#eae3d2]/60 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#042F1A]">
                                      Recent Posted Reels &amp; Posts
                                    </h4>
                                    <span className="text-[9px] font-mono text-neutral-400">
                                      {selectedPerformancePlatform === "all" ? "All Channels" : `Filtered: ${selectedPerformancePlatform}`}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2">
                                    {(recentPostsData[selectedPerformancePlatform] || recentPostsData.all).slice(0, 3).map((post) => (
                                      <div 
                                        key={post.id}
                                        className="flex items-center gap-2.5 p-2 bg-[#FAF6EE]/30 hover:bg-[#FAF6EE]/70 rounded-xl border border-[#eae3d2]/40 transition-all group cursor-pointer"
                                        onClick={() => {
                                          confetti({ particleCount: 20, spread: 30 });
                                        }}
                                      >
                                        {/* Post Thumbnail */}
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#eae3d2]/60 shrink-0 bg-neutral-100">
                                          <img 
                                            src={post.thumbnail} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            referrerPolicy="no-referrer"
                                          />
                                          {/* Mini Platform Overlay */}
                                          <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-tl-md border-t border-l border-[#eae3d2]/50 shadow-3xs flex items-center justify-center">
                                            <RenderPlatformIcon platform={post.platform} className="w-2.5 h-2.5 text-[#042F1A]" />
                                          </div>
                                        </div>

                                        {/* Post Text & Stats */}
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className={`text-[8px] font-mono uppercase px-1 rounded font-bold ${
                                              post.type === "reel" 
                                                ? "bg-purple-100/60 text-purple-700 border border-purple-200/50" 
                                                : "bg-blue-100/60 text-blue-700 border border-blue-200/50"
                                            }`}>
                                              {post.type}
                                            </span>
                                            <span className="text-[9px] text-neutral-400 font-mono">{post.date}</span>
                                          </div>
                                          
                                          <p className="text-[11px] font-semibold text-[#042F1A] leading-snug truncate" title={post.title}>
                                            {post.title}
                                          </p>

                                          <div className="flex items-center gap-2 text-[9.5px] text-neutral-500 font-mono">
                                            <span className="flex items-center gap-0.5">
                                              <Eye className="w-3 h-3 text-[#117644]" />
                                              <strong className="text-[#117644] font-bold">{post.views}</strong> views
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                              <Heart className="w-2.5 h-2.5 text-rose-500" />
                                              {post.likes} likes
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        <div className="mt-3.5 pt-3 border-t border-dashed border-[#FAF6EE] text-[9.5px] font-mono text-neutral-400 flex items-center justify-between">
                          <span>Data updated 15m ago</span>
                          <span className="text-[#117644] font-black cursor-pointer hover:underline" onClick={() => setActiveTab("analytics")}>
                            Full Analytics Suite →
                          </span>
                        </div>
                      </motion.div>

                      {/* BEST TIME TO POST WIDGET */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="glass-card p-6 rounded-3xl flex flex-col justify-between shadow-2xs text-left"
                      >
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FAF6EE] pb-3 gap-2">
                            <div>
                              <h3 className="font-serif text-base font-black text-[#042F1A] flex items-center gap-2">
                                <Clock className="w-4.5 h-4.5 text-[#117644]" /> Best Time to Post
                              </h3>
                              <p className="text-[10.5px] opacity-60">AI-predicted high-engagement publishing hours</p>
                            </div>
                            
                            {/* Platform Quick Selector */}
                            <div className="flex gap-1 p-0.5 bg-[#FAF6EE] rounded-lg border border-[#eae3d2]">
                              {["instagram", "linkedin", "youtube", "tiktok", "facebook"].map((p) => {
                                const isActive = bestTimeActivePlatform === p;
                                return (
                                  <button
                                    key={p}
                                    onClick={() => {
                                      setBestTimeActivePlatform(p);
                                      confetti({ particleCount: 15, spread: 25 });
                                    }}
                                    className={`px-1.5 py-1 rounded-md transition-all cursor-pointer border-none ${
                                      isActive ? "bg-white shadow-3xs text-[#117644]" : "text-neutral-400 hover:text-black"
                                    }`}
                                  >
                                    <RenderPlatformIcon platform={p} className="w-3.5 h-3.5" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Optimal Schedule & Slots Display */}
                          {(() => {
                            const bestTimeSet = bestTimesToPost[bestTimeActivePlatform as keyof typeof bestTimesToPost] || bestTimesToPost.instagram;
                            return (
                              <div className="space-y-3.5">
                                <div className="p-3.5 bg-neutral-50/50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                  <div>
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-extrabold block mb-0.5">Recommended Days</span>
                                    <div className="flex gap-1.5 mt-1">
                                      {bestTimeSet.days.map((day) => (
                                        <span key={day} className="px-2 py-0.5 bg-[#117644]/10 text-[#117644] text-[9px] font-mono font-black uppercase tracking-wider rounded-md">
                                          {day}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-left sm:text-right">
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-extrabold block mb-1">Weekly Cadence</span>
                                    <span className="text-[10.5px] text-[#042F1A] font-semibold">2 posts / week optimal</span>
                                  </div>
                                </div>

                                {/* Interactive Time Slots List */}
                                <div className="space-y-2">
                                  <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-extrabold">Optimal Daily Hours (EST)</span>
                                  <div className="grid grid-cols-1 gap-2">
                                    {bestTimeSet.slots.map((slot) => {
                                      const isHovered = hoveredBestTimeSlot === slot.time;
                                      return (
                                        <div
                                          key={slot.time}
                                          onMouseEnter={() => setHoveredBestTimeSlot(slot.time)}
                                          onMouseLeave={() => setHoveredBestTimeSlot(null)}
                                          onClick={() => {
                                            confetti({ particleCount: 40, spread: 30 });
                                          }}
                                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                            isHovered 
                                              ? "border-[#117644] bg-[#FAF5EB]/50 translate-x-1" 
                                              : "border-[#eae3d2]/60 bg-white hover:border-[#117644]/60"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="p-1.5 bg-neutral-50 rounded-lg text-stone-600">
                                              <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                              <span className="block text-xs font-bold text-[#042F1A]">{slot.time}</span>
                                              <span className="block text-[9.5px] text-neutral-400 truncate max-w-[200px]">{slot.note}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 shrink-0">
                                            {/* Score Ring / Badge */}
                                            <div className="text-right">
                                              <span className="block text-[8px] font-mono uppercase tracking-widest text-neutral-400">Match score</span>
                                              <span className="block text-[11px] font-mono font-black text-[#117644]">{slot.score}%</span>
                                            </div>

                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveTab("composer");
                                                setPlatformCaption(prev => `[Scheduled for ${slot.time} optimal slot]\n\n` + prev);
                                                confetti({ particleCount: 60, spread: 45 });
                                              }}
                                              className="p-1.5 bg-[#FAF6EE] hover:bg-[#117644] text-[#117644] hover:text-white rounded-lg transition-all border-none"
                                              title="Draft Post for this Slot"
                                            >
                                              <Plus className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="p-3.5 bg-[#FAF6EE]/50 border border-[#eae3d2]/40 rounded-2xl text-[10px] text-[#042F1A]/80 leading-relaxed font-semibold">
                          {bestTimesToPost[bestTimeActivePlatform as keyof typeof bestTimesToPost]?.desc || bestTimesToPost.instagram.desc}
                        </div>
                      </motion.div>

                    </div>

                    {/* SECTION 5 — Recent Activity feed */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className="bg-white border border-[#eae3d2] p-5 rounded-3xl shadow-2xs"
                    >
                      <div className="border-b pb-3 border-[#FAF6EE] mb-4">
                        <h4 className="font-serif text-sm font-black text-[#042F1A] flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-[#117644]" /> Recent Workspace Activity
                        </h4>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">A clear breakdown of your latest social media updates and draft history</p>
                      </div>

                      <div className="relative pl-6 space-y-4 pt-1 border-l border-[#FAF6EE]">
                        {[
                          { text: "Dynamic post published to Instagram, LinkedIn channels", t: "2 hours ago", icon: <Check className="w-3.5 h-3.5 text-emerald-500" /> },
                          { text: "Smart Copywriter Copilot drafted 3 caption alternatives", t: "5 hours ago", icon: <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> },
                          { text: "Creative template generated: Summer Sale banner assets", t: "1 day ago", icon: <ImageIcon className="w-3.5 h-3.5 text-purple-500" /> },
                          { text: "Registered optimal planning slot dispatch queues", t: "2 days ago", icon: <Calendar className="w-3.5 h-3.5 text-blue-500" /> }
                        ].map((act, i) => (
                          <div key={i} className="relative flex items-center justify-between gap-4 text-xs pr-2">
                            {/* Connector bullet on timeline */}
                            <span className="absolute -left-9 w-6 h-6 rounded-full border border-[#eae3d2] bg-white flex items-center justify-center p-0.5 shadow-3xs">
                              {act.icon}
                            </span>
                            <span className="font-medium text-[#042F1A]/90">{act.text}</span>
                            <span className="text-[9px] font-mono text-neutral-400 flex-shrink-0">{act.t}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  /* SECTION 6 — Empty Onboarding State Variant */
                  <motion.div
                    key="onboarding-empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-red-100 max-w-2xl mx-auto rounded-3xl p-8 text-center space-y-6 shadow-sm"
                  >
                    {/* Instant Sync Styled Vector Illustration Asset */}
                    <div className="flex justify-center py-4">
                      <div className="relative w-44 h-28 bg-[#FAF6EE] rounded-2xl flex items-center justify-center border border-[#eae3d2]/80 shadow-inner overflow-hidden">
                        <div className="absolute top-2 left-2 flex gap-1 select-none">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 animate-pulse text-[8px] font-mono text-[#117644] font-black">
                          <Activity className="w-3 h-3 text-[#117644]" /> ISOMORPHIC SYNC
                        </div>
                        
                        {/* Custom SVG Nodes representing account connections */}
                        <div className="flex items-center gap-3 relative z-10">
                          <span className="p-1.5 bg-pink-100 rounded-lg text-pink-600"><Instagram className="w-4 h-4" /></span>
                          <span className="w-10 h-0.5 bg-neutral-200 border-t border-dashed animate-pulse" />
                          <span className="p-1.5 bg-[#042F1A]/10 rounded-lg text-[#042F1A] font-serif font-extrabold text-xs">SG</span>
                          <span className="w-10 h-0.5 bg-neutral-200 border-t border-dashed animate-pulse" />
                          <span className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><Linkedin className="w-4 h-4" /></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-black text-[#042F1A]">
                        Connect your first platform to get started
                      </h3>
                      <p className="text-xs text-[#042F1A]/60 max-w-md mx-auto leading-relaxed">
                        Postrick has detected zero connected social profiles in this brand workspace. Initialize active connections and draft smart visual triggers instantly.
                      </p>
                    </div>

                    {/* Progress Checklist Indicators */}
                    <div className="max-w-md mx-auto bg-[#FAF5EB]/50 border border-[#eae3d2] rounded-2xl p-4 text-left space-y-3 font-mono text-[10.5px]">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 border border-amber-300 text-amber-700 font-extrabold text-[10px]">1</span>
                        <span className="font-bold">Connect workspace channel nodes</span>
                        <span className="ml-auto text-amber-600 font-extrabold animate-pulse">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2.5 opacity-55">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 border text-neutral-400 text-[10px]">2</span>
                        <span className="font-medium">Draft custom graphic caption sets</span>
                        <span className="ml-auto text-neutral-400">Pending</span>
                      </div>
                      <div className="flex items-center gap-2.5 opacity-55">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 border text-neutral-400 text-[10px]">3</span>
                        <span className="font-medium">Schedule dispatch slots onto planner grid</span>
                        <span className="ml-auto text-neutral-400">Pending</span>
                      </div>
                    </div>

                    {/* Onboarding primary CTA triggers tab change */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleQuickAction("accounts")}
                        className="bg-[#042F1A] text-white hover:bg-[#117644] px-6 py-2.8 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" /> Connect Your Account Instantly
                      </button>
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* =============== TAB: COMPOSER / PUBLISH =============== */}
            {(activeTab === "composer" || activeTab === "publish") && (
              <motion.div
                key="composer-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-black text-[#042F1A] tracking-tight">Postrick Composer</h2>
                    <p className="text-xs text-[#042F1A]/60 font-medium">Write your post once and instantly render adapting mockups across all networks before publishing.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] bg-emerald-50 text-[#117644] font-mono font-black px-3.5 py-1.5 rounded-full border border-emerald-100 uppercase select-none tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Cross-Platform Sync: Live
                    </span>
                    {autoSaveStatus && (
                      <span className={`text-[9px] font-mono font-black px-3.5 py-1.5 rounded-full border uppercase select-none tracking-widest flex items-center gap-1.5 transition-all ${
                        autoSaveStatus.startsWith("Saved")
                          ? "bg-emerald-50 text-[#117644] border-emerald-100"
                          : "bg-amber-50 text-[#b45309] border-amber-100 animate-pulse"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${autoSaveStatus.startsWith("Saved") ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {autoSaveStatus}
                      </span>
                    )}
                  </div>
                </div>
                {/* Simplified Single Screen Composer Workspace */}



                {/* Two-Pane Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {false && (
                    <div className="lg:col-span-5 space-y-6 bg-white/45 backdrop-blur-md border border-[#eae3d2]/60 p-6 rounded-3xl shadow-sm text-left">
                      {/* LEFT PANE — Simplified Single Form Composer */}
                    
                    {/* SECTION 1: Social Platform Selection */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                          1. Target Channels
                        </label>
                        <span className="text-[9px] font-mono text-neutral-400">Toggle networks</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
                          { id: "tiktok", label: "TikTok", icon: <TikTokIcon className="w-4 h-4" /> },
                          { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
                          { id: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
                          { id: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
                          { id: "pinterest", label: "Pinterest", icon: <PinterestIcon className="w-4 h-4" /> }
                        ].map(platform => {
                          const isSelected = selectedPlatforms.includes(platform.id);
                          return (
                            <button
                              key={platform.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  if (selectedPlatforms.length > 1) {
                                    const next = selectedPlatforms.filter(p => p !== platform.id);
                                    setSelectedPlatforms(next);
                                    if (activePreviewTab === platform.id) setActivePreviewTab(next[0]);
                                  }
                                } else {
                                  setSelectedPlatforms([...selectedPlatforms, platform.id]);
                                  setActivePreviewTab(platform.id);
                                }
                              }}
                              className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-[#042F1A] text-white border-[#042F1A]" 
                                  : "bg-white/60 hover:bg-neutral-50 text-[#042F1A] border-[#eae3d2]"
                              }`}
                            >
                              {platform.icon}
                              <span>{platform.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 2: Write Caption & AI Assistant */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                          2. Caption Copy
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAiWriter(!showAiWriter)}
                          className="text-[9px] font-mono font-black uppercase text-[#117644] hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-500" /> {showAiWriter ? "Hide AI Writer" : "Write with AI"}
                        </button>
                      </div>

                      {showAiWriter && (
                        <div className="p-4 bg-gradient-to-br from-indigo-50/50 via-white/50 to-emerald-50/30 border border-indigo-100 rounded-2xl space-y-3 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono uppercase font-black text-indigo-700">Topic Brief Detail:</span>
                            <span className="text-[9px] font-mono text-neutral-400">Model: wave-3.5-flash</span>
                          </div>
                          <textarea 
                            value={aiCaptionPrompt}
                            onChange={e => setAiCaptionPrompt(e.target.value)}
                            rows={2}
                            placeholder="Provide a concept brief (e.g. 'Sustainable brand launch. Code: SHIELD10, modern minimal design')"
                            className="w-full p-2.5 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#117644] text-stone-700 leading-relaxed"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <select 
                                value={aiTone}
                                onChange={e => setAiTone(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border bg-white focus:outline-none text-stone-600 font-bold"
                              >
                                <option value="Viral">🔥 Viral Spark</option>
                                <option value="Professional">💼 Corporate / Premium</option>
                                <option value="Witty">💡 Playful & Witty</option>
                                <option value="Bold">⚡ Bold & Punchy</option>
                                <option value="Friendly">🌸 Friendly & Welcoming</option>
                              </select>
                            </div>
                            <button
                              type="button"
                              disabled={isGeneratingCaptionVariants}
                              onClick={async () => {
                                setIsGeneratingCaptionVariants(true);
                                try {
                                  const response = await fetch("/api/gemini/generate-caption-variants", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      prompt: aiCaptionPrompt,
                                      platforms: selectedPlatforms,
                                      tone: aiTone,
                                      audience: aiGuidelines,
                                      hasImage: uploadedMedia.length > 0
                                    })
                                  });
                                  const data = await response.json();
                                  if (data.variants && data.variants.length > 0) {
                                    setCaptionVariants(data.variants);
                                    confetti({ particleCount: 30, spread: 25 });
                                  } else {
                                    alert("Could not process variant copies.");
                                  }
                                } catch (err) {
                                  console.error("AI copy writer failed", err);
                                } finally {
                                  setIsGeneratingCaptionVariants(false);
                                }
                              }}
                              className="py-2 px-3 bg-[#117644] hover:bg-[#042F1A] text-white text-[10px] font-mono font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 border-none"
                            >
                              {isGeneratingCaptionVariants ? "Writing..." : "Generate AI Copy"}
                            </button>
                          </div>

                          {captionVariants.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-indigo-100">
                              <span className="block font-mono text-[8px] uppercase font-bold text-[#117644]">AI Recommendations:</span>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {captionVariants.map((v, i) => (
                                  <div key={i} className="bg-white/80 border p-2 rounded-xl border-[#eae3d2] hover:border-[#117644] transition-all space-y-1">
                                    <p className="text-[10px] leading-relaxed text-slate-800 line-clamp-2">{v.text}</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const fullCaption = `${v.text}\n\n${v.hashtags.map(t => `#${t}`).join(" ")}`;
                                        handleUseCaption(fullCaption);
                                        confetti({ particleCount: 15, spread: 15 });
                                      }}
                                      className="w-full py-1 text-center bg-emerald-50 hover:bg-[#117644] hover:text-white rounded-lg text-[9px] uppercase font-black tracking-widest text-[#117644] transition-colors border-none cursor-pointer"
                                    >
                                      Apply to Active Draft
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border border-[#eae3d2] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#117644]/20 focus-within:border-[#117644] bg-white transition-all">
                        <textarea
                          value={platformCaption}
                          onChange={(e) => setPlatformCaption(e.target.value)}
                          rows={4}
                          className="w-full text-xs p-3 text-[#042F1A] font-sans leading-relaxed focus:outline-none resize-none bg-neutral-50/10"
                          placeholder="Type or apply generated captions here..."
                        />
                      </div>
                    </div>

                    {/* SECTION 3: Attach Media & AI Image generator */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                          3. Media Assets
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAiImageGen(!showAiImageGen)}
                          className="text-[9px] font-mono font-black uppercase text-[#117644] hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" /> {showAiImageGen ? "Hide AI Generator" : "Generate with AI"}
                        </button>
                      </div>

                      {showAiImageGen && (
                        <div className="bg-gradient-to-br from-indigo-50/40 via-white/50 to-emerald-50/20 border border-indigo-100 p-4 rounded-2xl space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-[9px] uppercase tracking-wide text-[#117644] font-mono font-black">AI Image Studio</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("creative-kit");
                                confetti({ particleCount: 30, spread: 45 });
                              }}
                              className="text-[9.5px] font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5 bg-transparent border-none cursor-pointer"
                            >
                              Go to Advanced AI Graphic Studio →
                            </button>
                          </div>
                          <textarea 
                            value={aiImagePrompt}
                            onChange={e => setAiImagePrompt(e.target.value)}
                            rows={1.5}
                            className="w-full text-[11px] p-2 border bg-white rounded-xl focus:outline-none resize-none text-stone-700"
                            placeholder="Describe your design vision, e.g. Minimalist layout..."
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              value={aiImageAspectRatio}
                              onChange={e => setAiImageAspectRatio(e.target.value)}
                              className="text-xs p-2 rounded-lg border bg-white focus:outline-none text-stone-600"
                            >
                              <option value="1:1">Square (1:1)</option>
                              <option value="16:9">Wide (16:9)</option>
                              <option value="9:16">Vertical (9:16)</option>
                            </select>
                            <button
                              type="button"
                              disabled={isGeneratingAiImage}
                              onClick={async () => {
                                if (!aiImagePrompt) {
                                  alert("Please describe your design prompt first!");
                                  return;
                                }
                                setIsGeneratingAiImage(true);
                                try {
                                  const response = await fetch("/api/gemini/generate-image", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ prompt: aiImagePrompt, aspectRatio: aiImageAspectRatio })
                                  });
                                  const data = await response.json();
                                  if (data.success && data.image) {
                                    const newAsset = {
                                      id: `ai-gen-${Date.now()}`,
                                      url: data.image,
                                      type: "image" as const,
                                      name: `AI_Gen_${Math.floor(Math.random() * 1000)}.jpg`,
                                      cropFits: ["instagram", "linkedin", "facebook", "youtube"],
                                    };
                                    setUploadedMedia(prev => [newAsset, ...prev]);
                                    setSelectedMediaId(newAsset.id);
                                    confetti({ particleCount: 50, spread: 30 });
                                  } else {
                                    alert("Image rendering mismatch. Retrying with active backups.");
                                  }
                                } catch (err) {
                                  console.error("AI Image Generation failed:", err);
                                } finally {
                                  setIsGeneratingAiImage(false);
                                }
                              }}
                              className="py-1.5 px-3 hover:bg-[#117644] bg-[#042F1A] text-white text-[10px] font-mono font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                            >
                              {isGeneratingAiImage ? "Rendering..." : "Gen AI Art"}
                            </button>
                          </div>
                        </div>
                      )}

                      <motion.div 
                        onClick={() => document.getElementById("hidden-file-input-composer")?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsComposerDragOver(true);
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsComposerDragOver(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsComposerDragOver(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsComposerDragOver(false);
                          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const filesArr = Array.from(e.dataTransfer.files);
                            const mediaFiles = filesArr.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
                            if (mediaFiles.length > 0) {
                              const formatted = mediaFiles.map((f, i) => ({
                                id: `custom-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                                url: URL.createObjectURL(f),
                                type: f.type.startsWith("video") ? ("video" as const) : ("image" as const),
                                name: f.name,
                                cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
                              }));
                              setUploadedMedia(prev => [...prev, ...formatted]);
                              setSelectedMediaId(formatted[0].id);
                              confetti({ particleCount: 30, spread: 25 });
                            }
                          }
                        }}
                        animate={{
                          scale: isComposerDragOver ? 1.04 : 1.0,
                          borderColor: isComposerDragOver ? "#117644" : "#eae3d2",
                          backgroundColor: isComposerDragOver ? "rgba(17, 118, 68, 0.12)" : "rgba(250, 245, 235, 0.1)",
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="border-2 border-dashed p-4 rounded-2xl text-center cursor-pointer transition-all space-y-1 relative overflow-hidden"
                      >
                        <input 
                          id="hidden-file-input-composer"
                          type="file" 
                          multiple 
                          accept="image/*,video/*"
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const filesArr = Array.from(e.target.files);
                              const formatted = filesArr.map((f, i) => ({
                                id: `custom-${Date.now()}-${i}`,
                                url: URL.createObjectURL(f),
                                type: f.type.startsWith("video") ? ("video" as const) : ("image" as const),
                                name: f.name,
                                cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
                              }));
                              setUploadedMedia(prev => [...prev, ...formatted]);
                              setSelectedMediaId(formatted[0].id);
                              confetti({ particleCount: 15, spread: 15 });
                            }
                          }}
                        />
                        <motion.div 
                          animate={{
                            y: isComposerDragOver ? -4 : 0,
                            scale: isComposerDragOver ? 1.15 : 1.0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="mx-auto w-8 h-8 rounded-full bg-[#117644]/15 text-[#117644] flex items-center justify-center"
                        >
                          <Upload className="w-4 h-4" />
                        </motion.div>
                        <motion.p 
                          animate={{
                            color: isComposerDragOver ? "#117644" : "#042F1A",
                          }}
                          className="text-[11px] font-bold"
                        >
                          {isComposerDragOver ? "Drop files to attach!" : "Drag & drop files here, or click to browse"}
                        </motion.p>
                      </motion.div>

                      {uploadedMedia.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto py-1">
                          {uploadedMedia.map((media, index) => {
                            const isActive = selectedMediaId === media.id;
                            return (
                              <div 
                                key={media.id}
                                className={`relative shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 w-12 h-12 ${
                                  isActive ? "border-[#117644]" : "border-transparent opacity-75 hover:opacity-100"
                                }`}
                                onClick={() => setSelectedMediaId(media.id)}
                              >
                                {media.type === "video" ? (
                                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white relative">
                                    <span className="text-[6px] font-mono absolute bottom-0.5 right-0.5 bg-black/60 px-0.5 rounded">MP4</span>
                                    <Volume2 className="w-3 h-3 opacity-75" />
                                  </div>
                                ) : (
                                  <img src={media.url} alt={media.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                )}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedMedia(prev => prev.filter(item => item.id !== media.id));
                                    if (isActive && uploadedMedia.length > 1) {
                                      setSelectedMediaId(uploadedMedia[Math.max(0, index - 1)].id);
                                    }
                                  }}
                                  className="absolute top-0.5 right-0.5 p-0.5 bg-rose-600 rounded-full text-white hover:bg-rose-700 border-none cursor-pointer"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* SECTION 4: Schedule Settings */}
                    <div className="space-y-3 pt-2 border-t border-dashed border-[#eae3d2]/60">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                          4. Post Scheduling
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-mono font-bold text-neutral-400 block mb-1">DATE:</label>
                          <input 
                            type="date"
                            value={composerScheduleDate}
                            onChange={e => setComposerScheduleDate(e.target.value)}
                            className="w-full text-xs p-2 rounded-xl border bg-neutral-50/50 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-mono font-bold text-neutral-400 block mb-1">HOUR TIME:</label>
                          <select 
                            value={composerScheduleTime}
                            onChange={e => setComposerScheduleTime(e.target.value)}
                            className="w-full text-xs p-2 rounded-xl border bg-neutral-50/50 focus:outline-none text-stone-600 font-bold"
                          >
                            <option value="09:00">09:00 AM (Peak)</option>
                            <option value="12:00">12:00 PM (Middle)</option>
                            <option value="15:00">03:00 PM (Optimal)</option>
                            <option value="18:00">06:00 PM (High)</option>
                            <option value="21:00">09:00 PM (Chill)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: Form Submissions */}
                    <div className="pt-4 border-t border-[#eae3d2]/60 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const parsedDay = new Date(composerScheduleDate).toLocaleString('en-US', { weekday: 'short' }) || "Mon";
                          const nextSlot = {
                            id: "composer-slot-" + Math.random().toString(),
                            day: parsedDay,
                            hour: composerScheduleTime,
                            platform: selectedPlatforms[0] || "instagram",
                            platforms: selectedPlatforms,
                            text: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                            status: "scheduled" as const,
                            title: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                            startTime: composerScheduleTime,
                            endTime: (() => {
                              const [h, m] = composerScheduleTime.split(":");
                              return `${String(parseInt(h) + 1).padStart(2, "0")}:${m || "00"}`;
                            })(),
                            dayIndex: { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[parsedDay] ?? 0,
                            accentColor: "#117644"
                          };
                          setScheduledSlots(prev => [...prev, nextSlot]);
                          alert("Content scheduled successfully inside the calendar!");
                          confetti({ particleCount: 50, spread: 35 });
                        }}
                        className="flex-1 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-[#117644] hover:bg-emerald-50 rounded-2xl transition-all border border-emerald-100 cursor-pointer bg-white"
                      >
                        ✓ Schedule Post
                      </button>

                      <button
                        type="button"
                        disabled={isPublishingNow}
                        onClick={async () => {
                          setIsPublishingNow(true);
                          await new Promise(r => setTimeout(r, 1200));
                          setIsPublishingNow(false);
                          setShowPublishSuccessModal(true);
                          confetti({ particleCount: 150, spread: 80 });
                        }}
                        className="flex-1 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-[#FAF6EE] bg-[#117644] hover:bg-[#042F1A] rounded-2xl transition-all border border-[#117644] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isPublishingNow ? "Broadcasting..." : "⚡ Publish Now"}
                      </button>
                    </div>

                  </div>
                )}

                {publishMode === "steps" && (
                  <div className="lg:col-span-5 space-y-6 bg-white/45 backdrop-blur-md border border-[#eae3d2]/60 p-6 rounded-3xl shadow-sm text-left animate-fadeIn">
                    {/* Step Indicator Panel */}
                    <div className="space-y-2 border-b pb-4 border-[#eae3d2]/60">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#117644] uppercase tracking-wider">
                        <span>Guided Step Progress</span>
                        <span>Step {publishStep} of 5</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((stepNum) => (
                          <button
                            key={stepNum}
                            type="button"
                            onClick={() => {
                              setPublishStep(stepNum);
                              confetti({ particleCount: 10, spread: 20 });
                            }}
                            className={`h-2 flex-1 rounded-full transition-all cursor-pointer border-none ${
                              stepNum <= publishStep ? "bg-[#117644]" : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] text-[#042F1A]/60 font-mono">
                        <span className={publishStep === 1 ? "font-bold text-[#117644]" : ""}>1. Media</span>
                        <span className={publishStep === 2 ? "font-bold text-[#117644]" : ""}>2. Caption</span>
                        <span className={publishStep === 3 ? "font-bold text-[#117644]" : ""}>3. Channels</span>
                        <span className={publishStep === 4 ? "font-bold text-[#117644]" : ""}>4. Schedule</span>
                        <span className={publishStep === 5 ? "font-bold text-[#117644]" : ""}>5. Review</span>
                      </div>
                    </div>

                    {publishStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 mb-3 gap-2">
                          <h3 className="text-sm font-serif font-black text-[#042F1A] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center font-mono font-black text-xs">1</span>
                            Add Post / Reel or Generate Image via AI
                          </h3>
                          
                          {/* Switcher Button Option */}
                          <div className="flex bg-[#FAF5EB]/80 p-1 rounded-xl border border-[#eae3d2] w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaSource("upload");
                                confetti({ particleCount: 15, spread: 20 });
                              }}
                              className={`py-1 px-3 text-[9px] font-bold font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer border-none ${
                                mediaSource === "upload"
                                  ? "bg-[#042F1A] text-white shadow-xs"
                                  : "text-[#042F1A]/80 hover:text-[#042F1A] hover:bg-[#FAF5EB]/80"
                              }`}
                            >
                              📁 Upload
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMediaSource("ai");
                                confetti({ particleCount: 15, spread: 20 });
                              }}
                              className={`py-1 px-3 text-[9px] font-bold font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer border-none ${
                                mediaSource === "ai"
                                  ? "bg-[#042F1A] text-white shadow-xs"
                                  : "text-[#042F1A]/80 hover:text-[#042F1A] hover:bg-[#FAF5EB]/80"
                              }`}
                            >
                              ✨ AI Image
                            </button>
                          </div>
                        </div>

                        {/* Local image/video uploader OR AI Art Generator OR Custom Post conditional panel */}
                        {mediaSource === "upload" && (
                          <div className="space-y-2 animate-fadeIn">
                            <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                              Attach Media (Local Device)
                            </label>
                            <motion.div 
                              onClick={() => document.getElementById("hidden-file-input-publish")?.click()}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPublisherDragOver(true);
                              }}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPublisherDragOver(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPublisherDragOver(false);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPublisherDragOver(false);
                                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  const filesArr = Array.from(e.dataTransfer.files);
                                  const mediaFiles = filesArr.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
                                  if (mediaFiles.length > 0) {
                                    const formatted = mediaFiles.map((f, i) => ({
                                      id: `custom-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                                      url: URL.createObjectURL(f),
                                      type: f.type.startsWith("video") ? ("video" as const) : ("image" as const),
                                      name: f.name,
                                      cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
                                      cropWarning: f.type.startsWith("video") ? "Pinterest constraints: Videos require vertical 9:16 layout" : undefined
                                    }));
                                    setUploadedMedia(prev => [...prev, ...formatted]);
                                    setSelectedMediaId(formatted[0].id);
                                    confetti({ particleCount: 30, spread: 25 });
                                  }
                                }
                              }}
                              animate={{
                                scale: isPublisherDragOver ? 1.04 : 1.0,
                                borderColor: isPublisherDragOver ? "#117644" : "#eae3d2",
                                backgroundColor: isPublisherDragOver ? "rgba(17, 118, 68, 0.12)" : "rgba(250, 245, 235, 0.1)",
                              }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer transition-all space-y-2 group relative overflow-hidden"
                            >
                              <input 
                                id="hidden-file-input-publish"
                                type="file" 
                                multiple 
                                accept="image/*,video/*"
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const filesArr = Array.from(e.target.files);
                                    const formatted = filesArr.map((f, i) => ({
                                      id: `custom-${Date.now()}-${i}`,
                                      url: URL.createObjectURL(f),
                                      type: f.type.startsWith("video") ? ("video" as const) : ("image" as const),
                                      name: f.name,
                                      cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
                                      cropWarning: f.type.startsWith("video") ? "Pinterest constraints: Videos require vertical 9:16 layout" : undefined
                                    }));
                                    setUploadedMedia(prev => [...prev, ...formatted]);
                                    setSelectedMediaId(formatted[0].id);
                                    confetti({ particleCount: 30, spread: 20 });
                                  }
                                }}
                              />
                              <motion.div 
                                animate={{
                                  y: isPublisherDragOver ? -4 : 0,
                                  scale: isPublisherDragOver ? 1.15 : 1.0,
                                }}
                                transition={{ duration: 0.2 }}
                                className="mx-auto w-10 h-10 rounded-full bg-[#117644]/15 text-[#117644] flex items-center justify-center group-hover:scale-110 transition-transform"
                              >
                                <Upload className="w-5 h-5" />
                              </motion.div>
                              <div>
                                <motion.p 
                                  animate={{
                                    color: isPublisherDragOver ? "#117644" : "#042F1A",
                                  }}
                                  className="text-xs font-bold"
                                >
                                  {isPublisherDragOver ? "Drop files to attach!" : "Drag & drop files here"}
                                </motion.p>
                                <p className="text-[10px] text-neutral-400">or click to browse local devices</p>
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {mediaSource === "ai" && (
                          <div className="bg-gradient-to-br from-indigo-50/40 via-[#FAF6EE]/50 to-emerald-50/20 border border-indigo-100 p-5 rounded-2xl space-y-3 relative overflow-hidden animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] bg-indigo-100 border border-indigo-200 text-[#117644] font-mono font-black px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                Postrick AI Art Generator
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400">Model: postrick-art-v2</span>
                            </div>
                            
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-bold text-[#042F1A] font-serif">Visual Prompt Idea:</label>
                              <textarea 
                                value={aiImagePrompt}
                                onChange={e => setAiImagePrompt(e.target.value)}
                                rows={2.5}
                                className="w-full text-[11px] p-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#117644]/20 resize-none leading-relaxed text-stone-700"
                                placeholder="Describe your creative design vision, e.g. A high-quality minimalist tech workspace with lush green ferns..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[8px] font-mono font-bold text-neutral-400 uppercase">Crop Fit Ratio:</label>
                                <select 
                                  value={aiImageAspectRatio}
                                  onChange={e => setAiImageAspectRatio(e.target.value)}
                                  className="w-full text-xs p-2 rounded-lg border bg-white focus:outline-none text-stone-600"
                                >
                                  <option value="1:1">Square (1:1 - Post)</option>
                                  <option value="16:9">Wide (16:9 - Youtube)</option>
                                  <option value="9:16">Vertical (9:16 - Reel)</option>
                                  <option value="4:3">Photo (4:3)</option>
                                </select>
                              </div>
                              <div className="flex items-end justify-end">
                                <button
                                  type="button"
                                  disabled={isGeneratingAiImage}
                                  onClick={async () => {
                                    if (!aiImagePrompt) {
                                      alert("Please describe your design prompt first!");
                                      return;
                                    }
                                    setIsGeneratingAiImage(true);
                                    try {
                                      const response = await fetch("/api/gemini/generate-image", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ prompt: aiImagePrompt, aspectRatio: aiImageAspectRatio })
                                      });
                                      const data = await response.json();
                                      if (data.success && data.image) {
                                        const newAsset = {
                                          id: `ai-gen-${Date.now()}`,
                                          url: data.image,
                                          type: "image" as const,
                                          name: `AI_Studio_Gen_${Math.floor(Math.random() * 1000)}.jpg`,
                                          cropFits: ["instagram", "linkedin", "facebook", "youtube"],
                                          cropWarning: aiImageAspectRatio === "9:16" ? "Pinterest limits: Videos require 9:16" : undefined
                                        };
                                        setUploadedMedia(prev => [newAsset, ...prev]);
                                        setSelectedMediaId(newAsset.id);
                                        confetti({ particleCount: 150, spread: 85, colors: ["#4f46e5", "#10b981", "#fbbf24"] });
                                      } else {
                                        alert("Image rendering mismatch. Retrying with active backups.");
                                      }
                                    } catch (err) {
                                      console.error("AI Image Generation API request crashed:", err);
                                    } finally {
                                      setIsGeneratingAiImage(false);
                                    }
                                  }}
                                  className="w-full py-2 px-3 hover:bg-[#117644] bg-[#042F1A] text-white text-[10px] font-mono font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  {isGeneratingAiImage ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                                      <span>Rendering...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                                      <span>Gen AI Visual</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {mediaSource === "custom" && (
                          <div className="bg-[#FAF5EB] border border-[#eae3d2] p-5 rounded-2xl space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] bg-[#117644]/10 border border-[#117644]/20 text-[#117644] font-mono font-black px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                                <Plus className="w-3 h-3" />
                                Custom &amp; Presets Creator (Multi-Post)
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400">Add multiple custom posts</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#042F1A]">Post Title / Name</label>
                                <input 
                                  type="text"
                                  value={customPostTitle}
                                  onChange={e => setCustomPostTitle(e.target.value)}
                                  className="w-full text-[11px] p-2.5 border border-[#eae3d2] bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#117644] text-stone-700"
                                  placeholder="e.g. Eco Workspace Showcase"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#042F1A]">Media Type Format</label>
                                <select
                                  value={customPostType}
                                  onChange={e => setCustomPostType(e.target.value as "image" | "video")}
                                  className="w-full text-xs p-2.5 border border-[#eae3d2] bg-white rounded-xl focus:outline-none text-stone-700"
                                >
                                  <option value="image">Image Post</option>
                                  <option value="video">Video Post (Reel / Short)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-bold text-[#042F1A]">Custom Image URL</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text"
                                  value={customPostUrl}
                                  onChange={e => setCustomPostUrl(e.target.value)}
                                  className="flex-1 text-[11px] p-2.5 border border-[#eae3d2] bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#117644] text-stone-700 font-mono"
                                  placeholder="https://example.com/image.jpg (or leave empty for default)"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!customPostTitle) {
                                      alert("Please write a post title/name first!");
                                      return;
                                    }
                                    const finalUrl = customPostUrl.trim() || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&h=400&q=80";
                                    const newAsset = {
                                      id: `custom-add-${Date.now()}`,
                                      url: finalUrl,
                                      type: customPostType,
                                      name: customPostTitle,
                                      cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"],
                                    };
                                    setUploadedMedia(prev => [...prev, newAsset]);
                                    setSelectedMediaId(newAsset.id);
                                    setCustomPostTitle("Custom Campaign Post " + (uploadedMedia.length + 1));
                                    setCustomPostUrl("");
                                    confetti({ particleCount: 50, spread: 35 });
                                  }}
                                  className="py-2.5 px-4 bg-[#117644] hover:bg-[#042F1A] text-white text-[10px] font-mono font-black uppercase rounded-xl transition-all border-none cursor-pointer shrink-0"
                                >
                                  Add to Stack
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 text-left pt-1">
                              <label className="block text-[8px] font-mono font-black uppercase tracking-wider text-neutral-400">
                                Click below to instantly add beautiful preset posts:
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {[
                                  {
                                    name: "🌱 Eco Workspace",
                                    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&h=400&q=80",
                                    type: "image" as const
                                  },
                                  {
                                    name: "⚡ Solar Panel Power",
                                    url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&h=400&q=80",
                                    type: "image" as const
                                  },
                                  {
                                    name: "📦 Organic Pack",
                                    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&h=400&q=80",
                                    type: "image" as const
                                  },
                                  {
                                    name: "☕ Creative Agency",
                                    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&h=400&q=80",
                                    type: "image" as const
                                  },
                                  {
                                    name: "🌋 Nature Adventure",
                                    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=400&q=80",
                                    type: "image" as const
                                  }
                                ].map((preset, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      const newAsset = {
                                        id: `preset-add-${Date.now()}-${idx}`,
                                        url: preset.url,
                                        type: preset.type,
                                        name: preset.name.replace(/[^\w\s-]/g, "").trim() + ".jpg",
                                        cropFits: ["instagram", "linkedin", "facebook", "youtube", "tiktok"]
                                      };
                                      setUploadedMedia(prev => [...prev, newAsset]);
                                      setSelectedMediaId(newAsset.id);
                                      confetti({ particleCount: 30, spread: 25 });
                                    }}
                                    className="p-1 bg-white hover:bg-neutral-50 border border-[#eae3d2] rounded-lg hover:border-[#117644] transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
                                  >
                                    <img src={preset.url} alt={preset.name} className="w-full h-10 object-cover rounded" referrerPolicy="no-referrer" />
                                    <span className="text-[8px] font-bold text-stone-700 truncate w-full">{preset.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Uploaded items lists */}
                        {uploadedMedia.length > 0 && (
                          <div className="space-y-3 pt-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400">
                              <span>Currently Configured Media Stack ({uploadedMedia.length} item{uploadedMedia.length !== 1 && "s"})</span>
                              <span>Select an item to rearrange or delete</span>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                              {uploadedMedia.map((media, index) => {
                                const isActive = selectedMediaId === media.id;
                                return (
                                  <div 
                                    key={media.id}
                                    className={`relative shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all border-2 w-16 h-16 ${
                                      isActive ? "border-[#117644] ring-2 ring-[#117644]/15 scale-105" : "border-neutral-200 opacity-75 hover:opacity-100"
                                    }`}
                                    onClick={() => setSelectedMediaId(media.id)}
                                    title={media.name}
                                  >
                                    {media.type === "video" ? (
                                      <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-white relative">
                                        <span className="text-[7px] font-mono font-bold absolute bottom-0.5 right-0.5 bg-black/60 px-1 rounded">MP4</span>
                                        <Volume2 className="w-4 h-4 opacity-75" />
                                      </div>
                                    ) : (
                                      <img 
                                        src={media.url} 
                                        alt={media.name} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                                      #{index + 1}
                                    </div>
                                    <div className="absolute top-1 right-1 z-10">
                                      {media.id.startsWith("ai-gen") && (
                                        <span className="p-0.5 bg-indigo-600 rounded-full text-white inline-block shadow-sm">
                                          <Sparkles className="w-2.5 h-2.5" />
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Active item arrangement & deletion console */}
                            {(() => {
                              const activeIndex = uploadedMedia.findIndex(m => m.id === selectedMediaId);
                              if (activeIndex === -1) return null;
                              const activeMedia = uploadedMedia[activeIndex];

                              const moveLeft = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                if (activeIndex === 0) return;
                                const nextMedia = [...uploadedMedia];
                                const temp = nextMedia[activeIndex];
                                nextMedia[activeIndex] = nextMedia[activeIndex - 1];
                                nextMedia[activeIndex - 1] = temp;
                                setUploadedMedia(nextMedia);
                                confetti({ particleCount: 10, spread: 15 });
                              };

                              const moveRight = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                if (activeIndex === uploadedMedia.length - 1) return;
                                const nextMedia = [...uploadedMedia];
                                const temp = nextMedia[activeIndex];
                                nextMedia[activeIndex] = nextMedia[activeIndex + 1];
                                nextMedia[activeIndex + 1] = temp;
                                setUploadedMedia(nextMedia);
                                confetti({ particleCount: 10, spread: 15 });
                              };

                              const deleteItem = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                const filtered = uploadedMedia.filter(item => item.id !== activeMedia.id);
                                setUploadedMedia(filtered);
                                if (filtered.length > 0) {
                                  setSelectedMediaId(filtered[Math.max(0, activeIndex - 1)].id);
                                }
                                confetti({ particleCount: 15, spread: 20 });
                              };

                              return (
                                <div className="p-3.5 bg-[#FAF5EB]/90 rounded-2xl border border-[#eae3d2] space-y-3 animate-fadeIn text-left">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eae3d2]/60 pb-2">
                                    <div className="space-y-0.5">
                                      <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-400">Selected Post #{activeIndex + 1}</span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-serif text-xs font-black text-[#042F1A] max-w-[180px] sm:max-w-[280px] truncate">
                                          {activeMedia.name || "Untitled Post Item"}
                                        </span>
                                        <span className="text-[8px] font-mono bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md uppercase">
                                          {activeMedia.type}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Quick Rename Input */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[8px] font-mono text-neutral-400 whitespace-nowrap">Rename:</span>
                                      <input 
                                        type="text"
                                        value={activeMedia.name || ""}
                                        onChange={(e) => {
                                          const next = [...uploadedMedia];
                                          next[activeIndex] = { ...activeMedia, name: e.target.value };
                                          setUploadedMedia(next);
                                        }}
                                        className="text-[10px] px-2 py-1 border border-[#eae3d2] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#117644] max-w-[140px]"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-[9px] font-mono text-neutral-500">
                                      Order: Position <span className="font-bold text-[#117644]">{activeIndex + 1}</span> of {uploadedMedia.length}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        disabled={activeIndex === 0}
                                        onClick={moveLeft}
                                        className="py-1 px-2.5 bg-white border border-[#eae3d2] hover:border-[#117644] hover:text-[#117644] rounded-lg text-[10px] font-mono text-[#042F1A] transition-colors disabled:opacity-35 disabled:hover:border-[#eae3d2] disabled:hover:text-[#042F1A] flex items-center gap-1 cursor-pointer"
                                        title="Shift Position Left"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Move Left</span>
                                      </button>
                                      
                                      <button
                                        type="button"
                                        disabled={activeIndex === uploadedMedia.length - 1}
                                        onClick={moveRight}
                                        className="py-1 px-2.5 bg-white border border-[#eae3d2] hover:border-[#117644] hover:text-[#117644] rounded-lg text-[10px] font-mono text-[#042F1A] transition-colors disabled:opacity-35 disabled:hover:border-[#eae3d2] disabled:hover:text-[#042F1A] flex items-center gap-1 cursor-pointer"
                                        title="Shift Position Right"
                                      >
                                        <span>Move Right</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      <button
                                        type="button"
                                        onClick={deleteItem}
                                        className="py-1 px-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                                        title="Delete Selected Item"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ====== STEP 2: Caption, Hashtags & AI Descriptions ====== */}
                    {publishStep === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-sm font-serif font-black text-[#042F1A] border-b pb-2 mb-3 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center font-mono font-black text-xs">2</span>
                            AI Viral Caption, Hashtag & Description Studio
                          </h3>
                        </div>

                        {/* ✨ Postrick AI Assisted Viral generator trigger block */}
                        <div className="bg-[#FAF5EB]/50 border border-[#eae3d2] p-4 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-[9px] font-mono uppercase font-black tracking-widest text-[#117644]">
                              ✨ AI Copywriting Topic Brief
                            </label>
                            <span className="text-[9px] font-mono text-[#117644]">postrick-3.5-flash</span>
                          </div>
                          
                          <textarea 
                            value={aiCaptionPrompt}
                            onChange={e => setAiCaptionPrompt(e.target.value)}
                            rows={2.5}
                            placeholder="Provide a concept brief detail (e.g. 'Flash launch. 10% coupon code: TREND10, focus on visual scheduler features')"
                            className="w-full p-2.5 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#117644] text-stone-700 leading-relaxed"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8px] font-mono font-black text-neutral-400 uppercase block mb-1">Target Tone:</label>
                              <select 
                                value={aiTone}
                                onChange={e => setAiTone(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border bg-white focus:outline-none text-stone-600"
                              >
                                <option value="Viral">🔥 Viral Spark</option>
                                <option value="Professional">💼 Corporate / Premium</option>
                                <option value="Witty">💡 Playful & Witty</option>
                                <option value="Bold">⚡ Bold & Punchy</option>
                                <option value="Friendly">🌸 Friendly & Welcoming</option>
                                <option value="Minimal">🌱 Matte Minimalist</option>
                                <option value="Persuasive">🎯 Growth Hacker</option>
                              </select>
                            </div>
                            <div className="flex items-end justify-end">
                              <button
                                type="button"
                                disabled={isGeneratingCaptionVariants}
                                onClick={async () => {
                                  setIsGeneratingCaptionVariants(true);
                                  try {
                                    const response = await fetch("/api/gemini/generate-caption-variants", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        prompt: aiCaptionPrompt,
                                        platforms: selectedPlatforms,
                                        tone: aiTone,
                                        audience: aiGuidelines,
                                        hasImage: uploadedMedia.length > 0
                                      })
                                    });
                                    const data = await response.json();
                                    if (data.variants && data.variants.length > 0) {
                                      setCaptionVariants(data.variants);
                                      confetti({ particleCount: 50, spread: 30, colors: ["#10b981", "#fbbf24"] });
                                    } else {
                                      alert("Could not process variant copies. Falling back in 1 second.");
                                    }
                                  } catch (err) {
                                    console.error("AI copy writer failed", err);
                                  } finally {
                                    setIsGeneratingCaptionVariants(false);
                                  }
                                }}
                                className="w-full py-2 bg-[#117644] text-white text-[10px] font-mono font-black uppercase rounded-xl hover:bg-[#042F1A] transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                {isGeneratingCaptionVariants ? (
                                  <>
                                    <RefreshCw className="w-3 animate-spin text-indigo-400" />
                                    <span>Writing copy...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 text-amber-500 animate-pulse" />
                                    <span>Generate AI Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Generated Copy list choices */}
                        {captionVariants.length > 0 && (
                          <div className="space-y-2">
                            <span className="block font-mono text-[9px] uppercase font-bold tracking-widest text-[#117644]">
                              AI High-converting Recommendations Choices:
                            </span>
                            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                              {captionVariants.map((v, i) => (
                                <div key={i} className="bg-white border text-left p-3 rounded-xl border-[#eae3d2] hover:border-[#117644] transition-all space-y-2">
                                  <div className="flex justify-between items-center text-[8px] font-mono uppercase font-black">
                                    <span className="p-0.5 px-1.5 bg-neutral-100 rounded text-stone-600">Option {i + 1} ({v.toneTag})</span>
                                    <span className="p-0.5 px-1.5 bg-emerald-50 text-[#117644] rounded flex items-center gap-0.5">{v.platform} mockup</span>
                                  </div>
                                  <p className="text-[10px] leading-relaxed text-slate-800 line-clamp-3 white-space-pre-wrap">{v.text}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {v.hashtags.map(tag => (
                                      <span key={tag} className="text-[8px] font-mono text-[#117644]">#{tag}</span>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => {
                                      const fullCaption = `${v.text}\n\n${v.hashtags.map(t => `#${t}`).join(" ")}`;
                                      handleUseCaption(fullCaption);
                                      confetti({ particleCount: 20, spread: 15 });
                                    }}
                                    className="w-full py-1 text-center bg-emerald-50 hover:bg-[#117644] hover:text-white rounded-lg text-[9px] uppercase font-black tracking-widest border border-emerald-100 text-[#117644] transition-colors"
                                  >
                                    Apply Variant to Active Draft
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Manually edit rich canvas text area */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                              Currently Configured Social Post Caption
                            </label>
                            <span className="text-[9px] font-mono text-neutral-400">Customisable content editor</span>
                          </div>

                          <div className="border border-[#eae3d2] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#117644]/20 focus-within:border-[#117644] bg-white transition-all">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between border-b border-[#eae3d2] bg-neutral-50 px-3 py-1.5 flex-wrap gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <button 
                                  type="button"
                                  title="Bold markdown"
                                  onClick={() => setPlatformCaption(prev => prev + " **bold text** ")}
                                  className="w-6 h-6 hover:bg-neutral-200 rounded font-bold text-xs flex items-center justify-center transition-colors"
                                >
                                  B
                                </button>
                                <button 
                                  type="button"
                                  title="Italic markdown"
                                  onClick={() => setPlatformCaption(prev => prev + " *italic text* ")}
                                  className="w-6 h-6 hover:bg-neutral-200 rounded italic text-xs flex items-center justify-center transition-colors"
                                >
                                  I
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPlatformCaption(prev => prev + " 🔥 ")}
                                  className="p-1 hover:bg-neutral-200 rounded text-xs"
                                >
                                  🔥
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPlatformCaption(prev => prev + " ✨ ")}
                                  className="p-1 hover:bg-neutral-200 rounded text-xs"
                                >
                                  ✨
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPlatformCaption(prev => prev + " 🌿 ")}
                                  className="p-1 hover:bg-neutral-200 rounded text-xs"
                                >
                                  🌿
                                </button>
                              </div>
                              <button
                                type="button"
                                title="Reset caption and media to default"
                                onClick={() => {
                                  if (confirm("Are you sure you want to reset your composer draft? This will clear your custom caption and media.")) {
                                    setPlatformCaption("");
                                    setUploadedMedia([]);
                                    setSelectedMediaId("");
                                    localStorage.removeItem("postrick_composer_caption");
                                    localStorage.removeItem("postrick_composer_media");
                                    localStorage.removeItem("postrick_composer_selected_media_id");
                                    setAutoSaveStatus("Draft Reset");
                                  }
                                }}
                                className="text-[10px] text-red-600 hover:text-red-800 font-mono font-black uppercase tracking-wider px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                              >
                                ✕ Reset Draft
                              </button>
                            </div>
                            
                            <textarea
                              value={platformCaption}
                              onChange={(e) => setPlatformCaption(e.target.value)}
                              rows={5}
                              className={`w-full text-xs p-3 text-[#042F1A] font-sans leading-relaxed focus:outline-none resize-none transition-all duration-700 ${
                                flashCaptionTextarea ? "ring-4 ring-emerald-500/50 bg-emerald-50" : "bg-neutral-50/20"
                              }`}
                              placeholder="Type or apply generated captions here..."
                            />
                          </div>
                        </div>

                        {/* AI Suggested Trending Hashtags */}
                        <div className="space-y-2 p-3 bg-gradient-to-br from-emerald-50/40 to-teal-50/10 border border-[#eae3d2] rounded-2xl">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase font-black tracking-widest text-[#117644]">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              AI Recommended Viral Tags
                            </span>
                            <button
                              type="button"
                              onClick={() => fetchAIHashtags(platformCaption)}
                              disabled={isGeneratingHashtags}
                              className="text-[9px] font-mono text-[#117644] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer disabled:opacity-50"
                            >
                              {isGeneratingHashtags ? "Analyzing..." : "🔄 Smart Analyze"}
                            </button>
                          </div>
                          
                          {isGeneratingHashtags ? (
                            <div className="flex items-center justify-center py-2 gap-2 text-[10px] font-mono text-[#117644]/80">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Analyzing post content for trending patterns...</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {suggestedHashtags.map((tag) => {
                                const cleanTag = tag.startsWith("#") ? tag : `#${tag}`;
                                const currentTagsLower = getHashtagsFromCaption(platformCaption);
                                const isAlreadyAdded = currentTagsLower.includes(cleanTag.toLowerCase());
                                
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleHashtagInCaption(cleanTag)}
                                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                      isAlreadyAdded
                                        ? "bg-[#117644] text-white border-transparent shadow-xs"
                                        : "bg-white hover:bg-emerald-50 text-neutral-600 hover:text-[#117644] border-neutral-200 hover:border-[#117644]/40"
                                    }`}
                                  >
                                    <span>{cleanTag}</span>
                                    {isAlreadyAdded ? (
                                      <Check className="w-2.5 h-2.5" />
                                    ) : (
                                      <Plus className="w-2.5 h-2.5 text-neutral-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Integrated simultaneously character count limit chips */}
                        <div className="space-y-1.5 pt-1">
                          <span className="block font-mono text-[8px] uppercase font-bold tracking-widest text-[#117644]">
                            Isomorphic Length Status (Simultaneous monitors)
                          </span>
                          <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5">
                            {selectedPlatforms.map(pKey => {
                              const limitConfig = PLATFORM_CHARACTER_LIMITS[pKey];
                              if (!limitConfig) return null;
                              const currentLen = platformCaption.length;
                              const percent = (currentLen / limitConfig.max) * 100;
                              const isWarning = percent > 90;
                              const isExceeded = currentLen > limitConfig.max;
                              
                              return (
                                <div 
                                  key={pKey}
                                  className={`p-1.5 rounded-lg border text-[9.5px] flex flex-col font-mono justify-between select-none ${
                                    isExceeded 
                                      ? "bg-rose-50 border-rose-200 text-rose-700" 
                                      : isWarning 
                                        ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" 
                                        : "bg-neutral-50 border-neutral-100 text-neutral-500"
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold">
                                    <span className="uppercase text-[8px] opacity-75">{limitConfig.label}</span>
                                    {isExceeded && <span className="text-rose-600">🚨 Limit</span>}
                                  </div>
                                  <span className="font-extrabold mt-0.5">
                                    {currentLen} / {limitConfig.max}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ====== STEP 3: Select Social Platforms ====== */}
                    {publishStep === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-sm font-serif font-black text-[#042F1A] border-b pb-2 mb-3 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center font-mono font-black text-xs">3</span>
                            Select Social Media Platform Channels
                          </h3>
                        </div>

                        {/* Platforms checklists grid cards */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "instagram", label: "Instagram Feed", desc: "Photo & Reels", icon: <Instagram className="w-5 h-5" />, color: "border-pink-200 hover:border-pink-500" },
                            { id: "tiktok", label: "TikTok Reel", desc: "Vertical Loops", icon: <TikTokIcon className="w-5 h-5" />, color: "border-[#eae3d2] hover:border-neutral-900" },
                            { id: "linkedin", label: "LinkedIn Post", desc: "Professional Pitch", icon: <Linkedin className="w-5 h-5" />, color: "border-blue-200 hover:border-blue-700" },
                            { id: "youtube", label: "YouTube Shorts", desc: "Shorts & Community", icon: <Youtube className="w-5 h-5" />, color: "border-red-200 hover:border-red-600" },
                            { id: "facebook", label: "Facebook Timeline", desc: "Social Syncing", icon: <Facebook className="w-5 h-5" />, color: "border-sky-200 hover:border-sky-700" },
                            { id: "pinterest", label: "Pinterest Pin", desc: "Aesthetic Boards", icon: <PinterestIcon className="w-5 h-5" />, color: "border-red-200 hover:border-red-500" }
                          ].map(platform => {
                            const isSelected = selectedPlatforms.includes(platform.id);
                            const isConnected = connectedChannels[platform.id as keyof typeof connectedChannels] ?? true;
                            
                            return (
                              <button
                                key={platform.id}
                                onClick={() => {
                                  if (isSelected) {
                                    if (selectedPlatforms.length > 1) {
                                      const next = selectedPlatforms.filter(p => p !== platform.id);
                                      setSelectedPlatforms(next);
                                      if (activePreviewTab === platform.id) setActivePreviewTab(next[0]);
                                    }
                                  } else {
                                    setSelectedPlatforms([...selectedPlatforms, platform.id]);
                                    setActivePreviewTab(platform.id);
                                  }
                                }}
                                className={`text-left p-4 rounded-2xl border cursor-pointer flex flex-col justify-between h-28 transition-all relative overflow-hidden select-none ${
                                  isSelected 
                                    ? "bg-[#042F1A] text-white border-[#042F1A] shadow-md" 
                                    : `bg-white text-[#042F1A] ${platform.color}`
                                }`}
                              >
                                <div className="flex items-start justify-between w-full">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/10" : "bg-neutral-50"}`}>
                                    {platform.icon}
                                  </div>
                                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-neutral-350"}`} title={isConnected ? "Channel online / connected" : "Virtual Demo mode Active"} />
                                </div>
                                <div className="mt-3">
                                  <h4 className="text-[11px] font-black uppercase tracking-wide leading-none">{platform.label}</h4>
                                  <span className={`text-[9px] ${isSelected ? "text-white/70" : "text-neutral-400"} mt-1 block`}>{platform.desc}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute top-2 right-2 p-0.5 bg-green-500 rounded-full text-white">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Warning / compliance info section */}
                        <div className="p-3 bg-emerald-50/25 border rounded-xl text-[10px] text-stone-600 text-left space-y-1">
                          <span className="font-bold flex items-center gap-1 text-[#117644]">
                            ✓ Cross-platform sync guarantees adaptive formatting
                          </span>
                          <p className="text-[9.5px]">Your chosen networks will compile with the appropriate hashtags, layout limits, and preview mockups shown in real-time in the Right preview lane.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* ====== STEP 4: Schedule Through Calendar ====== */}
                    {publishStep === 4 && (() => {
                      const [hStr, mStr] = composerScheduleTime.split(":");
                      const currentHour24 = parseInt(hStr) || 12;
                      const currentMinute = parseInt(mStr) || 0;
                      const currentIsPM = currentHour24 >= 12;
                      const currentHour12 = currentHour24 % 12 === 0 ? 12 : currentHour24 % 12;

                      const updateTime = (h12: number, min: number, isPM: boolean) => {
                        let h24 = h12 % 12;
                        if (isPM) h24 += 12;
                        const newTime = `${String(h24).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                        setComposerScheduleTime(newTime);
                      };

                      const getDaysInMonth = (year: number, month: number) => {
                        return new Date(year, month + 1, 0).getDate();
                      };

                      const getFirstDayOfMonth = (year: number, month: number) => {
                        const dVal = new Date(year, month, 1).getDay();
                        return dVal === 0 ? 6 : dVal - 1; // Mon is 0, Sun is 6
                      };

                      const daysCount = getDaysInMonth(viewedYear, viewedMonth);
                      const firstDayIndex = getFirstDayOfMonth(viewedYear, viewedMonth);
                      
                      const monthNames = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];

                      const hourAngle = (currentHour12 % 12) * 30 + currentMinute * 0.5;
                      const minuteAngle = currentMinute * 6;

                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div>
                            <h3 className="text-sm font-serif font-black text-[#042F1A] border-b pb-2 mb-3 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center font-mono font-black text-xs">4</span>
                              Schedule Dispatch Through Calendar
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Calendar Card */}
                            <div className="p-4 bg-white border border-[#eae3d2] rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644] mb-3">
                                  CHOOSE PUBLISH DATE
                                </span>

                                {/* Calendar Header Navigation */}
                                <div className="flex justify-between items-center mb-3">
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      if (viewedMonth === 0) {
                                        setViewedMonth(11);
                                        setViewedYear(prev => prev - 1);
                                      } else {
                                        setViewedMonth(prev => prev - 1);
                                      }
                                    }}
                                    className="p-1 hover:bg-neutral-100 rounded-lg transition-colors border-none cursor-pointer text-stone-700"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <span className="font-serif font-black text-xs text-[#042F1A]">
                                    {monthNames[viewedMonth]} {viewedYear}
                                  </span>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      if (viewedMonth === 11) {
                                        setViewedMonth(0);
                                        setViewedYear(prev => prev + 1);
                                      } else {
                                        setViewedMonth(prev => prev + 1);
                                      }
                                    }}
                                    className="p-1 hover:bg-neutral-100 rounded-lg transition-colors border-none cursor-pointer text-stone-700"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Weekday Labels */}
                                <div className="grid grid-cols-7 gap-1 text-[8px] font-mono text-center mb-2">
                                  {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                                    <div key={idx} className="font-black text-[#117644]/60 py-0.5">{d}</div>
                                  ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-1 text-[10px] font-mono text-center">
                                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                                    <div key={`empty-${i}`} className="py-1" />
                                  ))}
                                  {Array.from({ length: daysCount }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dateStr = `${viewedYear}-${String(viewedMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                                    const isSelected = composerScheduleDate === dateStr;
                                    return (
                                      <button
                                        key={dayNum}
                                        type="button"
                                        onClick={() => {
                                          setComposerScheduleDate(dateStr);
                                          confetti({ particleCount: 15, spread: 20 });
                                        }}
                                        className={`py-1.5 text-[10px] font-mono font-black rounded-lg transition-all border-none cursor-pointer flex items-center justify-center ${
                                          isSelected 
                                            ? "bg-[#117644] text-white shadow-xs scale-105" 
                                            : "text-[#042F1A] hover:bg-neutral-100 hover:text-[#117644]"
                                        }`}
                                      >
                                        {dayNum}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-dashed border-[#eae3d2] text-left">
                                <span className="text-[8px] font-mono font-bold text-neutral-400 uppercase">Selected Date:</span>
                                <div className="text-[11px] font-mono font-black text-[#117644] mt-0.5">{composerScheduleDate}</div>
                              </div>
                            </div>

                            {/* Clock Card */}
                            <div className="p-4 bg-white border border-[#eae3d2] rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="block font-mono text-[9px] uppercase font-black tracking-widest text-[#117644] text-left mb-2">
                                  CHOOSE PUBLISH TIME
                                </span>

                                {/* Clock Hands SVG Visualizer */}
                                <div className="flex items-center justify-center my-1.5">
                                  <svg width="110" height="110" className="select-none filter drop-shadow-xs">
                                    <circle cx="55" cy="55" r="50" fill="#FFFFFF" stroke="#eae3d2" strokeWidth="2" />
                                    {/* Hour hand */}
                                    <line 
                                      x1="55" y1="55" 
                                      x2={55 + 24 * Math.sin((hourAngle * Math.PI) / 180)} 
                                      y2={55 - 24 * Math.cos((hourAngle * Math.PI) / 180)} 
                                      stroke="#042F1A" 
                                      strokeWidth="3.5" 
                                      strokeLinecap="round" 
                                    />
                                    {/* Minute hand */}
                                    <line 
                                      x1="55" y1="55" 
                                      x2={55 + 36 * Math.sin((minuteAngle * Math.PI) / 180)} 
                                      y2={55 - 36 * Math.cos((minuteAngle * Math.PI) / 180)} 
                                      stroke="#117644" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                    />
                                    <circle cx="55" cy="55" r="3" fill="#C5E729" stroke="#042F1A" strokeWidth="1" />
                                    <text x="55" y="15" textAnchor="middle" className="text-[8px] font-mono font-black fill-[#042F1A]/45">12</text>
                                    <text x="96" y="58" textAnchor="middle" className="text-[8px] font-mono font-black fill-[#042F1A]/45">3</text>
                                    <text x="55" y="100" textAnchor="middle" className="text-[8px] font-mono font-black fill-[#042F1A]/45">6</text>
                                    <text x="14" y="58" textAnchor="middle" className="text-[8px] font-mono font-black fill-[#042F1A]/45">9</text>
                                  </svg>
                                </div>

                                {/* Digital Clock Display */}
                                <div className="flex items-center justify-center gap-1.5 bg-[#FAF5EB]/50 border border-[#eae3d2] rounded-xl py-1.5 px-3 mb-3">
                                  <span className="font-mono text-sm font-black text-[#042F1A]">
                                    {currentHour12.toString().padStart(2, "0")}:{currentMinute.toString().padStart(2, "0")}
                                  </span>
                                  <span className="font-mono text-[9px] font-black bg-[#117644]/10 text-[#117644] px-1 rounded-sm uppercase">
                                    {currentIsPM ? "PM" : "AM"}
                                  </span>
                                </div>

                                {/* Controls */}
                                <div className="space-y-2 text-left">
                                  <div className="flex items-center justify-between gap-2">
                                    <label className="text-[8px] font-mono font-black text-neutral-400">HOUR (1-12):</label>
                                    <div className="flex items-center gap-1">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          let nextH = currentHour12 - 1;
                                          if (nextH < 1) nextH = 12;
                                          updateTime(nextH, currentMinute, currentIsPM);
                                        }}
                                        className="w-5 h-5 rounded-md bg-neutral-100 border-none cursor-pointer text-xs font-bold text-[#042F1A] hover:bg-neutral-200 flex items-center justify-center"
                                      >
                                        -
                                      </button>
                                      <span className="font-mono text-xs font-black px-1 min-w-[16px] text-center">{currentHour12}</span>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          let nextH = currentHour12 + 1;
                                          if (nextH > 12) nextH = 1;
                                          updateTime(nextH, currentMinute, currentIsPM);
                                        }}
                                        className="w-5 h-5 rounded-md bg-neutral-100 border-none cursor-pointer text-xs font-bold text-[#042F1A] hover:bg-neutral-200 flex items-center justify-center"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-2">
                                    <label className="text-[8px] font-mono font-black text-neutral-400">MINUTE (0-59):</label>
                                    <div className="flex items-center gap-1">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          let nextM = currentMinute - 5;
                                          if (nextM < 0) nextM = 55;
                                          updateTime(currentHour12, nextM, currentIsPM);
                                        }}
                                        className="w-5 h-5 rounded-md bg-neutral-100 border-none cursor-pointer text-xs font-bold text-[#042F1A] hover:bg-neutral-200 flex items-center justify-center"
                                      >
                                        -
                                      </button>
                                      <span className="font-mono text-xs font-black px-1 min-w-[16px] text-center">{currentMinute.toString().padStart(2, "0")}</span>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          let nextM = currentMinute + 5;
                                          if (nextM > 59) nextM = 0;
                                          updateTime(currentHour12, nextM, currentIsPM);
                                        }}
                                        className="w-5 h-5 rounded-md bg-neutral-100 border-none cursor-pointer text-xs font-bold text-[#042F1A] hover:bg-neutral-200 flex items-center justify-center"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* AM/PM Selection Button pair */}
                                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => updateTime(currentHour12, currentMinute, false)}
                                      className={`py-1 rounded-lg text-[9px] font-mono font-black border uppercase transition-all cursor-pointer ${
                                        !currentIsPM 
                                          ? "bg-[#117644] text-white border-[#117644]" 
                                          : "bg-neutral-50 border-[#eae3d2] text-[#042F1A]"
                                      }`}
                                    >
                                      AM
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateTime(currentHour12, currentMinute, true)}
                                      className={`py-1 rounded-lg text-[9px] font-mono font-black border uppercase transition-all cursor-pointer ${
                                        currentIsPM 
                                          ? "bg-[#117644] text-white border-[#117644]" 
                                          : "bg-neutral-50 border-[#eae3d2] text-[#042F1A]"
                                      }`}
                                    >
                                      PM
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Engagement Peak times info panel */}
                          <div className="border border-[#eae3d2] p-4 rounded-2xl bg-[#FAF5EB]/30 space-y-2 text-left">
                            <span className="text-[9px] font-mono font-black text-[#117644] uppercase tracking-wider block">Suggested Peak Times</span>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { t: "09:00", label: "Morning Surge" },
                                { t: "15:00", label: "Midday Work" },
                                { t: "18:00", label: "Commute Peak" }
                              ].map(slot => (
                                <button
                                  key={slot.t}
                                  type="button"
                                  onClick={() => {
                                    setComposerScheduleTime(slot.t);
                                    confetti({ particleCount: 15, spread: 15 });
                                  }}
                                  className={`p-1.5 rounded-xl text-[9.5px] border text-center transition-all cursor-pointer ${
                                    composerScheduleTime === slot.t
                                      ? "bg-[#117644] text-white border-[#117644] font-bold"
                                      : "bg-white border-[#eae3d2] text-[#042F1A] hover:border-[#117644]"
                                  }`}
                                >
                                  <div>{slot.label}</div>
                                  <div className="font-mono text-[8px] font-bold mt-0.5">{slot.t}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Integration notice */}
                          <div className="p-3 bg-[#FAF5EB]/50 border text-[10px] text-stone-600 text-left rounded-xl leading-relaxed">
                            <span className="font-semibold block text-[#117644]">Isomorphic Calendar Syncing</span>
                            <p className="text-[9.5px]">Upon final publication review step, your post will be automatically compiled as scheduled slots and will visible on the custom multi-view Content Calendar panel.</p>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* ====== STEP 5: Review & Publish ====== */}
                    {publishStep === 5 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-sm font-serif font-black text-[#042F1A] border-b pb-2 mb-3 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#117644]/10 text-[#117644] flex items-center justify-center font-mono font-black text-xs">5</span>
                            Review Post &amp; Broadcast Live
                          </h3>
                        </div>

                        {/* Audit check items */}
                        <div className="space-y-2 border p-4 rounded-2xl bg-white border-[#eae3d2] text-left">
                          <span className="block font-mono text-[9px] uppercase font-bold tracking-widest text-[#117644] mb-2">Final Publishing Compliance Audit Checklist</span>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#042F1A]">
                              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-[#117644] flex items-center justify-center font-bold text-[10px]">✓</span>
                              <span>Platform Channels selected: <strong className="uppercase font-mono text-[10px] text-[#117644]">{selectedPlatforms.join(", ")}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#042F1A]">
                              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-[#117644] flex items-center justify-center font-bold text-[10px]">✓</span>
                              <span>Target scheduling sets: <strong className="font-mono text-[10px] text-[#117644]">{composerScheduleDate} at {composerScheduleTime}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#042F1A]">
                              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-[#117644] flex items-center justify-center font-bold text-[10px]">✓</span>
                              <span>Caption status check: <span className="text-neutral-500 font-mono text-[10px]">{platformCaption.length} characters written</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#042F1A]">
                              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-[#117644] flex items-center justify-center font-bold text-[10px]">✓</span>
                              <span>Media attachment status: <span className="text-neutral-500 font-mono text-[10px]">{uploadedMedia.length} visual asset{uploadedMedia.length !== 1 && "s"}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl text-left leading-relaxed">
                          <p className="text-[10px] text-stone-600 font-serif">
                            💡 <strong>Live Adaptability Check:</strong> Switch through platform mockups on the Right panel to review perfect look. Everything matches real dimensions and character limitations exactly.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Foot controls */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap text-left">
                      <button
                        type="button"
                        onClick={() => setPublishStep(prev => Math.max(1, prev - 1))}
                        disabled={publishStep === 1}
                        className="px-4 py-2 text-[10px] font-mono font-black uppercase tracking-wider text-[#042F1A] hover:bg-neutral-50 rounded-xl transition-all border border-[#eae3d2] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ← Back
                      </button>

                      {publishStep < 5 ? (
                        <button
                          type="button"
                          onClick={() => setPublishStep(prev => Math.min(5, prev + 1))}
                          className="px-4 py-2 text-[10px] font-mono font-black uppercase tracking-wider text-white bg-[#117644] hover:bg-[#042F1A] rounded-xl transition-all border border-[#117644] cursor-pointer"
                        >
                          Next Step →
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Save as Draft inside calendar queue slots!
                              const parsedDay = new Date(composerScheduleDate).toLocaleString('en-US', { weekday: 'short' }) || "Mon";
                              const nextSlot = {
                                id: "composer-slot-" + Math.random().toString(),
                                day: parsedDay,
                                hour: composerScheduleTime,
                                platform: selectedPlatforms[0] || "instagram",
                                platforms: selectedPlatforms,
                                text: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                                status: "scheduled" as const,
                                title: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                                startTime: composerScheduleTime,
                                endTime: (() => {
                                  const [h, m] = composerScheduleTime.split(":");
                                  return `${String(parseInt(h) + 1).padStart(2, "0")}:${m || "00"}`;
                                })(),
                                dayIndex: { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[parsedDay] ?? 0,
                                accentColor: "#117644",
                                date: composerScheduleDate,
                              };
                              setScheduledSlots(prev => [...prev, nextSlot]);
                              alert("Content scheduled successfully inside the calendar!");
                              confetti({ particleCount: 80, spread: 45 });
                            }}
                            className="px-3 py-2 text-[10px] font-mono font-black uppercase tracking-wider text-[#117644] hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100 cursor-pointer"
                          >
                            Save Draft &amp; Queue
                          </button>

                          <button
                            onClick={async () => {
                              setIsPublishingNow(true);
                              await new Promise(r => setTimeout(r, 1500));
                              setIsPublishingNow(false);
                              setShowPublishSuccessModal(true);
                              confetti({ particleCount: 200, spread: 90, scalar: 1.2 });
                              
                              // Also add to scheduledSlots as a published slot!
                              const parsedDay = new Date(composerScheduleDate).toLocaleString('en-US', { weekday: 'short' }) || "Mon";
                              const nextSlot = {
                                id: "composer-slot-" + Math.random().toString(),
                                day: parsedDay,
                                hour: composerScheduleTime,
                                platform: selectedPlatforms[0] || "instagram",
                                platforms: selectedPlatforms,
                                text: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                                status: "published" as const,
                                title: platformCaption.split("\n")[0] || "Adaptive brand caption slot",
                                startTime: composerScheduleTime,
                                endTime: (() => {
                                  const [h, m] = composerScheduleTime.split(":");
                                  return `${String(parseInt(h) + 1).padStart(2, "0")}:${m || "00"}`;
                                })(),
                                dayIndex: { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[parsedDay] ?? 0,
                                accentColor: "#117644",
                                date: composerScheduleDate,
                              };
                              setScheduledSlots(prev => [...prev, nextSlot]);
                            }}
                            disabled={isPublishingNow}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#FAF6EE] bg-[#042F1A] hover:bg-[#117644] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isPublishingNow ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Broadcasting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Publish Now</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                  {/* RIGHT PANE (~55% width: 7 of 12 cols) — Live Preview Frame container */}
                  <div className="lg:col-span-7 bg-white relative border border-[#eae3d2] rounded-3xl min-h-[660px] overflow-hidden flex flex-col justify-between shadow-2xs">
                    
                    <div>
                      {/* Live Preview Header row */}
                      <div className="p-4 border-b border-[#FAF6EE] bg-neutral-50/40 flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-widest font-black text-[#117644] flex items-center gap-1">
                          <Eye className="w-4 h-4 text-emerald-600" />
                          LIVE PREVIEW ENGINE
                        </span>
                        
                        {/* Selected channels warning list badge indicator */}
                        <div className="flex gap-1">
                          <span className="text-[9px] bg-neutral-100 text-[#042F1A] font-mono px-2 py-0.5 rounded-md font-bold">
                            {selectedPlatforms.length} Channel{selectedPlatforms.length !== 1 && 's'} Attached
                          </span>
                        </div>
                      </div>

                      {/* Animated tabbed platform switcher at the top */}
                      <div className="px-4 py-2 border-b border-[#FAF6EE] bg-[#FAF5EB]/10 overflow-x-auto">
                        <div className="flex gap-1.5 min-w-max">
                          <AnimatePresence>
                            {selectedPlatforms.map(pId => {
                              const isActive = activePreviewTab === pId;
                              const labelMap: Record<string, string> = {
                                instagram: "Instagram Feed",
                                tiktok: "TikTok Reel",
                                linkedin: "LinkedIn Feed",
                                youtube: "YouTube Community",
                                facebook: "Meta Feed",
                                pinterest: "Pinterest Pin"
                              };
                              return (
                                <motion.button
                                  key={pId}
                                  layout
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.25 }}
                                  onClick={() => setActivePreviewTab(pId)}
                                  className={`px-3 py-1.8 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all select-none cursor-pointer ${
                                    isActive
                                      ? "bg-[#117644]/10 text-[#117644] border hover:border-[#117644]/50"
                                      : "bg-transparent text-neutral-400 hover:text-neutral-700"
                                  }`}
                                >
                                  {pId === "instagram" && <Instagram className="w-3.5 h-3.5" />}
                                  {pId === "tiktok" && <TikTokIcon className="w-3.5 h-3.5" />}
                                  {pId === "linkedin" && <Linkedin className="w-3.5 h-3.5" />}
                                  {pId === "youtube" && <Youtube className="w-3.5 h-3.5" />}
                                  {pId === "facebook" && <Facebook className="w-3.5 h-3.5" />}
                                  {pId === "pinterest" && <PinterestIcon className="w-3.5 h-3.5" />}
                                  <span>{labelMap[pId] || pId}</span>
                                </motion.button>
                              );
                            })}
                          </AnimatePresence>
                          
                          {selectedPlatforms.length === 0 && (
                            <p className="text-[10px] text-red-500 font-bold py-1">⚠️ No target channels selected! Toggle chips on Left compose pane to activate.</p>
                          )}
                        </div>
                      </div>

                      {/* Mockup Frame Container Box */}
                      <div className="p-6 flex items-center justify-center bg-[#FAF6EE]/50 min-h-[480px]">
                        
                        <AnimatePresence mode="wait">
                          {(() => {
                            const activeMedia = uploadedMedia.find(m => m.id === selectedMediaId) || uploadedMedia[0];
                            const captionLimitMap = PLATFORM_CHARACTER_LIMITS[activePreviewTab];
                            const currentCombinedLen = platformCaption.length;
                            const isViolatingLen = captionLimitMap && currentCombinedLen > captionLimitMap.max;
                            const isMissingMedia = ["instagram", "tiktok", "pinterest"].includes(activePreviewTab) && !activeMedia;
                            const showsPromptWarning = isViolatingLen || isMissingMedia || (activePreviewTab === "pinterest" && activeMedia?.cropWarning);
                            const fullCaptionToRender = platformCaption;
                            
                            return (
                              <motion.div
                                key={activePreviewTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full max-w-sm flex flex-col gap-4 items-center"
                              >
                                {/* Static dynamic custom warning constraint banner atop preview mockup item */}
                                {showsPromptWarning && (
                                  <div className="w-full p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[10px] space-y-1 text-left flex items-start gap-2 select-none shadow-3xs">
                                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold uppercase tracking-wider text-[9px]">Live Constraint Alerts (Non-blocking)</p>
                                      <ul className="list-disc pl-3 pt-0.5 space-y-0.5">
                                        {isViolatingLen && (
                                          <li>Caption length ({currentCombinedLen}) exceeds {activePreviewTab} limit of {captionLimitMap.max}</li>
                                        )}
                                        {isMissingMedia && (
                                          <li>{activePreviewTab} require at least 1 photo/video layout attachment</li>
                                        )}
                                        {activePreviewTab === "pinterest" && activeMedia?.cropWarning && (
                                          <li>{activeMedia.cropWarning}</li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}

                                {/* INSTAGRAM MOCKUP */}
                                {activePreviewTab === "instagram" && (
                                  <div className="w-full bg-white rounded-3xl border border-neutral-200 shadow-md overflow-hidden text-left font-sans">
                                    <div className="p-3 flex items-center justify-between border-b border-neutral-100">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-purple-600 p-0.5">
                                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-black text-[#042F1A]">PO</div>
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-black block">postrick_aesthetic</span>
                                          <span className="text-[8px] text-neutral-400 block -mt-0.5">San Francisco, California</span>
                                        </div>
                                      </div>
                                      <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                    </div>
                                    
                                    {/* Content display */}
                                    {activeMedia ? (
                                      activeMedia.type === "video" ? (
                                        <div className="w-full h-64 bg-black flex items-center justify-center relative">
                                          <video 
                                            src={activeMedia.url} 
                                            controls 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <img src={activeMedia.url} alt="Instagram live preview" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                                      )
                                    ) : (
                                      <div className="w-full h-64 bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs italic">No Media Selected</div>
                                    )}

                                    {/* Reactions row */}
                                    <div className="p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-neutral-700">
                                          <Heart className="w-4.5 h-4.5 hover:text-red-500 cursor-pointer" />
                                          <MessageCircle className="w-4.5 h-4.5 hover:text-blue-500" />
                                          <Share2 className="w-4.5 h-4.5" />
                                        </div>
                                        <Bookmark className="w-4.5 h-4.5 text-neutral-400" />
                                      </div>
                                      <div className="text-[10px] space-y-1 leading-relaxed text-[#042F1A]">
                                        <p className="font-extrabold">2,410 Likes · 32 Comments</p>
                                        <p className="whitespace-pre-wrap">
                                          <span className="font-bold mr-1.5">postrick_aesthetic</span>
                                          {/* Simple custom hashtag color regex mock styling */}
                                          {fullCaptionToRender.split(" ").map((w, idx) => {
                                            if (w.startsWith("#")) return <span key={idx} className="text-pink-600 font-medium hover:underline">{w} </span>;
                                            if (w.startsWith("@")) return <span key={idx} className="text-blue-600 font-medium">{w} </span>;
                                            return w + " ";
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* TIKTOK FEED MOCKUP */}
                                {activePreviewTab === "tiktok" && (
                                  <div className="w-full h-[460px] bg-black rounded-3xl overflow-hidden relative border border-neutral-800 text-white font-sans text-left">
                                    {/* Video/Image canvas */}
                                    {activeMedia ? (
                                      activeMedia.type === "video" ? (
                                        <video 
                                          src={activeMedia.url} 
                                          controls 
                                          autoPlay 
                                          muted 
                                          loop 
                                          playsInline
                                          className="w-full h-full object-cover opacity-85"
                                        />
                                      ) : (
                                        <img src={activeMedia.url} alt="TikTok bg mockup preview" className="w-full h-full object-cover opacity-85" referrerPolicy="no-referrer" />
                                      )
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-neutral-600 italic text-xs">Awaiting Tiktok Reel video/render files...</div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 flex flex-col justify-between p-4 pointer-events-none">
                                      {/* Top navigation header */}
                                      <div className="flex justify-center items-center gap-3 text-xs font-bold pt-1.5 uppercase tracking-wide">
                                        <span className="opacity-60">Following</span>
                                        <span className="border-b-2 border-white pb-1 font-black">For You</span>
                                      </div>

                                      {/* Side quick action sidebar widgets overlay */}
                                      <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 text-center select-none pointer-events-auto">
                                        <div className="relative">
                                          <div className="w-9 h-9 rounded-full bg-[#117644] border-2 border-white flex items-center justify-center font-bold text-xs">SG</div>
                                          <span className="absolute -bottom-1.5 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black font-serif">+</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <div className="p-2 bg-neutral-900/55 rounded-full hover:bg-neutral-800/80 cursor-pointer">
                                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                          </div>
                                          <span className="text-[10px] font-black mt-0.5 shadow-xs">4.2k</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <div className="p-2 bg-neutral-900/55 rounded-full">
                                            <MessageCircle className="w-5 h-5" />
                                          </div>
                                          <span className="text-[10px] font-black mt-0.5 shadow-xs">201</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <div className="p-2 bg-neutral-900/55 rounded-full">
                                            <Bookmark className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                          </div>
                                          <span className="text-[10px] font-black mt-0.5 shadow-xs">88</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/40 bg-slate-900 flex items-center justify-center animate-spin">
                                          <div className="w-4 h-4 rounded-full bg-emerald-500" />
                                        </div>
                                      </div>

                                      {/* Bottom Content Caption indicators */}
                                      <div className="space-y-1.5 pr-14 select-none pointer-events-auto">
                                        <h4 className="font-extrabold text-[#10b981] text-xs">@postrick_official</h4>
                                        <p className="text-[10.5px] line-clamp-3 leading-relaxed text-neutral-100 whitespace-pre-wrap">
                                          {fullCaptionToRender.split(" ").map((w, idx) => {
                                            if (w.startsWith("#")) return <span key={idx} className="text-[#00f2fe] font-bold">{w} </span>;
                                            return w + " ";
                                          })}
                                        </p>
                                        <p className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                                          <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Original sound track - Postrick Organic loops
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* LINKEDIN CORPORATE NEWS FEED MOCKUP */}
                                {activePreviewTab === "linkedin" && (
                                  <div className="w-full bg-white rounded-2xl border border-neutral-200 p-4 space-y-3.5 text-left font-sans shadow-md">
                                    <div className="flex justify-between items-start">
                                      <div className="flex gap-2.5">
                                        <div className="w-9 h-9 rounded bg-[#042F1A] font-serif text-white font-extrabold text-sm flex items-center justify-center">P</div>
                                        <div>
                                          <span className="font-black text-xs block text-slate-950 flex items-center gap-1">
                                            Postrick Systems LLC
                                            <span className="text-[8px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-full border border-blue-200 select-none uppercase">Promoted</span>
                                          </span>
                                          <span className="text-[9px] text-neutral-400 block -mt-0.5">18,240,110 seguidores · Patrocinado · 🌐</span>
                                        </div>
                                      </div>
                                      <button className="text-blue-600 font-black text-xs hover:underline">+ Seguir</button>
                                    </div>

                                    {/* Text description with clickable highlight link items */}
                                    <p className="text-[11px] leading-relaxed text-neutral-800 whitespace-pre-wrap">
                                      {fullCaptionToRender.split(" ").map((w, idx) => {
                                        if (w.startsWith("#")) return <span key={idx} className="text-blue-700 font-bold hover:underline">{w} </span>;
                                        if (w.startsWith("@")) return <span key={idx} className="text-blue-700 font-bold">{w} </span>;
                                        return w + " ";
                                      })}
                                    </p>

                                    {/* Shared Content card attach */}
                                    {activeMedia && (
                                      <div className="rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50">
                                        {activeMedia.type === "video" ? (
                                          <video 
                                            src={activeMedia.url} 
                                            controls 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            className="w-full h-40 object-cover"
                                          />
                                        ) : (
                                          <img src={activeMedia.url} alt="LinkedIn banner" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                                        )}
                                        <div className="p-3 bg-white border-t space-y-0.5">
                                          <span className="text-[8.5px] font-mono tracking-widest text-[#117644] font-bold block uppercase">POSTRICK.COM/CIRCULARITY</span>
                                          <span className="text-[11px] font-black text-slate-800 block">Eco-Design Circular Devices Roadmap Release</span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Interaction metrics row bar */}
                                    <div className="flex items-center justify-between text-[8px] text-neutral-400 font-semibold border-b pb-2">
                                      <span className="flex items-center gap-1 hover:underline cursor-pointer">
                                        👍 ❤️ 💡 240 recomiendan este post
                                      </span>
                                      <span className="hover:underline">12 comentarios · 14 compartidos</span>
                                    </div>

                                    {/* Interaction feedback bar */}
                                    <div className="grid grid-cols-4 gap-1 text-center justify-stretch text-[9.5px] font-black text-neutral-500 pt-0.5 select-none">
                                      <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"><span>👍</span> Recomendar</button>
                                      <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"><span>💬</span> Comentar</button>
                                      <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"><span>🔁</span> Compartir</button>
                                      <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"><span>📤</span> Enviar</button>
                                    </div>
                                  </div>
                                )}

                                {/* YOUTUBE COMMUNITY FEED DESIGN */}
                                {activePreviewTab === "youtube" && (
                                  <div className="w-full bg-white rounded-xl border border-neutral-200 p-4 text-left font-sans shadow-md space-y-3">
                                    <div className="flex gap-2.5 items-center">
                                      <div className="w-8 h-8 rounded-full bg-red-650 flex items-center justify-center text-white font-black text-xs leading-none">PO</div>
                                      <div>
                                        <span className="font-extrabold text-xs text-slate-900 block flex items-center gap-1">
                                          Postrick Circular Systems
                                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 text-white flex items-center justify-center font-serif text-[6px]">✓</span>
                                        </span>
                                        <span className="text-[9px] text-neutral-400 block -mt-0.5">Community channel · 1.1M Subscribers</span>
                                      </div>
                                    </div>

                                    {/* Community text caption */}
                                    <p className="text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                                      {fullCaptionToRender.split(" ").map((w, idx) => {
                                        if (w.startsWith("#")) return <span key={idx} className="text-red-650 font-semibold">{w} </span>;
                                        return w + " ";
                                      })}
                                    </p>

                                    {uploadedMedia.length > 0 && (
                                      <div className="rounded-lg border overflow-hidden">
                                        {(activeMedia ? activeMedia.type === "video" : uploadedMedia[0].type === "video") ? (
                                          <video 
                                            src={activeMedia ? activeMedia.url : uploadedMedia[0].url} 
                                            controls 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            className="w-full h-44 object-cover"
                                          />
                                        ) : (
                                          <img src={activeMedia ? activeMedia.url : uploadedMedia[0].url} alt="YT Preview graphic" className="w-full h-44 object-cover" referrerPolicy="no-referrer" />
                                        )}
                                      </div>
                                    )}

                                    {/* Custom YouTube Engagement Buttons bar */}
                                    <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold select-none pt-1">
                                      <button className="flex items-center gap-1.5 hover:bg-neutral-100 px-2 py-1 rounded-full">
                                        👍 <span className="text-slate-700">1.2K</span>
                                      </button>
                                      <button className="flex items-center gap-1.5 hover:bg-neutral-100 px-2 py-1 rounded-full">
                                        👎
                                      </button>
                                      <button className="flex items-center gap-1.5 hover:bg-neutral-100 px-2.5 py-1 rounded-full">
                                        💬 <span className="text-slate-700">89 Comments</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* FACEBOOK FEED CARD MOCKUP */}
                                {activePreviewTab === "facebook" && (
                                  <div className="w-full bg-white rounded-2xl border border-neutral-200 p-4 space-y-3.5 text-left font-sans shadow-md">
                                    <div className="flex items-center justify-between">
                                      <div className="flex gap-2.5 items-center">
                                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-extrabold flex items-center justify-center text-[10px]">P</div>
                                        <div>
                                          <span className="font-bold text-xs text-slate-900 block">Postrick Organic Technologies</span>
                                          <span className="text-[9px] text-neutral-400 block -mt-0.5">3 hours ago · 🌐</span>
                                        </div>
                                      </div>
                                      <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                    </div>

                                    {/* Text Content */}
                                    <p className="text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                                      {fullCaptionToRender}
                                    </p>

                                    {/* Shared Asset with beautiful full card preview */}
                                    {activeMedia && (
                                      <div className="border border-neutral-200 overflow-hidden rounded-lg bg-neutral-50">
                                        {activeMedia.type === "video" ? (
                                          <video 
                                            src={activeMedia.url} 
                                            controls 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            className="w-full h-48 object-cover"
                                          />
                                        ) : (
                                          <img src={activeMedia.url} alt="Facebook Shared Attachment" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                                        )}
                                      </div>
                                    )}

                                    {/* Reaction Stats and Feedback Buttons */}
                                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold border-b border-neutral-100 pb-2">
                                      <span>❤️👍😆 481 Likes</span>
                                      <span>126 Comments · 54 Shares</span>
                                    </div>

                                    <div className="grid grid-cols-3 text-center text-[10px] font-extrabold text-neutral-500 select-none pt-0.5">
                                      <button className="py-1.5 hover:bg-neutral-50 rounded-lg">👍 Like</button>
                                      <button className="py-1.5 hover:bg-neutral-50 rounded-lg">💬 Comment</button>
                                      <button className="py-1.5 hover:bg-neutral-50 rounded-lg">📤 Share</button>
                                    </div>
                                  </div>
                                )}

                                {/* PINTEREST RICH PIN DETAIL CANVAS */}
                                {activePreviewTab === "pinterest" && (
                                  <div className="w-full bg-white rounded-2xl border border-neutral-200 p-4 space-y-4 text-left font-sans shadow-md">
                                    <div className="flex justify-between items-center select-none pt-0.5">
                                      <div className="flex gap-1">
                                        <span className="text-[9.5px] font-mono text-neutral-400">pinterest.com/postrick</span>
                                      </div>
                                      <button className="bg-red-650 hover:bg-red-750 text-white font-black text-xs px-4 py-1.8 rounded-full shadow-sm">Save</button>
                                    </div>

                                    {/* Tall vertical layout container */}
                                    <div className="rounded-2xl overflow-hidden border">
                                      {(activeMedia ? activeMedia.type === "video" : false) ? (
                                        <video 
                                          src={activeMedia.url} 
                                          controls 
                                          autoPlay 
                                          muted 
                                          loop 
                                          playsInline
                                          className="w-full h-72 object-cover"
                                        />
                                      ) : (
                                        <img src={activeMedia ? activeMedia.url : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=350&h=450&q=80"} alt="Pinterest pin vertical render" className="w-full h-72 object-cover" referrerPolicy="no-referrer" />
                                      )}
                                    </div>

                                    {/* Pin text detail info */}
                                    <div className="space-y-1 pt-1">
                                      <h3 className="font-serif font-black text-slate-900 text-sm leading-tight">Postrick circular hardware ecosystems</h3>
                                      <p className="text-[10.5px] text-neutral-500 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                                        {fullCaptionToRender}
                                      </p>
                                    </div>

                                    {/* Profile section footer */}
                                    <div className="border-t pt-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center justify-center">P</div>
                                        <div>
                                          <span className="font-bold text-[10.5px] block">Postrick Systems</span>
                                          <span className="text-[8.5px] text-neutral-400 block -mt-0.5">450k Monthly Views</span>
                                        </div>
                                      </div>
                                      <button className="bg-neutral-100 hover:bg-neutral-200 font-bold text-[10.5px] text-neutral-800 px-3 py-1.5 rounded-full transition-colors">Follow</button>
                                    </div>
                                  </div>
                                )}

                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>

                      </div>
                    </div>

                    {/* Left over instructions footer context */}
                    <div className="p-4 border-t border-[#FAF6EE] bg-neutral-50/20 text-neutral-400 text-[10px] font-medium leading-relaxed">
                      💡 <strong>Isomorphic Realism Strategy:</strong> Switching active tabs slides and crossfades the preview frames beautifully. Every edit in the Compose form reflects with zero lag.
                    </div>

                    {/* ✨ AI Assist slide-in-from-right Companion Drawer Overlay */}
                    <AnimatePresence>
                      {isAiOverlayOpen && (
                        <motion.div
                          initial={{ x: "100%" }}
                          animate={{ x: "0%" }}
                          exit={{ x: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 220 }}
                          className="absolute inset-y-0 right-0 w-full max-w-[480px] bg-[#FAF5EB] border-l border-[#eae3d2] shadow-2xl z-40 p-5 flex flex-col justify-between text-left overflow-y-auto"
                        >
                          <AiCaptionAssistant 
                            isOverlay={true} 
                            onClose={() => setIsAiOverlayOpen(false)} 
                            onUseCaption={handleUseCaption} 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                </div>

                {/* Mobile Responsive Stack Carousel Helper: switches preview slide */}
                <div className="block lg:hidden pt-4 bg-white border border-[#eae3d2] p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-[#042F1A] mb-2">
                    <span>📱 Swipeable Previews Carousel</span>
                    <span className="text-[9px] text-[#117644] uppercase font-mono">Mobile View</span>
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <button 
                      onClick={() => {
                        const idx = selectedPlatforms.indexOf(activePreviewTab);
                        if (idx > 0) setActivePreviewTab(selectedPlatforms[idx - 1]);
                      }}
                      disabled={selectedPlatforms.indexOf(activePreviewTab) <= 0}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-[#117644] uppercase tracking-wider">{activePreviewTab} Mockup Active</span>
                    <button 
                      onClick={() => {
                        const idx = selectedPlatforms.indexOf(activePreviewTab);
                        if (idx < selectedPlatforms.length - 1) setActivePreviewTab(selectedPlatforms[idx + 1]);
                      }}
                      disabled={selectedPlatforms.indexOf(activePreviewTab) >= selectedPlatforms.length - 1}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fully Immersive Dynamic Publish Celebration Modal */}
                <AnimatePresence>
                  {showPublishSuccessModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-999 p-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#FAF5EB] max-w-xl w-full border-2 border-[#117644] rounded-3xl p-6 shadow-2xl relative text-left space-y-5 flex flex-col justify-between"
                      >
                        <div className="text-center space-y-2 pb-2">
                          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl shadow-md">
                            🚀
                          </div>
                          <h3 className="font-serif text-2xl font-black text-[#042F1A]">Omni-Channel Release Successful!</h3>
                          <p className="text-xs text-[#042F1A]/60">Your brand payload post has been securely written to social pipelines.</p>
                        </div>

                        <div className="space-y-2.5">
                          <span className="block font-mono text-[9px] uppercase font-black text-[#117644] tracking-widest">Broadcast Distribution logs:</span>
                          <div className="bg-white/80 border border-[#eae3d2] p-4 rounded-2xl divide-y space-y-2 divide-[#FAF6EE] text-[11px] leading-relaxed max-h-56 overflow-y-auto">
                            {selectedPlatforms.map(pKey => (
                              <div key={pKey} className="flex justify-between items-center py-1.5 first:pt-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-800">{pKey} Channel</span>
                                </div>
                                <span className="font-mono text-[9px] text-[#117644] font-black bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">✓ DISPATCHED LIVE</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedPlatforms(["instagram", "tiktok", "linkedin", "facebook"]);
                              setPlatformCaption("");
                              setShowPublishSuccessModal(false);
                            }}
                            className="px-4 py-2 border border-[#eae3d2] hover:bg-neutral-50 rounded-full text-[10.5px] uppercase tracking-wider font-extrabold text-[#042F1A] transition-colors"
                          >
                            Compose New
                          </button>
                          <button
                            onClick={() => setShowPublishSuccessModal(false)}
                            className="px-5 py-2.5 bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] rounded-full text-[10.5px] uppercase tracking-widest font-black transition-colors"
                          >
                            Close Overlay
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* =============== TAB: CALENDAR =============== */}
            {activeTab === "calendar" && (
              <motion.div
                key="calendar-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
                style={{
                  "--primary-color": calendarTheme.primary,
                  "--secondary-color": calendarTheme.secondary,
                  "--bg-color": calendarTheme.bg,
                  "--text-color": calendarTheme.text,
                  "--card-bg": calendarTheme.cardBg,
                  "--border-color": calendarTheme.border,
                } as React.CSSProperties}
              >
                {/* Visual Identity Header: Top Search & Utilities Bar (from the image) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#FAF5EB]/40 border border-[#eae3d2] p-3 rounded-2xl md:rounded-full shadow-sm">
                  {/* Search bar pill */}
                  <div className="flex items-center gap-2.5 bg-white border border-[#eae3d2] rounded-full px-4 py-1.5 w-full md:max-w-xl shadow-2xs">
                    <div className="bg-pink-100 text-pink-600 p-1.5 rounded-full flex items-center justify-center">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="bg-transparent border-none text-xs text-[#042F1A] font-semibold focus:outline-hidden placeholder:text-neutral-400 w-full"
                    />
                    {/* Visual dashed filter capsules matching image */}
                    <div className="hidden lg:flex items-center gap-2 border-l border-dashed border-[#eae3d2] pl-3 text-[10px] font-mono text-neutral-400">
                      <span className="font-bold shrink-0">In:</span>
                      <button 
                        onClick={() => { setSearchQuery("Campaigns"); confetti({ particleCount: 15 }); }}
                        className="border border-dashed border-neutral-300 px-2 py-0.5 rounded-full hover:bg-neutral-50 font-bold hover:text-[#042F1A] transition-all"
                      >
                        Campaigns
                      </button>
                      <button 
                        onClick={() => { setSearchQuery("Creative Assets"); confetti({ particleCount: 15 }); }}
                        className="border border-dashed border-neutral-300 px-2 py-0.5 rounded-full hover:bg-neutral-50 font-bold hover:text-[#042F1A] transition-all"
                      >
                        Assets
                      </button>
                      <button 
                        onClick={() => { setSearchQuery("Drafts"); confetti({ particleCount: 15 }); }}
                        className="border border-dashed border-neutral-300 px-2 py-0.5 rounded-full hover:bg-[#FAF5EB] font-bold hover:text-[#042F1A] transition-all"
                      >
                        Drafts
                      </button>
                    </div>
                  </div>

                  {/* Right side utilities cluster: user profile card, notification bell, settings (from the image) */}
                  <div className="flex items-center gap-3">
                    {/* Active platforms count badge helper */}
                    <div className="relative">
                      <button
                        onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                        className="px-3.5 py-1.5 bg-white border border-[#eae3d2] rounded-full text-[9px] uppercase tracking-wider font-extrabold text-[#042F1A] flex items-center gap-1.5 shadow-2xs hover:border-[#117644] cursor-pointer"
                      >
                        <Filter className="w-3 h-3 text-[#117644]" />
                        Channels ({calendarPlatformFilter.length})
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      <AnimatePresence>
                        {isPlatformDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsPlatformDropdownOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-56 bg-[#FAF5EB] border-2 border-[#042F1A] rounded-2xl p-3.5 shadow-2xl z-20 space-y-2 text-left"
                            >
                              <div className="flex items-center justify-between border-b pb-1">
                                <span className="text-[9px] uppercase font-black tracking-widest text-[#042F1A]">Social Filters</span>
                                <button 
                                  onClick={() => setCalendarPlatformFilter(["instagram", "tiktok", "linkedin", "facebook", "youtube", "pinterest"])}
                                  className="text-[9px] hover:underline text-[#117644] font-bold"
                                >
                                  Reset All
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {[
                                  { id: "instagram", name: "Instagram", hex: "#E1306C" },
                                  { id: "tiktok", name: "TikTok", hex: "#000000" },
                                  { id: "linkedin", name: "LinkedIn", hex: "#0077B5" },
                                  { id: "facebook", name: "Facebook", hex: "#3b5998" },
                                  { id: "youtube", name: "YouTube", hex: "#FF0000" },
                                  { id: "pinterest", name: "Pinterest", hex: "#BD081C" },
                                ].map((item) => (
                                  <label key={item.id} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-white/50 cursor-pointer text-xs font-semibold text-[#042F1A]">
                                    <input
                                      type="checkbox"
                                      checked={calendarPlatformFilter.includes(item.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCalendarPlatformFilter(prev => [...prev, item.id]);
                                        } else {
                                          setCalendarPlatformFilter(prev => prev.filter(p => p !== item.id));
                                        }
                                      }}
                                      className="rounded border-[#eae3d2] text-[#117644] focus:ring-[#117644]"
                                    />
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.hex }} />
                                    <span>{item.name}</span>
                                  </label>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dark rounded badge with icon triggers matching image */}
                    <div className="flex items-center gap-1.5 bg-black text-white p-1 rounded-full shadow-md">
                      <div className="w-8 h-8 rounded-full bg-[#117644] text-[#FAF6EE] flex items-center justify-center font-extrabold text-xs shadow-inner cursor-pointer" title="Self Workspace">
                        {currentWorkspace ? currentWorkspace.substring(0,2).toUpperCase() : "SG"}
                      </div>
                      <button 
                        onClick={() => {
                          setCalendarToast({ message: "No unread workspace alerts currently.", originalSlot: null });
                          confetti({ particleCount: 10 });
                        }}
                        className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Alerts"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab("settings");
                        }}
                        className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Workspace Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Part 2: Main greeting / Title section & Add Event Action Buttons (from the image) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-sans font-extrabold text-[#042F1A] tracking-tight leading-none mt-1">
                      {currentWorkspace === "Postrick Main Brand" ? "Stay up to date, Postrick" : `Stay up to date, ${currentWorkspace}`}
                    </h1>
                    <p className="text-xs text-[#042F1A]/60 font-medium font-serif italic mt-1 bg-neutral-100/50 inline-block px-3 py-0.5 rounded-full">
                      Showing real-time cross-platform content delivery queue
                    </p>
                  </div>

                  {/* Add event & actions (from the image) */}
                  <div className="flex items-center gap-2.5 self-end lg:self-auto">
                    <button
                      onClick={() => {
                        setNewSlotDay("Mon");
                        setNewSlotHour("12:00");
                        setNewSlotText("");
                        setNewSlotPlatforms(["instagram"]);
                        setNewSlotImage("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80");
                        const dateOfMon = getCellDateStringAtRoot("Mon", currentWeekOffset);
                        setNewSlotDate(dateOfMon);
                        setIsQuickPostOpen(true);
                      }}
                      className="px-6 py-2.5 bg-black hover:bg-[#117644] text-[#FAF6EE] rounded-full text-xs uppercase tracking-widest font-black flex items-center gap-1.5 hover:scale-103 active:scale-97 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C5E729]" />
                      Add event
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentWeekOffset(0);
                        confetti({ particleCount: 30 });
                        setCalendarToast({ message: "Workspace queue sync completed successfully.", originalSlot: null });
                      }}
                      className="p-2.5 border border-[#eae3d2] bg-white rounded-full hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all text-[#042F1A] shadow-2xs"
                      title="Sync Channel Agenda"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => {
                        setActiveTab("composer");
                        confetti({ particleCount: 15 });
                      }}
                      className="p-2.5 border border-[#eae3d2] bg-white rounded-full hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all text-[#042F1A] shadow-2xs"
                      title="Open Workspace Composer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Part 3: Sub-header Row. Date-range Dropdown Pill & Segmented Toggles (from the image) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-b border-[#eae3d2]/60 py-3 text-left">
                  {/* Left Column: Black Capsule dropdown showing evaluated dates */}
                  {(() => {
                    // Helper to compute beautiful date ranges
                    const getWeekRangeLabel = (offset: number) => {
                      const base = new Date("2026-05-11T00:00:00");
                      base.setDate(base.getDate() + (offset * 7));
                      const startDay = base.getDate();
                      const startMonthLocal = base.toLocaleDateString("en-US", { month: "short" });
                      
                      const endBase = new Date(base);
                      endBase.setDate(endBase.getDate() + 6);
                      const endDay = endBase.getDate();
                      const endMonthLocal = endBase.toLocaleDateString("en-US", { month: "short" });
                      
                      const formatNum = (d: number) => String(d).padStart(2, "0");
                      const startMonthNum = formatNum(base.getMonth() + 1);
                      const endMonthNum = formatNum(endBase.getMonth() + 1);
                      
                      return `${startMonthLocal} ${formatNum(startDay)}/${startMonthNum} - ${formatNum(endDay)}/${endMonthNum}`;
                    };

                    return (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCurrentWeekOffset(prev => prev + 1);
                            confetti({ particleCount: 10 });
                          }}
                          className="bg-black text-[#FAF6EE] px-4.5 py-2 rounded-full text-xs font-bold tracking-wide flex items-center justify-between gap-3 shadow-md hover:bg-neutral-800 transition-all cursor-pointer"
                        >
                          <span>{getWeekRangeLabel(currentWeekOffset)}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                        </button>
                        
                        {currentWeekOffset !== 0 && (
                          <button
                            onClick={() => setCurrentWeekOffset(0)}
                            className="text-[9px] uppercase tracking-widest font-mono text-[#117644] hover:underline font-extrabold px-1"
                          >
                            Reset to Current
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Right Column: View mode segmented outline selectors (Today, Week, Month/List in visual group) */}
                  <div className="flex items-center gap-2 bg-neutral-100/70 p-1 rounded-full border border-neutral-200">
                    <button
                      onClick={() => {
                        setCurrentWeekOffset(0);
                        setCalendarView("week");
                        confetti({ particleCount: 15 });
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all tracking-wide ${
                        currentWeekOffset === 0 && calendarView === "week"
                          ? "bg-white text-black shadow-2xs font-extrabold"
                          : "text-neutral-500 hover:text-black font-semibold"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCalendarView("week")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all tracking-wide ${
                        calendarView === "week"
                          ? "bg-black text-white shadow-xs font-extrabold animate-fade-in"
                          : "text-neutral-500 hover:text-black font-semibold"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setCalendarView("list")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all tracking-wide ${
                        calendarView === "list"
                          ? "bg-black text-white shadow-xs font-extrabold"
                          : "text-neutral-500 hover:text-black font-semibold"
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>

                {/* Part 4: Main Calendar Grid views */}
                {calendarView === "week" && (() => {
                  const daysKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  const hours = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
                  
                  const getDayLabelAndDate = (day: string, offset: number) => {
                    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
                    const base = new Date("2026-05-11T00:00:00");
                    base.setDate(base.getDate() + idxs[day] + (offset * 7));
                    return base.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  };

                  const getDayNumberOnly = (day: string, offset: number) => {
                    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
                    const base = new Date("2026-05-11T00:00:00");
                    base.setDate(base.getDate() + idxs[day] + (offset * 7));
                    const dayNum = String(base.getDate()).padStart(2, "0");
                    const monthNum = String(base.getMonth() + 1).padStart(2, "0");
                    return `${dayNum}/${monthNum}`;
                  };

                  const getCellDateString = (day: string, offset: number) => {
                    const idxs: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
                    const base = new Date("2026-05-11T00:00:00");
                    base.setDate(base.getDate() + idxs[day] + (offset * 7));
                    const year = base.getFullYear();
                    const month = String(base.getMonth() + 1).padStart(2, "0");
                    const dateVal = String(base.getDate()).padStart(2, "0");
                    return `${year}-${month}-${dateVal}`;
                  };

                  const getCardColorTheme = (item: any) => {
                    const preset = item.colorPreset;
                    if (preset === "pink") {
                      return {
                        bg: "bg-[#FDF2F4]",
                        border: "border-pink-200/60",
                        text: "text-[#9E2B5A]",
                        borderLeft: "border-l-4 border-l-[#E1528A]",
                        bulletBg: "bg-[#E1528A]"
                      };
                    }
                    if (preset === "blue") {
                      return {
                        bg: "bg-[#EEF6FF]",
                        border: "border-blue-200/60",
                        text: "text-[#1C517C]",
                        borderLeft: "border-l-4 border-l-[#57A1E3]",
                        bulletBg: "bg-[#57A1E3]"
                      };
                    }
                    if (preset === "yellow") {
                      return {
                        bg: "bg-[#FFF9E6]",
                        border: "border-amber-200/60",
                        text: "text-[#825B00]",
                        borderLeft: "border-l-4 border-l-[#F5C242]",
                        bulletBg: "bg-[#F5C242]"
                      };
                    }
                    if (preset === "purple") {
                      return {
                        bg: "bg-[#FAF2FF]",
                        border: "border-purple-200/60",
                        text: "text-[#6A1B9A]",
                        borderLeft: "border-l-4 border-l-[#A855F7]",
                        bulletBg: "bg-[#A855F7]"
                      };
                    }
                    // Default/Gray to clean off-white
                    return {
                      bg: "bg-white",
                      border: "border-[#eae3d2]/60",
                      text: "text-[#042F1A]",
                      borderLeft: "border-l-4 border-l-[#042F1A]",
                      bulletBg: "bg-[#117644]"
                    };
                  };

                  const weekDaysList = [
                    { key: "Mon", label: "MONDAY", dateLabel: getDayNumberOnly("Mon", currentWeekOffset), fullDay: "Monday" },
                    { key: "Tue", label: "TUESDAY", dateLabel: getDayNumberOnly("Tue", currentWeekOffset), fullDay: "Tuesday" },
                    { key: "Wed", label: "WEDNESDAY", dateLabel: getDayNumberOnly("Wed", currentWeekOffset), fullDay: "Wednesday" },
                    { key: "Thu", label: "THU", dateLabel: getDayNumberOnly("Thu", currentWeekOffset), fullDay: "Thursday" },
                    { key: "Fri", label: "FR", dateLabel: getDayNumberOnly("Fri", currentWeekOffset), fullDay: "Friday" },
                    { key: "Sat", label: "SA", dateLabel: getDayNumberOnly("Sat", currentWeekOffset), fullDay: "Saturday" },
                    { key: "Sun", label: "SU", dateLabel: getDayNumberOnly("Sun", currentWeekOffset), fullDay: "Sunday" },
                  ];

                  const isTodayCol = (dayKey: string) => {
                    // Let's have a beautiful default active simulated day to align with Thu highlights from screenshot
                    return dayKey === "Thu" && currentWeekOffset === 0;
                  };

                  const bestTimes = [
                    { day: "Mon", hour: "09:00", platform: "linkedin" },
                    { day: "Tue", hour: "12:00", platform: "instagram" },
                    { day: "Wed", hour: "18:00", platform: "linkedin" },
                    { day: "Thu", hour: "15:00", platform: "tiktok" },
                    { day: "Fri", hour: "21:00", platform: "youtube" },
                    { day: "Sat", hour: "12:00", platform: "pinterest" },
                    { day: "Sun", hour: "18:00", platform: "instagram" },
                  ];

                  // Color mapping details to pastel finishes matching image (excluding raw neon colors)
                  const platformPastels: Record<string, { bg: string; border: string; text: string; iconBg: string; activeColor: string }> = {
                    instagram: { 
                      bg: "bg-[#FDF2F4]", // soft pastel pink
                      border: "border-pink-200/60", 
                      text: "text-pink-600",
                      iconBg: "bg-pink-100 text-pink-600",
                      activeColor: "bg-pink-600"
                    },
                    tiktok: { 
                      bg: "bg-neutral-50", // clean soft gray
                      border: "border-neutral-200", 
                      text: "text-neutral-800",
                      iconBg: "bg-black text-white",
                      activeColor: "bg-neutral-800"
                    },
                    linkedin: { 
                      bg: "bg-[#EEF2F6]", // soft corporate sky blue
                      border: "border-blue-200", 
                      text: "text-[#0077B5]",
                      iconBg: "bg-[#0077B5]/10 text-[#0077B5]",
                      activeColor: "bg-[#0077B5]"
                    },
                    facebook: { 
                      bg: "bg-[#EDF2FA]", // soft azure
                      border: "border-blue-100", 
                      text: "text-[#3b5998]",
                      iconBg: "bg-[#3b5998]/10 text-[#3b5998]",
                      activeColor: "bg-[#3b5998]"
                    },
                    youtube: { 
                      bg: "bg-[#FEF2F2]", // soft scarlet red
                      border: "border-red-100", 
                      text: "text-red-600",
                      iconBg: "bg-red-100 text-red-600",
                      activeColor: "bg-red-600"
                    },
                    pinterest: { 
                      bg: "bg-[#FFF1F2]", // soft peach rose
                      border: "border-rose-100", 
                      text: "text-rose-600",
                      iconBg: "bg-rose-100 text-rose-500",
                      activeColor: "bg-rose-500"
                    }
                  };

                  return (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      {/* Left: Calendar Week Grid Container */}
                      <div className="flex-1 bg-[#FAF5EB]/25 border border-[#eae3d2] rounded-[40px] p-5 md:p-8 shadow-xs relative text-left select-none w-full">
                      
                      {/* Mobile Column Select Indicator: Days dots/pills layout */}
                      <div className="md:hidden flex items-center justify-between pb-3.5 mb-4 border-b border-[#eae3d2] border-dashed">
                        <div className="flex gap-1 overflow-x-auto py-1 w-full text-center">
                          {weekDaysList.map((day) => {
                            const isChose = activeMobileDay === day.key;
                            const tdy = isTodayCol(day.key);
                            
                            // Find scheduled platforms for this date
                            const targetCellDateStr = getCellDateString(day.key, currentWeekOffset);
                            const platformsForDay = Array.from(new Set(
                              scheduledSlots
                                .filter(s => s.day === day.key && (!s.date || s.date === targetCellDateStr))
                                .flatMap(s => s.platforms || [s.platform || "instagram"])
                            ));

                            return (
                              <button
                                key={day.key}
                                onClick={() => setActiveMobileDay(day.key)}
                                className={`px-2 py-2 rounded-2xl text-[10px] uppercase font-bold flex-1 min-w-[54px] transition-all relative flex flex-col items-center justify-between ${
                                  isChose 
                                    ? "bg-black text-white font-sans tracking-tight scale-102 shadow-sm" 
                                    : "bg-neutral-50 border border-neutral-100 text-[#042F1A]/70 hover:bg-neutral-100"
                                }`}
                              >
                                <div className="text-[10px] font-sans font-black">{day.label}</div>
                                <div className="text-[8px] font-mono opacity-85 mt-0.5">{day.dateLabel}</div>
                                
                                {/* Platform Dots Indicator */}
                                {platformsForDay.length > 0 && (
                                  <div className="flex gap-0.5 mt-1 justify-center items-center">
                                    {platformsForDay.map(plt => {
                                      let dotColor = "bg-pink-500";
                                      if (plt === "instagram") dotColor = "bg-pink-500";
                                      if (plt === "tiktok") dotColor = "bg-neutral-950";
                                      if (plt === "linkedin") dotColor = "bg-blue-500";
                                      if (plt === "facebook") dotColor = "bg-blue-600";
                                      if (plt === "youtube") dotColor = "bg-red-500";
                                      if (plt === "pinterest") dotColor = "bg-rose-500";
                                      return (
                                        <span key={plt} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                      );
                                    })}
                                  </div>
                                )}

                                {tdy && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Week headers layout row: Grid of 8 Columns on desktop (Spacer column + 7 Days) */}
                      <div className="hidden md:grid grid-cols-[70px_repeat(7,1fr)] gap-4 mb-5 border-b border-[#eae3d2]/60 pb-4">
                        {/* Column 1 spacer / Week Badge (matches image layout: "W 24" representation) */}
                        <div className="flex flex-col items-center justify-center py-2.5 bg-[#FAF5EB]/80 rounded-[22px] border border-[#eae3d2]/60 text-center select-none shadow-3xs w-[68px]">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#042F1A]/50 font-black leading-none">W</span>
                          <span className="font-sans text-xs font-black text-[#042F1A]/80 leading-none mt-1">24</span>
                        </div>

                        {/* Columns 2..8: Days of the week capsules */}
                        {weekDaysList.map((day) => {
                          const tdy = isTodayCol(day.key);
                          const isSun = day.key === "Sun";
                          const isChoseActive = activeMobileDay === day.key;
                          
                          // Find scheduled platforms for this date
                          const targetCellDateStr = getCellDateString(day.key, currentWeekOffset);
                          const platformsForDay = Array.from(new Set(
                            scheduledSlots
                              .filter(s => s.day === day.key && (!s.date || s.date === targetCellDateStr))
                              .flatMap(s => s.platforms || [s.platform || "instagram"])
                          ));

                          return (
                            <button
                              key={day.key}
                              onClick={() => {
                                setActiveMobileDay(day.key);
                                confetti({ particleCount: 12 });
                              }}
                              className={`flex flex-col items-center justify-center py-2.5 rounded-[22px] border transition-all text-center h-auto min-h-[76px] ${
                                tdy 
                                  ? "bg-[#121212] border-[#121212] text-white font-extrabold shadow-md scale-102" 
                                  : "bg-white border-[#eae3d2]/60 text-[#042F1A]/70 hover:bg-white hover:border-[#117644]"
                              }`}
                            >
                              <span className={`font-sans text-[10px] font-black uppercase tracking-widest leading-none ${
                                tdy ? "text-[#C5E729]" : isSun ? "text-[#D57BBE]" : "text-[#042F1A]/50"
                              }`}>
                                {day.label}
                              </span>
                              <span className={`text-[12px] font-mono font-black tracking-tight mt-1 leading-none ${
                                tdy ? "text-white" : isSun ? "text-[#D57BBE]" : "text-[#042F1A]"
                              }`}>
                                {day.dateLabel}
                              </span>

                              {/* Scheduled Platform Icons */}
                              {platformsForDay.length > 0 && (
                                <div className="flex gap-1 mt-1.5 flex-wrap justify-center items-center">
                                  {platformsForDay.map(plt => {
                                    if (plt === "instagram") return (
                                      <span key={plt} className="p-0.5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center shadow-3xs" title="Instagram">
                                        <Instagram className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    if (plt === "tiktok") return (
                                      <span key={plt} className="p-0.5 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-3xs" title="TikTok">
                                        <TikTokIcon className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    if (plt === "linkedin") return (
                                      <span key={plt} className="p-0.5 bg-blue-100 text-[#0077B5] rounded-full flex items-center justify-center shadow-3xs" title="LinkedIn">
                                        <Linkedin className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    if (plt === "facebook") return (
                                      <span key={plt} className="p-0.5 bg-blue-100 text-[#3b5998] rounded-full flex items-center justify-center shadow-3xs" title="Facebook">
                                        <Facebook className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    if (plt === "youtube") return (
                                      <span key={plt} className="p-0.5 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-3xs" title="YouTube">
                                        <Youtube className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    if (plt === "pinterest") return (
                                      <span key={plt} className="p-0.5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-3xs" title="Pinterest">
                                        <PinterestIcon className="w-2.5 h-2.5" />
                                      </span>
                                    );
                                    return null;
                                  })}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Main Calendar Body Workspace */}
                      <div className="relative space-y-5">
                        {/* Horizontal "Current Time Focus" indicator line (dashed line with left indicator badge) */}
                        <div className="absolute top-[38%] left-0 w-full z-10 pointer-events-none select-none">
                          <div className="relative flex items-center w-full">
                            {/* Dashboard left axis pink time pill indicator label */}
                            <div className="hidden md:flex absolute -left-12 bg-pink-500 text-white font-mono text-[9.5px] font-black px-2 py-0.8 rounded-full shadow-md animate-pulse">
                              07:21
                            </div>
                            {/* Dashed timeline bar */}
                            <div className="w-full border-t border-dashed border-pink-500" />
                          </div>
                        </div>

                        {hours.map((hour) => (
                          <div key={hour} className="grid grid-cols-1 md:grid-cols-[70px_repeat(7,1fr)] gap-4 items-center">
                            
                            {/* Left Col: Horizontal Row hour labels */}
                            <div className="hidden md:flex flex-col justify-center items-start text-[#117644] select-none font-mono text-[11px] font-bold">
                              <span>{hour}</span>
                            </div>

                            {/* Row Cells dropzone grids */}
                            {weekDaysList.map((day) => {
                              const isHiding = activeMobileDay !== day.key;
                              const tdy = isTodayCol(day.key);

                              const targetDateStr = getCellDateString(day.key, currentWeekOffset);
                              const cellItems = scheduledSlots.filter(
                                s => s.day === day.key && 
                                s.hour === hour && 
                                (!s.date || s.date === targetDateStr) &&
                                (s.platforms || [s.platform || "instagram"]).some(p => calendarPlatformFilter.includes(p))
                              );

                              const suggestedBest = bestTimes.find(
                                b => b.day === day.key && 
                                b.hour === hour && 
                                calendarPlatformFilter.includes(b.platform)
                              );

                              const dragHighlight = dragOverCell?.day === day.key && dragOverCell?.hour === hour;
                              const draggedItem = draggedId 
                                ? (scheduledSlots.find(s => s.id === draggedId) || draftPool.find(d => d.id === draggedId)) 
                                : null;

                              return (
                                <div
                                  key={`${day.key}-${hour}`}
                                  onDragOver={(e) => handleDragOver(e, day.key, hour)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, day.key, hour)}
                                  className={`relative min-h-[170px] rounded-[30px] p-3.5 border border-dashed transition-all duration-300 flex flex-col justify-between ${
                                    isHiding ? "hidden md:flex" : "flex"
                                  } ${
                                    dragHighlight 
                                      ? "bg-[#117644]/5 border-[#117644] ring-2 ring-dashed ring-[#117644]/20 scale-102" 
                                      : tdy 
                                        ? "bg-white border-[#eae3d2] hover:bg-neutral-50/50" 
                                        : "bg-white/40 border-[#eae3d2]/70 hover:bg-white hover:border-[#117644]/40"
                                  }`}
                                >
                                  {/* Grid Cell Header Label */}
                                  <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono select-none">
                                    <span className="font-extrabold text-[#117644]">{hour}</span>
                                    <span className="md:hidden font-black text-neutral-500 uppercase">{day.fullDay}</span>
                                  </div>

                                  {/* Best scheduling guidelines sparkles */}
                                  {suggestedBest && cellItems.length === 0 && !dragHighlight && (
                                    <div className="p-2.5 bg-amber-50/50 border border-dashed border-amber-300/60 rounded-[18px] flex items-center justify-center gap-1 text-[8.5px] text-amber-800 font-mono font-bold animate-pulse my-auto">
                                      <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                      <span>Optimal Slot ({suggestedBest.platform})</span>
                                    </div>
                                  )}

                                  {/* Hover plus quick add trigger */}
                                  {cellItems.length === 0 && !dragHighlight && (
                                    <button
                                      onClick={() => {
                                        setNewSlotDay(day.key);
                                        setNewSlotHour(hour);
                                        setNewSlotText("");
                                        setNewSlotPlatforms(["instagram"]);
                                        const calculatedDateStr = getCellDateStringAtRoot(day.key, currentWeekOffset);
                                        setNewSlotDate(calculatedDateStr);
                                        setIsQuickPostOpen(true);
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 flex items-center justify-center bg-black/[0.02] transition-all rounded-[30px] cursor-pointer"
                                    >
                                      <div className="p-2 bg-black border shadow-md text-white rounded-full scale-90 hover:scale-100 transition-all">
                                        <Plus className="w-4 h-4 text-[#C5E729]" />
                                      </div>
                                    </button>
                                  )}

                                  {/* Redefined Premium Cards featuring rounded-3xl, overlapping avatars, Join triggers */}
                                  {cellItems.length > 0 && (
                                    <div className="space-y-2 mt-2 relative flex-1 flex flex-col justify-end w-full">
                                      {cellItems.length > 2 ? (
                                        <>
                                          {cellItems.slice(0, 2).map((item, idx) => (
                                            <motion.div
                                              key={item.id}
                                              layout
                                              layoutId={`card-${item.id}`}
                                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                              draggable
                                              onDragStart={(e: any) => handleDragStart(e, item.id)}
                                              onClick={() => setSelectedCalendarPostId(item.id)}
                                              style={{ 
                                                transform: `translateY(${idx * 7}px) scale(${1 - idx * 0.05})`, 
                                                zIndex: 10 - idx 
                                              }}
                                              className="p-3 rounded-2xl border border-neutral-200/90 bg-white shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing border-l-4 border-l-[#117644] text-[10px] space-y-1.5 transition-all text-left"
                                            >
                                              <p className="font-semibold text-[#042F1A] truncate">{item.text}</p>
                                              <div className="flex justify-between items-center text-[8px] opacity-75">
                                                <span>Overlapping Stack</span>
                                                <span className="font-mono bg-neutral-50 px-1 py-0.2 rounded font-bold uppercase">{item.platform}</span>
                                              </div>
                                            </motion.div>
                                          ))}
                                          <div 
                                            onClick={() => {
                                              setCalendarView("list");
                                              confetti({ particleCount: 15 });
                                            }}
                                            className="text-center py-1.5 bg-[#FAF5EB]/70 border border-dashed rounded-xl text-[8.5px] font-black text-[#117644] cursor-pointer hover:bg-neutral-50 uppercase tracking-widest mt-2 hover:border-[#042F1A] transition-all"
                                          >
                                            + {cellItems.length - 2} more (Expand)
                                          </div>
                                        </>
                                      ) : (
                                        cellItems.map((item) => {
                                          const isDragSource = draggedId === item.id;
                                          const clr = platformPastels[item.platform] || { 
                                            bg: "bg-slate-50", 
                                            border: "border-slate-200", 
                                            text: "text-slate-800",
                                            iconBg: "bg-slate-200 text-slate-700",
                                            activeColor: "bg-slate-600"
                                          };
                                          
                                          // Small layout helper files matching elements in clinical dashboard
                                                                   const themeColor = getCardColorTheme(item);
                                          
                                          // Small layout helper files matching elements in clinical dashboard
                                          return (
                                            <motion.div
                                              key={item.id}
                                              layout
                                              layoutId={`card-${item.id}`}
                                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                              draggable
                                              onDragStart={(e: any) => handleDragStart(e, item.id)}
                                              onClick={() => setSelectedCalendarPostId(item.id)}
                                              whileHover={{ scale: 1.02 }}
                                              className={`rounded-[26px] p-4 border ${themeColor.border} ${themeColor.bg} ${themeColor.borderLeft} transition-all cursor-grab active:cursor-grabbing shadow-xs hover:shadow-md ${isDragSource ? "opacity-35" : ""}`}
                                            >
                                              <div className="space-y-3">
                                                {/* Card Header (Top Section: colored circle icon & mock attachment indicators) */}
                                                <div className="flex items-center justify-between gap-1.5">
                                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${clr.iconBg}`}>
                                                    <RenderPlatformIcon platform={item.platform} className="w-4 h-4" />
                                                  </div>
                                                  
                                                  {/* Optional tag badge for custom categories */}
                                                  {item.tagBadge && (
                                                    <span className="text-[8px] uppercase tracking-wider bg-[#C1F43F] text-[#042F1A] px-2 py-0.5 rounded-full font-black">
                                                      {item.tagBadge}
                                                    </span>
                                                  )}

                                                  {/* Document / PDF attachments resembling 'soil_report.pdf' from image */}
                                                  <div className="flex items-center gap-1 text-[8.5px] text-neutral-500 font-mono uppercase bg-white/70 px-2 py-0.5 rounded-full border border-neutral-150 max-w-[120px] truncate">
                                                    <FileText className="w-2.5 h-2.5 flex-shrink-0 text-neutral-400" />
                                                    <span className="truncate font-semibold">{item.attachmentName || "agenda.pdf"}</span>
                                                  </div>
                                                </div>

                                                {/* Text / Caption Area (represented as bold text title) */}
                                                <div>
                                                  <h3 className={`font-sans font-extrabold text-[12px] tracking-tight leading-snug ${themeColor.text}`}>
                                                    {item.text}
                                                  </h3>
                                                  
                                                  {item.isLargeCard && item.description && (
                                                    <p className="text-[10px] text-[#042F1A]/70 font-sans leading-relaxed tracking-tight mt-1.5 line-clamp-3">
                                                      {item.description}
                                                    </p>
                                                  )}

                                                  {item.isLargeCard && item.mediaUrl && (
                                                    <div className="relative w-full h-[110px] rounded-[18px] overflow-hidden my-3 border border-[#eae3d2]/60 shadow-3xs">
                                                      <img 
                                                        src={item.mediaUrl} 
                                                        alt={item.text} 
                                                        className="w-full h-full object-cover" 
                                                        referrerPolicy="no-referrer"
                                                      />
                                                    </div>
                                                  )}

                                                  <div className="flex items-center gap-1.5 mt-1.5">
                                                    {/* Location / Section Subtitle equivalent: Social Channel Details */}
                                                    <span className="font-serif italic text-[10px] text-[#042F1A]/60 block truncate max-w-[125px]">
                                                      {item.subtitle || `West camp, Room 312`}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-300">•</span>
                                                    <span className="font-mono font-bold text-[9px] text-[#117644]">
                                                      {hour} - {(() => {
                                                        const [h, m] = hour.split(":");
                                                        if (m === "00") return `${h}:30`;
                                                        return `${String(parseInt(h) + 1).padStart(2, "0")}:00`;
                                                      })()}
                                                    </span>
                                                  </div>
                                                </div>

                                                {/* Card Lower Deck: stacked initial participants & 'Join' button trigger */}
                                                <div className="flex flex-col gap-2 border-t border-[#eae3d2]/30 pt-3 mt-1.5">
                                                  
                                                  <div className="flex items-center justify-between">
                                                    {/* Interlocking profile stacks styled beautifully (from the image) */}
                                                    <div className="flex -space-x-1.5 overflow-hidden">
                                                      {[
                                                        { i: "TY", bg: "bg-[#C5E729] text-[#042F1A] font-extrabold" },
                                                        { i: "AB", bg: "bg-blue-100 text-blue-800" },
                                                        { i: "NR", bg: "bg-pink-100 text-pink-800" },
                                                        { i: "SS", bg: "bg-amber-100 text-amber-800" },
                                                        { i: "+3", bg: "bg-neutral-800 text-white font-black text-[7.5px]" },
                                                      ].slice(0, (item.platforms || []).length + 2).map((av, index) => (
                                                        <div 
                                                          key={index} 
                                                          className={`w-5.5 h-5.5 rounded-full ${av.bg} flex items-center justify-center font-black text-[8px] ring-1.5 ring-white shadow-2xs cursor-pointer`}
                                                          title={`Collaborator initial: ${av.i}`}
                                                        >
                                                          {av.i}
                                                        </div>
                                                      ))}
                                                    </div>

                                                    {/* Status pills or standard Join trigger */}
                                                    {!item.isLargeCard && (
                                                      <div className="flex items-center gap-1.5">
                                                        {item.status === "publishing" ? (
                                                          <span className="bg-pink-100 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full text-[8.5px] uppercase font-black animate-pulse">
                                                            In progress..
                                                          </span>
                                                        ) : (
                                                          <button 
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              confetti({ particleCount: 20 });
                                                              setCalendarToast({ message: `Accessing online meeting for: ${item.text}`, originalSlot: null });
                                                            }}
                                                            className="px-3.5 py-1 bg-white hover:bg-neutral-100 text-slate-800 border border-[#eae3d2] rounded-full text-[10px] font-bold shadow-3xs cursor-pointer active:scale-95 transition-all text-center font-sans tracking-wide"
                                                          >
                                                            Join
                                                          </button>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Big elegant Join CTA button for the large Thursday events matching the image */}
                                                  {item.isLargeCard && (
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        confetti({ particleCount: 40 });
                                                        setCalendarToast({ message: `Connecting you to ${item.text} webinar stream...`, originalSlot: null });
                                                      }}
                                                      className="w-full py-2 bg-black hover:bg-[#117644] text-[#FAF6EE] rounded-xl text-[10px] font-sans font-black uppercase tracking-wider transition-all shadow-xs mt-1 cursor-pointer active:scale-98"
                                                    >
                                                      Join Live Workshop
                                                    </button>
                                                  )}

                                                </div>
                                              </div>
                                            </motion.div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}

                                  {/* Visual snap indicator preview */}
                                  {dragHighlight && draggedItem && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 0.8, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                      className="rounded-[26px] p-4 border-2 border-dashed border-[#117644] bg-[#117644]/5 flex flex-col gap-3 text-left w-full pointer-events-none mt-2 shadow-2xs z-10"
                                      style={{ borderStyle: "dashed" }}
                                    >
                                      <div className="flex items-center justify-between gap-1.5">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#117644]/20 shadow-3xs">
                                          <RenderPlatformIcon platform={draggedItem.platform} className="w-4 h-4 text-[#117644]" />
                                        </div>
                                        <span className="text-[7.5px] uppercase tracking-wider bg-[#117644]/15 text-[#117644] px-2.5 py-1 rounded-full font-black animate-pulse flex items-center gap-1">
                                          <span className="inline-block w-1 h-1 bg-[#117644] rounded-full animate-ping" />
                                          Snapping Here
                                        </span>
                                      </div>
                                      <div>
                                        <h3 className="font-sans font-extrabold text-[12px] tracking-tight leading-snug text-[#042F1A] line-clamp-2 italic">
                                          &ldquo;{draggedItem.text}&rdquo;
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-2 text-[9px] font-mono font-bold text-[#117644]">
                                          <span>{hour} - {(() => {
                                            const [h, m] = hour.split(":");
                                            if (m === "00") return `${h}:30`;
                                            return `${String(parseInt(h) + 1).padStart(2, "0")}:00`;
                                          })()}</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>

                    </div>
                    
                    {/* Right Side: Sleek Drafts Pool Drawer */}
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropToDraftPool}
                      className={`w-full lg:w-80 bg-white border border-[#eae3d2] rounded-[36px] p-5 transition-all duration-300 flex flex-col justify-between shrink-0 min-h-[500px] hover:border-[#117644]/40 relative ${
                        isDraftPoolOpen ? "" : "lg:w-16"
                      }`}
                    >
                      {isDraftPoolOpen ? (
                        <div className="space-y-4">
                          {/* Drafts Header */}
                          <div className="flex items-center justify-between border-b border-[#eae3d2]/60 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-[#C5E729]/25 text-[#042F1A] rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[#117644]" />
                              </span>
                              <div>
                                <h4 className="font-serif font-black text-xs uppercase tracking-wide text-[#042F1A]">Draft Pool</h4>
                                <p className="text-[8.5px] font-mono text-neutral-400 font-extrabold uppercase">Unscheduled Content</p>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => setIsDraftPoolOpen(false)}
                              className="p-1 px-2.5 bg-neutral-50 hover:bg-neutral-100 text-[#042F1A]/70 text-[9.5px] font-bold rounded-lg uppercase tracking-wider"
                            >
                              Hide
                            </button>
                          </div>

                          <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                            💡 Drag any draft from this tray and drop it directly onto any hourly slot in the weekly grid to schedule it instantly! Or drag scheduled cards back here to unschedule them.
                          </p>

                          {/* Draft List Container */}
                          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                            {draftPool.length === 0 ? (
                              <div className="py-12 border border-dashed border-neutral-200 rounded-3xl text-center flex flex-col items-center justify-center p-4">
                                <Sparkles className="w-5 h-5 text-neutral-300 animate-spin mb-2" />
                                <span className="text-[10.5px] text-neutral-400 font-semibold italic">Draft pool is currently empty!</span>
                                <button
                                  onClick={() => {
                                    setDraftPool([
                                      {
                                        id: "draft-" + Date.now().toString() + "-1",
                                        text: "Foliage companion guides for high density organic workspace vibes! 🌿📈",
                                        platform: "instagram",
                                        mediaUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=400&h=300&q=80"
                                      },
                                      {
                                        id: "draft-" + Date.now().toString() + "-2",
                                        text: "Vertical greenhouse automation retrofits. Scale urban kitchen gardens 5x with micro water sensors.",
                                        platform: "linkedin",
                                        mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&h=300&q=80"
                                      }
                                    ]);
                                    confetti({ particleCount: 15 });
                                  }}
                                  className="mt-3.5 px-3 py-1.5 bg-[#FAF5EB] hover:bg-emerald-50 text-[9px] uppercase tracking-wider font-extrabold text-[#117644] rounded-full border border-[#eae3d2]/60 transition-colors"
                                >
                                  Reset Drafts
                                </button>
                              </div>
                            ) : (
                              draftPool.map((draft) => {
                                const clr = platformPastels[draft.platform] || { 
                                  bg: "bg-slate-50", 
                                  border: "border-slate-200", 
                                  text: "text-slate-800",
                                  iconBg: "bg-slate-200 text-slate-700",
                                  activeColor: "bg-slate-600"
                                };
                                return (
                                  <div
                                    key={draft.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, draft.id)}
                                    className={`rounded-2xl p-3 border cursor-grab active:cursor-grabbing hover:shadow-xs transition-transform hover:-translate-y-0.5 ${clr.bg} ${clr.border} relative group`}
                                  >
                                    <div className="flex gap-2.5 items-start">
                                      {/* Avatar Icon */}
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${clr.iconBg}`}>
                                        <RenderPlatformIcon platform={draft.platform} className="w-3" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-[8px] font-mono uppercase tracking-widest font-black text-[#117644] block mb-0.5">
                                          {draft.platform} draft
                                        </span>
                                        <p className="text-[10px] font-sans font-bold text-[#042F1A] leading-snug break-words line-clamp-2 pr-1">
                                          {draft.text}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Collapsed indicator vertical banner */
                        <div className="flex flex-col items-center justify-between h-full py-4 w-full">
                          <button 
                            onClick={() => setIsDraftPoolOpen(true)}
                            className="p-1 px-2.5 bg-neutral-50 hover:bg-neutral-100 text-[#042F1A] text-[9.5px] font-bold rounded-lg uppercase tracking-wider"
                            title="Expand Drafts Pool"
                          >
                            ➔
                          </button>
                          <div className="font-serif font-black uppercase text-[10px] tracking-widest text-[#042F1A]/60 rotate-90 origin-center whitespace-nowrap mt-24 mb-24 select-none">
                            DRAFT CONTENT POOL ( {draftPool.length} )
                          </div>
                          <div className="w-7 h-7 bg-neutral-50 border rounded-full flex items-center justify-center animate-pulse" title="Drop scheduled item here to unschedule">
                            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </div>
                      )}

                      {isDraftPoolOpen && (
                        <div className="mt-4 border-t border-[#eae3d2]/60 pt-3 flex justify-between items-center text-[9px] font-mono text-neutral-400 font-extrabold uppercase">
                          <span>Drop here to unschedule</span>
                          <span className="text-[#117644] font-bold">{draftPool.length} drafts</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
                })()}


                {/* Day View single-column version */}
                {calendarView === "day" && (() => {
                  const daysKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
                  const weekLabels: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

                  return (
                    <div className="bg-white border border-[#eae3d2] rounded-3xl p-5 md:p-6 shadow-xs relative text-left space-y-6">
                      
                      {/* Custom pill selectors */}
                      <div className="flex items-center justify-between border-b pb-3 border-[#eae3d2]">
                        <span className="font-serif font-black text-xs uppercase tracking-wider text-[#042F1A]">Select Daily timeline:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {daysKeys.map((k) => (
                            <button
                              key={k}
                              onClick={() => { setActiveMobileDay(k); confetti({ particleCount: 10 }); }}
                              className={`px-3 py-1.5 rounded-full text-[10.5px] font-extrabold uppercase transition-all cursor-pointer ${
                                activeMobileDay === k 
                                  ? "bg-[#042F1A] text-white shadow-xs" 
                                  : "bg-neutral-50 hover:bg-neutral-100 text-[#042F1A]/70"
                              }`}
                            >
                              {weekLabels[k] || k}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 max-w-4xl mx-auto">
                        <h4 className="font-serif text-sm font-black text-[#042F1A] text-center border-b pb-2">
                          Active Timeline for {weekLabels[activeMobileDay]} (Peak workspace 9:00 AM - 6:00 PM)
                        </h4>

                        {hours.map((hour) => {
                          const cellDateStr = getCellDateStringAtRoot(activeMobileDay, currentWeekOffset);
                          const matchingSlots = scheduledSlots.filter(
                            s => s.day === activeMobileDay && 
                            s.hour === hour && 
                            (!s.date || s.date === cellDateStr) &&
                            (s.platforms || [s.platform || "instagram"]).some(p => calendarPlatformFilter.includes(p))
                          );

                          return (
                            <div key={hour} className="flex gap-4 items-start border-l-2 border-[#eae3d2]/60 pl-4 py-2.5 relative">
                              <span className="font-mono text-xs font-black text-[#117644] min-w-[55px] pt-1">{hour}</span>
                              
                              <div className="flex-1 space-y-3">
                                {matchingSlots.length === 0 ? (
                                  <div className="py-3 px-4 bg-neutral-50/50 rounded-xl text-neutral-400 text-xs italic border border-dashed flex justify-between items-center group">
                                    <span>No payloads scheduled in this peak hour.</span>
                                    <button
                                      onClick={() => {
                                        setNewSlotDay(activeMobileDay);
                                        setNewSlotHour(hour);
                                        const dateOfCell = getCellDateStringAtRoot(activeMobileDay, currentWeekOffset);
                                        setNewSlotDate(dateOfCell);
                                        setIsQuickPostOpen(true);
                                      }}
                                      className="text-xs uppercase text-[#117644] font-black tracking-widest hidden group-hover:block transition-all hover:underline"
                                    >
                                      + Schedule Post
                                    </button>
                                  </div>
                                ) : (
                                  matchingSlots.map((card) => (
                                    <div 
                                      key={card.id} 
                                      onClick={() => setSelectedCalendarPostId(card.id)}
                                      className="bg-white hover:bg-neutral-50/50 border border-[#eae3d2] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer relative"
                                    >
                                      <div className="flex flex-col md:flex-row gap-4">
                                        {card.mediaUrl && (
                                          <img 
                                            src={card.mediaUrl} 
                                            alt="Visual Preview" 
                                            className="w-full md:w-32 h-24 object-cover rounded-xl border flex-shrink-0 bg-neutral-100" 
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        <div className="flex-1 space-y-2 flex flex-col justify-between">
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[10px] font-mono text-[#117644] bg-[#117644]/5 border border-[#117644]/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                                                {card.platform} (Primary)
                                              </span>
                                              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${
                                                card.status === "published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-neutral-50 text-neutral-400"
                                              }`}>
                                                {card.status}
                                              </span>
                                            </div>
                                            <p className="text-xs text-[#042F1A] font-serif leading-relaxed line-clamp-3">
                                              {card.text}
                                            </p>
                                          </div>

                                          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 border-dashed">
                                            <div className="flex items-center gap-1">
                                              <span className="text-[9px] font-mono text-neutral-400">Target Channels:</span>
                                              <div className="flex gap-1">
                                                {(card.platforms || [card.platform || "instagram"]).map(p => (
                                                  <span key={p} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[8px] uppercase tracking-wider font-bold">
                                                    {p}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                            <span className="text-[9px] text-neutral-400 font-bold uppercase hover:underline">Click to edit actions →</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })()}

                {/* List View chronological flat grouped list */}
                {calendarView === "list" && (() => {
                  const activePlatformFilterList = [...scheduledSlots]
                    .filter(s => (s.platforms || [s.platform || "instagram"]).some(p => calendarPlatformFilter.includes(p)))
                    .sort((a, b) => {
                      const dateA = a.date || getCellDateStringAtRoot(a.day, currentWeekOffset);
                      const dateB = b.date || getCellDateStringAtRoot(b.day, currentWeekOffset);
                      if (dateA !== dateB) return dateA.localeCompare(dateB);
                      return a.hour.localeCompare(b.hour);
                    });

                  const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  const firstDayIndex = new Date(selectedScheduleYear, selectedScheduleMonth, 1).getDay();
                  const totalDaysInMonth = new Date(selectedScheduleYear, selectedScheduleMonth + 1, 0).getDate();
                  const blankDays = Array(firstDayIndex).fill(null);
                  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

                  // Calculate stats for the selected month
                  const monthSlots = scheduledSlots.filter(s => {
                    const isPlatformAllowed = (s.platforms || [s.platform || "instagram"]).some(p => calendarPlatformFilter.includes(p));
                    if (!isPlatformAllowed) return false;
                    if (s.date) {
                      const [yr, mo] = s.date.split("-");
                      return parseInt(yr) === selectedScheduleYear && parseInt(mo) === (selectedScheduleMonth + 1);
                    }
                    return true;
                  });

                  const scheduledCount = monthSlots.filter(s => s.status === "scheduled").length;
                  const publishedCount = monthSlots.filter(s => s.status === "published").length;
                  const totalCount = monthSlots.length;

                  const handlePrevMonth = () => {
                    if (selectedScheduleMonth === 0) {
                      setSelectedScheduleMonth(11);
                      setSelectedScheduleYear(prev => prev - 1);
                    } else {
                      setSelectedScheduleMonth(prev => prev - 1);
                    }
                  };

                  const handleNextMonth = () => {
                    if (selectedScheduleMonth === 11) {
                      setSelectedScheduleMonth(0);
                      setSelectedScheduleYear(prev => prev + 1);
                    } else {
                      setSelectedScheduleMonth(prev => prev + 1);
                    }
                  };

                  return (
                    <div className="space-y-6">
                      {/* Sub-Header / Controls for Month View */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF5EB]/50 border border-[#eae3d2] p-4 rounded-3xl text-left">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="p-1.5 hover:bg-[#042F1A]/5 rounded-full transition-colors border border-stone-200 cursor-pointer text-stone-700"
                            >
                              <ChevronLeft className="w-4.5 h-4.5" />
                            </button>
                            <span className="font-serif font-black text-lg text-[#042F1A] min-w-[140px] text-center">
                              {monthsList[selectedScheduleMonth]} {selectedScheduleYear}
                            </span>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="p-1.5 hover:bg-[#042F1A]/5 rounded-full transition-colors border border-stone-200 cursor-pointer text-stone-700"
                            >
                              <ChevronRight className="w-4.5 h-4.5" />
                            </button>
                          </div>

                          <div className="hidden lg:flex items-center gap-2 border-l border-dashed border-[#eae3d2] pl-4 text-[11px] font-mono text-[#042F1A]/70">
                            <span className="font-black">💡 Click on any day to add a new event directly on that date.</span>
                          </div>
                        </div>

                        {/* Month stats pill cluster */}
                        <div className="flex items-center gap-3 font-mono text-[10px]">
                          <div className="px-3 py-1 bg-white border border-[#eae3d2] rounded-full">
                            <span className="text-[#117644] font-black">{scheduledCount}</span> Scheduled
                          </div>
                          <div className="px-3 py-1 bg-white border border-[#eae3d2] rounded-full">
                            <span className="text-blue-600 font-black">{publishedCount}</span> Published
                          </div>
                          <div className="px-3 py-1 bg-black text-[#FAF6EE] rounded-full">
                            <span className="text-[#C5E729] font-black">{totalCount}</span> Total Items
                          </div>
                        </div>
                      </div>

                      {/* Main Full Month Grid Card */}
                      <div className="bg-white border border-[#eae3d2] rounded-3xl p-4 md:p-6 shadow-sm overflow-x-auto">
                        <div className="min-w-[760px]">
                          {/* Sunday to Saturday headers */}
                          <div className="grid grid-cols-7 gap-2 text-center font-mono font-black text-[#117644] text-[10px] uppercase tracking-wider border-b pb-3 mb-4">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((dayName) => (
                              <div key={dayName} className="py-1">{dayName}</div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-2">
                            {/* Empty preceding cells */}
                            {blankDays.map((_, idx) => (
                              <div 
                                key={`blank-${idx}`} 
                                className="min-h-[110px] bg-neutral-50/40 rounded-2xl border border-dashed border-neutral-200/50" 
                              />
                            ))}

                            {/* Active Days of month */}
                            {monthDays.map((dayNum) => {
                              const cellDateStr = `${selectedScheduleYear}-${String(selectedScheduleMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                              const weekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(selectedScheduleYear, selectedScheduleMonth, dayNum).getDay()];
                              
                              const isToday = selectedScheduleYear === 2026 && selectedScheduleMonth === 5 && dayNum === 28;

                              // Filter posts for this cell
                              const postsForCell = scheduledSlots.filter(s => {
                                const isPlatformAllowed = (s.platforms || [s.platform || "instagram"]).some(p => calendarPlatformFilter.includes(p));
                                if (!isPlatformAllowed) return false;
                                
                                if (s.date) {
                                  return s.date === cellDateStr;
                                } else {
                                  // Relative posts fallback to matching day of week
                                  return s.day === weekdayName;
                                }
                              });

                              return (
                                <motion.div
                                  key={`day-${dayNum}`}
                                  whileHover={{ y: -2 }}
                                  transition={{ duration: 0.15 }}
                                  onClick={() => {
                                    setNewSlotDay(weekdayName);
                                    setNewSlotHour("12:00");
                                    setNewSlotText("");
                                    setNewSlotPlatforms(["instagram"]);
                                    setNewSlotImage("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=400&q=80");
                                    setNewSlotDate(cellDateStr);
                                    setIsQuickPostOpen(true);
                                    confetti({ particleCount: 15, spread: 25 });
                                  }}
                                  className={`min-h-[120px] p-3 bg-white border rounded-2xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left relative group ${
                                    isToday 
                                      ? "border-[#042F1A] bg-[#FAF5EB]/20 shadow-xs" 
                                      : "border-[#eae3d2]/60 hover:border-[#117644]/50"
                                  }`}
                                >
                                  {/* Corner Header: Day Number & Today label */}
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-[11px] ${
                                      isToday 
                                        ? "bg-black text-white" 
                                        : "text-[#042F1A]/80"
                                    }`}>
                                      {dayNum}
                                    </span>
                                    {isToday && (
                                      <span className="text-[7.5px] font-mono font-black bg-pink-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                        Today
                                      </span>
                                    )}
                                    {!isToday && postsForCell.length === 0 && (
                                      <span className="text-[9px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                        + Add
                                      </span>
                                    )}
                                  </div>

                                  {/* List of Scheduled Items inside cell */}
                                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[110px] pr-0.5 no-scrollbar">
                                    {postsForCell.map((post) => {
                                      // Soft visual identity accent matching platform colors
                                      let borderLeftColor = "border-l-pink-500";
                                      let iconColor = "text-pink-600 bg-pink-50";
                                      if (post.platform === "instagram") { borderLeftColor = "border-l-pink-500"; iconColor = "text-pink-600 bg-pink-50"; }
                                      if (post.platform === "tiktok") { borderLeftColor = "border-l-neutral-900"; iconColor = "text-neutral-950 bg-neutral-100"; }
                                      if (post.platform === "linkedin") { borderLeftColor = "border-l-blue-500"; iconColor = "text-[#0077B5] bg-blue-50"; }
                                      if (post.platform === "facebook") { borderLeftColor = "border-l-blue-600"; iconColor = "text-[#3b5998] bg-blue-50/80"; }
                                      if (post.platform === "youtube") { borderLeftColor = "border-l-red-500"; iconColor = "text-red-600 bg-red-50"; }
                                      if (post.platform === "pinterest") { borderLeftColor = "border-l-rose-500"; iconColor = "text-rose-600 bg-rose-50"; }

                                      return (
                                        <div
                                          key={post.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCalendarPostId(post.id);
                                          }}
                                          className={`pl-2 pr-1.5 py-1 text-[10px] font-sans font-bold flex items-center justify-between border border-neutral-100 bg-white rounded-lg shadow-3xs hover:shadow-2xs transition-all border-l-2 ${borderLeftColor}`}
                                        >
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <span className={`p-0.5 rounded-sm shrink-0 flex items-center justify-center ${iconColor}`}>
                                              {post.platform === "instagram" && <Instagram className="w-2.5 h-2.5" />}
                                              {post.platform === "tiktok" && <TikTokIcon className="w-2.5 h-2.5" />}
                                              {post.platform === "linkedin" && <Linkedin className="w-2.5 h-2.5" />}
                                              {post.platform === "facebook" && <Facebook className="w-2.5 h-2.5" />}
                                              {post.platform === "youtube" && <Youtube className="w-2.5 h-2.5" />}
                                              {post.platform === "pinterest" && <PinterestIcon className="w-2.5 h-2.5" />}
                                            </span>
                                            <span className="truncate text-[#042F1A] font-semibold tracking-tight">{post.text || post.title}</span>
                                          </div>
                                          <span className="font-mono text-[7.5px] text-neutral-400 shrink-0 font-black tracking-tighter">
                                            {post.hour}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* BULK ACTION PANEL SLIDEOUT BAR */}
                <AnimatePresence>
                  {bulkSelectedIds.length > 0 && (
                    <motion.div
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 80, opacity: 0 }}
                      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#042F1A] text-[#FAF6EE] px-6 py-4 rounded-full shadow-2xl flex flex-col md:flex-row md:items-center gap-4 md:gap-6 z-999 border-2 border-[#117644] max-w-2xl w-[90%] text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-[#117644] px-3.5 py-1 rounded-full text-white">
                          {bulkSelectedIds.length} Selected
                        </span>
                        <span className="text-[10px] text-neutral-300 font-medium">Batch Payload Operations</span>
                      </div>

                      <div className="flex-1 flex gap-2 justify-end text-[9.5px] uppercase font-black tracking-widest flex-wrap">
                        <button
                          onClick={() => {
                            setScheduledSlots(prev => prev.map(p => 
                              bulkSelectedIds.includes(p.id) ? { ...p, status: "published" } : p
                            ));
                            setBulkSelectedIds([]);
                            confetti({ particleCount: 50 });
                          }}
                          className="px-3.5 py-2 hover:bg-[#117644] rounded-full transition-all flex items-center gap-1.5 cursor-pointer bg-white/10"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          Publish Live
                        </button>
                        <button
                          onClick={() => {
                            setScheduledSlots(prev => prev.map(p => 
                              bulkSelectedIds.includes(p.id) ? { ...p, day: "Wed", hour: "12:00" } : p
                            ));
                            setBulkSelectedIds([]);
                            setCalendarToast({ message: "Batch rescheduled selection to Wednesday 12:00 PM", originalSlot: null });
                          }}
                          className="px-3.5 py-2 hover:bg-[#117644] rounded-full transition-all flex items-center gap-1.5 cursor-pointer bg-white/10"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          Resched Wed
                        </button>
                        <button
                          onClick={() => {
                            setScheduledSlots(prev => prev.filter(p => !bulkSelectedIds.includes(p.id)));
                            setBulkSelectedIds([]);
                            confetti({ particleCount: 20 });
                          }}
                          className="px-3.5 py-2 hover:bg-rose-700/80 hover:text-[#FAF6EE] rounded-full transition-all flex items-center gap-1.5 text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          Delete
                        </button>
                        <button
                          onClick={() => setBulkSelectedIds([])}
                          className="px-3 py-1.5 border border-white/20 hover:bg-white/10 rounded-full transition-all cursor-pointer text-white/80"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SIDE DETAIL DRAWER PANEL (Slides in on card click) */}
                <AnimatePresence>
                  {selectedCalendarPostId && (() => {
                    const card = scheduledSlots.find(c => c.id === selectedCalendarPostId);
                    if (!card) return null;
                    const clrText = card.status === "published" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-neutral-400 bg-neutral-100";
                    return (
                      <>
                        <div className="fixed inset-0 bg-black/45 z-[999]" onClick={() => setSelectedCalendarPostId(null)} />
                        <motion.div
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 220 }}
                          className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF5EB] border-l-2 border-[#042F1A] shadow-2xl z-[9999] p-6 overflow-y-auto text-left flex flex-col justify-between"
                        >
                          {/* Drawer Header */}
                          <div className="flex items-center justify-between border-b pb-4 border-[#eae3d2]">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-[#042F1A] rounded-full text-[#FAF6EE]">
                                <Calendar className="w-4 h-4" />
                              </span>
                              <h3 className="font-serif font-black text-[#042F1A] text-sm">Post Detail Inspector</h3>
                            </div>
                            <button 
                              onClick={() => setSelectedCalendarPostId(null)}
                              className="p-1.5 hover:bg-neutral-200/50 rounded-full transition-all text-[#042F1A] font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Detail fields body */}
                          <div className="flex-1 py-4 space-y-5 overflow-y-auto pr-0.5 no-scrollbar">
                            {/* Live visual mockup display */}
                            <div className="bg-white border border-[#eae3d2] rounded-2xl overflow-hidden shadow-2xs">
                              <div className="p-3 bg-neutral-50 border-b border-[#eae3d2] flex justify-between items-center text-[9px] font-mono font-black text-[#117644] uppercase tracking-wider">
                                <span>Preview Engine</span>
                                <span>{card.platform} mockup</span>
                              </div>
                              <div className="p-4 space-y-3">
                                {card.mediaUrl ? (
                                  <img 
                                    src={card.mediaUrl} 
                                    alt="Mockup visual" 
                                    className="w-full h-44 object-cover rounded-xl border bg-neutral-50" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-40 bg-neutral-50 border border-dashed rounded-xl flex items-center justify-center text-xs italic text-neutral-400">
                                    No Visual Mock Asset
                                  </div>
                                )}
                                <p className="text-xs text-[#042F1A] font-serif leading-relaxed whitespace-pre-wrap select-text selection:bg-[#117644]/20">
                                  {card.text}
                                </p>
                              </div>
                            </div>

                            {/* Time Scheduling Configuration */}
                            <div className="bg-white/80 border border-[#eae3d2] p-4 rounded-2xl space-y-3">
                              <span className="text-[10px] uppercase font-mono font-black text-[#117644] tracking-widest block">Reschedule Settings</span>
                              <div className="space-y-3 text-xs">
                                <div>
                                  <label className="text-[9px] font-extrabold text-[#042F1A]/70 uppercase block mb-1">Target Date</label>
                                  <input 
                                    type="date"
                                    value={card.date || ""}
                                    onChange={e => {
                                      const val = e.target.value;
                                      if (val) {
                                        const daysKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                        const dayName = daysKeys[new Date(val + "T00:00:00").getDay()];
                                        setScheduledSlots(prev => prev.map(p => p.id === card.id ? { ...p, date: val, day: dayName } : p));
                                      } else {
                                        setScheduledSlots(prev => prev.map(p => p.id === card.id ? { ...p, date: undefined } : p));
                                      }
                                      setCalendarToast({ message: `Scheduled date updated successfully!`, originalSlot: { id: card.id, day: card.day, hour: card.hour } });
                                    }}
                                    className="w-full p-2.5 text-xs border rounded-xl bg-white text-[#042F1A] font-bold cursor-pointer transition-all"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3 font-mono">
                                  <div>
                                    <label className="text-[9px] font-extrabold text-[#042F1A]/70 uppercase block mb-1">Target Weekday</label>
                                    <select 
                                      value={card.day} 
                                      onChange={e => {
                                        const dVal = e.target.value;
                                        setScheduledSlots(prev => prev.map(p => p.id === card.id ? { ...p, day: dVal } : p));
                                        setCalendarToast({ message: `Rescheduled post to ${dVal} at ${card.hour}`, originalSlot: { id: card.id, day: card.day, hour: card.hour } });
                                      }} 
                                      className="w-full p-2.5 text-xs border rounded-xl bg-white text-[#042F1A] font-bold cursor-pointer transition-all font-sans"
                                    >
                                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-extrabold text-[#042F1A]/70 uppercase block mb-1">Target Hour Slot</label>
                                    <select 
                                      value={card.hour} 
                                      onChange={e => {
                                        const hVal = e.target.value;
                                        setScheduledSlots(prev => prev.map(p => p.id === card.id ? { ...p, hour: hVal } : p));
                                        setCalendarToast({ message: `Rescheduled post to ${card.day} at ${hVal}`, originalSlot: { id: card.id, day: card.day, hour: card.hour } });
                                      }} 
                                      className="w-full p-2.5 text-xs border rounded-xl bg-white text-[#042F1A] font-bold cursor-pointer transition-all font-sans"
                                    >
                                      {["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Post Performance mini-metrics */}
                            <div className="bg-white/80 border border-[#eae3d2] p-4 rounded-2xl space-y-3.5">
                              <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-[10px] uppercase font-mono font-black text-[#117644] tracking-widest">Performance Insights</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${clrText}`}>
                                  {card.status === "published" ? "Live counters" : "Awaiting Pipeline"}
                                </span>
                              </div>

                              {card.status === "published" ? (
                                <div className="space-y-3.5">
                                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                                    <div className="bg-[#FAF5EB]/50 p-2 rounded-xl border border-[#eae3d2]/60">
                                      <p className="text-[8px] text-neutral-400 uppercase">Likes</p>
                                      <p className="text-xs font-black text-[#042F1A]">{card.likes || 142}</p>
                                    </div>
                                    <div className="bg-[#FAF5EB]/50 p-2 rounded-xl border border-[#eae3d2]/60">
                                      <p className="text-[8px] text-neutral-400 uppercase">Comments</p>
                                      <p className="text-xs font-black text-[#042F1A]">{card.comments || 24}</p>
                                    </div>
                                    <div className="bg-[#FAF5EB]/50 p-2 rounded-xl border border-[#eae3d2]/60">
                                      <p className="text-[8px] text-neutral-400 uppercase">Shares</p>
                                      <p className="text-xs font-black text-[#042F1A]">{card.shares || 8}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-[8px] font-black text-neutral-400 uppercase">
                                      <span>Engagement benchmark KPI</span>
                                      <span className="text-emerald-600 font-extrabold">4.8% (Highly positive)</span>
                                    </div>
                                    <div className="w-full bg-neutral-105 h-1.5 rounded-full overflow-hidden border">
                                      <div className="bg-[#117644] h-full w-[76%] rounded-full" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center italic text-neutral-400 font-serif text-[10px] leading-relaxed py-2">
                                  Real-time impression counters, reach, and user analytics activate instantly once the payload coordinates broadcast pipeline live.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Action footer */}
                          <div className="pt-4 border-t border-[#eae3d2] space-y-2.5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setPlatformCaption(card.text);
                                  setActivePlatform(card.platform as any);
                                  setActiveTab("composer");
                                  setSelectedCalendarPostId(null);
                                  confetti({ particleCount: 20 });
                                }}
                                className="flex-1 py-3 border border-[#eae3d2] hover:bg-[#042F1A] hover:text-[#FAF6EE] text-[9px] uppercase font-black tracking-widest text-[#042F1A] transition-all rounded-full flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3 text-[#117644]" />
                                Edit Composer
                              </button>

                              <button
                                onClick={() => {
                                  const clonePost = {
                                    ...card,
                                    id: "slot-" + Date.now().toString(),
                                    day: card.day === "Mon" ? "Tue" : "Mon",
                                    text: "[Copy] " + card.text
                                  };
                                  setScheduledSlots(prev => [...prev, clonePost]);
                                  setSelectedCalendarPostId(null);
                                  setCalendarToast({ message: "Successfully copied payload slot details", originalSlot: null });
                                  confetti({ particleCount: 35 });
                                }}
                                className="flex-1 py-3 border border-[#eae3d2] hover:bg-neutral-100 text-[9px] uppercase font-black tracking-widest text-[#042F1A] transition-all rounded-full flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-slate-500" />
                                Duplicate
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                setScheduledSlots(prev => prev.filter(p => p.id !== card.id));
                                setSelectedCalendarPostId(null);
                                setCalendarToast({ message: "Successfully removed planned post slot", originalSlot: null });
                              }}
                              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-[#FAF6EE] rounded-full text-[9px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                              Remove Permanently
                            </button>
                          </div>
                        </motion.div>
                      </>
                    );
                  })()}
                </AnimatePresence>

                {/* QUICK COMPOSER DIALOG OVERLAY SCREEN */}
                <AnimatePresence>
                  {isQuickPostOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[9999] flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#FAF5EB] border-2 border-[#042F1A] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4.5 text-left"
                      >
                        <div className="flex items-center justify-between border-b pb-3 border-[#eae3d2]">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4.5 h-4.5 text-[#117644]" />
                            <span className="font-serif font-black text-xs uppercase tracking-wider text-[#042F1A]">Quick Planner Composer</span>
                          </div>
                          <button 
                            onClick={() => setIsQuickPostOpen(false)}
                            className="p-1 px-2.5 rounded-full hover:bg-neutral-200/50 text-[#042F1A] transition-all font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={(e) => { handleAddScheduleSlot(e); confetti({ particleCount: 30 }); }} className="space-y-4 text-xs font-sans">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                            <div>
                              <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Schedule Date</label>
                              <input 
                                type="date"
                                value={newSlotDate}
                                onChange={e => {
                                  const val = e.target.value;
                                  setNewSlotDate(val);
                                  if (val) {
                                    const daysKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                    const dayName = daysKeys[new Date(val + "T00:00:00").getDay()];
                                    setNewSlotDay(dayName);
                                  }
                                }}
                                className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-[#042F1A] cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Schedule Weekday</label>
                              <select 
                                value={newSlotDay} 
                                onChange={e => setNewSlotDay(e.target.value)} 
                                className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-[#042F1A] cursor-pointer"
                              >
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Target peak Hour</label>
                              <select 
                                value={newSlotHour} 
                                onChange={e => setNewSlotHour(e.target.value)} 
                                className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-[#042F1A] cursor-pointer"
                              >
                                {["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Channels (Multi-Select)</label>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: "instagram", name: "Instagram", hex: "#E1306C" },
                                { id: "tiktok", name: "TikTok", hex: "#000000" },
                                { id: "linkedin", name: "LinkedIn", hex: "#0077B5" },
                                { id: "facebook", name: "Facebook", hex: "#3b5998" },
                                { id: "youtube", name: "YouTube", hex: "#FF0000" },
                                { id: "pinterest", name: "Pinterest", hex: "#BD081C" },
                              ].map((plt) => {
                                const isSelected = newSlotPlatforms.includes(plt.id);
                                return (
                                  <button
                                    type="button"
                                    key={plt.id}
                                    onClick={() => {
                                      if (isSelected) {
                                        setNewSlotPlatforms(prev => prev.filter(p => p !== plt.id));
                                      } else {
                                        setNewSlotPlatforms(prev => [...prev, plt.id]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isSelected 
                                        ? "bg-[#042F1A] text-white border-transparent shadow-xs" 
                                        : "bg-white text-[#042F1A]/70 border-[#eae3d2]"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: plt.hex }} />
                                    {plt.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Caption Text</label>
                            <textarea
                              required
                              value={newSlotText}
                              onChange={e => setNewSlotText(e.target.value)}
                              placeholder="Write once, Postrick adapts automatically across pipeline channels..."
                              className="w-full text-xs p-3 rounded-2xl border bg-white focus:outline-[#117644] font-semibold min-h-[90px] text-[#042F1A] placeholder-neutral-300"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono">
                            <div>
                              <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Color Preset Theme</label>
                              <select 
                                value={newSlotColorPreset} 
                                onChange={e => setNewSlotColorPreset(e.target.value as any)} 
                                className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-[#042F1A] cursor-pointer"
                              >
                                {["pink", "blue", "yellow", "purple", "gray"].map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Attachment Label</label>
                              <input 
                                type="text"
                                placeholder="agenda.pdf"
                                value={newSlotAttachmentName}
                                onChange={e => setNewSlotAttachmentName(e.target.value)}
                                className="w-full text-xs p-2 rounded-xl border bg-white text-[#042F1A] font-semibold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Location / Subtitle detail</label>
                            <input 
                              type="text"
                              placeholder="West camp, Room 312"
                              value={newSlotSubtitle}
                              onChange={e => setNewSlotSubtitle(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border bg-white text-[#042F1A] font-medium placeholder-neutral-300"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Asset Mockup Image URL</label>
                            <input 
                              type="text"
                              value={newSlotImage}
                              onChange={e => setNewSlotImage(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border bg-white text-[#117644] font-mono"
                            />
                          </div>

                          <div className="pt-2 flex gap-3">
                            <button 
                              type="button"
                              onClick={() => setIsQuickPostOpen(false)}
                              className="flex-1 py-2.5 border border-[#eae3d2] hover:bg-neutral-100 text-[10px] uppercase font-black tracking-widest text-[#042F1A] rounded-full transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="flex-1 py-2.5 bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] text-[9.5px] uppercase tracking-widest font-black rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <Calendar className="w-4 h-4 text-emerald-400" />
                              Schedule Slot
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* 🕒 DAILY PLANNER QUICK ADD OVERLAY MODAL */}
                <AnimatePresence>
                  {isQuickAddModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-3xs z-[9999] flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#FAF5EB] border-2 border-[#117644] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left"
                      >
                        <div className="flex items-center justify-between border-b pb-3 border-[#eae3d2]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4.5 h-4.5 text-[#117644]" />
                            <span className="font-serif font-black text-xs uppercase tracking-wider text-[#042F1A]">Dispatch Queue Quick-Add</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsQuickAddModalOpen(false)}
                            className="p-1 px-2 rounded-full hover:bg-neutral-200/50 text-[#042F1A] transition-all font-bold text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleCreateQuickAddSlot} className="space-y-4 text-xs font-sans">
                          <div>
                            <label className="text-[9px] font-black text-[#117644] uppercase block mb-1">Target dispatch Hour</label>
                            <select 
                              value={quickAddHour} 
                              onChange={e => setQuickAddHour(e.target.value)} 
                              className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-[#042F1A] cursor-pointer"
                            >
                              {Array.from({ length: 24 }).map((_, i) => {
                                const label = `${String(i).padStart(2, "0")}:00`;
                                return <option key={label} value={label}>{label} ({i % 12 === 0 ? "12" : i % 12} {i >= 12 ? "PM" : "AM"})</option>;
                              })}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Channels (Multi-Select)</label>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: "instagram", name: "Instagram", hex: "#E1306C" },
                                { id: "tiktok", name: "TikTok", hex: "#000000" },
                                { id: "linkedin", name: "LinkedIn", hex: "#0077B5" },
                                { id: "facebook", name: "Facebook", hex: "#3b5998" },
                                { id: "youtube", name: "YouTube", hex: "#FF0000" },
                                { id: "pinterest", name: "Pinterest", hex: "#BD081C" },
                              ].map((plt) => {
                                const isSelected = quickAddPlatforms.includes(plt.id);
                                return (
                                  <button
                                    type="button"
                                    key={plt.id}
                                    onClick={() => {
                                      if (isSelected) {
                                        setQuickAddPlatforms(prev => prev.filter(p => p !== plt.id));
                                      } else {
                                        setQuickAddPlatforms(prev => [...prev, plt.id]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isSelected 
                                        ? "bg-[#042F1A] text-white border-transparent shadow-xs" 
                                        : "bg-white text-[#042F1A]/70 border-[#eae3d2]"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: plt.hex }} />
                                    {plt.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Caption payload</label>
                            <textarea
                              required
                              value={quickAddText}
                              onChange={e => setQuickAddText(e.target.value)}
                              placeholder="Write circular caption once to post across multiple nodes..."
                              maxLength={280}
                              className="w-full text-xs p-3 rounded-2xl border bg-white focus:outline-[#117644] font-semibold min-h-[90px] text-[#042F1A]"
                            />
                            <div className="text-right text-[8px] font-mono font-black text-neutral-400 uppercase mt-1">
                              {quickAddText.length}/280 Characters
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-[#117644] uppercase block">Mockup Image URL</label>
                            <input 
                              type="text"
                              value={quickAddImage}
                              onChange={e => setQuickAddImage(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border bg-white text-[#117644] font-mono"
                            />
                          </div>

                          <div className="pt-2 flex gap-3">
                            <button 
                              type="button"
                              onClick={() => setIsQuickAddModalOpen(false)}
                              className="flex-1 py-2.5 border border-[#eae3d2] hover:bg-neutral-100 text-[10px] uppercase font-black tracking-widest text-[#042F1A] rounded-full transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="flex-1 py-2.5 bg-[#042F1A] hover:bg-[#117644] text-[#FAF6EE] text-[9.5px] uppercase tracking-widest font-black rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-[#C5E729]" />
                              Add to Dispatch Queue
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Calendar Movement Toast Alerts bottom notifications with UNDO */}
                <AnimatePresence>
                  {calendarToast && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      className="fixed bottom-6 right-6 bg-[#042F1A] border border-[#117644] text-[#FAF6EE] px-4.5 py-3 rounded-2xl shadow-xl z-9999 flex items-center gap-3 text-xs text-left"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{calendarToast.message}</p>
                        <p className="text-[10px] text-neutral-400">Action registered successfully.</p>
                      </div>
                      <div className="flex gap-2">
                        {calendarToast.originalSlot && (
                          <button 
                            onClick={handleUndo}
                            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 transition-all text-[#FAF6EE] text-[9px] uppercase tracking-wider font-black rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Undo className="w-3.5 h-3.5 text-yellow-400" />
                            Undo Move
                          </button>
                        )}
                        <button 
                          onClick={() => setCalendarToast(null)}
                          className="text-[9px] uppercase font-black tracking-wider text-pink-400 hover:underline px-2"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* =============== TAB: PLANNER =============== */}
            {activeTab === "planner" && (
              <motion.div
                key="planner-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 border-[#eae3d2] gap-4">
                  <div>
                    <h2 className="font-serif text-lg font-black text-[#042F1A] flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#117644]" />
                      Daily Posting Queue &amp; Planner
                    </h2>
                    <p className="text-xs text-[#042F1A]/60 font-medium">Fine-tune dispatch schedules, adjust timing, and align slots with network peak times</p>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="bg-[#FAF5EB]/65 border border-[#eae3d2] p-4 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button 
                      onClick={() => {
                        const newD = new Date(dailySelectedDate);
                        newD.setDate(newD.getDate() - 1);
                        setDailySelectedDate(newD);
                      }}
                      className="p-1.5 border border-[#eae3d2] bg-white rounded-full hover:bg-neutral-50 transition-all text-[#042F1A] hover:scale-105 active:scale-95 cursor-pointer shadow-3xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="relative font-serif font-black text-xs text-[#042F1A] tracking-tight bg-white px-4 py-2 rounded-full border border-[#eae3d2] shadow-3xs flex items-center gap-2 cursor-pointer">
                      <Calendar className="w-3.5 h-3.5 text-[#117644]" />
                      <span>{
                        getAbbrevDay(dailySelectedDate) === "Sun" && new Date(dailySelectedDate).toLocaleDateString() === new Date("2026-06-21").toLocaleDateString()
                          ? "Today, Jun 21, 2026"
                          : `${getAbbrevDay(dailySelectedDate)}, ${new Date(dailySelectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}, 2026`
                      }</span>
                      <input 
                        type="date" 
                        value={new Date(dailySelectedDate.getTime() - dailySelectedDate.getTimezoneOffset() * 60000).toISOString().split("T")[0]}
                        onChange={(e) => {
                          if (e.target.value) {
                            setDailySelectedDate(new Date(e.target.value + "T00:00:00"));
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>

                    <button 
                      onClick={() => {
                        const newD = new Date(dailySelectedDate);
                        newD.setDate(newD.getDate() + 1);
                        setDailySelectedDate(newD);
                      }}
                      className="p-1.5 border border-[#eae3d2] bg-white rounded-full hover:bg-neutral-50 transition-all text-[#042F1A] hover:scale-105 active:scale-95 cursor-pointer shadow-3xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setDailySelectedDate(new Date("2026-06-21T06:11:39-07:00"));
                        confetti({ particleCount: 15, spread: 20 });
                      }}
                      className="ml-1 text-[9px] uppercase font-black tracking-widest text-[#117644] hover:underline cursor-pointer"
                    >
                      Today
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-wider">Queue Filter:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "instagram", name: "Instagram", color: "#E1306C" },
                        { id: "tiktok", name: "TikTok", color: "#000000" },
                        { id: "linkedin", name: "LinkedIn", color: "#0077B5" },
                        { id: "facebook", name: "Facebook", color: "#1877F2" },
                        { id: "youtube", name: "YouTube", color: "#FF0000" },
                        { id: "pinterest", name: "Pinterest", color: "#BD081C" }
                      ].map(plt => {
                        const active = dailyPlatformFilters.includes(plt.id);
                        return (
                          <button
                            key={plt.id}
                            type="button"
                            onClick={() => {
                              if (active) {
                                setDailyPlatformFilters(prev => prev.filter(p => p !== plt.id));
                              } else {
                                setDailyPlatformFilters(prev => [...prev, plt.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center gap-2 cursor-pointer text-[9.5px] font-black uppercase ${
                              active 
                                ? "bg-[#042F1A] text-white border-transparent shadow-3xs" 
                                : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? plt.color : "#d4d4d4" }} />
                            {plt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6">
                  
                  {/* LEFT: TIMELINE (7 columns) */}
                  <div className="lg:col-span-7 bg-white border border-[#eae3d2] rounded-3xl p-6 relative flex flex-col shadow-3xs">
                    <div className="flex items-center justify-between border-b pb-4 mb-4 border-dashed border-neutral-200">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-black text-[#117644] tracking-widest block">Dispatch pipeline logs</span>
                        <h4 className="font-serif font-black text-[#042F1A] text-sm mt-0.5">Chronological Queue Stream</h4>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase text-neutral-400 px-2 py-1 bg-neutral-100 rounded-md">
                        {scheduledSlots.filter(s => s.day === getAbbrevDay(dailySelectedDate) && (s.platforms || [s.platform || "instagram"]).some(p => dailyPlatformFilters.includes(p))).length} total nodes
                      </span>
                    </div>

                    {/* Timeline Scroll */}
                    <div 
                      ref={timelineScrollContainerRef}
                      className="relative overflow-y-auto max-h-[720px] pr-2 no-scrollbar scroll-smooth"
                    >
                      {/* Vertical line axis */}
                      <div className="absolute left-18 top-0 bottom-0 w-0.5 bg-neutral-200 border-dashed" />

                      {/* Pulse Current Time Line */}
                      {(getAbbrevDay(dailySelectedDate) === "Sun" && new Date(dailySelectedDate).toLocaleDateString() === new Date("2026-06-21").toLocaleDateString()) && (
                        <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top: (6 * 60 + 11) / 60 * 120 }}>
                          <div className="flex items-center gap-1.5 bg-[#117644] text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full shadow-md z-30 ml-1 border border-[#C5E729]/25 animate-pulse">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5E729]"></span>
                            </span>
                            6:11 AM PST
                          </div>
                          <div className="flex-1 h-0.5 bg-[#117644] shadow-[0_0_8px_rgba(17,118,68,0.4)]" />
                        </div>
                      )}

                      {/* Time blocks */}
                      {Array.from({ length: 24 }).map((_, hourId) => {
                        const hrString = `${String(hourId).padStart(2, "0")}:00`;
                        const displayLabel = hourId % 12 === 0 ? `12 ${hourId >= 12 ? "PM" : "AM"}` : `${hourId % 12} ${hourId >= 12 ? "PM" : "AM"}`;
                        const isDragHover = dailyDragOverHour === hrString;
                        const isPrimaryHighlight = highlightedSlotHour === hrString;
                        const dailyDraggedItem = dailyDraggedId 
                          ? scheduledSlots.find(s => s.id === dailyDraggedId) 
                          : null;

                        const hourlyPosts = scheduledSlots.filter(s => {
                          const sHourStr = s.hour;
                          const hourPart = parseInt(sHourStr.split(":")[0]);
                          return s.day === getAbbrevDay(dailySelectedDate) && hourPart === hourId && (s.platforms || [s.platform || "instagram"]).some(p => dailyPlatformFilters.includes(p));
                        });

                        return (
                          <div
                            key={hrString}
                            className={`flex relative min-h-[120px] transition-colors border-b border-dashed border-neutral-100 ${
                              isDragHover ? "bg-[#117644]/5" : ""
                            } ${
                              isPrimaryHighlight ? "bg-[#C5E729]/10 ring-2 ring-[#117644]/30 rounded-2xl" : ""
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setDailyDragOverHour(hrString); }}
                            onDragLeave={() => setDailyDragOverHour(null)}
                            onDrop={() => handleDropOnHour(hrString)}
                          >
                            {/* Hour indicator */}
                            <div className="w-[72px] flex-shrink-0 text-right pr-4 pt-4 select-none">
                              <span className="text-[10px] font-mono font-black text-neutral-400 block">{displayLabel}</span>
                              <span className="text-[8px] font-bold text-neutral-300 block font-mono mt-0.5">{hrString}</span>
                            </div>

                            {/* Drop zone drop container */}
                            <div className="flex-1 p-4 relative flex flex-col gap-3 min-h-[105px]">
                              {isDragHover && hourlyPosts.length === 0 && !dailyDraggedItem && (
                                <div className="absolute inset-4 border border-dashed border-[#117644]/30 bg-white/40 rounded-xl flex items-center justify-center text-[9px] font-mono font-black text-[#117644] tracking-widest uppercase">
                                  Drop payload to move to {hrString}
                                </div>
                              )}

                              {isDragHover && dailyDraggedItem && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                  animate={{ opacity: 0.6, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                  className="bg-white/40 border-2 border-dashed border-[#117644] rounded-2xl p-4 flex flex-col gap-2 relative pointer-events-none w-full shadow-3xs z-10 text-left"
                                  style={{ borderStyle: "dashed" }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="p-1.5 bg-[#042F1A]/10 text-[#042F1A] rounded-lg flex items-center justify-center">
                                        <RenderPlatformIcon platform={dailyDraggedItem.platform} className="w-3.5 h-3.5" />
                                      </span>
                                      <span className="text-[10px] uppercase font-mono font-black text-[#042F1A] tracking-wider">{dailyDraggedItem.platform} dispatch</span>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full text-[#117644] bg-[#117644]/10 border border-[#117644]/25 border-dashed animate-pulse">
                                      Snap to {hrString}
                                    </span>
                                  </div>
                                  <div className="flex gap-3 items-start my-1 text-left">
                                    {dailyDraggedItem.mediaUrl && (
                                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#eae3d2] flex-shrink-0 opacity-50">
                                        <img src={dailyDraggedItem.mediaUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                    )}
                                    <div className="flex-1 space-y-1">
                                      <p className="text-xs font-serif leading-relaxed text-[#042F1A]/70 italic">&ldquo;{dailyDraggedItem.text}&rdquo;</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {hourlyPosts.map(card => {
                                const isPostRunningAnim = statusAnimationTarget === card.id;
                                return (
                                  <motion.div
                                    key={card.id}
                                    layout
                                    layoutId={`card-${card.id}`}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    draggable
                                    onDragStart={(e: any) => {
                                      setDailyDraggedId(card.id);
                                      e.dataTransfer.setData("text/plain", card.id);
                                    }}
                                    onDragEnd={() => {
                                      setDailyDraggedId(null);
                                      setDailyDragOverHour(null);
                                    }}
                                    className="bg-[#FAF5EB]/50 hover:bg-white border-2 border-[#eae3d2] hover:border-[#042F1A] rounded-2xl p-4 transition-all duration-300 shadow-3xs cursor-grab active:cursor-grabbing flex flex-col gap-2 relative group w-full"
                                    whileHover={{ scale: 1.005, y: -1 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-[#042F1A] rounded-lg text-[#FAF6EE] flex items-center justify-center">
                                          <RenderPlatformIcon platform={card.platform} className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="text-[10px] uppercase font-mono font-black text-[#042F1A] tracking-wider">{card.platform} dispatch</span>
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        {/* Status Pill with morph transition */}
                                        {(() => {
                                          if (card.status === "publishing" || isPostRunningAnim) {
                                            return (
                                              <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 border border-amber-200">
                                                <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-500" />
                                                Processing...
                                              </span>
                                            );
                                          }
                                          if (card.status === "published") {
                                            return (
                                              <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
                                                <Check className="w-2.5 h-2.5 text-emerald-600 font-extrabold" />
                                                Published
                                              </span>
                                            );
                                          }
                                          if (card.status === "failed") {
                                            return (
                                              <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full text-rose-700 bg-rose-50 border border-rose-200">
                                                <AlertCircle className="w-2.5 h-2.5 text-rose-500" />
                                                Failed
                                              </span>
                                            );
                                          }
                                          return (
                                            <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full text-neutral-600 bg-neutral-50 border border-neutral-200">
                                              Queued
                                            </span>
                                          );
                                        })()}

                                        <button 
                                          onClick={() => {
                                            if (confirm("Remove this planned slot?")) {
                                              handleDeletePost(card.id);
                                              setCalendarToast({ message: "Payload deleted successfully", originalSlot: null });
                                            }
                                          }}
                                          className="p-1 hover:bg-neutral-150 rounded-full transition-all text-neutral-400 hover:text-rose-600 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex gap-3 items-start my-1 text-left">
                                      {card.mediaUrl && (
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#eae3d2] flex-shrink-0">
                                          <img src={card.mediaUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      )}
                                      <div className="flex-1 space-y-1">
                                        <p className="text-xs font-serif leading-relaxed text-[#042F1A] line-clamp-2">{card.text}</p>
                                        <div className="flex items-center gap-1 text-[8px] font-mono text-neutral-400 uppercase pt-1">
                                          <span>Channels:</span>
                                          {(card.platforms || [card.platform || "instagram"]).map(p => (
                                            <span key={p} className="bg-[#eae3d2]/60 px-1 py-0.5 rounded text-[#042F1A] font-bold inline-flex items-center gap-0.5 ml-1">
                                              <RenderPlatformIcon platform={p} className="w-2 h-2" />
                                              {p}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* published metrics */}
                                    {card.status === "published" && (
                                      <div className="border-t border-neutral-100 pt-2 flex gap-4 text-[10px] text-neutral-400 font-mono">
                                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {card.likes || 14}</span>
                                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-blue-400" /> {card.comments || 3}</span>
                                        <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-[#117644]" /> {card.shares || 1}</span>
                                      </div>
                                    )}

                                    {/* failed error with retry */}
                                    {card.status === "failed" && !isPostRunningAnim && (
                                      <div className="border-t border-neutral-100 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                        <span className="text-[10px] text-rose-500 font-bold italic font-serif">Critical: HTTP 502 pipeline transmission deadlock</span>
                                        <button
                                          onClick={() => handleRetryPublish(card.id)}
                                          className="py-1.5 px-3 bg-[#042F1A] text-white hover:bg-[#117644] rounded-full transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <RefreshCw className="w-3 h-3 text-[#C5E729]" />
                                          Retry Dispatch
                                        </button>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: SCHEDULING FORECAST & ANALYTICS (3 columns) */}
                  <div className="lg:col-span-3 space-y-6 flex flex-col">
                    
                    {/* HEAT MAP */}
                    <div className="bg-[#FAF5EB]/50 border border-[#eae3d2] p-5 rounded-3xl space-y-4 shadow-3xs">
                      <div>
                        <span className="text-[9px] uppercase font-mono font-black text-[#117644] tracking-widest block">AI dispatch metrics</span>
                        <h4 className="font-serif font-black text-[#042F1A] text-sm mt-0.5">Best Times to Post</h4>
                        <p className="text-[10px] text-neutral-400 font-medium">Composite audience engagement score across active social structures</p>
                      </div>

                      {/* Staggered Heatmap bar charts */}
                      <div className="bg-white border border-[#eae3d2] p-4 rounded-2xl text-left">
                        <span className="text-[8px] uppercase font-mono font-black text-neutral-400 block mb-2">24h Shading Vector</span>
                        <div className="h-16 flex items-end gap-1.5 border-b border-neutral-200 pb-1.5">
                          {Array.from({ length: 24 }).map((_, h) => {
                            const score = getCompositeHeatValue(h);
                            const label = `${String(h).padStart(2, "0")}:00`;
                            const hasHPost = scheduledSlots.some(s => s.day === getAbbrevDay(dailySelectedDate) && parseInt(s.hour.split(":")[0]) === h && (s.platforms || [s.platform || "instagram"]).some(p => dailyPlatformFilters.includes(p)));

                            return (
                              <div key={h} className="flex-1 flex flex-col items-center group relative cursor-help">
                                <motion.div
                                  initial={{ height: 4, opacity: 0 }}
                                  animate={{ height: 10 + score * 38, opacity: 1 }}
                                  transition={{ delay: h * 0.02, type: "spring", stiffness: 120 }}
                                  className={`w-full rounded-md transition-colors duration-200 ${
                                    score >= 0.55 ? "bg-[#117644]" : "bg-neutral-300"
                                  }`}
                                  style={{ opacity: 0.15 + score * 0.85 }}
                                />
                                {hasHPost && (
                                  <div className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#C5E729] ring-1 ring-[#042F1A] pointer-events-none" />
                                )}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#042F1A] text-white text-[8px] font-mono p-1 rounded z-50">
                                  {label} Value: {Math.round(score * 100)}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase mt-1 px-0.5">
                          <span>12 AM</span>
                          <span>12 PM</span>
                          <span>11 PM</span>
                        </div>
                      </div>

                      {/* Ranked Recommendations list with Use Slot scroll handlers */}
                      <div className="space-y-2">
                        <span className="text-[8px] uppercase font-mono font-black text-[#117644] block">Optimal recommendations</span>
                        <div className="space-y-1.5">
                          {Array.from({ length: 24 }, (_, i) => ({ hr: i, lbl: `${String(i).padStart(2, "0")}:00`, score: getCompositeHeatValue(i) }))
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 3)
                            .map((rec, idx) => {
                              const friendlyTime = format12Hour(rec.hr);
                              const isSlotUsed = scheduledSlots.some(s => s.day === getAbbrevDay(dailySelectedDate) && parseInt(s.hour.split(":")[0]) === rec.hr && (s.platforms || [s.platform || "instagram"]).some(p => dailyPlatformFilters.includes(p)));

                              return (
                                <div key={rec.hr} className="bg-white border rounded-2xl p-3 border-[#eae3d2] hover:border-[#117644] flex items-center justify-between text-left">
                                  <div>
                                    <p className="font-serif font-black text-[#042F1A] text-xs">{friendlyTime}</p>
                                    <p className="text-[8px] font-mono text-[#117644] uppercase font-black">Score &middot; {Math.round(rec.score * 100)}%</p>
                                  </div>
                                  <button
                                    onClick={() => handleUseSlotHighlight(rec.lbl)}
                                    className="px-2.5 py-1 text-[8px] uppercase font-black tracking-widest border rounded hover:bg-[#042F1A] hover:text-[#FAF6EE] cursor-pointer"
                                  >
                                    {isSlotUsed ? "Active" : "Use slot"}
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {/* DONUT RADIAL DIAGNOSTIC */}
                    <div className="bg-[#FAF5EB]/50 border border-[#eae3d2] p-5 rounded-3xl shadow-3xs flex flex-col items-center justify-center space-y-4">
                      <div className="w-full text-left">
                        <span className="text-[9px] uppercase font-mono font-black text-[#117644] tracking-widest block">Daily alignment health</span>
                        <h4 className="font-serif font-black text-[#042F1A] text-sm mt-0.5">Queue Health Balance</h4>
                      </div>

                      <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90 select-none" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" className="stroke-neutral-200" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="40" cy="40" r="30" className="stroke-[#117644] transition-all duration-1000" strokeWidth="6" fill="transparent" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 30}
                            strokeDashoffset={2 * Math.PI * 30 - (displayedHealthPct / 100) * (2 * Math.PI * 30)}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center select-none font-mono">
                          <span className="text-xs font-black text-[#042F1A]">{displayedHealthPct}%</span>
                          <span className="text-[7px] uppercase text-neutral-400 font-extrabold">Optimal</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="text-[11px] text-[#042F1A]/80 font-serif leading-relaxed italic">
                          {displayedHealthPct >= 75 && "Timing optimization aligns beautifully with predicted active network graphs. Splendid timing!"}
                          {displayedHealthPct > 0 && displayedHealthPct < 75 && "Some timed slots fall outside recommended peak engagement ranges."}
                          {displayedHealthPct === 0 && "No posts scheduled today. Tap 'Add to Queue' to deploy highly active payload models!"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Add key */}
                <button
                  onClick={() => {
                    setQuickAddHour("12:00");
                    setQuickAddText("");
                    setQuickAddPlatforms(["instagram"]);
                    setIsQuickAddModalOpen(true);
                  }}
                  className="fixed bottom-6 right-6 z-40 bg-[#042F1A] text-white hover:bg-[#117644] p-4 rounded-full shadow-2xl flex items-center gap-2 border border-[#C5E729]/15 hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-widest cursor-pointer group shadow-2xl"
                >
                  <Plus className="w-5 h-5 text-[#C5E729] group-hover:rotate-90 transition-all duration-300" />
                  Add to Queue
                </button>
              </motion.div>
            )}

            {/* =============== TAB: AI ASSIST =============== */}
            {activeTab === "ai-assist" && (
              <motion.div
                key="ai-assist-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <AiCaptionAssistant 
                  isOverlay={false} 
                  onUseCaption={(caption) => {
                    handleUseCaption(caption);
                    setActiveTab("publish");
                  }} 
                />
              </motion.div>
            )}

            {/* =============== TAB: CREATIVE KIT =============== */}
            {activeTab === "creative-kit" && (
              <motion.div
                key="creative-kit-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <AiCreativeKit 
                  onSendToComposer={(textDescription, simulatedImgUrl) => {
                    setPlatformCaption(textDescription);
                    setNewSlotImage(simulatedImgUrl);
                    setActiveTab("publish");
                    setFlashCaptionTextarea(true);
                    setTimeout(() => {
                      setFlashCaptionTextarea(false);
                    }, 1200);
                  }}
                />
              </motion.div>
            )}

            {/* =============== TAB: ANALYTICS =============== */}
            {(activeTab === "analytics" || activeTab === "analytic") && (
              <motion.div
                key="analytics-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <PostrickAnalytics />
              </motion.div>
            )}

            {/* =============== TAB: ACCOUNTS =============== */}
            {activeTab === "accounts" && (
              <motion.div
                key="accounts-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 animate-fadeIn"
              >
                <PostrickAccounts />
              </motion.div>
            )}

            {/* =============== TAB: SETTINGS & HELP =============== */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 animate-fadeIn"
              >
                <PostrickSettings />
              </motion.div>
            )}

            {activeTab === "help" && (
              <motion.div key="help-tab" className="bg-white border p-6 rounded-3xl space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#042F1A]">Help Center &amp; Documentation</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Need a hand? Explore frequently asked questions or drop us a line below. Our team is here to help!</p>
                <div className="border border-dashed p-8 rounded-xl text-center text-xs text-neutral-500 leading-normal font-medium bg-[#FAF6EE]/30">
                  Need custom help? Email us anytime at: <span className="text-[#117644] underline font-bold">support@postrick.club</span> for quick replies.
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>

        {/* 4. FOOTER CREDITS */}
        <footer className="bg-[#042F1A] border-t border-[#042F1A] text-[#FAF6EE]/80 py-6 text-center text-xs relative z-10">
          <p>© {new Date().getFullYear()} Postrick. Designed with care for modern creators and brands.</p>
        </footer>

      </div>

      {/* 5. GORGEOUS COMMAND PALETTE SEARCH TRIGGER DIALOG MODAL (Cmd+K) */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-[#eae3d2] shadow-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#117644]" />
                  <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase font-black">Search Command Panel</span>
                </div>
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-black mt-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type 'dashboard', 'composer', 'relaunch', 'Instagram', or trigger actions..."
                className="w-full text-xs p-3 rounded-lg border bg-[#FAF5EB]/50 focus:outline-[#117644] font-semibold text-[#042F1A]"
              />

              <div className="space-y-1 pt-1.5">
                <span className="text-[9px] font-mono text-neutral-400 font-black uppercase tracking-wider block mb-2 px-1">Suggested Quick Jump Commands:</span>
                {[
                  { label: "Go to Dashboard Console overview", t: "dashboard" },
                  { label: "Launch Smart Composer with AI captions", t: "composer" },
                  { label: "Configure connected multi-platform accounts", t: "accounts" },
                  { label: "Review Content planning slot queues", t: "calendar" }
                ].filter(cmd => !searchQuery || cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.t.includes(searchQuery.toLowerCase())).map((cmd) => (
                  <button
                    key={cmd.t}
                    onClick={() => { setActiveTab(cmd.t); setShowCommandPalette(false); confetti({ particleCount: 20 }); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-neutral-700 hover:bg-[#042F1A]/5 hover:text-black flex items-center justify-between group transition-colors"
                  >
                    <span>{cmd.label}</span>
                    <kbd className="text-[8px] font-mono bg-neutral-100 group-hover:bg-[#117644] group-hover:text-white px-1.5 py-0.5 rounded uppercase">
                      Jump {cmd.t}
                    </kbd>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MOBILE RESPONSIVE LEFT SIDEBAR NAVIGATION (7 primary icons) */}
      <nav className="md:hidden fixed left-1.5 top-1.5 bottom-1.5 w-14 border border-[#eae3d2] bg-white rounded-2xl flex flex-col justify-between items-center py-4 z-40 shadow-xl overflow-y-auto scrollbar-none shadow-neutral-900/10">
        {/* Brand Initial Circle on top of mobile sidebar */}
        <div className="flex flex-col items-center gap-4 w-full">
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-serif font-black italic text-xs border bg-[#042F1A] text-[#FAF6EE] border-[#042F1A]">
            S
          </span>
          
          <div className="w-full flex flex-col items-center gap-2.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: <Layout className="w-4 h-4" /> },
              { id: "publish", label: "Publish", icon: <Send className="w-4 h-4" /> },
              { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
              { id: "analytics", label: "Stats", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "accounts", label: "Accounts", icon: <Users className="w-4 h-4" /> },
              { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    confetti({ particleCount: 15, spread: 25 });
                  }}
                  className={`flex flex-col items-center justify-center p-1 transition-all w-11 h-11 rounded-xl relative ${
                    active 
                      ? "text-[#117644] bg-[#042F1A]/5 scale-102 font-black" 
                      : "text-[#042F1A]/75 hover:bg-neutral-50 hover:text-black"
                  }`}
                >
                  <span className={`${active ? "text-[#117644]" : "text-[#042F1A]/60"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[7.5px] font-mono font-bold mt-0.5 text-center scale-90 whitespace-nowrap leading-none">{item.label}</span>
                  {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-[#117644]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Small bottom helper icon resembling clinical/help status */}
        <button
          onClick={() => {
            setActiveTab("help");
            confetti({ particleCount: 10 });
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-xl transition-colors ${
            activeTab === "help" ? "text-[#117644]" : "text-neutral-400 hover:text-black"
          }`}
          title="Help &amp; FAQs"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </nav>

      {/* AUTHENTICATION PORTAL MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setShowAuthModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border-2 border-[#117644] p-8 rounded-3xl max-w-sm w-full space-y-6 shadow-2xl relative z-50 text-left"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono font-black text-[#117644] uppercase tracking-widest block">SECURE CREDENTIAL ACCESS</span>
                <h3 className="font-serif font-black text-xl text-[#042F1A]">
                  {authTab === "login" ? "Welcome Back!" : "Create Brand Account"}
                </h3>
                <p className="text-xs text-stone-500 leading-normal">
                  {authTab === "login" ? "Sign in to persist your campaigns, calendars, and channels." : "Register to activate auto-publishing, brand tools, and AI writing."}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authTab === "register" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                      placeholder="John Postrick"
                      required
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#117644] transition-all"
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="example@postrick.com"
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#117644] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-wider block">Password</label>
                  <input 
                    type="password" 
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#117644] transition-all"
                  />
                </div>

                {authError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-semibold leading-relaxed">
                    {authError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full py-3 bg-[#042F1A] text-white hover:bg-[#117644] rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Auth...</span>
                    </>
                  ) : (
                    <span>{authTab === "login" ? "Login Securely" : "Register Brand Account"}</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button 
                  onClick={() => { setAuthTab(authTab === "login" ? "register" : "login"); setAuthError(""); }}
                  className="text-[10.5px] font-bold text-[#117644] hover:underline"
                >
                  {authTab === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
