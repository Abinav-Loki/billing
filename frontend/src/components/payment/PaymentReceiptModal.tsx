import * as React from "react"
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Bill, PaymentEntry } from "../../lib/mockData"
import { formatCurrency, formatDate } from "../../lib/utils"
import { generateReceiptPDF } from "../../lib/receiptPdfExport"
import {
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Building,
  CreditCard,
  Calendar,
  User,
  Info
} from "lucide-react"

interface PaymentReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  payment: PaymentEntry | null
  bill: Bill
}

export function PaymentReceiptModal({
  isOpen,
  onClose,
  payment,
  bill
}: PaymentReceiptModalProps) {
  if (!payment) return null

  // Calculation for current outstanding balance
  const payments = bill.payments ?? []
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const balanceDue = Math.max(0, bill.grandTotal - totalPaid)
  const subtotal = bill.packagePrice + bill.addOns.reduce((sum, a) => sum + a.price, 0) + (bill.roomCharges || 0) + (bill.additionalCharges || 0)

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt - ${payment.receiptNo}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; background-color: #ffffff; }
              .receipt-container { max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
              .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0f766e; padding-bottom: 16px; }
              .hospital-title { color: #0f766e; font-size: 20px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.025em; }
              .hospital-sub { font-size: 11px; color: #64748b; margin-bottom: 3px; }
              .title { text-align: center; font-size: 14px; font-weight: bold; color: #0f766e; margin: 20px 0; letter-spacing: 0.05em; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; margin-bottom: 20px; background-color: #f8fafc; padding: 16px; border-radius: 8px; }
              .grid-item { display: flex; flex-direction: column; }
              .label { color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
              .value { color: #0f172a; font-weight: 600; }
              .divider { height: 1px; background-color: #e2e8f0; margin: 20px 0; }
              .amount-box { background-color: #f0fdfa; border: 1px solid #0f766e; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .amount-val { font-size: 24px; font-weight: 800; color: #0f766e; margin-top: 4px; }
              .standing-box { border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; }
              .standing-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
              .standing-row:last-child { margin-bottom: 0; padding-top: 6px; border-t: 1px solid #e2e8f0; font-weight: bold; }
              .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; }
              .sig-line { border-top: 1px dashed #cbd5e1; margin-top: 30px; padding-top: 6px; }
              .footer { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
              @media print {
                body { padding: 0; background-color: transparent; }
                .receipt-container { border: none; box-shadow: none; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="header">
                <div class="hospital-title">ASCAS FERTILITY & WOMEN'S CENTER</div>
                <div class="hospital-sub">14,Arunachalam Rd, next to VB world, Saligramam, Chennai, Tamil Nadu 600093</div>
                <div class="hospital-sub">Tel: +91-9345293609</div>
              </div>
              <div class="title">OFFICIAL PAYMENT RECEIPT</div>
              
              <div class="grid">
                <div class="grid-item"><span class="label">Patient Name:</span> <span class="value">${bill.patientName}</span></div>
                <div class="grid-item"><span class="label">Receipt Number:</span> <span class="value">${payment.receiptNo}</span></div>
                <div class="grid-item"><span class="label">Patient UHID:</span> <span class="value">${bill.uhid}</span></div>
                <div class="grid-item"><span class="label">Date / Time:</span> <span class="value">${formatDate(payment.date)} ${payment.time || ""}</span></div>
                <div class="grid-item"><span class="label">Linked Bill No:</span> <span class="value">${bill.billNo}</span></div>
                <div class="grid-item"><span class="label">Payment Mode:</span> <span class="value">${payment.method}</span></div>
                <div class="grid-item"><span class="label">Payment Type:</span> <span class="value">${payment.paymentType}</span></div>
                <div class="grid-item"><span class="label">Received By:</span> <span class="value">${payment.receivedBy}</span></div>
                ${payment.transactionRef ? `<div class="grid-item"><span class="label">${payment.method === "Cheque" ? "Cheque Number" : payment.method === "UPI" ? "UTR / Txn ID" : "Reference No"} :</span> <span class="value">${payment.transactionRef}</span></div>` : ""}
                ${payment.bankName ? `<div class="grid-item"><span class="label">Bank Name:</span> <span class="value">${payment.bankName}</span></div>` : ""}
                ${payment.last4Digits ? `<div class="grid-item"><span class="label">Card Last 4 Digits:</span> <span class="value">**** **** **** ${payment.last4Digits}</span></div>` : ""}
                ${payment.chequeDate ? `<div class="grid-item"><span class="label">Cheque Date:</span> <span class="value">${formatDate(payment.chequeDate)}</span></div>` : ""}
              </div>
 
              <div class="amount-box">
                <div class="label">Amount Paid</div>
                <div class="amount-val">INR ${payment.amount.toLocaleString("en-IN")}</div>
              </div>
 
              <div class="standing-box">
                <div class="standing-row"><span>Total Bill Value (Subtotal):</span> <span>INR ${subtotal.toLocaleString("en-IN")}</span></div>
                ${bill.totalConsultantCharges && bill.totalConsultantCharges > 0 ? `<div class="standing-row"><span>Consultant Charges:</span> <span>INR ${bill.totalConsultantCharges.toLocaleString("en-IN")}</span></div>` : ""}
                ${bill.discount > 0 ? `<div class="standing-row" style="color: #10b981; font-weight: 600;"><span>Applied Discount / Concession:</span> <span>-INR ${bill.discount.toLocaleString("en-IN")}</span></div>` : ""}
                <div class="standing-row"><span>Net Grand Total:</span> <span>INR ${bill.grandTotal.toLocaleString("en-IN")}</span></div>
                <div class="standing-row"><span>Total Settled to Date:</span> <span>INR ${totalPaid.toLocaleString("en-IN")}</span></div>
                <div class="standing-row" style="font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 6px; color: ${balanceDue > 0 ? "#f59e0b" : "#16a34a"};">
                  <span>Outstanding Balance:</span> 
                  <span>INR ${balanceDue.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div class="sig-grid">
                <div>
                  <div class="sig-line">Patient / Guardian Signature</div>
                </div>
                <div>
                  <div class="sig-line">Authorized Billing Desk</div>
                </div>
              </div>

              <div class="footer">
                This is a computer generated receipt. Printed on ${new Date().toLocaleString("en-IN")} · Received by ${payment.receivedBy}
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const hasExtraFields = payment.transactionRef || payment.bankName || payment.last4Digits || payment.chequeDate

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <DialogHeader>
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <DialogTitle>Payment Receipt Generated</DialogTitle>
        </div>
      </DialogHeader>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Receipt Header Visual */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-3">
          <div className="flex justify-between border-b pb-2">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">ASCAS FERTILITY & WOMEN'S CENTER</p>
            </div>
            <div className="text-right">
              <p className="font-bold font-mono text-teal-600 dark:text-teal-400">{payment.receiptNo}</p>
              <p className="text-[10px] text-muted-foreground">{formatDate(payment.date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{bill.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">UHID</span>
              <span className="font-mono text-slate-700 dark:text-slate-200">{bill.uhid}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Type</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{payment.paymentType}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Method</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{payment.method}</span>
            </div>
          </div>
        </div>

        {/* Transaction Detail Row Cards */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-lg border bg-white dark:bg-slate-950 text-xs">
            <span className="font-medium text-slate-500">Amount Paid</span>
            <span className="font-extrabold text-sm text-emerald-600">{formatCurrency(payment.amount)}</span>
          </div>

          {hasExtraFields && (
            <div className="p-3 rounded-lg border bg-white dark:bg-slate-950 text-xs space-y-2">
              <p className="font-bold text-slate-400 text-[10px] uppercase">Transaction References</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {payment.transactionRef && (
                  <div>
                    <span className="text-slate-500 block">Ref No:</span>
                    <span className="font-mono font-semibold">{payment.transactionRef}</span>
                  </div>
                )}
                {payment.bankName && (
                  <div>
                    <span className="text-slate-500 block">Bank:</span>
                    <span className="font-semibold">{payment.bankName}</span>
                  </div>
                )}
                {payment.last4Digits && (
                  <div>
                    <span className="text-slate-500 block">Card Ending:</span>
                    <span className="font-semibold">**** {payment.last4Digits}</span>
                  </div>
                )}
                {payment.chequeDate && (
                  <div>
                    <span className="text-slate-500 block">Cheque Date:</span>
                    <span className="font-semibold">{formatDate(payment.chequeDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center p-3 rounded-lg border bg-white dark:bg-slate-950 text-xs">
            <span className="font-medium text-slate-500">Received By (Staff)</span>
            <span className="font-semibold">{payment.receivedBy}</span>
          </div>

          {payment.remarks && (
            <div className="p-3 rounded-lg border bg-white dark:bg-slate-950 text-xs">
              <span className="font-medium text-slate-500 block mb-1">Remarks</span>
              <span className="text-slate-600 dark:text-slate-400 italic">"{payment.remarks}"</span>
            </div>
          )}
        </div>

        {/* Account standing card */}
        <div className="bg-slate-50 dark:bg-slate-900/30 border p-3 rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between text-slate-500">
            <span>Total Bill Value (Subtotal):</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {bill.totalConsultantCharges && bill.totalConsultantCharges > 0 ? (
            <div className="flex justify-between text-slate-500">
              <span>Consultant Charges:</span>
              <span>{formatCurrency(bill.totalConsultantCharges)}</span>
            </div>
          ) : null}
          {bill.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold animate-fade-in">
              <span>Applied Discount / Concession:</span>
              <span>-{formatCurrency(bill.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500 font-bold border-b pb-1.5 mb-1.5">
            <span>Net Grand Total:</span>
            <span>{formatCurrency(bill.grandTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total Settled to Date:</span>
            <span>{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-sm border-t pt-1.5 text-slate-800 dark:text-slate-100">
            <span>Remaining Balance Due:</span>
            <span className={balanceDue > 0 ? "text-amber-500" : "text-emerald-600"}>
              {formatCurrency(balanceDue)}
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
        >
          <Printer className="h-4 w-4" /> Print Receipt
        </button>
        <button
          type="button"
          onClick={() => generateReceiptPDF(bill, payment)}
          className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </DialogFooter>
    </Dialog>
  )
}
