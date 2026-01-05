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
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = isMobileOrTablet();
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  useEffect(() => {
    if (hasAnimated.current) return;
    if (!ref.current) return;

    // Отключаем анимацию на мобилке и планшете
    if (isMobile) {
      setIsVisible(true);
      hasAnimated.current = true;
      return;
    }

    // Создаем observer только один раз
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Обрабатываем только первое вхождение
        const entry = entries[0];
        if (!entry) return;
        
        // Проверяем, что элемент действительно виден и еще не анимировался
        if (entry.isIntersecting && !hasAnimated.current && entry.intersectionRatio > 0.05) {
          setIsVisible(true);
          hasAnimated.current = true;
          // Отключаем observer сразу после срабатывания
          observer.unobserve(ref.current!);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05, // Один порог для более стабильной работы
        rootMargin: "0px 0px -50px 0px" // Уменьшаем отступ для более точного определения
      }
    );

    observer.observe(ref.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [index, isMobile]);

  // На мобилке и планшете не применяем анимацию вообще
  const directionClass = isMobile 
    ? "" // На мобилке без анимации
    : direction === "left" 
      ? (isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-[33%]")
      : (isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-[33%]");

  return (
    <div
      ref={ref}
      className={cn(
        !isMobile && "transition-all duration-700 ease-out", // Переходы только на десктопе
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
