import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select } from "../ui/select"
import { useAuth } from "../../hooks/useAuth"
import { PaymentMethod, PaymentType, PaymentEntry } from "../../lib/mockData"
import {
  getMethodRequiresRef,
  getMethodRequiresBank,
  getMethodRequiresCard,
  getMethodRequiresCheque
} from "../../lib/paymentUtils"
import {
  Banknote,
  Smartphone,
  CreditCard,
  Building2,
  BadgeDollarSign,
  Hash,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign
} from "lucide-react"
import { formatCurrency } from "../../lib/utils"

interface PaymentEntryFormProps {
  balanceDue: number
  grandTotal: number
  onPaymentsAdded: (entries: Omit<PaymentEntry, "id" | "receiptNo" | "createdAt" | "createdBy">[]) => void
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cheque",
  "Bank Transfer"
]

const METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  Cash: <Banknote className="h-4 w-4" />,
  Card: <CreditCard className="h-4 w-4" />,
  UPI: <Smartphone className="h-4 w-4" />,
  "Credit Card": <CreditCard className="h-4 w-4" />,
  "Debit Card": <CreditCard className="h-4 w-4" />,
  "Net Banking": <Building2 className="h-4 w-4" />,
  Cheque: <BadgeDollarSign className="h-4 w-4" />,
  "Bank Transfer": <Hash className="h-4 w-4" />,
  Insurance: <Building2 className="h-4 w-4" />
}

