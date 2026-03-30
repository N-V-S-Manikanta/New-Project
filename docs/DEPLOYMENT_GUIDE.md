# Deployment Guide

## Overview

- **Frontend**: Deploy to Vercel or Netlify
- **Backend**: Deploy to Render or Railway
- **Database**: MongoDB Atlas (free tier)

---

## Step 1: Database — MongoDB Atlas

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **free M0 cluster**
3. Create a **database user** (save username/password)
4. In Network Access, add `0.0.0.0/0` to allow all IPs
5. Click **Connect** → **Connect your application** → copy the URI

---

## Step 2: Backend — Render

1. Push code to GitHub (already done)
2. Go to [render.com](https://render.com) and sign in with GitHub
3. Click **New** → **Web Service**
4. Select the repository `N-V-S-Manikanta/New-Project`
5. Configure:
   - **Name**: `placement-tracker-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
6. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your Atlas URI |
   | `JWT_SECRET` | A strong random string (min 32 chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | Your frontend URL (set after deploying frontend) |
   | `NODE_ENV` | `production` |
7. Click **Create Web Service**
8. Note your backend URL: `https://placement-tracker-api.onrender.com`

---

## Step 3: Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import `N-V-S-Manikanta/New-Project`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://placement-tracker-api.onrender.com/api` |
6. Click **Deploy**
7. Note your frontend URL: `https://placement-tracker.vercel.app`

---

## Step 4: Update CORS

Go back to **Render** → Your backend service → **Environment**:
- Update `CLIENT_URL` to your Vercel frontend URL
- Redeploy the backend

---

## Alternative: Railway (Backend)

1. Go to [railway.app](https://railway.app)
2. Create **New Project** → **Deploy from GitHub**
3. Select the repository
4. Set **Root Directory** to `server`
5. Add environment variables (same as Render)
6. Deploy

---

## Alternative: Netlify (Frontend)

1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import from Git**
3. Select the repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
5. Add environment variables
6. Deploy

Create a `client/public/_redirects` file for SPA routing:
```
/*    /index.html   200
```

---

## CI/CD (Optional)

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install & test backend
        run: cd server && npm install && npm test
```

---

## Checklist

- [ ] MongoDB Atlas cluster created and URI saved
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set correctly
- [ ] CORS `CLIENT_URL` updated in backend
- [ ] Application is accessible and login works
