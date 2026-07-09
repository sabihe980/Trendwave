"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Users, Zap, 
  Calendar, Send, BarChart3, Clock, Layout, MessageSquare, Info, Star,
  Smartphone, Monitor, ChevronRight, CheckCircle2, AlertCircle, Play, 
  Settings, Mail, Globe, Lock, User, Eye, EyeOff, Building, Heart, Laptop
} from "lucide-react";
import confetti from "canvas-confetti";
import { Youtube, Facebook, Instagram, Linkedin, PostrickLogo } from "./icons";

interface OnboardingWizardProps {
  onComplete: (data: {
    userName: string;
    workspaceName: string;
    brandColors: string[];
    brandLogo: string;
    connectedChannels: Record<string, boolean>;
    firstPostScheduled: boolean;
    postData?: {
      text: string;
      platform: string;
      platforms: string[];
      mediaUrl: string;
    };
  }) => void;
  onSkip: () => void;
  isDarkMode: boolean;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
];

// Steps enumeration
// Step 1: EMAIL & PASSWORD (Create Account)
// Step 2: PERSONALIZED WELCOME SCREEN
// Step 3: DESCRIBE YOURSELF
// Step 4: TOOLS FOR SOCIAL MEDIA
// Step 5: SOCIAL MEDIA MANAGEMENT (Section A: count + Section B: channels focus)
// Step 6: DISCOVER POSTRICK (Interactive Carousel)
// Step 7: MARKETING ATTRIBUTION
// Step 8: FINAL COMPLETION SCREEN

