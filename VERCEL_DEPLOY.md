# Deploy Admin Panel to Vercel

## Step 1: Push to GitHub

Make sure your code is committed and pushed to GitHub.

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. In the project settings, set the **Root Directory** to:
   ```
   artifacts/admin
   ```

## Step 3: Environment Variables

In Vercel project settings, add this environment variable:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your deployed API server URL | `https://your-api.replit.app/api` |

> **Important:** The API server must be deployed and accessible. If your API is on Replit, use your Replit deployment URL + `/api`.

## Step 4: Build Settings

Vercel should auto-detect Vite. If not, set:

- **Build Command:** `pnpm run build` (or `npm run build`)
- **Output Directory:** `dist`
- **Framework Preset:** `Vite`

## Step 5: Deploy

Click **Deploy** and wait for the build to complete.

## Troubleshooting

### Admin login not working?
- Make sure your API server is deployed and the `VITE_API_URL` points to the correct URL
- Check browser console for CORS errors
- Verify the admin account was seeded in the production database

### Routes not working (404 on refresh)?
- The `vercel.json` rewrite rule should handle this automatically
- If not, check that `vercel.json` is in the `artifacts/admin` directory

### API calls failing?
- Your API server needs to allow CORS from your Vercel domain
- The current API server already has `app.use(cors())` which allows all origins
- For production, consider restricting CORS to your Vercel domain only
