---
name: seed
description: Generate realistic seed data scripts for local dev/testing
user-invocable: true
---

This app uses Supabase with a service role client. The existing seed pattern is in `scripts/seed-exercises.ts` — use it as the canonical reference before writing anything.

## Existing pattern

- Data defined in `data/*.ts` as a plain array of objects
- Script in `scripts/seed-*.ts` that imports dotenv, creates a service role client, and inserts
- Run via: `npx tsx scripts/seed-<name>.ts`
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`

## Exercise schema (for generating related workout data)

Read `data/exercises-data.ts` to understand available exercises. Key fields:
`name`, `muscle_group`, `secondary_muscles[]`, `equipment`, `movement_pattern`, `is_compound`

## What to do when invoked

1. Read `scripts/seed-exercises.ts` to confirm the boilerplate pattern
2. Read relevant `lib/` files to understand the target table shape
3. Ask the user for their Supabase user ID if seeding user-owned data (workouts, sets)
4. Generate a `scripts/seed-<name>.ts` file following the rules below

## Rules for generated scripts

**Correctness**
- Never hardcode UUIDs — always query for real IDs at runtime (e.g. fetch exercise IDs from the DB)
- Handle foreign keys in the right insert order
- Use the service role client (bypasses RLS)

**Rerunability**
- Delete existing data for the target user before inserting, or use upsert
- Log progress so the user can see what's happening

**Realistic data — this is the hard part**
- Workout history: spread sessions across real calendar dates, include rest days (2-3 sessions/week)
- Progressive overload: weights should increase gradually over weeks, not be uniform
- Vary rep ranges: heavy days (3-5 reps), moderate (6-10), volume days (12-15)
- Vary exercises per session: 3-5 exercises, 2-4 sets each
- Workout names should feel real ("Push Day", "Leg Day", "Upper A", etc.)
- completed_at and started_at should be consistent (started_at = completed_at - 45~90 mins)

## Arguments

The user will pass a description of what to seed, e.g.:
- `/seed 3 months of workout history`
- `/seed a single realistic workout for testing`
- `/seed exercises for the chest muscle group`

Interpret the argument and generate the appropriate script.
