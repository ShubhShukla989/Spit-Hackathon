# Frontend QA Checklist

## Build & Type Checks

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` shows no errors
- [ ] TypeScript compilation succeeds
- [ ] No unused imports or variables
- [ ] All props are properly typed

## Authentication

- [ ] Login page validates email format
- [ ] Login page validates required fields
- [ ] Signup page validates password match
- [ ] Signup page validates password length (min 6 chars)
- [ ] Successful login redirects to dashboard
- [ ] Logout clears session and redirects to login
- [ ] Protected routes redirect to login when not authenticated

## Dashboard

- [ ] All stat cards display correct counts
- [ ] Clicking "To Receive" card filters receipts list
- [ ] Clicking "To Deliver" card filters delivery list
- [ ] Recent receipts list shows latest 5 items
- [ ] Recent deliveries list shows latest 5 items
- [ ] Clicking list items navigates to detail pages

## Receipts

### List Page
- [ ] Table displays all receipts
- [ ] Status pills show correct colors (Draft/Ready/Done)
- [ ] Row click opens detail page
- [ ] "New Receipt" button navigates to create form
- [ ] List/Kanban toggle works
- [ ] Empty state shows when no receipts exist

### Detail Page
- [ ] Form fields are editable in draft mode
- [ ] Form fields are read-only after validation
- [ ] "Mark as Ready" button transitions Draft → Ready
- [ ] "Mark as Done" button transitions Ready → Done
- [ ] Print button opens print dialog
- [ ] Print view hides navigation elements
- [ ] Product lines display correctly
- [ ] Back button returns to list

## Deliveries

### List Page
- [ ] Table displays all deliveries
- [ ] Status pills show correct colors (Draft/Waiting/Ready/Done)
- [ ] Row click opens detail page
- [ ] "New Delivery" button navigates to create form
- [ ] List/Kanban toggle works
- [ ] Empty state shows when no deliveries exist

### Detail Page
- [ ] Form fields are editable in draft mode
- [ ] Form fields are read-only after validation
- [ ] Insufficient stock highlights row in red
- [ ] Warning icon shows for insufficient stock
- [ ] Tooltip explains "Insufficient stock — mark as Waiting"
- [ ] Validation sets status to "Waiting" when stock insufficient
- [ ] Validation sets status to "Ready" when stock sufficient
- [ ] "Mark as Done" button transitions Ready → Done
- [ ] Print button opens print dialog
- [ ] Print view hides navigation elements
- [ ] Product lines show demand vs available
- [ ] Warning banner shows when stock insufficient
- [ ] Back button returns to list

## Stock Page

- [ ] Table displays all products
- [ ] On Hand, Reserved, and Available columns show correct values
- [ ] Summary cards show totals
- [ ] "Adjust" button opens modal
- [ ] Modal shows current stock level
- [ ] Adjustment accepts positive and negative numbers
- [ ] Stock updates after adjustment
- [ ] Success notification shows after adjustment

## Move History

- [ ] Table displays all moves
- [ ] IN moves show green "+" quantity
- [ ] OUT moves show red "-" quantity
- [ ] Type badges show correct colors (IN=green, OUT=red)
- [ ] Status badges display correctly
- [ ] Date formatting is consistent

## Settings - Warehouses

- [ ] Table displays all warehouses
- [ ] "New Warehouse" button opens modal
- [ ] Modal form has all required fields
- [ ] Create button shows success notification
- [ ] Active/Inactive status displays correctly

## Settings - Locations

- [ ] Table displays all locations
- [ ] "New Location" button opens modal
- [ ] Modal form has all required fields
- [ ] Warehouse dropdown populates from API
- [ ] Type dropdown has all options (Internal/Supplier/Customer)
- [ ] Create button shows success notification
- [ ] Type badges show correct colors
- [ ] Active/Inactive status displays correctly

## Profile

- [ ] User avatar shows first letter of name
- [ ] Name and email fields are editable
- [ ] "Save Changes" button shows success notification
- [ ] "Cancel" button resets form

## Navigation

- [ ] Sidebar shows all menu items
- [ ] Active route highlights in sidebar
- [ ] Operations submenu expands/collapses
- [ ] Settings submenu expands/collapses
- [ ] Mobile sidebar collapses under 768px
- [ ] Hamburger menu toggles sidebar on mobile
- [ ] Clicking outside sidebar closes it on mobile

## Notifications

- [ ] Success notifications show green
- [ ] Error notifications show red
- [ ] Warning notifications show yellow
- [ ] Info notifications show blue
- [ ] Notifications auto-dismiss after 5 seconds
- [ ] Close button dismisses notification immediately
- [ ] Multiple notifications stack correctly

## Responsive Design

- [ ] Desktop layout (1024px+) shows full sidebar
- [ ] Tablet layout (768px-1023px) shows collapsible sidebar
- [ ] Mobile layout (<768px) shows hamburger menu
- [ ] Forms stack to single column on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Cards stack vertically on mobile
- [ ] All touch targets are at least 44x44px

## Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] ARIA labels present on icon buttons
- [ ] Form inputs have associated labels
- [ ] Error messages have role="alert"
- [ ] Modals trap focus
- [ ] Escape key closes modals
- [ ] Screen reader announces status changes

## Performance

- [ ] Initial page load < 3 seconds
- [ ] Navigation transitions are smooth
- [ ] No console errors or warnings
- [ ] Images are optimized
- [ ] No memory leaks on navigation

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Debugging Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for unused exports
npx ts-prune

# Check bundle size
npm run build && npx vite-bundle-visualizer

# Check for accessibility issues (install axe-core)
# Run in browser console: axe.run()
```

## Common Issues & Solutions

### Issue: Tailwind classes not applying
- Solution: Check `tailwind.config.js` content paths
- Run: `npm run dev` to rebuild

### Issue: Routes not working
- Solution: Check `BrowserRouter` is wrapping app
- Verify route paths match navigation links

### Issue: State not persisting
- Solution: Check Zustand store setup
- Verify store is imported correctly

### Issue: API calls failing
- Solution: Check mock API error toggle (5% rate)
- Verify async/await syntax
- Check network tab for errors

### Issue: Print styles not applying
- Solution: Verify `print.css` is imported
- Check `@media print` rules
- Test with browser print preview
