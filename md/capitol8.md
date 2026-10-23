<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol8.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol8.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL8.JS - Guió i lògica interactiva del Capítol 8: "Metes: d'un viatge al carnet de cotxe"
 */

const Capitol8 = {
  id: 8,
  title: "Capítol 8 · Metes: d'un viatge al carnet de cotxe",
  totalSteps: 4,

  state: {
    selectedGoal: { name: "Carnet de cotxe (B)", cost: 950, icon: "🚗" },
    selectedMonths: 9,
    weeklyEffort: 0,
    monthlyEffort: 0,
    autoRule: "day1"
  },

  GOALS_CATALOG: [
    { id: "carnet", name: "Carnet de cotxe (B)", cost: 950, icon: "🚗", desc: "Matrícula, teòrica i 20 pràctiques" },
    { id: "viatge", name: "Viatge final d'etapa", cost: 650, icon: "✈️", desc: "Vols, allotjament i despeses compartides" },
    { id: "portatil", name: "Portàtil per estudiar", cost: 720, icon: "💻", desc: "Equip potent i durador per a cicle o uni" },
    { id: "festival", name: "Abonament festival d'estiu", cost: 340, icon: "⛺", desc: "Entrada + càmping + desplaçament" }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'ANGOIXA DELS 900 € I EL MÈTODE SMART
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'angoixa dels 900 € i el mètode SMART");

    await ChatEngine.say("nil", "Nois, he anat a preguntar a l'autoescola del barri pel carnet de cotxe...");
    await ChatEngine.say("marta", "Molt bé Nil! Ja fas els 18 anys a la tardor, oi?");
    await ChatEngine.say("nil", "Sí, però m'ha agafat un mareig que gairebé caic a terra. Entre matrícula, classes teòriques, taxes d'examen i 20 pràctiques... **són gairebé 1.000 €** (950 € exactes)!!");
    await ChatEngine.say("nil", "Jo no tinc 1.000 € ni en somnis. M'és impossible. Haurem d'oblidar el tema o esperar que em toqui la loteria.");
    await ChatEngine.say("pau", "Nil, ningú estalvia 1.000 € d'un sol cop un dissabte a la tarda. Els projectes grans es mengen a mossegades petites.");
    await ChatEngine.say("marc", "Exacte. Si no tens un mètode, 950 € sembla una muntanya inabastable. Però si apliquem la tècnica dels objectius **SMART**, veuràs que és 100% assolible.");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Què significa exactament que un objectiu d'estalvi sigui <b>SMART</b>?</p>
      <button class="opt" data-opt="1">Guardar diners només quan et sentis inspirat o quan et sobri alguna cosa</button>
      <button class="opt" data-opt="2">Específic, Mesurable, Assolible, Rellevant i Temporalitzat (amb xifra i calendari)</button>
      <button class="opt" data-opt="3">Comprar accions a borsa o criptomonedes per multiplicar els diners ràpid</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;

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
    if (opt === "2") {
      await ChatEngine.say("me", "Exacte! Si dius «vull estalviar», és només un desig a l'aire. Si dius «necessito 950 € d'aquí a 9 mesos», és un objectiu SMART amb xifra i data.");
      await ChatEngine.say("aina", "Molt ben definit! Mireu com es tradueix cada lletra de SMART a la teva vida real:");
    } else {
      await ChatEngine.say("me", "Estalviar sense pla no funciona mai: sempre apareix alguna temptació abans.");
      await ChatEngine.say("marc", "Totalment. Mireu el desglossament del mètode SMART:");
    }

    const smartCard = document.createElement("div");
    smartCard.className = "chat-embed-card";
    smartCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:8px; color:var(--teal);">
        🎯 L'Anatomia d'un Objectiu d'Estalvi SMART
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="background:var(--bub); padding:8px 12px; border-radius:8px; border-left:3px solid var(--teal);">
          <b>S (Específic):</b> No és «estalviar diners», sinó «Pagar el carnet de conduir B».
        </div>
        <div style="background:var(--bub); padding:8px 12px; border-radius:8px; border-left:3px solid var(--n-marc);">
          <b>M (Mesurable):</b> Té una xifra exacta marcada: <b>950 €</b>.
        </div>
        <div style="background:var(--bub); padding:8px 12px; border-radius:8px; border-left:3px solid var(--ok);">
          <b>A (Assolible):</b> Compatible amb els teus ingressos reals (sense passar gana ni demanar crèdits).
        </div>
        <div style="background:var(--bub); padding:8px 12px; border-radius:8px; border-left:3px solid var(--gold);">
          <b>R (Rellevant):</b> És important per a tu (independència per moure't, feina futura).
        </div>
        <div style="background:var(--bub); padding:8px 12px; border-radius:8px; border-left:3px solid var(--warn);">
          <b>T (Temporalitzat):</b> Data límit fixada: <b>9 mesos</b> (finals de juny).
        </div>
      </div>

      <button class="btn" id="btn-step1-next" style="width:100%; margin-top:12px;">
        Pas 2: Obre el Planificador Visual SMART i fes els teus números →
      </button>
    `;

    ChatEngine.embedCard(smartCard);

    smartCard.querySelector("#btn-step1-next").onclick = async () => {
      smartCard.querySelector("#btn-step1-next").remove();
      await ChatEngine.say("nil", "D'acord, vist així sona més seriós. Però com es paguen 950 € en 9 mesos si només tinc petites feines o la paga?");
      await ChatEngine.say("marc", "Anem a fer la divisió matemàtica amb el planificador interactiu:");
      await this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: EL PLANIFICADOR VISUAL SMART (SIMULADOR)
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Planificador visual: Fracciona la teva meta");

    const plannerCard = document.createElement("div");
    plannerCard.className = "smart-calc-box";
    plannerCard.innerHTML = `
      <div style="font-weight:800; font-size:15px; margin-bottom:4px;">
        📊 Planificador Visual de Metes SMART
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Tria un objectiu real o personalitza'l, ajusta el termini en mesos i descobreix quant costa per setmana.
      </p>

      <div style="font-size:11px; font-weight:700; color:var(--mut); text-transform:uppercase; margin-bottom:6px;">
        1. Tria la teva fita d'estalvi:
      </div>
      <div class="smart-goals-grid" id="goals-selector"></div>

      <div style="margin-top:14px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:6px;">
          <span>2. Termini de temps per aconseguir-ho:</span>
          <span id="months-val-display" style="color:var(--teal); font-weight:800;">9 mesos</span>
        </div>
        <input type="range" id="months-slider" min="3" max="18" step="1" value="9" style="width:100%; accent-color:var(--teal); cursor:pointer;">
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--mut); margin-top:2px;">
          <span>3 mesos (ràpid)</span>
          <span>9 mesos (curs escolar)</span>
          <span>18 mesos (mig termini)</span>
        </div>
      </div>

      <!-- Resultats del càlcul en temps real -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px;">
        <div class="smart-stat-pill">
          <span class="smart-stat-val" id="monthly-quota-val">105,55 €</span>
          <span class="smart-stat-lbl">Per mes</span>
        </div>
        <div class="smart-stat-pill">
          <span class="smart-stat-val" id="weekly-quota-val" style="color:var(--gold);">24,35 €</span>
          <span class="smart-stat-lbl">Per setmana (~3,50 €/dia)</span>
        </div>
      </div>

      <!-- Desglossament d'equivalències quotidianes -->
      <div style="background:var(--bub); border-radius:10px; padding:12px; margin-top:14px; border:1px solid var(--line);">
        <div style="font-weight:700; font-size:12px; margin-bottom:6px; color:var(--teal);">
          💡 Com es tradueix aquest esforç setmanal en la teva vida real?
        </div>
        <div id="smart-equivalences" style="font-size:12px; line-height:1.6; color:var(--ink);"></div>
      </div>

      <button class="btn" id="btn-step2-confirm" style="width:100%; margin-top:16px;">
        Fixar aquest pla i passar a l'automatització →
      </button>
    `;

    ChatEngine.embedCard(plannerCard);

    const goalsContainer = plannerCard.querySelector("#goals-selector");
    const monthsSlider = plannerCard.querySelector("#months-slider");
    const monthsDisplay = plannerCard.querySelector("#months-val-display");
    const monthlyVal = plannerCard.querySelector("#monthly-quota-val");
    const weeklyVal = plannerCard.querySelector("#weekly-quota-val");
    const equivContainer = plannerCard.querySelector("#smart-equivalences");

    // Render botons d'objectius
    this.GOALS_CATALOG.forEach((g, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `smart-goal-btn ${idx === 0 ? "active" : ""}`;
      btn.innerHTML = `
        <span class="smart-goal-icon">${g.icon}</span>
        <span class="smart-goal-title">${g.name}</span>
        <span class="smart-goal-price">${g.cost} €</span>
      `;
      btn.onclick = () => {
        plannerCard.querySelectorAll(".smart-goal-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.state.selectedGoal = g;
        recalc();
      };
      goalsContainer.appendChild(btn);
    });

    const recalc = () => {
      const months = Number(monthsSlider.value);
      this.state.selectedMonths = months;
      monthsDisplay.textContent = `${months} mesos`;

      const totalCost = this.state.selectedGoal.cost;
      const perMonth = totalCost / months;
      const perWeek = totalCost / (months * 4.33);

      this.state.monthlyEffort = perMonth;
      this.state.weeklyEffort = perWeek;

      monthlyVal.textContent = perMonth.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
      weeklyVal.textContent = perWeek.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

      // Traducció pràctica
      equivContainer.innerHTML = `
        Per aconseguir els <b>${totalCost} €</b> del <b>${this.state.selectedGoal.name}</b> en <b>${months} mesos</b>:<br>
        <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
          <div>• Renunciar a <b>1 comanda de menjar ràpid a domicili</b> a la setmana (~14 €)</div>
          <div>• Estalviar <b>2 refrescos o berenars fora de casa</b> (~5 €)</div>
          <div>• Cancel·lar <b>1 subscripció que no fas servir</b> (~6 €/mes)</div>
        </div>
        <div style="margin-top:8px; font-weight:800; color:var(--ok);">
          👉 Amb només aquests 3 petits canvis, ja tens coberts els ${perWeek.toFixed(2)} € a la setmana sense notar cap sacrifici greu!
        </div>
      `;
    };

    monthsSlider.oninput = recalc;
    recalc();

    plannerCard.querySelector("#btn-step2-confirm").onclick = async () => {
      plannerCard.querySelector("#btn-step2-confirm").disabled = true;

      await ChatEngine.say("nil", `Ostres nois... 24 € a la setmana són uns 3,50 € al dia! Si no em compro el croissant i la beguda de màquina cada matí i me l'emporto de casa, ja gairebé ho tinc pagat!`);
      await ChatEngine.say("marta", "Ho veus? 950 € feia por, però 3,50 € al dia és totalment assumible.");
      await ChatEngine.say("pau", "Però compte: hi ha un parany que fa fracassar el 80% de la gent que comença una meta.");
      await ChatEngine.say("aina", "Exacte: confiar en la teva força de voluntat cada setmana.");
      await this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: L'AUTOMATITZACIÓ I EL PILOT AUTOMÀTIC
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "L'automatització: activa el pilot automàtic");

    await ChatEngine.say("pau", "Si cada diumenge has de pensar «va, que he de separar 24 €», arribarà un cap de setmana de festa o rebaixes i pensaràs «ja ho posaré la setmana que ve». I adeu carnet!");
    await ChatEngine.say("marc", "Sabeu quin error garrafal vaig cometre jo l'any passat? Em vaig fer un full d'Excel amb 30 columnes per estalviar per un portàtil, apuntant fins i tot els 20 cèntims d'un xiclet. Al cap de tres setmanes estava tan cremat i tip d'apuntar cada cèntim que ho vaig engegar tot a rodar!");
    await ChatEngine.say("nil", "Clar Marc, perquè ets massa quadriculat! Els diners no han de ser un càstig militar. Si ho divideixes en 24 € a la setmana, és com un joc: avui em porto l'entrepà de casa i ja he superat la pantalla del dia!");
    await ChatEngine.say("marc", "Exacte, per això la solució és el **pilot automàtic**: programar la transferència i oblidar-te'n.");

    const autoCard = document.createElement("div");
    autoCard.className = "chat-embed-card";
    autoCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:8px;">
        ⚙️ Com vols programar el teu estalvi automàtic?
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 10px;">
        Tria la fórmula que millor s'ajusti als teus ingressos per no haver de dependre de la mandra:
      </p>

      <button class="opt" data-rule="day1">
        <b>Fórmula A: Transferència programada el dia 1 de mes (Mètode Pro)</b><br>
        <span style="font-size:12px; color:var(--mut);">El dia que cobres la paga o el sou, el banc envia automàticament els 105 € a la teva guardiola abans que tinguis temps de gastar-los.</span>
      </button>

      <button class="opt" data-rule="roundup">
        <b>Fórmula B: Arrodoniment automàtic de compres + transferència setmanal petita</b><br>
        <span style="font-size:12px; color:var(--mut);">Cada cop que pagues amb targeta (ex. un cafè d'1,40 €), el banc arrodoneix a 2 € i guarda els 0,60 € sobrants a la teva guardiola.</span>
      </button>

      <button class="opt" data-rule="manual">
        <b>Fórmula C: Intentar recordar-ho jo mateix cada cap de setmana</b><br>
        <span style="font-size:12px; color:var(--mut);">Fer-ho a mà cada cop que em recordi d'obrir l'aplicació.</span>
      </button>
    `;

    ChatEngine.embedCard(autoCard);

    autoCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        autoCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const rule = btn.dataset.rule;
        this.state.autoRule = rule;

        if (rule === "day1" || rule === "roundup") {
          btn.classList.add("right");
          ChatEngine.notifyMoneyChange(24.35, "Primera quota setmanal transferida a la guardiola!");
          await ChatEngine.say("me", "Molt millor automatitzar-ho! Si no veus els diners al saldo disponible de la targeta, no te'ls gastes.");
          await ChatEngine.say("aina", "Exactament! Els estalviadors intel·ligents no tenen més força de voluntat que ningú: simplement tenen millors sistemes automàtics.");
        } else {
          btn.classList.add("wrong");
          autoCard.querySelector('[data-rule="day1"]').classList.add("right");
          await ChatEngine.say("me", "Ui... fer-ho a mà és la manera més fàcil d'abandonar el tercer mes quan arribi un cap de setmana mogut.");
          await ChatEngine.say("marc", "Totalment. Programa sempre una transferència automàtica o un subcompte separat.");
        }

        await this.step4();
      };
    });
  },

  /* ==========================================================================
     PAS 4: FRASE PER RECORDAR I REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "La màxima d'estalvi i el teu repte real");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">🎯</span>
        <h3 style="margin:0; font-size:16px;">Resum del mètode d'estalvi per a fites grans</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. Posa nom, cognom i preu a l'objectiu (SMART):</b><br>
          <span style="color:var(--ink);">No diguis mai «vull estalviar». Digues: «vull 950 € per al carnet d'aquí a 9 mesos».</span>
        </div>

        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. Divideix la xifra en setmanes:</b><br>
          <span style="color:var(--ink);">Una xifra gran intimida; una fita setmanal de 20 o 25 € s'aconsegueix renunciant a 2 o 3 microdespeses prescindibles.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Activa l'automatització:</b><br>
          <span style="color:var(--ink);">No confiïs en la memòria. Programa la transferència el mateix dia que reps diners i no tocaràs mai aquests estalvis per error.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        Un objectiu sense data ni xifra només és un desig. Quan el divideixes en setmanes, el que semblava impossible es converteix en un pla.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquesta acció pràctica d'1 minut:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li>Escull <b>1 objectiu important</b> per a tu d'aquí a 6 o 12 mesos (un viatge, el carnet, tecnologia o un curs).</li>
          <li>Anota en una nota al mòbil el cost total i la data exacta límit.</li>
          <li>Divideix el total entre el nombre de setmanes: aquest serà el teu compromís setmanal d'estalvi a partir d'avui mateix.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap8" style="width:100%; margin-top:16px;">
        Completar Capítol 8 i activar la meva meta 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap8").onclick = () => {
      recapCard.querySelector("#btn-finish-cap8").disabled = true;

      // Desem fita a l'estat
      AppState.saveChapterData(8, "selectedGoal", this.state.selectedGoal.name);
      AppState.saveChapterData(8, "weeklyEffort", this.state.weeklyEffort);

      // Afegim 50 € de guardiola virtual al coixí de l'usuari
      AppState.completeChapter(8, 50, null);

      ChatEngine.celebrate(
        "Capítol 8 completat amb èxit!",
        `Has creat el teu pla SMART per aconseguir ${this.state.selectedGoal.name} i saps com automatitzar el teu estalvi setmanal.`,
        50,
        9,
        () => {
          window.loadChapter(9);
        }
      );
    };
  }
};
