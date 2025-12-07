# Quick Deployment Checklist

## 🚀 Railway Database Setup (5 minutes)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL**
   - New Project → Add PostgreSQL
   - Copy `DATABASE_URL` from Variables tab

3. **Run Migrations**
   ```bash
   cd backend
   export DATABASE_URL="your-railway-url"
   npx prisma generate
   npx prisma migrate deploy
   ```

## 🎯 Vercel Deployment (10 minutes)

### Option A: Single Project (Easier)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import GitHub repo
   - Root Directory: `.` (root)
   - Framework: Other
   - Add Environment Variables:
     ```
     DATABASE_URL=your-railway-url
     JWT_SECRET=generate-with-openssl-rand-base64-32
     JWT_EXPIRES_IN=7d
     FRONTEND_URL=https://your-app.vercel.app
     NODE_ENV=production
     ```
   - Deploy!

3. **Set Frontend Environment Variable**
   - After deployment, get your URL
   - Add to Vercel: `VITE_API_URL=https://your-app.vercel.app/api`
   - Redeploy

### Option B: Separate Projects (Recommended)

**Backend:**
- Root: `.`
- Build: Auto-detect
- Env vars: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL

**Frontend:**
- Root: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env var: `VITE_API_URL=https://backend-url.vercel.app/api`

## ✅ Verify

- Backend: `https://your-app.vercel.app/api/health`
- Frontend: Visit your frontend URL
- Test: Register → Login → Create Order

## ⚠️ Important Notes

- **File Uploads**: Won't persist (use Cloudinary for production)
- **Socket.io**: Won't work (real-time disabled, API still works)
- **Database**: Railway free tier is generous but has limits

## 🔧 Troubleshooting

**Build fails?**
- Check Prisma generate runs
- Verify all env vars set
- Check build logs in Vercel

**Database connection fails?**
- Verify DATABASE_URL is correct
- Check Railway database is running
- Ensure migrations completed

**CORS errors?**
- Verify FRONTEND_URL matches actual URL
- Check backend CORS config

---

**Full guide:** See `DEPLOYMENT.md` for detailed instructions.

