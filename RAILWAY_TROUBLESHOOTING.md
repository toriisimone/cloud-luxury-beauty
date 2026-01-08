# Railway Backend Environment Variables Troubleshooting

## Critical Issue: "All env vars: []"

If you're seeing `DEBUG: All env vars: []` in Railway logs, this means **Railway is not injecting environment variables into your backend service**.

## Step-by-Step Fix:

### 1. Verify Service Configuration

1. Go to Railway → Your Project
2. Click on **cloud-luxury-backend-production** service (or your backend service name)
3. Go to **Settings** → **General**
4. Verify:
   - **Root Directory**: Must be exactly `backend` (not `/backend` or `./backend`)
   - **Build Command**: Should be `npm install && npm run build` (Railway will use `backend/railway.json` if present)
   - **Start Command**: Should be `npm start` (Railway will use `backend/railway.json` if present)

### 2. Verify Environment Variables Scope

**CRITICAL**: Environment variables must be set at the **SERVICE level**, not the project level.

1. In Railway, click on your **Backend service** (not the project root)
2. Go to **Variables** tab
3. Make sure you see a dropdown that says **"Production"** (or your environment name)
4. Verify all variables are listed:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGIN`
   - `NODE_ENV=production`
   - `PORT=5000`

### 3. Check Variable Environment Scope

Railway has different environments (Production, Preview, etc.). Variables must be set for the **correct environment**:

1. In **Variables** tab, check the environment dropdown
2. Make sure it's set to **"Production"** (or whatever environment you're deploying to)
3. If variables are only in "Preview", they won't be available in "Production"

### 4. Verify Variable Format

Variables should be set as:
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres:...@postgres.railway.internal:5432/railway`

**DO NOT** include quotes around the value unless Railway adds them automatically.

### 5. Force Redeploy After Variable Changes

After adding/updating variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. OR trigger a new deployment by pushing a commit

### 6. Check Railway Service Logs

After redeploy, check the logs for:
- `DEBUG: Total process.env keys: X` (should be > 0)
- `DEBUG: All env keys: ...` (should list your variables)
- `DEBUG: DATABASE_URL exists? true` (should be true)

### 7. If Still Not Working: Recreate Service

If variables still aren't loading:

1. **Create a new service**:
   - In Railway project, click **+ New** → **GitHub Repo**
   - Select your repository
   - **IMPORTANT**: Set **Root Directory** to `backend` immediately
   
2. **Add PostgreSQL**:
   - Click **+ New** → **Database** → **PostgreSQL**
   - Railway will create a new database
   
3. **Link Database to Service**:
   - Click on your new backend service
   - Go to **Variables** tab
   - Railway should auto-add `DATABASE_URL` from the PostgreSQL service
   - Verify it's there
   
4. **Add Other Variables**:
   - Still in **Variables** tab
   - Add: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`, `PORT=5000`
   
5. **Delete Old Service**:
   - Once new service is working, delete the old one

### 8. Verify Railway Service Detection

Railway should detect your service because:
- `backend/railway.json` exists
- `backend/package.json` exists
- `backend/nixpacks.toml` exists (we just added this)

If Railway still doesn't detect it, the Root Directory setting in Railway UI is the only way to fix it.

## Common Mistakes:

1. ❌ Setting variables at **Project level** instead of **Service level**
2. ❌ Setting variables in **Preview** environment but deploying to **Production**
3. ❌ Root Directory set to `/backend` or `./backend` instead of `backend`
4. ❌ Variables have extra quotes or spaces
5. ❌ Not redeploying after adding variables

## Expected Log Output (Success):

```
DEBUG: ========================================
DEBUG: Backend starting...
DEBUG: Current working directory: /app/backend
DEBUG: All process.env keys: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, NODE_ENV, PORT, ...
DEBUG: Process.env count: 20+
DEBUG: ========================================
DEBUG: Loading environment variables...
DEBUG: Total process.env keys: 20+
DEBUG: DATABASE_URL exists? true
DEBUG: DATABASE_URL length: 100+
```

If you see `Process.env count: 0` or `All env vars: []`, Railway is not injecting variables correctly.
