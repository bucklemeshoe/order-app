#!/bin/bash

# Order App - One Command Startup Script
# This script starts Supabase, resets the database, and launches both apps

echo "🚀 Starting Order App Development Environment..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️ Starting Supabase local environment..."
supabase start

echo ""
echo "🔄 Resetting database with migrations and seed data..."
supabase db reset

echo ""
echo "🎯 Starting development servers..."
echo "   📊 Admin Dashboard: http://localhost:5174"
echo "   📱 Mobile App: http://localhost:5173"
echo "   🗄️ Supabase Studio: http://localhost:54323"
echo ""

# Start both apps in background
echo "Starting apps..."
npm run dev:admin &
ADMIN_PID=$!

npm run dev:mobile &
MOBILE_PID=$!

echo ""
echo "✅ Order App is now running!"
echo "   Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $ADMIN_PID 2>/dev/null
    kill $MOBILE_PID 2>/dev/null
    echo "✅ Services stopped."
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
