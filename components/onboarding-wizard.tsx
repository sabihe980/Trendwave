"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Users, Zap, 
  Layout, MessageSquare, Info, Star,
  Smartphone, Clock, Laptop, CheckCircle2, AlertCircle, 
  Eye, EyeOff, BarChart3, Building, User, Lock, Mail, Globe
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

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onbSubStep, setOnbSubStep] = useState(0);
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

    // Step 1: Create Account Validation (now split into Sub-step 0: Account, Sub-step 1: Workspace details)
    if (currentStep === 0) {
      if (onbSubStep === 0) {
        if (!email.trim() || !email.includes("@")) {
          setValidationError("Please provide a valid corporate email address.");
          return;
        }
        if (password.length < 6) {
          setValidationError("Your secure password must be at least 6 characters long.");
          return;
        }
        setOnbSubStep(1);
        return;
      } else {
        if (!fullName.trim()) {
          setValidationError("Please provide your full name to personalize your welcome banner.");
          return;
        }
        if (!businessName.trim()) {
          setValidationError("Please enter your organization or brand workspace name.");
          return;
        }

        // Simulate signup API delay (micro-interaction)
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
      }
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
    if (currentStep === 0 && onbSubStep === 1) {
      setOnbSubStep(0);
      return;
    }
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
      userName: fullName || "Ahmed",
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
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="font-bold flex items-center gap-1.5 text-[#C5E729]"><Layout className="w-3 h-3" /> dispatch_pipeline</span>
            <span className="text-[8px] bg-[#117644]/20 text-[#C5E729] px-1.5 py-0.5 rounded-md font-sans">Active</span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="p-1.5 bg-neutral-850 border border-neutral-800 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Reels Campaign Draft #4</span>
              <span className="text-stone-500">12:00 PM (Auto)</span>
            </div>
            <div className="p-1.5 bg-neutral-850 border border-neutral-800 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-neutral-200">LinkedIn Authority Article</span>
              <span className="text-stone-500">3:30 PM (Peak)</span>
            </div>
          </div>
          <div className="text-[8px] text-stone-500 text-center italic">
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
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9.5px] bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="space-y-1.5">
            <div className="text-[8px] text-stone-500 uppercase tracking-widest font-extrabold">Original Input</div>
            <p className="p-1.5 bg-neutral-850 rounded-lg text-neutral-300 border border-neutral-800">
              &ldquo;We made a new sustainable product check it out link in bio&rdquo;
            </p>
          </div>
          <div className="flex justify-center my-1 text-[#C5E729]">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <div className="text-[8px] text-[#C5E729] uppercase tracking-widest font-extrabold flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Postrick Professional Optimized
            </div>
            <p className="p-1.5 bg-[#C5E729]/5 border border-[#C5E729]/20 rounded-lg text-neutral-200 leading-relaxed font-semibold">
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
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-1.5 text-neutral-300 font-bold border-b pb-1.5 border-neutral-800">
            <Clock className="w-3.5 h-3.5 text-[#C5E729]" />
            <span>Optimal Publishing Nodes</span>
          </div>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-200">Instagram Feed</span>
              <span className="text-[#C5E729] font-extrabold bg-[#117644]/20 px-2 py-0.5 rounded">12:30 PM (Peak)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-200">LinkedIn Business</span>
              <span className="text-[#C5E729] font-extrabold bg-[#117644]/20 px-2 py-0.5 rounded">09:15 AM (Peak)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-200">TikTok Short</span>
              <span className="text-[#C5E729] font-extrabold bg-[#117644]/20 px-2 py-0.5 rounded">06:45 PM (Peak)</span>
            </div>
          </div>
          <div className="text-[8px] bg-[#117644]/20 text-[#C5E729] p-1 rounded-md text-center font-semibold">
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
      renderMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 font-mono text-[9px] bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between border-b pb-1.5 border-neutral-800">
            <span className="font-bold text-neutral-300 flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> organic_growth</span>
            <span className="text-emerald-400 font-extrabold">+24.8% This Month</span>
          </div>
          <div className="py-2 flex items-end justify-between h-16 px-4">
            <div className="w-3 bg-neutral-800 h-[30%] rounded-sm" />
            <div className="w-3 bg-neutral-800 h-[45%] rounded-sm" />
            <div className="w-3 bg-[#117644] h-[75%] rounded-sm animate-pulse" />
            <div className="w-3 bg-neutral-800 h-[60%] rounded-sm" />
            <div className="w-3 bg-[#C5E729] h-[95%] rounded-sm animate-pulse" />
          </div>
          <div className="flex justify-between text-[8px] text-stone-500">
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
    <div className="fixed inset-0 z-[9999] bg-[#02140b] overflow-y-auto flex items-center justify-center p-4 font-sans antialiased">
      {/* Subtle brand grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(17,118,68,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(17,118,68,0.07)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#117644]/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#C5E729]/10 blur-[130px]" />
      </div>

      {/* Ultra-elegant thin progress bar at the very top of the page */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#115e34]/30 z-[10000]">
        <motion.div 
          className="h-full bg-[#C5E729]" 
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Skip Button at the very top right */}
      {currentStep < TOTAL_STEPS - 1 && (
        <button 
          onClick={onSkip}
          className="fixed top-5 right-5 text-xs font-mono font-bold tracking-widest text-[#C5E729] hover:text-white uppercase transition-colors z-[10000] cursor-pointer"
        >
          Skip Onboarding &rarr;
        </button>
      )}

      {/* Main Single Column Dynamic Centered Wrapper */}
      <div className={`w-full transition-all duration-300 z-10 py-8 ${
        currentStep === 5 ? "max-w-[620px]" : currentStep === 4 ? "max-w-[500px]" : "max-w-[420px]"
      }`}>
        
        {/* VALIDATION ERROR BANNER */}
        <AnimatePresence>
          {validationError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-200 text-xs font-semibold flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${onbSubStep}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col"
          >
            {/* LOGO (Centered at top) */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2.5">
                <PostrickLogo className="w-8 h-8" color="#C5E729" bgStrokeColor="#02140b" />
                <span className="font-sans text-xl font-bold text-white tracking-tight">Postrick</span>
              </div>
            </div>

            {/* STEP CONTENT SWITCHBOARD */}
            
            {/* STEP 1: EMAIL & PASSWORD (Create Account) */}
            {currentStep === 0 && (
              <div className="text-left w-full">
                {onbSubStep === 0 ? (
                  /* SUB-STEP A: ACTUAL REPLICA OF THE BUFFER SIGNUP SCREEN */
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-[32px] font-sans font-semibold text-white tracking-tight leading-tight">
                        Create account
                      </h2>
                      <p className="text-sm text-stone-400 font-medium">
                        Already have an account? <span onClick={onSkip} className="text-[#C5E729] hover:underline cursor-pointer font-semibold transition-colors">Log in instead</span>
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-2">
                          Email
                        </label>
                        <input 
                          id="onb-email"
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-semibold text-stone-300">
                            Create Password
                          </label>
                          {password && (
                            <span className={`text-[9px] font-mono font-bold uppercase ${
                              passwordStrength.percent === 100 
                                ? "text-emerald-400" 
                                : passwordStrength.percent === 66 
                                ? "text-amber-400" 
                                : "text-rose-400"
                            }`}>
                              {passwordStrength.text}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input 
                            id="onb-password"
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Tracker strength lines */}
                        <div className="mt-2.5 h-1 w-full bg-neutral-900 rounded-full overflow-hidden flex gap-0.5">
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent >= 33 ? "w-1/3" : "w-0"}`} />
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent >= 66 ? "w-1/3" : "w-0"}`} />
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300 ${passwordStrength.percent === 100 ? "w-1/3" : "w-0"}`} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full bg-[#117644] hover:bg-[#189b5a] text-white py-3 rounded-lg text-sm font-semibold mt-4 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      Sign Up
                    </button>

                    <p className="text-xs text-stone-500 text-center pt-2 leading-relaxed">
                      By proceeding, you agree to Postrick&apos;s <span className="underline hover:text-stone-300 cursor-pointer">Terms of Service</span> and <span className="underline hover:text-stone-300 cursor-pointer">Privacy Policy</span>.
                    </p>
                  </div>
                ) : (
                  /* SUB-STEP B: CUSTOMIZE WORKSPACE (FULL NAME & BUSINESS NAME) */
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-[32px] font-sans font-semibold text-white tracking-tight leading-tight">
                        Tell us about yourself
                      </h2>
                      <p className="text-sm text-stone-400 font-medium">
                        Let&apos;s personalize your dynamic brand command center.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-2">
                          Your Full Name
                        </label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ahmed Al-Mansoori"
                          className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-2">
                          Workspace / Brand Name
                        </label>
                        <input 
                          type="text" 
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Savvy Monarch"
                          className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={isLoading}
                        className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isLoading}
                        className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <>Configure Profile <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PERSONALIZED WELCOME SCREEN */}
            {currentStep === 1 && (
              <div className="space-y-6 text-center">
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                  className="mx-auto w-16 h-16 rounded-full bg-[#117644]/25 text-[#C5E729] flex items-center justify-center shadow-md border border-[#117644]/40"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Welcome to Postrick
                  </h1>
                  <p className="text-sm text-stone-400 font-medium max-w-sm mx-auto leading-relaxed">
                    Let&apos;s get your business <span className="text-[#C5E729] font-semibold">&ldquo;{businessName || "Savvy Monarch"}&rdquo;</span> set up for success, <span className="font-semibold text-white">{fullName || "Ahmed"}</span>.
                  </p>
                </div>

                {/* High fidelity inline graphic representing synchronized dashboard */}
                <div className="p-5 rounded-2xl bg-[#031d10]/95 border border-[#115e34]/50 flex flex-col items-center gap-3 font-mono text-[10.5px] max-w-sm mx-auto shadow-lg text-left">
                  <div className="flex justify-between items-center w-full font-bold text-[#C5E729]">
                    <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5" /> Workspace Dispatch</span>
                    <span className="text-[9px] bg-[#117644]/20 text-[#C5E729] px-2 py-0.5 rounded-full font-sans uppercase font-black tracking-wider">Authorized</span>
                  </div>

                  <div className="w-full space-y-1.5 pt-1 text-stone-400">
                    <div className="flex justify-between border-b border-[#115e34]/20 pb-1.5">
                      <span>Server Node</span>
                      <span className="text-white font-bold">Node-A91_Green</span>
                    </div>
                    <div className="flex justify-between border-b border-[#115e34]/20 pb-1.5">
                      <span>Brand Registry</span>
                      <span className="text-white font-bold">Active & Saved</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption Protocol</span>
                      <span className="text-[#C5E729] font-bold">SHA-256 SSL</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Let&apos;s Start <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HOW WOULD YOU DESCRIBE YOURSELF? */}
            {currentStep === 2 && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Describe yourself
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    Select the role profile that aligns best with your organizational daily workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
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
                            ? "border-[#C5E729] bg-[#117644]/20 shadow-sm" 
                            : "border-[#115e34]/40 bg-[#031d10]/40 hover:border-[#117644]/80 hover:bg-[#031d10]/90"
                        }`}
                      >
                        <span className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
                          isSelected 
                            ? "bg-[#C5E729]/15 text-[#C5E729]" 
                            : "bg-neutral-900 text-stone-400"
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </span>
                        <div className="space-y-1 min-w-0">
                          <span className="block text-xs font-bold text-white">
                            {card.title}
                          </span>
                          <span className="block text-[11px] text-stone-400 leading-normal font-medium">
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
                      className="overflow-hidden pt-1"
                    >
                      <label className="block text-xs font-semibold text-stone-300 mb-2">
                        Specify your specific role description
                      </label>
                      <input 
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="e.g. Non-profit Digital Advocate, Brand Director"
                        className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: WHAT TOOLS DO YOU USE TO MANAGE SOCIAL MEDIA? */}
            {currentStep === 3 && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Tools in use
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    Select all social media management tools you actively deploy. (Multiple Selections Allowed).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
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
                            ? "border-[#C5E729] bg-[#117644]/20 text-[#C5E729] shadow-sm" 
                            : "border-[#115e34]/40 bg-[#031d10]/40 text-stone-300 hover:border-[#117644]/70 hover:bg-[#031d10]/90"
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
                      className="overflow-hidden pt-1"
                    >
                      <label className="block text-xs font-semibold text-stone-300 mb-2">
                        Specify alternative tools in use
                      </label>
                      <input 
                        type="text"
                        value={customTool}
                        onChange={(e) => setCustomTool(e.target.value)}
                        placeholder="e.g. Metricool, custom internal script, Airtable"
                        className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SOCIAL MEDIA MANAGEMENT (Section A & B) */}
            {currentStep === 4 && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Campaign Focus
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    Tell us about the scope of your active visual campaigns and channels.
                  </p>
                </div>

                {/* SECTION A: How many social accounts? */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#C5E729]">
                    Section A: How many accounts do you manage?
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["1–3", "4–10", "11–25", "26–50", "50+"].map((option) => {
                      const isSelected = accountCount === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAccountCount(option)}
                          className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? "border-[#C5E729] bg-[#C5E729] text-[#02140b] shadow-sm" 
                              : "border-[#115e34]/50 bg-[#031d10]/40 text-stone-300 hover:border-[#117644]"
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
                  <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#C5E729]">
                    Section B: Channels of Focus (Multiple)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                          className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? "border-[#C5E729] bg-[#117644]/20 text-[#C5E729] font-extrabold shadow-sm" 
                              : "border-[#115e34]/40 bg-[#031d10]/40 text-stone-400 hover:border-[#117644]"
                          }`}
                        >
                          <span className="p-1.5 rounded-full bg-[#02140b]">
                            <IconComp className="w-4 h-4 text-white" />
                          </span>
                          <span className="text-[10px] font-bold text-white">{plat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: DISCOVER POSTRICK (Interactive Showcase Carousel) */}
            {currentStep === 5 && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Capabilities
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    See how our specialized workflows accelerate visual campaign publication and audience activation.
                  </p>
                </div>

                {/* CAROUSEL CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[220px] pt-2">
                  {/* Visual Mockup Card */}
                  <div className="md:col-span-5 flex items-center justify-center">
                    <div className="w-full h-full max-w-[200px] md:max-w-none aspect-square md:aspect-auto">
                      {DISCOVER_SLIDES[carouselIndex].renderMock}
                    </div>
                  </div>

                  {/* Description Details Card */}
                  <div className="md:col-span-7 p-5 rounded-2xl border bg-[#031d10]/90 border-[#115e34]/50 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest font-black text-[#C5E729]">
                        Featured Capability
                      </span>
                      <h3 className="font-sans text-base font-bold text-white">
                        {DISCOVER_SLIDES[carouselIndex].title}
                      </h3>
                      <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                        {DISCOVER_SLIDES[carouselIndex].desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-dashed border-[#115e34]/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#C5E729]">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Benefit: {DISCOVER_SLIDES[carouselIndex].benefit}</span>
                      </div>
                      <div className="text-[9px] font-mono text-stone-500">
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
                            ? "bg-[#C5E729] w-6" 
                            : "bg-[#115e34] hover:bg-[#C5E729]/50"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCarouselIndex(prev => (prev === 0 ? DISCOVER_SLIDES.length - 1 : prev - 1))}
                      className="p-2 rounded-lg border border-[#115e34]/50 bg-[#031d10] hover:bg-[#117644]/20 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex(prev => (prev === DISCOVER_SLIDES.length - 1 ? 0 : prev + 1))}
                      className="p-2 rounded-lg border border-[#115e34]/50 bg-[#031d10] hover:bg-[#117644]/20 transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: HOW DID YOU HEAR ABOUT POSTRICK? */}
            {currentStep === 6 && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    Discovery
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    Help us understand how you found our marketing command studio to refine our channels.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
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
                            ? "border-[#C5E729] bg-[#117644]/20 text-[#C5E729] shadow-sm" 
                            : "border-[#115e34]/40 bg-[#031d10]/40 text-stone-300 hover:border-[#117644]/80 hover:bg-[#031d10]/90"
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
                      className="overflow-hidden pt-1"
                    >
                      <label className="block text-xs font-semibold text-stone-300 mb-2">
                        Specify alternative referral source
                      </label>
                      <input 
                        type="text"
                        value={customAttribution}
                        onChange={(e) => setCustomAttribution(e.target.value)}
                        placeholder="e.g. Substack Newsletter, Conference"
                        className="w-full bg-[#031d10]/90 border border-[#115e34]/50 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#C5E729] focus:ring-1 focus:ring-[#C5E729]/30 transition-all text-sm font-sans"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-[#1e2521] text-stone-300 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#28322c] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#117644] text-white py-3 rounded-lg text-sm font-semibold transition-all hover:bg-[#189b5a] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: FINAL COMPLETION SCREEN */}
            {currentStep === 7 && (
              <div className="space-y-6 text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm"
                >
                  <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </motion.div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                    You&apos;re all set!
                  </h1>
                  <p className="text-xs text-[#C5E729] font-extrabold uppercase tracking-widest font-mono">
                    Security profiles authorized
                  </p>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed max-w-sm mx-auto">
                    Welcome to Postrick, <strong className="text-white font-bold">{fullName || "Ahmed"}</strong>. Your brand campaign workspace <strong className="text-white font-bold">&ldquo;{businessName || "Savvy Monarch"}&rdquo;</strong> is ready for launch.
                  </p>
                </div>

                {/* Interactive toggle option */}
                <div className="p-4 rounded-xl border border-[#115e34]/50 bg-[#031d10]/90 flex items-center justify-between text-left max-w-sm mx-auto cursor-pointer transition-colors" onClick={() => setScheduleFirstCampaign(!scheduleFirstCampaign)}>
                  <div className="space-y-0.5 pr-4 min-w-0">
                    <span className="block text-xs font-bold text-white">
                      Pre-populate sample campaign drafts
                    </span>
                    <span className="block text-[10px] text-stone-500 font-medium leading-normal">
                      Populate active channels queues with pre-structured campaigns for immediate testing.
                    </span>
                  </div>
                  <div className={`w-10 h-6.5 rounded-full p-1 transition-colors relative flex-shrink-0 cursor-pointer ${
                    scheduleFirstCampaign ? "bg-[#117644]" : "bg-neutral-900"
                  }`}>
                    <motion.div 
                      className="w-4.5 h-4.5 bg-white rounded-full shadow-md"
                      animate={{ x: scheduleFirstCampaign ? 14 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-stone-500 leading-normal font-medium max-w-sm mx-auto pt-2">
                  Click &ldquo;Go to Dashboard&rdquo; below to unlock your active calendar queues, visual composer, and generative caption studios.
                </p>

                <div className="pt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleFinalize}
                    className="w-full bg-[#C5E729] hover:bg-[#b0d022] text-[#02140b] py-3.5 rounded-lg text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider font-sans"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(5); // Go back to the Discover Carousel step!
                      setCarouselIndex(0);
                    }}
                    className="w-full bg-transparent hover:bg-white/5 text-stone-300 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Take a Quick Tour
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
