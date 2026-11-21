/**
 * AS to Ind AS Conversion Assistant - Reclassification Engine
 * Maps Previous GAAP Schedule III (Division I) items into Ind AS Schedule III (Division II)
 * with explicit statutory citations, reclassification rationale, and financial statement impacts.
 */

class IndASReclassificationEngine {
  constructor() {
    this.reclassificationMatrix = [
      {
        id: "REC-01",
        accountGroup: "Share Capital",
        asClassification: "Share Capital (Redeemable Preference Shares)",
        indAsClassification: "Non-Current Financial Liabilities: Borrowings (at Amortised Cost)",
        relevantIndAs: "Ind AS 32 (Para 18) & Ind AS 109",
        scheduleIILine: "II. Equity & Liabilities > Non-Current Liabilities > (a) Financial Liabilities > (i) Borrowings",
        reason: "Contractual obligation to redeem in cash makes it a financial liability rather than equity.",
        fsImpact: "Reduces Share Capital; increases Non-Current Financial Liabilities. Dividend reclassified to Finance Costs.",
        filterCriteria: ["1020"]
      },
      {
        id: "REC-02",
        accountGroup: "Non-Current Investments",
        asClassification: "Non-Current Investments (Commercial Rented Property)",
        indAsClassification: "Investment Property",
        relevantIndAs: "Ind AS 40 (Para 5 & 75)",
        scheduleIILine: "I. Assets > Non-Current Assets > (c) Investment Property",
        reason: "Land or building held to earn rentals or for capital appreciation must be presented as a separate category distinct from PPE and Financial Investments.",
        fsImpact: "Carved out from Non-Current Investments and presented as separate Balance Sheet line item 'Investment Property'.",
        filterCriteria: ["3060", "3065"]
      },
      {
        id: "REC-03",
        accountGroup: "Long-Term Loans and Advances",
        asClassification: "Long-Term Loans and Advances (Refundable Security Deposits)",
        indAsClassification: "Non-Current Financial Assets (Others) + Other Non-Current Assets (Prepaid Lease Rent)",
        relevantIndAs: "Ind AS 109 & Ind AS 116",
        scheduleIILine: "I. Assets > Non-Current Assets > (e) Financial Assets > (iii) Others / Loans",
        reason: "Interest-free refundable deposits split into amortised cost financial asset at PV and deferred prepaid lease asset.",
        fsImpact: "Reclassified into Financial Assets at PV and Other Non-Current Assets (Prepaid Lease Rent).",
        filterCriteria: ["3090", "3095"]
      },
      {
        id: "REC-04",
        accountGroup: "Other Non-Current Assets",
        asClassification: "Unamortised Upfront Loan Processing Fees",
        indAsClassification: "Netted directly against Long-Term Borrowings (EIR Amortisation)",
        relevantIndAs: "Ind AS 109 (Para 5.1.1)",
        scheduleIILine: "II. Equity & Liabilities > Non-Current Liabilities > Financial Liabilities > Borrowings",
        reason: "Transaction costs directly attributable to financial liabilities must be deducted from the carrying amount and amortised via EIR.",
        fsImpact: "Eliminated from Non-Current Assets; deducted directly from loan carrying amount.",
        filterCriteria: ["2020"]
      },
      {
        id: "REC-05",
        accountGroup: "Operating Leases",
        asClassification: "Off-Balance Sheet Operating Lease Commitments (Rent Expense)",
        indAsClassification: "Right-of-Use Assets & Lease Liabilities",
        relevantIndAs: "Ind AS 116 (Para 22 & 47)",
        scheduleIILine: "Assets > Non-Current Assets > (b) Right-of-Use Assets; Liabilities > Financial Liabilities > Lease Liabilities",
        reason: "All leases (except short-term <12m and low-value) must be brought on-balance sheet with ROU Asset and Lease Liability.",
        fsImpact: "ROU Asset created under Non-Current Assets; Lease Liabilities created under Financial Liabilities; Rent expense replaced by ROU Depreciation + Lease Interest.",
        filterCriteria: ["3025", "2060", "6060", "6075", "6055"]
      },
      {
        id: "REC-06",
        accountGroup: "Trade Receivables",
        asClassification: "Specific Incurred Doubtful Debts Provision",
        indAsClassification: "Allowance for Expected Credit Losses (ECL)",
        relevantIndAs: "Ind AS 109 (Para 5.5.15)",
        scheduleIILine: "I. Assets > Current Assets > (b) Financial Assets > (ii) Trade Receivables",
        reason: "Replacement of incurred loss model with forward-looking lifetime expected credit loss matrix.",
        fsImpact: "Presented as contra-asset deduction against gross trade receivables; impairment loss in P&L.",
        filterCriteria: ["4050", "6125"]
      },
      {
        id: "REC-07",
        accountGroup: "Employee Benefits",
        asClassification: "Gratuity Actuarial Losses in P&L",
        indAsClassification: "Other Comprehensive Income (OCI) - Items that will not be reclassified to P&L",
        relevantIndAs: "Ind AS 19 (Para 120)",
        scheduleIILine: "Statement of Profit and Loss > Other Comprehensive Income > Items that will not be reclassified to profit or loss",
        reason: "Actuarial remeasurements must be presented in OCI and cannot be reclassified to P&L.",
        fsImpact: "Improves Profit Before Tax by ₹18.00 L; OCI records actuarial loss; Total Comprehensive Income is unchanged.",
        filterCriteria: ["6040", "8010"]
      },
      {
        id: "REC-08",
        accountGroup: "Other Current Liabilities",
        asClassification: "Advance from Customers & Deferred Revenue",
        indAsClassification: "Contract Liabilities & Refund Liabilities",
        relevantIndAs: "Ind AS 115 (Para 105-108)",
        scheduleIILine: "II. Equity & Liabilities > Current Liabilities > (b) Other Current Liabilities (Contract Liabilities)",
        reason: "Statutory presentation requirement under Ind AS 115 for customer prepayments and unearned service warranties.",
        fsImpact: "Segregated into Contract Liabilities (performance obligation unperformed) and Refund Liabilities (expected rebates).",
        filterCriteria: ["2160", "2165", "2166"]
      },
      {
        id: "REC-09",
        accountGroup: "Other Current Liabilities",
        asClassification: "Current Maturities of Long-Term Debt",
        indAsClassification: "Other Financial Liabilities (Current)",
        relevantIndAs: "Ind AS 1 & Schedule III (Division II)",
        scheduleIILine: "II. Equity & Liabilities > Current Liabilities > (a) Financial Liabilities > (iii) Other Financial Liabilities",
        reason: "Division II of Schedule III requires current maturities of long-term borrowings to be disclosed under 'Other Financial Liabilities'.",
        fsImpact: "Classified strictly under Financial Liabilities rather than miscellaneous Other Current Liabilities.",
        filterCriteria: ["2140"]
      },
      {
        id: "REC-10",
        accountGroup: "Current Investments",
        asClassification: "Mutual Funds at Lower of Cost and Fair Value",
        indAsClassification: "Financial Assets at Fair Value through Profit or Loss (FVTPL)",
        relevantIndAs: "Ind AS 109 & Ind AS 113",
        scheduleIILine: "I. Assets > Current Assets > (a) Financial Assets > (i) Investments",
        reason: "Mutual fund units fail SPPI test and must be measured at fair value through P&L.",
        fsImpact: "Investments marked to market; unrealised gain recognized in Other Income.",
        filterCriteria: ["3080", "5046"]
      }
    ];
  }

  getReclassifications() {
    return this.reclassificationMatrix;
  }
}

window.IndASReclassificationEngine = IndASReclassificationEngine;
