/**
 * CAPITOL4.JS - Guió i lògica interactiva del Capítol 4:
 * "On se me'n va la pasta?"
 */

const Capitol4 = {
id: 4,
title: "Capítol 4 · On se me'n va la pasta?",
totalSteps: 4,

state: {
firstGuess: null,
antExpensesSelected: [0,1,3],
monthlyAntTotal: 0,
yearlyAntTotal: 0,
subsCancelledTotal: 0
},

ANT_ITEMS: [
{
id:0,
name:"Beguda energètica o cafè diari",
icon:"🥤",
costMonthly:54,
costYearly:648,
desc:"1,80 € al dia a l'institut o feina"
},
{
id:1,
name:"Menjar a domicili (Glovo/Uber Eats)",
icon:"🛵",
costMonthly:30,
costYearly:360,
desc:"2 comandes al mes amb enviament"
},
{
id:2,
name:"Skins o micropagaments",
icon:"🎮",
costMonthly:12,
costYearly:144,
desc:"Pases de batalla i compres petites"
},
{
id:3,
name:"Patinet de lloguer",
icon:"🛴",
costMonthly:22,
costYearly:264,
desc:"Trajectes ràpids per mandra"
},
{
id:4,
name:"Snacks i vending",
icon:"🍫",
costMonthly:16,
costYearly:192,
desc:"Petites compres impulsives"
}
],

SUBSCRIPTIONS: [
{
id:0,
name:"Spotify / Apple Music",
icon:"🎵",
cost:9.99,
freq:"L'utilitzo cada dia",
status:"keep"
},
{
id:1,
name:"App fitness abandonada",
icon:"🏋️",
cost:7.99,
freq:"No l'he oberta en 4 mesos",
status:"keep"
},
{
id:2,
name:"Netflix + HBO + Disney",
icon:"🎬",
cost:31.97,
freq:"Només miro una plataforma",
status:"keep"
},
{
id:3,
name:"Núvol 2 TB",
icon:"☁️",
cost:2.99,
freq:"Només ocupa 35 GB",
status:"keep"
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

ChatEngine.registerStep(
1,
"L'expedient X: de 85 € a 1,40 €"
);

await ChatEngine.say(
"nil",
"NOIS!! Necessito ajuda. Fa dues setmanes tenia 85 € al compte i avui m'he quedat amb 1,40 €."
);

await ChatEngine.say(
"marta",
"Has comprat alguna cosa grossa?"
);

await ChatEngine.say(
"nil",
"No! Ni roba, ni videojocs, ni res important."
);

await ChatEngine.say(
"pau",
"Això és impossible. Els diners no desapareixen sols."
);

await ChatEngine.say(
"nil",
"Us juro que no sé on han anat."
);

await ChatEngine.say(
"aina",
"Pregunta ràpida: quantes vegades has pagat amb el mòbil aquests dies?"
);

await ChatEngine.say(
"nil",
"Buf... moltes. Cafès, alguna beguda, un parell d'entrepans..."
);

const choiceCard = document.createElement("div");

choiceCard.className = "chat-embed-card";

choiceCard.innerHTML = `
<div class="question-title">
Quina és l'explicació més probable?
</div>

<button class="opt" data-opt="1">
Li han hackejat el compte
</button>

<button class="opt" data-opt="2">
Microdespeses repetides
</button>

<button class="opt" data-opt="3">
Error del banc
</button>
`;

ChatEngine.embedCard(choiceCard);

choiceCard.querySelectorAll(".opt").forEach(btn => {

btn.onclick = async () => {

choiceCard.querySelectorAll(".opt")
.forEach(b => b.disabled = true);

const opt = btn.dataset.opt;

this.state.firstGuess = opt;

if(opt === "2"){
btn.classList.add("right");
ChatEngine.triggerHaptic();
}else{
btn.classList.add("wrong");
choiceCard
.querySelector('[data-opt="2"]')
.classList.add("right");
}

await this.handleStep1Answer(opt);

};

});

}
,

async handleStep1Answer(opt) {

  if (opt === "2") {
    await ChatEngine.say(
      "me",
      "Nil, no t'han hackejat: són les microdespeses. Cada cop que fas «bip» amb el mòbil són 2 o 3 euros que sembla que no comptin, però sumen com un coet."
    );

    await ChatEngine.say(
      "aina",
      "Exacte! Mirem l'extracte bancari real del Nil d'aquests últims 14 dies i ho veureu de seguida."
    );
  } else {
    await ChatEngine.say(
      "me",
      "Tranquil, Nil. Abans de denunciar res, mirem l'historial de moviments."
    );

    await ChatEngine.say(
      "pau",
      "A mi em passava sovint: creus que no gastes perquè no compres res de 100 €, però les petites fuites et buiden el dipòsit."
    );
  }

  const statementCard = document.createElement("div");
  statementCard.className = "chat-embed-card";

  statementCard.innerHTML = `
    <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:.78rem; opacity:.7; text-transform:uppercase; letter-spacing:.08em;">
          Extracte bancari
        </div>
        <h4 style="margin:3px 0 0;">Moviments dels últims 14 dies</h4>
      </div>

      <div style="text-align:right;">
        <div style="font-size:.78rem; opacity:.7;">Saldo inicial</div>
        <strong>85,00 €</strong>
      </div>
    </div>

    <div style="display:grid; gap:8px;">
      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>🥤 Begudes i cafès</span>
        <strong style="color:var(--warn);">−12,60 €</strong>
      </div>

      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>🍫 Snacks i màquines</span>
        <strong style="color:var(--warn);">−8,40 €</strong>
      </div>

      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>🛴 Patinet de lloguer</span>
        <strong style="color:var(--warn);">−11,00 €</strong>
      </div>

      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>🛵 Menjar a domicili</span>
        <strong style="color:var(--warn);">−16,90 €</strong>
      </div>

      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>🎮 Micropagaments</span>
        <strong style="color:var(--warn);">−9,99 €</strong>
      </div>

      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>📱 Altres compres petites</span>
        <strong style="color:var(--warn);">−24,71 €</strong>
      </div>
    </div>

    <hr style="margin:15px 0; opacity:.2;">

    <div style="display:flex; justify-content:space-between; gap:12px;">
      <span>Total gastat</span>
      <strong style="color:var(--warn);">−83,60 €</strong>
    </div>

    <div style="display:flex; justify-content:space-between; gap:12px; margin-top:6px;">
      <span>Saldo actual</span>
      <strong style="font-size:1.25rem;">1,40 €</strong>
    </div>

    <div style="margin-top:15px; padding:12px; border-radius:12px; background:var(--warn2); color:var(--warn);">
      <strong>Diagnòstic:</strong> cap compra supera els 25 €, però totes juntes han consumit gairebé el 100 % del saldo.
    </div>

    <button id="btn-step1-next" class="btn" style="margin-top:16px; width:100%;">
      Pas 2: Calculadora de despeses formiga →
    </button>
  `;

  ChatEngine.embedCard(statementCard);

  await ChatEngine.say(
    "nil",
    "Però si gairebé tot són compres de 2 €, 4 € o 10 €! Com poden haver sumat més de 80 €?"
  );

  await ChatEngine.say(
    "marc",
    "Perquè el cervell vigila molt una compra de 100 €, però baixa la guàrdia davant de deu compres petites. Això són les **despeses formiga**."
  );

  ChatEngine.embedMaxim(
    "Una despesa petita no és perillosa perquè sigui petita, sinó perquè es repeteix sense que la vigilis."
  );

  statementCard.querySelector("#btn-step1-next").onclick = async () => {
    statementCard.querySelector("#btn-step1-next").remove();
    await ChatEngine.wait(350);
    await this.step2();
  };
},

/* ==========================================================================
PAS 2: LA CALCULADORA DE DESPESES FORMIGA
========================================================================== */

async step2() {

  ChatEngine.registerStep(
    2,
    "Calculadora formiga: l'efecte bola de neu"
  );

  await ChatEngine.say(
    "marta",
    "Ara farem una radiografia dels teus hàbits. Marca les petites despeses que fas durant un mes normal."
  );

  await ChatEngine.say(
    "aina",
    "La calculadora et mostrarà el cost mensual i el cost anual. Aquesta segona xifra és la que acostuma a fer més impressió."
  );

  const antCard = document.createElement("div");
  antCard.className = "chat-embed-card";

  antCard.innerHTML = `
    <div style="margin-bottom:15px;">
      <div style="font-size:.78rem; opacity:.7; text-transform:uppercase; letter-spacing:.08em;">
        Calculadora interactiva
      </div>

      <h4 style="margin:4px 0 6px;">
        🐜 Quines despeses formiga tens?
      </h4>

      <p style="margin:0; opacity:.8;">
        Prem sobre cada hàbit per activar-lo o desactivar-lo. Els imports són estimacions orientatives.
      </p>
    </div>

    <div id="ant-items-container" style="display:grid; gap:10px;"></div>

    <div style="margin-top:18px; padding:15px; border-radius:15px; background:var(--surface2, rgba(255,255,255,.05));">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <div style="font-size:.78rem; opacity:.7;">TOTAL MENSUAL</div>
          <div id="ant-monthly-total" style="font-size:1.45rem; font-weight:800;">
            0,00 €
          </div>
        </div>

        <div>
          <div style="font-size:.78rem; opacity:.7;">TOTAL ANUAL</div>
          <div id="ant-yearly-total" style="font-size:1.45rem; font-weight:800; color:var(--warn);">
            0,00 €
          </div>
        </div>
      </div>

      <div id="ant-equivalence-box" style="margin-top:14px; line-height:1.5;"></div>
    </div>

    <button id="btn-ant-confirm" class="btn" style="margin-top:16px; width:100%;">
      Confirmar els meus hàbits i continuar →
    </button>
  `;

  ChatEngine.embedCard(antCard);

  const itemsContainer = antCard.querySelector("#ant-items-container");
  const monthlyTotalElement = antCard.querySelector("#ant-monthly-total");
  const yearlyTotalElement = antCard.querySelector("#ant-yearly-total");
  const equivalenceBox = antCard.querySelector("#ant-equivalence-box");

  const euro = value => {
    return value.toLocaleString("ca-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";
  };

  this.ANT_ITEMS.forEach(item => {
    const selected = this.state.antExpensesSelected.includes(item.id);

    const itemButton = document.createElement("button");
    itemButton.type = "button";
    itemButton.className = selected ? "ant-item selected" : "ant-item";
    itemButton.dataset.id = String(item.id);

    itemButton.style.cssText = `
      width:100%;
      text-align:left;
      border:1px solid ${selected ? "var(--teal)" : "rgba(255,255,255,.12)"};
      background:${selected ? "var(--ok2)" : "transparent"};
      color:inherit;
      border-radius:14px;
      padding:13px;
      cursor:pointer;
    `;

    itemButton.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
        <div style="display:flex; gap:11px; align-items:flex-start;">
          <span style="font-size:1.5rem;">${item.icon}</span>

          <div>
            <strong>${item.name}</strong>
            <div style="font-size:.86rem; opacity:.72; margin-top:3px;">
              ${item.desc}
            </div>
          </div>
        </div>

        <div style="text-align:right; white-space:nowrap;">
          <strong>${euro(item.costMonthly)}/mes</strong>
          <div class="ant-check" style="font-size:.82rem; margin-top:4px; color:var(--teal);">
            ${selected ? "✓ Seleccionat" : "+ Afegir"}
          </div>
        </div>
      </div>
    `;

    itemsContainer.appendChild(itemButton);
  });

  const getEquivalence = yearly => {
    if (yearly === 0) {
      return `
        <strong>Selecciona almenys un hàbit.</strong>
        <div style="opacity:.75; margin-top:4px;">
          Així podràs veure quant representa al cap d'un any.
        </div>
      `;
    }

    if (yearly < 250) {
      return `
        <strong>💡 Amb ${euro(yearly)} podries començar un coixí d'emergència.</strong>
        <div style="opacity:.75; margin-top:4px;">
          No cal eliminar-ho tot. Reduint-ne la freqüència a la meitat ja recuperaries ${euro(yearly / 2)} l'any.
        </div>
      `;
    }

    if (yearly < 700) {
      return `
        <strong>💻 Aquesta quantitat ja s'acosta al preu d'un portàtil bàsic.</strong>
        <div style="opacity:.75; margin-top:4px;">
          Si reduïssis aquestes despeses un 50 %, estalviaries ${euro(yearly / 2)} cada any.
        </div>
      `;
    }

    if (yearly < 1200) {
      return `
        <strong>🚗 Aquesta quantitat podria pagar bona part del carnet de conduir.</strong>
        <div style="opacity:.75; margin-top:4px;">
          No és una crítica a prendre un cafè. El problema és convertir una compra automàtica en una despesa anual invisible.
        </div>
      `;
    }

    return `
      <strong>🚨 La suma supera els 1.200 € anuals.</strong>
      <div style="opacity:.75; margin-top:4px;">
        És més d'un mes de sou net per a moltes primeres feines. Reduir només la meitat representaria ${euro(yearly / 2)} recuperats.
      </div>
    `;
  };

  const updateAntTotals = () => {
    const selectedItems = this.ANT_ITEMS.filter(item =>
      this.state.antExpensesSelected.includes(item.id)
    );

    const monthlyTotal = selectedItems.reduce(
      (sum, item) => sum + item.costMonthly,
      0
    );

    const yearlyTotal = selectedItems.reduce(
      (sum, item) => sum + item.costYearly,
      0
    );

    this.state.monthlyAntTotal = monthlyTotal;
    this.state.yearlyAntTotal = yearlyTotal;

    monthlyTotalElement.textContent = euro(monthlyTotal);
    yearlyTotalElement.textContent = euro(yearlyTotal);
    equivalenceBox.innerHTML = getEquivalence(yearlyTotal);
  };

  antCard.querySelectorAll(".ant-item").forEach(button => {
    button.onclick = () => {
      const id = Number(button.dataset.id);
      const item = this.ANT_ITEMS.find(candidate => candidate.id === id);
      const isSelected = this.state.antExpensesSelected.includes(id);

      if (isSelected) {
        this.state.antExpensesSelected =
          this.state.antExpensesSelected.filter(selectedId => selectedId !== id);

        button.classList.remove("selected");
        button.style.borderColor = "rgba(255,255,255,.12)";
        button.style.background = "transparent";
        button.querySelector(".ant-check").textContent = "+ Afegir";
      } else {
        this.state.antExpensesSelected.push(id);

        button.classList.add("selected");
        button.style.borderColor = "var(--teal)";
        button.style.background = "var(--ok2)";
        button.querySelector(".ant-check").textContent = "✓ Seleccionat";
      }

      updateAntTotals();
      ChatEngine.triggerHaptic();

      if (item) {
        button.setAttribute(
          "aria-label",
          `${item.name}: ${isSelected ? "desactivat" : "activat"}`
        );
      }
    };
  });

  updateAntTotals();

  antCard.querySelector("#btn-ant-confirm").onclick = async () => {
    const confirmButton = antCard.querySelector("#btn-ant-confirm");
    confirmButton.disabled = true;

    if (this.state.antExpensesSelected.length === 0) {
      equivalenceBox.innerHTML = `
        <strong>Selecciona com a mínim un hàbit habitual.</strong>
        <div style="opacity:.75; margin-top:4px;">
          No busquem jutjar-te, sinó entendre quin efecte té la repetició.
        </div>
      `;

      confirmButton.disabled = false;
      return;
    }

    await ChatEngine.say(
      "nil",
      `No m'ho puc creure. Els meus hàbits seleccionats sumen **${euro(this.state.yearlyAntTotal)} l'any**. Jo només veia monedes i imports petits!`
    );

    await ChatEngine.say(
      "marc",
      "Aquesta és la lliçó: no cal prohibir tots els petits plaers. Cal decidir quins et compensen i posar un límit als que fas per inèrcia."
    );

    await ChatEngine.say(
      "marta",
      "Per exemple, pots reservar una quantitat mensual per a cafès i snacks. Quan s'acaba, no tornes a gastar fins al mes següent."
    );

    ChatEngine.embedMaxim(
      "No eliminis tot el que t'agrada. Elimina la repetició inconscient i conserva les despeses que realment valores."
    );

    await ChatEngine.wait(350);
    await this.step3();
  };
},
/* ==========================================================================
PAS 3: L'AUDITORIA DE SUBSCRIPCIONS INVISIBLES
========================================================================== */

async step3() {

  ChatEngine.registerStep(
    3,
    "Subscripcions: el goteig mensual"
  );

  await ChatEngine.say(
    "pau",
    "Les despeses formiga no sempre són compres que fas activament. Algunes et cobren mentre ni tan sols hi penses."
  );

  await ChatEngine.say(
    "nil",
    "Espera... vols dir les subscripcions? Jo en tinc alguna, però són imports molt petits."
  );

  await ChatEngine.say(
    "marta",
    "Precisament per això són perilloses. Les contractes una vegada i després es converteixen en un goteig automàtic."
  );

  await ChatEngine.say(
    "aina",
    "Farem una auditoria. Has de decidir què mantens i què cancel·les. No cal eliminar allò que utilitzes de debò."
  );

  const subscriptionCard = document.createElement("div");
  subscriptionCard.className = "chat-embed-card";

  subscriptionCard.innerHTML = `
    <div style="margin-bottom:15px;">
      <div style="
        font-size:.78rem;
        opacity:.7;
        text-transform:uppercase;
        letter-spacing:.08em;
      ">
        Auditoria de rebuts recurrents
      </div>

      <h4 style="margin:4px 0 6px;">
        📱 Quines subscripcions conservaries?
      </h4>

      <p style="margin:0; opacity:.8;">
        Revisa l'ús real de cada servei i decideix si el mantens o el cancel·les.
      </p>
    </div>

    <div
      id="subscriptions-container"
      style="display:grid; gap:12px;"
    ></div>

    <div style="
      margin-top:18px;
      padding:15px;
      border-radius:15px;
      background:var(--surface2, rgba(255,255,255,.05));
    ">
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
      ">
        <div>
          <div style="font-size:.78rem; opacity:.7;">
            COST QUE MANTENS
          </div>

          <div
            id="subscriptions-kept-total"
            style="font-size:1.35rem; font-weight:800;"
          >
            52,94 €/mes
          </div>
        </div>

        <div>
          <div style="font-size:.78rem; opacity:.7;">
            ESTALVI SI CANCEL·LES
          </div>

          <div
            id="subscriptions-saved-total"
            style="
              font-size:1.35rem;
              font-weight:800;
              color:var(--teal);
            "
          >
            0,00 €/mes
          </div>
        </div>
      </div>

      <div
        id="subscriptions-yearly-result"
        style="margin-top:14px; line-height:1.5;"
      >
        Encara no has cancel·lat cap subscripció.
      </div>
    </div>

    <button
      id="btn-subscriptions-confirm"
      class="btn"
      style="margin-top:16px; width:100%;"
    >
      Confirmar l'auditoria →
    </button>
  `;

  ChatEngine.embedCard(subscriptionCard);

  const subscriptionsContainer =
    subscriptionCard.querySelector("#subscriptions-container");

  const keptTotalElement =
    subscriptionCard.querySelector("#subscriptions-kept-total");

  const savedTotalElement =
    subscriptionCard.querySelector("#subscriptions-saved-total");

  const yearlyResultElement =
    subscriptionCard.querySelector("#subscriptions-yearly-result");

  const euro = value => {
    return value.toLocaleString("ca-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";
  };

  this.SUBSCRIPTIONS.forEach(subscription => {

    const row = document.createElement("div");
    row.className = "subscription-audit-row";
    row.dataset.id = String(subscription.id);

    row.style.cssText = `
      border:1px solid rgba(255,255,255,.12);
      border-radius:14px;
      padding:14px;
      background:transparent;
    `;

    row.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
      ">
        <div style="display:flex; gap:11px; align-items:flex-start;">
          <span style="font-size:1.55rem;">
            ${subscription.icon}
          </span>

          <div>
            <strong>${subscription.name}</strong>

            <div style="
              font-size:.86rem;
              opacity:.72;
              margin-top:4px;
            ">
              ${subscription.freq}
            </div>
          </div>
        </div>

        <div style="text-align:right; white-space:nowrap;">
          <strong>${euro(subscription.cost)}/mes</strong>

          <div style="
            font-size:.78rem;
            opacity:.65;
            margin-top:3px;
          ">
            ${euro(subscription.cost * 12)}/any
          </div>
        </div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:13px;
      ">
        <button
          type="button"
          class="chip subscription-action on"
          data-action="keep"
          style="justify-content:center;"
        >
          ✓ Mantenir
        </button>

        <button
          type="button"
          class="chip subscription-action"
          data-action="cancel"
          style="justify-content:center;"
        >
          ✕ Cancel·lar
        </button>
      </div>

      <div
        class="subscription-feedback"
        style="
          display:none;
          margin-top:11px;
          padding:10px;
          border-radius:10px;
          font-size:.88rem;
          line-height:1.45;
        "
      ></div>
    `;

    subscriptionsContainer.appendChild(row);
  });

  const getSubscriptionAdvice = (subscription, action) => {

    if (action === "keep") {

      if (subscription.id === 0) {
        return {
          good: true,
          text:
            "Bona decisió si l'utilitzes cada dia. Una subscripció útil no és una despesa inútil."
        };
      }

      if (subscription.id === 1) {
        return {
          good: false,
          text:
            "Fa quatre mesos que no l'obres. Mantenir-la costa " +
            euro(subscription.cost * 12) +
            " l'any per una cosa que no utilitzes."
        };
      }

      if (subscription.id === 2) {
        return {
          good: false,
          text:
            "Pagar tres plataformes alhora quan només en fas servir una és una fuita important. Pots alternar-les cada mes."
        };
      }

      return {
        good: false,
        text:
          "Estàs pagant molt més espai del que necessites. Comprova si existeix un pla gratuït o més petit."
      };
    }

    if (subscription.id === 0) {
      return {
        good: false,
        text:
          "La pots cancel·lar, però si realment l'utilitzes cada dia potser t'aporta prou valor. L'objectiu no és eliminar-ho tot."
      };
    }

    if (subscription.id === 1) {
      return {
        good: true,
        text:
          "Bona neteja. Cancel·les una app abandonada i recuperes " +
          euro(subscription.cost * 12) +
          " l'any."
      };
    }

    if (subscription.id === 2) {
      return {
        good: true,
        text:
          "Molt bé. Pots conservar una sola plataforma i anar canviant quan s'acabi la sèrie que segueixes."
      };
    }

    return {
      good: true,
      text:
        "Correcte. Un pla més petit probablement cobrirà els 35 GB que necessites."
    };
  };

  const updateSubscriptionTotals = () => {

    const cancelledSubscriptions =
      this.SUBSCRIPTIONS.filter(subscription =>
        subscription.status === "cancel"
      );

    const keptSubscriptions =
      this.SUBSCRIPTIONS.filter(subscription =>
        subscription.status === "keep"
      );

    const monthlySaved = cancelledSubscriptions.reduce(
      (sum, subscription) => sum + subscription.cost,
      0
    );

    const monthlyKept = keptSubscriptions.reduce(
      (sum, subscription) => sum + subscription.cost,
      0
    );

    const yearlySaved = monthlySaved * 12;

    this.state.subsCancelledTotal = monthlySaved;

    keptTotalElement.textContent = euro(monthlyKept) + "/mes";
    savedTotalElement.textContent = euro(monthlySaved) + "/mes";

    if (monthlySaved === 0) {
      yearlyResultElement.innerHTML = `
        <strong>Encara no has cancel·lat cap subscripció.</strong>

        <div style="opacity:.75; margin-top:4px;">
          Revisa especialment els serveis que fa mesos que no utilitzes.
        </div>
      `;

      return;
    }

    if (yearlySaved < 100) {
      yearlyResultElement.innerHTML = `
        <strong>💰 Recuperaries ${euro(yearlySaved)} cada any.</strong>

        <div style="opacity:.75; margin-top:4px;">
          És una petita neteja, però ja pot cobrir diverses sortides o una part del teu coixí.
        </div>
      `;

      return;
    }

    if (yearlySaved < 300) {
      yearlyResultElement.innerHTML = `
        <strong>💰 Recuperaries ${euro(yearlySaved)} cada any.</strong>

        <div style="opacity:.75; margin-top:4px;">
          Aquesta quantitat ja pot pagar material d'estudi, transport o una reparació inesperada.
        </div>
      `;

      return;
    }

    yearlyResultElement.innerHTML = `
      <strong>🚀 Recuperaries ${euro(yearlySaved)} cada any.</strong>

      <div style="opacity:.75; margin-top:4px;">
        És una quantitat prou gran per iniciar una meta d'estalvi sense haver de guanyar més diners.
      </div>
    `;
  };

  subscriptionCard
    .querySelectorAll(".subscription-audit-row")
    .forEach(row => {

      const subscriptionId = Number(row.dataset.id);

      const subscription = this.SUBSCRIPTIONS.find(
        candidate => candidate.id === subscriptionId
      );

      const feedback =
        row.querySelector(".subscription-feedback");

      row
        .querySelectorAll(".subscription-action")
        .forEach(button => {

          button.onclick = () => {

            const action = button.dataset.action;

            subscription.status = action;

            row
              .querySelectorAll(".subscription-action")
              .forEach(actionButton =>
                actionButton.classList.remove("on")
              );

            button.classList.add("on");

            const advice =
              getSubscriptionAdvice(subscription, action);

            feedback.style.display = "block";

            if (advice.good) {
              feedback.style.background = "var(--ok2)";
              feedback.style.color = "var(--ok)";
              feedback.style.border = "1px solid var(--ok)";
              feedback.innerHTML = "✓ " + advice.text;
            } else {
              feedback.style.background = "var(--warn2)";
              feedback.style.color = "var(--warn)";
              feedback.style.border = "1px solid var(--warn)";
              feedback.innerHTML = "⚠ " + advice.text;
            }

            if (action === "cancel") {
              row.style.borderColor = "var(--teal)";
            } else {
              row.style.borderColor = "rgba(255,255,255,.12)";
            }

            updateSubscriptionTotals();
            ChatEngine.triggerHaptic();
          };
        });
    });

  updateSubscriptionTotals();

  subscriptionCard
    .querySelector("#btn-subscriptions-confirm")
    .onclick = async () => {

      const confirmButton =
        subscriptionCard.querySelector(
          "#btn-subscriptions-confirm"
        );

      confirmButton.disabled = true;

      const monthlySaved =
        this.state.subsCancelledTotal;

      const yearlySaved =
        monthlySaved * 12;

      if (monthlySaved === 0) {

        await ChatEngine.say(
          "nil",
          "He mantingut totes les subscripcions. Però ara veig que algunes fa mesos que no les utilitzo."
        );

        await ChatEngine.say(
          "marta",
          "L'important és que ho decideixis conscientment. Si una subscripció no t'aporta valor, cancel·la-la avui i sempre la podràs recuperar més endavant."
        );

      } else {

        await ChatEngine.say(
          "nil",
          `Només revisant quatre rebuts puc recuperar **${euro(monthlySaved)} al mes**, que són **${euro(yearlySaved)} l'any**!`
        );

        await ChatEngine.say(
          "marta",
          "I sense renunciar a cap pla important. Simplement has deixat de pagar serveis que no utilitzaves de debò."
        );
      }

      await ChatEngine.say(
        "marc",
        "Fes aquesta auditoria cada tres mesos. Busca a l'app del banc els conceptes repetits i pregunta't si encara els utilitzes."
      );

      ChatEngine.embedMaxim(
        "Una subscripció només és barata si la utilitzes. Si l'has oblidat, qualsevol import és massa car."
      );

      await ChatEngine.wait(350);
      await this.step4();
    };
}
/* ==========================================================================
PAS 4: LA REGLA DE LES 48 HORES I EL TEU REPTE REAL
========================================================================== */

async step4() {

  ChatEngine.registerStep(
    4,
    "La regla de les 48h i el teu repte"
  );

  await ChatEngine.say(
    "nil",
    "D'acord, ja sé detectar les despeses formiga i les subscripcions oblidades. Però què faig quan veig una oferta i em venen unes ganes brutals de comprar?"
  );

  await ChatEngine.say(
    "pau",
    "A mi em passava amb roba i tecnologia. Veia «últimes unitats» i comprava abans de preguntar-me si realment ho volia."
  );

  await ChatEngine.say(
    "marta",
    "Per això existeix una tècnica molt simple: la **regla de les 48 hores**."
  );

  await ChatEngine.say(
    "aina",
    "Quan vulguis comprar una cosa no essencial, no la compris al moment. Guarda-la en una llista i espera 48 hores."
  );

  const waitCard = document.createElement("div");
  waitCard.className = "chat-embed-card";

  waitCard.innerHTML = `
    <div style="margin-bottom:15px;">
      <div style="
        font-size:.78rem;
        opacity:.7;
        text-transform:uppercase;
        letter-spacing:.08em;
      ">
        Simulador de compra impulsiva
      </div>

      <h4 style="margin:4px 0 6px;">
        ⏳ La regla de les 48 hores
      </h4>

      <p style="margin:0; opacity:.8;">
        Has vist unes vambes rebaixades de 90 € a 59,99 €. L'oferta diu que acaba aquesta nit.
      </p>
    </div>

    <div style="
      padding:15px;
      border-radius:15px;
      background:var(--surface2, rgba(255,255,255,.05));
      margin-bottom:14px;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:center;
      ">
        <div>
          <strong>👟 Vambes Urban Limited</strong>

          <div style="
            font-size:.86rem;
            opacity:.72;
            margin-top:4px;
          ">
            «Només avui. Queden 2 unitats.»
          </div>
        </div>

        <div style="text-align:right;">
          <div style="
            text-decoration:line-through;
            opacity:.55;
            font-size:.85rem;
          ">
            90,00 €
          </div>

          <strong style="
            color:var(--warn);
            font-size:1.25rem;
          ">
            59,99 €
          </strong>
        </div>
      </div>
    </div>

    <div style="display:grid; gap:9px;">
      <button
        type="button"
        class="opt"
        data-choice="buy"
      >
        Comprar-les ara perquè estan rebaixades
      </button>

      <button
        type="button"
        class="opt"
        data-choice="wait"
      >
        Guardar-les a la llista i esperar 48 hores
      </button>

      <button
        type="button"
        class="opt"
        data-choice="credit"
      >
        Pagar-les en tres terminis de 20 €
      </button>
    </div>

    <div
      id="wait-rule-result"
      style="
        display:none;
        margin-top:14px;
        padding:13px;
        border-radius:12px;
        line-height:1.5;
      "
    ></div>

    <button
      id="btn-wait-to-recap"
      class="btn"
      style="
        display:none;
        margin-top:16px;
        width:100%;
      "
    >
      Veure el resum del capítol →
    </button>
  `;

  ChatEngine.embedCard(waitCard);

  const resultBox =
    waitCard.querySelector("#wait-rule-result");

  const recapButton =
    waitCard.querySelector("#btn-wait-to-recap");

  waitCard.querySelectorAll(".opt").forEach(button => {

    button.onclick = () => {

      waitCard
        .querySelectorAll(".opt")
        .forEach(option => option.disabled = true);

      const choice = button.dataset.choice;

      resultBox.style.display = "block";
      recapButton.style.display = "block";

      if (choice === "wait") {

        button.classList.add("right");

        resultBox.style.background = "var(--ok2)";
        resultBox.style.color = "var(--ok)";
        resultBox.style.border = "1px solid var(--ok)";

        resultBox.innerHTML = `
          <strong>✓ Decisió conscient.</strong>

          <div style="margin-top:5px;">
            Dues hores després recordes que ja tens unes vambes semblants.
            Al cap de 48 hores, les ganes han desaparegut i conserves els
            <strong>59,99 €</strong>.
          </div>
        `;

        ChatEngine.triggerHaptic();

      } else if (choice === "credit") {

        button.classList.add("wrong");

        waitCard
          .querySelector('[data-choice="wait"]')
          .classList.add("right");

        resultBox.style.background = "var(--warn2)";
        resultBox.style.color = "var(--warn)";
        resultBox.style.border = "1px solid var(--warn)";

        resultBox.innerHTML = `
          <strong>✕ Doble parany.</strong>

          <div style="margin-top:5px;">
            No només compres per impuls, sinó que converteixes unes vambes
            en un deute futur. Dividir el preu no fa que el producte sigui
            més barat.
          </div>
        `;

      } else {

        button.classList.add("wrong");

        waitCard
          .querySelector('[data-choice="wait"]')
          .classList.add("right");

        resultBox.style.background = "var(--warn2)";
        resultBox.style.color = "var(--warn)";
        resultBox.style.border = "1px solid var(--warn)";

        resultBox.innerHTML = `
          <strong>⚠ Una rebaixa no és un estalvi si no necessitaves comprar.</strong>

          <div style="margin-top:5px;">
            No has estalviat 30,01 €. Has gastat 59,99 € que abans tenies
            al compte.
          </div>
        `;
      }
    };
  });

  recapButton.onclick = async () => {

    recapButton.remove();

    await ChatEngine.say(
      "nil",
      "Això de dir «he estalviat 30 € perquè estava rebaixat» era una trampa mental. En realitat he gastat 60 €."
    );

    await ChatEngine.say(
      "marc",
      "Exacte. Només estalvies amb una oferta si ja tenies previst comprar aquell producte i havies reservat els diners."
    );

    await ChatEngine.say(
      "marta",
      "Les 48 hores no et prohibeixen comprar. Simplement separen l'impuls de la decisió."
    );

    ChatEngine.embedMaxim(
      "Una oferta no t'estalvia diners si et fa comprar una cosa que no necessitaves."
    );

    await ChatEngine.wait(350);

    const antReductionMonthly =
      this.state.monthlyAntTotal * 0.5;

    const subscriptionSavingsMonthly =
      this.state.subsCancelledTotal;

    const potentialMonthlySavings =
      antReductionMonthly + subscriptionSavingsMonthly;

    const potentialYearlySavings =
      potentialMonthlySavings * 12;

    const euro = value => {
      return value.toLocaleString("ca-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + " €";
    };

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";

    recapCard.innerHTML = `
      <div style="text-align:center; margin-bottom:18px;">
        <div style="font-size:2.2rem;">🐜</div>

        <h3 style="margin:6px 0;">
          Capítol 4 superat
        </h3>

        <div style="opacity:.75;">
          Ja saps detectar on desapareixen els diners petits.
        </div>
      </div>

      <div style="display:grid; gap:12px;">
        <div style="
          padding:14px;
          border-radius:14px;
          background:var(--surface2, rgba(255,255,255,.05));
        ">
          <strong>1. Mira l'any, no només el tiquet</strong>

          <div style="
            opacity:.78;
            margin-top:5px;
            line-height:1.5;
          ">
            Un cafè d'1,80 € sembla insignificant. Repetit cada dia,
            pot superar els 600 € anuals.
          </div>
        </div>

        <div style="
          padding:14px;
          border-radius:14px;
          background:var(--surface2, rgba(255,255,255,.05));
        ">
          <strong>2. Audita els cobraments automàtics</strong>

          <div style="
            opacity:.78;
            margin-top:5px;
            line-height:1.5;
          ">
            Revisa cada tres mesos les subscripcions. Mantén les que
            utilitzes i cancel·la les que pagues per inèrcia.
          </div>
        </div>

        <div style="
          padding:14px;
          border-radius:14px;
          background:var(--surface2, rgba(255,255,255,.05));
        ">
          <strong>3. Espera 48 hores abans d'un caprici</strong>

          <div style="
            opacity:.78;
            margin-top:5px;
            line-height:1.5;
          ">
            Si després de dos dies encara ho vols, encaixa al teu
            pressupost i tens els diners, pots comprar-ho sense culpa.
          </div>
        </div>
      </div>

      <div style="
        margin-top:16px;
        padding:15px;
        border-radius:15px;
        background:var(--ok2);
        color:var(--ok);
        border:1px solid var(--ok);
      ">
        <div style="
          font-size:.78rem;
          opacity:.8;
          text-transform:uppercase;
          letter-spacing:.07em;
        ">
          El teu potencial d'estalvi
        </div>

        <div style="
          font-size:1.55rem;
          font-weight:800;
          margin-top:4px;
        ">
          ${euro(potentialYearlySavings)} l'any
        </div>

        <div style="
          margin-top:6px;
          line-height:1.5;
        ">
          Càlcul orientatiu reduint a la meitat les despeses formiga
          seleccionades i cancel·lant les subscripcions que has marcat.
        </div>
      </div>

      <div style="
        margin-top:18px;
        padding-top:16px;
        border-top:1px solid rgba(255,255,255,.12);
      ">
        <h4 style="margin:0 0 9px;">
          🎯 El teu repte real d'aquesta setmana
        </h4>

        <ol style="
          margin:0;
          padding-left:20px;
          line-height:1.65;
        ">
          <li>
            Obre l'app del banc i revisa els moviments dels últims
            30 dies.
          </li>

          <li>
            Apunta totes les compres inferiors a 10 € i suma-les.
          </li>

          <li>
            Busca com a mínim una subscripció o cobrament recurrent.
          </li>

          <li>
            Tria una despesa formiga per reduir a la meitat durant
            set dies.
          </li>
        </ol>
      </div>

      <div style="
        margin-top:16px;
        padding:13px;
        border-radius:12px;
        background:var(--surface2, rgba(255,255,255,.05));
        line-height:1.5;
      ">
        <strong>Frase per recordar:</strong>

        <div style="margin-top:4px;">
          No es tracta de no gastar mai. Es tracta que cada euro que
          marxa tingui una decisió al darrere.
        </div>
      </div>

      <button
        id="btn-finish-cap4"
        class="btn"
        style="margin-top:18px; width:100%;"
      >
        Completar el Capítol 4 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard
      .querySelector("#btn-finish-cap4")
      .onclick = () => {

        const finishButton =
          recapCard.querySelector("#btn-finish-cap4");

        finishButton.disabled = true;

        AppState.saveChapterData(
          4,
          "selectedAntExpenses",
          this.state.antExpensesSelected
        );

        AppState.saveChapterData(
          4,
          "monthlyAntTotal",
          this.state.monthlyAntTotal
        );

        AppState.saveChapterData(
          4,
          "yearlyAntTotal",
          this.state.yearlyAntTotal
        );

        AppState.saveChapterData(
          4,
          "subscriptionSavingsMonthly",
          this.state.subsCancelledTotal
        );

        AppState.saveChapterData(
          4,
          "potentialYearlySavings",
          potentialYearlySavings
        );

        /*
         * Premi virtual moderat:
         * afegim l'estalvi potencial d'un mes, amb un màxim de 100 €,
         * per no inflar excessivament el saldo global de l'app.
         */
        const virtualReward = Math.min(
          Math.round(potentialMonthlySavings),
          100
        );

        AppState.completeChapter(
          4,
          virtualReward,
          null
        );

        ChatEngine.celebrate(
          "Capítol 4 completat amb èxit!",
          "Has detectat les despeses formiga, has auditat les subscripcions i ja saps aplicar la regla de les 48 hores.",
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