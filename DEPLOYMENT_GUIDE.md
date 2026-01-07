# Deployment Guide: Cloud Luxury Beauty

Complete step-by-step guide to deploy the full-stack application to GitHub, Vercel (frontend), and Railway (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Railway account (free tier works)
- Git installed locally
- Node.js 18+ installed

---

## Step 1: Prepare the Repository

### 1.1 Initialize Git (if not already done)

```bash
# In the project root directory
git init
```

### 1.2 Create .gitignore (already exists, verify it includes)

Make sure `.gitignore` includes:
- `node_modules/`
- `.env` files
- `dist/` and `build/` folders
- Logs and temporary files

### 1.3 Stage and commit all files

```bash
git add .
git commit -m "Initial commit: Cloud Luxury Beauty e-commerce platform"
```

---

## Step 2: Connect to GitHub

### 2.1 Create a new GitHub repository

1. Go to [GitHub.com](https://github.com)
2. Click the **+** icon → **New repository**
3. Repository name: `cloud-luxury-beauty` (or your preferred name)
4. Description: "Full-stack beauty e-commerce platform"
5. Set to **Private** (or Public, your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

### 2.2 Link local repository to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/cloud-luxury-beauty.git

# Verify the remote was added
git remote -v
```

### 2.3 Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**Verify**: Go to your GitHub repository and confirm all files are present.

---

## Step 3: Deploy Backend to Railway

### 3.1 Create Railway account and project

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose your `cloud-luxury-beauty` repository
6. Railway will detect the project structure

### 3.2 Configure Railway deployment

1. Railway should auto-detect the backend folder
2. If not, click **+ New** → **GitHub Repo** → Select your repo
3. In the service settings:
   - **Root Directory**: Set to `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3.3 Add PostgreSQL database

1. In your Railway project, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway will create a PostgreSQL database
3. Note the connection details (you'll need them)

### 3.4 Set environment variables in Railway

1. In your backend service, go to **Variables** tab
2. Add the following variables:

```
DATABASE_URL=<Railway PostgreSQL connection string>
JWT_SECRET=<Generate a strong random string, e.g., use: openssl rand -base64 32>
JWT_REFRESH_SECRET=<Generate another strong random string>
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**To get DATABASE_URL:**
- Click on your PostgreSQL service
- Go to **Variables** tab
- Copy the `DATABASE_URL` value
- Paste it in your backend service variables

**To generate secrets:**
```bash
# Run these in your terminal
openssl rand -base64 32
openssl rand -base64 32
```

### 3.5 Run database migrations

1. In Railway backend service, go to **Settings** → **Deploy**
2. Add a **Deploy Hook** or use the **Shell** option
3. Run migrations manually:
   - Click **Shell** in Railway
   - Run: `cd backend && npx prisma generate && npx prisma migrate deploy`
   - Run: `npx prisma db seed` (to seed initial data)

**Alternative**: Add a post-deploy script in Railway:
- In **Settings** → **Deploy**, add:
  - **Post Deploy Command**: `npx prisma generate && npx prisma migrate deploy && npx prisma db seed`

### 3.6 Get your backend URL

1. After deployment, Railway will provide a URL like: `https://your-app.up.railway.app`
2. Your API will be at: `https://your-app.up.railway.app/api`
3. **Copy this URL** - you'll need it for the frontend

**Note**: Railway may give you a random subdomain. You can set a custom domain later if needed.

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **Add New** → **Project**
4. Import your `cloud-luxury-beauty` repository
5. Vercel will detect it's a monorepo

### 4.2 Configure Vercel project

1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (Vercel should auto-detect)
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.3 Set environment variables in Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add:

```
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

**Replace** `your-railway-app.up.railway.app` with your actual Railway backend URL.

### 4.4 Deploy

1. Click **Deploy**
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://cloud-luxury-beauty.vercel.app`

### 4.5 Update Railway CORS

1. Go back to Railway backend service
2. Update the `CORS_ORIGIN` variable:
   ```
   CORS_ORIGIN=https://cloud-luxury-beauty.vercel.app
   ```
3. Redeploy the backend (Railway will auto-redeploy when you change variables)

---

## Step 5: Verify Deployment

### 5.1 Test the backend

1. Visit: `https://your-railway-app.up.railway.app/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### 5.2 Test the frontend

1. Visit your Vercel URL: `https://cloud-luxury-beauty.vercel.app`
2. You should see the Cloud Luxury Beauty homepage
3. Check browser console for any errors

### 5.3 Test the connection

1. In the frontend, try to:
   - View products (should load from backend)
   - Register a new account
   - Login
   - Add items to cart

### 5.4 Verify admin access

1. Login with the seeded admin account:
   - Email: `admin@cloudluxury.com`
   - Password: `Admin123!`
2. Access admin dashboard at `/admin`

---

## Step 6: Troubleshooting

### Backend Issues

**Database connection errors:**
- Verify `DATABASE_URL` is correct in Railway
- Check PostgreSQL service is running
- Run migrations: `npx prisma migrate deploy`

**CORS errors:**
- Verify `CORS_ORIGIN` in Railway matches your Vercel URL exactly
- Include protocol: `https://your-app.vercel.app` (no trailing slash)

**Build failures:**
- Check Railway logs for errors
- Verify all dependencies are in `package.json`
- Ensure `NODE_ENV=production` is set

### Frontend Issues

**API connection errors:**
- Verify `VITE_API_URL` in Vercel matches your Railway backend URL
- Check browser console for CORS errors
- Ensure backend is deployed and running

**Build failures:**
- Check Vercel build logs
- Verify all dependencies are installed
- Check for TypeScript errors

**Visual issues:**
- Clear browser cache
- Check that CSS files are loading
- Verify image paths are correct

---

## Step 7: Custom Domain (Optional)

### Vercel Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Railway Custom Domain

1. In Railway service → **Settings** → **Networking**
2. Add custom domain
3. Configure DNS as instructed

---

## Step 8: Final Checklist

- [ ] Repository pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created and connected
- [ ] Database migrations run
- [ ] Database seeded with initial data
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Products display correctly
- [ ] User registration works
- [ ] User login works
- [ ] Cart functionality works
- [ ] Admin dashboard accessible

---

## Quick Reference: URLs

- **GitHub**: `https://github.com/YOUR_USERNAME/cloud-luxury-beauty`
- **Backend API**: `https://your-app.up.railway.app/api`
- **Frontend**: `https://cloud-luxury-beauty.vercel.app`
- **Backend Health**: `https://your-app.up.railway.app/health`

---

## Support

If you encounter issues:
1. Check Railway logs: Service → **Deployments** → Click deployment → **View Logs**
2. Check Vercel logs: Project → **Deployments** → Click deployment → **View Function Logs**
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Congratulations! Your Cloud Luxury Beauty e-commerce platform is now live! 🎉**
