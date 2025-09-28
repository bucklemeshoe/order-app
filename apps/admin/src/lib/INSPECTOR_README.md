# Component Inspector System

A development tool for React applications that provides visual component identification and metadata extraction through hover tooltips and click-to-copy functionality.

## 🎯 What It Does

The Component Inspector allows developers to:
- **Visually identify components** on hover with colored outlines and tooltips
- **See component tokens** (meaningful component names) instead of underlying implementation details
- **Copy comprehensive component information** including props, file location, and usage examples
- **Distinguish between component types** with visual color coding
- **Toggle inspection mode** on/off as needed

## 🏗️ Architecture

### Core Files
```
src/lib/
├── inspector.tsx          # Main HOC and utilities
└── INSPECTOR_README.md    # This documentation

src/contexts/
└── InspectContext.tsx     # React context for inspection state
```

### Key Components

#### 1. `withInspector` HOC
Higher-Order Component that wraps any React component with inspection capabilities.

```typescript
const InspectableComponent = withInspector(
  OriginalComponent,
  'ComponentName',
  'import-path',
  'file-path',
  lineNumber
)
```

#### 2. `InspectContext`
React context that manages global inspection state (on/off toggle).

#### 3. Component Info Extraction
Automatically captures:
- Component name and import path
- File location and line numbers
- Component props and values
- Child component relationships

## 🎨 Visual Design

### Color Coding System
- **🔵 Blue badges/outlines**: Local/custom components (StatCard, OrderCard, etc.)
- **🟣 Pink badges/outlines**: Design system components (Button, Card, Input, etc.)

### Tooltip Information
```
┌─────────────────────────────┐
│ [ComponentName]             │
│ @import/path                │
│ 📄 file-path:line-number    │
│                             │
│ Props:                      │
│   prop1: "value"            │
│   prop2: 123                │
│                             │
│ 💡 Click to copy details    │
└─────────────────────────────┘
```

## 📦 Installation Guide

### Step 1: Copy Core Files

Copy these files to your React project:

```bash
# Core inspector system
src/lib/inspector.tsx

# Context for state management  
src/contexts/InspectContext.tsx
```

### Step 2: Install Dependencies

Ensure you have these dependencies:

```bash
npm install react lucide-react
# Plus your tooltip library (we use @order-app/design-system)
```

### Step 3: Add Context Provider

Wrap your app with the InspectContext:

```typescript
// App.tsx or main layout file
import { InspectContext } from './contexts/InspectContext'

function App() {
  const [inspectMode, setInspectMode] = useState(false)

  return (
    <InspectContext.Provider value={{ inspectMode, setInspectMode }}>
      {/* Your app content */}
      
      {/* Toggle button (optional) */}
      <button onClick={() => setInspectMode(!inspectMode)}>
        👁️ {inspectMode ? 'Disable' : 'Enable'} Inspector
      </button>
    </InspectContext.Provider>
  )
}
```

### Step 4: Update Tooltip Import

Update the tooltip import in `inspector.tsx` to match your design system:

```typescript
// Change this line to match your tooltip components
import { Tooltip, TooltipContent, TooltipTrigger } from 'your-design-system'
```

### Step 5: Wrap Components

Start wrapping components with the inspector:

```typescript
import { withInspector } from './lib/inspector'

// Design system components
const Button = withInspector(BaseButton, 'Button', '@your-design-system')
const Card = withInspector(BaseCard, 'Card', '@your-design-system')

// Local components  
const MyComponent = withInspector(
  ({ title, value }) => <div>{title}: {value}</div>,
  'MyComponent',
  'MyComponent.tsx (local)',
  'src/components/MyComponent.tsx',
  15
)

// Page components
const HomePage = withInspector(
  () => { /* page content */ },
  'HomePage',
  'HomePage.tsx (page)',
  'src/pages/HomePage.tsx',
  1
)
```

## 🛠️ Usage Patterns

### Pattern 1: Design System Components

Wrap once, use everywhere:

```typescript
// components/ui/index.ts
import { withInspector } from '../lib/inspector'
import * as BaseComponents from '@your-design-system'

export const Button = withInspector(BaseComponents.Button, 'Button')
export const Card = withInspector(BaseComponents.Card, 'Card')
export const Input = withInspector(BaseComponents.Input, 'Input')
// ... etc
```

