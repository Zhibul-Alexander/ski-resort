# Ski Rental IRISH-GEORGIA — Gudauri

Статический многоязычный сайт для проката лыжного оборудования.

## Технологии

- **Next.js** (App Router) с статическим экспортом
- **Tailwind CSS** + shadcn-style UI (Radix)
- Контент и цены в `/content/*/*.json` (редактирование через Git)

## Быстрый старт

### Локальная разработка

```bash
yarn
yarn dev
```

Откройте: http://localhost:3000

### Сборка (статический экспорт)

```bash
yarn build
```

Результат сборки находится в папке `out/` (можно задеплоить на Cloudflare Pages).

## Языки и маршруты

Поддерживаемые языки:
- `/en` — English
- `/ru` — Русский
- `/ge` — ქართული (Georgian)
- `/zh` — 中文 (Chinese)
- `/kk` — Қазақша (Kazakh)
- `/he` — עברית (Hebrew)

## Редактирование контента

Все данные хранятся в JSON файлах:

- **Цены:** `/content/*/pricing.json`
- **FAQ:** `/content/*/faq.json`
- **Отзывы:** `/content/*/reviews.json`
- **Контакты/часы работы/карта:** `/content/*/site.json`
- **Изображения:** `/public/images/shop/*` и `/public/images/resort/*`

### Карта

Используются координаты из Google Maps и URL для iframe с параметром `output=embed`.

Для изменения карты отредактируйте в `/content/*/site.json`:
- `location.mapEmbedUrl` — URL для встраивания
- `location.mapOpenUrl` — URL для открытия в новой вкладке

## Настройка отправки заявок на бронирование

Фронтенд отправляет JSON запросы на endpoint для обработки заявок на бронирование.

### Шаг 1: Деплой Cloudflare Worker

1. Перейдите в папку `worker`:
   ```bash
   cd worker
   ```

2. Установите зависимости (если еще не установлены):
   ```bash
   npm install
   ```

3. Установите Wrangler CLI (если еще не установлен):
   ```bash
   npm install -g wrangler
   ```

4. Войдите в Cloudflare:
   ```bash
   wrangler login
   ```

5. Настройте секреты для отправки писем:
   ```bash
   # API ключ от Resend (получите на https://resend.com)
   wrangler secret put RESEND_API_KEY

   # Email владельца (куда будут приходить заявки)
   wrangler secret put OWNER_EMAIL
   # Пример: zhibul.alexander.work@gmail.com

   # Email отправителя (должен быть на вашем домене)
   wrangler secret put FROM_EMAIL
   # Пример: booking@your-domain.com
   ```

6. Задеплойте worker:
   ```bash
   wrangler deploy
   ```

После деплоя вы получите URL вида: `https://ski-no1-rental-booking.your-username.workers.dev`

### Шаг 2: Настройка переменной окружения

#### Для локальной разработки

Создайте файл `.env.local` в корне проекта:

```bash
NEXT_PUBLIC_BOOKING_ENDPOINT=https://ski-no1-rental-booking.your-username.workers.dev/api/booking
```

Замените `your-username` на ваш username из Cloudflare.

#### Для продакшена (Cloudflare Pages)

1. Перейдите в настройки вашего проекта Cloudflare Pages
2. Добавьте переменную окружения:
   - **Имя:** `NEXT_PUBLIC_BOOKING_ENDPOINT`
   - **Значение:** `https://ski-no1-rental-booking.your-username.workers.dev/api/booking`
3. Пересоберите проект

### Шаг 3: Получение API ключа Resend

1. Зарегистрируйтесь на [https://resend.com](https://resend.com)
2. Создайте API ключ в настройках
3. Используйте этот ключ при настройке `RESEND_API_KEY` в worker

> **Важно:** Для `FROM_EMAIL` нужно использовать домен, который вы контролируете. Resend требует верификации домена для отправки писем.
>
> Если вы **не** установите endpoint, форма будет показывать ошибку.

## Деплой на Cloudflare Pages

1. Создайте новый проект Pages из этого репозитория
2. **Build command:** `yarn build`
3. **Output directory:** `out`

## Worker

Готовый к деплою email worker на базе Resend включен в проект.

Подробности смотрите в `/worker/README.md`.
