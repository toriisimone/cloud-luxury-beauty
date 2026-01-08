# Railway Backend Service Configuration

## IMPORTANT: Railway UI Settings

For the backend service to work correctly in this monorepo, you MUST configure Railway in the UI:

### Backend Service Settings:

1. **Service Name**: Backend (or your preferred name)
2. **Root Directory**: `backend` (CRITICAL - this must be set)
3. **Build Command**: Railway will use `backend/railway.json` automatically
4. **Start Command**: Railway will use `backend/railway.json` automatically

### How to Set Root Directory in Railway:

1. Go to your Railway project
2. Click on your **Backend** service
3. Go to **Settings** → **General**
4. Find **Root Directory** setting
5. Set it to: `backend`
6. Save changes
7. Redeploy the service

### Environment Variables:

All environment variables MUST be added to the **Backend service** (not the project root):

1. Go to **Backend** service → **Variables** tab
2. Add these variables:
   - `DATABASE_URL` (from your PostgreSQL service)
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGIN`
   - `NODE_ENV=production`
   - `PORT=5000`

### Frontend Service (if you have one):

If Railway created a frontend service:
1. Set its **Root Directory** to: `frontend`
2. OR delete it and deploy frontend only on Vercel

### Verify Configuration:

After setting Root Directory to `backend`:
- Railway will build from `/app/backend` (not `/app`)
- Environment variables will be available to the backend service
- The backend will no longer report "All env vars: []"
