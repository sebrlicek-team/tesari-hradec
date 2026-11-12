# GitHub Pages: Tesaři Hradec

Toto je kopie klientského webu z [CCNplus/tesari-hradec](https://github.com/CCNplus/tesari-hradec), zdrojový commit `4c1f10a90a239071405e23226c797760da4575ed`. Cílový repozitář je veřejný. Cloudflare konfigurace zůstává v repozitáři pro zachování zdrojové infrastruktury, ale GitHub Pages publikuje pouze sestavené `dist`.

## Publikování

- Adresa projektového webu: `https://sebrlicek-team.github.io/tesari-hradec/`.
- V Settings → Pages nastavte Build and deployment → Source: GitHub Actions.
- Workflow `.github/workflows/pages.yml` běží pouze po pushi na `main` nebo ručním spuštění. Nejprve vykoná `npm test && npm run build`, poté `node scripts/prepare-github-pages.mjs` a nasadí `dist`.
- Workflow `.github/workflows/validate.yml` zachovává kontrolu `Test and build` pro pull requesty.
- Preview nasazení větví se nevytvářejí.

## Cesty a indexace

Základ šablony používá absolutní cesty od kořene webu. Přípravný skript je pro projektovou GitHub Pages adresu doplní o `/tesari-hradec/`, přepíše canonical a sitemap, zkontroluje odkazy a vytvoří náhradní HTML přechody pro čtyři původní cesty `.htm`. GitHub Pages neposkytuje v tomto projektu skutečné HTTP 301 z `_redirects`; HTML přechody používají meta refresh a odkaz.

Náhled zůstává `noindex,nofollow` v každém HTML včetně 404 a starých cest. GitHub Pages ignoruje soubor `_headers`, takže na této platformě nelze z projektu nastavit `X-Robots-Tag`. Soubor `robots.txt` v projektové cestě není kořenovým robots souborem celé domény github.io; zákaz indexace proto stojí na meta robots v HTML. Produkční doména a povolení indexace vyžadují samostatné zadání.

Formulář v této kopii není aktivní. Kontakty zůstávají telefon a `mailto`; žádné zprávy se při testování neodesílají.

## Ověření

Před předáním spustit `npm test && npm run build && node scripts/prepare-github-pages.mjs`, ověřit workflow `Test and build` pro poslední commit PR a po merge úspěšné nasazení stejného commitu na projektové adrese. Zkontrolovat šest stránek, obrázek, mobilní navigaci, canonical, sitemap a noindex.
