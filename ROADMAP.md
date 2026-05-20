# KSM-INC Cinema Booking System — Project Roadmap

> **Stack:** Node.js · Express 5 · MongoDB · Mongoose  
> **Architecture:** Modular (module/model → repository → service → controller → routes)  
> **Goal:** Implement every backend concept from foundational to senior level, in the context of this real codebase.

---

## Where You Are Right Now

### ✅ Completed
| Layer | Module | Status |
|---|---|---|
| Infrastructure | Config, DB, Server bootstrap | ✅ Done |
| Utilities | AppError, AppResponse | ✅ Done |
| Middleware | errorHandler (dev/prod), notFoundHandler | ✅ Done |
| Venue | model → repo → service → controller → routes | ✅ Done |
| Screen | model → repo → service → controller → routes | ✅ Done |
| Movie | model → repo | ✅ Partial |
| Auth (User) | model only | ✅ Partial |
| Booking | model only | ✅ Partial |
| Showtime | model only | ✅ Partial |
| ShowtimeSeat | model only | ✅ Partial |
| SeatTemplate | model only | ✅ Partial |

### ❌ Not Started
- Movie service/controller/routes
- Auth system (register, login, JWT, refresh tokens)
- Auth middleware (protect, restrictTo)
- Showtime CRUD
- Seat template management
- Showtime seat generation
- Seat locking (concurrency problem)
- Booking flow
- Payment integration
- Request validation layer
- Rate limiting & security headers
- Logging
- QR code generation
- Testing
- Docker & deployment

---

## Phase 1 — Complete the Core CRUD Layer
> **Concept focus:** Repository pattern, Service layer, REST API design, Mongoose queries

### Step 1 — Movie Module (Complete the partial)
Files to create:
- `src/modules/movie/movie.service.js`
- `src/modules/movie/movie.controller.js`
- `src/modules/movie/movie.routes.js`

Service logic to implement:
- `createMovie(data)` — validate required fields, check duplicate title
- `getMovieById(id)` — ObjectId validation + 404 handling
- `getAllMovies(filters)` — filter by `status` (UPCOMING, NOW_SHOWING), `genre`, `language`
- `updateMovie(id, data)` — only allow updating certain fields
- `deleteMovie(id)` — 404 handling

Register in `app.js`:
```js
app.use('/api/v1/movies', movieRouter)
```

---

### Step 2 — Showtime Module (Full stack)
Files to create:
- `src/modules/showtime/showtime.repository.js`
- `src/modules/showtime/showtime.service.js`
- `src/modules/showtime/showtime.controller.js`
- `src/modules/showtime/showtime.routes.js`

Service logic to implement:
- `createShowtime(data)` — validate movie_id and screen_id exist, check for **scheduling conflicts** (no two showtimes on same screen overlap)
- `getShowtimeById(id)` — populate movie and screen
- `getShowtimesByMovie(movie_id)` — list showtimes for a movie
- `getShowtimesByScreen(screen_id)` — list showtimes for a screen
- `updateShowtime(id, data)` — re-validate conflicts on time change
- `deleteShowtime(id)` — only if status is SCHEDULED

**Key concept:** Overlap detection query
```js
// No existing showtime on this screen should overlap the new window
await Showtime.findOne({
    screen_id,
    status: { $in: ['SCHEDULED', 'ACTIVE'] },
    $or: [
        { start_time: { $lt: end_time }, end_time: { $gt: start_time } }
    ]
})
```

---

### Step 3 — SeatTemplate Module (Full stack)
Files to create:
- `src/modules/seat/seatTemplate.repository.js`
- `src/modules/seat/seatTemplate.service.js`
- `src/modules/seat/seatTemplate.controller.js`
- `src/modules/seat/seatTemplate.routes.js`

Service logic:
- `createBulkSeats(screen_id, rows)` — accept a layout config, insert many seats at once (`insertMany`)
- `getSeatsByScreen(screen_id)` — return full layout grouped by row_label
- `toggleSeatActive(id)` — mark seat as broken/inactive

