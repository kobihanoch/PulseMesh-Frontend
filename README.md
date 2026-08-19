# PulseMesh Frontend

The PulseMesh frontend is a Hebrew-first Next.js web application for explaining the project, registering mobile defibrillators/LoRa devices, demonstrating an emergency incident, and administering the registry.

- [Live website](https://pulsemesh.kobihanoch.com)
- [Backend documentation](../Backend/README.md)
- [Complete project documentation](../README.md)

## User flows

### 1. Home and emergency explanation

The server-rendered home page explains LoRa/Meshtastic, shows parallel LoRa and cellular/SMS emergency channels, presents editable marketing sections, links to LoRa purchasing options, and links to MDA's fixed-defibrillator information.

| Desktop | Mobile |
| --- | --- |
| ![Home desktop](docs/screenshots/home/desktop.png) | ![Home mobile](docs/screenshots/home/mobile.png) |

### 2. Equipment registration

Public registration requires no customer password. It supports a mobile defibrillator without LoRa, a mobile defibrillator with LoRa, or a LoRa-only participant. DevEUI is required only for LoRa equipment.

| Desktop | Mobile |
| --- | --- |
| ![Registration desktop](docs/screenshots/registration/desktop.png) | ![Registration mobile](docs/screenshots/registration/mobile.png) |

### 3. Incident simulator

The simulator selects an emergency GPS point and radius, displays nearby candidates, simulates Push/LoRa alerts, accepts or declines a response, and displays an OpenRouteService bicycle route. The documented flow below uses the separate demonstration point `31.94000, 34.77500`.

![Simulator initial map](docs/screenshots/simulator/desktop.png)

![Simulator candidate results](docs/screenshots/simulator/results.png)

![Simulator accepted candidate and route](docs/screenshots/simulator/accepted-route.png)

Mobile simulator:

![Simulator mobile](docs/screenshots/simulator/mobile.png)

### 4. Administration

Admin pages are protected by access/refresh JWT cookies and include registrations, devices, telemetry, incidents, Push notifications, LoRa alerts, and marketing content.

| Entry | Dashboard |
| --- | --- |
| ![Admin login](docs/screenshots/admin/login-desktop.png) | ![Admin dashboard](docs/screenshots/admin/dashboard.png) |

| Registrations | Devices |
| --- | --- |
| ![Admin registrations](docs/screenshots/admin/registrations.png) | ![Admin devices](docs/screenshots/admin/devices.png) |

| Incidents | Push notifications |
| --- | --- |
| ![Admin incidents](docs/screenshots/admin/incidents.png) | ![Admin notifications](docs/screenshots/admin/notifications.png) |

| LoRa alerts | Marketing content |
| --- | --- |
| ![Admin LoRa alerts](docs/screenshots/admin/lora-alerts.png) | ![Admin marketing content](docs/screenshots/admin/marketing-content.png) |

### Admin editing/detail flows

Registration owner editing and equipment details:

![Admin registration editing](docs/screenshots/admin/registration-edit.png)

LoRa status editing, telemetry submission, and telemetry history:

![Admin LoRa editing and telemetry](docs/screenshots/admin/lora-device-edit-telemetry.png)

Incident details, candidates, and resolve/cancel actions:

![Admin incident detail actions](docs/screenshots/admin/incident-detail-actions.png)

Marketing-section editing:

![Admin marketing editing](docs/screenshots/admin/marketing-edit.png)

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Zod
- Leaflet and React Leaflet
- Sonner notifications

## Rendering and API architecture

- Home and admin data pages use Server Components.
- Forms, maps, simulator actions, and editors use Client Components.
- Feature `server` modules use the configured server Axios client and forward cookies.
- Feature `api` modules use the configured browser Axios client.
- Protected client requests attempt one access-token refresh before redirecting to login.
- Next.js proxy middleware validates protected admin navigation.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public marketing and emergency explanation |
| `/register` | Passwordless equipment registration |
| `/simulator` | Map-based incident simulator |
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/registrations` | Registration management |
| `/admin/devices` | Device and telemetry management |
| `/admin/incidents` | Incident management |
| `/admin/notifications` | Push and low-battery history |
| `/admin/lora-alerts` | LoRa Downlink history |
| `/admin/content` | Marketing-content editor |

## Development setup

Create `.env.development` from `.env.example`:

```env
NODE_ENV=development
NEXT_PUBLIC_SERVER_API_URL=http://localhost:5000
```

Start the [backend](../Backend/README.md) first, then:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Commands

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

## Production status

Production deployment is pending. The final environment must set `NEXT_PUBLIC_SERVER_API_URL` to the deployed Express HTTPS URL. The backend must allow the deployed frontend origin and issue secure cookies correctly.

## Known limitations

- The web application simulates Push, SMS, and LoRa delivery.
- Physical LoRa, Meshtastic Bluetooth, and offline maps are not implemented.
- Telemetry history refreshes when the server-rendered device page reloads; it is not streamed live.
- The application is not connected to MDA or emergency number 101.
