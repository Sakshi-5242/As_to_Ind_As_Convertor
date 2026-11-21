/**
 * AS to Ind AS Conversion Assistant - Excel Export Engine
 * Generates an accountant-ready 10-sheet Excel workbook containing:
 * 1. Balance Sheet (Schedule III Division II)
 * 2. Statement of Profit and Loss (with OCI)
 * 3. Statement of Changes in Equity (SOCIE)
 * 4. Statement of Cash Flows (Ind AS 7)
 * 5. Statutory Notes to Accounts (Notes 1 to 14)
 * 6. Flagged Ind AS Conversion Journal Entries (Audit Vouchers)
 * 7. Ind AS 101 Reconciliations (Equity & Profit Reconciliations)
 * 8. Converted 6-Column Trial Balance
 * 9. Original Uploaded Trial Balance
 * 10. Company Profile & Applicability Evaluation
 */

class IndASExcelExportEngine {
  constructor() {}

  exportWorkbook(data) {
    const {
      company,
      applicability,
      originalTb,
      financialStatements,
      convertedTb
    } = data;

    const xmlContent = this._generateMultiSheetXml({
      company,
      applicability,
      originalTb,
      financialStatements,
      convertedTb
    });

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (company.name || "Company").replace(/[^a-zA-Z0-9]/g, "_");
    link.href = url;
    link.download = `IndAS_Financial_Statements_${safeName}_FY2026-27.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  _escapeXml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  _generateMultiSheetXml(payload) {
    const {
      company,
      applicability,
      originalTb,
      financialStatements,
      convertedTb
    } = payload;

    const { bs, pnl, socie, cashFlow, notesToAccounts, flaggedJournalEntries, reconciliations } = financialStatements;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Ind AS Financial Conversion Assistant</Author>
  <Company>${this._escapeXml(company.name)}</Company>
  <Created>${new Date().toISOString()}</Created>
  <Version>16.00</Version>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Color="#1E3A8A" ss:Bold="1"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E3A8A" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubHeaderStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#1E3A8A" ss:Bold="1"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CurrencyStyle">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="CurrencyBold">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="BoldStyle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1"/>
  </Style>
  <Style ss:ID="FlagStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#991B1B" ss:Bold="1"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="NoteText">
   <Alignment ss:Horizontal="Left" ss:Vertical="Top" ss:WrapText="1"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#334155"/>
  </Style>
 </Styles>
`;

    // -------------------------------------------------------------
    // SHEET 1: BALANCE SHEET (Division II Schedule III)
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="1. Balance Sheet">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="360"/>
   <Column ss:Width="100"/>
   <Column ss:Width="140"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${this._escapeXml(company.name)} - Balance Sheet</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">As at 31 March 2026 (Prepared under Schedule III Division II of Companies Act, 2013)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">All amounts in ₹ Lakhs</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Particulars</Data></Cell><Cell><Data ss:Type="String">Note No.</Data></Cell><Cell><Data ss:Type="String">As at 31 March 2026 (₹)</Data></Cell></Row>
   
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="2"><Data ss:Type="String">I. ASSETS</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">1. Non-Current Assets</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Property, Plant and Equipment</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 3</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.ppe.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Capital Work-in-Progress</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 3</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.cwip.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (c) Right-of-Use (ROU) Assets</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 4</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.rouAsset.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (d) Other Intangible Assets</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.intangibles.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (e) Investment Property</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 5</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.invProperty.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (f) Financial Assets: (i) Investments (FVTOCI)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 6</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.ncFinancialInv.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (g) Financial Assets: (ii) Loans &amp; Security Deposits</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 6</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.ncLoansDeposits.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (h) Other Non-Current Assets (Prepaid Lease Rent)</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentAssets.otherNcAssets.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Non-Current Assets</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.nonCurrentAssets.total.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">2. Current Assets</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Inventories</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.inventories.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Financial Assets: (i) Current Investments (FVTPL)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 6</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.currInvestments.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (c) Financial Assets: (ii) Trade Receivables (net of ECL)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 7</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.tradeReceivables.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (d) Financial Assets: (iii) Cash and Cash Equivalents</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.cashAndCashEquiv.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (e) Financial Assets: (iv) Other Bank Balances</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.otherBankBalances.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (f) Other Current Assets</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentAssets.otherCurrentAssets.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Current Assets</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.currentAssets.total.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">TOTAL ASSETS</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.totalAssets.toFixed(2)}</Data></Cell></Row>

   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="2"><Data ss:Type="String">II. EQUITY AND LIABILITIES</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">1. Equity</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Equity Share Capital</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">SOCIE Part A</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.equity.equityShareCapital.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Other Equity (Reserves &amp; Surplus + OCI)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">SOCIE Part B</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.equity.totalOtherEquity.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Equity</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.equity.totalEquity.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">2. Non-Current Liabilities</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Financial Liabilities: (i) Borrowings (Term Loan + Pref Shares)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 8</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentLiabilities.ncBorrowings.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Financial Liabilities: (ii) Lease Liabilities</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 4</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentLiabilities.ncLeaseLiabilities.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (c) Long-Term Provisions (Gratuity + Decommissioning)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 9/11</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentLiabilities.ncProvisions.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (d) Deferred Tax Liabilities (Net)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 12</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.nonCurrentLiabilities.defTaxLiability.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Non-Current Liabilities</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.nonCurrentLiabilities.total.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">3. Current Liabilities</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Financial Liabilities: (i) Short-Term Borrowings</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentLiabilities.currBorrowings.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Financial Liabilities: (ii) Lease Liabilities (Current)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 4</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentLiabilities.currLeaseLiabilities.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (c) Financial Liabilities: (iii) Trade Payables (MSME &amp; Others)</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${(bs.currentLiabilities.tradePayablesMsme + bs.currentLiabilities.tradePayablesOthers).toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (d) Financial Liabilities: (iv) Other Financial Liabilities</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentLiabilities.otherCurrFinLiabilities.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (e) Other Current Liabilities (Contract &amp; Refund Liab)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 10</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentLiabilities.otherCurrLiabilities.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (f) Short-Term Provisions (Warranties)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 9</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${bs.currentLiabilities.currProvisions.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Current Liabilities</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.currentLiabilities.total.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">TOTAL EQUITY AND LIABILITIES</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${bs.totalEquityAndLiabilities.toFixed(2)}</Data></Cell></Row>
  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 2: STATEMENT OF PROFIT & LOSS (with OCI)
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="2. Statement of P&amp;L">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="360"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${this._escapeXml(company.name)} - Statement of Profit and Loss</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">For the year ended 31 March 2026 (Division II Schedule III)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">All amounts in ₹ Lakhs</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Particulars</Data></Cell><Cell><Data ss:Type="String">Note No.</Data></Cell><Cell><Data ss:Type="String">Previous AS (₹)</Data></Cell><Cell><Data ss:Type="String">Final Ind AS (₹)</Data></Cell></Row>
   
   <Row><Cell><Data ss:Type="String">I. Revenue from Operations</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 10</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevRev.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indRev.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">II. Other Income (Includes MTM FV Gain on Mutual Funds)</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevOtherInc.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indOtherInc.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">III. Total Income (I + II)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.prevTotalIncome.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indTotalIncome.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">IV. Expenses:</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (a) Cost of Materials Consumed</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevCostMat.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indCostMat.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (b) Changes in Inventories of FG and WIP</Data></Cell><Cell><Data ss:Type="String">-</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevChangeInv.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indChangeInv.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (c) Employee Benefits Expense (Net of Actuarial in OCI)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 11</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevEmpExp.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indEmpExp.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (d) Finance Costs (Term Loan + Lease Int + Pref Dividend)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 4/8</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevFinCost.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indFinCost.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (e) Depreciation and Amortisation (PPE + ROU + Software)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 3/4</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevDepr.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indDepr.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (f) Other Expenses (Operating rent reversed, ECL provision added)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 7</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevOtherExp.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indOtherExp.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">Total Expenses (IV)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.prevTotalExp.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indTotalExp.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">V. Profit Before Tax (III - IV)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.prevPBT.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indPBT.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">VI. Tax Expense: (a) Current Tax</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 12</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevCurrTax.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indCurrTax.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">    (b) Deferred Tax Credit / (Expense)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 12</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.prevDefTax.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.indDefTax.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">VII. Profit for the period (PAT) (V - VI)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.prevPAT.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indPAT.toFixed(2)}</Data></Cell></Row>

   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">VIII. Other Comprehensive Income (OCI)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (i) Items that will not be reclassified to profit or loss:</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">       - Remeasurements of defined benefit plans (Actuarial loss)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 11</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">0.00</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.ociActuarial.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">       - Equity instruments through OCI (Fair value gain on Zenith)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 6</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">0.00</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.ociEquityFv.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   (ii) Income tax relating to items that will not be reclassified</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Note 12</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">0.00</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${pnl.ociTax.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Total Other Comprehensive Income (net of tax)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">0.00</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indTotalOCI.toFixed(2)}</Data></Cell></Row>

   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">IX. TOTAL COMPREHENSIVE INCOME (VII + VIII)</Data></Cell><Cell></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.prevPAT.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indTCI.toFixed(2)}</Data></Cell></Row>
  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 3: STATEMENT OF CHANGES IN EQUITY (SOCIE)
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="3. SOCIE">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="300"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${this._escapeXml(company.name)} - Statement of Changes in Equity (SOCIE)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">For the year ended 31 March 2026</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="5"><Data ss:Type="String">PART A: EQUITY SHARE CAPITAL</Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Balance at 1 April 2025</Data></Cell><Cell><Data ss:Type="String">Changes during the year</Data></Cell><Cell><Data ss:Type="String">Balance at 31 March 2026</Data></Cell></Row>
   <Row><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${socie.shareCapital.openingBalance.toFixed(2)}</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">0.00</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${socie.shareCapital.closingBalance.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>

   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="5"><Data ss:Type="String">PART B: OTHER EQUITY</Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle">
    <Cell><Data ss:Type="String">Particulars</Data></Cell>
    <Cell><Data ss:Type="String">Securities Premium</Data></Cell>
    <Cell><Data ss:Type="String">General Reserve</Data></Cell>
    <Cell><Data ss:Type="String">Retained Earnings</Data></Cell>
    <Cell><Data ss:Type="String">FVTOCI Reserve</Data></Cell>
    <Cell><Data ss:Type="String">Total Other Equity</Data></Cell>
   </Row>
`;
    socie.otherEquity.forEach(r => {
      xml += `   <Row>
    <Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(r.particulars)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.securitiesPremium.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.generalReserve.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.retainedEarnings.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.fvtociReserve.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${r.total.toFixed(2)}</Data></Cell>
   </Row>\n`;
    });
    xml += `  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 4: STATEMENT OF CASH FLOWS (Ind AS 7)
    // -------------------------------------------------------------
    const cf = cashFlow;
    xml += `
 <Worksheet ss:Name="4. Cash Flow Statement">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="380"/>
   <Column ss:Width="140"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${this._escapeXml(company.name)} - Statement of Cash Flows</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">For the year ended 31 March 2026 (Prepared under Ind AS 7 Indirect Method)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">All amounts in ₹ Lakhs</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Particulars</Data></Cell><Cell><Data ss:Type="String">Amount (₹ Lakhs)</Data></Cell></Row>
   
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">A. CASH FLOWS FROM OPERATING ACTIVITIES</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Profit Before Tax (PBT)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.operating.indPBT.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Adjustments for Non-Cash / Non-Operating Items:</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Depreciation &amp; Amortisation (PPE, ROU, Software)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.cfDeprAmort.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Finance Costs (Term loan, lease interest, pref dividend)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.cfFinanceCost.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Interest Income (Bank &amp; Security deposits)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.cfInterestIncome.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Net Fair Value Gain on Mutual Funds (FVTPL)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.cfFairValueGain.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Expected Credit Loss (ECL) Allowance</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.cfEclProvision.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Operating Profit before Working Capital Changes</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.operating.opProfitBeforeWc.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Adjustments for Working Capital Changes:</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - (Increase) / Decrease in Inventories</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.changeInventories.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - (Increase) / Decrease in Trade Receivables</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.changeReceivables.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - (Increase) / Decrease in Other Assets</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.changeOtherAssets.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Increase / (Decrease) in Trade Payables</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.changePayables.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">   - Increase / (Decrease) in Other Liabilities &amp; Provisions</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.changeOtherLiabilities.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="BoldStyle"><Cell><Data ss:Type="String">Cash Generated from Operations</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.operating.cashGeneratedFromOp.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Income Taxes Paid</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.operating.taxesPaid.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">Net Cash from Operating Activities (A)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.operating.netCashOperating.toFixed(2)}</Data></Cell></Row>

   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">B. CASH FLOWS FROM INVESTING ACTIVITIES</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Purchase of PPE and CWIP (Capex)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.investing.capex.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Rental Income Received from Investment Property</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.investing.rentalReceived.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Interest Received on Bank Deposits</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.investing.interestReceived.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">Net Cash used in Investing Activities (B)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.investing.netCashInvesting.toFixed(2)}</Data></Cell></Row>

   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">C. CASH FLOWS FROM FINANCING ACTIVITIES</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Proceeds from Borrowings (Net)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.financing.proceedsBorrowings.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Principal Payment of Lease Liabilities (Ind AS 116)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.financing.repaymentLeaseLiab.toFixed(2)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Finance Costs Paid (Interest on Borrowings and Leases)</Data></Cell><Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${cf.financing.financeCostsPaid.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">Net Cash used in Financing Activities (C)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.financing.netCashFinancing.toFixed(2)}</Data></Cell></Row>

   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">NET INCREASE / (DECREASE) IN CASH AND CASH EQUIVALENTS (A + B + C)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.netChangeCash.toFixed(2)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Cash and Cash Equivalents at Beginning of the Year</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.cashOpening.toFixed(2)}</Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell><Data ss:Type="String">Cash and Cash Equivalents at End of the Year</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${cf.cashClosing.toFixed(2)}</Data></Cell></Row>
  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 5: STATUTORY NOTES TO ACCOUNTS (Notes 1 to 14)
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="5. Notes to Accounts">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="100"/>
   <Column ss:Width="260"/>
   <Column ss:Width="140"/>
   <Column ss:Width="600"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${this._escapeXml(company.name)} - Notes to the Financial Statements</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">For the year ended 31 March 2026 (Prepared under Ind AS)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Note No.</Data></Cell><Cell><Data ss:Type="String">Note Heading</Data></Cell><Cell><Data ss:Type="String">Governing Ind AS</Data></Cell><Cell><Data ss:Type="String">Statutory Disclosure &amp; Policy Text</Data></Cell></Row>
`;
    notesToAccounts.forEach(n => {
      xml += `   <Row ss:Height="70">
    <Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(n.noteNo)}</Data></Cell>
    <Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(n.title)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(n.standard)}</Data></Cell>
    <Cell ss:StyleID="NoteText"><Data ss:Type="String">${this._escapeXml(n.narrative || n.content || "")}</Data></Cell>
   </Row>\n`;
    });
    xml += `  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 6: FLAGGED JOURNAL ENTRIES (Audit Vouchers)
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="6. Flagged Journal Entries">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="200"/>
   <Column ss:Width="240"/>
   <Column ss:Width="240"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="360"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">Ind AS Conversion Journal Entries (Adjustment Vouchers)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Flagged for Statutory Audit &amp; Management Review</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle">
    <Cell><Data ss:Type="String">Voucher No.</Data></Cell>
    <Cell><Data ss:Type="String">Standard</Data></Cell>
    <Cell><Data ss:Type="String">Audit Review Flag</Data></Cell>
    <Cell><Data ss:Type="String">Debit Account Title</Data></Cell>
    <Cell><Data ss:Type="String">Credit Account Title</Data></Cell>
    <Cell><Data ss:Type="String">Debit (₹ L)</Data></Cell>
    <Cell><Data ss:Type="String">Credit (₹ L)</Data></Cell>
    <Cell><Data ss:Type="String">Statutory Accounting Narration</Data></Cell>
   </Row>
`;
    flaggedJournalEntries.forEach(jv => {
      xml += `   <Row ss:Height="40">
    <Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(jv.voucherNo)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(jv.standard)}</Data></Cell>
    <Cell ss:StyleID="FlagStyle"><Data ss:Type="String">${this._escapeXml(jv.flag)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(jv.drAccount)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(jv.crAccount)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${jv.drAmount.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${jv.crAmount.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="NoteText"><Data ss:Type="String">${this._escapeXml(jv.narration)}</Data></Cell>
   </Row>\n`;
    });
    xml += `  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 7: IND AS 101 RECONCILIATIONS
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="7. Ind AS 101 Reconciliations">
  <Table ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Width="340"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="380"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">Ind AS 101 Statutory Reconciliations</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Draft - Management Review Required</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="3"><Data ss:Type="String">PART 1: EQUITY RECONCILIATION AS AT 31 MARCH 2026</Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Line Item</Data></Cell><Cell><Data ss:Type="String">Standard</Data></Cell><Cell><Data ss:Type="String">Amount (₹ Lakhs)</Data></Cell><Cell><Data ss:Type="String">Technical Basis &amp; Rationale</Data></Cell></Row>
`;
    reconciliations.equityReconciliation.forEach(r => {
      xml += `   <Row>
    <Cell ss:StyleID="${r.type === 'base' ? 'BoldStyle' : 'Default'}"><Data ss:Type="String">${this._escapeXml(r.item)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.refIndAs)}</Data></Cell>
    <Cell ss:StyleID="${r.type === 'base' ? 'CurrencyBold' : 'CurrencyStyle'}"><Data ss:Type="Number">${r.amount.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.explanation || '')}</Data></Cell>
   </Row>\n`;
    });
    xml += `   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">TOTAL RECONCILED EQUITY UNDER IND AS</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${reconciliations.indAsEquity.toFixed(2)}</Data></Cell><Cell><Data ss:Type="String">Matches Division II Balance Sheet Equity</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="3"><Data ss:Type="String">PART 2: PROFIT OR LOSS TO TOTAL COMPREHENSIVE INCOME RECONCILIATION</Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell><Data ss:Type="String">Adjustment Item</Data></Cell><Cell><Data ss:Type="String">Standard</Data></Cell><Cell><Data ss:Type="String">Amount (₹ Lakhs)</Data></Cell><Cell><Data ss:Type="String">Technical Basis &amp; Rationale</Data></Cell></Row>
`;
    reconciliations.profitReconciliation.forEach(r => {
      xml += `   <Row>
    <Cell ss:StyleID="${r.type === 'base' ? 'BoldStyle' : 'Default'}"><Data ss:Type="String">${this._escapeXml(r.item)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.refIndAs)}</Data></Cell>
    <Cell ss:StyleID="${r.type === 'base' ? 'CurrencyBold' : 'CurrencyStyle'}"><Data ss:Type="Number">${r.amount.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.explanation || '')}</Data></Cell>
   </Row>\n`;
    });
    xml += `   <Row ss:StyleID="SubHeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">NET PROFIT AFTER TAX UNDER IND AS (A)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indPAT.toFixed(2)}</Data></Cell><Cell><Data ss:Type="String">Statement of Profit &amp; Loss</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Other Comprehensive Income (net of tax) (B)</Data></Cell><Cell><Data ss:Type="String">Ind AS 1/19/109</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${pnl.indTotalOCI.toFixed(2)}</Data></Cell><Cell><Data ss:Type="String">Actuarial loss in OCI + FVTOCI Gain</Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle"><Cell ss:MergeAcross="1"><Data ss:Type="String">TOTAL COMPREHENSIVE INCOME UNDER IND AS (A + B)</Data></Cell><Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${reconciliations.totalComprehensiveIncome.toFixed(2)}</Data></Cell><Cell><Data ss:Type="String">Division II Schedule III TCI</Data></Cell></Row>
  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 8: CONVERTED 6-COLUMN TRIAL BALANCE
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="8. Adjusted 6-Col TB">
  <Table ss:DefaultColumnWidth="100" ss:DefaultRowHeight="20">
   <Column ss:Width="70"/>
   <Column ss:Width="260"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="95"/>
   <Column ss:Width="95"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">Converted 6-Column Trial Balance (Audit Bridge)</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Amounts in ₹ Lakhs</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle">
    <Cell><Data ss:Type="String">Code</Data></Cell>
    <Cell><Data ss:Type="String">Account Title</Data></Cell>
    <Cell><Data ss:Type="String">Previous AS Dr</Data></Cell>
    <Cell><Data ss:Type="String">Previous AS Cr</Data></Cell>
    <Cell><Data ss:Type="String">Adj Dr</Data></Cell>
    <Cell><Data ss:Type="String">Adj Cr</Data></Cell>
    <Cell><Data ss:Type="String">Ind AS Dr</Data></Cell>
    <Cell><Data ss:Type="String">Ind AS Cr</Data></Cell>
   </Row>
`;
    convertedTb.forEach(r => {
      xml += `   <Row>
    <Cell><Data ss:Type="String">${this._escapeXml(r.code)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.name)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.previousAsDebit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.previousAsCredit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.adjDebit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.adjCredit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${r.indAsDebit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${r.indAsCredit || 0}</Data></Cell>
   </Row>\n`;
    });
    xml += `  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 9: ORIGINAL UPLOADED TB
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="9. Original Uploaded TB">
  <Table ss:DefaultColumnWidth="110" ss:DefaultRowHeight="20">
   <Column ss:Width="70"/>
   <Column ss:Width="280"/>
   <Column ss:Width="140"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">Original Uploaded Previous GAAP (AS) Trial Balance</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:StyleID="HeaderStyle">
    <Cell><Data ss:Type="String">Code</Data></Cell>
    <Cell><Data ss:Type="String">Account Title</Data></Cell>
    <Cell><Data ss:Type="String">Group</Data></Cell>
    <Cell><Data ss:Type="String">Debit (₹)</Data></Cell>
    <Cell><Data ss:Type="String">Credit (₹)</Data></Cell>
   </Row>
`;
    originalTb.forEach(r => {
      xml += `   <Row>
    <Cell><Data ss:Type="String">${this._escapeXml(r.code)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.name)}</Data></Cell>
    <Cell><Data ss:Type="String">${this._escapeXml(r.group)}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.debit || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${r.credit || 0}</Data></Cell>
   </Row>\n`;
    });
    xml += `  </Table>
 </Worksheet>
`;

    // -------------------------------------------------------------
    // SHEET 10: COMPANY PROFILE & APPLICABILITY
    // -------------------------------------------------------------
    xml += `
 <Worksheet ss:Name="10. Company &amp; Applicability">
  <Table ss:DefaultColumnWidth="160" ss:DefaultRowHeight="20">
   <Column ss:Width="220"/>
   <Column ss:Width="400"/>
   <Row ss:Height="26"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">Company Profile &amp; Statutory Applicability</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Company Name</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(company.name)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">CIN</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(company.cin)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Statutory Status</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(applicability.status)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Rule Citation</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(applicability.legalCitation)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Audited Net Worth Financial Year</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(applicability.timeline ? (applicability.timeline.netWorthFYDisplay || applicability.timeline.netWorthFYSelected) : 'FY 2025–26')}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Net Worth Reference Date</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(applicability.timeline ? applicability.timeline.referenceNetWorthDate : '31 March')}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Net Worth Evaluated</Data></Cell><Cell><Data ss:Type="String">₹${company.netWorthHistory ? company.netWorthHistory[company.netWorthHistory.length - 1].netWorthCr : '0.00'} Crores</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Date of Transition (Opening BS)</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(applicability.timeline ? applicability.timeline.transitionDate : '1 April 2025')}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">Comparative Period</Data></Cell><Cell><Data ss:Type="String">${this._escapeXml(applicability.timeline ? applicability.timeline.comparativeYear : 'FY 2025–26')}</Data></Cell></Row>
   <Row><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">First Ind AS Reporting Period</Data></Cell><Cell ss:StyleID="BoldStyle"><Data ss:Type="String">${this._escapeXml(applicability.timeline ? applicability.timeline.firstReportingYear : 'FY 2026–27')}</Data></Cell></Row>
  </Table>
 </Worksheet>
</Workbook>`;

    return xml;
  }
}

window.IndASExcelExportEngine = IndASExcelExportEngine;
