---
name: style
description: Use when the user asks to restyle, update UI, or improve the look of components in this app
user-invocable: true
---

This is a fitness tracking app built with Next.js, Tailwind CSS v4, and shadcn/ui.  
Color tokens are defined in `app/globals.css` as oklch values under `:root` and `.dark`.

## Target aesthetic

Modern, premium fitness app. Dark-mode first. Bold typography, high contrast, energetic feel.

## Design rules

- Cards: use subtle shadows (`shadow-sm`) and slightly elevated backgrounds vs the page
- Typography: strong size contrast between headings and body text. Headings should feel bold and confident.
- Primary color: energetic, not corporate — slightly more saturated/vivid
- Borders: keep them subtle, prefer depth over heavy outlines
- Spacing: generous — content should breathe
- Empty states: should feel intentional, not like an afterthought
- Chips/badges: rounded-full, tight padding, clear active vs inactive contrast

## How to apply changes

1. Read the component first before changing anything
2. Only modify styles — never restructure logic
3. Update `globals.css` tokens when the change is global (colors, radius, shadows)
4. Use Tailwind classes for component-level changes
5. Always consider both light and dark mode