**Key concept:** `insertMany` with `ordered: false` for partial failure tolerance.

---

## Phase 2 — Authentication System
> **Concept focus:** Password hashing, JWT, refresh token rotation, middleware guards, RBAC

### Step 4 — Auth Module

Install:
```bash
npm install bcryptjs jsonwebtoken
```

Files to create:
- `src/modules/auth/auth.service.js`
- `src/modules/auth/auth.controller.js`
- `src/modules/auth/auth.routes.js`
- `src/middleware/protect.js`
- `src/middleware/restrictTo.js`
- `src/utils/jwt.js`

#### `src/utils/jwt.js`
```js
// generateAccessToken(payload) → signs with ACCESS_TOKEN_SECRET, expires in 15m
// generateRefreshToken(payload) → signs with REFRESH_TOKEN_SECRET, expires in 7d
// verifyAccessToken(token)
// verifyRefreshToken(token)
```

#### Auth service methods:
- `register(data)` — hash password with bcrypt (saltRounds: 12), create user, return tokens
- `login(email, password)` — find user with `select('+password')`, compare with `bcrypt.compare`, return tokens
- `refreshToken(token)` — verify refresh token, issue new access token
- `logout()` — (stateless JWT → client deletes token; or maintain a blacklist in Redis later)

#### `src/middleware/protect.js`
```js
// 1. Read Authorization header: "Bearer <token>"
// 2. Verify access token
// 3. Find user by decoded id
// 4. Attach to req.user
// 5. Call next()
```

#### `src/middleware/restrictTo.js`
```js
// Returns middleware that checks req.user.role is in allowed roles array
// e.g., restrictTo('ADMIN', 'VENUE_MANAGER')
```

Add env variables:
```
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Routes:
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
GET  /api/v1/auth/me   (protected)
```

Apply auth on all write operations:
```js
venueRouter.route('/').post(protect, restrictTo('ADMIN'), createVenue)
```

---

## Phase 3 — Request Validation Layer
> **Concept focus:** Input sanitization, schema validation, separation of concerns

### Step 5 — Validation Middleware

Install:
```bash
npm install joi
```

Create `src/middleware/validate.js`:
```js
// Takes a Joi schema, returns middleware
// Validates req.body against schema
// On failure: throw AppError with 400 + Joi message
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        const msg = error.details.map(d => d.message).join('. ')
        return next(new AppError(msg, 400))
    }
    next()
}
```

Create per-module schemas, e.g. `src/modules/venue/venue.validator.js`:
```js
export const createVenueSchema = Joi.object({
    name: Joi.string().max(50).required(),
    location: Joi.string().max(50).required(),
    city: Joi.string().max(50).required()
})
```

Plug into routes:
```js
venueRouter.route('/').post(protect, validate(createVenueSchema), createVenue)
```

Do this for: venue, screen, movie, showtime, auth.

**Why this matters:** Your service layer currently does manual `if (!name || !city)` checks. The validator replaces that with a schema-driven, consistent approach. Service layer then focuses purely on business logic.

---

## Phase 4 — The Core Business Problem: Seat Booking with Concurrency
> **Concept focus:** Race conditions, optimistic locking, TTL, atomic operations — this is what separates junior from senior

### Step 6 — Showtime Seat Generation

When a showtime is created, generate a `ShowtimeSeat` document for every active seat in that screen.

Create `src/modules/showtime/showtimeSeat.service.js`:
```js
// generateSeatsForShowtime(showtime_id, screen_id)
// 1. Find all active SeatTemplates for screen_id
// 2. Build ShowtimeSeat docs (status: AVAILABLE)
// 3. insertMany()
```

Call this inside `showtimeService.createShowtime()` after saving the showtime.

---

### Step 7 — Seat Locking (The Hard Part)

The problem: Two users select the same seat at the same time. Without locking, both get confirmed.

Files to create:
- `src/modules/showtime/showtimeSeat.repository.js`
- `src/modules/showtime/showtimeSeat.service.js`
- `src/modules/showtime/showtimeSeat.controller.js`

