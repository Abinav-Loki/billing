import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockPatients, mockBills, Patient, Bill } from "../../lib/mockData"
import { generateBillPDF } from "../../lib/pdfExport"
import {
  PACKAGE_MASTER,
  ADDON_MASTER,
  PACKAGE_CATEGORIES,
  PackageMaster,
  BillLineItem,
  AddOnItem,
  BillingMethod,
  checkBillingRules,
  getPackagesByCategory,
  PackageCategory,
} from "../../lib/billingMaster"
import {
  ArrowLeft,
  ArrowRight,
  User,
  Package,
  Plus,
  Trash,
  Printer,
  CheckCircle,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  BadgePercent,
  Stethoscope,
} from "lucide-react"

// ── Helpers ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Patient" },
  { id: 2, label: "Category" },
  { id: 3, label: "Package" },
  { id: 4, label: "Billing Method" },
  { id: 5, label: "Add-ons" },
  { id: 6, label: "Preview" },
  { id: 7, label: "Done" },
]

interface LineItemConfig {
  item: BillLineItem
  qty: number
  selected: boolean
}

interface AddOnConfig {
  addon: AddOnItem
  qty: number
}

// ── Main Component ────────────────────────────────────────────────────────
export function BillingWizardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientParamId = searchParams.get("patientId")

  const [step, setStep] = React.useState(1)

  // Selections
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<PackageCategory | null>(null)
  const [selectedPackage, setSelectedPackage] = React.useState<PackageMaster | null>(null)
  const [billingMethod, setBillingMethod] = React.useState<BillingMethod>("full_payment")
  const [lineItems, setLineItems] = React.useState<LineItemConfig[]>([])
  const [selectedAddOns, setSelectedAddOns] = React.useState<AddOnConfig[]>([])

  // Extras
  const [discount, setDiscount] = React.useState(0)
  const [discountNote, setDiscountNote] = React.useState("")
  const [billingNotes, setBillingNotes] = React.useState("")
  const [generatedBillNo, setGeneratedBillNo] = React.useState("")

  // UI state
  const [patientSearch, setPatientSearch] = React.useState("")
  const [pkgSearch, setPkgSearch] = React.useState("")
  const [addOnSearch, setAddOnSearch] = React.useState("")
  const [expandedAddOnCategories, setExpandedAddOnCategories] = React.useState<string[]>(["Lab"])

  // Pre-fill from URL
  React.useEffect(() => {
    if (patientParamId) {
      const pat = mockPatients.find((p) => p.id === patientParamId)
      if (pat) setSelectedPatient(pat)
    }
  }, [patientParamId])

  // Populate line items when package + method changes
  React.useEffect(() => {
    if (!selectedPackage) return
    setLineItems(
      selectedPackage.lineItems.map((item) => ({
        item,
        qty: item.defaultQty ?? 1,
        selected: !item.isOptional,
      }))
    )
  }, [selectedPackage, billingMethod])

  // ── Calculations ─────────────────────────────────────────────────────
  const packageAmount = React.useMemo(() => {
    if (!selectedPackage) return 0
    if (billingMethod === "full_payment") return selectedPackage.fullPaymentAmount
    return lineItems.filter((l) => l.selected).reduce((sum, l) => sum + l.item.price * l.qty, 0)
  }, [selectedPackage, billingMethod, lineItems])

  const addOnTotal = React.useMemo(
    () => selectedAddOns.reduce((s, a) => s + a.addon.price * a.qty, 0),
    [selectedAddOns]
  )

  const subtotal = packageAmount + addOnTotal
  const grandTotal = Math.max(0, subtotal - discount)

  // Rule violations for add-ons when full payment selected
  const ruleViolations = React.useMemo(() => {
    if (!selectedPackage || billingMethod !== "full_payment") return []
    return checkBillingRules(
      selectedPackage.id,
      billingMethod,
      selectedAddOns.map((a) => a.addon.name)
    )
  }, [selectedPackage, billingMethod, selectedAddOns])

  // ── Line item handlers ────────────────────────────────────────────────
  const toggleLineItem = (id: string) => {
    setLineItems((prev) => prev.map((l) => (l.item.id === id ? { ...l, selected: !l.selected } : l)))
  }

  const updateLineQty = (id: string, qty: number) => {
    setLineItems((prev) => prev.map((l) => (l.item.id === id ? { ...l, qty: Math.max(1, qty) } : l)))
  }

  // ── Add-on handlers ──────────────────────────────────────────────────
  const handleAddAddon = (addon: AddOnItem) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.addon.id === addon.id)
      if (exists) return prev.map((a) => (a.addon.id === addon.id ? { ...a, qty: a.qty + 1 } : a))
      return [...prev, { addon, qty: 1 }]
    })
  }

  const handleRemoveAddon = (id: string) => setSelectedAddOns((prev) => prev.filter((a) => a.addon.id !== id))

  const updateAddonQty = (id: string, qty: number) => {
    setSelectedAddOns((prev) => prev.map((a) => (a.addon.id === id ? { ...a, qty: Math.max(1, qty) } : a)))
  }

  // ── Navigation ───────────────────────────────────────────────────────
  const next = () => setStep((s) => Math.min(s + 1, 7))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const resetAndNew = () => {
    setStep(1)
    setSelectedPatient(null)
    setSelectedCategory(null)
    setSelectedPackage(null)
    setBillingMethod("full_payment")
    setLineItems([])
    setSelectedAddOns([])
    setDiscount(0)
    setDiscountNote("")
    setBillingNotes("")
    setGeneratedBillNo("")
  }

  // ── Generate bill ────────────────────────────────────────────────────
  const handleGenerateBill = () => {
    if (!selectedPatient || !selectedPackage) return
    const billNo = `BILL-2026-${String(mockBills.length + 1).padStart(4, "0")}`
    setGeneratedBillNo(billNo)

    const newBill: Bill = {
      billNo,
      uhid: selectedPatient.uhid,
      patientName: selectedPatient.name,
      packageName: selectedPackage.name,
      packagePrice: packageAmount,
      addOns: selectedAddOns.map((a) => ({ name: a.addon.name, price: a.addon.price * a.qty })),
      roomCharges: 0,
      additionalCharges: 0,
      discount,
      taxAmount: 0,
      grandTotal,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      billingNotes,
      doctorName: selectedPatient.doctorName,
    }

    mockBills.unshift(newBill)
    selectedPatient.billingHistory = selectedPatient.billingHistory ?? []
    selectedPatient.billingHistory.unshift({
      billNo,
      date: newBill.date,
      amount: newBill.grandTotal,
      status: "Pending",
    })

    next()
  }

  // ── Addon categories ─────────────────────────────────────────────────
  const addonCategories = [...new Set(ADDON_MASTER.map((a) => a.category))]
  const toggleAddonCategory = (cat: string) => {
    setExpandedAddOnCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filteredAddons = ADDON_MASTER.filter(
    (a) =>
      a.status === "Active" &&
      (addOnSearch === "" || a.name.toLowerCase().includes(addOnSearch.toLowerCase()))
  )

  // ── Category icon helper ─────────────────────────────────────────────
  const categoryColors: Record<string, string> = {
    "IVF / ICSI / FET": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    "Donor Programmes": "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
    "Surgical / Procedure Packages": "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    "Cryostorage / Oocyte / Sperm Cryopreservation": "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    "Embryo Pooling / Oocyte Accumulation": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    "Add-ons / Separate Billing Items": "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  }

  const lineItemCategoryColors: Record<string, string> = {
    Professional: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    Diagnostics: "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300",
    OT: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    Anaesthesia: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
    Pharmacy: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
    Lab: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300",
    Procedure: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    Consumables: "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    Room: "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
    Nursing: "bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300",
    Storage: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    Genetics: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
    Donor: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/30 dark:text-fuchsia-300",
    Admin: "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300",
  }

  const handleDownloadPDF = () => {
    const bill = mockBills.find((b) => b.billNo === generatedBillNo)
    if (bill && selectedPatient) {
      generateBillPDF(bill)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            IP Billing Wizard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Package-based hybrid billing · Full Payment or Item-wise
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : step > s.id
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {step > s.id ? <CheckCircle className="h-3 w-3" /> : <span>{s.id}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Progress value={((step - 1) / 6) * 100} className="h-1.5" />

      {/* ════════════════════════════════════════════════════════════
          STEP 1 — SELECT PATIENT
      ════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Step 1: Select Inpatient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by patient name or UHID..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 border-slate-200 dark:border-slate-700"
              />
            </div>

            {selectedPatient ? (
              <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{selectedPatient.name}</h3>
                    <span className="text-xs font-mono text-primary font-semibold">{selectedPatient.uhid}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                    <X className="h-3.5 w-3.5 mr-1" /> Change
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    ["Husband", selectedPatient.husbandName],
                    ["Consultant", selectedPatient.doctorName.split(" (")[0]],
                    ["Admitted", formatDate(selectedPatient.admissionDate)],
                    ["Mobile", selectedPatient.mobileNumber],
                    ["Age", `${selectedPatient.age} years`],
                    ["Gender", selectedPatient.gender],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white dark:bg-slate-900 p-2 rounded-lg border">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{k}</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto divide-y border rounded-xl">
                {mockPatients
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                      p.uhid.toLowerCase().includes(patientSearch.toLowerCase())
                  )
                  .map((pat) => (
                    <div
                      key={pat.id}
                      onClick={() => setSelectedPatient(pat)}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pat.name}</p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {pat.uhid} · {pat.doctorName.split(" (")[0]}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost">
                        Select →
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
          <CardContent className="flex justify-end pt-2 border-t">
            <Button disabled={!selectedPatient} onClick={next} className="gap-2">
              Proceed to Category <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2 — SELECT CATEGORY
      ════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Step 2: Select Package Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACKAGE_CATEGORIES.filter((c) => c !== "Add-ons / Separate Billing Items").map((cat) => {
                const count = getPackagesByCategory(cat).length
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-slate-200 dark:border-slate-700 hover:border-primary/40"
                    }`}
                  >
                    <div className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-2 ${categoryColors[cat] ?? "bg-slate-100 text-slate-600"}`}>
                      {count} packages
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">{cat}</p>
                    {isSelected && (
                      <div className="flex items-center gap-1 mt-2 text-primary text-xs font-semibold">
                        <CheckCircle className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
          <CardContent className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button disabled={!selectedCategory} onClick={next} className="gap-2">
              Browse Packages <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3 — SELECT PACKAGE
      ════════════════════════════════════════════════════════════ */}
      {step === 3 && selectedCategory && (
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Step 3: Select Package
              </CardTitle>
              <Badge className={categoryColors[selectedCategory]}>{selectedCategory}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search packages..."
                value={pkgSearch}
                onChange={(e) => setPkgSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 border-slate-200 dark:border-slate-700"
              />
            </div>

            {selectedPackage ? (
              <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{selectedPackage.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{selectedPackage.description}</p>
                  </div>
                  <div className="text-right shrink-0 pl-4">
                    <p className="text-xl font-extrabold text-primary">{formatCurrency(selectedPackage.fullPaymentAmount)}</p>
                    <p className="text-[10px] text-muted-foreground">full payment rate</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setSelectedPackage(null)}>
                      Change
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{selectedPackage.lineItems.filter(i => !i.isOptional || i.price > 0).length} billable components available</span>
                </div>
                {selectedPackage.staffNote && (
                  <div className="flex items-start gap-2 text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-3 rounded-lg">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{selectedPackage.staffNote}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {getPackagesByCategory(selectedCategory)
                  .filter((p) => p.name.toLowerCase().includes(pkgSearch.toLowerCase()))
                  .map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col"
                    >
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wide">{pkg.id}</span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1">{pkg.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex-1 line-clamp-2">{pkg.description}</p>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="text-base font-extrabold text-primary">{formatCurrency(pkg.fullPaymentAmount)}</p>
                          <p className="text-[10px] text-muted-foreground">{pkg.lineItems.length} components</p>
                        </div>
                        <Button size="sm" variant="ghost">Select →</Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
          <CardContent className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button disabled={!selectedPackage} onClick={next} className="gap-2">
              Set Billing Method <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 4 — BILLING METHOD + ITEM PICKER
      ════════════════════════════════════════════════════════════ */}
      {step === 4 && selectedPackage && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ToggleLeft className="h-5 w-5 text-primary" />
              Step 4: Choose Billing Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBillingMethod("full_payment")}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  billingMethod === "full_payment"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-slate-200 dark:border-slate-700 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {billingMethod === "full_payment" ? (
                    <ToggleRight className="h-5 w-5 text-primary" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-bold text-sm">Full Payment</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Charge the fixed package rate. All inclusions are bundled. Fastest option for standard cases.
                </p>
                <p className="text-xl font-extrabold text-primary mt-3">
                  {formatCurrency(selectedPackage.fullPaymentAmount)}
                </p>
              </button>

              <button
                onClick={() => setBillingMethod("item_wise")}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  billingMethod === "item_wise"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-md"
                    : "border-slate-200 dark:border-slate-700 hover:border-amber-400/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {billingMethod === "item_wise" ? (
                    <ToggleRight className="h-5 w-5 text-amber-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-bold text-sm">Other (Item-wise)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bill each component individually. Select, deselect, and adjust quantities per procedure.
                </p>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-3">
                  Configurable · {selectedPackage.lineItems.length} items
                </p>
              </button>
            </div>

            {/* Full Payment Summary */}
            {billingMethod === "full_payment" && (
              <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Included Services (Bundled)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPackage.lineItems
                    .filter((i) => !i.isOptional)
                    .map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs bg-white dark:bg-slate-800 border p-2 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="flex-1 truncate font-medium">{item.name}</span>
                        <span className="text-muted-foreground shrink-0">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                </div>
                {selectedPackage.duplicateBlockList && (
                  <div className="flex items-start gap-2 text-xs text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 p-3 rounded-lg">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Duplicate Block:</strong> The following categories cannot be billed again as add-ons:{" "}
                      <strong>{selectedPackage.duplicateBlockList.join(", ")}</strong>.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Item-wise Picker */}
            {billingMethod === "item_wise" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Components to Bill
                  </h4>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    {formatCurrency(lineItems.filter((l) => l.selected).reduce((s, l) => s + l.item.price * l.qty, 0))} selected
                  </span>
                </div>

                {/* Group by category */}
                {[...new Set(lineItems.map((l) => l.item.category))].map((cat) => (
                  <div key={cat} className="space-y-1.5">
                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${lineItemCategoryColors[cat] ?? "bg-slate-100 text-slate-600"}`}>
                      {cat}
                    </div>
                    {lineItems
                      .filter((l) => l.item.category === cat)
                      .map((lineItem) => (
                        <div
                          key={lineItem.item.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            lineItem.selected
                              ? "border-amber-400 bg-amber-50/60 dark:bg-amber-950/20"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 opacity-60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={lineItem.selected}
                            onChange={() => toggleLineItem(lineItem.item.id)}
                            className="w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                              {lineItem.item.name}
                            </p>
                            {lineItem.item.note && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">{lineItem.item.note}</p>
                            )}
                          </div>
                          {lineItem.selected && (
                            <div className="flex items-center gap-2 shrink-0">
                              <input
                                type="number"
                                value={lineItem.qty}
                                min={1}
                                onChange={(e) => updateLineQty(lineItem.item.id, Number(e.target.value))}
                                className="w-14 h-7 text-center text-xs border rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              />
                            </div>
                          )}
                          <span className={`text-xs font-bold shrink-0 ${lineItem.selected ? "text-amber-700 dark:text-amber-300" : "text-slate-400"}`}>
                            {formatCurrency(lineItem.item.price * lineItem.qty)}
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardContent className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="gap-2">
              Configure Add-ons <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 5 — ADD-ONS & DISCOUNT
      ════════════════════════════════════════════════════════════ */}
      {step === 5 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Step 5: Add-ons & Discount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Available Add-ons */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Add-ons</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search add-ons..."
                    value={addOnSearch}
                    onChange={(e) => setAddOnSearch(e.target.value)}
                    className="w-full h-8 pl-9 pr-3 border rounded-lg text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/40 border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {addonCategories
                    .filter((cat) => filteredAddons.some((a) => a.category === cat))
                    .map((cat) => (
                      <div key={cat} className="border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleAddonCategory(cat)}
                          className="w-full flex justify-between items-center px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span>{cat}</span>
                          {expandedAddOnCategories.includes(cat) ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {expandedAddOnCategories.includes(cat) &&
                          filteredAddons
                            .filter((a) => a.category === cat)
                            .map((addon) => {
                              const isBlocked =
                                billingMethod === "full_payment" &&
                                selectedPackage?.duplicateBlockList?.some((b) =>
                                  addon.name.toLowerCase().includes(b.toLowerCase())
                                )
                              return (
                                <div
                                  key={addon.id}
                                  className={`flex items-center justify-between px-3 py-2.5 border-t text-xs transition-colors ${
                                    isBlocked ? "opacity-40 bg-rose-50 dark:bg-rose-950/10" : "bg-white dark:bg-slate-950"
                                  }`}
                                >
                                  <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{addon.name}</p>
                                    <span className="text-muted-foreground">{formatCurrency(addon.price)}</span>
                                    {isBlocked && (
                                      <span className="ml-2 text-[10px] text-rose-600 font-bold">
                                        BLOCKED (in package)
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    disabled={!!isBlocked}
                                    onClick={() => handleAddAddon(addon)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                  </Button>
                                </div>
                              )
                            })}
                      </div>
                    ))}
                </div>
              </div>

              {/* Right: Cart + Discount */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Selected Add-ons ({selectedAddOns.length})
                </h4>

                {ruleViolations.length > 0 && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1">
                    {ruleViolations.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{v.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedAddOns.length === 0 ? (
                    <div className="border border-dashed rounded-xl p-6 text-center text-xs text-muted-foreground">
                      No add-ons selected yet
                    </div>
                  ) : (
                    selectedAddOns.map((a) => (
                      <div key={a.addon.id} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg text-xs">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{a.addon.name}</p>
                          <span className="text-muted-foreground">{formatCurrency(a.addon.price)} each</span>
                        </div>
                        <input
                          type="number"
                          value={a.qty}
                          min={1}
                          onChange={(e) => updateAddonQty(a.addon.id, Number(e.target.value))}
                          className="w-12 h-7 text-center border rounded-lg text-xs bg-white dark:bg-slate-800 focus:outline-none"
                        />
                        <span className="font-bold text-primary w-20 text-right">
                          {formatCurrency(a.addon.price * a.qty)}
                        </span>
                        <button
                          onClick={() => handleRemoveAddon(a.addon.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Discount section */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                    <BadgePercent className="h-4 w-4" /> Discount
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={discount || ""}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Reason</label>
                      <Input
                        type="text"
                        placeholder="e.g. Staff concession"
                        value={discountNote}
                        onChange={(e) => setDiscountNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Running total */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Package ({billingMethod === "full_payment" ? "Full" : "Item-wise"})</span>
                    <span>{formatCurrency(packageAmount)}</span>
                  </div>
                  {addOnTotal > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Add-ons</span>
                      <span>{formatCurrency(addOnTotal)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount{discountNote ? ` (${discountNote})` : ""}</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-primary text-sm border-t pt-2 mt-1">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="gap-2">
              Preview Invoice <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 6 — INVOICE PREVIEW
      ════════════════════════════════════════════════════════════ */}
      {step === 6 && selectedPatient && selectedPackage && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Step 6: Confirm & Generate Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Invoice preview */}
            <div
              id="invoice-preview"
              className="bg-white dark:bg-slate-950 border rounded-xl shadow-sm text-slate-800 dark:text-slate-100 text-xs"
            >
              {/* Header */}
              <div className="flex justify-between items-start p-5 border-b">
                <div>
                  <h2 className="text-base font-extrabold text-primary">ASCAS FERTILITY & WOMEN'S CENTER</h2>
                  <p className="text-muted-foreground text-[10px] mt-0.5">
                    No 15, Healthcare Colony, Landmark Crossroad · GST: 33ASCAS1234F1Z5
                  </p>
                  <p className="text-muted-foreground text-[10px]">Ph: +91 98765 43210 · ascas@hospital.in</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-lg">
                    IP ESTIMATE SLIP
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Date: {new Date().toLocaleDateString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Ref: DRAFT-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>

              {/* Patient details */}
              <div className="grid grid-cols-2 gap-4 p-5 border-b bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Patient</p>
                  <p className="font-bold text-sm">{selectedPatient.name}</p>
                  <p className="text-muted-foreground">UHID: {selectedPatient.uhid}</p>
                  <p className="text-muted-foreground">Husband: {selectedPatient.husbandName}</p>
                  <p className="text-muted-foreground">Mobile: {selectedPatient.mobileNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Clinical</p>
                  <p className="font-semibold">{selectedPatient.doctorName.split(" (")[0]}</p>
                  <p className="text-muted-foreground">{selectedPatient.doctorName.split(" (")[1]?.replace(")", "")}</p>
                  <p className="text-muted-foreground">Admitted: {formatDate(selectedPatient.admissionDate)}</p>
                </div>
              </div>

              {/* Charges table */}
              <div className="p-5 space-y-3">
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Charge Summary</p>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left pb-2 font-bold">Description</th>
                      <th className="text-center pb-2 font-bold">Qty</th>
                      <th className="text-right pb-2 font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Package row */}
                    <tr>
                      <td className="py-2">
                        <p className="font-bold">{selectedPackage.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {billingMethod === "full_payment" ? "Full Package · All inclusions bundled" : "Item-wise billing"}
                        </p>
                        {/* item-wise breakdown */}
                        {billingMethod === "item_wise" && (
                          <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-amber-300">
                            {lineItems.filter((l) => l.selected).map((l) => (
                              <p key={l.item.id} className="text-[10px] text-muted-foreground">
                                · {l.item.name} × {l.qty} — {formatCurrency(l.item.price * l.qty)}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right font-bold">{formatCurrency(packageAmount)}</td>
                    </tr>
                    {/* Add-ons */}
                    {selectedAddOns.map((a) => (
                      <tr key={a.addon.id}>
                        <td className="py-2">
                          <p className="font-medium">{a.addon.name}</p>
                          <p className="text-[10px] text-muted-foreground">{a.addon.category}</p>
                        </td>
                        <td className="py-2 text-center">{a.qty}</td>
                        <td className="py-2 text-right">{formatCurrency(a.addon.price * a.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end pt-3 border-t">
                  <div className="w-56 space-y-1.5">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount{discountNote ? ` (${discountNote})` : ""}</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-extrabold text-base text-primary border-t pt-2">
                      <span>Grand Total</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="px-5 pb-5 space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-muted-foreground">Billing Notes</label>
                <textarea
                  placeholder="Advance paid, clinical remarks, etc."
                  value={billingNotes}
                  onChange={(e) => setBillingNotes(e.target.value)}
                  className="w-full h-16 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Footer */}
              <div className="border-t px-5 py-3 text-center text-[9px] text-muted-foreground">
                This is a computer-generated estimate. Subject to change upon final discharge assessment. · ASCAS Fertility &
                Women's Center · Authorised Signatory
              </div>
            </div>
          </CardContent>
          <CardContent className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={ruleViolations.length > 0}
              onClick={handleGenerateBill}
            >
              <CheckCircle className="h-4 w-4" /> Confirm & Generate Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 7 — SUCCESS
      ════════════════════════════════════════════════════════════ */}
      {step === 7 && selectedPatient && selectedPackage && (
        <Card className="glass-panel max-w-lg mx-auto">
          <CardContent className="py-12 space-y-6 text-center">
            <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bill Generated!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                The invoice has been posted and is ready for reconciliation.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-5 text-left space-y-2 text-sm">
              {[
                ["Bill No.", generatedBillNo],
                ["Patient", selectedPatient.name],
                ["UHID", selectedPatient.uhid],
                ["Package", selectedPackage.name],
                ["Method", billingMethod === "full_payment" ? "Full Payment" : "Item-wise"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold text-primary text-base border-t pt-2">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button onClick={handleDownloadPDF} className="gap-2 w-full">
                <FileText className="h-4 w-4" /> Download PDF Invoice
              </Button>
              <Button variant="outline" onClick={() => navigate(`/bills`)} className="gap-2 w-full">
                <Printer className="h-4 w-4" /> View All Bills
              </Button>
              <Button variant="outline" onClick={resetAndNew} className="w-full">
                <Plus className="h-4 w-4 mr-1" /> Create Another Bill
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BillingWizardPage
