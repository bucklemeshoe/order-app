#!/bin/bash

# Deploy to Production Environment
# Merges develop into main and pushes to trigger Vercel production deployment

set -e

echo "🚀 Deploying to Production Environment"
echo "====================================="

# Check if we're on develop branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "❌ Error: You must be on the 'develop' branch to deploy to production"
    echo "Current branch: $current_branch"
    echo "Please run: git checkout develop"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit or stash your changes first"
    git status --short
    exit 1
fi

# Confirm production deployment
echo "⚠️  You are about to deploy to PRODUCTION"
echo "This will merge develop → main and deploy live to customers"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

# Switch to main and merge develop
echo "🔄 Switching to main branch..."
git checkout main

echo "🔀 Merging develop into main..."
git merge develop --no-ff -m "Deploy to production: $(date)"

echo "📤 Pushing to origin/main..."
git push origin main

echo ""
echo "✅ Production deployment triggered!"
echo "🌐 Production URL: https://order-app.vercel.app"
echo "⏱️  Deployment usually takes 2-3 minutes"
echo ""
echo "📊 Check deployment status at: https://vercel.com/dashboard"
echo ""
echo "🔄 Switching back to develop branch..."
git checkout develop

echo "🎉 Production deployment complete!"
