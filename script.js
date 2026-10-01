document.documentElement.classList.remove("no-js");

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

function closeMenu() {
  if (!menuButton || !mainNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    mainNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const quoteForm = document.querySelector("#quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const formData = new FormData(quoteForm);
    const details = [
      "Bonjour LAM ELECTROTECH, je souhaite demander des informations / un devis.",
      "",
      `Service : ${formData.get("service")}`,
      `Besoin : ${formData.get("message").toString().trim()}`,
      formData.get("name")?.toString().trim() ? `Nom : ${formData.get("name").toString().trim()}` : "",
      formData.get("location")?.toString().trim() ? `Commune : ${formData.get("location").toString().trim()}` : "",
      formData.get("building")?.toString().trim() ? `Type de bâtiment : ${formData.get("building").toString().trim()}` : "",
      "",
      "Je peux transmettre des photos ou documents dans cette conversation."
    ].filter(Boolean);

    const recipient = formData.get("recipient");
    const message = encodeURIComponent(details.join("\n"));
    const status = document.querySelector("#form-status");
    if (status) {
      status.textContent = "WhatsApp va s’ouvrir avec votre message prérempli. Vérifiez-le et appuyez sur Envoyer pour transmettre votre demande.";
    }

    window.location.href = `https://wa.me/${recipient}?text=${message}`;
  });
}

const repairForm = document.querySelector("#repair-form");
if (repairForm) {
  repairForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!repairForm.reportValidity()) return;

    const formData = new FormData(repairForm);
    const details = [
      "Bonjour LAM ELECTROTECH, j’ai besoin d’un dépannage.",
      "",
      `Problème : ${formData.get("problem")}`,
      `Description : ${formData.get("message").toString().trim()}`,
      formData.get("location")?.toString().trim() ? `Commune : ${formData.get("location").toString().trim()}` : "",
      "",
      "Je peux ajouter une photo dans cette conversation."
    ].filter(Boolean);

    const recipient = formData.get("recipient");
    const message = encodeURIComponent(details.join("\n"));
    const status = document.querySelector("#repair-status");
    if (status) {
      status.textContent = "WhatsApp va s’ouvrir avec votre signalement prérempli. Vérifiez-le et appuyez sur Envoyer pour contacter LAM ELECTROTECH.";
    }

    window.location.href = `https://wa.me/${recipient}?text=${message}`;
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", targetId);
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const serviceSelect = document.querySelector('#quote-form select[name="service"]');
const requestedService = new URLSearchParams(window.location.search).get("service");
const serviceFromLink = {
  electricite: "Électricité bâtiment",
  videosurveillance: "Vidéosurveillance",
  antennes: "Antennes paraboliques / réception TV",
  solaire: "Panneaux photovoltaïques",
  maintenance: "Maintenance technique",
  depannage: "Dépannage"
}[requestedService];
if (serviceSelect && serviceFromLink) {
  serviceSelect.value = serviceFromLink;
}

const assistantTranscript = document.querySelector("#assistant-transcript");
const assistantChoices = document.querySelector("#assistant-choices");
const assistantInputForm = document.querySelector("#assistant-input-form");
const assistantInput = document.querySelector("#assistant-input");
const assistantReset = document.querySelector("#assistant-reset");

