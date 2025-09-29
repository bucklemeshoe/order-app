# Order App Design System Reference

## Overview

**Unified Design System Package**: `@order-app/design-system`

- **Tailwind CSS v4** with custom theme configuration
- **OKLCH color space** for modern, perceptually uniform colors
- **47 production-ready components** with consistent styling
- **Semantic CSS variables** for theming
- **Type-safe component variants** using CVA (Class Variance Authority)

## Installation & Usage

```tsx
// Import components from the unified design system
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Dialog,
  // ... any component
} from '@order-app/design-system'

// Import the CSS (once in your app)
import '@order-app/design-system/index.css'
```

## Color System (OKLCH Variables)

```css
:root {
  --background: oklch(1 0 0);              /* Pure white */
  --foreground: oklch(0.145 0 0);          /* Very dark gray */
  --primary: oklch(0.205 0 0);             /* Dark gray for buttons/text */
  --primary-foreground: oklch(0.985 0 0);  /* Near white */
  --secondary: oklch(0.97 0 0);            /* Very light gray */
  --muted: oklch(0.98 0 0);               /* Subtle background */
  --muted-foreground: oklch(0.45 0 0);     /* Muted text */
  --destructive: #dc2626;                  /* Red for errors */
  --border: oklch(0.9 0 0);               /* Light borders */
  --input: oklch(0.9 0 0);                /* Input backgrounds */
  --ring: oklch(0.708 0 0);               /* Focus rings */
  --popover: oklch(1 0 0);                /* Popover background */
  --popover-foreground: oklch(0.145 0 0);  /* Popover text */
  --accent: oklch(0.92 0 0);              /* Accent background */
  --accent-foreground: oklch(0.145 0 0);   /* Accent text */
}
```

## Design Tokens & Style Patterns

### Interactive States

#### Hover Effects
- **Primary Hover**: `hover:bg-primary/90` - Used in Button (default), primary actions
- **Accent Hover**: `hover:bg-accent hover:text-accent-foreground` - Used in Button (outline), Dropdown items, Select items
- **Muted Hover**: `hover:bg-muted/50` - Used in Table rows, subtle interactions
- **Secondary Hover**: `hover:bg-secondary/80` - Used in Button (secondary)
- **Destructive Hover**: `hover:bg-destructive/90` - Used in Button (destructive), danger actions
- **Ghost Hover**: `hover:bg-accent/50` - Used in Button (ghost), minimal interactions

#### Focus States
- **Ring Focus**: `focus-visible:ring-ring/50 focus-visible:ring-[3px]` - Standard focus ring
- **Border Focus**: `focus-visible:border-ring` - Input and form element focus
- **Outline Focus**: `focus-visible:outline-hidden` - Remove default outline
- **Compound Focus**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` - Enhanced focus

#### Disabled States
- **Standard Disabled**: `disabled:pointer-events-none disabled:opacity-50` - Universal disabled state
- **Cursor Disabled**: `disabled:cursor-not-allowed disabled:opacity-50` - Form elements
- **Data Disabled**: `data-[disabled]:pointer-events-none data-[disabled]:opacity-50` - Radix components

### Typography Patterns

#### Heading Styles
- **Page Title**: `text-lg font-semibold tracking-tight` - Main page headings
- **Section Title**: `text-base font-semibold tracking-tight` - Section headings
- **Card Title**: `leading-none font-semibold` - Card component titles
- **Dialog Title**: `text-lg font-semibold leading-none tracking-tight` - Modal titles

#### Body Text
- **Primary Text**: `text-foreground` - Main content text
- **Muted Text**: `text-muted-foreground` - Secondary content
- **Description Text**: `text-sm text-muted-foreground` - Helper descriptions
- **Caption Text**: `text-xs text-muted-foreground` - Small labels and captions

#### Label Styles
- **Form Label**: `text-sm font-medium leading-none` - Input labels
- **Menu Label**: `px-2 py-1.5 text-sm font-semibold` - Dropdown menu sections
- **Badge Text**: `text-xs font-medium` - Badge content

### Layout Patterns

#### Container Systems
- **Page Container**: `mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8` - Main page wrapper
- **Content Container**: `mx-auto max-w-6xl p-4 sm:p-6` - Content sections
- **Card Container**: `bg-white text-gray-900 flex flex-col gap-6 rounded-xl border py-6 shadow-sm` - Card wrapper

#### Grid Systems
- **Responsive Grid**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` - Adaptive columns
- **Dashboard Grid**: `grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6` - Stats layout
- **Form Grid**: `grid items-end gap-3 rounded-md border p-3 sm:grid-cols-[1fr,1fr,auto]` - Form sections

#### Flexbox Arrangements
- **Header Layout**: `flex items-center justify-between` - Navigation headers
- **Button Group**: `flex gap-2` - Action button groups
- **Vertical Stack**: `flex flex-col gap-4` - Vertical content flow
- **Center Layout**: `flex items-center justify-center` - Centered content

