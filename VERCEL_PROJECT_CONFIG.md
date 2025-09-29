# Vercel Project Configuration Guide

## 🎯 **Smart Deployments for Monorepo**

**How it works:**
- **Admin changes** → Only `order-app-admin` deploys
- **Mobile changes** → Only `order-app-mobile` deploys  
- **Shared changes** → Both deploy
- **No unnecessary deployments** 🎉

### **1. order-app-admin Project**

**Go to:** Vercel Dashboard → `order-app-admin` → Settings → General

**Settings:**
- **Root Directory**: `apps/admin`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`
- **Node.js Version**: `18.x` (or latest)

### **2. order-app-mobile Project**

**Go to:** Vercel Dashboard → `order-app-mobile` → Settings → General

**Settings:**
- **Root Directory**: `apps/order-mobile`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`
- **Node.js Version**: `18.x` (or latest)

## 🔧 **Environment Variables**

**For both projects, add these Environment Variables:**

### **Preview Environment (staging):**
- `VITE_SUPABASE_URL` = `https://hczxysdwtkfwumtlddht.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjenh5c2R3dGtmd3VtdGxkZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzI3NTgsImV4cCI6MjA3NDcwODc1OH0.9KpQMCGB8eKn81o5zEQ_r2XnZscN8WuUY9vcIu10MwQ`
- `VITE_ENV` = `staging`

### **Production Environment:**
- `VITE_SUPABASE_URL` = `https://sijxvaxilurrdutisvyy.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ`
- `VITE_ENV` = `production`

## 🚀 **After Configuration**

1. **Save the settings** for both projects
2. **Trigger a new deployment** by pushing to `main`
3. **Check that both projects build successfully**

## ❓ **Troubleshooting**

If deployments still fail:
- Check the **Build Logs** in Vercel
- Verify the **Root Directory** is correct
- Ensure **Environment Variables** are set
- Check that **Install Command** runs from the monorepo root