#### Lock endpoint: `POST /api/v1/showtimes/:id/seats/lock`
```js
// Body: { seat_ids: ['...', '...'] }

// Strategy: findOneAndUpdate with atomic check
// Only lock if status is AVAILABLE
const locked = await ShowtimeSeat.findOneAndUpdate(
    {
        _id: seat_id,
        showtime_id,
        status: 'AVAILABLE'    // atomic guard — only one request wins
    },
    {
        status: 'LOCKED',
        user_id: req.user._id,
        locked_until: new Date(Date.now() + 10 * 60 * 1000) // 10 min lock
    },
    { new: true }
)

if (!locked) throw new AppError('Seat already taken', 409)
```

#### Release stale locks (TTL cleanup):
Add a TTL index on ShowtimeSeat (MongoDB handles expiry automatically):
```js
// Or run a periodic job:
// Find all LOCKED seats where locked_until < now, reset to AVAILABLE
```

#### Unlock endpoint: `POST /api/v1/showtimes/:id/seats/unlock`
```js
// Only the user who locked it can unlock
// status: LOCKED && user_id === req.user._id → reset to AVAILABLE
```

**Key concept you're implementing:** Optimistic concurrency via `findOneAndUpdate` with a condition. MongoDB's atomic document updates prevent the race condition without needing distributed locks.

---

## Phase 5 — Booking & Payment Flow
> **Concept focus:** Multi-step transactions, atomic state machines, idempotency

### Step 8 — Booking Module

Files to create:
- `src/modules/booking/booking.repository.js`
- `src/modules/booking/booking.service.js`
- `src/modules/booking/booking.controller.js`
- `src/modules/booking/booking.routes.js`

#### Create Booking Flow:
```
POST /api/v1/bookings
Body: { showtime_id, seat_ids }

1. Verify all seats are LOCKED by req.user._id
2. Calculate total_amount (fetch seat types → pricing from showtime)
3. Create Booking with status: PENDING
4. Return booking_id + amount → frontend triggers payment
```

#### Confirm Booking (called after payment success):
```
POST /api/v1/bookings/:id/confirm
Body: { payment_id }

1. Verify booking exists and is PENDING
2. Mark ShowtimeSeats as BOOKED, set booking_id
3. Update Booking status → CONFIRMED, set payment_id
4. Generate QR code (see Step 9)
```

**Use MongoDB transactions** (multi-document ACID):
```js
const session = await mongoose.startSession()
session.startTransaction()
try {
    // update seats + booking atomically
    await session.commitTransaction()
} catch (err) {
    await session.abortTransaction()
    throw err
} finally {
    session.endSession()
}
```

#### Cancel Booking:
```
PATCH /api/v1/bookings/:id/cancel

1. Booking must be CONFIRMED and showtime in future
2. Set seats back to AVAILABLE
3. Set Booking status → CANCELLED
4. Trigger refund (stub for now)
```

---

### Step 9 — QR Code Generation

Install:
```bash
npm install qrcode
```

Create `src/utils/generateQR.js`:
```js
import QRCode from 'qrcode'

export const generateQR = async (bookingId) => {
    return QRCode.toDataURL(`KSM-BOOKING:${bookingId}`)
}
```

Call inside confirm booking → store base64 string in `booking.qr_code`.

---

## Phase 6 — Security & Production Hardening
> **Concept focus:** OWASP Top 10, HTTP security headers, rate limiting

### Step 10 — Security Layer

Install:
```bash
npm install helmet express-rate-limit express-mongo-sanitize hpp
```

Add to `app.js` (before routes):
```js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'

// Security headers
app.use(helmet())

// Rate limiting: max 100 req per 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
})
app.use('/api', limiter)

// Stricter limit for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })
app.use('/api/v1/auth', authLimiter)

// Prevent NoSQL injection: strips $ and . from req.body/params
app.use(mongoSanitize())

// Prevent HTTP parameter pollution
app.use(hpp())
```

