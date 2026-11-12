import fs from 'node:fs/promises';
import path from 'node:path';
// Inspect attributes rather than serialized HTML. Comments and script text are not metadata.
export function tags(html, name){
 const clean=html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
 return [...clean.matchAll(new RegExp('<'+name+'\\b((?:"[^"]*"|\'[^\']*\'|[^\'">])*)>','gi'))].map(m=>{
  const attrs={};
  for(const a of m[1].matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g))attrs[a[1].toLowerCase()]=(a[2]??a[3]??a[4]).replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'");
  return attrs;
 });
}
export async function checkSeo(out,site,{warn=console.warn}={}){
 const fail=message=>{throw new Error('SEO kontrola: '+message);};
 const notice=message=>warn('Upozornění SEO: '+message);
 const optional=async name=>{try{return await fs.readFile(path.join(out,name),'utf8');}catch(e){if(e.code!=='ENOENT')throw e;notice('Chybí '+name);return '';}};
 const sitemap=await optional('sitemap.xml');
 const expected=site.pages.map(p=>new URL(p.path,site.url).href).sort();
 const actual=[...sitemap.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)].map(m=>m[1].replaceAll('&amp;','&')).sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))notice('Sitemap neodpovídá stránkám a hlavní doméně.');
 const robots=await optional('robots.txt');
 const headers=await optional('_headers');
 if(site.indexable){
  if(/^\s*Disallow:\s*\/\s*$/mi.test(robots))fail('Produkční robots.txt zakazuje procházení.');
  if(/X-Robots-Tag\s*:[^\n]*\b(noindex|none)\b/i.test(headers))fail('Produkční HTTP hlavičky zakazují indexaci.');
 }
 for(const page of site.pages){
  const html=await fs.readFile(path.join(out,page.path.slice(1),'index.html'),'utf8');
  const canonical=tags(html,'link').filter(a=>(a.rel||'').toLowerCase().split(/\s+/).includes('canonical'));
  if(canonical.length!==1||canonical[0].href!==new URL(page.path,site.url).href)notice('Zkontrolujte canonical: '+page.path);
  const directives=tags(html,'meta').filter(a=>['robots','googlebot'].includes((a.name||'').toLowerCase())).flatMap(a=>(a.content||'').toLowerCase().split(/[\s,]+/));
  const noindex=directives.includes('noindex')||directives.includes('none');
  // Index/follow are defaults; nofollow is unrelated to whether a page can be indexed.
  if(site.indexable?noindex:!noindex)fail('Neplatná indexace stránky: '+page.path);
 }
}
