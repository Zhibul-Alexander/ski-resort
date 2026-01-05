// Конфигурация приложения
// Для статического экспорта переменные окружения должны быть доступны во время сборки
// Если переменная окружения не доступна во время сборки, укажите URL Worker'а здесь напрямую

// ВАЖНО: Замените на ваш реальный URL Worker'а после деплоя
// Пример: "https://ski-no1-rental-booking.your-username.workers.dev/api/booking"
const FALLBACK_BOOKING_ENDPOINT = "";

// Получаем endpoint из переменной окружения (доступна во время сборки)
// или из глобальной переменной window (для runtime конфигурации)
// или из fallback значения
export function getBookingEndpoint(): string {
  // Проверяем глобальную переменную window (для runtime конфигурации)
  if (typeof window !== "undefined" && (window as any).__BOOKING_ENDPOINT__) {
    return (window as any).__BOOKING_ENDPOINT__;
  }
  
  // Проверяем переменную окружения (доступна во время сборки)
  if (process.env.NEXT_PUBLIC_BOOKING_ENDPOINT) {
    return process.env.NEXT_PUBLIC_BOOKING_ENDPOINT;
  }
  
  // Используем fallback
  return FALLBACK_BOOKING_ENDPOINT;
}

// Экспортируем константу для обратной совместимости
export const BOOKING_ENDPOINT = getBookingEndpoint();

