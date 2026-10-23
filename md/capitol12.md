<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol12.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol12.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL12.JS - Guió i lògica interactiva del Capítol 12: "Visc sol: el cop de realitat"
 */

const Capitol12 = {
  id: 12,
  title: "Capítol 12 · Visc sol: el cop de realitat",
  totalSteps: 4,

  state: {
    roomPrice: 380,
    suppliesCost: 75,
    groceriesCost: 210,
    transportCost: 30,
    userNetSalary: 1100
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: LA FANTASIA DEL NIL I EL COP DE REALITAT
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "La fantasia de marxar de casa: 380 €?");

    await ChatEngine.say("nil", "NOIS!! Ha arribat el gran moment! Feu les maletes que marxo de casa dels meus pares!!");
    await ChatEngine.say("marta", "Com que marxes de casa, Nil? Però si tot just comences a treballar a mitja jornada!");
    await ChatEngine.say("nil", "He trobat una habitació en un pis compartit a 15 minuts del centre per **només 380 € al mes**. I com que cobro uns 600 € nets a mitja jornada en una cafeteria, ja em surten els números de sobres!");
    await ChatEngine.say("nil", "600 € menys 380 € de lloguer... encara em sobren 220 € nets cada mes per anar de festa i comprar roba! La llibertat és meva!");
    await ChatEngine.say("pau", "Ai Nil... prepara't per a la clatellada de realitat més gran de la teva vida.");
    await ChatEngine.say("marc", "Nil, t'has oblidat literalment de TOT el que costa viure sol que no sigui el sostre d'una habitació.");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">A part dels 380 € d'habitació, quines despeses obligatòries mensuals falten al càlcul del Nil?</p>
      <button class="opt" data-opt="1">Res més: la nevera s'omple sola i la llum és de franc</button>
      <button class="opt" data-opt="2">Subministraments (llum, aigua, gas, wifi), menjar i higiene, transport i despeses inicials de fiança</button>
      <button class="opt" data-opt="3">Només comprar un pòster per decorar la paret</button>
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
      await ChatEngine.say("me", "Nil, amb 220 € no et dona ni per menjar un mes sencer! I qui paga el paper de vàter, l'oli d'oliva o la llum?");
      await ChatEngine.say("aina", "Exacte! Anem a muntar el pressupost real d'un pis compartit d'estudiants o joves treballadors:");
    } else {
      await ChatEngine.say("me", "Ui Nil, em temo que la nevera no s'omple per art de màgia quan marxes de casa.");
      await ChatEngine.say("marc", "Totalment. Mireu els números reals que tothom descobreix tard:");
    }

    await this.step2();
  },

  /* ==========================================================================
     PAS 2: EL SIMULADOR DE DESPESES OCULTES DE LA INDEPENDÈNCIA
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "El simulador: quant costa viure sol realment?");

    const simCard = document.createElement("div");
    simCard.className = "flatshare-box";
    simCard.innerHTML = `
      <div style="font-weight:800; font-size:15px; margin-bottom:4px; color:var(--teal);">
        🏠 El Pressupost Real d'un Pis Compartit
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Aquestes són les despeses mensuals reals de viure en una habitació compartida a ciutat:
      </p>

      <div style="background:var(--bub); border-radius:10px; padding:12px; margin-bottom:12px; border:1px solid var(--line);">
        <b style="font-size:12px; color:var(--gold);">⚠️ COSTOS D'ENTRADA ABANS DE VIURE-HI:</b>
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:4px;">
          <span>Fiança obligatòria (1 o 2 mesos) + Mes en curs:</span>
          <b>~760 € a 1.140 € en efectiu el dia 1</b>
        </div>
      </div>

      <div class="flatshare-row">
        <span>🛏️ Lloguer d'habitació:</span>
        <b style="color:var(--ink);">380,00 €</b>
      </div>
      <div class="flatshare-row">
        <span>⚡ Subministraments (Llum, aigua, gas, wifi dividit entre 3):</span>
        <b style="color:var(--warn);">+75,00 €</b>
      </div>
      <div class="flatshare-row">
        <span>🛒 Compra del supermercat (menjar bàsic, oli, neteja, higiene):</span>
        <b style="color:var(--warn);">+210,00 €</b>
      </div>
      <div class="flatshare-row">
        <span>🚇 Transport mínim (T-Mobilitat jove / transport públic):</span>
        <b style="color:var(--warn);">+30,00 €</b>
      </div>
      <div class="flatshare-row">
        <span>☕ Oci mínim i petits imprevistos personals:</span>
        <b style="color:var(--warn);">+40,00 €</b>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:10px; border-top:2px solid var(--line); font-size:15px; font-weight:800;">
        <span style="color:var(--teal);">COST REAL MENSUAL PER PERSONA:</span>
        <span style="color:var(--warn); font-size:18px;">735,00 € / mes</span>
      </div>

      <div style="background:var(--warn2); border:1px solid var(--warn); border-radius:10px; padding:10px 12px; margin-top:12px; font-size:12px; line-height:1.5;">
        <b style="color:var(--warn);">💥 El balanç del Nil amb 600 € de sou:</b><br>
        Cobrant 600 € i gastant 735 € mensuals... <b>el Nil es troba amb un forat de -135 € cada mes</b>! En 3 mesos tindria deutes i hauria de tornar a casa amb la cua entre les cames.
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;">
        Pas 3: La Regla d'Or del 30% d'habitatge →
      </button>
    `;

    ChatEngine.embedCard(simCard);

    simCard.querySelector("#btn-step2-next").onclick = async () => {
      simCard.querySelector("#btn-step2-next").remove();

      ChatEngine.notifyMoneyChange(-760.00, "Despeses d'entrada: fiances i primer mes d'habitació!");

      await ChatEngine.say("nil", "735 € al mes per viure en una habitació sense luxes?? I he de deixar 760 € en fiances abans de posar el peu al pis??");
      await ChatEngine.say("nil", "Però si amb els meus 600 € de feina a mitja jornada estaria a -135 € cada mes! Això no és independència: és una condemna a menjar arròs blanc i no poder ni agafar el metro!");
      await ChatEngine.say("pau", "Exactament, Nil. Marxar de casa per orgull o pressa és el camí més ràpid per tornar a casa dels pares amb deutes al cap de sis mesos.");
      await ChatEngine.say("marta", "La veritable independència és saber que arribes a final de mes amb tranquil·litat i sense angoixa crònica.");
      await ChatEngine.say("marc", "Per no arruïnar-te, els experts en finances recomanen sempre la **Regla del 30%**:");
      await this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: LA REGLA DEL 30% D'HABITATGE
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "La Regla del 30%: viure sense ofec");

    const ruleCard = document.createElement("div");
    ruleCard.className = "chat-embed-card";
    ruleCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        🛡️ La Regla d'Or del 30% de l'Habitatge
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        El teu lloguer <b>mai no hauria de superar el 30% (o màxim el 35%) dels teus ingressos nets mensuals</b>. Mou el lliscador per calcular el sou que necessites:
      </p>

      <div style="margin:12px 0;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:6px;">
          <span>El teu sou net mensual:</span>
          <span id="salary-slider-display" style="color:var(--teal); font-size:16px; font-weight:900;">1.200 € / mes</span>
        </div>
        <input type="range" id="salary-slider" min="500" max="2200" step="50" value="1200" style="width:100%; accent-color:var(--teal); cursor:pointer;">
      </div>

      <!-- Barra de mesura del percentatge -->
      <div class="flatshare-gauge">
        <div class="flatshare-gauge-fill" id="gauge-fill" style="width:31%; background:var(--ok);"></div>
      </div>

      <div id="gauge-analysis-box" style="font-size:12px; line-height:1.5; padding:10px 12px; border-radius:10px; background:var(--bub); border:1px solid var(--line); margin-top:8px;">
        <!-- Càlcul dinàmic -->
      </div>

      <button class="btn" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: Les màximes d'emancipació i la Gran Graduació Final 🎓 →
      </button>
    `;

    ChatEngine.embedCard(ruleCard);

    const slider = ruleCard.querySelector("#salary-slider");
    const display = ruleCard.querySelector("#salary-slider-display");
    const gauge = ruleCard.querySelector("#gauge-fill");
    const analysisBox = ruleCard.querySelector("#gauge-analysis-box");

    const updateGauge = () => {
      const salary = Number(slider.value);
      this.state.userNetSalary = salary;
      display.textContent = `${salary.toLocaleString("ca-ES")} € / mes`;

      const ratio = (this.state.roomPrice / salary) * 100;
      gauge.style.width = `${Math.min(ratio, 100)}%`;

      if (ratio > 50) {
        gauge.style.background = "var(--warn)";
        analysisBox.innerHTML = `
          <b style="color:var(--warn);">🚨 ZONA DE PERILL EXTREM (${ratio.toFixed(0)}% del sou destinat al lloguer)</b><br>
          Destines més de la meitat del teu sou només a l'habitació. Amb aquest sou (<b>${salary} €</b>), viure sol et portarà directament a la ruïna i a l'angoixa crònica.
        `;
      } else if (ratio > 35) {
        gauge.style.background = "var(--gold)";
        analysisBox.innerHTML = `
          <b style="color:var(--gold);">⚠️ ZONA JUSTA / AJUSTADA (${ratio.toFixed(0)}% del sou)</b><br>
          Superes el 35% recomanat. Pots sobreviure, però aniràs molt just per imprevistos i no podràs estalviar per a les teves metes.
        `;
      } else {
        gauge.style.background = "var(--ok)";
        analysisBox.innerHTML = `
          <b style="color:var(--ok);">✅ ZONA SALUDABLE I SEGURA (${ratio.toFixed(0)}% del sou)</b><br>
          L'habitació representa menys del 35% del teu sou. Tens marge per pagar el menjar, sortir amb amics, mantenir el teu coixí d'emergència i viure feliç i tranquil.
        `;
      }
    };

    slider.oninput = updateGauge;
    updateGauge();

    ruleCard.querySelector("#btn-step3-next").onclick = async () => {
      ruleCard.querySelector("#btn-step3-next").remove();
      await ChatEngine.say("nil", "Ara ho veig claríssim. La veritable independència no és sortir corrents de casa dels pares per viure menjant arròs blanc i patint pel rebut de la llum. La independència és viure sense ofec.");
      await ChatEngine.say("marta", "Molt ben dit Nil! Estem super orgullosos del que has après en aquests 12 capítols!");
      await ChatEngine.say("aina", "Hem passat de voler comprar un mòbil a 36 mesos a saber exactament com dominar la nostra pasta!");
      await this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: FRASE PER RECORDAR I GRAN GRADUACIÓ FINAL DEL CURS
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Graduació Final: Diploma de Finances Personals");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">🔑</span>
        <h3 style="margin:0; font-size:16px;">Les 3 claus per al teu futur independent</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. Compte amb els costos invisibles:</b><br>
          <span style="color:var(--ink);">El menjar, la neteja i els subministraments sumen tant o més que el mateix lloguer. Fes el teu pressupost abans de signar res.</span>
        </div>

        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. La regla del 30% és la teva salut mental:</b><br>
          <span style="color:var(--ink);">Mai gastis més d'un terç del que guanyes en lloguer; el restant és el que et permet viure de debò.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Guarda sempre el teu coixí de 3 mesos:</b><br>
          <span style="color:var(--ink);">Abans d'emancipar-te, tingues guardat l'equivalent a un parell de mesos de vida per a qualsevol imprevist.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        Marxar de casa no és només pagar el lloguer: és saber que el sabó de la rentadora, l'oli i el rebut de la llum no es paguen sols. La llibertat comença amb un pressupost real.
      </div>

      <!-- DIPLOMA FINAL DE GRADUACIÓ -->
      <div class="diploma-box">
        <div class="diploma-header">🎓 ACREDITACIÓ OFICIAL FINAL · 12 CAPÍTOLS</div>
        <div class="diploma-title">Expert en Finances per a Joves</div>
        <p style="font-size:13px; color:var(--ink); margin:0 0 12px; line-height:1.5;">
          Has completat amb èxit els <b>4 blocs pedagògics</b> del curs: des del teu primer sou fins a la nòmina d'adult, la renda i l'emancipació.
        </p>

        <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin:14px 0;">
          <span style="background:var(--card); border:1px solid var(--teal); border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; color:var(--teal);">
            🛡️ Coixí blindat
          </span>
          <span style="background:var(--card); border:1px solid var(--gold); border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; color:var(--gold);">
            🎯 Objectius SMART
          </span>
          <span style="background:var(--card); border:1px solid var(--ok); border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; color:var(--ok);">
            🧠 Zero Deutes Absurds
          </span>
          <span style="background:var(--card); border:1px solid #3b82f6; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; color:#3b82f6;">
            📑 Renda & Nòmina Dominades
          </span>
        </div>

        <div style="margin-top:14px; font-size:12px; color:var(--mut);">
          La teva colla virtual (Nil, Marc, Marta, Aina i Pau) t'acompanyarà sempre amb el millor criteri financer!
        </div>
      </div>

      <button class="btn gold" id="btn-finish-all-course" style="width:100%; margin-top:14px; font-size:16px; padding:14px;">
        🎉 COMPLETAR TOT EL CURS DE FINANCES (12/12) 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-all-course").onclick = () => {
      recapCard.querySelector("#btn-finish-all-course").disabled = true;

      // Desem dades a l'estat
      AppState.saveChapterData(12, "completedAll", true);

      // Afegim 100 € de premi final al coixí de l'usuari
      AppState.completeChapter(12, 100, null);

      ChatEngine.celebrate(
        "🎉 ENHORABONA! CURS COMPLETAT (12/12)!",
        "Has finalitzat tots els capítols del Curs de Finances per a Joves. Ara tens totes les eines per gestionar els teus diners amb èxit!",
        100,
        1,
        () => {
          window.location.hash = "#dashboard";
        }
      );
    };
  }
};
