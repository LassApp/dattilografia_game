// Confini di architettura: engine senza DOM/UI, componenti senza engine/storage, niente stile inline, ogni componente ha `meta`.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
const bad = []; const err = (f, m) => bad.push(`${relative(ROOT, f)}: ${m}`);
for (const f of walk(join(ROOT, 'js')).filter((x) => x.endsWith('.js'))) {
  const r = relative(ROOT, f), s = readFileSync(f, 'utf8'), imp = [...s.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
  if (r.startsWith('js/engine/')) {
    if (imp.some((i) => /\/ui\/|controllers\//.test(i))) err(f, 'engine importa ui/controllers');
    if (/\b(document|window|localStorage)\b/.test(s)) err(f, 'engine usa il DOM');
  }
  if (r.startsWith('js/ui/components/')) {
    if (imp.some((i) => /engine\/|storage\/|controllers\//.test(i))) err(f, 'componente importa engine/storage/controllers');
    if (!/export const meta\b/.test(s)) err(f, 'manca `export const meta` (scheda in galleria)');
  }
  if (!r.startsWith('js/dev/')) {
    if (/\bstyle\s*=\s*["'`]/.test(s)) err(f, 'stile inline (attributo style)');
    if (/\.style\.(?!setProperty)\w+\s*=/.test(s)) err(f, 'assegnazione a .style.*: usa classi/token o setVar()');
  }
}
for (const f of walk(ROOT).filter((x) => x.endsWith('.html') && !x.includes('node_modules'))) if (/\sstyle\s*=/.test(readFileSync(f, 'utf8'))) err(f, 'stile inline in HTML');
bad.forEach((b) => console.log(b)); console.log(bad.length ? `✗ ${bad.length} violazioni` : '✓ Architettura rispettata');
process.exit(bad.length ? 1 : 0);
