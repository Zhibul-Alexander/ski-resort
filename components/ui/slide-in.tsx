"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isMobileOrTablet } from "@/lib/device";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  delay?: number;
}

export function SlideIn({ 
  children, 
  className,
  index = 0,
  delay = 0
}: SlideInProps) {
  // Изначально считаем, что это может быть мобильное устройство, чтобы не применять классы сдвига
  const [isMobile, setIsMobile] = useState(true); // Начинаем с true для безопасности
  const [isVisible, setIsVisible] = useState(true); // Начинаем с видимого состояния
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isTriggeredRef = useRef(false);
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  // Проверяем устройство после монтирования компонента
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setMounted(true);
    const mobile = isMobileOrTablet();
    setIsMobile(mobile);
    
    if (mobile) {
      // На мобильном устройстве элементы всегда видимы без анимации
      setIsVisible(true);
      hasAnimated.current = true;
    } else {
      // На десктопе начинаем с невидимого состояния для анимации
      setIsVisible(false);
      hasAnimated.current = false;
    }
  }, []);

  useEffect(() => {
    // Не запускаем логику до монтирования или если это мобильное устройство
    if (!mounted || isMobile) {
      return;
    }

    if (hasAnimated.current || isTriggeredRef.current) return;
    if (!ref.current) return;

    // Очищаем предыдущий observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Проверяем все записи, но обрабатываем только если элемент виден
        for (const entry of entries) {
          // Строгая проверка: элемент должен быть виден достаточно хорошо
          if (
            entry.isIntersecting && 
            !hasAnimated.current && 
            !isTriggeredRef.current &&
            entry.intersectionRatio >= 0.1
          ) {
            // Устанавливаем флаги ДО изменения состояния
            hasAnimated.current = true;
            isTriggeredRef.current = true;
            
            // Отключаем observer ДО изменения состояния
            if (observerRef.current && ref.current) {
              observerRef.current.unobserve(ref.current);
              observerRef.current.disconnect();
              observerRef.current = null;
            }
            
            // Только после этого меняем состояние
            setIsVisible(true);
            
            // Прерываем цикл после первого срабатывания
            break;
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2], // Несколько порогов для более точного определения
        rootMargin: "0px 0px -80px 0px" // Отступ для начала анимации
      }
    );

    // Проверяем, виден ли элемент сразу при загрузке
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInViewport) {
        // Если элемент уже виден, показываем его сразу
        setIsVisible(true);
        hasAnimated.current = true;
        return;
      }
    }

    observer.observe(ref.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [index, isMobile, mounted]);

  // Не применяем классы сдвига до монтирования или на мобильных устройствах
  const directionClass = !mounted || isMobile 
    ? "" // До монтирования или на мобилке без анимации
    : direction === "left" 
      ? (isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-[33%]")
      : (isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-[33%]");

  return (
    <div
      ref={ref}
      className={cn(
        mounted && !isMobile && "transition-all duration-700 ease-out", // Переходы только на десктопе после монтирования
        directionClass,
        className
      )}
      style={{
        animationDelay: isVisible && !isMobile ? `${delay}ms` : "0ms"
      }}
    >
      {children}
    </div>
  );
}
