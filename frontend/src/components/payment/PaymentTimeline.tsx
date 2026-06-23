import * as React from "react"
import { PaymentEntry } from "../../lib/mockData"
import { formatCurrency, formatDate } from "../../lib/utils"
import {
  Banknote,
  Smartphone,
  CreditCard,
  Building2,
  BadgeDollarSign,
  Hash,
  Clock,
  Trash2,
  FileText,
  User,
  AlertCircle
} from "lucide-react"

interface PaymentTimelineProps {
  payments: PaymentEntry[]
  onViewReceipt: (entry: PaymentEntry) => void
  onDeletePayment: (id: string) => void
}

const METHOD_ICONS: Record<string, React.ReactNode> = {
  Cash: <Banknote className="h-4 w-4" />,
  UPI: <Smartphone className="h-4 w-4" />,
  "Credit Card": <CreditCard className="h-4 w-4" />,
  "Debit Card": <CreditCard className="h-4 w-4" />,
  "Net Banking": <Building2 className="h-4 w-4" />,
  Cheque: <BadgeDollarSign className="h-4 w-4" />,
  "Bank Transfer": <Hash className="h-4 w-4" />
}

const METHOD_COLORS: Record<string, string> = {
  Cash: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  UPI: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  "Credit Card": "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  "Debit Card": "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  "Net Banking": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  Cheque: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  "Bank Transfer": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
}

export function PaymentTimeline({
  payments,
  onViewReceipt,
  onDeletePayment
}: PaymentTimelineProps) {
  // Sort payments newest first
  const sortedPayments = React.useMemo(() => {
    return [...payments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`)
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`)
      return dateB.getTime() - dateA.getTime()
    })
  }, [payments])

  if (sortedPayments.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No payments recorded</p>
        <p className="text-xs text-muted-foreground mt-1">Submit the payment form to record transaction logs.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Payment History</h3>
      <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 ml-3 space-y-6">
        {sortedPayments.map((payment) => (
          <div key={payment.id} className="relative group">
            {/* Timeline Dot */}
            <span className={`absolute -left-[37px] top-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shrink-0 shadow-sm ${
              METHOD_COLORS[payment.method] ?? "bg-slate-100 text-slate-600"
            }`}>
              {METHOD_ICONS[payment.method] ?? <CreditCard className="h-3 w-3" />}
            </span>

            {/* Timeline Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-md transition-all duration-200 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {payment.method}
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {payment.paymentType}
                  </span>
                  {payment.transactionRef && (
                    <span className="font-mono text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded">
                      Ref: {payment.transactionRef}
                    </span>
                  )}
                </div>
                
                {payment.remarks && (
                  <p className="text-xs text-slate-500 italic">"{payment.remarks}"</p>
                )}

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(payment.date)} at {payment.time || "00:00"}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Received by: {payment.receivedBy}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-600">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    {payment.receiptNo}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(payment)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    title="View Receipt"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePayment(payment.id)}
                    className="p-2 rounded-lg border border-transparent text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Delete Payment"
                  >
                    <Trash2 className="h-4 w-4" />
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
