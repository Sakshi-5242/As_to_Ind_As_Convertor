/**
 * AS to Ind AS Conversion Assistant - Applicability Engine
 * Evaluates Statutory Applicability under Rule 4 of Companies (Ind AS) Rules, 2015
 * Dynamically adapts to the Selected Financial Year (e.g. FY 2026-27, FY 2025-26, FY 2027-28)
 */

class IndASApplicabilityEngine {
  constructor() {
    this.criteria = {
      companyName: "",
      cin: "",
      companyType: "unlisted_public",
      isListed: false,
      proposedListing: false,
      stockExchange: "none",
      netWorthCr: 0,
      natureOfBusiness: "manufacturing",
      isNBFC: false,
      nbfcCategory: "none",
      isBankOrInsurance: false,
      isHoldingOrSubOfIndASEntity: false,
      groupEntityIndASStatus: "none",
      voluntaryAdoptionRequested: false,
      financialYearApplying: "2026-2027" // Default selected FY for Net Worth
    };
  }

  evaluate(inputs = {}) {
    const data = { ...this.criteria, ...inputs };
    let status = "Ind AS Not Applicable";
    let statusClass = "badge-danger";
    let triggers = [];
    let technicalBasis = [];
    let legalCitation = "";
    let isMandatory = false;
    let isVoluntary = false;

    // Parse Selected Financial Year for which Net Worth is entered manually
    const fyStr = data.netWorthFY || data.financialYearApplying || "2026-2027";
    const yearParts = fyStr.split("-");
    const startYear = parseInt(yearParts[0], 10) || 2026;
    const endYear = parseInt(yearParts[1], 10) || 2027;

    // Statutory Dates based on Audited Net Worth FY (MCA Rule 4 & ICAI Guidance Note Framework):
    // 1. Audited Net Worth Reference Date = 31 March of closing FY (e.g. 31 March 2027 for FY 2026-27)
    const referenceNetWorthDateStr = `31 March ${endYear}`;
    const netWorthFYDisplay = `F.Y. ${startYear}-${String(endYear).slice(-2)}`;

    // 2. First Reporting Financial Year under Ind AS = Next immediate FY (e.g. FY 2026-27)
    const firstReportingYearStart = endYear;
    const firstReportingYearEnd = endYear + 1;
    const firstReportingYearStr = `FY ${firstReportingYearStart}–${String(firstReportingYearEnd).slice(-2)} (1 April ${firstReportingYearStart} to 31 March ${firstReportingYearEnd})`;

    // 3. Comparative Financial Year = Audited Net Worth FY itself (e.g. FY 2025-26)
    const comparativeYearStr = `FY ${startYear}–${String(endYear).slice(-2)} (1 April ${startYear} to 31 March ${endYear})`;

    // 4. Date of Transition (Opening Ind AS Balance Sheet) = 1 April of comparative FY (e.g. 1 April 2025)
    const transitionDateStr = `1 April ${startYear}`;

    // 1. Banking & Insurance Statutory Deferral
    if (data.natureOfBusiness === "banking" || data.natureOfBusiness === "insurance") {
      status = "Ind AS Deferred (Regulator Governed)";
      statusClass = "badge-warning";
      triggers.push("Banking Companies (governed by RBI) and Insurance Companies (governed by IRDAI) are currently exempted from Ind AS adoption.");
      technicalBasis.push("MCA and RBI/IRDAI circulars have deferred Ind AS adoption for banks and insurance companies. They continue under AS until MCA/RBI/IRDAI notifies the effective date.");
      legalCitation = "MCA Notification G.S.R. 365(E) & RBI Circular DBR.BP.BC.No.29/21.07.001/2018-19";
      
      return this._buildResult(status, statusClass, triggers, technicalBasis, legalCitation, false, false, data, transitionDateStr, comparativeYearStr, firstReportingYearStr, referenceNetWorthDateStr);
    }

    // 2. NBFC Roadmap: Rule 4(1)(iv)
    if (data.isNBFC || data.natureOfBusiness === "nbfc") {
      if (data.isListed) {
        status = "Ind AS Applicable (Mandatory - NBFC Listed)";
        statusClass = "badge-success";
        isMandatory = true;
        triggers.push("Any NBFC whose equity or debt securities are listed or in process of listing on any stock exchange in India.");
        legalCitation = "Rule 4(1)(iv)(a) of Companies (Ind AS) Rules, 2015";
      } else if (data.netWorthCr >= 500) {
        status = "Ind AS Applicable (Mandatory - NBFC Phase I)";
        statusClass = "badge-success";
        isMandatory = true;
        triggers.push(`Unlisted NBFC having net worth of ₹${data.netWorthCr.toFixed(2)} Crores (>= ₹500 Crores statutory threshold).`);
        legalCitation = "Rule 4(1)(iv)(b) of Companies (Ind AS) Rules, 2015";
      } else if (data.netWorthCr >= 250) {
        status = "Ind AS Applicable (Mandatory - NBFC Phase II)";
        statusClass = "badge-success";
        isMandatory = true;
        triggers.push(`Unlisted NBFC having net worth of ₹${data.netWorthCr.toFixed(2)} Crores (>= ₹250 Crores threshold, < ₹500 Crores).`);
        legalCitation = "Rule 4(1)(iv)(c) of Companies (Ind AS) Rules, 2015";
      } else {
        status = "Ind AS Not Applicable (AS Applies)";
        statusClass = "badge-danger";
        triggers.push(`Unlisted NBFC with net worth ₹${data.netWorthCr.toFixed(2)} Crores (< ₹250 Crores threshold). Continues under AS.`);
        legalCitation = "Companies (Accounting Standards) Rules, 2021 for Small NBFCs";
      }
      return this._buildResult(status, statusClass, triggers, technicalBasis, legalCitation, isMandatory, isVoluntary, data, transitionDateStr, comparativeYearStr, firstReportingYearStr, referenceNetWorthDateStr);
    }

    // 3. Commercial Non-NBFC Entities:
    // (a) Listed or in process of listing (Mainboard)
    if (data.isListed || data.proposedListing || data.companyType === "listed_equity" || data.companyType === "listed_debt") {
      status = "Ind AS Applicable (Mandatory - Listed Company)";
      statusClass = "badge-success";
      isMandatory = true;
      triggers.push(`Company whose equity or debt securities are listed or in process of being listed on a recognized stock exchange in India for ${firstReportingYearStr}.`);
      legalCitation = "Rule 4(1)(iii)(a) of Companies (Ind AS) Rules, 2015";
      technicalBasis.push("Mandatory for all listed companies regardless of net worth threshold.");
    }
    // (b) Unlisted Companies crossing Net Worth Thresholds under Section 2(57)
    else if (data.netWorthCr >= 500) {
      status = "Ind AS Applicable (Mandatory - Net Worth >= ₹500 Cr)";
      statusClass = "badge-success";
      isMandatory = true;
      triggers.push(`Unlisted Company with Net Worth of ₹${data.netWorthCr.toFixed(2)} Crores as of ${referenceNetWorthDateStr} (exceeding statutory ₹500 Crores threshold).`);
      legalCitation = "Rule 4(1)(ii)(b) of Companies (Ind AS) Rules, 2015";
      technicalBasis.push(`Mandatory adoption triggered based on audited financial statements as of ${referenceNetWorthDateStr}. Irreversible under Rule 4(3).`);
    }
    else if (data.netWorthCr >= 250) {
      status = "Ind AS Applicable (Mandatory - Phase II Threshold)";
      statusClass = "badge-success";
      isMandatory = true;
      triggers.push(`Unlisted Company having Net Worth of ₹${data.netWorthCr.toFixed(2)} Crores as of ${referenceNetWorthDateStr} (>= ₹250 Crores threshold, < ₹500 Crores).`);
      legalCitation = "Rule 4(1)(iii)(b) of Companies (Ind AS) Rules, 2015";
      technicalBasis.push(`Mandatory adoption applicable for ${firstReportingYearStr} with Date of Transition as ${transitionDateStr}. Irreversible under Rule 4(3).`);
    }
    // (c) Group Entity Cascade Rule (Holding / Subsidiary / Associate / JV)
    else if (data.isHoldingOrSubOfIndASEntity && data.groupEntityIndASStatus !== "none") {
      status = "Ind AS Applicable (Mandatory - Group Cascade Rule)";
      statusClass = "badge-success";
      isMandatory = true;
      triggers.push(`Company is a ${data.groupEntityIndASStatus.toUpperCase().replace('_', ' ')} of an entity that is already required to comply with Ind AS.`);
      legalCitation = "Rule 4(1)(ii)(c) & Rule 4(1)(iii)(c) of Companies (Ind AS) Rules, 2015";
      technicalBasis.push("Ind AS applies mandatorily to holding, subsidiary, joint venture or associate companies of covered entities (ICAI ITFG Bulletin 2).");
    }
    // (d) Voluntary Adoption
    else if (data.voluntaryAdoptionRequested) {
      status = "Ind AS Applicable (Voluntary Adoption)";
      statusClass = "badge-primary";
      isVoluntary = true;
      triggers.push(`Company has voluntarily elected to adopt Ind AS under Rule 4(1)(v) for ${firstReportingYearStr}.`);
      legalCitation = "Rule 4(1)(v) of Companies (Ind AS) Rules, 2015";
      technicalBasis.push("Voluntary adoption is permissible under Rule 4(1)(v). Once adopted, the company cannot revert to previous AS (Rule 4(4)).");
    }
    // (e) Inapplicable (< ₹250 Cr and no listing/group trigger)
    else {
      status = "Ind AS Not Applicable (AS Continues)";
      statusClass = "badge-danger";
      triggers.push(`Unlisted company with Net Worth of ₹${data.netWorthCr.toFixed(2)} Crores as of ${referenceNetWorthDateStr} (below the statutory ₹250 Crores threshold).`);
      legalCitation = "Companies (Accounting Standards) Rules, 2021";
      technicalBasis.push(`Entity continues to follow previous Indian GAAP (Accounting Standards - AS) notified under Section 133 of Companies Act, 2013 for ${firstReportingYearStr}.`);
    }

    return this._buildResult(status, statusClass, triggers, technicalBasis, legalCitation, isMandatory, isVoluntary, data, transitionDateStr, comparativeYearStr, firstReportingYearStr, referenceNetWorthDateStr);
  }

