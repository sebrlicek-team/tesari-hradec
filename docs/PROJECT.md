# Projekt: Tesaři Hradec

## Zadání a zdroje
- Cíl: nový klientský web s hlavní akcí telefonické poptávky.
- Klientský repozitář: CCNplus/tesari-hradec (před prací prázdný).
- Zdrojová šablona: CCNplus/ccn-web-template, main, strom `abb66b00f980a45dabc182c3e01f1f1d8c930eae`.
- Podklady: původní web byl následně otevřen v prohlížeči na zadané HTTP adrese. Převzaty byly nabídka služeb, kontakt a adresy podstránek. Vizuální inspirace al-leseni.ccn-dev.cz nebyla dostupná. Uživatel potvrdil pokračování bez přiloženého loga a exportu.
- Pracovní adresa: https://tesari-hradec.cz.ccn2.profiwh.com; zadaná adresa používá HTTP, šablona vyžaduje HTTPS. Dostupnost HTTPS a připojení domény zbývá ověřit.
- Finální doména nebyla schválena.

## Struktura a zvolený vzhled
- Stránky: úvod, služby, tesařské práce, pokrývačské práce, klempířské práce, kontakt. Sekce: hero, služby, přístup, postup, telefonická výzva. Čtyři původní cesty .htm jsou v public/_redirects přesměrovány 301.
- Vzhled: tmavě zelená, teplá měděná, světlé pozadí; původní klientské logo a fotografie ze starého webu jsou doplněné v kopii pro GitHub Pages.
- Původní `public/assets/tesari-hero.jpg` je generovaná ilustrace; kopie pro GitHub Pages ji nahrazuje fotografiemi ze starého webu. Video banner se doplní později.

## Schválená rozhodnutí
- 12. 11. 2026: uživatel zadal nový web podle šablony, samostatnou větev a PR, zachování noindex na pracovní adrese a standardní příkazy.
- 12. 11. 2026: uživatel potvrdil pokračování bez loga a exportu starého webu.

## Aktivní konfigurace
- `project.json`: slug a Worker `tesari-hradec`, fáze `preview`.
- `sites/tesari-hradec.json`: URL pracovní adresy, `indexable: false`, šest stránek, bez odesílacího formuláře. Skutečné kontakty jsou převzaty z původní kontaktní stránky.
- `wrangler.jsonc`: `name: tesari-hradec`, statické assets z `./dist`.
- Cloudflare: build `npm test && npm run build`, deploy `npx wrangler deploy`; nastavení hlavní větve a vypnutí preview builds je nutné ověřit v Cloudflare.

## Ověření
- 12. 11. 2026: `npm test && npm run build` prošlo, 27/27 testů; build vytvořil 6 stránek.
- Výsledný `robots.txt`: `Disallow: /`; HTML má `noindex,nofollow`; `_headers` má `X-Robots-Tag: noindex, nofollow`; canonical a sitemap vycházejí z pracovní HTTPS adresy.
- Odkazy a lokální obrázek ověřuje build. Formulář není aktivní a skutečným klientům nebyla odeslána zpráva.
- Vizuální kontrola desktopu a mobilu nebyla možná: prohlížeč zamítl otevření lokálního náhledu. GitHub check Test and build prošel pro poslední commit PR i sloučený commit na main.

## Chybějící podklady a otevřené otázky
- Video banner dodá uživatel později. Logo a fotografie ze starého webu byly 13. 11. 2026 dohledány a začleněny do kopie pro GitHub Pages.
- Telefon, e-mail, adresa a rozsah služeb byly převzaty z původního webu; před ostrým zveřejněním potvrdit aktuálnost.
- E-mail a příjemce formuláře: neurčeny; bez jejich zadání formulář nezapojovat.
- Cloudflare přístup, vazba Workeru na GitHub a preview builds: nelze ověřit, protože přístup do Cloudflare dashboardu nebyl povolen.
- Pracovní doména: 12. 11. 2026 stále vrací z HTTP původní Apache web; HTTPS certifikát neodpovídá hostname. Není potvrzeno nasazení Workeru ani aktivní commit. Opravit směrování a certifikát, pak znovu ověřit.

