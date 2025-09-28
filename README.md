# Order App

A modern, real-time coffee ordering and management system built with React, TypeScript, and Supabase.

## 🚀 Quick Start

```bash
# Start everything locally
npm start

# Or quick start (no prompts)
npm run quick-start
```

## 📚 Documentation

All documentation has been moved to the `docs/` folder:

- **[Main Documentation](./docs/README.md)** - Complete project overview and features
- **[Quick Start Guide](./docs/STARTUP_GUIDE.md)** - Detailed startup instructions
- **[Development Roadmap](./docs/UPNEXT.md)** - Upcoming features and priorities
- **[Cashup Implementation](./docs/CASHUP_IMPLEMENTATION_PLAN.md)** - Analytics features plan

## 🌐 Access Points

Once running:
- **Admin Dashboard**: http://localhost:5174
- **Mobile App**: http://localhost:5173
- **Database Studio**: http://127.0.0.1:54323

## 📁 Project Structure

```
order-app/
├── apps/                 # Main applications
│   ├── admin/           # Admin dashboard
│   └── order-mobile/    # Mobile app
├── packages/            # Shared packages
├── docs/               # Documentation
├── supabase/           # Database & functions
└── tooling/            # Development tools
```

## 🛠 Development

```bash
# Install dependencies
npm install

# Start development
npm start

# Individual services
npm run dev:admin      # Admin dashboard only
npm run dev:mobile     # Mobile app only
```

For detailed setup and development instructions, see [docs/STARTUP_GUIDE.md](./docs/STARTUP_GUIDE.md).
