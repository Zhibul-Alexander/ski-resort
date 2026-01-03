"use client";

import { useEffect } from "react";

/**
 * Компонент для скроллинга к форме бронирования при загрузке страницы с hash #booking-form
 */
export function ScrollToBookingOnLoad() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#booking-form") {
      // Небольшая задержка для того, чтобы DOM успел загрузиться
      setTimeout(() => {
        const form = document.getElementById("booking-form");
        if (form) {
          const yOffset = -20;
          const y = form.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return null;
}

