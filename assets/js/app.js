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
  function clearEstimate() {
    localStorage.removeItem(storageKey);
  }

  function minFromPriceNote(note) {
    if (!note) return 0;
    const m = String(note).match(/\$([0-9]+(?:\.[0-9]+)?)/);
    return m ? Number(m[1]) : 0;
  }

  function estimateToText(est) {
  const lines = [];
  const hasPackage = !!est?.packageId;
  const hasPostOnly = (est?.postOnlySelected || []).length > 0;
  const hasBundles = (est?.bundles || []).length > 0;
  const hasAddons = (est?.addonsFixed || []).length > 0 || (est?.addonsQuoted || []).length > 0;
  const hasTalent = (est?.talentSelected || []).length > 0;

  if (!hasPackage && !hasPostOnly && !hasBundles && !hasAddons && !hasTalent) {
    return "No estimate selected yet.";
  }

  if (hasPackage) {
    lines.push(`Package: ${est.packageName} (${money(est.basePrice)})`);
  } else if (hasPostOnly) {
    lines.push("Post Production ONLY (you send footage)");
  }

  if (hasBundles) {
    lines.push("");
    lines.push("Bundles:");
    est.bundles.forEach(b => lines.push(`- ${b.name} (${money(b.price)})`));
  }

  if (hasPostOnly) {
    lines.push("");
    lines.push("Post-Production selected (minimums):");
    est.postOnlySelected.forEach(p =>
      lines.push(`- ${p.name} (from ${money(p.minPrice)} • ${p.priceNote})`)
    );
  }

  if (est.addonsFixed?.length) {
    lines.push("");
    lines.push("Add-ons (fixed):");
    est.addonsFixed.forEach(a => lines.push(`- ${a.name} (${money(a.price)})`));
  }

  if (est.addonsQuoted?.length) {
    lines.push("");
    lines.push("Add-ons (estimated minimums):");
    est.addonsQuoted.forEach(a => lines.push(`- ${a.name} (from ${money(a.minPrice)} • ${a.priceNote})`));
  }

  if (hasTalent) {
    const rate = Number(est.talentDayRate || 120);
    const count = est.talentSelected.length;
    const talentMinTotal = Number(est.talentMinTotal || (count * rate));

    lines.push("");
    lines.push("Talent requested:");
    est.talentSelected.forEach(t => lines.push(`- ${t.name} (${t.role})`));
    lines.push(`Assumed minimum: ${money(rate)}/day each × ${count} (1 day) = ${money(talentMinTotal)}`);
    lines.push("Note: talent pay rates vary by person and project.");
  }

  if (est.rushDays) {
    lines.push("");
    lines.push(`Rush: ${est.rushDays} day(s) — ${money(est.rushCost)}`);
  }

  lines.push("");
  lines.push(est.hasQuoted
    ? `Estimated total (starting at): ${money(est.total)}`
    : `Estimated total: ${money(est.total)}`
  );
/*
  lines.push("");
  lines.push(`Credit required: ${window.CV_DATA.business.creditLine}`);
*/
  return lines.join("\n");
}

  /* =========================================================
     HOMEPAGE SLIDESHOW
     ========================================================= */
  function initHomeSlideshow() {
    const root = $("#homeSlideshow");
    if (!root) return;

    const slidesData = window.CV_DATA.homeSlides || [];
    const slidesWrap = $(".slides", root);
    const dotsWrap = $(".slide-dots", root);
    const captionText = $("#slideCaptionText");
    const captionCount = $("#slideCaptionCount");
    const prevBtn = $("#slidePrev");
    const nextBtn = $("#slideNext");

    if (!slidesWrap || !dotsWrap || slidesData.length === 0) return;

    slidesWrap.innerHTML = slidesData.map((s, i) => `
      <div class="slide ${i === 0 ? "active" : ""}" data-i="${i}">
        <img src="${s.src}" alt="${s.alt}" loading="${i === 0 ? "eager" : "lazy"}">
      </div>
    `).join("");

    dotsWrap.innerHTML = slidesData.map((_, i) => `
      <button class="dot ${i === 0 ? "active" : ""}" type="button" aria-label="Go to slide ${i + 1}" data-dot="${i}"></button>
    `).join("");

    let index = 0;
    let timer = null;
    let lastInteraction = 0;

    const AUTOPLAY_MS = 4200;
    const RESUME_IDLE_MS = 7000;

    function setActive(i) {
      index = (i + slidesData.length) % slidesData.length;
      $$(".slide", slidesWrap).forEach(el => el.classList.remove("active"));
      $$(".dot", dotsWrap).forEach(el => el.classList.remove("active"));
      $(`.slide[data-i="${index}"]`, slidesWrap)?.classList.add("active");
      $(`.dot[data-dot="${index}"]`, dotsWrap)?.classList.add("active");

      if (captionText) captionText.textContent = slidesData[index].caption || "";
      if (captionCount) captionCount.textContent = `${index + 1}/${slidesData.length}`;
    }

    function next() { setActive(index + 1); }
    function prev() { setActive(index - 1); }

    function stopAuto() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(() => {
        const now = Date.now();
        if (now - lastInteraction >= RESUME_IDLE_MS) next();
      }, AUTOPLAY_MS);
    }

    function interact(action) {
      lastInteraction = Date.now();
      action();
      startAuto();
    }

    prevBtn?.addEventListener("click", () => interact(prev));
    nextBtn?.addEventListener("click", () => interact(next));
    dotsWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-dot]");
      if (!b) return;
      interact(() => setActive(Number(b.getAttribute("data-dot"))));
    });

    setActive(0);
    startAuto();
  }

  /* =========================================================
     PACKAGES PAGE CARDS + MODAL
     ========================================================= */
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

  /* =========================================================
     ESTIMATOR (Packages page)
     ========================================================= */
  function initEstimator() {
    const radiosWrap = $("#estPackageRadios");
    const bundlesWrap = $("#estBundles");
    const postOnlyWrap = $("#estPostOnly");
    const addonsWrap = $("#estAddons");
    const totalEl = $("#estimateTotal");
    const rushEl = $("#rushDays");
    const noteEl = $("#estimateNote");
    const postOnlyBlock = $("#estPostOnlyBlock");
    const summaryBox = $("#estimateSummary");

    if (!radiosWrap || !addonsWrap || !totalEl || !rushEl) return;

    const saved = loadEstimate() || {};

    // Package radios (optional: none selected by default)
    // Package radios (optional: includes "No production package" so users can do post-only)
const hasAnyNonPackage =
  (saved?.postOnlySelected || []).length ||
  (saved?.addonsFixed || []).length ||
  (saved?.addonsQuoted || []).length ||
  (saved?.bundles || []).length ||
  Number(saved?.rushDays || 0) > 0;

const noneChecked = (!saved?.packageId && hasAnyNonPackage) ? "checked" : "";

radiosWrap.innerHTML = [
  `
  <div class="checkrow">
  <label>
    <input type="radio" name="pkg" value="__none__" ${noneChecked} />
    <div>
      <div><strong>Post Production ONLY</strong></div>
      <small>You send footage.</small>
    </div>
  </label>
  <div class="price">$0</div>
</div>
  `,
  ...window.CV_DATA.packages.map(p => {
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
  })
].join("");

    // Bundles (checkbox)
    if (bundlesWrap) {
      bundlesWrap.innerHTML = (window.CV_DATA.bundles || []).map(b => `
        <div class="checkrow">
          <label>
            <input type="checkbox" data-bundle="${b.id}" />
            <div>
              <div><strong>${b.name}</strong></div>
              <small>${b.desc} • Includes: ${b.includes.join(", ")}</small>
            </div>
          </label>
          <div class="price">${money(b.price)}</div>
        </div>
      `).join("");
    }

    // Post-only services (checkbox, multiple)
    if (postOnlyWrap) {
      postOnlyWrap.innerHTML = (window.CV_DATA.postOnly || []).map(p => `
        <div class="checkrow">
          <label>
            <input type="checkbox" data-postonly="${p.id}" />
            <div>
              <div><strong>${p.name}</strong></div>
              <small>${p.desc}</small>
            </div>
          </label>
          <div class="price">from ${money(p.minPrice)}<br><span class="tiny" style="color:var(--text2)">${p.priceNote}</span></div>
        </div>
      `).join("");
    }

    // Add-ons (checkbox)
    addonsWrap.innerHTML = window.CV_DATA.addons.map(a => {
      const right = a.type === "fixed"
        ? money(a.price)
        : `from ${money(a.minPrice ?? minFromPriceNote(a.priceNote))}<br><span class="tiny" style="color:var(--text2)">${a.priceNote || "Quoted"}</span>`;

      const link = a.linkUrl ? ` • <a href="${a.linkUrl}">${a.linkLabel || "View"}</a>` : "";
      return `
        <div class="checkrow">
          <label>
            <input type="checkbox" data-addon="${a.id}" />
            <div>
              <div><strong>${a.name}</strong></div>
              <small>${a.desc || ""}${link}</small>
            </div>
          </label>
          <div class="price">${right}</div>
        </div>
      `;
    }).join("");

    // Restore saved checks
    const savedAddonIds = new Set([...(saved?.addonsFixed || []), ...(saved?.addonsQuoted || [])].map(x => x.id));
    $$("input[type='checkbox'][data-addon]").forEach(cb => {
      if (savedAddonIds.has(cb.getAttribute("data-addon"))) cb.checked = true;
    });

    const savedBundleIds = new Set([...(saved?.bundles || [])].map(x => x.id));
    $$("input[type='checkbox'][data-bundle]").forEach(cb => {
      if (savedBundleIds.has(cb.getAttribute("data-bundle"))) cb.checked = true;
    });

    const savedPostOnlyIds = new Set([...(saved?.postOnlySelected || [])].map(x => x.id));
    $$("input[type='checkbox'][data-postonly]").forEach(cb => {
      if (savedPostOnlyIds.has(cb.getAttribute("data-postonly"))) cb.checked = true;
    });

    // Rush cap: 3 days
    rushEl.max = "3";
    rushEl.value = String(Math.min(Number(saved?.rushDays || 0), 3));

    function compute() {
      const pkgRaw = $("input[name='pkg']:checked")?.value || null;
      const pkgId = (pkgRaw === "__none__") ? null : pkgRaw;
      const pkg = window.CV_DATA.packages.find(p => p.id === pkgId);

      const checkedBundles = $$("input[type='checkbox'][data-bundle]").filter(cb => cb.checked);
      const bundles = checkedBundles.map(cb => {
        const id = cb.getAttribute("data-bundle");
        const b = (window.CV_DATA.bundles || []).find(x => x.id === id);
        return b ? { id: b.id, name: b.name, price: b.price } : null;
      }).filter(Boolean);

      const postOnlyEnabled = (pkgId === null); // only when Post Production ONLY is selected

      if (postOnlyBlock) {
        postOnlyBlock.style.display = postOnlyEnabled ? "" : "none";
      }

      let postOnlySelected = [];

      if (postOnlyEnabled) {
        const checkedPostOnly = $$("input[type='checkbox'][data-postonly]").filter(cb => cb.checked);
        postOnlySelected = checkedPostOnly.map(cb => {
          const id = cb.getAttribute("data-postonly");
          const p = (window.CV_DATA.postOnly || []).find(x => x.id === id);
          return p ? { id: p.id, name: p.name, minPrice: p.minPrice, priceNote: p.priceNote } : null;
        }).filter(Boolean);
      } else {
        // If a production package is selected, post-only should not apply or be counted
        $$("input[type='checkbox'][data-postonly]").forEach(cb => (cb.checked = false));
        postOnlySelected = [];
      }

      const checkedAddons = $$("input[type='checkbox'][data-addon]").filter(cb => cb.checked);
      const addonsFixed = [];
      const addonsQuoted = [];

      checkedAddons.forEach(cb => {
        const id = cb.getAttribute("data-addon");
        const a = window.CV_DATA.addons.find(x => x.id === id);
        if (!a) return;
        if (a.type === "fixed") {
          addonsFixed.push({ id: a.id, name: a.name, price: a.price });
        } else {
          const minPrice = (a.minPrice ?? minFromPriceNote(a.priceNote)) || 0;
          addonsQuoted.push({ id: a.id, name: a.name, minPrice, priceNote: a.priceNote || "Quoted" });
        }
      });

      const rushDays = Math.min(Math.max(0, Number(rushEl.value || 0)), 3);
      const rushCost = rushDays * 200;

      const base = pkg ? pkg.price : 0;
      const bundlesTotal = bundles.reduce((s, b) => s + (b.price || 0), 0);
      const postOnlyMin = postOnlySelected.reduce((s, p) => s + (p.minPrice || 0), 0);
      const fixedTotal = addonsFixed.reduce((sum, a) => sum + (a.price || 0), 0);
      const quotedMinTotal = addonsQuoted.reduce((sum, a) => sum + (a.minPrice || 0), 0);

      const prevSaved = loadEstimate() || {};
      const talentSelected = Array.isArray(prevSaved.talentSelected) ? prevSaved.talentSelected : [];
      const talentDayRate = 120;
      const talentMinTotal = talentSelected.length * talentDayRate;

      const total = base + bundlesTotal + postOnlyMin + fixedTotal + quotedMinTotal + rushCost + talentMinTotal;
      const hasQuoted = addonsQuoted.length > 0 || (window.CV_DATA.postOnly || []).some(p => postOnlySelected.find(x => x.id === p.id));

      const prev = loadEstimate() || {};
      const estimate = {
        ...prev,
        packageId: pkg?.id || null,
        packageName: pkg?.name || "",
        basePrice: base,

        bundles,
        postOnlySelected,

        addonsFixed,
        addonsQuoted,

        talentSelected,
        talentDayRate,
        talentMinTotal,

        rushDays,
        rushCost,

        total,
        hasQuoted,
        createdAt: new Date().toISOString()
      };

      saveEstimate(estimate);
      totalEl.textContent = hasQuoted ? `${money(total)} (starting at)` : money(total);

      if (summaryBox) summaryBox.value = estimateToText(estimate);

      if (noteEl) {
        noteEl.textContent = (addonsQuoted.length > 0)
          ? "Note: quoted items are shown at their minimum. Final price depends on details (we confirm before filming/delivery)."
          : "";
      }
    }

    radiosWrap.addEventListener("change", compute);
    bundlesWrap?.addEventListener("change", compute);
    postOnlyWrap?.addEventListener("change", compute);
    addonsWrap.addEventListener("change", compute);
    rushEl.addEventListener("input", compute);

    // Reset buttons
    $("#estimateResetBtn")?.addEventListener("click", () => {
      const ok = confirm("Reset your estimate? This will clear all selections.");
      if (!ok) return;

      clearEstimate();

      // Uncheck everything / clear package selection
      $$("input[name='pkg']").forEach(r => r.checked = false);
      $$("input[type='checkbox'][data-addon], input[type='checkbox'][data-bundle], input[type='checkbox'][data-postonly]").forEach(cb => cb.checked = false);

      rushEl.value = "0";
      totalEl.textContent = "$0";
      if (noteEl) noteEl.textContent = "";

      // Also update contact estimate box if present
      const estimateBox = $("#estimateSummary");
      if (estimateBox) estimateBox.value = "No estimate selected yet.";
    });

    compute();
  }

  /* =========================================================
     RULES GRID tighter bullets
     ========================================================= */
  function initRules() {
    const rulesGrid = $("#rulesGrid");
    if (!rulesGrid) return;

    rulesGrid.innerHTML = window.CV_DATA.rules.map(r => {
      const items = r.items.map(x => `<li class="rulestex">${x}</li>`).join("");
      return `<div class="card"><h3 class="card-title">${r.title}</h3><ul class="rules-list">${items}</ul></div>`;
    }).join("");
  }

  /* =========================================================
     POST-ONLY cards section
     ========================================================= */
  function initPostOnly() {
    const wrap = $("#postOnlyCards");
    if (!wrap) return;
    wrap.innerHTML = window.CV_DATA.postOnly.map(p => `
      <article class="card">
        <h3 class="card-title">${p.name}</h3>
        <p class="muted">${p.desc}</p>
        <p class="muted">Pricing: <strong style="color:var(--accentText);">from ${money(p.minPrice)} • ${p.priceNote}</strong></p>
        <div class="divider"></div>
        <a class="btn btn-primary btn-block" href="contact.html?service=${encodeURIComponent(p.id)}#bookingForm">Request this service</a>      
      </article>
    `).join("");
  }

  /* =========================================================
     CONTACT PAGE team + estimate fill + reset link
     ========================================================= */
  function initContactPage() {
    const teamWrap = $("#teamProfiles");
    const estimateBox = $("#estimateSummary");
    const emailLink = $("#bookingEmailLink");
    const form = $("#contactForm");
    const resetLink = $("#contactResetEstimate");

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
            <div class="square-media">
              <img loading="lazy" src="${photoSrc}" alt="${m.name} photo">
            </div>
            <div>
              <h3 class="team-title">${m.name} <span class="team-role">— ${m.role}</span></h3>
              <p class="team-desc">${m.bio}</p>
              <p class="tiny">${links}</p>
            </div>
          </div>
        `;
      }).join("");
    }

    function recalcTotal(nextEst) {
  const bundlesTotal = (nextEst.bundles || []).reduce((s, b) => s + (b.price || 0), 0);
  const postOnlyMin = (nextEst.postOnlySelected || []).reduce((s, p) => s + (p.minPrice || 0), 0);
  const fixedTotal = (nextEst.addonsFixed || []).reduce((s, a) => s + (a.price || 0), 0);
  const quotedMinTotal = (nextEst.addonsQuoted || []).reduce((s, a) => s + (a.minPrice || 0), 0);

  const rushDays = Math.min(Math.max(0, Number(nextEst.rushDays || 0)), 3);
  const rushCost = rushDays * 200;

  const talentSelected = Array.isArray(nextEst.talentSelected) ? nextEst.talentSelected : [];
  const talentDayRate = 120;
  const talentMinTotal = talentSelected.length * talentDayRate;

  const base = Number(nextEst.basePrice || 0);

  return {
    ...nextEst,
    rushDays,
    rushCost,
    talentSelected,
    talentDayRate,
    talentMinTotal,
    total: base + bundlesTotal + postOnlyMin + fixedTotal + quotedMinTotal + rushCost + talentMinTotal,
    hasQuoted: (nextEst.addonsQuoted || []).length > 0 || (nextEst.postOnlySelected || []).length > 0
  };
}

function applyServiceFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("service");
  if (!serviceId) return;

  const svc = (window.CV_DATA.postOnly || []).find(p => p.id === serviceId);
  if (!svc) return;

  // Add service, switch to post-only mode (no production package)
  const prev = loadEstimate() || {};
  const prevList = Array.isArray(prev.postOnlySelected) ? prev.postOnlySelected : [];
  const already = prevList.some(x => x.id === svc.id);

  const nextList = already
    ? prevList
    : [...prevList, { id: svc.id, name: svc.name, minPrice: svc.minPrice, priceNote: svc.priceNote }];

  let next = {
    ...prev,
    packageId: null,
    packageName: "",
    basePrice: 0,
    postOnlySelected: nextList,
    createdAt: new Date().toISOString()
  };

  next = recalcTotal(next);
  saveEstimate(next);

  const pt = $("#projectType");
  if (pt) pt.value = "Post-Production Only";

  if (estimateBox) estimateBox.value = estimateToText(next);
}

applyServiceFromQuery();

// Default fill (if no service query param, or after applyServiceFromQuery already updated)
if (estimateBox && !estimateBox.value) {
  estimateBox.value = estimateToText(loadEstimate());
} else if (estimateBox && estimateBox.value.trim() === "") {
  estimateBox.value = estimateToText(loadEstimate());
}

    resetLink?.addEventListener("click", (e) => {
      e.preventDefault();
      const ok = confirm("Reset your estimate? This will clear all selections.");
      if (!ok) return;
      clearEstimate();
      if (estimateBox) estimateBox.value = "No estimate selected yet.";
    });

    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $("#formMsg");

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
      const estimate = estimateToText(loadEstimate());

      // Send to backend API instead of mailto
      fetch(window.CV_DATA.business.backendURL + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          projectType,
          preferredDate,
          songLink,
          notes,
          estimate
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          msg.textContent = "Email sent successfully!";
          form.reset(); // Optional: reset form on success
        } else {
          msg.textContent = "Failed to send email: " + (data.error || "Unknown error");
        }
      })
      .catch(err => {
        msg.textContent = "Error: " + err.message;
      });
    });
  }

  /* =========================================================
     TALENT PAGE: filter + carousel + selection into estimate
     ========================================================= */
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

    function getSelectedTalentIds() {
      const est = loadEstimate() || {};
      return new Set((est.talentSelected || []).map(t => t.id));
    }

    function setTalentSelected(id, item, checked) {
      const est = loadEstimate() || {};
      const list = Array.isArray(est.talentSelected) ? est.talentSelected : [];
      const exists = list.find(x => x.id === id);

      let next;
      if (checked && !exists) next = [...list, { id, name: item.name, role: item.role }];
      else if (!checked && exists) next = list.filter(x => x.id !== id);
      else next = list;

      saveEstimate({ ...est, talentSelected: next });
    }

    function render(list) {
      const selectedIds = getSelectedTalentIds();

      grid.innerHTML = list.map(t => {
        const photos = Array.isArray(t.photos) && t.photos.length ? t.photos : [t.photo || "assets/images/placeholder-talent.jpg"];
        const skills = (t.skills || []).join(", ");
        const checked = selectedIds.has(t.id) ? "checked" : "";

        return `
          <article class="card" data-talent="${t.id}" data-photos='${JSON.stringify(photos)}' data-idx="0">
            <div class="talent-photo">
              <img src="${photos[0]}" alt="${t.name} photo">
              ${photos.length > 1 ? `
                <button class="carousel-btn prev" type="button" data-prev aria-label="Previous photo">‹</button>
                <button class="carousel-btn next" type="button" data-next aria-label="Next photo">›</button>
              ` : ""}
            </div>

            <div class="divider"></div>

            <div class="select-row">
              <h3 class="card-title" style="margin:0;">${t.name}</h3>
              <label class="badge" title="Add to estimate">
                <input type="checkbox" data-select ${checked} />
                <strong>Select</strong>
              </label>
            </div>

            <p class="muted"><strong>${t.role}</strong> • ${t.location}</p>
            <p class="tiny muted"><strong>Vibe:</strong> ${(t.vibe || []).join(", ")}</p>
            <p class="tiny muted"><strong>Skills:</strong> ${skills}</p>
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

    // Delegated events for carousel + selection
    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-talent]");
      if (!card) return;

      if (e.target.closest("[data-prev]") || e.target.closest("[data-next]")) {
        const photos = JSON.parse(card.getAttribute("data-photos") || "[]");
        if (!photos.length) return;

        const cur = Number(card.getAttribute("data-idx") || 0);
        const next = e.target.closest("[data-next]") ? cur + 1 : cur - 1;
        const idx = (next + photos.length) % photos.length;

        card.setAttribute("data-idx", String(idx));
        const img = $("img", card);
        if (img) img.src = photos[idx];
      }
    });

    grid.addEventListener("change", (e) => {
      const cb = e.target.closest("[data-select]");
      if (!cb) return;
      const card = e.target.closest("[data-talent]");
      const id = card?.getAttribute("data-talent");
      if (!id) return;

      const item = all.find(x => x.id === id);
      if (!item) return;
      setTalentSelected(id, item, cb.checked);
    });

    render(all);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initNav();
    initHomeSlideshow();

    initPackagesCards();
    initEstimator();
    initRules();
    initPostOnly();

    initContactPage();
    initTalentPage();
  });
})();