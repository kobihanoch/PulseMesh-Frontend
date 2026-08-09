# PulseMesh frontend requirements and staged plan

This document translates the course requirements into frontend work and maps every feature to the backend that already exists. It is a plan, not an implementation. We will build it one stage at a time so that every Next.js and SSR concept can be understood before moving on.

## 1. What the finished frontend must provide

The site has three audiences:

1. **The public** — learns what PulseMesh, LoRa, and Meshtastic do; sees calls to action; follows purchase links; and registers equipment.
2. **A simulator user** — places an emergency on a map, chooses the search radius, and sees nearby defibrillators and simulated alert results.
3. **The administrator** — signs in and manages registrations, devices, incidents, telemetry, and marketing text.

Hebrew is the default language, so the entire layout must use `lang="he"` and `dir="rtl"`. The design should be responsive, with special attention to the registration form and incident simulator on phones.

## 2. Recommended Next.js architecture

Use the Next.js App Router, TypeScript, and Tailwind CSS.

### SSR strategy

- Pages that should be indexed and load with meaningful HTML—especially the home/marketing page—will be **Server Components rendered on the server**.
- Admin list/detail pages will also start as Server Components. They will load data on the server and send rendered HTML to the browser.
- Forms, maps, filters, dialogs, buttons, geolocation, and simulator interaction must be **Client Components**, because they use browser events or browser-only APIs.
- Mutations can use Next.js Server Actions or same-origin Route Handlers. For this project, Route Handlers provide the clearest boundary between browser code and the existing Express API.

### Backend-for-frontend (BFF)

The browser should call routes such as `/api/auth/login`, while Next.js Route Handlers forward requests to the Express backend. This is useful here because the backend stores access and refresh JWTs in HTTP-only cookies.

Benefits:

- Cookies stay HTTP-only and are never exposed to React code.
- Server Components can forward the incoming cookies during SSR.
- The frontend and browser use one origin, avoiding most CORS and cookie problems.
- A shared API helper can try `POST /auth/refresh` after a `401`, then retry the original request once.

The Express backend currently allows CORS origin `'localhost'`, which is not a valid full browser origin for normal local development. The BFF avoids depending on cross-origin browser requests, although the backend CORS configuration should still eventually use a value such as `http://localhost:3000` from an environment variable.

Suggested frontend structure:

```text
Frontend/
  app/
    (public)/page.tsx
    register/page.tsx
    simulator/page.tsx
    admin/login/page.tsx
    admin/layout.tsx
    admin/page.tsx
    admin/registrations/...
    admin/devices/...
    admin/incidents/...
    admin/content/...
    api/[...path]/route.ts
  components/
    ui/
    marketing/
    registration/
    map/
    admin/
  lib/
    api/server.ts
    api/client.ts
    api/types.ts
    auth.ts
    formatting.ts
```

## 3. Required pages and their backend connections

### A. Public home and marketing page — `/`

Required UI:

- A clear three-line Hebrew explanation of LoRa and how an emergency call reaches nearby defibrillator owners.
- A visual flow: emergency location or SMS → server geo-fencing → cellular push/SMS and LoRa/Meshtastic mesh → volunteer carries the defibrillator to the incident.
- Strong calls to action for participation, purchasing, maintenance, and registration.
- At least three external LoRa purchase links, clearly warning buyers to choose the legal/required **433 MHz** version.
- A visible link to MDA's fixed-defibrillator map.
- Short, clear explanations of the technology and how to use this site.

Backend mapping:

- `GET /marketing-content` supplies the editable sections: `participation`, `purchase`, `maintenance`, and `registration`.
- This page should fetch those sections in a Server Component, making it the clearest use of SSR in the project.
- Purchase URLs and the MDA URL are not represented in the current backend. Initially they can be typed configuration/constants in the frontend. If the admin must edit the URLs themselves, the backend model needs structured link fields.

### B. Public registration page — `/register`

Required fields:

- First name — required.
- Last name — optional.
- Mobile phone — required.
- Medical training — optional, because the general requirements mention it.
- Equipment choice — exactly one of:
  - mobile defibrillator without LoRa;
  - mobile defibrillator with LoRa;
  - LoRa device only.
