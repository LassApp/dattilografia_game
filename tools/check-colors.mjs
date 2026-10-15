// §4.3: segnala valori colore (#hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch(), color()) fuori da css/tokens.css. Nessuna dipendenza.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['node_modules', '.git', 'tools', 'assets', 'mockup']);
const RE = /#[0-9a-fA-F]{3,8}(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/g;
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => SKIP.has(e.name) ? [] : e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
let bad = 0;
for (const f of walk(ROOT)) {
  const r = relative(ROOT, f); if (r === 'css/tokens.css' || !['.css', '.js', '.mjs', '.html', '.svg'].includes(extname(f))) continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => { for (const m of line.matchAll(RE)) { console.log(`${r}:${i + 1}: ${m[0]}`); bad++; } });
}
console.log(bad ? `✗ ${bad} valori colore fuori da tokens.css` : '✓ Nessun valore colore fuori da css/tokens.css');
process.exit(bad ? 1 : 0);
