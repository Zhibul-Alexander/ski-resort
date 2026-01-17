"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface BookingButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function BookingButton({ children, className }: BookingButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('booking-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Button asChild className={className}>
      <a href="#booking-form" onClick={handleClick}>
        {children}
      </a>
    </Button>
  );
}

