import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Bill } from "./mockData"

/**
 * Format currency as INR text (e.g. INR 1,50,000)
 */
function formatINR(amount: number): string {
  return "INR " + amount.toLocaleString("en-IN")
}

/**
 * Format date to a readable string
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  } catch (e) {
    return dateStr
  }
}

export function generateBillPDF(bill: Bill) {
  // Create a new A4 document in portrait mode
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  })

  const pageWidth = doc.internal.pageSize.width // 210mm
  const pageHeight = doc.internal.pageSize.height // 297mm
  
  // ── 1. HEADER (Hospital Letterhead) ──────────────────────────────────
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(15, 118, 110) // Deep Teal
  doc.text("ASCAS FERTILITY & WOMEN'S CENTER", pageWidth / 2, 18, { align: "center" })

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139) // Slate gray
  doc.text("No 15, Healthcare Colony, Landmark Crossroad, Chennai - 600001", pageWidth / 2, 23, { align: "center" })
  doc.text("GSTIN: 33ASCAS1234F1Z5  |  Tel: +91 93425 21779  |  Email: ascas@ascasfertility.in", pageWidth / 2, 27, { align: "center" })

  // Decorative dual lines
  doc.setDrawColor(15, 118, 110)
  doc.setLineWidth(0.5)
  doc.line(15, 30, pageWidth - 15, 30)
  doc.setDrawColor(204, 251, 241) // Light teal
  doc.setLineWidth(0.2)
  doc.line(15, 31, pageWidth - 15, 31)

  // ── 2. INVOICE TITLE ────────────────────────────────────────────────
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(15, 118, 110) // Deep Teal
  doc.text("INPATIENT BILL / INVOICE ESTIMATE", pageWidth / 2, 38, { align: "center" })

  // ── 3. PATIENT & BILL METADATA GRID ────────────────────────────────
  const metadataRows: any[] = [
    [
      { content: "Patient Name:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: bill.patientName, styles: { fontStyle: "bold", textColor: [15, 23, 42] } },
      { content: "Bill Number:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: bill.billNo, styles: { fontStyle: "bold", textColor: [15, 23, 42] } }
    ],
    [
      { content: "Patient UHID:", styles: { textColor: [100, 116, 139] } },
      { content: bill.uhid },
      { content: "Invoice Date:", styles: { textColor: [100, 116, 139] } },
      { content: formatDate(bill.date) }
    ],
    [
      { content: "Consultant Doctor:", styles: { textColor: [100, 116, 139] } },
      { content: bill.doctorName.split(" (")[0] },
      { content: "Billing Method:", styles: { textColor: [100, 116, 139] } },
      { content: bill.billingMethod === "item_wise" ? "Item-wise Billing" : "Full Payment Package" }
    ],
    [
      { content: "Room Number:", styles: { textColor: [100, 116, 139] } },
      { content: bill.roomNo || "Day Care (Standard)" },
      { content: "Payment Status:", styles: { textColor: [100, 116, 139] } },
      { content: bill.status, styles: { fontStyle: "bold", textColor: bill.status === "Paid" ? [16, 124, 65] : [220, 38, 38] } }
    ]
  ]

  autoTable(doc, {
    body: metadataRows,
    startY: 42,
    margin: { left: 15, right: 15 },
    theme: "plain",
    styles: {
      fontSize: 8.5,
      cellPadding: 1.5,
      font: "Helvetica"
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { cellWidth: 30 },
      3: { cellWidth: 60 }
    }
  })

  // Border line after metadata
  const afterMetadataY = (doc as any).lastAutoTable.finalY + 3
  doc.setDrawColor(226, 232, 240) // Slate-200
  doc.setLineWidth(0.2)
  doc.line(15, afterMetadataY, pageWidth - 15, afterMetadataY)

  // ── 4. CHARGES TABLE ───────────────────────────────────────────────
  const headers = [["S.No.", "Description", "Billing Method", "Qty", "Unit Price", "Total Amount"]]
  const tableRows: any[] = []
  let index = 1

  // Determine what to display based on billing method
  if (bill.billingMethod === "item_wise" && bill.selectedLineItems && bill.selectedLineItems.length > 0) {
    // List item-wise details
    bill.selectedLineItems.forEach((item) => {
      tableRows.push([
        index++,
        item.name,
        "Itemized Procedure",
        item.qty,
        formatINR(item.price),
        formatINR(item.price * item.qty)
      ])
    })
  } else {
    // Full Payment package or fallback: single line for package
    tableRows.push([
      index++,
      bill.packageName + " (Package)",
      "Full Payment Package Rate",
      1,
      formatINR(bill.packagePrice),
      formatINR(bill.packagePrice)
    ])
  }

  // Room Charges (if stored separately)
  if (bill.roomCharges > 0) {
    tableRows.push([
      index++,
      "Room charges (Ward stay / Room occupancy fee)",
      "Accommodations",
      1,
      formatINR(bill.roomCharges),
      formatINR(bill.roomCharges)
    ])
  }

  // Add-ons
  bill.addOns.forEach((addon) => {
    tableRows.push([
      index++,
      addon.name,
      "Separate Add-on",
      1,
      formatINR(addon.price),
      formatINR(addon.price)
    ])
  })

  // Additional Consumables / Misc Charges
  if (bill.additionalCharges > 0) {
    tableRows.push([
      index++,
      "Miscellaneous Administrative & Consumable Charges",
      "Consumables",
      1,
      formatINR(bill.additionalCharges),
      formatINR(bill.additionalCharges)
    ])
  }

  autoTable(doc, {
    head: headers,
    body: tableRows,
    startY: afterMetadataY + 4,
    margin: { left: 15, right: 15 },
    theme: "striped",
    headStyles: {
      fillColor: [15, 118, 110], // Deep Teal
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "left"
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      font: "Helvetica"
    },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 70 },
      2: { cellWidth: 40 },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 23, halign: "right" },
      5: { cellWidth: 23, halign: "right" }
    },
    didParseCell: (data) => {
      // Align headers appropriately
      if (data.row.section === "head") {
        if (data.column.index === 3) data.cell.styles.halign = "center"
        if (data.column.index === 4 || data.column.index === 5) data.cell.styles.halign = "right"
      }
    }
  })

  // ── 5. TOTALS BLOCK ───────────────────────────────────────────────
  const finalTableY = (doc as any).lastAutoTable.finalY + 5
  const subtotal = bill.packagePrice + bill.addOns.reduce((sum, a) => sum + a.price, 0) + bill.roomCharges + bill.additionalCharges
  
  const totalsX = pageWidth - 90
  let totalsY = finalTableY

  // Print Subtotal
  doc.setFont("Helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139)
  doc.text("Subtotal:", totalsX, totalsY)
  doc.setTextColor(15, 23, 42)
  doc.text(formatINR(subtotal), pageWidth - 15, totalsY, { align: "right" })
  totalsY += 4.5

  // Print Tax (if applicable)
  if (bill.taxAmount > 0) {
    doc.setTextColor(100, 116, 139)
    doc.text("GST / Service Tax:", totalsX, totalsY)
    doc.setTextColor(15, 23, 42)
    doc.text(formatINR(bill.taxAmount), pageWidth - 15, totalsY, { align: "right" })
    totalsY += 4.5
  }

  // Print Discount
  if (bill.discount > 0) {
    doc.setTextColor(16, 124, 65) // Green for discount
    doc.text("Concessions / Discount:", totalsX, totalsY)
    doc.text("-" + formatINR(bill.discount), pageWidth - 15, totalsY, { align: "right" })
    totalsY += 4.5
  }

  // Draw separator line
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.2)
  doc.line(totalsX - 5, totalsY, pageWidth - 15, totalsY)
  totalsY += 4.5

  // Print Grand Total
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(10.5)
  doc.setTextColor(15, 118, 110) // Deep Teal
  doc.text("GRAND TOTAL:", totalsX, totalsY)
  doc.text(formatINR(bill.grandTotal), pageWidth - 15, totalsY, { align: "right" })

  // ── 6. BILLING NOTES & DISCOUNT DETAILS ──────────────────────────
  let notesY = finalTableY + 2
  if (bill.billingNotes) {
    doc.setFont("Helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text("BILLING CLINICAL NOTES:", 15, notesY)
    
    doc.setFont("Helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(51, 65, 85)
    
    // Auto-wrap text inside box
    const splitNotes = doc.splitTextToSize(bill.billingNotes, totalsX - 25)
    
    // Draw left border/accent bar
    const notesHeight = splitNotes.length * 3.5 + 4
    doc.setFillColor(248, 250, 252) // Very light slate
    doc.rect(14, notesY + 1.5, totalsX - 23, notesHeight, "F")
    doc.setDrawColor(15, 118, 110)
    doc.setLineWidth(0.6)
    doc.line(14, notesY + 1.5, 14, notesY + 1.5 + notesHeight)
    
    doc.setTextColor(51, 65, 85)
    doc.text(splitNotes, 17, notesY + 5)
    
    notesY += notesHeight + 6
  }

  if (bill.discountDetails?.applied) {
    doc.setFont("Helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(16, 124, 65)
    doc.text("DISCOUNT AUTHORIZATION DETAILS:", 15, notesY)
    
    doc.setFont("Helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(51, 65, 85)
    
    const discInfo = `Authorized By: ${bill.discountDetails.authorizedBy}  |  Reason: ${bill.discountDetails.reason}\nRemarks: ${bill.discountDetails.authorizationRemarks}`
    const splitDisc = doc.splitTextToSize(discInfo, totalsX - 25)
    
    const discHeight = splitDisc.length * 3.5 + 4
    doc.setFillColor(240, 253, 244) // Light emerald background
    doc.rect(14, notesY + 1.5, totalsX - 23, discHeight, "F")
    doc.setDrawColor(16, 124, 65)
    doc.setLineWidth(0.6)
    doc.line(14, notesY + 1.5, 14, notesY + 1.5 + discHeight)
    
    doc.setTextColor(21, 128, 61)
    doc.text(splitDisc, 17, notesY + 5)
  }

  // ── 7. SIGNATURES & FOOTER ────────────────────────────────────────
  // Position signatures at the lower part of the page
  const sigY = pageHeight - 35
  
  doc.setDrawColor(203, 213, 225) // Slate-300
  doc.setLineWidth(0.2)

  // Patient / Guardian Sign line
  doc.line(15, sigY, 75, sigY)
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text("Patient / Guardian Signature", 45, sigY + 4, { align: "center" })

  // Authorised Signatory line
  doc.line(pageWidth - 75, sigY, pageWidth - 15, sigY)
  doc.text("Authorized Billing Desk", pageWidth - 45, sigY + 4, { align: "center" })

  // Centered footer message
  doc.setFont("Helvetica", "oblique")
  doc.setFontSize(9)
  doc.setTextColor(13, 148, 136) // Teal-600
  doc.text("Thank you for choosing ASCAS. Wish you a happy parenthood!", pageWidth / 2, pageHeight - 20, { align: "center" })

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184) // Gray-400
  const timestamp = new Date().toLocaleString("en-IN")
  doc.text(`Computer generated estimate invoice. Printed on ${timestamp} · Subject to discharge reconciliation audits.`, pageWidth / 2, pageHeight - 12, { align: "center" })

  // Save/Download the PDF
  doc.save(`ASCAS_BILL_${bill.billNo}.pdf`)
}
