# How to Seed the Database with Products

Your database needs to be seeded with products before they can appear on the homepage.

## Option 1: Seed via Railway Shell (Recommended)

1. Go to Railway → Your Backend Service
2. Click on **"Shell"** tab (or **"Deployments"** → **"View Logs"** → **"Shell"**)
3. Run these commands:

```bash
cd backend
npx prisma generate
npx prisma db seed
```

This will:
- Generate Prisma Client
- Run the seed script which creates:
  - Cloud Matte Lipstick – Rose Dust ($24)
  - Lavender Mist Face Oil ($48)
  - Velvet Glow Blush ($28)
  - Cloud Dew Setting Spray ($32)
  - Pink Sky Highlighter ($30)
  - Plus additional products and categories

## Option 2: Seed via Railway Deploy Hook

1. Go to Railway → Your Backend Service
2. Go to **Settings** → **Deploy**
3. Add a **Post Deploy Command**:
   ```
   npx prisma generate && npx prisma db seed
   ```
4. Redeploy the service

## Option 3: Seed via Local Connection

If you have Railway CLI or direct database access:

```bash
cd backend
DATABASE_URL="your-railway-database-url" npx prisma db seed
```

## Verify Products Were Seeded

After seeding, check your backend logs or test the API:

```bash
curl https://cloud-luxury-backend-production.up.railway.app/api/products?featured=true
```

You should see products in the response.

## Troubleshooting

If seeding fails:
1. Make sure `DATABASE_URL` is set correctly in Railway
2. Make sure Prisma migrations have run: `npx prisma migrate deploy`
3. Check Railway logs for any errors
