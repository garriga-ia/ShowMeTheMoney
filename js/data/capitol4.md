/**
 * CAPITOL4.JS - Guió i lògica interactiva del Capítol 4: "On se me'n va la pasta?"
 */

const Capitol4 = {
  id: 4,
  title: "Capítol 4 · On se me'n va la pasta?",
  totalSteps: 4,

  state: {
    firstGuess: null,
    antExpensesSelected: [0, 1, 3],
    monthlyAntTotal: 0,
    yearlyAntTotal: 0,
    subsCancelledTotal: 0,
    impulseChoice: null
  },

  // Catàleg de despeses formiga típiques
  ANT_ITEMS: [
    { id: 0, name: "Beguda energètica o cafè diari", icon: "🥤", costMonthly: 54, costYearly: 648, desc: "1,80 € al dia a l'institut o feina" },
    { id: 1, name: "Menjar a domicili (Glovo/Uber Eats)", icon: "🛵", costMonthly: 30, costYearly: 360, desc: "2 comandes al mes amb despeses d'enviament" },
    { id: 2, name: "Skins o micropagaments a videojocs", icon: "🎮", costMonthly: 12, costYearly: 144, desc: "Pases de batalla, cofres o skins a 2-5 €" },
    { id: 3, name: "Patinet elèctric de lloguer per mandra", icon: "🛴", costMonthly: 22, costYearly: 264, desc: "2 o 3 trajectes curts a la setmana" },
    { id: 4, name: "Snacks, xiclets i màquines de vending", icon: "🍫", costMonthly: 16, costYearly: 192, desc: "Monedes soltes entre classe i classe" }
  ],

  // Subscripcions per a l'auditoria amb consells pedagògics individuals
  SUBSCRIPTIONS: [
    {
      id: 0,
      name: "App de música (Spotify / Apple Music)",
      icon: "🎵",
      cost: 9.99,
      freq: "L'utilitzo cada dia camí a classe",
      status: "keep",
      adviceKeep: { good: true, text: "Bona decisió si la fas servir cada dia. Una subscripció útil i gaudida no és un malbaratament." },
      adviceCancel: { good: false, text: "La pots cancel·lar si vols, però si l'escoltes cada dia potser t'aporta prou valor. L'objectiu no és viure com un monjo, sinó triar conscientment." }
    },
    {
      id: 1,
      name: "App d'entrenament / fitness de gener",
      icon: "🏋️",
      cost: 7.99,
      freq: "No l'he oberta en 4 mesos",
      status: "keep",
      adviceKeep: { good: false, text: "Fa 4 mesos que no l'obres! Mantenir-la et costa gairebé 100 € l'any per una cosa que no fas servir." },
      adviceCancel: { good: true, text: "Excel·lent neteja! Cancel·les una app abandonada i recuperes 95,88 € l'any a la butxaca a l'acte." }
    },
    {
      id: 2,
      name: "3 plataformes de sèries (Netflix + HBO + Disney)",
      icon: "🎬",
      cost: 31.97,
      freq: "Miro sèries a una sola d'elles",
      status: "keep",
      adviceKeep: { good: false, text: "Pagar 3 serveis alhora quan només en mires un és una gran fuita. Pots alternar-los mes a mes!" },
      adviceCancel: { good: true, text: "Molt intel·ligent! Pots mantenir-ne una sola i anar alternant de plataforma segons la sèrie del mes." }
    },
    {
      id: 3,
      name: "Emmagatzematge núvol de 2 TB (ocupat només 35 GB)",
      icon: "☁️",
      cost: 2.99,
      freq: "Només ocupa 35 GB per fotos",
      status: "keep",
      adviceKeep: { good: false, text: "Estàs pagant per 2.000 GB quan només en gastes 35! Mira si et serveix el pla bàsic gratuït o més reduït." },
      adviceCancel: { good: true, text: "Molt bé! Un pla més ajustat o el nivell gratuït cobrirà de sobres les teves fotos." }
    }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'EXPEDIENT X DEL COMPTE A ZERO
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'expedient X: de 85 € a 1,40 €");

    await ChatEngine.say("nil", "Nois, tinc un expedient X molt greu al banc. Algú m'ha de dir què està passant.");
    await ChatEngine.say("marc", "Què ha passat ara, Nil? T'han cobrat comissions?");
    await ChatEngine.say("nil", "Pitjor! Fa exactament dues setmanes tenia <b>85 € nets</b> al compte d'estalvi. I us juro per la meva vida que <b>no he comprat res gran ni car</b>: ni vambes, ni roba, ni cap viatge.");
    await ChatEngine.say("nil", "Acabo d'entrar a l'app per pagar un entrepà i em posa: <b>Saldo disponible: 1,40 €</b>!! Em deuen haver clonat la targeta o m'han estafat, és impossible!");
    await ChatEngine.say("marta", "Respira, Nil. Ningú t'ha clonat la targeta. Tens el que en finances en diem la síndrome del pagament invisible.");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">On creus que han anat a parar realment els 85 € del Nil?</p>
      <button class="opt" data-opt="1">Li han clonat la targeta i han fet compres a l'estranger</button>
      <button class="opt" data-opt="2">En microdespeses diàries de 2 a 5 euros que el cervell oblida a l'instant</button>
      <button class="opt" data-opt="3">El banc s'ha quedat els diners per error informàtic</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;
        this.state.firstGuess = opt;

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
      await ChatEngine.say("me", "Nil, no t'han hackejat: són les microdespeses. Cada cop que fas «bip» amb el mòbil són 2 o 3 euros que sembla que no comptin, però sumen com un coet.");
      await ChatEngine.say("aina", "Exacte! Mirem l'extracte bancari real del Nil d'aquests últims 14 dies i ho veureu de seguida.");
    } else {
      await ChatEngine.say("me", "Tranquil Nil, abans de denunciar mirem l'historial de moviments.");
      await ChatEngine.say("pau", "A mi em passava sempre abans de treballar: creus que no gastes perquè no compres roba, però les petites fuites et buiden el dipòsit.");
    }

    // Widget interactiu: Extracte bancari d'auditoria
    const feedCard = document.createElement("div");
    feedCard.className = "statement-feed";
    feedCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px dashed var(--line); padding-bottom:8px;">
        <span style="font-weight:800; font-size:13px; color:var(--teal);">📱 Extracte d'operacions · Últims 14 dies</span>
        <span style="font-size:11px; color:var(--mut);">Saldo inicial: <b>85,00 €</b></span>
      </div>

      <div class="statement-row" data-cost="10.80">
        <div class="statement-left">
          <div class="statement-icon">☕</div>
          <div>
            <div style="font-weight:700;">Màquina de cafès / Monster</div>
            <div style="font-size:11px; color:var(--mut);">6 vegades a 1,80 €</div>
          </div>
        </div>
        <div class="statement-amount">− 10,80 €</div>
      </div>

      <div class="statement-row" data-cost="18.50">
        <div class="statement-left">
          <div class="statement-icon">🛵</div>
          <div>
            <div style="font-weight:700;">Glovo (Sopar ràpid + enviament)</div>
            <div style="font-size:11px; color:var(--mut);">Divendres a la nit per mandra</div>
          </div>
        </div>
        <div class="statement-amount">− 18,50 €</div>
      </div>

      <div class="statement-row" data-cost="9.99">
        <div class="statement-left">
          <div class="statement-icon">🎮</div>
          <div>
            <div style="font-weight:700;">Micropagament Brawl Stars / Skins</div>
            <div style="font-size:11px; color:var(--mut);">Gems i caixa especial</div>
          </div>
        </div>
        <div class="statement-amount">− 9,99 €</div>
      </div>

      <div class="statement-row" data-cost="16.40">
        <div class="statement-left">
          <div class="statement-icon">🛴</div>
          <div>
            <div style="font-weight:700;">Patinets elèctrics de lloguer</div>
            <div style="font-size:11px; color:var(--mut);">4 viatges curts per no caminar</div>
          </div>
        </div>
        <div class="statement-amount">− 16,40 €</div>
      </div>

      <div class="statement-row" data-cost="12.00">
        <div class="statement-left">
          <div class="statement-icon">🍿</div>
          <div>
            <div style="font-weight:700;">Snacks i xuxes a la sortida</div>
            <div style="font-size:11px; color:var(--mut);">Begudes i patates en colla</div>
          </div>
        </div>
        <div class="statement-amount">− 12,00 €</div>
      </div>

      <div class="statement-row" data-cost="15.99">
        <div class="statement-left">
          <div class="statement-icon">🔁</div>
          <div>
            <div style="font-weight:700;">Subscripció renovada automàtica</div>
            <div style="font-size:11px; color:var(--mut);">Servei de proves que va oblidar cancel·lar</div>
          </div>
        </div>
        <div class="statement-amount">− 15,99 €</div>
      </div>

      <div style="background:#131d24; border:1px solid var(--line); border-radius:10px; padding:12px; margin-top:10px; text-align:center;">
        <span style="font-size:12px; color:var(--mut); text-transform:uppercase;">Total d'aquestes microdespeses invisibles:</span>
        <div style="font-size:26px; font-weight:800; color:var(--warn); margin:4px 0;">− 83,68 €</div>
        <p style="font-size:12px; color:var(--ink); margin:0;">
          Dels 85,00 € inicials només et queden <b>1,32 €</b>. Cap gran compra, només pagaments ràpids!
        </p>
      </div>

      <button class="btn" id="btn-step1-next" style="width:100%; margin-top:14px;">
        Pas 2: Calculadora de despeses formiga (l'efecte bola de neu) →
      </button>
    `;

    ChatEngine.embedCard(feedCard);

    feedCard.querySelectorAll(".statement-row").forEach(row => {
      row.onclick = () => {
        row.classList.toggle("revealed");
        ChatEngine.triggerHaptic();
      };
    });

    feedCard.querySelector("#btn-step1-next").onclick = async () => {
      feedCard.querySelector("#btn-step1-next").remove();

      ChatEngine.notifyMoneyChange(-83.68, "Microdespeses formiga i subscripció oblidada!");

      await ChatEngine.say("nil", "ESTIC EN XOC. Més de 83 euros en cafès, patinets i una subscripció que ni recordava que tenia?? Se m'ha quedat el compte a 1,32 €!");
      await ChatEngine.say("aina", "Nil, no et sentis sol. A mi l'any passat em van cobrar una app de filtres de fotos que vaig usar una tarda i me la van estar cobrant durant 10 mesos... 50 € llençats per pura mandra de mirar l'extracte!");
      await ChatEngine.say("marc", "Això és exactament el que s'anomena **despeses formiga**. Són petites com formigues de manera individual, però quan s'ajunten es mengen tot el teu pressupost com una plaga.");
      await ChatEngine.say("marta", "Pagar amb el mòbil o contactless no fa mal físic com treure un bitllet de 50 € de la cartera. Per això el cervell no ho registra.");

      ChatEngine.embedMaxim("Les grans fuites d'estalvi no solen venir de compres gegants, sinó de microdespeses diàries que no deixen rastre a la teva memòria.");

      await ChatEngine.wait(350);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: LA CALCULADORA DE DESPESES FORMIGA ("L'EFECTE BOLA DE NEU")
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Calculadora formiga: l'efecte bola de neu");

    await ChatEngine.say("pau", "Ara farem un exercici que us canviarà la perspectiva: agafem la calculadora i mirem quant costen aquestes formigues al cap d'un any sencer.");
    await ChatEngine.say("aina", "Tria quines d'aquestes despeses tens tu o els teus amics i mira què sumen a 12 mesos vista:");

    const calcCard = document.createElement("div");
    calcCard.className = "ant-calculator-box";
    calcCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:14px;">🐜 Simulador d'Impacte Anual de Microdespeses</span>
        <span class="contract-badge">Calculadora en viu</span>
      </div>
      <p class="note">Marca o desmarca les teves microdespeses habituals per calcular el cost:</p>

      <div id="ant-items-list">
        ${this.ANT_ITEMS.map(item => `
          <div class="ant-item ${this.state.antExpensesSelected.includes(item.id) ? "selected" : ""}" data-id="${item.id}">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="ant-checkbox">${this.state.antExpensesSelected.includes(item.id) ? "✓" : ""}</span>
              <span style="font-size:20px;">${item.icon}</span>
              <div>
                <div style="font-weight:700; font-size:13px;">${item.name}</div>
                <div class="ant-item-meta">${item.desc}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; font-size:13px; color:var(--warn);">+${item.costMonthly} €/mes</div>
              <div style="font-size:10px; color:var(--mut);">${item.costYearly} €/any</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="ant-totals-dashboard">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; border-bottom:1px solid var(--line); padding-bottom:12px;">
          <div>
            <div style="font-size:11px; color:var(--mut); text-transform:uppercase;">Cost al mes</div>
            <div style="font-size:24px; font-weight:800; color:var(--warn);" id="ant-total-monthly">0 €</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--mut); text-transform:uppercase;">Cost a l'any</div>
            <div style="font-size:24px; font-weight:800; color:var(--gold);" id="ant-total-yearly">0 €</div>
          </div>
        </div>

        <div style="margin-top:12px;">
          <span style="font-size:12px; font-weight:700; color:var(--ink);">Aquests diners anuals equivalen a:</span>
          <div class="ant-equiv-grid">
            <div class="ant-equiv-card">
              <div class="ant-equiv-icon">✈️</div>
              <div class="ant-equiv-title">Viatge a Europa</div>
              <div class="ant-equiv-desc" id="equiv-trip">Vol + 5 nits d'hotel</div>
            </div>
            <div class="ant-equiv-card">
              <div class="ant-equiv-icon">🚗</div>
              <div class="ant-equiv-title">Carnet de Conduir</div>
              <div class="ant-equiv-desc" id="equiv-license">Pràctiques + taxes</div>
            </div>
            <div class="ant-equiv-card">
              <div class="ant-equiv-icon">💻</div>
              <div class="ant-equiv-title">Ordinador / Mòbil</div>
              <div class="ant-equiv-desc" id="equiv-gadget">Portàtil complet nou</div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;">
        Pas 3: L'auditoria de subscripcions invisibles →
      </button>
    `;

    ChatEngine.embedCard(calcCard);

    const updateTotals = () => {
      let monthly = 0;
      let yearly = 0;
      this.state.antExpensesSelected.forEach(id => {
        const item = this.ANT_ITEMS.find(it => it.id === id);
        if (item) {
          monthly += item.costMonthly;
          yearly += item.costYearly;
        }
      });

      this.state.monthlyAntTotal = monthly;
      this.state.yearlyAntTotal = yearly;

      calcCard.querySelector("#ant-total-monthly").textContent = `${monthly} €`;
      calcCard.querySelector("#ant-total-yearly").textContent = `${yearly} €`;

      const tripDesc = calcCard.querySelector("#equiv-trip");
      const licDesc = calcCard.querySelector("#equiv-license");
      const gadDesc = calcCard.querySelector("#equiv-gadget");

      if (yearly < 300) {
        tripDesc.textContent = "Una escapada de cap de setmana";
        licDesc.textContent = "Matrícula teòrica autoescola";
        gadDesc.textContent = "Auriculars d'alta gamma";
      } else if (yearly < 800) {
        tripDesc.textContent = "1 setmana a Roma o Berlín";
        licDesc.textContent = "Més del 60% del carnet";
        gadDesc.textContent = "Consola PS5 o iPad";
      } else {
        tripDesc.textContent = "Viatge complet de 10 dies";
        licDesc.textContent = "Carnet sencer pagat (100%)";
        gadDesc.textContent = "Portàtil nou per estudiar";
      }
    };

    updateTotals();

    calcCard.querySelectorAll(".ant-item").forEach(itemEl => {
      itemEl.onclick = () => {
        const id = Number(itemEl.dataset.id);
        const idx = this.state.antExpensesSelected.indexOf(id);
        if (idx >= 0) {
          this.state.antExpensesSelected.splice(idx, 1);
          itemEl.classList.remove("selected");
          itemEl.querySelector(".ant-checkbox").textContent = "";
        } else {
          this.state.antExpensesSelected.push(id);
          itemEl.classList.add("selected");
          itemEl.querySelector(".ant-checkbox").textContent = "✓";
        }
        ChatEngine.triggerHaptic();
        updateTotals();
      };
    });

    calcCard.querySelector("#btn-step2-next").onclick = async () => {
      calcCard.querySelector("#btn-step2-next").remove();

      await ChatEngine.say("nil", `Estic flipant... Els meus hàbits seleccionats sumen **${this.state.yearlyAntTotal} € l'any**! Em podia haver pagat el carnet de conduir sencer!`);
      await ChatEngine.say("marc", "Ningú et diu que no et prenguis mai un cafè ni mengis una pizza amb els col·legues. El truc és **triar conscientment**: prefereixes 3 patinets i 4 snacks que oblides en 1 hora, o 800 € per anar-te'n de viatge a l'estiu?");
      await ChatEngine.say("marta", "Exactament! Els diners són limitats: quan dius 'sí' a una microdespesa inútil, estàs dient 'no' als teus objectius importants.");

      ChatEngine.embedMaxim("No eliminis tot el que t'agrada. Elimina la repetició inconscient i conserva les despeses que realment valores.");

      await ChatEngine.wait(350);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: L'AUDITORIA DE SUBSCRIPCIONS INVISIBLES AMB FEEDBACK DETALLAT
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "Subscripcions: el goteig mensual");

    await ChatEngine.say("marta", "I ara anem a la reina de les despeses formiga modernes: **les subscripcions mensuals**.");
    await ChatEngine.say("nil", "Però si Spotify o el núvol valen imports molt petits!");
    await ChatEngine.say("marc", "10 d'aquí, 8 d'una app de fitness que no obres, 3 del núvol i 30 de sèries... I a sobre la majoria són proves gratuïtes que vas oblidar cancel·lar.");
    await ChatEngine.say("aina", "Fem una auditoria en directe: has de decidir què mantens i què cancel·les. Cada decisió tindrà un consell financer real:");

    const subCard = document.createElement("div");
    subCard.className = "chat-embed-card";
    subCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <b style="font-size:14px; color:var(--teal);">📱 Auditoria de Rebuts Recurrents</b>
          <div style="font-size:11px; color:var(--mut);">Decideix què mantens i què cancel·les</div>
        </div>
        <span class="contract-badge">Audit en viu</span>
      </div>

      <div id="subs-items-container" style="display:flex; flex-direction:column; gap:10px; margin:12px 0;"></div>

      <div style="background:#131c22; border:1px solid var(--line); border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:center;">
          <div>
            <div style="font-size:11px; color:var(--mut); text-transform:uppercase;">Cost que mantens</div>
            <div style="font-size:20px; font-weight:800; color:var(--ink);" id="subs-kept-val">52,94 €/mes</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--mut); text-transform:uppercase;">Estalvi si cancel·les</div>
            <div style="font-size:20px; font-weight:800; color:var(--teal);" id="subs-saved-val">+ 0,00 €/mes</div>
          </div>
        </div>
        <div id="subs-summary-text" style="font-size:12px; line-height:1.5; color:var(--mut); margin-top:10px; text-align:center;">
          Encara no has cancel·lat cap subscripció oblidada.
        </div>
      </div>

      <button class="btn gold" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: El dilema de compra impulsiva (La regla de les 48h) →
      </button>
    `;

    ChatEngine.embedCard(subCard);

    const container = subCard.querySelector("#subs-items-container");
    const keptDisplay = subCard.querySelector("#subs-kept-val");
    const savedDisplay = subCard.querySelector("#subs-saved-val");
    const summaryText = subCard.querySelector("#subs-summary-text");

    const updateSubsDashboard = () => {
      let keptTotal = 0;
      let savedTotal = 0;

      this.SUBSCRIPTIONS.forEach(s => {
        if (s.status === "keep") {
          keptTotal += s.cost;
        } else {
          savedTotal += s.cost;
        }
      });

      this.state.subsCancelledTotal = savedTotal;
      keptDisplay.textContent = `${keptTotal.toFixed(2)} €/mes`;
      savedDisplay.textContent = `+ ${savedTotal.toFixed(2)} €/mes`;

      const yearlySaved = savedTotal * 12;
      if (savedTotal === 0) {
        summaryText.innerHTML = `Encara no has cancel·lat cap subscripció. Revisa les que no fas servir!`;
      } else {
        summaryText.innerHTML = `
          <b style="color:var(--ok);">🎉 Recuperaries ${yearlySaved.toFixed(2)} € cada any!</b><br>
          Diners nets recuperats per al teu coixí o el carnet sense perdre res essencial.
        `;
      }
    };

    // Render de cada fila amb botons Mantenir / Cancel·lar i feedback
    this.SUBSCRIPTIONS.forEach(sub => {
      const card = document.createElement("div");
      card.className = "sub-item-card";
      card.id = `sub-card-${sub.id}`;
      card.style.cssText = "display:flex; flex-direction:column; gap:8px; padding:12px; background:var(--bub); border-radius:10px; border:1px solid var(--line);";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:24px;">${sub.icon}</span>
            <div>
              <div style="font-weight:700; font-size:13px;">${sub.name}</div>
              <div style="font-size:11px; color:var(--mut);">${sub.freq}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <b style="font-size:13px;">${sub.cost.toFixed(2)} €/m</b>
            <div style="font-size:10px; color:var(--mut);">${(sub.cost * 12).toFixed(2)} €/any</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:4px;">
          <button type="button" class="opt active btn-sub-keep" style="margin:0; text-align:center; padding:6px; font-size:12px;">✓ Mantenir</button>
          <button type="button" class="opt btn-sub-cancel" style="margin:0; text-align:center; padding:6px; font-size:12px;">✕ Cancel·lar</button>
        </div>

        <div class="sub-advice-box" style="display:none; padding:8px 10px; border-radius:8px; font-size:11px; line-height:1.4;"></div>
      `;

      const btnKeep = card.querySelector(".btn-sub-keep");
      const btnCancel = card.querySelector(".btn-sub-cancel");
      const adviceBox = card.querySelector(".sub-advice-box");

      const handleChoice = (action) => {
        sub.status = action;
        adviceBox.style.display = "block";

        if (action === "keep") {
          btnKeep.classList.add("sel");
          btnCancel.classList.remove("sel");
          const adv = sub.adviceKeep;
          adviceBox.style.background = adv.good ? "var(--ok2)" : "var(--warn2)";
          adviceBox.style.border = `1px solid ${adv.good ? "var(--ok)" : "var(--warn)"}`;
          adviceBox.style.color = adv.good ? "var(--ok)" : "var(--warn)";
          adviceBox.innerHTML = adv.text;
        } else {
          btnCancel.classList.add("sel");
          btnKeep.classList.remove("sel");
          const adv = sub.adviceCancel;
          adviceBox.style.background = adv.good ? "var(--ok2)" : "var(--warn2)";
          adviceBox.style.border = `1px solid ${adv.good ? "var(--ok)" : "var(--warn)"}`;
          adviceBox.style.color = adv.good ? "var(--ok)" : "var(--warn)";
          adviceBox.innerHTML = adv.text;
        }

        ChatEngine.triggerHaptic();
        updateSubsDashboard();
      };

      btnKeep.onclick = () => handleChoice("keep");
      btnCancel.onclick = () => handleChoice("cancel");

      container.appendChild(card);
    });

    updateSubsDashboard();

    subCard.querySelector("#btn-step3-next").onclick = async () => {
      subCard.querySelector("#btn-step3-next").remove();

      const monthlySaved = this.state.subsCancelledTotal;
      if (monthlySaved > 0) {
        await ChatEngine.say("nil", `Només revisant quatre rebuts puc recuperar **${monthlySaved.toFixed(2)} € al mes**, que són **${(monthlySaved * 12).toFixed(2)} € a l'any**!`);
        await ChatEngine.say("pau", "I sense renunciar a cap cosa que gaudeixis. Simplement has deixat de pagar serveis que tenies abandonats.");
      } else {
        await ChatEngine.say("nil", "M'ho he mirat amb calma i he vist que és clau no deixar serveis en pilot automàtic si no els obres.");
      }

      await ChatEngine.say("marc", "Fes aquesta auditoria cada 3 o 4 mesos: busca a l'app del banc els càrrecs repetits i pregunta't si encara els utilitzes.");
      ChatEngine.embedMaxim("Una subscripció només és barata si la utilitzes. Si l'has oblidat, qualsevol import és massa car.");

      await ChatEngine.wait(350);
      this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: EL SIMULADOR DE COMPRA IMPULSIVA (LA REGLA DE LES 48 HORES)
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "La regla de les 48h i el teu repte");

    await ChatEngine.say("nil", "D'acord, ja sé detectar les despeses formiga i les subscripcions. Però què faig quan veig un anunci a Instagram o una botiga i em venen unes ganes brutals de comprar?");
    await ChatEngine.say("pau", "A mi em passava sempre: veia «Últimes unitats» i comprava abans de pensar si realment ho volia.");
    await ChatEngine.say("marta", "Per això existeix una tècnica infal·lible: la **regla de les 48 hores**.");
    await ChatEngine.say("aina", "Mireu aquest cas real i trieu què faríeu:");

    // Mini-simulador de compra impulsiva
    const impulseCard = document.createElement("div");
    impulseCard.className = "chat-embed-card";
    impulseCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        ⏳ Simulador de Decisió: L'Oferta Bomba
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Estàs mirant el mòbil i veus un anunci d'unes vambes que t'agraden:
      </p>

      <div style="background:var(--bub); border-radius:10px; padding:12px; margin-bottom:12px; border:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <b style="font-size:13px; color:var(--ink);">👟 Vambes Urban Limited Edition</b>
          <div style="font-size:11px; color:var(--warn); margin-top:2px;">«Només avui. Queden 2 unitats en estoc.»</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; text-decoration:line-through; color:var(--mut);">90,00 €</span>
          <b style="font-size:16px; color:var(--warn); display:block;">59,99 €</b>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button type="button" class="opt" data-choice="buy">
          <b>Opció A: Comprar-les ara mateix</b><br>
          <span style="font-size:11px; color:var(--mut);">«No puc deixar escapar una rebaixa de 30 €!»</span>
        </button>
        <button type="button" class="opt" data-choice="wait">
          <b>Opció B: Guardar-les a la llista de desitjos i esperar 48 hores</b><br>
          <span style="font-size:11px; color:var(--mut);">Aplicar la regla d'or de les 48 hores per refredar l'impuls.</span>
        </button>
        <button type="button" class="opt" data-choice="credit">
          <b>Opció C: Pagar-les en 3 terminis de 20 €</b><br>
          <span style="font-size:11px; color:var(--mut);">Comprar-les ajornant el pagament perquè sembla menys diners.</span>
        </button>
      </div>

      <div id="impulse-result-box" style="display:none; margin-top:12px; padding:12px; border-radius:10px; font-size:12px; line-height:1.5;"></div>

      <button class="btn" id="btn-impulse-next" style="display:none; width:100%; margin-top:14px;">
        Veure el meu Potencial d'Estalvi i el Repte Real →
      </button>
    `;

    ChatEngine.embedCard(impulseCard);

    const resultBox = impulseCard.querySelector("#impulse-result-box");
    const nextBtn = impulseCard.querySelector("#btn-impulse-next");

    impulseCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        impulseCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const choice = btn.dataset.choice;
        this.state.impulseChoice = choice;

        resultBox.style.display = "block";
        nextBtn.style.display = "block";

        if (choice === "wait") {
          btn.classList.add("right");
          ChatEngine.triggerHaptic();
          resultBox.style.background = "var(--ok2)";
          resultBox.style.border = "1.5px solid var(--ok)";
          resultBox.style.color = "var(--ok)";
          resultBox.innerHTML = `
            <b>✓ DECISIÓ CONSCIENT I INTEL·LIGENT</b><br>
            Dues hores després te'n vas a entrenar i recordes que ja tens dues vambes a l'armari. Al cap de 48 hores la febre del desig s'ha apagat del tot. <b>T'has estalviat 59,99 € nets</b> a la teva guardiola!
          `;
        } else if (choice === "credit") {
          btn.classList.add("wrong");
          impulseCard.querySelector('[data-choice="wait"]').classList.add("right");
          resultBox.style.background = "var(--warn2)";
          resultBox.style.border = "1.5px solid var(--warn)";
          resultBox.style.color = "var(--warn)";
          resultBox.innerHTML = `
            <b>✕ DOBLE PARANY PSICOLÒGIC</b><br>
            No només has comprat per impuls sense necessitar-ho, sinó que a sobre et compromets a pagar deutes els propers mesos. Fraccionar el preu no fa que les vambes siguin gratuïtes!
          `;
        } else {
          btn.classList.add("wrong");
          impulseCard.querySelector('[data-choice="wait"]').classList.add("right");
          resultBox.style.background = "var(--warn2)";
          resultBox.style.border = "1.5px solid var(--warn)";
          resultBox.style.color = "var(--warn)";
          resultBox.innerHTML = `
            <b>⚠ EL PARANY DE LA FALSA REBAIXA</b><br>
            No has estalviat 30 €: <b>has gastat 60 € que tenies al compte</b>! Una oferta només és estalvi si ja tenies previst comprar aquell producte abans de veure l'anunci.
          `;
        }
      };
    });

    nextBtn.onclick = async () => {
      nextBtn.remove();

      await ChatEngine.say("nil", "Això de «he estalviat 30 € perquè estava rebaixat» era una trampa mental del meu cervell. En realitat he buidat 60 € del compte.");
      await ChatEngine.say("marc", "Exacte! Les 48 hores no et prohibeixen comprar res: simplement separen l'impuls químic del moment de la decisió madura.");

      // Càlcul del potencial d'estalvi personalitzat
      const antReductionMonthly = this.state.monthlyAntTotal * 0.5;
      const subSavingsMonthly = this.state.subsCancelledTotal;
      const totalMonthlyPotential = antReductionMonthly + subSavingsMonthly;
      const totalYearlyPotential = totalMonthlyPotential * 12;

      const recapCard = document.createElement("div");
      recapCard.className = "chat-embed-card";
      recapCard.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span style="font-size:24px;">🐜</span>
          <h3 style="margin:0; font-size:16px;">Com blindar-te contra les despeses formiga</h3>
        </div>

        <div style="font-size:13px; line-height:1.6; margin:10px 0;">
          <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">1. La regla d'or de les 48 hores:</b><br>
            <span style="color:var(--ink);">Si vols un caprici no essencial de més de 25 € o 30 €, espera dos dies. Si després de 48h encara ho vols i tens diners, compra'l sense culpa.</span>
          </div>

          <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">2. Audita els rebuts periòdics:</b><br>
            <span style="color:var(--ink);">Revisa cada 3 mesos les subscripcions. Conserva les que uses diàriament i cancel·la les que pagues per mandra.</span>
          </div>

          <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">3. Bossa d'oci tancada per setmana:</b><br>
            <span style="color:var(--ink);">Assigna't una quantitat fixa de diners per a cafès i sortides cada dilluns. Si s'acaba abans de divendres, s'ha acabat fins a la setmana vinent.</span>
          </div>
        </div>

        <!-- Potencial d'estalvi personalitzat -->
        <div style="margin-top:14px; padding:14px; border-radius:12px; background:var(--ok2); border:1.5px solid var(--ok); text-align:center;">
          <span style="font-size:11px; text-transform:uppercase; color:var(--ok); font-weight:800; letter-spacing:1px;">El teu potencial d'estalvi calculat</span>
          <div style="font-size:26px; font-weight:900; color:var(--ok); margin:3px 0;">+ ${totalYearlyPotential.toFixed(2)} € l'any</div>
          <p style="font-size:12px; color:var(--ink); margin:0;">
            Reduint només a la meitat les teves despeses formiga (${antReductionMonthly.toFixed(2)} €/m) i cancel·lant les subscripcions no aprofitades (${subSavingsMonthly.toFixed(2)} €/m).
          </p>
        </div>

        <div class="maxim" style="margin-left:0; margin-top:14px;">
          <span>Frase per recordar</span>
          Les grans fuites d'estalvi no solen venir de compres gegants, sinó de microdespeses diàries que no deixen rastre a la teva memòria.
        </div>

        <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
          <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
          <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Agafa el teu mòbil ara mateix i fes aquesta comprovació en 1 minut:</p>
          <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
            <li><b>A iPhone:</b> Obre Ajustos → Clica el teu nom al capdamunt → <b>Subscripcions</b>.</li>
            <li><b>A Android:</b> Obre Google Play Store → Toca el teu perfil a dalt a la dreta → <b>Pagaments i subscripcions</b>.</li>
            <li><b>Repte:</b> Cancel·la com a mínim UNA subscripció o prova gratuïta que no hagis fet servir en l'últim mes.</li>
          </ul>
        </div>

        <button class="btn gold" id="btn-finish-cap4" style="width:100%; margin-top:16px;">
          Completar Capítol 4 i blindar la meva pasta 🏆
        </button>
      `;

      ChatEngine.embedCard(recapCard);

      recapCard.querySelector("#btn-finish-cap4").onclick = () => {
        recapCard.querySelector("#btn-finish-cap4").disabled = true;

        // Desem dades
        AppState.saveChapterData(4, "yearlyAntTotal", this.state.yearlyAntTotal);
        AppState.saveChapterData(4, "subsCancelledTotal", this.state.subsCancelledTotal);
        AppState.saveChapterData(4, "potentialYearlySavings", totalYearlyPotential);

        // Bonificació virtual proporcional al coixí (mínim 30 €, màxim 80 €)
        const virtualReward = Math.min(Math.max(Math.round(totalMonthlyPotential), 30), 80);
        AppState.completeChapter(4, virtualReward, null);

        ChatEngine.celebrate(
          "Capítol 4 completat amb èxit!",
          `Has après a frenar les despeses formiga, la regla de les 48 hores i tens un potencial de +${totalYearlyPotential.toFixed(2)} € l'any.`,
          virtualReward,
          5,
          () => {
            window.loadChapter(5);
          }
        );
      };
    };
  }
};
