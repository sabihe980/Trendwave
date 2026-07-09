import { Metadata } from "next";
import FeaturesClient from "@/components/features-client";

export const metadata: Metadata = {
  title: "Postrick Platform Features — Multi-Channel Auto-Sync, Scheduler & AI Caption Assist",
  description: "Explore Postrick's comprehensive social media cockpit: cross-channel sync, smart calendar scheduling, advanced AI copilot caption writer, asset generators, and unified marketing analytics.",
  alternatives: {
    canonical: "https://postrick.io/features",
  },
  openGraph: {
    title: "Postrick Platform Features — Multi-Channel Social Cockpit",
    description: "Explore auto-sync publishing, interactive calendar planners, AI caption creators, brand kit generators, and real-time traction analytics.",
    url: "https://postrick.io/features",
    siteName: "Postrick",
    images: [
      {
        url: "https://postrick.io/og-image-features.jpg",
        width: 1200,
        height: 630,
        alt: "Postrick Features Deep-Dive",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postrick Platform Features — Auto-Sync & AI Cockpit",
    description: "Explore Postrick's cross-publishing suite, visual scheduler calendars, and AI copy generators.",
    images: ["https://postrick.io/og-image-features.jpg"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Postrick Social Command Center",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "featureList": [
      "Cross-Channel Multi-Platform Syncing",
      "Interactive Drag-and-Drop Calendar Planner",
      "AI-Powered Captions & Copywriting Copilot",
      "Creative Template & Brand Asset Generator",
      "Unified Performance and Traffic Analytics"
    ],
    "offers": {
      "@type": "Offer",
      "price": "29.00",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://postrick.io"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Features",
        "item": "https://postrick.io/features"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <FeaturesClient />
    </>
  );
}
