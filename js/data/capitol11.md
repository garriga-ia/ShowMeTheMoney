/**
 * CAPITOL11.JS - Guió i lògica interactiva del Capítol 11: "La Renda sense por"
 */

const Capitol11 = {
  id: 11,
  title: "Capítol 11 · La Renda sense por",
  totalSteps: 4,

  state: {
    firstReaction: null,
    answers: {
      singlePayerOver22k: false,
      twoPayersSecondOver1500: false,
      hadWithholdings: true
    },
    simRetentions: 52
  },

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: EL PÀNIC D'ABRIL I LA CARTA D'HISENDA
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "El pànic d'abril: la campanya de la Renda");

    await ChatEngine.say("nil", "Nois... estic hiperventilant. M'acaba d'arribar una notificació al mòbil que diu que ha començat la Campanya de la Renda de l'Agència Tributària.");
    await ChatEngine.say("marta", "Calma Nil, la declaració de la renda és cada any entre abril i juny per a tothom.");
    await ChatEngine.say("nil", "Però és que l'any passat vaig treballar dues setmanes de cambrer al juliol i tres setmanes de monitor a l'agost! I un cosí meu m'ha dit que si has tingut **dos pagadors** és delicte fiscal si no declares!");
    await ChatEngine.say("nil", "Aniré a la presó per 500 € que vaig guanyar a l'estiu??");
    await ChatEngine.say("pau", "Mare meva Nil, quines pel·lícules et muntes! Ningú va a la presó per treballar d'estudiant.");
    await ChatEngine.say("aina", "Totalment! De fet, al 90% dels joves que han treballat a l'estiu els passa exactament el contrari:");
    await ChatEngine.say("aina", "**Hisenda us deu diners a vosaltres!** Però molts no els reclamen per por o per mandra.");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Per què a molts joves amb feines d'estiu els convé mirar l'esborrany de la Renda?</p>
      <button class="opt" data-opt="1">Perquè si van tenir retencions d'IRPF a la nòmina i van guanyar pocs diners, Hisenda els retorna el 100% d'aquestes retencions</button>
      <button class="opt" data-opt="2">Perquè et regalen punts per a la Play Store si entres a l'app</button>
      <button class="opt" data-opt="3">No val la pena mai; és millor amagar-se i no dir res a Hisenda</button>
    `;

    ChatEngine.embedCard(choiceCard);

    choiceCard.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = async () => {
        choiceCard.querySelectorAll(".opt").forEach(b => b.disabled = true);
        const opt = btn.dataset.opt;
        this.state.firstReaction = opt;

        if (opt === "1") {
          btn.classList.add("right");
          ChatEngine.triggerHaptic();
        } else {
          btn.classList.add("wrong");
          choiceCard.querySelector('[data-opt="1"]').classList.add("right");
        }

        await this.handleStep1Answer(opt);
      };
    });
  },

  async handleStep1Answer(opt) {
    if (opt === "1") {
      await ChatEngine.say("me", "Exacte! Si et van retenir el 2% a la nòmina però en tot l'any no vas arribar al mínim legal, aquests diners són teus i te'ls tornen!");
      await ChatEngine.say("marc", "I tant! Però primer hem de saber si tens obligació legal o no. Fem l'arbre de preguntes oficial:");
    } else {
      await ChatEngine.say("me", "Amagar-se no serveix de res perquè Hisenda ja té les teves dades. El truc és saber si estàs obligat i si et surt a retornar.");
      await ChatEngine.say("marc", "Exacte. Passem pel filtre de les regles oficials:");
    }

    await ChatEngine.say("marta", "Sabeu què? Jo us he de confessar una vergonya: l'any passat em va arribar un sobre blanc amb el logo de l'Agència Tributària i em va agafar un atac d'angoixa tan bèstia que el vaig amagar sota el matalàs durant dos mesos sense obrir-lo per por d'haver fet alguna cosa il·legal!");
    await ChatEngine.say("nil", "Marta, seràs bleda!! Amagar cartes oficials sota el matalàs com si fossis una fugitiva?? Vine cap aquí, agafem el mòbil i mirem-ho junts ara mateix!");

    await this.step2();
  },

  /* ==========================================================================
     PAS 2: L'ARBRE DE DECISIÓ: «ESTÀS OBLIGAT A DECLARAR?»
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "L'arbre de decisió: t'obliga la llei?");

    const wizardCard = document.createElement("div");
    wizardCard.className = "tax-wizard-box";
    wizardCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        ⚖️ Arbre de decisió de la Renda: El teu cas particular
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Respon aquestes 2 preguntes per conèixer la teva obligació segons la normativa de l'IRPF:
      </p>

      <div style="background:var(--bub); padding:10px 12px; border-radius:10px; margin-bottom:10px; border:1px solid var(--line);">
        <p style="font-size:12px; margin:0 0 6px; font-weight:700;">1. Has guanyat més de 22.000 € bruts en tot l'any d'una sola empresa?</p>
        <div style="display:flex; gap:10px;">
          <button type="button" class="opt" id="q1-no" style="margin:0; text-align:center; padding:6px 12px; font-size:12px;">No (estudiants/feines curtes)</button>
          <button type="button" class="opt" id="q1-yes" style="margin:0; text-align:center; padding:6px 12px; font-size:12px;">Sí (sou adult a jornada completa)</button>
        </div>
      </div>

      <div id="q2-container" style="background:var(--bub); padding:10px 12px; border-radius:10px; margin-bottom:10px; border:1px solid var(--line);">
        <p style="font-size:12px; margin:0 0 6px; font-weight:700;">2. Has tingut 2 o més pagadors i has cobrat més de 1.500 € del segon pagador?</p>
        <div style="display:flex; gap:10px;">
          <button type="button" class="opt" id="q2-no" style="margin:0; text-align:center; padding:6px 12px; font-size:12px;">No (o menys de 1.500 € del segon)</button>
          <button type="button" class="opt" id="q2-yes" style="margin:0; text-align:center; padding:6px 12px; font-size:12px;">Sí (més de 1.500 € del segon)</button>
        </div>
      </div>

      <!-- Veredicte -->
      <div id="tax-verdict-box" style="padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line); font-size:12px; line-height:1.5;">
        <!-- Text del veredicte -->
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;">
        Pas 3: Simulador d'esborrany (Mira quants diners et tornen) →
      </button>
    `;

    ChatEngine.embedCard(wizardCard);

    const q1No = wizardCard.querySelector("#q1-no");
    const q1Yes = wizardCard.querySelector("#q1-yes");
    const q2No = wizardCard.querySelector("#q2-no");
    const q2Yes = wizardCard.querySelector("#q2-yes");
    const verdictBox = wizardCard.querySelector("#tax-verdict-box");

    let isQ1Yes = false;
    let isQ2Yes = false;

    const renderVerdict = () => {
      if (isQ1Yes) {
        verdictBox.innerHTML = `
          <b style="color:var(--warn); font-size:13px;">🚨 OBLIGAT A DECLARAR</b><br>
          Com que superes els 22.000 € anuals, estàs obligat per llei a presentar la declaració de la renda abans del 30 de juny.
        `;
      } else if (isQ2Yes) {
        verdictBox.innerHTML = `
          <b style="color:var(--gold); font-size:13px;">⚠️ OBLIGAT NOMÉS SI SUPERES ELS 15.876 €</b><br>
          Si tens dos pagadors i el segon supera els 1.500 €, el límit per no declarar baixa a 15.876 €. Si vas guanyar menys d'això en tot l'any (com el Nil amb feinetes d'estiu), <b>NO estàs obligat</b>!
        `;
      } else {
        verdictBox.innerHTML = `
          <b style="color:var(--ok); font-size:13px;">✅ NO ESTÀS OBLIGAT PER LLEI</b><br>
          En ser jove amb ingressos baixos, no tens cap obligació de declarar. <b>PERÒ compte:</b> si et van practicar retencions a la nòmina d'estiu, et convé fer-la voluntàriament perquè Hisenda <b>et retornarà diners</b>!
        `;
      }
    };

    q1No.classList.add("sel");
    q2No.classList.add("sel");
    renderVerdict();

    q1No.onclick = () => { isQ1Yes = false; q1No.classList.add("sel"); q1Yes.classList.remove("sel"); renderVerdict(); };
    q1Yes.onclick = () => { isQ1Yes = true; q1Yes.classList.add("sel"); q1No.classList.remove("sel"); renderVerdict(); };
    q2No.onclick = () => { isQ2Yes = false; q2No.classList.add("sel"); q2Yes.classList.remove("sel"); renderVerdict(); };
    q2Yes.onclick = () => { isQ2Yes = true; q2Yes.classList.add("sel"); q2No.classList.remove("sel"); renderVerdict(); };

    wizardCard.querySelector("#btn-step2-next").onclick = async () => {
      wizardCard.querySelector("#btn-step2-next").remove();
      await ChatEngine.say("nil", "Ufff, quin pes de sobre! No he arribat ni a 2.000 € en tot l'any, així que no he comès cap delicte!");
      await ChatEngine.say("aina", "Cap ni un. I ara mira el millor: el que passa quan obres l'esborrany de la teva feina d'estiu.");
      await this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: EL SIMULADOR DE L'ESBORRANY A RETORNAR
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "L'esborrany oficial: demana el que és teu");

    const simCard = document.createElement("div");
    simCard.className = "chat-embed-card";
    simCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        📋 Simulador de Liquidació d'IRPF: L'Estiu del Nil
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Aquest és el càlcul real que fa el sistema d'Hisenda en creuar les teves nòmines de feina temporal:
      </p>

      <div style="background:#090e12; border:1px solid var(--line); border-radius:10px; padding:12px; font-size:12px; line-height:1.6;">
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed var(--line);">
          <span>Total ingressos bruts d'estiu:</span>
          <b>1.850,00 €</b>
        </div>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed var(--line);">
          <span>Retencions practicades a la nòmina (2% IRPF):</span>
          <b style="color:var(--warn);">-37,00 €</b>
        </div>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed var(--line);">
          <span>Mínim exempt per viure (exempt d'impost):</span>
          <b>5.550,00 €</b>
        </div>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed var(--line);">
          <span>Impost real que et correspon pagar (Tipus 0%):</span>
          <b>0,00 €</b>
        </div>
        <div style="display:flex; justify-content:space-between; padding:8px 0 4px; margin-top:4px; font-size:14px; font-weight:800;">
          <span style="color:var(--ok);">RESULTAT FINAL DE LA DECLARACIÓ:</span>
          <span style="color:var(--ok); font-size:16px;">+37,00 € A RETORNAR</span>
        </div>
      </div>

      <div style="background:var(--ok2); border:1px solid var(--ok); border-radius:10px; padding:10px 12px; margin-top:12px; font-size:12px; line-height:1.5;">
        <b style="color:var(--ok);">🎉 Què vol dir això?</b><br>
        L'empresa et va treure 37 € de la nòmina com a avançament. Però com que no has arribat al mínim, <b>Hisenda t'ingressarà aquests 37 € directament al teu compte bancari</b> un cop confirmis l'esborrany! Si no el mires, es queden allà.
      </div>

      <button class="btn" id="btn-step3-next" style="width:100%; margin-top:14px;">
        Pas 4: Les màximes d'Hisenda i el teu repte real →
      </button>
    `;

    ChatEngine.embedCard(simCard);

    simCard.querySelector("#btn-step3-next").onclick = async () => {
      simCard.querySelector("#btn-step3-next").remove();

      ChatEngine.notifyMoneyChange(37.00, "Retenció de l'estiu retornada oficialment per Hisenda!");

      await ChatEngine.say("nil", "M'estan tornant 37 € que donava per perduts només per entrar a confirmar l'esborrany??");
      await ChatEngine.say("marta", "I a mi em feia por obrir el sobre! Si no fos per vosaltres, hauria deixat aquests diners perduts per sempre!");
      await ChatEngine.say("pau", "Tal qual! Centenars de joves perden 50 €, 80 € o 100 € cada any perquè ningú els ha ensenyat que Hisenda no només cobra, sinó que també retorna.");
      await ChatEngine.say("marc", "Per això és clau tenir la Cl@ve Mòbil o el certificat digital a punt un cop fas els 18 anys.");
      await this.step4();
    };
  },

  /* ==========================================================================
     PAS 4: FRASE PER RECORDAR I REPTE REAL
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "Les normes de la Renda i el repte");

    const recapCard = document.createElement("div");
    recapCard.className = "chat-embed-card";
    recapCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">🏛️</span>
        <h3 style="margin:0; font-size:16px;">Les 3 veritats de la Renda per a joves</h3>
      </div>

      <div style="font-size:13px; line-height:1.6; margin:10px 0;">
        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">1. Hisenda no mossega si t'informes:</b><br>
          <span style="color:var(--ink);">Tenir feines temporals d'estudiants no et porta a problemes; simplement has de saber si estàs obligat segons els teus límits.</span>
        </div>

        <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">2. Si has cotitzat amb retenció, mira sempre l'esborrany:</b><br>
          <span style="color:var(--ink);">Encara que no hi estiguis obligat, confirmar l'esborrany si surt «a retornar» és l'única manera de recuperar els teus diners.</span>
        </div>

        <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
          <b style="color:var(--teal);">3. Prepara la teva identitat digital (Cl@ve):</b><br>
          <span style="color:var(--ink);">Als 18 anys, tenir el sistema Cl@ve al mòbil et permetrà fer tràmits d'Hisenda, beques universitàries i títols sense moure't de casa.</span>
        </div>
      </div>

      <div class="maxim" style="margin-left:0; margin-top:14px;">
        <span>Frase per recordar</span>
        Hisenda no mossega si entens les normes. Molts joves perden diners cada any simplement per no demanar l'esborrany que els surt a retornar.
      </div>

      <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
        <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
        <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquest tràmit oficial clau per a la teva vida adulta:</p>
        <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
          <li>Cerca a Google o a la botiga d'aplicacions l'app oficial <b>«Cl@ve»</b> del govern.</li>
          <li>Informa't de com activar-la (amb videollamada o a qualsevol oficina pública amb el teu DNI).</li>
          <li>Aquesta clau et servirà per consultar nòmines públiques, beques, Renda i vida laboral per sempre.</li>
        </ul>
      </div>

      <button class="btn gold" id="btn-finish-cap11" style="width:100%; margin-top:16px;">
        Completar Capítol 11 i perdre la por a la Renda 🏆
      </button>
    `;

    ChatEngine.embedCard(recapCard);

    recapCard.querySelector("#btn-finish-cap11").onclick = () => {
      recapCard.querySelector("#btn-finish-cap11").disabled = true;

      // Desem dades a l'estat
      AppState.saveChapterData(11, "checkedTax", true);

      // Afegim 75 € de guardiola virtual al coixí de l'usuari
      AppState.completeChapter(11, 75, null);

      ChatEngine.celebrate(
        "Capítol 11 completat amb èxit!",
        "Ja saps com funciona l'IRPF, qui està obligat a declarar i com reclamar que et retornin les retencions.",
        75,
        12,
        () => {
          window.loadChapter(12);
        }
      );
    };
  }
};
