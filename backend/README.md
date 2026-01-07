# Cloud Luxury Beauty Backend

RESTful API for the Cloud Luxury Beauty e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Setup database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

4. Run development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:seed` - Seed database

## API Documentation

See [../api-docs.md](../api-docs.md) for complete API documentation.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Database

This project uses PostgreSQL with Prisma ORM. See `prisma/schema.prisma` for the database schema.
