(function () {
  "use strict";

  const data = window.ABSENCE_TYPE_DATA;
  let types = structuredClone(data.types);
  let selectedFamily = types[0]?.universalLoaFamilyCode || null;
  let drawerMode = "create";
  let editingId = null;

  const els = {
    listPane: document.getElementById("listPane"),
    detailEmpty: document.getElementById("detailEmpty"),
    detailContent: document.getElementById("detailContent"),
    detailTitle: document.getElementById("detailTitle"),
    detailKey: document.getElementById("detailKey"),
    detailFields: document.getElementById("detailFields"),
    typeTableBody: document.getElementById("typeTableBody"),
    typeCount: document.getElementById("typeCount"),
    mappingCards: document.getElementById("mappingCards"),
    schemaPreview: document.getElementById("schemaPreview"),
    resultCount: document.getElementById("resultCount"),
    searchInput: document.getElementById("searchInput"),
    filterFamily: document.getElementById("filterFamily"),
    filterBucket: document.getElementById("filterBucket"),
    filterTrack: document.getElementById("filterTrack"),
    filterActive: document.getElementById("filterActive"),
    overlay: document.getElementById("overlay"),
    drawer: document.getElementById("drawer"),
    drawerTitle: document.getElementById("drawerTitle"),
    toast: document.getElementById("toast"),
    typeForm: document.getElementById("typeForm")
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
    const familyOptions = data.familyCodes.map(
      (c) => `${c} — ${data.familyNames[c] || c}`
    );
    fillSelect(els.filterFamily, data.familyCodes, "All families");
    [...els.filterFamily.options].forEach((o) => {
      if (o.value && data.familyNames[o.value]) o.textContent = `${o.value} — ${data.familyNames[o.value]}`;
    });
    fillSelect(els.filterBucket, data.payBuckets, "All pay buckets");
    fillSelect(els.filterTrack, data.trackingBuckets, "All tracking");

    fillSelect(document.getElementById("fFamilyCode"), data.familyCodes);
    fillSelect(document.getElementById("fBucket"), data.payBuckets);
    fillSelect(document.getElementById("fTrack"), data.trackingBuckets);

    document.getElementById("fFamilyCode").addEventListener("change", syncFamilyName);
  }

  function syncFamilyName() {
    const code = document.getElementById("fFamilyCode").value;
    document.getElementById("fFamilyName").value = data.familyNames[code] || code;
  }

  function ynBadge(val) {
    const y = String(val).toUpperCase() === "Y";
    return `<span class="yn ${y ? "yn-y" : "yn-n"}">${y ? "Y" : "N"}</span>`;
  }

  function trackChip(track) {
    return `<span class="chip ${track === "FMLA" ? "chip-fmla" : "chip-nonfmla"}">${track}</span>`;
  }

  function getFilteredTypes() {
    const q = els.searchInput.value.trim().toLowerCase();
    const family = els.filterFamily.value;
    const bucket = els.filterBucket.value;
    const track = els.filterTrack.value;
    const active = els.filterActive.value;

    return types.filter((t) => {
      if (family && t.universalLoaFamilyCode !== family) return false;
      if (bucket && t.payBucketCode !== bucket) return false;
      if (track && t.fmlaTrackingBucket !== track) return false;
      if (active && t.activeFlag !== active) return false;
      if (!q) return true;
      const hay = [
        t.universalAbsenceTypeId,
        t.universalLoaFamilyCode,
        t.universalLoaFamilyName,
        t.payBucketCode,
        t.fmlaTrackingBucket,
        t.targetHcmAbsenceTypeName,
        t.kptimeAbsenceType,
        String(t.derivedAbsenceTypeSequence)
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function getFamilies(filteredTypes) {
    const map = new Map();
    filteredTypes.forEach((t) => {
      if (!map.has(t.universalLoaFamilyCode)) {
        map.set(t.universalLoaFamilyCode, {
          code: t.universalLoaFamilyCode,
          name: t.universalLoaFamilyName,
          types: []
        });
      }
      map.get(t.universalLoaFamilyCode).types.push(t);
    });
    return [...map.values()];
  }

  function renderList() {
    const filtered = getFilteredTypes();
    els.resultCount.textContent = `${filtered.length} type${filtered.length === 1 ? "" : "s"}`;
    const families = getFamilies(filtered);

    if (!families.length) {
      els.listPane.innerHTML = `<div class="empty-list">No absence types match your filters.</div>`;
      return;
    }

    if (!families.some((f) => f.code === selectedFamily)) {
      selectedFamily = families[0].code;
    }

    els.listPane.innerHTML = families
      .map((f) => {
        const selected = f.code === selectedFamily ? "selected" : "";
        const buckets = [...new Set(f.types.map((t) => t.payBucketCode))].join(", ");
        const activeCount = f.types.filter((t) => t.activeFlag === "Y").length;
        return `
          <button type="button" class="list-item ${selected}" data-code="${f.code}">
            <div class="list-item-id">${escapeHtml(f.code)}</div>
            <div class="list-item-key">${escapeHtml(f.name)}</div>
            <div class="list-item-meta">
              <span class="chip">${f.types.length} types</span>
              <span class="chip chip-status-active">${activeCount} active</span>
            </div>
            <div class="muted" style="font-size:11px;margin-top:2px">${escapeHtml(buckets)}</div>
          </button>`;
      })
      .join("");
  }

  function renderDetail() {
    const filtered = getFilteredTypes().filter((t) => t.universalLoaFamilyCode === selectedFamily);
    if (!filtered.length) {
      els.detailEmpty.hidden = false;
      els.detailContent.hidden = true;
      return;
    }

    const name = filtered[0].universalLoaFamilyName;
    const code = filtered[0].universalLoaFamilyCode;

    els.detailEmpty.hidden = true;
    els.detailContent.hidden = false;
    els.detailTitle.textContent = code;
    els.detailKey.textContent = name;

    const sorted = [...filtered].sort(
      (a, b) => a.derivedAbsenceTypeSequence - b.derivedAbsenceTypeSequence
    );

    els.detailFields.innerHTML = [
      ["Universal LOA Family Code", code],
      ["Universal LOA Family Name", name],
      ["Absence types", String(sorted.length)],
      ["FMLA rows", String(sorted.filter((t) => t.fmlaTrackingBucket === "FMLA").length)],
      ["Has ESL/EIB", String(sorted.filter((t) => t.hasEslOrEibPlan === "Y").length)],
      ["Active", String(sorted.filter((t) => t.activeFlag === "Y").length)]
    ]
      .map(
        ([label, value]) => `
        <div>
          <div class="field-label">${label}</div>
          <div class="field-value">${escapeHtml(value)}</div>
        </div>`
      )
      .join("");

    els.typeCount.textContent = `${sorted.length} mapping rows`;

    els.typeTableBody.innerHTML = sorted
      .map((t) => {
        return `
        <tr>
          <td class="mono"><strong>${escapeHtml(t.universalAbsenceTypeId)}</strong></td>
          <td class="nowrap"><strong>${escapeHtml(t.payBucketCode)}</strong></td>
          <td>${trackChip(t.fmlaTrackingBucket)}</td>
          <td class="mono nowrap">${t.derivedAbsenceTypeSequence}</td>
          <td>${escapeHtml(t.targetHcmAbsenceTypeName)}</td>
          <td>${escapeHtml(t.kptimeAbsenceType)}</td>
          <td>${ynBadge(t.hasEslOrEibPlan)}</td>
          <td>${ynBadge(t.activeFlag)}</td>
          <td><button type="button" class="btn btn-ghost btn-sm btn-edit-type" data-id="${escapeHtml(t.universalAbsenceTypeId)}">Edit</button></td>
        </tr>`;
      })
      .join("");

    els.mappingCards.innerHTML = sorted
      .map((t) => {
        return `
        <div class="mapping-card">
          <div class="mapping-card-top">
            <strong>${escapeHtml(t.payBucketCode)}</strong>
            ${trackChip(t.fmlaTrackingBucket)}
            <span class="chip mono">${escapeHtml(t.universalAbsenceTypeId)}</span>
            <span class="chip">Seq ${t.derivedAbsenceTypeSequence}</span>
          </div>
          <div class="mapping-grid">
            <div><div class="field-label">HCM Absence Type</div><div class="field-value">${escapeHtml(t.targetHcmAbsenceTypeName)}</div></div>
            <div><div class="field-label">KPTime Absence Type</div><div class="field-value">${escapeHtml(t.kptimeAbsenceType)}</div></div>
            <div><div class="field-label">Has ESL/EIB Plan</div><div class="field-value">${ynBadge(t.hasEslOrEibPlan)}</div></div>
            <div><div class="field-label">Active</div><div class="field-value">${ynBadge(t.activeFlag)}</div></div>
          </div>
        </div>`;
      })
      .join("");

    const sample = flattenType(sorted[0]);
    els.schemaPreview.textContent = JSON.stringify(
      {
        description: "One spreadsheet / API row = one universal absence type mapping",
        columns: Object.keys(sample),
        sampleRow: sample
      },
      null,
      2
    );
  }

  function flattenType(t) {
    return {
      Universal_Absence_Type_ID: t.universalAbsenceTypeId,
      Universal_LOA_Family_Code: t.universalLoaFamilyCode,
      Universal_LOA_Family_Name: t.universalLoaFamilyName,
      Pay_Bucket_Code: t.payBucketCode,
      FMLA_Tracking_Bucket: t.fmlaTrackingBucket,
      Derived_Absence_Type_Sequence: t.derivedAbsenceTypeSequence,
      Target_HCM_Absence_Type_Name: t.targetHcmAbsenceTypeName,
      KPTIME_Absence_Type: t.kptimeAbsenceType,
      Has_ESL_or_EIB_Plan: t.hasEslOrEibPlan,
      Active_Flag: t.activeFlag
    };
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
      if (!els.drawer.classList.contains("open")) els.overlay.hidden = true;
    }, 200);
  }

  function setSwitch(el, on) {
    el.classList.toggle("on", !!on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function switchOn(el) {
    return el.classList.contains("on");
  }

  function openDrawer(mode, typeId) {
    drawerMode = mode;
    editingId = typeId || null;
    els.drawerTitle.textContent = mode === "edit" ? "Edit Absence Type" : "Create Absence Type";
    const form = els.typeForm;

    if (mode === "edit") {
      const t = types.find((x) => x.universalAbsenceTypeId === typeId);
      if (!t) return;
      form.universalAbsenceTypeId.value = t.universalAbsenceTypeId;
      form.universalAbsenceTypeId.readOnly = true;
      form.universalLoaFamilyCode.value = t.universalLoaFamilyCode;
      form.universalLoaFamilyName.value = t.universalLoaFamilyName;
      form.payBucketCode.value = t.payBucketCode;
      form.fmlaTrackingBucket.value = t.fmlaTrackingBucket;
      form.derivedAbsenceTypeSequence.value = t.derivedAbsenceTypeSequence;
      form.targetHcmAbsenceTypeName.value = t.targetHcmAbsenceTypeName;
      form.kptimeAbsenceType.value = t.kptimeAbsenceType;
      setSwitch(document.getElementById("swEsl"), t.hasEslOrEibPlan === "Y");
      setSwitch(document.getElementById("swActive"), t.activeFlag === "Y");
    } else {
      form.reset();
      form.universalAbsenceTypeId.readOnly = false;
      const code = selectedFamily || data.familyCodes[0];
      form.universalLoaFamilyCode.value = code;
      syncFamilyName();
      form.payBucketCode.value = "SICK";
      form.fmlaTrackingBucket.value = "FMLA";
      form.derivedAbsenceTypeSequence.value = nextSequence(code);
      form.universalAbsenceTypeId.value = `${code}_SICK_FMLA_02`;
      form.targetHcmAbsenceTypeName.value = "";
      form.kptimeAbsenceType.value = "";
      setSwitch(document.getElementById("swEsl"), code === "MED" || code === "FCB");
      setSwitch(document.getElementById("swActive"), true);
    }

    openOverlay();
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
  }

  function nextSequence(code) {
    const seqs = types
      .filter((t) => t.universalLoaFamilyCode === code)
      .map((t) => t.derivedAbsenceTypeSequence);
    return (seqs.length ? Math.max(...seqs) : 10000) + 1;
  }

  function closeDrawer() {
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    closeOverlay();
    editingId = null;
  }

  function saveType() {
    const form = els.typeForm;
    if (!form.reportValidity()) return;

    const record = {
      universalAbsenceTypeId: form.universalAbsenceTypeId.value.trim(),
      universalLoaFamilyCode: form.universalLoaFamilyCode.value,
      universalLoaFamilyName: form.universalLoaFamilyName.value.trim(),
      payBucketCode: form.payBucketCode.value,
      fmlaTrackingBucket: form.fmlaTrackingBucket.value,
      derivedAbsenceTypeSequence: Number(form.derivedAbsenceTypeSequence.value) || 0,
      targetHcmAbsenceTypeName: form.targetHcmAbsenceTypeName.value.trim(),
      kptimeAbsenceType: form.kptimeAbsenceType.value.trim(),
      hasEslOrEibPlan: switchOn(document.getElementById("swEsl")) ? "Y" : "N",
      activeFlag: switchOn(document.getElementById("swActive")) ? "Y" : "N"
    };

    if (drawerMode === "edit") {
      const idx = types.findIndex((t) => t.universalAbsenceTypeId === editingId);
      if (idx >= 0) types[idx] = record;
      showToast("Absence type updated");
    } else {
      if (types.some((t) => t.universalAbsenceTypeId === record.universalAbsenceTypeId)) {
        showToast("Absence type ID already exists");
        return;
      }
      types.unshift(record);
      selectedFamily = record.universalLoaFamilyCode;
      showToast("Absence type created");
    }

    closeDrawer();
    refresh();
  }

  function exportCsv() {
    const rows = getFilteredTypes().map(flattenType);
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
    a.download = "universal_absence_types.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported universal_absence_types.csv");
  }

  function bindEvents() {
    els.listPane.addEventListener("click", (e) => {
      const item = e.target.closest(".list-item");
      if (!item) return;
      selectedFamily = item.dataset.code;
      refresh();
    });

    ["input", "change"].forEach((evt) => {
      els.searchInput.addEventListener(evt, refresh);
      els.filterFamily.addEventListener(evt, refresh);
      els.filterBucket.addEventListener(evt, refresh);
      els.filterTrack.addEventListener(evt, refresh);
      els.filterActive.addEventListener(evt, refresh);
    });

    document.getElementById("btnCreate").addEventListener("click", () => openDrawer("create"));
    document.getElementById("btnAddType").addEventListener("click", () => openDrawer("create"));
    document.getElementById("btnExport").addEventListener("click", exportCsv);
    document.getElementById("btnCloseDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnCancelDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnSaveDrawer").addEventListener("click", saveType);

    els.overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
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

    els.typeTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit-type");
      if (!btn) return;
      openDrawer("edit", btn.dataset.id);
    });
  }

  initFiltersAndForms();
  bindEvents();
  refresh();
})();
