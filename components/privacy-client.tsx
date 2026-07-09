"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PostrickLogo } from "./icons";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Globe, 
  Scale, 
  CheckCircle2, 
  ChevronRight, 
  Mail, 
  ExternalLink,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

// Custom SVG Brand Icons to keep consistent with LandingPage
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

const SECTIONS = [
  { id: "introduction", label: "1. Introduction" },
  { id: "scope", label: "2. Scope & Applicability" },
  { id: "definitions", label: "3. Key Definitions" },
  { id: "information-collected", label: "4. Information We Collect" },
  { id: "how-we-use", label: "5. How We Process Data" },
  { id: "ai-processing", label: "6. AI Processing & Generative Models" },
  { id: "social-connections", label: "7. Third-Party Integrations & APIs" },
  { id: "cookies", label: "8. Cookies & Tracking" },
  { id: "retention", label: "9. Data Retention & Erasure" },
  { id: "security", label: "10. Security & Encryption" },
  { id: "international-transfers", label: "11. International Transfers" },
  { id: "user-rights", label: "12. Your Rights (GDPR / CCPA)" },
  { id: "childrens-privacy", label: "13. Children's Privacy" },
  { id: "breach-notification", label: "14. Data Breach Notifications" },
  { id: "business-transfers", label: "15. Corporate Actions" },
  { id: "contact-us", label: "16. Contact Information" },
];

