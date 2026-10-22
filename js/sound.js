/**
 * SOUND.JS - Sintetitzador d'àudio autònom amb Web Audio API (sense fitxers externs)
 * Proporciona sons per guanys, pèrdues, celebracions i clics d'interfície.
 */

const SoundFX = {
  ctx: null,

  initAudio() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  isEnabled() {
    if (typeof AppState !== "undefined" && AppState.get && AppState.get().settings) {
      return AppState.get().settings.sound !== false;
    }
    return true;
  },

  /**
   * So agut, net i brillant de monedes entrant (+€)
   * Acord arpegiat: Si5 (987.77 Hz) -> Mi6 (1318.51 Hz)
   */
  playCoin() {
    if (!this.isEnabled()) return;
    try {
      const ctx = this.initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [
        { freq: 987.77, start: 0.00, dur: 0.20, vol: 0.18 },
        { freq: 1318.51, start: 0.09, dur: 0.38, vol: 0.22 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(n.vol, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {
      console.warn("SoundFX error:", e);
    }
  },

  /**
   * So sord descendent d'impacte/pèrdua (-€)
   * Glissando descendent de 260 Hz a 85 Hz amb ona triangular
   */
  playLoss() {
    if (!this.isEnabled()) return;
    try {
      const ctx = this.initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.32);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {
      console.warn("SoundFX error:", e);
    }
  },

  /**
   * Fanfara triunfal de capítol completat (Do5, Mi5, Sol5, Do6)
   */
  playCelebration() {
    if (!this.isEnabled()) return;
    try {
      const ctx = this.initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;

      const fanfare = [
        { freq: 523.25, start: 0.00, dur: 0.16, vol: 0.15 },
        { freq: 659.25, start: 0.11, dur: 0.16, vol: 0.17 },
        { freq: 783.99, start: 0.22, dur: 0.20, vol: 0.19 },
        { freq: 1046.50, start: 0.36, dur: 0.60, vol: 0.24 }
      ];

      fanfare.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(n.vol, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {
      console.warn("SoundFX error:", e);
    }
  },

  /**
   * Clic subtil per a botons i toggles
   */
  playClick() {
    if (!this.isEnabled()) return;
    try {
      const ctx = this.initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, now);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }
};

// Reactivar l'AudioContext amb la primera interacció d'usuari (política de navegadors moderns)
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    SoundFX.initAudio();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
}
