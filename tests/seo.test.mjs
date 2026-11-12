import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {checkSeo} from '../scripts/check-seo.mjs';
import {renderPage} from '../src/page.mjs';
import {build,root} from '../scripts/build.mjs';
test('SEO přepnutí náhledu na produkci a upozornění na poškozenou sitemap',async()=>{
 const out=await fs.mkdtemp(path.join(os.tmpdir(),'ccn-seo-'));
 try{
  const site=JSON.parse(await fs.readFile(path.join(root,'sites/showcase.json'),'utf8'));
  await build('showcase',out);await checkSeo(out,site);
  site.indexable=true;site.url='https://klient.cz/';
  for(const page of site.pages)await fs.writeFile(path.join(out,page.path.slice(1),'index.html'),renderPage(site,page));
  const sitemap='<urlset>'+site.pages.map(p=>'<url><loc>'+new URL(p.path,site.url).href+'</loc></url>').join('')+'</urlset>';
  await fs.writeFile(path.join(out,'sitemap.xml'),sitemap);
  await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://klient.cz/sitemap.xml\n');
  await fs.writeFile(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n');
  await checkSeo(out,site);
  await fs.writeFile(path.join(out,'sitemap.xml'),sitemap.replace('https://klient.cz/','https://wrong.cz/'));
  const warnings=[];await checkSeo(out,site,{warn:m=>warnings.push(m)});assert.match(warnings.join(),/Sitemap/);
  await fs.writeFile(path.join(out,'sitemap.xml'),sitemap);
  await fs.writeFile(path.join(out,'_headers'),'/*\n  X-Robots-Tag: noindex\n');
  await assert.rejects(checkSeo(out,site),/hlavičky/);
 }finally{await fs.rm(out,{recursive:true,force:true});}
});
test('SEO přijímá ekvivalentní HTML a blokuje skutečnou změnu indexace',async()=>{
 const out=await fs.mkdtemp(path.join(os.tmpdir(),'ccn-semantics-'));
 const site={url:'https://client.cz',indexable:false,pages:[{path:'/'}]};
 const write=html=>fs.writeFile(path.join(out,'index.html'),html);
 try{
  await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
  await fs.writeFile(path.join(out,'_headers'),'');
  await fs.writeFile(path.join(out,'sitemap.xml'),'<loc>https://client.cz/</loc>');
  for(const tag of ['<META content="NOINDEX, FOLLOW" NAME="robots" />',"<meta content='noindex' name='robots'>",'<meta name=robots content=noindex>']){
   await write(tag+"<link href='https://client.cz/' rel='canonical' />");
   const warnings=[];await checkSeo(out,site,{warn:m=>warnings.push(m)});assert.deepEqual(warnings,[]);
  }
  await write('<!-- <meta name=robots content=noindex> --><script>"<meta name=robots content=noindex>"</script>');
  await assert.rejects(checkSeo(out,site,{warn:()=>{}}),/indexace/);
  await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /');site.indexable=true;
  await write('<link rel=canonical href="https://client.cz/">');await checkSeo(out,site);
  await write('<meta content="none" name="ROBOTS">');await assert.rejects(checkSeo(out,site,{warn:()=>{}}),/indexace/);
 }finally{await fs.rm(out,{recursive:true,force:true});}
});