## Další krok
- PR #1 byl sloučen do main jako commit `3488f77f266e1fe75ac8045b768fbc32ba03027a`; kontrola Test and build úspěšná.
- Nasazení je NEDOKONČENÉ. Zajistit přístup k Cloudflare Workeru `tesari-hradec`, ověřit produkční build main, vypnuté preview builds, připojit pracovní doménu s platným HTTPS a ověřit živý web včetně noindex a přesného commitu.

## Kopie pro GitHub Pages
- 12. 11. 2026: uživatel zadal kopii do veřejného repozitáře `sebrlicek-team/tesari-hradec` a úpravu pro GitHub Pages.
- Zdrojový commit klientského repozitáře: `4c1f10a90a239071405e23226c797760da4575ed`.
- Cílová projektová adresa: `https://sebrlicek-team.github.io/tesari-hradec/`; pracovní náhled zůstává `noindex`.
- GitHub Pages publikuje upravené `dist` podle `docs/GITHUB-PAGES.md`. Nastavení Pages a skutečné nasazení je nutné ověřit.
- Po prvním Pages deployi (commit `782f6b39d1eab2e0f83add0ff474538e8e8d8cbd`) workflow prošlo, ale výchozí adresa přesměrovává na `http://tesari-hradec.seb-dev.cloud/`; HTTPS certifikát vlastní domény neodpovídá hostname. Odkazy s cestou `/tesari-hradec/` na této doméně vracely 404. Relativní odkazy jsou připravené v následné opravě; finální volba domény a nové nasazení zbývají.
- Pro další sestavení se jako předpoklad používá stávající vlastní Pages doména `https://tesari-hradec.seb-dev.cloud/`; její HTTPS certifikát zatím není platný.
- Ověření po PR #3: commit `41b3e10b7de11d8aec17f46e7340307cb09e9042` má úspěšné kontroly `Test and build`, `build` i `deploy` v GitHub Actions. Na `http://tesari-hradec.seb-dev.cloud/` odpovídá všech 6 stránek, obrázek a 4 původní cesty; interní odkazy byly ověřeny, canonical a sitemap míří na `https://tesari-hradec.seb-dev.cloud/`, HTML má `noindex,nofollow` a robots.txt `Disallow: /`. HTTPS certifikát vlastní domény stále neodpovídá hostname, takže bezpečné nasazení není potvrzené. Vizuální kontrolu prohlížečem zamítla kontrola přístupu k této doméně.

## Doplnění materiálů ze starého webu (13. 11. 2026)
- HTTP adresa `http://tesari-hradec.cz.ccn2.profiwh.com/` je dostupná; z pěti stránek bylo uloženo logo, 20 fotografií realizací, titulní fotografie, texty a kontaktní údaje. Jediný nefunkční odkazovaný soubor je dekorativní obrázek v patičce kontaktní stránky (404).
- Do Pages webu jsou vybrány původní logo, titulní fotografie a po jedné fotografii pro každou ze tří služeb. Titulní ilustrace a poznámka o ilustraci se z aktivního obsahu odstranily.
- Původní web obsahuje MP4 video. Soubor je archivován mezi podklady, ale v aktivním banneru zůstává fotografie podle uživatelova zadání. Loga výrobců a staré technické CSS/JS nejsou převzaty do aktivního webu.
- Po aktualizaci ověřit `npm test && npm run build`, Pages přípravu, check `Test and build` a živé nasazení; HTTPS vlastní domény je samostatný otevřený problém.
- PR #5 se skutečnými materiály byl sloučen jako commit `a26b12be1ed9e56a8de238d415ca51ba5b23e82e`. Pro tento commit prošly kontroly `Test and build`, Pages `build` i `deploy`. Na HTTP vlastní doméně odpovídá všech šest stránek, logo a čtyři nové fotografie; SHA-256 každého zveřejněného obrázku odpovídá místnímu zdroji. HTML zůstává `noindex,nofollow`, robots.txt zakazuje procházení. HTTPS stále vrací chybu certifikátu pro jiný hostname; bezpečné veřejné zobrazení a vizuální kontrola mobilu zbývají.
