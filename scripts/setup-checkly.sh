#!/bin/bash

# Setup Checkly Environment Script
# This script helps you set up Checkly environment variables locally

echo "🔧 Setting up Checkly environment variables..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.checkly already exists
if [ -f ".env.checkly" ]; then
    echo -e "${YELLOW}⚠️ .env.checkly already exists${NC}"
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy the example file
echo "📋 Copying example environment file..."
cp checkly.env.local.example .env.checkly

echo ""
echo -e "${GREEN}✅ Created .env.checkly file${NC}"
echo ""
echo "🔧 Next steps:"
echo "1. Edit .env.checkly with your actual values:"
echo "   - Get your Checkly API key from https://app.checklyhq.com"
echo "   - Update URLs to match your local setup"
echo "   - Update Supabase keys to match your local Supabase"
echo ""
echo "2. Test the setup:"
echo "   npm run health:check"
echo ""
echo "3. Deploy checks to Checkly:"
echo "   npm run health:deploy"
echo ""
echo "📝 Example values to update:"
echo "   CHECKLY_API_KEY=your-actual-api-key"
echo "   ADMIN_URL=http://localhost:5173"
echo "   MOBILE_URL=http://localhost:5174"
echo "   SUPABASE_URL=http://localhost:54321"
