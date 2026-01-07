# Cloud Luxury Beauty E-commerce Platform

A full-stack beauty e-commerce platform with a cloud-luxury aesthetic, inspired by Kylie Cosmetics and modern beauty brands.

## Features

- **Product Management**: Full CRUD operations for products, categories, variants, and inventory
- **User Authentication**: JWT-based auth with access and refresh tokens
- **Shopping Cart**: Client-side cart with backend synchronization
- **Wishlist**: Per-user wishlist functionality
- **Coupons**: Percentage, fixed, BOGO, and category-specific discounts
- **Admin Dashboard**: Complete admin interface for managing products, orders, users, and coupons
- **Search & Filters**: Product search with category, price, and featured filters
- **Order Management**: Complete order processing and tracking
- **Responsive Design**: Fully responsive cloud-luxury UI

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Winston Logging
- Jest + Supertest

### Frontend
- React + TypeScript
- Vite
- CSS Modules
- React Router
- Axios
- Vitest

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cloud-luxury-beauty
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database:
```bash
createdb cloud_luxury_beauty
```

2. Configure backend environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/cloud_luxury_beauty"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"
PORT=5000
NODE_ENV=development
```

3. Run Prisma migrations:
```bash
cd backend
npx prisma migrate dev
```

4. Seed the database:
```bash
npx prisma db seed
```

### 4. Frontend Setup

1. Configure frontend environment variables:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

From the root directory:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin Dashboard: http://localhost:5173/admin

## Default Admin Account

After seeding, you can log in with:
- Email: admin@cloudluxury.com
- Password: Admin123!

## Project Structure

```
cloud-luxury-beauty/
├── backend/           # Backend API
│   ├── src/
│   ├── prisma/
│   └── tests/
├── frontend/          # Frontend React app
│   ├── src/
│   └── public/
├── deploy/            # Deployment configs
└── scripts/           # Utility scripts
```

## Testing

Run all tests:
```bash
npm test
```

Run backend tests only:
```bash
npm run test:backend
```

Run frontend tests only:
```bash
npm run test:frontend
```

## Building for Production

```bash
npm run build
```

## Deployment

See deployment configurations in the `/deploy` directory:
- `render.yaml` - Render.com configuration
- `railway.template.json` - Railway.app configuration
- `fly.toml` - Fly.io configuration

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
