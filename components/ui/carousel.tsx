"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  showDots?: boolean;
  showArrows?: boolean;
  slidesPerView?: number | { mobile: number; desktop: number };
  autoPlay?: boolean;
}

export function Carousel({ 
  children, 
  className, 
  showDots = true, 
  showArrows = true,
  slidesPerView = 1,
  autoPlay = true
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getSlidesPerView = () => {
    if (typeof slidesPerView === "object") {
      return isMobile ? slidesPerView.mobile : slidesPerView.desktop;
    }
    return slidesPerView;
  };

  const visibleSlides = getSlidesPerView();
  
  // Вычисляем максимальный индекс для навигации
  // Для дробных visibleSlides (например, 1.5) нужно учесть, что каждый слайд должен быть виден полностью
  // maxIndex должен позволить дойти до позиции, где последний слайд полностью виден
  const calculateMaxIndex = () => {
    if (totalItems <= visibleSlides) {
      // Если все слайды помещаются, не нужно прокручивать
      return 0;
    }
    
    // Для дробных visibleSlides (например, 1.5) нужно больше позиций, чтобы показать каждый слайд полностью
    // Для целых visibleSlides используем стандартную логику
    if (visibleSlides % 1 !== 0) {
      // Для дробных: увеличиваем maxIndex до totalItems - 1, чтобы была возможность показать каждый слайд полностью
      return Math.max(0, totalItems - 1);
    }
    
    // Для целых visibleSlides: стандартная логика
    // Для показа последнего слайда полностью нужно сдвинуться на (totalItems - visibleSlides) позиций
    return Math.floor(totalItems - visibleSlides);
  };
  
  const maxIndex = Math.max(0, calculateMaxIndex());

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? maxIndex : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      // После последней позиции переходим на первый слайд
      return newIndex > maxIndex ? 0 : newIndex;
    });
  };

  React.useEffect(() => {
    if (totalItems === 0 || !autoPlay || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIndex = prev + 1;
        // После последнего слайда переходим на первый
        return newIndex > maxIndex ? 0 : newIndex;
      });
    }, 6667);
    return () => clearInterval(interval);
  }, [totalItems, maxIndex, autoPlay, isHovered]);

  if (totalItems === 0) return null;

  const slideWidth = 100 / visibleSlides;
  
  // Вычисляем смещение для transform
  // Для дробных visibleSlides нужно специальная логика, чтобы показать каждый слайд полностью
  const getTransform = () => {
    if (totalItems <= visibleSlides) {
      return 0;
    }
    
    // Для дробных visibleSlides (например, 1.5) нужна специальная логика
    if (visibleSlides % 1 !== 0) {
      // Для последней позиции: сдвигаемся так, чтобы последний слайд был полностью виден
      if (currentIndex === maxIndex) {
        return (totalItems - visibleSlides) * slideWidth;
      }
      
      // Для предпоследней позиции (когда нужно показать предпоследний слайд полностью)
      // Например, при visibleSlides = 1.5 и totalItems = 6:
      // - Позиция 4 должна показать 5-й слайд полностью
      // - Позиция 5 должна показать 6-й слайд полностью
      if (currentIndex === totalItems - 2) {
        // Сдвигаемся так, чтобы предпоследний слайд был полностью виден
        // Это означает сдвиг на (currentIndex + 1 - visibleSlides) * slideWidth
        return (currentIndex + 1 - visibleSlides) * slideWidth;
      }
      
      // Для остальных позиций: стандартная логика
      return currentIndex * slideWidth;
    }
    
    // Для целых visibleSlides: стандартная логика
    if (currentIndex === maxIndex && totalItems > visibleSlides) {
      // Для последней позиции: сдвигаемся так, чтобы последний слайд был полностью виден
      return (totalItems - visibleSlides) * slideWidth;
    }
    return currentIndex * slideWidth;
  };

  return (
    <div 
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-2xl px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${getTransform()}%)` }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-2"
              style={{ width: `${slideWidth}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showArrows && totalItems > visibleSlides && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            style={{ transform: "translateY(-50%)" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            style={{ transform: "translateY(-50%)" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {showDots && totalItems > visibleSlides && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                currentIndex === index ? "w-8 bg-brand" : "w-2 bg-muted"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

