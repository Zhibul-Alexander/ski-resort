# Booking email Worker (template)

This Worker receives the booking request JSON and sends 2 emails:
1) To the owner (new booking request)
2) To the customer (confirmation)

## Choose an email provider
Recommended: Resend (simple API, good deliverability).

## Setup (Wrangler)

### Локальная разработка

1) Install wrangler:
```bash
npm i -g wrangler
```

2) From /worker:
```bash
npm i
wrangler login
```

3) Создайте файл `.dev.vars` в директории `/worker` для локальной разработки:
```bash
# Скопируйте .dev.vars.example в .dev.vars и заполните значениями
cp .dev.vars.example .dev.vars
```

Заполните `.dev.vars`:
```
RESEND_API_KEY=re_your_api_key_here
OWNER_EMAIL=your-email@example.com
FROM_EMAIL=noreply@your-domain.com
```

**Важно:**
- Получите API ключ на https://resend.com/api-keys
- `FROM_EMAIL` должен быть верифицирован в Resend (можно использовать домен или email из sandbox)
- Для тестирования можно использовать sandbox email от Resend

4) Запустите worker локально:
```bash
wrangler dev
```

5) В корне проекта создайте `.env.local`:
```bash
NEXT_PUBLIC_BOOKING_ENDPOINT=http://localhost:8787/api/booking
```

### Деплой в продакшен

1) Configure secrets для продакшена:
```bash
wrangler secret put RESEND_API_KEY
wrangler secret put OWNER_EMAIL
wrangler secret put FROM_EMAIL
```

Examples:
- OWNER_EMAIL: `zhibul.alexander.work@gmail.com`
- FROM_EMAIL: `booking@your-domain.com` (use a domain you control)

2) Deploy:
```bash
wrangler deploy
```

3) Обновите `.env.local` или переменные окружения в продакшене:
```bash
NEXT_PUBLIC_BOOKING_ENDPOINT=https://<worker-url>/api/booking
```

**Для продакшена (Cloudflare Pages):**
- Добавьте переменную окружения в настройках проекта:
  - Имя: `NEXT_PUBLIC_BOOKING_ENDPOINT`
  - Значение: `https://<worker-url>/api/booking`
- Пересоберите проект

**Пример URL после деплоя:**
```
https://ski-no1-rental-booking.your-username.workers.dev/api/booking
```

## Optional anti-spam
Add Cloudflare Turnstile and verify token in the Worker.
