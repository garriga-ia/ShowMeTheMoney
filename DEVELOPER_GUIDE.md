# 📘 ShowMeTheMoney · Guia de Desenvolupament i Arquitectura

> Aquest document serveix com a memòria tècnica i guia de continuïtat per reprendre el treball sobre la WebApp sense perdre el fil de cap decisió d'arquitectura, disseny o lògica comptable.

---

## 🎯 1. Visió General i Especificacions

- **Nom del projecte:** `ShowMeTheMoney` (Curs de Finances per a Joves de 16 a 18 anys).
- **Format:** Single Page Application (SPA) pura en HTML5, CSS3 i Vanilla JavaScript (sense frameworks ni dependències `npm`).
- **Públic objectiu:** Adolescents de 16 a 18 anys que entren al món laboral o gestionen els seus primers diners.
- **Enfocament:** 100% Mobile-first (optimitzat per a pantalla de telèfon mòbil en vertical).
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
├── css/
│   ├── app.css                  # Estils globals, navbar fixada, tipografia escalable, dashboard i portada
│   ├── chat.css                 # Estils del reproductor de xat continu, bombolles, missatges i avatars
│   └── widgets.css              # Totes les caixes d'interacció, contractes, targetes, taules i simuladors
├── js/
│   ├── state.js                 # Gestió de l'estat global reactiu (localStorage, moneder, capítols)
│   ├── sound.js                 # Web Audio API (síntesi de xip, monedes, errors i fanfàrria)
│   ├── colla.js                 # Personatges, rutes d'imatges 3D i generador SVG de fallback
│   ├── engine.js                # ChatEngine (control del feed de xat, typing, animació de diners)
│   └── data/
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
└── img/
    ├── avatars/                 # Imatges 3D dels personatges (marc, nil, marta, aina, pau, tu)
    └── og-show-me-the-money.png # Targeta Open Graph per a xarxes socials i WhatsApp
```

---

## ⚙️ 7. Pautes per al Manteniment i Futurs Desenvolupaments

1. **Comprovar la sintaxi abans de fer commit:**
   ```powershell
   node -c js/state.js js/sound.js js/colla.js js/engine.js js/data/capitol*.js
   ```
2. **Pujar canvis a producció:**
   ```powershell
   git add .
   git commit -m "Descripció clara dels canvis"
   git push origin main
   ```
   *Vercel detecta automàticament el `push` i actualitza la web en 15-20 segons.*
3. **Mantenir la integritat del disseny mòbil:**
   - Evitar marges o amplades fixes superiors a `100vw`.
   - Assegurar que qualsevol botó o element tàctil tingui com a mínim 44px d'alçada.
   - Fer servir sempre `var(--font-scale, 1)` per a qualsevol nova mida de text.
