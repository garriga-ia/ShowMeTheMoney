/**
 * STATE.JS - Gestió de l'estat global, desbloqueig seqüencial i ratxa de dies seguits
 */

const STORAGE_KEY = "FINANCES_JOVES_APP_V1";

function getLocalDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDaysDiff(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const d1 = new Date(dateStr1 + "T00:00:00");
  const d2 = new Date(dateStr2 + "T00:00:00");
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const DEFAULT_STATE = {
  unlockedChapters: [1], // Capítol 1 disponible per defecte; la resta es desbloqueja seqüencialment
  completedChapters: [],
  currentChapterId: 1,
  virtualSavings: 100, // Saldo inicial per poder experimentar guanys i pèrdues reals
  streak: {
    count: 1,
    best: 1,
    lastActiveDate: null, // "YYYY-MM-DD"
    history: [] // Historial de dies amb activitat ["YYYY-MM-DD"]
  },
  profileArchetype: null, // "nil", "marta", "marc"
  decisions: {},
  settings: {
    speed: 1, // 1, 2 o 99 (skip)
    sound: true,
    theme: "dark", // "dark" o "light"
    fontSize: "lg" // "sm", "md", "lg" (per defecte "lg" per a màxima llegibilitat en mòbil)
  }
};

const AppState = {
  data: null,
  listeners: [],

  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      this.data = saved ? Object.assign({}, DEFAULT_STATE, JSON.parse(saved)) : JSON.parse(JSON.stringify(DEFAULT_STATE));

      // Assegurar estructura de ratxa (streak)
      if (!this.data.streak || typeof this.data.streak !== "object") {
        this.data.streak = { count: 1, best: 1, lastActiveDate: null, history: [] };
      }

      // Regla d'or de desbloqueig seqüencial:
      // Capítol 1 sempre obert; el Capítol N només s'obre si el Capítol N-1 està completat
      const completed = Array.isArray(this.data.completedChapters)
        ? this.data.completedChapters.map(Number)
        : [];
      this.data.completedChapters = completed;
      this.data.unlockedChapters = [1];
      for (let i = 2; i <= 12; i++) {
        if (completed.includes(i - 1)) {
          this.data.unlockedChapters.push(i);
        }
      }

      // Comprovar i sincronitzar la ratxa diària
      this.checkStreak();

      // Per defecte sempre començar amb la mida gran 'lg' si l'usuari no l'ha canviat expressament
      if (!this.data.settings || !this.data.settings.fontSizeCustomized) {
        if (!this.data.settings) this.data.settings = Object.assign({}, DEFAULT_STATE.settings);
        this.data.settings.fontSize = "lg";
      }
    } catch (e) {
      console.warn("No s'ha pogut llegir localStorage, fent servir memòria local", e);
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.checkStreak();
    }
    return this.data;
  },

  get() {
    if (!this.data) this.init();
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("No s'ha pogut desar a localStorage", e);
    }
    this.notify();
  },

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.get());
  },

  notify() {
    const current = this.get();
    this.listeners.forEach(fn => fn(current));
  },

  isCompleted(chapterId) {
    return this.get().completedChapters.includes(Number(chapterId));
  },

  isUnlocked(chapterId) {
    const id = Number(chapterId);
    if (id <= 1) return true;
    return this.get().completedChapters.includes(id - 1);
  },

  getNextPlayableChapter() {
    for (let i = 1; i <= 12; i++) {
      if (!this.isCompleted(i)) return i;
    }
    return 12;
  },

  /**
   * Gestió de la ratxa de dies seguits (Streak)
   */
  checkStreak() {
    if (!this.data.streak) {
      this.data.streak = { count: 1, best: 1, lastActiveDate: null, history: [] };
    }
    const today = getLocalDateStr();
    const last = this.data.streak.lastActiveDate;

    if (!this.data.streak.history) this.data.streak.history = [];

    if (!last) {
      // Primer cop que entra
      this.data.streak.count = 1;
      this.data.streak.best = 1;
      this.data.streak.lastActiveDate = today;
      if (!this.data.streak.history.includes(today)) this.data.streak.history.push(today);
      return { status: "start", count: 1 };
    }

    const diff = getDaysDiff(last, today);

    if (diff === 0) {
      // Mateix dia: ratxa vigent
      if (!this.data.streak.history.includes(today)) this.data.streak.history.push(today);
      return { status: "same_day", count: this.data.streak.count };
    } else if (diff === 1) {
      // Va entrar ahir: ratxa continuada!
      this.data.streak.count += 1;
      if (this.data.streak.count > (this.data.streak.best || 1)) {
        this.data.streak.best = this.data.streak.count;
      }
      this.data.streak.lastActiveDate = today;
      if (!this.data.streak.history.includes(today)) this.data.streak.history.push(today);
      this.save();
      return { status: "increased", count: this.data.streak.count };
    } else if (diff > 1) {
      // S'ha saltat 1 o més dies: ratxa trencada, es comença nova ratxa des d'avui
      this.data.streak.count = 1;
      this.data.streak.lastActiveDate = today;
      if (!this.data.streak.history.includes(today)) this.data.streak.history.push(today);
      this.save();
      return { status: "reset", count: 1 };
    }
    return { status: "ok", count: this.data.streak.count };
  },

  getStreak() {
    const s = this.get().streak || { count: 1, best: 1, lastActiveDate: getLocalDateStr(), history: [] };
    const today = getLocalDateStr();
    return {
      count: s.count || 1,
      best: s.best || s.count || 1,
      lastActiveDate: s.lastActiveDate,
      history: s.history || [today],
      isTodayDone: Array.isArray(s.history) && s.history.includes(today)
    };
  },

  setSpeed(speedMultiplier) {
    this.data.settings.speed = speedMultiplier;
    this.save();
  },

  toggleSound() {
    this.data.settings.sound = !this.data.settings.sound;
    this.save();
    return this.data.settings.sound;
  },

  setTheme(theme) {
    this.data.settings.theme = theme === "light" ? "light" : "dark";
    this.save();
    return this.data.settings.theme;
  },

  setFontSize(size) {
    if (["sm", "md", "lg"].includes(size)) {
      this.data.settings.fontSize = size;
      this.data.settings.fontSizeCustomized = true;
      this.save();
    }
    return this.data.settings.fontSize;
  },

  setSavings(amount) {
    this.data.virtualSavings = Math.max(0, Math.round(Number(amount) * 100) / 100);
    this.save();
  },

  adjustSavings(delta) {
    this.data.virtualSavings = Math.max(0, Math.round((this.data.virtualSavings + delta) * 100) / 100);
    this.save();
  },

  completeChapter(chapterId, savingsGain = 0, archetype = null) {
    if (arguments.length === 4 && typeof arguments[1] === "number" && typeof arguments[2] === "number") {
      savingsGain = arguments[2];
      archetype = arguments[3];
    }
    const id = Number(chapterId);
    if (!this.data.completedChapters.includes(id)) {
      this.data.completedChapters.push(id);
    }
    if (savingsGain > 0) {
      this.data.virtualSavings = Math.round((this.data.virtualSavings + savingsGain) * 100) / 100;
    }
    if (archetype) {
      this.data.profileArchetype = archetype;
    }
    const nextId = id + 1;
    if (!this.data.unlockedChapters.includes(nextId) && nextId <= 12) {
      this.data.unlockedChapters.push(nextId);
    }
    this.checkStreak();
    this.save();
  },

  saveChapterData(chapterId, key, value) {
    if (!this.data.decisions[chapterId]) {
      this.data.decisions[chapterId] = {};
    }
    this.data.decisions[chapterId][key] = value;
    this.save();
  },

  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.data.virtualSavings = 100;
    this.data.completedChapters = [];
    this.data.unlockedChapters = [1];
    this.data.streak.lastActiveDate = getLocalDateStr();
    this.data.streak.history = [getLocalDateStr()];
    this.save();
  }
};

AppState.init();

if (typeof window !== "undefined") {
  window.AppState = AppState;
} else if (typeof global !== "undefined") {
  global.AppState = AppState;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppState;
}
