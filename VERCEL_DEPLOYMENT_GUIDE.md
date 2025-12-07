# 🚀 Complete Vercel Deployment Guide

## ✅ What's Already Done
- ✅ Database is set up on Railway
- ✅ Code structure is ready
- ✅ `api/index.ts` is at root (Vercel will find it)
- ✅ `vercel.json` is configured

---

## 📋 Step-by-Step Deployment

### STEP 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

### STEP 2: Deploy Backend (First Project)

#### 2.1 Create Backend Project
1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Click **"Import"**

#### 2.2 Configure Backend
- **Project Name**: `uzi-backend` (or any name)
- **Framework Preset**: **Other**
- **Root Directory**: `.` (root - leave as is)
- **Build Command**: (Leave empty)
- **Output Directory**: (Leave empty)
- Click **"Deploy"** (we'll add env vars after)

#### 2.3 Add Environment Variables
After first deployment, go to **Settings** → **Environment Variables**:

Add these **5 variables**:

1. **DATABASE_URL**
   - Value: Your Railway database URL
   - Format: `postgresql://postgres:PASSWORD@trolley.proxy.rlwy.net:20740/railway?sslmode=require`
   - Get it from: Railway Dashboard → PostgreSQL → Variables → `DATABASE_PUBLIC_URL`

2. **JWT_SECRET**
   - Value: Generate a random string
   - Generate: `openssl rand -base64 32` (or use any random string)
   - Example: `xGnuEnBRlnezwCK0MPkNSBdB1vGQRfxh/mJz23bQxCE=`

3. **JWT_EXPIRES_IN**
   - Value: `7d`

4. **FRONTEND_URL**
   - Value: `https://your-frontend.vercel.app` (you'll update this after frontend deploy)
   - For now: Use a placeholder like `https://placeholder.vercel.app`

5. **NODE_ENV**
   - Value: `production`

**For each variable:**
- ✅ Check **Production**
- ✅ Check **Preview**  
- ✅ Check **Development**
- Click **"Save"**

#### 2.4 Redeploy Backend
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Wait for deployment (2-3 minutes)
4. **Copy your backend URL** (e.g., `https://uzi-backend.vercel.app`)

#### 2.5 Test Backend
Visit: `https://your-backend-url.vercel.app/api/health`

Should see: `{"status":"ok","message":"Server is running",...}`

---

### STEP 3: Deploy Frontend (Second Project)

#### 3.1 Create Frontend Project
1. In Vercel, click **"Add New"** → **"Project"**
2. Import the **same GitHub repository** again

#### 3.2 Configure Frontend
- **Project Name**: `uzi-frontend` (or any name)
- **Framework Preset**: **Vite** (auto-detected)
- **Root Directory**: `frontend` ⚠️ **IMPORTANT: Change this!**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- Click **"Deploy"**

#### 3.3 Add Frontend Environment Variable
After deployment, go to **Settings** → **Environment Variables**:

Add **1 variable**:

**VITE_API_URL**
- Value: `https://your-backend-url.vercel.app/api`
- Replace `your-backend-url` with your actual backend URL from Step 2.4
- ✅ Check **Production**, **Preview**, **Development**
- Click **"Save"**

#### 3.4 Redeploy Frontend
1. Go to **Deployments** tab
2. Click **"..."** → **"Redeploy"**
3. Wait for deployment
4. **Copy your frontend URL** (e.g., `https://uzi-frontend.vercel.app`)

---

### STEP 4: Connect Frontend to Backend

#### 4.1 Update Backend FRONTEND_URL
1. Go back to your **backend project** in Vercel
2. **Settings** → **Environment Variables**
3. Find `FRONTEND_URL`
4. Click **"Edit"**
5. Change value to your **actual frontend URL** from Step 3.4
6. Click **"Save"**
7. **Redeploy** backend (or it auto-redeploys)

---

### STEP 5: Test Everything

#### 5.1 Test Backend
- ✅ Health: `https://your-backend.vercel.app/api/health`
- Should return: `{"status":"ok",...}`

#### 5.2 Test Frontend
- ✅ Visit: `https://your-frontend.vercel.app`
- Should load your app

#### 5.3 Test Full App
1. ✅ **Register** a new user
2. ✅ **Login** with credentials
3. ✅ **Create an order**
4. ✅ **Create an offer**

---

## 🔧 Troubleshooting

### Backend Returns 404
- ✅ Check: `vercel.json` exists and points to `api/index.ts`
- ✅ Check: Function logs in Vercel dashboard

### Backend Returns 500
- ✅ Check: `DATABASE_URL` is correct in environment variables
- ✅ Check: Railway database is running
- ✅ Check: Function logs for specific errors

### Frontend Can't Connect to Backend
- ✅ Check: `VITE_API_URL` is set correctly
- ✅ Check: Backend URL includes `/api` at the end
- ✅ Check: Backend is deployed and running

### CORS Errors
- ✅ Check: `FRONTEND_URL` in backend matches actual frontend URL
- ✅ Check: Frontend URL is in allowed origins list in `api/index.ts`

---

## 📝 Quick Reference

### Backend Environment Variables
```
DATABASE_URL=postgresql://postgres:PASSWORD@trolley.proxy.rlwy.net:20740/railway?sslmode=require
JWT_SECRET=your-random-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### Where to Get Railway Database URL
1. Go to Railway Dashboard
2. Click your PostgreSQL service
3. Go to **Variables** tab
4. Copy `DATABASE_PUBLIC_URL` value
5. Add `?sslmode=require` at the end if not present

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend project created in Vercel
- [ ] Backend environment variables added (5 variables)
- [ ] Backend deployed and health check works
- [ ] Frontend project created in Vercel (root directory = `frontend`)
- [ ] Frontend environment variable added (`VITE_API_URL`)
- [ ] Frontend deployed
- [ ] Backend `FRONTEND_URL` updated to actual frontend URL
- [ ] Full app tested (register, login, create order)

---

## 🎉 You're Done!

Your app should now be live at:
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend.vercel.app/api`

---

## 📞 Need Help?

1. **Check Vercel Logs**: Project → Deployments → Click deployment → View logs
2. **Check Function Logs**: Project → Functions tab → View logs
3. **Test Locally**: Install Vercel CLI and run `vercel dev`

Good luck! 🚀

