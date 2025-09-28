/**
 * Design System Color Tokens
 * Using OKLCH color space for modern, perceptually uniform colors
 */

export const colors = {
  // Base colors
  background: 'oklch(1 0 0)',          // Pure white
  foreground: 'oklch(0.145 0 0)',      // Very dark gray
  
  // Primary colors (dark gray for text/buttons)
  primary: 'oklch(0.205 0 0)',         // Dark gray
  primaryForeground: 'oklch(0.985 0 0)', // Near white
  
  // Secondary colors (light surfaces)
  secondary: 'oklch(0.97 0 0)',        // Very light gray
  
  // Muted colors (subtle backgrounds and text)
  muted: 'oklch(0.98 0 0)',           // Subtle background
  mutedForeground: 'oklch(0.45 0 0)',  // Muted text
  
  // Interactive colors
  accent: 'oklch(0.92 0 0)',          // Light accent background
  accentForeground: 'oklch(0.145 0 0)', // Dark accent text
  
  // Border and input colors
  border: 'oklch(0.9 0 0)',           // Light border
  input: 'oklch(0.9 0 0)',            // Input background
  ring: 'oklch(0.708 0 0)',           // Focus ring
  
  // Popover colors
  popover: 'oklch(1 0 0)',            // White popover background
  popoverForeground: 'oklch(0.145 0 0)', // Dark popover text
  
  // Status colors
  destructive: '#dc2626',              // Red for destructive actions
} as const

export type ColorToken = keyof typeof colors
