# 🚀 Quick Start - Deploy to Vercel

## Before You Start
- ✅ Railway database is set up
- ✅ Code is ready

---

## 3 Simple Steps

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2️⃣ Deploy Backend
1. Go to https://vercel.com → **Add New** → **Project**
2. Import your repo
3. Settings:
   - Framework: **Other**
   - Root: `.` (root)
4. Add Environment Variables:
   - `DATABASE_URL` = Your Railway URL
   - `JWT_SECRET` = Random string
   - `JWT_EXPIRES_IN` = `7d`
   - `FRONTEND_URL` = `https://placeholder.vercel.app` (update later)
   - `NODE_ENV` = `production`
5. Deploy → Copy backend URL

### 3️⃣ Deploy Frontend
1. Vercel → **Add New** → **Project**
2. Import same repo
3. Settings:
   - Framework: **Vite**
   - Root: `frontend` ⚠️ **IMPORTANT!**
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
5. Deploy → Copy frontend URL
6. Update backend `FRONTEND_URL` → Redeploy backend

---

## Test
- Backend: `https://your-backend.vercel.app/api/health`
- Frontend: `https://your-frontend.vercel.app`

---

**Full guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`

