import Link from "next/link";

export default function NotFound() {
  try {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF6EE] text-[#052414] px-4 text-center">
        <h1 className="font-serif text-6xl font-black italic tracking-tight text-[#042F1A] mb-4">404</h1>
        <h2 className="text-xl font-bold mb-6 text-[#02180c]">Page Not Found</h2>
        <p className="text-sm opacity-80 max-w-md mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been relocated. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest bg-[#042F1A] text-[#FAF6EE] hover:bg-[#117644] transition-colors shadow-md"
        >
          Go Back Home
        </Link>
      </div>
    );
  } catch (error) {
    console.error("CRITICAL ERROR IN app/not-found.tsx:", error);
    throw error;
  }
}