export default function OnboardingWizard({ onComplete, onSkip, isDarkMode }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Selections State
  const [userRole, setUserRole] = useState<string>("");
  const [customRole, setCustomRole] = useState<string>("");

  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [customTool, setCustomTool] = useState<string>("");

  const [accountCount, setAccountCount] = useState<string>("");
  const [focusedChannels, setFocusedChannels] = useState<string[]>([]);

  // Carousel State (Step 6)
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Marketing attribution (Step 7)
  const [attribution, setAttribution] = useState<string>("");
  const [customAttribution, setCustomAttribution] = useState<string>("");

  // Auto-fill template state for final CTA
  const [scheduleFirstCampaign, setScheduleFirstCampaign] = useState(true);

  // Total steps
  const TOTAL_STEPS = 8;
  const progressPercent = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);

  // Hydrate states from localStorage on mount (Resume Later Functionality)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("postrick_onb_step");
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 0 && stepNum < TOTAL_STEPS) {
          setCurrentStep(stepNum);
        }
      }

      const savedName = localStorage.getItem("postrick_onb_name");
      if (savedName) setFullName(savedName);

      const savedBiz = localStorage.getItem("postrick_onb_biz");
      if (savedBiz) setBusinessName(savedBiz);

      const savedEmail = localStorage.getItem("postrick_onb_email");
      if (savedEmail) setEmail(savedEmail);

      const savedRole = localStorage.getItem("postrick_onb_role");
      if (savedRole) setUserRole(savedRole);

      const savedCustomRole = localStorage.getItem("postrick_onb_custom_role");
      if (savedCustomRole) setCustomRole(savedCustomRole);

      const savedTools = localStorage.getItem("postrick_onb_tools");
      if (savedTools) {
        try {
          setCurrentTools(JSON.parse(savedTools));
        } catch (e) {
          console.error(e);
        }
      }

      const savedCount = localStorage.getItem("postrick_onb_acc_count");
      if (savedCount) setAccountCount(savedCount);

      const savedChannels = localStorage.getItem("postrick_onb_channels");
      if (savedChannels) {
        try {
          setFocusedChannels(JSON.parse(savedChannels));
        } catch (e) {
          console.error(e);
        }
      }

      const savedAttr = localStorage.getItem("postrick_onb_attr");
      if (savedAttr) setAttribution(savedAttr);
    }
  }, []);

  // Save intermediate state automatically to localStorage (Auto-save progress)
  const saveProgress = (nextStep: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("postrick_onb_step", nextStep.toString());
      localStorage.setItem("postrick_onb_name", fullName);
      localStorage.setItem("postrick_onb_biz", businessName);
      localStorage.setItem("postrick_onb_email", email);
      localStorage.setItem("postrick_onb_role", userRole);
      localStorage.setItem("postrick_onb_custom_role", customRole);
      localStorage.setItem("postrick_onb_tools", JSON.stringify(currentTools));
      localStorage.setItem("postrick_onb_acc_count", accountCount);
      localStorage.setItem("postrick_onb_channels", JSON.stringify(focusedChannels));
      localStorage.setItem("postrick_onb_attr", attribution);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSkip]);

  // Password strength checker helper
  const getPasswordStrength = () => {
    if (!password) return { text: "", color: "bg-neutral-200", width: "w-0", percent: 0 };
    if (password.length < 5) return { text: "Weak", color: "bg-rose-500", width: "w-1/3", percent: 33 };
    if (password.length < 9) return { text: "Medium", color: "bg-amber-500", width: "w-2/3", percent: 66 };
    return { text: "Strong & Secure", color: "bg-emerald-600", width: "w-full", percent: 100 };
  };

  const passwordStrength = getPasswordStrength();

  // Validate current step before advancing
  const handleNext = async () => {
    setValidationError(null);

    // Step 1: Create Account Validation
    if (currentStep === 0) {
      if (!fullName.trim()) {
        setValidationError("Please provide your full name to personalize your welcome banner.");
        return;
      }
      if (!businessName.trim()) {
        setValidationError("Please enter your organization or brand workspace name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setValidationError("Please provide a valid corporate email address.");
        return;
      }
      if (password.length < 6) {
        setValidationError("Your secure password must be at least 6 characters long.");
        return;
      }

      // Simulate signup API delay (micro-interaction)
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    }

    // Step 3: Describe Yourself Validation
    if (currentStep === 2) {
      if (!userRole) {
        setValidationError("Please select one profile role card to proceed.");
        return;
      }
      if (userRole === "Other" && !customRole.trim()) {
        setValidationError("Please input your specific organizational role or category.");
        return;
      }
    }

    // Step 4: Tools Validation
    if (currentStep === 3) {
      if (currentTools.length === 0) {
        setValidationError("Please select at least one tool option (or 'Not Using Any Tool') to continue.");
        return;
      }
      if (currentTools.includes("Other") && !customTool.trim()) {
        setValidationError("Please write down your custom social management tool.");
        return;
      }
    }

    // Step 5: Social Management Metrics Validation
    if (currentStep === 4) {
      if (!accountCount) {
        setValidationError("Please select the quantity of social media channels you manage.");
        return;
      }
      if (focusedChannels.length === 0) {
        setValidationError("Please select at least one social media platform of focus.");
        return;
      }
    }

    // Step 7: Marketing Attribution Validation
    if (currentStep === 6) {
      if (!attribution) {
        setValidationError("Please let us know how you heard about us before moving forward.");
        return;
      }
      if (attribution === "Other" && !customAttribution.trim()) {
        setValidationError("Please specify where you first heard about Postrick.");
        return;
      }
    }

    // Move Forward
    setDirection(1);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    saveProgress(nextStep);

    // Trigger celebratory confetti on completion screen
    if (nextStep === 7) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C5E729", "#117644", "#042F1A", "#3B82F6", "#F43F5E"]
      });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setDirection(-1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep);
    }
  };

  // Complete onboarding workflow and pass data back to parent
  const handleFinalize = () => {
    // Clear temporary onboarding step track
    if (typeof window !== "undefined") {
      localStorage.setItem("postrick_onboarding_completed", "true");
      localStorage.removeItem("postrick_onb_step");
    }

    // Pre-populate connectedChannels mapping from selected focused platforms
    const finalChannels: Record<string, boolean> = {};
    focusedChannels.forEach((chan) => {
      finalChannels[chan.toLowerCase()] = true;
    });

    onComplete({
      userName: fullName || "Sabeeh",
      workspaceName: businessName || "Savvy Monarch",
      brandColors: ["#042F1A", "#C5E729"],
      brandLogo: PRESET_AVATARS[0],
      connectedChannels: finalChannels,
      firstPostScheduled: scheduleFirstCampaign,
      postData: scheduleFirstCampaign ? {
        text: `🚀 Launching our brand campaign for ${businessName || 'Savvy Monarch'}! Managed and auto-scheduled effortlessly with @Postrick. ✨🌱`,
        platform: focusedChannels[0]?.toLowerCase() || "instagram",
        platforms: focusedChannels.map(p => p.toLowerCase()),
        mediaUrl: "https://picsum.photos/seed/postrick/800/600"
      } : undefined
    });
  };

  // Preset role choices (Step 3)
  const ROLE_CARDS = [
    { id: "Content Creator", title: "Content Creator", desc: "Digital creators, authors, and influencers building communities.", icon: Sparkles },
    { id: "Small Business Owner", title: "Small Business Owner", desc: "Local businesses, agencies, and boutiques managing direct growth.", icon: Building },
    { id: "Marketing Agency", title: "Marketing Agency", desc: "Scaling managers running continuous schedules for diverse brand portfolios.", icon: Users },
    { id: "Freelancer", title: "Freelancer / Consultant", desc: "Independent consultants executing custom digital marketing strategies.", icon: User },
    { id: "Startup Founder", title: "Startup Founder", desc: "Ambitious startup teams setting up high-traction, structured dispatch pipelines.", icon: Zap },
    { id: "Other", title: "Other Specialist", desc: "Unique setups, personal utilities, or custom publishing formats.", icon: Info }
  ];

  // Preset tools choices (Step 4)
  const TOOL_CARDS = [
    { id: "Buffer", name: "Buffer" },
    { id: "Hootsuite", name: "Hootsuite" },
    { id: "Sprout Social", name: "Sprout Social" },
    { id: "Later", name: "Later" },
    { id: "Meta Business Suite", name: "Meta Business Suite" },
    { id: "Canva", name: "Canva Studio" },
    { id: "Google Sheets", name: "Google Sheets" },
    { id: "Not Using Any Tool", name: "Not Using Any Tool" },
    { id: "Other", name: "Other Alternative" }
  ];

  // Platform Channels metadata (Step 5)
  const PLATFORMS_LIST = [
    { id: "Instagram", name: "Instagram", icon: Instagram, color: "hover:border-pink-500 hover:bg-pink-50/10 active-pink" },
    { id: "LinkedIn", name: "LinkedIn", icon: Linkedin, color: "hover:border-blue-600 hover:bg-blue-50/10 active-blue" },
    { id: "Facebook", name: "Facebook", icon: Facebook, color: "hover:border-blue-800 hover:bg-blue-50/10 active-fb" },
    { id: "YouTube", name: "YouTube", icon: Youtube, color: "hover:border-red-600 hover:bg-red-50/10 active-yt" },
    { id: "TikTok", name: "TikTok", icon: Smartphone, color: "hover:border-neutral-900 hover:bg-neutral-50/10 active-tt" },
    { id: "Threads", name: "Threads", icon: MessageSquare, color: "hover:border-stone-700 hover:bg-stone-50/10 active-threads" },
    { id: "X", name: "X (Twitter)", icon: Globe, color: "hover:border-stone-900 hover:bg-stone-50/10 active-x" },
    { id: "Pinterest", name: "Pinterest", icon: Star, color: "hover:border-rose-600 hover:bg-rose-50/10 active-pin" }
  ];

  // Step 6 Product Slides Metadata
  const DISCOVER_SLIDES = [
    {
      title: "Omni Command Dashboard",
      desc: "An enterprise-grade social command center designed to centralize and visualize your publishing queues across multi-platform node configurations.",
      benefit: "Saves up to 12 hours of weekly platform jumping.",
      metric: "100% Queue Visibility",
      img: "/auto_publish.jpg",
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-[#FAF6EE] dark:bg-neutral-900 border border-[#eae3d2] dark:border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae3d2] dark:border-neutral-800">
            <span className="font-bold flex items-center gap-1.5 text-[#117644]"><Layout className="w-3 h-3" /> dispatch_pipeline</span>
            <span className="text-[8px] bg-[#117644]/10 text-[#117644] px-1.5 py-0.5 rounded-md font-sans">Active</span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="p-1.5 bg-white dark:bg-neutral-800 border border-[#eae3d2] dark:border-neutral-700 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-[#042F1A] dark:text-neutral-200">Reels Campaign Draft #4</span>
              <span className="text-stone-400">12:00 PM (Auto)</span>
            </div>
            <div className="p-1.5 bg-white dark:bg-neutral-800 border border-[#eae3d2] dark:border-neutral-700 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-[#042F1A] dark:text-neutral-200">LinkedIn Authority Article</span>
              <span className="text-stone-400">3:30 PM (Peak)</span>
            </div>
          </div>
          <div className="text-[8px] text-stone-500 dark:text-stone-400 text-center italic">
            Visual workspace buffers optimized for organic performance indices.
          </div>
        </div>
      )
    },
    {
      title: "AI Caption Assistant & Tone Engine",
      desc: "Write once, optimize universally. Instantly rewrite captions, adapt tone formatting, inject trending hashtags, and conform to strict platform rules dynamically.",
      benefit: "Slashes copywriting latency by over 80%.",
      metric: "5 Distinct Tones",
      img: "/ai_caption.jpg",
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9.5px] bg-[#FAF6EE] dark:bg-neutral-900 border border-[#eae3d2] dark:border-neutral-800 rounded-2xl">
          <div className="space-y-1.5">
            <div className="text-[8px] text-stone-400 uppercase tracking-widest font-extrabold">Original Input</div>
            <p className="p-1.5 bg-white dark:bg-neutral-800 rounded-lg text-stone-600 dark:text-neutral-300 border border-[#eae3d2] dark:border-neutral-800">
              &ldquo;We made a new sustainable product check it out link in bio&rdquo;
            </p>
          </div>
          <div className="flex justify-center my-1 text-[#117644] dark:text-[#C5E729]">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <div className="text-[8px] text-[#117644] uppercase tracking-widest font-extrabold flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Postrick Professional Optimized
            </div>
            <p className="p-1.5 bg-[#117644]/5 dark:bg-[#C5E729]/5 border border-[#117644]/20 dark:border-[#C5E729]/20 rounded-lg text-[#042F1A] dark:text-neutral-200 leading-relaxed font-semibold">
              &ldquo;🌱 Redefining product longevity. Introducing our newest circular design, optimized to shrink carbon footprints by 30%. Link in bio. #Sustainability #EcoConscious&rdquo;
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Automated Micro-Dispatch Schedule",
      desc: "Take the guesswork out of publishing timelines. Postrick analyzes global engagement trends to orchestrate dispatch loops when active subscribers peak.",
      benefit: "Increases average post interactions by 42%.",
      metric: "True Engagement Peak",
      img: "/schedule_calendar.jpg",
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-[#FAF6EE] dark:bg-neutral-900 border border-[#eae3d2] dark:border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-neutral-300 font-bold border-b pb-1.5 border-[#eae3d2] dark:border-neutral-800">
            <Clock className="w-3.5 h-3.5 text-[#117644]" />
            <span>Optimal Publishing Nodes</span>
          </div>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[#042F1A] dark:text-neutral-200">Instagram Feed</span>
              <span className="text-[#117644] font-extrabold bg-[#117644]/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded">12:30 PM (Peak)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#042F1A] dark:text-neutral-200">LinkedIn Business</span>
              <span className="text-[#117644] font-extrabold bg-[#117644]/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded">09:15 AM (Peak)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#042F1A] dark:text-neutral-200">TikTok Short</span>
              <span className="text-[#117644] font-extrabold bg-[#117644]/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded">06:45 PM (Peak)</span>
            </div>
          </div>
          <div className="text-[8px] bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 p-1 rounded-md text-center font-semibold">
            Synchronized reels formats mapped automatically.
          </div>
        </div>
      )
    },
    {
      title: "Consolidated Workspace Analytics",
      desc: "Monitor core metrics, audit campaigns, and view follower expansion analytics across all networks side-by-side with beautiful vector dashboards.",
      benefit: "Consolidates multi-platform audits into one PDF view.",
      metric: "Real-time Metrics Tracking",
      img: "/analytics_desk_flatlay.jpg",
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-[#FAF6EE] dark:bg-neutral-900 border border-[#eae3d2] dark:border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between border-b pb-1.5 border-[#eae3d2] dark:border-neutral-800">
            <span className="font-bold text-stone-700 dark:text-neutral-300 flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> organic_growth</span>
            <span className="text-emerald-600 font-extrabold">+24.8% This Month</span>
          </div>
          <div className="py-2 flex items-end justify-between h-16 px-4">
            <div className="w-3 bg-stone-300 dark:bg-neutral-700 h-[30%] rounded-sm" />
            <div className="w-3 bg-stone-300 dark:bg-neutral-700 h-[45%] rounded-sm" />
            <div className="w-3 bg-[#117644] dark:bg-[#C5E729] h-[75%] rounded-sm animate-pulse" />
            <div className="w-3 bg-stone-300 dark:bg-neutral-700 h-[60%] rounded-sm" />
            <div className="w-3 bg-[#117644] dark:bg-[#C5E729] h-[95%] rounded-sm animate-pulse" />
          </div>
          <div className="flex justify-between text-[8px] text-stone-400">
            <span>May 15</span>
            <span>Jun 15</span>
            <span>Jul 15</span>
          </div>
        </div>
      )
    }
  ];

  // Step 7 Attribution presets
  const ATTRIBUTION_CARDS = [
    { id: "Google Search", label: "Google Search" },
    { id: "YouTube", label: "YouTube" },
    { id: "Instagram", label: "Instagram" },
    { id: "Facebook", label: "Facebook" },
    { id: "LinkedIn", label: "LinkedIn" },
    { id: "TikTok", label: "TikTok" },
    { id: "Friend / Referral", label: "Friend / Colleague" },
    { id: "Blog / News", label: "Blog or Tech Article" },
    { id: "Community / Forum", label: "Online Community" },
    { id: "Product Hunt", label: "Product Hunt" },
    { id: "Other", label: "Other Source" }
  ];

  return (
    <div className={`fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-300 ${
      isDarkMode ? "bg-[#02180c]/95" : "bg-[#FAF6EE]/90"
    } backdrop-blur-md font-sans antialiased`}>
      
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 ${
          isDarkMode ? "bg-[#117644]/15" : "bg-[#117644]/10"
        }`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 ${
          isDarkMode ? "bg-[#C5E729]/10" : "bg-[#C5E729]/15"
        }`} />
      </div>

      {/* Main Form Box Container */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`relative w-full max-w-[650px] md:max-w-[700px] rounded-[28px] md:rounded-[36px] shadow-2xl border flex flex-col overflow-hidden max-h-[95vh] ${
          isDarkMode 
            ? "bg-[#031d10] border-[#115e34] text-[#FAF6EE]" 
            : "bg-white border-[#b0a487]/50 text-[#042F1A]"
        }`}
      >
        {/* TOP STATUS BAR */}
        <div className={`flex items-center justify-between p-4 md:p-5 border-b flex-shrink-0 ${
          isDarkMode ? "border-[#115e34]/30" : "border-[#b0a487]/20"
        }`}>
          <div className="flex items-center gap-3">
            <PostrickLogo className="w-7 h-7" color="#117644" bgStrokeColor={isDarkMode ? "#031d10" : "#FAF6EE"} />
            <div>
              <h3 className="font-serif text-sm font-black tracking-tight leading-none text-[#042F1A] dark:text-white">Postrick</h3>
              <p className="text-[9px] font-mono uppercase tracking-widest font-extrabold text-[#117644] dark:text-[#C5E729] mt-1">
                Workspace Onboarding Setup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-stone-400">Progress</span>
              <div className="w-20 h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#117644] dark:bg-[#C5E729]" 
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#117644] dark:text-[#C5E729]">
                {progressPercent}%
              </span>
            </div>

            {currentStep < TOTAL_STEPS - 1 && (
              <button 
                onClick={onSkip}
                className="text-[10px] font-bold font-mono tracking-wider text-stone-400 hover:text-[#117644] dark:hover:text-[#C5E729] uppercase transition-all py-1.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Skip Onboarding &rarr;
              </button>
            )}
          </div>
        </div>

        {/* VALIDATION ERROR BANNERS */}
        <AnimatePresence>
          {validationError && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-5 py-3 border-b flex items-center gap-2.5 text-xs font-semibold ${
                isDarkMode 
                  ? "bg-rose-950/30 border-[#115e34]/30 text-rose-200" 
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT CANVAS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: direction * 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* STEP 1: EMAIL & PASSWORD (Create Account) */}
              {currentStep === 0 && (
                <div className="space-y-5 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      Let&apos;s build your professional account
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      Enter your workspace details below to secure your visual marketing console.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-stone-400 dark:text-neutral-300 mb-1.5">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                          <User className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ahmed Al-Mansoori"
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-stone-400 dark:text-neutral-300 mb-1.5">
                        Business / Workspace Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                          <Building className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="text" 
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Savvy Monarch"
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-stone-400 dark:text-neutral-300 mb-1.5">
                        Corporate Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ahmed@savvymonarch.com"
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-stone-400 dark:text-neutral-300">
                          Secure Password
                        </label>
                        {password && (
                          <span className={`text-[9px] font-mono font-bold uppercase ${
                            passwordStrength.percent === 100 
                              ? "text-emerald-500" 
                              : passwordStrength.percent === 66 
                              ? "text-amber-500" 
                              : "text-rose-500"
                          }`}>
                            {passwordStrength.text}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Password strength animated tracker bars */}
                      <div className="mt-2.5 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex gap-0.5">
                        <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent >= 33 ? "w-1/3" : "w-0"}`} />
                        <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent >= 66 ? "w-1/3" : "w-0"}`} />
                        <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent === 100 ? "w-1/3" : "w-0"}`} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 leading-relaxed font-medium">
                    By submitting your workspace setup, you verify and agree to form an authenticated security node under our server-side publishing compliance mandates.
                  </p>
                </div>
              )}

              {/* STEP 2: PERSONALIZED WELCOME SCREEN */}
              {currentStep === 1 && (
                <div className="space-y-6 text-center max-w-lg mx-auto py-2">
                  <motion.div 
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                    className="mx-auto w-16 h-16 rounded-full bg-[#117644]/15 text-[#117644] dark:text-[#C5E729] flex items-center justify-center shadow-sm"
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#042F1A] dark:text-white leading-tight">
                      Welcome to Postrick
                    </h1>
                    <p className="text-sm text-stone-500 dark:text-neutral-300 font-semibold max-w-md mx-auto">
                      Let&apos;s get your business <span className="text-[#117644] dark:text-[#C5E729] font-bold">&ldquo;{businessName || "Savvy Monarch"}&rdquo;</span> set up for success, <span className="font-bold text-[#042F1A] dark:text-white">{fullName || "Ahmed"}</span>.
                    </p>
                  </div>

                  {/* High fidelity inline graphic representing synchronized dashboard */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center gap-3 font-mono text-[10.5px] max-w-sm mx-auto shadow-sm ${
                    isDarkMode ? "bg-[#02180c] border-[#115e34]/40" : "bg-[#FAF6EE]/50 border-[#eae3d2]"
                  }`}>
                    <div className="flex justify-between items-center w-full font-bold text-[#117644] dark:text-[#C5E729]">
                      <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5" /> Workspace Dispatch</span>
                      <span className="text-[9px] bg-[#117644]/15 dark:bg-[#C5E729]/15 px-2 py-0.5 rounded-full font-sans uppercase font-black">Authorized</span>
                    </div>
                    <div className="w-full h-0.5 border-t border-dashed border-[#eae3d2] dark:border-neutral-800" />
                    <p className="text-stone-500 dark:text-stone-300 leading-normal text-center italic">
                      &ldquo;Unified posting profiles and calendar dispatch buffers are currently loading into system RAM.&rdquo;
                    </p>
                  </div>

                  <p className="text-xs text-stone-400 font-semibold">
                    Click Continue to tailor your specific target audiences and campaign focus!
                  </p>
                </div>
              )}

              {/* STEP 3: HOW WOULD YOU DESCRIBE YOURSELF? */}
              {currentStep === 2 && (
                <div className="space-y-5 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      How would you describe yourself?
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      Select the role profile that aligns best with your organizational daily workflow.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {ROLE_CARDS.map((card) => {
                      const IconComp = card.icon;
                      const isSelected = userRole === card.id;
                      return (
                        <motion.button
                          key={card.id}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setUserRole(card.id);
                            if (card.id !== "Other") setCustomRole("");
                          }}
                          className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? "border-[#117644] bg-[#117644]/5 dark:bg-emerald-950/20 shadow-sm" 
                              : "border-[#b0a487]/30 dark:border-neutral-800 hover:border-[#117644]/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30"
                          }`}
                        >
                          <span className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                            isSelected 
                              ? "bg-[#117644]/15 text-[#117644] dark:text-[#C5E729]" 
                              : "bg-neutral-100 dark:bg-neutral-800 text-stone-500"
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </span>
                          <div className="space-y-1 min-w-0">
                            <span className="block text-xs font-bold text-[#042F1A] dark:text-white">
                              {card.title}
                            </span>
                            <span className="block text-[10px] text-stone-400 dark:text-neutral-300 leading-normal font-medium">
                              {card.desc}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Seamless expanding Input for "Other" Selection */}
                  <AnimatePresence>
                    {userRole === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-1.5"
                      >
                        <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#117644] dark:text-[#C5E729] mb-1.5">
                          Specify your specific role description
                        </label>
                        <input 
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="e.g. Non-profit Digital Advocate, Brand Director"
                          className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP 4: WHAT TOOLS DO YOU USE TO MANAGE SOCIAL MEDIA? */}
              {currentStep === 3 && (
                <div className="space-y-5 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      What tools do you currently use?
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      Select all social media management tools you actively deploy. (Multiple Selections Allowed).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TOOL_CARDS.map((tool) => {
                      const isSelected = currentTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => {
                            if (tool.id === "Not Using Any Tool") {
                              setCurrentTools(["Not Using Any Tool"]);
                              setCustomTool("");
                              return;
                            }
                            let updated = [...currentTools].filter(t => t !== "Not Using Any Tool");
                            if (updated.includes(tool.id)) {
                              updated = updated.filter(t => t !== tool.id);
                            } else {
                              updated.push(tool.id);
                            }
                            setCurrentTools(updated);
                            if (!updated.includes("Other")) setCustomTool("");
                          }}
                          className={`p-3.5 rounded-xl border text-center transition-all duration-300 font-semibold text-xs cursor-pointer ${
                            isSelected 
                              ? "border-[#117644] bg-[#117644]/5 dark:bg-emerald-950/20 text-[#117644] dark:text-[#C5E729] shadow-sm" 
                              : "border-[#b0a487]/30 dark:border-neutral-800 text-stone-500 dark:text-neutral-300 hover:border-[#117644]/40 hover:bg-neutral-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                            <span>{tool.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanding input if "Other" custom tool selected */}
                  <AnimatePresence>
                    {currentTools.includes("Other") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-1.5"
                      >
                        <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#117644] dark:text-[#C5E729] mb-1.5">
                          Specify alternative tools in use
                        </label>
                        <input 
                          type="text"
                          value={customTool}
                          onChange={(e) => setCustomTool(e.target.value)}
                          placeholder="e.g. Metricool, custom internal script, Airtable"
                          className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP 5: SOCIAL MEDIA MANAGEMENT (Section A: accounts count, Section B: channels) */}
              {currentStep === 4 && (
                <div className="space-y-6 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      Social Media Management Focus
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      Tell us about the scope of your active visual campaigns and channels.
                    </p>
                  </div>

                  {/* SECTION A: How many social accounts? */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#117644] dark:text-[#C5E729]">
                      Section A: How many social accounts do you currently manage?
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {["1–3", "4–10", "11–25", "26–50", "50+"].map((option) => {
                        const isSelected = accountCount === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAccountCount(option)}
                            className={`px-4.5 py-2.5 rounded-xl border text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                              isSelected 
                                ? "border-[#117644] bg-[#117644] text-white shadow-sm" 
                                : "border-[#b0a487]/30 dark:border-neutral-800 text-stone-500 hover:border-[#117644]/40 hover:bg-neutral-50/50"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION B: What social channels are your focus? */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#117644] dark:text-[#C5E729]">
                      Section B: What social channels are your focus? (Multiple)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PLATFORMS_LIST.map((plat) => {
                        const isSelected = focusedChannels.includes(plat.id);
                        const IconComp = plat.icon;
                        return (
                          <button
                            key={plat.id}
                            type="button"
                            onClick={() => {
                              if (focusedChannels.includes(plat.id)) {
                                setFocusedChannels(prev => prev.filter(p => p !== plat.id));
                              } else {
                                setFocusedChannels(prev => [...prev, plat.id]);
                              }
                            }}
                            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${plat.color} ${
                              isSelected 
                                ? "border-[#117644] bg-[#117644]/5 text-[#117644] dark:text-emerald-400 font-extrabold shadow-sm" 
                                : "border-[#b0a487]/20 dark:border-neutral-800 text-stone-500 dark:text-stone-300"
                            }`}
                          >
                            <span className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                              <IconComp className="w-4 h-4" />
                            </span>
                            <span className="text-[10.5px] font-bold">{plat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: DISCOVER POSTRICK (Interactive Showcase Carousel) */}
              {currentStep === 5 && (
                <div className="space-y-5 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      Discover Postrick&apos;s Core Capabilities
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      See how our specialized workflows accelerate visual campaign publication and audience activation.
                    </p>
                  </div>

                  {/* CAROUSEL CONTAINER */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[220px]">
                    {/* Visual Mockup Card */}
                    <div className="md:col-span-5 flex items-center justify-center">
                      <div className="w-full h-full max-w-[240px] md:max-w-none aspect-square md:aspect-auto">
                        {DISCOVER_SLIDES[carouselIndex].renderMock}
                      </div>
                    </div>

                    {/* Description Details Card */}
                    <div className={`md:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${
                      isDarkMode ? "bg-[#02180c] border-[#115e34]/30" : "bg-[#FAF6EE]/50 border-[#eae3d2]"
                    }`}>
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-mono uppercase tracking-widest font-black text-[#117644] dark:text-[#C5E729]">
                          Featured Product Slide
                        </span>
                        <h3 className="font-serif text-base font-black text-[#042F1A] dark:text-white">
                          {DISCOVER_SLIDES[carouselIndex].title}
                        </h3>
                        <p className="text-[11px] text-stone-500 dark:text-neutral-300 leading-relaxed font-medium">
                          {DISCOVER_SLIDES[carouselIndex].desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-dashed border-[#eae3d2] dark:border-neutral-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#117644] dark:text-[#C5E729]">
                          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Core Benefit: {DISCOVER_SLIDES[carouselIndex].benefit}</span>
                        </div>
                        <div className="text-[9px] font-mono text-stone-400">
                          Platform Index: {DISCOVER_SLIDES[carouselIndex].metric}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CAROUSEL CONTROLS */}
                  <div className="flex items-center justify-between pt-1 flex-shrink-0">
                    <div className="flex gap-1">
                      {DISCOVER_SLIDES.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            carouselIndex === i 
                              ? "bg-[#117644] dark:bg-[#C5E729] w-6" 
                              : "bg-neutral-200 dark:bg-neutral-800 hover:bg-[#117644]/50"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCarouselIndex(prev => (prev === 0 ? DISCOVER_SLIDES.length - 1 : prev - 1))}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isDarkMode ? "border-stone-800 hover:bg-neutral-800" : "border-[#eae3d2] hover:bg-stone-100"
                        }`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarouselIndex(prev => (prev === DISCOVER_SLIDES.length - 1 ? 0 : prev + 1))}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isDarkMode ? "border-stone-800 hover:bg-neutral-800" : "border-[#eae3d2] hover:bg-stone-100"
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: HOW DID YOU HEAR ABOUT POSTRICK? */}
              {currentStep === 6 && (
                <div className="space-y-5 text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#042F1A] dark:text-white leading-tight">
                      How did you hear about Postrick?
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-neutral-300 font-medium">
                      Help us understand how you found our marketing command studio to refine our channels.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ATTRIBUTION_CARDS.map((card) => {
                      const isSelected = attribution === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => {
                            setAttribution(card.id);
                            if (card.id !== "Other") setCustomAttribution("");
                          }}
                          className={`p-3 rounded-xl border text-center transition-all duration-300 font-semibold text-xs cursor-pointer ${
                            isSelected 
                              ? "border-[#117644] bg-[#117644]/5 dark:bg-emerald-950/20 text-[#117644] dark:text-[#C5E729] shadow-sm" 
                              : "border-[#b0a487]/30 dark:border-neutral-800 text-stone-500 dark:text-neutral-300 hover:border-[#117644]/40 hover:bg-neutral-50/50"
                          }`}
                        >
                          {card.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom attribution entry */}
                  <AnimatePresence>
                    {attribution === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-1.5"
                      >
                        <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#117644] dark:text-[#C5E729] mb-1.5">
                          Specify alternative referral source
                        </label>
                        <input 
                          type="text"
                          value={customAttribution}
                          onChange={(e) => setCustomAttribution(e.target.value)}
                          placeholder="e.g. Substack Newsletter, Conference"
                          className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#117644] ${
                            isDarkMode 
                              ? "bg-[#02180c] border-[#115e34] text-white focus:border-[#C5E729]" 
                              : "bg-white border-[#b0a487]/50 text-[#042F1A] focus:border-[#117644]"
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP 8: FINAL COMPLETION SCREEN */}
              {currentStep === 7 && (
                <div className="space-y-6 text-center max-w-lg mx-auto py-2">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm"
                  >
                    <CheckCircle2 className="w-10 h-10 animate-pulse" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#042F1A] dark:text-white leading-tight">
                      You&apos;re all set!
                    </h1>
                    <p className="text-xs text-[#117644] dark:text-[#C5E729] font-extrabold uppercase tracking-widest font-mono">
                      Security profiles authorized
                    </p>
                    <p className="text-sm text-stone-500 dark:text-neutral-300 font-medium leading-relaxed max-w-md mx-auto">
                      Welcome to Postrick, <strong className="text-[#042F1A] dark:text-white font-bold">{fullName || "Ahmed"}</strong>. Your brand campaign workspace <strong className="text-[#042F1A] dark:text-white font-bold">&ldquo;{businessName || "Savvy Monarch"}&rdquo;</strong> is ready for launch.
                    </p>
                  </div>

                  {/* Interactive toggle option */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between text-left max-w-md mx-auto cursor-pointer transition-colors ${
                    isDarkMode ? "bg-[#02180c] border-[#115e34]/30" : "bg-[#FAF6EE]/40 border-[#eae3d2]"
                  }`} onClick={() => setScheduleFirstCampaign(!scheduleFirstCampaign)}>
                    <div className="space-y-0.5 pr-4 min-w-0">
                      <span className="block text-xs font-bold text-[#042F1A] dark:text-white">
                        Pre-populate sample campaign drafts
                      </span>
                      <span className="block text-[10px] text-stone-400 font-medium leading-normal">
                        Populate active channels queues with pre-structured campaigns for immediate testing.
                      </span>
                    </div>
                    <div className={`w-10 h-6.5 rounded-full p-1 transition-colors relative flex-shrink-0 cursor-pointer ${
                      scheduleFirstCampaign ? "bg-[#117644]" : "bg-neutral-200 dark:bg-neutral-800"
                    }`}>
                      <motion.div 
                        className="w-4.5 h-4.5 bg-white rounded-full shadow-md"
                        animate={{ x: scheduleFirstCampaign ? 14 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 leading-normal font-medium max-w-sm mx-auto">
                    Click &ldquo;Go to Dashboard&rdquo; below to unlock your active calendar queues, visual composer, and generative caption studios.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION FOOTER */}
        <div className={`p-4 md:p-5 border-t flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30 flex-shrink-0 ${
          isDarkMode ? "border-[#115e34]/30" : "border-[#b0a487]/20"
        }`}>
          {currentStep > 0 && currentStep < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isLoading}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-neutral-800 hover:bg-neutral-700 text-[#FAF6EE] border border-[#115e34]/40" 
                  : "bg-white hover:bg-stone-50 text-[#042F1A] border border-[#b0a487]/30 shadow-xs"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="py-2.5 px-5 rounded-xl text-xs font-extrabold text-white bg-[#117644] hover:bg-[#117644]/90 dark:bg-[#C5E729] dark:text-[#042F1A] dark:hover:bg-[#C5E729]/90 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white dark:border-[#042F1A]" />
              ) : (
                <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          ) : (
            <div className="flex gap-3.5 w-full justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(5); // Go back to the Discover Carousel step!
                  setCarouselIndex(0);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode 
                    ? "bg-neutral-800 hover:bg-neutral-700 text-[#FAF6EE]" 
                    : "bg-white hover:bg-stone-50 text-[#042F1A] border border-[#b0a487]/30"
                }`}
              >
                Take a Quick Tour
              </button>

              <button
                type="button"
                onClick={handleFinalize}
                className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-white bg-[#117644] hover:bg-[#117644]/90 dark:bg-[#C5E729] dark:text-[#042F1A] dark:hover:bg-[#C5E729]/90 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
