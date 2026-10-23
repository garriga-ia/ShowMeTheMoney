<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol6.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol6.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL6.JS - Guió i lògica interactiva del Capítol 6: "Em volen vendre el mòbil a terminis"
 */

const Capitol6 = {
  id: 6,
  title: "Capítol 6 · Em volen vendre el mòbil a terminis",
  totalSteps: 4,

  state: {
    firstGuess: null,
    selectedFinancingMonths: 36,
    revealedFineprint: false,
    trafficScore: 0
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'ANUNCI DEL MÒBIL A 29,99 €/MES I LA LLETRA PETITA
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'anunci: «Només 29,99 € al mes»");

    await ChatEngine.say("nil", "Nois, per fi una bona notícia després del disgust de l'altre dia amb les despeses!");
    await ChatEngine.say("marta", "Quina bona notícia, Nil? Has trobat feina nova?");
    await ChatEngine.say("nil", "He anat a la botiga de mòbils perquè la meva bateria no dura ni 2 hores, i el dependent m'ha ofert l'últim telèfon d'alta gamma per **només 29,99 € al mes**!");
    await ChatEngine.say("nil", "30 euros al mes me'ls puc pagar sense ni adonar-me'n! M'ha dit que és una oportunitat única i que em l'emporto posat avui mateix sense pagar ni un euro d'entrada!");
    await ChatEngine.say("aina", "Nil... para el carro. Durant quants mesos has d'estar pagant aquests 29,99 €?");
    await ChatEngine.say("nil", "Res, un contracte normal de 36 mesos. 3 anys passen volant!");
    await ChatEngine.say("marc", "36 mesos?? Nil, t'estan colant un préstec al consum gegantí.");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">El telèfon val 749 € al comptat. Quant creus que pagarà en total el Nil amb aquesta quota?</p>
      <button class="opt" data-opt="1">Uns 750 €, perquè només divideixen el preu entre 36 mesos</button>
      <button class="opt" data-opt="2">Més de 1.200 €, per culpa dels interessos, comissions d'obertura i assegurances</button>
      <button class="opt" data-opt="3">Només 29,99 €, perquè la resta ho subvenciona la marca</button>
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
      await ChatEngine.say("me", "Nil, t'estan clavant més de 1.200 euros! Pagar 3 anys per un mòbil és una bogeria absoluta.");
      await ChatEngine.say("aina", "Molt ben calculat! Anem a agafar la lupa i a mirar l'anunci real que li han donat:");
    } else {
      await ChatEngine.say("me", "Ui Nil, em temo que la quota petita amaga una factura que et farà tremolar.");
      await ChatEngine.say("marc", "Totalment. Mireu el cartell publicitari i desxifrem la lletra petita que no es veu:");
    }

    // Widget interactiu: Anunci comercial amb lletra petita
    const adCard = document.createElement("div");
    adCard.className = "ad-banner-mockup";
    adCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <span class="ad-badge-promo">OFERTA ESTEL·LAR</span>
          <h3 style="margin:0; font-size:17px; color:#fff;">SuperSmartphone Pro 2026</h3>
          <span style="font-size:12px; color:var(--mut);">Preu de venda al comptat: 749,00 €</span>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; color:#ffb8b0; text-transform:uppercase;">Quota mensual</span>
          <div class="ad-main-price">29,99 €<span style="font-size:14px; font-weight:400; color:var(--mut);">/mes</span></div>
        </div>
      </div>

      <div style="margin-top:10px; font-size:12px; color:var(--ink);">
        «Emporta-te'l avui sense entrada i paga còmodament en 36 mesos.»
      </div>

      <button type="button" class="btn ghost" id="btn-reveal-fineprint" style="width:100%; margin-top:12px; font-size:12px; min-height:38px;">
        🔍 Posar la lupa a la lletra petita del contracte
      </button>

      <div class="ad-fineprint-box" id="fineprint-content" style="display:none;">
        <b style="color:var(--warn); display:block; margin-bottom:4px;">CONDICIONS DEL FINANÇAMENT A 36 MESOS:</b>
        <div>• 36 quotes mensuals de 29,99 € = <b>1.079,64 €</b></div>
        <div>• Comissió d'obertura del finançament (finançada): <b>+ 25,00 €</b></div>
        <div>• Assegurança de protecció de pagaments (4,50 €/mes): <b>+ 162,00 €</b></div>
        <div style="border-top:1px dashed rgba(255,122,107,0.3); padding-top:6px; margin-top:6px; font-size:12px;">
          • <b>Preu total a terminis:</b> <span style="font-size:16px; font-weight:800; color:var(--warn);">1.266,64 €</span><br>
          • <b>TIN: 14,95 % · TAE: 19,80 %</b><br>
          • <b>Interessos i despeses regalades a la financera:</b> <span style="font-weight:800; color:var(--warn);">+ 517,64 €</span>
        </div>
      </div>

      <button class="btn" id="btn-step1-next" style="display:none; width:100%; margin-top:14px;">
        Pas 2: TIN vs TAE i la línia de devaluació del mòbil →
      </button>
    `;

    ChatEngine.embedCard(adCard);

    adCard.querySelector("#btn-reveal-fineprint").onclick = () => {
      adCard.querySelector("#btn-reveal-fineprint").remove();
      const fp = adCard.querySelector("#fineprint-content");
      fp.style.display = "block";
      fp.classList.add("revealed");
      adCard.querySelector("#btn-step1-next").style.display = "flex";
      ChatEngine.triggerHaptic();
      this.state.revealedFineprint = true;
    };

    adCard.querySelector("#btn-step1-next").onclick = async () => {
      adCard.querySelector("#btn-step1-next").remove();

      ChatEngine.notifyMoneyChange(-517.64, "Interessos i despeses regalades a la financera!");

      await ChatEngine.say("nil", "QUÈEE?? 517 EUROS D'INTERESSOS?? Per un telèfon que al comptat en val 749?? Estan bojos!");
      await ChatEngine.say("nil", "I ara que hi penso... el meu tiet que treballa venent electrodomèstics em va explicar que la botiga gairebé no guanya marge amb el telèfon: guanyen la comissió gran quan aconsegueixen que el client firmi el préstec amb la financera! Per això el dependent em deia «porta-te'l avui posat sense pensar»!");
      await ChatEngine.say("marc", "Doncs jo confesso que fa dos mesos em vaig comprar un monitor i com que em feia mandra pagar 180 € de cop, el vaig finançar a 10 mesos... I quan vaig mirar el compte m'estaven clavant 20 € de comissió d'obertura que se m'havia passat per alt!");
      await ChatEngine.say("pau", "Tots hem après a cops. I ara ve la segona part: en quin estat estarà aquest telèfon d'aquí a 3 anys?");

      ChatEngine.embedMaxim("Si has de pagar a terminis un telèfon o roba durant tres anys, és que en realitat no te'l pots permetre avui. La TAE t'ensenya el preu de la veritat.");

      await ChatEngine.wait(400);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: TIN VS TAE I LA LÍNIA TEMPORAL DE DEVALUACIÓ
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "TIN vs TAE i la devaluació del mòbil");

    await ChatEngine.say("aina", "Abans de continuar, heu d'aprendre dues sigles que veureu a tots els bancs i anuncis durant la vostra vida: **TIN** i **TAE**.");
    await ChatEngine.say("marc", "El **TIN** (Tipus d'Interès Nominal) és la xifra que et posen en gran a la publicitat: només compta l'interès pur, sense comissions.");
    await ChatEngine.say("aina", "La **TAE** (Taxa Anual Equivalent) és **la xifra de la veritat**: la llei obliga a posar-la perquè inclou els interessos, les comissions d'obertura i les assegurances. **Sempre heu de comparar la TAE**, mai el TIN.");

    // Widget interactiu: Comparativa del deute vs valor real del mòbil
    const timelineCard = document.createElement("div");
    timelineCard.className = "depreciation-box";
    timelineCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px;">
        📉 El parany del temps: El teu deute vs El valor del mòbil
      </div>
      <p class="note" style="margin-bottom:12px;">Mireu com cau el valor del telèfon mentre tu continues pagant la quota mes rere mes:</p>

      <div class="timeline-compare-row">
        <!-- Mes 1 -->
        <div class="timeline-col">
          <div style="font-weight:800; color:var(--teal); margin-bottom:4px;">MES 1 (Nou de trinca)</div>
          <div>📱 <b>Estat:</b> Impecable a la caixa.</div>
          <div>💰 <b>Valor al mercat:</b> 749 €</div>
          <div style="color:var(--warn); margin-top:4px;">💸 <b>Deute restant:</b> 1.236 €</div>
        </div>

        <!-- Mes 18 -->
        <div class="timeline-col">
          <div style="font-weight:800; color:var(--gold); margin-bottom:4px;">MES 18 (Any i mig)</div>
          <div>📱 <b>Estat:</b> Bateria al 80%, pantalla amb ratllades.</div>
          <div>💰 <b>Valor a Wallapop:</b> ~320 €</div>
          <div style="color:var(--warn); margin-top:4px;">💸 <b>Deute restant:</b> 650 €</div>
        </div>
      </div>

      <div style="background:#221518; border:1px solid var(--warn); border-radius:10px; padding:12px; margin-top:12px;">
        <div style="font-weight:800; color:var(--warn); font-size:13px; margin-bottom:4px;">
          💥 MES 36 (3 anys després):
        </div>
        <div style="font-size:12px; line-height:1.5; color:var(--ink);">
          El telèfon està pràcticament obsolet, han sortit 3 models nous, val menys de <b>120 €</b> si el vens... i aquest mes <b>encara et passen l'últim rebut de 29,99 € pel banc</b>!
        </div>
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;">
        Pas 3: Quan té sentit finançar i quan és un parany? →
      </button>
    `;

    ChatEngine.embedCard(timelineCard);

    timelineCard.querySelector("#btn-step2-next").onclick = async () => {
      timelineCard.querySelector("#btn-step2-next").remove();

      await ChatEngine.say("nil", "Uf, se m'han tret totes les ganes de comprar el mòbil així. Continuar pagant quotes d'un aparell vell i ratllat fa plorar.");
      await ChatEngine.say("marta", "Aquesta és la clau de la independència financera: **mai financis allò que es devalua més ràpid del que tardes a pagar-ho**.");

      ChatEngine.embedMaxim("No compris mai a terminis allò que es devalua més ràpid del que tardes a pagar-ho.");

      await ChatEngine.wait(400);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: EL SEMÀFOR DEL FINANÇAMENT: QUAN SÍ I QUAN NO
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "El semàfor: quan té sentit finançar?");

    await ChatEngine.say("pau", "Però atenció: això vol dir que MAI hem de demanar un pagament a terminis?");
    await ChatEngine.say("marc", "No! Hi ha excepcions molt clares on el finançament és útil i intel·ligent, i d'altres on és una trampa mortal.");
    await ChatEngine.say("aina", "Posem a prova el nostre criteri amb aquests 3 casos de la vida real:");

    const trafficCases = [
      {
        id: 1,
        title: "Cas A: Portàtil per estudiar el Cicle / Grau",
        desc: "Necessites un ordinador per al curs (val 600 €). La botiga t'ofereix pagar 60 € al mes durant 10 mesos amb 0% TIN i 0% TAE REAL (sense assegurances ni cap comissió).",
        isGood: true,
        type: "green",
        badge: "🟢 LLUÍS VERDA (Té sentit)",
        explain: "<b>CORRECTE:</b> És una eina de treball/estudi imprescindible que generarà valor, i la TAE és del 0% real (no regales ni un euro d'interessos)."
      },
      {
        id: 2,
        title: "Cas B: Telèfon Pro de 1.200 € per postureig",
        desc: "El teu telèfon actual funciona perfectament, però vols el model més car per lluir a Instagram. El finances a 36 mesos amb una TAE del 19,8%.",
        isGood: false,
        type: "red",
        badge: "🔴 LLUM VERMELLA (Parany absolut)",
        explain: "<b>TRAMPA TOTAL:</b> És un caprici consumista innecessari finançat a un interès abusiu que pagaràs durant 3 anys sencers."
      },
      {
        id: 3,
        title: "Cas C: Pagar una dessuadora de 60 € en 3 terminis amb Klarna/Scalapay",
        desc: "Vols comprar-te roba a una botiga online i tries el botó de «Paga en 3 terminis de 20 €» perquè ara mateix no tens prou saldo.",
        isGood: false,
        type: "red",
        badge: "🔴 LLUM VERMELLA (Hàbit tòxic)",
        explain: "<b>MOLT PERILLÓS:</b> Si necessites demanar un crèdit per comprar roba de 60 €, estàs gastant per sobre del teu nivell. És la drecera per acumular microdeutes."
      }
    ];

    const trafficCard = document.createElement("div");
    trafficCard.className = "chat-embed-card";
    trafficCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:8px;">
        🚦 Avalua aquests 3 casos: Té sentit finançar o és un parany?
      </div>
      <div id="traffic-cases-container"></div>
      <button class="btn gold" id="btn-traffic-next" style="display:none; width:100%; margin-top:14px;">
        Pas 4: Els 3 filtres d'or i el repte real →
      </button>
    `;

    ChatEngine.embedCard(trafficCard);

    const container = trafficCard.querySelector("#traffic-cases-container");
    let resolvedCount = 0;

    trafficCases.forEach(tc => {
      const caseEl = document.createElement("div");
      caseEl.className = "traffic-case-card";
      caseEl.innerHTML = `
        <div style="font-weight:700; font-size:13px; margin-bottom:4px;">${tc.title}</div>
        <div style="font-size:12px; color:var(--ink); margin-bottom:8px; line-height:1.45;">${tc.desc}</div>
        <div style="display:flex; gap:8px;" id="btns-row-${tc.id}">
          <button type="button" class="btn" style="flex:1; padding:8px; font-size:12px; background:var(--ok2); border:1.5px solid var(--ok); color:var(--ok);" data-choice="green">
            🟢 Té sentit (0% útil)
          </button>
          <button type="button" class="btn" style="flex:1; padding:8px; font-size:12px; background:var(--warn2); border:1.5px solid var(--warn); color:var(--warn);" data-choice="red">
            🔴 Parany de consum
          </button>
        </div>
        <div id="feedback-${tc.id}" style="display:none; font-size:12px; margin-top:8px; padding:8px; border-radius:8px;"></div>
      `;

      caseEl.querySelectorAll("button").forEach(b => {
        b.onclick = () => {
          caseEl.querySelectorAll("button").forEach(btn => btn.disabled = true);
          const chosen = b.dataset.choice;
          const isRight = (chosen === tc.type);
          const feedBox = caseEl.querySelector(`#feedback-${tc.id}`);

          if (isRight) {
            caseEl.className = `traffic-case-card ${tc.type}`;
            feedBox.style.display = "block";
            feedBox.style.background = tc.isGood ? "var(--ok2)" : "var(--warn2)";
            feedBox.style.color = tc.isGood ? "var(--ok)" : "var(--warn)";
            feedBox.innerHTML = `✓ ${tc.explain}`;
            this.state.trafficScore++;
            ChatEngine.triggerHaptic();
          } else {
            caseEl.className = "traffic-case-card red";
            feedBox.style.display = "block";
            feedBox.style.background = "var(--warn2)";
            feedBox.style.color = "var(--warn)";
            feedBox.innerHTML = `✗ Compte: ${tc.explain}`;
          }

          resolvedCount++;
          if (resolvedCount === trafficCases.length) {
            trafficCard.querySelector("#btn-traffic-next").style.display = "flex";
          }
        };
      });

      container.appendChild(caseEl);
    });

    trafficCard.querySelector("#btn-traffic-next").onclick = async () => {
      trafficCard.querySelector("#btn-traffic-next").remove();

      await ChatEngine.say("nil", "Queda claríssim: l'únic finançament acceptable és el que té **0% TAE real** i serveix per a una eina de treball o estudi que necessites.");
      await ChatEngine.say("marta", "I per a tota la resta (telèfons nous, roba, capricis): si no tens els diners al compte avui, no te'ls pots permetre.");

      await ChatEngine.wait(400);
      this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: ELS 3 FILTRES D'OR I EL TEU REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Com calcular la TAE i el teu repte real");

    await ChatEngine.say("marc", "I ara anem a la part més important: **com es calcula exactament el preu final segons la TAE?** Quan aneu a fer el repte a una botiga, necessiteu entendre d'on surten els números.");
    await ChatEngine.say("aina", "Hi ha dues maneres: el mètode ràpid a la botiga i la fórmula matemàtica que fa servir la financera. Us hem preparat aquesta eina perquè aprengueu a calcular-ho vosaltres mateixos:");

    // Widget interactiu: Explicació de la fórmula i calculadora TAE
    const taeCalcCard = document.createElement("div");
    taeCalcCard.className = "tae-calc-card";
    taeCalcCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:15px; color:var(--teal);">📐 Com es calcula el Preu Final segons la TAE (%)</span>
        <span class="contract-badge">Mètode Oficial</span>
      </div>

      <div class="tae-formula-box">
        <b style="color:var(--gold); display:block; margin-bottom:4px;">1. La fórmula matemàtica del sistema financer:</b>
        <div>Per calcular quant pagaràs cada mes segons la TAE, la financera fa:</div>
        <div style="font-family:monospace; background:#080d11; padding:8px 10px; border-radius:6px; margin:6px 0; color:var(--teal); font-size:12px;">
          Quota mensual = Preu × [ i / (1 − (1 + i)^−n) ]
        </div>
        <div style="font-size:11px; color:var(--mut);">
          on <b>i</b> és l'interès mensual (TAE / 12 / 100) i <b>n</b> és el nombre de mesos.
        </div>

        <div style="margin-top:10px; border-top:1px dashed var(--line); padding-top:8px;">
          <b style="color:var(--teal);">2. La fórmula ràpida amb la calculadora del mòbil a la botiga:</b>
          <div style="font-size:12px; margin-top:2px;">
            <b>Preu Final</b> = (Quota mensual × Nombre de mesos) + Despeses d'obertura<br>
            <b>Interessos extres</b> = Preu Final − Preu al comptat
          </div>
        </div>
      </div>

      <p class="note" style="margin:10px 0 6px;"><b>Posa-ho a prova:</b> Introdueix les dades d'un producte per veure el càlcul a temps real:</p>

      <div class="presets-row" id="tae-sample-presets" style="margin-bottom:10px;">
        <button class="chip on" data-price="800" data-months="24" data-tae="19.8" data-fee="0">Exemple: Mòbil 800 € (24m al 19,8% TAE)</button>
        <button class="chip" data-price="600" data-months="12" data-tae="0" data-fee="0">Exemple: Portàtil 600 € (0% TAE real)</button>
        <button class="chip" data-price="1200" data-months="36" data-tae="22" data-fee="30">Exemple: TV 1.200 € (36m al 22% TAE + comissió)</button>
      </div>

      <div class="tae-calc-inputs">
        <div class="tae-input-group">
          <label>Preu al comptat (€)</label>
          <input type="number" id="tae-in-price" value="800" min="50" max="5000" step="10">
        </div>
        <div class="tae-input-group">
          <label>Termini (Mesos)</label>
          <select id="tae-in-months">
            <option value="6">6 mesos</option>
            <option value="12">12 mesos (1 any)</option>
            <option value="24" selected>24 mesos (2 anys)</option>
            <option value="36">36 mesos (3 anys)</option>
            <option value="48">48 mesos (4 anys)</option>
          </select>
        </div>
        <div class="tae-input-group">
          <label>TAE anual (%)</label>
          <input type="number" id="tae-in-tae" value="19.8" min="0" max="50" step="0.1">
        </div>
        <div class="tae-input-group">
          <label>Comissió obertura (€)</label>
          <input type="number" id="tae-in-fee" value="0" min="0" max="200" step="5">
        </div>
      </div>

      <div class="tae-breakdown-steps" id="tae-live-result">
        <div class="tae-step-row">
          <span>Quota mensual calculada:</span>
          <b id="res-monthly" style="color:var(--gold);">0,00 €/mes</b>
        </div>
        <div class="tae-step-row">
          <span>Total pagat en quotes:</span>
          <span id="res-quotes-total">0,00 €</span>
        </div>
        <div class="tae-step-row">
          <span>Interessos regalats a la financera:</span>
          <b id="res-interests" style="color:var(--warn);">+ 0,00 €</b>
        </div>
        <div class="tae-step-row">
          <span>Sobrecost percentual sobre el preu:</span>
          <b id="res-pct" style="color:var(--warn);">+ 0,0 %</b>
        </div>
        <div class="tae-step-row" style="color:#fff;">
          <span>PREU FINAL TOTAL DEL PRODUCTE:</span>
          <span id="res-final-total" style="color:var(--warn); font-size:16px;">0,00 €</span>
        </div>
      </div>

      <button class="btn" id="btn-tae-to-recap" style="width:100%; margin-top:14px;">
        Continuar cap al resum i el repte de la setmana →
      </button>
    `;

    ChatEngine.embedCard(taeCalcCard);

    const calcLiveTAE = () => {
      const price = Math.max(Number(taeCalcCard.querySelector("#tae-in-price").value) || 0, 1);
      const months = Number(taeCalcCard.querySelector("#tae-in-months").value) || 12;
      const tae = Math.max(Number(taeCalcCard.querySelector("#tae-in-tae").value) || 0, 0);
      const fee = Math.max(Number(taeCalcCard.querySelector("#tae-in-fee").value) || 0, 0);

      let monthlyQuota = 0;
      if (tae === 0) {
        monthlyQuota = price / months;
      } else {
        const i = (tae / 100) / 12;
        monthlyQuota = price * (i / (1 - Math.pow(1 + i, -months)));
      }

      const totalPaidQuotes = monthlyQuota * months;
      const finalTotalPrice = totalPaidQuotes + fee;
      const totalInterest = finalTotalPrice - price;
      const overcostPct = ((totalInterest / price) * 100).toFixed(1);

      taeCalcCard.querySelector("#res-monthly").textContent = `${monthlyQuota.toFixed(2)} €/mes`;
      taeCalcCard.querySelector("#res-quotes-total").textContent = `${totalPaidQuotes.toFixed(2)} €`;
      taeCalcCard.querySelector("#res-interests").textContent = `+ ${totalInterest.toFixed(2)} €`;
      taeCalcCard.querySelector("#res-pct").textContent = `+ ${overcostPct} %`;
      taeCalcCard.querySelector("#res-final-total").textContent = `${finalTotalPrice.toFixed(2)} €`;
    };

    calcLiveTAE();

    ["#tae-in-price", "#tae-in-months", "#tae-in-tae", "#tae-in-fee"].forEach(sel => {
      taeCalcCard.querySelector(sel).addEventListener("input", calcLiveTAE);
    });

    taeCalcCard.querySelectorAll("#tae-sample-presets .chip").forEach(btn => {
      btn.onclick = () => {
        taeCalcCard.querySelectorAll("#tae-sample-presets .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        taeCalcCard.querySelector("#tae-in-price").value = btn.dataset.price;
        taeCalcCard.querySelector("#tae-in-months").value = btn.dataset.months;
        taeCalcCard.querySelector("#tae-in-tae").value = btn.dataset.tae;
        taeCalcCard.querySelector("#tae-in-fee").value = btn.dataset.fee;
        calcLiveTAE();
        ChatEngine.triggerHaptic();
      };
    });

    taeCalcCard.querySelector("#btn-tae-to-recap").onclick = async () => {
      taeCalcCard.querySelector("#btn-tae-to-recap").remove();

      await ChatEngine.say("pau", "Amb aquesta calculadora podeu comprovar qualsevol oferta de MediaMarkt, Amazon, Apple o qualsevol botiga. Ja no us podran enganyar mai més amb el truc de la quota petita!");
      await ChatEngine.say("marta", "I ara sí: anem a repassar els 3 filtres clau i a fer el repte real d'aquest capítol.");

      await ChatEngine.wait(400);

      const recapCard = document.createElement("div");
      recapCard.className = "chat-embed-card";
      recapCard.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span style="font-size:24px;">🏆</span>
          <h3 style="margin:0; font-size:16px;">Els 3 filtres abans d'acceptar cap pagament a terminis</h3>
        </div>

        <div style="font-size:13px; line-height:1.6; margin:10px 0;">
          <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">1. Exigeix sempre la TAE real:</b><br>
            <span style="color:var(--ink);">El TIN és màrqueting; la TAE és la veritat. Comprova que no hi hagi comissions d'obertura ni assegurances associades obligatòries que inflin la factura.</span>
          </div>

          <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">2. La durada del deute mai pot superar la vida útil:</b><br>
            <span style="color:var(--ink);">Si tardes 3 anys a pagar un telèfon que al cap de 2 anys ja estarà devaluat i amb la bateria morta, estàs tirant els teus diners futurs.</span>
          </div>

          <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">3. Només eines imprescindibles, mai capricis:</b><br>
            <span style="color:var(--ink);">Si és un caprici (roba, consoles, postureig), estalvia abans i paga al comptat. Mai entris en la roda dels microdeutes.</span>
          </div>
        </div>

        <div class="maxim" style="margin-left:0; margin-top:14px;">
          <span>Frase per recordar</span>
          Si només pots comprar un caprici pagant la quota mensual, no te'l pots permetre. La TAE t'ensenya el preu de la veritat.
        </div>

        <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
          <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
          <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Obre el navegador i entra a la web d'una gran botiga de tecnologia o telefonia (MediaMarkt, Apple, Amazon, operadora):</p>
          <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
            <li>Cerca un telèfon o portàtil que tingui l'opció «Finança'l per X €/mes».</li>
            <li>Fes scroll fins a la lletra petita del peu de pàgina i localitza la <b>TAE (%)</b>, el nombre de mesos i l'<b>«Import Total Degut»</b>.</li>
            <li><b>Aplica la fórmula que acabes d'aprendre:</b> multiplica la quota mensual pels mesos i resta el preu al comptat. Quants diners estaries regalant a la financera?</li>
          </ul>
        </div>

        <button class="btn gold" id="btn-finish-cap6" style="width:100%; margin-top:16px;">
          Completar Capítol 6 i tancar el BLOC 2 🏆
        </button>
      `;

      ChatEngine.embedCard(recapCard);

      recapCard.querySelector("#btn-finish-cap6").onclick = () => {
        recapCard.querySelector("#btn-finish-cap6").disabled = true;

        // Desem dades del capítol
        AppState.saveChapterData(6, "trafficScore", this.state.trafficScore);

        // Completar capítol 6
        AppState.completeChapter(6, 0, null);

        ChatEngine.celebrate(
          "Capítol 6 completat i BLOC 2 assolit!",
          "Has après a desxifrar la trampa del finançament al consum, com es calcula el preu final segons la TAE i quan té sentit ajornar un pagament.",
          0,
          7,
          () => {
            alert("Enhorabona! Has completat tot el BLOC 2 («Gestionar el dia a dia i la pressió social»). El Bloc 3 (Estalvi i futur) començarà amb el Capítol 7!");
            window.location.hash = "#dashboard";
          }
        );
      };
    };
  }
};
