<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol7.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol7.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL7.JS - Guió i lògica interactiva del Capítol 7: "El coixí: i si em trenco el mòbil?"
 */

const Capitol7 = {
  id: 7,
  title: "Capítol 7 · El coixí: i si em trenco el mòbil?",
  totalSteps: 4,

  state: {
    firstReaction: null,
    chosenCushion: 400,
    currentBalance: 400,
    resolvedShocks: 0,
    payFirstSetting: 25
  },

  // Els 3 xocs imprevistos reals de l'any fictici
  SHOCKS: [
    { id: 1, month: "Novembre", title: "Pantalla del mòbil trinxada", cost: 160, desc: "Cau de cantell en sortir d'un entrenament; vidre trencat i pantalla negra." },
    { id: 2, month: "Febrer", title: "Pèrdua de motxilla amb material", cost: 90, desc: "Et descuides la motxilla al tren amb calculadora científica i apunts." },
    { id: 3, month: "Maig", title: "Avaria frens de la bici/patinet", cost: 110, desc: "El teu transport diari per anar a classe s'espatlla d'un dia per l'altre." }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: LA CATÀSTROFE DEL MÒBIL I L'ANATOMIA DE L'IMPREVIST
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "La catàstrofe: el mòbil cau a terra");

    await ChatEngine.say("nil", "Nois, us escric des de l'ordinador vell de casa perquè estic plorant de ràbia...");
    await ChatEngine.say("marta", "Nil! Què ha passat ara?");
    await ChatEngine.say("nil", "Sortint de l'institut se m'ha relliscat el mòbil de la jaqueta, ha caigut de pla a la vorera i la pantalla s'ha fet miques. Tinta negra escampada, no s'encén res de res.");
    await ChatEngine.say("nil", "He anat corrents al servei tècnic de la cantonada: **canviar la pantalla i el sensor costa 165 € immediats**.");
    await ChatEngine.say("nil", "I al compte bancari tinc exactament **7,40 €**! Estic completament incomunicat: no tinc T-Mobilitat per agafar el metro, no puc veure els apunts de classe ni accedir a res. Què faig ara??");
    await ChatEngine.say("pau", "Ostres Nil... I el coixí d'estalvi que vam parlar al Capítol 1?");
    await ChatEngine.say("nil", "Quin coixí?? M'ho vaig anar gastant tot en sortides i capricis perquè pensava: «A mi mai em passarà res dolent»!");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Què hauria d'haver tingut preparat el Nil per no viure aquesta angoixa?</p>
      <button class="opt" data-opt="1">Demanar un crèdit ràpid per internet o demanar diners als amics</button>
      <button class="opt" data-opt="2">Un fons d'emergència («coixí») d'entre 300 € i 500 € intocable per a imprevistos</button>
      <button class="opt" data-opt="3">Plorar i quedar-se sense mòbil fins a l'estiu vinent</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;
        this.state.firstReaction = opt;

        if (opt === "2") {
          btn.classList.add("right");
          ChatEngine.triggerHaptic();
        } else {
          btn.classList.add("wrong");
          choiceCard.querySelector('[data-opt="2"]').classList.add("right");
        }

        await this.handleStep1Answer(opt);
      };
    });
  },

  async handleStep1Answer(opt) {
    ChatEngine.notifyMoneyChange(-165, "Avaria d'urgència: reparació de pantalla de mòbil!");

    if (opt === "2") {
      await ChatEngine.say("me", "Nil, necessites el fons d'emergència. Si tinguessis 350 € guardats al coixí, pagaries els 165 € a l'acte i la teva vida continuaria sense cap estrès.");
      await ChatEngine.say("aina", "Molt ben dit! El coixí d'estalvi no és per fer-te ric: és el preu de la teva tranquil·litat quan les coses es torcen.");
    } else {
      await ChatEngine.say("me", "Quin mal tràngol, Nil... Quedar-se penjat per 165 € fa adonar-te de com som de vulnerables sense estalvi.");
      await ChatEngine.say("marc", "Mireu el contrast brutal entre viure amb coixí o sense coixí davant d'un mateix problema:");
    }

    await ChatEngine.say("marta", "Nois, us he de confessar una cosa sincera: jo tinc diners guardats, però sóc tan exageradament prudent per por que porto mesos sense fer ni un cafè ni anar al cinema amb vosaltres perquè sento culpa cada cop que gasto 3 euros. Visc angoixada per si em quedo a zero!");
    await ChatEngine.say("nil", "Marta! Però si és just al revés! El coixí és precisament perquè puguis viure tranquil·la. Si guardes 350 € en una guardiola intocable per si cau el mòbil, la resta te la pots gastar en viure i gaudir sense cap remordiment!");
    await ChatEngine.say("marta", "Ostres Nil... tens tota la raó del món. Gràcies, necessitava sentir això.");

    // Widget interactiu: Anatomia d'un imprevist (Contrast)
    const contrastCard = document.createElement("div");
    contrastCard.className = "chat-embed-card";
    contrastCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:8px;">
        🛡️ El mateix accident (165 €): Dos futurs completament diferents
      </div>

      <div class="emergency-contrast-grid">
        <!-- Sense Coixí -->
        <div class="contrast-card without">
          <b style="color:var(--warn); font-size:13px; display:block; margin-bottom:4px;">❌ CAS NIL: Sense Coixí</b>
          <div>• <b>Comissió de 165 €:</b> No els té.</div>
          <div>• <b>Conseqüències:</b> Pànic, demanar almoina als pares, vergonya, dies incomunicat sense transport.</div>
          <div>• <b>Resultat:</b> Mal humor, estrès i deute familiar.</div>
        </div>

        <!-- Amb Coixí -->
        <div class="contrast-card with">
          <b style="color:var(--ok); font-size:13px; display:block; margin-bottom:4px;">✅ CAS PRO: Amb Coixí (350 €)</b>
          <div>• <b>Comissió de 165 €:</b> Es paga al moment amb la guardiola d'emergència.</div>
          <div>• <b>Conseqüències:</b> Mòbil arreglat el mateix dia; queden 185 € al fons.</div>
          <div>• <b>Resultat:</b> Zero estrès, independència total i tranquil·litat mental.</div>
        </div>
      </div>

      <button class="btn" id="btn-step1-next" style="width:100%; margin-top:10px;">
        Pas 2: Simulador de la ruleta d'imprevistos (Resistiràs 1 any?) →
      </button>
    `;

    ChatEngine.embedCard(contrastCard);

    contrastCard.querySelector("#btn-step1-next").onclick = async () => {
      contrastCard.querySelector("#btn-step1-next").remove();

      await ChatEngine.say("nil", "Teniu tota la raó del món... Els meus pares m'han deixat els diners enfadats, però m'he sentit fatal per no tenir una xarxa de seguretat meva.");
      await ChatEngine.say("marc", "I la gent es pensa que això passa un cop a la vida. Fals: **a la vida real els imprevistos arriben periòdicament**.");
      await ChatEngine.say("pau", "Fem una simulació d'un any sencer i veureu què passa amb diferents mides de coixí.");

      ChatEngine.embedMaxim("El coixí d'estalvi no és per fer-te ric: és el preu de la teva tranquil·litat quan la vida es complica.");

      await ChatEngine.wait(400);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: EL SIMULADOR DE LA RULETA DELS IMPREVISTOS
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Simulador: 1 any de vida real");

    await ChatEngine.say("aina", "Per a la nostra edat (16-18 anys), la mida recomanada per al coixí és d'entre **300 € i 500 €**. Amb això cobreixes el 95% dels ensurts personals.");
    await ChatEngine.say("marc", "Comença triant amb quin coixí vols arrencar aquest any fictici:");

    const simCard = document.createElement("div");
    simCard.className = "shock-sim-box";
    simCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px;">
        🎲 La Ruleta dels Imprevistos: Posa a prova el teu coixí
      </div>
      <p class="note" style="margin-bottom:10px;">1. Tria la teva guardiola d'inici per resistir l'any:</p>

      <div class="presets-row" id="cushion-choice-presets">
        <button class="chip" data-val="0">🔴 0 € (Viu al dia com el Nil)</button>
        <button class="chip" data-val="150">🟡 150 € (Coixí petit)</button>
        <button class="chip on" data-val="400">🟢 400 € (Coixí recomanat)</button>
      </div>

      <div class="cushion-balance-gauge">
        <span style="font-size:11px; color:var(--mut); text-transform:uppercase;">Saldo actual del teu coixí</span>
        <div style="font-size:26px; font-weight:800; color:var(--teal); margin:3px 0;" id="cushion-live-balance">400,00 €</div>
        <div style="font-size:11px; color:var(--mut);" id="cushion-status-label">Protegit davant d'imprevistos</div>
      </div>

      <p class="note">2. Fes clic a cada imprevist de l'any a mesura que van passant els mesos:</p>

      <div id="shocks-list">
        ${this.SHOCKS.map(s => `
          <div class="shock-card" id="shock-row-${s.id}">
            <div>
              <div style="font-size:11px; font-weight:800; color:var(--teal);">${s.month}</div>
              <div style="font-weight:700;">${s.title}</div>
              <div style="font-size:11px; color:var(--mut);">${s.desc}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; color:var(--warn);">− ${s.cost} €</div>
              <button type="button" class="btn" style="padding:6px 10px; font-size:11px; min-height:30px; margin-top:4px;" data-id="${s.id}">
                Assumir ensurt
              </button>
            </div>
          </div>
        `).join("")}
      </div>

      <button class="btn" id="btn-step2-next" style="display:none; width:100%; margin-top:14px;">
        Pas 3: La tècnica màgica «Paga't a tu primer» →
      </button>
    `;

    ChatEngine.embedCard(simCard);

    let balance = 400;
    let resolved = 0;

    const updateBalanceUI = () => {
      const balEl = simCard.querySelector("#cushion-live-balance");
      const statEl = simCard.querySelector("#cushion-status-label");

      balEl.textContent = `${balance.toFixed(2)} €`;

      if (balance > 100) {
        balEl.style.color = "var(--teal)";
        statEl.textContent = "🟢 Coixí sòlid: resisteixes els xocs sense deute!";
      } else if (balance >= 0) {
        balEl.style.color = "var(--gold)";
        statEl.textContent = "🟡 Coixí al límit: has aguantat per la mínima!";
      } else {
        balEl.style.color = "var(--warn)";
        statEl.textContent = `🔴 NÚMEROS VERMELLS: Estàs endeutat en ${Math.abs(balance).toFixed(2)} €! Has hagut de demanar un préstec!`;
      }
    };

    simCard.querySelectorAll("#cushion-choice-presets .chip").forEach(btn => {
      btn.onclick = () => {
        simCard.querySelectorAll("#cushion-choice-presets .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        balance = Number(btn.dataset.val);
        this.state.chosenCushion = balance;
        resolved = 0;

        // Reset row styles
        simCard.querySelectorAll(".shock-card").forEach(r => {
          r.classList.remove("applied");
          r.querySelector("button").disabled = false;
          r.querySelector("button").textContent = "Assumir ensurt";
        });
        simCard.querySelector("#btn-step2-next").style.display = "none";
        updateBalanceUI();
        ChatEngine.triggerHaptic();
      };
    });

    simCard.querySelectorAll("#shocks-list button").forEach(b => {
      b.onclick = () => {
        const id = Number(b.dataset.id);
        const shock = this.SHOCKS.find(s => s.id === id);
        const row = simCard.querySelector(`#shock-row-${id}`);

        b.disabled = true;
        b.textContent = "✓ Superat";
        row.classList.add("applied");

        balance -= shock.cost;
        resolved++;
        updateBalanceUI();
        ChatEngine.triggerHaptic();

        if (resolved === this.SHOCKS.length) {
          simCard.querySelector("#btn-step2-next").style.display = "flex";
        }
      };
    });

    simCard.querySelector("#btn-step2-next").onclick = async () => {
      simCard.querySelector("#btn-step2-next").remove();

      if (balance >= 0) {
        await ChatEngine.say("nil", "Increïble! Amb el coixí de 400 €, fins i tot després de trencar la pantalla, perdre la motxilla i arreglar el patinet, encara he sobreviscut sense demanar ni un euro deute!");
        await ChatEngine.say("marc", "Això és exactament viure amb tranquil·litat financera. La vida continua llançant problemes, però tu tens un blindatge impenetrable.");
      } else {
        await ChatEngine.say("nil", "He vist com amb 0 o 150 euros et quedes endeutat a mig any! És impossible viure tranquil així.");
        await ChatEngine.say("marta", "Per això la colla té clar que el coixí és la prioritat absoluta abans de comprar capricis.");
      }

      ChatEngine.embedMaxim("Els imprevistos no són mala sort: són inevitables. Si no tens un coixí preparat, qualsevol ximpleria es converteix en una crisi financera.");

      await ChatEngine.wait(400);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: LA TÈCNICA MÀGICA «PAGA'T A TU PRIMER»
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "La regla d'or: «Paga't a tu primer»");

    await ChatEngine.say("nil", "D'acord, em teniu 100% convençut que necessito un coixí de 300 o 400 euros. Però com dimonis l'omplo si sempre em costa estalviar?");
    await ChatEngine.say("pau", "Perquè comets el mateix error que el 90% de la societat: intentes estalviar **el que sobri a final de mes**.");
    await ChatEngine.say("marta", "I endevina què: si els diners estan al teu compte a la vista, **MAI sobra res**! Te'ls gastes per inèrcia en pizzes, cafès i tonteries.");
    await ChatEngine.say("marc", "La solució té nom i cognoms: es diu **«Paga't a tu primer»** (*Pay yourself first*).");

    const payCard = document.createElement("div");
    payCard.className = "pay-yourself-box";
    payCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px;">
        💡 El Secret dels Estalviadors: Paga't a tu primer
      </div>
      <p class="note" style="margin-bottom:12px;">Compara les dues estratègies d'estalvi:</p>

      <div class="strategy-row">
        <!-- Estratègia A -->
        <div class="strategy-card">
          <div style="font-size:11px; font-weight:800; color:var(--warn); text-transform:uppercase;">MÈTODE COMÚ (Fracassa)</div>
          <div style="font-weight:700; font-size:13px; margin:4px 0;">«Estalvio el que em sobri»</div>
          <p style="font-size:11px; color:var(--mut); margin:6px 0;">1. Cobres la paga o feina.<br>2. Gastes en el dia a dia.<br>3. A final de mes el compte és a zero.</p>
          <div style="font-size:18px; font-weight:800; color:var(--warn); margin-top:8px;">0 € al coixí</div>
        </div>

        <!-- Estratègia B -->
        <div class="strategy-card winner">
          <div style="font-size:11px; font-weight:800; color:var(--teal); text-transform:uppercase;">PAGA'T A TU PRIMER ⭐</div>
          <div style="font-weight:700; font-size:13px; margin:4px 0;">«Aparto abans de gastar»</div>
          <p style="font-size:11px; color:var(--mut); margin:6px 0;">1. Cobres la paga o feina.<br>2. <b>El minut 1 transfereixes 25 € al coixí</b>.<br>3. Vius el mes amb la resta.</p>
          <div style="font-size:18px; font-weight:800; color:var(--teal); margin-top:8px;">+ 300 € a l'any!</div>
        </div>
      </div>

      <div style="margin-top:14px; background:#121b22; padding:12px; border-radius:10px; border:1px solid var(--line);">
        <label style="font-size:12px; font-weight:700; color:var(--ink); display:block; margin-bottom:6px;">
          Tria quants diners podries apartar automàticament cada mes:
        </label>
        <div class="presets-row" id="payfirst-presets">
          <button class="chip" data-amt="15">15 €/mes (1 cafeteria per setmana)</button>
          <button class="chip on" data-amt="25">25 €/mes (Recomanat)</button>
          <button class="chip" data-amt="50">50 €/mes (Ritme ràpid)</button>
        </div>

        <div style="margin-top:10px; font-size:13px; text-align:center;">
          Temps per tenir el teu coixí de 400 € complet: <b id="payfirst-time" style="color:var(--gold);">16 mesos</b>
        </div>
      </div>

      <button class="btn gold" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: On guardar el coixí i el teu repte real →
      </button>
    `;

    ChatEngine.embedCard(payCard);

    payCard.querySelectorAll("#payfirst-presets .chip").forEach(btn => {
      btn.onclick = () => {
        payCard.querySelectorAll("#payfirst-presets .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        const amt = Number(btn.dataset.amt);
        this.state.payFirstSetting = amt;
        const months = Math.ceil(400 / amt);
        payCard.querySelector("#payfirst-time").textContent = `${months} mesos (${Math.round(months / 12 * 10) / 10} anys)`;
        ChatEngine.triggerHaptic();
      };
    });

    payCard.querySelector("#btn-step3-next").onclick = async () => {
      payCard.querySelector("#btn-step3-next").remove();

      await ChatEngine.say("nil", "Quina diferència psicològica tan brutal! Si apartes els diners el dia 1 a una guardiola separada, el teu cervell assumeix que només tens la resta i t'adaptes sense patir.");
      await ChatEngine.say("aina", "Exactament! El truc és que els diners de l'estalvi **no es vegin a la targeta** que fas servir per pagar.");

      ChatEngine.embedMaxim("No estalviïs el que et sobri després de gastar; gasta el que et quedi després d'apartar el teu estalvi el dia 1.");

      await ChatEngine.wait(400);
      this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: ON GUARDAR EL COIXÍ I EL TEU REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "On guardar el coixí i el teu repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">🛡️</span>
        <h3 style="margin:0; font-size:16px;">Les 3 regles sagrades del teu coixí d'emergència</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. Guardat en un compte o guardiola separada:</b><br>
          <span style="color:var(--ink);">El coixí ha d'estar a l'app del banc però en una guardiola virtual / subcompte separat de la targeta de dèbit. Si està a la vista, te'l gastaràs sense voler.</span>
        </div>

        <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. Només per a urgències reals:</b><br>
          <span style="color:var(--ink);">Una urgència és un mòbil trencat, el dentista o el bitllet de transport bàsic. Unes vambes rebaixades o un concert NO són una emergència.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Si el toques, la prioritat és tornar-lo a omplir:</b><br>
          <span style="color:var(--ink);">Quan la vida et colpegi i hagis d'usar 100 €, redueix despeses el mes següent fins a deixar el coixí una altra vegada a 300 € - 500 €.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        El coixí d'estalvi no és per fer-te ric: és el preu de la teva tranquil·litat quan la vida es complica.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquesta acció que et donarà pau mental per a tot l'any:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li>Obre l'app del teu banc al mòbil (o comença amb un sobre físic a la teva habitació).</li>
          <li>Crea un subcompte, guardiola virtual o racó anomenat <b>«Coixí d'Emergència»</b>.</li>
          <li>Transfereix-hi els teus primers <b>10 € o 20 €</b> avui mateix per posar la primera pedra del teu escut financer.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap7" style="width:100%; margin-top:16px;">
        Completar Capítol 7 i blindar el meu coixí 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap7").onclick = () => {
      recapCard.querySelector("#btn-finish-cap7").disabled = true;

      // Desem dades
      AppState.saveChapterData(7, "chosenCushion", this.state.chosenCushion);
      AppState.saveChapterData(7, "payFirstSetting", this.state.payFirstSetting);

      // Afegim 50 € de guardiola virtual al coixí de l'usuari a l'estat global!
      AppState.completeChapter(7, 50, null);

      ChatEngine.celebrate(
        "Capítol 7 completat amb èxit!",
        "Ja saps com funciona un fons d'emergència, per què resisteix els xocs de la vida i el secret de pagar-te a tu primer.",
        50,
        8,
        () => {
          window.loadChapter(8);
        }
      );
    };
  }
};
