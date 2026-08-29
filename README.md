# Event Management Web Application

A full-stack event management platform built with React + TypeScript + Vite on the frontend and Node.js + Express + Prisma + PostgreSQL on the backend.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript, JWT, bcrypt
- Database: PostgreSQL + Prisma
- Validation: Zod + React Hook Form

## Monorepo Structure

- `client` — frontend application
- `server` — backend API and Prisma schema

## Prerequisites

- Node.js 20+
- PostgreSQL
- npm

## Setup

1. Create a PostgreSQL database named `event_management`.
2. Copy `.env.example` to `.env` and adjust values:

```bash
cp server/.env.example server/.env
```

3. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

4. Generate Prisma client and run migrations:

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the backend:

```bash
cd server
npm run dev
```

6. Start the frontend:

```bash
cd client
npm run dev
```

## Demo Accounts

- Admin: `admin@example.com` / `admin123`
- Organizer: `organizer@example.com` / `organizer123`
- Attendee: `attendee@example.com` / `attendee123`

## Scripts

### Server

- `npm run dev`
- `npm run build`
- `npm run test`

### Client

- `npm run dev`
- `npm run build`
- `npm run lint`

## Notes

This project includes role-based authorization, protected routes, dashboards, event creation, registration logic, attendee tracking, and a seed dataset for local development.