- LoRa DevEUI — required only for either choice that includes LoRa; exactly 16 hexadecimal characters.
- Optional current location, obtained only after explicit browser permission or entered on a map.

Backend mapping:

- Submit to `POST /registrations`.
- The frontend choices map directly to backend `equipment.type`: `defibrillator_only`, `defibrillator_with_lora`, or `lora_only`.
- Send `defibrillator: { isMobile: true }` when a defibrillator is selected.
- Send `loraDevice: { devEui }` when LoRa is selected.
- Optional coordinates map to `location: { latitude, longitude }`.
- No customer password is needed, matching the requirement and current public endpoint.

The page needs inline validation, accessible error summaries, loading state, duplicate/validation error handling, and a success screen that preserves the returned registrant ID. The backend also exposes `PATCH /registrations/:registrantId/location`; a later client feature could use it to update a volunteer's location, but the endpoint currently has no ownership token, so exposing the registrant ID alone is not strong authorization.

### C. Prominent incident simulator — `/simulator`

This should be a major page rather than a small admin utility.

Required interaction:

1. Display a map centered on a useful region in Israel.
2. Let the user click/tap the incident point or use current GPS location.
3. Configure a radius from 100 to 50,000 metres (default 5,000).
4. Add an optional description.
5. Trigger the simulation with a clearly marked emergency/demo button.
6. Display the incident location, radius circle, and up to ten selected devices/candidates.
7. Show each candidate's distance, last transmission, battery, LoRa presence, notification results, and response state.
8. Draw an actual route/trail to a selected candidate, not a straight line, when a routing service is configured.
9. Clearly label the whole flow as a simulator so it cannot be mistaken for contacting emergency services.

Backend mapping:

- Submit `{ latitude, longitude, radiusMeters, source: "simulator", description? }` to `POST /incidents`.
- The response already contains the created incident and its nearby candidates, ordered by distance and limited to ten.
- The backend calculates geo-distance and simulates cellular and LoRa notification results.
- Candidate acceptance/decline maps to `PATCH /incidents/:incidentId/candidates/:candidateId` with `{ status: "accepted" | "declined" }`.

Map rendering and bicycle/trail directions are frontend integrations. A map library and tile provider are needed; a routing provider is also required for real trail directions. The backend currently stores no route geometry and has no routing endpoint. Offline maps, Bluetooth, real Meshtastic communication, real push/SMS, and real LoRa downlink belong to the future real application; the course requirement explicitly allows a web simulator without buying hardware.

### D. Admin login — `/admin/login`

Required UI:

- Identifier and password fields.
- Clear invalid-credentials and rate-limit messages.
- Redirect authenticated administrators to the dashboard.

Backend mapping:

- `POST /auth/login` accepts `{ identifier, password }`, returns user metadata, and sets `accessToken` and `refreshToken` HTTP-only cookies.
- `POST /auth/refresh` rotates the cookies and returns `204`.
- `POST /auth/logout` invalidates the session and returns `204`.
- The supplied seed credentials are `micha` / `1234`; they are demo credentials and should not be displayed publicly or used in production.

There is currently no `GET /auth/me` endpoint. After a full page refresh, the frontend can know that protected API calls succeed, but cannot directly retrieve the signed-in user's metadata. Adding `/auth/me` would make SSR session checks and the admin header cleaner. Until then, the admin layout can verify the session through a lightweight protected request and redirect on `401`.

### E. Admin dashboard — `/admin`

Required UI:

- Summary cards for registrations, devices, active/recent incidents, low-battery devices, and maintenance/out-of-service devices.
- Quick links to the management pages.
- A clear logout action.

Backend mapping:

- Counts can initially be derived from the paginated endpoints' `pagination.totalItems`.
- There is no dedicated dashboard/statistics endpoint and no direct `battery < 20` filter. Fetching entire collections just to calculate dashboard values would be inefficient; a future aggregate endpoint is recommended.

### F. Registration management — `/admin/registrations`

Required UI:

