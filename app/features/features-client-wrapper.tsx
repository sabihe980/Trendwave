"use client";

import dynamic from "next/dynamic";

const FeaturesClient = dynamic(() => import("@/components/features-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#042F1A]" />
        <p className="text-sm text-[#042F1A] font-medium font-sans">Loading features...</p>
      </div>
    </div>
  ),
});

export default function FeaturesClientWrapper() {
  return <FeaturesClient />;
}
