/**
 * STATE.JS - Gestió de l'estat global i persistència amb localStorage
 */

const STORAGE_KEY = "FINANCES_JOVES_APP_V1";

const DEFAULT_STATE = {
  unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  completedChapters: [],
  currentChapterId: 1,
  virtualSavings: 100, // Saldo inicial per poder experimentar guanys i pèrdues reals
  profileArchetype: null, // "nil", "marta", "marc"
  decisions: {},
  settings: {
    speed: 1, // 1, 2 o 99 (skip)
    sound: true,
    theme: "dark", // "dark" o "light"
    fontSize: "md" // "sm", "md", "lg"
  }
};

const AppState = {
  data: null,
  listeners: [],

  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      this.data = saved ? Object.assign({}, DEFAULT_STATE, JSON.parse(saved)) : Object.assign({}, DEFAULT_STATE);
    } catch (e) {
      console.warn("No s'ha pogut llegir localStorage, fent servir memòria local", e);
      this.data = Object.assign({}, DEFAULT_STATE);
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
    return this.get().unlockedChapters.includes(Number(chapterId));
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
      this.save();
    }
    return this.data.settings.fontSize;
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
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
};

AppState.init();
