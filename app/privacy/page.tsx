import { Metadata } from "next";
import PrivacyPolicyClient from "@/components/privacy-client";

export const metadata: Metadata = {
  title: "Postrick Privacy Policy & Data Processing Standards",
  description: "Read Postrick's comprehensive privacy policy, details on user access controls, secure encryption measures, and multi-network OAuth compliance in accordance with CCPA/GDPR/UK-GDPR regulations.",
  alternates: {
    canonical: "https://postrick.io/privacy",
  },
  openGraph: {
    title: "Postrick Privacy Policy & Processing Rules",
    description: "Review Postrick's security protocols, AES-255 tokens encryption, prompt logs policy, sitemaps, and regulatory disclosure standards.",
    url: "https://postrick.io/privacy",
    siteName: "Postrick",
    images: [
      {
        url: "https://postrick.io/og-image-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "Postrick Security & Privacy Suite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postrick Privacy Policy & Safety Rules",
    description: "Explore Postrick's AES-256 tokens encryption, compliance matrices, and personal data access procedures.",
    images: ["https://postrick.io/og-image-privacy.jpg"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Postrick Privacy Policy",
    "description": "Enterprise-grade privacy rules, cookie disapproval, secure OAuth, and regulatory GDPR/CCPA disclosures.",
    "publisher": {
      "@type": "Organization",
      "name": "Postrick Inc.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://postrick.io/favicon.ico"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PrivacyPolicyClient />
    </>
  );
}