export function PaymentEntryForm({
  balanceDue,
  grandTotal,
  onPaymentsAdded
}: PaymentEntryFormProps) {
  const { user } = useAuth()

  // Form states
  const hasPaidPartially = balanceDue < grandTotal && balanceDue > 0
  const [paymentType, setPaymentType] = React.useState<PaymentType>(() =>
    hasPaidPartially ? "Advance / Partial" : "Full Payment"
  )
  const [method, setMethod] = React.useState<PaymentMethod>("Cash")
  const [amount, setAmount] = React.useState<string>("")
  const [txnRef, setTxnRef] = React.useState<string>("")
  const [bankName, setBankName] = React.useState<string>("")
  const [last4Digits, setLast4Digits] = React.useState<string>("")
  const [chequeDate, setChequeDate] = React.useState<string>("")
  const [receivedBy, setReceivedBy] = React.useState<string>(user?.name || "Billing Desk")
  const [remarks, setRemarks] = React.useState<string>("")

  // Split payment list state
  const [draftSplits, setDraftSplits] = React.useState<Omit<PaymentEntry, "id" | "receiptNo" | "createdAt" | "createdBy">[]>([])
  
  // Validation errors
  const [error, setError] = React.useState<string>("")
  const [success, setSuccess] = React.useState<boolean>(false)

  // Auto-fill amounts based on payment type
  React.useEffect(() => {
    if (paymentType === "Full Payment") {
      setAmount(String(grandTotal))
    } else if (paymentType === "Final Settlement") {
      setAmount(String(balanceDue))
    } else {
      setAmount("")
    }
    setError("")
  }, [paymentType, grandTotal, balanceDue])

  const totalDraftAmount = draftSplits.reduce((sum, item) => sum + item.amount, 0)
  const remainingAllocated = balanceDue - totalDraftAmount

  const validateSingleEntry = (
    amtVal: number,
    refVal: string,
    bankVal: string,
    cardVal: string,
    chequeDateVal: string,
    recByVal: string,
    currentMethod: PaymentMethod
  ): string => {
    if (isNaN(amtVal) || amtVal <= 0) {
      return "Enter a valid positive amount."
    }

    if (totalDraftAmount + amtVal > balanceDue) {
      return `Total payment cannot exceed the remaining balance due of ${formatCurrency(balanceDue)}.`
    }

    if (getMethodRequiresRef(currentMethod) && !refVal.trim()) {
      const refLabel = currentMethod === "Cheque" ? "Cheque Number" : currentMethod === "UPI" ? "UTR / Transaction ID" : "Reference Number"
      return `${refLabel} is required.`
    }

    if (getMethodRequiresBank(currentMethod) && !bankVal.trim()) {
      return "Bank Name is required."
    }

    if (getMethodRequiresCard(currentMethod)) {
      if (!cardVal.trim() || cardVal.length !== 4 || isNaN(Number(cardVal))) {
        return "Last 4 Digits of card must be exactly 4 digits."
      }
    }

    if (getMethodRequiresCheque(currentMethod) && !chequeDateVal) {
      return "Cheque Date is required."
    }

    if (!recByVal.trim()) {
      return "Received By signature field is required."
    }

    return ""
  }

  const handleAddSplit = () => {
    setError("")
    const amtVal = parseFloat(amount)
    const validationErr = validateSingleEntry(amtVal, txnRef, bankName, last4Digits, chequeDate, receivedBy, method)
    
    if (validationErr) {
      setError(validationErr)
      return
    }

    const newSplit: Omit<PaymentEntry, "id" | "receiptNo" | "createdAt" | "createdBy"> = {
      paymentType,
      method,
      amount: amtVal,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      transactionRef: getMethodRequiresRef(method) ? txnRef.trim() : undefined,
      bankName: getMethodRequiresBank(method) ? bankName.trim() : undefined,
      last4Digits: getMethodRequiresCard(method) ? last4Digits.trim() : undefined,
      chequeDate: getMethodRequiresCheque(method) ? chequeDate : undefined,
      receivedBy: receivedBy.trim(),
      remarks: remarks.trim() || undefined
    }

    setDraftSplits([...draftSplits, newSplit])

    // Clear form inputs for next split (except common fields)
    setAmount("")
    setTxnRef("")
    setBankName("")
    setLast4Digits("")
    setChequeDate("")
    setRemarks("")
  }

  const handleRemoveSplit = (idx: number) => {
    setDraftSplits(draftSplits.filter((_, i) => i !== idx))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let finalPayments = [...draftSplits]

    // If no draft splits exist, try to submit the current form values as a single payment
    if (finalPayments.length === 0) {
      const amtVal = parseFloat(amount)
      const validationErr = validateSingleEntry(amtVal, txnRef, bankName, last4Digits, chequeDate, receivedBy, method)
      
      if (validationErr) {
        setError(validationErr)
        return
      }

      const singlePayment: Omit<PaymentEntry, "id" | "receiptNo" | "createdAt" | "createdBy"> = {
        paymentType,
        method,
        amount: amtVal,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        transactionRef: getMethodRequiresRef(method) ? txnRef.trim() : undefined,
        bankName: getMethodRequiresBank(method) ? bankName.trim() : undefined,
        last4Digits: getMethodRequiresCard(method) ? last4Digits.trim() : undefined,
        chequeDate: getMethodRequiresCheque(method) ? chequeDate : undefined,
        receivedBy: receivedBy.trim(),
        remarks: remarks.trim() || undefined
      }
      finalPayments = [singlePayment]
    }

    // Submit
    onPaymentsAdded(finalPayments)

    // Reset form states
    setDraftSplits([])
    setAmount("")
    setTxnRef("")
    setBankName("")
    setLast4Digits("")
    setChequeDate("")
    setRemarks("")
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (balanceDue <= 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-emerald-50/20 dark:bg-emerald-950/10">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Bill Fully Settled</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">No remaining balance is due for this inpatient bill.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-teal-600" /> Record Payment
        </h3>
        {draftSplits.length > 0 && (
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 dark:bg-teal-950/20 px-2 py-1 rounded">
            {draftSplits.length} split(s) staged: {formatCurrency(totalDraftAmount)}
          </span>
        )}
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Row 1: Payment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Payment Type</label>
              <Select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
              >
                <option value="Full Payment" disabled={hasPaidPartially}>
                  Full Payment ({formatCurrency(grandTotal)}) {hasPaidPartially ? "(Disabled: Paid Partially)" : ""}
                </option>
                <option value="Advance / Partial">Advance / Partial Payment</option>
                <option value="Final Settlement">Final Settlement ({formatCurrency(balanceDue)})</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Received By (Signature)</label>
              <Input
                type="text"
                placeholder="Name of receptionist"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2: Visual Payment Mode Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Payment Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                    method === m
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="mb-1">{METHOD_ICONS[m]}</span>
                  <span className="text-[10px] text-center">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fields Panel */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Amount field - always visible */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={paymentType === "Full Payment" || paymentType === "Final Settlement"}
                  required
                />
              </div>

              {/* Reference Field */}
              {getMethodRequiresRef(method) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    {method === "Cheque" ? "Cheque Number" : method === "UPI" ? "UPI UTR / Txn ID" : "Transaction Ref No."}
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter reference string"
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Bank Name Field */}
              {getMethodRequiresBank(method) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Bank Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. HDFC, SBI"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Card Last 4 Digits */}
              {getMethodRequiresCard(method) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Last 4 Digits of Card</label>
                  <Input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4321"
                    value={last4Digits}
                    onChange={(e) => setLast4Digits(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Cheque Date */}
              {getMethodRequiresCheque(method) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cheque Date</label>
                  <Input
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Remarks / Notes</label>
              <Input
                type="text"
                placeholder="Add comments about this transaction"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* Staged Split Payments List */}
          {draftSplits.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                Staged Split Payments (To be saved)
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {draftSplits.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.method}</span>
                      {item.transactionRef && (
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">
                          {item.transactionRef}
                        </span>
                      )}
                      {item.bankName && <span className="text-[10px] text-slate-500">({item.bankName})</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-emerald-600">{formatCurrency(item.amount)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSplit(idx)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 px-4 py-2.5 text-xs flex justify-between font-bold text-slate-700 dark:text-slate-300 border-t">
                <span>Remaining Balance Due after these splits:</span>
                <span className={remainingAllocated > 0 ? "text-amber-500" : "text-emerald-600"}>
                  {formatCurrency(remainingAllocated)}
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg font-medium">{error}</p>}
          {success && (
            <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg font-medium">
              Payment recorded successfully!
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddSplit}
              className="flex-1 border border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/10 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" /> Stage Split Payment
            </button>
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
            >
              {draftSplits.length > 0 ? "Record Staged Payments" : "Record Single Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
