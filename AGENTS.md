# Minh Duong Restaurant - Agent Instructions

## Project Overview

Single-page restaurant website with booking system and loyalty club. No React/Vite build step—frontend is pure HTML + vanilla JS with CDN Tailwind.

## Tech Stack

- **Frontend**: Vanilla HTML/JS + Tailwind CSS v4 (CDN)
- **Backend**: Vercel Serverless Functions (API routes in `api/`)
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend

## Commands

```bash
npm run dev      # Local dev (vercel dev)
npm run deploy   # Deploy to Vercel production
```

## Key Files

| Path | Purpose |
|------|---------|
| `index.html` | Complete frontend (all sections, booking form, loyalty modal) |
| `api/booking.ts` | Booking API - validates + saves to Supabase + sends email |
| `api/loyalty.ts` | Loyalty club registration API |
| `src/emails/BookingEmail.ts` | Email template builder |
| `supabase/migrations/` | Database schema (run in Supabase dashboard) |
| `vercel.json` | Vercel config - serves index.html for all routes except /api/* |

## Database Setup

Run these SQL files in Supabase Dashboard → SQL Editor:
1. `supabase/migrations/001_create_bookings.sql`
2. `supabase/migrations/002_create_loyalty_members.sql`
3. `supabase/migrations/003_create_menu.sql`

## Environment Variables

Required in Vercel project settings:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `OWNER_EMAIL`
- `FROM_EMAIL`

## Common Issues

- **Phone validation**: Frontend uses `/^(0|\+84)[0-9]{9}$/` — matches API
- **Time validation**: Restaurant hours 10:00-22:00 — enforced in both frontend and API
- **No build step**: Deploy directly—vercel.json serves index.html statically
- **API imports**: Use relative paths like `../src/emails/BookingEmail.ts` in API files

## Project Structure (Clean)

```
Minh-Duong-Restaurant/
├── api/                  # Vercel serverless functions
│   ├── booking.ts
│   └── loyalty.ts
├── src/emails/           # Email templates
│   └── BookingEmail.ts
├── supabase/migrations/  # DB schemas
├── index.html           # Frontend (no build)
├── vercel.json          # Config
├── package.json
└── AGENTS.md
```

## Notes

- This is NOT a Vite/React project—don't add those dependencies
- Cart system is client-side only (per-session)
- Loyalty form submits to `/api/loyalty`
- Booking form submits to `/api/booking`
