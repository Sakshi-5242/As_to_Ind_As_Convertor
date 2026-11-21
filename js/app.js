/**
 * AS to Ind AS Conversion Assistant - Application Controller
 * Features:
 * - Dynamic Financial Year Selector (FY 2026-27, FY 2025-26, FY 2027-28, etc.)
 * - Zero Pre-filled Initial State (Blank inputs for accountant's company)
 * - Testing dataset support in folder (Testing_Data/AS_Based_Trial_Balance_FY2025_26.csv)
 * - Directly Editable Interactive Trial Balance with Real-time Recalculation
 * - Statutory Flagged Conversion Journal Entries (analyzing uploaded TB)
 * - Full Division II Schedule III Financial Statements: Balance Sheet, P&L with OCI
 * - Statement of Changes in Equity (SOCIE Parts A & B)
 * - Statement of Cash Flows (Ind AS 7 indirect method)
 * - ICAI Guidance Note Structured Tables for Notes to Accounts (Notes 1 to 14)
 * - 10-Sheet Comprehensive Excel Export (.xls)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global Blank Initial State (No pre-filled company or financial data)
  const state = {
    currentStep: 1,
    isApplicable: false,
    company: {
      name: "",
      cin: "",
      companyType: "unlisted_public",
      isListed: false,
      securitiesProposedToList: false,
      natureOfBusiness: "manufacturing",
      isNBFC: false,
      isBankOrInsurance: false,
      groupRelationship: "none",
      isHoldingOrSubOfIndASEntity: false,
      financialYearApplying: "2026-2027",
      netWorthHistory: [{ date: "31 March 2027", netWorthCr: 0 }]
    },
    trialBalance: [], // Starts completely empty until user uploads file
    managementInputs: JSON.parse(JSON.stringify(window.INDAS_MASTER_DATA.managementInputs)),
    exemptions: JSON.parse(JSON.stringify(window.INDAS_MASTER_DATA.optionalExemptions)),
    taxRate: 25.17,
    adjustments: null,
    convertedTb: null,
    financialStatements: null,
    applicabilityResult: null
  };

  // Instantiate Engine Classes
  const applicabilityEngine = new window.IndASApplicabilityEngine();
  const adjustmentEngine = new window.IndASAdjustmentEngine();
  const reclassificationEngine = new window.IndASReclassificationEngine();
  const financialStatementsEngine = new window.IndASFinancialStatementsEngine();
  const disclosureChecker = new window.IndASDisclosureChecker();
  const excelExportEngine = new window.IndASExcelExportEngine();

  // Initialize adjustment engine inputs
  adjustmentEngine.initInputs(state.managementInputs);

  // Toast Notification Helper
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // =========================================================================
  // STEPPER NAVIGATION & GATING
  // =========================================================================
  function goToStep(stepNumber) {
    if (stepNumber > 2 && !state.isApplicable) {
      showToast("🔒 Please verify Ind AS Applicability in Step 2 first!", "warning");
      return;
    }

    if (stepNumber > 3 && state.trialBalance.length === 0) {
      showToast("🔒 Please upload your Previous GAAP Trial Balance in Step 3 first!", "warning");
      return;
    }

    state.currentStep = stepNumber;

    // Update Stepper buttons UI
    for (let i = 1; i <= 6; i++) {
      const btn = document.getElementById(`step-btn-${i}`);
      if (!btn) continue;

      btn.classList.remove("active");
      if (i < stepNumber) {
        btn.classList.add("completed");
        btn.querySelector(".step-number").textContent = "✓";
      } else {
        btn.classList.remove("completed");
        btn.querySelector(".step-number").textContent = i;
      }

      if (i === stepNumber) {
        btn.classList.add("active");
      }

      // Unlock status
      if (i > 2) {
        if (state.isApplicable) {
          btn.classList.remove("locked");
          const labelSpan = btn.querySelector("span:last-child");
          if (labelSpan) labelSpan.textContent = labelSpan.textContent.replace(" 🔒", "");
        } else {
          btn.classList.add("locked");
        }
      }
    }

    // Switch Wizard Sections
    document.querySelectorAll(".wizard-step").forEach(sec => sec.classList.remove("active"));
    const targetSection = document.getElementById(`wizard-step-${stepNumber}`);
    if (targetSection) {
      targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Bind Stepper Clicks
  document.querySelectorAll(".step-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.getAttribute("data-step"), 10);
      goToStep(step);
    });
  });

  // Bind Back buttons
  document.querySelectorAll(".btn-back").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.getAttribute("data-goto"), 10);
      goToStep(targetStep);
    });
  });

  // =========================================================================
  // STEP 1: READ INPUTS & VALIDATE WITH FINANCIAL YEAR SELECTOR
  // =========================================================================
  // Map to store Net Worth per selected FY
const netWorthByFY = {};
const fySelect = document.getElementById("inp-financial-year");
  if (fySelect) {
    fySelect.addEventListener("change", (e) => {
      // Save current net worth for the previously selected FY
      const prevFY = state.company.financialYearApplying;
      const prevNWVal = document.getElementById("inp-net-worth").value.trim();
      if (prevNWVal !== "") {
        netWorthByFY[prevFY] = prevNWVal;
      }

      // Update state with new FY
      state.company.financialYearApplying = e.target.value;

      // Update label to reflect the 31 March audit date of the selected FY
      const parts = e.target.value.split("-");
      const startYear = parseInt(parts[0], 10) || 2026;
      const endYear = parseInt(parts[1], 10) || 2027;
      const refYear = endYear; // Balance sheet date is 31 March of closing year
      const nwLabel = document.getElementById("lbl-net-worth") || document.getElementById("inp-net-worth")?.previousElementSibling;
      if (nwLabel) {
        nwLabel.innerHTML = `Audited Net Worth as on 31 March ${refYear} (for F.Y. ${startYear}-${String(endYear).slice(-2)}) (₹ in Crores) <span style="color:red">*</span>`;
      }

      // Load saved net worth for the newly selected FY, if any
      if (netWorthByFY[e.target.value] !== undefined) {
        document.getElementById("inp-net-worth").value = netWorthByFY[e.target.value];
      } else {
        document.getElementById("inp-net-worth").value = "";
      }
    });
  }

  function collectStep1Inputs() {
    const fyEl = document.getElementById("inp-financial-year");
    state.company.financialYearApplying = fyEl ? fyEl.value : "2026-2027";
    state.company.name = document.getElementById("inp-company-name").value.trim();
    state.company.cin = document.getElementById("inp-cin").value.trim();
    state.company.companyType = document.getElementById("inp-company-type").value;
    state.company.isListed = (state.company.companyType === "listed_equity" || state.company.companyType === "listed_debt");
    state.company.securitiesProposedToList = (document.getElementById("inp-proposed-listing").value === "yes");
    state.company.natureOfBusiness = document.getElementById("inp-nature-business").value;
    state.company.isNBFC = (state.company.natureOfBusiness === "nbfc");
    state.company.isBankOrInsurance = (state.company.natureOfBusiness === "banking" || state.company.natureOfBusiness === "insurance");

    const nwVal = document.getElementById("inp-net-worth").value.trim();
    const nw = parseFloat(nwVal) || 0;
    const parts = state.company.financialYearApplying.split("-");
    const endYear = parseInt(parts[1], 10) || 2027;
    state.company.netWorthHistory = [{ date: `31 March ${endYear}`, netWorthCr: nw }];
    state.company.groupRelationship = document.getElementById("inp-group-status").value;
    state.company.isHoldingOrSubOfIndASEntity = (state.company.groupRelationship !== "none");
  }

  const btnGotoStep2 = document.getElementById("btn-goto-step-2");
  if (btnGotoStep2) {
    btnGotoStep2.addEventListener("click", () => {
      collectStep1Inputs();
      if (!state.company.name) {
        showToast("Please enter the Company Legal Name", "warning");
        document.getElementById("inp-company-name").focus();
        return;
      }
      const nwVal = document.getElementById("inp-net-worth").value.trim();
      if (nwVal === "" || isNaN(parseFloat(nwVal))) {
        showToast("Please enter Net Worth (in ₹ Crores)", "warning");
        document.getElementById("inp-net-worth").focus();
        return;
      }

      evaluateApplicabilityAndRenderStep2();
      goToStep(2);
    });
  }

  // =========================================================================
  // STEP 2: EVALUATE APPLICABILITY & RENDER TIMELINE
  // =========================================================================
  function evaluateApplicabilityAndRenderStep2() {
    const nw = state.company.netWorthHistory[0].netWorthCr;

    const evalResult = applicabilityEngine.evaluate({
      companyName: state.company.name,
      cin: state.company.cin,
      companyType: state.company.companyType,
      isListed: state.company.isListed,
      proposedListing: state.company.securitiesProposedToList,
      netWorthCr: nw,
      natureOfBusiness: state.company.natureOfBusiness,
      isNBFC: state.company.isNBFC,
      isBankOrInsurance: state.company.isBankOrInsurance,
      isHoldingOrSubOfIndASEntity: state.company.isHoldingOrSubOfIndASEntity,
      groupEntityIndASStatus: state.company.groupRelationship,
      financialYearApplying: state.company.financialYearApplying || "2026-2027",
      netWorthFY: state.company.financialYearApplying || "2026-2027"
    });

    state.applicabilityResult = evalResult;
    state.isApplicable = evalResult.isApplicable;

    const banner = document.getElementById("verdict-banner");
    const title = document.getElementById("verdict-title");
    const sub = document.getElementById("verdict-subtitle");
    const badge = document.getElementById("verdict-badge");
    const icon = document.getElementById("verdict-icon");
    const details = document.getElementById("verdict-details");
    const btnGotoStep3 = document.getElementById("btn-goto-step-3");
    const badgeSelectedFy = document.getElementById("badge-selected-fy");

    if (badgeSelectedFy && evalResult.timeline) {
      badgeSelectedFy.textContent = `Audited Net Worth Basis: ${evalResult.timeline.netWorthFYDisplay || "FY 2025–26"}`;
    }

    if (evalResult.isApplicable) {
      banner.className = "verdict-card applicable";
      badge.className = "verdict-badge applicable";
      badge.textContent = evalResult.status;
      icon.textContent = "✅";
      title.textContent = `Ind AS is STATUTORILY MANDATORY for ${state.company.name}`;
      sub.textContent = evalResult.triggers.join("; ");
      sub.style.color = "#065f46";

      btnGotoStep3.className = "btn btn-success btn-lg";
      btnGotoStep3.textContent = "Ind AS is Applicable! Proceed to Step 3: Upload Trial Balance →";
      btnGotoStep3.style.display = "inline-flex";

      for (let i = 3; i <= 6; i++) {
        const btn = document.getElementById(`step-btn-${i}`);
        if (btn) btn.classList.remove("locked");
      }
    } else {
      banner.className = "verdict-card not-applicable";
      badge.className = "verdict-badge not-applicable";
      badge.textContent = "Ind AS Not Applicable";
      icon.textContent = "ℹ️";
      title.textContent = `Ind AS is NOT Mandatorily Applicable`;
      sub.textContent = `Audited Net Worth of ₹${nw.toFixed(2)} Crores as on ${evalResult.timeline ? evalResult.timeline.referenceNetWorthDate : '31 March'} (${evalResult.timeline ? evalResult.timeline.netWorthFYDisplay : ''}) is below the statutory ₹250 Crores threshold under Rule 4(1)(iii)(b). Ind AS is not mandatory for ${evalResult.timeline ? evalResult.timeline.firstReportingYear : 'subsequent period'}; company continues under Companies (AS) Rules, 2021.`;
      sub.style.color = "#991b1b";

      btnGotoStep3.className = "btn btn-outline-primary btn-lg";
      btnGotoStep3.textContent = "Adopt Ind AS Voluntarily under Rule 4(1)(v) & Proceed to Step 3 →";
      btnGotoStep3.style.display = "inline-flex";
      btnGotoStep3.onclick = () => {
        state.isApplicable = true;
        showToast("Voluntary Ind AS Adoption selected under Rule 4(1)(v)! Steps 3–6 unlocked.", "info");
        goToStep(3);
      };
    }

    details.innerHTML = `
      <div><strong>Statutory Citation:</strong> ${evalResult.legalCitation}</div>
      <div style="margin-top: 4px; color: var(--text-muted);">${evalResult.technicalBasis.join("; ")}</div>
    `;

    if (evalResult.timeline) {
      document.getElementById("timeline-transition-date").textContent = evalResult.timeline.transitionDate;
      document.getElementById("timeline-comparative-year").textContent = evalResult.timeline.comparativeYear;
      document.getElementById("timeline-reporting-year").textContent = evalResult.timeline.firstReportingYear;

      const msContainer = document.getElementById("timeline-milestones-container");
      if (msContainer && evalResult.timeline.milestones) {
        const rows = evalResult.timeline.milestones.map(m => `
          <tr>
            <td style="font-weight: 700; width: 230px; color: #1e3a8a;">${m.phase}</td>
            <td class="font-mono" style="font-weight: 600; width: 170px; color: #0f172a;">${m.date}</td>
            <td style="font-size: 12.5px; color: #334155;">${m.description}</td>
          </tr>
        `).join("");

        msContainer.innerHTML = `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px;">
            <div style="background: #f8fafc; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 700; font-size: 13px; color: #1e3a8a;">
              📋 ICAI &amp; MCA Transition Milestones Framework Schedule
            </div>
            <div class="table-wrapper" style="margin-bottom: 0;">
              <table class="app-table" style="margin-bottom: 0;">
                <thead>
                  <tr>
                    <th>Statutory Adoption Milestone</th>
                    <th>Effective Date / Period</th>
                    <th>Mandatory Accounting Treatment (Ind AS 101 &amp; Rule 4)</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      }
    }
  }

  const btnGotoStep3 = document.getElementById("btn-goto-step-3");
  if (btnGotoStep3) {
    btnGotoStep3.addEventListener("click", () => {
      goToStep(3);
    });
  }

  // =========================================================================
  // STEP 3: TRIAL BALANCE UPLOAD & REAL-TIME EDITABLE GRID
  // =========================================================================
  function updateStep3Totals() {
    let totDr = 0;
    let totCr = 0;
    for (const r of state.trialBalance) {
      totDr += (r.debit || 0);
      totCr += (r.credit || 0);
    }

    document.getElementById("disp-tb-total-dr").textContent = `₹${totDr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
    document.getElementById("disp-tb-total-cr").textContent = `₹${totCr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
    document.getElementById("disp-tb-count").textContent = `${state.trialBalance.length} Accounts`;

    const diff = Math.abs(totDr - totCr);
    const badge = document.getElementById("tb-badge-status");
    if (diff < 0.05) {
      badge.className = "badge badge-success";
      badge.textContent = "Balanced ✓ (Diff: ₹0.00)";
    } else {
      badge.className = "badge badge-danger";
      badge.textContent = `Mismatch Alert: Diff ₹${diff.toFixed(2)} L`;
    }
  }

  function renderStep3TrialBalance() {
    const summaryContainer = document.getElementById("tb-summary-container");
    const btnGotoStep4 = document.getElementById("btn-goto-step-4");

    if (state.trialBalance.length === 0) {
      summaryContainer.style.display = "none";
      btnGotoStep4.style.display = "none";
      return;
    }

    summaryContainer.style.display = "block";
    btnGotoStep4.style.display = "inline-flex";

    const tbody = document.getElementById("step3-tb-tbody");

    tbody.innerHTML = state.trialBalance.map((row, idx) => {
      const drVal = (row.debit || 0) > 0 ? row.debit : "";
      const crVal = (row.credit || 0) > 0 ? row.credit : "";

      return `
        <tr>
          <td class="font-mono" style="font-weight: 700; color: #1e3a8a;">${row.code}</td>
          <td>
            <div style="font-weight: 600; font-size: 13px;">${row.name}</div>
          </td>
          <td><span class="badge badge-neutral" style="font-size: 11px;">${row.group}</span></td>
          <td class="text-right">
            <input type="number" step="0.01" class="tb-editable-cell" data-idx="${idx}" data-field="debit" value="${drVal}" placeholder="0.00">
          </td>
          <td class="text-right">
            <input type="number" step="0.01" class="tb-editable-cell" data-idx="${idx}" data-field="credit" value="${crVal}" placeholder="0.00">
          </td>
        </tr>
      `;
    }).join("");

    updateStep3Totals();

    // Attach real-time input listeners to editable cells
    tbody.querySelectorAll(".tb-editable-cell").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const field = e.target.dataset.field;
        const val = parseFloat(e.target.value) || 0;
        state.trialBalance[idx][field] = val;
        updateStep3Totals();

        // Dynamically recalculate adjustments and financials in background
        runCoreCalculations();
        if (state.currentStep === 4) {
          renderStep4Adjustments();
        } else if (state.currentStep === 5) {
          renderStep5FinancialStatements();
        }
      });
    });
  }

  // Download Sample Template CSV
  const btnDownloadTemplate = document.getElementById("btn-download-template");
  if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
      let csv = "Account Code,Account Description,Group,Debit,Credit,Nature\n";
      csv += "1010,Paid-up Equity Share Capital,Shareholders Funds,0,5000.00,Equity\n";
      csv += "1020,8% Cumulative Redeemable Preference Shares,Shareholders Funds,0,2000.00,Equity\n";
      csv += "2010,Term Loan from Bank (Secured),Non-Current Liabilities,0,8000.00,Liability\n";
      csv += "3010,Freehold Land,Non-Current Assets,5200.00,0,Asset\n";
      csv += "3030,Plant and Machinery,Non-Current Assets,19050.00,0,Asset\n";
      csv += "4040,Trade Receivables,Current Assets,6850.00,0,Asset\n";
      csv += "5010,Revenue from Sale of Products,Revenue,0,38400.00,Revenue\n";
      csv += "6010,Cost of Materials Consumed,Expenses,21850.00,0,Expense\n";

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sample_Trial_Balance_Template.csv";
      link.click();
      URL.revokeObjectURL(url);
      showToast("Template downloaded! You can also use the Testing_Data file in the folder.", "info");
    });
  }

  // File Upload Handlers (CSV & Excel)
  const fileInput = document.getElementById("file-upload-input");
  const dropzone = document.getElementById("step3-dropzone");

  if (dropzone && fileInput) {
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) handleUploadedFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) handleUploadedFile(e.target.files[0]);
    });
  }

  function handleUploadedFile(file) {
    showToast(`Parsing ${file.name}...`, "info");
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e) => {
        parseCsv(e.target.result);
      };
      reader.readAsText(file);
    } else if (window.XLSX) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = window.XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          parseSheetRows(rows);
        } catch (err) {
          showToast("Failed to parse Excel: " + err.message, "danger");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showToast("Please upload a .csv or .xlsx file.", "warning");
    }
  }

  function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(x => x.replace(/^["']|["']$/g, '').trim());
  }

  function parseCsv(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const c = parseCsvLine(lines[i]);
      if (c.length >= 4) {
        parsed.push({
          code: c[0] || `A${i}`,
          name: c[1] || "Account Description",
          group: c[2] || "General Group",
          debit: parseFloat(c[3]) || 0,
          credit: parseFloat(c[4]) || 0,
          nature: (parseFloat(c[3]) || 0) > 0 ? "Asset/Expense" : "Liability/Revenue"
        });
      }
    }
    if (parsed.length > 0) {
      state.trialBalance = parsed;
      renderStep3TrialBalance();
      runCoreCalculations();
      showToast(`Uploaded ${parsed.length} accounts from CSV! Click Step 4 to view flagged adjustments.`, "success");
    }
  }

  function parseSheetRows(rows) {
    const parsed = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r && r.length >= 4) {
        parsed.push({
          code: String(r[0] || `A${i}`),
          name: String(r[1] || "Account Description"),
          group: String(r[2] || "General Group"),
          debit: parseFloat(r[3]) || 0,
          credit: parseFloat(r[4]) || 0,
          nature: (parseFloat(r[3]) || 0) > 0 ? "Asset/Expense" : "Liability/Revenue"
        });
      }
    }
    if (parsed.length > 0) {
      state.trialBalance = parsed;
      renderStep3TrialBalance();
      runCoreCalculations();
      showToast(`Uploaded ${parsed.length} accounts from Excel! Click Step 4 to view flagged adjustments.`, "success");
    }
  }

  const btnGotoStep4 = document.getElementById("btn-goto-step-4");
  if (btnGotoStep4) {
    btnGotoStep4.addEventListener("click", () => {
      runCoreCalculations();
      renderStep4Adjustments();
      goToStep(4);
    });
  }

  // =========================================================================
  // STEP 4: FLAGGED CONVERSION JOURNAL ENTRIES & ASSUMPTIONS
  // =========================================================================
  function runCoreCalculations() {
    if (state.trialBalance.length === 0) return;

    const taxInput = parseFloat(document.getElementById("inp-tax-rate")?.value);
    if (!isNaN(taxInput) && taxInput > 0) state.taxRate = taxInput;

    const adjustments = adjustmentEngine.calculateAdjustments(state.trialBalance, state.taxRate);
    state.adjustments = adjustments;

    const convertedTb = adjustmentEngine.generateConvertedTrialBalance(state.trialBalance);
    state.convertedTb = convertedTb;

    const fs = financialStatementsEngine.generate(convertedTb, state.trialBalance, adjustments, state.company);
    state.financialStatements = fs;

    // Reveal header export button when financials are ready
    const headerExportBtn = document.getElementById("btn-header-export");
    if (headerExportBtn) headerExportBtn.style.display = "inline-flex";
  }

  function renderStep4Adjustments() {
    const tbody = document.getElementById("flagged-jv-tbody");
    if (!tbody || !state.financialStatements) return;

    tbody.innerHTML = state.financialStatements.flaggedJournalEntries.map(jv => {
      return `
        <tr>
          <td class="font-mono font-bold">${jv.voucherNo}</td>
          <td><span class="badge badge-primary">${jv.standard}</span></td>
          <td><span class="badge ${jv.flagClass}">${jv.flag}</span></td>
          <td>
            <div style="font-size: 12px; font-weight: 600;">Dr: ${jv.drAccount}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Cr: ${jv.crAccount}</div>
            <div style="font-size: 11px; color: #475569; font-style: italic; margin-top: 4px;">${jv.narration}</div>
          </td>
          <td class="text-right font-mono" style="color: #065f46; font-weight: 600;">₹${jv.drAmount.toFixed(2)}</td>
          <td class="text-right font-mono" style="color: #065f46; font-weight: 600;">₹${jv.crAmount.toFixed(2)}</td>
          <td class="text-center">
            <button class="btn btn-secondary btn-sm btn-open-modal" data-voucher="${jv.voucherNo}" data-standard="${jv.standard}">
              ⚙️ Assumptions
            </button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".btn-open-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const std = e.currentTarget.getAttribute("data-standard");
        openAssumptionsModalByStandard(std);
      });
    });
  }

  function openAssumptionsModalByStandard(std) {
    let miId = "MI-LEASES";
    if (std.includes("116")) miId = "MI-LEASES";
    else if (std.includes("32")) miId = "MI-PREF-SHARES";
    else if (std.includes("109") && std.includes("ECL")) miId = "MI-ECL";
    else if (std.includes("109")) miId = "MI-SECURITY-DEP";
    else if (std.includes("19")) miId = "MI-ACTUARIAL-OCI";
    else if (std.includes("115")) miId = "MI-REVENUE-WARRANTY";
    else if (std.includes("12")) miId = "MI-DEFERRED-TAX";

    const mi = state.managementInputs.find(x => x.id === miId);
    if (!mi) return;

    const modal = document.getElementById("management-input-modal");
    document.getElementById("modal-mi-title").textContent = `${mi.title} (${mi.standard})`;

    let fields = mi.inputs.map(f => {
      if (f.type === "select") {
        const opts = f.options.map(o => `<option value="${o}" ${o === f.value ? 'selected' : ''}>${o}</option>`).join("");
        return `
          <div class="form-group" style="margin-bottom: 12px;">
            <label>${f.label}</label>
            <select class="form-control mi-param-input" data-rule="${mi.id}" data-key="${f.key}">${opts}</select>
          </div>
        `;
      }
      return `
        <div class="form-group" style="margin-bottom: 12px;">
          <label>${f.label} ${f.unit ? `(${f.unit})` : ''}</label>
          <input type="number" step="any" class="form-control mi-param-input" data-rule="${mi.id}" data-key="${f.key}" value="${f.value}">
        </div>
      `;
    }).join("");

    document.getElementById("modal-mi-body").innerHTML = `
      <div style="background: #f0f9ff; border-left: 3px solid #0284c7; padding: 10px 14px; font-size: 12px; margin-bottom: 14px; border-radius: 4px;">
        <strong>Statutory Standard Guidance:</strong> ${mi.technicalBackground}
      </div>
      <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px;">${mi.question}</div>
      <form id="form-modal-params">${fields}</form>
    `;

    modal.classList.add("show");
  }

  // Modal Save
  const btnModalSave = document.getElementById("btn-modal-save");
  if (btnModalSave) {
    btnModalSave.addEventListener("click", () => {
      document.querySelectorAll(".mi-param-input").forEach(inp => {
        const ruleId = inp.getAttribute("data-rule");
        const key = inp.getAttribute("data-key");
        const val = inp.tagName === "SELECT" ? inp.value : parseFloat(inp.value);

        const rule = state.managementInputs.find(x => x.id === ruleId);
        if (rule) {
          const f = rule.inputs.find(item => item.key === key);
          if (f) f.value = val;
        }
        adjustmentEngine.updateInput(ruleId, key, val);
      });

      document.getElementById("management-input-modal").classList.remove("show");
      runCoreCalculations();
      renderStep4Adjustments();
      showToast("Assumptions updated & financial statements recalculated!", "success");
    });
  }

  document.querySelectorAll(".modal-close-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("management-input-modal").classList.remove("show");
    });
  });

  const btnGotoStep5 = document.getElementById("btn-goto-step-5");
  if (btnGotoStep5) {
    btnGotoStep5.addEventListener("click", () => {
      runCoreCalculations();
      renderStep5FinancialStatements();
      goToStep(5);
    });
  }

  // =========================================================================
  // STEP 5: FINANCIAL STATEMENTS, ICAI STRUCTURED NOTES & SOCIE
  // =========================================================================
  function renderStep5FinancialStatements() {
    if (!state.financialStatements) return;
    const { bs, pnl, socie, cashFlow, notesToAccounts, reconciliations } = state.financialStatements;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        if (typeof val === 'number') {
          el.textContent = `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
        } else {
          el.textContent = val;
        }
      }
    };

    const setVariance = (id, indVal, asVal) => {
      const el = document.getElementById(id);
      if (el) {
        const diff = indVal - asVal;
        const sign = diff > 0 ? "+" : (diff < 0 ? "-" : "");
        el.textContent = `${sign}₹${Math.abs(diff).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
        if (Math.abs(diff) < 0.001) {
          el.style.color = "var(--text-muted)";
          el.textContent = "₹0.00 L";
        } else if (diff > 0) {
          el.style.color = "#047857";
        } else {
          el.style.color = "#b91c1c";
        }
      }
    };

    // Update dynamic dates in table headers
    const fyStr = state.company.financialYearApplying || "2026-2027";
    const parts = fyStr.split("-");
    const endYear = parseInt(parts[0], 10) + 1;
    const prevYear = endYear - 1;
    
    const bsHeaderInd = document.getElementById("col-header-indas-bs");
    if (bsHeaderInd) bsHeaderInd.innerHTML = `As at 31 Mar ${endYear}<br><span style="font-size: 10px; font-weight: normal; color: #93c5fd;">(Ind AS)</span>`;
    
    const bsHeaderAs = document.getElementById("col-header-as-bs");
    if (bsHeaderAs) bsHeaderAs.innerHTML = `As at 31 Mar ${prevYear}<br><span style="font-size: 10px; font-weight: normal; color: #cbd5e1;">(Previous GAAP / AS)</span>`;

    const pnlHeaderInd = document.getElementById("col-header-indas-pnl");
    if (pnlHeaderInd) pnlHeaderInd.innerHTML = `F.Y. ${prevYear}-${String(endYear).slice(-2)}<br><span style="font-size: 10px; font-weight: normal; color: #93c5fd;">(Ind AS)</span>`;

    const pnlHeaderAs = document.getElementById("col-header-as-pnl");
    if (pnlHeaderAs) pnlHeaderAs.innerHTML = `F.Y. ${prevYear}-${String(endYear).slice(-2)}<br><span style="font-size: 10px; font-weight: normal; color: #cbd5e1;">(Previous GAAP / AS)</span>`;

    // -------------------------------------------------------------------------
    // 1. LIVE BALANCE SHEET MATCH STATUS BANNER
    // -------------------------------------------------------------------------
    const banner = document.getElementById("bs-match-banner");
    const bannerAssets = document.getElementById("banner-total-assets");
    const bannerEqLiab = document.getElementById("banner-total-eq-liab");
    const bannerDiff = document.getElementById("banner-diff-amount");
    const bannerTitle = document.getElementById("bs-match-status-title");

    if (bannerAssets) bannerAssets.textContent = `₹${bs.totalAssetsIndAs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
    if (bannerEqLiab) bannerEqLiab.textContent = `₹${bs.totalEquityAndLiabilitiesIndAs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
    
    const diff = Math.abs(bs.bsDiffIndAs);
    if (diff < 0.01) {
      if (bannerDiff) bannerDiff.textContent = `₹0.00 (Balanced ✔)`;
      if (bannerTitle) bannerTitle.textContent = `BALANCE SHEET STATUS: 100% MATCHED & RECONCILED`;
      if (banner) banner.style.background = `linear-gradient(135deg, #064e3b 0%, #065f46 100%)`;
    } else {
      if (bannerDiff) bannerDiff.textContent = `₹${diff.toFixed(2)} L (Mismatch)`;
      if (bannerTitle) bannerTitle.textContent = `BALANCE SHEET STATUS: UNMATCHED`;
      if (banner) banner.style.background = `linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)`;
    }

    // -------------------------------------------------------------------------
    // 2. DIVISION II SCHEDULE III BALANCE SHEET DETAILS
    // -------------------------------------------------------------------------
    // Non-current assets
    setVal("bs-ppe-ind", bs.nonCurrentAssets.ppe.indAs);
    setVal("bs-ppe-as", bs.nonCurrentAssets.ppe.as);
    setVariance("bs-ppe-var", bs.nonCurrentAssets.ppe.indAs, bs.nonCurrentAssets.ppe.as);

    setVal("bs-cwip-ind", bs.nonCurrentAssets.cwip.indAs);
    setVal("bs-cwip-as", bs.nonCurrentAssets.cwip.as);
    setVariance("bs-cwip-var", bs.nonCurrentAssets.cwip.indAs, bs.nonCurrentAssets.cwip.as);

    setVal("bs-invprop-ind", bs.nonCurrentAssets.invProp.indAs);
    setVal("bs-invprop-as", bs.nonCurrentAssets.invProp.as);
    setVariance("bs-invprop-var", bs.nonCurrentAssets.invProp.indAs, bs.nonCurrentAssets.invProp.as);

    setVal("bs-rou-ind", bs.nonCurrentAssets.rouAsset.indAs);
    setVal("bs-rou-as", bs.nonCurrentAssets.rouAsset.as);
    setVariance("bs-rou-var", bs.nonCurrentAssets.rouAsset.indAs, bs.nonCurrentAssets.rouAsset.as);

    setVal("bs-intangible-ind", bs.nonCurrentAssets.intangibles.indAs);
    setVal("bs-intangible-as", bs.nonCurrentAssets.intangibles.as);
    setVariance("bs-intangible-var", bs.nonCurrentAssets.intangibles.indAs, bs.nonCurrentAssets.intangibles.as);

    setVal("bs-ncinv-ind", bs.nonCurrentAssets.ncInvestments.indAs);
    setVal("bs-ncinv-as", bs.nonCurrentAssets.ncInvestments.as);
    setVariance("bs-ncinv-var", bs.nonCurrentAssets.ncInvestments.indAs, bs.nonCurrentAssets.ncInvestments.as);

    setVal("bs-ncothfin-ind", bs.nonCurrentAssets.ncOtherFinAssets.indAs);
    setVal("bs-ncothfin-as", bs.nonCurrentAssets.ncOtherFinAssets.as);
    setVariance("bs-ncothfin-var", bs.nonCurrentAssets.ncOtherFinAssets.indAs, bs.nonCurrentAssets.ncOtherFinAssets.as);

    setVal("bs-dta-ind", bs.nonCurrentAssets.dta.indAs);
    setVal("bs-dta-as", bs.nonCurrentAssets.dta.as);
    setVariance("bs-dta-var", bs.nonCurrentAssets.dta.indAs, bs.nonCurrentAssets.dta.as);

    setVal("bs-othncassets-ind", bs.nonCurrentAssets.otherNcAssets.indAs);
    setVal("bs-othncassets-as", bs.nonCurrentAssets.otherNcAssets.as);
    setVariance("bs-othncassets-var", bs.nonCurrentAssets.otherNcAssets.indAs, bs.nonCurrentAssets.otherNcAssets.as);

    setVal("step5-bs-nc-assets", bs.nonCurrentAssets.totalIndAs);
    setVal("step5-bs-nc-assets-as", bs.nonCurrentAssets.totalAs);
    setVariance("step5-bs-nc-assets-var", bs.nonCurrentAssets.totalIndAs, bs.nonCurrentAssets.totalAs);

    // Current assets
    setVal("bs-inv-ind", bs.currentAssets.inventories.indAs);
    setVal("bs-inv-as", bs.currentAssets.inventories.as);
    setVariance("bs-inv-var", bs.currentAssets.inventories.indAs, bs.currentAssets.inventories.as);

    setVal("bs-currinv-ind", bs.currentAssets.currInvestments.indAs);
    setVal("bs-currinv-as", bs.currentAssets.currInvestments.as);
    setVariance("bs-currinv-var", bs.currentAssets.currInvestments.indAs, bs.currentAssets.currInvestments.as);

    setVal("bs-tr-ind", bs.currentAssets.tradeRec.indAs);
    setVal("bs-tr-as", bs.currentAssets.tradeRec.as);
    setVariance("bs-tr-var", bs.currentAssets.tradeRec.indAs, bs.currentAssets.tradeRec.as);

    setVal("bs-cce-ind", bs.currentAssets.cashAndCashEquiv.indAs);
    setVal("bs-cce-as", bs.currentAssets.cashAndCashEquiv.as);
    setVariance("bs-cce-var", bs.currentAssets.cashAndCashEquiv.indAs, bs.currentAssets.cashAndCashEquiv.as);

    setVal("bs-bankoth-ind", bs.currentAssets.otherBankBalances.indAs);
    setVal("bs-bankoth-as", bs.currentAssets.otherBankBalances.as);
    setVariance("bs-bankoth-var", bs.currentAssets.otherBankBalances.indAs, bs.currentAssets.otherBankBalances.as);

    setVal("bs-othcurrass-ind", bs.currentAssets.otherCurrAssets.indAs);
    setVal("bs-othcurrass-as", bs.currentAssets.otherCurrAssets.as);
    setVariance("bs-othcurrass-var", bs.currentAssets.otherCurrAssets.indAs, bs.currentAssets.otherCurrAssets.as);

    setVal("step5-bs-curr-assets", bs.currentAssets.totalIndAs);
    setVal("step5-bs-curr-assets-as", bs.currentAssets.totalAs);
    setVariance("step5-bs-curr-assets-var", bs.currentAssets.totalIndAs, bs.currentAssets.totalAs);

    // Total Assets
    setVal("step5-bs-total-assets", bs.totalAssetsIndAs);
    setVal("step5-bs-total-assets-as", bs.totalAssetsAs);
    setVariance("step5-bs-total-assets-var", bs.totalAssetsIndAs, bs.totalAssetsAs);

    // Equity
    setVal("step5-bs-share-capital", bs.equity.equityShareCapital.indAs);
    setVal("step5-bs-share-capital-as", bs.equity.equityShareCapital.as);
    setVariance("step5-bs-share-capital-var", bs.equity.equityShareCapital.indAs, bs.equity.equityShareCapital.as);

    setVal("step5-bs-other-equity", bs.equity.totalOtherEquityIndAs);
    setVal("step5-bs-other-equity-as", bs.equity.totalOtherEquityAs);
    setVariance("step5-bs-other-equity-var", bs.equity.totalOtherEquityIndAs, bs.equity.totalOtherEquityAs);

    setVal("step5-bs-total-equity", bs.equity.totalEquityIndAs);
    setVal("step5-bs-total-equity-as", bs.equity.totalEquityAs);
    setVariance("step5-bs-total-equity-var", bs.equity.totalEquityIndAs, bs.equity.totalEquityAs);

    // Non-current liabilities
    setVal("bs-ncborr-ind", bs.nonCurrentLiabilities.ncBorrowings.indAs);
    setVal("bs-ncborr-as", bs.nonCurrentLiabilities.ncBorrowings.as);
    setVariance("bs-ncborr-var", bs.nonCurrentLiabilities.ncBorrowings.indAs, bs.nonCurrentLiabilities.ncBorrowings.as);

    setVal("bs-ncleaseliab-ind", bs.nonCurrentLiabilities.ncLeaseLiab.indAs);
    setVal("bs-ncleaseliab-as", bs.nonCurrentLiabilities.ncLeaseLiab.as);
    setVariance("bs-ncleaseliab-var", bs.nonCurrentLiabilities.ncLeaseLiab.indAs, bs.nonCurrentLiabilities.ncLeaseLiab.as);

    setVal("bs-ncprov-ind", bs.nonCurrentLiabilities.ncProvisions.indAs);
    setVal("bs-ncprov-as", bs.nonCurrentLiabilities.ncProvisions.as);
    setVariance("bs-ncprov-var", bs.nonCurrentLiabilities.ncProvisions.indAs, bs.nonCurrentLiabilities.ncProvisions.as);

    setVal("bs-dtl-ind", bs.nonCurrentLiabilities.defTaxLiab.indAs);
    setVal("bs-dtl-as", bs.nonCurrentLiabilities.defTaxLiab.as);
    setVariance("bs-dtl-var", bs.nonCurrentLiabilities.defTaxLiab.indAs, bs.nonCurrentLiabilities.defTaxLiab.as);

    setVal("step5-bs-nc-liab", bs.nonCurrentLiabilities.totalIndAs);
    setVal("step5-bs-nc-liab-as", bs.nonCurrentLiabilities.totalAs);
    setVariance("step5-bs-nc-liab-var", bs.nonCurrentLiabilities.totalIndAs, bs.nonCurrentLiabilities.totalAs);

    // Current liabilities
    setVal("bs-currborr-ind", bs.currentLiabilities.currBorrowings.indAs);
    setVal("bs-currborr-as", bs.currentLiabilities.currBorrowings.as);
    setVariance("bs-currborr-var", bs.currentLiabilities.currBorrowings.indAs, bs.currentLiabilities.currBorrowings.as);

    setVal("bs-currleaseliab-ind", bs.currentLiabilities.currLeaseLiab.indAs);
    setVal("bs-currleaseliab-as", bs.currentLiabilities.currLeaseLiab.as);
    setVariance("bs-currleaseliab-var", bs.currentLiabilities.currLeaseLiab.indAs, bs.currentLiabilities.currLeaseLiab.as);

    setVal("bs-tpmsme-ind", bs.currentLiabilities.tradePayablesMsme.indAs);
    setVal("bs-tpmsme-as", bs.currentLiabilities.tradePayablesMsme.as);
    setVariance("bs-tpmsme-var", bs.currentLiabilities.tradePayablesMsme.indAs, bs.currentLiabilities.tradePayablesMsme.as);

    setVal("bs-tpoth-ind", bs.currentLiabilities.tradePayablesOthers.indAs);
    setVal("bs-tpoth-as", bs.currentLiabilities.tradePayablesOthers.as);
    setVariance("bs-tpoth-var", bs.currentLiabilities.tradePayablesOthers.indAs, bs.currentLiabilities.tradePayablesOthers.as);

    setVal("bs-currothfin-ind", bs.currentLiabilities.otherCurrFinLiab.indAs);
    setVal("bs-currothfin-as", bs.currentLiabilities.otherCurrFinLiab.as);
    setVariance("bs-currothfin-var", bs.currentLiabilities.otherCurrFinLiab.indAs, bs.currentLiabilities.otherCurrFinLiab.as);

    setVal("bs-othcurrliab-ind", bs.currentLiabilities.otherCurrLiab.indAs);
    setVal("bs-othcurrliab-as", bs.currentLiabilities.otherCurrLiab.as);
    setVariance("bs-othcurrliab-var", bs.currentLiabilities.otherCurrLiab.indAs, bs.currentLiabilities.otherCurrLiab.as);

    setVal("bs-currprov-ind", bs.currentLiabilities.currProvisions.indAs);
    setVal("bs-currprov-as", bs.currentLiabilities.currProvisions.as);
    setVariance("bs-currprov-var", bs.currentLiabilities.currProvisions.indAs, bs.currentLiabilities.currProvisions.as);

    setVal("step5-bs-curr-liab", bs.currentLiabilities.totalIndAs);
    setVal("step5-bs-curr-liab-as", bs.currentLiabilities.totalAs);
    setVariance("step5-bs-curr-liab-var", bs.currentLiabilities.totalIndAs, bs.currentLiabilities.totalAs);

    // Total Equity & Liabilities
    setVal("step5-bs-total-equity-liab", bs.totalEquityAndLiabilitiesIndAs);
    setVal("step5-bs-total-equity-liab-as", bs.totalEquityAndLiabilitiesAs);
    setVariance("step5-bs-total-equity-liab-var", bs.totalEquityAndLiabilitiesIndAs, bs.totalEquityAndLiabilitiesAs);

    // Difference check verification row
    const diffIndAsEl = document.getElementById("bs-diff-check-ind");
    if (diffIndAsEl) {
      diffIndAsEl.textContent = `₹${Math.abs(bs.bsDiffIndAs).toFixed(2)} (Balanced)`;
      diffIndAsEl.style.color = Math.abs(bs.bsDiffIndAs) < 0.01 ? "#047857" : "#b91c1c";
    }
    const diffAsEl = document.getElementById("bs-diff-check-as");
    if (diffAsEl) {
      diffAsEl.textContent = `₹${Math.abs(bs.bsDiffAs).toFixed(2)} (Balanced)`;
      diffAsEl.style.color = Math.abs(bs.bsDiffAs) < 0.01 ? "#047857" : "#b91c1c";
    }

    // -------------------------------------------------------------------------
    // 3. STATEMENT OF PROFIT & LOSS (Division II Schedule III)
    // -------------------------------------------------------------------------
    setVal("step5-pnl-rev-as", pnl.prevRev);
    setVal("step5-pnl-rev-ind", pnl.indRev);
    setVariance("step5-pnl-rev-var", pnl.indRev, pnl.prevRev);

    setVal("step5-pnl-othinc-as", pnl.prevOtherInc);
    setVal("step5-pnl-othinc-ind", pnl.indOtherInc);
    setVariance("step5-pnl-othinc-var", pnl.indOtherInc, pnl.prevOtherInc);

    setVal("step5-pnl-totinc-as", pnl.prevTotalIncome);
    setVal("step5-pnl-totinc-ind", pnl.indTotalIncome);
    setVariance("step5-pnl-totinc-var", pnl.indTotalIncome, pnl.prevTotalIncome);

    setVal("step5-pnl-mat-as", pnl.prevCostMat);
    setVal("step5-pnl-mat-ind", pnl.indCostMat);
    setVariance("step5-pnl-mat-var", pnl.indCostMat, pnl.prevCostMat);

    setVal("step5-pnl-inv-as", pnl.prevChangeInv);
    setVal("step5-pnl-inv-ind", pnl.indChangeInv);
    setVariance("step5-pnl-inv-var", pnl.indChangeInv, pnl.prevChangeInv);

    setVal("step5-pnl-emp-as", pnl.prevEmpExp);
    setVal("step5-pnl-emp-ind", pnl.indEmpExp);
    setVariance("step5-pnl-emp-var", pnl.indEmpExp, pnl.prevEmpExp);

    setVal("step5-pnl-fin-as", pnl.prevFinCost);
    setVal("step5-pnl-fin-ind", pnl.indFinCost);
    setVariance("step5-pnl-fin-var", pnl.indFinCost, pnl.prevFinCost);

    setVal("step5-pnl-depr-as", pnl.prevDepr);
    setVal("step5-pnl-depr-ind", pnl.indDepr);
    setVariance("step5-pnl-depr-var", pnl.indDepr, pnl.prevDepr);

    setVal("step5-pnl-other-as", pnl.prevOtherExp);
    setVal("step5-pnl-other-ind", pnl.indOtherExp);
    setVariance("step5-pnl-other-var", pnl.indOtherExp, pnl.prevOtherExp);

    setVal("step5-pnl-totexp-as", pnl.prevTotalExp);
    setVal("step5-pnl-totexp-ind", pnl.indTotalExp);
    setVariance("step5-pnl-totexp-var", pnl.indTotalExp, pnl.prevTotalExp);

    setVal("step5-pnl-pbt-as", pnl.prevPBT);
    setVal("step5-pnl-pbt-ind", pnl.indPBT);
    setVariance("step5-pnl-pbt-var", pnl.indPBT, pnl.prevPBT);

    setVal("step5-pnl-tax-as", pnl.prevTotalTax);
    setVal("step5-pnl-tax-ind", pnl.indTotalTax);
    setVariance("step5-pnl-tax-var", pnl.indTotalTax, pnl.prevTotalTax);

    setVal("step5-pnl-pat-as", pnl.prevPAT);
    setVal("step5-pnl-pat-ind", pnl.indPAT);
    setVariance("step5-pnl-pat-var", pnl.indPAT, pnl.prevPAT);

    // OCI lines
    setVal("step5-pnl-oci-actuarial", pnl.ociActuarial);
    setVariance("step5-pnl-oci-actuarial-var", pnl.ociActuarial, 0);

    setVal("step5-pnl-oci-equity", pnl.ociEquityFv);
    setVariance("step5-pnl-oci-equity-var", pnl.ociEquityFv, 0);

    setVal("step5-pnl-oci-val", pnl.indTotalOCI);
    setVariance("step5-pnl-oci-tot-var", pnl.indTotalOCI, 0);

    // TCI
    setVal("step5-pnl-tci-as", pnl.prevPAT);
    setVal("step5-pnl-tci-val", pnl.indTCI);
    setVariance("step5-pnl-tci-var", pnl.indTCI, pnl.prevPAT);

    // EPS
    const epsBasicAsEl = document.getElementById("step5-pnl-eps-basic-as");
    if (epsBasicAsEl) epsBasicAsEl.textContent = `₹${pnl.basicEpsAs.toFixed(2)}`;
    const epsBasicIndEl = document.getElementById("step5-pnl-eps-basic-ind");
    if (epsBasicIndEl) epsBasicIndEl.textContent = `₹${pnl.basicEpsIndAs.toFixed(2)}`;
    const epsBasicVarEl = document.getElementById("step5-pnl-eps-basic-var");
    if (epsBasicVarEl) epsBasicVarEl.textContent = `${pnl.basicEpsIndAs >= pnl.basicEpsAs ? '+' : ''}₹${(pnl.basicEpsIndAs - pnl.basicEpsAs).toFixed(2)}`;

    const epsDilutedAsEl = document.getElementById("step5-pnl-eps-diluted-as");
    if (epsDilutedAsEl) epsDilutedAsEl.textContent = `₹${pnl.dilutedEpsAs.toFixed(2)}`;
    const epsDilutedIndEl = document.getElementById("step5-pnl-eps-diluted-ind");
    if (epsDilutedIndEl) epsDilutedIndEl.textContent = `₹${pnl.dilutedEpsIndAs.toFixed(2)}`;
    const epsDilutedVarEl = document.getElementById("step5-pnl-eps-diluted-var");
    if (epsDilutedVarEl) epsDilutedVarEl.textContent = `${pnl.dilutedEpsIndAs >= pnl.dilutedEpsAs ? '+' : ''}₹${(pnl.dilutedEpsIndAs - pnl.dilutedEpsAs).toFixed(2)}`;

    // 3. Statement of Changes in Equity (SOCIE)
    document.getElementById("socie-sc-opening").textContent = `₹${socie.shareCapital.openingBalance.toFixed(2)} L`;
    document.getElementById("socie-sc-closing").textContent = `₹${socie.shareCapital.closingBalance.toFixed(2)} L`;

    const socieTbody = document.getElementById("socie-other-tbody");
    if (socieTbody) {
      socieTbody.innerHTML = socie.otherEquity.map(r => `
        <tr>
          <td class="font-bold">${r.particulars}</td>
          <td class="text-right font-mono">₹${r.securitiesPremium.toFixed(2)} L</td>
          <td class="text-right font-mono">₹${r.generalReserve.toFixed(2)} L</td>
          <td class="text-right font-mono">₹${r.retainedEarnings.toFixed(2)} L</td>
          <td class="text-right font-mono">₹${r.fvtociReserve.toFixed(2)} L</td>
          <td class="text-right font-mono font-bold">₹${r.total.toFixed(2)} L</td>
        </tr>
      `).join("");
    }

    // 4. Statement of Cash Flows (Ind AS 7 Indirect Method)
    const cf = cashFlow;
    setVal("cf-pbt", cf.operating.indPBT);
    setVal("cf-noncash", cf.operating.cfDeprAmort + cf.operating.cfFinanceCost + cf.operating.cfInterestIncome + cf.operating.cfFairValueGain + cf.operating.cfEclProvision);
    setVal("cf-op-profit", cf.operating.opProfitBeforeWc);
    setVal("cf-wc-changes", cf.operating.changeInventories + cf.operating.changeReceivables + cf.operating.changeOtherAssets + cf.operating.changePayables + cf.operating.changeOtherLiabilities);
    setVal("cf-taxes", cf.operating.taxesPaid);
    setVal("cf-net-operating", cf.operating.netCashOperating);

    setVal("cf-net-investing", cf.investing.netCashInvesting);
    setVal("cf-fin-paid", cf.financing.financeCostsPaid);
    setVal("cf-net-financing", cf.financing.netCashFinancing);
    setVal("cf-net-change", cf.netChangeCash);
    setVal("cf-cash-closing", cf.cashClosing);

    // 5. ICAI Guidance Note Structured Tables for Notes to Accounts (Notes 1 to 14)
    const notesContainer = document.getElementById("notes-cards-container");
    if (notesContainer) {
      notesContainer.innerHTML = notesToAccounts.map(n => {
        let tablesHtml = "";
        if (n.tables && n.tables.length > 0) {
          tablesHtml = n.tables.map(tbl => {
            const headerRow = tbl.headers.map(h => `<th style="font-size:12px; padding:7px 10px; background:#f1f5f9;">${h}</th>`).join("");
            const bodyRows = tbl.rows.map(r => {
              const isTotal = r[0].toLowerCase().includes("total") || r[0].toLowerCase().includes("closing");
              const cells = r.map((cell, cIdx) => {
                const isNumeric = cIdx > 0 && !isNaN(parseFloat(String(cell).replace(/,/g, '').replace(/[₹%L\s\(\)\+\-]/g, '')));
                return `<td class="${isNumeric ? 'text-right font-mono' : ''}" style="${isTotal ? 'font-weight:700; background:#f8fafc;' : ''}; font-size:12px; padding:6px 10px;">${cell}</td>`;
              }).join("");
              return `<tr>${cells}</tr>`;
            }).join("");

            return `
              <div style="margin-top: 14px; margin-bottom: 14px;">
                <div style="font-weight: 700; font-size: 12.5px; color: #1e3a8a; margin-bottom: 6px;">${tbl.title}</div>
                <div class="table-wrapper" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow-x: auto;">
                  <table class="app-table" style="width: 100%; margin-bottom: 0;">
                    <thead><tr>${headerRow}</tr></thead>
                    <tbody>${bodyRows}</tbody>
                  </table>
                </div>
              </div>
            `;
          }).join("");
        }

        return `
          <div class="card" style="margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <div class="card-title-bar" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
              <h4 style="margin: 0; color: #0f172a; font-size: 15px;">${n.noteNo}: ${n.title}</h4>
              <span class="badge badge-primary">${n.standard}</span>
            </div>
            ${n.narrative ? `<div style="font-size: 12.5px; color: #475569; margin-bottom: 10px; font-style: italic;">${n.narrative}</div>` : ''}
            ${tablesHtml}
            ${n.content ? `<div style="font-size: 12px; line-height: 1.6; color: #334155; margin-top: 8px; white-space: pre-line; background: #fafafa; padding: 10px; border-radius: 4px;">${n.content}</div>` : ''}
          </div>
        `;
      }).join("");
    }

    // 6. Ind AS 101 Reconciliations (Equity & Profit/TCI)
    const eqBody = document.getElementById("step5-equity-recon-tbody");
    if (eqBody) {
      eqBody.innerHTML = reconciliations.equityReconciliation.map(item => `
        <tr style="${item.type === 'base' ? 'background: #f1f5f9; font-weight: 700;' : ''}">
          <td>${item.item}</td>
          <td><span class="badge badge-neutral">${item.refIndAs}</span></td>
          <td class="text-right font-mono" style="font-weight: 600; color: ${item.amount < 0 ? '#dc2626' : 'inherit'};">
            ${item.amount < 0 ? `(₹${Math.abs(item.amount).toFixed(2)})` : `₹${item.amount.toFixed(2)}`}
          </td>
          <td style="font-size: 11.5px; color: var(--text-muted);">${item.explanation || ''}</td>
        </tr>
      `).join("") + `
        <tr class="total-row" style="background: #eff6ff; color: #1e40af;">
          <td colspan="2">TOTAL RECONCILED EQUITY UNDER IND AS</td>
          <td class="text-right font-mono font-bold">₹${reconciliations.indAsEquity.toFixed(2)}</td>
          <td>Matches Division II Balance Sheet Equity</td>
        </tr>
      `;
    }

    const pnlBody = document.getElementById("step5-profit-recon-tbody");
    if (pnlBody) {
      pnlBody.innerHTML = reconciliations.profitReconciliation.map(item => `
        <tr style="${item.type === 'base' ? 'background: #f1f5f9; font-weight: 700;' : ''}">
          <td>${item.item}</td>
          <td><span class="badge badge-neutral">${item.refIndAs}</span></td>
          <td class="text-right font-mono" style="font-weight: 600; color: ${item.amount < 0 ? '#dc2626' : 'inherit'};">
            ${item.amount < 0 ? `(₹${Math.abs(item.amount).toFixed(2)})` : `₹${item.amount.toFixed(2)}`}
          </td>
          <td style="font-size: 11.5px; color: var(--text-muted);">${item.explanation || ''}</td>
        </tr>
      `).join("") + `
        <tr class="total-row" style="background: #eff6ff; color: #1e40af;">
          <td colspan="2">TOTAL COMPREHENSIVE INCOME UNDER IND AS (TCI)</td>
          <td class="text-right font-mono font-bold">₹${reconciliations.totalComprehensiveIncome.toFixed(2)}</td>
          <td>Division II Schedule III TCI</td>
        </tr>
      `;
    }
  }

  // Subtab switching in Step 5
  document.querySelectorAll(".subtab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subtab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".subtab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const subId = btn.getAttribute("data-subtab");
      document.getElementById(subId)?.classList.add("active");
    });
  });

  const btnGotoStep6 = document.getElementById("btn-goto-step-6");
  if (btnGotoStep6) {
    btnGotoStep6.addEventListener("click", () => {
      renderStep6Disclosures();
      goToStep(6);
    });
  }

  // =========================================================================
  // STEP 6: DISCLOSURES & 10-SHEET EXCEL EXPORT
  // =========================================================================
  function renderStep6Disclosures() {
    const tbody = document.getElementById("step6-disclosure-tbody");
    if (!tbody) return;

    tbody.innerHTML = disclosureChecker.getChecklist().map(item => `
      <tr>
        <td><span class="badge badge-neutral">${item.id}</span></td>
        <td><span class="badge badge-primary">${item.standard}</span></td>
        <td><strong>${item.title}</strong></td>
        <td style="font-size: 12px; color: var(--text-muted);">${item.informationRequired}</td>
        <td>
          <span class="badge ${item.status === 'Green' ? 'badge-success' : 'badge-warning'}">
            ${item.statusText || item.status}
          </span>
        </td>
        <td style="font-size: 12px;">${item.responsiblePerson}</td>
      </tr>
    `).join("");
  }

  function triggerExcelExport() {
    if (!state.financialStatements) {
      showToast("Please upload a Trial Balance and proceed through conversion first!", "warning");
      return;
    }
    showToast("Generating comprehensive 10-sheet Excel Financials Workbook...", "info");
    setTimeout(() => {
      excelExportEngine.exportWorkbook({
        company: state.company,
        applicability: state.applicabilityResult,
        originalTb: state.trialBalance,
        financialStatements: state.financialStatements,
        convertedTb: state.convertedTb
      });
      showToast("10-Sheet Ind AS Financial Statements Workbook Downloaded! ✓", "success");
    }, 200);
  }

  const btnFinalExport = document.getElementById("btn-final-export");
  if (btnFinalExport) btnFinalExport.addEventListener("click", triggerExcelExport);

  const btnHeaderExport = document.getElementById("btn-header-export");
  if (btnHeaderExport) btnHeaderExport.addEventListener("click", triggerExcelExport);
});
