import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Bill, PaymentEntry } from "./mockData"

function formatINR(amount: number): string {
  return "INR " + amount.toLocaleString("en-IN")
}

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

export function generateReceiptPDF(bill: Bill, entry: PaymentEntry) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  })

  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // 1. Hospital Header
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(15, 118, 110) // Deep Teal
  doc.text("ASCAS FERTILITY & WOMEN'S CENTER", pageWidth / 2, 18, { align: "center" })

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139) // Slate gray
  doc.text("14,Arunachalam Rd, next to VB world, Saligramam, Chennai, Tamil Nadu 600093", pageWidth / 2, 23, { align: "center" })
  doc.text("Tel: +91-9345293609  |  Email: accumedspecialityclinic@gmail.com", pageWidth / 2, 27, { align: "center" })

  // Decorative dual lines
  doc.setDrawColor(15, 118, 110)
  doc.setLineWidth(0.5)
  doc.line(15, 30, pageWidth - 15, 30)
  doc.setDrawColor(204, 251, 241) // Light teal
  doc.setLineWidth(0.2)
  doc.line(15, 31, pageWidth - 15, 31)

  // 2. Receipt Title
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(15, 118, 110)
  doc.text("OFFICIAL PAYMENT RECEIPT", pageWidth / 2, 38, { align: "center" })

  // Calculate totals for financial summary
  const payments = bill.payments ?? []
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const balanceDue = Math.max(0, bill.grandTotal - totalPaid)

  // 3. Receipt Metadata Grid
  const metadataRows: any[] = [
    [
      { content: "Patient Name:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: bill.patientName, styles: { fontStyle: "bold", textColor: [15, 23, 42] } },
      { content: "Receipt Number:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: entry.receiptNo, styles: { fontStyle: "bold", textColor: [15, 23, 42] } }
    ],
    [
      { content: "Patient UHID:", styles: { textColor: [100, 116, 139] } },
      { content: bill.uhid },
      { content: "Receipt Date/Time:", styles: { textColor: [100, 116, 139] } },
      { content: `${formatDate(entry.date)} ${entry.time || ""}` }
    ],
    [
      { content: "Consultant Doctor:", styles: { textColor: [100, 116, 139] } },
      { content: bill.doctorName.split(" (")[0] },
      { content: "Linked Bill No:", styles: { textColor: [100, 116, 139] } },
      { content: bill.billNo, styles: { fontStyle: "bold" } }
    ],
    [
      { content: "Payment Type:", styles: { textColor: [100, 116, 139] } },
      { content: entry.paymentType },
      { content: "Payment Method:", styles: { textColor: [100, 116, 139] } },
      { content: entry.method, styles: { fontStyle: "bold", textColor: [15, 118, 110] } }
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
  const afterMetadataY = (doc as any).lastAutoTable.finalY + 4
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.2)
  doc.line(15, afterMetadataY, pageWidth - 15, afterMetadataY)

  // 4. Transaction Details Section
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(15, 23, 42)
  doc.text("TRANSACTION DETAILS", 15, afterMetadataY + 6)

  const detailRows: any[] = [
    ["Payment Amount", formatINR(entry.amount)],
    ["Payment Mode / Method", entry.method]
  ]

  if (entry.transactionRef) {
    const refLabel = entry.method === "Cheque" ? "Cheque Number" : entry.method === "UPI" ? "UPI UTR / Txn ID" : "Transaction Ref No."
    detailRows.push([refLabel, entry.transactionRef])
  }
  if (entry.bankName) {
    detailRows.push(["Bank Name", entry.bankName])
  }
  if (entry.last4Digits) {
    detailRows.push(["Card Ending In", `**** **** **** ${entry.last4Digits}`])
  }
  if (entry.chequeDate) {
    detailRows.push(["Cheque Date", formatDate(entry.chequeDate)])
  }
  detailRows.push(["Received By (Staff)", entry.receivedBy])
  if (entry.remarks) {
    detailRows.push(["Remarks / Notes", entry.remarks])
  }

  autoTable(doc, {
    body: detailRows,
    startY: afterMetadataY + 9,
    margin: { left: 15, right: 15 },
    theme: "striped",
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      font: "Helvetica"
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold", textColor: [100, 116, 139] },
      1: { cellWidth: 130, textColor: [15, 23, 42] }
    }
  })

  const afterDetailsY = (doc as any).lastAutoTable.finalY + 6

  // 5. Billing Summary Block (Teal Box)
  const showDiscount = bill.discount > 0
  const boxHeight = showDiscount ? 34 : 24
  doc.setFillColor(240, 253, 250) // Very light teal background
  doc.setDrawColor(15, 118, 110)
  doc.setLineWidth(0.3)
  doc.rect(15, afterDetailsY, pageWidth - 30, boxHeight, "FD")

  doc.setFont("Helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(15, 118, 110)
  doc.text("INPATIENT ACCOUNT STANDING", 20, afterDetailsY + 5)

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139)
  
  const subtotal = bill.packagePrice + bill.addOns.reduce((sum, a) => sum + a.price, 0) + (bill.roomCharges || 0) + (bill.additionalCharges || 0)
  
  let currentY = afterDetailsY + 11
  doc.text("Total Bill Amount (Subtotal):", 20, currentY)
  doc.setFont("Helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text(formatINR(subtotal), 75, currentY)
  
  if (bill.totalConsultantCharges && bill.totalConsultantCharges > 0) {
    currentY += 5
    doc.setFont("Helvetica", "normal")
    doc.setTextColor(100, 116, 139)
    doc.text("Consultant Charges:", 20, currentY)
    doc.setFont("Helvetica", "bold")
    doc.setTextColor(15, 23, 42)
    doc.text(formatINR(bill.totalConsultantCharges), 75, currentY)
  }

  if (showDiscount) {
    currentY += 5
    doc.setFont("Helvetica", "normal")
    doc.setTextColor(16, 124, 65)
    doc.text("Discount / Concession:", 20, currentY)
    doc.setFont("Helvetica", "bold")
    doc.text("-" + formatINR(bill.discount), 75, currentY)
  }
  
  currentY += 5
  doc.setFont("Helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text("Net Grand Total:", 20, currentY)
  doc.setFont("Helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text(formatINR(bill.grandTotal), 75, currentY)
  
  currentY += 5
  doc.setFont("Helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text("Total Amount Settled:", 20, currentY)
  doc.setFont("Helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text(formatINR(totalPaid), 75, currentY)

  // Balance due on the right
  const balY = afterDetailsY + 15 + (showDiscount ? 5 : 0) + (bill.totalConsultantCharges && bill.totalConsultantCharges > 0 ? 5 : 0)
  doc.setFont("Helvetica", "bold")
  doc.setTextColor(100, 116, 139)
  doc.text("Outstanding Balance:", pageWidth - 85, balY)
  
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(11)
  if (balanceDue > 0) {
    doc.setTextColor(245, 158, 11) // Amber
  } else {
    doc.setTextColor(16, 124, 65) // Green
  }
  doc.text(formatINR(balanceDue), pageWidth - 45, balY)

  // 6. Signatures and Audit Info
  const sigY = pageHeight - 35

  doc.setDrawColor(203, 213, 225)
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
  doc.setTextColor(13, 148, 136)
  doc.text("Thank you for choosing ASCAS.", pageWidth / 2, pageHeight - 20, { align: "center" })

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  const timestamp = new Date().toLocaleString("en-IN")
  doc.text(`This is a computer generated receipt. Printed on ${timestamp} · Received by ${entry.receivedBy}`, pageWidth / 2, pageHeight - 12, { align: "center" })

  doc.save(`ASCAS_RECEIPT_${entry.receiptNo}.pdf`)
}
