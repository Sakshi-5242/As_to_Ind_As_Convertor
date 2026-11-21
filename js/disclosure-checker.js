/**
 * AS to Ind AS Conversion Assistant - Disclosure Checker Engine
 * Evaluates statutory and ICAI Disclosure Checklist requirements
 * dynamically mapped from Trial Balance presence and Management Profile.
 */

class IndASDisclosureChecker {
  constructor() {
    this.checklist = [
      {
        id: "DISC-101-01",
        standard: "Ind AS 101",
        category: "First-Time Adoption",
        title: "Opening Ind AS Balance Sheet Reconciliation",
        informationRequired: "Reconciliation of equity reported under previous GAAP to equity under Ind AS at Transition Date (1 April 2025) and comparative period end (31 March 2026).",
        applicable: true,
        status: "Amber",
        statusText: "Draft Ready - Review Required",
        responsiblePerson: "Lead Financial Controller",
        remarks: "Auto-reconciliation generated from adjustment matrix. Requires statutory auditor & management review.",
        icaiRef: "Ind AS 101 Para 24(a)"
      },
      {
        id: "DISC-101-02",
        standard: "Ind AS 101",
        category: "First-Time Adoption",
        title: "Total Comprehensive Income Reconciliation",
        informationRequired: "Reconciliation of total comprehensive income under Ind AS to profit or loss reported under previous GAAP for the latest period (FY 2025-26).",
        applicable: true,
        status: "Amber",
        statusText: "Draft Ready - Review Required",
        responsiblePerson: "CFO & Finance Head",
        remarks: "Impact of Leases, Preference shares, Revenue deferral, and Actuarial OCI mapped.",
        icaiRef: "Ind AS 101 Para 24(b)"
      },
      {
        id: "DISC-101-03",
        standard: "Ind AS 101",
        category: "First-Time Adoption",
        title: "Disclosure of Optional Exemptions and Mandatory Exceptions Elected",
        informationRequired: "Specific disclosure of Ind AS 101 exemptions availed (e.g., Deemed Cost under D7AA, Leases under D9B, Decommissioning under D21).",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "CA Technical Advisory",
        remarks: "Selected elections documented in Transition Matrix note draft.",
        icaiRef: "Ind AS 101 Para 26"
      },
      {
        id: "DISC-116-01",
        standard: "Ind AS 116",
        category: "Leases",
        title: "ROU Asset Schedule & Depreciation Breakdown",
        informationRequired: "Carrying amount of ROU assets by class (Buildings, Plant), additions, depreciation expense, and impairment.",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Fixed Asset Lead",
        remarks: "ROU asset additions ₹462.88 L and depreciation ₹115.72 L mapped to Notes.",
        icaiRef: "Ind AS 116 Para 53(a)"
      },
      {
        id: "DISC-116-02",
        standard: "Ind AS 116",
        category: "Leases",
        title: "Maturity Analysis of Lease Liabilities",
        informationRequired: "Contractual undiscounted cash flows of lease liabilities broken into: Not later than 1 yr, 1 to 5 yrs, later than 5 yrs.",
        applicable: true,
        status: "Amber",
        statusText: "Management Input Required",
        responsiblePerson: "Treasury Manager",
        remarks: "Requires verification of renewal options and variable lease escalations.",
        icaiRef: "Ind AS 116 Para 58 & Ind AS 107 Para 39"
      },
      {
        id: "DISC-109-01",
        standard: "Ind AS 107/109",
        category: "Financial Instruments",
        title: "Trade Receivables Aging & ECL Provision Matrix",
        informationRequired: "Gross carrying amount of trade receivables across aging buckets (0-90, 91-180, 181-360, >360 days) and associated ECL percentage rates.",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Credit Control Head",
        remarks: "Lifetime ECL allowance of ₹180.50 L mapped across ₹6,850.00 L gross debtors.",
        icaiRef: "Ind AS 107 Para 35M & Schedule III Division II"
      },
      {
        id: "DISC-109-02",
        standard: "Ind AS 107/113",
        category: "Financial Instruments",
        title: "Fair Value Hierarchy (Level 1, Level 2, Level 3)",
        informationRequired: "Disclose fair value measurements categorized into Level 1 (quoted), Level 2 (observable), Level 3 (unobservable valuation models).",
        applicable: true,
        status: "Amber",
        statusText: "Valuation Report Needed",
        responsiblePerson: "Registered Valuer / CFO",
        remarks: "Mutual funds classified under Level 1 (NAV); Zenith Auto shares classified under Level 3 (DCF model).",
        icaiRef: "Ind AS 113 Para 91-93"
      },
      {
        id: "DISC-115-01",
        standard: "Ind AS 115",
        category: "Revenue",
        title: "Disaggregation of Revenue & Contract Balances",
        informationRequired: "Disaggregation of revenue into major product lines, geography, and contract liabilities (advance from customers & warranty obligations).",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Revenue Controller",
        remarks: "Product revenue ₹38,270 L, Scrap revenue ₹420 L, Contract Liabilities ₹425 L mapped.",
        icaiRef: "Ind AS 115 Para 114-118"
      },
      {
        id: "DISC-19-01",
        standard: "Ind AS 19",
        category: "Employee Benefits",
        title: "Actuarial Assumptions & Sensitivity Analysis for Gratuity",
        informationRequired: "Significant actuarial assumptions (discount rate, salary escalation, attrition rate) and sensitivity analysis for +/- 1% movement.",
        applicable: true,
        status: "Amber",
        statusText: "Actuary Certificate Awaited",
        responsiblePerson: "HR & Actuarial Consultant",
        remarks: "Actuarial report for FY 2025-26 obtained; sensitivity table to be compiled from actuary certificate.",
        icaiRef: "Ind AS 19 Para 145"
      },
      {
        id: "DISC-12-01",
        standard: "Ind AS 12",
        category: "Income Taxes",
        title: "Tax Expense Reconciliation (Average Effective vs Statutory Tax Rate)",
        informationRequired: "Numerical reconciliation between tax expense and the product of accounting profit multiplied by applicable statutory tax rate (25.17%).",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Tax Advisory Lead",
        remarks: "Statutory rate 25.17% applied. Differences due to permanent non-deductible expenses reconciled.",
        icaiRef: "Ind AS 12 Para 81(c)"
      },
      {
        id: "DISC-37-01",
        standard: "Ind AS 37",
        category: "Provisions",
        title: "Movement of Provisions (Warranties & ARO Decommissioning)",
        informationRequired: "Opening balance, additions during the year, amounts utilised, unused amounts reversed, and unwinding of discount for each class of provision.",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Plant Accounts Team",
        remarks: "Movement tables for ₹180 L warranty provision and ₹42 L decommissioning obligation drafted.",
        icaiRef: "Ind AS 37 Para 84"
      },
      {
        id: "DISC-40-01",
        standard: "Ind AS 40",
        category: "Investment Property",
        title: "Fair Value Disclosure of Investment Property",
        informationRequired: "Fair value of investment property measured under the cost model, supported by valuation by an independent registered valuer.",
        applicable: true,
        status: "Amber",
        statusText: "Valuation Report Needed",
        responsiblePerson: "Admin & Facilities / Valuer",
        remarks: "Carrying amount ₹1,200 L; registered valuer report for fair value disclosure to be annexed.",
        icaiRef: "Ind AS 40 Para 79(e)"
      },
      {
        id: "DISC-24-01",
        standard: "Ind AS 24",
        category: "Related Party",
        title: "Related Party Transactions & KMP Compensation Breakdown",
        informationRequired: "Details of transactions with parent, associates, directors, and KMP compensation split into short-term, post-employment, and other benefits.",
        applicable: true,
        status: "Amber",
        statusText: "Action Required",
        responsiblePerson: "Company Secretary",
        remarks: "Disclosures under Section 188 of Companies Act and Ind AS 24 to be aligned with Secretarial records.",
        icaiRef: "Ind AS 24 Para 17-18"
      },
      {
        id: "DISC-33-01",
        standard: "Ind AS 33",
        category: "Earnings Per Share",
        title: "Basic and Diluted EPS Calculation",
        informationRequired: "Earnings attributable to equity holders (after deducting preference share dividend) divided by weighted average number of equity shares.",
        applicable: true,
        status: "Green",
        statusText: "Completed",
        responsiblePerson: "Financial Controller",
        remarks: "Basic and Diluted EPS calculated on 50,00,000 equity shares of ₹10 each.",
        icaiRef: "Ind AS 33 Para 70"
      }
    ];
  }

  getChecklist(filter = {}) {
    let result = [...this.checklist];
    if (filter.standard && filter.standard !== "all") {
      result = result.filter(item => item.standard.toLowerCase().includes(filter.standard.toLowerCase()));
    }
    if (filter.status && filter.status !== "all") {
      result = result.filter(item => item.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.informationRequired.toLowerCase().includes(q) ||
        item.standard.toLowerCase().includes(q) ||
        item.remarks.toLowerCase().includes(q)
      );
    }
    return result;
  }

  updateItemStatus(id, newStatus, remarks, person) {
    const item = this.checklist.find(x => x.id === id);
    if (item) {
      item.status = newStatus;
      if (remarks) item.remarks = remarks;
      if (person) item.responsiblePerson = person;
    }
  }
}

window.IndASDisclosureChecker = IndASDisclosureChecker;
