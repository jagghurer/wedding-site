const SCRIPT_URL =
  window.SCRIPT_URL || "https://script.google.com/macros/s/AKfycbya-Bxo9KXIX4cJNML5YOokamkQ4hPPRS2V_GcfxWJvTcTfzlOLYd5qc_q5FYlPSqcI4g/exec";
const isPlaceholderScript = SCRIPT_URL.includes("ВАШ_SCRIPT_ID");

// Дефолтный гость — единственное, что остаётся на клиенте
const defaultGuest = {
  displayName: "наш дорогой гость",
  greeting: "Дорогой гость",
  formName: "Наш дорогой гость",
  heroText: "Мы приглашаем вас разделить с нами этот особенный день.",
};

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

// Персональное приветствие — получаем с сервера
const params = new URLSearchParams(window.location.search);
const guestId = params.get("guest") || "";

async function getGuestData(guestId) {
  if (!guestId) return defaultGuest;
  
  try {
    const response = await fetch(`${SCRIPT_URL}?guest=${encodeURIComponent(guestId)}`);
    const data = await response.json();
    return (data.success && data.guest) ? data.guest : defaultGuest;
  } catch (err) {
    console.warn("Не удалось загрузить данные гостя, используется гость по умолчанию", err);
    return defaultGuest;
  }
}

// Инициализация страницы
async function initPage() {
  const guestData = await getGuestData(guestId);
  
  const welcome = document.getElementById("guestWelcome");
  if (welcome) welcome.textContent = guestData.greeting;

  const heroInvitation = document.getElementById("heroInvitation");
  if (heroInvitation) {
    heroInvitation.textContent = guestData.heroText;
  }

  const guestNameInput = document.getElementById("guestNameInput");
  if (guestNameInput) {
    guestNameInput.value = guestData.formName;
  }

  // Сохраняем данные гостя для формы
  window._guestData = guestData;
}

// Ждём загрузки DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
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

    const guestData = window._guestData || defaultGuest;
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