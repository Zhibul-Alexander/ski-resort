"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { cn } from "@/lib/utils";
import { isMobileOrTablet } from "@/lib/device";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  delay?: number;
}

// Глобальный реестр для отслеживания анимированных элементов по уникальному ключу
const animatedElementsRegistry = new Set<string>();

// Функция для очистки реестра (вызывается при навигации)
export function clearSlideInRegistry() {
  animatedElementsRegistry.clear();
}

export function SlideIn({ 
  children, 
  className,
  index = 0,
  delay = 0
}: SlideInProps) {
  // Изначально считаем, что это может быть мобильное устройство, чтобы не применять классы сдвига
  const [isMobile, setIsMobile] = useState(true); // Начинаем с true для безопасности
  const [isVisible, setIsVisible] = useState(true); // Начинаем с видимым состоянием
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isTriggeredRef = useRef(false);
  const lastTriggerTimeRef = useRef<number>(0); // Время последнего срабатывания для защиты от повторных срабатываний
  const reactId = useId(); // Стабильный ID от React
  const elementIdRef = useRef<string | null>(null); // Уникальный ID элемента
  
  // Определяем направление: четные индексы - слева, нечетные - справа
  const direction = index % 2 === 0 ? "left" : "right";

  // Генерируем уникальный ID для элемента на основе его позиции в DOM
  useEffect(() => {
    if (!ref.current || elementIdRef.current) return;
    
    // Создаем уникальный ID на основе пути страницы, индекса и React ID
    // Используем React useId для стабильности при hydration
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    elementIdRef.current = `slide-in-${path}-${index}-${reactId}`;
    
    // Устанавливаем data-атрибут для отслеживания
    if (ref.current) {
      ref.current.setAttribute('data-slide-in-index', String(index));
      ref.current.setAttribute('data-slide-in-id', elementIdRef.current);
    }
    
    // Проверяем, не был ли этот элемент уже анимирован (защита от двойного рендеринга)
    // Но только если это не первый рендер (mounted уже true)
    if (mounted && animatedElementsRegistry.has(elementIdRef.current)) {
      hasAnimated.current = true;
      isTriggeredRef.current = true;
      setIsVisible(true);
    }
  }, [index, mounted, reactId]);

  // Проверяем устройство после монтирования компонента
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setMounted(true);
    const mobileOrTablet = isMobileOrTablet(); // Проверяем и мобильные, и планшеты
    setIsMobile(mobileOrTablet);
    
    if (mobileOrTablet) {
      // На мобильных устройствах и планшетах элементы всегда видимы без анимации
      setIsVisible(true);
      hasAnimated.current = true;
      if (elementIdRef.current) {
        animatedElementsRegistry.add(elementIdRef.current);
      }
    } else {
      // Только на десктопе начинаем с невидимого состояния для анимации
      // Но только если элемент еще не был анимирован
      if (!hasAnimated.current) {
        setIsVisible(false);
        hasAnimated.current = false;
      }
    }
  }, []);

  useEffect(() => {
    // Не запускаем логику до монтирования или если это мобильное устройство/планшет
    if (!mounted || isMobile) {
      return;
    }

    // Если уже анимировали, не запускаем снова
    if (hasAnimated.current || isTriggeredRef.current) {
      return;
    }

    if (!ref.current || !elementIdRef.current) return;

    // Проверяем глобальный реестр - если элемент уже был анимирован, пропускаем
    if (animatedElementsRegistry.has(elementIdRef.current)) {
      hasAnimated.current = true;
      isTriggeredRef.current = true;
      setIsVisible(true);
      return;
    }

    // Очищаем предыдущий observer перед созданием нового
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Проверяем, виден ли элемент сразу при загрузке (до создания observer)
    const checkInitialVisibility = () => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      return isInViewport;
    };

    // Если элемент уже виден при загрузке, показываем его сразу и не создаем observer
    if (checkInitialVisibility()) {
      // Синхронно устанавливаем флаги и регистрируем элемент
      hasAnimated.current = true;
      isTriggeredRef.current = true;
      lastTriggerTimeRef.current = Date.now();
      if (elementIdRef.current) {
        animatedElementsRegistry.add(elementIdRef.current);
      }
      // Используем requestAnimationFrame только для изменения состояния
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return;
    }

    // Создаем observer только если элемент не виден сразу
    const observer = new IntersectionObserver(
      (entries) => {
        // Проверяем все записи, но обрабатываем только если элемент виден
        for (const entry of entries) {
          // Множественные проверки для защиты от повторных срабатываний
          const now = Date.now();
          const timeSinceLastTrigger = now - lastTriggerTimeRef.current;
          
          // Проверка 1: Если прошло меньше 1000ms с последнего срабатывания - игнорируем
          if (timeSinceLastTrigger < 1000 && lastTriggerTimeRef.current > 0) {
            continue;
          }
          
          // Проверка 2: Если элемент уже в реестре - игнорируем
          if (elementIdRef.current && animatedElementsRegistry.has(elementIdRef.current)) {
            continue;
          }
          
          // Проверка 3: Если флаги уже установлены - игнорируем
          if (hasAnimated.current || isTriggeredRef.current) {
            continue;
          }
          
          // Проверка 4: Элемент должен быть виден достаточно хорошо
          if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            continue;
          }
          
          // Все проверки пройдены - запускаем анимацию
          // СИНХРОННО устанавливаем все флаги ДО изменения состояния
          hasAnimated.current = true;
          isTriggeredRef.current = true;
          lastTriggerTimeRef.current = now;
          
          // Регистрируем элемент в глобальном реестре
          if (elementIdRef.current) {
            animatedElementsRegistry.add(elementIdRef.current);
          }
          
          // СИНХРОННО отключаем observer ДО изменения состояния
          // Это критически важно для предотвращения повторных срабатываний
          if (observerRef.current && ref.current) {
            observerRef.current.unobserve(ref.current);
            observerRef.current.disconnect();
            observerRef.current = null;
          }
          
          // Только после этого меняем состояние через requestAnimationFrame
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          
          // Прерываем цикл после первого срабатывания
          break;
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
  }, [isMobile, mounted]); // Убрали index из зависимостей, так как он не должен меняться

  // Не применяем классы сдвига до монтирования или на мобильных устройствах
  // На мобильных устройствах элементы всегда видимы без трансформаций
  const directionClass = !mounted || isMobile 
    ? "" // До монтирования или на мобилке без анимации и трансформаций
    : direction === "left" 
      ? (isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-[33%]")
      : (isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-[33%]");

  return (
    <div
      ref={ref}
      className={cn(
        // На мобильных не применяем никаких трансформаций и переходов
        mounted && !isMobile && "transition-all duration-700 ease-out", // Переходы только на десктопе после монтирования
        directionClass,
        className
      )}
      style={{
        animationDelay: isVisible && !isMobile ? `${delay}ms` : "0ms",
        // Дополнительная защита на мобильных - явно убираем любые трансформации
        transform: isMobile ? "none" : undefined
      }}
    >
      {children}
    </div>
  );
}
