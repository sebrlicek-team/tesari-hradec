# Pokyny pro práci se šablonou CCN

## Indexace při spuštění webu

Při každém ostrém spuštění klientského webu povinně zkontrolujte indexaci. Tento krok nesmí zůstat opomenutý.

- Katalog template.ccn-dev.cz a pracovní náhledy ponechte s `indexable: false`.
- Při uživatelem požadovaném ostrém spuštění veřejného klientského webu nastavte v aktivní konfiguraci `sites/*.json` skutečnou HTTPS doménu v `url` a `indexable: true`, pokud uživatel výslovně nechce web neindexovat.
- Před zapnutím nahraďte ukázkový obsah a kontakty a vyřešte demo formulář podle docs/DEPLOYMENT.md.
- Po nasazení ověřte na skutečné doméně robots.txt, sitemap.xml, canonical, meta robots a HTTP hlavičku X-Robots-Tag. Ostrý indexovatelný web nesmí obsahovat noindex ani zákaz procházení.
- V předání uveďte, zda byla indexace zapnutá a ověřená. Pokud není možné ověření, výslovně to označte jako zbývající krok.
- Povolení indexace nezaručuje zařazení do výsledků vyhledávání. Noindex není ochrana důvěrných dat.


## Nové klientské projekty a iterace

Při tvorbě klientského webu z tohoto základu postupujte podle IMPLEMENTATION.md. Založte a udržujte docs/PROJECT.md se zadáním, schválenými rozhodnutími, aktivní konfigurací, stavem ověření a dalším krokem. Respektujte uživatelem zadaný rozsah iterace; nepovažujte podklady nebo návrhy za schválení. Klientské úpravy provádějte v jeho kopii, nikoli v katalogu šablony.

## Formuláře: testovací a ostrý provoz

- Používejte centrální odesílání podle docs/FORMS.md. V klientském webu stačí form.mode=server; výchozí endpoint, sitekey a action contact jsou společné.
- Pro testovací weby pod ccn-dev.cz je Turnstile povolen společně. Při přípravě formuláře zjistěte testovací příjemce: použijte už zadané adresy, jinak se zeptejte. Nevymýšlejte je a nepřebírejte automaticky příjemce katalogu ani kontakty klienta.
- Do previewRecipients v centrálním CCNplus/ccn-web-template přidejte subdoménu a schválené e-maily. Příjemce nikdy neurčuje prohlížeč. Neznámý web nemá výchozího příjemce. Testovací zprávy mají [TEST].
- Při ostrém spuštění ověřte finální doménu a klientské příjemce, založte oddělený productionForms záznam a povolte finální doménu v Turnstile. Zachovejte testovací nastavení odděleně. Ověřte doručení a Reply-To; zapište výsledky do docs/PROJECT.md.
- Odesílatel zůstává forms@ccn.cz, pokud nebyla zvlášť dohodnuta a ověřena klientská odesílací doména. Změna příjemce nevyžaduje nový Resend účet.

## Automatická příprava klienta

V nové klientské kopii použijte `npm run setup -- --slug klient --name "Název klienta" --url https://klient.ccn-dev.cz --from milacek` podle IMPLEMENTATION.md. Nevytvářejte ručně odlišná jména Workeru a sestavy. Pro klienta s project.json používejte build bez argumentu a bez starého SITE. Setup neopakujte v rozpracovaném projektu a nepoužívejte jej v centrálním katalogu.

## Výchozí nastavení náhledů Cloudflare

Při založení každého nového projektu vypněte `Enable Preview builds` / `Builds for Preview branches` a ponechte automatické nasazování `main`. Ověřte a zaznamenejte stav do docs/PROJECT.md. Nastavení se nekopíruje s GitHub šablonou; přesný postup a rozlišení od pracovní subdomény a indexace jsou v [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#cloudflare-náhledy-větví-standardně-vypnuté). Formuláře kvůli této volbě neměňte.

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
