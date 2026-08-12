(function () {
  "use strict";

  const data = window.UNIVERSAL_ELIGIBILITY_DATA;
  let rules = structuredClone(data.rules);
  let selectedId = rules[0]?.ruleId || null;
  let drawerMode = "create";
  let editingRegIndex = null;

  const els = {
    listPane: document.getElementById("listPane"),
    detailEmpty: document.getElementById("detailEmpty"),
    detailContent: document.getElementById("detailContent"),
    detailTitle: document.getElementById("detailTitle"),
    detailKey: document.getElementById("detailKey"),
    detailFields: document.getElementById("detailFields"),
    regTableBody: document.getElementById("regTableBody"),
    regCount: document.getElementById("regCount"),
    mappingCards: document.getElementById("mappingCards"),
    schemaPreview: document.getElementById("schemaPreview"),
    resultCount: document.getElementById("resultCount"),
    searchInput: document.getElementById("searchInput"),
    filterState: document.getElementById("filterState"),
    filterRegion: document.getElementById("filterRegion"),
    filterRegType: document.getElementById("filterRegType"),
    filterStatus: document.getElementById("filterStatus"),
    overlay: document.getElementById("overlay"),
    drawer: document.getElementById("drawer"),
    drawerTitle: document.getElementById("drawerTitle"),
    regDrawer: document.getElementById("regDrawer"),
    toast: document.getElementById("toast"),
    ruleForm: document.getElementById("ruleForm"),
    regForm: document.getElementById("regForm")
  };

  function fillSelect(select, values, includeBlankLabel) {
    const current = select.value;
    select.innerHTML = "";
    if (includeBlankLabel != null) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = includeBlankLabel;
      select.appendChild(opt);
    }
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
    if ([...select.options].some((o) => o.value === current)) select.value = current;
  }

  function initFiltersAndForms() {
    fillSelect(els.filterState, data.states, "All states");
    fillSelect(els.filterRegion, data.regions, "All regions");
    fillSelect(els.filterRegType, data.regulationTypes, "All regulation types");

    fillSelect(document.getElementById("fFamily"), data.familyNames);
    fillSelect(document.getElementById("fState"), data.states);
    fillSelect(document.getElementById("fRegion"), data.regions);
    fillSelect(document.getElementById("fReg"), data.regulations);
    fillSelect(document.getElementById("fRegType"), data.regulationTypes);
    fillSelect(document.getElementById("rReg"), data.regulations);
    fillSelect(document.getElementById("rRegType"), data.regulationTypes);
  }

  function displayVal(v) {
    if (v === "" || v == null) return "—";
    return String(v);
  }

  function ynBadge(val) {
    const y = String(val).toUpperCase() === "Y";
    return `<span class="yn ${y ? "yn-y" : "yn-n"}">${y ? "Y" : "N"}</span>`;
  }

  function statusChip(status) {
    const cls =
      status === "Active"
        ? "chip-status-active"
        : status === "Draft"
          ? "chip-status-draft"
          : "chip-status-inactive";
    return `<span class="chip ${cls}">${status}</span>`;
  }

  function shortReg(name) {
    if (name.includes("Military Caregiver")) return "FMLA Military";
    if (name.includes("FMLA")) return "FMLA";
    if (name.includes("Paid Leave Oregon") || name.includes("PLO")) return "PLO";
    return name;
  }

  function regulationChip(name) {
    if (name.includes("FMLA")) return `<span class="chip chip-fmla">${escapeHtml(shortReg(name))}</span>`;
    if (name.includes("PLO") || name.includes("Paid Leave"))
      return `<span class="chip chip-plo">${escapeHtml(shortReg(name))}</span>`;
    if (name === "CBA") return `<span class="chip chip-cba">CBA</span>`;
    return `<span class="chip">${escapeHtml(shortReg(name))}</span>`;
  }

  function typeChip(type) {
    if (String(type).startsWith("Federal")) return `<span class="chip chip-fmla">${escapeHtml(type)}</span>`;
    if (String(type).startsWith("State")) return `<span class="chip chip-plo">${escapeHtml(type)}</span>`;
    if (String(type).includes("CBA") || String(type).includes("Union"))
      return `<span class="chip chip-cba">${escapeHtml(type)}</span>`;
    return `<span class="chip">${escapeHtml(type)}</span>`;
  }

  function getFiltered() {
    const q = els.searchInput.value.trim().toLowerCase();
    const state = els.filterState.value;
    const region = els.filterRegion.value;
    const regType = els.filterRegType.value;
    const status = els.filterStatus.value;

    return rules.filter((r) => {
      if (state && r.state !== state) return false;
      if (region && r.region !== region) return false;
      if (status && r.status !== status) return false;
      if (regType && !r.regulations.some((x) => x.regulationType === regType)) return false;
      if (!q) return true;
      const hay = [
        r.ruleId,
        r.universalLoaFamilyName,
        r.state,
        r.region,
        ...r.regulations.flatMap((x) => [x.regulation, x.regulationType])
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function renderList() {
    const filtered = getFiltered();
    els.resultCount.textContent = `${filtered.length} famil${filtered.length === 1 ? "y" : "ies"}`;

    if (!filtered.length) {
      els.listPane.innerHTML = `<div class="empty-list">No universal LOA family rules match your filters.</div>`;
      return;
    }

    if (!filtered.some((r) => r.ruleId === selectedId)) {
      selectedId = filtered[0].ruleId;
    }

    els.listPane.innerHTML = filtered
      .map((r) => {
        const selected = r.ruleId === selectedId ? "selected" : "";
        const regs = r.regulations.map((x) => shortReg(x.regulation)).join(", ");
        return `
          <button type="button" class="list-item ${selected}" data-id="${r.ruleId}">
            <div class="list-item-id">${escapeHtml(r.ruleId)}</div>
            <div class="list-item-key">${escapeHtml(r.universalLoaFamilyName)}</div>
            <div class="list-item-meta">
              <span class="chip">${escapeHtml(r.state)}</span>
              <span class="chip">${escapeHtml(r.region)}</span>
              ${statusChip(r.status)}
              <span class="chip">${r.regulations.length} regs</span>
            </div>
            <div class="muted" style="font-size:11px;margin-top:2px">${escapeHtml(regs)}</div>
          </button>`;
      })
      .join("");
  }

  function getSelected() {
    return rules.find((r) => r.ruleId === selectedId) || null;
  }

  function renderDetail() {
    const rule = getSelected();
    if (!rule) {
      els.detailEmpty.hidden = false;
      els.detailContent.hidden = true;
      return;
    }

    els.detailEmpty.hidden = true;
    els.detailContent.hidden = false;
    els.detailTitle.textContent = rule.ruleId;
    els.detailKey.textContent = rule.universalLoaFamilyName;

    els.detailFields.innerHTML = [
      ["Universal LOA Family Name", rule.universalLoaFamilyName],
      ["State", rule.state],
      ["Region", rule.region],
      ["Status", rule.status],
      ["Regulations", String(rule.regulations.length)],
      [
        "Job protected",
        String(rule.regulations.filter((x) => x.jobProtection === "Y").length)
      ]
    ]
      .map(
        ([label, value]) => `
        <div>
          <div class="field-label">${label}</div>
          <div class="field-value">${escapeHtml(value)}</div>
        </div>`
      )
      .join("");

    els.regCount.textContent = `${rule.regulations.length} regulation rows`;

    els.regTableBody.innerHTML = rule.regulations
      .map((reg, idx) => {
        return `
        <tr data-reg-index="${idx}">
          <td>${regulationChip(reg.regulation)}<div class="muted" style="font-size:11px;margin-top:4px">${escapeHtml(reg.regulation)}</div></td>
          <td class="mono">${typeChip(reg.regulationType)}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.minServiceMonths))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.minServiceHours))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.minWeeklyHours))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.minEarningCheck))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.rollingPeriodMonths))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.durationWeeks))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.durationHours))}</td>
          <td class="mono nowrap">${escapeHtml(displayVal(reg.maxCombinedWeeks))}</td>
          <td>${ynBadge(reg.jobProtection)}</td>
          <td><button type="button" class="btn btn-ghost btn-sm btn-edit-reg" data-index="${idx}">Edit</button></td>
        </tr>`;
      })
      .join("");

    els.mappingCards.innerHTML = rule.regulations
      .map((reg) => {
        return `
        <div class="mapping-card">
          <div class="mapping-card-top">
            <strong>${escapeHtml(shortReg(reg.regulation))}</strong>
            ${regulationChip(reg.regulation)}
            ${typeChip(reg.regulationType)}
            ${ynBadge(reg.jobProtection)}
            <span class="chip">Job protection</span>
          </div>
          <div class="muted" style="font-size:12px;margin-bottom:8px">${escapeHtml(reg.regulation)}</div>
          <div class="mapping-grid">
            <div><div class="field-label">Regulation Type</div><div class="field-value mono">${escapeHtml(reg.regulationType)}</div></div>
            <div><div class="field-label">Min Service Months</div><div class="field-value mono">${escapeHtml(displayVal(reg.minServiceMonths))}</div></div>
            <div><div class="field-label">Min Service Hours</div><div class="field-value mono">${escapeHtml(displayVal(reg.minServiceHours))}</div></div>
            <div><div class="field-label">Min Weekly Hours</div><div class="field-value mono">${escapeHtml(displayVal(reg.minWeeklyHours))}</div></div>
            <div><div class="field-label">Min Earning Check</div><div class="field-value mono">${escapeHtml(displayVal(reg.minEarningCheck))}</div></div>
            <div><div class="field-label">Rolling Period Months</div><div class="field-value mono">${escapeHtml(displayVal(reg.rollingPeriodMonths))}</div></div>
            <div><div class="field-label">Duration Weeks</div><div class="field-value mono">${escapeHtml(displayVal(reg.durationWeeks))}</div></div>
            <div><div class="field-label">Duration Hours</div><div class="field-value mono">${escapeHtml(displayVal(reg.durationHours))}</div></div>
            <div><div class="field-label">Max Combined Weeks</div><div class="field-value mono">${escapeHtml(displayVal(reg.maxCombinedWeeks))}</div></div>
          </div>
        </div>`;
      })
      .join("");

    const flatSample = flattenRule(rule)[0];
    els.schemaPreview.textContent = JSON.stringify(
      {
        description:
          "One spreadsheet / API row = Universal_LOA_Family_Name + State/Region + Regulation + Regulation_Type",
        columns: Object.keys(flatSample),
        sampleRow: flatSample
      },
      null,
      2
    );
  }

  function flattenRule(rule) {
    return rule.regulations.map((reg) => ({
      Universal_LOA_Family_Name: rule.universalLoaFamilyName,
      State: rule.state,
      Region: rule.region,
      Regulation: reg.regulation,
      Regulation_Type: reg.regulationType,
      Min_Service_Months: reg.minServiceMonths,
      Min_Service_Hours: reg.minServiceHours,
      Min_Weekly_Hours: reg.minWeeklyHours,
      Min_Earning_Check: reg.minEarningCheck,
      Rolling_Period_Months: reg.rollingPeriodMonths,
      Duration_Weeks: reg.durationWeeks,
      Duration_Hours: reg.durationHours,
      Max_Combined_Weeks: reg.maxCombinedWeeks,
      Job_Protection: reg.jobProtection
    }));
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function refresh() {
    renderList();
    renderDetail();
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function openOverlay() {
    els.overlay.hidden = false;
    requestAnimationFrame(() => els.overlay.classList.add("open"));
  }

  function closeOverlay() {
    els.overlay.classList.remove("open");
    setTimeout(() => {
      if (!els.drawer.classList.contains("open") && !els.regDrawer.classList.contains("open")) {
        els.overlay.hidden = true;
      }
    }, 200);
  }

  function setSwitch(el, on) {
    el.classList.toggle("on", !!on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function switchOn(el) {
    return el.classList.contains("on");
  }

  function nextId() {
    const nums = rules
      .map((r) => Number((r.ruleId.match(/(\d+)$/) || [])[1]))
      .filter((n) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `UELIG_OR_NEW_${String(next).padStart(2, "0")}`;
  }

  function coerceVal(v) {
    const t = String(v ?? "").trim();
    if (t === "") return "";
    if (t.toUpperCase() === "N/A") return "N/A";
    if (!isNaN(Number(t)) && t !== "") return Number(t);
    return t;
  }

  function openDrawer(mode) {
    drawerMode = mode;
    els.drawerTitle.textContent = mode === "edit" ? "Edit Family Rule" : "Create Family Rule";
    const form = els.ruleForm;

    if (mode === "edit") {
      const r = getSelected();
      if (!r) return;
      form.ruleId.value = r.ruleId;
      form.ruleId.readOnly = true;
      form.status.value = r.status;
      form.universalLoaFamilyName.value = r.universalLoaFamilyName;
      form.state.value = r.state;
      form.region.value = r.region;
      const first = r.regulations[0] || {};
      form.regulation.value = first.regulation || data.regulations[0];
      form.regulationType.value = first.regulationType || data.regulationTypes[0];
      form.minServiceMonths.value = first.minServiceMonths ?? "";
      form.minServiceHours.value = first.minServiceHours ?? "";
      form.minWeeklyHours.value = first.minWeeklyHours ?? "";
      form.minEarningCheck.value = first.minEarningCheck ?? "";
      form.rollingPeriodMonths.value = first.rollingPeriodMonths ?? "";
      form.durationWeeks.value = first.durationWeeks ?? "";
      form.durationHours.value = first.durationHours ?? "";
      form.maxCombinedWeeks.value = first.maxCombinedWeeks ?? "";
      setSwitch(document.getElementById("swJob"), first.jobProtection === "Y");
    } else {
      form.reset();
      form.ruleId.readOnly = false;
      form.ruleId.value = nextId();
      form.status.value = "Draft";
      form.universalLoaFamilyName.value = data.familyNames[0];
      form.state.value = "Oregon";
      form.region.value = "Northwest";
      form.regulation.value = data.regulations[0];
      form.regulationType.value = "Federal_FMLA";
      form.minServiceMonths.value = 12;
      form.minServiceHours.value = 1250;
      form.minWeeklyHours.value = "N/A";
      form.minEarningCheck.value = "N/A";
      form.rollingPeriodMonths.value = 12;
      form.durationWeeks.value = 12;
      form.durationHours.value = 480;
      form.maxCombinedWeeks.value = "";
      setSwitch(document.getElementById("swJob"), true);
    }

    openOverlay();
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    closeOverlay();
  }

  function openRegDrawer(index) {
    const rule = getSelected();
    if (!rule) return;
    editingRegIndex = index;
    const isNew = index == null || index < 0;
    document.getElementById("regDrawerTitle").textContent = isNew
      ? "Add regulation eligibility"
      : "Edit regulation eligibility";

    const reg = isNew
      ? {
          regulation: data.regulations[0],
          regulationType: "Federal_FMLA",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      : rule.regulations[index];

    const form = els.regForm;
    form.regulation.value = reg.regulation;
    form.regulationType.value = reg.regulationType;
    form.minServiceMonths.value = reg.minServiceMonths ?? "";
    form.minServiceHours.value = reg.minServiceHours ?? "";
    form.minWeeklyHours.value = reg.minWeeklyHours ?? "";
    form.minEarningCheck.value = reg.minEarningCheck ?? "";
    form.rollingPeriodMonths.value = reg.rollingPeriodMonths ?? "";
    form.durationWeeks.value = reg.durationWeeks ?? "";
    form.durationHours.value = reg.durationHours ?? "";
    form.maxCombinedWeeks.value = reg.maxCombinedWeeks ?? "";
    setSwitch(document.getElementById("rSwJob"), reg.jobProtection === "Y");

    openOverlay();
    els.regDrawer.classList.add("open");
    els.regDrawer.setAttribute("aria-hidden", "false");
  }

  function closeRegDrawer() {
    els.regDrawer.classList.remove("open");
    els.regDrawer.setAttribute("aria-hidden", "true");
    closeOverlay();
    editingRegIndex = null;
  }

  function readRegFromForm(form, jobSwitchId) {
    return {
      regulation: form.regulation.value,
      regulationType: form.regulationType.value,
      minServiceMonths: coerceVal(form.minServiceMonths.value),
      minServiceHours: coerceVal(form.minServiceHours.value),
      minWeeklyHours: coerceVal(form.minWeeklyHours.value),
      minEarningCheck: coerceVal(form.minEarningCheck.value),
      rollingPeriodMonths: coerceVal(form.rollingPeriodMonths.value),
      durationWeeks: coerceVal(form.durationWeeks.value),
      durationHours: coerceVal(form.durationHours.value),
      maxCombinedWeeks: coerceVal(form.maxCombinedWeeks.value),
      jobProtection: switchOn(document.getElementById(jobSwitchId)) ? "Y" : "N"
    };
  }

  function saveRule() {
    const form = els.ruleForm;
    if (!form.reportValidity()) return;

    const header = {
      ruleId: form.ruleId.value.trim(),
      universalLoaFamilyName: form.universalLoaFamilyName.value,
      state: form.state.value,
      region: form.region.value,
      status: form.status.value
    };
    const reg = readRegFromForm(form, "swJob");

    if (drawerMode === "edit") {
      const idx = rules.findIndex((r) => r.ruleId === selectedId);
      if (idx >= 0) {
        rules[idx] = {
          ...rules[idx],
          ...header,
          regulations: rules[idx].regulations.length
            ? rules[idx].regulations.map((x, i) => (i === 0 ? { ...x, ...reg } : x))
            : [reg]
        };
      }
      showToast("Family rule updated");
    } else {
      if (rules.some((r) => r.ruleId === header.ruleId)) {
        showToast("Rule ID already exists");
        return;
      }
      rules.unshift({ ...header, regulations: [reg] });
      selectedId = header.ruleId;
      showToast("Family rule created");
    }

    closeDrawer();
    refresh();
  }

  function saveReg() {
    const rule = getSelected();
    if (!rule) return;
    const form = els.regForm;
    if (!form.reportValidity()) return;
    const reg = readRegFromForm(form, "rSwJob");

    if (editingRegIndex == null || editingRegIndex < 0) {
      rule.regulations.push(reg);
      showToast("Regulation added");
    } else {
      rule.regulations[editingRegIndex] = reg;
      showToast("Regulation updated");
    }

    closeRegDrawer();
    refresh();
  }

  function duplicateSelected() {
    const r = getSelected();
    if (!r) return;
    const copy = structuredClone(r);
    copy.ruleId = nextId();
    copy.status = "Draft";
    rules.unshift(copy);
    selectedId = copy.ruleId;
    refresh();
    showToast(`Duplicated as ${copy.ruleId}`);
  }

  function exportCsv() {
    const rows = rules.flatMap(flattenRule);
    if (!rows.length) {
      showToast("Nothing to export");
      return;
    }
    const cols = Object.keys(rows[0]);
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join(
      "\n"
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "universal_loa_family_eligibility.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported universal_loa_family_eligibility.csv");
  }

  function bindEvents() {
    els.listPane.addEventListener("click", (e) => {
      const item = e.target.closest(".list-item");
      if (!item) return;
      selectedId = item.dataset.id;
      refresh();
    });

    ["input", "change"].forEach((evt) => {
      els.searchInput.addEventListener(evt, refresh);
      els.filterState.addEventListener(evt, refresh);
      els.filterRegion.addEventListener(evt, refresh);
      els.filterRegType.addEventListener(evt, refresh);
      els.filterStatus.addEventListener(evt, refresh);
    });

    document.getElementById("btnCreate").addEventListener("click", () => openDrawer("create"));
    document.getElementById("btnEdit").addEventListener("click", () => openDrawer("edit"));
    document.getElementById("btnDuplicate").addEventListener("click", duplicateSelected);
    document.getElementById("btnExport").addEventListener("click", exportCsv);
    document.getElementById("btnAddReg").addEventListener("click", () => openRegDrawer(-1));

    document.getElementById("btnCloseDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnCancelDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnSaveDrawer").addEventListener("click", saveRule);

    document.getElementById("btnCloseRegDrawer").addEventListener("click", closeRegDrawer);
    document.getElementById("btnCancelReg").addEventListener("click", closeRegDrawer);
    document.getElementById("btnSaveReg").addEventListener("click", saveReg);

    els.overlay.addEventListener("click", () => {
      closeDrawer();
      closeRegDrawer();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeRegDrawer();
      }
    });

    document.querySelectorAll(".switch").forEach((sw) => {
      sw.addEventListener("click", () => setSwitch(sw, !switchOn(sw)));
    });

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
      });
    });

    els.regTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit-reg");
      if (!btn) return;
      openRegDrawer(Number(btn.dataset.index));
    });
  }

  initFiltersAndForms();
  bindEvents();
  refresh();
})();
