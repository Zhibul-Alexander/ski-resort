"use client";

import { useEffect, useState } from "react";

interface ElfsightGoogleReviewsProps {
  widgetId?: string;
  className?: string;
}

export function ElfsightGoogleReviews({ widgetId, className = "" }: ElfsightGoogleReviewsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Отмечаем, что компонент смонтирован на клиенте
    setIsMounted(true);
    
    // Загружаем скрипт Elfsight, если его еще нет
    if (typeof window !== "undefined" && !document.querySelector('script[src*="elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Функция для скрытия рекламной ссылки и накрытия её элементом
    const hideElfsightLink = () => {
      // Ищем ссылки внутри WidgetBackground__Content
      const contentBlocks = document.querySelectorAll('[class*="WidgetBackground__Content"], [class*="es-widget-background-content"]');
      contentBlocks.forEach((block) => {
        const blockElement = block as HTMLElement;
        // Устанавливаем position: relative для родительского блока, если его еще нет
        if (getComputedStyle(blockElement).position === 'static') {
          blockElement.style.position = 'relative';
        }
        
        const links = block.querySelectorAll('a');
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
            // Пытаемся скрыть
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
            
            // Если ссылка все еще видна, создаем элемент поверх неё (только по размеру ссылки)
            const rect = element.getBoundingClientRect();
            const blockRect = blockElement.getBoundingClientRect();
            
            // Проверяем, что ссылка видна и имеет размеры
            if (rect.width > 0 && rect.height > 0) {
              // Удаляем старый overlay для этой ссылки, если есть
              const overlayId = `elfsight-link-overlay-${element.getAttribute('href') || 'default'}`;
              const existingOverlay = blockElement.querySelector(`.${overlayId}`);
              if (existingOverlay) {
                existingOverlay.remove();
              }
              
              // Вычисляем позицию относительно родительского блока
              // Увеличиваем размер на 5% и центрируем
              const widthIncrease = rect.width * 0.05;
              const heightIncrease = rect.height * 0.05;
              const top = rect.top - blockRect.top + blockElement.scrollTop - heightIncrease / 2;
              const left = rect.left - blockRect.left + blockElement.scrollLeft - widthIncrease / 2;
              
              // Создаем overlay элемент на 5% больше размера ссылки
              const overlay = document.createElement('div');
              overlay.className = `elfsight-link-overlay ${overlayId}`;
              overlay.style.cssText = `
                position: absolute;
                top: ${top}px;
                left: ${left}px;
                width: ${rect.width + widthIncrease}px;
                height: ${rect.height + heightIncrease}px;
                background-color: hsl(var(--background));
                z-index: 1000000000;
                pointer-events: none;
              `;
              blockElement.appendChild(overlay);
            }
          }
        });
      });
      
      // Также ищем все ссылки с характерными стилями
      const allLinks = document.querySelectorAll('a[href*="elfsight"], a[href*="google-reviews"]');
      allLinks.forEach((link) => {
        const element = link as HTMLElement;
        const style = element.getAttribute('style') || '';
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

    // Функция для скрытия заголовка виджета
    const hideWidgetTitle = () => {
      const titles = document.querySelectorAll(
        '.es-widget-title-container, [class*="WidgetTitle__Container"], [class*="es-widget-title-container"]'
      );
      titles.forEach((title) => {
        const element = title as HTMLElement;
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.width = '0';
        element.style.overflow = 'hidden';
        element.style.pointerEvents = 'none';
      });
    };

    // Функция для изменения ссылки кнопки "Review us on Google"
    const updateReviewButtonLink = () => {
      const targetUrl = 'https://maps.app.goo.gl/tiw17BN7TNp62wfu5';
      
      // Ищем кнопку по тексту
      const allLinks = document.querySelectorAll('a');
      allLinks.forEach((link) => {
        const element = link as HTMLElement;
        const text = element.textContent?.trim().toLowerCase() || '';
        
        // Проверяем различные варианты текста кнопки
        if (
          text.includes('review us on google') ||
          text.includes('review on google') ||
          text.includes('write a review') ||
          text.includes('leave a review') ||
          (text.includes('review') && text.includes('google'))
        ) {
          // Изменяем href
          element.setAttribute('href', targetUrl);
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener noreferrer');
        }
      });
      
      // Также ищем кнопку по классам, если есть
      const reviewButtons = document.querySelectorAll(
        '[class*="ReviewButton"], [class*="WriteReview"], [class*="review-button"]'
      );
      reviewButtons.forEach((button) => {
        const element = button as HTMLElement;
        if (element.tagName === 'A' || element.querySelector('a')) {
          const link = element.tagName === 'A' ? element : element.querySelector('a') as HTMLAnchorElement;
          if (link) {
            link.setAttribute('href', targetUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        }
      });
    };

    // Функция для проверки, загрузился ли виджет
    const checkWidgetLoaded = () => {
      if (typeof window === "undefined" || !widgetId) return false;
      
      // Проверяем наличие элементов виджета в DOM
      const widgetContainer = document.querySelector(`[class*="elfsight-app-${widgetId}"]`);
      if (!widgetContainer) return false;
      
      // Проверяем, есть ли внутри контент виджета (не пустой контейнер)
      const hasContent = widgetContainer.querySelector('[class*="es-widget"], [class*="Widget"]');
      return !!hasContent;
    };

    // Скрываем элементы сразу и периодически проверяем (виджет загружается асинхронно)
    hideElfsightLink();
    hideWidgetTitle();
    updateReviewButtonLink();
    
    const interval = setInterval(() => {
      hideElfsightLink();
      hideWidgetTitle();
      updateReviewButtonLink();
      
      // Проверяем, загрузился ли виджет
      if (checkWidgetLoaded()) {
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 500);
    
    // Очистка интервала через 10 секунд (виджет должен загрузиться)
    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false); // Скрываем лоадер даже если виджет не загрузился
    }, 10000);

    return () => clearInterval(interval);
  }, [widgetId]);

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
    <div className={className} suppressHydrationWarning>
      {isMounted && isLoading && (
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-brand/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-brand rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div 
        className={`elfsight-app-${appId} ${isLoading ? 'hidden' : ''}`} 
        data-elfsight-app-lazy
        suppressHydrationWarning
      ></div>
    </div>
  );
}

