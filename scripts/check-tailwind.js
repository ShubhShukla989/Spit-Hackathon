#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common invalid Tailwind patterns
const invalidPatterns = [
  /className="[^"]*\s{2,}[^"]*"/g, // Multiple spaces
  /className="[^"]*\t[^"]*"/g, // Tabs in className
];

function checkFileForInvalidClasses(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  invalidPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        file: filePath,
        issue: index === 0 ? 'Multiple spaces in className' : 'Tabs in className',
        matches: matches.slice(0, 3), // Show first 3 matches
      });
    }
  });

  return violations;
}

function scanDirectory(dir, violations = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(file)) {
        scanDirectory(filePath, violations);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const fileViolations = checkFileForInvalidClasses(filePath);
      violations.push(...fileViolations);
    }
  });

  return violations;
}

console.log('🔍 Checking Tailwind classes...\n');

const violations = scanDirectory('./src');

if (violations.length > 0) {
  console.warn('⚠️  Potential Tailwind issues found:\n');
  violations.forEach((v) => {
    console.warn(`  File: ${v.file}`);
    console.warn(`  Issue: ${v.issue}`);
    console.warn(`  Examples: ${v.matches.join('\n           ')}\n`);
  });
  console.log('✅ Check complete (warnings only, not blocking)');
  process.exit(0);
} else {
  console.log('✅ Tailwind classes look good!');
  process.exit(0);
}
