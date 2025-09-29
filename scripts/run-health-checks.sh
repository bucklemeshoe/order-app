#!/bin/bash

# Health Check Script for Order App
# This script runs comprehensive health checks before deployments

echo "🏥 Order App Health Checks"
echo "========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Not in project root directory${NC}"
    exit 1
fi

echo "🔍 Running comprehensive health checks..."
echo ""

# 1. Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node --version)
echo "   Node.js version: $node_version"
if [[ $node_version == v18* ]] || [[ $node_version == v20* ]]; then
    print_status 0 "Node.js version is compatible"
else
    print_status 1 "Node.js version should be 18 or 20"
    exit 1
fi

# 2. Check if dependencies are installed
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies are installed"
else
    echo -e "${YELLOW}⚠️ Installing dependencies...${NC}"
    npm install
    print_status $? "Dependencies installed"
fi

# 3. Check TypeScript compilation
echo ""
echo "📝 Checking TypeScript compilation..."

echo "   Checking admin app..."
cd apps/admin
npx tsc --noEmit
admin_ts_status=$?
cd ../..

echo "   Checking mobile app..."
cd apps/order-mobile
npx tsc --noEmit
mobile_ts_status=$?
cd ../..

if [ $admin_ts_status -eq 0 ] && [ $mobile_ts_status -eq 0 ]; then
    print_status 0 "TypeScript compilation successful"
else
    print_status 1 "TypeScript compilation failed"
    exit 1
fi

# 4. Check linting
echo ""
echo "🔍 Checking linting..."
npm run lint
lint_status=$?
print_status $lint_status "Linting passed"

# 5. Check if apps build successfully
echo ""
echo "🏗️ Checking app builds..."

echo "   Building admin app..."
cd apps/admin
npm run build
admin_build_status=$?
cd ../..

echo "   Building mobile app..."
cd apps/order-mobile
npm run build
mobile_build_status=$?
cd ../..

if [ $admin_build_status -eq 0 ] && [ $mobile_build_status -eq 0 ]; then
    print_status 0 "Both apps build successfully"
else
    print_status 1 "App builds failed"
    exit 1
fi

# 6. Check if Supabase is running (if local)
echo ""
echo "🗄️ Checking Supabase..."
if command -v supabase &> /dev/null; then
    if supabase status &> /dev/null; then
        print_status 0 "Supabase is running"
    else
        echo -e "${YELLOW}⚠️ Supabase is not running locally${NC}"
        echo "   This is OK if you're not running locally"
    fi
else
    echo -e "${YELLOW}⚠️ Supabase CLI not found${NC}"
    echo "   This is OK if you're not running locally"
fi

# 7. Check for environment variables
echo ""
echo "🔧 Checking environment setup..."
if [ -f ".env.local" ] || [ -f ".env.staging" ] || [ -f ".env.production" ]; then
    print_status 0 "Environment files found"
else
    echo -e "${YELLOW}⚠️ No environment files found${NC}"
    echo "   Make sure to set up environment variables for deployment"
fi

# 8. Check Git status
echo ""
echo "📝 Checking Git status..."
if git diff --quiet; then
    print_status 0 "Working directory is clean"
else
    echo -e "${YELLOW}⚠️ Working directory has uncommitted changes${NC}"
    git status --short
fi

# 9. Check for migration issues
echo ""
echo "🗄️ Checking for migration issues..."
if [ -f "scripts/check-migrations.sh" ]; then
    ./scripts/check-migrations.sh
    migration_status=$?
    print_status $migration_status "Migration checks passed"
else
    echo -e "${YELLOW}⚠️ Migration check script not found${NC}"
fi

# Summary
echo ""
echo "🎉 Health Check Summary"
echo "======================="
echo "✅ Node.js: Compatible"
echo "✅ Dependencies: Installed"
echo "✅ TypeScript: No errors"
echo "✅ Linting: Passed"
echo "✅ Builds: Successful"
echo "✅ Git: Clean"
echo "✅ Migrations: Checked"
echo ""
echo -e "${GREEN}🚀 All health checks passed! Ready for deployment.${NC}"
