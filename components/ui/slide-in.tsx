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
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isTriggeredRef = useRef(false); // Дополнительная защита от повторных срабатываний
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  useEffect(() => {
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

    observer.observe(ref.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [index]);

  const directionClass = direction === "left" 
    ? (isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-[33%]")
    : (isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-[33%]");

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        directionClass,
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : "0ms"
      }}
    >
      {children}
    </div>
  );
}
