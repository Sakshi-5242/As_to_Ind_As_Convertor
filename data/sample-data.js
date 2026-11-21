/**
 * AS to Ind AS Conversion Assistant
 * Authoritative Master Data & Realistic Sample Data
 * Applicable for FY 2026-27 Onwards
 * Aligned with MCA Notifications, Companies (Ind AS) Rules 2015,
 * ICAI ASB Compendium, Ind AS 101 Educational Material, and ITFG Clarifications.
 */

window.INDAS_MASTER_DATA = {
  version: "2026.1",
  applicableYear: "FY 2026-27",
  currency: "INR (₹ in Lakhs)",
  
  // Authoritative Guidance Framework references
  regulatoryFramework: [
    {
      source: "Law / MCA Notification",
      title: "Companies (Indian Accounting Standards) Rules, 2015 (as amended)",
      ref: "Rule 4 & Amendments up to 2024",
      description: "Mandatory statutory roadmap for Ind AS adoption based on listing status, net worth thresholds (₹500 Cr / ₹250 Cr), and group relationship cascade."
    },
    {
      source: "Statute / Companies Act, 2013",
      title: "Schedule III (Division II) - Ind AS Financial Statements Format",
      ref: "MCA Notification G.S.R. 404(E) as amended",
      description: "Statutory presentation format for Balance Sheet, Statement of Profit and Loss (including OCI), Statement of Changes in Equity (SOCIE) and Notes."
    },
    {
      source: "ICAI Technical Standard",
      title: "Ind AS 101 - First-time Adoption of Indian Accounting Standards",
      ref: "MCA Notified Ind AS 101",
      description: "Prescribes opening Ind AS Balance Sheet at the date of transition, mandatory exceptions, and optional exemptions from retrospective application."
    },
    {
      source: "ICAI Guidance",
      title: "ICAI Educational Material on Ind AS 101 & ITFG Clarifications",
      ref: "Bulletins 1 through 25",
      description: "Authoritative technical interpretations by ICAI Ind AS Transition Facilitation Group (ITFG) on practical transition issues."
    },
    {
      source: "ICAI Guidance",
      title: "ICAI Ind AS Disclosure Checklist (Revised 2024 Edition)",
      ref: "ICAI ASB Checklist",
      description: "Comprehensive compliance verification checklist for line items and note disclosures."
    }
  ],

  // Net Worth Definition under Section 2(57) of Companies Act, 2013:
  // Paid-up share capital + all reserves created out of profits + securities premium account + debit/credit balance of P&L
  // MINUS accumulated losses, deferred expenditure and miscellaneous expenditure not written off.
  // Revaluation reserve, capital reserve from amalgamation, and ESOP reserves are excluded.
  netWorthCriteria: {
    section: "Section 2(57) of Companies Act, 2013",
    formula: "Paid-up Share Capital + Securities Premium + General Reserves + Free Reserves (Retained Earnings) - Accumulated Losses - Deferred Revenue Expenditure - Revaluation Reserves"
  },

  // Mandatory Exceptions under Ind AS 101 (Paragraphs 14-17 & Appendix B)
  mandatoryExceptions: [
    {
      id: "ME-1",
      name: "Estimates (Ind AS 101.14-17)",
      description: "Estimates in accordance with Ind AS at the date of transition shall be consistent with estimates made for the same date in accordance with previous GAAP, unless there is objective evidence that those estimates were in error. Hindsight cannot be used.",
      status: "Complied"
    },
    {
      id: "ME-2",
      name: "Derecognition of Financial Assets and Liabilities (Ind AS 101.B2-B3)",
      description: "Applied prospectively for transactions occurring on or after transition date. An entity cannot recognize financial assets derecognized under previous GAAP unless they qualify for recognition due to a subsequent event.",
      status: "Complied"
    },
    {
      id: "ME-3",
      name: "Hedge Accounting (Ind AS 101.B4-B6)",
      description: "All hedging relationships must meet Ind AS 109 qualifying criteria at the date of transition. Retrospective designation of hedging relationships is strictly prohibited.",
      status: "Complied"
    },
    {
      id: "ME-4",
      name: "Non-Controlling Interests (Ind AS 101.B7)",
      description: "Allocation of total comprehensive income to parent and NCI even if this results in NCI having a deficit balance applies prospectively from the date of transition.",
      status: "Not Applicable (Standalone)"
    },
    {
      id: "ME-5",
      name: "Classification and Measurement of Financial Assets (Ind AS 101.B8-B8C)",
      description: "Assessment of whether a financial asset meets the contractual cash flow characteristics (SPPI test) based on facts and circumstances at the date of transition.",
      status: "Complied"
    },
    {
      id: "ME-6",
      name: "Impairment of Financial Assets - ECL (Ind AS 101.B8D-B8G)",
      description: "Determination of credit risk at initial recognition is determined using reasonable and supportable information available at transition date without undue cost or effort.",
      status: "Complied"
    },
    {
      id: "ME-7",
      name: "Embedded Derivatives (Ind AS 101.B9)",
      description: "Assessment whether an embedded derivative is required to be separated from host contract based on conditions at the later of date of commitment or modification.",
      status: "Complied"
    },
    {
      id: "ME-8",
      name: "Government Loans (Ind AS 101.B10-B12)",
      description: "Below-market interest rate government loans classified retrospectively under Ind AS 109 and Ind AS 20 unless previous GAAP carrying amount used as Ind AS carrying amount.",
      status: "Complied"
    }
  ],

  // Key Optional Exemptions under Ind AS 101 (Appendix C & D)
  optionalExemptions: [
    {
      id: "OE-1",
      code: "Ind AS 101.D7AA",
      name: "Deemed Cost for Property, Plant and Equipment and Intangibles",
      summary: "Elect to continue with previous GAAP carrying value for all items of PPE, CWIP and Intangible assets as deemed cost at the transition date.",
      recommended: true,
      selected: true,
      impact: "Avoids costly retrospective depreciation and historical re-componentisation calculations."
    },
    {
      id: "OE-2",
      code: "Ind AS 101.D9/D9B",
      name: "Leases (Ind AS 116 First-time Adoption Exemption)",
      summary: "Assess whether a contract existing at transition contains a lease using facts and circumstances at transition date, and measure lease liability at present value of remaining lease payments.",
      recommended: true,
      selected: true,
      impact: "Simplifies transition to Ind AS 116 without restating 10-year historical lease payments."
    },
    {
      id: "OE-3",
      code: "Ind AS 101.D1-D1A",
      name: "Business Combinations Exemption (Ind AS 103)",
      summary: "Do not apply Ind AS 103 retrospectively to past business combinations prior to transition date.",
      recommended: true,
      selected: true,
      impact: "Past goodwill and amalgamation reserves remain undisturbed."
    },
    {
      id: "OE-4",
      code: "Ind AS 101.D18",
      name: "Compound Financial Instruments Exemption",
      summary: "If liability component is no longer outstanding at transition date, no need to separate initial equity and liability components.",
      recommended: false,
      selected: false,
      impact: "Applies only if instruments matured prior to transition."
    },
    {
      id: "OE-5",
      code: "Ind AS 101.D19B",
      name: "Fair Value Measurement of Financial Assets / Liabilities at Initial Recognition",
      summary: "Permits Day-1 gain/loss recognition criteria to apply prospectively from transition date.",
      recommended: true,
      selected: true,
      impact: "Avoids restatement of unobservable input day-one adjustments."
    },
    {
      id: "OE-6",
      code: "Ind AS 101.D21",
      name: "Decommissioning Liabilities Included in Cost of PPE",
      summary: "Measure liability under Ind AS 37 at transition date, discount back to initial date using historical discount rate, and calculate accumulated depreciation.",
      recommended: true,
      selected: true,
      impact: "Enables capitalisation of site restoration obligations without full historical reconstruction."
    }
  ],

  // Sample Company Profile (for Instant Demonstration)
  sampleCompany: {
    cin: "U29299MH2012PLC238910",
    name: "Apex Precision Engineering Ltd.",
    companyType: "Unlisted Public Limited Company",
    isListed: false,
    securitiesProposedToList: false,
    sector: "Manufacturing & Industrial Machinery (Automotive Components)",
    natureOfBusiness: "Commercial Manufacturing",
    isNBFC: false,
    isBankOrInsurance: false,
    pan: "AAACA1234K",
    registeredOffice: "Plot No. 42, MIDC Industrial Area, Pune, Maharashtra - 411018",
    firstYearIndAS: "FY 2026-27 (1 April 2026 to 31 March 2027)",
    transitionDate: "2025-04-01", // 1 April 2025
    comparativeYear: "FY 2025-26",
    reportingYear: "FY 2026-27",
    applicableTaxRate: 25.17, // Section 115BAA concessional rate (22% + 10% surcharge + 4% cess)
    parentCompany: "None (Independent Indian Entity)",
    hasSubsidiaries: false,
    netWorthHistory: [
      { date: "31 March 2024", netWorthCr: 215.40, audited: true },
      { date: "31 March 2025", netWorthCr: 242.80, audited: true },
      { date: "31 March 2026", netWorthCr: 320.15, audited: true }
    ],
    managementSignoff: {
      cfo: "Rajesh V. Sharma, FCA",
      managingDirector: "Anil K. Kulkarni",
      preparedBy: "Pooja Deshmukh, Lead Financial Controller",
      date: "2026-11-18"
    }
  },

  // Sample Trial Balance under Previous GAAP (AS) as on 31 March 2026 (Comparative Year End)
  // Figures in INR Lakhs
  sampleTrialBalance: [
    {
      code: "1010",
      name: "Paid-up Equity Share Capital (Face Value ₹10)",
      group: "Shareholders' Funds",
      subgroup: "Share Capital",
      nature: "Liability/Equity",
      asClassification: "Share Capital",
      debit: 0.00,
      credit: 5000.00, // ₹50 Cr
      pyDebit: 0.00,
      pyCredit: 5000.00
    },
    {
      code: "1020",
      name: "8% Cumulative Redeemable Preference Shares",
      group: "Shareholders' Funds",
      subgroup: "Share Capital",
      nature: "Liability/Equity",
      asClassification: "Share Capital",
      debit: 0.00,
      credit: 2000.00, // ₹20 Cr (Redeemable in 5 years at 5% premium)
      pyDebit: 0.00,
      pyCredit: 2000.00
    },
    {
      code: "1030",
      name: "Securities Premium Account",
      group: "Shareholders' Funds",
      subgroup: "Reserves and Surplus",
      nature: "Liability/Equity",
      asClassification: "Reserves and Surplus",
      debit: 0.00,
      credit: 4500.00,
      pyDebit: 0.00,
      pyCredit: 4500.00
    },
    {
      code: "1040",
      name: "General Reserve",
      group: "Shareholders' Funds",
      subgroup: "Reserves and Surplus",
      nature: "Liability/Equity",
      asClassification: "Reserves and Surplus",
      debit: 0.00,
      credit: 8200.00,
      pyDebit: 0.00,
      pyCredit: 7500.00
    },
    {
      code: "1050",
      name: "Surplus in Statement of Profit and Loss (Opening)",
      group: "Shareholders' Funds",
      subgroup: "Reserves and Surplus",
      nature: "Liability/Equity",
      asClassification: "Reserves and Surplus",
      debit: 0.00,
      credit: 8053.00, // Opening Surplus; + FY 25-26 Profit ₹4,262 L = ₹12,315 L Closing
      pyDebit: 0.00,
      pyCredit: 4500.00
    },
    {
      code: "2010",
      name: "Term Loan from HDFC Bank Ltd. (Secured)",
      group: "Non-Current Liabilities",
      subgroup: "Long-Term Borrowings",
      nature: "Liability",
      asClassification: "Long-Term Borrowings",
      debit: 0.00,
      credit: 8000.00,
      pyDebit: 0.00,
      pyCredit: 9500.00
    },
    {
      code: "2020",
      name: "Unamortised Upfront Loan Processing Fee (HDFC Loan)",
      group: "Non-Current Assets",
      subgroup: "Other Non-Current Assets",
      nature: "Asset",
      asClassification: "Unamortised Borrowing Cost",
      debit: 45.00,
      credit: 0.00,
      pyDebit: 60.00,
      pyCredit: 0.00
    },
    {
      code: "2030",
      name: "Deferred Tax Liability (Net) - Previous GAAP (AS 22)",
      group: "Non-Current Liabilities",
      subgroup: "Deferred Tax Liabilities",
      nature: "Liability",
      asClassification: "Deferred Tax Liability",
      debit: 0.00,
      credit: 680.00,
      pyDebit: 0.00,
      pyCredit: 610.00
    },
    {
      code: "2040",
      name: "Provision for Gratuity (Long-Term)",
      group: "Non-Current Liabilities",
      subgroup: "Long-Term Provisions",
      nature: "Liability",
      asClassification: "Long-Term Provisions",
      debit: 0.00,
      credit: 320.00,
      pyDebit: 0.00,
      pyCredit: 290.00
    },
    {
      code: "2050",
      name: "Provision for Decommissioning / Site Restoration",
      group: "Non-Current Liabilities",
      subgroup: "Long-Term Provisions",
      nature: "Liability",
      asClassification: "Not Recognized under AS",
      debit: 0.00,
      credit: 0.00, // Zero under AS! Needs Ind AS 16 & 37 adjustment
      pyDebit: 0.00,
      pyCredit: 0.00
    },
    {
      code: "2110",
      name: "Short-Term Working Capital Loan (SBI Cash Credit)",
      group: "Current Liabilities",
      subgroup: "Short-Term Borrowings",
      nature: "Liability",
      asClassification: "Short-Term Borrowings",
      debit: 0.00,
      credit: 2850.00,
      pyDebit: 0.00,
      pyCredit: 2400.00
    },
    {
      code: "2120",
      name: "Trade Payables - Dues to Micro and Small Enterprises",
      group: "Current Liabilities",
      subgroup: "Trade Payables",
      nature: "Liability",
      asClassification: "Trade Payables MSME",
      debit: 0.00,
      credit: 420.00,
      pyDebit: 0.00,
      pyCredit: 380.00
    },
    {
      code: "2130",
      name: "Trade Payables - Other Creditors for Goods & Services",
      group: "Current Liabilities",
      subgroup: "Trade Payables",
      nature: "Liability",
      asClassification: "Trade Payables Others",
      debit: 0.00,
      credit: 3850.00,
      pyDebit: 0.00,
      pyCredit: 3410.00
    },
    {
      code: "2140",
      name: "Current Maturities of Long-Term Debt (HDFC Term Loan)",
      group: "Current Liabilities",
      subgroup: "Other Current Liabilities",
      nature: "Liability",
      asClassification: "Other Current Liabilities",
      debit: 0.00,
      credit: 1500.00,
      pyDebit: 0.00,
      pyCredit: 1500.00
    },
    {
      code: "2150",
      name: "Statutory Dues Payable (GST, TDS, PF & ESIC)",
      group: "Current Liabilities",
      subgroup: "Other Current Liabilities",
      nature: "Liability",
      asClassification: "Other Current Liabilities",
      debit: 0.00,
      credit: 215.00,
      pyDebit: 0.00,
      pyCredit: 195.00
    },
    {
      code: "2160",
      name: "Advance from Customers (Contract Liabilities)",
      group: "Current Liabilities",
      subgroup: "Other Current Liabilities",
      nature: "Liability",
      asClassification: "Other Current Liabilities",
      debit: 0.00,
      credit: 340.00,
      pyDebit: 0.00,
      pyCredit: 280.00
    },
    {
      code: "2170",
      name: "Provision for Product Warranties (Current)",
      group: "Current Liabilities",
      subgroup: "Short-Term Provisions",
      nature: "Liability",
      asClassification: "Short-Term Provisions",
      debit: 0.00,
      credit: 180.00,
      pyDebit: 0.00,
      pyCredit: 150.00
    },
    {
      code: "3010",
      name: "Freehold Land",
      group: "Non-Current Assets",
      subgroup: "Property, Plant and Equipment",
      nature: "Asset",
      asClassification: "Tangible Assets",
      debit: 5200.00,
      credit: 0.00,
      pyDebit: 5200.00,
      pyCredit: 0.00
    },
    {
      code: "3020",
      name: "Factory Buildings (Net Carrying Amount)",
      group: "Non-Current Assets",
      subgroup: "Property, Plant and Equipment",
      nature: "Asset",
      asClassification: "Tangible Assets",
      debit: 8650.00,
      credit: 0.00,
      pyDebit: 8980.00,
      pyCredit: 0.00
    },
    {
      code: "3030",
      name: "Plant, Machinery and Heavy Equipment (Net)",
      group: "Non-Current Assets",
      subgroup: "Property, Plant and Equipment",
      nature: "Asset",
      asClassification: "Tangible Assets",
      debit: 19050.00,
      credit: 0.00,
      pyDebit: 19800.00,
      pyCredit: 0.00
    },
    {
      code: "3040",
      name: "Capital Work-in-Progress (Automated Paint Shop Line)",
      group: "Non-Current Assets",
      subgroup: "Capital Work-in-Progress",
      nature: "Asset",
      asClassification: "CWIP",
      debit: 850.00,
      credit: 0.00,
      pyDebit: 420.00,
      pyCredit: 0.00
    },
    {
      code: "3050",
      name: "Computer Software & ERP License (Intangibles)",
      group: "Non-Current Assets",
      subgroup: "Intangible Assets",
      nature: "Asset",
      asClassification: "Intangible Assets",
      debit: 210.00,
      credit: 0.00,
      pyDebit: 280.00,
      pyCredit: 0.00
    },
    {
      code: "3060",
      name: "Commercial Office Building Rented Out to Third Party",
      group: "Non-Current Assets",
      subgroup: "Non-Current Investments",
      nature: "Asset",
      asClassification: "Non-Current Investments",
      debit: 1200.00, // Held to earn rental income -> Ind AS 40 Investment Property!
      credit: 0.00,
      pyDebit: 1200.00,
      pyCredit: 0.00
    },
    {
      code: "3070",
      name: "Investment in Equity Shares of Zenith Auto Components Pvt Ltd",
      group: "Non-Current Assets",
      subgroup: "Non-Current Investments",
      nature: "Asset",
      asClassification: "Non-Current Investments",
      debit: 450.00, // Unquoted equity, cost under AS 13 -> Ind AS 109 FVTOCI
      credit: 0.00,
      pyDebit: 450.00,
      pyCredit: 0.00
    },
    {
      code: "3080",
      name: "Investment in Growth/Liquid Debt Mutual Funds",
      group: "Current Assets",
      subgroup: "Current Investments",
      nature: "Asset",
      asClassification: "Current Investments",
      debit: 950.00, // Carried at lower of cost and NAV -> Ind AS 109 FVTPL
      credit: 0.00,
      pyDebit: 800.00,
      pyCredit: 0.00
    },
    {
      code: "3090",
      name: "Security Deposit Paid for Leased Corporate Head Office",
      group: "Non-Current Assets",
      subgroup: "Long-Term Loans and Advances",
      nature: "Asset",
      asClassification: "Long-Term Loans and Advances",
      debit: 100.00, // Interest-free refundable deposit (5 yr lease) -> Ind AS 109 Amortised Cost
      credit: 0.00,
      pyDebit: 100.00,
      pyCredit: 0.00
    },
    {
      code: "4010",
      name: "Raw Materials and Components Inventory",
      group: "Current Assets",
      subgroup: "Inventories",
      nature: "Asset",
      asClassification: "Inventories",
      debit: 2840.00,
      credit: 0.00,
      pyDebit: 2610.00,
      pyCredit: 0.00
    },
    {
      code: "4020",
      name: "Work-in-Progress Inventory",
      group: "Current Assets",
      subgroup: "Inventories",
      nature: "Asset",
      asClassification: "Inventories",
      debit: 1150.00,
      credit: 0.00,
      pyDebit: 980.00,
      pyCredit: 0.00
    },
    {
      code: "4030",
      name: "Finished Goods Inventory (Precision Parts)",
      group: "Current Assets",
      subgroup: "Inventories",
      nature: "Asset",
      asClassification: "Inventories",
      debit: 1680.00,
      credit: 0.00,
      pyDebit: 1450.00,
      pyCredit: 0.00
    },
    {
      code: "4040",
      name: "Trade Receivables - Domestic Automotive OEMs",
      group: "Current Assets",
      subgroup: "Trade Receivables",
      nature: "Asset",
      asClassification: "Trade Receivables",
      debit: 6850.00,
      credit: 0.00,
      pyDebit: 6120.00,
      pyCredit: 0.00
    },
    {
      code: "4050",
      name: "Provision for Doubtful Debts (Previous GAAP Specific)",
      group: "Current Assets",
      subgroup: "Trade Receivables",
      nature: "Contra-Asset",
      asClassification: "Provision for Bad Debts",
      debit: 0.00,
      credit: 65.00, // Specific provision under AS -> Replace with Ind AS 109 ECL
      pyDebit: 0.00,
      pyCredit: 50.00
    },
    {
      code: "4060",
      name: "Cash in Hand",
      group: "Current Assets",
      subgroup: "Cash and Cash Equivalents",
      nature: "Asset",
      asClassification: "Cash and Cash Equivalents",
      debit: 18.00,
      credit: 0.00,
      pyDebit: 15.00,
      pyCredit: 0.00
    },
    {
      code: "4070",
      name: "Balances with Scheduled Banks in Current Accounts",
      group: "Current Assets",
      subgroup: "Cash and Cash Equivalents",
      nature: "Asset",
      asClassification: "Cash and Cash Equivalents",
      debit: 520.00,
      credit: 0.00,
      pyDebit: 410.00,
      pyCredit: 0.00
    },
    {
      code: "4080",
      name: "Bank Fixed Deposits (Maturity > 3 months < 12 months)",
      group: "Current Assets",
      subgroup: "Other Bank Balances",
      nature: "Asset",
      asClassification: "Other Bank Balances",
      debit: 650.00,
      credit: 0.00,
      pyDebit: 500.00,
      pyCredit: 0.00
    },
    {
      code: "4090",
      name: "Prepaid Rent (Current Office Lease)",
      group: "Current Assets",
      subgroup: "Other Current Assets",
      nature: "Asset",
      asClassification: "Other Current Assets",
      debit: 36.00,
      credit: 0.00,
      pyDebit: 36.00,
      pyCredit: 0.00
    },
    {
      code: "4100",
      name: "GST Input Tax Credit Receivable & Advance Tax (Net)",
      group: "Current Assets",
      subgroup: "Other Current Assets",
      nature: "Asset",
      asClassification: "Other Current Assets",
      debit: 386.00,
      credit: 0.00,
      pyDebit: 310.00,
      pyCredit: 0.00
    },
    {
      code: "5010",
      name: "Revenue from Sale of Manufactured Products",
      group: "Revenue",
      subgroup: "Revenue from Operations",
      nature: "Revenue",
      asClassification: "Revenue from Operations",
      debit: 0.00,
      credit: 38400.00,
      pyDebit: 0.00,
      pyCredit: 34200.00
    },
    {
      code: "5020",
      name: "Other Operating Revenue (Scrap Sales & Export Incentive)",
      group: "Revenue",
      subgroup: "Revenue from Operations",
      nature: "Revenue",
      asClassification: "Other Operating Revenue",
      debit: 0.00,
      credit: 420.00,
      pyDebit: 0.00,
      pyCredit: 360.00
    },
    {
      code: "5030",
      name: "Rental Income from Commercial Office Building",
      group: "Revenue",
      subgroup: "Other Income",
      nature: "Revenue",
      asClassification: "Other Income",
      debit: 0.00,
      credit: 120.00,
      pyDebit: 0.00,
      pyCredit: 120.00
    },
    {
      code: "5040",
      name: "Interest Income on Bank Deposits & Security Deposits",
      group: "Revenue",
      subgroup: "Other Income",
      nature: "Revenue",
      asClassification: "Other Income",
      debit: 0.00,
      credit: 58.00,
      pyDebit: 0.00,
      pyCredit: 45.00
    },
    {
      code: "6010",
      name: "Cost of Materials Consumed",
      group: "Expenses",
      subgroup: "Cost of Materials Consumed",
      nature: "Expense",
      asClassification: "Cost of Materials Consumed",
      debit: 21850.00,
      credit: 0.00,
      pyDebit: 19600.00,
      pyCredit: 0.00
    },
    {
      code: "6020",
      name: "Changes in Inventories of Finished Goods & WIP",
      group: "Expenses",
      subgroup: "Changes in Inventories",
      nature: "Expense",
      asClassification: "Changes in Inventories",
      debit: 0.00,
      credit: 400.00, // Increase in inventory (credit)
      pyDebit: 0.00,
      pyCredit: 310.00
    },
    {
      code: "6030",
      name: "Salaries, Wages and Bonus",
      group: "Expenses",
      subgroup: "Employee Benefits Expense",
      nature: "Expense",
      asClassification: "Employee Benefit Expense",
      debit: 4120.00,
      credit: 0.00,
      pyDebit: 3750.00,
      pyCredit: 0.00
    },
    {
      code: "6040",
      name: "Staff Gratuity and Actuarial Cost (Net Expense under AS)",
      group: "Expenses",
      subgroup: "Employee Benefits Expense",
      nature: "Expense",
      asClassification: "Employee Benefit Expense",
      debit: 82.00, // Includes ₹18 Lakhs actuarial loss -> Under Ind AS 19 goes to OCI!
      credit: 0.00,
      pyDebit: 75.00,
      pyCredit: 0.00
    },
    {
      code: "6050",
      name: "Interest on HDFC Term Loan & SBI Cash Credit",
      group: "Expenses",
      subgroup: "Finance Costs",
      nature: "Expense",
      asClassification: "Finance Costs",
      debit: 1045.00,
      credit: 0.00,
      pyDebit: 1180.00,
      pyCredit: 0.00
    },
    {
      code: "6060",
      name: "Operating Rent for Corporate Office Building",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Rent Expense",
      debit: 144.00, // Lease under Ind AS 116 -> Derecognize rent, recognize ROU Depr + Lease Interest
      credit: 0.00,
      pyDebit: 144.00,
      pyCredit: 0.00
    },
    {
      code: "6070",
      name: "Depreciation on Property, Plant and Equipment",
      group: "Expenses",
      subgroup: "Depreciation & Amortisation",
      nature: "Expense",
      asClassification: "Depreciation",
      debit: 1320.00,
      credit: 0.00,
      pyDebit: 1280.00,
      pyCredit: 0.00
    },
    {
      code: "6080",
      name: "Amortisation of Software Intangibles",
      group: "Expenses",
      subgroup: "Depreciation & Amortisation",
      nature: "Expense",
      asClassification: "Amortisation",
      debit: 70.00,
      credit: 0.00,
      pyDebit: 70.00,
      pyCredit: 0.00
    },
    {
      code: "6090",
      name: "Power, Fuel and Utilities",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Other Expenses",
      debit: 2180.00,
      credit: 0.00,
      pyDebit: 1950.00,
      pyCredit: 0.00
    },
    {
      code: "6100",
      name: "Repairs & Maintenance to Plant & Buildings",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Other Expenses",
      debit: 580.00,
      credit: 0.00,
      pyDebit: 520.00,
      pyCredit: 0.00
    },
    {
      code: "6110",
      name: "Legal, Professional & Audit Fees",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Other Expenses",
      debit: 165.00,
      credit: 0.00,
      pyDebit: 140.00,
      pyCredit: 0.00
    },
    {
      code: "6120",
      name: "Provision for Doubtful Debts Expense (AS Specific)",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Other Expenses",
      debit: 15.00,
      credit: 0.00,
      pyDebit: 20.00,
      pyCredit: 0.00
    },
    {
      code: "6130",
      name: "Other Administrative & Selling Overhead Expenses",
      group: "Expenses",
      subgroup: "Other Expenses",
      nature: "Expense",
      asClassification: "Other Expenses",
      debit: 1845.00,
      credit: 0.00,
      pyDebit: 1680.00,
      pyCredit: 0.00
    },
    {
      code: "7010",
      name: "Current Income Tax Expense",
      group: "Tax Expenses",
      subgroup: "Current Tax",
      nature: "Expense",
      asClassification: "Current Tax",
      debit: 1250.00,
      credit: 0.00,
      pyDebit: 1080.00,
      pyCredit: 0.00
    },
    {
      code: "7020",
      name: "Deferred Tax Expense / (Credit) - Previous GAAP",
      group: "Tax Expenses",
      subgroup: "Deferred Tax",
      nature: "Expense",
      asClassification: "Deferred Tax",
      debit: 70.00,
      credit: 0.00,
      pyDebit: 60.00,
      pyCredit: 0.00
    }
  ],

  // Targeted Management Input Questions for Adjustments requiring facts
  managementInputs: [
    {
      id: "MI-LEASES",
      title: "Corporate Office Operating Lease (Ind AS 116 Assessment)",
      accountCode: "6060 / 3090",
      standard: "Ind AS 116 Leases",
      category: "Leases",
      status: "Configured",
      question: "What is the remaining lease term, incremental borrowing rate (IBR), and annual rental for the corporate office lease as on the transition date (1 April 2025)?",
      technicalBackground: "Under Previous GAAP (AS 19), operating lease rentals of ₹144.00 Lakhs were charged straight to P&L. Under Ind AS 116, the company must recognize a Right-of-Use (ROU) Asset and a Lease Liability discounted at its incremental borrowing rate.",
      inputs: [
        { key: "remainingTermYears", label: "Remaining Lease Term (Years)", type: "number", value: 4, unit: "Years" },
        { key: "annualRentLakhs", label: "Annual Rental Outflow", type: "number", value: 144.0, unit: "₹ Lakhs/year" },
        { key: "ibrRatePercent", label: "Incremental Borrowing Rate (IBR)", type: "number", value: 9.5, unit: "% p.a." },
        { key: "exemptionElect", label: "Ind AS 101 Transition Approach", type: "select", options: ["Modified Retrospective (ROU = Lease Liability)", "Full Retrospective"], value: "Modified Retrospective (ROU = Lease Liability)" }
      ]
    },
    {
      id: "MI-SECURITY-DEP",
      title: "Refundable Security Deposit Discounting (Ind AS 109)",
      accountCode: "3090",
      standard: "Ind AS 109 Financial Instruments",
      category: "Financial Assets",
      status: "Configured",
      question: "What is the market discount rate and maturity for the ₹100.00 Lakhs refundable security deposit paid to landlord?",
      technicalBackground: "Under AS, security deposits are kept at transaction nominal value. Under Ind AS 109, interest-free long-term security deposits must be recognized at fair value (present value) using market interest rate. The difference between nominal value and present value is recognized as Prepaid Lease Rent (ROU component) and amortised over lease period, with notional interest accreted to P&L using EIR.",
      inputs: [
        { key: "nominalDeposit", label: "Nominal Deposit Amount", type: "number", value: 100.0, unit: "₹ Lakhs" },
        { key: "tenorYears", label: "Remaining Tenor at Transition", type: "number", value: 4, unit: "Years" },
        { key: "marketRatePercent", label: "Market Rate for Similar Risk", type: "number", value: 9.5, unit: "% p.a." }
      ]
    },
    {
      id: "MI-PREF-SHARES",
      title: "8% Redeemable Preference Shares Reclassification (Ind AS 32)",
      accountCode: "1020",
      standard: "Ind AS 32 & Ind AS 109 Financial Instruments",
      category: "Financial Liabilities vs Equity",
      status: "Configured",
      question: "Are the 8% Cumulative Preference Shares mandatorily redeemable in cash with cumulative dividends?",
      technicalBackground: "Under AS, redeemable preference shares are presented as part of 'Share Capital'. Under Ind AS 32, a financial instrument that imposes a contractual obligation on the issuer to deliver cash (mandatory redemption) is a Financial Liability, NOT Equity. Furthermore, the 8% dividend is classified as Finance Cost, not dividend distribution from reserves.",
      inputs: [
        { key: "isMandatoryCashRedemption", label: "Mandatorily Redeemable in Cash?", type: "select", options: ["Yes (Mandatory)", "No (Convertible to Equity at Issuer Option)"], value: "Yes (Mandatory)" },
        { key: "redemptionTenorYears", label: "Years to Redemption from Transition", type: "number", value: 3, unit: "Years" },
        { key: "effectiveInterestRate", label: "Effective Interest Rate (EIR)", type: "number", value: 8.5, unit: "% p.a." },
        { key: "annualDividendLakhs", label: "Annual Dividend", type: "number", value: 160.0, unit: "₹ Lakhs" }
      ]
    },
    {
      id: "MI-ECL",
      title: "Trade Receivables Expected Credit Loss (ECL) Model (Ind AS 109)",
      accountCode: "4040 / 4050",
      standard: "Ind AS 109 Financial Instruments",
      category: "Impairment",
      status: "Configured",
      question: "What is the historical loss rate matrix across aging buckets for domestic OEM automotive receivables?",
      technicalBackground: "Under AS 4, provisions were made only when an incurrence event occurred (specific doubtful debts ₹65 Lakhs). Under Ind AS 109, entities must apply the Simplified Approach using a provision matrix reflecting forward-looking macroeconomic data for trade receivables.",
      inputs: [
        { key: "bucket0to90", label: "Not Due / 0-90 Days (₹4,800 L) Loss Rate", type: "number", value: 0.5, unit: "%" },
        { key: "bucket91to180", label: "91-180 Days (₹1,250 L) Loss Rate", type: "number", value: 2.0, unit: "%" },
        { key: "bucket181to360", label: "181-360 Days (₹550 L) Loss Rate", type: "number", value: 8.0, unit: "%" },
        { key: "bucketAbove360", label: "> 360 Days (₹250 L) Loss Rate", type: "number", value: 35.0, unit: "%" }
      ]
    },
    {
      id: "MI-REVENUE-WARRANTY",
      title: "Extended Warranty & Variable Consideration (Ind AS 115)",
      accountCode: "5010 / 2170",
      standard: "Ind AS 115 Revenue from Contracts with Customers",
      category: "Revenue",
      status: "Configured",
      question: "Do product supply contracts include a 2-year extended service warranty beyond the standard manufacturer assurance warranty?",
      technicalBackground: "Assurance warranties (repairing defects present at delivery) fall under Ind AS 37. Service warranties (providing additional protection) represent a distinct performance obligation under Ind AS 115, requiring revenue deferral and recognition over the warranty service period.",
      inputs: [
        { key: "serviceWarrantyPresent", label: "Service Warranty Included in Contract?", type: "select", options: ["Yes, distinct service warranty bundled", "No, assurance-type only"], value: "Yes, distinct service warranty bundled" },
        { key: "standAloneSellingPriceLakhs", label: "Allocable Standalone Value to Defer", type: "number", value: 85.0, unit: "₹ Lakhs" },
        { key: "promptPayDiscountEstimated", label: "Variable Consideration (Turnover Rebates)", type: "number", value: 45.0, unit: "₹ Lakhs" }
      ]
    },
    {
      id: "MI-ACTUARIAL-OCI",
      title: "Employee Benefits Actuarial Gain/Loss in OCI (Ind AS 19)",
      accountCode: "6040 / 2040",
      standard: "Ind AS 19 Employee Benefits",
      category: "Employee Benefits",
      status: "Configured",
      question: "What is the net actuarial remeasurement loss / (gain) included in the actuarial gratuity valuation report for FY 2025-26?",
      technicalBackground: "Under AS 15, all actuarial gains and losses were recognized immediately in P&L. Under Ind AS 19, remeasurements of defined benefit plans (actuarial gains/losses and return on plan assets excluding net interest) MUST be recognized in Other Comprehensive Income (OCI) and cannot be reclassified to P&L in subsequent periods.",
      inputs: [
        { key: "actuarialLossLakhs", label: "Actuarial Remeasurement Loss for Year", type: "number", value: 18.0, unit: "₹ Lakhs" },
        { key: "transitionDateActuarialSurplus", label: "Cumulative Unrecognized Actuarial Variance at Transition", type: "number", value: 0.0, unit: "₹ Lakhs" }
      ]
    },
    {
      id: "MI-FAIR-VALUE-INV",
      title: "Fair Value of Unquoted Equity & Mutual Funds (Ind AS 109 & 113)",
      accountCode: "3070 / 3080",
      standard: "Ind AS 109 & Ind AS 113 Fair Value Measurement",
      category: "Financial Instruments",
      status: "Configured",
      question: "What is the fair value of unquoted equity investment in Zenith Auto Components and mutual funds as on 31 March 2026?",
      technicalBackground: "AS 13 carried long-term investments at cost less permanent diminution. Under Ind AS 109, investments in equity instruments are measured at fair value through OCI (irrevocable election) or FVTPL. Mutual funds with debt instruments fail the SPPI test and must be measured at FVTPL.",
      inputs: [
        { key: "zenithFairValueLakhs", label: "Zenith Auto Valuation (DCF / Fair Value)", type: "number", value: 520.0, unit: "₹ Lakhs (Cost: ₹450 L)" },
        { key: "zenithElection", label: "Equity Instrument Designation", type: "select", options: ["FVTOCI (Irrevocable election)", "FVTPL"], value: "FVTOCI (Irrevocable election)" },
        { key: "mutualFundNavLakhs", label: "Mutual Funds Closing NAV", type: "number", value: 995.0, unit: "₹ Lakhs (Cost: ₹950 L)" }
      ]
    },
    {
      id: "MI-DEFERRED-TAX",
      title: "Deferred Tax on Balance Sheet Approach (Ind AS 12)",
      accountCode: "2030 / 7020",
      standard: "Ind AS 12 Income Taxes",
      category: "Taxes",
      status: "Configured",
      question: "Are all Ind AS transition adjustments recognized through Opening Retained Earnings / OCI evaluated for deferred tax consequences at the applicable corporate tax rate of 25.17%?",
      technicalBackground: "Under AS 22, deferred tax was calculated on timing differences between accounting profit and taxable income. Under Ind AS 12, deferred tax is recognized on temporary differences between the carrying amount of an asset or liability in the balance sheet and its tax base. Deferred tax arising on transition adjustments is recognized directly in Retained Earnings / OCI.",
      inputs: [
        { key: "corporateTaxRatePercent", label: "Applicable Effective Tax Rate", type: "number", value: 25.17, unit: "%" },
        { key: "taxBasePpeDifferenceLakhs", label: "Tax Base vs Carrying Amount Difference on PPE", type: "number", value: 480.0, unit: "₹ Lakhs" }
      ]
    }
  ]
};
