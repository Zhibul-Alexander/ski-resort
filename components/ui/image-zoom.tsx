"use client";

import * as React from "react";
import { X, ZoomIn, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageZoomProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  lang?: string;
}

const translations = {
  ru: {
    reset: "Сбросить",
    hint: "Двойной клик или ESC для сброса • Перетаскивание для перемещения"
  },
  en: {
    reset: "Reset",
    hint: "Double click or ESC to reset • Drag to move"
  },
  ge: {
    reset: "გადატვირთვა",
    hint: "ორმაგი დაწკაპუნება ან ESC გადასატვირთად • გადაადგილება გადათრევით"
  },
  kk: {
    reset: "Қалпына келтіру",
    hint: "Қалпына келтіру үшін екі рет басыңыз немесе ESC • Жылжыту үшін тартыңыз"
  },
  zh: {
    reset: "重置",
    hint: "双击或按ESC重置 • 拖动移动"
  }
};

export function ImageZoom({ src, alt, children, lang = "ru" }: ImageZoomProps) {
  const t = translations[lang as keyof typeof translations] || translations.ru;
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef(1);
  const positionRef = React.useRef({ x: 0, y: 0 });
  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });

  const constrainPosition = React.useCallback((currentScale: number, currentPos: { x: number; y: number }) => {
    if (!imageRef.current || !containerRef.current || currentScale <= 1) {
      return { x: 0, y: 0 };
    }
    
    const image = imageRef.current;
    const container = containerRef.current;
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    const imageNaturalWidth = image.naturalWidth || image.offsetWidth;
    const imageNaturalHeight = image.naturalHeight || image.offsetHeight;
    
    if (!imageNaturalWidth || !imageNaturalHeight) {
      return currentPos;
    }
    
    const containerAspect = containerWidth / containerHeight;
    const imageAspect = imageNaturalWidth / imageNaturalHeight;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspect;
    } else {
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspect;
    }
    
    const scaledWidth = displayWidth * currentScale;
    const scaledHeight = displayHeight * currentScale;
    
    const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);
    
    return {
      x: Math.max(-maxX, Math.min(maxX, currentPos.x)),
      y: Math.max(-maxY, Math.min(maxY, currentPos.y)),
    };
  }, []);

  const lastClickTimeRef = React.useRef(0);

  const handleClick = React.useCallback((e?: React.MouseEvent) => {
    if (scale === 1) {
      const newScale = 2;
      scaleRef.current = newScale;
      setScale(newScale);
      setIsZoomed(true);
      // Ограничиваем позицию при первом увеличении
      setTimeout(() => {
        const constrainedPos = constrainPosition(newScale, { x: 0, y: 0 });
        positionRef.current = constrainedPos;
        setPosition(constrainedPos);
      }, 0);
    } else {
      // Двойной клик для сброса зума
      const now = Date.now();
      if (now - lastClickTimeRef.current < 300) {
        resetZoom();
      }
      lastClickTimeRef.current = now;
    }
  }, [scale, constrainPosition]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    scaleRef.current = 1;
    positionRef.current = { x: 0, y: 0 };
    setIsZoomed(false);
  };

  // Синхронизируем refs с state
  React.useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  React.useEffect(() => {
    positionRef.current = position;
  }, [position]);

  React.useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Обработчик Escape для сброса зума
  React.useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  // Добавляем обработчики нативных событий для зума и перетаскивания
  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleWheelNative = (e: WheelEvent) => {
      if (scaleRef.current > 1 || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const newScale = Math.max(1, Math.min(5, scaleRef.current + delta));
        scaleRef.current = newScale;
        
        // Ограничиваем позицию при изменении масштаба
        const constrainedPos = constrainPosition(newScale, positionRef.current);
        positionRef.current = constrainedPos;
        setPosition(constrainedPos);
        
        setScale(newScale);
        if (newScale === 1) {
          setIsZoomed(false);
        } else {
          setIsZoomed(true);
        }
      }
    };

    const handleMouseDownNative = (e: MouseEvent) => {
      if (scaleRef.current > 1) {
        e.preventDefault();
        isDraggingRef.current = true;
        setIsDragging(true);
        dragStartRef.current = {
          x: e.clientX - positionRef.current.x,
          y: e.clientY - positionRef.current.y,
        };
      }
    };

    const handleMouseMoveNative = (e: MouseEvent) => {
      if (isDraggingRef.current && scaleRef.current > 1) {
        e.preventDefault();
        
        // Вычисляем новую позицию
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        
        // Ограничиваем позицию границами
        const constrainedPos = constrainPosition(scaleRef.current, { x: newX, y: newY });
        positionRef.current = constrainedPos;
        setPosition(constrainedPos);
      }
    };

    const handleMouseUpNative = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    container.addEventListener("wheel", handleWheelNative, { passive: false });
    container.addEventListener("mousedown", handleMouseDownNative);
    container.addEventListener("mousemove", handleMouseMoveNative);
    container.addEventListener("mouseup", handleMouseUpNative);
    container.addEventListener("mouseleave", handleMouseUpNative);

    return () => {
      container.removeEventListener("wheel", handleWheelNative);
      container.removeEventListener("mousedown", handleMouseDownNative);
      container.removeEventListener("mousemove", handleMouseMoveNative);
      container.removeEventListener("mouseup", handleMouseUpNative);
      container.removeEventListener("mouseleave", handleMouseUpNative);
    };
  }, []);

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-border bg-card aspect-square flex items-center justify-center cursor-zoom-in"
        onClick={handleClick}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-contain select-none pointer-events-auto"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
          draggable={false}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (scale > 1) {
              resetZoom();
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (scale === 1) {
              handleClick();
            }
          }}
        />
        {!isZoomed && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-3xl flex items-center justify-center pointer-events-none">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
      {isZoomed && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/95 backdrop-blur-sm hover:bg-background border border-border shadow-lg transition-all hover:scale-105"
            aria-label={t.reset}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm font-medium">{t.reset}</span>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border border-border text-sm pointer-events-none">
            <span className="text-muted-foreground">
              {Math.round(scale * 100)}% • {t.hint}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

