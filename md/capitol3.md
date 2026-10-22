/**
 * CAPITOL3.JS - Guió i lògica interactiva del Capítol 3: "M'arriba un bizum d'un desconegut"
 */

const Capitol3 = {
  id: 3,
  title: "Capítol 3 · M'arriba un bizum d'un desconegut",
  totalSteps: 4,

  state: {
    firstReaction: null,
    bizumAction: null,
    detectedFlags: 0,
    radarScore: 0
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: L'INCIDENT DEL BIZUM I LA PRESSIÓ PSICOLÒGICA
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "L'incident: 50 € i un missatge angoixat");

    await ChatEngine.say("nil", "Grup, ajudeu-me ràpid!! M'acaba de passar una cosa super estranya i no sé què fer!");
    await ChatEngine.say("marta", "Què ha passat, Nil? Estàs bé?");
    await ChatEngine.say("nil", "M'acaba de sonar el mòbil amb una notificació de <b>Bizum de 50 €</b> d'un tal Jordi R. que no conec de res.");
    await ChatEngine.say("nil", "I a l'acte m'ha arribat un WhatsApp d'un número desconegut desesperat dient: <i>«Hola! Perdona, m'he equivocat de número enviant 50 € a la meva mare per a una urgència a la farmàcia! Si us plau, retorna-me'ls immediatament per Bizum que no té medicaments!!»</i>");
    await ChatEngine.say("nil", "Pobre home, se'l veu angoixat. Li torno els 50 € ara mateix, oi? No vull quedar-me diners que no són meus.");
    await ChatEngine.say("aina", "PARAAAA! Frena en sec, Nil!!");
    await ChatEngine.say("marc", "No toquis cap botó encara. Hi ha un parany molt típic aquí.");

    // Primera decisió interactiva
    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Què hauria de fer el Nil ara mateix davant d'aquest missatge?</p>
      <button class="opt" data-opt="1">Retornar els 50 € per Bizum ràpidament per bona fe</button>
      <button class="opt" data-opt="2">Aturar-se, no respondre al WhatsApp i verificar el tipus d'operació i saldo a l'app del banc</button>
      <button class="opt" data-opt="3">Bloquejar el número i anar-se'n a gastar els 50 € amb la colla</button>
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
    if (opt === "2") {
      await ChatEngine.say("me", "Nil, tranquil! Obre l'app del teu banc i mira bé la notificació. Mai prenguis decisions de diners amb pressa.");
      await ChatEngine.say("aina", "Exacte! La urgència és l'arma número 1 dels estafadors perquè actuïs amb el cor i sense pensar.");
    } else {
      await ChatEngine.say("me", "Compte Nil! Si fas un Bizum a cegues pots ser tu qui perdi la pasta.");
      await ChatEngine.say("marc", "Totalment d'acord. Anem a mirar la pantalla del mòbil del Nil perquè vegeu el parany.");
    }

    // Widget interactiu: Pantalla de mòbil amb el Bizum Invers
    const phoneSim = document.createElement("div");
    phoneSim.className = "phone-mockup";
    phoneSim.innerHTML = `
      <div class="phone-status-bar">
        <span>10:42</span>
        <span>📶 5G · 84% 🔋</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="bizum-header-badge">📱 BIZUM</span>
        <span style="font-size:11px; color:var(--mut);">Notificació oficial</span>
      </div>

      <div class="bizum-card-alert danger-flash" id="bizum-notif-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px;">Jordi R. (+34 612 849 201)</span>
          <span class="bizum-op-tag req" id="op-badge">SOL·LICITUD DE DINERS</span>
        </div>
        <div style="font-size:14px; margin:8px 0; color:var(--ink);">
          «Jordi R. et <b>sol·licita</b> 50,00 €»
        </div>
        <div style="font-size:12px; color:var(--mut); font-style:italic;">
          Concepte: «Error farmacia hermana»
        </div>

        <div style="margin-top:10px; font-size:12px; background:#1b2830; padding:8px; border-radius:8px; border:1px solid #283e4d;">
          ⚠️ <b>Fixa't en el verb:</b> Aquesta pantalla NO és un ingrés. Si prems «Acceptar», sortirant 50 € del <b>TEU</b> compte cap al d'ell.
        </div>

        <div class="bizum-btn-actions">
          <button type="button" class="btn-bizum-reject" id="btn-bizum-reject">
            ✕ Rebutjar sol·licitud
          </button>
          <button type="button" class="btn-bizum-accept" id="btn-bizum-accept">
            ✓ Acceptar pagament
          </button>
        </div>
      </div>

      <div id="bizum-action-result" style="display:none; font-size:13px; padding:10px; border-radius:10px; margin-top:10px;"></div>

      <button class="btn" id="btn-step1-next" style="display:none; width:100%; margin-top:14px;">
        Pas 2: L'estafa a Wallapop i Vinted →
      </button>
    `;

    ChatEngine.embedCard(phoneSim);

    const resBox = phoneSim.querySelector("#bizum-action-result");
    const nextBtn = phoneSim.querySelector("#btn-step1-next");

    phoneSim.querySelector("#btn-bizum-reject").onclick = () => {
      phoneSim.querySelector("#btn-bizum-reject").disabled = true;
      phoneSim.querySelector("#btn-bizum-accept").disabled = true;
      this.state.bizumAction = "rejected";

      resBox.style.display = "block";
      resBox.style.background = "var(--ok2)";
      resBox.style.color = "var(--ok)";
      resBox.style.border = "1px solid var(--ok)";
      resBox.innerHTML = `🛡️ <b>Molt ben fet! Sol·licitud rebutjada.</b> Has impedit que et robessin 50 €. El teu saldo es manté intacte.`;

      ChatEngine.triggerHaptic();
      nextBtn.style.display = "flex";
    };

    phoneSim.querySelector("#btn-bizum-accept").onclick = () => {
      phoneSim.querySelector("#btn-bizum-reject").disabled = true;
      phoneSim.querySelector("#btn-bizum-accept").disabled = true;
      this.state.bizumAction = "accepted";

      ChatEngine.notifyMoneyChange(-50, "Bizum invers acceptat per error: 50 € robats a l'acte!");

      resBox.style.display = "block";
      resBox.style.background = "var(--warn2)";
      resBox.style.color = "var(--warn)";
      resBox.style.border = "1.5px solid var(--warn)";
      resBox.innerHTML = `💸 <b>TRAMPA PICADA!</b> Acabes d'enviar 50 € dels teus estalvis a l'estafador. Els Bizums són instantanis i irreversibles: recuperar-los és gairebé impossible.`;

      nextBtn.style.display = "flex";
    };

    nextBtn.onclick = async () => {
      nextBtn.remove();
      if (this.state.bizumAction === "accepted") {
        await ChatEngine.say("nil", "NOOOOO!! Acabo de mirar l'app del banc i els 50 € han volat a l'acte!! Em tremolen les cames, quina ràbia i quina impotència... M'he quedat sense un duro per al cap de setmana!!");
        await ChatEngine.say("pau", "Tranquil Nil... no ets l'únic. A mi em van clavar 80 € a Wallapop exactament igual: et fiquen pressa, t'angoixen i prems el botó sense pensar. Vaig haver de demanar pasta als meus pares per pagar el tren i em feia una vergonya infinita.");
        await ChatEngine.say("marta", "I jo la setmana passada gairebé pico amb un SMS que deia «El teu paquet de Correus té 1,15 € pendents d'entrega». L'Aina em va veure a punt de posar la targeta i em va prendre el mòbil de les mans!");
      } else {
        await ChatEngine.say("nil", "UFFF, quin pes de sobre! Per un segon gairebé premo acceptar per bona fe!");
        await ChatEngine.say("pau", "T'has salvat pels pèls. A mi l'any passat em van clavar 80 € a Wallapop per no parar-me a mirar el botó.");
        await ChatEngine.say("marta", "Tots tenim moments de despist; l'enginyeria social busca precisament enxampar-te amb la guàrdia baixa.");
      }
      await ChatEngine.say("marc", "Això es diu el <b>Bizum invers</b>. Aprofiten que la gent llegeix ràpid «Bizum 50 €» i es pensa que ha rebut diners. Si acceptes, li transfereixes tu els diners a ell!");
      await ChatEngine.say("aina", "I la història de la farmàcia i la mare és pura manipulació: et creen angoixa perquè no et paris a llegir la paraula «Sol·licitud».");

      ChatEngine.embedMaxim("Davant de qualsevol missatge inesperat amb diners, stop: respira, obre l'app oficial del teu banc i verifica el saldo. Ningú et regala res.");

      await ChatEngine.wait(400);
      this.step2();
    };
  },

  /* ==========================================================================
     PAS 2: LA VENDA A WALLAPOP I EL FRAU DEL CVV
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "Wallapop, Vinted i la trampa del CVV");

    await ChatEngine.say("marta", "El Bizum invers no és l'única estafa de moda. Si veneu roba o coses a Wallapop o Vinted, us trobareu una altra trampa molt pitjor.");
    await ChatEngine.say("pau", "Uf, a mi em va passar l'altre dia. Vaig posar unes vambes a la venda per 45 € i al cap de 3 minuts ja tenia un missatge.");

    // Widget interactiu: Simulador de Wallapop amb les 3 banderes vermelles
    const wallapopCard = document.createElement("div");
    wallapopCard.className = "wallapop-sim-box";
    wallapopCard.innerHTML = `
      <div class="wallapop-header">
        <span class="wallapop-logo-badge">W</span>
        <span style="font-weight:800; font-size:13px;">Xat de Wallapop · Dessuadora de marca (40 €)</span>
      </div>

      <p class="note">L'estafador t'ha enviat aquest missatge. Troba les <b>3 Banderes Vermelles (Red Flags)</b> prement a sobre:</p>

      <div class="red-flag-item" id="flag-1">
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
          <span>🚩 1. «Hola! M'interessa moltíssim, però escriu-me al WhatsApp: 633 49 12 XX»</span>
          <span style="font-size:12px; color:var(--warn);" class="flag-status">Descobrir perill</span>
        </div>
        <div class="flag-explain">
          <b>Sortir de l'aplicació oficial:</b> Mai continuïs una venda per WhatsApp. Si surts de Wallapop o Vinted perds tota la protecció del comprador/venedor i ells poden enganyar-te sense que l'app els bloquegi.
        </div>
      </div>

      <div class="red-flag-item" id="flag-2">
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
          <span>🚩 2. T'arriba un enllaç: «pagos-seguros-wallapop-online.xyz/cobrar»</span>
          <span style="font-size:12px; color:var(--warn);" class="flag-status">Descobrir perill</span>
        </div>
        <div class="flag-explain">
          <b>Web falsa (Phishing):</b> L'adreça no és oficial (acaba en .xyz o paraules rares). És una pàgina clonada creada per robar-te les dades de la targeta.
        </div>
      </div>

      <div class="red-flag-item" id="flag-3">
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
          <span>🚩 3. A la web et demanen el número de targeta, caducitat i el CODI CVV</span>
          <span style="font-size:12px; color:var(--warn);" class="flag-status">Descobrir perill</span>
        </div>
        <div class="flag-explain">
          <b>EL GRAN PARANY:</b> Per rebre diners NUNCA has de posar el CVV (els 3 dígits del darrere) ni claus de signatura! El CVV només serveix per AUTORITZAR PAGAMENTS. Si el dones, et buidaran el compte.
        </div>
      </div>

      <div id="flag-counter-box" style="margin-top:12px; font-size:13px; text-align:center; color:var(--mut);">
        Banderes descobertes: <b id="flags-found" style="color:var(--teal)">0 / 3</b>
      </div>

      <button class="btn" id="btn-flags-done" style="display:none; width:100%; margin-top:14px;">
        Pas 3: Laboratori Anti-Frau: Posa't a prova →
      </button>
    `;

    ChatEngine.embedCard(wallapopCard);

    let found = 0;
    const nextStepBtn = wallapopCard.querySelector("#btn-flags-done");
    const countEl = wallapopCard.querySelector("#flags-found");

    [1, 2, 3].forEach(id => {
      const el = wallapopCard.querySelector(`#flag-${id}`);
      el.onclick = () => {
        if (!el.classList.contains("detected")) {
          el.classList.add("detected");
          el.querySelector(".flag-status").textContent = "✓ Detectada!";
          found++;
          countEl.textContent = `${found} / 3`;
          ChatEngine.triggerHaptic();

          if (found === 3) {
            nextStepBtn.style.display = "flex";
            this.state.detectedFlags = 3;
          }
        }
      };
    });

    nextStepBtn.onclick = async () => {
      nextStepBtn.remove();
      await ChatEngine.say("marc", "Recordeu aquesta norma per a tota la vida: <b>per rebre diners, ningú necessita el teu CVV ni la clau de la targeta</b>.");
      await ChatEngine.say("aina", "Exacte. Perquè t'ingressin diners només necessiten el teu número de telèfon (per a Bizum) o el teu número de compte IBAN. Tot el que demani targeta o contrasenyes és estafa.");

      ChatEngine.embedMaxim("Per cobrar diners mai has de donar el CVV de la targeta ni la contrasenya del banc. Si et demanen aquestes dades per pagar-te, és 100% una estafa.");

      await ChatEngine.wait(400);
      this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: EL RADAR ANTI-FRAU (POSA'T A PROVA)
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "Radar Anti-Frau: 4 casos reals");

    await ChatEngine.say("pau", "Els estafadors canvien de truc cada setmana: SMS de paqueteria, trucades del banc, xarxes socials... Anem a posar-vos a prova amb 4 casos que ens han passat a nosaltres:");

    const radarCases = [
      {
        channel: "📩 SMS de Correus / Paqueteria",
        msg: "«El seu paquet té un retard a la duana per falta de pagament de 1,79 €. Accedeixi aquí per alliberar-lo: http://correos-entrega-track.info»",
        isScam: true,
        explain: "<b>ESTAFA TOTAL (Smishing):</b> Correus mai et demana pagar duanes d'1 o 2 euros amb enllaços estranys. Si hi entres, et roben la targeta."
      },
      {
        channel: "📱 Bizum d'un familiar conegut",
        msg: "Notificació de l'app oficial: «Has rebut 20,00 € de la teva Mare. Concepte: Setmanada farmàcia». Entres a l'app i el saldo real ha pujat 20 €.",
        isScam: false,
        explain: "<b>LEGÍTIM:</b> L'operació és un ingrés (no sol·licitud), el contacte és conegut i el saldo a l'app oficial ha augmentat de debò."
      },
      {
        channel: "📞 Trucada telefònica del teu banc",
        msg: "«Hola, som del departament de seguretat del seu banc. Hi ha un intent de compra fraudulenta de 350 €. Li acabem d'enviar un SMS amb un codi de 6 dígits, digui-me'l per telèfon per cancel·lar l'operació».",
        isScam: true,
        explain: "<b>ESTAFA ULTRA PERILLOSA (Vishing):</b> Mai donis per telèfon un codi que t'arriba per SMS. El banc MAI te'l demanarà. Aquest codi és per AUTORITZAR el pagament que l'estafador està intentant fer!"
      },
      {
        channel: "📸 Missatge directe d'Instagram d'un amic",
        msg: "«Ei bro! M'he quedat bloquejat fora del meu compte d'Instagram. Puc posar el teu número perquè et mani un codi i me'l passes? Si us plau!»",
        isScam: true,
        explain: "<b>ROBATORI DE COMPTE:</b> Han hackejat el compte del teu amic i el codi que t'enviaran és per robar-te el TEU propi compte d'Instagram o WhatsApp."
      }
    ];

    let currentIdx = 0;
    const radarCard = document.createElement("div");
    radarCard.className = "chat-embed-card";

    const renderRadarCase = (idx) => {
      const c = radarCases[idx];
      radarCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; font-weight:800; color:var(--teal); text-transform:uppercase;">Cas ${idx + 1} de 4</span>
          <span style="font-size:12px; color:var(--mut);">Encerts: <b id="score-counter" style="color:var(--ok);">${this.state.radarScore}</b></span>
        </div>

        <div class="radar-item" id="radar-case-box">
          <div style="font-size:12px; font-weight:700; color:var(--mut); margin-bottom:4px;">${c.channel}</div>
          <div style="font-size:13px; line-height:1.5; color:var(--ink); font-style:italic; background:#12181d; padding:10px; border-radius:8px; border:1px solid var(--line);">
            ${c.msg}
          </div>
        </div>

        <p class="q" style="font-size:14px; margin:12px 0 8px;">Com reacciones davant d'aquest missatge?</p>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <button type="button" class="btn" style="background:#2a191d; border:1.5px solid var(--warn); color:var(--warn);" id="btn-is-scam">
            🚨 És una Estafa!
          </button>
          <button type="button" class="btn" style="background:#132822; border:1.5px solid var(--ok); color:var(--ok);" id="btn-is-legit">
            🛡️ És Legítim
          </button>
        </div>

        <div id="radar-feedback" style="display:none; font-size:13px; padding:12px; border-radius:10px; margin-top:12px; line-height:1.5;"></div>

        <button class="btn" id="btn-radar-next" style="display:none; width:100%; margin-top:12px;">
          ${idx < radarCases.length - 1 ? "Següent cas del radar →" : "Anar als consells i blindatge final →"}
        </button>
      `;

      const feedBox = radarCard.querySelector("#radar-feedback");
      const nextBtn = radarCard.querySelector("#btn-radar-next");
      const btnScam = radarCard.querySelector("#btn-is-scam");
      const btnLegit = radarCard.querySelector("#btn-is-legit");

      const handleChoice = (userSaidScam) => {
        btnScam.disabled = true;
        btnLegit.disabled = true;
        const isRight = (userSaidScam === c.isScam);

        if (isRight) {
          this.state.radarScore++;
          feedBox.style.display = "block";
          feedBox.style.background = "var(--ok2)";
          feedBox.style.border = "1px solid var(--ok)";
          feedBox.style.color = "var(--ok)";
          feedBox.innerHTML = `✓ <b>MOLT BEN VIST!</b> ${c.explain}`;
          ChatEngine.triggerHaptic();
        } else {
          feedBox.style.display = "block";
          feedBox.style.background = "var(--warn2)";
          feedBox.style.border = "1.5px solid var(--warn)";
          feedBox.style.color = "var(--warn)";
          feedBox.innerHTML = `✗ <b>ALERTA!</b> ${c.explain}`;
          ChatEngine.notifyMoneyChange(-25, "Engany digital comès: càrrec no autoritzat!");
        }

        radarCard.querySelector("#score-counter").textContent = this.state.radarScore;
        nextBtn.style.display = "flex";

        nextBtn.onclick = () => {
          currentIdx++;
          if (currentIdx < radarCases.length) {
            renderRadarCase(currentIdx);
          } else {
            radarCard.remove();
            this.step4();
          }
        };
      };

      btnScam.onclick = () => handleChoice(true);
      btnLegit.onclick = () => handleChoice(false);
    };

    ChatEngine.embedCard(radarCard);
    renderRadarCase(0);
  },

  /* ==========================================================================
     PAS 4: PROTOCOL D'EMERGÈNCIA, EL TEU REPTE REAL I FINALITZACIÓ
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Blindatge i protocol d'emergència");

    await ChatEngine.say("nil", "Uf, no tenia ni idea de quantes trampes hi ha... I si algun dia me'n despisto i pico?");
    await ChatEngine.say("aina", "Si piques o sospites que has donat dades a una web falsa, cada minut compta. Aquest és el protocol d'emergència que has de seguir:");

    const emergencyCard = document.createElement("div");
    emergencyCard.className = "chat-embed-card";
    emergencyCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:22px;">🚨</span>
        <h3 style="margin:0; font-size:16px;">Protocol d'emergència si has picat</h3>
      </div>

      <div class="protocol-step">
        <div class="protocol-num">1</div>
        <div>
          <b>Apaga la targeta a l'app immediatament:</b><br>
          <span style="color:var(--mut);">Entra a l'app del banc i prem el botó «Bloquejar targeta» o «Apagar». Trigaràs 5 segons i evitaràs que et cobrin res més.</span>
        </div>
      </div>

      <div class="protocol-step">
        <div class="protocol-num">2</div>
        <div>
          <b>Truca al telèfon d'atenció al client 24h del teu banc:</b><br>
          <span style="color:var(--mut);">Explica que has sigut víctima d'un frau. Solen tenir protocols per cancel·lar operacions recents.</span>
        </div>
      </div>

      <div class="protocol-step">
        <div class="protocol-num">3</div>
        <div>
          <b>Guarda captures i fes denúncia:</b><br>
          <span style="color:var(--mut);">Fes captura dels missatges, telèfons i enllaços. Vés a una comissaria dels Mossos d'Esquadra a denunciar; el banc et demanarà la denúncia per retornar-te els diners.</span>
        </div>
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--bub); border:1px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--teal);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquestes dues accions ara mateix al teu mòbil:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li><b>Localitza el botó d'apagar targeta:</b> Obre l'app del teu banc i mira on és la funció per congelar o apagar la targeta en cas de pèrdua o robatori.</li>
          <li><b>Posa un límit baix a Bizum:</b> Configura el límit diari de Bizum a 50 € o 100 €. Així, si mai passa res, mai et podran prendre tots els teus estalvis d'un cop.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap3" style="width:100%; margin-top:16px;">
        Completar Capítol 3 i blindar el meu compte 🏆
      </button>
    `;

    ChatEngine.embedCard(emergencyCard);

    emergencyCard.querySelector("#btn-finish-cap3").onclick = () => {
      emergencyCard.querySelector("#btn-finish-cap3").disabled = true;

      // Desem decisions
      AppState.saveChapterData(3, "radarScore", this.state.radarScore);

      // Completar capítol 3
      AppState.completeChapter(3, 0, null);

      ChatEngine.celebrate(
        "Capítol 3 completat amb èxit!",
        "Ja saps com funciona el Bizum invers, les estafes a Wallapop i per què mai has de donar el teu CVV ni claus bancàries.",
        0,
        4,
        () => {
          alert("Has completat tot el BLOC 1 («Els primers diners i blindar-se») amb èxit! El Bloc 2 s'activarà en la propera actualització.");
          window.location.hash = "#dashboard";
        }
      );
    };
  }
};
