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
- Vzhled: tmavě zelená, teplá měděná, světlé pozadí; široká ilustrační fotografie krovu. Značka je zatím textová, protože přiložené logo není k dispozici a stažení loga ze starého webu prohlížeč nepovolil.
- Fotografie `public/assets/tesari-hero.jpg` je generovaná ilustrace, nikoli realizace klienta. Video banner se doplní později.

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
- Logo, video banner a skutečné fotografie: dodá uživatel; potom nahradit textovou značku a ilustrační fotografii.
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
