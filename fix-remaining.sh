#!/bin/bash

# Fix remaining TypeScript errors

# Remove unused useNavigate import
sed -i '' 's/import { useNavigate } from/\/\/ import { useNavigate } from/g' src/pages/operations/adjustments.tsx

# Fix setLoading
sed -i '' 's/setLoading(true)/\/\/ setLoading(true)/g' src/pages/operations/adjustments.tsx
sed -i '' 's/setLoading(false)/\/\/ setLoading(false)/g' src/pages/operations/adjustments.tsx

# Fix setProducts
sed -i '' 's/setProducts(productsData)/\/\/ setProducts(productsData)/g' src/pages/operations/delivery/\[id\].tsx
sed -i '' 's/setProducts(productsData)/\/\/ setProducts(productsData)/g' src/pages/operations/receipts/\[id\].tsx

echo "✅ Remaining errors fixed!"
