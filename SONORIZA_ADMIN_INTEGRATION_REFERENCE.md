# Sonoriza Admin - Full Integration Reference

## Purpose of this document

This file documents the current state of Sonoriza Admin.

It is intended to keep the CMS documented as a frontend client of the Sonoriza API, including:
- architecture
- session behavior
- domain flows
- API integration points
- current limitations in the admin implementation

## Connected backend reference

Sonoriza Admin is expected to run against Sonoriza API.

Reference backend environment:
- Swagger: [https://sonoriza-api.onrender.com/api](https://sonoriza-api.onrender.com/api)
- API base URL: `https://sonoriza-api.onrender.com`

In local development, the frontend reads the backend URL from:

```env
VITE_API_URL=
```

## Product context

Sonoriza Admin is the web CMS responsible for administrative operations in the Sonoriza platform.

The current admin already supports:
- administrator authentication
- device-aware session creation
- single-session account flow coordinated by the backend
- access token and refresh token persistence
- automatic session refresh in the HTTP client
- backend-backed logout with session invalidation
- artist catalog management
- music catalog management
- genre management
- user administration
- file upload through the backend
- CloudFront URL signing through the backend
- bucket metrics visualization through the backend
- dashboard visualization based on API data

The CMS no longer depends on direct frontend integration with Firebase or AWS for the current operational flow.

## Current architecture

The frontend codebase is organized around reusable UI modules, global state, and HTTP integration:

```text
src/
  assets/
  components/
    Artists/
    Button/
    FloatMenu/
    FormArtist/
    FormMusic/
    FormMusicalGenres/
    Graphics/
    Layout/
    Modal/
    MusicalGenres/
    Musics/
    Notifications/
    SignCloudFrontUrl/
    Users/
    form/
  hooks/
  i18n/
  pages/
    Error/
    Home/
    SignIn/
  routes/
  services/
  storage/
    modules/
  types/
  main.tsx
```

Main architectural characteristics:
- React SPA built with Vite
- Redux Toolkit used for global state
- redux-persist used for store persistence
- React Hook Form used in admin forms
- Axios used as the HTTP client
- route rendering handled by React Router
- modals, toasts, and floating menu behavior abstracted into hooks/providers

## Current frontend stack

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
- ApexCharts
- Vitest

## Runtime and setup

### Requirements

- Node.js 22
- npm or yarn
- Sonoriza API configured and running

### Install dependencies

```bash
npm install
```

Or:

```bash
yarn
```

### Configure environment

At minimum:

```env
VITE_API_URL="http://localhost:3333"
```

Current note:
- the active HTTP client depends on `VITE_API_URL`
- legacy environment variables may still exist in local files, but they are not required for the current API-centered admin flow

### Start the admin

```bash
npm run start
```

Application:
- `http://localhost:3000`

## Scripts

- `npm run start` - start development server with Vite
- `npm run serve` - run local mock with `json-server`
- `npm run build` - production build
- `npm run preview` - local preview of the production build
- `npm run lint` - lint the project
- `npm run test` - run tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:coverage` - run tests with coverage
- `npm run test:ui` - open Vitest UI

Yarn equivalents:
- `yarn start`
- `yarn serve`
- `yarn build`
- `yarn lint`
- `yarn test`

## Routing model

Current routes:
- `/` - sign-in screen
- `/home` - main admin dashboard

Current behavior:
- route registration is handled through React Router
- `/` is wrapped in a public route
- `/home` is wrapped in a private route
- route bootstrap can attempt token refresh before resolving access

## State management model

Global state is managed with Redux Toolkit.

Current persisted slices:
- `admin`
- `artists`
- `trackListRemote`
- `musicalGenres`
- `users`

Current non-persisted slice:
- `sideMenu`

Persistence notes:
- redux-persist is configured at the root reducer level
- the side menu selection is explicitly blacklisted from persistence
- client session cleanup clears the relevant slices and stored tokens

## HTTP client behavior

The admin uses a centralized Axios instance.

Current HTTP behavior:
- reads base URL from `VITE_API_URL`
- injects `Authorization: Bearer <token>` when an access token exists
- attempts `POST /sessions/refresh` on `401`
- retries the original request after a successful refresh
- clears the client session and redirects to `/` when refresh fails

Current token storage keys:
- `@SONORIZA_ACCESS_TOKEN`
- `@SONORIZA_REFRESH_TOKEN`

Current device storage key:
- `@SONORIZA:WEB_DEVICE_KEY`

## Authentication and session behavior

## Current access model in the admin

The CMS currently uses both:
- `access_token` for protected requests
- `refresh_token` for refresh and logout flows

The web client also sends device information when creating a session.

### Login

Endpoint used:
- `POST /sessions`

Current frontend behavior:
- sends `email`, `password`, and `device`
- generates or reuses a persisted web `deviceKey`
- derives browser and OS information from the runtime
- reads `access_token`, `refresh_token`, and `user` from the response
- validates `user.role === 'ADMIN'` in the client
- stores access and refresh tokens in local storage
- stores admin profile data in Redux
- redirects to `/home`

Current device payload shape includes:
- `deviceKey`
- `platform`
- `deviceName`
- `manufacturer`
- `model`
- `osName`
- `osVersion`
- `appVersion`

### Session persistence

Current implementation:
- persists the access token in local storage
- persists the refresh token in local storage
- persists a web device key in local storage
- persists admin-related state in Redux Persist
- automatically attaches the access token to protected API requests

### Refresh flow

Current implementation:
- if the app has only a refresh token, route bootstrap can attempt refresh before resolving access
- if a protected request returns `401`, the HTTP client attempts `POST /sessions/refresh`
- the original request is retried after a successful refresh
- concurrent refresh attempts are deduplicated in the client
- if refresh fails, the client session is cleared and the user is redirected to `/`

### Unauthorized behavior

When the API returns `401`:
- the client first tries to refresh the session
- if refresh succeeds, the original request is replayed
- if refresh fails, tokens and client state are cleared and the user is redirected to `/`

### Sign out

Current sign-out behavior in the UI:
- reads the stored `refresh_token`
- calls `POST /sessions/logout` when a refresh token exists
- clears artists, musics, genres, users, and admin slices
- clears stored access and refresh tokens
- redirects to `/`
- keeps the persisted web device key so the browser identity remains stable across logins

### Current limitations in session flow

Not implemented yet in the current admin code:
- session status UI while access is being resolved
- explicit handling for multi-device/session-conflict responses beyond surfacing backend error messages

Current operational caveat:
- if browser storage is manually cleared without calling logout, the backend session can remain active until it is invalidated, refreshed elsewhere, or expires according to backend policy
- in that situation, the account can appear "stuck" from the user perspective even though the CMS has already lost the local tokens

The admin now consumes the main session lifecycle endpoints exposed by the API.

## Dashboard bootstrap flow

When the user enters `/home`, the admin currently fetches initial dashboard data through the API.

Initial requests:
- `GET /musics`
- `GET /artists`
- `GET /genres`
- `GET /users`
- `GET /metrics/storage`
- `GET /metrics/overview`

Current behavior:
- catalog and users are loaded into Redux
- the music bootstrap stores both the first page items and the pagination meta returned by the API
- storage and overview metrics are stored in local component state for charts
- the graphics area is rendered only after metrics finish loading
- failures surface toast notifications

## Music domain in the CMS

### What the music flow currently covers

The CMS supports:
- list musics
- search musics by title through the API
- create music
- edit music
- delete music
- upload cover art and audio before persisting the music

### Endpoints currently used by the admin

- `GET /musics`
- `GET /musics?page=<n>`
- `GET /musics?page=<n>&title=<query>`
- `GET /musics/:id`
- `POST /musics`
- `PATCH /musics/:id`
- `DELETE /musics/:id`
- `POST /uploads`

### Current create/edit flow

The admin currently:
1. lets the operator choose title, album, artists, genre, color, artwork, and audio
2. uploads artwork and audio through `POST /uploads`
3. reads returned `signedUrl` values
4. sends the final music payload to the API
5. reloads artist data and reloads the already-open music pages after a successful mutation

Current payload assembly includes:
- `title`
- `album`
- `slug`
- `artistIds`
- `genreId`
- `url`
- `artwork`
- `color`

### Current UI behavior

- artwork colors are extracted client-side from the dropped image
- edit mode fetches the music by id before populating the form
- artist selection is maintained locally in component state
- the first music page is loaded during dashboard bootstrap and stored with pagination meta
- the music list auto-loads the next page when the scroll reaches roughly 80 percent of the page
- previously loaded music pages remain rendered when a new page is appended
- the automatic loader stops when `page === lastPage`
- title search uses the API filter and keeps the same incremental pagination behavior

## Artist domain in the CMS

### What the artist flow currently covers

The CMS supports:
- list artists
- search artists locally by name
- create artist
- edit artist
- delete artist
- inspect musics linked to an artist
- upload artist image before persisting the artist

### Endpoints currently used by the admin

- `GET /artists`
- `POST /artists`
- `PATCH /artists/:id`
- `DELETE /artists/:id`
- `GET /musics?artistId=<artist-id>`
- `POST /uploads`

### Current create/edit flow

The admin currently:
1. collects artist name and selected genre ids
2. uploads the artist image through `POST /uploads` when a new file is provided
3. sends the artist payload to the API
4. reloads the artist list after mutation

Current payload assembly includes:
- `name`
- `photoURL`
- `genreIds`

### Current UI behavior

- artist detail modal can open linked musics
- linked musics are fetched from `/musics?artistId=<artist-id>`
- genre selection is handled locally before the final API call

## Genre domain in the CMS

### What the genre flow currently covers

The CMS supports:
- list genres
- create genre
- edit genre
- visualize music count per genre in the UI

### Endpoints currently used by the admin

- `GET /genres`
- `POST /genres`
- `PATCH /genres/:id`

### Current UI behavior

- clicking a genre opens the edit form in a modal
- music totals by genre are derived from already loaded music data in Redux

### Current limitation

Not exposed in the current genre UI:
- `DELETE /genres/:id`

The API supports genre deletion, but the current CMS screen does not surface that mutation yet.

## User domain in the CMS

### What the user flow currently covers

The CMS supports:
- list users
- inspect user summary data
- change active status
- copy FCM token when available in the returned user payload

### Endpoints currently used by the admin

- `GET /users`
- `PATCH /users/:id/status`

### Current UI behavior

- user status is changed through a select control
- after status mutation, the admin reloads the user list
- favorites counts are derived from the payload returned by the API

## Upload and signed URL domain in the CMS

### Uploads

The admin currently uses backend-mediated upload.

Endpoint used:
- `POST /uploads`

Current folders used by the CMS:
- `artists`
- `musics`

Current upload use cases:
- artist image upload
- music artwork upload
- music audio upload

### Sign existing URL

The CMS exposes a utility screen for signing existing CloudFront URLs.

Endpoint used:
- `POST /uploads/sign`

Current UI behavior:
- allows one or more URLs
- signs all entered URLs in parallel
- displays the signed outputs
- supports copy to clipboard

## Metrics and dashboard analytics

### Metrics source

The dashboard consumes backend metrics through:
- `GET /metrics/storage`
- `GET /metrics/overview`

### Current chart behavior

The UI currently renders:
- bucket size historical chart
- number of objects chart
- total items donut chart based on artists, musics, genres, and users
- musics by genre chart
- artists by genre chart

Current data source split:
- `GET /metrics/storage` powers the storage history charts
- `GET /metrics/overview` powers totals, musics by genre, and artists by genre
- overview charts no longer depend on paginated frontend catalog slices

### Current implementation note

Some labels in the chart and side menu still reference older terminology such as `S3` or `Firebase`, even though the data now comes from the API.

## Notifications area

There is a notification form component in the codebase, but it is not part of the active operational menu.

Current state:
- the side menu entry is commented out
- upload handling for notifications is incomplete
- no API-backed notification sending flow is implemented in the current admin

This area should be considered non-operational at the current stage.

## Internationalization

The admin includes i18n setup with:
- `pt-BR`
- `en-US`

Current note:
- the application contains internationalization structure, but much of the visible UI copy is still hardcoded in components

## What the admin should use from the API

Sonoriza Admin should rely on the API for:
- login through `POST /sessions`
- refresh through `POST /sessions/refresh`
- logout through `POST /sessions/logout`
- music CRUD through `/musics`
- artist CRUD through `/artists`
- genre management through `/genres`
- user administration through `/users`
- uploads through `/uploads`
- signed URL generation through `/uploads/sign`
- storage metrics through `/metrics/storage`
- dashboard overview metrics through `/metrics/overview`

The admin should not call AWS services directly.

## Current limitations and next natural steps

Known limitations in the current admin implementation:
- genre deletion is not exposed in the current UI
- notifications flow is incomplete
- some legacy labels still mention older infrastructure terms
- only the music list currently uses incremental API pagination in the UI
- clearing browser storage without logout can leave an active backend session behind until backend invalidation or expiration

Most natural next steps:
- add a better loading or splash state while auth is being resolved
- surface clearer UX for active-session conflicts between devices
- extend the pagination pattern to other large admin lists when the volume justifies it
- expose genre deletion if it is part of the intended admin workflow
- remove legacy naming in the UI to reflect the API-centered architecture

## Executive summary

Sonoriza Admin is currently an API-centered administrative CMS for the Sonoriza platform.

At the current stage, it already provides:
- admin authentication with device-aware session creation
- backend-aligned single-session account behavior
- access-token requests with refresh-token recovery
- catalog operations for artists, genres, and musics
- user administration
- backend-mediated uploads
- backend-mediated URL signing
- backend-mediated storage and overview metrics
- Redux-backed dashboard state

The remaining gaps are mostly UX and completeness details around the newer session model, not the basic integration itself.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
