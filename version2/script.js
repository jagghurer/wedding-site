const SCRIPT_URL =
  window.SCRIPT_URL || "https://script.google.com/macros/s/AKfycbya-Bxo9KXIX4cJNML5YOokamkQ4hPPRS2V_GcfxWJvTcTfzlOLYd5qc_q5FYlPSqcI4g/exec";
const isPlaceholderScript = SCRIPT_URL.includes("ВАШ_SCRIPT_ID");

// Таймер
const weddingDate = new Date("2026-10-01T15:00:00");
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (diff <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "0";
    minutesEl.textContent = "0";
    secondsEl.textContent = "0";
    return;
  }

  daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((diff / (1000 * 60)) % 60);
  secondsEl.textContent = Math.floor((diff / 1000) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Персональное приветствие
const params = new URLSearchParams(window.location.search);
const guestId = params.get("guest") || "";

const guestEntries = [
  {
    aliases: [
      "anna_evgeniy_vashchenko",
      "anna-i-evgeniy-vashchenko",
      "anna evgeniy vashchenko",
      "анна и евгений ващенко",
      "анна и евгений",
    ],
    displayName: "Анна и Евгений",
    greeting: "Дорогие Анна и Евгений",
    formName: "Анна и Евгений",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "polina_vashchenko",
      "полина ващенко",
      "полина",
    ],
    displayName: "Полина",
    greeting: "Дорогая Полина",
    formName: "Полина",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "tatyana_prohorova",
      "татьяна прохорова",
      "татьяна",
    ],
    displayName: "Татьяна",
    greeting: "Дорогая Татьяна",
    formName: "Татьяна",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "nadezhda_valentin_vashchenko",
      "nadezhda-i-valentin-vashchenko",
      "надежда и валентин ващенко",
      "надежда и валентин",
    ],
    displayName: "Надежда и Валентин",
    greeting: "Дорогие Надежда и Валентин",
    formName: "Надежда и Валентин",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "elena_dmitriy_buntovy",
      "елена и дмитрий бунтовы",
      "елена и дмитрий",
    ],
    displayName: "Елена и Дмитрий",
    greeting: "Дорогие Елена и Дмитрий",
    formName: "Елена и Дмитрий",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "anna_buntova",
      "анна бунтова",
      "анна",
    ],
    displayName: "Анна",
    greeting: "Дорогая Анна",
    formName: "Анна",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "anton_buntov",
      "антон бунтов",
      "антон",
    ],
    displayName: "Антон",
    greeting: "Дорогой Антон",
    formName: "Антон",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "olga_dmitriy_elizaveta_zemlyanskie",
      "ольга дмитрий и елизавета землянские",
      "ольга и дмитрий и елизавета",
    ],
    displayName: "Ольга, Дмитрий и Елизавета",
    greeting: "Дорогие Ольга, Дмитрий и Елизавета",
    formName: "Ольга, Дмитрий и Елизавета",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "alexandra_aleksandr_revyakin",
      "александра и александр ревякин",
      "александра и александр",
    ],
    displayName: "Александра и Александр",
    greeting: "Дорогие Александра и Александр",
    formName: "Александра и Александр",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "ekaterina_gabovda",
      "екатерина габовда",
      "екатерина",
    ],
    displayName: "Екатерина",
    greeting: "Дорогая Екатерина",
    formName: "Екатерина",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "elena_geraskina",
      "елена гераскина",
      "елена",
    ],
    displayName: "Елена",
    greeting: "Дорогая Елена",
    formName: "Елена",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "pavel_geraskin",
      "павел гераскин",
      "павел",
    ],
    displayName: "Павел",
    greeting: "Дорогой Павел",
    formName: "Павел",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "taisa_ivashchenko",
      "таиса иващенко",
      "таиса",
    ],
    displayName: "Таиса",
    greeting: "Дорогая Таиса",
    formName: "Таиса",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "vadim_linnik",
      "вадим линник",
      "вадим",
    ],
    displayName: "Вадим",
    greeting: "Дорогой Вадим",
    formName: "Вадим",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "olga_dmitriy_linnik",
      "ольга и дмитрий линник",
      "ольга и дмитрий",
    ],
    displayName: "Ольга и Дмитрий",
    greeting: "Дорогие Ольга и Дмитрий",
    formName: "Ольга и Дмитрий",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "maksim_nataliya_dmitriy_geraskiny",
      "максим наталья и дмитрий гераскины",
      "максим наталья дмитрий",
    ],
    displayName: "Максим, Наталья и Дмитрий",
    greeting: "Дорогие Максим, Наталья и Дмитрий",
    formName: "Максим, Наталья и Дмитрий",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
  {
    aliases: [
      "eduard_aleksandrov",
      "эдуард александров",
      "эдуард",
    ],
    displayName: "Эдуард",
    greeting: "Дорогой Эдуард",
    formName: "Эдуард",
    heroText: "Мы рады пригласить вас разделить с нами этот особенный день.",
  },
];

