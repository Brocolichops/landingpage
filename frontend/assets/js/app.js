(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const storageKey = "cv_estimate_v2";

  

  const money = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      : String(n);

  function setYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initNav() {
    const toggle = $(".nav-toggle");
    const menu = $("#navMenu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function loadEstimate() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || null; }
    catch { return null; }
  }
  function saveEstimate(obj) {
    localStorage.setItem(storageKey, JSON.stringify(obj));
  }

  function estimateToText(est) {
    if (!est?.packageId && !est?.postOnly) return "No estimate selected yet.";
    const lines = [];

    if (est.postOnly) {
      lines.push(`Post-Only Service: ${est.postOnlyName} (${money(est.postOnlyPrice)})`);
    } else {
      lines.push(`Package: ${est.packageName} (${money(est.basePrice)})`);

      if (est.addonsFixed?.length) {
        lines.push("");
        lines.push("Add-ons (fixed):");
        est.addonsFixed.forEach(a => lines.push(`- ${a.name} (${money(a.price)})`));
      }

      if (est.addonsQuoted?.length) {
        lines.push("");
        lines.push("Add-ons (quoted/range):");
        est.addonsQuoted.forEach(a => lines.push(`- ${a.name} (${a.priceNote})`));
      }

      if (est.rushDays) {
        lines.push("");
        lines.push(`Rush: ${est.rushDays} day(s) — ${money(est.rushCost)} (cap $600)`);
      }

      lines.push("");
      lines.push(`Estimated total: ${money(est.total)}`);
    }

    lines.push("");
    lines.push(`Credit required: ${window.CV_DATA.business.creditLine}`);

    return lines.join("\n");
  }

  // ---------- Packages page cards + modal ----------
  function initPackagesCards() {
    const wrap = $("#packageCards");
    if (!wrap) return;

    const modal = $("#pkgModal");
    const modalTitle = $("#modalTitle");
    const modalSubtitle = $("#modalSubtitle");
    const modalIncludes = $("#modalIncludes");
    const modalTimeline = $("#modalTimeline");
    const modalBestFor = $("#modalBestFor");
    let activePkg = null;

    window.CV_DATA.packages.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3 class="card-title">${p.name} — ${money(p.price)}</h3>
        <p class="muted">${p.description}</p>
        <div class="divider"></div>
        <button class="btn btn-primary btn-block" type="button" data-open="${p.id}">View details</button>
      `;
      wrap.appendChild(card);
    });

    function openModal(pkg) {
      activePkg = pkg;
      if (modalTitle) modalTitle.textContent = `${pkg.name} — ${money(pkg.price)}`;
      if (modalSubtitle) modalSubtitle.textContent = pkg.description;
      if (modalIncludes) modalIncludes.innerHTML = pkg.includes.map(x => `<li>${x}</li>`).join("");
      if (modalTimeline) modalTimeline.innerHTML = pkg.timeline.map(x => `<li>${x}</li>`).join("");
      if (modalBestFor) modalBestFor.textContent = pkg.bestFor;
      modal?.showModal();
    }

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (!btn) return;
      const pkg = window.CV_DATA.packages.find(p => p.id === btn.getAttribute("data-open"));
      if (pkg) openModal(pkg);
    });

    $("[data-close-modal]", modal)?.addEventListener("click", () => modal.close());

    $("[data-add-to-estimate]", modal)?.addEventListener("click", () => {
      if (!activePkg) return;
      // Clear post-only if a package is added
      const prev = loadEstimate() || {};
      const next = {
        ...prev,
        postOnly: null,
        packageId: activePkg.id,
        packageName: activePkg.name,
        basePrice: activePkg.price
      };
      saveEstimate(next);
      modal.close();
      alert("Package saved. Scroll to the estimator to finish your estimate.");
    });
  }

  // ---------- Estimator ----------
  function initEstimator() {
    const radiosWrap = $("#estPackageRadios");
    const addonsWrap = $("#estAddons");
    const totalEl = $("#estimateTotal");
    const rushEl = $("#rushDays");
    const noteEl = $("#estimateNote");
    if (!radiosWrap || !addonsWrap || !totalEl || !rushEl) return;

    const saved = loadEstimate();

    // Package radios
    radiosWrap.innerHTML = window.CV_DATA.packages.map(p => {
      const checked = saved?.packageId === p.id ? "checked" : "";
      return `
        <div class="checkrow">
          <label>
            <input type="radio" name="pkg" value="${p.id}" ${checked} />
            <div>
              <div><strong>${p.name}</strong></div>
              <small>${p.description}</small>
            </div>
          </label>
          <div class="price">${money(p.price)}</div>
        </div>
      `;
    }).join("");

    // Add-on checkboxes
    addonsWrap.innerHTML = window.CV_DATA.addons.map(a => {
      const isFixed = a.type === "fixed";
      const right = isFixed ? money(a.price) : (a.priceNote || "Quoted");
      return `
        <div class="checkrow">
          <label>
            <input type="checkbox" data-addon="${a.id}" />
            <div>
              <div><strong>${a.name}</strong></div>
              <small>${isFixed ? "Fixed add-on" : "Quoted / range item (we confirm final cost)"}</small>
            </div>
          </label>
          <div class="price">${right}</div>
        </div>
      `;
    }).join("");

    // Restore saved addon checks
    const savedAddonIds = new Set([...(saved?.addonsFixed || []), ...(saved?.addonsQuoted || [])].map(x => x.id));
    $$("input[type='checkbox'][data-addon]").forEach(cb => {
      if (savedAddonIds.has(cb.getAttribute("data-addon"))) cb.checked = true;
    });
    rushEl.value = String(saved?.rushDays || 0);

    function compute() {
      const pkgId = $("input[name='pkg']:checked")?.value || null;
      const pkg = window.CV_DATA.packages.find(p => p.id === pkgId);

      const checkedAddons = $$("input[type='checkbox'][data-addon]").filter(cb => cb.checked);
      const addonsFixed = [];
      const addonsQuoted = [];

      checkedAddons.forEach(cb => {
        const id = cb.getAttribute("data-addon");
        const a = window.CV_DATA.addons.find(x => x.id === id);
        if (!a) return;
        if (a.type === "fixed") addonsFixed.push({ id: a.id, name: a.name, price: a.price });
        else addonsQuoted.push({ id: a.id, name: a.name, priceNote: a.priceNote || "Quoted" });
      });

      const rushDays = Math.min(Math.max(0, Number(rushEl.value || 0)), 10);
      const rushCost = Math.min(rushDays * 200, 600);

      const base = pkg ? pkg.price : 0;
      const fixedTotal = addonsFixed.reduce((sum, a) => sum + (a.price || 0), 0);
      const total = base + fixedTotal + rushCost;

      const prev = loadEstimate() || {};
      const estimate = {
        ...prev,
        packageId: pkg?.id || null,
        packageName: pkg?.name || "",
        basePrice: base,
        addonsFixed,
        addonsQuoted,
        rushDays,
        rushCost,
        total,
        createdAt: new Date().toISOString(),
        postOnly: null
      };

      saveEstimate(estimate);
      totalEl.textContent = money(total);

      if (noteEl) {
        noteEl.textContent = addonsQuoted.length
          ? "Note: quoted/range items are not included in the total above until confirmed."
          : "";
      }
    }

    radiosWrap.addEventListener("change", compute);
    addonsWrap.addEventListener("change", compute);
    rushEl.addEventListener("input", compute);

    compute();
  }

  // ---------- Post-only cards and bottom button ----------
  function initPostOnly() {
    const wrap = $("#postOnlyCards");
    if (wrap) {
      wrap.innerHTML = window.CV_DATA.postOnly.map(p => `
        <article class="card">
          <h3 class="card-title">${p.name}</h3>
          <p class="muted">Pricing: <strong style="color:var(--accentText);">${p.priceNote}</strong></p>
          <div class="divider"></div>
          <button class="btn btn-primary btn-block postonly-btn" data-id="${p.id}">Request this service</button>
        </article>
      `).join("");
    }

    function selectPostOnly(p) {
      const prev = loadEstimate() || {};
      const next = {
        ...prev,
        postOnly: p.id,
        postOnlyName: p.name,
        postOnlyPrice: p.price || 0,
        packageId: null,
        packageName: null,
        basePrice: 0,
        addonsFixed: [],
        addonsQuoted: [],
        rushDays: 0,
        rushCost: 0,
        total: p.price || 0
      };
      saveEstimate(next);
      alert("Post-Only service selected. Scroll to the estimator to finish your estimate.");
      // Navigate to contact page
      window.location.href = "contact.html#bookingForm";
    }

    wrap?.addEventListener("click", e => {
      const btn = e.target.closest(".postonly-btn");
      if (!btn) return;
      const pkg = window.CV_DATA.postOnly.find(p => p.id === btn.getAttribute("data-id"));
      if (pkg) selectPostOnly(pkg);
    });

    const bottomBtn = $("#postonly a.btn-primary");
    if (bottomBtn) {
      bottomBtn.addEventListener("click", e => {
        e.preventDefault();
        const pkg = window.CV_DATA.postOnly[0]; // select first post-only package
        if (pkg) selectPostOnly(pkg);
      });
    }
  }

  // ---------- Contact page form ----------
  function initContactPage() {
    const estimateBox = $("#estimateSummary");
    const emailLink = $("#bookingEmailLink");
    const form = $("#contactForm");
    const msg = $("#formMsg");

    if (estimateBox) estimateBox.value = estimateToText(loadEstimate());
    if (emailLink) {
      emailLink.textContent = window.CV_DATA.business.bookingEmail;
      emailLink.href = "#"; // disable mailto
    }

    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#name")?.value?.trim();
      const email = $("#email")?.value?.trim();
      if (!name || !email) {
        if (msg) msg.textContent = "Please fill in name and email.";
        return;
      }

      const projectType = $("#projectType")?.value || "";
      const preferredDate = $("#preferredDate")?.value || "";
      const songLink = $("#songLink")?.value || "";
      const notes = $("#notes")?.value || "";

      fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          projectType,
          preferredDate,
          songLink,
          notes,
          estimate: estimateToText(loadEstimate())
        })
      })
      .then(res => res.json())
      .then(() => {
        if (msg) msg.textContent = "Message sent successfully!";
        form.reset();
      })
      .catch(() => {
        if (msg) msg.textContent = "Failed to send message. Please try again.";
      });
    });
      fetch('https://landingpage-production-209e.up.railway.app/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

  }

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initNav();
    initPackagesCards();
    initEstimator();
    initPostOnly();
    initContactPage();
  });
})();
