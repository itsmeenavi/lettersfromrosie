# The Letters Ecosystem: Architecture & Stack

**Author:** @itsmeenavi

## 1. Project Overview

This ecosystem consists of two interconnected platforms built as separate repositories, sharing a unified design language and a single backend database. 

**Note: This repository contains Project 1.**

*   **Project 1: The Literary Portfolio (`lettersfromrosie.com`)**
    *   A minimalist, parchment-styled digital home for published books, essays, and poetry.
    *   Focuses on excellent SEO and elegant typography.
*   **Project 2: The Interactive Reader Platform (`lettersfromyou.com`)**
    *   A viral, map-based community app accessed via a QR code in a physical book.
    *   Features a physics-based envelope opening animation, a live masonry wall of reader submissions, and 9:16 exportable story cards for social media sharing.

---

## 2. Global Architecture Strategy

Instead of a complex monorepo, both applications operate as completely separate frontend deployments that read and write to the same central brain.

*   **Frontend Routing & SEO:** We are using **TanStack Start** (powered by Nitro) over Next.js. This gives us the speed of a Vite Single Page Application (SPA), strict code-based routing, and the Server-Side Rendering (SSR) required to generate dynamic OpenGraph social cards.
*   **The Backend Brain:** A single **Supabase** project acts as the nervous system for both apps, handling all database tables, real-time WebSocket subscriptions, and file storage.
*   **Development Environment:** To keep formatting clean and catch linting errors instantly, the project is configured with **Biome**. When working across devices, Cursor or Google Antigravity version 1.23 are the recommended editors to ensure full compatibility with the toolchain.

---

## 3. The Core Tech Stack

*   **Language:** TypeScript
*   **Framework:** React + Vite
*   **Routing / SSR:** TanStack Start (TanStack Router)
*   **Styling:** Tailwind CSS
*   **Linter & Formatter:** Biome
*   **Database:** Supabase (PostgreSQL)
*   **Infrastructure & DNS:** Cloudflare (Registrar, Turnstile for spam, DNS)
*   **Hosting:** Vercel

---

## 4. Specialized Libraries

### Project 1 (Current Repo - Portfolio)
*   `react-markdown`: Renders raw Markdown content into React.
*   `gray-matter`: Parses YAML frontmatter from blog posts.
*   `@tailwindcss/typography`: Styles the markdown output beautifully.

### Project 2 (Interactive Platform)
*   `maplibre-gl`: Handles the custom-styled parchment maps and coordinates.
*   `framer-motion`: Powers the physics-based wax seal and envelope animations.
*   `html-to-image`: Generates the shareable social media cards directly in the browser.
*   **Supabase PostGIS:** A PostgreSQL extension configured on the backend to handle spatial queries for map markers.