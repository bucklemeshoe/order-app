#!/bin/bash

# Deploy to Staging Environment
# Pushes develop branch to trigger Vercel staging deployment

set -e

echo "🚀 Deploying to Staging Environment"
echo "=================================="

# Check if we're on develop branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "❌ Error: You must be on the 'develop' branch to deploy to staging"
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

# Push to origin develop
echo "📤 Pushing to origin/develop..."
git push origin develop

echo ""
echo "✅ Staging deployment triggered!"
echo "🌐 Staging URL: https://staging-order-app.vercel.app"
echo "⏱️  Deployment usually takes 2-3 minutes"
echo ""
echo "📊 Check deployment status at: https://vercel.com/dashboard"
