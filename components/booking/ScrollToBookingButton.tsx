"use client";

import { Button } from "@/components/ui/button";

export function ScrollToBookingButton() {
  const handleClick = () => {
    const form = document.getElementById("booking-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      // Небольшая задержка для лучшего позиционирования
      setTimeout(() => {
        const yOffset = -20;
        const y = form.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <Button onClick={handleClick}>
      Request booking
    </Button>
  );
}

