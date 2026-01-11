# Railway Environment Variables Setup Guide

## Required Environment Variables for Backend Service

All environment variables **MUST** be set in the Railway UI for your **Backend service**:

### 1. Database Configuration
```
DATABASE_URL=<Railway PostgreSQL connection string>
```
- **How to get**: Click on your PostgreSQL service → Variables tab → Copy `DATABASE_URL`
- **Required**: Yes
- **Where to set**: Backend service → Variables tab

### 2. JWT Secrets
```
JWT_SECRET=<Generate a strong random string>
JWT_REFRESH_SECRET=<Generate another strong random string>
```
- **How to generate**:
  ```bash
  openssl rand -base64 32
  openssl rand -base64 32
  ```
- **Required**: Yes
- **Where to set**: Backend service → Variables tab

### 3. CORS Configuration
```
CORS_ORIGIN=<Your Vercel frontend URL>
```
- **Example**: `https://cloud-luxury-beauty.vercel.app`
- **Required**: Yes
- **Where to set**: Backend service → Variables tab
- **Note**: Update this after you deploy your frontend to Vercel

### 4. Node Environment
```
NODE_ENV=production
```
- **Required**: Yes
- **Where to set**: Backend service → Variables tab

### 5. Port Configuration
```
PORT=5000
```
- **Required**: Yes (Railway may set this automatically)
- **Where to set**: Backend service → Variables tab

## Optional Environment Variables

### Amazon Product Advertising API (if using)
```
AMAZON_ACCESS_KEY=<Your Amazon Access Key>
AMAZON_SECRET_KEY=<Your Amazon Secret Key>
AMAZON_ASSOCIATE_TAG=<Your Associate Tag>
AMAZON_REGION=us-east-1
```
- **Required**: No (only if using Amazon product integration)
- **Where to set**: Backend service → Variables tab

## Step-by-Step Setup in Railway UI

1. **Go to your Railway project**
   - Visit [railway.app](https://railway.app)
   - Select your project

2. **Select your Backend service**
   - Click on the service named "Backend" (or your backend service name)

3. **Go to Variables tab**
   - Click on the **Variables** tab in your backend service

4. **Add each variable**
   - Click **+ New Variable**
   - Enter the variable name (e.g., `DATABASE_URL`)
   - Enter the variable value
   - Click **Add**

5. **Verify all variables are set**
   - Check that you have all required variables listed above
   - Railway will automatically redeploy when you add/change variables

## Quick Checklist

- [ ] `DATABASE_URL` - From PostgreSQL service
- [ ] `JWT_SECRET` - Generated random string
- [ ] `JWT_REFRESH_SECRET` - Generated random string
- [ ] `CORS_ORIGIN` - Your Vercel frontend URL
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`

## Important Notes

1. **Root Directory**: Make sure your Backend service has **Root Directory** set to `backend` in Settings → General
2. **Service-Specific**: Variables must be set on the **Backend service**, not the project root
3. **Environment-Specific**: If you have multiple environments (Production, Preview), set variables for each
4. **Redeploy**: Railway will automatically redeploy when you change variables

## Verification

After setting all variables, check the deployment logs:
- You should see: `DEBUG: DATABASE_URL exists? true`
- You should see: `DEBUG: JWT_SECRET exists? true`
- You should see: `DEBUG: JWT_REFRESH_SECRET exists? true`
- You should see: `DEBUG: CORS_ORIGIN = <your-url>`

If you see errors about missing variables, double-check:
1. Variables are set on the correct service (Backend)
2. Variables are set on the correct environment (Production/Preview)
3. Variable names are spelled correctly (case-sensitive)
4. No extra spaces in variable names or values
