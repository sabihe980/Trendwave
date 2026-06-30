import type { Metadata } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Trend Wave - Next-Gen Social Automation",
  description: "Cross-publish, schedule, and automate social growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.indexOf('ResizeObserver') !== -1 ||
                  e.message.indexOf('Script error') !== -1
                )) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && (
                  e.reason.message.indexOf('ResizeObserver') !== -1 ||
                  e.reason.message.indexOf('Script error') !== -1
                )) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
            `
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-[#FAF6EE] text-[#052414] transition-colors duration-250">
        {children}
      </body>
    </html>
  );
}
