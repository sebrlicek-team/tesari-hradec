import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const project = JSON.parse(await fs.readFile(path.join(root, 'project.json'), 'utf8'));
const site = JSON.parse(await fs.readFile(path.join(root, 'sites', project.slug + '.json'), 'utf8'));
const pagesUrl = new URL(project.pagesUrl);
const base = pagesUrl.pathname.replace(/\/$/, '');

if (pagesUrl.protocol !== 'https:' || pagesUrl.hostname !== 'sebrlicek-team.github.io' || base !== '/tesari-hradec' || pagesUrl.search || pagesUrl.hash) {
  throw new Error('Neplatná adresa GitHub Pages v project.json.');
}
if (site.indexable !== false) throw new Error('Pracovní GitHub Pages web musí zůstat noindex.');

const pagesAddress = pagePath => new URL(base + pagePath, pagesUrl.origin).href;
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const generated = [];
for (const page of site.pages) {
  const file = path.join(dist, page.path.slice(1), 'index.html');
  let html = await fs.readFile(file, 'utf8');
  const oldCanonical = new URL(page.path, site.url).href;
  const canonical = pagesAddress(page.path);
  html = html.replaceAll(oldCanonical, canonical);
  html = html.replace(/\b(href|src|poster|data-src)="\/(?!\/)([^"]*)"/g, (_, attr, value) => `${attr}="${base}/${value}"`);
  await fs.writeFile(file, html);
  generated.push(file);
}

const redirects = (await fs.readFile(path.join(dist, '_redirects'), 'utf8'))
  .split('\n').map(line => line.trim()).filter(Boolean);
for (const rule of redirects) {
  const [source, target, status] = rule.split(/\s+/);
  if (!/^\/[a-z0-9-]+\.htm$/.test(source) || !/^\/[a-z0-9-]+\/$/.test(target) || status !== '301') {
    throw new Error('Neplatné přesměrování původní adresy: ' + rule);
  }
  const destination = base + target;
  const canonical = pagesAddress(target);
  const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${escapeHtml(canonical)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(destination)}"><title>Přesměrování</title></head><body><p>Stránka byla přesunuta. <a href="${escapeHtml(destination)}">Pokračovat na novou adresu</a>.</p></body></html>`;
  const file = path.join(dist, source.slice(1));
  await fs.writeFile(file, html);
  generated.push(file);
}

let notFound = await fs.readFile(path.join(dist, '404.html'), 'utf8');
notFound = notFound.replace('<meta name="viewport"', '<meta name="robots" content="noindex,nofollow"><meta name="viewport"');
notFound = notFound.replace('href="/"', `href="${base}/"`);
await fs.writeFile(path.join(dist, '404.html'), notFound);
generated.push(path.join(dist, '404.html'));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.pages.map(page => `<url><loc>${pagesAddress(page.path)}</loc></url>`).join('')}</urlset>`;
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(dist, 'robots.txt'), `# GitHub Pages project path; the noindex meta tag in each HTML page is authoritative.\nUser-agent: *\nDisallow: ${base}/\n`);
await fs.writeFile(path.join(dist, '.nojekyll'), '');
await fs.rm(path.join(dist, '_headers'));
await fs.rm(path.join(dist, '_redirects'));

for (const file of generated) {
  const html = await fs.readFile(file, 'utf8');
  if (!/<meta name="robots" content="noindex,nofollow">/.test(html)) throw new Error('Chybí noindex: ' + file);
  for (const [, , value] of html.matchAll(/\b(href|src|poster|data-src)="(\/[^"]*)"/g)) {
    if (!value.startsWith(base + '/')) throw new Error('Odkaz mimo cestu GitHub Pages: ' + value);
    const relative = value.slice(base.length).split(/[?#]/)[0];
    const asset = path.join(dist, relative.endsWith('/') ? relative + 'index.html' : relative);
    try { await fs.access(asset); } catch { throw new Error('Chybějící soubor GitHub Pages: ' + value); }
  }
  if (html.includes(site.url)) throw new Error('Ve výsledném HTML zůstala původní canonical URL: ' + file);
}
console.log(`GitHub Pages: ${generated.length} HTML souborů, ${site.pages.length} stránek → ${pagesUrl.href}`);
