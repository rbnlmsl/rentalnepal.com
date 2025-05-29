# RentalNepal.com

RentalNepal.com is a full-stack marketplace for rental properties in Nepal.  
The codebase is **Next.js (App Router) + TypeScript** on the frontend and **PostgreSQL + PostGIS with Prisma ORM** on the backend.  
It delivers lightning-fast, map-centric search with sophisticated filters (radius/polygon search, amenities, price ranges, etc.).

---

## ✨ Features

* Responsive React UI built with Tailwind CSS & shadcn/ui components.  
* Secure user auth (to be implemented) and landlord dashboards.  
* Advanced property filtering:
  * Keyword, city, price, bedrooms, amenities…
  * Geospatial **radius** (“near me”) & **polygon** (“draw on map”) search powered by PostGIS.
  * Sorted by price, date or distance.
* RESTful API under `/api` (runs inside Next.js server functions).
* Prisma schema + raw PostGIS migrations, fully type-safe queries.
* One-command local setup script (`scripts/setup-database.sh`).

---

## 🖥️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend runtime | Next.js API Routes (Node.js 18) |
| ORM | Prisma |
| Database | PostgreSQL 14 + PostGIS |
| Validation | zod |
| Dev Tools | bun / npm / pnpm, ESLint, Prettier |

---

## 🚀 Quick Start (Local Dev)

### 1. Prerequisites
* Node.js ≥ 18 (install [bun](https://bun.sh) or npm/pnpm).
* PostgreSQL 14+ with the **PostGIS** extension available.
  * macOS Homebrew: `brew install postgresql postgis`.
  * Ubuntu: `sudo apt install postgresql postgresql-14-postgis-3`.

### 2. Clone & install packages
```bash
git clone https://github.com/rbnlmsl/rentalnepal.com.git
cd rentalnepal.com
bun install        # or: npm install / pnpm install
```

### 3. Run the database helper (creates DB, enables PostGIS, runs migrations, seeds demo data)
```bash
./scripts/setup-database.sh
```
The script updates `.env` with a ready-to-use `DATABASE_URL`.

### 4. Start the dev server
```bash
bun run dev        # or: npm run dev / pnpm dev
# open http://localhost:3000
```

---

## 🗄️ Backend / Advanced Filtering

### Database Schema (excerpt)

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `latitude` / `longitude` | Float | raw coords |
| `location` | `geography(Point,4326)` | PostGIS point, GiST indexed |
| `propertyType` | Enum | HOUSE / APARTMENT / … |
| `rentAmount` | Decimal(10,2) | indexed |
| `amenities` | `text[]` | GIN indexed |
| `availabilityDate` | Date | filter `<=` |
| `status` | Enum | AVAILABLE / RENTED / … |

Raw SQL migration (`prisma/migrations/postgis-setup.sql`) adds `location`, index & trigger to sync lat/lon.

### Core Service

`src/lib/propertyService.ts` builds dynamic Prisma queries or `$queryRaw` SQL for geospatial clauses:

* **Radius** – `ST_DWithin(location, ST_MakePoint(lon,lat)::geography, radius)`.
* **Polygon** – `ST_Within(location::geometry, ST_GeomFromText(wkt,4326))`.

Utility helpers in `src/lib/geoUtils.ts` parse/validate coordinates.

### REST API

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/properties` | POST | create listing |
| `/api/properties/[id]` | GET/PUT/PATCH/DELETE | CRUD one listing |
| `/api/properties/search` | GET | **advanced filtering** |

`GET /api/properties/search` parameters (all optional):

```
q, city, postcode, propertyType, minPrice, maxPrice,
minBedrooms, maxBedrooms, amenities,
latitude, longitude, radius, radiusUnit=km|m,
polygon, sortBy, sortOrder, page, limit
```

Example:

```
/api/properties/search?city=Kathmandu&minPrice=3000&maxPrice=8000&
latitude=27.7&longitude=85.32&radius=5&radiusUnit=km&sortBy=distance
```

Returns:

```json
{
  "properties": [ ... ],
  "total": 48,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

## 🧪 Testing

* Unit tests for helpers & services planned with Vitest.
* Integration tests can hit the API with Jest + Supertest against a Docker-based Postgres + PostGIS container.

---

## 🛫 Deployment

* Provision a managed PostgreSQL with PostGIS (Neon, Supabase, AWS RDS).  
* Set `DATABASE_URL` environment variable.  
* Build & deploy on Vercel, Render, or Docker/Kubernetes.  
* Run `npx prisma migrate deploy` and execute `prisma/migrations/postgis-setup.sql` on first boot.

---

## 📝 License

MIT © 2025 Rabin Lamsal