#### Spacing Systems
- **Section Spacing**: `space-y-4` - Vertical section gaps
- **Element Spacing**: `gap-2 sm:gap-4` - Responsive element gaps
- **Padding Responsive**: `p-4 sm:p-6` - Responsive padding
- **Content Padding**: `px-6` - Horizontal content padding

### Visual Effects

#### Shadow Variations
- **Subtle Shadow**: `shadow-xs` - Buttons, inputs, small elements
- **Card Shadow**: `shadow-sm` - Cards, panels
- **Modal Shadow**: `shadow-lg` - Dialogs, popovers
- **Dropdown Shadow**: `shadow-md` - Dropdown menus, tooltips

#### Border Patterns
- **Standard Border**: `border border-border` - Default borders
- **Input Border**: `border border-input` - Form element borders
- **Focus Border**: `border-ring` - Focus state borders
- **Destructive Border**: `border-destructive` - Error state borders

#### Background Treatments
- **Primary Background**: `bg-background` - Main page background
- **Card Background**: `bg-white` - Card and panel backgrounds
- **Muted Background**: `bg-muted` - Subtle backgrounds
- **Secondary Background**: `bg-secondary` - Secondary panels

#### Animation Patterns
- **Standard Transition**: `transition-colors` - Color changes
- **All Transition**: `transition-all` - Multiple property changes
- **Box Shadow Transition**: `transition-[color,box-shadow]` - Focus effects
- **Radix Animations**: `data-[state=open]:animate-in data-[state=closed]:animate-out` - Modal animations

## Component-Specific Reference

All 47 components available in `@order-app/design-system`:

### Core Components (5)

#### Button Component
**Import**: `import { Button } from '@order-app/design-system'`
**Base Style**: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50`

**Variants**:
- `default`: `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90`
- `destructive`: `bg-destructive text-white shadow-xs hover:bg-destructive/90`
- `outline`: `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground`
- `secondary`: `bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80`
- `ghost`: `hover:bg-accent hover:text-accent-foreground`
- `link`: `text-primary underline-offset-4 hover:underline`

**Sizes**: `default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (size-9)

#### Input Component  
**Import**: `import { Input } from '@order-app/design-system'`
**Style**: `file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background border-border flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`

#### Label Component
**Import**: `import { Label } from '@order-app/design-system'`  
**Style**: `peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium leading-none`

#### Textarea Component
**Import**: `import { Textarea } from '@order-app/design-system'`
**Style**: `border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2`

#### Separator Component
**Import**: `import { Separator } from '@order-app/design-system'`
**Style**: `bg-border shrink-0 data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]`

### Layout Components (5)

#### Card Component
**Import**: `import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@order-app/design-system'`

- **Card**: `bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-300 py-6 shadow-sm`
- **CardHeader**: `@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6`
- **CardTitle**: `leading-none font-semibold`
- **CardDescription**: `text-gray-600 text-sm`
- **CardContent**: `px-6`
- **CardFooter**: `flex items-center px-6 [.border-t]:pt-6`

#### Tabs Component
**Import**: `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@order-app/design-system'`

- **TabsList**: `bg-muted text-muted-foreground inline-flex items-center justify-center rounded-md p-1`
- **TabsTrigger**: `ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all`
- **TabsContent**: `ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2`

#### Accordion Component
**Import**: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@order-app/design-system'`

- **AccordionItem**: `border-b`
- **AccordionTrigger**: `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline`
- **AccordionContent**: `overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down`

#### Collapsible Component
**Import**: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@order-app/design-system'`

- **CollapsibleTrigger**: `flex items-center justify-between space-x-4 [&[data-state=open]>svg]:rotate-90`
- **CollapsibleContent**: `overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down`

#### Resizable Component
**Import**: `import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@order-app/design-system'`

- **ResizablePanelGroup**: `flex h-full w-full data-[panel-group-direction=vertical]:flex-col`
- **ResizableHandle**: `relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2`

### Form Components (5)

#### Checkbox Component
**Import**: `import { Checkbox } from '@order-app/design-system'`
**Style**: `peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring size-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary`

#### Radio Group Component  
**Import**: `import { RadioGroup, RadioGroupItem } from '@order-app/design-system'`

- **RadioGroup**: `grid gap-2`
- **RadioGroupItem**: `border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aspect-square h-4 w-4 rounded-full border`

#### Select Component
**Import**: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@order-app/design-system'`

- **SelectTrigger**: `border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm`
- **SelectContent**: `bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md`
- **SelectItem**: `focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none`

#### Switch Component
**Import**: `import { Switch } from '@order-app/design-system'`
**Style**: `peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`

#### Form Component
**Import**: `import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@order-app/design-system'`

- **FormItem**: `space-y-2`
- **FormLabel**: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`
- **FormControl**: `relative w-full`
- **FormMessage**: `text-sm font-medium text-destructive`

### Data Display Components (5)

#### Table Component
**Import**: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@order-app/design-system'`

