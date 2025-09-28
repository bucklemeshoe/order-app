# 🌍 Order App - 3-Environment Setup Guide

## 📋 Overview

This guide documents the complete 3-environment deployment setup for the Order App, including GitHub branching strategy, environment configuration, and Vercel deployment integration.

## 🏗️ Architecture

### **Environment Structure**

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

**Workflow:**
1. **Development**: Work on `develop` branch locally
2. **Staging**: Push to `develop` → Auto-deploys to Vercel Preview
3. **Production**: Merge `develop` to `main` → Auto-deploys to Vercel Production

## 🔧 Environment Configuration

### **Environment Variables**

Each environment uses specific `.env` files:

#### **Local Development** (`.env.local`)
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_ENV=local
```

#### **Staging** (`.env.staging`)
```env
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_STAGING_ANON_KEY
VITE_ENV=staging
```

#### **Production** (`.env.production`)
```env
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PRODUCTION_ANON_KEY
VITE_ENV=production
```

### **File Structure**

```
order-app/
├── apps/
│   ├── admin/
│   │   ├── .env.local          # Local development
│   │   ├── .env.staging        # Staging environment
│   │   ├── .env.production     # Production environment
│   │   └── vercel.json         # Vercel configuration
│   └── order-mobile/
│       ├── .env.local          # Local development
│       ├── .env.staging        # Staging environment
│       ├── .env.production     # Production environment
│       └── vercel.json         # Vercel configuration
├── scripts/
│   ├── setup-environments.sh   # Environment setup automation
│   ├── deploy-staging.sh       # Deploy to staging
│   └── deploy-production.sh    # Deploy to production
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── vercel.json                 # Root Vercel configuration
└── docs/
    ├── ENVIRONMENT_SETUP.md    # This file
    └── DEPLOYMENT_GUIDE.md     # Detailed deployment guide
```

## 🚀 Setup Instructions

### **Step 1: Initial Repository Setup**

```bash
# Clone repository
git clone https://github.com/bucklemeshoe/order-app.git
cd order-app

# Checkout develop branch
git checkout develop

# Install dependencies
npm install
```

### **Step 2: Environment Configuration**

#### **Automated Setup (Recommended)**
```bash
# Run the automated setup script
./scripts/setup-environments.sh
```

#### **Manual Setup**
```bash
# Get Supabase credentials from:
# https://supabase.com/dashboard/project/sijxvaxilurrdutisvyy/settings/api

# Create environment files for admin app
mkdir -p apps/admin
cat > apps/admin/.env.local << EOF
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_ENV=local
EOF

cat > apps/admin/.env.staging << EOF
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_STAGING_ANON_KEY
VITE_ENV=staging
EOF

cat > apps/admin/.env.production << EOF
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PRODUCTION_ANON_KEY
VITE_ENV=production
EOF

# Repeat for mobile app
mkdir -p apps/order-mobile
# ... (same structure as admin)
```

### **Step 3: Vercel Configuration**

#### **3.1 Create Vercel Projects**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import `bucklemeshoe/order-app`
4. Create **two separate projects**:

**Admin App Project:**
- **Framework**: Vite
- **Root Directory**: `apps/admin`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Mobile App Project:**
- **Framework**: Vite
- **Root Directory**: `apps/order-mobile`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### **3.2 Configure Environment Variables**

For each Vercel project, add these environment variables:

**Staging Environment:**
```
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_ENV=staging
```

**Production Environment:**
```
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_ENV=production
```

#### **3.3 Configure Branch Settings**

- **Production Branch**: `main`
- **Preview Branch**: `develop`
- **Auto-deploy**: Enabled for both branches

### **Step 4: GitHub Actions Setup**

#### **4.1 Add Repository Secrets**

In GitHub repository settings, add these secrets:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VITE_SUPABASE_URL=https://sijxvaxilurrdutisvyy.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### **4.2 Get Vercel Credentials**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Get project details
vercel link
```

## 🎯 Deployment Workflow

### **Local Development**

```bash
# Start local development
npm start

# Or quick start
npm run quick-start

# Access points:
# - Admin: http://localhost:5174
# - Mobile: http://localhost:5173
# - Database: http://127.0.0.1:54323
```

### **Deploy to Staging**

```bash
# Method 1: Using deployment script
npm run deploy:staging

# Method 2: Manual push
git checkout develop
git push origin develop

# Result: Auto-deploys to staging
# URL: https://staging-order-app.vercel.app
```

### **Deploy to Production**

