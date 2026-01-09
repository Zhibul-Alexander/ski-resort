"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapOpenUrl: string;
}

interface GoogleMapProps {
  point?: MapPoint;
  points?: MapPoint[];
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
  point,
  points,
  title = "Google map",
  labels = {}
}: GoogleMapProps) {
  // Определяем, используем ли одну точку или массив точек
  const pointsArray = points || (point ? [point] : []);
  
  // Генерируем URL для карты
  const generateEmbedUrl = (): string => {
    if (pointsArray.length === 0) return "";
    if (pointsArray.length === 1) {
      return `https://www.google.com/maps?q=${pointsArray[0].lat},${pointsArray[0].lng}&z=17&output=embed`;
    }
    // Для нескольких точек используем формат с центром и правильным zoom
    // Вычисляем центр всех точек
    const centerLat = pointsArray.reduce((sum, p) => sum + p.lat, 0) / pointsArray.length;
    const centerLng = pointsArray.reduce((sum, p) => sum + p.lng, 0) / pointsArray.length;
    
    // Вычисляем оптимальный zoom на основе расстояния между точками
    const lats = pointsArray.map(p => p.lat);
    const lngs = pointsArray.map(p => p.lng);
    const latDiff = Math.max(...lats) - Math.min(...lats);
    const lngDiff = Math.max(...lngs) - Math.min(...lngs);
    const maxDiff = Math.max(latDiff, lngDiff);
    
    // Определяем zoom на основе разницы координат
    let zoom = 15;
    if (maxDiff > 0.1) zoom = 10;
    else if (maxDiff > 0.05) zoom = 11;
    else if (maxDiff > 0.02) zoom = 12;
    else if (maxDiff > 0.01) zoom = 13;
    else if (maxDiff > 0.005) zoom = 14;
    else if (maxDiff > 0.001) zoom = 15;
    else zoom = 16;
    
    // Для нескольких точек используем формат со всеми координатами через |
    // Google Maps embed iframe имеет ограничения, но попробуем использовать все координаты
    const allCoordinates = pointsArray.map(p => `${p.lat},${p.lng}`).join('|');
    // Используем формат с координатами и zoom
    return `https://www.google.com/maps?q=${allCoordinates}&z=${zoom}&output=embed`;
  };

  const embedUrl = generateEmbedUrl();
  const openUrl = pointsArray.length === 1 ? pointsArray[0].mapOpenUrl : 
    (pointsArray.length > 1 ? `https://www.google.com/maps?q=${pointsArray.map(p => `${p.lat},${p.lng}`).join('|')}` : "");
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

