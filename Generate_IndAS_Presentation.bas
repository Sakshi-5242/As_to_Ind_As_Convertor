Sub CreateIndASPresentation()
    Dim oPres As Object
    Dim oSlide As Object
    Dim oShp As Object
    
    ' Use currently open presentation or create a new one
    On Error Resume Next
    Set oPres = ActivePresentation
    On Error GoTo 0
    If oPres Is Nothing Then
        Set oPres = Presentations.Add
    End If
    
    ' Set 16:9 Widescreen slide size (960 pt x 540 pt)
    oPres.PageSetup.SlideWidth = 960
    oPres.PageSetup.SlideHeight = 540
    
    ' Clean existing slides if user runs on blank presentation
    Do While oPres.Slides.Count > 0
        oPres.Slides(1).Delete
    Loop
    
    ' =========================================================================
    ' SLIDE 1: TOPIC & TEAM DETAILS
    ' =========================================================================
    Set oSlide = oPres.Slides.Add(1, 12) ' 12 = ppLayoutBlank
    oSlide.Background.Fill.Solid
    oSlide.Background.Fill.ForeColor.RGB = RGB(15, 23, 42) ' Dark Navy
    
    ' Badge
    Set oShp = oSlide.Shapes.AddShape(1, 50, 45, 340, 28) ' 1 = msoShapeRectangle
    oShp.Fill.Solid
    oShp.Fill.ForeColor.RGB = RGB(30, 41, 59)
    oShp.Line.Color.RGB = RGB(59, 130, 246)
    oShp.Line.Weight = 1
    oShp.TextFrame.TextRange.Text = "ICAI & MCA ROADMAP COMPLIANCE"
    oShp.TextFrame.TextRange.Font.Size = 11
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(96, 165, 250)
    oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 2 ' ppAlignCenter
    
    ' Title
    Set oShp = oSlide.Shapes.AddShape(1, 50, 85, 860, 95)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "AS TO IND AS APPLICABILITY &" & vbCrLf & "FINANCIAL STATEMENT CONVERSION ASSISTANT"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 26
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Subtitle
    Set oShp = oSlide.Shapes.AddShape(1, 50, 185, 860, 50)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "Automated Diagnostic Engine, Key Transition Timeline Determination & Ind AS 101 Conversion Tool"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 13
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(148, 163, 184)
    
    ' Team Header
    Set oShp = oSlide.Shapes.AddShape(1, 50, 255, 860, 26)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "PROJECT TEAM MEMBERS"
    oShp.TextFrame.TextRange.Font.Size = 11
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(59, 130, 246)
    
    ' 4 Team Member Cards
    Dim i As Integer, leftPos As Single
    Dim names(1 To 4) As String, wros(1 To 4) As String
    names(1) = "Team Member 1": wros(1) = "WRO0000001"
    names(2) = "Team Member 2": wros(2) = "WRO0000002"
    names(3) = "Team Member 3": wros(3) = "WRO0000003"
    names(4) = "Team Member 4": wros(4) = "WRO0000004"
    
    For i = 1 To 4
        leftPos = 50 + (i - 1) * 220
        Set oShp = oSlide.Shapes.AddShape(1, leftPos, 290, 205, 180)
        oShp.Fill.Solid
        oShp.Fill.ForeColor.RGB = RGB(30, 41, 59)
        oShp.Line.Color.RGB = RGB(51, 65, 85)
        oShp.Line.Weight = 1
        
        ' Inner text
        oShp.TextFrame.TextRange.Text = "MEMBER " & i & vbCrLf & vbCrLf & names(i) & vbCrLf & "WRO No: " & wros(i) & vbCrLf & vbCrLf & "Chartered Accountant Candidate"
        oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
        oShp.TextFrame.TextRange.Font.Size = 11
        oShp.TextFrame.TextRange.Font.Color.RGB = RGB(226, 232, 240)
        oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 2
    Next i
    
    ' =========================================================================
    ' SLIDE 2: PROBLEM STATEMENT
    ' =========================================================================
    Set oSlide = oPres.Slides.Add(2, 12)
    oSlide.Background.Fill.Solid
    oSlide.Background.Fill.ForeColor.RGB = RGB(248, 250, 252) ' Light theme
    
    ' Title
    Set oShp = oSlide.Shapes.AddShape(1, 50, 40, 860, 60)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "Problem Statement: Challenges in AS to Ind AS Transition"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 22
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(15, 23, 42)
    
    ' 3 Problem Cards
    Dim pTitles(1 To 3) As String, pDescs(1 To 3) As String
    pTitles(1) = "1. Regulatory Complexity"
    pDescs(1) = "Multi-tier thresholds under MCA Rule 4 (Phase I >= 500 Cr, Phase II >= 250 Cr, Listing status, NBFCs) create widespread confusion in determining exact Transition Dates and mandatory comparative periods."
    
    pTitles(2) = "2. Error-Prone Manual Spreadsheets"
    pDescs(2) = "Traditional Excel-based reconciliations suffer from broken formulas, lack of standardized mapping to Ind AS Schedule III division II, and incomplete audit trails for transition adjustments."
    
    pTitles(3) = "3. Resource Bottlenecks & Delays"
    pDescs(3) = "Finance teams face steep learning curves on Ind AS 101 exemptions and carve-outs, resulting in delayed financial closes, audit disputes, and elevated compliance costs."
    
    For i = 1 To 3
        leftPos = 50 + (i - 1) * 295
        Set oShp = oSlide.Shapes.AddShape(1, leftPos, 130, 275, 340)
        oShp.Fill.Solid
        oShp.Fill.ForeColor.RGB = RGB(255, 255, 255)
        oShp.Line.Color.RGB = RGB(226, 232, 240)
        oShp.Line.Weight = 1
        
        oShp.TextFrame.TextRange.Text = pTitles(i) & vbCrLf & vbCrLf & pDescs(i)
        oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
        oShp.TextFrame.TextRange.Font.Size = 12
        oShp.TextFrame.TextRange.Font.Color.RGB = RGB(51, 65, 85)
        oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 1
    Next i
    
    ' =========================================================================
    ' SLIDE 3: TECHNOLOGY SOLUTION
    ' =========================================================================
    Set oSlide = oPres.Slides.Add(3, 12)
    oSlide.Background.Fill.Solid
    oSlide.Background.Fill.ForeColor.RGB = RGB(248, 250, 252)
    
    ' Title
    Set oShp = oSlide.Shapes.AddShape(1, 50, 40, 860, 60)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "Technology Solution: Developed HTML5 Conversion Assistant"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 22
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(15, 23, 42)
    
    ' 4 Pillar Cards
    Dim sTitles(1 To 4) As String, sDescs(1 To 4) As String
    sTitles(1) = "Deterministic Engine"
    sDescs(1) = "Rule 4 algorithm with descending FY selector (FY 2026-27 to 2015-16). Instantly computes net worth thresholds, listing tests, and subsidiary status."
    
    sTitles(2) = "Timeline Roadmap"
    sDescs(2) = "Auto-derives exact Opening Balance Sheet Date (Transition Date), Comparative Year, and First Ind AS Reporting Year aligned with ICAI Guidance Notes."
    
    sTitles(3) = "Client-Side Ingestion"
    sDescs(3) = "Instant drag-and-drop ingestion of Trial Balances via Excel/CSV. 100% in-browser processing guarantees enterprise confidentiality."
    
    sTitles(4) = "Ind AS 101 Conversion"
    sDescs(4) = "Automated journal entries for PPE deemed cost, financial instruments amortised cost, leases, and Schedule III Division II presentation."
    
    For i = 1 To 4
        leftPos = 50 + (i - 1) * 220
        Set oShp = oSlide.Shapes.AddShape(1, leftPos, 130, 205, 340)
        oShp.Fill.Solid
        oShp.Fill.ForeColor.RGB = RGB(255, 255, 255)
        oShp.Line.Color.RGB = RGB(226, 232, 240)
        oShp.Line.Weight = 1
        
        oShp.TextFrame.TextRange.Text = sTitles(i) & vbCrLf & vbCrLf & sDescs(i)
        oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
        oShp.TextFrame.TextRange.Font.Size = 12
        oShp.TextFrame.TextRange.Font.Color.RGB = RGB(51, 65, 85)
        oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 1
    Next i
    
    ' =========================================================================
    ' SLIDE 4: IMPLEMENTATION PLAN
    ' =========================================================================
    Set oSlide = oPres.Slides.Add(4, 12)
    oSlide.Background.Fill.Solid
    oSlide.Background.Fill.ForeColor.RGB = RGB(248, 250, 252)
    
    ' Title
    Set oShp = oSlide.Shapes.AddShape(1, 50, 40, 860, 60)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "Implementation Roadmap: 4-Phase Transition Lifecycle"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 22
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(15, 23, 42)
    
    ' 4 Phase Horizontal Cards
    Dim phaseTitles(1 To 4) As String, phaseBodies(1 To 4) As String
    phaseTitles(1) = "PHASE 1: Diagnostic & Rule Engine Assessment"
    phaseBodies(1) = "Select reference FY, enter Section 2(57) Net Worth, identify holding/subsidiary relationships, and determine mandatory Ind AS Transition Date."
    
    phaseTitles(2) = "PHASE 2: Trial Balance Ingestion & Mapping"
    phaseBodies(2) = "Import existing AS Trial Balance via drag-and-drop. Auto-map general ledger accounts to Ind AS Schedule III Division II taxonomy."
    
    phaseTitles(3) = "PHASE 3: Ind AS 101 Transitional Adjustments"
    phaseBodies(3) = "Apply mandatory exceptions and voluntary exemptions. Post opening adjustments to Retained Earnings and record deferred tax impacts."
    
    phaseTitles(4) = "PHASE 4: Financial Statements & Audit Sign-Off"
    phaseBodies(4) = "Generate Opening Ind AS Balance Sheet, Comparative Statements, and detailed workpaper notes ready for Statutory Audit review."
    
    Dim topPos As Single
    For i = 1 To 4
        topPos = 120 + (i - 1) * 85
        Set oShp = oSlide.Shapes.AddShape(1, 50, topPos, 860, 72)
        oShp.Fill.Solid
        oShp.Fill.ForeColor.RGB = RGB(255, 255, 255)
        oShp.Line.Color.RGB = RGB(226, 232, 240)
        oShp.Line.Weight = 1
        
        oShp.TextFrame.TextRange.Text = phaseTitles(i) & vbCrLf & phaseBodies(i)
        oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
        oShp.TextFrame.TextRange.Font.Size = 11
        oShp.TextFrame.TextRange.Font.Color.RGB = RGB(51, 65, 85)
        oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 1
    Next i
    
    ' =========================================================================
    ' SLIDE 5: CONCLUSION & VALUE PROPOSITION
    ' =========================================================================
    Set oSlide = oPres.Slides.Add(5, 12)
    oSlide.Background.Fill.Solid
    oSlide.Background.Fill.ForeColor.RGB = RGB(15, 23, 42) ' Dark Navy
    
    ' Title
    Set oShp = oSlide.Shapes.AddShape(1, 50, 40, 860, 60)
    oShp.Fill.Transparency = 1
    oShp.Line.Visible = False
    oShp.TextFrame.TextRange.Text = "Conclusion & Value Proposition"
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 24
    oShp.TextFrame.TextRange.Font.Bold = True
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Left Summary Box
    Set oShp = oSlide.Shapes.AddShape(1, 50, 120, 520, 360)
    oShp.Fill.Solid
    oShp.Fill.ForeColor.RGB = RGB(30, 41, 59)
    oShp.Line.Color.RGB = RGB(51, 65, 85)
    oShp.Line.Weight = 1
    oShp.TextFrame.TextRange.Text = "TRANSFORMING REGULATORY COMPLIANCE" & vbCrLf & vbCrLf & _
        "1. Complete Regulatory Alignment:" & vbCrLf & _
        "Fully conforms to Companies (Ind AS) Rules, 2015, Rule 4 amendment roadmaps, and ICAI Ind AS 101 Implementation Guidance Notes." & vbCrLf & vbCrLf & _
        "2. Zero Friction & Enterprise Data Privacy:" & vbCrLf & _
        "Operates completely client-side in standard web browsers. No proprietary financial figures leave the corporate perimeter." & vbCrLf & vbCrLf & _
        "3. Audit-Ready Documentation:" & vbCrLf & _
        "Generates transparent reconciliation bridges from AS Equity to Ind AS Equity with full journal narrative trails."
    oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
    oShp.TextFrame.TextRange.Font.Size = 12
    oShp.TextFrame.TextRange.Font.Color.RGB = RGB(226, 232, 240)
    oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 1
    
    ' Right 3 Metric Badges
    Dim mNums(1 To 3) As String, mLabels(1 To 3) As String
    mNums(1) = "80%": mLabels(1) = "Time Saved vs Manual Excel Transition"
    mNums(2) = "100%": mLabels(2) = "Client-Side Data Privacy Guarantee"
    mNums(3) = "0": mLabels(3) = "Server Dependencies (Offline Ready)"
    
    For i = 1 To 3
        topPos = 120 + (i - 1) * 125
        Set oShp = oSlide.Shapes.AddShape(1, 590, topPos, 320, 105)
        oShp.Fill.Solid
        oShp.Fill.ForeColor.RGB = RGB(30, 41, 59)
        oShp.Line.Color.RGB = RGB(59, 130, 246)
        oShp.Line.Weight = 1
        
        oShp.TextFrame.TextRange.Text = mNums(i) & vbCrLf & mLabels(i)
        oShp.TextFrame.TextRange.Font.Name = "Segoe UI"
        oShp.TextFrame.TextRange.Font.Size = 13
        oShp.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
        oShp.TextFrame.TextRange.ParagraphFormat.Alignment = 2
    Next i
    
    MsgBox "5-Slide Ind AS Conversion Presentation created successfully in 16:9 widescreen format!", vbInformation, "Ind AS Presentation Generator"
End Sub
