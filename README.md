# StockMaster - Inventory Management System

A production-grade inventory management frontend built with React, TypeScript, and Tailwind CSS following enterprise-level specifications.

**UI Reference**: `/Users/adarshsharma/Documents/Odoo_Stock_Manager/StockMaster.pdf`

## Features

- **Authentication**: 
  - Login with "Remember me" checkbox and "Forgot password" link
  - Signup with real-time password validation (8-16 chars, uppercase, digit, special char)
- **Dashboard**: 
  - Clickable summary cards with operation counts
  - "X to receive" and "X to deliver" with late/waiting indicators
  - Direct navigation to filtered lists
- **Operations Management**:
  - **Receipts**: Draft → Ready → Done workflow
  - **Delivery**: Draft → Waiting → Ready → Done workflow with automatic stock checking
  - Insufficient stock detection with red row highlighting
  - Visual warnings and tooltips for stock issues
- **Stock Management**: View and adjust product stock levels with modal interface
- **Move History**: Track all inventory movements with IN/OUT color coding
- **Settings**: Manage warehouses and locations with CRUD operations
- **Print Functionality**: Clean printable views with signature lines
- **Responsive Design**: Mobile-first with collapsible sidebar (260px dark slate)
- **Accessibility**: WCAG compliant with keyboard navigation and ARIA labels

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Mock API** with simulated latency and error handling

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck

# Run all checks (type + lint + tailwind + purple scan)
npm run frontend-check

# Quick debug (starts server and opens browser)
./scripts/run-debug.sh
```

## Project Structure

```
src/
├── assets/           # Static assets (logos, illustrations)
├── components/       # Reusable UI components
├── pages/           # Page components
│   ├── operations/  # Receipt and delivery pages
│   └── settings/    # Warehouse and location pages
├── services/        # API and utility services
├── stores/          # Zustand state management
├── styles/          # Global styles and Tailwind config
└── utils/           # Helper functions

```

## Design System

### Colors (No Purple Shades)

- Primary: `#0EA5A4` (Teal) - hover: `#0D938F`, active: `#0B7F7A`
- Primary Dark: `#0B63A7` (Navy)
- Slate shades: `#0F172A` (sidebar), `#1F2937`, `#334155`, `#94A3B8`, `#E6EEF8`
- Danger: `#EF4444` - hover: `#DC2626`
- Success: Green shades
- Warning: Yellow shades

### Typography

- H1: 28px (font-semibold)
- H2: 20px (font-semibold)
- Body: 14px
- Small: 12px
- Font: Inter

### Component Sizes

- Button: sm (px-3 py-1.5), md (px-4 py-2), lg (px-5 py-3)
- Sidebar: 260px width, dark slate (#0F172A)
- Header: 64px height
- Page padding: px-8 py-6
- Card padding: p-5 (20px)
- Section gap: mt-8
- Field gap: gap-4

## Key Features

### Status Workflows

**Receipts**: Draft → Ready → Done

**Deliveries**: Draft → Waiting → Ready → Done
- Automatically moves to "Waiting" if product quantity exceeds available stock

### Mock API

All API calls include:
- 300-800ms simulated latency
- 5% error rate for testing error handling
- Full CRUD operations for all entities

### Print Functionality

All detail pages support clean printing with:
- Hidden navigation elements
- Optimized layout for paper
- Professional formatting

## Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update sidebar navigation in `src/components/Sidebar.tsx`

### Mock Data

Edit `src/services/mockApi.ts` to modify mock data or add new endpoints.

### Styling

- Use Tailwind utility classes
- Follow the design system colors
- Maintain responsive design patterns

## Testing Checklist

See `docs/FRONTEND_CHECKLIST.md` for comprehensive QA steps.

## License

MIT
