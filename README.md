# PulseMesh Frontend

PulseMesh is a Hebrew-first web platform demonstrating how mobile defibrillators and hybrid cellular/LoRa communication could shorten emergency response time. This repository contains the public website, registration flow, incident simulator, maps/routing, and protected administration interface.

## Links

- [Live website](https://pulsemesh.kobihanoch.com)
- [Live API](https://pulsemesh-api.kobihanoch.com)
- [Frontend repository](https://github.com/kobihanoch/PulseMesh-Frontend)
- [Backend repository](https://github.com/kobihanoch/PulseMesh-Backend)

> PulseMesh is an educational prototype. It does not contact MDA, emergency number 101, or any other emergency service.

## Assignment goals implemented

- Explain the medical motivation and hybrid LoRa/cellular concept.
- Register defibrillator owners and LoRa participants.
- Demonstrate an emergency incident on an interactive map.
- Show nearby candidates, simulated alerts, volunteer responses, and bicycle navigation.
- Provide protected fleet and incident administration.
- Use a responsive modern web stack, secure API communication, cloud deployment, and project documentation.

## User flows

### Public home page

The home page introduces PulseMesh, LoRa, and Meshtastic; explains parallel cellular and LoRa alerts; links to registration and the simulator; and provides links to LoRa stores and MDA's fixed-defibrillator information.

| Desktop | Mobile |
| --- | --- |
| ![Home desktop](docs/screenshots/home/desktop.png) | ![Home mobile](docs/screenshots/home/mobile.png) |

### Equipment registration

Public registration requires no account. A participant can register:

- A mobile defibrillator without LoRa.
- A mobile defibrillator paired with LoRa.
- A LoRa-only device that strengthens the network.

The form validates personal details, medical training, equipment details, DevEUI when required, and optional location.

| Desktop | Mobile |
| --- | --- |
| ![Registration desktop](docs/screenshots/registration/desktop.png) | ![Registration mobile](docs/screenshots/registration/mobile.png) |

### Incident simulator

The simulator lets a user choose an emergency point and radius. It displays eligible nearby candidates, simulates Push/LoRa delivery, records acceptance/rejection, and displays an OpenRouteService bicycle route with distance, duration, and instructions.

![Simulator map](docs/screenshots/simulator/desktop.png)

![Nearby candidates](docs/screenshots/simulator/results.png)

![Accepted candidate and route](docs/screenshots/simulator/accepted-route.png)

### Administration

The protected admin application includes:

- Dashboard totals.
- Registration editing and deletion.
- Defibrillator and LoRa device status management.
- Demonstration telemetry submission and history.
- Incident details, candidates, resolution, and cancellation.
- Push/low-battery notification and LoRa alert history.
- Public marketing-content editing.

| Login | Dashboard |
| --- | --- |
| ![Admin login](docs/screenshots/admin/login-desktop.png) | ![Admin dashboard](docs/screenshots/admin/dashboard.png) |

| Registrations | Devices |
| --- | --- |
| ![Registrations](docs/screenshots/admin/registrations.png) | ![Devices](docs/screenshots/admin/devices.png) |

| Incidents | Notifications |
| --- | --- |
| ![Incidents](docs/screenshots/admin/incidents.png) | ![Notifications](docs/screenshots/admin/notifications.png) |

| LoRa alerts | Marketing content |
| --- | --- |
| ![LoRa alerts](docs/screenshots/admin/lora-alerts.png) | ![Marketing content](docs/screenshots/admin/marketing-content.png) |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public explanation and links |
| `/register` | Public equipment registration |
| `/simulator` | Interactive incident simulation |
| `/admin/login` | Administrator login |
| `/admin` | Dashboard summaries |
| `/admin/registrations` | Registrant management |
| `/admin/devices` | Defibrillator and LoRa management |
| `/admin/incidents` | Incident management |
| `/admin/notifications` | Push and low-battery history |
| `/admin/lora-alerts` | Simulated LoRa Downlink history |
| `/admin/content` | Public content editor |

## Architecture

The frontend uses Next.js App Router and feature-oriented vertical slices:

```text
src/
├── app/       routes, layouts, and rendering boundaries
├── features/  auth, registration, simulator, marketing, and admin
├── shared/    API clients, validation helpers, and shared UI
└── proxy.ts   protected admin navigation and SSR session refresh
```

- Server Components load home/admin data and forward cookies.
- Client Components handle forms, maps, editors, simulator interaction, and toasts.
- Server API modules use a server-side Axios instance.
- Browser API modules use a client-side Axios instance.
- Failed protected browser requests attempt one refresh before redirecting to login.
- Concurrent SSR refreshes share one in-memory refresh promise per frontend instance.

```text
Browser
   |
   v
Next.js 16 (Vercel)
   |
   v
Express API (Render)
   |
   +--> PostgreSQL
   +--> MongoDB
   +--> OpenRouteService
```

The browser never connects directly to a database.

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Axios and Zod
- Leaflet, React Leaflet, and OpenStreetMap tiles
- Sonner notifications
- Vercel deployment

## Authentication flow

1. The admin submits credentials to Express.
2. Express issues five-minute access and fifteen-day refresh JWTs in HTTP-only cookies.
3. Browser and server-side requests forward the cookies.
4. When access expires, the frontend attempts one refresh and retries the request.
5. Refresh rotation and token versions prevent reuse and support global logout.
6. `proxy.ts` checks protected admin navigation.

JWTs are not stored in browser local storage.

## Local development

### Requirements

- Node.js 20+ and npm
- The [PulseMesh backend](https://github.com/kobihanoch/PulseMesh-Backend) on port 5000

### Installation

```powershell
git clone https://github.com/kobihanoch/PulseMesh-Frontend.git
cd PulseMesh-Frontend
npm install
Copy-Item .env.example .env.development
npm run dev
```

Configure `.env.development`:

```env
NODE_ENV=development
NEXT_PUBLIC_SERVER_API_URL=http://localhost:5000
```

Open `http://localhost:3000`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development mode |
| `npm run typecheck` | Run TypeScript validation |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |

## Production deployment

- Website: [pulsemesh.kobihanoch.com](https://pulsemesh.kobihanoch.com)
- Platform: Vercel with automatic GitHub deployment
- API: [pulsemesh-api.kobihanoch.com](https://pulsemesh-api.kobihanoch.com)
- Production environment: `NEXT_PUBLIC_SERVER_API_URL=https://pulsemesh-api.kobihanoch.com`

The backend accepts the deployed frontend origin and issues secure HTTP-only cookies over HTTPS. A Render free-tier cold start may delay the first API-backed page load.

## Known limitations

- Push, SMS, and LoRa delivery are simulated.
- Physical Meshtastic hardware, Bluetooth integration, and offline maps are not implemented.
- The simulator uses online OpenStreetMap tiles.
- The platform is not integrated with emergency services.
- Automated testing and production observability are not implemented.
- Telemetry history refreshes with the page; it is not streamed live.
- SSR refresh deduplication is in-memory and applies to one frontend instance.
