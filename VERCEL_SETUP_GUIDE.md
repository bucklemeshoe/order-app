# 🚀 Vercel CLI Setup Guide

## 📋 Prerequisites

✅ **Already Done:**
- Vercel CLI installed (`vercel --version`)
- Logged in as `jared-5960`
- Environment files configured
- Supabase project linked

## 🎯 **What You Need to Provide:**

### **1. Project Names** (Choose your preferred names)
- **Admin Dashboard**: `order-app-admin` (recommended)
- **Mobile App**: `order-app-mobile` (recommended)

### **2. Environment Variables** (Already configured)
- **Supabase URL**: `https://sijxvaxilurrdutisvyy.supabase.co`
- **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 **Setup Commands**

### **Option 1: Automated Setup (Recommended)**
```bash
# Run the automated setup script
./scripts/setup-vercel.sh
```

### **Option 2: Manual Setup**

#### **Step 1: Setup Admin Dashboard**
```bash
# Navigate to admin app
cd apps/admin

# Link to Vercel project
vercel link --name order-app-admin

# Add environment variables for staging
vercel env add VITE_SUPABASE_URL staging
# Enter: https://sijxvaxilurrdutisvyy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY staging
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ

vercel env add VITE_ENV staging
# Enter: staging

# Add environment variables for production
vercel env add VITE_SUPABASE_URL production
# Enter: https://sijxvaxilurrdutisvyy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ

vercel env add VITE_ENV production
# Enter: production
```

#### **Step 2: Setup Mobile App**
```bash
# Navigate to mobile app
cd ../order-mobile

# Link to Vercel project
vercel link --name order-app-mobile

# Add environment variables (same as admin)
vercel env add VITE_SUPABASE_URL staging
vercel env add VITE_SUPABASE_ANON_KEY staging
vercel env add VITE_ENV staging
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ENV production
```

#### **Step 3: Return to Root**
```bash
cd ../..
```

## 🎯 **What I Need From You:**

### **Just Confirm:**
1. **Project names** (or use defaults: `order-app-admin` and `order-app-mobile`)
2. **Run the setup** (automated or manual)

### **That's It!** 
Your environment variables are already configured and ready to use.

## 🚀 **After Setup:**

### **Deploy to Staging**
```bash
npm run deploy:staging
```

### **Deploy to Production**
```bash
npm run deploy:production
```

### **Check Deployments**
```bash
vercel ls
```

## 🌐 **Expected URLs**

After setup, your apps will be available at:
- **Staging**: `https://order-app-admin-git-develop-[team].vercel.app`
- **Production**: `https://order-app-admin.vercel.app`

## ❓ **Questions for You:**

1. **Project Names**: Are you happy with `order-app-admin` and `order-app-mobile`?
2. **Setup Method**: Would you like to use the automated script or manual setup?
3. **Ready to proceed?**: Just say "yes" and I'll run the setup for you!

---

**The setup is straightforward - just need your confirmation on project names and which method you prefer!** 🎉
