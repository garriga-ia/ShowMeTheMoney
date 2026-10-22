/**
 * CAPITOL5.JS - Guió i lògica interactiva del Capítol 5: "Quedem per anar a un concert"
 */

const Capitol5 = {
  id: 5,
  title: "Capítol 5 · Quedem per anar a un concert",
  totalSteps: 4,

  state: {
    firstReaction: null,
    negotiationChoice: null,
    selectedPlans: [0, 1, 2], // Plans inicials seleccionats
    monthlyBudget: 60,
    totalSpent: 32
  },

  // Plans d'oci per al planificador del Pas 3
  LEISURE_PLANS: [
    { id: 0, name: "Sopar de pizza amb la colla", icon: "🍕", cost: 14, desc: "Divendres a la nit rient a la pizzeria" },
    { id: 1, name: "Tarda de cinema + crispetes", icon: "🎬", cost: 12, desc: "Dia de l'espectador amb descompte jove" },
    { id: 2, name: "Berenar al parc i música a la gespa", icon: "🌳", cost: 6, desc: "Pla econòmic portant cadascú alguna cosa" },
    { id: 3, name: "Tarda de bitlles o Escape Room", icon: "🎳", cost: 22, desc: "Partida en grup i berenar" },
    { id: 4, name: "Entrada gran festival de música", icon: "🎪", cost: 75, desc: "Concert multitudinari de tot el dia" }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'EUFÒRIA AL XAT I EL COST OCULT D'UN CONCERT
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'eufòria al xat: «Tothom hi va!»");

    await ChatEngine.say("nil", "GENT!! Atureu el que estigueu fent ara mateix! Mireu aquest enllaç que us passo!");
    await ChatEngine.say("pau", "Ostres, és el festival de música de final de trimestre! El cartell és increïble!");
    await ChatEngine.say("nil", "S'han obert les entrades anticipades a <b>75 €</b>! Tothom de l'institut ja està comprant i queden poquíssimes! L'hem de comprar JA abans que s'esgotin en 15 minuts!");
    await ChatEngine.say("marta", "Espereu un segon... 75 €?? Més el tren d'anada i tornada i el sopar allà?");
    await ChatEngine.say("nil", "Va Marta, no siguis rata! Només es viu un cop! No voldreu quedar-vos a casa sols mirant les stories d'Instagram de tothom mentre nosaltres ballem!");
    await ChatEngine.say("marc", "Nil, tranquil·litza't. El Nil té un atac de **FOMO** (por a perdre's coses). Fem números abans de prémer comprar.");

    // Primera decisió interactiva
    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Tu només tens 40 € reservats per a oci aquest mes. Què fas davant de la pressió del Nil?</p>
      <button class="opt" data-opt="1">Callar, comprar l'entrada per vergonya i quedar-te sense un duro tot el mes</button>
      <button class="opt" data-opt="2">Inventar-te una excusa falsa («estic castigat») per no admetre motius econòmics</button>
      <button class="opt" data-opt="3">Calcular el cost total real i dir amb assertivitat si et quadra o no al pressupost</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;
        this.state.firstReaction = opt;

        if (opt === "3") {
          btn.classList.add("right");
          ChatEngine.triggerHaptic();
        } else {
          btn.classList.add("wrong");
          choiceCard.querySelector('[data-opt="3"]').classList.add("right");
        }

        await this.handleStep1Answer(opt);
      };
    });
  },

  async handleStep1Answer(opt) {
    if (opt === "3") {
      await ChatEngine.say("me", "Nil, para el carro. 75 € no és el que costa anar al festival. Anem a sumar el cost real sencer abans de decidir res.");
      await ChatEngine.say("aina", "Molt ben dit! El cost de l'entrada només és la punta de l'iceberg.");
    } else {
      ChatEngine.notifyMoneyChange(-115, "Pressió social: entrada i despeses d'oci no planificades!");
      await ChatEngine.say("me", "Buf, he comprat l'entrada per no quedar-me fora del grup i ara miro el compte i estic tremolant: com pagaré el transport o sortiré la resta del mes??");
      await ChatEngine.say("aina", "Sé exactament què sents. Fa uns mesos vaig anar a un sopar caríssim amb gent de la universitat només per por que pensessin que sóc una rata. Em vaig cremar 45 € que no tenia, vaig haver de menjar arròs blanc durant dues setmanes i em sentia fatal amb mi mateixa per no haver tingut el valor de dir que no.");
      await ChatEngine.say("marc", "I a mi em va passar una cosa pitjor: vaig calcular l'entrada al cèntim, però a la tornada va ploure, es va cancel·lar el tren i no tenia ni 10 € per al taxi de tornada... em vaig quedar tirat a l'estació a les 4 de la matinada!");
    }

    // Widget interactiu: Desglossador de despeses satèl·lit del concert
    const ticketCard = document.createElement("div");
    ticketCard.className = "ticket-breakdown-card";
    ticketCard.innerHTML = `
      <div class="ticket-header-strip">
        <div>
          <span class="ticket-tag-event">FESTIVAL JOVE 2026</span>
          <div style="font-weight:800; font-size:15px; margin-top:3px;">Entrada General Anticipada</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; color:var(--mut);">Preu anunciat</span>
          <div style="font-size:20px; font-weight:800; color:var(--gold);">75,00 €</div>
        </div>
      </div>

      <div style="font-size:12px; font-weight:700; color:var(--mut); margin-bottom:6px;">
        ➕ Els costos satèl·lit obligatoris que ningú et compta:
      </div>

      <div class="cost-satellite-item">
        <span>🎟️ Despeses de gestió de la ticketera online</span>
        <span style="font-weight:700; color:var(--warn);">+ 8,50 €</span>
      </div>

      <div class="cost-satellite-item">
        <span>🚆 Tren de rodalies o bus anada i tornada</span>
        <span style="font-weight:700; color:var(--warn);">+ 18,00 €</span>
      </div>

      <div class="cost-satellite-item">
        <span>🍔 Menjar dins del recinte (entrepà caríssim)</span>
        <span style="font-weight:700; color:var(--warn);">+ 14,00 €</span>
      </div>

      <div class="cost-satellite-item">
        <span>🥤 Aigua, got reutilitzable del festival i begudes</span>
        <span style="font-weight:700; color:var(--warn);">+ 12,00 €</span>
      </div>

      <div class="cost-satellite-item" style="opacity:0.6;">
        <span>👕 Samarreta oficial de record (opcional)</span>
        <span style="font-weight:700; color:var(--warn);">+ 25,00 €</span>
      </div>

      <div style="background:#18252e; border:1px solid var(--line); border-radius:12px; padding:12px; margin-top:12px; text-align:center;">
        <span style="font-size:11px; color:var(--mut); text-transform:uppercase;">Cost total real per anar al festival:</span>
        <div style="font-size:26px; font-weight:800; color:var(--warn); margin:4px 0;">152,50 €</div>
        <div style="font-size:12px; color:var(--ink);">
          L'entrada deia 75 €, però sortir de casa et costa <b>més del doble</b>!
        </div>
      </div>

      <button class="btn" id="btn-step1-next" style="width:100%; margin-top:14px;">
        Pas 2: Com dir que no sense quedar malament (Simulador) →
      </button>
    `;

    ChatEngine.embedCard(ticketCard);

    ticketCard.querySelector("#btn-step1-next").onclick = async () => {
      ticketCard.querySelector("#btn-step1-next").remove();

      await ChatEngine.say("nil", "UAU... 150 euros per una sola tarda?? Això és la meitat del que vaig guanyar en una setmana a l'estiu!");
      await ChatEngine.say("pau", "Veieu? La majoria de gent mira només el número de l'entrada i després a mig festival es troba que no té saldo ni per pagar-se l'aigua o el tren de tornada.");
      await ChatEngine.say("marta", "Ara ve la part més difícil: com li dius a la teva colla que aquest pla se't va de pressupost sense sentir vergonya ni que et titllin d'avorrit?");

      ChatEngine.embedMaxim("Una sortida mai costa només el preu de l'entrada. Calcula sempre el cost total (transport, menjar i gestió) abans de dir que sí.");

      await ChatEngine.wait(400);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: EL SIMULADOR DE NEGOCIACIÓ SOCIAL (FOMO VS ASSERTIVITAT)
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Negociació social: l'art de dir que no");

    await ChatEngine.say("aina", "Aquí és on molta gent de la nostra edat falla: tenen por de dir 'no puc' per vergonya, o s'empipen amb els amics. Però hi ha una tècnica que funciona sempre: **la resposta assertiva amb alternativa**.");
    await ChatEngine.say("marc", "Mireu el missatge que acaba d'escriure el Nil al grup pressionant tothom:");

    const simCard = document.createElement("div");
    simCard.className = "negotiation-sim-box";
    simCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-weight:800; font-size:13px; color:var(--teal);">💬 Xat de la Colla · La pressió del grup</span>
        <span class="contract-badge">Tria com contestar</span>
      </div>

      <div class="chat-prompt-bubble">
        <b style="color:var(--n-nil);">Nil:</b> «Va va va, responeu ràpid que he de comprar les entrades! Si algú no ve és un ranci i ens deixa tirats!»
      </div>

      <p class="note" style="margin:10px 0 6px;">Com respons al Nil per protegir el teu pressupost?</p>

      <!-- Opció A: Passiva -->
      <button type="button" class="opt" data-style="passive" style="margin-bottom:8px;">
        <span class="comm-style-tag passive">Estil Passiu / Vergonya</span>
        <div>«Val... m'ho demano a compte de Reis i demano diners als pares... vinc.»</div>
      </button>

      <!-- Opció B: Agressiva -->
      <button type="button" class="opt" data-style="aggressive" style="margin-bottom:8px;">
        <span class="comm-style-tag aggressive">Estil Agressiu / Defensiu</span>
        <div>«Sou uns pesats i uns pijos de merda! No tothom té la pasta dels vostres pares!»</div>
      </button>

      <!-- Opció C: Assertiva -->
      <button type="button" class="opt" data-style="assertive">
        <span class="comm-style-tag assertive">Estil Assertiu + Propositiu ⭐</span>
        <div>«Té una pinta brutal però 150 € se'm van molt de pressupost aquest mes. Aneu-hi i feu mil fotos! Però diumenge fem tarda de pizzes/pel·lis a casa o berenar al parc i m'hi tiro de cap.»</div>
      </button>

      <div id="negotiation-feedback" style="display:none; font-size:13px; padding:12px; border-radius:10px; margin-top:12px; line-height:1.5;"></div>

      <button class="btn" id="btn-step2-next" style="display:none; width:100%; margin-top:14px;">
        Pas 3: Crear el teu pressupost d'oci sense culpa →
      </button>
    `;

    ChatEngine.embedCard(simCard);

    simCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        simCard.querySelectorAll(".opt").forEach(b => b.classList.remove("sel"));
        btn.classList.add("sel");
        const style = btn.dataset.style;
        this.state.negotiationChoice = style;

        const feedBox = simCard.querySelector("#negotiation-feedback");
        const nextBtn = simCard.querySelector("#btn-step2-next");

        if (style === "assertive") {
          btn.classList.add("right");
          feedBox.style.display = "block";
          feedBox.style.background = "var(--ok2)";
          feedBox.style.border = "1px solid var(--ok)";
          feedBox.style.color = "var(--ok)";
          feedBox.innerHTML = `⭐ <b>RESPOSTA PERFECTA!</b> Dius la veritat amb calma, no ataques ningú, no et sents culpable i ofereixes una alternativa econòmica per seguir connectat amb els teus amics.`;
          ChatEngine.triggerHaptic();
        } else if (style === "passive") {
          btn.classList.add("wrong");
          feedBox.style.display = "block";
          feedBox.style.background = "var(--warn2)";
          feedBox.style.border = "1px solid var(--warn)";
          feedBox.style.color = "var(--warn)";
          feedBox.innerHTML = `⚠️ <b>PERILL:</b> Cedeixes a la pressió per por al què diran. Et quedes sense estalvis, crees un deute familiar i no aprens a posar límits als teus diners.`;
        } else {
          btn.classList.add("wrong");
          feedBox.style.display = "block";
          feedBox.style.background = "var(--warn2)";
          feedBox.style.border = "1px solid var(--warn)";
          feedBox.style.color = "var(--warn)";
          feedBox.innerHTML = `⚠️ <b>TENS I AGRESSIU:</b> Ataques els teus amics quan ells només estaven il·lusionats. Crearàs mal ambient al grup innecessàriament.`;
        }

        nextBtn.style.display = "flex";
      };
    });

    simCard.querySelector("#btn-step2-next").onclick = async () => {
      simCard.querySelector("#btn-step2-next").remove();

      await ChatEngine.say("marta", "Ostres, quina pau quan algú diu les coses clares! La veritat és que jo tampoc podia pagar 150 €, però em feia cosa ser l'única a dir que no!");
      await ChatEngine.say("nil", "De veritat? Perdona si he sigut pesat, nois! És que m'havia flipat amb el cartell. Sabeu què? El meu cosí toca la guitarra i dissabte toquen gratis a la plaça Major. Fem unes pizzes casolanes a casa meva, baixem a escoltar música i ens ho passarem genial sense cremar un euro!");
      await ChatEngine.say("pau", "Fixeu-vos en una cosa: **en gairebé tots els grups d'amics hi ha com a mínim dues o tres persones que van ofegades de pasta**, però ningú no gosava dir res fins que algú és valent i ho normalitza.");

      ChatEngine.embedMaxim("Tenir el control dels teus diners vol dir decidir tu en què els gastes, no deixar que la pressió dels altres decideixi per tu.");

      await ChatEngine.wait(400);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: EL PRESSUPOST D'OCI SENSE CULPA (PLANIFICADOR EN VIU)
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "El pressupost d'oci sense culpa");

    await ChatEngine.say("marc", "Estalviar no vol dir tancar-te a la teva habitació i no sortir mai més. Això és insostenible.");
    await ChatEngine.say("aina", "El secret és el que anomenem **la bossa d'oci sense culpa**: et fixes una quantitat mensual tancada (ex: 60 €) i te la gastes al 100% en gaudir sense haver de sentir remordiments.");
    await ChatEngine.say("pau", "Proveu amb aquest planificador: tens 60 € de pressupost per al mes. Tria quins plans fas:");

    // Widget interactiu: Planificador de la bossa d'oci
    const plannerCard = document.createElement("div");
    plannerCard.className = "leisure-planner-box";
    plannerCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:14px;">🎯 Planificador del teu Mes d'Oci</span>
        <span style="font-size:12px; color:var(--mut);">Límit: <b>60,00 €</b></span>
      </div>

      <div class="leisure-meter-bar">
        <div class="leisure-meter-fill normal" id="meter-fill" style="width:53%;"></div>
      </div>

      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:12px;">
        <span>Despesa prevista: <b id="spent-text" style="color:var(--teal);">32,00 €</b></span>
        <span>Marge disponible: <b id="left-text" style="color:var(--ink);">28,00 €</b></span>
      </div>

      <p class="note">Fes clic als plans que vols fer aquest mes:</p>

      <div id="plans-list">
        ${this.LEISURE_PLANS.map(p => `
          <div class="plan-item-toggle ${this.state.selectedPlans.includes(p.id) ? "active" : ""}" data-id="${p.id}">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:20px;">${p.icon}</span>
              <div>
                <div style="font-weight:700;">${p.name}</div>
                <div style="font-size:11px; color:var(--mut);">${p.desc}</div>
              </div>
            </div>
            <div style="font-weight:800; font-size:13px; color:var(--gold);">
              ${p.cost.toFixed(2)} €
            </div>
          </div>
        `).join("")}
      </div>

      <div id="planner-status-note" style="margin-top:12px; padding:10px; border-radius:10px; font-size:12px; line-height:1.45; background:var(--bub); border:1px solid var(--line);">
        🟢 <b>Dins del teu pressupost:</b> Gaudeixes de plans variats amb la colla sense posar en perill els teus estalvis.
      </div>

      <button class="btn gold" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: El decàleg de la colla i el teu repte real →
      </button>
    `;

    ChatEngine.embedCard(plannerCard);

    const updatePlannerUI = () => {
      let sum = 0;
      this.state.selectedPlans.forEach(id => {
        const p = this.LEISURE_PLANS.find(it => it.id === id);
        if (p) sum += p.cost;
      });

      this.state.totalSpent = sum;
      const budget = this.state.monthlyBudget;
      const pct = Math.min((sum / budget) * 100, 100);
      const left = budget - sum;

      const fillEl = plannerCard.querySelector("#meter-fill");
      const spentEl = plannerCard.querySelector("#spent-text");
      const leftEl = plannerCard.querySelector("#left-text");
      const noteEl = plannerCard.querySelector("#planner-status-note");

      fillEl.style.width = `${pct}%`;
      spentEl.textContent = `${sum.toFixed(2)} €`;

      if (sum <= budget) {
        fillEl.className = "leisure-meter-fill normal";
        spentEl.style.color = "var(--teal)";
        leftEl.textContent = `${left.toFixed(2)} €`;
        leftEl.style.color = "var(--ink)";
        noteEl.innerHTML = `🟢 <b>Dins de pressupost:</b> Tens marge de sobres. Gaudeixes de les sortides amb tranquil·litat mental total.`;
        noteEl.style.borderColor = "var(--line)";
      } else {
        fillEl.className = "leisure-meter-fill danger";
        spentEl.style.color = "var(--warn)";
        leftEl.textContent = `− ${Math.abs(left).toFixed(2)} € (Superat!)`;
        leftEl.style.color = "var(--warn)";
        noteEl.innerHTML = `🔴 <b>T'HAS PASSAT DE PRESSUPOST:</b> Has superat el teu límit en ${Math.abs(left).toFixed(2)} €. Si fas aquest pla, t'hauràs de menjar el teu coixí d'estalvi o demanar un préstec.`;
        noteEl.style.borderColor = "var(--warn)";
      }
    };

    plannerCard.querySelectorAll(".plan-item-toggle").forEach(el => {
      el.onclick = () => {
        const id = Number(el.dataset.id);
        const idx = this.state.selectedPlans.indexOf(id);
        if (idx >= 0) {
          this.state.selectedPlans.splice(idx, 1);
          el.classList.remove("active");
        } else {
          this.state.selectedPlans.push(id);
          el.classList.add("active");
        }
        ChatEngine.triggerHaptic();
        updatePlannerUI();
      };
    });

    plannerCard.querySelector("#btn-step3-next").onclick = async () => {
      plannerCard.querySelector("#btn-step3-next").remove();

      await ChatEngine.say("nil", "Ara ho veig claríssim: si no hagués agafat el concert gegant, em donava per fer 3 pizzes, anar 2 cops al cine i berenar al parc tot el mes!");
      await ChatEngine.say("marc", "Aquest és el poder de planificar per avançat: no vius amb culpa ni angoixa perquè saps exactament quant pots gastar.");

      await ChatEngine.wait(400);
      this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: EL DECÀLEG DE LA COLLA I EL TEU REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Decàleg de la colla i el teu repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">🏆</span>
        <h3 style="margin:0; font-size:16px;">Els 3 manaments per sortir amb amics sense arruïnar-te</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. La regla del «No + Alternativa»:</b><br>
          <span style="color:var(--ink);">Quan un pla se't vagi de pressupost, no t'amaguis ni t'inventis excuses: digues amb naturalitat que no et quadra aquest mes i proposa de seguida una alternativa més accessible.</span>
        </div>

        <div style="margin-bottom:10px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. Mai demanis diners prestats per a oci:</b><br>
          <span style="color:var(--ink);">Endeutar-te o demanar diners als pares per anar a un concert o una festa és el pitjor hàbit financer. Si no tens els diners estalviats, no és el moment d'aquest pla.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Bossa d'oci tancada i sense culpa:</b><br>
          <span style="color:var(--ink);">Defineix quina xifra et pots permetre gastar en oci cada mes. Si està dins de la teva bossa d'oci, gaudeix-ne sense cap remordiment.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        Tenir el control dels teus diners vol dir decidir tu en què els gastes, no deixar que la pressió dels altres decideixi per tu.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Abans de sortir aquest proper cap de setmana amb la colla, fes aquesta acció senzilla:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li><b>Fixa un import màxim per endavant:</b> Decideix exactament quina xifra màxima estàs disposat a gastar (ex: 15 € o 20 €) abans de posar un peu fora de casa.</li>
          <li><b>No superis el límit:</b> Si el pla puja de to o proposen despeses extra, aplica la regla del «No + Alternativa».</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap5" style="width:100%; margin-top:16px;">
        Completar Capítol 5 i consolidar el meu pressupost 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap5").onclick = () => {
      recapCard.querySelector("#btn-finish-cap5").disabled = true;

      // Desem dades del capítol
      AppState.saveChapterData(5, "negotiationChoice", this.state.negotiationChoice);
      AppState.saveChapterData(5, "totalSpent", this.state.totalSpent);

      // Completar capítol 5
      AppState.completeChapter(5, 0, null);

      ChatEngine.celebrate(
        "Capítol 5 completat amb èxit!",
        "Ja saps gestionar la pressió de grup (FOMO), dir que no amb assertivitat i planificar sortides sense arruïnar-te.",
        0,
        6,
        () => {
          alert("Fantàstic! El Capítol 6 («Em volen vendre el mòbil a terminis: Finançament al consum, TIN i TAE») s'activarà aviat!");
          window.location.hash = "#dashboard";
        }
      );
    };
  }
};
