# SayPlay Web

Frontend app for generating and managing AI-assisted playlists.

## Overview

SayPlay Web is a React + TypeScript application that connects to the SayPlay API.
It supports:

- Register and login with JWT auth
- Playlist generation from a natural-language prompt
- Viewing recommendation metadata per song (`suggested_by`, `verified.status`, `verified.confidence`)
- Saving generated drafts
- Playlist management (list, detail, edit, delete)
- Profile settings and password updates
- Light/dark theme toggle

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod

## Requirements

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

3. Start dev server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Run Vite dev server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## App Routes

- `/login` - Login
- `/register` - Register
- `/` - Playlists dashboard (protected)
- `/generate` - Generate playlist draft (protected)
- `/playlists/:playlistId` - Playlist detail/edit (protected)
- `/profile` - Profile & security (protected)
- `/about` - How it works (protected)

## Project Structure

```txt
src/
  app/
    router.tsx
    queryClient.ts
  components/
    NavBar.tsx
    ProtectedLayout.tsx
    ProtectedRoute.tsx
    ui.tsx
  features/
    auth/
      auth.api.ts
      auth.types.ts
    playlists/
      playlists.api.ts
      playlists.types.ts
    users/
      users.api.ts
      users.types.ts
  lib/
    api.ts
    auth.ts
  pages/
    AboutPage.tsx
    DashboardPage.tsx
    GeneratePage.tsx
    LoginPage.tsx
    PlaylistDetailPage.tsx
    ProfilePage.tsx
    RegisterPage.tsx
  styles/
    theme.css
  main.tsx
```

## API Notes

The frontend expects playlist songs to include fields like:

- `artist`, `track`, `reason`
- `suggested_by` (array of agent names)
- `verified` object (`status`, `confidence`, `spotify_url`, etc.)

When available, the UI displays recommendation agent and verification info per song.

## Auth Flow

- Access token is stored in `sessionStorage` under `sayplay_token`
- Axios automatically attaches `Authorization: Bearer <token>`
- On `401`, token is cleared

## Build

```bash
npm run build
```

Output is generated in `dist/`.
