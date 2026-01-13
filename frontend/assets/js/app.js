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
    if (!est?.packageId) return "No estimate selected yet.";
    const lines = [];

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
      // just set the package; estimator section handles add-ons/rush
      const prev = loadEstimate() || {};
      const next = {
        ...prev,
        packageId: activePkg.id,
        packageName: activePkg.name,
        basePrice: activePkg.price
      };
      saveEstimate(next);
      modal.close();
      alert("Package saved. Scroll to the estimator to finish your estimate.");
    });
  }

  // ---------- Estimator (Packages page) ----------
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

      const estimate = {
        packageId: pkg?.id || null,
        packageName: pkg?.name || "",
        basePrice: base,
        addonsFixed,
        addonsQuoted,
        rushDays,
        rushCost,
        total,
        createdAt: new Date().toISOString()
      };

      saveEstimate(estimate);
      totalEl.textContent = money(total);

      if (noteEl) {
        noteEl.textContent = addonsQuoted.length
          ? "Note: Lowest price for quoted items is shown. Final price may vary based on project details."
          : "";
      }
    }

    radiosWrap.addEventListener("change", compute);
    addonsWrap.addEventListener("change", compute);
    rushEl.addEventListener("input", compute);

    compute();
  }

  // ---------- Rules grid on packages page ----------
  function initRules() {
    const rulesGrid = $("#rulesGrid");
    if (!rulesGrid) return;
    rulesGrid.innerHTML = window.CV_DATA.rules.map(r => {
      const items = r.items.map(x => `<li class="rulestex">${x}</li>`).join("");
      return `<div class="card"><h3 class="card-title">${r.title}</h3><ul>${items}</ul></div>`;
    }).join("");
  }

  // ---------- Post-only cards ----------
  function initPostOnly() {
    const wrap = $("#postOnlyCards");
    if (!wrap) return;
    wrap.innerHTML = window.CV_DATA.postOnly.map(p => `
      <article class="card">
        <h3 class="card-title">${p.name}</h3>
        <p class="muted">Pricing: <strong style="color:var(--accentText);">${p.priceNote}</strong></p>
        <div class="divider"></div>
        <a class="btn btn-primary btn-block" href="contact.html#bookingForm">Request this service</a>
      </article>
    `).join("");
  }

  // ---------- Contact page team + estimate fill ----------
  function initContactPage() {
    const teamWrap = $("#teamProfiles");
    const estimateBox = $("#estimateSummary");
    const emailLink = $("#bookingEmailLink");
    const form = $("#contactForm");

    if (emailLink) {
      emailLink.textContent = window.CV_DATA.business.bookingEmail;
      emailLink.href = `mailto:${window.CV_DATA.business.bookingEmail}`;
    }

    if (teamWrap) {
      teamWrap.innerHTML = window.CV_DATA.team.map(m => {
        const links = (m.links || []).map(l => `<a href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`).join(" • ");
        const photoSrc = m.photo || "assets/images/placeholder-team.jpg";
        return `
          <div class="card" style="display:flex; gap:14px; align-items:flex-start;">
            <div class="media" style="width:120px; flex:0 0 120px;">
              <img loading="lazy" src="${photoSrc}" alt="${m.name} photo" width="600" height="600" />
            </div>
            <div>
              <h3 class="team-title" style="margin:0;">${m.name} <span class="team-role">— ${m.role}</span></h3>
              <p class="team-desc">${m.bio}</p>
              <p class="tiny">${links}</p>
            </div>
          </div>
        `;
      }).join("");
    }

    if (estimateBox) estimateBox.value = estimateToText(loadEstimate());

    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = $("#formMsg");
      const submitBtn = form.querySelector("button[type='submit']");

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

      const payload = {
        name,
        email,
        projectType,
        preferredDate,
        songLink,
        notes,
        estimate: estimateToText(loadEstimate())
      };

      try {
        if (submitBtn) submitBtn.disabled = true;
        if (msg) msg.textContent = "Sending…";

        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await resp.json().catch(() => null);
        if (!resp.ok) {
          const err = data?.error || data?.details || 'Server error';
          if (msg) msg.textContent = `Error: ${err}`;
          return;
        }

        if (msg) msg.textContent = 'Message sent — thanks! We will respond shortly.';
        form.reset();
      } catch (err) {
        if (msg) msg.textContent = 'Network error — please try again.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ---------- Talent page rendering with photos ----------
  function initTalentPage() {
    const grid = $("#talentGrid");
    if (!grid) return;

    const searchEl = $("#talentSearch");
    const roleEl = $("#talentRole");
    const locEl = $("#talentLocation");
    const all = window.CV_DATA.talent.slice();

    const roles = Array.from(new Set(all.map(t => t.role))).sort();
    const locs = Array.from(new Set(all.map(t => t.location))).sort();
    if (roleEl) roleEl.innerHTML += roles.map(r => `<option value="${r}">${r}</option>`).join("");
    if (locEl) locEl.innerHTML += locs.map(l => `<option value="${l}">${l}</option>`).join("");

    function render(list) {
      grid.innerHTML = list.map(t => {
        const photo = t.photo || "assets/images/placeholder-talent.jpg";
        const skills = (t.skills || []).join(", ");
        return `
          <article class="card">
            <div class="media" style="margin-bottom:12px;">
              <img loading="lazy" src="${photo}" alt="${t.name} headshot" width="1200" height="900" />
            </div>
            <h3 class="card-title">${t.name}</h3>
            <p class="muted"><strong>${t.role}</strong> • ${t.location}</p>
            <p class="tiny muted"><strong>Vibe:</strong> ${(t.vibe || []).join(", ")}</p>
            <p class="tiny muted"><strong>Skills:</strong> ${skills}</p>
            <div class="divider"></div>
            <a class="btn btn-primary btn-block" href="mailto:${t.contact}?subject=${encodeURIComponent(`Talent Inquiry: ${t.name}`)}">Inquire</a>
          </article>
        `;
      }).join("");
    }

    function apply() {
      const q = (searchEl?.value || "").toLowerCase().trim();
      const role = roleEl?.value || "all";
      const loc = locEl?.value || "all";

      let filtered = all;
      if (role !== "all") filtered = filtered.filter(t => t.role === role);
      if (loc !== "all") filtered = filtered.filter(t => t.location === loc);

      if (q) {
        filtered = filtered.filter(t => {
          const hay = [t.name, t.role, t.location, ...(t.vibe || []), ...(t.skills || [])].join(" ").toLowerCase();
          return hay.includes(q);
        });
      }
      render(filtered);
    }

    searchEl?.addEventListener("input", apply);
    roleEl?.addEventListener("change", apply);
    locEl?.addEventListener("change", apply);

    render(all);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initNav();
    initPackagesCards();
    initEstimator();
    initRules();
    initPostOnly();
    initContactPage();
    initTalentPage();
  });
})();