  _buildResult(status, statusClass, triggers, technicalBasis, legalCitation, isMandatory, isVoluntary, data, transitionDateStr, comparativeYearStr, firstReportingYearStr, referenceNetWorthDateStr) {
    const isApplicable = isMandatory || isVoluntary;
    const fyStr = data.netWorthFY || data.financialYearApplying || "2026-2027";
    const yearParts = fyStr.split("-");
    const startYear = parseInt(yearParts[0], 10) || 2026;
    const endYear = parseInt(yearParts[1], 10) || 2027;
    const netWorthFYDisplay = `F.Y. ${startYear}-${String(endYear).slice(-2)}`;

    return {
      status,
      statusClass,
      isApplicable,
      isMandatory,
      isVoluntary,
      triggers,
      technicalBasis,
      legalCitation,
      inputs: data,
      timeline: {
        financialYearSelected: fyStr,
        netWorthFYDisplay: netWorthFYDisplay,
        netWorthFYSelected: netWorthFYDisplay,
        referenceNetWorthDate: referenceNetWorthDateStr,
        transitionDate: transitionDateStr,
        comparativeYear: comparativeYearStr,
        firstReportingYear: firstReportingYearStr,
        milestones: [
          {
            phase: "1. Audited Net Worth Reference Date",
            date: referenceNetWorthDateStr,
            description: `Audited financial statements for ${netWorthFYDisplay} evaluated under Section 2(57) of Companies Act, 2013 as on ${referenceNetWorthDateStr}. Statutory threshold of ₹250 Crores evaluated under Rule 4(1)(iii)(b) / Rule 4(2).`
          },
          {
            phase: "2. Date of Transition (Opening Balance Sheet)",
            date: transitionDateStr,
            description: `Opening Ind AS Balance Sheet prepared as on ${transitionDateStr} (beginning of comparative period) in accordance with Ind AS 101 paragraph 6. Cumulative adjustments between Previous GAAP (AS) and Ind AS recognized directly in Opening Retained Earnings / Other Equity (Ind AS 101.11).`
          },
          {
            phase: "3. Comparative Financial Year",
            date: comparativeYearStr,
            description: `Previous GAAP financial statements for ${netWorthFYDisplay} restated to Ind AS for Balance Sheet, Statement of Profit and Loss, Cash Flow Statement (Ind AS 7), and Statement of Changes in Equity (SOCIE) for comparative disclosure (Ind AS 1.38 & Ind AS 101.21).`
          },
          {
            phase: "4. First Statutory Ind AS Reporting Period",
            date: firstReportingYearStr,
            description: `First complete set of statutory Ind AS financial statements presented under Division II of Schedule III to the Companies Act, 2013, including full Ind AS 101 reconciliations and ICAI structured Notes 1 to 14.`
          }
        ]
      }
    };
  }
}

window.IndASApplicabilityEngine = IndASApplicabilityEngine;
