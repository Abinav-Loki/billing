import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select } from "../ui/select"
import { useAuth } from "../../hooks/useAuth"
import { Bill, DiscountDetails, AuditLogEntry } from "../../lib/mockData"
import { Tag, Sparkles, UserCheck } from "lucide-react"
import { formatCurrency } from "../../lib/utils"

interface DiscountEditorProps {
  bill: Bill
  onSaveDiscount: (discountDetails: DiscountDetails, auditLog: AuditLogEntry) => void
}

const DISCOUNT_REASONS = [
  "Charity",
  "Financial Hardship",
  "Employee Benefit",
  "Promotional Offer",
  "Management Approval",
  "Staff Welfare",
  "Other"
]

const AUTHORIZERS = [
  "Dr. A.P.",
  "Dr. XYZ",
  "Medical Director",
  "Hospital Administrator"
]

export function DiscountEditor({
  bill,
  onSaveDiscount
}: DiscountEditorProps) {
  const { user } = useAuth()

  // Initialize state based on bill's existing discountDetails if present
  const [applyDiscount, setApplyDiscount] = React.useState<boolean>(
    bill.discountDetails?.applied ?? false
  )
  const [discountType, setDiscountType] = React.useState<"Percentage" | "Fixed">(
    bill.discountDetails?.discountType ?? "Percentage"
  )
  const [discountValue, setDiscountValue] = React.useState<string>(
    bill.discountDetails?.discountValue ? String(bill.discountDetails.discountValue) : ""
  )
  const [reason, setReason] = React.useState<string>(
    bill.discountDetails?.reason ?? "Management Approval"
  )
  const [otherRemarks, setOtherRemarks] = React.useState<string>("")
  const [authorizedBy, setAuthorizedBy] = React.useState<string>(
    bill.discountDetails?.authorizedBy ?? ""
  )
  const [authRemarks, setAuthRemarks] = React.useState<string>(
    bill.discountDetails?.authorizationRemarks ?? ""
  )

  // Search/Filter state for searchable dropdown
  const [showAuthorizerList, setShowAuthorizerList] = React.useState<boolean>(false)
  const [authorizerQuery, setAuthorizerQuery] = React.useState<string>(authorizedBy)
  
  const [error, setError] = React.useState<string>("")
  const [success, setSuccess] = React.useState<boolean>(false)

  // Filter authorizers based on query
  const filteredAuthorizers = React.useMemo(() => {
    if (!authorizerQuery) return AUTHORIZERS
    return AUTHORIZERS.filter(auth =>
      auth.toLowerCase().includes(authorizerQuery.toLowerCase())
    )
  }, [authorizerQuery])

  // Sync authorizer query with authorizedBy
  React.useEffect(() => {
    setAuthorizerQuery(authorizedBy)
  }, [authorizedBy])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!applyDiscount) {
      // Remove discount: reset to 0
      const emptyDetails: DiscountDetails = { applied: false }
      const auditLog: AuditLogEntry = {
        id: `AUDIT-DISC-${bill.billNo}-${Date.now()}`,
        actionType: "Discount",
        createdBy: user?.name || "Billing Desk",
        createdAt: new Date().toISOString(),
        authorizedBy: "N/A",
        authorizationRemarks: "Discount removed / disabled."
      }
      onSaveDiscount(emptyDetails, auditLog)
      setSuccess(true)
      return
    }

    // Validations
    const val = parseFloat(discountValue)
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid positive discount value.")
      return
    }

    let calculatedDiscountAmount = 0
    // We calculate the discount based on the initial bill subtotal or original package price
    // Wait, the grand total without any discount should be:
    // grandTotalBeforeDiscount = bill.grandTotal + (bill.discount || 0)
    const baseTotal = bill.packagePrice + bill.addOns.reduce((sum, a) => sum + a.price, 0) + (bill.roomCharges || 0) + (bill.additionalCharges || 0)

    if (discountType === "Percentage") {
      if (val > 100) {
        setError("Discount percentage cannot exceed 100%.")
        return
      }
      calculatedDiscountAmount = Math.round((baseTotal * val) / 100)
    } else {
      if (val > baseTotal) {
        setError(`Discount amount cannot exceed the total bill amount of ${formatCurrency(baseTotal)}.`)
        return
      }
      calculatedDiscountAmount = val
    }

    if (!reason) {
      setError("Discount Reason is mandatory.")
      return
    }

    if (reason === "Other" && !otherRemarks.trim()) {
      setError("Please specify remarks for 'Other' reason.")
      return
    }

    if (!authorizedBy.trim()) {
      setError("Authorized By is mandatory.")
      return
    }

    if (!authRemarks.trim()) {
      setError("Authorization Remarks are mandatory.")
      return
    }

    const finalReason = reason === "Other" ? `Other: ${otherRemarks.trim()}` : reason

    const discountDetails: DiscountDetails = {
      applied: true,
      discountType,
      discountValue: val,
      reason: finalReason,
      authorizedBy: authorizedBy.trim(),
      authorizationRemarks: authRemarks.trim(),
      authorizedAt: new Date().toISOString(),
      appliedBy: user?.name || "Billing Desk",
      appliedAt: new Date().toISOString()
    }

    const auditLog: AuditLogEntry = {
      id: `AUDIT-DISC-${bill.billNo}-${Date.now()}`,
      actionType: "Discount",
      createdBy: user?.name || "Billing Desk",
      createdAt: new Date().toISOString(),
      authorizedBy: authorizedBy.trim(),
      authorizationRemarks: authRemarks.trim()
    }

    onSaveDiscount(discountDetails, auditLog)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-teal-600" /> Apply Discount & Concession
        </h3>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="applyDiscountCheckbox"
              checked={applyDiscount}
              onChange={(e) => setApplyDiscount(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-teal-600 focus:ring-teal-500 border-slate-350 cursor-pointer"
            />
            <label htmlFor="applyDiscountCheckbox" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
              Apply Discount / Concession to this bill
            </label>
          </div>

          {applyDiscount && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/35 border rounded-xl space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Discount Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Discount Type</label>
                  <Select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "Percentage" | "Fixed")}
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </Select>
                </div>

                {/* Discount Value */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Value {discountType === "Percentage" ? "(%)" : "(₹)"}
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder={discountType === "Percentage" ? "e.g. 10" : "e.g. 5000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>

                {/* Discount Reason */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Discount Reason</label>
                  <Select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    {DISCOUNT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {reason === "Other" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Specify Reason Remarks</label>
                  <Input
                    type="text"
                    placeholder="Enter details for Other reason"
                    value={otherRemarks}
                    onChange={(e) => setOtherRemarks(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Authorization Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                {/* Authorized By Searchable Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" /> Authorized By
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
                        // Delay closing the list so clicks can be registered
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

                {/* Authorization Remarks */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Authorization Remarks</label>
                  <Input
                    type="text"
                    placeholder="e.g. Approved per medical director directive"
                    value={authRemarks}
                    onChange={(e) => setAuthRemarks(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Metadata brief */}
              <div className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900/50 p-2.5 rounded-lg flex flex-wrap gap-x-4">
                <span><strong>Applied By:</strong> {user?.name || "Billing Desk"}</span>
                <span><strong>Date & Time:</strong> {new Date().toLocaleDateString("en-IN")} at {new Date().toTimeString().slice(0,5)} (Auto-gen)</span>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg font-medium">{error}</p>}
          {success && (
            <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg font-medium">
              Discount successfully updated!
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6"
            >
              Update Discount
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
