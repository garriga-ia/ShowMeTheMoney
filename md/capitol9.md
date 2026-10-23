<!--
  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/capitol9.js
  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/capitol9.js
  Per regenerar, executa: node scripts/sync-md.js
-->

/**
 * CAPITOL9.JS - Guió i lògica interactiva del Capítol 9: "I si ho deixo créixer? (i el fum de fer-se ric)"
 */

const Capitol9 = {
  id: 9,
  title: "Capítol 9 · I si ho deixo créixer? (i el fum de fer-se ric)",
  totalSteps: 4,

  state: {
    firstReaction: null,
    flaggedCount: 0,
    etfSimulated: false,
    monthlyContribution: 40,
    annualReturn: 7
  },

  RED_FLAGS_DATA: [
    {
      id: "guaranteed",
      title: "«Guany 100% garantit i sense cap risc»",
      desc: "Afirmen que duplicaràs la teva inversió en pocs dies i que mai es perd ni un cèntim.",
      reality: "🚨 En finances reals, a més rendibilitat promesa, més risc de perdre-ho tot. Si algú et diu 'guany segur', és una estafa el 100% de les vegades."
    },
    {
      id: "urgency",
      title: "«Només queden 3 places avui! Entra ja al canal privat!»",
      desc: "Et fiquen pressa perquè paguis la subscripció o facis la transferència abans de pensar.",
      reality: "🚨 Tècnica psicològica de FOMO. La urgència extrema busca que no tinguis temps de buscar informació a Google o parlar amb ningú amb criteri."
    },
    {
      id: "luxury",
      title: "«Mira el meu Porsche llogat a Dubai amb 20 anys»",
      desc: "Vídeos amb feixos de bitllets, rellotges daurats i hotels de luxe dient «treballa des de la platja».",
      reality: "🚨 L'ostentació és un esquer. El 99% dels cotxes i viles són llogats per unes hores per gravar vídeos i captar joves desprevinguts."
    },
    {
      id: "pyramid",
      title: "«Porta 3 amics i guanyaràs una comissió de per vida»",
      desc: "L'objectiu principal no és cap inversió ni cap negoci real, sinó reclutar noves víctimes.",
      reality: "🚨 Esquema piramidal de manual (estafa Ponzi). Els diners dels nous membres paguen els beneficis dels primers fins que la piràmide s'enfonsa."
    }
  ],

  ETF_COMPANIES: [
    { name: "Apple", sector: "Tech", icon: "🍎" },
    { name: "Microsoft", sector: "Tech", icon: "💻" },
    { name: "Inditex", sector: "Moda", icon: "👕" },
    { name: "Nestlé", sector: "Aliments", icon: "🍫" },
    { name: "Toyota", sector: "Motor", icon: "🚗" },
    { name: "Pfizer", sector: "Salut", icon: "💊" },
    { name: "Iberdrola", sector: "Energia", icon: "⚡" },
    { name: "Amazon", sector: "Comerç", icon: "📦" }
  ],

  async start() {
    ChatEngine.totalSteps = this.totalSteps;
    await this.step1();
  },

  /* ==========================================================================
     PAS 1: EL RECLAM DE TIKTOK I EL GRUP VIP DE TELEGRAM
     ========================================================================== */
  async step1() {
    ChatEngine.registerStep(1, "El Porsche de TikTok i el canal VIP");

    await ChatEngine.say("nil", "Nois!! Mireu aquest vídeo que m'acaba de sortir a TikTok, estic al·lucinant!");
    await ChatEngine.say("marta", "Quin vídeo Nil? No serà cap bogeria de les teves...");
    await ChatEngine.say("nil", "Un noi de 21 anys conduint un Ferrari a Dubai! Diu que va deixar els estudis i que guanya entre 500 € i 1.000 € al dia només seguint uns senyals que envia un 'expert' per un grup de Telegram!");
    await ChatEngine.say("nil", "Per entrar al grup VIP només demanen 150 € de subscripció i que facis un primer dipòsit en una plataforma de criptomonedes que et recomanen ells. Diuen que és rendibilitat assegurada sense esforç!");
    await ChatEngine.say("nil", "Estic pensant en agafar els 150 € del meu coixí i posar-los-hi. Si en trec 500 € la setmana que ve, ja ho he amortitzat tot!");
    await ChatEngine.say("pau", "NIIIIIL ATURA'T ARA MATEIX! No posis ni un sol euro!!");
    await ChatEngine.say("aina", "Si us plau Nil, és l'estafa més vella d'internet disfressada de tecnologia moderna!");

    const choiceCard = document.createElement("div");
    choiceCard.className = "chat-embed-card";
    choiceCard.innerHTML = `
      <p class="q">Per què és evident que aquesta oferta és una estafa o parany financer?</p>
      <button class="opt" data-opt="1">Perquè si algú guanyés 1.000 € al dia garantits, no necessitaria cobrar 150 € a desconeguts per Telegram</button>
      <button class="opt" data-opt="2">Perquè el Ferrari segurament no té la ITV passada</button>
      <button class="opt" data-opt="3">Sembla fiable, segurament és un geni de les finances i vol ajudar tothom</button>
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
      await ChatEngine.say("me", "Totalment d'acord! Pensa-hi lògicament, Nil: si tinguessis la màquina de fer diners infinits, et passaries el dia gravant TikToks per cobrar 150 € a la gent?");
      await ChatEngine.say("marc", "I tant! El seu negoci no és la inversió: **el seu negoci és estafar la gent que compra el curs o entra al canal**.");
    } else {
      ChatEngine.notifyMoneyChange(-150, "Subscripció al canal VIP de Telegram enviada... t'han bloquejat!");
      await ChatEngine.say("nil", "NOOOOO!! M'han blocat del canal de Telegram i han esborrat el xat! Els 150 euros del meu coixí han volat en 2 segons! Quina impotència i quina ràbia més gran, estic tremolant...");
      await ChatEngine.say("me", "Nil, si sonés tan fàcil, tothom al carrer seria milionari i ningú treballaria.");
      await ChatEngine.say("aina", "Exacte. No existeix cap botó màgic que et doni diners mentre dorms sense risc.");
    }

    await ChatEngine.say("pau", "Al meu gimnàs un conegut va demanar un crèdit de 1.500 € per ficar-los en una plataforma de «trading automàtic» d'un noi de TikTok... ho va perdre tot en 48 hores i encara està pagant el deute amb la cara vermella de vergonya.");
    await ChatEngine.say("marta", "I a mi el director del banc em va voler encolomar un «fons garantit» que tenia un 4% de comissions ocultes d'entrada. Tothom et vol prometre la lluna si no llegeixes la lletra petita!");

    await ChatEngine.say("aina", "Anem a analitzar les 4 banderes vermelles («Red Flags») d'aquest tipus d'anuncis perquè no hi tornis a caure mai més:");
    await this.step2();
  },

  /* ==========================================================================
     PAS 2: EL DETECTOR INTERACTIU DE «RED FLAGS»
     ========================================================================== */
  async step2() {
    ChatEngine.registerStep(2, "El detector de «Red Flags» (Banderes Vermelles)");

    const flagsCard = document.createElement("div");
    flagsCard.className = "chat-embed-card";
    flagsCard.innerHTML = `
      <div style="font-weight:800; font-size:15px; margin-bottom:4px;">
        🚩 El Detector d'Estafes i Fum a Xarxes Socials
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Fes clic a cadascuna de les 4 tàctiques habituals dels «finfluencers» per revelar el parany real amagat:
      </p>

      <div class="red-flags-container" id="flags-box"></div>

      <div id="flags-status-bar" style="font-size:12px; font-weight:700; color:var(--mut); margin-top:10px; text-align:center;">
        Banderes destapades: <span id="flagged-counter" style="color:var(--warn);">0</span> de 4
      </div>

      <button class="btn" id="btn-step2-next" style="width:100%; margin-top:14px;" disabled>
        Pas 3: Com s'inverteix de veritat? Estalviar vs Invertir i què és un ETF →
      </button>
    `;

    ChatEngine.embedCard(flagsCard);

    const flagsContainer = flagsCard.querySelector("#flags-box");
    const counterDisplay = flagsCard.querySelector("#flagged-counter");
    const nextBtn = flagsCard.querySelector("#btn-step2-next");

    let count = 0;

    this.RED_FLAGS_DATA.forEach(rf => {
      const card = document.createElement("div");
      card.className = "red-flag-card";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b style="font-size:13px; color:var(--ink);">${rf.title}</b>
          <span class="flag-icon" style="font-size:16px;">🔍</span>
        </div>
        <p style="font-size:12px; color:var(--mut); margin:4px 0 0;">${rf.desc}</p>
        <div class="reality-box" style="display:none; margin-top:8px; font-size:12px; line-height:1.5; color:#fff; background:rgba(255,122,107,0.15); padding:8px 10px; border-radius:8px; border:1px solid var(--warn);">
          ${rf.reality}
        </div>
      `;

      card.onclick = () => {
        if (!card.classList.contains("flagged")) {
          card.classList.add("flagged");
          card.querySelector(".flag-icon").textContent = "🚩";
          card.querySelector(".reality-box").style.display = "block";
          ChatEngine.triggerHaptic();
          count++;
          counterDisplay.textContent = count;
          if (count >= 4) {
            nextBtn.disabled = false;
            nextBtn.classList.add("gold");
          }
        }
      };

      flagsContainer.appendChild(card);
    });

    nextBtn.onclick = async () => {
      nextBtn.remove();
      await ChatEngine.say("nil", "D'acord: ja he après a detectar el fum dels 'criptobros'. Però aleshores... **com inverteix la gent normal i intel·ligent al món real?**");
      await ChatEngine.say("marta", "Jo és que creia que l'única opció segura és guardar els diners al compte corrent del banc i no tocar-los mai!");
      await ChatEngine.say("aina", "Marta, guardar-ho tot al banc té un enemic invisible: es diu **inflació**.");
      await this.step3();
    };
  },

  /* ==========================================================================
     PAS 3: INVERSIÓ REAL: ESTALVIAR VS INVERTIR I QUÈ ÉS UN ETF
     ========================================================================== */
  async step3() {
    ChatEngine.registerStep(3, "Inversió real: Estalviar vs Invertir i què és un ETF");

    await ChatEngine.say("marc", "Mireu la diferència bàsica que tot jove de 18 anys hauria de tenir gravada a foc:");

    const vsCard = document.createElement("div");
    vsCard.className = "chat-embed-card";
    vsCard.innerHTML = `
      <div style="font-weight:800; font-size:15px; margin-bottom:4px; color:var(--teal);">
        ⚖️ Estalviar vs Invertir: Dos companys d'equip, no rivals
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 12px;">
        Entendre per a què serveix cadascun és la base de la teva tranquil·litat futura:
      </p>

      <div class="save-vs-invest-grid">
        <div class="save-card">
          <b style="color:var(--n-marc); font-size:13px; display:block; margin-bottom:4px;">🛡️ ESTALVIAR (El teu escut)</b>
          <div>• <b>On es posa:</b> Compte corrent o guardiola segura.</div>
          <div>• <b>Termini:</b> Curt termini (avui a 2 anys).</div>
          <div>• <b>Per a què serveix:</b> Coixí d'emergència, carnet o viatge.</div>
          <div style="color:var(--warn); margin-top:6px; font-weight:700;">⚠️ Risc: Si ho deixes 20 anys parat, la inflació (la pujada de preus) fa que els teus diners comprin menys cada any.</div>
        </div>

        <div class="invest-card">
          <b style="color:var(--teal); font-size:13px; display:block; margin-bottom:4px;">🌱 INVERTIR (El teu motor)</b>
          <div>• <b>On es posa:</b> En l'economia real (empreses que produeixen).</div>
          <div>• <b>Termini:</b> Llarg termini (+5 a 10 anys).</div>
          <div>• <b>Per a què serveix:</b> Crear patrimoni i batre la inflació.</div>
          <div style="color:var(--ok); margin-top:6px; font-weight:700;">✅ Risc controlat: Puja i baixa a curt termini, però a llarg termini històricament genera un 6-8% anual.</div>
        </div>
      </div>

      <button class="btn" id="btn-show-etf-sim" style="width:100%; margin-top:10px;">
        Descobreix què és un ETF amb la simulació de la Cistella →
      </button>
    `;

    ChatEngine.embedCard(vsCard);

    vsCard.querySelector("#btn-show-etf-sim").onclick = async () => {
      vsCard.querySelector("#btn-show-etf-sim").remove();

      await ChatEngine.say("nil", "D'acord, però per invertir he de triar accions d'una empresa? I si trio una marca que després fa fallida?");
      await ChatEngine.say("pau", "Aquesta és la gran trampa del principiant: intentar endevinar quina serà la propera empresa milionària.");
      await ChatEngine.say("aina", "Els inversors assenyats no aposten a una sola carta: compren un **ETF (Fons Cotitzat)**.");

      // Widget interactiu de la Cistella d'ETF
      const etfCard = document.createElement("div");
      etfCard.className = "etf-basket-box";
      etfCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <b style="font-size:14px; color:var(--teal);">🧺 Què és un ETF? La metàfora de la Cistella Global</b>
          <span class="contract-badge" style="background:var(--teal2); color:var(--teal);">Diversificació 100%</span>
        </div>
        <p style="font-size:12px; color:var(--ink); margin:0 0 10px; line-height:1.5;">
          Un <b>ETF</b> és com una cistella que conté <b>centenars o milers de les empreses més grans del món</b> alhora. En comptes de comprar només una acció, amb 30 € compres una petita fracció de tot el planeta.
        </p>

        <div style="font-size:11px; font-weight:700; color:var(--mut); text-transform:uppercase; margin-bottom:4px;">
          Exemple de marques dins d'un mateix ETF global:
        </div>
        <div class="etf-companies-grid" id="etf-grid"></div>

        <div id="etf-stress-result" style="display:none; font-size:12px; line-height:1.5; padding:10px 12px; border-radius:10px; margin:10px 0;"></div>

        <button type="button" class="btn ghost" id="btn-test-etf-crash" style="width:100%; margin-top:8px;">
          ⚡ Prova d'estrès: I si una gran empresa té un any horrible o cau?
        </button>

        <button class="btn" id="btn-step3-next-chart" style="display:none; width:100%; margin-top:14px;">
          Pas 4: El gràfic del temps i el secret de fer-se ric lentament →
        </button>
      `;

      ChatEngine.embedCard(etfCard);

      const grid = etfCard.querySelector("#etf-grid");
      const stressBox = etfCard.querySelector("#etf-stress-result");
      const testCrashBtn = etfCard.querySelector("#btn-test-etf-crash");
      const nextChartBtn = etfCard.querySelector("#btn-step3-next-chart");

      this.ETF_COMPANIES.forEach(comp => {
        const chip = document.createElement("div");
        chip.className = "etf-chip";
        chip.dataset.name = comp.name;
        chip.innerHTML = `<span style="font-size:16px; display:block;">${comp.icon}</span>${comp.name}`;
        grid.appendChild(chip);
      });

      testCrashBtn.onclick = () => {
        testCrashBtn.disabled = true;
        this.state.etfSimulated = true;
        ChatEngine.triggerHaptic();

        // Marquem dues empreses com a fallides o amb caiguda
        const inditexChip = grid.querySelector('[data-name="Inditex"]');
        const pfizerChip = grid.querySelector('[data-name="Pfizer"]');
        if (inditexChip) inditexChip.classList.add("failed");
        if (pfizerChip) pfizerChip.classList.add("failed");

        // Totes les altres saludables
        grid.querySelectorAll('.etf-chip:not(.failed)').forEach(ch => ch.classList.add("healthy"));

        stressBox.style.display = "block";
        stressBox.style.background = "var(--ok2)";
        stressBox.style.border = "1.5px solid var(--ok)";
        stressBox.style.color = "var(--ok)";
        stressBox.innerHTML = `
          <b>🛡️ LA MÀGIA DE LA DIVERSIFICACIÓ:</b><br>
          Si haguessis comprat només accions d'una d'aquestes dues empreses, hauries perdut una fortuna. Però com que tens un <b>ETF amb centenars d'empreses</b>, les altres continuen venent milions d'ordinadors, menjar i electricitat a tot el planeta. <b>La teva cistella es manté creixent!</b>
        `;

        nextChartBtn.style.display = "flex";
      };

      nextChartBtn.onclick = async () => {
        nextChartBtn.remove();
        await ChatEngine.say("nil", "Mare meva... ara ho entenc! No cal ser cap geni del Wall Street ni encertar quina empresa pujarà demà. Comprant una cistella ETF ets soci de l'economia mundial sencera!");
        await ChatEngine.say("marc", "Exactament Nil! I ara mireu què passa quan combines un ETF diversificat amb el poder de l'**Interès Compost**:");
        await this.step4();
      };
    };
  },

  /* ==========================================================================
     PAS 4: INTERÈS COMPOST I PER QUÈ NO CAL FER-SE RIC RÀPID
     ========================================================================== */
  async step4() {
    ChatEngine.registerStep(4, "L'interès compost i el secret de fer-se ric a foc lent");

    const chartCard = document.createElement("div");
    chartCard.className = "compound-chart-container";
    chartCard.innerHTML = `
      <div style="font-weight:800; font-size:14px; margin-bottom:4px; color:var(--teal);">
        📈 La cursa del temps: Jove A (18 anys) vs Jove B (30 anys)
      </div>
      <p style="font-size:12px; color:var(--mut); margin:0 0 14px;">
        Descobreix per què 40 € al mes als 18 anys valen més que el doble als 30 anys gràcies a l'interès compost (amb un creixement històric estimat del 7% anual en un ETF global).
      </p>

      <!-- Jove A: Comença als 18 anys -->
      <div class="compound-bar-group">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800;">
          <span style="color:var(--ok);">🟢 Jove A: Comença als 18 anys (40 €/mes durant 12 anys)</span>
          <span id="jove-a-total" style="color:var(--ok); font-size:14px;">~86.500 € als 60 anys</span>
        </div>
        <div style="font-size:11px; color:var(--mut);">Diners de la seva butxaca: només <b>5.760 €</b></div>
        <div class="compound-bar-track">
          <div class="compound-bar-fill-invested" style="width:12%;" title="Capital aportat"></div>
          <div class="compound-bar-fill-interest" style="width:88%;" title="Guanys per interès compost"></div>
        </div>
      </div>

      <!-- Jove B: Comença als 30 anys -->
      <div class="compound-bar-group" style="margin-top:16px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800;">
          <span style="color:var(--n-nil);">🟠 Jove B: Comença als 30 anys (80 €/mes durant 30 anys)</span>
          <span id="jove-b-total" style="color:var(--n-nil); font-size:14px;">~93.000 € als 60 anys</span>
        </div>
        <div style="font-size:11px; color:var(--mut);">Diners de la seva butxaca: <b>28.800 €</b> (5 vegades més diners posats!)</div>
        <div class="compound-bar-track">
          <div class="compound-bar-fill-invested" style="width:36%; background:#e07a38;" title="Capital aportat"></div>
          <div class="compound-bar-fill-interest" style="width:64%; background:#e6c25a;" title="Guanys"></div>
        </div>
      </div>

      <div style="background:var(--bub); border-radius:10px; padding:12px; margin-top:16px; border:1px solid var(--line); font-size:12px; line-height:1.6;">
        <b style="color:var(--teal);">🧠 Quina és la lliçó clau d'aquest gràfic?</b><br>
        El Jove A només va posar <b>5.760 €</b> de la seva butxaca als 18 anys. El Jove B va haver de posar <b>28.800 €</b> (més de 23.000 € extra!) per acabar gairebé al mateix lloc.<br>
        <b style="color:#fff;">👉 El teu actiu més valuós als 18 anys no són els diners: és el TEMPS.</b>
      </div>

      <button class="btn" id="btn-step4-next" style="width:100%; margin-top:14px;">
        Veure les regles d'or i el repte real →
      </button>
    `;

    ChatEngine.embedCard(chartCard);

    chartCard.querySelector("#btn-step4-next").onclick = async () => {
      chartCard.querySelector("#btn-step4-next").remove();

      await ChatEngine.say("nil", "Sabeu quina és la trampa de les xarxes socials? Que et fiquen pressa! Et fan creure que si als 20 anys no condueixes un cotxe car ets un fracassat.");
      await ChatEngine.say("nil", "I per culpa d'aquesta pressa la gent es posa a apostar, a cremar pasta en criptos estranyes i ho perd tot!");
      await ChatEngine.say("pau", "Bravo Nil! Ho has clavat. Com deia el millor inversor del món: «És molt fàcil fer-se ric lentament, però gairebé ningú està disposat a fer-se ric a poc a poc».");
      await ChatEngine.say("marta", "Amb 30 o 40 € al mes en una cistella ETF diversificada, sense mirar la borsa cada dia ni patir, el temps fa tota la feina per tu.");

      const recapCard = document.createElement("div");
      recapCard.className = "chat-embed-card";
      recapCard.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span style="font-size:24px;">🛡️</span>
          <h3 style="margin:0; font-size:16px;">Les 4 regles d'or de la inversió intel·ligent</h3>
        </div>

        <div style="font-size:13px; line-height:1.6; margin:10px 0;">
          <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">1. Primer el coixí, després la inversió:</b><br>
            <span style="color:var(--ink);">Mai inverteixis diners que puguis necessitar els propers 2 o 3 anys. La inversió és per a llarg termini.</span>
          </div>

          <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">2. La cistella (ETF) sempre guanya l'aposta individual:</b><br>
            <span style="color:var(--ink);">No intentis encertar una empresa que triomfi. Compra el món sencer diversificat amb comissions mínimes.</span>
          </div>

          <div style="margin-bottom:8px; background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">3. Risc i rendibilitat van de bracet:</b><br>
            <span style="color:var(--ink);">A curt termini la borsa té oscil·lacions; a llarg termini històricament l'economia global creix. Desconfia de qualsevol que et prometi rendibilitat sense cap risc.</span>
          </div>

          <div style="background:var(--bub); padding:10px; border-radius:10px; border:1px solid var(--line);">
            <b style="color:var(--teal);">4. La riquesa es cuina a foc lent:</b><br>
            <span style="color:var(--ink);">La pressa només enriqueix qui ven fum. La paciència i l'automatització als 18 anys et donaran la independència financera.</span>
          </div>
        </div>

        <div class="maxim" style="margin-left:0; margin-top:14px;">
          <span>Frase per recordar</span>
          Els diners fàcils i ràpids a internet només enriqueixen qui ven el curs o qui munta l'estafa. En finances reals, el temps sempre guanya la pressa.
        </div>

        <div style="margin-top:16px; padding:12px; border-radius:10px; background:var(--card); border:1.5px solid var(--line);">
          <h4 style="margin:0 0 6px; font-size:13px; color:var(--gold);">🎯 El teu repte real d'aquest capítol:</h4>
          <p style="font-size:12px; margin:0 0 8px; color:var(--ink);">Fes aquesta petita cerca per aprendre a moure't en el món adult:</p>
          <ul style="font-size:12px; padding-left:18px; margin:0; line-height:1.6; color:var(--mut);">
            <li>Cerca a internet o a YouTube el terme <b>«ETF MSCI World»</b> o <b>«Fons indexat global»</b> a canals educatius neutrals (sense anuncis de senyals ni cursos de pagament).</li>
            <li>Fixa't en les comissions anuals que tenen (habitualment menys del 0,20% anual enfront del 2% o 3% que cobren els bancs tradicionals).</li>
          </ul>
        </div>

        <button class="btn gold" id="btn-finish-cap9" style="width:100%; margin-top:16px;">
          Completar Capítol 9 i dominar la inversió real 🏆
        </button>
      `;

      ChatEngine.embedCard(recapCard);

      recapCard.querySelector("#btn-finish-cap9").onclick = () => {
        recapCard.querySelector("#btn-finish-cap9").disabled = true;

        AppState.saveChapterData(9, "flaggedCount", 4);
        AppState.saveChapterData(9, "etfLearned", true);

        // Afegim 60 € de guardiola virtual al coixí de l'usuari
        AppState.completeChapter(9, 60, null);

        ChatEngine.celebrate(
          "Bloc 3 completat amb èxit!",
          "Ja coneixes els secrets de l'estalvi, com funciona un ETF i per què fer-se ric a poc a poc és la decisió més intel·ligent.",
          60,
          10,
          () => {
            window.loadChapter(10);
          }
        );
      };
    };
  }
};
