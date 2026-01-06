"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleMapProps {
  embedUrl: string;
  openUrl: string;
  title?: string;
  labels?: {
    loading?: string;
    error?: string;
    errorDescription?: string;
    retry?: string;
    preparing?: string;
    openInGoogleMaps?: string;
  };
}

export function GoogleMap({ 
  embedUrl, 
  openUrl, 
  title = "Google map",
  labels = {}
}: GoogleMapProps) {
  const {
    loading = "Загрузка карты...",
    error = "Ошибка",
    errorDescription = "При загрузке Google Карт на этой странице возникла проблема.",
    retry = "Попробовать снова",
    preparing = "Подготовка карты...",
    openInGoogleMaps = "Открыть в Google Maps"
  } = labels;
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const maxRetries = 3;

  // Используем Intersection Observer для загрузки карты только когда она видна
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      },
      { rootMargin: "50px" } // Начинаем загрузку за 50px до появления в viewport
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  // Обработка загрузки iframe с таймаутом
  useEffect(() => {
    if (!shouldLoad) return;

    // Таймаут для определения, что карта не загрузилась
    const loadTimeout = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          setHasError(true);
          return false;
        }
        return prev;
      });
    }, 12000); // 12 секунд на загрузку

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [shouldLoad, retryCount]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setHasError(false);
      setIsLoading(true);
      setRetryCount((prev) => prev + 1);
      
      // Перезагружаем iframe с уникальным параметром для обхода кеша
      if (iframeRef.current) {
        const separator = embedUrl.includes('?') ? '&' : '?';
        iframeRef.current.src = `${embedUrl}${separator}_retry=${retryCount + 1}&_t=${Date.now()}`;
      }
    }
  };

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-border bg-white relative min-h-[360px]">
      {shouldLoad ? (
        <>
          <iframe
            ref={iframeRef}
            title={title}
            src={retryCount > 0 ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}_retry=${retryCount}` : embedUrl}
            width="100%"
            height="360"
            style={{ border: "none" }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">{loading}</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">{error}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {errorDescription}
              </p>
              {retryCount < maxRetries ? (
                <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {retry}
                </Button>
              ) : (
                <a href={openUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    {openInGoogleMaps}
                  </Button>
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">{preparing}</p>
          </div>
        </div>
      )}
    </div>
  );
}