const defaultGuest = {
  displayName: "наш дорогой гость",
  greeting: "Дорогой гость",
  formName: "Наш дорогой гость",
  heroText: "Мы приглашаем вас разделить с нами этот особенный день.",
};

function normalizeGuestValue(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, " ")
    .trim();
}

function resolveGuest(rawGuest) {
  const normalized = normalizeGuestValue(rawGuest);
  if (!normalized) return defaultGuest;

  const directMatch = guestEntries.find((entry) =>
    entry.aliases.some((alias) => normalizeGuestValue(alias) === normalized)
  );
  if (directMatch) return directMatch;

  const byDisplayName = guestEntries.find(
    (entry) => normalizeGuestValue(entry.displayName) === normalized
  );
  if (byDisplayName) return byDisplayName;

  return defaultGuest;
}

const guestData = resolveGuest(guestId);
const welcome = document.getElementById("guestWelcome");
if (welcome) welcome.textContent = guestData.greeting;

const guestGreeting = document.getElementById("guestGreeting");
if (guestGreeting) {
  guestGreeting.textContent = "";
}

const heroInvitation = document.getElementById("heroInvitation");
if (heroInvitation) {
  heroInvitation.textContent = guestData.heroText;
}

const guestNameInput = document.getElementById("guestNameInput");
if (guestNameInput) {
  guestNameInput.value = guestData.formName;
}

// Анимации для всех секций, кроме RSVP
const sections = document.querySelectorAll(".section:not(.rsvp)");
if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.6 }
  );
  sections.forEach((section) => observer.observe(section));
}

// Плавный скролл к опроснику
const rsvpLink = document.getElementById("rsvpLink");
if (rsvpLink) {
  rsvpLink.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector("#rsvp");
    if (!target) return;

    const html = document.documentElement;
    const oldScrollSnap = html.style.scrollSnapType;
    html.style.scrollSnapType = "none";

    target.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      html.style.scrollSnapType = oldScrollSnap;
    }, 600);
  });
}

const allergySelect = document.getElementById("allergySelect");
const allergyCommentField = document.getElementById("allergyCommentField");
if (allergySelect && allergyCommentField) {
  allergySelect.addEventListener("change", function () {
    allergyCommentField.style.display =
      this.value === "Есть (комментарий)" ? "block" : "none";
  });
}

function attachMutualExclusion(groupSelector, noneValue) {
  const group = document.querySelector(groupSelector);
  if (!group) return;

  group.addEventListener("change", function (event) {
    const changedInput = event.target;
    if (!(changedInput instanceof HTMLInputElement)) return;

    const allInputs = Array.from(group.querySelectorAll('input[type="checkbox"]'));
    const noneInput = allInputs.find((input) => input.value === noneValue);
    if (!noneInput) return;

    if (changedInput === noneInput) {
      if (changedInput.checked) {
        allInputs.forEach((input) => {
          if (input !== noneInput) input.checked = false;
        });
      }
      return;
    }

    if (changedInput.checked && noneInput.checked) {
      noneInput.checked = false;
    }
  });
}

attachMutualExclusion('[data-none-value="не пью"]', "не пью");
attachMutualExclusion('[data-none-value="нет предпочтений"]', "нет предпочтений");

// Отправка формы
const form = document.getElementById("rsvpForm");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    if (!btn) return;

    btn.disabled = true;
    btn.textContent = "Отправка...";

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.guestId = guestId;
    payload.guestDisplayName = guestData.displayName;
    payload.guestFormName = guestData.formName;
    payload.name = guestData.displayName;
    payload.transfer = data.getAll("transfer");
    payload.alcohol = data.getAll("alcohol");
    payload.soft_drinks = data.getAll("soft_drinks");
    if (data.get("soft_drinks_comment")) {
      payload.soft_drinks_comment = data.get("soft_drinks_comment");
    }

    try {
      if (isPlaceholderScript) {
        throw new Error("Endpoint not configured");
      }

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      form.style.display = "none";
      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.innerHTML = `
          <h3>Спасибо, ${guestData.displayName} ❤️</h3>
          <p>Мы получили ваш ответ и будем счастливы разделить этот день с вами.</p>
        `;
      }
    } catch (err) {
      form.style.display = "none";
      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.innerHTML = `
          <h3>Спасибо, ${guestData.displayName || "за ответ"} ❤️</h3>
          <p>Мы получили ваш ответ. В ближайшее время свяжемся с вами.</p>
        `;
      }
      btn.disabled = false;
      btn.textContent = "Отправить ответ";
    }
  });
}
