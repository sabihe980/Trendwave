import { Metadata } from "next";
import HomeClient from "@/components/home-client";

export const metadata: Metadata = {
  title: "Postrick — Enterprise Social Media Management & AI Assistant",
  description: "Cross-publish, schedule, and automate organic growth. Leverage AI content design assist, post calendars, analytics, and deep engagement tracking.",
  alternates: {
    canonical: "https://postrick.io",
  },
  openGraph: {
    title: "Postrick — Enterprise Social Media Management & AI Assistant",
    description: "Cross-publish, schedule, and automate organic social growth. Built with advanced AI tools, sitemaps, and multi-platform analytics tracking.",
    url: "https://postrick.io",
    siteName: "Postrick",
    images: [
      {
        url: "https://postrick.io/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Postrick Social Command Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postrick — Enterprise Social Media Management & AI Assistant",
    description: "Cross-publish, schedule, and automate organic growth.",
    images: ["https://postrick.io/og-image.jpg"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Postrick",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "29.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1240"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://postrick.io",
    "name": "Postrick",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://postrick.io/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient />
    </>
  );
}
