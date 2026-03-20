# 🍔 O.App - Commission-Free Ordering Platform

Welcome to **O.App**, a premium, commission-free online ordering platform! This application is designed to empower local business owners (takeaway shops, cafés, bakeries, and meal prep brands) to take back control of their digital storefront and customer relationships.

Whether you're a technically savvy business owner or a freelance developer hired to customize this platform, this guide will get you up and running quickly and confidently.

---

## ✨ Features & Architecture

- **High-Converting Landing Page**: A beautifully designed, built-in marketing site (`/`) optimized to sell the platform to business owners.
- **Zero Commissions**: You own the application. No more giving away 30% of your hard-earned revenue to third-party delivery apps.
- **Customer Ordering App (`/order`)**: A lightning-fast, mobile-first menu that makes ordering effortless. Customers can save it to their home screen as a PWA.
- **Real-Time Admin Dashboard (`/admin`)**: Hear a ping and see orders arrive instantly with live updates. Manage menu items, view incoming orders, and track fulfillment without ever refreshing the page.
- **Local Payments**: Built-in support for SnapScan and Yoco payments (South Africa's favorites).
- **Delivery & Collection**: Offer both options and set custom delivery fees based on areas.
- **Easy Customization**: Change colors, logos, and images to perfectly match your brand aesthetic.
- **Secure & Fast**: Built with modern, enterprise-grade web technology ensuring snappy loading and secure transactions.

---

## 🛠️ For the Developer / Tech-Savvy Owner

This project uses a modern, robust tech stack designed to handle scale while remaining easy to deploy:
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v4, shadcn/ui, framer-motion concepts
- **Backend & Database**: Supabase (Postgres Database, Authentication, Real-time WebSockets, Row Level Security)
- **State Management**: Zustand (for a snappy, reliable shopping cart experience)

### 🚀 Quick Start Guide

**Prerequisites:**
1. [Node.js](https://nodejs.org/) installed
2. [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running (required for local Supabase backend)
3. [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) installed globally (`npm install -g supabase`)

**1. Start the Local Backend Engine**
```bash
npx supabase start
```
*This spins up a local instance of the database and secure authentication system so you can test safely on your computer without affecting live data.*

**2. Install Dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Start the Development Server**
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) to view the **Marketing Landing Page**.
- Open [http://localhost:3000/order](http://localhost:3000/order) to view the **Customer Ordering App**.
- Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the **Business Admin Dashboard**.

---

## 🎨 Customizing Your Brand

Making this app yours is incredibly straightforward:

1. **Images & Visuals**: Replace the images inside the `public/images/` folder with your own high-quality photos (e.g., `hero-banner.png`, `default-product.png`). The app will automatically use them!
2. **Colors & Styling**: Update the CSS variables in `styles/globals.css` or your theme configurations to match your brand colors. We recommend using warm, appetizing colors for food businesses.
3. **App Name & SEO**: Update the `public/manifest.json` and the metadata inside `app/layout.tsx` to reflect your business's true name. This ensures it looks perfect when customers install the app on their phones.

---

## 📂 Project Structure

Navigating the codebase is simple:

```
order-app/
├── app/           # The pages. 
│   ├── page.tsx   # Marketing Landing Page
│   ├── order/     # Customer Ordering App
│   ├── admin/     # Admin Dashboard & Settings
│   └── auth/      # Authentication routes
├── components/    # Reusable UI pieces (buttons, product cards, banners)
├── lib/           # Database connection and helper functions
├── public/        # Where your static images, icons, and logos live
├── styles/        # Global CSS and design system
├── store/         # Shopping cart memory (Zustand)
└── supabase/      # Database structure, migrations, and secure rules
```

---

## 🚀 Going Live (Deployment)

When you are ready to launch to real customers:

1. **Backend Configuration**: Create a free project on [Supabase.com](https://supabase.com). Link your local project to your live project and push the database schema using `npx supabase db push`.
2. **Frontend Hosting**: Connect your GitHub repository to **Netlify** or **Vercel** for automatic deployments. The repository is perfectly configured for Netlify out of the box (`netlify.toml` and `.npmrc` are included to handle dependencies).
3. **Environment Variables**: Make sure to copy the live API keys from your Supabase dashboard into your Netlify/Vercel environment variables settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---
*Built to empower local commerce.* 🚀