"use client";

import * as React from "react";

interface SnowfallOptions {
  count?: number;
  sizeRange?: [number, number];
  durationRange?: [number, number];
  opacityRange?: [number, number];
  scaleRange?: [number, number];
  driftRange?: [number, number];
  color?: string;
  zIndex?: string;
  iconSvg?: string;
  pauseWhenHidden?: boolean;
  respectReducedMotion?: boolean;
}

const DEFAULT_SNOWFLAKE_SVG = `
<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
  <path d="M24.97-.03A2 2 0 0 0 23 2v4.17l-1.9-1.89a2 2 0 0 0-1.43-.6 2 2 0 0 0-1.39 3.43L23 11.83v9.7l-8.4-4.85-1.74-6.46a2 2 0 0 0-1.9-1.51A2 2 0 0 0 9 11.25l.7 2.6-3.64-2.1a2 2 0 0 0-.95-.28 2 2 0 0 0-1.05 3.75l3.63 2.1-2.57.69a2 2 0 1 0 1.04 3.86l6.43-1.72L21.02 25l-8.41 4.85-6.4-1.72a2 2 0 0 0-.6-.07A2 2 0 0 0 5.18 32l2.53.67-3.64 2.1a2 2 0 1 0 2 3.47l3.63-2.1-.67 2.5a2 2 0 1 0 3.87 1.04l1.7-6.36L23 28.5v9.68l-4.68 4.68a2 2 0 1 0 2.83 2.83L23 43.83V48a2 2 0 1 0 4 0v-4.17l1.88 1.87a2 2 0 1 0 2.82-2.83l-4.7-4.7v-9.7l8.4 4.85 1.74 6.46A2 2 0 1 0 41 38.75l-.7-2.6 3.64 2.1a2 2 0 1 0 2-3.47l-3.64-2.1 2.56-.68a2 2 0 0 0-.5-3.94 2 2 0 0 0-.54.07l-6.41 1.72-8.38-4.83 8.43-4.86 6.38 1.7a2 2 0 1 0 1.03-3.85l-2.5-.68 3.57-2.05a2 2 0 0 0-.91-3.75 2 2 0 0 0-1.1.28l-3.64 2.1.7-2.6a2 2 0 0 0-2.03-2.54 2 2 0 0 0-1.84 1.51l-1.73 6.46L27 21.57v-9.74l4.72-4.72a2 2 0 1 0-2.83-2.83L27 6.18V2a2 2 0 0 0-2.03-2.03z"/>
</svg>
`.trim();

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.round(rand(min, max));

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function createFlake({
  svg,
  color,
  sizeRange,
  opacityRange,
  scaleRange,
  durationRange,
  driftRange,
  side,
  containerLeft,
  containerRight,
}: {
  svg: string;
  color: string;
  sizeRange: [number, number];
  opacityRange: [number, number];
  scaleRange: [number, number];
  durationRange: [number, number];
  driftRange: [number, number];
  side: "left" | "right";
  containerLeft: number;
  containerRight: number;
}): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = "snowfall__flake";
  el.innerHTML = svg;

  const size = randInt(sizeRange[0], sizeRange[1]);
  const opacity = rand(opacityRange[0], opacityRange[1]).toFixed(3);
  const scale = rand(scaleRange[0], scaleRange[1]).toFixed(3);

  const windowWidth = window.innerWidth;
  let xStart: number;
  let xEnd: number;

  if (side === "left") {
    // Левая область: от 0 до левого края контейнера
    const leftAreaWidth = containerLeft;
    xStart = rand(0, leftAreaWidth);
    const drift = rand(driftRange[0], driftRange[1]);
    xEnd = clamp(xStart + drift, 0, leftAreaWidth);
  } else {
    // Правая область: от правого края контейнера до конца экрана
    const rightAreaStart = containerRight;
    const rightAreaWidth = windowWidth - rightAreaStart;
    xStart = rand(rightAreaStart, windowWidth);
    const drift = rand(driftRange[0], driftRange[1]);
    xEnd = clamp(xStart + drift, rightAreaStart, windowWidth);
  }

  // Конвертируем в проценты от ширины окна
  const xStartPercent = (xStart / windowWidth) * 100;
  const xEndPercent = (xEnd / windowWidth) * 100;

  const duration = rand(durationRange[0], durationRange[1]).toFixed(3);
  const delay = (-rand(0, durationRange[1])).toFixed(3);
  const rotStart = randInt(0, 360);
  const rotEnd = rotStart + randInt(180, 720);

  const sway = randInt(6, 16);
  const swayDuration = rand(2.6, 5.2).toFixed(3);

  el.style.setProperty("--color", color);
  el.style.setProperty("--size", `${size}px`);
  el.style.setProperty("--opacity", `${opacity}`);
  el.style.setProperty("--scale", `${scale}`);

  el.style.setProperty("--x-start", `${xStartPercent}vw`);
  el.style.setProperty("--x-end", `${xEndPercent}vw`);

  el.style.setProperty("--duration", `${duration}s`);
  el.style.setProperty("--delay", `${delay}s`);

  el.style.setProperty("--rot-start", `${rotStart}deg`);
  el.style.setProperty("--rot-end", `${rotEnd}deg`);

  el.style.setProperty("--sway", `${sway}px`);
  el.style.setProperty("--sway-duration", `${swayDuration}s`);

  return el;
}

