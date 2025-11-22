# StockMaster - Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## First Steps

1. **Login**: Use any email and password to login (authentication is mocked)
   - Example: `admin@stockmaster.com` / any password

2. **Explore Dashboard**: View overview of receipts, deliveries, and stock

3. **Create a Receipt**:
   - Navigate to Operations → Receipts
   - Click "New Receipt"
   - Fill in partner and scheduled date
   - Click "Mark as Ready" → "Mark as Done"

4. **Create a Delivery**:
   - Navigate to Operations → Delivery
   - Click "New Delivery"
   - Fill in partner and scheduled date
   - Note: If quantity exceeds available stock, status will be "Waiting"

5. **Manage Stock**:
   - Navigate to Stock
   - Click "Adjust" on any product
   - Enter positive or negative adjustment

## Key Features to Test

### Status Workflows
- **Receipts**: Draft → Ready → Done
- **Deliveries**: Draft → Waiting (if insufficient stock) → Ready → Done

### Insufficient Stock Warning
- Create a delivery with quantity > available stock
- Row will highlight in red
- Status automatically set to "Waiting"
- Warning message displayed

### Print Functionality
- Open any receipt or delivery detail page
- Click "Print" button
- Navigation elements are hidden in print view

### Responsive Design
- Resize browser window
- Sidebar collapses on mobile (<768px)
- Hamburger menu appears
- Forms stack to single column

## Mock API Behavior

- All API calls have 300-800ms simulated latency
- 5% random error rate for testing error handling
- Data persists only during session (resets on refresh)

## Color Palette

- Primary: `#0EA5A4` (Teal)
- Primary Dark: `#0B63A7` (Navy)
- Danger: `#EF4444` (Red)
- Success: Green shades
- Warning: Yellow shades

## Project Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Check TypeScript errors
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting
npm run lint
```

## Next Steps

1. Review `docs/FRONTEND_CHECKLIST.md` for comprehensive QA
2. Customize colors in `tailwind.config.js`
3. Add real API endpoints in `src/services/mockApi.ts`
4. Implement authentication with real backend
5. Add more products and test data

## Support

For issues or questions, refer to:
- `README.md` - Full documentation
- `docs/FRONTEND_CHECKLIST.md` - QA checklist
- Source code comments
