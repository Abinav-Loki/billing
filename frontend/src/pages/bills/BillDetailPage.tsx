import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, Bill } from "../../lib/mockData"
import { PACKAGE_MASTER } from "../../lib/billingMaster"
import { generateBillPDF } from "../../lib/pdfExport"
import {
  ArrowLeft,
  Printer,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  Building2,
  Download,
} from "lucide-react"

export function BillDetailPage() {
  const { billNo } = useParams<{ billNo: string }>()
  const navigate = useNavigate()

  const [bill, setBill] = React.useState<Bill | undefined>(() =>
    mockBills.find((b) => b.billNo === billNo)
  )

  // Auto-print if ?print=true
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

  const pkg = PACKAGE_MASTER.find((p) => p.name === bill.packageName)
  const subtotal = bill.packagePrice + bill.addOns.reduce((s, a) => s + a.price, 0) + bill.roomCharges + bill.additionalCharges

  const toggleStatus = () => {
    const next: "Paid" | "Pending" = bill.status === "Paid" ? "Pending" : "Paid"
    const updated = { ...bill, status: next }
    const idx = mockBills.findIndex((b) => b.billNo === billNo)
    if (idx !== -1) mockBills[idx] = updated
    setBill(updated)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Controls — hidden on print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{bill.billNo}</h1>
              <Badge variant={bill.status === "Paid" ? "success" : "warning"}>{bill.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{bill.patientName} · {formatDate(bill.date)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleStatus} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Mark {bill.status === "Paid" ? "Pending" : "Paid"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => generateBillPDF(bill)} className="gap-1.5 text-xs text-teal-600 border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/20">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
      </div>

      {/* Invoice Sheet */}
      <div
        id="printable-invoice"
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg max-w-3xl mx-auto print:border-none print:shadow-none print:rounded-none"
      >
        {/* Letterhead */}
        <div className="flex justify-between items-start p-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-extrabold text-teal-800 dark:text-teal-300">
                ASCAS FERTILITY & WOMEN'S CENTER
              </h2>
            </div>
            <p className="text-xs text-slate-500">No 15, Healthcare Colony, Landmark Crossroad</p>
            <p className="text-xs text-slate-500 font-mono">GSTIN: 33ASCAS1234F1Z5 · Tel: +91 98765 43210</p>
            <p className="text-xs text-slate-500">ascas@ascasfertility.in · www.ascasfertility.in</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-primary text-white text-xs font-extrabold px-4 py-1.5 rounded-lg">
              INPATIENT BILL
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-2">Bill No: {bill.billNo}</p>
            <p className="text-[11px] text-slate-500">Date: {formatDate(bill.date)}</p>
            <div className="mt-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  bill.status === "Paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {bill.status}
              </span>
            </div>
          </div>
        </div>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-2 gap-6 p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <div className="space-y-1 text-xs">
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Billed To</p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{bill.patientName}</p>
            <p className="text-slate-500 font-mono">UHID: {bill.uhid}</p>
            {bill.roomNo && <p className="text-slate-500">Room: {bill.roomNo}</p>}
            {bill.categoryName && <p className="text-slate-500">Category: {bill.categoryName}</p>}
          </div>
          <div className="text-right space-y-1 text-xs">
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Treating Consultant</p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {bill.doctorName.split(" (")[0]}
            </p>
            <p className="text-slate-500">{bill.doctorName.split(" (")[1]?.replace(")", "")}</p>
            <p className="text-teal-700 dark:text-teal-400 font-semibold mt-1">
              Billing Method: {bill.billingMethod === "item_wise" ? "Item-wise Billing" : "Full Payment Package"}
            </p>
          </div>
        </div>

        {/* Charges Table */}
        <div className="p-8 space-y-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left pb-2 font-bold text-slate-600 dark:text-slate-400">#</th>
                <th className="text-left pb-2 font-bold text-slate-600 dark:text-slate-400">Description</th>
                <th className="text-center pb-2 font-bold text-slate-600 dark:text-slate-400">Qty</th>
                <th className="text-right pb-2 font-bold text-slate-600 dark:text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Package / Procedure List */}
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
                    {pkg && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {pkg.lineItems.slice(0, 4).map((item) => (
                          <span key={item.id} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-muted-foreground">
                            {item.name}
                          </span>
                        ))}
                        {pkg.lineItems.length > 4 && (
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-muted-foreground">
                            +{pkg.lineItems.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(bill.packagePrice)}</td>
                </tr>
              )}

              {/* Room charges */}
              {bill.roomCharges > 0 && (
                <tr>
                  <td className="py-3 text-muted-foreground">
                    {bill.billingMethod === "item_wise" && bill.selectedLineItems ? bill.selectedLineItems.length + 1 : 2}
                  </td>
                  <td className="py-3">
                    <p className="font-medium text-slate-700 dark:text-slate-200">Room / Ward Bed Charges</p>
                  </td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">{formatCurrency(bill.roomCharges)}</td>
                </tr>
              )}

              {/* Add-ons */}
              {bill.addOns.map((addon, i) => {
                const baseIdx = bill.billingMethod === "item_wise" && bill.selectedLineItems 
                  ? bill.selectedLineItems.length + 1 
                  : 2;
                const offset = bill.roomCharges > 0 ? 1 : 0;
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
                );
              })}

              {/* Misc */}
              {bill.additionalCharges > 0 && (
                <tr>
                  <td className="py-3 text-muted-foreground">—</td>
                  <td className="py-3">
                    <p className="font-medium text-slate-700 dark:text-slate-200">Miscellaneous Consumables</p>
                  </td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">{formatCurrency(bill.additionalCharges)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Inclusions and Exclusions (for package bills) */}
          {pkg && (
            <div className="mt-6 border-t pt-4 space-y-4">
              {/* Inclusions */}
              {pkg.inclusionsList && pkg.inclusionsList.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Package Inclusions (All Included)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-750 dark:text-slate-300">
                    {pkg.inclusionsList.map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="h-4 w-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Exclusions (rendered if bill has saved exclusions) */}
              {bill.exclusions && bill.exclusions.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Package Exclusions (Billed Separately)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    {bill.exclusions.map((excl, i) => (
                      <div key={i} className="flex items-start gap-1.5 p-1.5 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed rounded-lg">
                        <span className="h-3.5 w-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">
                          —
                        </span>
                        <span>{excl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs border-t-2 border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {bill.taxAmount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(bill.taxAmount)}</span>
                </div>
              )}
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount / Concession</span>
                  <span>-{formatCurrency(bill.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-primary border-t pt-2">
                <span>GRAND TOTAL</span>
                <span>{formatCurrency(bill.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Billing Rule Disclaimer Note (MUST appear on every bill) */}
          <div className="mt-6 border-t pt-4 text-[10px] text-slate-500 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200">
            <p className="font-bold uppercase text-[9px] tracking-wide text-slate-600 mb-1">Clinic Billing Rule:</p>
            <p className="italic leading-normal">
              Consultation and monitoring scans included in OPU / egg collection packages and FET packages should not be billed separately. Room stay is optional unless specifically advised.
            </p>
            {bill.exclusions && bill.exclusions.length > 0 && (
              <p className="mt-2 font-medium">
                Note: Final bill may vary only when additional investigations, medications, room stay, or clinician-approved add-on is documented.
              </p>
            )}
          </div>

          {/* Notes */}
          {bill.billingNotes && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs text-slate-600 dark:text-slate-400 mt-4">
              <p className="font-bold uppercase text-[9px] text-muted-foreground mb-1">Notes</p>
              {bill.billingNotes}
            </div>
          )}

          {/* Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-16 text-xs">
            {["Patient / Guardian Signature", "Authorized Reception / Billing Desk"].map((label) => (
              <div key={label} className="text-center space-y-6">
                <div className="h-10" />
                <div className="border-t border-dashed border-slate-300 dark:border-slate-700" />
                <p className="text-muted-foreground font-medium text-[10px]">{label}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-muted-foreground border-t pt-3 leading-relaxed">
            This is a computer-generated invoice. Valid subject to discharge reconciliation. · ASCAS Fertility & Women's
            Center · {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          header, aside, .print\\:hidden, button { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          #printable-invoice { border: none !important; box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

export default BillDetailPage
