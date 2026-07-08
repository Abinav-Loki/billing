import * as React from "react"
import { Bill, RefundEntry } from "../../lib/mockData"
import { formatCurrency, formatDate } from "../../lib/utils"
import { generateRefundPDF } from "../../lib/refundPdfExport"
import {
  Undo,
  Printer,
  Download,
  Calendar,
  User,
  Hash,
  AlertCircle
} from "lucide-react"

interface RefundTimelineProps {
  bill: Bill
  refunds: RefundEntry[]
}

export function RefundTimeline({
  bill,
  refunds
}: RefundTimelineProps) {
  
  // Sort refunds newest first
  const sortedRefunds = React.useMemo(() => {
    return [...refunds].sort((a, b) => {
      return new Date(b.refundedAt).getTime() - new Date(a.refundedAt).getTime()
    })
  }, [refunds])

  const handlePrint = (refund: RefundEntry) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const ipNo = bill.uhid ? bill.uhid.replace("UHID", "IP") : "IP-2026-TEMP"
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Refund Receipt - ${refund.refundReceiptNo}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; background-color: #ffffff; }
              .receipt-container { max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
              .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #b91c1c; padding-bottom: 16px; }
              .hospital-title { color: #0f766e; font-size: 20px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.025em; }
              .hospital-sub { font-size: 11px; color: #64748b; margin-bottom: 3px; }
              .title { text-align: center; font-size: 14px; font-weight: bold; color: #b91c1c; margin: 20px 0; letter-spacing: 0.05em; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; margin-bottom: 20px; background-color: #f8fafc; padding: 16px; border-radius: 8px; }
              .grid-item { display: flex; flex-direction: column; }
              .label { color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
              .value { color: #0f172a; font-weight: 600; }
              .divider { height: 1px; background-color: #e2e8f0; margin: 20px 0; }
              .amount-box { background-color: #fef2f2; border: 1px solid #b91c1c; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .amount-val { font-size: 24px; font-weight: 800; color: #b91c1c; margin-top: 4px; }
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
              <div class="title">OFFICIAL REFUND RECEIPT</div>
              
              <div class="grid">
                <div class="grid-item"><span class="label">Patient Name:</span> <span class="value">${bill.patientName}</span></div>
                <div class="grid-item"><span class="label">Refund Receipt Number:</span> <span class="value">${refund.refundReceiptNo}</span></div>
                <div class="grid-item"><span class="label">Patient UHID:</span> <span class="value">${bill.uhid}</span></div>
                <div class="grid-item"><span class="label">Date / Time:</span> <span class="value">${formatDate(refund.refundedAt)}</span></div>
                <div class="grid-item"><span class="label">IP Number:</span> <span class="value">${ipNo}</span></div>
                <div class="grid-item"><span class="label">Original Bill Number:</span> <span class="value">${bill.billNo}</span></div>
                <div class="grid-item"><span class="label">Refund Method:</span> <span class="value">${refund.method}</span></div>
                <div class="grid-item"><span class="label">Processed By:</span> <span class="value">${refund.processedBy}</span></div>
                <div class="grid-item"><span class="label">Original Ref:</span> <span class="value">${refund.originalPaymentRef}</span></div>
                <div class="grid-item"><span class="label">Authorized By:</span> <span class="value">${refund.authorizedBy}</span></div>
              </div>

              <div class="amount-box">
                <div class="label">Refund Amount Approved</div>
                <div class="amount-val">INR ${refund.amount.toLocaleString("en-IN")}</div>
              </div>

              <div class="sig-grid">
                <div>
                  <div class="sig-line">Patient / Recipient Signature</div>
                </div>
                <div>
                  <div class="sig-line">Authorized Billing Desk</div>
                </div>
              </div>

              <div class="footer">
                This is a computer generated refund statement. Printed on ${new Date().toLocaleString("en-IN")} · Processed by ${refund.processedBy}
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

  if (sortedRefunds.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-rose-700 dark:text-rose-400 text-sm flex items-center gap-1.5">
        <Undo className="h-4 w-4" /> Refund History
      </h3>
      <div className="relative border-l border-rose-200 dark:border-rose-900/40 pl-6 ml-3 space-y-6">
        {sortedRefunds.map((refund) => (
          <div key={refund.id} className="relative group">
            {/* Timeline Dot */}
            <span className="absolute -left-[37px] top-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shrink-0 shadow-sm bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <Undo className="h-3 w-3" />
            </span>

            {/* Timeline Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-100 dark:border-rose-900/20 bg-rose-50/10 dark:bg-rose-950/5 hover:shadow-md transition-all duration-200 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    Refund Processed
                  </span>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {refund.method}
                  </span>
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded">
                    Ref: {refund.originalPaymentRef}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-350">
                  <strong>Reason:</strong> {refund.reason} {refund.remarks && `(${refund.remarks})`}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(refund.refundedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Processed by: {refund.processedBy} · Authorized by: {refund.authorizedBy}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(refund.amount)}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    {refund.refundReceiptNo}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePrint(refund)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => generateRefundPDF(bill, refund)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    title="Download Refund PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
