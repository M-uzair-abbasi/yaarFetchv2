# Deployment Guide - Railway Database + Vercel Frontend & Backend

This guide will help you deploy your UZI Delivery App using:
- **Railway** for PostgreSQL database
- **Vercel** for frontend and backend

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)
- Git installed locally

---

## Step 1: Set Up Railway Database

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended) or email
3. Create a new project

### 1.2 Create PostgreSQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance

### 1.3 Get Database Connection String
1. Click on your PostgreSQL service
2. Go to the **"Variables"** tab
3. Copy the `DATABASE_URL` value (it looks like: `postgresql://postgres:password@host:port/railway`)

**Important:** Save this connection string - you'll need it later!

### 1.4 Run Database Migrations
Open your terminal and run:

```bash
cd backend

# Set the Railway database URL
export DATABASE_URL="your-railway-database-url-here"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

**Windows users:**
```bash
set DATABASE_URL=your-railway-database-url-here
npx prisma generate
npx prisma migrate deploy
```

This will create all your database tables in Railway.

---

## Step 2: Prepare Your Code for Deployment

### 2.1 Push Code to GitHub
If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create a GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Vercel

### 3.1 Import Project to Vercel
1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Other
   - **Root Directory:** Leave as root (`.`)
   - **Build Command:** (Leave empty - Vercel will use vercel.json)
   - **Output Directory:** (Leave empty)

### 3.2 Set Environment Variables
In Vercel project settings → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your Railway database URL | From Step 1.3 |
| `JWT_SECRET` | A strong random string | Generate with: `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | You'll update this after frontend deploy |
| `NODE_ENV` | `production` | |
| `PORT` | (Leave empty) | Vercel handles this |

**Important:** 
- Add these for **Production**, **Preview**, and **Development** environments
- You can update `FRONTEND_URL` after deploying the frontend

### 3.3 Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-app.vercel.app`)

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Separate Frontend Project (Recommended)
For better organization, create a separate Vercel project for frontend:

1. In Vercel, click **"Add New"** → **"Project"**
2. Import the same GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4.2 Set Frontend Environment Variables
In frontend project settings → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` | Your backend URL from Step 3.3 |

### 4.3 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your frontend URL

### 4.4 Update Backend FRONTEND_URL
1. Go back to your backend Vercel project
2. Settings → Environment Variables
3. Update `FRONTEND_URL` to your frontend URL
4. Redeploy backend (or it will auto-redeploy)

---

## Step 5: Alternative - Deploy Both in One Project

If you prefer a single Vercel project:

1. Use the root `vercel.json` configuration (already created)
2. Set all environment variables in one project
3. Vercel will automatically route:
   - `/api/*` → Backend
   - `/*` → Frontend

**Note:** This approach works but can be harder to manage. Separate projects are recommended.

---

## Step 6: Handle File Uploads (Important!)

Vercel serverless functions have limitations with file storage. You have two options:

### Option A: Use Cloud Storage (Recommended for Production)
1. Set up **Cloudinary** (free tier available):
   - Sign up at https://cloudinary.com
   - Get your API keys
   - Update your backend to use Cloudinary instead of local storage

### Option B: Use Vercel Blob Storage
1. Install `@vercel/blob`
2. Update upload handlers to use Vercel Blob

**For now, local uploads will work but files won't persist between deployments.**

---

## Step 7: Socket.io Limitation

**Important:** Socket.io doesn't work well with Vercel serverless functions because:
- Serverless functions are stateless
- WebSocket connections require persistent connections

### Solutions:

1. **Disable Socket.io temporarily** (messages will still work via API polling)
2. **Use a separate WebSocket service:**
   - Pusher (https://pusher.com)
   - Ably (https://ably.com)
   - Or deploy a separate Socket.io server on Railway

The current setup will work for REST API calls, but real-time features may need adjustment.

---

## Step 8: Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Try registering/logging in
   - Test creating orders/offers

3. **Check Database:**
   - Use Railway's built-in database browser
   - Or connect with: `npx prisma studio` (locally with Railway DATABASE_URL)

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check Railway database is running
- Ensure migrations ran successfully

### Build Failures
- Check Vercel build logs
- Ensure `prisma generate` runs during build
- Verify all dependencies are in `package.json`

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check backend CORS configuration

### 404 Errors on Frontend Routes
- Ensure `frontend/vercel.json` has the rewrite rule
- Check that `dist` folder is being generated

---

## Environment Variables Summary

### Backend (Vercel)
```
DATABASE_URL=postgresql://... (from Railway)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Next Steps

1. ✅ Database set up on Railway
2. ✅ Backend deployed to Vercel
3. ✅ Frontend deployed to Vercel
4. ✅ Environment variables configured
5. ⚠️ Set up cloud storage for file uploads
6. ⚠️ Handle Socket.io for real-time features (optional)

---

## Useful Commands

```bash
# Run migrations locally (pointing to Railway DB)
DATABASE_URL="your-railway-url" npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (with Railway DB)
DATABASE_URL="your-railway-url" npx prisma studio

# Check Vercel deployments
vercel ls

# View Vercel logs
vercel logs
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Railway database logs
3. Verify all environment variables are set
4. Ensure database migrations completed successfully

Good luck with your deployment! 🚀

