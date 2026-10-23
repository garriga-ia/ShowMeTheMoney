# 📘 ShowMeTheMoney · Guia de Desenvolupament i Arquitectura

> Aquest document serveix com a memòria tècnica i guia de continuïtat per reprendre el treball sobre la WebApp sense perdre el fil de cap decisió d'arquitectura, disseny o lògica comptable.

---

## 🎯 1. Visió General i Especificacions

- **Nom del projecte:** `ShowMeTheMoney` (Curs de Finances per a Joves de 16 a 18 anys).
- **Format:** Progressive Web App (PWA) instal·lable en HTML5, CSS3 i Vanilla JavaScript (sense frameworks ni dependències `npm`).
- **Suport Offline:** 100% autònom mitjançant Service Worker (`sw.js`) i precache d'actius.
- **Públic objectiu:** Adolescents de 16 a 18 anys que entren al món laboral o gestionen els seus primers diners.
- **Enfocament:** 100% Mobile-first (optimitzat per a pantalla de telèfon mòbil en vertical, pantalla completa `standalone`).
- **Desplegament:**
  - Repositori privat a GitHub: `https://github.com/garriga-ia/ShowMeTheMoney`
  - Desplegament automàtic a Vercel connectat a la branca `main`.

---

## 🧭 2. Arquitectura de Navegació i Rutes (`hash-based`)

L'aplicació utilitza un router senzill basat en `window.location.hash`:

```
                       ┌──────────────────────┐
                       │   #welcome (VISTA 0) │  <-- Portada i instruccions (Ruta per defecte)
                       └──────────┬───────────┘
                                  │ "Començar el Curs"
                                  ▼
                       ┌──────────────────────┐
                       │  #dashboard (VISTA 1)│  <-- Catàleg de 4 blocs, 12 capítols i reinici
                       └──────────┬───────────┘
                                  │ Clic a un capítol
                                  ▼
                       ┌──────────────────────┐
                       │ #chapter-X (VISTA 2) │  <-- Reproductor de xat interactiu continu
                       └──────────────────────┘
```

### Comportament de la barra superior fixa (`.navbar`):
1. **A la Portada (`#welcome`) i al Tauler (`#dashboard`):**
   - Es mostra la marca `btn-home-brand` (`💸 ShowMeTheMoney · Finances Joves`).
   - El botó `btn-nav-back` (`← Índex`) està **amagat**.
2. **Dins del reproductor del capítol (`#chapter-X`):**
   - La marca `btn-home-brand` està **amagada** per estalviar espai horitzontal al mòbil.
   - Es mostra el botó compacte `btn-nav-back` (`← Índex`), que retorna directament a `#dashboard`.
   - La píndola del moneder (`#stat-wallet-pill`) i els controls d'accessibilitat (So, Lletra `Aa`, Tema `🌓`) queden sempre visibles a la part superior sense cap moviment lateral.

---

## 👥 3. Personatges i Sistema d'Avatars (`js/colla.js`)

L'app compta amb 6 personatges amb rols i estils ben definits:

| Personatge | Rol / Arquetip | Color identificador | Imatge 3D (Memoji/Pixar) |
|---|---|---|---|
| **Marc** | *El calculador* (fa números abans de gastar) | `var(--n-marc)` (`#8fb4dd`) | `img/avatars/marc.jpg` |
| **Nil** | *L'impulsiu* (FOMO i ganes de viure) | `var(--n-nil)` (`#f09a63`) | `img/avatars/nil.jpg` |
| **Marta** | *La prudent* (primer el coixí de seguretat) | `var(--n-marta)` (`#7fce9b`) | `img/avatars/marta.jpg` |
| **Aina** | *La que s'ho mira tot* (llegeix la lletra petita) | `var(--n-aina)` (`#c19ae0`) | `img/avatars/aina.jpg` |
| **Pau** | *El que ja ha treballat* (experiència laboral) | `var(--n-pau)` (`#e6c25a`) | `img/avatars/pau.jpg` |
| **Tu** | *El protagonista* (pren les decisions) | `var(--teal)` (`#2fe6a7`) | `img/avatars/tu.jpg` |

### Tolerància a fallades (*fallback*):
La propietat `COLLA[k].avatar` renderitza:
```html
<img src="img/avatars/X.jpg" class="avatar avatar-img" alt="Nom" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-block';">
<span class="avatar-fallback" style="display:none;">[SVG original de fallback]</span>
```
Si les imatges tarden a carregar o no estan disponibles, el navegador mostra automàticament la il·lustració vectorial SVG sense trencar el disseny.

---

## 💰 4. Comptabilitat, Estat i Moneder (`js/state.js`)

