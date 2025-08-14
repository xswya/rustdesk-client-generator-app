#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '../package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

const type = process.argv[2] || 'patch';
const oldVersion = packageData.version;
const newVersion = incrementVersion(oldVersion, type);

packageData.version = newVersion;

fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');

console.log(`Version updated: ${oldVersion} → ${newVersion}`);