const GITHUB_USER = "FickleBoBo";
const NAV_SCROLL_THRESHOLD = 60;
const TOP_BTN_THRESHOLD = 300;
const REVEAL_THRESHOLD = 0.2;

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const escapeHtml = (text = "") =>
  text.replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );

/* ---------- 네비게이션 ---------- */
const header = document.querySelector("#site-header");
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");
const scrollTopBtn = document.querySelector("#scroll-top");

const nav = { menuOpen: false, scrollY: 0 };

const renderNav = () => {
  const { menuOpen, scrollY } = nav;
  navMenu.classList.toggle("active", menuOpen);
  hamburger.classList.toggle("active", menuOpen);
  hamburger.setAttribute("aria-expanded", menuOpen);
  header.classList.toggle(
    "scrolled",
    menuOpen || scrollY >= NAV_SCROLL_THRESHOLD,
  );
  scrollTopBtn.classList.toggle("show", scrollY >= TOP_BTN_THRESHOLD);
};

hamburger.addEventListener("click", () => {
  nav.menuOpen = !nav.menuOpen;
  renderNav();
});

document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    nav.menuOpen = false;
    renderNav();
  }),
);

window.addEventListener(
  "scroll",
  () => {
    nav.scrollY = window.scrollY;
    renderNav();
  },
  { passive: true },
);

scrollTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* ---------- 다크 모드 ---------- */
const themeToggle = document.querySelector("#theme-toggle");

const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* 저장 불가 환경 */
    }
  },
};

const themeState = { dark: storage.get("theme") === "dark" };

const renderTheme = () => {
  const { dark } = themeState;
  if (dark) document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
};

themeToggle.addEventListener("click", () => {
  themeState.dark = !themeState.dark;
  storage.set("theme", themeState.dark ? "dark" : "light");
  renderTheme();
});

/* ---------- 스크롤 애니메이션 ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries
      .filter(({ isIntersecting }) => isIntersecting)
      .forEach(({ target }) => {
        target.classList.add("visible");
        observer.unobserve(target);
      });
  },
  { threshold: REVEAL_THRESHOLD },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ---------- Projects (GitHub API) ---------- */
const projectsRoot = document.querySelector("#projects-root");
const projectState = { status: "loading", repos: [], error: "" };

const card = ({
  name,
  html_url,
  description,
  language,
  stargazers_count,
  updated_at,
}) => `
  <article class="project-card">
    <h3 class="project-name"><a href="${escapeHtml(html_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a></h3>
    <p class="project-desc">${escapeHtml(description ?? "설명이 없습니다.")}</p>
    <p class="project-meta">
      <span>${escapeHtml(language ?? "-")}</span>
      <span>★ ${stargazers_count}</span>
      <span>${new Date(updated_at).toLocaleDateString("ko-KR")}</span>
    </p>
  </article>`;

const stateBox = (title, extra = "") =>
  `<div class="state-box"><p class="state-title">${title}</p>${extra}</div>`;

const views = {
  loading: () => stateBox("로딩 중...", '<div class="spinner"></div>'),
  empty: () => stateBox("표시할 프로젝트가 없습니다."),
  error: ({ error }) =>
    stateBox(
      "프로젝트를 불러올 수 없습니다.",
      `<p class="state-detail">${escapeHtml(error)}</p><button type="button" class="btn btn-primary" id="retry-btn">다시 시도</button>`,
    ),
  success: ({ repos }) =>
    `<div class="project-grid">${repos.map(card).join("")}</div>`,
};

const renderProjects = () => {
  projectsRoot.innerHTML = views[projectState.status](projectState);
};

const fetchProjects = async () => {
  projectState.status = "loading";
  renderProjects();

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
    );
    if (!res.ok) {
      throw new Error(
        res.status === 403
          ? "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요."
          : `서버 오류 (${res.status})`,
      );
    }
    const repos = (await res.json()).filter(({ fork }) => !fork);
    Object.assign(projectState, {
      status: repos.length ? "success" : "empty",
      repos,
    });
  } catch (err) {
    const error =
      err instanceof TypeError ? "네트워크 연결을 확인해 주세요." : err.message;
    Object.assign(projectState, { status: "error", error });
  }
  renderProjects();
};

projectsRoot.addEventListener("click", ({ target }) => {
  if (target.closest("#retry-btn")) fetchProjects();
});

/* ---------- Contact 폼 ---------- */
const form = document.querySelector("#contact-form");
const successMsg = document.querySelector("#form-success");

const rules = {
  name: (v) => (v.trim() ? "" : "이름을 입력해 주세요."),
  email: (v) =>
    !v.trim()
      ? "이메일을 입력해 주세요."
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ""
        : "올바른 이메일 형식이 아닙니다.",
  message: (v) => (v.trim() ? "" : "메시지를 입력해 주세요."),
};
const fields = Object.keys(rules);
const formState = { touched: new Set(), submitted: false };

const getError = (field) => rules[field](form.elements[field].value);

const renderForm = () => {
  const { touched, submitted } = formState;
  fields.forEach((field) => {
    const message = touched.has(field) || submitted ? getError(field) : "";
    document.querySelector(`#${field}-error`).textContent = message;
    form.elements[field].classList.toggle("invalid", Boolean(message));
    form.elements[field].setAttribute("aria-invalid", Boolean(message));
  });
};

fields.forEach((field) => {
  const touch = () => {
    formState.touched.add(field);
    renderForm();
  };
  form.elements[field].addEventListener("input", () => {
    successMsg.textContent = "";
    touch();
  });
  form.elements[field].addEventListener("blur", touch);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formState.submitted = true;
  renderForm();

  const invalid = fields.find(getError);
  if (invalid) {
    form.elements[invalid].focus();
    return;
  }

  const { name } = form.elements;
  successMsg.textContent = `${name.value.trim()}님, 메시지가 전송되었습니다. 감사합니다!`;
  form.reset();
  Object.assign(formState, { touched: new Set(), submitted: false });
  renderForm();
});

renderTheme();
renderNav();
fetchProjects();
