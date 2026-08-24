/* =========================================================
   Index of Work — minimal interaction layer
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- 1. Current year in the colophon ----- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- 2. Projects / publications tabs ----- */
  const tabs = Array.from(document.querySelectorAll("[data-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-tab-panel]"));
  const indexLabel = document.querySelector("[data-index-label]");

  const activateTab = (tab, moveFocus = false) => {
    const target = tab.dataset.tab;

    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== target;
    });

    if (indexLabel) {
      indexLabel.textContent = target === "projects" ? "Index — 05 projects" : "Index — 02 publications";
    }

    if (moveFocus) tab.focus();
    window.dispatchEvent(new Event("scroll"));
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      activateTab(next, true);
    });
  });

  const initialTab = tabs.find((tab) => `#${tab.dataset.tab}` === window.location.hash);
  if (initialTab) activateTab(initialTab);

  /* ----- 3. Reveal each row as it scrolls into view ----- */
  const works = document.querySelectorAll(".work");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    works.forEach((w) => w.classList.remove("is-hidden"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // gentle stagger based on the row's --i index
          const i = parseInt(el.style.getPropertyValue("--i"), 10) || 0;
          el.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
          el.classList.add("is-visible");
          el.classList.remove("is-hidden");
          obs.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    works.forEach((w) => io.observe(w));
  }

  /* ----- 4. Scroll-progress hairline ----- */
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ----- 5. Autoplaying figures respect a reduced-motion preference -----
     A GIF could never be stopped; a <video> can. Hold the poster frame
     and give the viewer controls instead of looping at them. */
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    if (!reduceMotion) return;
    video.autoplay = false;
    video.loop = false;
    video.controls = true;
    video.pause();
  });
})();
