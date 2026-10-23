# jkpszichologia.hu – átadás Bencének

*2026. október 23. · Juhász Mátyás*

Szia Bence!

Ebben a leírásban összeszedtem, mi változott az oldal körül az elmúlt két napban, és hogyan dolgozunk vele ezentúl. A lényeg röviden:

- **Az oldal már nem a Forpsi tárhelyén fut**, hanem a Firebase Hostingon, HTTPS-sel. A domain a Forpsinál maradt.
- **Ezentúl nincs FTP.** Minden módosítás a GitHub-repón keresztül megy: ág → pull request → előnézet → merge → automatikus élesítés.
- **Kaptál hozzáférést** a GitHub-repóhoz (meghívó a `numasi` fiókodra) és a Google Search Console-hoz (teljes jog).

---

## 1. Mi történt

| Mikor | Mi |
|---|---|
| okt. 22. | A régi oldal teljes tartalma bekerült a GitHub-repó `legacy/` mappájába (az FTP-ről, az `aspnet_client/`, az üres `egyeb/` és a `Thumbs.db` fájlok nélkül). |
| okt. 22. | Firebase Hosting projekt és GitHub Actions: minden PR saját előnézeti címet kap, a `main`-re merge-ölt változás automatikusan élesre megy. |
| okt. 22. | A menük és címképek javítása, a Rendelőbérlés menüpont új helyre került (PR #3). |
| okt. 23. reggel | Domain átállítása: a Forpsi DNS-ben a gyökérdomain A rekordja a Firebase-re mutat, a `www` CNAME a `jkpszichologia-hu.web.app`-ra. A levelezés rekordjai (MX, imap, pop3, smtp, webmail, SRV) nem változtak. |
| okt. 23. | A HTTPS-tanúsítvány a gyökérdomainre és a `www`-re is elkészült. A `www` a gyökérre irányít. |
| okt. 23. | `sitemap.xml`, `robots.txt` és a strukturált adatok `https://`-re; a megszűnt `goo.gl` térképlinkek helyett sima Google Maps link (PR #4). |
| okt. 23. | Google Search Console: Domain tulajdon igazolva (DNS TXT rekorddal), sitemap beküldve, a Google mind a 17 címet beolvasta belőle; a kezdőoldalra indexelés kérve. |

A Forpsi-tárhelyre feltöltött fájlok **már nem jelennek meg élesben**. A tárhelyet később lemondjuk, ami ott van, az elveszik.

---

## 2. Fontos címek

| Mi | Hol |
|---|---|
| Éles oldal | https://jkpszichologia.hu (a `www` ide irányít) |
| GitHub-repó (nyilvános) | https://github.com/gatsby82/jkpszichologia |
| Firebase alapcím | https://jkpszichologia-hu.web.app |
| PR-előnézet | minden PR-hez saját cím; a `github-actions[bot]` kommentben írja a PR alá |
| Élesítés állapota | a repó **Actions** fülén |
| Search Console | https://search.google.com/search-console (Domain tulajdon: `jkpszichologia.hu`) |

A Firebase-fiókhoz és a Forpsihoz nem kell hozzáférned.

---

## 3. A repó felépítése

| Útvonal | Mi van benne | Szerkeszted? |
|---|---|---|
| `legacy/` | a régi oldal: `f*.htm` (felnőtt), `gy*.htm` (gyermek), `index.html`, `pic/`, `picFelnott/`, `sitemap.xml`, `robots.txt`, `.kml` térképek | **igen** |
| `src/`, `public/`, `angular.json`, `tsconfig*.json` | egy új, Angularos oldal kezdeménye a `/v2` alatt (fejlesztés alatt, `noindex`) | nem |
| `scripts/copy-legacy.mjs` | build után a `legacy/`-t a kimenet gyökerébe másolja | nem |
| `firebase.json` | hosting-beállítás; átirányítás csak a `/v2/**` útvonalakra | nem |
| `.github/workflows/` | PR → előnézet, merge a `main`-re → élesítés | nem |

A `legacy/`-ben nem lehet `v2` nevű fájl vagy mappa, mert ütközne az új oldallal.

---

## 4. Hogyan dolgozz vele

### Egyszeri beállítás

1. Fogadd el a GitHub-meghívót (e-mailben jön, vagy a https://github.com/notifications oldalon látod).
2. Klónozd a repót:

   ```bash
   git clone https://github.com/gatsby82/jkpszichologia.git
   ```

3. Ennyi. **A régi oldal szerkesztéséhez nem kell Node.js, npm vagy Angular**: a buildet és az élesítést a GitHub végzi. Node.js 24 csak akkor kell, ha a `/v2` oldallal is foglalkozni akarsz (lásd lent).

A saját helyi git-repódat ne pushold rá: a GitHub-repó a közös kiindulópont. Ha van még ki nem tett javításod, egy új ágon fájlonként másold át a `legacy/` mappába, és commit előtt nézd át a diffet.

### Egy módosítás menete

1. **Friss `main`, új ág:**

   ```bash
   git switch main
   git pull
   git switch -c content/marianna-bemutatkozas
   ```

2. **Szerkesztés** a `legacy/` mappában. Egy ág = egy kérés (pl. Kati egy levelének pontjai).
3. **Helyi ellenőrzés:** nyisd meg a `legacy/index.html`-t (vagy az épp szerkesztett oldalt) böngészőben, mentés után F5. Minden hivatkozás relatív, így a képek és a linkek fájlból is működnek; csak a teljes `https://jkpszichologia.hu/…` címre mutató linkek visznek az éles oldalra. Nézd meg asztali és mobil nézetben (DevTools), a felnőtt és a gyermek oldalon is. Élő frissítéshez jó a VS Code „Live Server” kiegészítője a `legacy` mappán.
4. **Commit és push:**

   ```bash
   git add legacy/
   git commit -m "Marianna bemutatkozó szövegének frissítése"
   git push -u origin content/marianna-bemutatkozas
   ```

5. **Pull request** a GitHubon a `main`-re. A leírásba röviden: mit és miért.
6. **Előnézet:** pár perc múlva a bot kommentben megadja a PR saját címét (erről GitHub-értesítést is kapsz). Ott nézd át, és ezt a linket küldd Katinak jóváhagyásra. Ha javítasz, pusholj ugyanarra az ágra: a link ugyanaz marad, a tartalma frissül. Az előnézeti címek 7 nap után lejárnak; egy új push újraéleszti.
7. **Merge:** jóváhagyás után merge. Az **Actions** fülön elindul az élesítés (2–3 perc). Utána nézd meg élesben is, majd töröld az ágat.

A `main` védett: közvetlenül pusholni, force pusholni vagy törölni nem lehet, csak PR-rel kerülhet rá változás.

### Csak ha a `/v2`-vel is foglalkozol

Node.js 24 kell (a 22.22.3+ is működik). Egyszer: `npm ci` a repó gyökerében. Utána:

- `npm run start:v2` → az Angular-oldal: http://localhost:4200/v2/
- `npm start` → a régi oldal élő frissítéssel: http://localhost:8080
- `npm run build`, majd `npx firebase-tools emulators:start --only hosting --project demo-jkp` → a teljes oldal úgy, mint élesben: http://localhost:5000

(A README-ben az `npm start` leírása még a régi; a fenti a helyes.)

### Ha mégis hiba kerül élesre

A hibát okozó, már merge-ölt PR oldalán kattints a **Revert** gombra. Ez új PR-t nyit, ami visszavonja a változást; előnézet, merge, és pár perc múlva helyreáll. Szólj nekem és Katinak egy sorban. Végső esetben a Firebase Console-ban egy korábbi kiadás egy kattintással visszaállítható; ehhez én férek hozzá.

---

## 5. Csapdák a régi oldalon

Ezek okozták a tegnapi szétesést is.

- **DOCTYPE:** a meglévő XHTML 1.0 Transitional doctype-ot ne cseréld `<!DOCTYPE html>`-re. Szabványos módban a képek alatt rés marad a betűszáraknak, és a gyermek menü csíkos lesz. A „majdnem szabványos” mód ezt elkerüli; SEO-szempontból a doctype nem számít.
- **Kis- és nagybetű:** a Firebase megkülönbözteti a fájlnevekben (`Pic/` ≠ `pic/`), a régi IIS nem tette. Linkeléskor a fájlnevet pontosan másold ki.
- **Elrendezés:** a táblázatszerkezethez, a cellaszélességekhez és a CSS-hez tartalmi módosításnál ne nyúlj. Ha mégis kell, a PR-előnézetben minden oldalon nézd meg.
- **Ékezetek:** a fájlok UTF-8-ban vannak; mentés után nézd meg az „ő, ű” betűket.
- **Nincs „minden → index.html” átirányítás** a `firebase.json`-ban, különben a régi oldalak és a 404-ek elromlanak.
- **Térkép:** `goo.gl` rövid linket ne használj, megszűnt; sima Google Maps link kell.
- **Windows/PowerShell:** az `echo … >> fájl` UTF-16-ban ír; szövegfájlt szerkesztőben módosíts.
- **Analitika:** szándékosan nincs (GDPR, érzékeny látogatói kör). Ne tegyél be Google Analyticset vagy más követőkódot.

---

## 6. A gomb- és címképek

A régi oldal menügombjai és címei képek (JPG, fix `width`/`height`), a gombok `MM_swapImage`-dzsel cserélődnek (alap + mouseover kép). Új menüpont vagy cím = új kép **pontosan ugyanabban a stílusban és méretben**.

A Rendelőbérléshez szükséges képeket **Claude segítségével készítettem**: odaadtam neki a meglévő gomb- és címképeket mintának, és azok alapján elkészítette ugyanabban a stílusban, más szöveggel. A régi forrásfájlokat (18 évvel ezelőtti grafikák) nem kellett előkeresni.

| Fájl | Méret | Megjegyzés |
|---|---|---|
| `picFelnott/gombRendeloberles01.jpg` | 115×18 | felnőtt fejléc gomb, EB Garamond Italic |
| `picFelnott/gombRendeloberlesMO01.jpg` | 115×18 | mouseover: kb. 12%-kal nagyobb betű + aláhúzás |
| `picFelnott/cimRendelob01.jpg` | 106×22 | felnőtt oldali cím (`width="106"`) |
| `pic/cim_rendelob_01.jpg` | 606×51 | gyermek oldali cím; a betűk merőlegesek a hullámos vonalra |
| `pic/gomb_Menu90FelnottT_110.jpg` | 120×18 | „Felnőtt rendelés” 110%-on |
| `pic/gomb_Menu90Rendeloberles_110.jpg` | 120×18 | „Rendelőbérlés” ugyanebben a stílusban |

A gyermek menü narancs oszlopából a Rendelőbérlés kikerült; a „Felnőtt rendelés” link mellé került.

**Ha új gomb- vagy címkép kell, szólj nekem**, és ugyanezzel a módszerrel elkészítem. Kérlek, ne CSS-szel vagy szöveggel pótold a kép helyett, mert az elcsúszik a táblázatos elrendezésben.

---

## 7. Ismert, még nyitott apróságok

Nem sürgősek; ha Kati kéri, vagy úgyis arra jársz:

- `fBemut.htm`: üres link a `rendeloHipn01.jpg`-re; a „30 év” elavult; a végzettségek sorrendje (a 2005-ös a 2001-es előtt áll).
- Rendelőbérlés oldal: az ár mellől hiányzik a mértékegység (óránként?); „coach-ok” → „coachok”; „időszakaszokra” → „időszakokra”.
- `gyIndex.htm`: régi, sehonnan nem linkelt oldal 2 hiányzó képpel.
- A `legacy/`-ben 71 régi kép/fájl van, amire semmi nem hivatkozik; később takarítható.
- A gyermek oldalakon bent maradt egy flexboxos CSS-blokk, ami a doctype-javítás óta felesleges.

---

## 8. Ami még hátravan (nálam)

- A Forpsi-tárhely lemondása, miután tisztáztam, hogy a `@jkpszichologia.hu` postafiók nem tartozik-e hozzá.
- A Search Console-ban figyeljük, hogyan áll át az indexelés a `https://` címekre (néhány nap).
- A modernizálásról (újraírás, redesign, `/v2`) Katival később beszélünk. Ő egyelőre nem tervezi, mert nem ez a fő honlapja.

Ha bármi kérdésed van, írj nyugodtan, vagy nyiss egy issue-t a repóban.

Üdv,
Mátyás