if (assistantTranscript && assistantChoices && assistantInputForm && assistantInput) {
  const assistantState = { step: "service", service: "", building: "", location: "", details: "" };
  const buildingTypes = ["Maison", "Appartement", "Boutique / commerce", "Bureau", "École / hôtel / restaurant", "Entrepôt / chantier", "Autre"];

  function addAssistantMessage(text, kind = "bot") {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-message-${kind}`;
    const content = document.createElement("span");
    content.textContent = text;
    message.append(content);
    assistantTranscript.append(message);
    assistantTranscript.scrollTop = assistantTranscript.scrollHeight;
  }

  function createChoiceButton(label, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.assistantValue = value;
    assistantChoices.append(button);
  }

  function askBuilding() {
    assistantState.step = "building";
    assistantInput.disabled = true;
    assistantInput.placeholder = "Choisissez un type de bâtiment…";
    assistantChoices.hidden = false;
    buildingTypes.forEach((type) => createChoiceButton(type, type));
    addAssistantMessage("Merci. De quel type de bâtiment s’agit-il ?");
  }

  function finishAssistant() {
    assistantState.step = "done";
    assistantInput.disabled = true;
    assistantInput.placeholder = "Votre résumé est prêt.";
    assistantInputForm.querySelector("button").disabled = true;
    assistantChoices.hidden = true;

    const summary = [
      "Bonjour LAM ELECTROTECH, je souhaite être orienté pour cette demande.",
      "",
      `Service : ${assistantState.service}`,
      `Bâtiment : ${assistantState.building}`,
      `Commune : ${assistantState.location}`,
      `Besoin : ${assistantState.details}`,
      "",
      "Merci de me recontacter pour étudier la demande."
    ].join("\n");
    const message = encodeURIComponent(summary);
    const actions = document.createElement("div");
    actions.className = "assistant-result-actions";

    [["2290196666193", "+229 01 96 66 61 93"], ["2290140193552", "+229 01 40 19 35 52"]].forEach(([number, label]) => {
      const link = document.createElement("a");
      link.href = `https://wa.me/${number}?text=${message}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `Continuer sur WhatsApp · ${label}`;
      actions.append(link);
    });

    const call = document.createElement("a");
    call.href = "tel:+2290196666193";
    call.className = "assistant-call-link";
    call.textContent = "Ou appeler LAM ELECTROTECH";
    actions.append(call);

    const result = document.createElement("div");
    result.className = "assistant-message assistant-message-bot";
    const text = document.createElement("span");
    text.textContent = "Votre résumé est prêt. Vous pourrez encore le relire et le modifier dans WhatsApp avant de l’envoyer. Les réponses ne quittent pas cette page tant que vous ne cliquez pas sur WhatsApp.";
    result.append(text, actions);
    assistantTranscript.append(result);
    assistantTranscript.scrollTop = assistantTranscript.scrollHeight;
  }

  function selectService(service) {
    assistantState.service = service;
    assistantState.step = "building";
    assistantChoices.replaceChildren();
    assistantChoices.hidden = true;
    addAssistantMessage(service, "user");

    if (service === "Dépannage") {
      addAssistantMessage("Décrivez seulement les symptômes observés ; cet assistant ne peut pas diagnostiquer une panne. En cas de fumée, d’odeur de brûlé, d’étincelles ou d’échauffement important, éloignez-vous. Ne touchez pas à l’installation et contactez un professionnel.");
    } else {
      const prompts = {
        "Électricité bâtiment": "Nous allons préparer les informations utiles pour une demande en électricité bâtiment.",
        "Vidéosurveillance": "Pour orienter la demande, indiquez le type de bâtiment et les espaces à protéger.",
        "Antennes paraboliques / réception TV": "Pour orienter la demande, nous noterons le type de bâtiment et l’état de la réception.",
        "Panneaux photovoltaïques": "Une étude solaire dépend des usages réels. Aucun dimensionnement automatique ne sera déduit de ces réponses.",
        "Maintenance technique": "Le contenu d’une maintenance dépend des équipements réellement présents et sera confirmé avec l’entreprise.",
        "Autre demande": "Décrivez brièvement votre besoin pour que l’entreprise puisse vous orienter."
      };
      addAssistantMessage(prompts[service] || "Nous allons préparer les informations utiles pour votre demande.");
    }

    askBuilding();
  }

  assistantChoices.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-assistant-service], [data-assistant-value]");
    if (!choice || assistantState.step === "done") return;

    if (choice.dataset.assistantService) {
      selectService(choice.dataset.assistantService);
      return;
    }

    assistantState.building = choice.dataset.assistantValue;
    addAssistantMessage(assistantState.building, "user");
    assistantChoices.replaceChildren();
    assistantChoices.hidden = true;
    assistantState.step = "location";
    assistantInput.disabled = false;
    assistantInput.maxLength = 100;
    assistantInput.placeholder = "Indiquez votre commune (ex. : Cotonou)…";
    assistantInputForm.querySelector("button").disabled = false;
    assistantInput.focus();
    addAssistantMessage("Dans quelle commune se trouve le projet ou le bâtiment ?");
  });

  assistantInputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = assistantInput.value.trim();
    if (!answer || assistantState.step === "done" || assistantState.step === "service" || assistantState.step === "building") return;

    addAssistantMessage(answer, "user");
    assistantInput.value = "";

    if (assistantState.step === "location") {
      assistantState.location = answer;
      assistantState.step = "details";
      assistantInput.maxLength = 500;
      assistantInput.placeholder = "Décrivez votre besoin en quelques mots…";
      addAssistantMessage("Merci. Décrivez en une ou deux phrases le projet ou les symptômes. N’envoyez pas de données personnelles sensibles.");
      assistantInput.focus();
      return;
    }

    if (assistantState.step === "details") {
      assistantState.details = answer;
      addAssistantMessage("Merci, les informations nécessaires pour préparer le premier contact sont réunies.");
      finishAssistant();
    }
  });

  assistantReset?.addEventListener("click", () => {
    Object.assign(assistantState, { step: "service", service: "", building: "", location: "", details: "" });
    assistantTranscript.replaceChildren();
    const greeting = document.createElement("div");
    greeting.className = "assistant-message assistant-message-bot";
    const text = document.createElement("span");
    text.textContent = "Bonjour ! Quel sujet souhaitez-vous préparer ? Je peux vous aider à formuler votre demande, mais pas diagnostiquer une panne à distance.";
    greeting.append(text);
    assistantChoices.replaceChildren();
    assistantTranscript.append(greeting, assistantChoices);
    assistantChoices.hidden = false;
    [
      ["Électricité", "Électricité bâtiment"],
      ["Vidéosurveillance", "Vidéosurveillance"],
      ["Antenne & réception TV", "Antennes paraboliques / réception TV"],
      ["Panneaux solaires", "Panneaux photovoltaïques"],
      ["Panne / dépannage", "Dépannage"],
      ["Maintenance", "Maintenance technique"],
      ["Autre demande", "Autre demande"]
    ].forEach(([label, value]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.assistantService = value;
      assistantChoices.append(button);
    });
    assistantState.step = "service";
    assistantInput.value = "";
    assistantInput.disabled = true;
    assistantInput.maxLength = 240;
    assistantInput.placeholder = "Choisissez un sujet pour commencer…";
    assistantInputForm.querySelector("button").disabled = true;
    assistantTranscript.scrollTop = 0;
  });
}

