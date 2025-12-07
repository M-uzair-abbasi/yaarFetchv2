# Connect Vercel Backend with Railway Database

## Step 1: Get Railway Database URL

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Log in to your account

2. **Find Your PostgreSQL Service**
   - Click on your project
   - Click on the PostgreSQL service (it should show "PostgreSQL" as the service name)

3. **Get the Connection String**
   - Click on the **"Variables"** tab
   - Look for `DATABASE_URL` or `POSTGRES_URL`
   - Click the **"Copy"** button next to it
   - The URL looks like: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`

**Alternative:** If you don't see `DATABASE_URL`, look for:
- `POSTGRES_URL`
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (you'll need to construct the URL)

The format is: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE`

---

## Step 2: Run Database Migrations (Create Tables)

You need to run migrations **locally** first to create the tables in Railway.

### Option A: Using Command Line (Recommended)

**Windows (CMD):**
```cmd
cd backend
set DATABASE_URL=your-railway-database-url-here
npx prisma generate
npx prisma migrate deploy
```

**Windows (PowerShell):**
```powershell
cd backend
$env:DATABASE_URL="your-railway-database-url-here"
npx prisma generate
npx prisma migrate deploy
```

**Mac/Linux:**
```bash
cd backend
export DATABASE_URL="your-railway-database-url-here"
npx prisma generate
npx prisma migrate deploy
```

### Option B: Create a Temporary .env File

1. In the `backend` folder, create a `.env` file (if it doesn't exist)
2. Add:
   ```
   DATABASE_URL=your-railway-database-url-here
   ```
3. Run:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate deploy
   ```

**Important:** Don't commit this `.env` file to git if it contains your production database URL!

---

## Step 3: Add Database URL to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Select your project

2. **Navigate to Settings**
   - Click on **"Settings"** tab
   - Click on **"Environment Variables"** in the sidebar

3. **Add DATABASE_URL**
   - Click **"Add New"**
   - **Name:** `DATABASE_URL`
   - **Value:** Paste your Railway database URL
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

4. **Add Other Required Variables**
   Make sure you also have:
   - `JWT_SECRET` - A random secret key (generate with: `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN` - `7d`
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `NODE_ENV` - `production`

---

## Step 4: Verify Connection

### Check Tables in Railway

1. Go back to Railway
2. Click on your PostgreSQL service
3. Click **"Query"** tab
4. Run:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
5. You should see tables like: `users`, `orders`, `delivery_offers`, `matches`, `messages`, `reviews`

### Test from Vercel

After deploying, test the health endpoint:
- Visit: `https://your-backend.vercel.app/api/health`
- Should return: `{"status":"ok","message":"Server is running"}`

---

## Troubleshooting

### "Can't reach database server"
- Verify `DATABASE_URL` is correct in Vercel
- Check Railway database is running (should show "Active")
- Ensure the URL includes the port (usually `:5432`)

### "Migration failed"
- Make sure you ran `npx prisma generate` first
- Verify the `DATABASE_URL` is correct
- Check Railway database logs for errors

### "Table doesn't exist"
- Run migrations again: `npx prisma migrate deploy`
- Check if migrations ran successfully
- Verify you're connecting to the correct database

### Connection String Format
Make sure your `DATABASE_URL` looks like:
```
postgresql://postgres:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Railway usually provides it in the correct format, but if you need to construct it:
- `postgresql://` - Protocol
- `postgres` - Username (usually)
- `PASSWORD` - Password from Railway
- `HOST` - Hostname from Railway
- `5432` - Port (usually 5432)
- `railway` - Database name (usually "railway")

---

## Quick Checklist

- [ ] Got Railway database URL
- [ ] Ran `npx prisma generate` locally
- [ ] Ran `npx prisma migrate deploy` locally
- [ ] Verified tables exist in Railway
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Added other required environment variables to Vercel
- [ ] Redeployed Vercel (or it auto-redeploys)
- [ ] Tested API health endpoint

---

## Next Steps

After connecting:
1. Test your API endpoints
2. Try registering a user
3. Verify data is being saved to Railway database

Good luck! 🚀

