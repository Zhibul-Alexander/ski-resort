"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  // Проверяем размер экрана
  useEffect(() => {
    const checkSize = () => {
      setIsMobileOrTablet(typeof window !== "undefined" && window.innerWidth < 1024);
    };
    
    checkSize();
    window.addEventListener("resize", checkSize);
    
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (hasAnimated.current) return;
    if (!ref.current) return;

    // Отключаем анимацию на мобилке и планшете
    if (isMobileOrTablet) {
      setIsVisible(true);
      hasAnimated.current = true;
      return;
    }

    // Создаем observer только один раз
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Проверяем, что элемент действительно виден и еще не анимировался
        if (entry.isIntersecting && !hasAnimated.current && entry.intersectionRatio > 0) {
          setIsVisible(true);
          hasAnimated.current = true;
          // Отключаем observer сразу после срабатывания
          if (observerRef.current && ref.current) {
            observerRef.current.unobserve(ref.current);
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2], // Используем несколько порогов для более точного определения
        rootMargin: "0px 0px -100px 0px" // Увеличиваем отступ, чтобы анимация начиналась раньше
      }
    );

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [index, isMobileOrTablet]);

  // На мобилке и планшете не применяем анимацию вообще
  const directionClass = isMobileOrTablet 
    ? "" // На мобилке без анимации
    : direction === "left" 
      ? (isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-[33%]")
      : (isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-[33%]");

  return (
    <div
      ref={ref}
      className={cn(
        !isMobileOrTablet && "transition-all duration-700 ease-out", // Переходы только на десктопе
        directionClass,
        className
      )}
      style={{
        animationDelay: isVisible && !isMobileOrTablet ? `${delay}ms` : "0ms"
      }}
    >
      {children}
    </div>
  );
}
