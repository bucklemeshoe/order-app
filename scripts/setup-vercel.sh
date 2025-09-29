#!/bin/bash

# Vercel CLI Setup Script for Order App
# This script sets up both admin and mobile apps on Vercel

set -e

echo "🚀 Vercel CLI Setup for Order App"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel@latest"
    exit 1
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    print_error "You are not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

print_status "Vercel CLI is installed and you are logged in as: $(vercel whoami)"
echo ""

# Get project names
echo "Let's set up your Vercel projects. I recommend these names:"
echo "• Admin Dashboard: order-app-admin"
echo "• Mobile App: order-app-mobile"
echo ""

read -p "Enter name for Admin Dashboard project (default: order-app-admin): " ADMIN_PROJECT_NAME
ADMIN_PROJECT_NAME=${ADMIN_PROJECT_NAME:-order-app-admin}

read -p "Enter name for Mobile App project (default: order-app-mobile): " MOBILE_PROJECT_NAME
MOBILE_PROJECT_NAME=${MOBILE_PROJECT_NAME:-order-app-mobile}

echo ""
print_status "Setting up Admin Dashboard project: $ADMIN_PROJECT_NAME"
echo ""

# Setup Admin Dashboard
cd apps/admin

print_status "Initializing Vercel project for Admin Dashboard..."
vercel link --yes --name "$ADMIN_PROJECT_NAME"

print_status "Adding environment variables for Admin Dashboard..."

# Add environment variables for staging
vercel env add VITE_SUPABASE_URL staging <<< "https://sijxvaxilurrdutisvyy.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY staging <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ"
vercel env add VITE_ENV staging <<< "staging"

# Add environment variables for production
vercel env add VITE_SUPABASE_URL production <<< "https://sijxvaxilurrdutisvyy.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ"
vercel env add VITE_ENV production <<< "production"

print_success "Admin Dashboard Vercel project configured!"

# Go back to root and setup Mobile App
cd ../order-mobile

echo ""
print_status "Setting up Mobile App project: $MOBILE_PROJECT_NAME"
echo ""

print_status "Initializing Vercel project for Mobile App..."
vercel link --yes --name "$MOBILE_PROJECT_NAME"

print_status "Adding environment variables for Mobile App..."

# Add environment variables for staging
vercel env add VITE_SUPABASE_URL staging <<< "https://sijxvaxilurrdutisvyy.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY staging <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ"
vercel env add VITE_ENV staging <<< "staging"

# Add environment variables for production
vercel env add VITE_SUPABASE_URL production <<< "https://sijxvaxilurrdutisvyy.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ"
vercel env add VITE_ENV production <<< "production"

print_success "Mobile App Vercel project configured!"

# Go back to root
cd ../..

echo ""
print_success "Vercel setup complete! 🎉"
echo ""
echo "📊 Project Summary:"
echo "  • Admin Dashboard: $ADMIN_PROJECT_NAME"
echo "  • Mobile App: $MOBILE_PROJECT_NAME"
echo ""
echo "🚀 Next steps:"
echo "  1. Deploy to staging: npm run deploy:staging"
echo "  2. Deploy to production: npm run deploy:production"
echo "  3. Check deployments: vercel ls"
echo ""
echo "🌐 Your apps will be available at:"
echo "  • Staging: https://$ADMIN_PROJECT_NAME-git-develop-[team].vercel.app"
echo "  • Production: https://$ADMIN_PROJECT_NAME.vercel.app"
echo ""
print_status "Ready to deploy! 🚀"