const guideSearch = document.querySelector("#guide-search");
const guideCards = [...document.querySelectorAll(".guide-card")];
const guideFilters = [...document.querySelectorAll("[data-guide-filter]")];
const guideCount = document.querySelector("#guide-count");
const guideEmpty = document.querySelector("#guide-empty");
let activeGuideFilter = "all";

function filterGuides() {
  const query = guideSearch?.value.trim().toLocaleLowerCase("fr") || "";
  let count = 0;
  guideCards.forEach((card) => {
    const matchesCategory = activeGuideFilter === "all" || card.dataset.guideCategory === activeGuideFilter;
    const matchesQuery = !query || `${card.dataset.guideSearch} ${card.textContent}`.toLocaleLowerCase("fr").includes(query);
    const visible = matchesCategory && matchesQuery;
    card.hidden = !visible;
    if (visible) count += 1;
  });
  if (guideCount) guideCount.textContent = `${count} conseil${count === 1 ? "" : "s"}`;
  if (guideEmpty) guideEmpty.hidden = count !== 0;
}

guideSearch?.addEventListener("input", filterGuides);
guideFilters.forEach((filter) => filter.addEventListener("click", () => {
  activeGuideFilter = filter.dataset.guideFilter;
  guideFilters.forEach((button) => {
    const active = button === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  filterGuides();
}));

const faqSearch = document.querySelector("#faq-search");
const faqItems = [...document.querySelectorAll(".faq-list details")];
const faqEmpty = document.querySelector("#faq-empty");
faqSearch?.addEventListener("input", () => {
  const query = faqSearch.value.trim().toLocaleLowerCase("fr");
  let count = 0;
  faqItems.forEach((item) => {
    const matches = item.textContent.toLocaleLowerCase("fr").includes(query);
    item.hidden = !matches;
    if (matches) count += 1;
  });
  if (faqEmpty) faqEmpty.hidden = count !== 0;
});

const connectionStatus = document.querySelector("#connection-status");
function updateConnectionStatus() {
  if (connectionStatus) connectionStatus.hidden = navigator.onLine;
}
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => {
        console.error("Impossible d’activer le mode hors connexion LAM ELECTROTECH.", error);
      });
  });
}
