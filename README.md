# Order App

A modern, real-time coffee ordering and management system built with React, TypeScript, and Supabase. **Now fully vanilla - no external authentication required!**

## 🚀 Quick Start

<<<<<<< HEAD
**📋 For upcoming features and development roadmap, see [UPNEXT.md](./UPNEXT.md)**

### ☕ Mobile App (Customer-Facing)
- **Vanilla Authentication**: No external dependencies - pure local system
- **Order Placement**: Browse menu with size variants and extras
- **Size Selection**: Multiple sizes per item with dynamic pricing
- **Extras System**: Add-ons grouped with parent items or ordered individually
- **Smart Cart**: Intelligent item grouping with extras integration
- **Real-time Order Tracking**: Live status updates with collection time estimates
- **Unavailable Hours Detection**: Automatic app unavailability based on business hours
- **Collection Time Notifications**: "Ready for collection in X minutes" notifications
- **Unavailable Modal**: Dismissible popup when trying to order outside business hours
- **Sequential Order Numbers**: User-friendly order numbering system (#1001, #1002, etc.)
- **Configurable Tax Display**: Conditional tax calculations based on admin settings
- **Location Sharing**: Optional live location for pickup coordination
- **Cart Management**: Advanced quantity controls with grouped items

### 📊 Admin Dashboard (Staff-Facing)
- **Real-time Order Board**: Live kanban-style order management with collection timers
- **Collection Time Management**: Set and track order ready times with countdown timers
- **Order Status Management**: Update orders through workflow stages with confirmation modals
- **Sequential Order Numbers**: Clean order numbering with automatic incrementing
- **Dashboard Analytics**: Order counts by status with visual indicators
- **Menu Management**: Full CRUD operations with platform targeting and tag support
- **Platform Targeting**: Control where menu items appear (Mobile App, Display Menu, Other)
- **Tags System**: Categorize and organize menu items with visual tags
- **Business Hours Management**: Configure weekly schedules and special hours
- **Emergency Controls**: "Make App Unavailable" toggle with confirmation
- **Settings Management**: Comprehensive settings panel with multiple sections
- **Order Number Configuration**: Set starting numbers with lockdown after first order
- **Component Inspector**: Advanced development tool with pink/blue component identification
- **Responsive Design**: Works on desktop and mobile devices with consistent styling
=======
```bash
# Start everything locally
npm start

# Or quick start (no prompts)
npm run quick-start
```
>>>>>>> fad21f6192a765b3fb20be0c96ac225a9981b789

## 📚 Documentation

All documentation has been moved to the `docs/` folder:

- **[Main Documentation](./docs/README.md)** - Complete project overview and features
- **[Environment Setup](./docs/ENVIRONMENT_SETUP.md)** - 3-environment deployment setup
- **[Quick Start Guide](./docs/STARTUP_GUIDE.md)** - Detailed startup instructions
- **[Development Roadmap](./docs/UPNEXT.md)** - Upcoming features and priorities
- **[Cashup Implementation](./docs/CASHUP_IMPLEMENTATION_PLAN.md)** - Analytics features plan

<<<<<<< HEAD
### Authentication
- **Vanilla System**: No external authentication dependencies
- **Local Development**: Simplified auth for rapid development
- **Supabase Integration**: Direct database authentication when needed
=======
## 🌐 Access Points
>>>>>>> fad21f6192a765b3fb20be0c96ac225a9981b789

Once running:
- **Admin Dashboard**: http://localhost:5174
- **Mobile App**: http://localhost:5173
- **Database Studio**: http://127.0.0.1:54323

## 📁 Project Structure

```
order-app/
<<<<<<< HEAD
├── apps/
│   ├── admin/           # Admin dashboard (React + Shadcn)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── AdminPage.tsx       # Main dashboard with stats
│   │   │   │   ├── Menu.tsx           # Menu management with inspector
│   │   │   │   ├── MenuBuilder.tsx    # Menu CRUD operations
│   │   │   │   └── Settings.tsx       # App settings & tax toggle
│   │   │   ├── layout/AdminLayout.tsx  # Vanilla layout (no auth)
│   │   │   ├── contexts/InspectContext.tsx # Component inspector state
│   │   │   ├── lib/
│   │   │   │   ├── inspector.tsx      # Component inspection system
│   │   │   │   └── utils.ts           # Utilities
│   │   │   ├── coffee-menu/           # Menu management components
│   │   │   │   ├── components/        # Form, table, multiselect
│   │   │   │   ├── lib/               # Data & storage utilities
│   │   │   │   └── types/             # Menu item types
│   │   │   └── components/ui/         # Shadcn components
│   │   └── package.json
│   └── order-mobile/    # Customer mobile app (Ionic React)
│       ├── src/
│       │   ├── pages/                 # Cart, Menu, Orders, etc.
│       │   │   ├── Menu.tsx          # Menu with size variants & extras
│       │   │   ├── Cart.tsx          # Smart cart with grouping
│       │   │   ├── Checkout.tsx      # Order submission with taxes
│       │   │   ├── Orders.tsx        # Order history with totals
│       │   │   └── OrderDetails.tsx  # Detailed order view
│       │   ├── components/           # Reusable components
│       │   ├── store/               # Zustand state management
│       │   ├── hooks/               # Custom hooks (useSettings, etc.)
│       │   └── auth/                # Vanilla auth utilities
│       └── package.json
├── packages/
│   ├── lib/             # Shared utilities and hooks
│   │   └── src/
│   │       ├── hooks/useRealtimeOrders.ts
│   │       └── supabaseClient.ts
│   └── ui/              # Shared UI components
└── supabase/
    ├── migrations/      # Database schema
    ├── functions/       # Edge functions
    └── seed.sql        # Sample data
```

## 🔄 Real-time Order Flow

1. **Customer** places order via mobile app
2. **Order** appears instantly on admin dashboard
3. **Staff** updates status: Pending → Preparing → Ready
4. **Customer** receives real-time notifications
5. **Staff** marks as collected when picked up

## 🚦 Order Status Workflow

```
Pending → Preparing → Ready → Collected
    ↓         ↓         ↓
 Cancelled  Cancelled    ✓
```

## 🗄 Database Schema

### Tables
- **users**: Customer profiles and preferences
- **menu_items**: Coffee menu with categories, variants, extras, platforms, and tags
- **orders**: Order records with sequential numbering, collection times, and status tracking
- **order_events**: Audit trail for status changes (planned)
- **app_settings**: Application-wide settings (taxes, business hours, order numbering, etc.)

### Key Features
- **Real-time subscriptions** for live updates across admin and mobile
- **Geographic data** for location sharing and pickup coordination
- **JSONB storage** for flexible order items, variants, and extras
- **Sequential Order Numbers**: User-friendly numbering with automatic incrementing
- **Collection Time Tracking**: Estimated and actual ready times for orders
- **Business Hours Management**: Weekly schedules with special date overrides
- **Platform Targeting**: Control menu item visibility across different channels
- **Tags System**: Organize and categorize menu items with visual indicators
- **Row Level Security** for data isolation and security
- **Settings Management**: Database-driven configuration with admin controls

## 🚀 Getting Started

### ⚡ **One Command Startup (Recommended)**
```bash
./start.sh
```

**That's it!** This single command starts everything you need.

### 📋 **Prerequisites**
- Node.js 18+
- npm
- Supabase CLI (`npm install -g supabase`)

### 🔧 **Manual Setup (Alternative)**

**For detailed setup instructions, see [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)**

1. **Clone the repository**
   ```bash
   git clone https://github.com/bucklemeshoe/order-app.git
   cd order-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development environment**
   ```bash
   # Start Supabase (database, API, Studio)
   npm run supabase:local:start
   
   # Reset database with migrations and seed data
   npm run supabase:local:reset
   
   # Start development servers
   npm run dev:admin      # http://localhost:5174
   npm run dev:mobile     # http://localhost:5173
   ```

### Environment Variables (Optional)

The apps work without environment files in local development, but you can add them:

**Admin App** (`apps/admin/.env`):
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

**Mobile App** (`apps/order-mobile/.env`):
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

The anon key is displayed when you run `supabase start`.

### 🗃️ Database Migrations Included

The reset will apply all migrations including:
- **0001-0005**: Core tables and security setup
- **0006-0008**: Menu admin policies and data updates
- **0009-0010**: Size variants support for menu items
- **0011**: Extras column for menu item add-ons
- **0012**: Position ordering for menu display
- **0013-0015**: App settings table for configuration management
- **0016-0017**: Collection time tracking and business hours management
- **0018**: Sequential order numbering system

**⚠️ Important**: Run `npx supabase db reset` to get all the latest V2.0 features including size variants, extras, and configurable taxes.

### Development
=======
├── apps/                 # Main applications
│   ├── admin/           # Admin dashboard
│   └── order-mobile/    # Mobile app
├── packages/            # Shared packages
├── docs/               # Documentation
├── supabase/           # Database & functions
└── tooling/            # Development tools
```

## 🛠 Development
>>>>>>> fad21f6192a765b3fb20be0c96ac225a9981b789

```bash
# Install dependencies
npm install

# Start development
npm start

# Individual services
npm run dev:admin      # Admin dashboard only
npm run dev:mobile     # Mobile app only
```

<<<<<<< HEAD
### Component Inspector (Admin Only)

The admin dashboard includes a powerful **Component Inspector** for development:

1. **Enable Inspector**: Toggle the 👁️ inspector button in the admin UI
2. **Hover Components**: See component tokens with colored outlines
3. **Click to Copy**: Get detailed component information including props, file paths, and usage examples
4. **Color Coding**: 
   - 🔵 Blue = Local components (StatCard, OrderCard, etc.)
   - 🟣 Pink = Design system components (Button, Card, etc.)

See the [Inspector Documentation](apps/admin/src/lib/INSPECTOR_README.md) for installation in other projects.

### Production Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build:admin
npm run build:mobile
```

## 🎨 Design System

### Admin Dashboard
- **Shadcn/ui** components with Tailwind CSS
- **Neutral color palette** with status-specific colors
- **Clean, professional interface** for staff efficiency
- **Responsive design** for various screen sizes

### Mobile App
- **Ionic components** for native feel
- **Coffee shop branding** with warm colors
- **Touch-friendly interface** optimized for mobile
- **Smooth animations** and transitions

## 🔧 Development Features

### Hot Reload
- **Vite HMR** for instant development feedback
- **Real-time Supabase** subscriptions for live data
- **Local development mode** without authentication

### Code Quality
- **TypeScript** for type safety
- **ESLint** for consistent code style
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks

## 🌟 Recent Major Updates

### ✅ V2.5 - Advanced Business Operations (Latest)
- **⏰ Collection Time Management**: Set and track order ready times with countdown timers
- **🏪 Business Hours Control**: Weekly schedules with special date overrides
- **🔒 Emergency Controls**: "Make App Unavailable" toggle with confirmation modals
- **🔢 Sequential Order Numbers**: User-friendly numbering (#1001, #1002) with admin controls
- **🎯 Platform Targeting**: Control menu item visibility (Mobile App, Display Menu, Other)
- **🏷️ Tags System**: Organize menu items with visual tag indicators
- **⚙️ Enhanced Settings**: Multi-section admin panel with lockdown controls
- **📱 Unavailable Detection**: Mobile app detects business hours and shows appropriate modals
- **🔧 Performance Fixes**: Resolved console spam and multiple client instance issues

### ✅ V2.0 - Authentication Removal & Feature Enhancements
- **🔓 Vanilla Authentication**: Completely removed Clerk/JWT dependencies - now runs without external auth
- **📐 Size Variants**: Multiple sizes per menu item with dynamic pricing
- **🍒 Extras System**: Add-ons that group with parent items or standalone ordering
- **🧮 Smart Cart**: Intelligent item grouping with extras integration and composite keys
- **💰 Configurable Taxes**: Admin toggle for system-wide tax display (on/off)
- **📊 Enhanced Orders**: Grouped item display with extras, variants, and accurate totals
- **🔍 Component Inspector**: Advanced development tool with hover tooltips and copy-to-clipboard
- **🏗️ Menu Management**: Full CRUD operations for items, variants, and extras with automatic linking

### ✅ V1.0 - Core System (Previously Completed)
- **Admin dashboard redesign** with Shadcn UI
- **Real-time order management** with status buttons
- **Clean layout structure** with proper background
- **Order status workflow** with visual feedback
- **Responsive design** improvements

### 🔄 Next Phase - Cashup & Analytics
- **End-of-Day Cashup**: Comprehensive daily reporting with customer details
- **Product Sales Analytics**: Aggregated sales data by item and category
- **Collection Time Analytics**: Average collection times and performance metrics
- **Revenue Reporting**: Daily turnover with tax breakdown and cancellation tracking
- **Popular Items Dashboard**: Best-selling products and trending analysis
- **Customer Data Enhancement**: Name collection and order history tracking

**📋 See [UPNEXT.md](./UPNEXT.md) for detailed implementation roadmap and current sprint priorities.**

## 🚀 Deployment

### Mobile App
```bash
# Build for iOS
npx cap build ios

# Build for Android  
npx cap build android
```

### Admin Dashboard
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variables in hosting platform
- Connect to production Supabase instance

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes and test thoroughly
3. Create pull request with description
4. Ensure all checks pass

### Branch Strategy
- **main**: Production-ready code
- **v0-admin-styling**: Clean branch for V0 design work
- **feature/***: New features and improvements

## 📱 Mobile Features

### Current V2.5 Features
- **Size Selection**: Choose from multiple sizes with dynamic pricing
- **Extras Integration**: Add extras that group with items or order standalone
- **Smart Cart**: Intelligent grouping prevents duplicate items with same config
- **Sequential Order Numbers**: User-friendly order numbering (#1001, #1002, etc.)
- **Collection Time Notifications**: "Ready for collection in X minutes" alerts
- **Business Hours Awareness**: Automatic unavailability outside operating hours
- **Unavailable Modal**: Dismissible popup when ordering outside hours
- **Conditional Taxes**: Tax display controlled by admin settings
- **Order Tracking**: Real-time status updates with collection time estimates
- **Vanilla Auth**: No external authentication dependencies
- **Location Sharing**: Optional location services for pickup coordination

### Legacy Features (V1.0)
- Order placement and tracking
- Cart management with quantity controls
- Order history and details

### Planned Enhancements
- **Customer Name Collection**: Enhanced checkout with customer details
- **Cashup Integration**: End-of-day reporting with customer order data
- **Push Notifications**: Rich content notifications with collection time updates
- **Offline Ordering**: Capabilities for areas with poor connectivity
- **Payment Integration**: Apple Pay / Google Pay support
- **Advanced Location Features**: Enhanced pickup coordination

## 🔐 Security

- **Row Level Security** on all database tables
- **Vanilla authentication** with local development focus
- **API key protection** for Supabase
- **HTTPS-only** in production
- **Database-level permissions** for data isolation

## 📄 License

This project is private and proprietary to Order App.

## 🆘 Support

For questions or issues:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include steps to reproduce any bugs

## 🏆 Technical Achievements

### V2.5 Architecture Improvements
- **⏰ Business Operations**: Complete business hours management with special date overrides
- **🔢 Sequential Systems**: User-friendly order numbering with admin controls and lockdown
- **🎯 Advanced Targeting**: Platform-specific menu visibility with tag organization
- **⚡ Performance Engineering**: Resolved console spam and optimized client instances
- **🔒 Enhanced Controls**: Emergency toggles with confirmation modals and safety measures
- **📊 Real-time Analytics**: Collection time tracking with countdown timers and notifications
- **🧩 Smart Data Modeling**: JSONB-based variants, extras, and platform targeting
- **🔧 Developer Experience**: Component inspector with pink/blue identification system

### Database Engineering
- **Flexible Schema**: JSONB columns for variants/extras with PostgreSQL performance
- **Real-time Subscriptions**: Supabase integration for live order updates
- **Migration Management**: Incremental schema updates with rollback support
- **Security First**: Row-level security with proper data isolation

### Frontend Innovation
- **State Management**: Zustand for predictable cart and order state
- **Component Architecture**: Reusable components with inspection capabilities
- **Performance**: Optimized bundle sizes and lazy loading
- **Accessibility**: WCAG-compliant interfaces throughout

---

**Built with ❤️ for the coffee community - Now Vanilla & More Powerful Than Ever! ☕✨**
=======
For detailed setup and development instructions, see [docs/STARTUP_GUIDE.md](./docs/STARTUP_GUIDE.md).
>>>>>>> fad21f6192a765b3fb20be0c96ac225a9981b789