What each does:
- `helmet` — sets 11 security headers (CSP, HSTS, X-Frame-Options, etc.)
- `mongoSanitize` — blocks `{ "$gt": "" }` injection attacks in MongoDB queries
- `hpp` — prevents `?sort=price&sort=name` pollution attacks
- `rateLimit` — brute-force protection, especially on auth

---

## Phase 7 — Logging & Observability
> **Concept focus:** Structured logging, request tracing, error visibility

### Step 11 — Logging with Morgan + Winston

Install:
```bash
npm install winston morgan
```

Create `src/utils/logger.js`:
```js
import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})

export default logger
```

Create `src/middleware/requestLogger.js`:
```js
import morgan from 'morgan'
import logger from '../utils/logger.js'

const stream = { write: (msg) => logger.http(msg.trim()) }

export const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
)
```

Add to `app.js`:
```js
app.use(requestLogger)
```

Replace all `console.log` and `console.error` calls in error handler with `logger.error(...)` and `logger.info(...)`.

---

## Phase 8 — Testing
> **Concept focus:** Unit tests, integration tests, test doubles

### Step 12 — Testing Setup

Install:
```bash
npm install --save-dev jest supertest mongodb-memory-server @jest/globals
```

Structure:
```
src/
  modules/
    venue/
      __tests__/
        venue.service.test.js      ← unit test (mock repo)
        venue.routes.test.js       ← integration test (real HTTP)
```

#### Unit test example (venue.service.test.js):
```js
import { jest } from '@jest/globals'
import VenueService from '../venue.service.js'
import * as repo from '../venue.repository.js'

jest.spyOn(repo, 'createVenue').mockResolvedValue({ _id: '123', name: 'PVR' })

test('createVenue throws if name is missing', async () => {
    await expect(VenueService.createVenue({ location: 'X', city: 'Y' }))
        .rejects.toThrow('One or more field cannot be empty')
})
```

#### Integration test (venue.routes.test.js):
```js
import request from 'supertest'
import app from '../../../app.js'

describe('POST /api/v1/venues', () => {
    it('creates a venue', async () => {
        const res = await request(app)
            .post('/api/v1/venues')
            .send({ name: 'PVR', location: 'MG Road', city: 'Bangalore' })
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })
})
```

Use `mongodb-memory-server` to spin up an in-memory MongoDB during tests — no real DB needed.

What to test per module: createX with missing fields, getX with invalid ObjectId, getX with non-existent id, updateX, deleteX, auth routes (register/login/protected route without token).

---

## Phase 9 — Docker & Deployment Readiness
> **Concept focus:** Containerization, environment separation, production configuration

### Step 13 — Dockerize the App

Create `Dockerfile`:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS production
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.9'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGO_URI=mongodb://mongo:27017/ksm-inc
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Create `.dockerignore`:
```
node_modules
.env
logs
*.test.js
```

Run:
```bash
docker compose up --build
```

---

## Phase 10 — Advanced Features (Senior-Level)
> Implement these after all above is solid

### Step 14 — Pagination, Filtering, Sorting (all list endpoints)

Create `src/utils/QueryBuilder.js`:
```js
class QueryBuilder {
    constructor(mongooseQuery, queryString) {
        this.query = mongooseQuery
        this.queryString = queryString
    }

    filter() { /* strip page/sort/limit, apply rest as filters */ }
    sort() { /* req.query.sort='-createdAt' → .sort('-createdAt') */ }
    paginate() { /* page=2&limit=10 → .skip(10).limit(10) */ }
    fields() { /* fields=name,city → .select('name city') */ }

    build() {
        return this.filter().sort().fields().paginate().query
    }
}
```

Apply to `findAllVenues`, `findAllMovies`, `findAllScreens`.

---

### Step 15 — Caching with Redis

Install:
```bash
npm install ioredis
```

Create `src/config/redis.js` and `src/middleware/cache.js`.

Cache strategy for read-heavy endpoints:
```
GET /api/v1/movies → cache for 5 minutes
GET /api/v1/venues?city=Mumbai → cache for 10 minutes
Invalidate on write operations
```

