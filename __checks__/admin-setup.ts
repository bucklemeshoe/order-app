// Admin App Setup Script for Checkly
import { expect } from '@playwright/test'

export default async function (page: any) {
  // Set up environment variables for admin checks
  const adminUrl = process.env.ADMIN_URL || 'https://order-app-admin.vercel.app'
  
  // Verify admin app is accessible
  await page.goto(adminUrl)
  await expect(page).toHaveTitle(/Admin|Order/)
  
  // Check for basic admin functionality
  const loginButton = page.locator('button, a').filter({ hasText: /login|sign in/i })
  await expect(loginButton).toBeVisible()
}
