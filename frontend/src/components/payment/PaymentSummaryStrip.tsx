import * as React from "react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { formatCurrency } from "../../lib/utils"

interface PaymentSummaryStripProps {
  grandTotal: number
  totalPaid: number
  balanceDue: number
  status: "Paid" | "Pending" | "Partially Paid"
}

export function PaymentSummaryStrip({
  grandTotal,
  totalPaid,
  balanceDue,
  status
}: PaymentSummaryStripProps) {
  const paidPercent = grandTotal > 0 ? Math.min(100, Math.round((totalPaid / grandTotal) * 100)) : 0

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Payment Summary</span>
        </div>
        <Badge variant={status === "Paid" ? "success" : status === "Partially Paid" ? "info" : "warning"}>
          {status}
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        <div className="p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Grand Total</p>
          <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{formatCurrency(grandTotal)}</p>
        </div>
        <div className="p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amount Paid</p>
          <p className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Balance Due</p>
          <p className={`text-2xl font-extrabold ${balanceDue > 0 ? "text-amber-500" : "text-emerald-600"}`}>
            {formatCurrency(balanceDue)}
          </p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold">Payment Progress</span>
          <span className="font-bold text-teal-600 dark:text-teal-400">{paidPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${paidPercent}%`,
              background: paidPercent >= 100
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #f59e0b, #fbbf24)",
            }}
          />
        </div>
      </div>
    </Card>
  )
}