Pattern:
```js
const cached = await redis.get(cacheKey)
if (cached) return res.json(JSON.parse(cached))
// ... fetch from DB
await redis.setex(cacheKey, 300, JSON.stringify(data))
```

---

### Step 16 — Background Jobs (Seat Lock Cleanup)

Install:
```bash
npm install bullmq
```

Create `src/jobs/seatUnlocker.js`:
```js
// Worker that runs every minute
// Find ShowtimeSeats where status=LOCKED and locked_until < now
// Reset them to AVAILABLE
```

This teaches: job queues, workers, retry logic, delayed jobs.

---

### Step 17 — Email Notifications

Install:
```bash
npm install nodemailer
```

Create `src/utils/mailer.js` and email templates for:
- Booking confirmation (with QR code attached)
- Booking cancellation
- Welcome email on register

Trigger from booking service after confirm/cancel.

---

## Complete Module Implementation Order

Follow this sequence — each step builds on the previous:

```
1.  Movie module complete       (CRUD, same pattern as Venue)
2.  Showtime module complete    (overlap validation)
3.  SeatTemplate module         (bulk insert, layout)
4.  Auth system                 (register, login, JWT middleware)
5.  Apply auth guards           (protect all write routes)
6.  Validation layer            (Joi schemas on all endpoints)
7.  Showtime seat generation    (on showtime create)
8.  Seat locking                (atomic findOneAndUpdate)
9.  Booking create              (lock verification + total calc)
10. Booking confirm             (MongoDB transaction + QR)
11. Booking cancel              (refund stub)
12. Security hardening          (helmet, rate limit, sanitize)
13. Logging                     (Winston + Morgan)
14. Pagination/Filtering        (QueryBuilder utility)
15. Unit + integration tests    (Jest + Supertest)
16. Docker                      (Dockerfile + compose)
17. Redis caching               (movies, venues)
18. Background jobs             (seat unlock worker)
19. Email notifications         (booking events)
```

---

## Key Bugs to Fix Right Now

### Bug 1 — screen.routes.js imports `deletedScreen` but controller exports `deleteScreen`
```js
// screen.routes.js line 2 — WRONG
import { createScreen, deletedScreen, ... } from "./screen.controller.js";

// Should be:
import { createScreen, deleteScreen, ... } from "./screen.controller.js";
```

### Bug 2 — Service manual validation will conflict with Joi later
Plan: once Joi validators are in (Step 6), remove the `if (!name || !city)` guards from service constructors. Service should trust that the validation middleware already ran.

### Bug 3 — No async error catching on controllers
Express 5 handles async errors natively, so you're safe. But add a note: if you ever downgrade to Express 4, wrap every async controller in `catchAsync(fn)`.

---

## Concepts Covered by This Project (from the senior list)

| Concept | Where It's Implemented |
|---|---|
| REST API design | All routes, versioning `/api/v1/` |
| Repository pattern | `*.repository.js` files |
| Service layer | `*.service.js` files |
| Error handling (operational vs programmer) | AppError + errorHandler |
| Environment config | `src/config/index.js` |
| Mongoose schema design | All `*.model.js` files |
| Indexing strategy | Compound indexes in models |
| Input validation | Joi middleware (Step 6) |
| JWT Auth + RBAC | Auth module (Step 4) |
| Concurrency/locking | Seat locking (Step 7) |
| MongoDB transactions | Booking confirm (Step 8) |
| Security headers | Helmet (Step 10) |
| Rate limiting | express-rate-limit (Step 10) |
| NoSQL injection prevention | mongo-sanitize (Step 10) |
| Structured logging | Winston + Morgan (Step 11) |
| Pagination/filtering | QueryBuilder (Step 14) |
| Caching | Redis (Step 15) |
| Background jobs | BullMQ (Step 16) |
| State machines | Booking/Showtime/Seat status enums |
| Testing | Jest + Supertest (Step 12) |
| Containerization | Docker (Step 13) |
