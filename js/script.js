/**
 * PossoPortarlo? — interazioni pagina (vanilla JS, nessun framework).
 * Nessun oggetto della lista qui sotto è collegato a un backend reale:
 * sono dati dimostrativi in attesa dell'integrazione futura.
 */

const DEMO_RESULTS = {
  powerbank: {
    name: "Powerbank",
    detail: "20.000 mAh",
    badge: "Batteria al litio",
    hand: { value: "SÌ", note: "Consentito", state: "yes" },
    hold: { value: "NO", note: "Non consentito", state: "no" },
    warningTitle: "Attenzione alla capacità.",
    warning: "Sopra i 100 Wh serve l'autorizzazione della compagnia; oltre i 160 Wh generalmente non è ammessa.",
    rule: "Le batterie al litio viaggiano sempre in cabina: mai in stiva, per motivi di sicurezza.",
    updated: "—",
  },
  profumo: {
    name: "Profumo",
    detail: "Fino a 100 ml",
    badge: "Liquido",
    hand: { value: "SÌ", note: "Consentito", state: "yes" },
    hold: { value: "SÌ", note: "Consentito", state: "yes" },
    warningTitle: "Rispetta il sacchetto trasparente.",
    warning: "In cabina va inserito in un sacchetto trasparente richiudibile da 1 litro, insieme agli altri liquidi.",
    rule: "In cabina i liquidi sono limitati a contenitori da massimo 100 ml; in stiva non ci sono questi limiti.",
    updated: "—",
  },
  rasoio: {
    name: "Rasoio",
    detail: "A lama o a mano libera",
    badge: "Oggetto tagliente",
    hand: { value: "NO", note: "Non consentito", state: "no" },
    hold: { value: "SÌ", note: "Consentito", state: "yes" },
    warningTitle: "Solo il rasoio elettrico viaggia in cabina.",
    warning: "I rasoi con lama fissa o a mano libera sono ammessi solo nel bagaglio da stiva.",
    rule: "I rasoi elettrici sono sempre ammessi in cabina; quelli con lama vanno messi in stiva.",
    updated: "—",
  },
  medicinali: {
    name: "Medicinali",
    detail: "Uso personale",
    badge: "Uso personale",
    hand: { value: "SÌ", note: "Consentito", state: "yes" },
    hold: { value: "SÌ", note: "Consentito", state: "yes" },
    warningTitle: "Porta la prescrizione medica.",
    warning: "Per quantità superiori ai limiti standard è utile avere con sé la documentazione medica.",
    rule: "I medicinali essenziali per il viaggio sono ammessi in cabina anche oltre i limiti standard dei liquidi.",
    updated: "—",
  },
  accendino: {
    name: "Accendino",
    detail: "Uso personale",
    badge: "Infiammabile",
    hand: { value: "SÌ", note: "Un solo pezzo", state: "yes" },
    hold: { value: "NO", note: "Non consentito", state: "no" },
    warningTitle: "Massimo un accendino a persona.",
    warning: "Deve restare addosso o nel bagaglio a mano: è vietato metterlo nel bagaglio da stiva.",
    rule: "Gli accendini da tasca sono ammessi solo in cabina, in un unico esemplare per passeggero.",
    updated: "—",
  },
  liquidi: {
    name: "Liquidi",
    detail: "Regola dei 100 ml",
    badge: "Regola dei 100 ml",
    hand: { value: "SÌ", note: "Entro i limiti", state: "yes" },
    hold: { value: "SÌ", note: "Consentito", state: "yes" },
    warningTitle: "Un solo sacchetto trasparente a persona.",
    warning: "Tutti i contenitori devono stare in un unico sacchetto richiudibile da massimo 1 litro.",
    rule: "In cabina i liquidi devono stare in contenitori da massimo 100 ml l'uno.",
    updated: "—",
  },
};

const DEMO_ALIASES = {
  "power bank": "powerbank",
  "batteria portatile": "powerbank",
  batteria: "powerbank",
  profumi: "profumo",
  colonia: "profumo",
  rasoi: "rasoio",
  "rasoio elettrico": "rasoio",
  medicine: "medicinali",
  farmaci: "medicinali",
  medicinale: "medicinali",
  accendini: "accendino",
  liquido: "liquidi",
};

function normalizeQuery(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "");
}

