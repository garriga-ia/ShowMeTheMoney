/**
 * ENGINE.JS - Motor interactiu del xat, pacing, scrolling i renderització
 */

const ChatEngine = {
  streamEl: null,
  tailEl: null,
  observer: null,
  autoFollow: true,
  currentStep: 1,
  totalSteps: 4,
  stepAnchors: {},

  init(streamContainer) {
    this.streamEl = streamContainer;
    this.streamEl.innerHTML = '<div class="chat-date-divider">La colla · Curs de finances</div>';
    this.ensureTail();
    this.setupObserver();
  },

  ensureTail() {
    if (this.tailEl && this.tailEl.isConnected) return this.tailEl;
    this.tailEl = document.createElement("div");
    this.tailEl.className = "tail";
    this.tailEl.setAttribute("aria-hidden", "true");
    this.streamEl.appendChild(this.tailEl);
    return this.tailEl;
  },

  setupObserver() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.autoFollow = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      this.observer.observe(this.tailEl);
    }
  },

  getSpeed() {
    return AppState.get().settings.speed || 1;
  },

  async wait(ms) {
    const speed = this.getSpeed();
    if (speed >= 99) return Promise.resolve();
    const effectiveMs = ms / speed;
    return new Promise(resolve => setTimeout(resolve, effectiveMs));
  },

  scrollTo(node) {
    if (!node || !this.autoFollow) return;
    try {
      node.scrollIntoView({ behavior: this.getSpeed() >= 99 ? "auto" : "smooth", block: "nearest" });
    } catch (e) {
      node.scrollIntoView(false);
    }
  },

  async say(who, text) {
    const person = COLLA[who] || COLLA.me;
    const isMe = who === "me";
    const speed = this.getSpeed();
    const tail = this.ensureTail();

    // Mostra indicador de typing si no és l'usuari ni mode skip
    if (!isMe && speed < 99) {
      const typingEl = document.createElement("div");
      typingEl.className = "typing";
      typingEl.innerHTML = `${person.name} està escrivint <span class="typing-dots"><i></i><i></i><i></i></span>`;
      this.streamEl.insertBefore(typingEl, tail);
      this.scrollTo(typingEl);

      const baseTime = 300;
      const charTime = Math.min(text.length * 10, 1100);
      await this.wait(baseTime + charTime);
      typingEl.remove();
    }

    // Missatge
    const msgEl = document.createElement("div");
    msgEl.className = `msg${isMe ? " me" : ""}`;
    msgEl.innerHTML = `
      ${person.svg}
      <div class="bub">
        ${isMe ? "" : `<b class="n p-${who}">${person.name} <span class="role">· ${person.role}</span></b>`}
        ${text}
      </div>
    `;

    this.streamEl.insertBefore(msgEl, tail);
    this.scrollTo(msgEl);
    await this.wait(isMe ? 350 : 250);
    return msgEl;
  },

  embedCard(cardHtmlOrNode) {
    const tail = this.ensureTail();
    let cardEl;
    if (typeof cardHtmlOrNode === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = cardHtmlOrNode.trim();
      cardEl = wrapper.firstElementChild;
    } else {
      cardEl = cardHtmlOrNode;
    }

    if (!cardEl.classList.contains("chat-embed-card")) {
      cardEl.classList.add("chat-embed-card");
    }

    this.streamEl.insertBefore(cardEl, tail);
    this.scrollTo(cardEl);
    return cardEl;
  },

  embedMaxim(text) {
    const tail = this.ensureTail();
    const maximEl = document.createElement("div");
    maximEl.className = "maxim";
    maximEl.innerHTML = `<span>Per recordar</span>${text}`;
    this.streamEl.insertBefore(maximEl, tail);
    this.scrollTo(maximEl);
    return maximEl;
  },

  registerStep(stepNum, label) {
    this.currentStep = stepNum;
    const tail = this.ensureTail();
    const anchor = document.createElement("div");
    anchor.className = "step-anchor";
    anchor.id = `step-anchor-${stepNum}`;
    anchor.innerHTML = `<span>Pas ${stepNum} de ${this.totalSteps}</span> · <b>${label}</b>`;
    this.streamEl.insertBefore(anchor, tail);
    this.stepAnchors[stepNum] = anchor;
    this.updateProgBar(stepNum);
    this.scrollTo(anchor);
  },

  updateProgBar(activeStep) {
    const container = document.getElementById("chapter-prog-steps");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 1; i <= this.totalSteps; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `prog-step-btn${i < activeStep ? " completed" : ""}${i === activeStep ? " active" : ""}`;
      btn.textContent = i;
      btn.title = `Pas ${i}`;
      btn.disabled = i > activeStep;
      btn.onclick = () => {
        const target = this.stepAnchors[i];
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      container.appendChild(btn);
    }
  },

  triggerHaptic() {
    if ("vibrate" in navigator) {
      try { navigator.vibrate([40, 30, 40]); } catch (e) {}
    }
  },

  notifyMoneyChange(delta, label, sourceElement, txId) {
    this.triggerHaptic();
    const isGain = delta > 0;
    const formatted = (isGain ? "+" : "") + delta.toFixed(2) + " €";
    const key = txId || (label ? label.substring(0, 32) : null);

    // Si la transacció ja s'ha aplicat en aquesta partida, evitem duplicar diners
    const alreadyApplied = key && typeof AppState !== "undefined" && AppState.isTransactionApplied(key);

    if (alreadyApplied) {
      const tail = this.ensureTail();
      const chip = document.createElement("div");
      chip.className = `money-impact-chip ${isGain ? "gain" : "loss"}`;
      chip.style.opacity = "0.85";
      chip.innerHTML = `
        <span class="impact-icon">ℹ️</span>
        <div class="impact-info">
          <b class="impact-amount">${formatted} (Ja registrat)</b>
          <span class="impact-label">${label || "Aquest moviment ja s'havia ingressat en la teva partida"}</span>
        </div>
      `;
      this.streamEl.insertBefore(chip, tail);
      this.scrollTo(chip);

      if (typeof window.triggerWalletBadge === "function") {
        window.triggerWalletBadge(0, `Ja registrat: saldo mantingut`);
      }
      return chip;
    }

    if (typeof AppState !== "undefined") {
      if (key) {
        AppState.recordTransaction(key, delta);
      } else {
        AppState.adjustSavings(delta);
      }
    }

    const tail = this.ensureTail();
    const chip = document.createElement("div");
    chip.className = `money-impact-chip ${isGain ? "gain" : "loss"}`;
    chip.innerHTML = `
      <span class="impact-icon">${isGain ? "💰" : "💸"}</span>
      <div class="impact-info">
        <b class="impact-amount">${formatted}</b>
        <span class="impact-label">${label || (isGain ? "Ingrés al compte" : "Despesa / pèrdua")}</span>
      </div>
    `;
    this.streamEl.insertBefore(chip, tail);
    this.scrollTo(chip);

    // Animació de monedes volant segons ingrés o despesa i efecte sonor
    if (isGain) {
      if (typeof SoundFX !== "undefined") SoundFX.playCoin();
      if (typeof window.animateCoinsToWallet === "function") {
        window.animateCoinsToWallet(sourceElement || chip);
      }
    } else {
      if (typeof SoundFX !== "undefined") SoundFX.playLoss();
      if (typeof window.animateCoinsFromWallet === "function") {
        window.animateCoinsFromWallet(sourceElement || chip);
      }
    }

    // Efecte de badge flotant i gran banner d'impacte superior
    if (typeof window.triggerWalletBadge === "function") {
      window.triggerWalletBadge(delta, label);
    }

    return chip;
  },

  celebrate(title, subtitle, savingsGain, nextChapterId, onNext) {
    if (arguments.length >= 6) {
      savingsGain = arguments[3];
      nextChapterId = arguments[4];
      onNext = arguments[5];
    }
    this.triggerHaptic();
    if (typeof SoundFX !== "undefined") SoundFX.playCelebration();
    const card = document.createElement("div");
    card.className = "celebration-box";
    const rewardsHtml = savingsGain > 0
      ? `<div class="rewards-row"><span class="reward-pill" style="color:var(--teal);">+${savingsGain.toFixed(2)} € guardats al coixí</span></div>`
      : `<div class="rewards-row"><span class="reward-pill" style="color:var(--teal);">✓ Capítol completat</span></div>`;

    card.innerHTML = `
      <div class="trophy-badge">🏆</div>
      <div class="celebration-title">${title}</div>
      <div class="celebration-sub">${subtitle}</div>
      ${rewardsHtml}
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button class="btn gold" id="btn-next-chap">Següent capítol: Capítol ${nextChapterId} →</button>
        <button class="btn ghost" id="btn-back-hub">Tornar a l'índex</button>
      </div>
    `;

    this.embedCard(card);

    card.querySelector("#btn-next-chap").onclick = () => {
      if (typeof onNext === "function") onNext();
    };
    card.querySelector("#btn-back-hub").onclick = () => {
      window.location.hash = "#dashboard";
    };
  }
};
