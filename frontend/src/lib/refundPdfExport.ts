import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Bill, RefundEntry } from "./mockData"

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

export function generateRefundPDF(bill: Bill, refund: RefundEntry) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  })

  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // 1. Hospital Letterhead Header
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

  // 2. Title
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(185, 28, 28) // Crimson red for refunds
  doc.text("OFFICIAL REFUND RECEIPT", pageWidth / 2, 38, { align: "center" })

  // 3. Refund Metadata Grid
  const ipNo = bill.uhid ? bill.uhid.replace("UHID", "IP") : "IP-2026-TEMP"
  const metadataRows: any[] = [
    [
      { content: "Patient Name:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: bill.patientName, styles: { fontStyle: "bold", textColor: [15, 23, 42] } },
      { content: "Refund Receipt No:", styles: { fontStyle: "bold", textColor: [100, 116, 139] } },
      { content: refund.refundReceiptNo, styles: { fontStyle: "bold", textColor: [185, 28, 28] } }
    ],
    [
      { content: "Patient UHID:", styles: { textColor: [100, 116, 139] } },
      { content: bill.uhid },
      { content: "Refund Date/Time:", styles: { textColor: [100, 116, 139] } },
      { content: formatDate(refund.refundedAt) }
    ],
    [
      { content: "IP Number:", styles: { textColor: [100, 116, 139] } },
      { content: ipNo },
      { content: "Original Bill No:", styles: { textColor: [100, 116, 139] } },
      { content: bill.billNo, styles: { fontStyle: "bold" } }
    ],
    [
      { content: "Refund Method:", styles: { textColor: [100, 116, 139] } },
      { content: refund.method, styles: { fontStyle: "bold", textColor: [185, 28, 28] } },
      { content: "Processed By:", styles: { textColor: [100, 116, 139] } },
      { content: refund.processedBy }
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
      2: { cellWidth: 35 },
      3: { cellWidth: 55 }
    }
  })

  // Border line after metadata
  const afterMetadataY = (doc as any).lastAutoTable.finalY + 4
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.2)
  doc.line(15, afterMetadataY, pageWidth - 15, afterMetadataY)

  // 4. Refund Details Section
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(15, 23, 42)
  doc.text("REFUND TRANSACTION DETAILS", 15, afterMetadataY + 6)

  const detailRows: any[] = [
    ["Refund Amount Approved", formatINR(refund.amount)],
    ["Refund Reason", refund.reason],
    ["Refund Method", refund.method],
    ["Original Payment Ref No.", refund.originalPaymentRef],
    ["Authorized By (Clinical/Admin)", refund.authorizedBy]
  ]

  if (refund.remarks) {
    detailRows.push(["Refund Remarks / Notes", refund.remarks])
  }

  autoTable(doc, {
    body: detailRows,
    startY: afterMetadataY + 9,
    margin: { left: 15, right: 15 },
    theme: "striped",
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      font: "Helvetica"
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold", textColor: [100, 116, 139] },
      1: { cellWidth: 125, textColor: [15, 23, 42] }
    }
  })

  const afterDetailsY = (doc as any).lastAutoTable.finalY + 6

  // 5. Account Summary Box (Teal accent frame with Warning warning label)
  doc.setFillColor(254, 242, 242) // Light red background for refund standing
  doc.setDrawColor(185, 28, 28)
  doc.setLineWidth(0.3)
  doc.rect(15, afterDetailsY, pageWidth - 30, 24, "FD")

  // Calculate outstanding standing
  const payments = bill.payments ?? []
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalRefunded = (bill.refunds ?? []).reduce((sum, r) => sum + r.amount, 0)
  const netPaid = Math.max(0, totalPaid - totalRefunded)
  const balanceDue = Math.max(0, bill.grandTotal - netPaid)

  doc.setFont("Helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(185, 28, 28)
  doc.text("RECONCILED ACCOUNT STANDING (AFTER REFUND)", 20, afterDetailsY + 5)

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139)
  doc.text("Total Bill Value:", 20, afterDetailsY + 12)
  doc.text("Net Settled Amount:", 20, afterDetailsY + 18)
  
  doc.setFont("Helvetica", "bold")
  doc.setTextColor(15, 23, 42)
  doc.text(formatINR(bill.grandTotal), 75, afterDetailsY + 12)
  doc.text(formatINR(netPaid), 75, afterDetailsY + 18)

  doc.setFont("Helvetica", "bold")
  doc.setTextColor(100, 116, 139)
  doc.text("Outstanding Balance:", pageWidth - 85, afterDetailsY + 15)
  
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(11)
  if (balanceDue > 0) {
    doc.setTextColor(245, 158, 11) // Amber
  } else {
    doc.setTextColor(16, 124, 65) // Green
  }
  doc.text(formatINR(balanceDue), pageWidth - 45, afterDetailsY + 15)

  // 6. Signatures
  const sigY = pageHeight - 35

  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.2)

  // Patient / Guardian Signature
  doc.line(15, sigY, 75, sigY)
  doc.setFont("Helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text("Patient / Recipient Signature", 45, sigY + 4, { align: "center" })

  // Authorised Billing Desk
  doc.line(pageWidth - 75, sigY, pageWidth - 15, sigY)
  doc.text("Authorized Desk Signature", pageWidth - 45, sigY + 4, { align: "center" })

  // Centered footer message
  doc.setFont("Helvetica", "oblique")
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text("Reconciliation Audit Voucher. Re-printed under strict clinical supervision rules.", pageWidth / 2, pageHeight - 20, { align: "center" })

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  const timestamp = new Date().toLocaleString("en-IN")
  doc.text(`This is a computer generated refund statement. Printed on ${timestamp} · Processed by ${refund.processedBy}`, pageWidth / 2, pageHeight - 12, { align: "center" })

  doc.save(`ASCAS_REFUND_${refund.refundReceiptNo}.pdf`)
}
