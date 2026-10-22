/**
 * CAPITOL2.JS - Guió i lògica interactiva del Capítol 2: "Bancs, comptes i targetes"
 */

const Capitol2 = {
  id: 2,
  title: "Capítol 2 · Bancs, comptes i targetes",
  totalSteps: 4,

  // Estat intern d'aquest capítol
  state: {
    giftDecision: null,
    revealedClauses: 0,
    quizScore: 0,
    selectedAccountType: "online_bank",
    revolvingAmount: 400,
    revolvingMonthly: 20
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'OFERTA DEL BANC I EL GANXO DEL REGAL
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'oferta del banc: el ganxo del regal");

    await ChatEngine.say("nil", "Nois, vinc d'obrir-me el compte per cobrar el sou d'estiu i he sortit triomfant!");
    await ChatEngine.say("aina", "Massa feliç et veig sortint d'una sucursal bancària, Nil... Què ha passat?");
    await ChatEngine.say("nil", "Si signo el compte amb ells i demano la targeta or, em regalen uns <b>auriculars sense fil d'última generació</b> de 60 € només per signar! Gratuïts!");
    await ChatEngine.say("marc", "Nil... para un segon. Un banc és una empresa que ven diners, no el Pare Noel. Què posa a la lletra petita?");
    await ChatEngine.say("nil", "Buf, qui es llegeix 15 pàgines de contracte ple de termes legals? Si a la pancarta posava en gegant: <i>«Regal gratuït per a joves»</i>!");
    await ChatEngine.say("pau", "Alerta màxima. El meu cosí gran va picar amb un altaveu bluetooth de regal i va estar pagant comissions i quotes un any sencer.");

    // Targeta interactiva amb la primera decisió
    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Què hauria de fer el Nil abans de signar el contracte dels auriculars?</p>
      <button class="opt" data-opt="1">Signar ràpid abans que s'acabi l'oferta d'auriculars gratuïts</button>
      <button class="opt" data-opt="2">Exigir el contracte i revisar les comissions als 18 anys i la permanència</button>
      <button class="opt" data-opt="3">Agafar els auriculars, marxar corrents i canviar de número</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;
        this.state.giftDecision = opt;

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
      await ChatEngine.say("me", "Nil, ni se t'acudi signar a cegues. Cap banc regala res: mira què et cobraran quan facis els 18 anys i si t'obliguen a una permanència.");
      await ChatEngine.say("aina", "Molt ben vist! Anem a desxifrar què amaguen exactament aquests auriculars «de franc».");
    } else {
      ChatEngine.notifyMoneyChange(-36, "Comissió semestral de manteniment cobrada per sorpresa!");
      await ChatEngine.say("nil", "NOOOOO!! M'acaba d'arribar una notificació al mòbil: «Càrrec comissió de targeta: −36,00 €»! Els auriculars no eren de franc, me'ls he pagat de la meva pròpia butxaca!");
      await ChatEngine.say("me", "Ui Nil... t'han clavat la clatellada del segle per signar sense mirar.");
      await ChatEngine.say("marc", "Totalment. Anem a obrir el contracte real que et fan signar i veuràs com cau el mite del regal:");
    }

    // Widget interactiu: El Desxifrador de la Lletra Petita
    const inspectorCard = document.createElement("div");
    inspectorCard.className = "fineprint-card";
    inspectorCard.innerHTML = `
      <div class="contract-header">
        <div class="contract-title">
          <span>🔍</span> Contracte Compte Jove «Promoció Auriculars»
        </div>
        <span class="contract-badge">3 clàusules ocultes</span>
      </div>
      <p class="note" style="margin-bottom:12px;">Prem sobre cadascuna de les 3 clàusules per revelar el que diu la lletra petita:</p>

      <div class="clause-item" id="clause-1">
        <div class="clause-header-row">
          <span>Clàusula 4.1: Compromís de permanència</span>
          <span class="clause-tag-cost">🔒 Revelar</span>
        </div>
        <div class="clause-hidden">
          <b>Permanència obligatòria de 24 mesos (2 anys):</b> Si tanques el compte o t'emportes els diners abans de 2 anys, penalització de <b>120 €</b>.
        </div>
      </div>

      <div class="clause-item" id="clause-2">
        <div class="clause-header-row">
          <span>Clàusula 7.3: Manteniment als 18 anys</span>
          <span class="clause-tag-cost">🔒 Revelar</span>
        </div>
        <div class="clause-hidden">
          <b>Comissió de manteniment en fer la majoria d'edat:</b> 12 € al mes (<b>144 € l'any</b>) tret que domiciliïs una nòmina recurrent superior a 800 € cada mes. Com a estudiant, la pagaràs íntegra.
        </div>
      </div>

      <div class="clause-item" id="clause-3">
        <div class="clause-header-row">
          <span>Clàusula 9.2: Targeta de Crèdit associada</span>
          <span class="clause-tag-cost">🔒 Revelar</span>
        </div>
        <div class="clause-hidden">
          <b>Quota de targeta de crèdit «Or»:</b> 36 € a l'any de manteniment de targeta, amb pagament ajornat per defecte (interessos del 22 % TAE).
        </div>
      </div>

      <div class="contract-total-calc" id="contract-calc" style="display:none;">
        <span style="font-size:12px; color:var(--mut); text-transform:uppercase; letter-spacing:0.05em;">Cost real dels auriculars en 2 anys</span>
        <div class="calc-price-big" style="color:var(--warn);" id="calc-final-price">0,00 €</div>
        <p style="font-size:13px; margin:4px 0 0; color:var(--ink);" id="calc-summary-text"></p>
      </div>

      <button class="btn" id="btn-done-step1" style="display:none; width:100%; margin-top:14px;">
        Pas 2: Dèbit o Crèdit? La gran diferència →
      </button>
    `;

    ChatEngine.embedCard(inspectorCard);

    let revealed = 0;
    const updateCalculator = () => {
      if (revealed === 3) {
        const calcEl = inspectorCard.querySelector("#contract-calc");
        const priceEl = inspectorCard.querySelector("#calc-final-price");
        const sumEl = inspectorCard.querySelector("#calc-summary-text");
        const nextBtn = inspectorCard.querySelector("#btn-done-step1");

        // 144 € * 2 anys + 36 € * 2 anys = 360 €
        calcEl.style.display = "block";
        priceEl.textContent = "360,00 €";
        sumEl.innerHTML = `Els auriculars valen 50 € a la botiga, però el Nil acabarà pagant <b>360 € en comissions</b> en 2 anys!`;
        nextBtn.style.display = "flex";
        ChatEngine.triggerHaptic();
      }
    };

    [1, 2, 3].forEach(num => {
      const el = inspectorCard.querySelector(`#clause-${num}`);
      el.onclick = () => {
        if (!el.classList.contains("revealed")) {
          el.classList.add("revealed");
          el.querySelector(".clause-tag-cost").textContent = "✓ Revelat";
          revealed++;
          this.state.revealedClauses = revealed;
          updateCalculator();
        }
      };
    });

    inspectorCard.querySelector("#btn-done-step1").onclick = async () => {
      inspectorCard.querySelector("#btn-done-step1").remove();
      await ChatEngine.say("nil", "QUÈEE?? 360 EUROS per uns auriculars que a una botiga de tecnologia en valen 40?? Estan sonats!");
      await ChatEngine.say("marc", "Ara ho entens: un banc no és una botiga de regals. Si et donen un aparell electrònic és perquè saben que recuperaran cinc vegades el seu valor en comissions.");
      await ChatEngine.say("marta", "La norma d'or: obre el compte on no et cobrin res i, si vols auriculars, te'ls compres tu amb el teu estalvi.");

      ChatEngine.embedMaxim("Si un banc et regala alguna cosa per obrir un compte, atura't: el regal mai és gratis; te'l cobraran amb comissions o permanència.");

      await ChatEngine.wait(400);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: DÈBIT VS CRÈDIT I EL PERILL DE LES REVOLVING
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Dèbit vs Crèdit: no et confonguis");

    await ChatEngine.say("pau", "Aquest és el segon gran perill quan obres el teu primer compte: la gent jove es pensa que totes les targetes de plàstic o de mòbil són iguals. I són el dia i la nit.");
    await ChatEngine.say("aina", "Exacte. Hi ha dues categories completament diferents: <b>Dèbit</b> i <b>Crèdit (sobretot les revolving)</b>.");

    // Maqueta interactiva visual de targetes
    const cardsDisplay = document.createElement("div");
    cardsDisplay.className = "chat-embed-card";
    cardsDisplay.innerHTML = `
      <div class="cards-comparison-display">
        <!-- Targeta Dèbit -->
        <div class="bank-card-mockup debit">
          <div class="card-top-row">
            <span class="card-bank-name">Compte Jove</span>
            <span class="card-type-badge">DEBIT</span>
          </div>
          <div class="card-chip-row">
            <div class="card-chip"></div>
            <span class="card-contactless">))))</span>
          </div>
          <div class="card-number-row">•••• •••• •••• 4291</div>
          <div class="card-bottom-row">
            <div>
              <div style="font-size:9px; opacity:.7;">TITULAR</div>
              <div class="card-holder">TEU NOM</div>
            </div>
            <div>
              <div style="font-size:9px; opacity:.7;">CADUCA</div>
              <div style="font-weight:700;">10/30</div>
            </div>
          </div>
        </div>

        <!-- Targeta Crèdit / Revolving -->
        <div class="bank-card-mockup credit">
          <div class="card-top-row">
            <span class="card-bank-name">Crèdit Or</span>
            <span class="card-type-badge">CREDIT</span>
          </div>
          <div class="card-chip-row">
            <div class="card-chip"></div>
            <span class="card-contactless">))))</span>
          </div>
          <div class="card-number-row">•••• •••• •••• 8820</div>
          <div class="card-bottom-row">
            <div>
              <div style="font-size:9px; opacity:.7;">TITULAR</div>
              <div class="card-holder">TEU NOM</div>
            </div>
            <div>
              <div style="font-size:9px; opacity:.7;">INTERÈS</div>
              <div style="font-weight:700; color:#ff9d92;">22% TAE</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-summary-note">
        <div>🟢 <b>DÈBIT:</b> Pagues amb els diners que <b>ja tens</b> al compte. Si tens 15 € i intentes comprar per 20 €, l'operació es rebutja. Mai t'endeutes.</div>
        <div style="margin-top:6px;">🔴 <b>CRÈDIT / REVOLVING:</b> El banc et fa un préstec i et diu: <i>«Ja m'ho pagaràs més endavant»</i>. Si ajornes el pagament, et claven un <b>20 % o 25 % d'interès</b> acumulat.</div>
      </div>
    `;
    ChatEngine.embedCard(cardsDisplay);

    await ChatEngine.say("marc", "Fem una prova pràctica de 3 situacions per veure si ho hem entès:");

    // Mini-quiz interactiu amb 3 situacions quotidianes
    const quizCases = [
      {
        q: "1. Sortida de dissabte: sopar de pizza i cine (25 €). Què fas servir?",
        opts: [
          { t: "Targeta de Dèbit: diners meus immediats", correct: true, explain: "Perfecte! Les despeses del dia a dia sempre amb diners teus." },
          { t: "Targeta de Crèdit ajornada a quotes", correct: false, explain: "Molt malament: mai paguis a terminis una pizza que et menges en 10 minuts!" }
        ]
      },
      {
        q: "2. Una dessuadora de 70 € que t'agrada molt però només tens 30 € al compte.",
        opts: [
          { t: "Demano crèdit amb la revolving per no esperar", correct: false, explain: "Trampa clàssica! Si no tens els diners, no la compris fins que estalviïs." },
          { t: "M'espero a tenir els diners estalviats al compte i pagaré amb dèbit", correct: true, explain: "Molt ben jugat! L'autocontrol és el millor escut financer." }
        ]
      },
      {
        q: "3. La regla d'or als 18 anys pel que fa a targetes és...",
        opts: [
          { t: "Tenir sempre targeta de dèbit i rebutjar targetes de crèdit / revolving", correct: true, explain: "Exacte! Zero deute al consum a la teva edat." },
          { t: "Tenir tantes targetes de crèdit com et donin per semblar ric", correct: false, explain: "La drecera directa a entrar en una espiral de deute que et costarà anys netejar." }
        ]
      }
    ];

    let currentCaseIdx = 0;
    const quizCard = document.createElement("div");
    quizCard.className = "chat-embed-card";

    const renderQuizCase = (idx) => {
      const c = quizCases[idx];
      quizCard.innerHTML = `
        <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--teal); font-weight:700;">Cas ${idx + 1} de 3</span>
        <p class="q" style="margin-top:4px;">${c.q}</p>
        <div id="quiz-options-box">
          ${c.opts.map((o, i) => `<button class="opt" data-idx="${i}"><b>${o.t}</b></button>`).join("")}
        </div>
        <div id="quiz-feedback-box" style="display:none; font-size:13px; margin-top:10px; padding:10px; border-radius:10px;"></div>
        <button class="btn" id="btn-quiz-next" style="display:none; width:100%; margin-top:10px;">Següent cas →</button>
      `;

      quizCard.querySelectorAll(".opt").forEach(btn => {
        btn.onclick = () => {
          quizCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
          const optIdx = Number(btn.dataset.idx);
          const choice = c.opts[optIdx];
          const feedBox = quizCard.querySelector("#quiz-feedback-box");
          const nextBtn = quizCard.querySelector("#btn-quiz-next");

          if (choice.correct) {
            btn.classList.add("right");
            feedBox.style.display = "block";
            feedBox.style.background = "var(--ok2)";
            feedBox.style.color = "var(--ok)";
            feedBox.innerHTML = `✓ <b>Correcte!</b> ${choice.explain}`;
            this.state.quizScore++;
            ChatEngine.triggerHaptic();
          } else {
            btn.classList.add("wrong");
            feedBox.style.display = "block";
            feedBox.style.background = "var(--warn2)";
            feedBox.style.color = "var(--warn)";
            feedBox.innerHTML = `✗ <b>Compte!</b> ${choice.explain}`;
            if (idx === 1) {
              ChatEngine.notifyMoneyChange(-25, "Interessos abusius cobrats per crèdit revolving!");
            }
          }

          nextBtn.style.display = "flex";
          nextBtn.onclick = () => {
            currentCaseIdx++;
            if (currentCaseIdx < quizCases.length) {
              renderQuizCase(currentCaseIdx);
            } else {
              quizCard.remove();
              this.showRevolvingSimulator();
            }
          };
        };
      });
    };

    ChatEngine.embedCard(quizCard);
    renderQuizCase(0);
  },

  // Simulador interactiu del parany Revolving
  async showRevolvingSimulator() {
    await ChatEngine.say("marta", "Sabeu què? Jo tenia tant de pànic que el banc m'enganyés amb les targetes que portava 120 € en bitllets a la cartera... i a les festes del barri me la van robar. 120 € suats que mai més tornaré a veure!");
    await ChatEngine.say("nil", "Ho veus, Marta? La targeta de dèbit és la teva amiga: si te la roben, entres a l'app des del mòbil d'un amic, prems «Apagar targeta» en 3 segons i no et toquen ni un sol euro!");
    await ChatEngine.say("marc", "I jo, de tan llest que em crec amb els números, gairebé pico amb la targeta d'una botiga de tecnologia perquè em donaven un 5% de descompte... I l'Aina em va haver d'aturar perquè era una revolving del 22% TAE!");
    await ChatEngine.say("nil", "Però escolteu, per què és tan perillosa una revolving si et deixen pagar només 15 o 20 euros al mes?");
    await ChatEngine.say("marc", "Perquè és una teranyina matemàtica. Mira com funciona si compres un mòbil o consola de 400 € amb quota mínima:");

    const simCard = document.createElement("div");
    simCard.className = "revolving-sim-box";
    simCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:14px;">Simulador de la trampa Revolving (22% TAE)</span>
        <span class="contract-badge">Exemple real</span>
      </div>
      <p class="note">Tria quant costa la compra i quant pagues de quota mensual:</p>

      <div style="margin:10px 0;">
        <label style="font-size:12px; font-weight:700; color:var(--mut);">1. Import de la compra:</label>
        <div class="presets-row" id="debt-amount-presets" style="margin-top:4px;">
          <button class="chip" data-amt="250">250 € (Roba/escapada)</button>
          <button class="chip on" data-amt="400">400 € (Consola/Mòbil)</button>
          <button class="chip" data-amt="800">800 € (Portàtil)</button>
        </div>
      </div>

      <div style="margin:10px 0;">
        <label style="font-size:12px; font-weight:700; color:var(--mut);">2. Quota mensual que tries pagar:</label>
        <div class="presets-row" id="debt-monthly-presets" style="margin-top:4px;">
          <button class="chip on" data-pay="20">20 € al mes</button>
          <button class="chip" data-pay="35">35 € al mes</button>
          <button class="chip" data-pay="60">60 € al mes</button>
        </div>
      </div>

      <div class="revolving-stat-grid">
        <div class="revolving-stat-item">
          <div class="revolving-stat-label">Temps per pagar</div>
          <div class="revolving-stat-val" id="rev-months">26 mesos</div>
        </div>
        <div class="revolving-stat-item">
          <div class="revolving-stat-label">Interessos de més</div>
          <div class="revolving-stat-val" style="color:var(--warn);" id="rev-interest">+118 €</div>
        </div>
        <div class="revolving-stat-item">
          <div class="revolving-stat-label">Preu total final</div>
          <div class="revolving-stat-val" id="rev-total">518 €</div>
        </div>
      </div>

      <div style="font-size:12px; line-height:1.5; color:var(--ink); background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
        💡 <b>Què està passant?</b> Com que pagues una quota petita, gairebé tot el que pagues cada mes se'n va en interessos al banc i gairebé no amortitzes el deute principal.
      </div>

      <button class="btn" id="btn-next-step3" style="width:100%; margin-top:14px;">
        Pas 3: Què canvia als 18 anys? El comparador de comptes →
      </button>
    `;

    ChatEngine.embedCard(simCard);

    let currentDebt = 400;
    let currentMonthly = 20;

    const calculateRevolving = (debt, monthly) => {
      const monthlyRate = 0.22 / 12; // 22% TAE
      let balance = debt;
      let totalPaid = 0;
      let months = 0;

      // Si la quota ni tan sols cobreix els interessos inicials
      if (monthly <= balance * monthlyRate) {
        return { months: 999, interest: 9999, total: 9999, infinite: true };
      }

      while (balance > 0.01 && months < 300) {
        months++;
        const interest = balance * monthlyRate;
        const principal = monthly - interest;
        if (balance + interest <= monthly) {
          totalPaid += (balance + interest);
          balance = 0;
        } else {
          balance -= principal;
          totalPaid += monthly;
        }
      }

      const totalInterest = Math.round(totalPaid - debt);
      return {
        months,
        interest: totalInterest,
        total: Math.round(totalPaid)
      };
    };

    const updateSimUI = () => {
      const res = calculateRevolving(currentDebt, currentMonthly);
      const monthsEl = simCard.querySelector("#rev-months");
      const interestEl = simCard.querySelector("#rev-interest");
      const totalEl = simCard.querySelector("#rev-total");

      if (res.infinite) {
        monthsEl.textContent = "Infinit!";
        interestEl.textContent = "Inassumible";
        totalEl.textContent = "Espiral";
      } else {
        const years = Math.floor(res.months / 12);
        const remMonths = res.months % 12;
        const timeStr = years > 0 ? `${years}a ${remMonths}m (${res.months}m)` : `${res.months} mesos`;
        monthsEl.textContent = timeStr;
        interestEl.textContent = `+${res.interest} €`;
        totalEl.textContent = `${res.total} €`;
      }
      ChatEngine.triggerHaptic();
    };

    simCard.querySelectorAll("#debt-amount-presets .chip").forEach(btn => {
      btn.onclick = () => {
        simCard.querySelectorAll("#debt-amount-presets .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        currentDebt = Number(btn.dataset.amt);
        this.state.revolvingAmount = currentDebt;
        updateSimUI();
      };
    });

    simCard.querySelectorAll("#debt-monthly-presets .chip").forEach(btn => {
      btn.onclick = () => {
        simCard.querySelectorAll("#debt-monthly-presets .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        currentMonthly = Number(btn.dataset.pay);
        this.state.revolvingMonthly = currentMonthly;
        updateSimUI();
      };
    });

    simCard.querySelector("#btn-next-step3").onclick = async () => {
      simCard.querySelector("#btn-next-step3").remove();
      await ChatEngine.say("pau", "Veieu per què les agències de consum han portat les revolving als jutjats? Són una màquina de generar deute perpetu.");
      await ChatEngine.say("marta", "Per això la colla té una norma indiscutible: <b>a la nostra edat, només targeta de DÈBIT</b>.");

      ChatEngine.embedMaxim("A la teva edat, només targeta de DÈBIT. Mai demanis un crèdit per a despeses del dia a dia ni caiguis en el parany de les revolving.");

      await ChatEngine.wait(400);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: QUÈ CANVIA ALS 18 ANYS I EL COMPARADOR DE COMPTES JOVES
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "La majoria d'edat i el compte ideal");

    await ChatEngine.say("aina", "Ara anem a la pregunta que tothom es fa quan comença a treballar o fa els 18 anys: <b>Quin compte m'obro?</b>");
    await ChatEngine.say("nil", "Quan ets menor és fàcil: els teus pares signen i el compte infantil no té comissions.");
    await ChatEngine.say("aina", "Exacte, però el dia que bufes les 18 espelmes passes a ser adult per al banc. Si no tens cura, molts bancs tradicionals et passen a la tarifa d'adults i et claven <b>60 € o 120 € l'any de manteniment</b> tret que tinguis nòmina fixa.");
    await ChatEngine.say("marc", "Hem seleccionat els 3 tipus de comptes que trobareu al carrer perquè compareu abans de triar:");

    // Widget Comparador de 3 comptes
    const compareCard = document.createElement("div");
    compareCard.className = "chat-embed-card";
    compareCard.innerHTML = `
      <div style="font-size:14px; font-weight:800; margin-bottom:10px;">
        📊 Comparador de Comptes per a Joves (Tria el que t'obriries tu):
      </div>

      <div class="compare-grid">
        <!-- Opció A -->
        <button type="button" class="account-card danger" data-acc="traditional">
          <div class="account-top">
            <span class="account-name">A) Banc Tradicional d'Oficina (amb regal)</span>
            <span class="account-tag warn">⚠️ Trampa als 18</span>
          </div>
          <ul class="account-features">
            <li>🎁 <b>Regal d'auriculars</b> o 50 € al signar.</li>
            <li>💸 <b>0 € fins als 18 anys</b>; després <b>120 €/any</b> si no portes nòmina fixa > 800 €.</li>
            <li>💳 Targeta de crèdit recomanada amb quota anual de 36 €.</li>
            <li>🏧 Caixers d'altres entitats: fins a <b>2,50 € de comissió</b> per retirada.</li>
          </ul>
          <div class="account-verdict">
            <b>Veredicte de la colla:</b> Evita'l tret que treballis tot l'any amb nòmina estable.
          </div>
        </button>

        <!-- Opció B -->
        <button type="button" class="account-card selected" data-acc="online_bank">
          <div class="account-top">
            <span class="account-name">B) Compte Jove Online de Gran Entitat</span>
            <span class="account-tag ok">⭐️ Molt Recomanat</span>
          </div>
          <ul class="account-features">
            <li>🛡️ <b>0 € de manteniment</b> fins als 30 anys (sense cap requisit de nòmina).</li>
            <li>💳 <b>Targeta de DÈBIT 100% gratuïta</b> (sense comissió d'emissió ni renovació).</li>
            <li>📱 Bizum i transferències online gratuïtes integrades a l'app.</li>
            <li>🏧 Àmplia xarxa de milers de caixers gratuïts a tota Catalunya i Espanya.</li>
          </ul>
          <div class="account-verdict">
            <b>Veredicte de la colla:</b> L'opció més segura i còmoda per a estudiants i primers sous.
          </div>
        </button>

        <!-- Opció C -->
        <button type="button" class="account-card" data-acc="neobank">
          <div class="account-top">
            <span class="account-name">C) Neobanc Digital 100% App (ex: Revolut / N26)</span>
            <span class="account-tag ok">✈️ Excel·lent per viatjar</span>
          </div>
          <ul class="account-features">
            <li>🌍 <b>0 € de manteniment per sempre</b> (sense edat límit ni requisits).</li>
            <li>💳 Targeta de dèbit al mòbil (Apple Pay / Google Pay) a l'instant.</li>
            <li>💱 Canvi de moneda internacional al millor tipus (ideal per a viatges o Erasmus).</li>
            <li>🏧 3-5 retirades gratis al mes a qualsevol caixer del món.</li>
          </ul>
          <div class="account-verdict">
            <b>Veredicte de la colla:</b> Ideal com a segon compte per a viatges, o principal si no necessites oficines físiques.
          </div>
        </button>
      </div>

      <div class="atm-box" style="margin-top:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:13px;">🏧 La trampa dels caixers de festa a les 2 AM:</span>
          <span class="badge" style="background:var(--warn2); color:var(--warn); font-size:11px; padding:2px 6px; border-radius:6px; font-weight:700;">Alerta comissió</span>
        </div>
        <p class="note" style="margin:6px 0 10px;">Vols treure efectiu per pagar un taxi o entrepà en un caixer que no és de la teva entitat:</p>
        <div class="atm-amount-btn-group">
          <button class="chip on" data-atm="20">Treure 20 €</button>
          <button class="chip" data-atm="50">Treure 50 €</button>
          <button class="chip" data-atm="100">Treure 100 €</button>
        </div>
        <div id="atm-calc-display" style="font-size:13px; padding:8px 10px; background:var(--bub); border-radius:8px; border:1px solid var(--line);">
          Comissió del caixer extern: <b>2,50 €</b>. Representa un <b>12,5 %</b> del que estàs traient! 💸
        </div>
      </div>

      <button class="btn gold" id="btn-done-step3" style="width:100%; margin-top:14px;">
        Confirmar elecció i anar al resum del capítol →
      </button>
    `;

    ChatEngine.embedCard(compareCard);

    // Gestió selecció de compte
    compareCard.querySelectorAll(".account-card").forEach(cardBtn => {
      cardBtn.onclick = () => {
        compareCard.querySelectorAll(".account-card").forEach(b => b.classList.remove("selected"));
        cardBtn.classList.add("selected");
        const type = cardBtn.dataset.acc;
        this.state.selectedAccountType = type;
        AppState.saveChapterData(2, "selectedAccount", type);
        ChatEngine.triggerHaptic();
      };
    });

    // Simulador ràpid de caixer
    compareCard.querySelectorAll(".atm-amount-btn-group .chip").forEach(btn => {
      btn.onclick = () => {
        compareCard.querySelectorAll(".atm-amount-btn-group .chip").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        const amt = Number(btn.dataset.atm);
        const fee = 2.50;
        const pct = ((fee / amt) * 100).toFixed(1);
        const display = compareCard.querySelector("#atm-calc-display");
        display.innerHTML = `Comissió del caixer extern: <b>2,50 €</b>. Representa un <b>${pct} %</b> del que estàs traient! 💸 ${amt <= 20 ? "(Una autèntica barbaritat)" : ""}`;
        ChatEngine.triggerHaptic();
      };
    });

    compareCard.querySelector("#btn-done-step3").onclick = async () => {
      compareCard.querySelector("#btn-done-step3").remove();

      if (this.state.selectedAccountType === "traditional") {
        await ChatEngine.say("me", "He mirat l'opció tradicional, però l'Aina té tota la raó: és perillós pagar 120 € de manteniment si estudio.");
        await ChatEngine.say("aina", "Exacte. Si no tens ingressos de més de 800 € fixos cada mes de la teva vida, fuig dels bancs que cobren manteniment.");
      } else if (this.state.selectedAccountType === "online_bank") {
        await ChatEngine.say("me", "Trio el compte jove online sense comissions ni condicions. És el més pràctic i segur.");
        await ChatEngine.say("marc", "Sens dubte. Tens xarxa de caixers a prop, targeta de dèbit de franc i 0 € fins als 30 anys.");
      } else {
        await ChatEngine.say("me", "M'atrau molt el neobanc per la facilitat al mòbil i per viatjar a l'estranger.");
        await ChatEngine.say("pau", "Molt bona tria per a pagaments digitals i viatges! Recorda només comprovar quants caixers gratuïts tens per retirar efectiu.");
      }

      await ChatEngine.say("nil", "I amb el tema dels caixers: a partir d'ara pago sempre amb el mòbil o trec diners al meu banc abans de sortir de festa. No penso regalar 2,50 € mai més!");

      await ChatEngine.wait(400);
      this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: DECÀLEG, EL TEU REPTE REAL I FINALITZACIÓ
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Decàleg clau i el teu repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
        <span style="font-size:24px;">🏆</span>
        <h3 style="margin:0; font-size:16px;">Els 4 manaments del teu primer compte</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:8px;">
          <b>1. Només targeta de DÈBIT:</b><br>
          <span style="color:var(--mut);">Gasta només el saldo que tens al compte. Mai demanis un crèdit per a capricis ni caiguis en targetes revolving al 22% d'interès.</span>
        </div>
        <div style="margin-bottom:8px;">
          <b>2. El regal del banc es paga car:</b><br>
          <span style="color:var(--mut);">Si et regalen uns auriculars o diners en efectiu, revisa la permanència i les comissions als 18 anys. El regal mai és gratis.</span>
        </div>
        <div style="margin-bottom:8px;">
          <b>3. 0 € de comissions sense nòmina:</b><br>
          <span style="color:var(--mut);">Exigeix un compte jove que mantingui el manteniment i les transferències a 0 € com a mínim fins als 25 o 30 anys sense obligació de domiciliació.</span>
        </div>
        <div>
          <b>4. Ull viu als caixers d'altres entitats:</b><br>
          <span style="color:var(--mut);">Treure 20 € en un caixer de la competència et pot costar fins a 2,50 € (un 12,5% de comissió). Treu abans o paga amb targeta.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        A la teva edat, només targeta de dèbit. Si un banc et regala alguna cosa per obrir un compte, llegeix la lletra petita: el regal mai és de franc.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--bub); border:1px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--teal);">🎯 El teu repte real d'aquesta setmana:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Agafa la teva targeta (o demana a algú de casa que te n'ensenyi una) i completa aquestes dues comprovacions:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li>Comprova si a la cantonada frontal o posterior hi posa la paraula <b>DEBIT</b> o <b>CREDIT</b>.</li>
          <li>Obre l'app del banc al mòbil i busca l'opció «Caixers propers» per saber a quin caixer pots anar sense pagar cap comissió.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap2" style="width:100%; margin-top:16px;">
        Completar Capítol 2 i desar aprenentatges 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap2").onclick = () => {
      recapCard.querySelector("#btn-finish-cap2").disabled = true;

      // Desem l'estat i completem el capítol 2
      AppState.completeChapter(2, 0, null);

      ChatEngine.celebrate(
        "Capítol 2 completat amb èxit!",
        "Ja saps detectar els paranys bancaris, la diferència entre dèbit i crèdit i com triar un compte jove 100% lliure de comissions.",
        0,
        3,
        () => {
          alert("El Capítol 3 («M'arriba un bizum d'un desconegut: Estafes mòbils i la norma d'or») s'activarà en la propera actualització!");
          window.location.hash = "#dashboard";
        }
      );
    };
  }
};
