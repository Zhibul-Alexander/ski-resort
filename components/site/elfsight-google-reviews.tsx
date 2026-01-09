"use client";

import { useEffect } from "react";

interface ElfsightGoogleReviewsProps {
  widgetId?: string;
  className?: string;
}

export function ElfsightGoogleReviews({ widgetId, className = "" }: ElfsightGoogleReviewsProps) {
  useEffect(() => {
    // Загружаем скрипт Elfsight, если его еще нет
    if (typeof window !== "undefined" && !document.querySelector('script[src*="elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Функция для скрытия рекламной ссылки
    const hideElfsightLink = () => {
      const links = document.querySelectorAll('a[href*="elfsight"], a[href*="google-reviews"]');
      links.forEach((link) => {
        const element = link as HTMLElement;
        const style = element.getAttribute('style') || '';
        // Проверяем характерные стили рекламной ссылки
        if (
          style.includes('z-index:999999999') ||
          style.includes('translateX(-50%)') ||
          style.includes('background-color:rgba(238, 238, 238, 0.9)') ||
          element.textContent?.includes('Free Google Reviews Widget')
        ) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.height = '0';
          element.style.width = '0';
          element.style.margin = '0';
          element.style.padding = '0';
          element.style.overflow = 'hidden';
          element.style.position = 'absolute';
          element.style.left = '-9999px';
          element.style.pointerEvents = 'none';
        }
      });
    };

    // Скрываем ссылку сразу и периодически проверяем (виджет загружается асинхронно)
    hideElfsightLink();
    const interval = setInterval(hideElfsightLink, 500);
    
    // Очистка интервала через 10 секунд (виджет должен загрузиться)
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  // Получаем ID виджета из пропсов
  const appId = widgetId;

  if (!appId) {
    return (
      <div className={`p-8 text-center text-muted-foreground ${className}`}>
        <p>Пожалуйста, укажите ID виджета Elfsight Google Reviews</p>
        <p className="text-sm mt-2">
          Получите ID на{" "}
          <a href="https://elfsight.com/google-reviews-widget/" target="_blank" rel="noreferrer" className="underline">
            elfsight.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy></div>
    </div>
  );
}

