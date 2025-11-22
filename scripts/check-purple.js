#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Purple hex codes to check for
const purpleHexPatterns = [
  /#6A0DAD/i,
  /#800080/i,
  /#9B30FF/i,
  /#8B008B/i,
  /#9370DB/i,
  /#BA55D3/i,
  /#9932CC/i,
  /#8A2BE2/i,
  /#9400D3/i,
  /#9966CC/i,
  /#CC99FF/i,
  /#DDA0DD/i,
];

function checkFileForPurple(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  purpleHexPatterns.forEach((pattern) => {
    const matches = content.match(new RegExp(pattern, 'gi'));
    if (matches) {
      violations.push({
        file: filePath,
        pattern: pattern.source,
        matches: matches,
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
    } else if (
      file.endsWith('.tsx') ||
      file.endsWith('.ts') ||
      file.endsWith('.css') ||
      file.endsWith('.js')
    ) {
      const fileViolations = checkFileForPurple(filePath);
      violations.push(...fileViolations);
    }
  });

  return violations;
}

console.log('🔍 Scanning for purple hex codes...\n');

const violations = scanDirectory('./src');

if (violations.length > 0) {
  console.error('❌ Purple hex codes found:\n');
  violations.forEach((v) => {
    console.error(`  File: ${v.file}`);
    console.error(`  Pattern: ${v.pattern}`);
    console.error(`  Matches: ${v.matches.join(', ')}\n`);
  });
  process.exit(1);
} else {
  console.log('✅ No purple hex codes found!');
  process.exit(0);
}
