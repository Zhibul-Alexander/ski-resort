# Быстрая настройка отправки писем

## Вариант 1: Локальная разработка (без деплоя worker)

Для тестирования можно использовать локальный worker:

1. В папке `worker` запустите:
```bash
cd worker
npm install
wrangler dev
```

2. Worker запустится на `http://localhost:8787`

3. Создайте файл `.env.local` в корне проекта:
```bash
NEXT_PUBLIC_BOOKING_ENDPOINT=http://localhost:8787/api/booking
```

4. Настройте секреты для локального worker (в отдельном терминале):
```bash
cd worker
wrangler secret put RESEND_API_KEY
wrangler secret put OWNER_EMAIL
wrangler secret put FROM_EMAIL
```

## Вариант 2: Продакшен (деплой worker)

1. Перейдите в папку `worker`:
```bash
cd worker
```

2. Установите зависимости:
```bash
npm install
```

3. Войдите в Cloudflare:
```bash
wrangler login
```

4. Настройте секреты:
```bash
wrangler secret put RESEND_API_KEY
# Введите ваш API ключ от Resend (получите на https://resend.com)

wrangler secret put OWNER_EMAIL
# Введите: zhibul.alexander.work@gmail.com

wrangler secret put FROM_EMAIL
# Введите email на вашем домене, например: booking@your-domain.com
```

5. Задеплойте worker:
```bash
wrangler deploy
```

6. После деплоя вы получите URL вида:
```
https://ski-no1-rental-booking.your-username.workers.dev
```

7. Создайте файл `.env.local` в корне проекта:
```bash
NEXT_PUBLIC_BOOKING_ENDPOINT=https://ski-no1-rental-booking.your-username.workers.dev/api/booking
```

8. Перезапустите dev сервер:
```bash
yarn dev
```

## Получение API ключа Resend

1. Зарегистрируйтесь на https://resend.com
2. Перейдите в Settings → API Keys
3. Создайте новый API ключ
4. Используйте этот ключ при настройке `RESEND_API_KEY`

**Важно:** Для `FROM_EMAIL` нужно использовать домен, который вы контролируете. Resend требует верификации домена для отправки писем.

## Проверка работы

1. Заполните форму бронирования на сайте
2. Нажмите "Отправить"
3. Проверьте:
   - Владелец получит письмо с деталями заявки
   - Клиент получит письмо-подтверждение

