# 🚀 Order App - Local Development Startup Guide

## Quick Start Commands

### **Option 1: Full Interactive Setup**
```bash
npm start
# or
./start-dev.sh
```
**What it does:**
- ✅ Checks all prerequisites (Node.js, npm, Supabase CLI)
- ✅ Installs dependencies if needed
- ✅ Stops any conflicting Supabase instances
- ✅ Starts Supabase local database
- ✅ Opens Supabase Studio in browser
- ✅ Asks if you want to start dev servers
- ✅ Provides cleanup on exit (Ctrl+C)

### **Option 2: Quick & Silent**
```bash
npm run quick-start
# or
./quick-start.sh
```
**What it does:**
- ✅ Stops existing instances
- ✅ Starts Supabase
- ✅ Opens Supabase Studio
- ✅ Starts both dev servers immediately
- ✅ Clean exit with Ctrl+C

## Manual Commands

### **Database Only**
```bash
# Start just the database
npm run supabase:local:start

# Reset database (fresh start)
npm run supabase:local:reset

# Stop database
supabase stop
```

### **Development Servers**
```bash
# Admin Dashboard only
npm run dev:admin      # http://localhost:5174

# Mobile App only  
npm run dev:mobile     # http://localhost:5173

# Both (in separate terminals)
npm run dev:admin & npm run dev:mobile
```

## 🌐 Access Points

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Admin Dashboard** | http://localhost:5174 | Staff management interface |
| **Mobile App** | http://localhost:5173 | Customer ordering interface |
| **Supabase Studio** | http://127.0.0.1:54323 | Database management |
| **API** | http://127.0.0.1:54321 | REST/GraphQL endpoints |
| **Email Testing** | http://127.0.0.1:54324 | Email preview (Inbucket) |

## 🔧 Troubleshooting

### **Port Conflicts**
If you get port conflicts:
```bash
# Stop all Supabase instances
supabase stop --ignore-errors

# Or stop specific project
supabase stop --project-id [project-name]
```

### **Dependencies Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Database Issues**
```bash
# Reset everything
supabase stop
supabase db reset
supabase start
```

## 📋 Prerequisites

Make sure you have:
- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Supabase CLI** - `npm install -g supabase`
- ✅ **Docker** (for Supabase local development)

## 🎯 Recommended Workflow

1. **Start Development**: `npm start`
2. **Choose**: Start dev servers when prompted
3. **Develop**: Use http://localhost:5174 (admin) and http://localhost:5173 (mobile)
4. **Database**: Use http://127.0.0.1:54323 (Supabase Studio)
5. **Stop**: Press Ctrl+C to stop everything cleanly

## 🔄 Daily Development

For daily development, the quickest approach:
```bash
cd /Users/jared/Development/order-app
npm run quick-start
```

This gets everything running in one command and opens all the interfaces you need.

---

**💡 Pro Tip**: Bookmark these URLs for quick access:
- Admin: http://localhost:5174
- Mobile: http://localhost:5173  
- Database: http://127.0.0.1:54323
