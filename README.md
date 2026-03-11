# Sonoriza Admin

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

Administrative panel for Sonoriza built with React, Vite, and TypeScript.

Sonoriza Admin is the web client responsible for the platform's administrative operations. The application consumes the Sonoriza API for authentication, user management, artists, music genres, musics, uploads, and metrics.

## Overview

The admin currently covers:
- administrator authentication
- artist management
- music genre management
- music management
- user management
- file uploads through the API
- metrics queries through the API
- dashboard with side navigation
- internationalization with `pt-BR` and `en-US`

## Stack

- Node.js 22
- React 18
- Vite 4
- TypeScript
- Redux Toolkit
- Redux Persist
- React Hook Form
- Yup
- Axios
- Tailwind CSS
- Vitest

## Requirements

- Node.js 22
- npm or yarn
- Sonoriza API configured and running

## Quick setup

### 1) Install dependencies

```bash
npm install
```

If you prefer:

```bash
yarn
```

### 2) Configure environment

Update `.env` with at least:

```env
VITE_API_URL="http://localhost:3333"
```

If there are additional environment-specific variables, keep them aligned with the project's deployment configuration.

### 3) Start admin

```bash
npm run start
```

Application: `http://localhost:3000`

## Scripts

- `npm run start` - development environment with Vite
- `npm run serve` - local mock with `json-server`
- `npm run build` - production build
- `npm run preview` - local preview of the build
- `npm run lint` - lint
- `npm run test` - tests
- `npm run test:watch` - watch mode tests
- `npm run test:coverage` - test coverage
- `npm run test:ui` - Vitest UI

Yarn equivalents:

- `yarn start`
- `yarn serve`
- `yarn build`
- `yarn lint`
- `yarn test`

## Integration with API

The admin consumes the Sonoriza API as the central source of data and operations.

Integrated flows:
- `/sessions` for authentication
- `/users` and `/me` for users
- `/artists` for artists
- `/genres` for music genres
- `/musics` for musics
- `/uploads` for file upload and URL signing
- `/metrics` for metrics

## Features by domain

### Authentication

- administrator login
- token persistence in the frontend
- redirect to the initial screen on `401`

### Artists

- create artist
- edit artist
- list artists
- consume artists linked to musics

### Genres

- create music genre
- edit music genre
- list music genres

### Musics

- create music
- edit music
- remove music
- link music to artists
- define music genre
- send cover art and audio file through the API

### Users

- list users
- view administrative data
- operate flows that depend on the profile returned by the API

### Uploads and metrics

- file uploads through the API endpoint
- consume URLs used in the panel
- query metrics delivered by the API

## Architecture summary

```text
src/
  components/      Interface components and forms
  hooks/           Interface and behavior hooks
  pages/           Main pages
  routes/          Route configuration
  services/        HTTP integration with the API
  storage/         Global state with Redux
  types/           Shared typings
  i18n/            Language configuration
```

## Notes

- The frontend currently operates with API-centered integration.
- The CMS no longer depends on Firebase or direct frontend calls to AWS in the current flow.
- Uploads, file signing, and metrics are consumed through API endpoints.
- The default Vite port is set to `3000`.
- The `@` alias points to `src`.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
