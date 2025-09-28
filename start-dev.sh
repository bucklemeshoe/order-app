#!/bin/bash

# Order App - Complete Local Development Startup Script
# This script starts all services needed for local development

set -e  # Exit on any error

echo "🚀 Starting Order App Local Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "supabase" ]; then
    print_error "Please run this script from the order-app root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it with: npm install -g supabase"
    exit 1
fi

print_success "All prerequisites are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install --legacy-peer-deps
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Stop any existing Supabase instances
print_status "Stopping any existing Supabase instances..."
supabase stop --ignore-errors 2>/dev/null || true

# Start Supabase local development environment
print_status "Starting Supabase local database..."
supabase start

print_success "Supabase is running!"
echo ""
echo "📊 Database Services:"
echo "  • Supabase Studio: http://127.0.0.1:54323"
echo "  • API URL: http://127.0.0.1:54321"
echo "  • Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo "  • Email Testing: http://127.0.0.1:54324"
echo ""

# Get the anon key for display
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
if [ ! -z "$ANON_KEY" ]; then
    echo "🔑 Anonymous Key: $ANON_KEY"
    echo ""
fi

print_status "Opening Supabase Studio in your browser..."
open http://127.0.0.1:54323 2>/dev/null || print_warning "Could not auto-open browser. Please visit http://127.0.0.1:54323"

echo ""
print_status "Starting development servers..."

# Function to start dev servers in background
start_dev_servers() {
    print_status "Starting Admin Dashboard (http://localhost:5174)..."
    npm run dev:admin &
    ADMIN_PID=$!
    
    print_status "Starting Mobile App (http://localhost:5173)..."
    npm run dev:mobile &
    MOBILE_PID=$!
    
    echo ""
    print_success "Development servers started!"
    echo ""
    echo "🌐 Applications:"
    echo "  • Admin Dashboard: http://localhost:5174"
    echo "  • Mobile App: http://localhost:5173"
    echo ""
    echo "📊 Database Management:"
    echo "  • Supabase Studio: http://127.0.0.1:54323"
    echo ""
    
    # Save PIDs for cleanup
    echo $ADMIN_PID > .admin.pid
    echo $MOBILE_PID > .mobile.pid
    
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for interrupt
    trap cleanup EXIT
    wait
}

# Cleanup function
cleanup() {
    print_status "Stopping development servers..."
    
    if [ -f ".admin.pid" ]; then
        ADMIN_PID=$(cat .admin.pid)
        kill $ADMIN_PID 2>/dev/null || true
        rm .admin.pid
    fi
    
    if [ -f ".mobile.pid" ]; then
        MOBILE_PID=$(cat .mobile.pid)
        kill $MOBILE_PID 2>/dev/null || true
        rm .mobile.pid
    fi
    
    print_status "Stopping Supabase..."
    supabase stop
    
    print_success "All services stopped. Goodbye! 👋"
}

# Ask user if they want to start dev servers
echo "Would you like to start the development servers (Admin + Mobile)? [y/N]"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    start_dev_servers
else
    print_success "Supabase is running. You can start dev servers manually with:"
    echo "  npm run dev:admin    # Admin Dashboard"
    echo "  npm run dev:mobile   # Mobile App"
    echo ""
    print_status "To stop Supabase later, run: supabase stop"
fi
