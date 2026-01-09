"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function SunnySkiBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("sunny-ski-backdrop", className)} aria-hidden="true">
      <div className="sunny-ski-bg" />
      <div className="sunny-ski-sun-glare" />
      <div className="sunny-ski-haze" />
    </div>
  );
}

