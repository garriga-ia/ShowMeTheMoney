/**
 * CAPITOL1.JS - Guió i lògica interactiva del Capítol 1: "El primer sou"
 */

const Capitol1 = {
  id: 1,
  title: "Capítol 1 · El primer sou",
  totalSteps: 4,

  // Càlculs 2026
  RATES: { cc: 4.70, atur_temp: 1.60, atur_fix: 1.55, fp: 0.10, mei: 0.15 },
  IRPF_MIN_TEMP: 2,
  TOTAL: 2560.60, // 2 mesos d'estiu nets (1.280,30 x 2)
  HOURLY: 7.40,   // Sou net per hora a 40h/setmana

  EVENTS: [
    { m: "Octubre",  t: "Se't trenca el mòbil", c: 180 },
    { m: "Desembre", t: "Regals i sortides de Nadal", c: 140 },
    { m: "Febrer",   t: "Material i matrícula del mòdul", c: 220 }
  ],

  // Estat intern d'aquest capítol
  state: {
    guess: null,
    cushionPct: 50,
    spendPct: 30,
    goalsPct: 20,
    archetype: "marc"
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ---------------- PAS 1: L'ESCENA I EL SOU NET ---------------- */
  async step1() {
    ChatEngine.registerStep(1, "L'escena: 1.400 € al contracte");

    await ChatEngine.say("me", "Nois!! M'han dit que sí a la feina d'estiu! Dos mesos, juliol i agost. Al contracte posa <b>1.400 € bruts al mes</b>.");
    await ChatEngine.say("nil", "1.400 AL MES?? Bro, som rics. Ja tinc el mòbil nou al carretó d'Amazon.");
    await ChatEngine.say("marc", "Para el carro, nano. «Brut» no vol dir que t'ho ingressin tot. Del brut en surt una part abans d'arribar-te al compte bancari.");
    await ChatEngine.say("marta", "I recorda: després de l'estiu et tornes a quedar sense ingressos fins que tornis a treballar. Alguna cosa s'ha de guardar.");
    await ChatEngine.say("marc", "Aposta del Marc: de cada mes de 1.400 € bruts, <b>quant creus que et ve de debò?</b>");

    // Targeta interactiva amb la pregunta
    const card = document.createElement("div");
    card.className = "chat-embed-card";
    card.innerHTML = `
      <p class="q">Quant t'ingressaran net cada mes al teu compte?</p>
      <button class="opt" data-val="1400"><b>1.400 €</b>, el que posa exactament al contracte</button>
      <button class="opt" data-val="1280"><b>Uns 1.280 €</b>, una mica menys per deduccions</button>
      <button class="opt" data-val="1050"><b>Uns 1.050 €</b>, se'n va un bon tros</button>
    `;

    ChatEngine.embedCard(card);

    card.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        card.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const val = Number(btn.dataset.val);
        this.state.guess = val;

        if (val === 1280) {
          btn.classList.add("right");
          ChatEngine.triggerHaptic();
        } else {
          btn.classList.add("wrong");
          card.querySelector('[data-val="1280"]').classList.add("right");
        }

        await this.handleAnswer1(val);
      };
    });
  },

  async handleAnswer1(guess) {
    await ChatEngine.say("me", `Crec que m'ingressaran uns ${guess} €...`);
    if (guess === 1280) {
      await ChatEngine.say("marc", "Bona vista! Tens bon ull per als números.");
    } else {
      await ChatEngine.say("marc", "Gairebé tothom s'equivoca aquí la primera vegada. Mira com queda la nòmina real:");
    }

    // Embed taula nòmina amb botó d'ingrés efectiu cap al moneder superior
    const payslipCard = document.createElement("div");
    payslipCard.className = "chat-embed-card";
    payslipCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0;">📄 La teva nòmina d'un mes (Estiu 2026)</h3>
        <span class="contract-badge" style="background:var(--teal2); color:var(--teal); font-weight:800;">Transferència emesa</span>
      </div>
      <table class="pay">
        <tr><td>Sou brut pactat</td><td>1.400,00 €</td></tr>
        <tr class="sub"><td>Seguretat Social (6,55 %)</td><td class="neg">− 91,70 €</td></tr>
        <tr class="sub"><td>IRPF (retenció mínima 2 %)</td><td class="neg">− 28,00 €</td></tr>
        <tr class="tot"><td>El que t'ingressen (Net)</td><td>1.280,30 €</td></tr>
      </table>
      <p class="note">En 2 mesos complets cobraràs exactament <b>2.560,60 € nets</b>. A més, l'empresa paga cap a un 30 % extra per tu a la Seguretat Social que no es resta del teu rebut.</p>

      <div style="margin-top:14px; padding:12px; border-radius:12px; background:#0d241a; border:1.5px solid var(--teal); text-align:center;">
        <span style="font-size:12px; color:var(--teal); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">🏦 Transferència bancària llesta per cobrar</span>
        <button class="btn gold" id="btn-collect-salary" style="width:100%; margin-top:8px; font-size:15px; padding:12px;">
          📲 Ingressar la nòmina al meu moneder (+1.280,30 €) →
        </button>
      </div>
    `;
    ChatEngine.embedCard(payslipCard);

    payslipCard.querySelector("#btn-collect-salary").onclick = async () => {
      const btn = payslipCard.querySelector("#btn-collect-salary");
      btn.disabled = true;
      btn.innerHTML = `✓ Nòmina ingressada amb èxit! (+1.280,30 €)`;
      btn.style.background = "var(--ok)";

      // Dispara l'efecte de monedes volant cap a la barra superior, el banner emergent i el comptador rodant
      ChatEngine.notifyMoneyChange(1280.30, "Primer sou net d'estiu ingressat al compte!", btn, "c1_salary");

      // Dona 1,8 segons per gaudir del so, les monedes i veure pujar el moneder
      await ChatEngine.wait(1800);

      await ChatEngine.say("nil", "UAAAAALAAA!! Mireu a dalt de tot de la pantalla: el moneder acaba de saltar de cop a més de 1.280 €!! Som rics!!");
      await ChatEngine.say("pau", "Quin gust fa veure el primer ingrés d'un sou al compte corrent! Jo gairebé em poso a saltar quan ho vaig viure.");
      await ChatEngine.say("marta", "Gaudeix del moment, és el fruit de la teva feina! Però ull: no et flipis que aquesta pasta ha de durar mesos.");
      
      await ChatEngine.wait(500);
      await ChatEngine.say("nil", "Ei, espera... però <b>on han anat a parar aquests 120 € de diferència del brut?</b> Algú se'ls ha cruspit?");
      await ChatEngine.say("nil", "Però sabeu què? L'any passat la meva germana es va trencar el braç fent skate i a l'hospital ens van atendre, li van posar guix i van fer radiografies sense pagar ni un cèntim. Això surt d'aquestes cotitzacions!");
      await ChatEngine.say("marc", "Exacte, Nil! La Seguretat Social cobreix atur, baixes mèdiques i pensions. L'IRPF és un avançament d'impostos per a serveis públics.");
      await ChatEngine.say("marta", "I si fas la Renda a la primavera, et tornen gairebé tots els 56 € d'IRPF. Si no la fas, els perds.");

      ChatEngine.embedMaxim("Brut ≠ Net. 1.400 € al contracte són 1.280,30 € nets a la teva butxaca.");

      await ChatEngine.say("nil", "Val, entesos! I ara la pregunta del milió: què faig amb els diners que tindré?");

      const nextBtn = document.createElement("button");
      nextBtn.className = "btn";
      nextBtn.textContent = "Pas 2: Repartir els diners en 3 bosses →";
      nextBtn.onclick = () => {
        nextBtn.remove();
        this.step2();
      };
      ChatEngine.embedCard(nextBtn);
    };
  },

  /* ---------------- PAS 2: EL REPARTIDOR DE DINERS ---------------- */
  async step2() {
    ChatEngine.registerStep(2, "Tria què fas: les 3 bosses");

    await ChatEngine.say("marta", "Abans de comprar cap mòbil, fem números. Durant el curs et cobreixen el menjar a casa, però aquests diners són els únics que tindràs per a sortides i per a imprevistos.");
    await ChatEngine.say("marc", "Regla de les tres bosses: <b>Coixí</b> (imprevistos), <b>Gastar</b> (gaudir ara) i <b>Metes</b> (estalvi futur).");

    const allocBox = document.createElement("div");
    allocBox.className = "allocator-box";
    allocBox.innerHTML = `
      <div class="allocator-header">
        <span style="font-weight:700; font-size:14px;">Total net de l'estiu</span>
        <span class="allocator-total">2.560,60 €</span>
      </div>
      <p class="note">Fes servir els presets o ajusta les 3 bosses amb els botons fins a sumar el 100%:</p>
      <div class="presets-row">
        <button class="chip" data-preset="nil">Estil Nil: Gastar el 80%</button>
        <button class="chip" data-preset="marta">Estil Marta: Guardar el 80%</button>
        <button class="chip on" data-preset="marc">Estil Marc: 50% Coixí / 30% Gastar</button>
      </div>

      <div class="alloc-bar">
        <span id="bar-c" class="seg-cushion" style="width:50%;"></span>
        <span id="bar-s" class="seg-spend" style="width:30%;"></span>
        <span id="bar-g" class="seg-goals" style="width:20%;"></span>
      </div>

      <div class="pocket-row">
        <div class="pocket-info">
          <div class="pocket-label"><span class="pocket-dot" style="background:var(--teal)"></span> 1. Coixí d'emergència</div>
          <div class="pocket-amount" id="amt-c">1.280,30 €</div>
        </div>
        <div class="pocket-ctrls">
          <button class="pocket-btn" id="btn-c-minus">−</button>
          <span class="pocket-val" id="pct-c">50%</span>
          <button class="pocket-btn" id="btn-c-plus">+</button>
        </div>
      </div>

      <div class="pocket-row">
        <div class="pocket-info">
          <div class="pocket-label"><span class="pocket-dot" style="background:#f09a63"></span> 2. Gastar ara (sense culpa)</div>
          <div class="pocket-amount" id="amt-s">768,18 €</div>
        </div>
        <div class="pocket-ctrls">
          <button class="pocket-btn" id="btn-s-minus">−</button>
          <span class="pocket-val" id="pct-s">30%</span>
          <button class="pocket-btn" id="btn-s-plus">+</button>
        </div>
      </div>

      <div class="pocket-row">
        <div class="pocket-info">
          <div class="pocket-label"><span class="pocket-dot" style="background:#8fb4dd"></span> 3. Metes i estalvi futur</div>
          <div class="pocket-amount" id="amt-g">512,12 €</div>
        </div>
        <div class="pocket-ctrls">
          <button class="pocket-btn" id="btn-g-minus">−</button>
          <span class="pocket-val" id="pct-g">20%</span>
          <button class="pocket-btn" id="btn-g-plus">+</button>
        </div>
      </div>

      <button class="btn" id="btn-simulate" style="width:100%; margin-top:12px;">Simular què passa fins al febrer</button>
      <div id="sim-result-slot"></div>
    `;

    ChatEngine.embedCard(allocBox);

    const updateView = () => {
      const c = this.state.cushionPct;
      const s = this.state.spendPct;
      const g = this.state.goalsPct;
      const t = this.TOTAL;

      allocBox.querySelector("#pct-c").textContent = c + "%";
      allocBox.querySelector("#pct-s").textContent = s + "%";
      allocBox.querySelector("#pct-g").textContent = g + "%";

      allocBox.querySelector("#amt-c").textContent = ((t * c) / 100).toFixed(2) + " €";
      allocBox.querySelector("#amt-s").textContent = ((t * s) / 100).toFixed(2) + " €";
      allocBox.querySelector("#amt-g").textContent = ((t * g) / 100).toFixed(2) + " €";

      allocBox.querySelector("#bar-c").style.width = c + "%";
      allocBox.querySelector("#bar-s").style.width = s + "%";
      allocBox.querySelector("#bar-g").style.width = g + "%";
    };

    const adjust = (type, delta) => {
      allocBox.querySelectorAll(".chip").forEach(ch => ch.classList.remove("on"));
      if (type === "c") {
        if (this.state.cushionPct + delta >= 0 && this.state.goalsPct - delta >= 0) {
          this.state.cushionPct += delta;
          this.state.goalsPct -= delta;
        }
      } else if (type === "s") {
        if (this.state.spendPct + delta >= 0 && this.state.goalsPct - delta >= 0) {
          this.state.spendPct += delta;
          this.state.goalsPct -= delta;
        }
      } else if (type === "g") {
        if (this.state.goalsPct + delta >= 0 && this.state.spendPct - delta >= 0) {
          this.state.goalsPct += delta;
          this.state.spendPct -= delta;
        }
      }
      updateView();
    };

    allocBox.querySelector("#btn-c-minus").onclick = () => adjust("c", -10);
    allocBox.querySelector("#btn-c-plus").onclick  = () => adjust("c", +10);
    allocBox.querySelector("#btn-s-minus").onclick = () => adjust("s", -10);
    allocBox.querySelector("#btn-s-plus").onclick  = () => adjust("s", +10);
    allocBox.querySelector("#btn-g-minus").onclick = () => adjust("g", -10);
    allocBox.querySelector("#btn-g-plus").onclick  = () => adjust("g", +10);

    allocBox.querySelectorAll(".chip").forEach(chip => {
      chip.onclick = () => {
        allocBox.querySelectorAll(".chip").forEach(ch => ch.classList.remove("on"));
        chip.classList.add("on");
        const p = chip.dataset.preset;
        if (p === "nil") {
          this.state.cushionPct = 10; this.state.spendPct = 80; this.state.goalsPct = 10;
          this.state.archetype = "nil";
        } else if (p === "marta") {
          this.state.cushionPct = 80; this.state.spendPct = 10; this.state.goalsPct = 10;
          this.state.archetype = "marta";
        } else {
          this.state.cushionPct = 50; this.state.spendPct = 30; this.state.goalsPct = 20;
          this.state.archetype = "marc";
        }
        updateView();
      };
    });

    allocBox.querySelector("#btn-simulate").onclick = () => {
      allocBox.querySelector("#btn-simulate").disabled = true;
      this.runSimulation(allocBox.querySelector("#sim-result-slot"));
    };
  },

  async runSimulation(slot) {
    const cushion = (this.TOTAL * this.state.cushionPct) / 100;
    const spend = (this.TOTAL * this.state.spendPct) / 100;
    let left = cushion;
    let deficit = 0;
    const rows = [];

    this.EVENTS.forEach(ev => {
      const paid = Math.min(left, ev.c);
      const missed = ev.c - paid;
      left -= paid;
      deficit += missed;
      rows.push({ m: ev.m, t: ev.t, c: ev.c, missed: missed, left: left });
    });

    const isSuccess = deficit === 0;

    let profileName = "🧠 Estrateg Feliç (Estil Marc)";
    if (this.state.spendPct >= 60) profileName = "🎸 Viu el Present (Estil Nil)";
    if (this.state.cushionPct >= 70) profileName = "🛡️ Búnquer Suís (Estil Marta)";

    let html = `
      <div class="sim-result-card ${isSuccess ? 'ok' : 'ko'}">
        <div class="profile-tag">${profileName}</div>
        <div style="font-size:18px; font-weight:800; color:${isSuccess ? 'var(--ok)' : 'var(--warn)'}">
          ${isSuccess ? '✓ Imprevistos del curs superats!' : `⚠ T'han faltat ${deficit.toFixed(2)} €`}
        </div>
        <p class="note">${isSuccess ? `El teu coixí ha aguantat tot el curs i encara et queden <b>${left.toFixed(2)} €</b> de marge.` : 'Has gastat tant a l\'estiu que el febrer t\'ha agafat en números vermells.'}</p>
        <ul class="timeline-list">
    `;

    rows.forEach(r => {
      const bad = r.missed > 0;
      html += `
        <li class="${bad ? 'bad' : 'good'}">
          <span><b>${r.m}:</b> ${r.t} (−${r.c} €)</span>
          <span>${bad ? `<b>Falten ${r.missed.toFixed(2)} €!</b>` : `Cobert (${r.left.toFixed(2)} € restants)`}</span>
        </li>
      `;
    });

    html += `
        </ul>
        <p style="font-size:13px; margin:8px 0;">I mentrestant, has gastat sense culpa ni angoixa: <b>${spend.toFixed(2)} €</b>.</p>
        <button class="btn" id="btn-go-step3" style="margin-top:8px;">Continuar al Pas 3 →</button>
      </div>
    `;

    slot.innerHTML = html;
    ChatEngine.scrollTo(slot);

    slot.querySelector("#btn-go-step3").onclick = () => {
      slot.querySelector("#btn-go-step3").remove();
      this.step3();
    };

    if (isSuccess) {
      await ChatEngine.say("marc", "Molt ben jugat! Tenir el coixí cobert et permet gaudir del que gastes sense angoixar-te quan arriba un problema.");
    } else {
      ChatEngine.notifyMoneyChange(-140, "Imprevist del febrer: pantalla de mòbil trencada!", null, "c1_screen");
      await ChatEngine.say("nil", "Uf... Això del mòbil trencat no hi comptava. Se'm queda la cartera a zero al febrer i no puc ni anar a berenar amb vosaltres!");
      await ChatEngine.say("marc", "A mi em va passar el mateix el meu primer any: per comprar-me una cadira 'gaming' de 250 € em vaig quedar sense pasta per a la casa rural d'amics... Em vaig passar el cap de setmana sol a casa mirant les vostres 'stories' amb una ràbia que no us podeu imaginar.");
      await ChatEngine.say("marta", "Tots hem après a base d'entrebussar-nos. El coixí no és per presumir, és per no quedar-te penjat.");
    }
  },

  /* ---------------- PAS 3: ABANS DE SIGNAR I CALCULADORA ---------------- */
  async step3() {
    ChatEngine.registerStep(3, "Abans de signar: preus en hores");

    await ChatEngine.say("aina", "Dues coses crítiques abans de signar cap contracte. La primera: el salari mínim legal 2026. A jornada sencera no et poden pagar menys de <b>1.221 € bruts al mes</b>.");
    await ChatEngine.say("nil", "I si em diuen: «el primer mes cobrarem menys per provar»?");
    await ChatEngine.say("aina", "Alerta vermella total. Treballar és treballar des del minut 1. Si no està al contracte, no acceptis.");
    await ChatEngine.say("pau", "I la segona: calcula sempre el valor de les coses en hores de feina. Amb aquest sou d'estiu, guanyes unes <b>7,40 € netes per hora</b>.");

    ChatEngine.embedMaxim("Regla d'or: converteix els preus a hores de feina. Un mòbil de 200 € = 27 hores d'estar dret a la feina.");

    // Calculadora d'hores de feina
    const calcCard = document.createElement("div");
    calcCard.className = "chat-embed-card";
    calcCard.innerHTML = `
      <h3>Calculadora: quant et costa realment en hores?</h3>
      <p class="note">Escriu el preu d'alguna cosa que t'agradaria comprar (unes vambes, un viatge, una moto...):</p>
      <input type="text" inputmode="decimal" class="txtin" id="calc-in" placeholder="Ex: 120">
      <div class="pout" id="calc-out" style="margin-top:10px;"></div>
      <button class="btn" id="btn-go-step4" style="margin-top:14px;">Anar als punts clau i repte →</button>
    `;

    ChatEngine.embedCard(calcCard);

    const input = calcCard.querySelector("#calc-in");
    const out = calcCard.querySelector("#calc-out");

    input.oninput = () => {
      const val = parseFloat(input.value.replace(",", "."));
      if (val > 0) {
        const hours = (val / this.HOURLY).toFixed(1);
        const days = (hours / 8).toFixed(1);
        out.innerHTML = `
          <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b>${val.toFixed(2)} €</b> equivalen a <b>${hours} hores de treball</b> (${days} jornades senceres de 8 hores).<br>
            <span class="note">Val la pena el teu esforç? Si la resposta és sí, endavant sense culpa!</span>
          </div>
        `;
      } else {
        out.innerHTML = "";
      }
    };

    calcCard.querySelector("#btn-go-step4").onclick = () => {
      calcCard.querySelector("#btn-go-step4").remove();
      this.step4();
    };
  },

  /* ---------------- PAS 4: RECAP, REPTE I TROFEU ---------------- */
  async step4() {
    ChatEngine.registerStep(4, "Punts clau, moraleja i el teu repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <h3>Els 3 aprenentatges del Capítol 1</h3>
      <p><b>1. Brut ≠ Net:</b> 1.400 € al contracte són 1.280,30 € al teu banc. Sempre que negociïs, parla en brut anual.</p>
      <p><b>2. Paga't a tu primer:</b> Separa el coixí el primer dia que cobris. Si esperes a final de mes, no sobrarà res.</p>
      <p><b>3. Mesura en hores de vida:</b> A 7,40 €/hora, cada euro que gastes és temps que has dedicat.</p>
      
      <div class="maxim" style="margin-left:0;">
        <span>Moraleja</span>
        El que compta no és el que guanyes sobre el paper, sinó el que saps gestionar. Primer el coixí, després els capricis.
      </div>
      
      <h3 style="margin-top:16px;">El teu repte per a aquesta setmana</h3>
      <p>1. Demana a algú de confiança una nòmina (tapant les dades privades) i busca el <b>total meritats (brut)</b> i el <b>líquid a percebre (net)</b>.</p>
      <p>2. Calcula el teu coixí mínim: quant gastes en un mes normal?</p>
      <input type="number" class="txtin" id="repte-in" placeholder="€ despeses al mes (ex: 80)">
      <div id="repte-out" class="note" style="margin-top:6px;"></div>
      <button class="btn gold" id="btn-finish-cap1" style="width:100%; margin-top:12px;">Completar Capítol 1 🏆</button>
    `;

    ChatEngine.embedCard(recapCard);

    const rIn = recapCard.querySelector("#repte-in");
    const rOut = recapCard.querySelector("#repte-out");
    rIn.oninput = () => {
      const v = parseFloat(rIn.value);
      if (v > 0) {
        rOut.innerHTML = `Coixí recomanat per començar (3 mesos): <b>${(v * 3).toFixed(2)} €</b>.`;
      } else {
        rOut.innerHTML = "";
      }
    };

    recapCard.querySelector("#btn-finish-cap1").onclick = () => {
      recapCard.querySelector("#btn-finish-cap1").disabled = true;
      const cushionSaved = (this.TOTAL * this.state.cushionPct) / 100;
      AppState.completeChapter(1, cushionSaved, this.state.archetype);

      ChatEngine.celebrate(
        "Capítol 1 completat amb èxit!",
        "Has desxifrat la teva primera nòmina i has creat el teu primer coixí virtual.",
        cushionSaved,
        2,
        () => {
          window.loadChapter(2);
        }
      );
    };
  }
};