function findDemoResult(rawQuery) {
  const key = normalizeQuery(rawQuery);
  if (!key) return null;
  if (DEMO_RESULTS[key]) return DEMO_RESULTS[key];
  const alias = DEMO_ALIASES[key];
  if (alias && DEMO_RESULTS[alias]) return DEMO_RESULTS[alias];
  return null;
}

function buildUnknownResult(rawQuery) {
  return {
    name: rawQuery,
    detail: "",
    badge: "In aggiornamento",
    hand: { value: "?", note: "Presto disponibile", state: "unknown" },
    hold: { value: "?", note: "Presto disponibile", state: "unknown" },
    warningTitle: "Stiamo ampliando il database.",
    warning: "Non abbiamo ancora una scheda per questo oggetto: verifica sempre le condizioni ufficiali della compagnia.",
    rule: "Prova con powerbank, profumo, rasoio, medicinali, accendino o liquidi: sono già nella nostra demo.",
    updated: "—",
  };
}

function setResultStatus(card, prefix, status) {
  const wrapper = card.querySelector(`[data-result-${prefix}]`);
  const value = card.querySelector(`[data-result-${prefix}-value]`);
  const note = card.querySelector(`[data-result-${prefix}-note]`);

  if (wrapper) {
    wrapper.classList.remove("pass__status--yes", "pass__status--no", "pass__status--unknown");
    wrapper.classList.add(`pass__status--${status.state}`);
  }
  if (value) value.textContent = status.value;
  if (note) note.textContent = status.note;
}

function renderResult(entry) {
  const card = document.querySelector("[data-result]");
  if (!card) return;

  const nameNode = card.querySelector("[data-result-name]");
  if (nameNode) nameNode.textContent = entry.name;

  const detailNode = card.querySelector("[data-result-detail]");
  if (detailNode) {
    detailNode.textContent = entry.detail;
    detailNode.hidden = !entry.detail;
  }

  const badgeNode = card.querySelector("[data-result-badge]");
  if (badgeNode) badgeNode.textContent = entry.badge;

  setResultStatus(card, "hand", entry.hand);
  setResultStatus(card, "hold", entry.hold);

  const warningTitleNode = card.querySelector("[data-result-warning-title]");
  if (warningTitleNode) warningTitleNode.textContent = entry.warningTitle;

  const warningNode = card.querySelector("[data-result-warning]");
  if (warningNode) warningNode.textContent = entry.warning;

  const ruleNode = card.querySelector("[data-result-rule]");
  if (ruleNode) ruleNode.textContent = entry.rule;

  const updatedNode = card.querySelector("[data-result-updated]");
  if (updatedNode) updatedNode.textContent = entry.updated;

  card.classList.remove("is-updated");
  void card.offsetWidth; // riavvia l'animazione CSS
  card.classList.add("is-updated");
}

function scrollToResult() {
  const section = document.querySelector(".pass-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function runDemoSearch(rawQuery) {
  const query = rawQuery.trim();
  if (!query) return;
  const entry = findDemoResult(query) || buildUnknownResult(query);
  renderResult(entry);
  scrollToResult();
}

function initSearchForm() {
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input || !input.value.trim()) {
      if (input) input.focus();
      return;
    }
    runDemoSearch(input.value);
  });
}

function initQuickLinks() {
  const input = document.querySelector("[data-search-input]");

  document.querySelectorAll("[data-quick-search]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-quick-search") || "";
      if (input) {
        input.value = value;
        input.focus({ preventScroll: true });
      }
      runDemoSearch(value);
    });
  });
}

function initFocusSearchLinks() {
  document.querySelectorAll("[data-focus-search]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const form = document.querySelector("[data-search-form]");
      const input = document.querySelector("[data-search-input]");
      if (!form || !input) return;

      event.preventDefault();
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => input.focus({ preventScroll: true }), 350);
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  const icon = document.querySelector("[data-nav-toggle-icon]");
  if (!toggle || !nav) return;

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Chiudi il menu" : "Apri il menu");
    if (icon) icon.setAttribute("href", isOpen ? "#icon-close" : "#icon-menu");
  }

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

function initHeaderScrollState() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const updateState = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateState();
  window.addEventListener("scroll", updateState, { passive: true });
}

function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initFooterYear() {
  const node = document.querySelector("[data-year]");
  if (node) node.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initHeaderScrollState();
  initMobileNav();
  initFocusSearchLinks();
  initSearchForm();
  initQuickLinks();
  initRevealOnScroll();
});
