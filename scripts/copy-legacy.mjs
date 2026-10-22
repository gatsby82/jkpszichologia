// Copies the legacy static site (legacy/) into the hosting root (dist/site/),
// next to the Angular app, which is built into dist/site/v2/.
// Runs after `ng build` (see the "build" script in package.json).
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const src = 'legacy';
const dest = join('dist', 'site');

if (!existsSync(join(dest, 'v2', 'index.html'))) {
  console.error(`copy-legacy: ${dest}/v2/index.html not found – run "ng build" first.`);
  process.exit(1);
}

// The legacy site must never contain a "v2" entry, or it would clash with the Angular app.
if (readdirSync(src).some((name) => name.toLowerCase() === 'v2')) {
  console.error('copy-legacy: legacy/ must not contain a "v2" file or folder.');
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log(`copy-legacy: ${src}/ → ${dest}/`);