- Server-rendered paginated table.
- Search by owner details.
- Detail page showing owner, coordinates, defibrillators, and LoRa devices.
- Edit owner fields and delete a registration after confirmation.

Backend mapping:

- `GET /registrations?page=&limit=&search=`
- `GET /registrations/:registrantId`
- `PATCH /registrations/:registrantId` updates owner/profile fields only.
- `DELETE /registrations/:registrantId`

### G. Fleet/device management — `/admin/devices`

Required UI:

- Server-rendered paginated list with filters for device type, status, and owner.
- Distinct badges for defibrillator state (`working`, `maintenance`, `out_of_service`) and LoRa state (`active`, `inactive`, `maintenance`).
- Battery indicator, low-battery warning below 20%, last GPS coordinates, and last transmission time for LoRa devices.
- Edit dialog/detail page and deletion confirmation.
- Telemetry history table for each LoRa device.

Backend mapping:

- `GET /devices?page=&limit=&deviceType=&status=&ownerId=`
- `GET /devices/:deviceType/:deviceId`
- `PATCH /devices/:deviceType/:deviceId`
- `DELETE /devices/:deviceType/:deviceId`
- `GET /devices/lora/:deviceId/telemetry?page=&limit=`

The backend receives live/simulated reports through public `POST /telemetry`; normal site users should not need a UI for that endpoint. The simulator seed script can populate approximately 50 devices as required.

### H. Incident administration — `/admin/incidents`

Required UI:

- Paginated incident list with status, source, time, coordinates, and radius.
- Detail page with a map and candidate table.
- Candidate statuses and simulated cellular/LoRa notification results.
- Controls to mark an active incident resolved or cancelled.

Backend mapping:

- `GET /incidents?page=&limit=`
- `GET /incidents/:incidentId`
- `PATCH /incidents/:incidentId` with `{ status: "resolved" | "cancelled" }`.

The list endpoint does not currently support filtering by status/source or searching by date; these would require backend additions if desired.

### I. Marketing content editor — `/admin/content`

Required UI:

- Four editable sections: participation, purchase, maintenance, and registration.
- Preview, save state, validation errors, and unsaved-changes warning.
- Safe rendering: use plain text or a controlled Markdown renderer; never inject arbitrary HTML directly.

Backend mapping:

- Load with public `GET /marketing-content`.
- Save with protected `PATCH /marketing-content/:section` and `{ content }` (maximum 20,000 characters).

This fulfills the requirement that the administrator can conveniently edit the site's marketing pages.

## 4. Shared frontend work

- Hebrew RTL root layout, Hebrew labels, localized dates/numbers, and an accessible font.
- Responsive header/footer and mobile navigation.
- Reusable buttons, inputs, select controls, cards, tables, badges, pagination, dialogs, alerts, loading skeletons, empty states, and error states.
- Shared TypeScript API types matching the backend's Zod/Drizzle response shapes.
- Server API client that forwards cookies and disables/revalidates cache appropriately.
- Browser API client for interactive actions, with credentials and a single refresh-and-retry flow.
- Admin route protection and redirect behavior.
- Metadata, page titles, descriptions, semantic headings, keyboard support, contrast, and focus states.
- Map loading/error states and a non-map textual alternative for important results.
- Environment variables such as `BACKEND_URL`, a public map tile configuration, and optional routing API configuration.
- Tests for registration validation, API error handling, authentication refresh, and simulator payload/result rendering.

## 5. Backend gaps or decisions to resolve

These are not reasons to block the first frontend stages, but should be tracked:

