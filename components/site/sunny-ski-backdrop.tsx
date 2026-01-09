"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function SunnySkiBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("sunny-ski-backdrop", className)} aria-hidden="true">
      <div className="sunny-ski-bg" />
      <div className="sunny-ski-clouds">
        <div className="sunny-ski-cloud sunny-ski-cloud-1" />
        <div className="sunny-ski-cloud sunny-ski-cloud-2" />
        <div className="sunny-ski-cloud sunny-ski-cloud-3" />
        <div className="sunny-ski-cloud sunny-ski-cloud-4" />
        <div className="sunny-ski-cloud sunny-ski-cloud-5" />
        <div className="sunny-ski-cloud sunny-ski-cloud-6" />
        <div className="sunny-ski-cloud sunny-ski-cloud-7" />
      </div>
      <div className="sunny-ski-snow">
        {Array.from({ length: 180 }).map((_, i) => (
          <div
            key={i}
            className="sunny-ski-snowflake"
            style={{
              left: `${(i * 3.7) % 100}%`,
              animationDelay: `${(i * 0.05) % 8}s`,
              animationDuration: `${8 + (i % 12)}s`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
            }}
          />
        ))}
      </div>
      <div className="sunny-ski-sun-glare" />
      <div className="sunny-ski-haze" />
    </div>
  );
}

