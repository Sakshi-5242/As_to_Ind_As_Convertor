================================================================================
AS-BASED TRIAL BALANCE TESTING DATASET (FY 2025–26)
File: AS_Based_Trial_Balance_FY2025_26.csv
================================================================================

PURPOSE:
This testing dataset represents an audited, balanced Trial Balance under Previous
Indian GAAP (Accounting Standards - AS) for a commercial manufacturing company
as on 31 March 2026.

TEST COMPANY PROFILE FOR STEP 1:
- Company Name: Apex Precision Engineering Ltd. (or enter your test entity)
- CIN: U29299MH2012PLC238910
- Entity Type: Unlisted Public Limited Company
- Proposed Listing: No
- Industry: Commercial / Manufacturing / Services
- Net Worth as on 31 March 2026: 320.15 (in ₹ Crores)
  [Note: 320.15 Cr > statutory threshold of 250 Cr -> Triggers Ind AS Phase II mandatory applicability!]

TRIAL BALANCE BALANCE CHECK:
- Total Debits:  ₹85,571.00 Lakhs
- Total Credits: ₹85,571.00 Lakhs
- Net Difference: ₹0.00 (100% Balanced)

KEY IND AS ADJUSTMENT TRIGGERS PRESENT IN THIS TEST TB:
1. Account 1020: 8% Cumulative Redeemable Preference Shares (₹2,000 L)
   -> Ind AS 32 requires reclassification to Financial Liabilities (Borrowings)
2. Account 6060: Operating Rent (₹144 L) & Account 3090: Security Deposit (₹100 L)
   -> Ind AS 116 requires ROU Asset & Lease Liability; Ind AS 109 discounting of deposit
3. Account 4040: Trade Receivables (₹6,850 L) & Account 4050: Provision (₹65 L)
   -> Ind AS 109 requires forward-looking Expected Credit Loss (ECL) matrix
4. Account 5010: Revenue (₹38,400 L)
   -> Ind AS 115 unbundling of extended service warranty & prompt payment rebates
5. Account 6040: Gratuity & Actuarial Cost (₹82 L)
   -> Ind AS 19 requires actuarial remeasurement loss (₹18 L) to be routed through OCI
6. Account 3060: Commercial Building Rented Out (₹1,200 L)
   -> Ind AS 40 Investment Property separate balance sheet classification
7. Account 3070: Unquoted Equity (₹450 L) & 3080: Mutual Funds (₹950 L)
   -> Ind AS 109 FVTOCI for equity & FVTPL for liquid debt mutual funds
8. Account 2050: Decommissioning Site Restoration Provision
   -> Ind AS 16 / Ind AS 37 capitalisation into plant cost
9. Account 2030: Deferred Tax (AS 22 timing difference)
   -> Ind AS 12 balance sheet temporary difference approach at 25.17% tax rate
================================================================================
