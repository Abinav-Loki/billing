import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, Bill, PaymentEntry, DiscountDetails, RefundEntry, AuditLogEntry } from "../../lib/mockData"
import { PACKAGE_MASTER } from "../../lib/billingMaster"
import { generateBillPDF } from "../../lib/pdfExport"
import { useAuth } from "../../hooks/useAuth"
import { generatePaymentId, generateReceiptNo } from "../../lib/paymentUtils"

// New components
import { PaymentSummaryStrip } from "../../components/payment/PaymentSummaryStrip"
import { PaymentEntryForm } from "../../components/payment/PaymentEntryForm"
import { PaymentTimeline } from "../../components/payment/PaymentTimeline"
import { PaymentReceiptModal } from "../../components/payment/PaymentReceiptModal"
import { DiscountEditor } from "../../components/payment/DiscountEditor"
import { RefundManager } from "../../components/payment/RefundManager"
import { RefundTimeline } from "../../components/payment/RefundTimeline"
import { AuditLogViewer } from "../../components/payment/AuditLogViewer"

import {
  ArrowLeft,
  Printer,
  AlertCircle,
  Building2,
  Download,
  Plus,
  Trash,
  User,
} from "lucide-react"

const SERVICE_CATEGORIES = [
  "Consultation",
  "Laboratory",
  "Scan",
  "Procedure",
  "Cryostorage",
  "Consumables",
  "Pharmacy",
  "Room Stay",
  "Nursing",
  "Anesthesia",
  "ICU Charges",
  "OT Charges",
  "Physiotherapy",
  "Dietitian",
  "Medical Records",
  "Registration",
  "Ambulance",
  "Counseling",
  "Surgical Consumables",
  "Donor Programme Services",
  "Post-OP Care",
  "Medications Administered",
  "Diagnostics",
  "Other Services"
]