- **Saldo base de partida:** `100,00 €` (simulant l'estalvi previ del jove).
- **Ingrés de la nòmina (Capítol 1):**
  - Contracte: **1.400,00 € bruts al mes**.
  - Deduccions: Seguretat Social 6,55 % (−91,70 €) + IRPF 2 % (−28,00 €).
  - **Net ingressat:** **1.280,30 €**.
  - Nou saldo al compte: `100,00 € + 1.280,30 € = 1.380,30 €`.
- **Regla de les 3 bosses (Capítol 1 - Pas 2):**
  - Calculada sobre **1 sola nòmina mensual** (`1.280,30 €`):
    - *Coixí (50%):* `640,15 €` (cobreix de sobres els 540 € d'imprevistos amb 100,15 € de marge).
    - *Gastar ara (30%):* `384,09 €`.
    - *Metes i estalvi futur (20%):* `256,06 €`.
- **Prevenció de duplicats d'estalvi:**
  - `ChatEngine.notifyMoneyChange(delta, label, el)` suma directament a `AppState.virtualSavings` i dispara monedes volant + gran banner emergent (`#money-banner-overlay`).
  - Quan es completa el capítol, es crida `AppState.completeChapter(1, 0, archetype)` (amb `0` com a guany addicional) per no duplicar diners ja ingressats.
- **Botó de Reinici:**
  - Situat a la part inferior de `#view-dashboard` (`.btn-reset-clean`), neteja `localStorage` i restaura el saldo a `100,00 €`.
  - En arrencar el Capítol 1, s'assegura sempre el saldo base de `100,00 €` per si s'ha rejuga.

### 🔒 Desbloqueig Seqüencial i Sistema de Ratxa (Streak 🔥)

1. **Desbloqueig Seqüencial Estricte:**
   - El **Capítol 1** sempre està desbloquejat.
   - El **Capítol N** s'activa **únicament quan s'ha completat el Capítol N-1** (`AppState.isUnlocked(n) === true`).
   - Si un usuari intenta forçar la navegació a `#chapter-X` abans d'hora, el router el redirigeix al Tauler i mostra un avís emergent (`#locked-chapter-toast`) amb so de candau (`SoundFX.playLock()`).
   - Al tauler, el capítol actiu que toca jugar es destaca amb la classe `.active-cur` i l'etiqueta `🎯 El teu següent repte`. Els capítols superats es poden rejugar lliurement (`Rejugar ↺`).
2. **Sistema de Fidelització per Ratxa (Streak):**
   - Comptador de dies consecutius aprenent finances (`AppState.getStreak()`).
   - Píndola fixa a la capçalera (`.stat-pill.streak`) i targeta dedicada al tauler (`.dash-streak-card`).
   - Mini calendari setmanal interactiu de 7 dies (Dilluns a Diumenge) amb flama animada.
   - Si l'usuari entra en dies consecutius, la ratxa augmenta (+1 dia); si passa més d'un dia sense entrar, es reinicia a 1 dia per fomentar la constància diària dels adolescents.
   - A la pantalla final de capítol (`ChatEngine.celebrate`), es reforça la fita amb la flama de la ratxa i el recordatori de tornar demà.

---

## 📱 5. Tipografia i Disseny Mòbil-First

### Variable global `--font-scale`:
Configurada mitjançant classes a `<html>` i `<body>`:
- `font-sm`: `--font-scale: 0.9`
- `font-md`: `--font-scale: 1.05`
- `font-lg`: `--font-scale: 1.25` (**per defecte a l'arrencada per garantir màxima llegibilitat a mòbil**)

### Caixes d'informació, contractes i calculadores:
Tots els widgets incrustats al xat (`.chat-embed-card`, `.fineprint-card`, `.clause-hidden`, `.note`, `.allocator-box`, `.revolving-sim-box`, etc.) tenen regles d'alta especificitat:
- Paràgrafs i text base dins de caixes: `calc(15px * var(--font-scale, 1))` (en mode `lg` arriba a ~18,7px).
- Títols de contractes i capçaleres: `calc(17px * var(--font-scale, 1))`.
- Notes i lletra petita (`.note`, `.clause-hidden`): `calc(14.5px * var(--font-scale, 1))` amb `line-height: 1.55`.
- Inputs de formulari (`.txtin`): `calc(16px * var(--font-scale, 1))` i alçada mínima de 44px (evita el zoom automàtic d'iOS).

---

## 📂 6. Mapa de Fitxers Clau

```
C:\aplicacions\adri\
├── index.html                   # HTML principal (Vistes #welcome, #dashboard, #player, modal)
├── manifest.webmanifest         # Manifest PWA (nom, colors, icones, standalone)
├── sw.js                        # Service Worker (precache estàtic i suport 100% offline)
├── css/
│   ├── app.css                  # Estils globals, navbar fixada, tipografia escalable, dashboard i portada
│   ├── chat.css                 # Estils del reproductor de xat continu, bombolles, missatges i avatars
│   └── widgets.css              # Totes les caixes d'interacció, contractes, targetes, taules i simuladors
├── js/
│   ├── state.js                 # Gestió de l'estat global reactiu (localStorage, moneder, capítols)
│   ├── sound.js                 # Web Audio API (síntesi de xip, monedes, errors i fanfàrria)
│   ├── colla.js                 # Personatges, rutes d'imatges 3D i generador SVG de fallback
│   ├── engine.js                # ChatEngine (control del feed de xat, typing, animació de diners)
│   └── data/                    # ⭐️ FONT ÚNICA DE VERITAT DE CONTINGUT (SOLS .JS)
│       ├── capitols-index.js    # Índex pedagògic, blocs i metadades dels 12 capítols
│       ├── capitol1.js          # El primer sou (nòmina, brut vs net, 3 bosses, hores de feina)
│       ├── capitol2.js          # Bancs, comptes i targetes (lletra petita, dèbit vs crèdit, revolving)
│       ├── capitol3.js          # Estafes digitals i Bizum (Wallapop, phishing)
│       ├── capitol4.js          # Despeses formiga i subscripcions (regla 48h)
│       ├── capitol5.js          # Pressupost d'oci i pressió de grup
│       ├── capitol6.js          # Finançament de mòbils a terminis i TAE
│       ├── capitol7.js          # El coixí d'emergència
│       ├── capitol8.js          # Metes SMART i pagar-te primer
│       ├── capitol9.js          # Inflació, interès compost i ETFs vs fum
│       ├── capitol10.js         # Contracte laboral d'adult i nòmina real
│       ├── capitol11.js         # Declaració de la Renda i 2 pagadors
│       └── capitol12.js         # Emancipació i regla del 30% al lloguer
├── md/                          # Fitxers Markdown generats automàticament (NO editar a mà!)
├── scripts/
│   └── sync-md.js               # Script per sincronitzar automàticament js/data/*.js cap a md/
└── img/
    ├── icon-192.png             # Icona PWA estàndard 192x192
    ├── icon-512.png             # Icona PWA d'alta resolució 512x512
    ├── icon-maskable.png        # Icona adaptativa (maskable) per a Android
    ├── apple-touch-icon.png     # Icona optimitzada per a iOS Safari (180x180)
    ├── icon.svg                 # Vectorial SVG de màxima fidelitat
    ├── avatars/                 # Imatges 3D dels personatges (marc, nil, marta, aina, pau, tu)
    └── og-show-me-the-money.png # Targeta Open Graph per a xarxes socials i WhatsApp
```

---

## 📲 8. Arquitectura PWA (Progressive Web App) i Suport Offline

1. **Instal·lació nativa a la pantalla d'inici:**
   - Mitjançant `manifest.webmanifest`, l'aplicació s'obre en mode `display: standalone` sense les barres del navegador, com si fos descarregada d'una botiga d'aplicacions.
   - S'ofereix el botó interactiu `📲 Instal·lar com a App` connectat a l'esdeveniment estàndard `beforeinstallprompt` (Chrome, Edge, Android) i amb guia gràfica per a Safari a iOS.
2. **Estratègia de memòria cau (`sw.js`):**
   - Durant l'esdeveniment `install`, el Service Worker precatxeja els 35 recursos essencials del curs.
   - Estratègia híbrida *Stale-While-Revalidate* + *Cache-First*: l'aplicació s'obre instantàniament des de la memòria del telèfon i actualitza el contingut transparentment si hi ha connexió activa.
   - Si no hi ha cobertura o està en mode avió, tot el curs és **100% jugable offline**.

---

## ⭐️ 7. Font Única de Contingut i Regla d'Or d'Edició

> **REGLA D'OR:** MAI s'editen dues versions d'un capítol.
> L'aplicació web (SPA) només necessita i només executa els fitxers `.js` dins de `js/data/`.
> 
> - **Font Única de Veritat:** `js/data/capitolX.js` i `js/data/capitols-index.js`.
> - **Prohibit:** Crear o mantenir fitxers `.md` manuals dins de `js/data/` o editar directament a `md/`.
> - **Sincronització de documentació:** Per regenerar la carpeta `md/` a partir del codi JavaScript oficial, s'executa simplement:
>   ```powershell
>   npm run sync-md
>   # o directament: node scripts/sync-md.js
>   ```

---

## ⚙️ 9. Pautes per al Manteniment i Futurs Desenvolupaments

1. **Editar contingut:** Modificar únicament `js/data/capitolX.js`.
2. **Sincronitzar markdown (opcional):**
   ```powershell
   node scripts/sync-md.js
   ```
3. **Comprovar la sintaxi abans de fer commit:**
   ```powershell
   npm run check
   # o: node -c js/state.js js/sound.js js/colla.js js/engine.js js/data/capitols-index.js js/data/capitol*.js
   ```
4. **Pujar canvis a producció:**
   ```powershell
   git add .
   git commit -m "Descripció clara dels canvis"
   git push origin main
   ```
   *Vercel detecta automàticament el `push` i actualitza la web en 15-20 segons.*
5. **Mantenir la integritat del disseny mòbil:**
   - Evitar marges o amplades fixes superiors a `100vw`.
   - Assegurar que qualsevol botó o element tàctil tingui com a mínim 44px d'alçada.
   - Fer servir sempre `var(--font-scale, 1)` per a qualsevol nova mida de text.
