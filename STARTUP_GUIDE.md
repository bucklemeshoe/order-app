# 🚀 Order App - Quick Startup Guide

## ⚡ **One Command Startup (Recommended)**

```bash
./start.sh
```

That's it! This single command will:
- ✅ Install dependencies
- ✅ Start Supabase local environment
- ✅ Reset database with all migrations
- ✅ Launch both admin dashboard and mobile app
- ✅ Show you all the URLs

## 📍 **What You'll Get:**

- **📊 Admin Dashboard**: http://localhost:5174
- **📱 Mobile App**: http://localhost:5173  
- **🗄️ Supabase Studio**: http://localhost:54323
- **📧 Email Testing**: http://localhost:54324

## 🛑 **To Stop Everything:**
Press `Ctrl+C` in the terminal where you ran `./start.sh`

---

## 🔧 **Manual Setup (Alternative)**

If you prefer to run commands manually:

### **1. Prerequisites**
```bash
# Install Node.js 18+ from https://nodejs.org/
# Install Supabase CLI
npm install -g supabase
```

### **2. Clone & Setup**
```bash
git clone https://github.com/bucklemeshoe/order-app.git
cd order-app
npm install
```

### **3. Start Development Environment**
```bash
# Start Supabase
npm run supabase:local:start

# Reset database (first time or when needed)
npm run supabase:local:reset

# Start apps (in separate terminals)
npm run dev:admin      # Terminal 1
npm run dev:mobile     # Terminal 2
```

---

## 🎯 **Quick Commands Reference**

| Command | Description |
|---------|-------------|
| `./start.sh` | **One command startup** (recommended) |
| `npm run dev:admin` | Start admin dashboard only |
| `npm run dev:mobile` | Start mobile app only |
| `npm run dev` | Start both apps (if configured) |
| `npm run supabase:local:start` | Start Supabase services |
| `npm run supabase:local:reset` | Reset database with migrations |
| `npm run supabase:local:stop` | Stop Supabase services |

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill processes on ports 5173, 5174, 54321-54324
lsof -ti:5173,5174,54321,54322,54323,54324 | xargs kill -9
```

### **Supabase Issues**
```bash
# Stop and restart Supabase
supabase stop
supabase start
```

### **Database Issues**
```bash
# Reset everything
supabase db reset
```

### **Permission Issues (macOS/Linux)**
```bash
# Make script executable
chmod +x start.sh
```

---

## 📱 **Testing the Apps**

### **Admin Dashboard (http://localhost:5174)**
- View real-time orders
- Manage menu items
- Configure settings
- Test order status updates

### **Mobile App (http://localhost:5173)**
- Browse menu with size variants
- Add items to cart
- Place test orders
- View order history

### **Supabase Studio (http://localhost:54323)**
- View database tables
- Check migrations
- Monitor real-time subscriptions
- Test database queries

---

## 🎨 **Development Features**

### **Component Inspector (Admin Only)**
- Toggle the 👁️ inspector button in admin UI
- Hover over components to see details
- Click to copy component information
- Blue = Local components, Pink = Design system

### **Real-time Features**
- Orders appear instantly across both apps
- Status updates sync in real-time
- Collection time notifications
- Business hours awareness

---

## 📚 **Next Steps**

1. **Explore the apps** - Test the ordering flow
2. **Check the documentation** - README.md, UPNEXT.md
3. **Review the codebase** - Familiarize yourself with the structure
4. **Start developing** - Ready for Cashup & Analytics phase

---

## 🆘 **Need Help?**

- **Documentation**: Check `README.md` for comprehensive details
- **Roadmap**: See `UPNEXT.md` for development priorities
- **Issues**: Create GitHub issues for bugs or questions
- **Database**: Use Supabase Studio for database management

---

**Happy coding! ☕✨**
