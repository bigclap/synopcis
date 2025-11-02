# Frontend Development Guide (ssg-frontend)

This document outlines the key principles and practices for developing the Next.js frontend application.

## Core Architecture

- **Framework**: Next.js
- **Location**: `app/apps/ssg-frontend`
- **Component Design**: The project follows the **Atomic Design** pattern. Components should be organized into `atoms`, `molecules`, and `organisms` to ensure modularity and reusability.
- **Rendering Strategy**: The application uses an on-demand, pre-rendering strategy similar to **Incremental Static Regeneration (ISR)**. Pages that do not exist should be generated on-the-fly upon the first request and subsequently served as static assets. Full Static Site Generation (SSG) at build time should be avoided.

## Data Handling and Backend Interaction

- **Backend Independence**: **Do not make changes to the backend.** The frontend should be developed and tested independently.
- **Mock Data**: All interactions with the backend API must be simulated using mock data during development.
  - **Environment**: Mock data should **only** be active when `NODE_ENV` is `'development'`.
  - **Implementation**: The data fetching logic, including `fetch` calls and mock implementations, must be encapsulated within custom hooks (e.g., `useArticle`) or service modules. This logic should **not** reside directly inside UI components.

## Getting Started

To run the frontend development server, navigate to the `app` directory and run the start command. It is recommended to specify a custom port to avoid potential conflicts with other services.

```bash
cd app
npm run dev:ssg -- -p 3100
```
