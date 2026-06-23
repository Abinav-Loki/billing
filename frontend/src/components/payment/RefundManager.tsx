import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select } from "../ui/select"
import { useAuth } from "../../hooks/useAuth"
import { Bill, RefundEntry, AuditLogEntry } from "../../lib/mockData"
import { Undo2, ShieldAlert, Award } from "lucide-react"
import { formatCurrency } from "../../lib/utils"

interface RefundManagerProps {
  bill: Bill
  onRefundProcessed: (refund: RefundEntry, auditLog: AuditLogEntry) => void
}

const REFUND_REASONS = [
  "Cancellation",
  "Duplicate Payment",
  "Billing Error",
  "Treatment Not Proceeded",
  "Overpayment",
  "Other"
]

const REFUND_METHODS = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card Reversal"
]

const AUTHORIZERS = [
  "Dr. A.P.",
  "Dr. XYZ",
  "Medical Director",
  "Hospital Administrator"
]

export function RefundManager({
  bill,
  onRefundProcessed
}: RefundManagerProps) {
  const { user } = useAuth()

  const [refundAmount, setRefundAmount] = React.useState<string>("")
  const [reason, setReason] = React.useState<string>("Billing Error")
  const [method, setMethod] = React.useState<string>("Cash")
  const [originalRef, setOriginalRef] = React.useState<string>("")
  const [authorizedBy, setAuthorizedBy] = React.useState<string>("")
  const [remarks, setRemarks] = React.useState<string>("")

  const [showAuthorizerList, setShowAuthorizerList] = React.useState<boolean>(false)
  const [authorizerQuery, setAuthorizerQuery] = React.useState<string>("")

  const [error, setError] = React.useState<string>("")
  const [success, setSuccess] = React.useState<boolean>(false)

  // Condition check: Total Bill <= 40,000
  const isRefundBlocked = bill.grandTotal <= 40000

  // Filter authorizers based on query
  const filteredAuthorizers = React.useMemo(() => {
    if (!authorizerQuery) return AUTHORIZERS
    return AUTHORIZERS.filter(auth =>
      auth.toLowerCase().includes(authorizerQuery.toLowerCase())
    )
  }, [authorizerQuery])

  // Sync authorizer query
  React.useEffect(() => {
    setAuthorizerQuery(authorizedBy)
  }, [authorizedBy])

  const totalPaid = bill.payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0
  const totalRefunded = bill.refunds?.reduce((sum, r) => sum + r.amount, 0) ?? 0
  const maxRefundAllowed = Math.max(0, totalPaid - totalRefunded)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (isRefundBlocked) {
      setError("Refunds are completely blocked for bills at or below ₹40,000 as per hospital policy.")
      return
    }

    const amt = parseFloat(refundAmount)
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid positive refund amount.")
      return
    }

    if (amt > maxRefundAllowed) {
      setError(`Refund amount cannot exceed the net amount already paid of ${formatCurrency(maxRefundAllowed)} (Total Paid: ${formatCurrency(totalPaid)}, Previously Refunded: ${formatCurrency(totalRefunded)}).`)
      return
    }

    if (amt > bill.grandTotal) {
      setError(`Refund amount cannot exceed the total bill amount of ${formatCurrency(bill.grandTotal)}.`)
      return
    }

    if (!reason) {
      setError("Refund Reason is mandatory.")
      return
    }

    if (!originalRef.trim()) {
      setError("Original Payment Reference is mandatory.")
      return
    }

    if (!authorizedBy.trim()) {
      setError("Authorized By is mandatory.")
      return
    }

    const refundReceiptNo = `RFND-${new Date().getFullYear()}-${String((bill.refunds?.length ?? 0) + 1 + 10).padStart(3, "0")}`

    const newRefund: RefundEntry = {
      id: `RFND-${bill.billNo}-${(bill.refunds?.length ?? 0) + 1}`,
      refundReceiptNo,
      amount: amt,
      reason,
      method: method as any,
      originalPaymentRef: originalRef.trim(),
      authorizedBy: authorizedBy.trim(),
      remarks: remarks.trim() || undefined,
      refundedAt: new Date().toISOString(),
      processedBy: user?.name || "Billing Desk"
    }

    const auditLog: AuditLogEntry = {
      id: `AUDIT-RFND-${bill.billNo}-${Date.now()}`,
      actionType: "Refund",
      createdBy: user?.name || "Billing Desk",
      createdAt: new Date().toISOString(),
      authorizedBy: authorizedBy.trim(),
      authorizationRemarks: remarks.trim() || `Refund processed: ${reason}`
    }

    onRefundProcessed(newRefund, auditLog)
    setSuccess(true)
    
    // Clear inputs
    setRefundAmount("")
    setOriginalRef("")
    setAuthorizedBy("")
    setRemarks("")
    
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Undo2 className="h-4 w-4 text-rose-600" /> Process Refund
        </h3>
      </div>
      <CardContent className="p-6">
        {isRefundBlocked ? (
          <div className="flex flex-col items-center justify-center p-6 border border-rose-250 bg-rose-50/30 rounded-2xl text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-rose-800 dark:text-rose-400 text-xs uppercase tracking-wider">Refund Blocked by Policy</h4>
            <p className="text-xs text-rose-700 font-medium max-w-md leading-normal">
              Refunds are not permitted for bills at or below ₹40,000 as per hospital policy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Refund Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Refund Amount (₹)</label>
                <Input
                  type="number"
                  step="any"
                  placeholder={`Max ₹${maxRefundAllowed}`}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  max={maxRefundAllowed}
                  required
                />
              </div>

              {/* Refund Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Refund Method</label>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  {REFUND_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </div>

              {/* Refund Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Refund Reason</label>
                <Select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {REFUND_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              {/* Original Payment Reference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Original Payment Reference</label>
                <Input
                  type="text"
                  placeholder="Enter original reference / txn ID"
                  value={originalRef}
                  onChange={(e) => setOriginalRef(e.target.value)}
                  required
                />
              </div>

              {/* Authorized By searchable dropdown */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" /> Authorized By
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search or enter authorizer name"
                    value={authorizerQuery}
                    onChange={(e) => {
                      setAuthorizerQuery(e.target.value)
                      setAuthorizedBy(e.target.value)
                    }}
                    onFocus={() => setShowAuthorizerList(true)}
                    onBlur={() => {
                      setTimeout(() => setShowAuthorizerList(false), 200)
                    }}
                    required
                  />
                  {showAuthorizerList && filteredAuthorizers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredAuthorizers.map((auth) => (
                        <button
                          key={auth}
                          type="button"
                          onMouseDown={() => setAuthorizedBy(auth)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          {auth}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Remarks / Notes</label>
              <Input
                type="text"
                placeholder="Include clinical or administrative reasons for refund"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Metadata brief */}
            <div className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900/50 p-2.5 rounded-lg flex flex-wrap gap-x-4">
              <span><strong>Processed By:</strong> {user?.name || "Billing Desk"}</span>
              <span><strong>Available to Refund:</strong> {formatCurrency(maxRefundAllowed)}</span>
            </div>

            {error && <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg font-medium">{error}</p>}
            {success && (
              <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg font-medium">
                Refund processed successfully!
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6"
              >
                Process Refund
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
