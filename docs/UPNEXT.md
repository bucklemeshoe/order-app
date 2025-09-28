# 🚀 UP NEXT - Order App Development Roadmap

## 🖥️ Local Setup Guide (MacBook Pro)

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase CLI** - Install with: `npm install -g supabase`

### Quick Start (5 minutes)

1. **Clone & Navigate**
   ```bash
   cd /Users/jared/Development/order-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Local Supabase**
   ```bash
   npm run supabase:local:start
   ```
   This starts:
   - Database on port 54322
   - API on port 54321
   - Studio on port 54323
   - Inbucket (email testing) on port 54324

4. **Reset Database (First Time)**
   ```bash
   npm run supabase:local:reset
   ```
   This applies all migrations and seeds with sample data.

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Admin Dashboard
   npm run dev:admin      # http://localhost:5174
   
   # Terminal 2 - Mobile App
   npm run dev:mobile     # http://localhost:5173
   ```

### 🎯 What You'll See

- **Admin Dashboard** (http://localhost:5174): Order management, menu builder, settings
- **Mobile App** (http://localhost:5173): Customer ordering interface
- **Supabase Studio** (http://localhost:54323): Database management interface

### 🔧 Environment Variables (Optional)

The apps work without environment files in local development, but you can add them:

**Admin App** (`apps/admin/.env`):
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Mobile App** (`apps/order-mobile/.env`):
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The anon key is displayed when you run `supabase start`.

---

## 📋 Next Development Priorities

### 🎯 Phase 1: Cashup & Analytics (Current Sprint)

#### **1. Database Schema Updates**
- [ ] **Migration 0019**: Add customer info to orders table
  ```sql
  ALTER TABLE orders 
  ADD COLUMN customer_name VARCHAR(255),
  ADD COLUMN customer_phone VARCHAR(20),
  ADD COLUMN actual_ready_at TIMESTAMP;
  ```
- [ ] **Add performance indexes** for reporting queries
- [ ] **Update mobile checkout** to collect customer names

#### **2. Cashup Page Implementation**
- [ ] **Create CashupPage component** in admin dashboard
- [ ] **Add route** to profile dropdown menu
- [ ] **Implement date selector** with default to today
- [ ] **Build revenue overview** with gross/net/tax breakdown
- [ ] **Create product sales aggregation** from orders.items
- [ ] **Add orders list** with customer info and location data

#### **3. Analytics Features**
- [ ] **Collection time metrics** (estimated vs actual ready times)
- [ ] **Popular items dashboard** with percentage calculations
- [ ] **Cancellation analysis** with rates and values
- [ ] **Daily order summaries** with customer details

### 🎯 Phase 2: Enhanced Data Collection

#### **1. Customer Experience**
- [ ] **Enhanced checkout flow** with name collection
- [ ] **Order history improvements** with customer details
- [ ] **Location sharing enhancements** for pickup coordination

#### **2. Admin Improvements**
- [ ] **Actual ready timestamp tracking** when marking orders ready
- [ ] **Collection time analytics** based on real data
- [ ] **Export functionality** (PDF/CSV) for cashup reports

### 🎯 Phase 3: Advanced Features

#### **1. Business Intelligence**
- [ ] **Historical trend analysis** with date range comparisons
- [ ] **Performance insights** and recommendations
- [ ] **Advanced data visualization** with charts and graphs

#### **2. Mobile Enhancements**
- [ ] **Push notifications** with collection time updates
- [ ] **Offline ordering capabilities** for poor connectivity
- [ ] **Payment integration** (Apple Pay / Google Pay)

---

## 🛠️ Development Workflow

### **Daily Development**
1. **Start local environment**: `npm run supabase:local:start`
2. **Reset if needed**: `npm run supabase:local:reset`
3. **Start dev servers**: `npm run dev:admin` + `npm run dev:mobile`
4. **Test changes** across both apps
5. **Commit frequently** with descriptive messages

### **Database Changes**
1. **Create migration**: `supabase migration new migration_name`
2. **Write SQL** in the new migration file
3. **Test locally**: `npm run supabase:local:reset`
4. **Deploy**: `npm run supabase:push` (when ready)

### **Component Development**
- **Admin components**: Use Shadcn/ui + Tailwind CSS
- **Mobile components**: Use Ionic React components
- **Shared logic**: Place in `packages/lib/src/`
- **UI components**: Place in `packages/ui/src/`

---

## 🎨 Design System

### **Admin Dashboard**
- **Color Palette**: Neutral grays with status-specific colors
- **Components**: Shadcn/ui with custom styling
- **Layout**: Card-based sections with responsive grid

### **Mobile App**
- **Color Palette**: Coffee shop warm colors
- **Components**: Ionic React for native feel
- **Layout**: Mobile-first with touch-friendly interactions

---

## 🔍 Testing Strategy

### **Manual Testing Checklist**
- [ ] **Order flow**: Place order → Admin receives → Status updates → Customer notified
- [ ] **Menu management**: Add/edit/delete items with variants and extras
- [ ] **Business hours**: App unavailable outside operating hours
- [ ] **Collection times**: Set and track order ready times
- [ ] **Order numbers**: Sequential numbering system
- [ ] **Settings**: Tax toggle, business hours, emergency controls

### **Cross-Platform Testing**
- [ ] **Desktop browsers**: Chrome, Safari, Firefox
- [ ] **Mobile browsers**: iOS Safari, Chrome Mobile
- [ ] **Responsive design**: Various screen sizes
- [ ] **Touch interactions**: Mobile-specific features

---

## 🚀 Deployment

### **Staging Environment**
- **Location**: `Staging/order-mobile/`
- **Purpose**: Pre-production testing
- **Command**: `npm run dev:staging`

### **Production Deployment**
1. **Build apps**: `npm run build`
2. **Deploy to hosting** (Vercel/Netlify)
3. **Update Supabase** with production credentials
4. **Test end-to-end** functionality

---

## 📚 Resources

### **Documentation**
- [README.md](./README.md) - Main project documentation
- [CASHUP_IMPLEMENTATION_PLAN.md](./CASHUP_IMPLEMENTATION_PLAN.md) - Detailed cashup specs
- [ORDER_NUMBERS_SUPPORT_README.md](./ORDER_NUMBERS_SUPPORT_README.md) - Order numbering system
- [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Local development setup guide

### **External Links**
- [Supabase Docs](https://supabase.com/docs)
- [Ionic React Docs](https://ionicframework.com/docs/react)
- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🎯 Success Metrics

### **Phase 1 Goals**
- [ ] Cashup page accessible from admin dashboard
- [ ] Daily revenue calculations accurate
- [ ] Product sales aggregation working
- [ ] Customer data collection implemented
- [ ] Collection time analytics functional

### **Performance Targets**
- [ ] Page load under 3 seconds
- [ ] Real-time updates working
- [ ] Mobile app responsive on all devices
- [ ] Admin dashboard usable on tablets

---

**Ready to build the next generation of coffee ordering! ☕✨**
