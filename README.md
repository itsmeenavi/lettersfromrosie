# lettersfromrosie.com

A clean, elegant, and minimalist digital home and literary portfolio built for Roselyn Mariano. This repository serves as the frontend application for showcasing her published books, essays, articles, and poetry, designed with a warm, parchment-style aesthetic.

For a deep dive into the broader two-project ecosystem (including the interactive viral map platform) and database design, please refer to the `ARCHITECTURE.md` file.

## Core Features

*   **Literary Showcase:** Dedicated architectural sections highlighting published physical books, essays, and poetry collections.
*   **Markdown CMS:** A fully integrated Markdown and YAML frontmatter pipeline allowing for seamless publishing of literary reviews and blog updates.
*   **Responsive Typography:** Custom Tailwind CSS typography rules tailored for long-form reading across mobile and desktop devices.
*   **SEO Optimized:** Server-side rendered via TanStack Start for perfect search engine discoverability.

## Getting Started

This project uses **pnpm** as its package manager and is powered by **TanStack Start** (React + Vite). 

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
3.  **Build for production:**
    ```bash
    pnpm run build
    ```

## Development Workflow

*   **Linter & Formatter:** This codebase uses **Biome** to handle all code formatting and linting efficiently. Ensure your editor is configured to format on save to prevent CI pipeline failures.
*   **Recommended Environments:** Cursor, VS Code, or Google Antigravity version 1.23 for optimal TypeScript and Biome plugin compatibility. 
*   **Maintainer:** Developed and maintained by @itsmeenavi.