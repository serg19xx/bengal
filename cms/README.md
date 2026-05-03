# CMS (коты)

Админка встроена в основной сайт: **`https://ваш-домен/cms`** (в меню сайта ссылка не добавляется — дайте хозяину прямую ссылку).

## Запуск локально

```bash
# в корне репозитория
cp .env.example .env   # при необходимости задайте CMS_ADMIN_PASSWORD
npm run dev
```

Откройте **http://localhost:4321/cms** (порт по умолчанию у Astro).

## Продакшен

Сайт собирается в режиме **`output: 'server'`** с адаптером **`@astrojs/node`**: нужен **Node.js** на сервере (не только статический CDN).

```bash
npm run build
node ./dist/server/entry.mjs
```

Или `npm run preview` после сборки. Задайте **`CMS_ADMIN_PASSWORD`** в окружении — иначе вход в CMS открыт всем (только для разработки).

## Переменные окружения

См. **`.env.example`** в корне репозитория: `CMS_ADMIN_PASSWORD`, `CMS_SESSION_SECRET` (опционально, для подписи cookie).

Код интерфейса: **`src/vue-cms/`**. API: **`src/pages/api/cms/`**.
