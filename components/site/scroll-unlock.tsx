"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Страховка от залипания скролла после модалок/меню.
 * На смену маршрута снимает любые lock-стили с html/body.
 */
export function ScrollUnlockOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Сбрасываем возможные inline-стили блокировки скролла
    [html, body].forEach((el) => {
      el.style.overflow = "";
      el.style.position = "";
      el.style.height = "";
      el.style.touchAction = "";
    });

    // Удаляем utility-классы, если они зависли
    html.classList.remove("overflow-hidden");
    body.classList.remove("overflow-hidden");
  }, [pathname]);

  return null;
}

