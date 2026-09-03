# Inventory System API

A RESTful backend for managing inventory, orders, and users — built with **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **ORM:** Prisma 7 (with `@prisma/adapter-pg`)
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens via `httpOnly` cookies), verified with Passport (`passport-jwt`)
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit, bcryptjs
- **Logging:** Winston + Morgan

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd inventory-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Push schema to database
npm run db:push

# 5. Start development server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=5001

DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

CORS_ORIGIN=http://localhost:3000
```

---

## Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start dev server with hot reload |
| `npm run build`        | Compile TypeScript to `dist/`    |
| `npm start`            | Run compiled production build    |
| `npm run db:push`      | Push Prisma schema to database   |
| `npm run db:migrate`   | Run Prisma migrations            |
| `npm run db:studio`    | Open Prisma Studio               |
| `npm run lint`         | Lint source files                |
| `npm run lint:fix`     | Auto-fix lint issues             |
| `npm run prettier:fix` | Auto-format source files         |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid `accessToken` cookie.

### Auth — `/api/auth`

| Method | Endpoint    | Auth | Description              |
| ------ | ----------- | ---- | ------------------------ |
| POST   | `/register` | No   | Register a new user      |
| POST   | `/login`    | No   | Login and receive tokens |
| POST   | `/logout`   | No   | Clear auth cookies       |
| POST   | `/refresh`  | No   | Rotate refresh token     |

**Register / Login request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Users — `/api/users`

| Method | Endpoint        | Auth | Role  | Description          |
| ------ | --------------- | ---- | ----- | -------------------- |
| GET    | `/`             | ✅   | ADMIN | Get all users        |
| GET    | `/:id`          | ✅   | Any   | Get user by ID       |
| POST   | `/`             | ✅   | ADMIN | Create a user        |
| PATCH  | `/:id`          | ✅   | Any   | Update user          |
| DELETE | `/me`           | ✅   | Any   | Delete own user      |
| DELETE | `/:id`          | ✅   | ADMIN | Delete user          |
| GET    | `/:id/products` | ✅   | Any   | Get products by user |
| GET    | `/:id/orders`   | ✅   | Any   | Get orders by user   |

---

### Products — `/api/products`

| Method | Endpoint | Auth | Description       |
| ------ | -------- | ---- | ----------------- |
| GET    | `/all`   | ✅   | Get all products  |
| GET    | `/:id`   | ✅   | Get product by ID |
| POST   | `/`      | ✅   | Create a product  |
| PATCH  | `/:id`   | ✅   | Update a product  |
| DELETE | `/:id`   | ✅   | Delete a product  |

**Create product request body:**

```json
{
  "name": "Laptop",
  "description": "15-inch laptop",
  "price": 999.99,
  "quantityInStock": 50,
  "categoryId": "uuid-here"
}
```

---

### Categories — `/api/categories`

| Method | Endpoint | Auth | Role  | Description        |
| ------ | -------- | ---- | ----- | ------------------ |
| GET    | `/`      | ✅   | Any   | Get all categories |
| GET    | `/:id`   | ✅   | Any   | Get category by ID |
| POST   | `/`      | ✅   | ADMIN | Create a category  |
| PATCH  | `/:id`   | ✅   | ADMIN | Update a category  |
| DELETE | `/:id`   | ✅   | ADMIN | Delete a category  |

---

### Orders — `/api/orders`

| Method | Endpoint                | Auth | Description            |
| ------ | ----------------------- | ---- | ---------------------- |
| GET    | `/`                     | ✅   | Get all orders         |
| GET    | `/:id`                  | ✅   | Get order by ID        |
| POST   | `/`                     | ✅   | Create an order        |
| PATCH  | `/:id`                  | ✅   | Update an order        |
| DELETE | `/:id`                  | ✅   | Delete an order        |
| GET    | `/:orderId/order-items` | ✅   | Get items for an order |

**Create order request body:**

```json
{
  "status": "PENDING",
  "totalPrice": 199.99,
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com"
}
```

> `userId` is automatically set from the authenticated user — do not pass it in the request body.

---

### Order Items — `/api/order-items`

| Method | Endpoint        | Auth | Description          |
| ------ | --------------- | ---- | -------------------- |
| GET    | `/`             | ✅   | Get all order items  |
| GET    | `/:orderItemId` | ✅   | Get order item by ID |
| POST   | `/`             | ✅   | Create an order item |
| PATCH  | `/:orderItemId` | ✅   | Update an order item |
| DELETE | `/:orderItemId` | ✅   | Delete an order item |

**Create order item request body:**

```json
{
  "orderId": "uuid-here",
  "productId": "uuid-here",
  "quantity": 2,
  "unitPrice": 99.99
}
```

> Creating an order item automatically decrements `quantityInStock` on the product. Deleting one restores it. All stock operations run inside a database transaction.

---

## Auth Flow

```
POST /api/auth/register  or  POST /api/auth/login
        │
        └─► Sets httpOnly cookies:
              - accessToken  (expires 10m)
              - refreshToken (expires 7d, stored in DB)

POST /api/auth/refresh
        │
        └─► Verifies refreshToken cookie against DB
            Rotates both tokens
            Rejects blacklisted tokens

POST /api/auth/logout
        └─► Deletes token from DB, clears cookies
```

---

## Project Structure

```
src/
├── config/          # App config and Winston logger
├── controllers/     # Route handlers
├── dtos/            # Zod schemas and TypeScript types
├── generated/       # Prisma generated client (do not edit)
├── lib/             # Prisma client instance
├── middlewares/     # auth, validate, error handler
├── routes/          # Express routers
├── service/         # Business logic
├── types/           # Global TypeScript type extensions
└── utils/           # ApiError, catchAsync, JWTToken helpers
prisma/
└── schema.prisma    # Database schema
```

---

## Roles

| Role    | Permissions                                       |
| ------- | ------------------------------------------------- |
| `STAFF` | Default role. Can manage own products and orders. |
| `ADMIN` | Full access. Can manage users and categories.     |
