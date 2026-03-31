---
name: audit-components
description: Scans app components and advises which should be broken into smaller pieces
user-invocable: true
---

Scan the `app/` directory and identify components that are good candidates for being broken up. This is an advisory skill — do NOT make any changes. Only report findings.

## How to run

1. Glob all `.tsx` files under `app/`
2. Read each file
3. Evaluate against the criteria below
4. Report findings grouped by priority

## What to look for

**Strong signals a component should be split:**
- File is over ~150 lines and mixes concerns (data display + interaction + layout)
- A single component handles both server-side data fetching AND client-side interactivity
- A `"use client"` directive is at the top of a large file — check if only a small part actually needs client behavior. The rest could stay server-rendered.
- Repeated JSX patterns within the same file that could be a shared sub-component (e.g. a `Row`, `StatCard`, `Badge` rendered 3+ times inline)
- A component receives 5+ props — often a sign it's doing too much
- Conditional rendering branches that are large enough to be their own component
- A component that contains both a form and a data display section

**Not worth splitting:**
- Small files under ~80 lines that are already focused
- Simple presentational components with no logic
- Files that are long only because of data/config arrays (like `exercises-data.ts`)

## Output format

Group findings into three buckets:

### High priority
Components where splitting would meaningfully improve readability, performance (e.g. moving `"use client"` boundary down), or reusability.

### Worth considering
Components that are getting large but aren't urgent.

### Fine as-is
Brief note on components you checked that don't need action.

For each finding include:
- File path
- Why it's a candidate
- Concrete suggestion (e.g. "extract the `SetRow` pattern into a sub-component", "split client interactivity into a `WorkoutFormClient` child")
