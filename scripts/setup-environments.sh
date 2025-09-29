#!/bin/bash

# Setup Environment Variables Script
# This script helps you set up the 3-environment configuration

set -e

echo "🔧 Order App - Environment Setup"
echo "==============================="
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

echo "This script will help you set up your 3-environment configuration:"
echo "1. Local Development (localhost)"
echo "2. Staging (Vercel Preview)"  
echo "3. Production (Vercel Production)"
echo ""

# Step 1: Get Supabase credentials
print_status "Step 1: Get Supabase credentials"
echo ""
echo "To get your Supabase credentials:"
echo "1. Go to: https://supabase.com/dashboard/project/sijxvaxilurrdutisvyy/settings/api"
echo "2. Copy the 'Project URL' and 'anon public' key"
echo ""

read -p "Enter your Supabase Project URL (https://sijxvaxilurrdutisvyy.supabase.co): " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    print_error "Both Supabase URL and Anon Key are required"
    exit 1
fi

print_success "Supabase credentials received"

# Step 2: Create environment files
print_status "Step 2: Creating environment files"

# Admin app environments
mkdir -p apps/admin

# Local environment
cat > apps/admin/.env.local << EOF
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_ENV=local
EOF

# Staging environment
cat > apps/admin/.env.staging << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_ENV=staging
EOF

# Production environment
cat > apps/admin/.env.production << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_ENV=production
EOF

# Mobile app environments
mkdir -p apps/order-mobile

# Local environment
cat > apps/order-mobile/.env.local << EOF
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_ENV=local
EOF

# Staging environment
cat > apps/order-mobile/.env.staging << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_ENV=staging
EOF

# Production environment
cat > apps/order-mobile/.env.production << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_ENV=production
EOF

print_success "Environment files created"

# Step 3: Link Supabase project
print_status "Step 3: Linking Supabase project"
echo ""
echo "Now we'll link your local project to Supabase cloud..."
echo "You'll need to enter your Supabase database password"
echo ""

read -p "Do you want to link to Supabase cloud now? (y/n): " link_choice

if [ "$link_choice" = "y" ] || [ "$link_choice" = "Y" ]; then
    supabase link --project-ref sijxvaxilurrdutisvyy
    print_success "Supabase project linked"
else
    print_warning "Skipping Supabase link. You can run 'supabase link --project-ref sijxvaxilurrdutisvyy' later"
fi

# Step 4: Summary
echo ""
print_success "Environment setup complete!"
echo ""
echo "📁 Environment files created:"
echo "  • apps/admin/.env.local"
echo "  • apps/admin/.env.staging"
echo "  • apps/admin/.env.production"
echo "  • apps/order-mobile/.env.local"
echo "  • apps/order-mobile/.env.staging"
echo "  • apps/order-mobile/.env.production"
echo ""
echo "🚀 Next steps:"
echo "  1. Set up Vercel deployment (see docs/DEPLOYMENT_GUIDE.md)"
echo "  2. Add environment variables to Vercel dashboard"
echo "  3. Test local development: npm start"
echo "  4. Deploy to staging: npm run deploy:staging"
echo ""
echo "📚 Documentation:"
echo "  • docs/DEPLOYMENT_GUIDE.md - Complete deployment guide"
echo "  • docs/STARTUP_GUIDE.md - Local development setup"
echo ""
print_success "Setup complete! 🎉"
