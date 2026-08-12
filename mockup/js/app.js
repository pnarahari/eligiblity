(function () {
  "use strict";

  const data = window.JOURNEY_DATA;
  let combinations = structuredClone(data.combinations);
  let selectedId = combinations[0]?.journeyCombinationId || null;
  let drawerMode = "create"; // create | edit
  let editingBucketIndex = null;

  const els = {
    listPane: document.getElementById("listPane"),
    detailEmpty: document.getElementById("detailEmpty"),
    detailContent: document.getElementById("detailContent"),
    detailTitle: document.getElementById("detailTitle"),
    detailKey: document.getElementById("detailKey"),
    detailFields: document.getElementById("detailFields"),
    bucketTableBody: document.getElementById("bucketTableBody"),
    bucketCount: document.getElementById("bucketCount"),
    mappingCards: document.getElementById("mappingCards"),
    schemaPreview: document.getElementById("schemaPreview"),
    resultCount: document.getElementById("resultCount"),
    searchInput: document.getElementById("searchInput"),
    filterPattern: document.getElementById("filterPattern"),
    filterReason: document.getElementById("filterReason"),
    filterStatus: document.getElementById("filterStatus"),
    filterBucket: document.getElementById("filterBucket"),
    overlay: document.getElementById("overlay"),
    drawer: document.getElementById("drawer"),
    drawerTitle: document.getElementById("drawerTitle"),
    bucketDrawer: document.getElementById("bucketDrawer"),
    toast: document.getElementById("toast"),
    comboForm: document.getElementById("comboForm"),
    bucketForm: document.getElementById("bucketForm")
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
    if ([...select.options].some((o) => o.value === current)) {
      select.value = current;
    }
  }

  function initFiltersAndForms() {
    fillSelect(els.filterPattern, data.leavePatterns, "All patterns");
    fillSelect(els.filterReason, data.leaveReasons, "All reasons");
    fillSelect(els.filterBucket, data.payBuckets, "All pay buckets");

    fillSelect(document.getElementById("fPattern"), data.leavePatterns);
    fillSelect(document.getElementById("fReason"), data.leaveReasons);
    fillSelect(document.getElementById("fFamily"), data.universalFamilyCodes);
    fillSelect(document.getElementById("fPayBucket"), data.payBuckets);
    fillSelect(document.getElementById("fTrack"), data.trackingBuckets);
    fillSelect(document.getElementById("fMode"), data.selectionModes);

    fillSelect(document.getElementById("bPay"), data.payBuckets);
    fillSelect(document.getElementById("bTrack"), data.trackingBuckets);
    fillSelect(document.getElementById("bMode"), data.selectionModes);
    fillSelect(document.getElementById("bHours"), data.hoursModes);
  }

  function ynBadge(val) {
    const y = String(val).toUpperCase() === "Y" || String(val).toLowerCase() === "yes";
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

  function trackChip(track) {
    return `<span class="chip ${track === "FMLA" ? "chip-fmla" : "chip-nonfmla"}">${track}</span>`;
  }

  function getFiltered() {
    const q = els.searchInput.value.trim().toLowerCase();
    const pattern = els.filterPattern.value;
    const reason = els.filterReason.value;
    const status = els.filterStatus.value;
    const bucket = els.filterBucket.value;

    return combinations.filter((c) => {
      if (pattern && c.leavePattern !== pattern) return false;
      if (reason && c.leaveReason !== reason) return false;
      if (status && c.status !== status) return false;
      if (bucket && !c.buckets.some((b) => b.payBucketCode === bucket)) return false;
      if (!q) return true;
      const hay = [
        c.journeyCombinationId,
        c.journeyCombinationKey,
        c.leavePattern,
        c.leaveReason,
        c.universalLoaFamilyCode,
        ...c.buckets.flatMap((b) => [
          b.payBucketCode,
          b.targetHcmAbsenceTypeName,
          b.universalAbsenceTypeId,
          b.kptimeAbsenceType,
          b.primaryPtypcdNw,
          b.derivedPayCd
        ])
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function renderList() {
    const filtered = getFiltered();
    els.resultCount.textContent = `${filtered.length} combination${filtered.length === 1 ? "" : "s"}`;

    if (!filtered.length) {
      els.listPane.innerHTML = `<div class="empty-list">No journey combinations match your filters.</div>`;
      return;
    }

    if (!filtered.some((c) => c.journeyCombinationId === selectedId)) {
      selectedId = filtered[0].journeyCombinationId;
    }

    els.listPane.innerHTML = filtered
      .map((c) => {
        const selected = c.journeyCombinationId === selectedId ? "selected" : "";
        return `
          <button type="button" class="list-item ${selected}" data-id="${c.journeyCombinationId}">
            <div class="list-item-id">${escapeHtml(c.journeyCombinationId)}</div>
            <div class="list-item-key">${escapeHtml(c.journeyCombinationKey)}</div>
            <div class="list-item-meta">
              <span class="chip">${escapeHtml(c.leavePattern)}</span>
              ${statusChip(c.status)}
              <span class="chip">${c.buckets.length} buckets</span>
            </div>
          </button>`;
      })
      .join("");
  }

  function getSelected() {
    return combinations.find((c) => c.journeyCombinationId === selectedId) || null;
  }

  function renderDetail() {
    const combo = getSelected();
    if (!combo) {
      els.detailEmpty.hidden = false;
      els.detailContent.hidden = true;
      return;
    }

    els.detailEmpty.hidden = true;
    els.detailContent.hidden = false;
    els.detailTitle.textContent = combo.journeyCombinationId;
    els.detailKey.textContent = combo.journeyCombinationKey;

    els.detailFields.innerHTML = [
      ["Leave Pattern", combo.leavePattern],
      ["Leave Reason", combo.leaveReason],
      ["Universal LOA Family Code", combo.universalLoaFamilyCode],
      ["Status", combo.status],
      ["Bucket rows", String(combo.buckets.length)],
      [
        "FMLA rows",
        String(combo.buckets.filter((b) => b.fmlaTrackingBucket === "FMLA").length)
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

    els.bucketCount.textContent = `${combo.buckets.length} mapping rows`;

    const sorted = [...combo.buckets].sort((a, b) => {
      if (a.bucketSequence !== b.bucketSequence) return a.bucketSequence - b.bucketSequence;
      return a.fmlaTrackingBucket.localeCompare(b.fmlaTrackingBucket);
    });

    els.bucketTableBody.innerHTML = sorted
      .map((b, idx) => {
        const realIndex = combo.buckets.indexOf(b);
        return `
        <tr data-bucket-index="${realIndex}">
          <td class="nowrap mono">${b.bucketSequence}</td>
          <td class="nowrap"><strong>${escapeHtml(b.payBucketCode)}</strong></td>
          <td>${trackChip(b.fmlaTrackingBucket)}</td>
          <td>${ynBadge(b.userSelectable)}</td>
          <td>${ynBadge(b.mandatoryUsage)}</td>
          <td class="mono nowrap">${escapeHtml(b.allowedSelectionMode)}</td>
          <td>${ynBadge(b.waitPeriodApplies)}</td>
          <td>${escapeHtml(b.targetHcmAbsenceTypeName)}</td>
          <td class="mono">${escapeHtml(b.universalAbsenceTypeId)}</td>
          <td>${escapeHtml(b.kptimeAbsenceType)}</td>
          <td class="mono nowrap">${escapeHtml(b.primaryPtypcdNw)}</td>
          <td class="mono">${escapeHtml(b.alternatePtypcdCandidatesNw || "—")}</td>
          <td class="mono nowrap">${escapeHtml(b.derivedPayCd)}</td>
          <td>${escapeHtml(b.fmlaFlagAuthoritative)}</td>
          <td>${ynBadge(b.planSelectionRequired)}</td>
          <td>${escapeHtml(b.hoursMode)}</td>
          <td><button type="button" class="btn btn-ghost btn-sm btn-edit-bucket" data-index="${realIndex}">Edit</button></td>
        </tr>`;
      })
      .join("");

    els.mappingCards.innerHTML = sorted
      .map((b) => {
        return `
        <div class="mapping-card">
          <div class="mapping-card-top">
            <strong>${escapeHtml(b.payBucketCode)}</strong>
            <span class="chip">Seq ${b.bucketSequence}</span>
            ${trackChip(b.fmlaTrackingBucket)}
            <span class="chip">${escapeHtml(b.allowedSelectionMode)}</span>
          </div>
          <div class="mapping-grid">
            <div><div class="field-label">HCM Absence Type</div><div class="field-value">${escapeHtml(b.targetHcmAbsenceTypeName)}</div></div>
            <div><div class="field-label">Universal Absence Type ID</div><div class="field-value mono">${escapeHtml(b.universalAbsenceTypeId)}</div></div>
            <div><div class="field-label">KPTime</div><div class="field-value">${escapeHtml(b.kptimeAbsenceType)}</div></div>
            <div><div class="field-label">Primary / Alt PTYP</div><div class="field-value mono">${escapeHtml(b.primaryPtypcdNw)} / ${escapeHtml(b.alternatePtypcdCandidatesNw || "—")}</div></div>
            <div><div class="field-label">Derived PAY CD</div><div class="field-value mono">${escapeHtml(b.derivedPayCd)}</div></div>
            <div><div class="field-label">Hours Mode</div><div class="field-value">${escapeHtml(b.hoursMode)}</div></div>
            <div><div class="field-label">Flags</div><div class="field-value">User ${b.userSelectable} · Plan ${b.planSelectionRequired} · FMLA auth ${b.fmlaFlagAuthoritative}</div></div>
          </div>
        </div>`;
      })
      .join("");

    const flatSample = flattenCombo(combo)[0];
    els.schemaPreview.textContent = JSON.stringify(
      {
        description: "One spreadsheet / API row = journey header + single bucket mapping",
        columns: Object.keys(flatSample),
        sampleRow: flatSample
      },
      null,
      2
    );
  }

  function flattenCombo(combo) {
    return combo.buckets.map((b) => ({
      Journey_Combination_ID: combo.journeyCombinationId,
      Journey_Combination_Key: combo.journeyCombinationKey,
      Leave_Pattern: combo.leavePattern,
      Leave_Reason: combo.leaveReason,
      Universal_LOA_Family_Code: combo.universalLoaFamilyCode,
      Pay_Bucket_Code: b.payBucketCode,
      Bucket_Sequence: b.bucketSequence,
      FMLA_Tracking_Bucket: b.fmlaTrackingBucket,
      User_Selectable: b.userSelectable,
      Mandatory_Usage: b.mandatoryUsage,
      Allowed_Selection_Mode: b.allowedSelectionMode,
      Wait_Period_Applies: b.waitPeriodApplies,
      Wait_Substitute_Bucket: b.waitSubstituteBucket,
      Target_HCM_Absence_Type_Name: b.targetHcmAbsenceTypeName,
      Universal_Absence_Type_ID: b.universalAbsenceTypeId,
      KPTIME_Absence_Type: b.kptimeAbsenceType,
      Primary_PTYP_CD_NW: b.primaryPtypcdNw,
      Alternate_PTYP_CD_Candidates_NW: b.alternatePtypcdCandidatesNw,
      Derived_PAY_CD: b.derivedPayCd,
      FMLA_Flag_Authoritative: b.fmlaFlagAuthoritative,
      Plan_Selection_Required: b.planSelectionRequired,
      Hours_Mode: b.hoursMode
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
      if (!els.drawer.classList.contains("open") && !els.bucketDrawer.classList.contains("open")) {
        els.overlay.hidden = true;
      }
    }, 200);
  }

  function openDrawer(mode) {
    drawerMode = mode;
    els.drawerTitle.textContent =
      mode === "edit" ? "Edit Journey Combination" : "Create Journey Combination";
    const form = els.comboForm;

    if (mode === "edit") {
      const c = getSelected();
      if (!c) return;
      form.journeyCombinationId.value = c.journeyCombinationId;
      form.journeyCombinationId.readOnly = true;
      form.journeyCombinationKey.value = c.journeyCombinationKey;
      form.leavePattern.value = c.leavePattern;
      form.leaveReason.value = c.leaveReason;
      form.universalLoaFamilyCode.value = c.universalLoaFamilyCode;
      form.status.value = c.status;
      const first = c.buckets[0] || {};
      form.payBucketCode.value = first.payBucketCode || data.payBuckets[0];
      form.bucketSequence.value = first.bucketSequence || 10;
      form.fmlaTrackingBucket.value = first.fmlaTrackingBucket || "FMLA";
      form.allowedSelectionMode.value = first.allowedSelectionMode || "ALL_OR_SELECTED";
      form.targetHcmAbsenceTypeName.value = first.targetHcmAbsenceTypeName || "";
      form.universalAbsenceTypeId.value = first.universalAbsenceTypeId || "";
      form.primaryPtypcdNw.value = first.primaryPtypcdNw || "";
      form.derivedPayCd.value = first.derivedPayCd || "";
      setSwitch(document.getElementById("swUserSel"), ynToBool(first.userSelectable));
      setSwitch(document.getElementById("swPlan"), ynToBool(first.planSelectionRequired));
      setSwitch(
        document.getElementById("swFmla"),
        String(first.fmlaFlagAuthoritative || "").toLowerCase() === "yes"
      );
    } else {
      form.reset();
      form.journeyCombinationId.readOnly = false;
      form.journeyCombinationId.value = nextId();
      form.status.value = "Draft";
      form.leavePattern.value = data.leavePatterns[0];
      form.leaveReason.value = data.leaveReasons[0];
      form.universalLoaFamilyCode.value = data.universalFamilyCodes[0];
      form.payBucketCode.value = data.payBuckets[0];
      form.bucketSequence.value = 10;
      form.fmlaTrackingBucket.value = "FMLA";
      form.allowedSelectionMode.value = "ALL_OR_SELECTED";
      setSwitch(document.getElementById("swUserSel"), true);
      setSwitch(document.getElementById("swPlan"), true);
      setSwitch(document.getElementById("swFmla"), true);
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

  function openBucketDrawer(index) {
    const combo = getSelected();
    if (!combo) return;
    editingBucketIndex = index;
    const isNew = index == null || index < 0;
    document.getElementById("bucketDrawerTitle").textContent = isNew
      ? "Add bucket mapping"
      : "Edit bucket mapping";

    const b = isNew
      ? {
          payBucketCode: "PTO",
          bucketSequence: 10 + combo.buckets.length * 10,
          fmlaTrackingBucket: "FMLA",
          userSelectable: "Y",
          mandatoryUsage: "N",
          allowedSelectionMode: "ALL_OR_SELECTED",
          waitPeriodApplies: "N",
          waitSubstituteBucket: "",
          targetHcmAbsenceTypeName: "",
          universalAbsenceTypeId: "",
          kptimeAbsenceType: "",
          primaryPtypcdNw: "",
          alternatePtypcdCandidatesNw: "",
          derivedPayCd: "",
          fmlaFlagAuthoritative: "yes",
          planSelectionRequired: "Y",
          hoursMode: data.hoursModes[0]
        }
      : combo.buckets[index];

    const form = els.bucketForm;
    form.payBucketCode.value = b.payBucketCode;
    form.bucketSequence.value = b.bucketSequence;
    form.fmlaTrackingBucket.value = b.fmlaTrackingBucket;
    form.allowedSelectionMode.value = b.allowedSelectionMode;
    form.waitPeriodApplies.value = b.waitPeriodApplies || "N";
    form.waitSubstituteBucket.value = b.waitSubstituteBucket || "";
    form.targetHcmAbsenceTypeName.value = b.targetHcmAbsenceTypeName || "";
    form.universalAbsenceTypeId.value = b.universalAbsenceTypeId || "";
    form.kptimeAbsenceType.value = b.kptimeAbsenceType || "";
    form.primaryPtypcdNw.value = b.primaryPtypcdNw || "";
    form.alternatePtypcdCandidatesNw.value = b.alternatePtypcdCandidatesNw || "";
    form.derivedPayCd.value = b.derivedPayCd || "";
    form.hoursMode.value = b.hoursMode || data.hoursModes[0];
    setSwitch(document.getElementById("bSwUser"), ynToBool(b.userSelectable));
    setSwitch(document.getElementById("bSwMand"), ynToBool(b.mandatoryUsage));
    setSwitch(document.getElementById("bSwPlan"), ynToBool(b.planSelectionRequired));
    setSwitch(
      document.getElementById("bSwFmla"),
      String(b.fmlaFlagAuthoritative || "").toLowerCase() === "yes"
    );

    openOverlay();
    els.bucketDrawer.classList.add("open");
    els.bucketDrawer.setAttribute("aria-hidden", "false");
  }

  function closeBucketDrawer() {
    els.bucketDrawer.classList.remove("open");
    els.bucketDrawer.setAttribute("aria-hidden", "true");
    closeOverlay();
    editingBucketIndex = null;
  }

  function ynToBool(v) {
    return String(v).toUpperCase() === "Y" || String(v).toLowerCase() === "yes";
  }

  function boolToYn(on) {
    return on ? "Y" : "N";
  }

  function setSwitch(el, on) {
    el.classList.toggle("on", !!on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function switchOn(el) {
    return el.classList.contains("on");
  }

  function nextId() {
    const nums = combinations
      .map((c) => Number((c.journeyCombinationId.match(/(\d+)$/) || [])[1]))
      .filter((n) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `OR_LOA_${next}`;
  }

  function saveCombo() {
    const form = els.comboForm;
    if (!form.reportValidity()) return;

    const header = {
      journeyCombinationId: form.journeyCombinationId.value.trim(),
      journeyCombinationKey: form.journeyCombinationKey.value.trim(),
      leavePattern: form.leavePattern.value,
      leaveReason: form.leaveReason.value,
      universalLoaFamilyCode: form.universalLoaFamilyCode.value,
      status: form.status.value
    };

    const bucket = {
      payBucketCode: form.payBucketCode.value,
      bucketSequence: Number(form.bucketSequence.value) || 10,
      fmlaTrackingBucket: form.fmlaTrackingBucket.value,
      userSelectable: boolToYn(switchOn(document.getElementById("swUserSel"))),
      mandatoryUsage: "N",
      allowedSelectionMode: form.allowedSelectionMode.value,
      waitPeriodApplies: "N",
      waitSubstituteBucket: "",
      targetHcmAbsenceTypeName: form.targetHcmAbsenceTypeName.value.trim(),
      universalAbsenceTypeId: form.universalAbsenceTypeId.value.trim(),
      kptimeAbsenceType: `KPTIME - ${form.fmlaTrackingBucket.value} - ${form.payBucketCode.value}`,
      primaryPtypcdNw: form.primaryPtypcdNw.value.trim(),
      alternatePtypcdCandidatesNw: "",
      derivedPayCd: form.derivedPayCd.value.trim(),
      fmlaFlagAuthoritative: switchOn(document.getElementById("swFmla")) ? "yes" : "No",
      planSelectionRequired: boolToYn(switchOn(document.getElementById("swPlan"))),
      hoursMode:
        form.allowedSelectionMode.value === "SYSTEM_GENERATED"
          ? "System generated remainder"
          : form.allowedSelectionMode.value === "SYSTEM_REMAINDER"
            ? "Remaining hours only"
            : "User selected hours or all available balance"
    };

    if (drawerMode === "edit") {
      const idx = combinations.findIndex((c) => c.journeyCombinationId === selectedId);
      if (idx >= 0) {
        combinations[idx] = {
          ...combinations[idx],
          ...header,
          buckets: combinations[idx].buckets.length
            ? combinations[idx].buckets.map((b, i) => (i === 0 ? { ...b, ...bucket } : b))
            : [bucket]
        };
      }
      showToast("Journey combination updated");
    } else {
      if (combinations.some((c) => c.journeyCombinationId === header.journeyCombinationId)) {
        showToast("Combination ID already exists");
        return;
      }
      combinations.unshift({ ...header, buckets: [bucket] });
      selectedId = header.journeyCombinationId;
      showToast("Journey combination created");
    }

    closeDrawer();
    refresh();
  }

  function saveBucket() {
    const combo = getSelected();
    if (!combo) return;
    const form = els.bucketForm;
    if (!form.reportValidity()) return;

    const bucket = {
      payBucketCode: form.payBucketCode.value,
      bucketSequence: Number(form.bucketSequence.value) || 10,
      fmlaTrackingBucket: form.fmlaTrackingBucket.value,
      userSelectable: boolToYn(switchOn(document.getElementById("bSwUser"))),
      mandatoryUsage: boolToYn(switchOn(document.getElementById("bSwMand"))),
      allowedSelectionMode: form.allowedSelectionMode.value,
      waitPeriodApplies: form.waitPeriodApplies.value,
      waitSubstituteBucket: form.waitSubstituteBucket.value.trim(),
      targetHcmAbsenceTypeName: form.targetHcmAbsenceTypeName.value.trim(),
      universalAbsenceTypeId: form.universalAbsenceTypeId.value.trim(),
      kptimeAbsenceType: form.kptimeAbsenceType.value.trim(),
      primaryPtypcdNw: form.primaryPtypcdNw.value.trim(),
      alternatePtypcdCandidatesNw: form.alternatePtypcdCandidatesNw.value.trim(),
      derivedPayCd: form.derivedPayCd.value.trim(),
      fmlaFlagAuthoritative: switchOn(document.getElementById("bSwFmla")) ? "yes" : "No",
      planSelectionRequired: boolToYn(switchOn(document.getElementById("bSwPlan"))),
      hoursMode: form.hoursMode.value
    };

    if (editingBucketIndex == null || editingBucketIndex < 0) {
      combo.buckets.push(bucket);
      showToast("Bucket mapping added");
    } else {
      combo.buckets[editingBucketIndex] = bucket;
      showToast("Bucket mapping updated");
    }

    closeBucketDrawer();
    refresh();
  }

  function duplicateSelected() {
    const c = getSelected();
    if (!c) return;
    const copy = structuredClone(c);
    copy.journeyCombinationId = nextId();
    copy.journeyCombinationKey = `${c.journeyCombinationKey} (Copy)`;
    copy.status = "Draft";
    combinations.unshift(copy);
    selectedId = copy.journeyCombinationId;
    refresh();
    showToast(`Duplicated as ${copy.journeyCombinationId}`);
  }

  function exportCsv() {
    const rows = combinations.flatMap(flattenCombo);
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
    a.download = "journey_combinations.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported journey_combinations.csv");
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
      els.filterPattern.addEventListener(evt, refresh);
      els.filterReason.addEventListener(evt, refresh);
      els.filterStatus.addEventListener(evt, refresh);
      els.filterBucket.addEventListener(evt, refresh);
    });

    document.getElementById("btnCreate").addEventListener("click", () => openDrawer("create"));
    document.getElementById("btnEdit").addEventListener("click", () => openDrawer("edit"));
    document.getElementById("btnDuplicate").addEventListener("click", duplicateSelected);
    document.getElementById("btnExport").addEventListener("click", exportCsv);
    document.getElementById("btnAddBucket").addEventListener("click", () => openBucketDrawer(-1));

    document.getElementById("btnCloseDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnCancelDrawer").addEventListener("click", closeDrawer);
    document.getElementById("btnSaveDrawer").addEventListener("click", saveCombo);

    document.getElementById("btnCloseBucketDrawer").addEventListener("click", closeBucketDrawer);
    document.getElementById("btnCancelBucket").addEventListener("click", closeBucketDrawer);
    document.getElementById("btnSaveBucket").addEventListener("click", saveBucket);

    els.overlay.addEventListener("click", () => {
      closeDrawer();
      closeBucketDrawer();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeBucketDrawer();
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

    els.bucketTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit-bucket");
      if (!btn) return;
      openBucketDrawer(Number(btn.dataset.index));
    });
  }

  initFiltersAndForms();
  bindEvents();
  refresh();
})();