1. **No `/auth/me`:** recommended for clean SSR authentication and user metadata after refresh.
2. **CORS origin:** currently `'localhost'`; should be environment-driven if the browser ever calls Express directly.
3. **Public location update ownership:** `PATCH /registrations/:id/location` is public and identification is based on a URL ID. A registration-specific secret or authenticated device credential would be safer for a real deployment.
4. **Telemetry ingestion is public:** real LoRa gateways should authenticate/sign telemetry requests.
5. **Marketing links are unstructured:** purchase and MDA URLs need frontend configuration or an expanded content model if admins must edit URLs.
6. **No real-time transport:** there is no WebSocket or Server-Sent Events endpoint. The simulator can display the immediate create response; live updates would require polling or a backend real-time channel.
7. **Routing/offline maps:** no backend route service or offline tile system exists. Use an external routing service for the web demo or clearly mark route drawing as a later integration.
8. **Maintenance push notification:** the backend stores battery telemetry, but the current notification service should be verified/extended if it does not actually issue the required below-20% owner alert.
9. **Dashboard aggregation:** add a stats endpoint later to avoid expensive frontend aggregation.

## 6. Build order for learning

Each stage should end with a small working feature and a short explanation of the relevant Next.js concept.

### Stage 1 — Foundation and SSR shell

- Initialize Next.js App Router with TypeScript and Tailwind.
- Create Hebrew RTL root layout, navigation, base UI tokens, environment validation, and API types.
- Implement the Express proxy/BFF and server/browser fetch helpers.
- Build a simple SSR home page and explain Server Components versus Client Components.

**Done when:** Hebrew HTML is rendered by the server, responsive navigation works, and the frontend can read `GET /marketing-content` through its own origin.

### Stage 2 — Public marketing site

- Build the full home page, LoRa flow diagram, marketing sections, purchase links, and MDA link.
- Add accessible responsive styling and metadata.

**Done when:** all public explanatory/marketing requirements are visible in Hebrew and marketing text comes from the backend during SSR.

### Stage 3 — Registration

- Build the conditional equipment form and validation.
- Add optional browser geolocation/map selection.
- Submit to `POST /registrations` and build success/error states.

**Done when:** all three eligible registration types create the correct backend records without a password.

### Stage 4 — Incident simulator

- Integrate the map, point selection, radius control, and incident creation.
- Render nearby candidates, notifications, battery, distance, and timestamps.
- Add candidate response simulation and, if configured, bicycle/trail routing.

**Done when:** a seeded device population appears around an incident and the end-to-end simulated emergency flow is understandable visually.

### Stage 5 — Authentication and admin shell

- Build login/logout, cookie forwarding, refresh-and-retry, route protection, and admin navigation.
- Build initial dashboard cards from existing list endpoints.

**Done when:** anonymous users cannot view admin data, seeded admin login works, SSR protected pages load, refresh works, and logout clears the session.

### Stage 6 — Admin management pages

- Registrations: list, search, detail, edit, delete.
- Devices: filters, status/battery display, edit, delete, telemetry history.
- Incidents: list, detail/map/candidates, resolve/cancel.
- Content: edit and preview four marketing sections.

**Done when:** the administrator can conveniently maintain all data exposed by the backend.

### Stage 7 — Quality, deployment, and presentation

- Accessibility, mobile layout, error/loading/empty states, tests, and performance review.
- Production environment and cookie/CORS verification.
- README installation/deployment instructions, architecture diagram, known-bugs list, and presentation material required by the course.

**Done when:** a fresh clone can be run from documented instructions, the cloud URL works, and known limitations are disclosed.

## 7. What SSR means in this project

SSR does not mean every component avoids JavaScript. It means the initial page data and HTML are produced on the server where that is useful. In this project:

- Home marketing content: server-rendered.
- Admin tables and detail pages: server-rendered from URL search parameters.
- Registration form: server-rendered shell plus client-side interactive form.
- Simulator: server-rendered page shell plus a client-side map and controls.
- Mutations: executed through same-origin server endpoints, followed by navigation, refresh, or targeted client state updates.

This hybrid model uses Next.js well and remains easy to explain during the course defense.

## 8. Definition of overall completion

The frontend meets the stated requirements when it provides a Hebrew-first, responsive public site; server-rendered marketing content; passwordless equipment registration for all allowed equipment combinations; a prominent map-based incident simulator with seeded nearby devices and configurable radius; an HTTP-only-cookie admin login with refresh; convenient admin management for registrations, devices, telemetry, incidents, and marketing content; required purchase/MDA links; and clear documentation of setup, architecture, cloud deployment, and known limitations.
