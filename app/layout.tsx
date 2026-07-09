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
  title: "Postrick — Enterprise Social Media Management & AI Assistant",
  description: "Cross-publish, schedule, and automate organic growth. Leverage AI content design assist, post calendars, analytics, and deep engagement tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    return (
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable}`}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Capture phase listener to detect <script> or <link> load failures
                window.addEventListener('error', function(e) {
                  var target = e.target;
                  if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
                    var url = target.src || target.href || '';
                    if (url.indexOf('/_next/static/') !== -1) {
                      console.warn("Static asset load failure captured, reloading:", url);
                      window.location.reload();
                    }
                  }
                }, true);

                // Standard error listener (with safety filters)
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.indexOf('ResizeObserver') !== -1) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return;
                  }
                  var errorObj = e.error || {};
                  var message = e.message || errorObj.message || '';
                  var isChunkError = /Loading( chunk)?|ChunkLoadError|failed to fetch|Script error/i.test(message);
                  if (isChunkError) {
                    console.warn("Detected chunk load error, reloading page...");
                    window.location.reload();
                  }
                });

                // Unhandled rejection listener (for dynamic import rejections)
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && e.reason.message && e.reason.message.indexOf('ResizeObserver') !== -1) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return;
                  }
                  var message = e.reason && (e.reason.message || String(e.reason)) || '';
                  var isChunkError = /Loading( chunk)?|ChunkLoadError|failed to fetch/i.test(message);
                  if (isChunkError) {
                    console.warn("Detected dynamic chunk load rejection, reloading page...");
                    window.location.reload();
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
  } catch (error) {
    console.error("CRITICAL ERROR IN app/layout.tsx:", error);
    throw error;
  }
}
