# 💸 ShowMeTheMoney · Curs de Finances per a Joves (16–18 anys)

> **SHOW ME THE MONEY!**  
> Aprèn a gestionar la pasta sense rotllos ni enganys. 12 capítols pràctics de 8 minuts en format xat interactiu. Pren decisions reals amb la teva colla abans de fer els 18 anys.

---

## 🚀 Què és aquest projecte?

Una aplicació web interactiva, moderna i gratuïta pensada perquè adolescents i joves d'entre 16 i 18 anys adquireixin una educació financera sòlida, pràctica i emocionalment realista:
- **Format xat interactiu continu**: La història avança mitjançant converses de grup amb personatges reals (Marc, Nil, Marta, Aina i Pau).
- **Conseqüències reals**: Abans de donar la moralina teòrica, les decisions equivocades tenen pèrdues de diners reals al moneder virtual de l'usuari amb animacions i efectes de so.
- **Progressive Web App (PWA) instal·lable**: Es pot instal·lar a la pantalla d'inici de qualsevol telèfon (Android i iOS) com si fos una app nativa, sense necessitat de passar per la App Store o Google Play.
- **100% autònom i Offline**: Gràcies al Service Worker (`sw.js`), un cop oberta per primer cop, l'aplicació funciona completament sense connexió a internet ni gastar dades mòbils.
- **Web Audio API**: Sons sintetitzats en temps real per guanys, pèrdues i celebracions.
- **Accessibilitat**: Mode fosc / clar d'alt contrast i selector de mida de lletra escalable (A- / Aa / A+).
- **Recursos descarregables**: Inclou el **Txec-list Financer als 18 anys** llist per imprimir en 1 pàgina A4 o guardar en PDF.

---

## 📚 Estructura dels 12 Capítols (4 Blocs)

### 🛡️ Bloc 1: Els primers diners i blindar-se
1. **El primer sou**: Nòmina d'estiu, brut vs. net i mesurar capricis en hores de feina.
2. **Bancs, comptes i targetes**: Com triar compte jove sense comissions i fugir del crèdit revolving.
3. **M'arriba un Bizum d'un desconegut**: Estafes digitals, fraus a Wallapop i la regla d'or de Bizum.

### ☕ Bloc 2: Gestionar el dia a dia i la pressió social
4. **On se me'n va la pasta?**: Despeses formiga, la regla de les 48h i fuites de subscripcions.
5. **Quedem per anar a un concert**: Pressupost d'oci per sortir amb la colla sense vergonya ni deutes.
6. **Em volen vendre el mòbil a terminis**: El parany del finançament al consum, càlcul de TAE i cost total.

### 🌱 Bloc 3: Estalvi, futur i el parany de la immediatesa
7. **El coixí: i si em trenco el mòbil?**: Fons d'emergència de 300 € a 500 € per tenir pau mental.
8. **Metes: d'un viatge al carnet**: Pagar-te a tu mateix primer amb transferències automàtiques i metes SMART.
9. **I si ho deixo créixer?**: Inflació, interès compost, ETFs globals a foc lent vs. fum de 'finfluencers'.

### 🔑 Bloc 4: El salt als 18 anys i la independència
10. **La nòmina de debò**: Contracte laboral d'adult, bases de cotització, 12 vs. 14 pagues i hores reals.
11. **La Renda sense por**: Com recuperar retencions d'IRPF i el risc de tenir 2 pagadors.
12. **Visc sol: el cop de realitat**: La regla del 30% per al lloguer, fiances i despeses ocultes d'emancipació.

---

## 🛠️ Tecnologies Utilitzades

- **HTML5 semàntic** amb metadades Open Graph per compartir enllaços a xarxes socials.
- **CSS3 pur** amb variables personalitzades, suport complet per a Dark/Light Mode i estils d'impressió `@media print`.
- **JavaScript Modern (Vanilla)**:
  - Motor reactiu de xat (`ChatEngine`).
  - Web Audio API per síntesi sonora nativa.
  - `localStorage` per persistència d'estat local (`AppState`).
  - **Font única de contingut**: Els capítols es mantenen exclusivament a `js/data/capitol*.js`.

---

## 💻 Desenvolupament i Manteniment

- **Comprovar sintaxi JavaScript:**
  ```bash
  npm run check
  ```
- **Sincronitzar fitxers Markdown a `md/` des de la font única:**
  ```bash
  npm run sync-md
  ```

---

---

## 🌐 Com publicar-ho a GitHub i Vercel

1. **Inicialitzar Git**:
   ```bash
   git init
   git add .
   git commit -m "Versió inicial del Curs de Finances per a Joves"
   ```
2. **Pujar el repositori a GitHub**:
   - Crea un repositori nou a [GitHub](https://github.com/new).
   - Enllaça'l i puja'l:
     ```bash
     git remote add origin https://github.com/EL_TEU_USUARI/NOM_DEL_REPO.git
     git branch -M main
     git push -u origin main
     ```
3. **Publicar a Vercel**:
   - Entra a [Vercel](https://vercel.com) i inicia sessió amb GitHub.
   - Fes clic a **«Add New...» -> «Project»**.
   - Selecciona el repositori i fes clic a **«Deploy»**.
   - En 10 segons tindràs una URL pública gratuïta i segura amb HTTPS (ex.: `finances-joves.vercel.app`) per compartir amb amics i familiars.