### Pattern 2: Local Components

Wrap each meaningful component:

```typescript
// UserCard.tsx
import { withInspector } from '../lib/inspector'

const UserCard = withInspector(
  ({ user, onEdit }) => (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={onEdit}>Edit</button>
    </div>
  ),
  'UserCard',
  'UserCard.tsx (local)',
  'src/components/UserCard.tsx',
  5
)

export default UserCard
```

### Pattern 3: Page Components

Wrap main page components:

```typescript
// pages/Dashboard.tsx
import { withInspector } from '../lib/inspector'

const Dashboard = withInspector(
  () => (
    <div>
      <h1>Dashboard</h1>
      {/* page content */}
    </div>
  ),
  'Dashboard',
  'Dashboard.tsx (page)',
  'src/pages/Dashboard.tsx',
  4
)

export default Dashboard
```

## 🎮 How to Use

### 1. Enable Inspector Mode
Click the toggle button or programmatically set `inspectMode = true`

### 2. Hover Over Components
- See colored outlines around inspectable components
- View tooltip with component information
- Different colors indicate component types

### 3. Click to Copy
- Click any inspected component to copy full details
- Includes component name, props, usage examples, and metadata
- Perfect for communication and documentation

### 4. Component Tokens
When you hover over components, you'll see meaningful names like:
- ✅ `UserCard` instead of `div`
- ✅ `Button` instead of `button` 
- ✅ `Dashboard` instead of `section`

## 🔧 Customization

### Custom Colors
Update the color scheme in `withInspector`:

```typescript
// Change these color values
const outlineColor = isLocalComponent ? 'rgba(59, 130, 246, 0.5)' : 'rgba(236, 72, 153, 0.5)'
const badgeColor = isLocalComponent ? 'bg-blue-500' : 'bg-pink-500'
```

### Custom Tooltip Content
Modify the tooltip JSX in `withInspector` to show different information.

### Custom Copy Format
Update `copyComponentInfoToClipboard` function to change the copied text format.

## 📝 Best Practices

### 1. Component Naming
- Use meaningful, recognizable names
- Match the actual component name used in code
- Include context for local components (`"MyComponent (local)"`)

### 2. Selective Wrapping
- Wrap meaningful components that developers need to identify
- Skip wrapper divs and implementation details
- Focus on components that represent business logic

### 3. File Paths
- Include relative paths from project root
- Add line numbers for quick navigation
- Keep paths consistent across your project

### 4. Performance
- Inspector only adds overhead in inspect mode
- No performance impact in production (when inspect mode is disabled)
- Wrap components lazily if bundle size is a concern

## 🚀 Advanced Features

### Auto-Detection (Future Enhancement)
Could be enhanced with:
- Babel/SWC plugin for automatic wrapping
- Build-time component discovery
- Automatic file path detection

### Cross-App Integration
To share across multiple apps:
1. Move inspector to shared package (`@your-org/dev-tools`)
2. Standardize component token naming
3. Create shared configuration for common components

## 🐛 Troubleshooting

### Inspector Not Showing
- Check that `inspectMode` is `true`
- Verify `InspectContext` is provided
- Ensure components are wrapped with `withInspector`

### Tooltip Not Displaying
- Check tooltip library is installed
- Verify tooltip imports in `inspector.tsx`
- Ensure tooltip styles are loaded

### Copy Not Working
- Check browser clipboard permissions
- Verify `copyComponentInfoToClipboard` function
- Check browser console for errors

## 📈 Benefits

### For Development
- **Faster component identification** during debugging
- **Better communication** between team members
- **Quick access to component metadata** and props
- **Visual component hierarchy** understanding

### For Documentation
- **Automatic component discovery** for documentation
- **Props and usage examples** generation
- **Component relationship mapping**

### For Debugging
- **Visual confirmation** of component boundaries
- **Props inspection** without React DevTools
- **Quick file navigation** with line numbers

---

**The Component Inspector System transforms the development experience by making components visually identifiable and providing instant access to their metadata! 🎯✨**
