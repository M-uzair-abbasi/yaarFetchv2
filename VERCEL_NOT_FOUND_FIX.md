# Vercel NOT_FOUND Error - Complete Fix & Explanation

## ✅ The Fix Applied

### What Was Changed:

1. **Created root-level `api/index.ts`**
   - Moved serverless function from `backend/api/index.ts` to `api/index.ts`
   - Updated import paths to reference `../backend/src/...`
   - This is the location Vercel expects for serverless functions

2. **Updated `vercel.json`**
   - Changed build source from `backend/api/index.ts` to `api/index.ts`
   - Updated route destination to `/api/index.ts`
   - Simplified includeFiles to `backend/**`

### Files Created/Modified:
- ✅ Created: `api/index.ts` (root level)
- ✅ Updated: `vercel.json` (builds and routes)
- ✅ Created: `api/package.json` (for Vercel detection)

---

## 2. Root Cause Analysis

### What the Code Was Doing:
- Serverless function was at `backend/api/index.ts`
- `vercel.json` tried to build from this custom path
- Vercel's routing system couldn't reliably find/execute the function

### What It Needed to Do:
- Function must be in root `api/` folder for Vercel's file-based routing
- OR use explicit builds configuration that Vercel can resolve
- Function must export a handler Vercel can invoke

### Conditions That Triggered This:
1. **Custom path structure**: `backend/api/` instead of root `api/`
2. **Build resolution failure**: Vercel couldn't find the function file
3. **Missing build steps**: Prisma client might not generate
4. **Route mismatch**: Routes pointed to a file Vercel couldn't locate

### The Misconception:
**"I can put serverless functions anywhere as long as I configure it in vercel.json"**

**Reality**: While Vercel's `builds` API allows custom paths, it's unreliable. The modern, recommended approach is:
- Use root `api/` folder (auto-detected)
- OR use explicit monorepo configuration
- Custom paths in `builds` API often fail silently

---

## 3. Understanding Vercel Serverless Functions

### Why This Error Exists:
The NOT_FOUND error protects you from:
- **Deploying broken functions**: If Vercel can't find the function, it won't deploy a broken version
- **Silent failures**: Better to fail loudly than serve 404s
- **Configuration errors**: Forces you to use correct structure

### The Correct Mental Model:

**Vercel has two routing systems:**

1. **File-based routing (Modern - Recommended)**
   ```
   api/
     index.ts     → Handles /api/*
     users.ts      → Handles /api/users
   ```
   - Auto-detected
   - No configuration needed
   - Most reliable

2. **Builds API (Legacy - Still works but finicky)**
   ```json
   {
     "builds": [{
       "src": "custom/path/index.ts",
       "use": "@vercel/node"
     }]
   }
   ```
   - Requires explicit configuration
   - Can be unreliable with custom paths
   - More complex

### Framework Design:
- **Serverless = Isolated**: Each function is a separate unit
- **Convention over Configuration**: Standard locations work best
- **Build-time resolution**: Vercel needs to find functions at build time
- **Runtime execution**: Functions must export handlers Vercel can invoke

---

## 4. Warning Signs & Code Smells

### Red Flags to Watch For:

❌ **Custom function paths**
```json
// BAD: Custom path
"src": "backend/api/index.ts"

// GOOD: Root api folder
"src": "api/index.ts"
```

❌ **Missing build commands**
```json
// BAD: No build step
{
  "src": "api/index.ts",
  "use": "@vercel/node"
}

// GOOD: Explicit build
{
  "src": "api/index.ts",
  "use": "@vercel/node",
  "config": {
    "buildCommand": "cd backend && npm install && npx prisma generate"
  }
}
```

❌ **Complex includeFiles**
```json
// BAD: Too specific, might miss files
"includeFiles": ["backend/src/**", "backend/prisma/**"]

// GOOD: Include entire backend
"includeFiles": ["backend/**"]
```

### Similar Mistakes:

1. **Putting functions in `src/api/` instead of `api/`**
2. **Forgetting to export the handler** (`export default app`)
3. **Wrong import paths** after moving files
4. **Missing dependencies** in function's context
5. **TypeScript not compiling** before deployment

### Code Smells:

```typescript
// ❌ BAD: Relative imports that break when moved
import routes from '../src/routes'

// ✅ GOOD: Absolute or correct relative paths
import routes from '../backend/src/routes'

// ❌ BAD: No error handling
export default app;

// ✅ GOOD: Error handling + proper export
export default app;
```

---

## 5. Alternative Approaches & Trade-offs

### Option 1: Root `api/` Folder (✅ Applied - Recommended)
**Pros:**
- ✅ Auto-detected by Vercel
- ✅ Most reliable
- ✅ Standard convention
- ✅ Works with zero config

**Cons:**
- ⚠️ Requires moving/duplicating files
- ⚠️ Import paths need adjustment

**Best for:** Most projects, especially new ones

### Option 2: Fix Builds API Configuration
**Pros:**
- ✅ Keeps existing structure
- ✅ More control

**Cons:**
- ❌ More complex configuration
- ❌ Less reliable
- ❌ Requires explicit build commands

**Best for:** Legacy projects that can't be restructured

### Option 3: Separate Vercel Projects
**Pros:**
- ✅ Clear separation
- ✅ Independent deployments
- ✅ Each project uses standard structure

**Cons:**
- ❌ More projects to manage
- ❌ CORS configuration needed
- ❌ More complex CI/CD

**Best for:** Large teams, microservices

### Option 4: Vercel Monorepo Support
**Pros:**
- ✅ Native monorepo handling
- ✅ Automatic detection

**Cons:**
- ❌ Requires specific structure
- ❌ Less flexible

**Best for:** Workspaces with multiple apps

---

## 6. Verification Checklist

After applying the fix, verify:

- [ ] `api/index.ts` exists at root level
- [ ] `vercel.json` points to `api/index.ts`
- [ ] Import paths are correct (`../backend/src/...`)
- [ ] Function exports default Express app
- [ ] Environment variables set in Vercel
- [ ] Build logs show successful function detection
- [ ] `/api/health` endpoint works
- [ ] `/api/auth/register` works

---

## 7. Next Steps

1. **Commit and push:**
   ```bash
   git add api/ vercel.json
   git commit -m "Fix: Move serverless function to root api/ folder"
   git push
   ```

2. **Monitor Vercel deployment:**
   - Check build logs for function detection
   - Verify no NOT_FOUND errors
   - Test endpoints

3. **If still failing:**
   - Check Vercel function logs (not build logs)
   - Verify environment variables are set
   - Ensure Prisma client generates (check build logs)
   - Test locally with `vercel dev`

---

## Key Takeaway

**Vercel's file-based routing expects functions in `api/` at the root.** While custom paths can work, they're unreliable. The fix moves your function to the standard location, making it auto-detectable and more reliable.

**Remember:** Convention over configuration - use standard locations when possible!