export function BillDetailPage() {
  const { billNo } = useParams<{ billNo: string }>()
  const navigate = useNavigate()

  const [bill, setBill] = React.useState<Bill | undefined>(() =>
    mockBills.find((b) => b.billNo === billNo)
  )

  const { user } = useAuth()
  const [selectedReceipt, setSelectedReceipt] = React.useState<PaymentEntry | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("print") === "true" && bill) {
      const t = setTimeout(() => window.print(), 500)
      return () => clearTimeout(t)
    }
  }, [bill])

  if (!bill) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Invoice Not Found</h2>
        <p className="text-sm text-muted-foreground">The bill you are looking for does not exist in the system.</p>
        <Button onClick={() => navigate("/bills")}>Back to Bills</Button>
      </div>
    )
  }

  const pkg      = PACKAGE_MASTER.find((p) => p.name === bill.packageName)
  const payments     = bill.payments ?? []
  const refunds      = bill.refunds ?? []
  const totalRefunded = refunds.reduce((s, r) => s + r.amount, 0)
  const totalPaid    = Math.max(0, payments.reduce((s, p) => s + p.amount, 0) - totalRefunded)
  const balanceDue   = Math.max(0, bill.grandTotal - totalPaid)
  const paidPercent  = bill.grandTotal > 0 ? Math.min(100, Math.round((totalPaid / bill.grandTotal) * 100)) : 0
  const payStatus: Bill["status"] = totalPaid <= 0 ? "Pending" : balanceDue <= 0 ? "Paid" : "Partially Paid"
  const isLocked = payStatus === "Paid" && !bill.isUnlockedByAdmin
  const isCustom = bill.packageName === "Custom Bill"

  const persist = (updated: Bill) => {
    const idx = mockBills.findIndex((b) => b.billNo === billNo)
    if (idx !== -1) mockBills[idx] = updated
    setBill(updated)
  }

  // Bill Editing States
  const [isEditing, setIsEditing] = React.useState(false)
  const [editServices, setEditServices] = React.useState<any[]>([])
  const [editConsultants, setEditConsultants] = React.useState<any[]>([])
  const [editDiscount, setEditDiscount] = React.useState(0)
  const [editDiscountNote, setEditDiscountNote] = React.useState("")
  const [editNotes, setEditNotes] = React.useState("")
  const [editDoctorOption, setEditDoctorOption] = React.useState("")
  const [editReason, setEditReason] = React.useState("")
  const [editPackagePrice, setEditPackagePrice] = React.useState(0)
  const [editAdditionalCharges, setEditAdditionalCharges] = React.useState(0)

  React.useEffect(() => {
    if (isEditing && bill) {
      setEditServices(bill.customLineItems || [])
      setEditConsultants(bill.consultantCharges || [])
      setEditDiscount(bill.discount || 0)
      setEditDiscountNote(bill.discountDetails?.reason || "")
      setEditNotes(bill.billingNotes || "")
      setEditDoctorOption(bill.doctorName)
      setEditPackagePrice(bill.packagePrice || 0)
      setEditAdditionalCharges(bill.additionalCharges || 0)
      setEditReason("")
    }
  }, [isEditing, bill])

  const handleEditAddService = () => {
    setEditServices([
      ...editServices,
      { category: "Consultation", name: "", description: "", qty: 1, price: 0, discount: 0, gstRate: 0, total: 0 }
    ])
  }

  const handleEditRemoveService = (idx: number) => {
    const updated = [...editServices]
    updated.splice(idx, 1)
    setEditServices(updated)
  }

  const handleEditDuplicateService = (idx: number) => {
    const row = editServices[idx]
    const updated = [...editServices]
    updated.splice(idx + 1, 0, { ...row })
    setEditServices(updated)
  }

  const handleEditMoveService = (idx: number, direction: "up" | "down") => {
    const updated = [...editServices]
    if (direction === "up" && idx > 0) {
      const temp = updated[idx]
      updated[idx] = updated[idx - 1]
      updated[idx - 1] = temp
    } else if (direction === "down" && idx < editServices.length - 1) {
      const temp = updated[idx]
      updated[idx] = updated[idx + 1]
      updated[idx + 1] = temp
    }
    setEditServices(updated)
  }

  const handleEditUpdateService = (idx: number, field: string, value: any) => {
    const updated = [...editServices]
    const row = { ...updated[idx], [field]: value }
    const qty = row.qty >= 1 ? row.qty : 1
    const price = row.price >= 0 ? row.price : 0
    const rowDiscount = row.discount >= 0 ? row.discount : 0
    const base = qty * price
    const afterDiscount = Math.max(0, base - rowDiscount)
    const gstAmount = afterDiscount * (row.gstRate / 100)
    row.total = Math.max(0, afterDiscount + gstAmount)
    updated[idx] = row
    setEditServices(updated)
  }

  const handleEditAddConsultant = () => {
    setEditConsultants([
      ...editConsultants,
      { doctorName: "Dr. Anjali Mehta", type: "Initial Consultation", amount: 500, remarks: "" }
    ])
  }

  const handleEditRemoveConsultant = (idx: number) => {
    const updated = [...editConsultants]
    updated.splice(idx, 1)
    setEditConsultants(updated)
  }

  const handleEditUpdateConsultant = (idx: number, field: string, value: any) => {
    const updated = [...editConsultants]
    updated[idx] = { ...updated[idx], [field]: value }
    setEditConsultants(updated)
  }

  const handleSaveBillEdits = () => {
    if (!editReason.trim()) {
      alert("Please enter a reason for editing the bill.")
      return
    }

    const isCustom = bill.packageName === "Custom Bill"

    if (isCustom) {
      if (editServices.length === 0) {
        alert("Please add at least one service row.")
        return
      }
      for (let i = 0; i < editServices.length; i++) {
        const row = editServices[i]
        if (!row.category || !row.name.trim() || row.qty <= 0 || row.price < 0) {
          alert(`Row ${i + 1}: Please ensure all mandatory fields are valid.`)
          return
        }
      }
    }

    const subtotal = isCustom
      ? editServices.reduce((sum, item) => sum + item.qty * item.price, 0)
      : (editPackagePrice + (bill.addOns ?? []).reduce((s, a) => s + a.price, 0) + (bill.roomCharges || 0))

    const totalConsultantCharges = editConsultants.reduce((sum, item) => sum + item.amount, 0)
    const itemDiscountTotal = isCustom
      ? editServices.reduce((sum, item) => sum + item.discount, 0)
      : 0
    const itemGstTotal = isCustom
      ? editServices.reduce((sum, item) => {
          const base = item.qty * item.price
          const discounted = Math.max(0, base - item.discount)
          return sum + (discounted * (item.gstRate / 100))
        }, 0)
      : 0

    const finalDiscount = itemDiscountTotal + editDiscount
    const finalGst = itemGstTotal
    const grandTotal = Math.max(0, subtotal + totalConsultantCharges + editAdditionalCharges - finalDiscount + finalGst)

    const updatedPaid = bill.amountPaid ?? 0
    const updatedBalance = Math.max(0, grandTotal - updatedPaid)
    const updatedStatus: Bill["status"] = updatedPaid <= 0
      ? "Pending"
      : updatedBalance <= 0
      ? "Paid"
      : "Partially Paid"

    const oldValStr = `Grand Total: ${formatCurrency(bill.grandTotal)}, Subtotal: ${formatCurrency(bill.packageName === "Custom Bill" && bill.customLineItems ? bill.customLineItems.reduce((s, r) => s + r.qty*r.price, 0) : bill.packagePrice)}, Additional Charges: ${formatCurrency(bill.additionalCharges || 0)}, Consultants: ${bill.consultantCharges?.length || 0}`
    const newValStr = `Grand Total: ${formatCurrency(grandTotal)}, Subtotal: ${formatCurrency(subtotal)}, Additional Charges: ${formatCurrency(editAdditionalCharges)}, Consultants: ${editConsultants.length}`

    const newAuditLog: AuditLogEntry = {
      id: `AUDIT-EDIT-${Date.now()}`,
      actionType: "Edit",
      createdBy: user?.name || "Billing Desk",
      createdAt: new Date().toISOString(),
      reason: editReason,
      oldValue: oldValStr,
      newValue: newValStr
    }

    const updatedBill: Bill = {
      ...bill,
      packagePrice: isCustom ? 0 : editPackagePrice,
      additionalCharges: editAdditionalCharges,
      discount: finalDiscount,
      taxAmount: finalGst,
      grandTotal,
      status: updatedStatus,
      paymentBalance: updatedBalance,
      billingNotes: editNotes,
      doctorName: editDoctorOption,
      customLineItems: isCustom ? editServices : undefined,
      selectedLineItems: isCustom
        ? editServices.map((cs, idx) => ({
            id: `CS-${idx + 1}`,
            name: cs.name,
            price: cs.price,
            category: cs.category,
            qty: cs.qty
          }))
        : undefined,
      consultantCharges: editConsultants,
      totalConsultantCharges: totalConsultantCharges,
      auditLogs: [...(bill.auditLogs ?? []), newAuditLog]
    }

    persist(updatedBill)
    setIsEditing(false)
  }

  const handleSaveDiscount = (discountDetails: DiscountDetails, auditLog: AuditLogEntry) => {
    const subtotal = bill.packagePrice + bill.addOns.reduce((s, a) => s + a.price, 0) + (bill.roomCharges || 0) + (bill.additionalCharges || 0)
    let discountAmount = 0
    if (discountDetails.applied && discountDetails.discountType && discountDetails.discountValue) {
      if (discountDetails.discountType === "Percentage") {
        discountAmount = Math.round((subtotal * discountDetails.discountValue) / 100)
      } else {
        discountAmount = discountDetails.discountValue
      }
    }

    const updatedGrandTotal = Math.max(0, subtotal + (bill.taxAmount || 0) - discountAmount)
    const currentPayments = bill.payments ?? []
    const basePaid = currentPayments.reduce((sum, p) => sum + p.amount, 0)
    const currentRefunded = (bill.refunds ?? []).reduce((sum, r) => sum + r.amount, 0)
    const updatedPaid = Math.max(0, basePaid - currentRefunded)
    const updatedBalance = Math.max(0, updatedGrandTotal - updatedPaid)
    const updatedStatus: Bill["status"] =
      updatedPaid <= 0 ? "Pending" : updatedBalance <= 0 ? "Paid" : "Partially Paid"

    const updatedBill: Bill = {
      ...bill,
      discount: discountAmount,
      grandTotal: updatedGrandTotal,
      discountDetails,
      amountPaid: updatedPaid,
      paymentBalance: updatedBalance,
      status: updatedStatus,
      auditLogs: [...(bill.auditLogs ?? []), auditLog]
    }

    persist(updatedBill)
  }

  const handleRefundProcessed = (refund: RefundEntry, auditLog: AuditLogEntry) => {
    const currentPayments = bill.payments ?? []
    const currentRefunds = [...(bill.refunds ?? []), refund]
    
    const basePaid = currentPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalRefunded = currentRefunds.reduce((sum, r) => sum + r.amount, 0)
    const updatedPaid = Math.max(0, basePaid - totalRefunded)
    const updatedBalance = Math.max(0, bill.grandTotal - updatedPaid)
    const updatedStatus: Bill["status"] =
      updatedPaid <= 0 ? "Pending" : updatedBalance <= 0 ? "Paid" : "Partially Paid"

    const updatedBill: Bill = {
      ...bill,
      refunds: currentRefunds,
      amountPaid: updatedPaid,
      paymentBalance: updatedBalance,
      status: updatedStatus,
      auditLogs: [...(bill.auditLogs ?? []), auditLog]
    }

    persist(updatedBill)
  }

  const handlePaymentsAdded = (
    newPaymentsData: Omit<PaymentEntry, "id" | "receiptNo" | "createdAt" | "createdBy">[]
  ) => {
    const currentPayments = bill.payments ?? []
    
    const processedPayments: PaymentEntry[] = newPaymentsData.map((data, index) => {
      const paymentId = generatePaymentId(bill.billNo, currentPayments.length + index)
      const receiptNo = generateReceiptNo(mockBills)
      const nowStr = new Date().toISOString()
      
      return {
        ...data,
        id: paymentId,
        receiptNo,
        createdBy: user?.name || "Billing Desk",
        createdAt: nowStr
      }
    })

    const updatedPayments = [...currentPayments, ...processedPayments]
    const basePaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
    const currentRefunded = (bill.refunds ?? []).reduce((sum, r) => sum + r.amount, 0)
    const updatedPaid = Math.max(0, basePaid - currentRefunded)
    const updatedBalance = Math.max(0, bill.grandTotal - updatedPaid)
    const updatedStatus: Bill["status"] =
      updatedPaid <= 0 ? "Pending" : updatedBalance <= 0 ? "Paid" : "Partially Paid"

    const updatedBill: Bill = {
      ...bill,
      payments: updatedPayments,
      amountPaid: updatedPaid,
      paymentBalance: updatedBalance,
      status: updatedStatus
    }

    persist(updatedBill)

    if (processedPayments.length > 0) {
      setSelectedReceipt(processedPayments[0])
      setIsReceiptModalOpen(true)
    }
  }

  const handleDeletePayment = (paymentId: string) => {
    const currentPayments = bill.payments ?? []
    const updatedPayments = currentPayments.filter((p) => p.id !== paymentId)
    const basePaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
    const currentRefunded = (bill.refunds ?? []).reduce((sum, r) => sum + r.amount, 0)
    const updatedPaid = Math.max(0, basePaid - currentRefunded)
    const updatedBalance = Math.max(0, bill.grandTotal - updatedPaid)
    const updatedStatus: Bill["status"] =
      updatedPaid <= 0 ? "Pending" : updatedBalance <= 0 ? "Paid" : "Partially Paid"

    const updatedBill: Bill = {
      ...bill,
      payments: updatedPayments,
      amountPaid: updatedPaid,
      paymentBalance: updatedBalance,
      status: updatedStatus
    }

    persist(updatedBill)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{bill.billNo}</h1>
              <Badge variant={payStatus === "Paid" ? "success" : payStatus === "Partially Paid" ? "info" : "warning"}>
                {payStatus}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{bill.patientName} · {formatDate(bill.date)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isLocked && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              {isEditing ? "Cancel Edit" : "Edit Bill"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => generateBillPDF(bill)} className="gap-1.5 text-xs text-teal-600 border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/20">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
      </div>

      {/* Lock alert / Unlock button banner */}
      {payStatus === "Paid" && !bill.isUnlockedByAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/30 p-4 rounded-xl flex items-center justify-between text-xs text-amber-805 dark:text-amber-300 max-w-3xl mx-auto print:hidden">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>This bill is locked because it is fully paid. Edits are disabled. Only Admin can unlock.</span>
          </div>
          {user?.role === "Admin" && (
            <Button
              onClick={() => {
                if (window.confirm("Are you sure you want to unlock this bill for administrative edits?")) {
                  const updatedBill: Bill = {
                    ...bill,
                    isUnlockedByAdmin: true,
                    auditLogs: [
                      ...(bill.auditLogs ?? []),
                      {
                        id: `AUDIT-UNLK-${Date.now()}`,
                        actionType: "Unlock",
                        createdBy: user.name,
                        createdAt: new Date().toISOString(),
                        reason: "Unlocked paid bill for administrative edits"
                      }
                    ]
                  }
                  persist(updatedBill)
                }
              }}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
            >
              Unlock Bill
            </Button>
          )}
        </div>
      )}

      {/* Admin Unlock Success Banner */}
      {bill.isUnlockedByAdmin && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-805 dark:text-emerald-300 max-w-3xl mx-auto print:hidden">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>This paid bill has been unlocked by an Administrator. You may now perform edits.</span>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-3xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>✏️</span> Edit Bill Details ({bill.billNo})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" disabled={!editReason.trim()} onClick={handleSaveBillEdits} className="bg-primary text-white font-bold">Save Changes</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treating Consultant</label>
              <input
                type="text"
                list="doctors-list"
                value={editDoctorOption}
                onChange={e => setEditDoctorOption(e.target.value)}
                className="w-full h-9 border rounded px-2.5 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-primary"
              />
              <datalist id="doctors-list">
                <option value="Dr. Anjali Mehta" />
                <option value="Dr. S. K. Sen" />
                <option value="Dr. Priya Naidu" />
                <option value="Dr. AP" />
              </datalist>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Additional Charges (₹)</label>
              <input
                type="number"
                min={0}
                value={editAdditionalCharges}
                onChange={e => setEditAdditionalCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-9 border rounded px-2.5 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-primary font-mono text-right"
              />
            </div>
            {!isCustom ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Package Base Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editPackagePrice}
                  onChange={e => setEditPackagePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full h-9 border rounded px-2.5 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-primary font-mono text-right"
                />
              </div>
            ) : <div />}
          </div>

          {/* If Custom Bill, show Services Editor */}
          {isCustom && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Custom Services Builder</span>
                <Button size="sm" onClick={handleEditAddService} className="text-xs h-8 gap-1.5 bg-primary text-white">
                  <Plus className="h-3.5 w-3.5" /> Add Service
                </Button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {editServices.map((row, idx) => (
                  <div key={idx} className="p-3.5 border rounded-lg bg-slate-50/30 dark:bg-slate-900/30 space-y-2.5 relative">
                    <div className="flex justify-between items-center border-b pb-1.5">
                      <span className="text-[10px] font-extrabold text-primary uppercase">Row #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleEditMoveService(idx, "up")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] font-bold">▲</button>
                        <button type="button" onClick={() => handleEditMoveService(idx, "down")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] font-bold">▼</button>
                        <button type="button" onClick={() => handleEditDuplicateService(idx)} className="p-1 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20 rounded text-[10px] font-bold">⧉</button>
                        <button
                          type="button"
                          onClick={() => handleEditRemoveService(idx)}
                          className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/25 rounded hover:bg-rose-100 transition-colors"
                          title="Delete Row"
                        >
                          <Trash className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                        <select
                          value={row.category}
                          onChange={e => handleEditUpdateService(idx, "category", e.target.value)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200"
                        >
                          {SERVICE_CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Service Name</label>
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => handleEditUpdateService(idx, "name", e.target.value)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Description / Remarks</label>
                        <input
                          type="text"
                          value={row.description || ""}
                          onChange={e => handleEditUpdateService(idx, "description", e.target.value)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Qty</label>
                        <input
                          type="number"
                          value={row.qty}
                          onChange={e => handleEditUpdateService(idx, "qty", parseInt(e.target.value) || 1)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Price</label>
                        <input
                          type="number"
                          value={row.price}
                          onChange={e => handleEditUpdateService(idx, "price", parseFloat(e.target.value) || 0)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200 text-right font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center border-t pt-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Row Discount (₹)</label>
                        <input
                          type="number"
                          value={row.discount}
                          onChange={e => handleEditUpdateService(idx, "discount", parseFloat(e.target.value) || 0)}
                          className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200 text-right font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">GST Rate (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="0"
                          value={row.gstRate}
                          onChange={e => handleEditUpdateService(idx, "gstRate", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                          className="w-full h-8 border rounded px-2 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 dark:text-slate-100 font-mono text-center font-bold"
                        />
                      </div>
                      <div className="text-right pt-2 font-bold font-mono text-slate-800 dark:text-slate-200 text-xs">
                        Total: {formatCurrency(row.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultant Charges Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Doctor Consultant Charges</span>
              <Button
                type="button"
                size="sm"
                onClick={handleEditAddConsultant}
                className="text-xs h-8 gap-1.5 border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100"
              >
                <Plus className="h-3.5 w-3.5" /> Add Consultant
              </Button>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {editConsultants.map((charge, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center p-3 border rounded-lg bg-slate-50/30 dark:bg-slate-900/30">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Doctor Name</label>
                    <input
                      type="text"
                      list="doctors-list"
                      value={charge.doctorName}
                      onChange={e => handleEditUpdateConsultant(idx, "doctorName", e.target.value)}
                      className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Consultation Type</label>
                    <select
                      value={charge.type}
                      onChange={e => handleEditUpdateConsultant(idx, "type", e.target.value)}
                      className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200"
                    >
                      <option value="Initial Consultation">Initial Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Procedure Consultation">Procedure Consultation</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Online">Online</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Amount (₹)</label>
                    <input
                      type="number"
                      value={charge.amount}
                      onChange={e => handleEditUpdateConsultant(idx, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full h-8 border rounded px-2 text-xs bg-transparent text-slate-750 dark:text-slate-200 text-right font-mono"
                    />
                  </div>
                  <div className="flex gap-2 items-center pt-3.5">
                    <input
                      type="text"
                      placeholder="Remarks..."
                      value={charge.remarks || ""}
                      onChange={e => handleEditUpdateConsultant(idx, "remarks", e.target.value)}
                      className="flex-grow h-8 border rounded px-2 text-xs bg-transparent text-slate-755 dark:text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleEditRemoveConsultant(idx)}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {editConsultants.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-2">No doctor consultation fees.</p>
              )}
            </div>
          </div>

          {/* Discount and notes */}
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Discount / Concession (₹)</label>
              <input
                type="number"
                min={0}
                value={editDiscount}
                onChange={e => setEditDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-9 border rounded px-2.5 text-xs bg-transparent focus:ring-1 focus:ring-primary font-mono text-slate-750 dark:text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill Notes / Remarks</label>
              <input
                type="text"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                className="w-full h-9 border rounded px-2.5 text-xs bg-transparent focus:ring-1 focus:ring-primary text-slate-750 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Reason for Editing (Mandatory for audit logs) */}
          <div className="border-t pt-4 space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-350 uppercase block">
              Reason for Editing (Mandatory for Audit Trail) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Adjusted Laboratory and Consumable row prices, added emergency doctor charge..."
              value={editReason}
              onChange={e => setEditReason(e.target.value)}
              className="w-full h-10 border rounded px-3 text-xs bg-transparent border-primary/45 focus:ring-1 focus:ring-primary text-slate-800 dark:text-slate-100 font-semibold"
            />
          </div>

          <div className="border-t pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button
              disabled={!editReason.trim()}
              onClick={handleSaveBillEdits}
              className="bg-primary text-white font-bold gap-1.5"
            >
              Save and Commit Edits
            </Button>
          </div>
        </div>
      ) : (
        <div
          id="printable-invoice"
          className="a4-invoice-sheet p-8 relative print:p-0 print:border-none print:shadow-none print:rounded-none"
        >
        <div className="flex justify-between items-start p-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/logo.jpeg" alt="ASCAS Logo" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight leading-none">
                  ASCAS FERTILITY & WOMEN'S CENTER
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-500">14,Arunachalam Rd, next to VB world, Saligramam, Chennai, Tamil Nadu 600093</p>
            <p className="text-sm text-slate-500 font-mono">Tel: +91-9345293609</p>
            <p className="text-sm text-slate-500">accumedspecialityclinic@gmail.com</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-primary text-white text-xs font-extrabold px-4 py-1.5 rounded-lg">
              INPATIENT BILL
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-2">Bill No: {bill.billNo}</p>
            <p className="text-[11px] text-slate-500">Date: {formatDate(bill.date)}</p>
            <div className="mt-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                payStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                payStatus === "Partially Paid" ? "bg-sky-100 text-sky-700" :
                "bg-amber-100 text-amber-700"
              }`}>
                {payStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <div className="space-y-1 text-sm">
            <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Billed To</p>
            <p className="text-base font-extrabold text-slate-800 dark:text-slate-100">{bill.patientName}</p>
            <p className="text-slate-500 font-mono">UHID: {bill.uhid}</p>
            {bill.roomNo && <p className="text-slate-500">Room: {bill.roomNo}</p>}
            {bill.categoryName && <p className="text-slate-500">Category: {bill.categoryName}</p>}
            {bill.packageName && (
              <p className="text-slate-500">
                <span className="font-semibold text-slate-650">Package:</span> {bill.packageName}
              </p>
            )}
          </div>
          <div className="text-right space-y-1 text-sm">
            <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Treating Consultant</p>
            <p className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {bill.doctorName.split(" (")[0]}
            </p>
            <p className="text-slate-500">{bill.doctorName.split(" (")[1]?.replace(")", "")}</p>
            <p className="text-teal-700 dark:text-teal-400 font-semibold mt-1">
              Billing Method: {bill.billingMethod === "item_wise" ? "Item-wise Billing" : "Full Payment Package"}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left pb-2 font-bold text-slate-600 dark:text-slate-400">#</th>
                <th className="text-left pb-2 font-bold text-slate-600 dark:text-slate-400">Description</th>
                <th className="text-center pb-2 font-bold text-slate-600 dark:text-slate-400">Qty</th>
                <th className="text-right pb-2 font-bold text-slate-600 dark:text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isCustom ? (
                bill.customLineItems?.map((item, idx) => (
                  <tr key={`cs-${idx}`}>
                    <td className="py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="py-3">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.category} · {item.description || "Custom Service"}</p>
                      {item.discount > 0 && (
                        <span className="inline-block text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded mt-1 mr-2">
                          Row Discount: -{formatCurrency(item.discount)}
                        </span>
                      )}
                      {item.gstRate > 0 && (
                        <span className="inline-block text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded mt-1">
                          GST: {item.gstRate}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">{item.qty}</td>
                    <td className="py-3 text-right font-bold text-slate-850 dark:text-slate-100">{formatCurrency(item.price * item.qty)}</td>
                  </tr>
                ))
              ) : (
                <>
                  {bill.billingMethod === "item_wise" && bill.selectedLineItems && bill.selectedLineItems.length > 0 ? (
                    bill.selectedLineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-3 text-muted-foreground">{idx + 1}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Itemized Procedure · {item.category}</p>
                        </td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right font-bold">{formatCurrency(item.price * item.qty)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 text-muted-foreground">1</td>
                      <td className="py-3">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{bill.packageName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Treatment Package — ASCAS (Full Payment)</p>
                      </td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right font-bold">{formatCurrency(bill.packagePrice)}</td>
                    </tr>
                  )}
                  {bill.roomCharges > 0 && (
                    <tr>
                      <td className="py-3 text-muted-foreground">{bill.billingMethod === "item_wise" && bill.selectedLineItems ? bill.selectedLineItems.length + 1 : 2}</td>
                      <td className="py-3"><p className="font-medium text-slate-700 dark:text-slate-200">Room / Ward Bed Charges</p></td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right">{formatCurrency(bill.roomCharges)}</td>
                    </tr>
                  )}
                  {bill.addOns.map((addon, i) => {
                    const baseIdx = bill.billingMethod === "item_wise" && bill.selectedLineItems ? bill.selectedLineItems.length + 1 : 2
                    const offset  = bill.roomCharges > 0 ? 1 : 0
                    return (
                      <tr key={i}>
                        <td className="py-3 text-muted-foreground">{i + baseIdx + offset}</td>
                        <td className="py-3">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{addon.name}</p>
                          <p className="text-[10px] text-muted-foreground">Add-on procedure</p>
                        </td>
                        <td className="py-3 text-center">1</td>
                        <td className="py-3 text-right">{formatCurrency(addon.price)}</td>
                      </tr>
                    )
                  })}
                  {bill.additionalCharges > 0 && (
                    <tr>
                      <td className="py-3 text-muted-foreground">
                        {(bill.billingMethod === "item_wise" && bill.selectedLineItems ? bill.selectedLineItems.length : 1) +
                          (bill.roomCharges > 0 ? 1 : 0) +
                          (bill.addOns ? bill.addOns.length : 0) + 1}
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-slate-700 dark:text-slate-200">Additional Charges</p>
                        <p className="text-[10px] text-muted-foreground">Miscellaneous Consumables</p>
                      </td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right">{formatCurrency(bill.additionalCharges)}</td>
                    </tr>
                  )}
                </>
              )}

              {/* Consultant Charges rows */}
              {bill.consultantCharges && bill.consultantCharges.length > 0 && (
                <tr>
                  <td colSpan={4} className="pt-4 pb-1 border-b text-xs font-bold text-slate-400 uppercase tracking-wider text-left bg-slate-50/50 dark:bg-slate-900/10 px-2">
                    Consultant Consultation Fees
                  </td>
                </tr>
              )}
              {bill.consultantCharges?.map((charge, idx) => {
                const baseIdx = isCustom
                  ? (bill.customLineItems?.length || 0) + 1
                  : (bill.billingMethod === "item_wise" && bill.selectedLineItems ? bill.selectedLineItems.length + 1 : 2)
                const offset = isCustom ? 0 : ((bill.roomCharges > 0 ? 1 : 0) + (bill.addOns ? bill.addOns.length : 0) + (bill.additionalCharges > 0 ? 1 : 0))
                return (
                  <tr key={`consult-${idx}`}>
                    <td className="py-3 text-muted-foreground">{idx + baseIdx + offset}</td>
                    <td className="py-3 text-left">
                      <p className="font-bold text-teal-800 dark:text-teal-400">{charge.doctorName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {charge.type} {charge.remarks ? `· ${charge.remarks}` : ""}
                      </p>
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right font-bold text-teal-850 dark:text-teal-300">
                      {formatCurrency(charge.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!isCustom && pkg && (pkg.freeMonitoringList?.length || pkg.policiesList?.length) && (
            <div className="mt-6 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.freeMonitoringList && pkg.freeMonitoringList.length > 0 && (
                  <div className="border border-blue-200 bg-blue-50/30 dark:bg-blue-950/10 p-3 rounded-xl">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                      <span>★</span> Free Monitoring
                    </p>
                    <ul className="list-none space-y-1">
                      {pkg.freeMonitoringList.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <span className="mt-0.5 shrink-0 h-3.5 w-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">★</span>
                          <span className="leading-snug">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg?.policiesList && pkg.policiesList.length > 0 && (
                  <div className="border border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                      <span>ℹ</span> Storage Policy
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      {pkg.policiesList.map((pol, i) => (
                        <li key={i} className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{pol}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm border-t-2 border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    isCustom && bill.customLineItems
                      ? bill.customLineItems.reduce((sum, item) => sum + item.qty * item.price, 0)
                      : (bill.packagePrice + bill.addOns.reduce((s, a) => s + a.price, 0) + bill.roomCharges)
                  )}
                </span>
              </div>
              {bill.additionalCharges && bill.additionalCharges > 0 ? (
                <div className="flex justify-between text-slate-500">
                  <span>Additional Charges</span>
                  <span>{formatCurrency(bill.additionalCharges)}</span>
                </div>
              ) : null}
              {bill.totalConsultantCharges && bill.totalConsultantCharges > 0 ? (
                <div className="flex justify-between text-slate-500">
                  <span>Consultant Charges</span>
                  <span>{formatCurrency(bill.totalConsultantCharges)}</span>
                </div>
              ) : null}
              {bill.taxAmount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>GST / Tax</span>
                  <span>{formatCurrency(bill.taxAmount)}</span>
                </div>
              )}
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount / Concession</span>
                  <span>-{formatCurrency(bill.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold text-primary border-t pt-2">
                <span>GRAND TOTAL</span>
                <span>{formatCurrency(bill.grandTotal)}</span>
              </div>
            </div>
          </div>

          {bill.discountDetails?.applied && (
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-800 dark:text-emerald-350 mt-4">
              <p className="font-bold uppercase text-[11px] tracking-wide text-emerald-700 dark:text-emerald-400 mb-1">Discount Authorization Details:</p>
              <div className="grid grid-cols-2 gap-2 mt-1.5 text-xs leading-relaxed">
                <p><strong>Authorized By:</strong> {bill.discountDetails.authorizedBy}</p>
                <p><strong>Reason / Category:</strong> {bill.discountDetails.reason}</p>
                <p className="col-span-2"><strong>Remarks:</strong> {bill.discountDetails.authorizationRemarks}</p>
                <p className="col-span-2 text-xs text-emerald-600 dark:text-emerald-400/80">Authorized on {new Date(bill.discountDetails.authorizedAt || "").toLocaleDateString("en-IN")} at {new Date(bill.discountDetails.authorizedAt || "").toTimeString().slice(0,5)}</p>
              </div>
            </div>
          )}

          <div className="mt-6 border-t pt-4 text-xs text-slate-500 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200">
            <p className="font-bold uppercase text-[11px] tracking-wide text-slate-600 mb-1">Clinic Billing Rule:</p>
            <p className="italic leading-normal">
              Consultation and monitoring scans included in OPU / egg collection packages and FET packages should not be billed separately. Room stay is optional unless specifically advised.
            </p>
          </div>

          {bill.billingNotes && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm text-slate-600 dark:text-slate-400 mt-4">
              <p className="font-bold uppercase text-[11px] text-muted-foreground mb-1">Notes</p>
              {bill.billingNotes}
            </div>
          )}

          <div className="pt-10 grid grid-cols-2 gap-16 text-sm">
            {["Patient / Guardian Signature", "Authorized Reception / Billing Desk"].map((label) => (
              <div key={label} className="text-center space-y-6">
                <div className="h-10" />
                <div className="border-t border-dashed border-slate-300 dark:border-slate-700" />
                <p className="text-muted-foreground font-medium text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-[11px] text-muted-foreground border-t pt-3 leading-relaxed">
            This is a computer-generated invoice. Valid subject to discharge reconciliation. · ASCAS Fertility & Women's
            Center · {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>
      )}

      <div className="max-w-3xl mx-auto print:hidden space-y-6">
        {/* Discount Editor */}
        {payStatus !== "Paid" && (
          <DiscountEditor
            bill={bill}
            onSaveDiscount={handleSaveDiscount}
          />
        )}

        {/* Payment Summary Strip */}
        <PaymentSummaryStrip
          grandTotal={bill.grandTotal}
          totalPaid={totalPaid}
          balanceDue={balanceDue}
          status={payStatus}
        />

        {/* Payment Entry Form */}
        <PaymentEntryForm
          balanceDue={balanceDue}
          grandTotal={bill.grandTotal}
          onPaymentsAdded={handlePaymentsAdded}
        />

        {/* Payment Timeline */}
        <PaymentTimeline
          payments={payments}
          onViewReceipt={(payment) => {
            setSelectedReceipt(payment)
            setIsReceiptModalOpen(true)
          }}
          onDeletePayment={handleDeletePayment}
        />

        {/* Refund Manager */}
        <RefundManager
          bill={bill}
          onRefundProcessed={handleRefundProcessed}
        />

        {/* Refund Timeline */}
        <RefundTimeline
          bill={bill}
          refunds={bill.refunds ?? []}
        />

        {/* Audit Log Viewer */}
        <AuditLogViewer
          auditLogs={bill.auditLogs ?? []}
        />
      </div>

      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedReceipt}
        bill={bill}
      />

      {/* Print styles */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 8mm;
        }
        @media print {
          html, body {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }
          header, aside, .print\\:hidden, button { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; }
          .pl-64 { padding-left: 0 !important; }
          .mt-16 { margin-top: 0 !important; }
          #printable-invoice {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 8px !important;
            margin: 0 !important;
            zoom: 1.0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-invoice .mt-6 { margin-top: 8px !important; }
          #printable-invoice .mt-8 { margin-top: 10px !important; }
          #printable-invoice .space-y-6 > * + * { margin-top: 6px !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

export default BillDetailPage
