# AS to Ind AS Applicability & Financial Statement Conversion Assistant
### Professional Statutory Transition Workspace for FY 2026–27 Onwards
**Target Audience:** Company Management, Chief Financial Officers, Financial Controllers, and Corporate Accountants  
**Technical Standards Aligned:** Companies (Indian Accounting Standards) Rules, 2015 (as amended), Schedule III (Division II) of the Companies Act, 2013, Ind AS 101, Ind AS 116, Ind AS 109, Ind AS 115, Ind AS 19, Ind AS 12, Ind AS 7, and ICAI Technical Compendium.

---

## 1. Clean, Uncluttered, Step-by-Step Architecture

The application starts **completely clean with zero pre-filled data**, allowing any accountant to enter their company's specifics:

1. **Step 1: Enter Company Details & Net Worth**
   - Enter Company Legal Name, CIN, Entity Type, Proposed Listing status, Business Nature, and Section 2(57) Net Worth.
2. **Step 2: Check Ind AS Applicability**
   - Automatically evaluates Rule 4 of Companies (Ind AS) Rules, 2015.
   - If **Mandatory**, displays the exact statutory trigger, Transition Timeline (Transition Date: 1 April 2025; First Ind AS Financial Year: FY 2026–27), and **unlocks the subsequent steps**.
   - If **Not Applicable**, displays previous Indian GAAP (AS) compliance status and provides a Voluntary Adoption option under Rule 4(1)(v).
3. **Step 3: Upload Trial Balance**
   - Accountant uploads their Previous GAAP (AS) Trial Balance (`.xlsx`, `.xls`, or `.csv`).
   - Automated debit/credit balance verification (**Balanced ✓**).
   - A ready-to-use testing dataset is included in the project folder:
     `Testing_Data/AS_Based_Trial_Balance_FY2025_26.csv`
4. **Step 4: Flagged Conversion Adjustments & Journal Entries**
   - Displays all statutory Ind AS adjustment entries with review flags:
     - 🚩 `[MANDATORY RECLASSIFICATION]` (e.g. 8% Redeemable Preference Shares to Borrowings, Investment Property carve-out)
     - 🚩 `[MANAGEMENT ESTIMATE REQUIRED]` (e.g. Leases IBR rate, Trade Receivables ECL matrix, Revenue warranty unbundling)
     - 🚩 `[OTHER COMPREHENSIVE INCOME (OCI)]` (e.g. Gratuity actuarial remeasurement loss, Equity FVTOCI gain)
     - 🚩 `[BALANCE SHEET TEMPORARY DIFFERENCE (TAX)]` (Deferred tax at 25.17%)
   - Full statutory narrations and an **"⚙️ Assumptions"** modal to adjust parameters.
5. **Step 5: Schedule III (Division II) Financial Statements & Notes**
   - **Balance Sheet** (Division II Schedule III)
   - **Statement of Profit and Loss (with OCI)**
   - **Statement of Changes in Equity (SOCIE - Part A & B)**
   - **Statement of Cash Flows (Ind AS 7 Indirect Method)**
   - **Statutory Notes to Accounts (Notes 1 to 14)** with complete accounting policies and tables
   - **Ind AS 101 Reconciliations** (Equity & Profit Reconciliations)
6. **Step 6: ICAI Disclosures & Excel Financials Export**
   - **`📥 Download Ind AS Financials Workbook (.xls)`**: Generates a 10-sheet Excel workbook containing Balance Sheet, Statement of Profit and Loss, SOCIE, Cash Flow Statement, Notes to Accounts (1–14), Flagged Journal Entries, Reconciliations, and Adjusted 6-Column TB.

---

## 2. Testing Data Included in the Project

A fully balanced, authentic Previous GAAP (AS) Trial Balance for testing has been provided directly in:
`Testing_Data/AS_Based_Trial_Balance_FY2025_26.csv`

### Testing Profile:
- **Company Name:** Apex Precision Engineering Ltd. (or enter your own test entity)
- **CIN:** U29299MH2012PLC238910
- **Entity Type:** Unlisted Public Limited Company
- **Net Worth as of 31 March 2026:** ₹320.15 Crores (> ₹250 Cr statutory threshold)
- **Total Debits:** ₹85,571.00 Lakhs
- **Total Credits:** ₹85,571.00 Lakhs
- **Net Balance Difference:** ₹0.00 (100% Balanced)

### Key Test Adjustments Present in this Dataset:
1. **8% Redeemable Preference Shares (Account 1020 - ₹2,000 L):** Reclassified from Share Capital to Long-Term Borrowings under Ind AS 32.
2. **Corporate Office Operating Lease (Account 6060 - ₹144 L rent & Account 3090 - ₹100 L deposit):** Brings ROU Asset (₹462.88 L) and Lease Liability onto the Balance Sheet under Ind AS 116.
3. **Trade Receivables (Account 4040 - ₹6,850 L):** Replaces AS specific provision with forward-looking Lifetime ECL Provision Matrix (₹180.50 L) under Ind AS 109.
4. **Revenue from Operations (Account 5010 - ₹38,400 L):** Unbundles extended service warranty obligations and turnover rebates into Contract Liabilities under Ind AS 115.
5. **Gratuity Valuation (Account 6040 - ₹82 L):** Transfers actuarial remeasurement loss (₹18 L) from P&L to Other Comprehensive Income (OCI) under Ind AS 19.
6. **Commercial Rental Property (Account 3060 - ₹1,200 L):** Reclassifies from Non-Current Investments to Investment Property under Ind AS 40.
7. **Strategic Unquoted Equity & Mutual Funds:** Measured at FVTOCI and FVTPL under Ind AS 109 & 113.
8. **Deferred Tax on Ind AS Adjustments:** Calculated on temporary differences at 25.17% (Section 115BAA) under Ind AS 12.

---

## 3. How to Launch and Test the Application

1. Open **Google Chrome**, **Microsoft Edge**, or **Firefox**.
2. Open the file:  
   👉 **[index.html](file:///c:/Users/Sakshi/Downloads/As%20to%20Ind%20AS%20Convertor/index.html)**
3. The platform launches at **Step 1** with clean, empty inputs.
4. Enter the test details (e.g. Net Worth: `320.15`, Unlisted Public Company) and click **"Check Ind AS Applicability →"**.
5. Once Ind AS is verified as mandatory in Step 2, click **"Proceed to Step 3: Upload Trial Balance →"**.
6. Click **"Choose File from Computer"** and select `Testing_Data/AS_Based_Trial_Balance_FY2025_26.csv`.
7. Follow the wizard through Step 4 (Review flagged journal vouchers), Step 5 (Inspect Balance Sheet, P&L, SOCIE, Cash Flow & Notes 1–14), and Step 6 to download the **10-Sheet Ind AS Financial Statements Excel Workbook**.