```bash
# Method 1: Using deployment script
npm run deploy:production

# Method 2: Manual merge
git checkout main
git merge develop
git push origin main

# Result: Auto-deploys to production
# URL: https://order-app.vercel.app
```

## 📦 Build Commands

### **Package.json Scripts**

```json
{
  "scripts": {
    "dev:mobile": "npm run -w apps/order-mobile dev",
    "dev:staging": "npm run -w Staging/order-mobile dev",
    "build:admin": "npm run -w apps/admin build",
    "build:mobile": "npm run -w apps/order-mobile build",
    "start": "./start-dev.sh",
    "quick-start": "./quick-start.sh",
    "deploy:staging": "./scripts/deploy-staging.sh",
    "deploy:production": "./scripts/deploy-production.sh",
    "supabase:local:start": "supabase start",
    "supabase:local:reset": "supabase db reset",
    "supabase:push": "supabase db push",
    "functions:deploy": "supabase functions deploy"
  }
}
```

### **Individual Build Commands**

```bash
# Build admin app
npm run build:admin

# Build mobile app
npm run build:mobile

# Build both apps
npm run build:admin && npm run build:mobile
```

## 🗄️ Database Configuration

### **Local Database**

```bash
# Start local Supabase
npm run supabase:local:start

# Reset with migrations
npm run supabase:local:reset

# Stop local Supabase
supabase stop
```

### **Cloud Database**

```bash
# Link to cloud project
supabase link --project-ref sijxvaxilurrdutisvyy

# Push migrations to cloud
npm run supabase:push

# Deploy functions
npm run functions:deploy
```

## 🔍 Testing Environments

### **Local Testing**
- **URL**: `http://localhost:5174` (admin), `http://localhost:5173` (mobile)
- **Database**: Local Supabase instance
- **Purpose**: Development and feature testing

### **Staging Testing**
- **URL**: `https://staging-order-app.vercel.app`
- **Database**: Supabase cloud (staging data)
- **Purpose**: Pre-production testing and client previews

### **Production Testing**
- **URL**: `https://order-app.vercel.app`
- **Database**: Supabase cloud (production data)
- **Purpose**: Live customer-facing application

## 🛠️ Troubleshooting

### **Environment Issues**

```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
echo $VITE_ENV

# Verify .env files exist
ls -la apps/admin/.env.*
ls -la apps/order-mobile/.env.*
```

### **Build Issues**

```bash
# Clean build
rm -rf node_modules dist
npm install
npm run build:admin
npm run build:mobile
```

### **Deployment Issues**

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod
```

### **Database Issues**

```bash
# Reset local database
supabase stop
supabase start
supabase db reset

# Check cloud connection
supabase status
```

## 📊 Monitoring & Analytics

### **Vercel Analytics**
- **Performance**: Monitor app performance and Core Web Vitals
- **Errors**: Track deployment and runtime errors
- **Usage**: Analyze user interactions and traffic

### **Supabase Monitoring**
- **Database**: Monitor query performance and usage
- **API**: Track API calls and response times
- **Auth**: Monitor authentication events

## 🔐 Security Considerations

### **Environment Security**
- ✅ **Never commit** `.env` files to git
- ✅ **Use different** Supabase projects for staging/production
- ✅ **Rotate keys** regularly
- ✅ **Enable RLS** on all database tables
- ✅ **Use HTTPS** in production

### **Access Control**
- **Local**: Full access for development
- **Staging**: Limited access for testing
- **Production**: Restricted access with monitoring

## 📚 Additional Resources

### **Documentation**
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Local development setup
- [README.md](./README.md) - Project overview and features

### **External Links**
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎉 Quick Reference

### **Essential Commands**

```bash
# Local development
npm start

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Setup environments
./scripts/setup-environments.sh

# Build apps
npm run build:admin
npm run build:mobile
```

### **Environment URLs**

- **Local Admin**: http://localhost:5174
- **Local Mobile**: http://localhost:5173
- **Local Database**: http://127.0.0.1:54323
- **Staging**: https://staging-order-app.vercel.app
- **Production**: https://order-app.vercel.app

### **Git Workflow**

```bash
# Start feature development
git checkout develop
git pull origin develop

# Make changes and commit
git add .
git commit -m "feat: new feature"
git push origin develop

# Deploy to production (when ready)
git checkout main
git merge develop
git push origin main
```

---

**🎯 This setup provides a robust, scalable deployment pipeline with proper environment separation, automated deployments, and comprehensive monitoring capabilities.**
