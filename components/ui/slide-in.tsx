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
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
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
