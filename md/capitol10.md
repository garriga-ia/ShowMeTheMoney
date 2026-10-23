<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol10.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol10.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL10.JS - Guió i lògica interactiva del Capítol 10: "La nòmina de debò"
 */

const Capitol10 = {
  id: 10,
  title: "Capítol 10 · La nòmina de debò",
  totalSteps: 4,

  state: {
    firstGuess: null,
    activeInspectId: null,
    pagaMode: "12",
    annualGross: 18000
  },

  PAYROLL_SECTIONS: [
    {
      id: "salari-base",
      title: "1. Salari Base + Complements",
      amount: "1.500,00 € (brut mensual en 12 pagues)",
      type: "ingres",
      desc: "És la xifra bruta pactada al teu contracte segons el conveni col·lectiu del sector. Encara no té cap descompte aplicat."
    },
    {
      id: "contingencies",
      title: "2. Seguretat Social: Contingències Comunes (4,70%)",
      amount: "-70,50 €",
      type: "deduccio",
      desc: "Garanteix la teva baixa mèdica si et poses malalt o tens un accident, i comença a generar drets per a la teva jubilació futura."
    },
    {
      id: "atur-fp",
      title: "3. Seguretat Social: Atur + Formació + MEI (~1,65%)",
      amount: "-24,75 €",
      type: "deduccio",
      desc: "Cotitza per si et quedes sense feina (prestació d'atur), cursos de formació contínua i el mecanisme d'equitat intergeneracional."
    },
    {
      id: "irpf",
      title: "4. Retenció a compte de l'IRPF (~6,00% segons contracte)",
      amount: "-90,00 €",
      type: "deduccio",
      desc: "Un avançament a Hisenda per al teu impost sobre la renda. L'empresa l'ingressa directament a l'Agència Tributària cada mes."
    },
    {
      id: "liquid",
      title: "5. Líquid Total a Percebre (Sou Net)",
      amount: "1.314,75 €",
      type: "net",
      desc: "Els diners nets finals que l'empresa transfereix al teu compte bancari el dia de cobrament. Aquest és el teu pressupost real!"
    }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'OFERTA DE FEINA DE 18.000 € I EL MIRATGE
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'oferta de 18.000 € i el miratge dels 1.500 €");

    await ChatEngine.say("pau", "Nois, tinc una bona notícia! Després d'acabar el cicle formatiu m'han fet la meva primera oferta de contracte indefinit en una empresa!");
    await ChatEngine.say("marta", "Moltíssimes felicitats, Pau!! Què t'ofereixen exactament?");
    await ChatEngine.say("pau", "Al document de la proposta posa textualment: **«Retribució anual bruta: 18.000 €»**.");
    await ChatEngine.say("nil", "Osti Pau, estàs forrat!! 18.000 dividit entre 12 mesos són **1.500 € nets cada mes al teu compte**! Ja et pots comprar el cotxe i anar a viure sol demà mateix!");
    await ChatEngine.say("marc", "Nil, per favor... no tornis a confondre brut i net. D'aquests 18.000 € anuals, una part important va directament a Seguretat Social i a Hisenda.");
    await ChatEngine.say("aina", "Exacte. I a més, depèn de si te'l paguen en 12 pagues o en 14 pagues!");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">D'un sou brut de 18.000 € l'any en 12 pagues, quant arribarà aproximadament al compte corrent del Pau?</p>
      <button class="opt" data-opt="1">Exactament 1.500 €, perquè el contracte diu 18.000 €</button>
      <button class="opt" data-opt="2">Al voltant de 1.315 € nets al mes, després de Seguretat Social (~6,35%) i IRPF</button>
      <button class="opt" data-opt="3">Només 600 €, perquè el govern es queda més de la meitat del sou</button>
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
      await ChatEngine.say("me", "Molt ben calculat! Els 18.000 € bruts anuals es queden en uns 1.315 € nets al mes si estan prorratejats en 12 pagues.");
      await ChatEngine.say("pau", "Exacte! Més d'un jove es pensa que tindrà 1.500 € per gastar i després s'endú un xoc el primer mes.");
    } else {
      await ChatEngine.say("me", "Compte Nil, que el sou brut no és el que arriba al banc!");
      await ChatEngine.say("marc", "Efectivament. De 1.500 € bruts, es descompten uns 185 € cada mes entre cotitzacions i IRPF.");
    }

    ChatEngine.notifyMoneyChange(1314.75, "Primer sou net mensual ingressat (18.000 € bruts/any)!");

    await ChatEngine.say("pau", "Us he de reconèixer que a la meva primera feina, quan em van dir «18.000 bruts», em feia tant de respecte semblar ingenu que no vaig gosar preguntar quant em quedaria net ni si eren 12 o 14 pagues! Vaig passar tres setmanes angoixat sense saber què cobraria.");
    await ChatEngine.say("marc", "I a mi em feia una vergonya infinita mirar el cap als ulls i preguntar pel conveni i el sou net. Puc fer totes les derivades del món, però quan toca parlar de diners reals davant d'un superior em tremolava la veu!");
    await ChatEngine.say("nil", "És que ens han ensenyat que parlar de diners és de mala educació! Però si no preguntes tu pel teu sou i els teus drets, qui ho farà?");

    await ChatEngine.say("aina", "Molt ben dit! Obrim la nòmina sencera d'un contracte adult i inspeccionem cadascuna de les línies que signes:");
    await this.step2();
  },

  /* ==========================================================================
     PAS 2: EL DESXIFRADOR DE NÒMINA REGLAMENTÀRIA
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Desxifrador interactiu: on van els teus diners?");

    const payrollCard = document.createElement("div");
    payrollCard.className = "payroll-sheet-mockup";
    payrollCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); padding-bottom:8px; margin-bottom:10px;">
        <div>
          <b style="font-size:13px; color:var(--teal);">📄 FULL DE SALARI (NÒMINA OFICIAL)</b>
          <div style="font-size:11px; color:var(--mut);">Treballador: Pau Ribas · Contracte Indefinit (18.000 € bruts/any)</div>
        </div>
        <span style="font-size:11px; background:var(--bub); padding:4px 8px; border-radius:6px; color:var(--gold);">12 pagues</span>
      </div>

      <p style="font-size:12px; color:var(--mut); margin:0 0 10px;">
        👉 <b>Fes clic a qualsevol línia</b> per descobrir què significa, quant et treuen i quins drets et dona:
      </p>

      <div id="payroll-rows-list"></div>

      <!-- Caixa d'explicació dinàmica -->
      <div id="payroll-detail-box" class="payroll-explainer-box" style="margin-top:12px;">
        <b style="color:var(--teal);">💡 Tria una línia de la nòmina</b> per entendre a on va cadascun dels teus euros.
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;">
        Pas 3: 12 pagues o 14 pagues? Descobreix la diferència →
      </button>
    `;

    ChatEngine.embedCard(payrollCard);

    const rowsContainer = payrollCard.querySelector("#payroll-rows-list");
    const detailBox = payrollCard.querySelector("#payroll-detail-box");

    this.PAYROLL_SECTIONS.forEach((sec, idx) => {
      const row = document.createElement("div");
      row.className = `payroll-interactive-row ${idx === 0 ? "active" : ""}`;
      
      let amountColor = "var(--ink)";
      if (sec.type === "deduccio") amountColor = "var(--warn)";
      if (sec.type === "net") amountColor = "var(--ok)";

      row.innerHTML = `
        <span style="font-weight:700;">${sec.title}</span>
        <span style="font-weight:800; font-family:monospace; color:${amountColor};">${sec.amount}</span>
      `;

      row.onclick = () => {
        payrollCard.querySelectorAll(".payroll-interactive-row").forEach(r => r.classList.remove("active"));
        row.classList.add("active");
        ChatEngine.triggerHaptic();

        detailBox.innerHTML = `
          <b style="color:${amountColor}; font-size:13px;">${sec.title} (${sec.amount})</b>
          <p style="margin:4px 0 0; color:var(--ink);">${sec.desc}</p>
        `;
      };

      rowsContainer.appendChild(row);
    });

    payrollCard.querySelector("#btn-step2-next").onclick = async () => {
      payrollCard.querySelector("#btn-step2-next").remove();
      await ChatEngine.say("nil", "Ara entenc per què no són diners 'robats'. Si et poses malalt o tens un accident, aquestes cotitzacions fan que continuïs cobrant!");
      await ChatEngine.say("pau", "I ara ve l'altra gran pregunta que em van fer a l'entrevista: «Vols 12 pagues o 14 pagues?»");
      await ChatEngine.say("marc", "Mireu com canvia el vostre pressupost mensual segons aquesta decisió:");
      await this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: EL DILEMA DE LES 12 VS 14 PAGUES (PRORRATEIG)
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "12 o 14 pagues? El calendari dels teus diners");

    const pagasCard = document.createElement("div");
    pagasCard.className = "chat-embed-card";
    pagasCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        ⚖️ Comparador: 12 pagues (prorratejades) vs 14 pagues
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        En ambdós casos cobres exactament els mateixos 18.000 € bruts l'any (~15.777 € nets totals), però es reparteixen de manera molt diferent:
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
        <button type="button" class="opt active" id="btn-paga-12" style="margin:0; text-align:center;">
          <b style="display:block; font-size:14px;">12 Pagues</b>
          <span style="font-size:11px; color:var(--mut);">Prorrateig mensual</span>
        </button>
        <button type="button" class="opt" id="btn-paga-14" style="margin:0; text-align:center;">
          <b style="display:block; font-size:14px;">14 Pagues</b>
          <span style="font-size:11px; color:var(--mut);">Estiu i Nadal extres</span>
        </button>
      </div>

      <div id="paga-display-box" style="background:var(--bub); border-radius:10px; padding:14px; border:1px solid var(--line);">
        <!-- Contingut generat dinàmicament -->
      </div>

      <button class="btn" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: Les màximes laborals i el repte real →
      </button>
    `;

    ChatEngine.embedCard(pagasCard);

    const btn12 = pagasCard.querySelector("#btn-paga-12");
    const btn14 = pagasCard.querySelector("#btn-paga-14");
    const displayBox = pagasCard.querySelector("#paga-display-box");

    const updatePagas = (mode) => {
      this.state.pagaMode = mode;
      if (mode === "12") {
        btn12.classList.add("sel");
        btn14.classList.remove("sel");
        displayBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700;">Sou net mensual (12 mesos):</span>
            <b style="font-size:18px; color:var(--teal);">~1.315 € / mes</b>
          </div>
          <div style="margin-top:8px; font-size:12px; line-height:1.5; color:var(--ink);">
            • <b>Avantatge:</b> Cobres una quantitat estable i previsible cada mes. És més fàcil pagar el lloguer i subministraments.<br>
            • <b>A tenir en compte:</b> No hi ha pagues extres a l'estiu ni al Nadal; si vols viatjar o fer regals, has d'haver estalviat tu prèviament.
          </div>
        `;
      } else {
        btn14.classList.add("sel");
        btn12.classList.remove("sel");
        displayBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700;">Sou net ordinari (12 mesos):</span>
            <b style="font-size:18px; color:var(--gold);">~1.127 € / mes</b>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; padding-top:6px; border-top:1px dashed var(--line);">
            <span style="font-weight:700;">+ 2 Pagues extres (Juliol i Desembre):</span>
            <b style="font-size:16px; color:var(--ok);">+1.127 € extres</b>
          </div>
          <div style="margin-top:8px; font-size:12px; line-height:1.5; color:var(--ink);">
            • <b>Avantatge:</b> Rebre una paga doble al juliol i al Nadal et dona aire fresc per a vacances o compres anuals.<br>
            • <b>A tenir en compte:</b> El teu sou ordinari mensual és uns 188 € més baix; has de vigilar de no anar just pagant les despeses fixes mensuals.
          </div>
        `;
      }
    };

    btn12.onclick = () => updatePagas("12");
    btn14.onclick = () => updatePagas("14");
    updatePagas("12");

    pagasCard.querySelector("#btn-step3-next").onclick = async () => {
      pagasCard.querySelector("#btn-step3-next").remove();
      await ChatEngine.say("marta", "Totes dues opcions són correctes, l'important és saber quina tens per fer el pressupost!");
      await ChatEngine.say("me", "Exacte: no pots comptar amb 1.300 € al mes si resulta que en cobres 1.120 € perquè tens dues pagues extres a part.");
      await this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: FRASE PER RECORDAR I REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Les regles de la nòmina i el teu repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">📄</span>
        <h3 style="margin:0; font-size:16px;">Les 3 normes per entrar al món laboral amb criteri</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. Negocia sempre en sou brut anual:</b><br>
          <span style="color:var(--ink);">El contracte sempre expressa el brut. Pregunta quantes pagues anuals són (12 o 14) abans de fer els teus plans.</span>
        </div>

        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. Les deduccions no són diners perduts:</b><br>
          <span style="color:var(--ink);">El ~6,35% de Seguretat Social financia la teva baixa laboral, prestació d'atur i jubilació. Són els teus drets com a treballador.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Guarda sempre les nòmines:</b><br>
          <span style="color:var(--ink);">Descarrega cada mes el document en PDF; és la teva prova d'ingressos per llogar un pis o per fer la declaració de la renda.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        Mai parlis de sou mensual sense aclarir si és brut o net, i en quantes pagues anuals es divideix. Els teus drets comencen entenent el contracte que signes.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquesta petita investigació a casa o amb un company de feina:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li>Pregunta a algú de confiança (pares, germans grans o coneguts que treballin) quantes pagues anuals tenen al seu conveni (12 o 14).</li>
          <li>Pregunta'ls si prefereixen tenir la paga extra per festes o tenir més diners repartits cada mes.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap10" style="width:100%; margin-top:16px;">
        Completar Capítol 10 i entendre la meva nòmina 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap10").onclick = () => {
      recapCard.querySelector("#btn-finish-cap10").disabled = true;

      // Desem dades a l'estat
      AppState.saveChapterData(10, "pagaMode", this.state.pagaMode);

      // Afegim 75 € de guardiola virtual al coixí de l'usuari
      AppState.completeChapter(10, 75, null);

      ChatEngine.celebrate(
        "Capítol 10 completat amb èxit!",
        "Ja saps llegir una nòmina reglamentària d'adult, què financen les cotitzacions i com funcionen les 12 i 14 pagues.",
        75,
        11,
        () => {
          window.loadChapter(11);
        }
      );
    };
  }
};
