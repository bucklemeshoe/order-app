# 🚀 Order App - Deployment Guide

## 🌍 3-Environment Setup

### **Environment Overview**

| Environment | Branch | Database | URL | Purpose |
|-------------|--------|----------|-----|---------|
| **Local** | `develop` | Local Supabase | `localhost:5174` | Development |
| **Staging** | `develop` | Supabase Cloud | `staging-order-app.vercel.app` | Preview/Testing |
| **Production** | `main` | Supabase Cloud | `order-app.vercel.app` | Live App |

### **Branch Strategy**

```
develop ────► staging (Vercel Preview)
   │
   ▼
main ────► production (Vercel Production)
```

- **`develop`** → Auto-deploys to **Staging** (Vercel Preview)
- **`main`** → Auto-deploys to **Production** (Vercel Production)

## 🔧 Environment Setup

### **1. Local Development**

**Environment File**: `apps/admin/.env.local` & `apps/order-mobile/.env.local`

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_ENV=local
```

**Start Development**:
```bash
npm start
```

### **2. Staging Environment**

**Environment File**: `apps/admin/.env.staging` & `apps/order-mobile/.env.staging`

```env
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_STAGING_ANON_KEY
VITE_ENV=staging
```

**Deploy to Staging**:
```bash
git checkout develop
git push origin develop
# Vercel automatically deploys to staging
```

### **3. Production Environment**

**Environment File**: `apps/admin/.env.production` & `apps/order-mobile/.env.production`

```env
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PRODUCTION_ANON_KEY
VITE_ENV=production
```

**Deploy to Production**:
```bash
git checkout main
git merge develop
git push origin main
# Vercel automatically deploys to production
```

## 🗄️ Database Setup

### **Link Supabase Cloud Project**

```bash
# Link to your cloud project
supabase link --project-ref sijxvaxilurrdutisvyy

# Push migrations to cloud
supabase db push

# Deploy functions
supabase functions deploy
```

### **Get Supabase Keys**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `order-app` project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

## 📦 Vercel Setup

### **1. Connect GitHub Repository**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import `bucklemeshoe/order-app`
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin` (for admin app)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### **2. Environment Variables**

In Vercel Dashboard, add these environment variables:

#### **Staging Environment**
```
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_ENV=staging
```

#### **Production Environment**
```
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_ENV=production
```

### **3. Branch Settings**

- **Production Branch**: `main`
- **Preview Branch**: `develop`
- **Auto-deploy**: Enabled for both branches

## 🚀 Deployment Workflow

### **Development to Staging**

```bash
# 1. Make changes on develop branch
git checkout develop
# ... make changes ...

# 2. Commit and push
git add .
git commit -m "feat: new feature"
git push origin develop

# 3. Vercel automatically deploys to staging
# URL: https://staging-order-app.vercel.app
```

### **Staging to Production**

```bash
# 1. Merge develop to main
git checkout main
git merge develop
git push origin main

# 2. Vercel automatically deploys to production
# URL: https://order-app.vercel.app
```

## 🔍 Testing Environments

### **Local Testing**
```bash
npm start
# Test at http://localhost:5174 (admin) and http://localhost:5173 (mobile)
```

### **Staging Testing**
- URL: `https://staging-order-app.vercel.app`
- Use staging database
- Test new features before production

### **Production Testing**
- URL: `https://order-app.vercel.app`
- Use production database
- Live customer-facing app

## 🛠️ Troubleshooting

### **Environment Issues**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
echo $VITE_ENV
```

### **Build Issues**
```bash
# Clean build
rm -rf node_modules dist
npm install
npm run build
```

### **Database Issues**
```bash
# Reset local database
supabase stop
supabase start
supabase db reset
```

## 📱 Mobile App Deployment

### **Capacitor Build**

```bash
# Build for mobile
cd apps/order-mobile
npm run cap:sync
npm run cap:ios    # iOS
npm run cap:android # Android
```

### **App Store Deployment**

1. Build with Capacitor
2. Open in Xcode/Android Studio
3. Archive and upload to stores

## 🔐 Security Notes

- **Never commit** `.env` files to git
- **Use different** Supabase projects for staging/production
- **Rotate keys** regularly
- **Enable RLS** on all database tables
- **Use HTTPS** in production

## 📊 Monitoring

### **Vercel Analytics**
- Monitor performance and errors
- Track user interactions
- Analyze deployment success rates

### **Supabase Monitoring**
- Database performance
- API usage
- Error tracking

---

**🎯 Quick Deploy Commands:**

```bash
# Deploy to staging
git push origin develop

# Deploy to production  
git merge develop && git push origin main
```