function getContainerBounds(): { left: number; right: number; hasSpace: boolean } {
  if (typeof window === "undefined") {
    return { left: 0, right: 0, hasSpace: false };
  }

  // Ищем контейнер с классом "container"
  const container = document.querySelector("main.container") as HTMLElement;
  if (!container) {
    return { left: 0, right: 0, hasSpace: false };
  }

  const rect = container.getBoundingClientRect();
  const minSideWidth = 100; // Минимальная ширина боковых областей для показа снежинок
  
  // Проверяем, есть ли достаточно места по бокам
  const leftSpace = rect.left;
  const rightSpace = window.innerWidth - rect.right;
  const hasSpace = leftSpace >= minSideWidth || rightSpace >= minSideWidth;

  return {
    left: rect.left,
    right: rect.right,
    hasSpace,
  };
}

function createSnowfall(options: SnowfallOptions = {}) {
  const {
    count = 80,
    sizeRange = [10, 20],
    durationRange = [10, 24],
    opacityRange = [0.2, 1],
    scaleRange = [0.6, 1.2],
    driftRange = [-10, 10],
    // Цвет подобран под цветовую схему сайта (акцентный цвет, но более мягкий)
    color = "hsl(197, 50%, 75%)", // Мягкий голубой, гармонирующий с accent цветом (197, 95%, 40%)
    zIndex = "9999",
    iconSvg = DEFAULT_SNOWFLAKE_SVG,
    pauseWhenHidden = true,
    respectReducedMotion = true,
  } = options;

  if (typeof window === "undefined") {
    return { start: () => {}, stop: () => {}, destroy: () => {}, root: null };
  }

  if (respectReducedMotion && prefersReducedMotion()) {
    return { start: () => {}, stop: () => {}, destroy: () => {}, root: null };
  }

  const bounds = getContainerBounds();
  if (!bounds.hasSpace) {
    // Не показываем снежинки, если недостаточно места по бокам
    return { start: () => {}, stop: () => {}, destroy: () => {}, root: null };
  }

  const root = document.createElement("div");
  root.className = "snowfall";
  root.setAttribute("aria-hidden", "true");
  root.style.setProperty("--snowfall-z", String(zIndex));
  root.style.setProperty("--play", "running");

  const fragment = document.createDocumentFragment();
  const safeCount = clamp(count, 0, 200);

  // Распределяем снежинки между левой и правой сторонами
  const leftCount = Math.floor(safeCount / 2);
  const rightCount = safeCount - leftCount;

  for (let i = 0; i < leftCount; i++) {
    fragment.appendChild(
      createFlake({
        svg: iconSvg,
        color,
        sizeRange,
        opacityRange,
        scaleRange,
        durationRange,
        driftRange,
        side: "left",
        containerLeft: bounds.left,
        containerRight: bounds.right,
      })
    );
  }

  for (let i = 0; i < rightCount; i++) {
    fragment.appendChild(
      createFlake({
        svg: iconSvg,
        color,
        sizeRange,
        opacityRange,
        scaleRange,
        durationRange,
        driftRange,
        side: "right",
        containerLeft: bounds.left,
        containerRight: bounds.right,
      })
    );
  }

  root.appendChild(fragment);

  const onVisibility = () => {
    if (!pauseWhenHidden) return;
    root.style.setProperty("--play", document.hidden ? "paused" : "running");
  };

  document.addEventListener("visibilitychange", onVisibility);

  const start = () => root.style.setProperty("--play", "running");
  const stop = () => root.style.setProperty("--play", "paused");

  const destroy = () => {
    document.removeEventListener("visibilitychange", onVisibility);
    root.remove();
  };

  return { start, stop, destroy, root };
}

export function Snowfall({ count = 90, ...options }: SnowfallOptions = {}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const snowRef = React.useRef<ReturnType<typeof createSnowfall> | null>(null);
  const resizeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Проверяем, является ли устройство мобильным или планшетом
  const isMobileOrTablet = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024; // Отключаем на экранах меньше 1024px (планшеты и мобилки)
  }, []);

  const createSnow = React.useCallback(() => {
    if (!containerRef.current) return;
    
    // Отключаем снежинки на мобилке и планшете
    if (isMobileOrTablet()) {
      if (snowRef.current) {
        snowRef.current.destroy();
        snowRef.current = null;
      }
      return;
    }

    // Уничтожаем предыдущий снег, если он есть
    if (snowRef.current) {
      snowRef.current.destroy();
      snowRef.current = null;
    }

    // Небольшая задержка, чтобы контейнер успел отрендериться
    const timeoutId = setTimeout(() => {
      const snow = createSnowfall({ count, ...options });
      snowRef.current = snow;
      
      if (snow.root && containerRef.current) {
        containerRef.current.appendChild(snow.root);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [count, options, isMobileOrTablet]);

  React.useEffect(() => {
    const cleanup = createSnow();

    // Обработчик изменения размера окна
    const handleResize = () => {
      // Очищаем предыдущий таймер
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Пересоздаем снежинки при изменении размера окна с debounce
      resizeTimeoutRef.current = setTimeout(() => {
        // Проверяем размер экрана и пересоздаем снежинки
        if (isMobileOrTablet()) {
          // Уничтожаем снежинки на мобилке/планшете
          if (snowRef.current) {
            snowRef.current.destroy();
            snowRef.current = null;
          }
        } else {
          createSnow();
        }
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (cleanup) cleanup();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (snowRef.current) {
        snowRef.current.destroy();
        snowRef.current = null;
      }
    };
  }, [createSnow, isMobileOrTablet]);

  return <div ref={containerRef} />;
}

