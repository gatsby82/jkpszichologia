# jkpszichologia.hu

Juhász Katalin pszichológus honlapja. Firebase Hostingon fut.

## Felépítés

| Útvonal | Tartalom | Forrás |
|---|---|---|
| `/`, `/*.htm`, `/pic/…`, `/picFelnott/…` | a jelenlegi (régi) statikus honlap, változatlanul | `legacy/` |
| `/v2/…` | az új Angular alkalmazás (fejlesztés alatt, `noindex`) | `src/` |

- **A régi oldal szerkesztése:** a fájlok a `legacy/` mappában vannak, pontosan úgy, ahogy korábban az FTP-n. A fájlnevekben **számít a kis- és nagybetű** (a régi IIS szerveren nem számított).
- **A `legacy/` mappában nem lehet `v2` nevű fájl vagy mappa**, mert az ütközne az Angular alkalmazással (a build ilyenkor hibát ad).

## Build

Node.js 22.22.3+ vagy 24.15+ kell (az Angular 22 ezt követeli meg).

```bash
npm ci
npm run build
```

A `npm run build` két lépésből áll:

1. `ng build` → az Angular app a `dist/site/v2/` mappába kerül (`baseHref: /v2/`)
2. `scripts/copy-legacy.mjs` → a `legacy/` tartalma a `dist/site/` gyökerébe másolódik

A Firebase a `dist/site/` mappát szolgálja ki (lásd `firebase.json`). Átirányítás csak a `/v2/**` útvonalakra van (→ `/v2/index.html`), a nem létező régi oldalak valódi 404-et adnak.

## Helyi futtatás

```bash
# csak az Angular app, élő újratöltéssel: http://localhost:4200/v2/
npm start

# a teljes oldal úgy, ahogy élesben fut (régi oldal + /v2): http://localhost:5000/
npm run build
npx firebase-tools emulators:start --only hosting --project demo-jkp
```

## Tesztek

```bash
npm test
```
