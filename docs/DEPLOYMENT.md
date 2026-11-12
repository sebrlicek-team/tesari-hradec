# Nasazení GitHub → Cloudflare Workers

## Vývojový katalog této šablony

V Cloudflare vytvořte samostatný Worker propojený s repozitářem `CCNplus/ccn-web-template`.

| Pole | Hodnota |
|---|---|
| Production branch | `main` |
| Root directory | kořen repozitáře |
| Build command | `npm test && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Název Workeru | `ccn-web-template` |

Wrangler publikuje pouze `dist`, která vzniká sestavením. Nevkládejte `--assets .`. Konfiguraci nekopírujte jako další soubor do `public`. Výstup `dist` se necommituje; Cloudflare jej vždy vytvoří. Pro dlouhodobý provoz lze po ověření konkrétního Wrangler vydání doplnit připnutou vývojovou závislost a lockfile.

Volitelnou subdoménu připojte přes Domains → Add → Custom Domain po úspěšném nasazení. Tento projekt sám nemění žádné existující klientské domény ani Worker.

## Jiná sestava

Build command například `npm test && npm run build -- milacek`. Pro nového klienta použijte novou konfiguraci a samostatný Worker s upraveným `name` ve wrangler.jsonc. Alternativně lze nastavit proměnnou SITE na název JSON bez přípony a ponechat běžný build příkaz.

## Před ostrým spuštěním

- Nahraďte ukázkové texty, SVG, kontakty a všechny odkazy na detailech.
- V konfiguraci nastavte skutečnou HTTPS URL a `indexable: true`. Formulář připojte ke společné službě podle FORMS.md a ověřte doručení, nebo zvolte `mailto` či formulář odstraňte.
- Projděte telefon, desktop, menu, galerii, video, kontakty, podstránky a 404.
- Připojte doménu přes Custom Domain. Kolizi starého A/CNAME řešte pouze pro příslušný webový hostname; zachovejte poštu.
- Zkontrolujte HTTPS a přesměrování www/bez www v Cloudflare. Šablona je sama nezakládá.
- Náhledy nechte noindex; důvěrná data chraňte Access. Noindex pouze žádá vyhledávače o neindexování.

Oficiální dokumentace ověřená při přípravě:
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/


## Automatické SEO a sestavení při deployi

Canonical, Open Graph URL a sitemap vznikají z `site.url` a cest stránek. `indexable` řídí meta robots, robots.txt a HTTP hlavičky. Build kontroluje shodu adres a indexace a při nesouladu skončí chybou. V robots.txt funguje hlavní URL i s koncovým lomítkem.

Wrangler nyní před nasazením automaticky spustí `node scripts/build.mjs`, takže publikuje čerstvý kompletní dist včetně sitemap.xml, robots.txt a _headers. Platí to i pro nové kopie vytvořené setupem. Nepoužívejte --no-bundle, který přeskakuje vlastní build.

Klienti s project.json: použijte `npm test && npm run build` a `npx wrangler deploy`. Pro starší kopie bez project.json vybírejte sestavu proměnnou SITE dostupnou také během deploye; pouhý argument předchozího build příkazu se do Wrangler buildu nepřenáší.

Ostré spuštění stále vyžaduje zadání skutečné hlavní domény a vědomé zapnutí indexace. U project.json sjednoťte url v obou konfiguracích a nastavte stage na production. Pracovní katalog zůstává noindex. Změny šablony se do existujících klientských repozitářů samy nepřenášejí.

## Cloudflare: náhledy větví standardně vypnuté

Výchozí postup CCN je nasazování z hlavní větve `main`. Při založení Workeru vypněte `Enable Preview builds`; u existujícího projektu v Settings → Builds → Previews Base vypněte `Builds for Preview branches`. Produkční buildy ponechte zapnuté. U Cloudflare Pages nastavte Settings → Branch control → Preview branch na `None (Disable automatic branch deployments)` a ponechte automatické produkční nasazování.

Toto nastavení je uloženo v Cloudflare, nekopíruje se přes GitHub Use this template ani přes npm run setup. Ověřte je u každého nového projektu a zapište do docs/PROJECT.md. `preview_urls` ve Wrangleru je jiné nastavení a nenahrazuje vypnutí buildů větví. Pracovní subdoména klient.ccn-dev.cz může dál běžet z main; její noindex se řídí samostatně konfigurací webu.

Náhledy větví zapínejte až na výslovný požadavek a po ověření jejich konfigurace včetně izolace serverových prostředků. Vypnutí náhledů nemění formuláře, obsah webu ani neslučuje pull requesty.

## Povinné ověření změn před publikováním

- Před úpravami přečtěte AGENTS.md, IMPLEMENTATION.md a docs/PROJECT.md; ověřte aktuální main, aktivní sestavu a skutečný název Cloudflare Workeru.
- Pracujte v samostatné větvi a otevřete pull request. Před sloučením musí projít celý `npm test && npm run build` pro aktuální změny. Syntaxe nebo izolovaný test nejsou náhradou. Kontroly nevypínejte pro obejití chyby.
- Workflow `.github/workflows/validate.yml` spouští stejné příkazy na GitHubu i pro pull requesty. Nepotřebuje Cloudflare Preview builds ani tajné klíče.
- Administrátor musí v každém repozitáři nastavit ochranu main s povinným checkem `Test and build` a požadavkem na pull request. Workflow samo nezakazuje přímý push; ochrana větve se s kopií šablony nepřenáší. Pokud přístup nebo tarif ochranu neumožňuje, označte tento limit výslovně.
- Nové generátory i importované stránky musí projít kontrolou odkazů a SEO; robots a canonical odvozujte z aktivní konfigurace pro všechny typy stránek.
- Po merge ověřte v Cloudflare úspěšné nasazení stejného commitu a živou adresu (obsah, podstránky, indexaci). Do docs/PROJECT.md zapište commit, výsledky a nedokončené kroky. Samotný push není hotové nasazení.
- Při selhání zachovejte poslední funkční web. Neopakujte deploy beze změny, pokud jde o reprodukovatelnou chybu testů.


## Přiměřené kontroly publikování

Standard zůstává `npm test && npm run build` a `npx wrangler deploy`. Blokujte skutečné chyby: nesestavitelný projekt, chybějící odkazované soubory, nebezpečné URL či zveřejnění technických souborů, překročený limit souboru, chybný Worker a nesoulad indexace s aktivní konfigurací.

SEO značky posuzujte podle významu, nikoli pořadí atributů, uvozovek, velikosti písmen nebo koncového lomítka. Produkce nemusí explicitně uvádět index,follow; náhled musí mít noindex. Pořadí URL v sitemapě není chyba.

Chybějící nebo odlišný canonical, chybějící či neúplná sitemap, chybějící pomocný robots.txt/_headers, duplicitní HTML ID, chybějící kotvy a doporučený počet hero sekcí jsou upozornění, nikoli důvod zastavit funkční web. Skutečný zákaz indexace na produkci nebo chybějící noindex v HTML náhledu zůstává chyba. Upozornění zaznamenejte k následné úpravě, nevyžadují souhlas k nasazení.

Nové blokující testy musí mít konkrétní důvod související s funkčností, bezpečností nebo schválenou indexací. Kosmetiku a redakční doporučení nevynucujte pádem buildu. Při falešném poplachu opravte kontrolu a přidejte příklad platné varianty; nevypínejte všechny kontroly. Zachovejte infrastrukturu šablony při importu nového obsahu. Změny šablony se do dříve vytvořených klientských repozitářů nepřenášejí automaticky.
