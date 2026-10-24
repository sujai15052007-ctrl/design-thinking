# ReRoot — Regenerative Food Waste Management

ReRoot helps households and local food businesses track food before it expires, find recipes, donate surplus to shelters, and share extra food with neighbors. The React/Vite client now uses an Express API backed by MySQL.

## Features

- Food inventory, expiry alerts, barcode lookup through Open Food Facts, and metric/imperial display conversion
- Shelter matching on an OpenStreetMap-based map and scheduled food donations
- Community surplus listings, claims, and notifications
- Recipes matched against food approaching expiry
- Waste diversion analytics, CO2 estimates, activity streak calendar, and CSV exports
- Eco points, streaks, badges, leaderboard, and an NGO donation dashboard
- Profile, account roles (`home`, `business`, `ngo`), onboarding, and dark mode
- Daily expiry reminders; email delivery is optional and requires SMTP configuration

## Requirements

- Node.js 20.19+ (recommended: current LTS) and npm
- MySQL 8.0+ (JSON columns and `CHECK`/foreign-key support)

## Setup

### 1. Install dependencies

From the project root:

```powershell
npm install
npm --prefix server install
```

### 2. Create the database and seed demo data

The schema creates the `reroot` database and its tables:

```powershell
mysql -u root -p < server/schema.sql
mysql -u root -p reroot < server/seed.sql
```

You may also run these two SQL files using MySQL Workbench. Use a MySQL account with permission to create the database, tables, and seed rows.

The seed includes eight Vancouver-area food banks/shelters, five badges, and one demo account per role:

| Role | Email | Password |
|---|---|---|
| Home cook | `home@reroot.local` | `password` |
| Business | `business@reroot.local` | `password` |
| NGO | `ngo@reroot.local` | `password` |

Change demo passwords before using these accounts outside a local development environment.

### 3. Configure the API environment

Copy `server/.env.example` to `server/.env`, then set MySQL credentials and a private JWT secret. The API reads database credentials and secrets from environment variables; do not commit `.env`.

```powershell
Copy-Item server\.env.example server\.env
```

Required settings:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=reroot
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

The optional SMTP variables in `server/.env.example` enable email reminders. With SMTP settings omitted, reminders are created as in-app notifications only.

### 4. Start the application

Run both Vite and the API:

```powershell
npm run dev
```

Or run one process at a time:

```powershell
npm run dev:client
npm run dev:server
```

The client is served at `http://localhost:5173`; the API listens at `http://localhost:5000`. Vite proxies `/api` requests to the API. For production, use `npm run build` to build the client and `npm --prefix server start` to start the API.

## API

Except for registration and login, API routes require `Authorization: Bearer <token>`. Tokens expire after seven days. Validation and server errors use JSON responses with an `error` field. NGO endpoints and donation acceptance/completion require the `ngo` role.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Sign in and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Read the signed-in account |
| GET, POST | `/api/inventory` | Authenticated | List items with category/location/status/search/sort filters; add an item |
| PUT, PATCH, DELETE | `/api/inventory/:id` | Authenticated | Edit, change status (`PATCH /:id/status`), or remove an owned item |
| GET | `/api/alerts?days=3` | Authenticated | Read expiring food alerts |
| GET | `/api/notifications` | Authenticated | List notifications |
| POST | `/api/notifications/read` | Authenticated | Mark notifications read; omit IDs to mark all read |
| GET | `/api/analytics` | Authenticated | Monthly waste/diversion, category breakdown, and impact totals |
| GET | `/api/analytics/history` | Authenticated | Read waste activity history for CSV export |
| GET | `/api/shelters?lat=49.26&lng=-123.12` | Authenticated | List shelters, optionally nearest-first |
| GET, POST | `/api/donations` | Authenticated | List a donor's donations or schedule a donation |
| PATCH | `/api/donations/:id` | Donor / NGO | Cancel as donor; accept or complete as NGO |
| GET | `/api/ngo/incoming-donations` | NGO | View incoming and completed donations |
| GET | `/api/ngo/stats` | NGO | Read donation count and received weight |
| GET, POST, DELETE | `/api/marketplace` | Authenticated | Browse, post, or remove an open listing |
| POST | `/api/marketplace/:id/claim` | Authenticated | Claim an available listing |
| GET | `/api/recipes/suggest` | Authenticated | Suggest recipes from soon-expiring items |
| GET | `/api/rewards` | Authenticated | Read eco score, streak, and earned badges |
| GET | `/api/leaderboard` | Authenticated | Read community rankings |
| GET, PUT | `/api/profile` | Authenticated | Read or update name, role, units, theme, and preferences |
| GET | `/api/health` | Public | Check API process health |

## Data and privacy notes

The MySQL database is the source of truth for accounts, food inventory, notifications, donations, marketplace activity, rewards, and analytics history. Browser `localStorage` is limited to the JWT, theme, unit preference, and onboarding-completed flag. MySQL stores mass quantities in kilograms; the client converts them for display based on the saved unit preference.

Barcode scanning needs camera permission and internet access. Product names/categories are looked up using Open Food Facts; recipe suggestions use TheMealDB with local recipe suggestions as a fallback. The map uses OpenStreetMap tiles.
