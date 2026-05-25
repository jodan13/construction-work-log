# Журнал работ на строительном объекте

Fullstack-приложение для ведения журнала выполненных работ на строительном объекте. Пользователь может добавлять, редактировать, удалять и фильтровать записи по дате; данные сохраняются в PostgreSQL.

## Что реализовано

- список записей журнала с сортировкой по дате;
- дата выполнения работ;
- выбор вида работ из справочника;
- объём и единица измерения;
- ФИО исполнителя;
- фильтр по диапазону дат;
- добавление записи с frontend и backend-валидацией;
- редактирование и удаление записей;
- хранение данных в PostgreSQL через Prisma;
- взаимодействие frontend с backend через REST API.

## Стек

- Frontend: React, TypeScript, Vite, MUI.
- Backend: NestJS, TypeScript.
- Database: PostgreSQL в Docker.
- ORM: Prisma 7 с `@prisma/adapter-pg`.

React + Vite выбраны для компактного SPA без лишней инфраструктуры. NestJS даёт понятную структуру контроллеров, сервисов и DTO. Prisma упрощает работу со схемой, миграциями и seed-данными.

## Структура проекта

```text
construction-work-log/
  backend/            NestJS API, Dockerfile, Prisma schema, migrations, seed
  frontend/           React + Vite приложение, Dockerfile для nginx
  docker-compose.yml  PostgreSQL, backend и frontend
  README.md           Инструкция по проекту
```

## Требования

- Node.js 22 или новее;
- npm;
- Docker и Docker Compose.

## Запуск через Docker Compose

Весь проект можно поднять одной командой из корня репозитория:

```bash
docker-compose up --build
```

Будут запущены:

- PostgreSQL на `localhost:5432`;
- backend API на [http://localhost:3000](http://localhost:3000);
- frontend на [http://localhost:5173](http://localhost:5173).

Backend в Docker при старте автоматически выполняет:

```bash
npx prisma migrate deploy
npx prisma db seed
node dist/main
```

Seed справочника видов работ идемпотентный и выполняется через `upsert`, поэтому повторный запуск контейнера не создаёт дубликаты.

Чтобы полностью очистить локальную Docker-базу:

```bash
docker-compose down -v
```

## Локальный запуск для разработки

1. Запустить PostgreSQL:

```bash
docker-compose up -d postgres
```

2. Установить зависимости backend:

```bash
cd backend
npm install
```

3. Создать `.env` из примера:

```bash
cp .env.example .env
```

4. Применить миграции:

```bash
npx prisma migrate dev
```

5. Заполнить справочник видов работ:

```bash
npx prisma db seed
```

6. Запустить backend:

```bash
npm run start:dev
```

7. В другом терминале запустить frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Frontend будет доступен на [http://localhost:5173](http://localhost:5173), backend API на [http://localhost:3000](http://localhost:3000).

## API

- `GET /work-types` - список видов работ.
- `GET /work-logs` - список записей журнала.
- `GET /work-logs?from=2026-05-01&to=2026-05-31` - фильтр по дате.
- `POST /work-logs` - создание записи.
- `PATCH /work-logs/:id` - обновление записи.
- `DELETE /work-logs/:id` - удаление записи.

Пример payload для создания:

```json
{
  "workDate": "2026-05-25",
  "workTypeId": 1,
  "volume": 12.5,
  "unit": "м³",
  "performerName": "Иванов Иван Иванович",
  "comment": "Работы выполнены без замечаний"
}
```

## Проверки

```bash
cd backend
npm run lint
npm test -- --runInBand
npm run test:e2e
npm run build

cd ../frontend
npm run lint
npm run build
```

## Что можно улучшить дальше

- добавить пагинацию для большого журнала;
- расширить справочник единиц измерения;
- добавить optimistic UI или toast-уведомления;
- добавить CI-проверки для lint/test/build;
- добавить серверную сортировку для большого журнала.
