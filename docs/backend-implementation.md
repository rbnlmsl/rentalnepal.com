# Backend Implementation Guide  
_nextgen-rentals – Advanced Property Filtering_

## 1. Architecture Overview
### High-level Diagram
```
[Client] ──HTTP──► [Next.js API Routes] ── Prisma Client ─► [PostgreSQL + PostGIS]
                                          ▲                        │
                                          │                        │(SQL/Geo)
                                          └─────── Log / Metrics ◄─┘
```

* **Framework**: Next.js (App Router) – server-side functions live under `src/app/api/**`.
* **Data Layer**: Prisma ORM (`src/lib/prisma.ts`) generates a typed client (`src/generated/prisma`).
* **Database**: PostgreSQL 14+ with PostGIS extension for geospatial types & functions.
* **Domain Services**: `src/lib/propertyService.ts` encapsulates all filtering logic.
* **Utility Layer**: `src/lib/geoUtils.ts` provides radius/polygon helpers.
* **Validation**: `zod` schemas in `src/lib/validators.ts` harden input.
* **Deployment Targets**: Works on traditional servers, container platforms (Docker/K8s) or Vercel (Edge functions fallback to Node runtime).

## 2. Database Schema

### 2.1 Prisma Model (excerpt)
| Field | Type | Notes |
|-------|------|-------|
| `id` | `String @id @default(uuid())` | Primary key |
| `landlordId` | `String` | FK to `User` (not yet modelled) |
| `title`, `description` | `String` / `String? @db.Text` | Full-text search candidates |
| `latitude`, `longitude` | `Float` | Stored for quick display & migration |
| `location` | `geography(Point,4326)` | Added by raw SQL; indexed via **GIST** |
| `propertyType` | `enum PropertyType` | HOUSE, APARTMENT, … |
| `rentAmount`, `depositAmount` | `Decimal(10,2)` | Money values |
| `bedrooms`, `bathrooms`, `areaSqft` | `Int` | Numeric filters |
| `amenities` | `String[]` | Array column with **GIN** containment queries |
| `availabilityDate` | `DateTime` | Compare `<=` for “available before” |
| `status` | `enum PropertyStatus` | default `AVAILABLE` |
| timestamps | `createdAt`, `updatedAt` | auto managed |

Indexes  
```sql
CREATE INDEX idx_property_location ON "Property" USING GIST (location);
CREATE INDEX idx_property_type       ON "Property"(propertyType);
CREATE INDEX idx_property_rent       ON "Property"(rentAmount);
-- GIN
CREATE INDEX idx_property_amenities  ON "Property" USING GIN (amenities);
```

### 2.2 PostGIS Trigger
`prisma/migrations/postgis-setup.sql` installs:
* `location` column
* trigger `trigger_update_property_location` to sync lat/lon → geography
* spatial index

## 3. REST API End-points (v1)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/properties` | **POST** | Create listing. Body validated by Zod + Prisma types. |
| `/api/properties` | **GET** | Soft redirect message → use `/search`. |
| `/api/properties/search` | **GET** | Main search with advanced filters (see below). |
| `/api/properties/[id]` | **GET** | Fetch single listing. |
| `/api/properties/[id]` | **PUT/PATCH** | Full / partial update. |
| `/api/properties/[id]` | **DELETE** | Remove listing. |

### 3.1 `/api/properties/search` Parameters
Standard filters  
`q, city, postcode, propertyType, minPrice, maxPrice, minBedrooms, … amenities, availabilityDate …`

Geospatial  
* **Radius**: `latitude`, `longitude`, `radius` (`radiusUnit` default **m**).  
  -> `ST_DWithin(location, ST_SetSRID(ST_MakePoint(lon,lat),4326)::geography, radiusMeters)`
* **Polygon**: `polygon` (GeoJSON string or `lon1,lat1,…`).  
  -> `ST_Within(location::geometry, ST_GeomFromText(wktPolygon,4326))`

Sorting  
`sortBy` = `rentAmount | createdAt | distance | bedrooms …`, `sortOrder` =`asc/desc`  
Pagination `page` (1-based) + `limit` (≤100).

### 3.2 Example
```
GET /api/properties/search?
  city=Kathmandu&
  minPrice=3000&maxPrice=7000&
  amenities=parking,pet-friendly&
  latitude=27.7&longitude=85.32&radius=5&radiusUnit=km&
  sortBy=distance
```

## 4. Geospatial Query Capabilities
| Capability | PostGIS Function | Notes |
|------------|-----------------|-------|
| Radius / “Near me” | `ST_DWithin` | Accurate on spheroid (`geography`) |
| Distance sort | `ST_Distance` | Returned as `distance` alias |
| Polygon search | `ST_Within` / `ST_Intersects` | Handles user-drawn areas |
| Trigger sync | `ST_SetSRID(ST_MakePoint(lon,lat),4326)` | Updates on insert/update |

All heavy geo work occurs inside the DB — API only builds dynamic SQL via Prisma `$queryRaw`.

## 5. Setup & Deployment

### 5.1 Prerequisites
* Node.js ≥ 18
* PostgreSQL 14+ with PostGIS (`CREATE EXTENSION postgis;`)
* `npm` / `pnpm` / `bun`

### 5.2 Local Dev
```bash
# 1. clone repo & install
pnpm install

# 2. configure .env
cp .env.example .env
# edit DATABASE_URL

# 3. push schema & run migrations
npx prisma migrate deploy
psql $DATABASE_URL -f prisma/migrations/postgis-setup.sql

# 4. generate client
npx prisma generate

# 5. run dev server
pnpm dev
```

### 5.3 Seed / Test Data
```bash
pnpm ts-node prisma/seed.ts   # optional script
```

### 5.4 Production (Docker)
```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install --prod \
 && npx prisma generate \
 && npx prisma migrate deploy
ENV NODE_ENV=production
CMD ["pnpm","start"]
```
Provision a managed Postgres instance with PostGIS (e.g., Supabase, Neon).

## 6. Performance Considerations

| Concern | Strategy |
|---------|----------|
| Query response time | Proper B-Tree / GIST / GIN indexes shown above |
| Large text search | Off-load to **pg_trgm** or ElasticSearch as scale grows |
| N+1 ORM calls | Service layer uses **single** `findMany` or `$queryRaw` |
| Pagination | `LIMIT/OFFSET`, plan to move to keyset for deep pages |
| Connection pooling | Use Prisma `pgBouncer` or serverless adapters on Vercel |
| Caching | Redis for hot queries (homepage, popular cities) |
| Async jobs | Image processing / analytics offloaded to queues (BullMQ) |
| Monitoring | pg_stat_statements, Prisma logs (`query`,`error`,`warn`) |

---

_This document should give engineers and DevOps a clear path to understand, run, and evolve the backend responsible for lightning-fast, accurate rental searches across Nepal._  
