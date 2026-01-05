// Конфигурация приложения
// Для статического экспорта переменные окружения должны быть доступны во время сборки
// Если переменная окружения не доступна во время сборки, укажите URL Worker'а здесь напрямую

// ВАЖНО: Замените на ваш реальный URL Worker'а после деплоя
// Пример: "https://ski-no1-rental-booking.your-username.workers.dev/api/booking"
const FALLBACK_BOOKING_ENDPOINT = "";

export const BOOKING_ENDPOINT = 
  process.env.NEXT_PUBLIC_BOOKING_ENDPOINT || FALLBACK_BOOKING_ENDPOINT;

