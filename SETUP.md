# Scrolltrap Setup

## 1. Requirements

- Node.js 18+
- Docker (or Docker Desktop) with Docker Compose v2

## 2. Environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

## 3. Start the database

```bash
docker compose up -d db
```

- Wait until the service reports `healthy` (`docker compose ps` or `docker compose logs -f db`).
- Credentials are: user `scrolltrap`, password `super-secure-password`, database `scrolltrap`.
- Data persists in the named Docker volume `postgres-data`; remove it with `docker compose down -v`

## 4. Install dependencies

```bash
npm install
```

## 5. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 6. Useful scripts

- `npm run lint`
- `npm test`
- `npm run build`