export default function PrivacyPolicyClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#042F1A]" />
          <p className="text-sm text-[#042F1A] font-medium font-sans">Loading Postrick...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased overflow-x-hidden min-h-screen bg-[#FAF6EE] text-[#052414]">
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 transition-all glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/?app=false" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
              <PostrickLogo className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" color="#1E3216" bgStrokeColor="#FAF6EE" />
              <span className="font-serif font-black tracking-tight text-lg sm:text-2xl italic text-[#02180c]">
                Postrick<span className="text-[10px] font-sans not-italic font-bold align-super">®</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-[#042F1A]">
              <Link href="/features" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">
                Features
              </Link>
              
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
                  <div className="absolute top-[22px] left-1/2 -translate-x-1/2 mt-2 w-64 glass-modal rounded-2xl shadow-xl p-4 z-50 text-left normal-case tracking-normal">
                    <p className="text-[10px] font-mono font-extrabold text-[#117644] uppercase tracking-wider mb-2.5">
                      6 Connected Platforms
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-[#042F1A]">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><TikTokIcon className="w-3.5 h-3.5 text-slate-800" /> TikTok</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><PinterestIcon className="w-3.5 h-3.5 text-red-600" /> Pinterest</div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FAF5EB] transition-colors"><Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn</div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/?app=false#reviews" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Reviews</Link>
              <Link href="/?app=false#pricing" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">Pricing</Link>
              <Link href="/?app=false#faq" className="hover:text-[#117644] transition-colors pb-1 border-b-2 border-transparent hover:border-[#117644]">FAQ</Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link 
                href="/?app=true"
                className="inline-flex items-center justify-center py-2 px-4 sm:py-2.5 sm:px-5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-pointer border-2 border-current text-current bg-transparent hover:bg-black/5 transition-all font-extrabold"
              >
                Log In
              </Link>
              <Link 
                href="/?app=true"
                className="inline-flex items-center justify-center py-2 px-4 sm:py-2.5 sm:px-6 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#117644] transition-colors bg-[#042F1A] text-[#FAF6EE] shadow-md"
              >
                Get Started
              </Link>

              {/* Mobile Menu Icon */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-current opacity-80 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
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
            className="md:hidden border-b overflow-hidden font-bold text-xs bg-[#FAF6EE] border-[#eae3d2]"
          >
            <div className="px-4 py-5 space-y-3.5 flex flex-col font-black uppercase tracking-widest text-[#042F1A]">
              <Link href="/features" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Features</Link>
              <Link href="/?app=false#reviews" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Reviews</Link>
              <Link href="/?app=false#pricing" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">Pricing</Link>
              <Link href="/?app=false#faq" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#117644]">FAQ</Link>
              <Link href="/?app=true" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full border border-current text-current">Log In</Link>
              <Link href="/?app=true" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full bg-[#042F1A] text-[#FAF6EE]">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-[#eae3d2]/60 bg-gradient-to-b from-white/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#117644]/10 text-[#117644] text-[10px] font-mono tracking-wider uppercase font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>GLOBAL PRIVACY STANDARDS</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5.5xl font-black tracking-tight text-[#02180c] leading-tight">
            Enterprise Privacy Policy
          </h1>
          
          <p className="text-sm sm:text-base leading-relaxed text-[#042F1A]/80 max-w-2xl mx-auto font-normal">
            How Postrick collects, processes, and protects your information. Designed in alignment with the General Data Protection Regulation (GDPR), UK GDPR, and California Consumer Privacy Act (CCPA).
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#042F1A]/60">
            <span className="bg-white/60 px-3 py-1 rounded-md border border-[#eae3d2]/40">Last Updated: July 3, 2026</span>
            <span className="bg-white/60 px-3 py-1 rounded-md border border-[#eae3d2]/40">Version: 2.1.0-prod</span>
          </div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* LEFT: Sticky Navigation (ToC) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 bg-white/40 p-6 rounded-2xl border border-[#eae3d2]/60 backdrop-blur-sm shadow-sm space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#117644] font-black border-b border-[#042F1A]/10 pb-2 mb-3">
              Document Sections
            </h3>
            <nav className="space-y-1.5 flex flex-col">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-[#042F1A] text-[#FAF6EE] font-bold"
                      : "text-[#042F1A]/70 hover:bg-[#042F1A]/5 hover:text-[#042F1A]"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#042F1A]/10 text-[10px] leading-relaxed text-[#042F1A]/50 font-mono">
              Need a physical copy? Press <kbd className="bg-neutral-200 px-1 rounded">Ctrl+P</kbd> or <kbd className="bg-neutral-200 px-1 rounded">Cmd+P</kbd> to save.
            </div>
          </aside>

          {/* RIGHT: Detailed Legal Text */}
          <article className="col-span-1 lg:col-span-3 space-y-12">
            
            {/* Regulatory Compliance / Lawyer Disclaimer Box */}
            <div className="p-6 rounded-2xl border-2 border-[#117644]/40 bg-[#117644]/5 flex items-start gap-4">
              <Scale className="w-5 h-5 text-[#117644] shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-[#042F1A] font-serif">Legal Consultation Disclaimer</h4>
                <p className="leading-relaxed text-[#042F1A]/80 font-normal">
                  This document serves as Postrick&apos;s master operational privacy policy designed to meet international standards (including GDPR and CCPA/CPRA). Prior to official public launch or major platform capitalization, this document should be formally audited and customized by a qualified legal advisor to align perfectly with state-specific and country-specific regulatory registries.
                </p>
              </div>
            </div>

            {/* Content Sections */}
            
            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">01</span>
                Introduction
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Welcome to Postrick (referred to herein as &ldquo;Postrick,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Postrick provides an AI-powered, isomorphic social media management Software-as-a-Service (SaaS) application designed to facilitate social media publishing, scheduling, caption writing, analytics tracking, and digital assets creation.
                </p>
                <p>
                  We are deeply committed to protecting the privacy, security, and integrity of your personal data. This Privacy Policy details our systematic protocols regarding how we gather, process, store, disclose, and delete information when you interact with our website, our APIs, our dashboard tools, or use our mobile configurations.
                </p>
                <p>
                  By accessing or using our services, you express your consent to the practices described in this policy. If you do not agree with these provisions, you must immediately terminate use of our dashboard services and remove any active browser cookies associated with Postrick.
                </p>
              </div>
            </section>

            {/* Section 2: Scope & Applicability */}
            <section id="scope" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">02</span>
                Scope & Applicability
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  This Privacy Policy applies to all individuals who utilize our services, including individual content creators, corporate marketing managers, digital publishing agencies, affiliate marketers, and visitors browsing our marketing portal.
                </p>
                <p>
                  This policy covers data collected online via our primary domain, subdomains, connected API endpoints, live-support chats, or interactive feedback logs. It does not govern any third-party networks, sites, or offline partnerships that we do not own or control directly, although we outline how our authorized connections process and transmit data with other major platforms.
                </p>
              </div>
            </section>

            {/* Section 3: Key Definitions */}
            <section id="definitions" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">03</span>
                Key Definitions
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  To clarify the terms used throughout this document, the following concepts are defined as follows:
                </p>
                <ul className="space-y-3 pl-4 border-l-2 border-[#117644]/30">
                  <li>
                    <strong className="text-[#02180c]">Personal Data:</strong> Any information relating to an identified or identifiable natural person (&ldquo;Data Subject&rdquo;) under GDPR parameters, or &ldquo;Consumer Information&rdquo; under California statute CCPA.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Usage Data:</strong> Information generated automatically by the use of the Service or from the Service infrastructure itself (e.g., page load speeds, IP logs, session timings).
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Data Controller:</strong> The natural or legal person who determines the purposes and means of the processing of personal data. For our retail users, Postrick acts as the Data Controller.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Data Processor / Service Provider:</strong> A person, agency, or corporation that processes personal data on behalf of the Data Controller.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Information We Collect */}
            <section id="information-collected" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">04</span>
                Information We Collect
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  To deliver seamless cross-posting, scheduling and AI creation services, we must collect information that falls under two primary categories: information you provide voluntarily and information collected automatically.
                </p>

                <h3 className="font-serif text-md font-bold text-[#02180c] pt-2">A. Information You Voluntarily Provide</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#02180c]">Account & Contact Data:</strong> When you register an account, we collect your email address, password, full name, profile picture, and contact details.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Authentication Credentials:</strong> If you use third-party OAuth channels (such as Google OAuth, Facebook, or Vercel login), we collect your unique identity token, user email, and basic profile indicators provided securely by the authenticator.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Uploaded Content Assets:</strong> We process any visual assets (images, graphics, video clips) and texts that you upload into our content calendar, media library, or scheduling dashboard to dispatch them to your active social networks.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">AI Prompt Inputs:</strong> Any conversational cues, post concepts, tone indicators, or image descriptions you supply to our AI Caption Generator or AI Image Suite are captured to perform processing via our generative models.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Billing and Transactions:</strong> We do NOT store full credit card numbers directly. Payments are securely intercepted and executed by our certified third-party payment processors (e.g., Stripe, PayPal). They share with us non-sensitive payment transaction IDs, billing addresses, card types, and renewal schedules.
                  </li>
                </ul>

                <h3 className="font-serif text-md font-bold text-[#02180c] pt-2">B. Information Collected Automatically</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#02180c]">Device & Network Metrics:</strong> We log device model identifiers, operating system versions, browser types, local languages, network carriers, and precise IP addresses.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">SaaS Usage Information:</strong> We track your active sessions within the dashboard, page clicks, button states, active workspace creation, cross-posting volumes, and successful scheduling times.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: How We Process Data */}
            <section id="how-we-use" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">05</span>
                How We Process Data
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  We process personal information under strict legal bases as defined by the GDPR, including contractual necessity, legitimate business interest, legal compliance, and user consent. The primary operational objectives for processing include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white/50 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#117644]">Contractual Execution</span>
                    <p className="text-xs">Creating accounts, executing subscription agreements, syncing social profiles, and routing automated posts.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white/50 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#117644]">Legitimate Interest</span>
                    <p className="text-xs">Improving dashboard performance, refining AI models, analyzing traffic, and maintaining network firewalls.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white/50 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#117644]">Consent-Based Processing</span>
                    <p className="text-xs">Subscribing to product newsletters, tracking marketing pixels, and executing advanced workspace collaborations.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white/50 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#117644]">Regulatory Standards</span>
                    <p className="text-xs">Retaining transaction history for auditing, complying with law enforcement warrants, and blocking bots.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: AI Processing & Generative Models */}
            <section id="ai-processing" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">06</span>
                AI Processing & Generative Models
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Postrick leverages advanced AI models, including Google Gemini API interfaces, to power our AI Caption Generator, AI Hashtag generator, and image asset features.
                </p>
                <p>
                  When you submit prompts or text assets for AI generation:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Your prompt parameters are processed server-side through secure API endpoints.</li>
                  <li>We do NOT sell or lease your raw text or graphical prompts to any AI model training repositories.</li>
                  <li>Your generated caption drafts and completed images are stored on our secure hosting databases to enable editing, calendar arrangement, and multi-platform posting at later dates.</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Third-Party Integrations & APIs */}
            <section id="social-connections" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">07</span>
                Third-Party Integrations & APIs
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Postrick utilizes certified API developer keys to allow programmatic cross-posting. Our operations are fully compliant with the guidelines of our partner networks:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#02180c]">Google / YouTube API Services:</strong> When you connect your YouTube Channel via Google OAuth, Postrick accesses your channel information and upload metadata under strict YouTube API Services Terms of Service. You can modify or revoke access at any time via the <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-[#117644] underline font-bold inline-flex items-center gap-0.5">Google Security Page <ExternalLink className="w-3 h-3 inline" /></a>.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Meta APIs (Instagram & Facebook):</strong> We process access tokens to dispatch visual posts and captions onto your authorized Instagram Professional accounts and Facebook Pages.
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Other Social API Interfaces:</strong> We interface securely with TikTok, LinkedIn, and Pinterest developer sandboxes. Your private passwords and authorization credentials are kept fully isolated and encrypted using AES-256 frameworks.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 8: Cookies & Tracking */}
            <section id="cookies" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">08</span>
                Cookies & Tracking
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Cookies are tiny text files loaded onto your computer browser when you visit websites. We use cookies to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Keep your sessions authorized as you navigate your workspaces.</li>
                  <li>Remember your preferences (such as dark mode preferences, or collapse panels).</li>
                  <li>Analyze traffic trends anonymously via analytics cookies (e.g., Google Analytics).</li>
                </ul>
                <p>
                  You can set your browser configurations to reject all cookies or notify you when a cookie is dispatched. However, disabling essential session cookies will prevent the Postrick dashboard from authenticating you.
                </p>
              </div>
            </section>

            {/* Section 9: Data Retention & Erasure */}
            <section id="retention" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">09</span>
                Data Retention & Erasure
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  We keep your personal information only for as long as your account remains active or as required to fulfill contractual and legal responsibilities:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Active account profiles and connected social access tokens are maintained until you initiate account deletion.</li>
                  <li>Expired connection tokens and draft assets are periodically auto-archived after 180 days of user inactivity.</li>
                  <li>Upon formal request of account termination, we purge or anonymize your complete record within 30 days, in strict compliance with GDPR standards.</li>
                </ul>
              </div>
            </section>

            {/* Section 10: Security & Encryption */}
            <section id="security" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">10</span>
                Security & Encryption
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Postrick maintains strict, industry-leading technical and administrative protocols to protect your files and personal identities:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-[#02180c]">Encryption in Transit:</strong> All data transmissions are forced through HTTPS protocols with high-strength Transport Layer Security (TLS 1.3).
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Encryption at Rest:</strong> Database assets, profiles, and API connection tokens are encrypted on cloud servers using Advanced Encryption Standard (AES-256).
                  </li>
                  <li>
                    <strong className="text-[#02180c]">Server Isolation:</strong> Our systems run on Vercel/Cloud Run containers behind advanced web application firewalls (WAF) to filter malicious attacks.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 11: International Transfers */}
            <section id="international-transfers" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">11</span>
                International Transfers
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Postrick operates globally. Information collected from you may be stored, transferred, and processed in the United States, European Union, or other territory where our cloud providers host servers.
                </p>
                <p>
                  When executing international transfers of European Union or United Kingdom data, we rely on Standard Contractual Clauses (SCCs) certified by the European Commission, ensuring your rights are consistently protected.
                </p>
              </div>
            </section>

            {/* Section 12: Your Rights (GDPR / CCPA) */}
            <section id="user-rights" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">12</span>
                Your Rights (GDPR / CCPA)
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Depending on your jurisdiction, you possess specific rights regarding your personal information:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#117644] shrink-0" />
                    <div className="space-y-1">
                      <strong className="text-xs font-serif text-[#02180c] block">Right of Access (GDPR)</strong>
                      <p className="text-[11px] leading-relaxed text-[#042F1A]/70">You can request a full exported copy of all personal information we store about you.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#117644] shrink-0" />
                    <div className="space-y-1">
                      <strong className="text-xs font-serif text-[#02180c] block">Right of Deletion (&ldquo;Right to be Forgotten&rdquo;)</strong>
                      <p className="text-[11px] leading-relaxed text-[#042F1A]/70">You can command us to erase your full profile and credentials from our databases.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#117644] shrink-0" />
                    <div className="space-y-1">
                      <strong className="text-xs font-serif text-[#02180c] block">Right of Rectification</strong>
                      <p className="text-[11px] leading-relaxed text-[#042F1A]/70">Correct any outdated, inaccurate, or incomplete information associated with your profile.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#eae3d2] bg-white flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#117644] shrink-0" />
                    <div className="space-y-1">
                      <strong className="text-xs font-serif text-[#02180c] block">No Discrimination (CCPA)</strong>
                      <p className="text-[11px] leading-relaxed text-[#042F1A]/70">We never penalize or charge different rates to consumers who exercise their statutory privacy rights.</p>
                    </div>
                  </div>
                </div>
                <p className="pt-2">
                  To trigger any of these rights, please draft a clear request and submit it to our designated privacy desk at <a href="mailto:privacy@postrick.io" className="text-[#117644] font-bold underline">privacy@postrick.io</a>.
                </p>
              </div>
            </section>

            {/* Section 13: Children's Privacy */}
            <section id="childrens-privacy" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">13</span>
                Children&apos;s Privacy
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  Our services are directed to individuals who are at least 16 years of age (or older, depending on local statutory limits). We do not knowingly solicit, collect, or process information from children under the age of 13.
                </p>
                <p>
                  If we discover that a child under the age of 13 has registered an account and transmitted personal identifiers, we will execute immediate deletion procedures to wipe the profile and alert the parent or guardian.
                </p>
              </div>
            </section>

            {/* Section 14: Data Breach Notifications */}
            <section id="breach-notification" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">14</span>
                Data Breach Notifications
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  We maintain active network surveillance tools. In the highly unlikely event that a security incident compromises your personal data, we adhere strictly to regulatory disclosure timelines.
                </p>
                <p>
                  We will notify you via email and post details in our system logs within 72 hours of identifying a verified breach, including details regarding the affected fields and recommend countermeasures.
                </p>
              </div>
            </section>

            {/* Section 15: Corporate Actions */}
            <section id="business-transfers" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">15</span>
                Corporate Actions
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  In the event that Postrick executes a corporate reorganization, merger, acquisition, joint venture, or asset liquidation, your personal information may be transferred as part of the transaction assets.
                </p>
                <p>
                  We will alert you via email before your personal information is relocated or becomes subject to a significantly different privacy policy template.
                </p>
              </div>
            </section>

            {/* Section 16: Contact Information */}
            <section id="contact-us" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl font-black text-[#02180c] flex items-center gap-2">
                <span className="text-xs font-mono bg-[#117644]/10 text-[#117644] py-1 px-2.5 rounded">16</span>
                Contact Information
              </h2>
              <div className="text-[13px] leading-relaxed text-[#042F1A]/85 font-normal space-y-4 font-sans">
                <p>
                  If you have questions, complaints, or need clarification regarding this global Privacy Policy, please reach out to our team at:
                </p>
                <div className="p-6 rounded-2xl border border-[#eae3d2] bg-[#FAF5EB] space-y-3 max-w-md">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#117644]" />
                    <span className="font-bold text-[#02180c]">Postrick Support Desk</span>
                  </div>
                  <p className="text-xs text-[#042F1A]/85 leading-relaxed font-medium">
                    Postrick Inc.<br />
                    Attn: Privacy Office & Data protection<br />
                    100 Pine Street, Floor 18<br />
                    San Francisco, CA 94111, USA<br />
                    Email: <a href="mailto:privacy@postrick.io" className="text-[#117644] underline font-bold">privacy@postrick.io</a>
                  </p>
                </div>
              </div>
            </section>

          </article>

        </div>
      </section>

      {/* Footer Area */}
      <footer className="border-t border-[#042F1A] bg-[#042F1A] text-[#FAF6EE]/80 py-16 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10">
          
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C5E729] text-[#032011] font-serif font-black italic text-xs leading-none">
                P
              </span>
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
              <li><Link href="/?app=true" className="hover:text-white transition-colors text-left block">Auto-Publish</Link></li>
              <li><Link href="/?app=true" className="hover:text-white transition-colors text-left block">Schedule Calendar</Link></li>
              <li><Link href="/?app=true" className="hover:text-white transition-colors text-left block">Analytics</Link></li>
              <li><Link href="/?app=true" className="hover:text-white transition-colors text-left block">Caption Generator</Link></li>
              <li><Link href="/?app=true" className="hover:text-white transition-colors text-left block">AI Image Generator</Link></li>
              <li><Link href="/?app=false#pricing" className="hover:text-white transition-colors text-left block">Pricing List</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">Company</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">About Careers</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Press Material</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Corporate Integrity</Link></li>
              <li>
                <Link 
                  href="/?app=true" 
                  className="hover:text-white transition-colors text-left text-[#C5E729] font-bold flex items-center gap-1.5"
                >
                  Affiliate Program 
                  <span className="bg-[#C5E729]/15 text-[#C5E729] font-sans text-[8px] py-0.5 px-1.5 rounded uppercase font-bold tracking-wider">
                    30% RECUR
                  </span>
                </Link>
              </li>
              <li><Link href="/?app=true" className="hover:text-white transition-colors font-semibold block">Contact Sales</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-mono text-[9px] uppercase tracking-widest mb-4 text-[#C5E729] font-black">General SLA</h4>
            <ul className="space-y-2.5 opacity-80 font-medium">
              <li><Link href="/privacy" className="hover:text-white transition-colors block font-bold text-[#C5E729]">Privacy Policy</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Usage Indemnity</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">API Boundaries</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Security Protocols</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Cookie Disapproval</Link></li>
              <li><Link href="/?app=false" className="hover:text-white transition-colors block">Opt-out Register</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
