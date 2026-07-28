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

// Дефолтный гость
const defaultGuest = {
  displayName: "Дорогой гость",
  greeting: "Дорогой гость",
  formName: "Дорогой гость",
  heroText: "Мы приглашаем вас разделить с нами этот особенный день.",
};

// Создаём загрузочный экран
const loaderHTML = `
  <div id="weddingLoader" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #faf8f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
    font-family: 'Cormorant Garamond', serif;
  ">
    <div style="
      width: 50px;
      height: 50px;
      border: 2px solid #d4c5b9;
      border-top: 2px solid #8b7d6b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    "></div>
    <p style="color: #8b7d6b; font-size: 18px; letter-spacing: 2px;">Загрузка...</p>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>
`;

document.body.insertAdjacentHTML("afterbegin", loaderHTML);

// Скрываем весь контент пока грузится
const mainContent = document.querySelector(".container") || document.body.children;
// Добавляем класс для скрытия
document.documentElement.style.visibility = "hidden";

const loader = document.getElementById("weddingLoader");

function hideLoader() {
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.remove();
      document.documentElement.style.visibility = "visible";
    }, 500);
  }
}

// Если нет гостя в URL — сразу показываем
const params = new URLSearchParams(window.location.search);
const guestId = params.get("guest") || "";

if (!guestId) {
  window._guestData = defaultGuest;
  hideLoader();
}

// Загружаем данные гостя
async function loadGuestData() {
  if (!guestId) return;

  try {
    const response = await fetch(`${SCRIPT_URL}?guest=${encodeURIComponent(guestId)}`);
    const data = await response.json();
    
    if (data.success && data.guest) {
      window._guestData = data.guest;
    } else {
      window._guestData = defaultGuest;
    }
  } catch (err) {
    window._guestData = defaultGuest;
  }
  
  // Применяем данные
  applyGuestData(window._guestData);
  // Показываем сайт
  hideLoader();
}

function applyGuestData(guestData) {
  const welcome = document.getElementById("guestWelcome");
  const heroInvitation = document.getElementById("heroInvitation");
  const guestNameInput = document.getElementById("guestNameInput");
  
  if (welcome) welcome.textContent = guestData.greeting;
  if (heroInvitation) heroInvitation.textContent = guestData.heroText;
  if (guestNameInput) guestNameInput.value = guestData.formName;
}

// Запускаем загрузку
loadGuestData();

// Таймер запускаем сразу
updateCountdown();
setInterval(updateCountdown, 1000);

// Анимации для всех секций, кроме RSVP
setTimeout(() => {
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
}, 100);

// Плавный скролл к опроснику
setTimeout(() => {
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
}, 100);

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

setTimeout(() => {
  attachMutualExclusion('[data-none-value="не пью"]', "не пью");
  attachMutualExclusion('[data-none-value="нет предпочтений"]', "нет предпочтений");
}, 100);

// Отправка формы
setTimeout(() => {
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
}, 100);