- **Table**: `w-full caption-bottom text-sm`
- **TableHeader**: `[&_tr]:border-b`
- **TableBody**: `[&_tr:last-child]:border-0`
- **TableHead**: `text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0`
- **TableRow**: `hover:bg-muted/50 border-b transition-colors data-[state=selected]:bg-muted`
- **TableCell**: `p-4 align-middle [&:has([role=checkbox])]:pr-0`
- **TableCaption**: `text-muted-foreground mt-4 text-sm`

#### Badge Component
**Import**: `import { Badge } from '@order-app/design-system'`
**Base Style**: `inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0`

**Variants**:
- `default`: `border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90`
- `secondary`: `border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90`
- `destructive`: `border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90`
- `outline`: `text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground`

#### Avatar Component
**Import**: `import { Avatar, AvatarFallback, AvatarImage } from '@order-app/design-system'`

- **Avatar**: `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full`
- **AvatarImage**: `aspect-square h-full w-full`
- **AvatarFallback**: `bg-muted flex h-full w-full items-center justify-center rounded-full`

#### Calendar Component
**Import**: `import { Calendar } from '@order-app/design-system'`
**Style**: `p-3 [&_[role=gridcell]:has([aria-selected])]:bg-accent [&_[role=gridcell]]:rounded-md [&_[role=gridcell]]:p-0`

#### Chart Component
**Import**: `import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from '@order-app/design-system'`

- **ChartContainer**: `aspect-auto w-full [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50`
- **ChartTooltip**: `[&_.recharts-tooltip-cursor]:fill-muted [&_.recharts-tooltip-cursor]:fill-opacity-25`

### Navigation Components (5)
- **Dropdown Menu** - Context menus and dropdowns
- **Context Menu** - Right-click context menus
- **Menubar** - Horizontal menu bars
- **Navigation Menu** - Complex navigation structures
- **Breadcrumb** - Breadcrumb navigation

### Feedback Components (6)
- **Dialog** - Modal dialogs and overlays
- **Alert Dialog** - Confirmation dialogs
- **Toast** - Notification toasts
- **Tooltip** - Hover tooltips
- **Alert** - Inline alert messages
- **Progress** - Progress bars and indicators

### Overlay Components (4)
- **Sheet** - Side panels and drawers
- **Drawer** - Mobile-friendly drawers
- **Popover** - Floating content popover
- **Hover Card** - Rich hover content

### Media Components (2)
- **Aspect Ratio** - Responsive aspect ratios
- **Carousel** - Image/content carousels

### Utility Components (4)
- **Scroll Area** - Custom scrollbars
- **Skeleton** - Loading placeholders
- **Command** - Command palette/search
- **Sidebar** - Navigation sidebars

### Advanced Components (5)
- **Slider** - Range sliders
- **Toggle** - Toggle buttons
- **Toggle Group** - Multiple toggle buttons
- **Pagination** - Page navigation
- **Input OTP** - One-time password inputs

## Usage Examples

```tsx
// Basic form
<div className="space-y-4">
  <div>
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter your name" />
  </div>
  <div className="flex gap-2">
    <Button>Submit</Button>
    <Button variant="outline">Cancel</Button>
  </div>
</div>

// Card layout
<Card>
  <CardHeader>
    <CardTitle>Order #1234</CardTitle>
    <CardDescription>Placed 2 minutes ago</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge variant="secondary">Preparing</Badge>
  </CardContent>
</Card>

// Data table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell><Badge>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Quick Reference Summary

### **Two Ways to Browse Styles:**

1. **🎨 Design Tokens & Patterns** - Browse by style type:
   - **Interactive States**: Hover, focus, disabled patterns
   - **Typography**: Heading, body text, label styles
   - **Layout**: Container, grid, flexbox arrangements  
   - **Visual Effects**: Shadows, borders, backgrounds, animations

2. **🧩 Component-Specific Reference** - Browse by component:
   - **Core**: Button, Input, Label, Textarea, Separator
   - **Layout**: Card, Tabs, Accordion, Collapsible, Resizable
   - **Form**: Checkbox, Radio, Select, Switch, Form
   - **Data Display**: Table, Badge, Avatar, Calendar, Chart
   - **[Plus 32 more components organized by category]**

### **Key Benefits:**
- ✅ **Copy-paste ready** CSS classes for all patterns
- ✅ **Cross-referenced** - see which components use which patterns
- ✅ **Import examples** for every component
- ✅ **Consistent OKLCH color system** throughout
- ✅ **Type-safe variants** with CVA (Class Variance Authority)
- ✅ **47 production-ready components** with detailed styling documentation

### **Usage Pattern:**
```tsx
// 1. Import what you need
import { Button, Card, Badge } from '@order-app/design-system'

// 2. Use with variants
<Button variant="destructive" size="sm">Delete</Button>

// 3. Combine with layout patterns
<div className="flex gap-2">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>
```

This design system provides a complete, production-ready foundation for building consistent, accessible, and beautiful user interfaces across your entire application ecosystem.