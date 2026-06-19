import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, Bill } from "../../lib/mockData"
import {
  PACKAGE_MASTER,
  ADDON_MASTER,
  PackageMaster,
  AddOnItem,
  getPackagesByCategory,
  PACKAGE_CATEGORIES,
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
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Search,
  Check,
  Building2,
  Calendar,
  Layers
} from "lucide-react"

interface OtherItem {
  name: string
  price: number
  note?: string
  hasQty?: boolean
  qtyLabel?: string
  unitText?: string
}

function getOtherItemsForPackage(pkgId: string, pkgCategory: string): OtherItem[] {
  if (pkgId === "PKG-ICSI-BASIC" || pkgId === "PKG-ROOM-ICSI-BASIC") {
    return [
      { name: "Stimulation medications — gonadotrophins, antagonist, trigger", note: "At drug package rate", price: 0 },
      { name: "Pre-cycle hormonal blood tests\n(FSH, LH, AMH, E2, prolactin, TSH)", note: "As applicable", price: 0 },
      { name: "Additional workup blood tests\n(CBC, coagulation, RFT, blood sugar, blood group)", note: "As applicable", price: 0 },
      { name: "ECG", note: "As applicable", price: 0 },
      { name: "Echocardiogram (Echo)", note: "As applicable", price: 0 },
      { name: "Pre-anaesthesia / anaesthetic checkup", note: "As applicable", price: 0 },
      { name: "Semen analysis + additional andrology workup", note: "As applicable", price: 0 },
      { name: "Serology panel (HIV, HBsAg, HCV, VDRL)", note: "As applicable", price: 0 },
      { name: "MF – microfluidic sperm selection", price: 10000 },
      { name: "PICSI", price: 10000 },
      { name: "Calcium ionophore", price: 10000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Laser-assisted hatching (LAH)", price: 15000 },
      { name: "Additional cryolock", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per lock per year" },
      { name: "Cryostorage renewal", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per cryolock per year" },
      { name: "FET", price: 35000 },
      { name: "Single room", price: 5000, hasQty: true, qtyLabel: "days", unitText: "per day" },
      { name: "ICSI Basic + Room", price: 105000 }
    ]
  }
  if (pkgId === "PKG-ICSI-ADV" || pkgId === "PKG-ROOM-ICSI-ADV") {
    return [
      { name: "Stimulation medications", note: "At drug package rate", price: 0 },
      { name: "Pre-cycle hormonal blood tests\n(FSH, LH, AMH, E2, prolactin, TSH)", price: 0 },
      { name: "Additional workup blood tests\n(CBC, coagulation, RFT, blood sugar, blood group)", price: 0 },
      { name: "ECG", price: 0 },
      { name: "Echocardiogram (Echo)", price: 0 },
      { name: "Pre-anaesthesia / anaesthetic checkup", price: 0 },
      { name: "Semen analysis + additional andrology workup", price: 0 },
      { name: "Serology panel\n(HIV, HBsAg, HCV, VDRL)", price: 0 },
      { name: "Second sperm selection method\n(if both MF and PICSI required – rare)", price: 10000 },
      { name: "Calcium ionophore", price: 10000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Laser-assisted hatching (LAH)", price: 15000 },
      { name: "Additional cryolock", price: 5000 },
      { name: "Cryostorage renewal", price: 5000 },
      { name: "FET", price: 35000 }
    ]
  }
  if (pkgId === "PKG-ICSI-PGT" || pkgId === "PKG-ROOM-ICSI-PGT") {
    return [
      { name: "MF or PICSI (if required)", price: 10000 },
      { name: "PGT-A beyond 4 embryos", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Additional cryolock", price: 5000 },
      { name: "Additional FET beyond 1 included", price: 35000 },
      { name: "Cryostorage renewal", price: 5000 },
      { name: "Calcium ionophore", price: 10000 },
      { name: "Laser-assisted hatching (LAH)", price: 15000 },
      { name: "Stimulation medications", note: "As applicable", price: 0 },
      { name: "Investigations", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId.startsWith("PKG-FET-")) {
    return [
      { name: "Endometrial preparation medications\n(estradiol, progesterone)", note: "At MRP", price: 0 },
      { name: "Luteal phase support medications post-transfer", note: "At MRP", price: 0 },
      { name: "Additional hormonal blood tests\n(E2, progesterone, beta hCG)", price: 0 },
      { name: "Serum beta hCG", price: 0 },
      { name: "Post-transfer follow-up scan", price: 0 },
      { name: "Endometrial scratch", price: 3000 },
      { name: "Laser-assisted hatching (LAH)", price: 15000 }
    ]
  }
  if (pkgId === "PKG-DIAG-LAP") {
    return [
      { name: "Histopathology / tissue biopsy", note: "As applicable", price: 0 },
      { name: "Overnight IP stay – room charges", note: "As applicable", price: 0 },
      { name: "Operative intervention if findings require", note: "Additional charge", price: 0 }
    ]
  }
  if (pkgId === "PKG-DIAG-HYST") {
    return [
      { name: "Endometrial biopsy / polypectomy", note: "As applicable", price: 0 },
      { name: "Histopathology", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-OP-HYST") {
    return [
      { name: "Histopathology of specimen", note: "As applicable", price: 0 },
      { name: "Overnight IP stay", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-DNC") {
    return [
      { name: "Histopathology", note: "As applicable", price: 0 },
      { name: "Overnight stay", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-CERCLAGE") {
    return [
      { name: "Post-op medications", note: "As applicable", price: 0 },
      { name: "Overnight stay", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-CYST-ASP") {
    return [
      { name: "Histopathology / cyst fluid analysis", note: "As applicable", price: 0 },
      { name: "Medications post-procedure", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-IUI-ANA") {
    return [
      { name: "Semen analysis pre-wash", note: "As applicable", price: 0 },
      { name: "Follicular monitoring scans", note: "As applicable", price: 0 },
      { name: "Medications", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-BARTHOLIN") {
    return [
      { name: "Histopathology", note: "As applicable", price: 0 },
      { name: "Overnight IP stay", note: "As applicable", price: 0 },
      { name: "Post-op antibiotics", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-PESA") {
    return [] // No exclusions for PESA / TESA
  }
  if (pkgCategory === "Surgical / Procedure Packages") {
    return []
  }
  if (pkgId === "PKG-DONOR-EGG") {
    return [
      { name: "Recipient hormonal blood tests\n(E2, progesterone, LH monitoring)", price: 0 },
      { name: "Recipient serology\n(HIV, HBsAg, HCV, VDRL)", price: 0 },
      { name: "Recipient endometrial preparation medications", note: "At MRP", price: 0 },
      { name: "Luteal phase support medications", note: "At MRP", price: 0 },
      { name: "Additional FET beyond 1 included", price: 35000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Laser-assisted hatching (LAH)", price: 15000 },
      { name: "Additional cryolock / renewal", price: 5000 }
    ]
  }
  if (pkgId === "PKG-CHARITY") {
    return [
      { name: "Stimulation medications", note: "At MRP", price: 0 },
      { name: "Pre-cycle investigations\n(Hormones, Semen analysis, Serology)", note: "As applicable", price: 0 },
      { name: "Additional cryolocks beyond 2", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per lock per year" },
      { name: "Cryostorage renewal", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per lock per year" },
      { name: "FET", price: 35000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "MF / PICSI", price: 10000 },
      { name: "Calcium ionophore", price: 10000 }
    ]
  }
  if (pkgId === "PKG-CHARITY-FET") {
    return [
      { name: "Luteal phase support medications", note: "At MRP", price: 0 },
      { name: "Serum beta hCG (pregnancy test)", note: "As applicable", price: 0 },
      { name: "Post-transfer follow-up scan", note: "As applicable", price: 0 },
      { name: "Endometrial scratch", price: 3000 },
      { name: "Second FET onwards", price: 35000 }
    ]
  }
  if (pkgId === "PKG-DONOR-EMBRYO") {
    return [
      { name: "Recipient hormonal blood tests\n(E2, progesterone monitoring)", price: 0 },
      { name: "Recipient serology\n(HIV, HBsAg, HCV, VDRL)", price: 0 },
      { name: "Recipient endometrial preparation medications", note: "At MRP", price: 0 },
      { name: "Luteal phase support medications", note: "At MRP", price: 0 },
      { name: "Additional FET beyond 1 included", price: 35000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Laser-assisted hatching (LAH)", price: 15000 },
      { name: "Cryostorage renewal", price: 5000 }
    ]
  }
  if (pkgId === "PKG-EGG-FRZ") {
    return [
      { name: "Stimulation medications", note: "At MRP", price: 0 },
      { name: "Pre-cycle hormonal investigations\n(AMH, FSH, LH, E2, TSH, Prolactin)", note: "As applicable", price: 0 },
      { name: "Additional blood investigations\n(CBC, Blood grouping, Blood sugar, RFT, Coagulation)", note: "As applicable", price: 0 },
      { name: "Serology panel\n(HIV, HBsAg, HCV, VDRL)", note: "As applicable", price: 0 },
      { name: "ECG", note: "As applicable", price: 0 },
      { name: "Echocardiogram (Echo)", note: "As applicable", price: 0 },
      { name: "Pre-anaesthetic check-up (PAC)", note: "As applicable", price: 0 },
      { name: "Future utilisation of frozen oocytes", note: "At prevailing IVF/ICSI rate", price: 0 },
      { name: "Additional cryostorage after first year", price: 20000, hasQty: true, qtyLabel: "years", unitText: "per year" },
      { name: "Emergency thaw and refreeze", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-2CYCLE" || pkgId === "PKG-3CYCLE") {
    return [
      { name: "MF or PICSI", price: 10000, hasQty: true, qtyLabel: "cycles", unitText: "per cycle" },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "Additional cryolock", price: 5000 },
      { name: "Cryostorage renewal", price: 5000 },
      { name: "Additional FET beyond included FET", price: 35000 },
      { name: "Stimulation medications", note: "At drug package rate", price: 0 },
      { name: "Pre-cycle investigations", note: "As applicable", price: 0 }
    ]
  }
  if (pkgId === "PKG-CHARITY") {
    return [
      { name: "Stimulation medications", note: "At MRP", price: 0 },
      { name: "Pre-cycle investigations\n(Hormones, Semen analysis, Serology)", note: "As applicable", price: 0 },
      { name: "Additional cryolocks beyond 2", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per lock per year" },
      { name: "Cryostorage renewal", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per lock per year" },
      { name: "FET", price: 35000 },
      { name: "PGT-A", price: 25000, hasQty: true, qtyLabel: "embryos", unitText: "per embryo" },
      { name: "MF / PICSI", price: 10000 },
      { name: "Calcium ionophore", price: 10000 }
    ]
  }
  if (pkgId === "PKG-EMBRYO-CRYO") {
    return [
      { name: "Annual renewal after first year", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per cryolock per year" },
      { name: "Additional cryolock", price: 5000, hasQty: true, qtyLabel: "locks", unitText: "per cryolock per year" }
    ]
  }
  if (pkgId.startsWith("PKG-SPERM-")) {
    return [
      { name: "Surgical sperm retrieval (TESA / PESA)", note: "As applicable", price: 0 },
      { name: "Donor sperm", note: "Actual cost", price: 0 },
      { name: "Sperm transport to another clinic", note: "As applicable", price: 0 },
      { name: "Renewal after Year 1", price: 10000, hasQty: true, qtyLabel: "years", unitText: "per year" }
    ]
  }
  if (pkgCategory === "Cryostorage / Oocyte / Sperm Cryopreservation" || pkgId === "PKG-CRYO-ADD") {
    return []
  }
  return []
}

export function BillingWizardPage() {
  const navigate = useNavigate()

  // Wizard Steps:
  // 1: Patient Details Form
  // 2: Package & Add-ons Selection
  // 3: Billing Format Choice
  // 4: Invoice Preview & Print
  // 5: Success Done
  const [step, setStep] = React.useState(1)

  // Step 1: Patient details state
  const [patientName, setPatientName] = React.useState("")
  const [patientId, setPatientId] = React.useState("")
  const [age, setAge] = React.useState("")
  const [doctorOption, setDoctorOption] = React.useState("Dr. AP")
  const [customDoctorName, setCustomDoctorName] = React.useState("")
  const [billDate, setBillDate] = React.useState(() => new Date().toISOString().split("T")[0])
  const [billNo, setBillNo] = React.useState("")

  // Step 2: Selections state
  const [selectedPackage, setSelectedPackage] = React.useState<PackageMaster | null>(null)
  const [selectedAddOns, setSelectedAddOns] = React.useState<{ addon: AddOnItem; qty: number }[]>([])
  const [exclusions, setExclusions] = React.useState<string[]>([])
  const [newExclusionText, setNewExclusionText] = React.useState("")
  
  // Package search & category filtering state
  const [activeCategory, setActiveCategory] = React.useState<string>("IVF / ICSI / FET")
  const [packageSearch, setPackageSearch] = React.useState("")
  
  // Addon accordion & search state
  const [addonSearch, setAddonSearch] = React.useState("")
  const [isAddonSectionOpen, setIsAddonSectionOpen] = React.useState(true)

  // Discount state
  const [discount, setDiscount] = React.useState<number>(0)
  const [discountNote, setDiscountNote] = React.useState("")

  // Step 3: Billing format choice state
  const [billingFormat, setBillingFormat] = React.useState<"inline" | "detailed">("inline")

  // State to track detailed exclusions/add-ons checked and their quantities
  const [detailedSelections, setDetailedSelections] = React.useState<Record<string, { checked: boolean, qty: number }>>({})

  // Initialize detailed selections when selected package changes
  // NOTE: Exclusions are NOT pre-loaded from the package defaults —
  //        they only appear when manually added by the user in Step 2.
  React.useEffect(() => {
    if (selectedPackage) {
      setExclusions([]) // Always start empty — user adds their own

      const items = getOtherItemsForPackage(selectedPackage.id, selectedPackage.category)
      const initial: Record<string, { checked: boolean, qty: number }> = {}
      items.forEach(item => {
        initial[item.name] = { checked: false, qty: 1 }
      })
      setDetailedSelections(initial)
    } else {
      setExclusions([])
      setDetailedSelections({})
    }
  }, [selectedPackage])

  const handleAddExclusion = () => {
    if (!newExclusionText.trim()) return
    setExclusions(prev => [...prev, newExclusionText.trim()])
    setNewExclusionText("")
  }

  const handleRemoveExclusion = (index: number) => {
    setExclusions(prev => prev.filter((_, i) => i !== index))
  }

  // Generate unique auto-incremented Bill No based on mockBills length on load
  React.useEffect(() => {
    const prefix = "ASCAS-2025-"
    const matchingBills = mockBills.filter(b => b.billNo.startsWith(prefix))
    let nextSeq = 1
    if (matchingBills.length > 0) {
      const sequences = matchingBills.map(b => {
        const parts = b.billNo.split("-")
        const num = parseInt(parts[parts.length - 1], 10)
        return isNaN(num) ? 0 : num
      })
      nextSeq = Math.max(...sequences, 0) + 1
    } else {
      nextSeq = mockBills.length + 1
    }
    setBillNo(`${prefix}${String(nextSeq).padStart(4, "0")}`)
  }, [])

  // Doctor name getter
  const getDoctorName = () => {
    return doctorOption === "Dr. AP" ? "Dr. AP" : (customDoctorName || "Dr. Other")
  }

  // Calculations
  const packageAmount = selectedPackage ? selectedPackage.fullPaymentAmount : 0
  
  // Calculate detailed exclusions/add-ons list and total
  const detailedItemsList = selectedPackage ? getOtherItemsForPackage(selectedPackage.id, selectedPackage.category) : []
  const detailedItemsTotal = detailedItemsList.reduce((sum, item) => {
    const sel = detailedSelections[item.name]
    if (sel && sel.checked) {
      return sum + (item.price || 0) * sel.qty
    }
    return sum
  }, 0)

  const addOnsTotal = (billingFormat === "detailed" ? detailedItemsTotal : 0) +
    selectedAddOns.reduce((sum, item) => sum + item.addon.price * item.qty, 0)

  const subtotal = packageAmount + addOnsTotal
  const grandTotal = Math.max(0, subtotal - discount)

  // Navigation handlers
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName || !patientId || !age || (doctorOption === "other" && !customDoctorName)) {
      alert("Please fill in all patient details correctly.")
      return
    }
    setStep(2)
  }

  const handleNextStep2 = () => {
    if (!selectedPackage) {
      alert("Please select a primary package.")
      return
    }
    setStep(3)
  }

  const handleSelectFormat = (format: "inline" | "detailed") => {
    setBillingFormat(format)
    setStep(4)
  }

  // Add / remove add-ons
  const handleToggleAddOn = (addon: AddOnItem) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.addon.id === addon.id)
      if (exists) {
        return prev.filter(item => item.addon.id !== addon.id)
      } else {
        return [...prev, { addon, qty: 1 }]
      }
    })
  }

  const handleUpdateAddOnQty = (addonId: string, value: number) => {
    setSelectedAddOns(prev =>
      prev.map(item =>
        item.addon.id === addonId ? { ...item, qty: Math.max(1, value) } : item
      )
    )
  }

  const isAddOnSelected = (addonId: string) => {
    return selectedAddOns.some(item => item.addon.id === addonId)
  }

  const getAddOnQty = (addonId: string) => {
    const item = selectedAddOns.find(item => item.addon.id === addonId)
    return item ? item.qty : 1
  }

  // Confirm and Generate Bill in DB
  const handleConfirmAndGenerate = () => {
    if (!selectedPackage) return

    const generatedAddOns = billingFormat === "detailed"
      ? [
          ...detailedItemsList
            .filter(item => {
              const sel = detailedSelections[item.name]
              return sel && sel.checked
            })
            .map(item => {
              const sel = detailedSelections[item.name]
              const qtyText = sel.qty > 1 ? ` (x${sel.qty})` : ""
              return {
                name: item.name + qtyText,
                price: (item.price || 0) * sel.qty
              }
            }),
          ...selectedAddOns.map(item => ({
            name: item.qty > 1 ? `${item.addon.name} (x${item.qty})` : item.addon.name,
            price: item.addon.price * item.qty
          }))
        ]
      : selectedAddOns.map(item => ({
          name: item.qty > 1 ? `${item.addon.name} (x${item.qty})` : item.addon.name,
          price: item.addon.price * item.qty
        }))

    const generatedExclusions = billingFormat === "detailed"
      ? detailedItemsList
          .filter(item => {
            const sel = detailedSelections[item.name]
            return !sel || !sel.checked
          })
          .map(item => item.name)
      : exclusions

    const newBill: Bill = {
      billNo,
      uhid: patientId,
      patientName,
      packageName: selectedPackage.name,
      packagePrice: packageAmount,
      addOns: generatedAddOns,
      roomCharges: 0,
      additionalCharges: 0,
      discount,
      taxAmount: 0,
      grandTotal,
      date: billDate,
      status: "Pending",
      doctorName: getDoctorName(),
      billingNotes: discountNote ? `Discount note: ${discountNote}` : undefined,
      billingMethod: "full_payment",
      billingFormat: billingFormat,
      exclusions: generatedExclusions
    }

    mockBills.unshift(newBill)
    setStep(5)
  }

  const resetWizard = () => {
    setPatientName("")
    setPatientId("")
    setAge("")
    setDoctorOption("Dr. AP")
    setCustomDoctorName("")
    setBillDate(new Date().toISOString().split("T")[0])
    setSelectedPackage(null)
    setSelectedAddOns([])
    setDiscount(0)
    setDiscountNote("")
    setExclusions([])
    setNewExclusionText("")
    
    // Increment bill sequence for the next one
    const prefix = "ASCAS-2025-"
    const matchingBills = mockBills.filter(b => b.billNo.startsWith(prefix))
    let nextSeq = 1
    if (matchingBills.length > 0) {
      const sequences = matchingBills.map(b => {
        const parts = b.billNo.split("-")
        const num = parseInt(parts[parts.length - 1], 10)
        return isNaN(num) ? 0 : num
      })
      nextSeq = Math.max(...sequences, 0) + 1
    } else {
      nextSeq = mockBills.length + 1
    }
    setBillNo(`${prefix}${String(nextSeq).padStart(4, "0")}`)

    setStep(1)
  }

  // Filter packages based on active category & search
  const filteredPackages = getPackagesByCategory(activeCategory as any).filter(
    pkg =>
      pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.description.toLowerCase().includes(packageSearch.toLowerCase())
  )

  // Filter addons based on search
  const filteredAddOns = ADDON_MASTER.filter(
    addon =>
      addon.status === "Active" &&
      addon.name.toLowerCase().includes(addonSearch.toLowerCase())
  )

  // Check if an add-on is a per-unit add-on
  const isPerUnitAddon = (addonName: string) => {
    const name = addonName.toLowerCase()
    return name.includes("pgt-a") || name.includes("room") || name.includes("cryolock")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:max-w-full print:mx-0">
      
      {/* ── Print styling tag ── */}
      <style>{`
        @media screen {
          .a4-invoice-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            background: white !important;
            color: #1e293b !important;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 12px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }
        }
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
          aside, header, nav, button, .print-hide, .no-print {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .pl-64 {
            padding-left: 0 !important;
          }
          .mt-16 {
            margin-top: 0 !important;
          }
          #printable-invoice-container {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8px !important;
            min-height: 0 !important;
            zoom: 0.72 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-invoice-container .mt-6 {
            margin-top: 8px !important;
          }
          #printable-invoice-container .mt-8 {
            margin-top: 10px !important;
          }
          #printable-invoice-container .mt-12 {
            margin-top: 14px !important;
          }
          #printable-invoice-container .p-8 {
            padding: 6px !important;
          }
          #printable-invoice-container .space-y-6 > * + * {
            margin-top: 6px !important;
          }
          #printable-invoice-container .gap-12 {
            gap: 16px !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Page Header (hidden on print) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 print-hide">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            ASCAS Inpatient Billing Tool
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, choose format, and generate official printable clinic invoices.
          </p>
        </div>
        
        {step < 5 && (
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 1, label: "Patient details" },
              { id: 2, label: "Select Package" },
              { id: 3, label: "Billing Type" },
              { id: 4, label: "Invoice Preview" },
            ].map(s => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                  step === s.id
                    ? "bg-primary text-primary-foreground shadow"
                    : step > s.id
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step > s.id ? <Check className="h-3 w-3 stroke-[3]" /> : <span>{s.id}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {step < 5 && (
        <Progress value={((step - 1) / 3) * 100} className="h-1.5 print-hide" />
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 1: PATIENT DETAILS FORM
      ════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <Card className="glass-panel border border-slate-200 shadow-xl max-w-xl mx-auto">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b p-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <User className="h-5 w-5 text-primary" />
              Patient Details Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleNextStep1} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                  <Input
                    type="date"
                    required
                    value={billDate}
                    onChange={e => setBillDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bill Number</label>
                  <Input
                    type="text"
                    disabled
                    value={billNo}
                    className="bg-slate-50 font-mono font-bold text-primary dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Priyadarshini K."
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID / File No.</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. ASCAS-9821"
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                  <Input
                    type="number"
                    required
                    placeholder="e.g. 32"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consulting Doctor</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDoctorOption("Dr. AP")}
                    className={`py-2 px-3 border rounded-lg text-sm font-semibold transition-all ${
                      doctorOption === "Dr. AP"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Dr. AP
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoctorOption("other")}
                    className={`py-2 px-3 border rounded-lg text-sm font-semibold transition-all ${
                      doctorOption === "other"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Dr. [other]
                  </button>
                </div>
                
                {doctorOption === "other" && (
                  <Input
                    type="text"
                    required
                    placeholder="Enter consulting doctor's name"
                    value={customDoctorName}
                    onChange={e => setCustomDoctorName(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" className="gap-2">
                  Proceed to Package Selection <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2: PACKAGE & ADD-ONS SELECTION
      ════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-hide">
          
          {/* Left: Package Selection (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="glass-panel border-slate-200 shadow-lg">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <Package className="h-5 w-5 text-primary" />
                  Primary Package Selection
                </CardTitle>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search package name..."
                    value={packageSearch}
                    onChange={e => setPackageSearch(e.target.value)}
                    className="w-full h-8 pl-9 pr-3 border rounded-lg text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary border-slate-200 dark:border-slate-800"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                
                {/* Category filters */}
                <div className="flex gap-1.5 flex-wrap">
                  {PACKAGE_CATEGORIES.filter(c => c !== "Add-ons / Separate Billing Items").map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200"
                      }`}
                    >
                      {cat === "Cryostorage / Oocyte / Sperm Cryopreservation"
                        ? "Cryostorage"
                        : cat === "Embryo Pooling / Oocyte Accumulation"
                        ? "Embryo Pooling"
                        : cat === "Surgical / Procedure Packages"
                        ? "Surgical Procedures"
                        : cat}
                    </button>
                  ))}
                </div>

                {/* Package listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredPackages.map(pkg => {
                    const isSelected = selectedPackage?.id === pkg.id
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow"
                            : "border-slate-200 dark:border-slate-800 hover:border-primary/45"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">{pkg.name}</h4>
                          <span className="font-extrabold text-primary shrink-0">{formatCurrency(pkg.fullPaymentAmount)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">{pkg.description}</p>
                        
                        {pkg.billingNote && (
                          <div className="text-[10px] text-teal-850 dark:text-teal-300 font-semibold bg-teal-50/60 dark:bg-teal-950/20 px-2 py-1 rounded mt-2.5 flex items-start gap-1">
                            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{pkg.billingNote}</span>
                          </div>
                        )}

                        {isSelected && (
                          <div className="flex items-center gap-1.5 mt-2.5 text-primary text-xs font-bold">
                            <Check className="h-4 w-4 stroke-[3]" /> Selected
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredPackages.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground text-xs font-semibold">
                      No packages found in this category.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add-ons list */}
            <Card className="glass-panel border-slate-200 shadow-lg">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b px-5 py-3.5 flex flex-row items-center justify-between">
                <button
                  onClick={() => setIsAddonSectionOpen(!isAddonSectionOpen)}
                  className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100"
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Select Add-ons (Optional)
                  {isAddonSectionOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {isAddonSectionOpen && (
                  <div className="relative w-40 sm:w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Filter add-ons..."
                      value={addonSearch}
                      onChange={e => setAddonSearch(e.target.value)}
                      className="w-full h-7 pl-8 pr-2 border rounded-lg text-[11px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary border-slate-200 dark:border-slate-800"
                    />
                  </div>
                )}
              </CardHeader>
              {isAddonSectionOpen && (
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {filteredAddOns.map(addon => {
                      const checked = isAddOnSelected(addon.id)
                      const isPerUnit = isPerUnitAddon(addon.name)
                      const currentQty = getAddOnQty(addon.id)

                      return (
                        <div
                          key={addon.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            checked
                              ? "border-primary/50 bg-primary/5"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleAddOn(addon)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{addon.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(addon.price)}</p>
                            </div>
                          </div>
                          
                          {checked && isPerUnit && (
                            <div className="flex items-center gap-1.5 shrink-0 pl-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Qty:</label>
                              <input
                                type="number"
                                min={1}
                                value={currentQty}
                                onChange={e => handleUpdateAddOnQty(addon.id, Number(e.target.value))}
                                className="w-12 h-6 border rounded text-center text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Exclusions Management Card */}
            {selectedPackage && (
              <Card className="glass-panel border-slate-200 shadow-lg">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b px-5 py-3.5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                    <Info className="h-4 w-4 text-primary" />
                    Customize Package Exclusions (Billed Separately)
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <p className="text-[11px] text-muted-foreground">
                    Exclusions are shown in the <strong>Detailed Payment</strong> format. Customize them here (add new ones or remove default ones) to suit this patient's bill.
                  </p>

                  {/* Add Custom Exclusion Input */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. Histopathology, anesthesia, room stay..."
                      value={newExclusionText}
                      onChange={e => setNewExclusionText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddExclusion()
                        }
                      }}
                      className="text-xs h-9"
                    />
                    <Button type="button" onClick={handleAddExclusion} size="sm" className="h-9 gap-1 text-xs px-3">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>

                  {/* Exclusions List */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {exclusions.length > 0 ? (
                      exclusions.map((excl, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 text-xs text-slate-700 dark:text-slate-200"
                        >
                          <span className="flex-1 pr-2 leading-tight">{excl}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExclusion(i)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors shrink-0"
                            title="Remove Exclusion"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-slate-50/30 dark:bg-slate-900/10 rounded-lg border border-dashed">
                        No exclusions added. All services will be assumed included.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Summary panel (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-panel border-slate-200 shadow-xl sticky top-6 bg-slate-50/50 dark:bg-slate-900/30">
              <CardHeader className="border-b px-5 py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                
                {/* Patient details snapshot */}
                <div className="bg-white dark:bg-slate-900 border rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Patient:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">File ID:</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-350">{patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Doctor:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{getDoctorName()}</span>
                  </div>
                </div>

                {/* Selected Package Details */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Package</label>
                  {selectedPackage ? (
                    <div className="flex justify-between items-start text-xs border bg-white dark:bg-slate-900 p-3 rounded-xl">
                      <span className="font-bold text-slate-750 dark:text-slate-150 leading-snug">{selectedPackage.name}</span>
                      <span className="font-extrabold text-primary shrink-0 ml-4">{formatCurrency(packageAmount)}</span>
                    </div>
                  ) : (
                    <div className="border border-dashed p-4 text-center text-xs text-muted-foreground rounded-xl">
                      No package selected yet.
                    </div>
                  )}
                </div>

                {/* Selected Add-ons removed from sidebar as per request */}

                {/* Discount Inputs */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Discount Concession
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={subtotal}
                        value={discount || ""}
                        onChange={e => setDiscount(Number(e.target.value))}
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Concession Reason</label>
                      <Input
                        type="text"
                        placeholder="Staff discount..."
                        value={discountNote}
                        onChange={e => setDiscountNote(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculations summary block */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-350">
                    <span className="font-semibold">Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-455 font-bold">
                      <span className="flex items-center gap-0.5">Discount:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-primary text-sm border-t pt-2 mt-1">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Step buttons */}
                <div className="pt-4 border-t flex justify-between gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button disabled={!selectedPackage} onClick={handleNextStep2} className="flex-1 gap-1.5">
                    Choose Format <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3: BILLING FORMAT CHOICE
      ════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <Card className="glass-panel border-slate-200 shadow-xl max-w-2xl mx-auto print-hide">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b p-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <FileText className="h-5 w-5 text-primary" />
              Choose Billing Format
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              Please choose a format for the printable invoice. This determines how inclusions, exclusions, and add-ons are laid out on the receipt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Inline format choice */}
              <button
                onClick={() => handleSelectFormat("inline")}
                className="p-5 border-2 rounded-xl text-left hover:shadow-md hover:border-primary/50 transition-all border-slate-200 dark:border-slate-850 hover:bg-slate-50/20"
              >
                <Badge className="bg-primary text-white mb-2.5">Inline Payment</Badge>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Quick Billing Format</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Renders package details alongside a specific one-line package billing description, ticked inclusions, selected add-ons, and payment total. Excludes lists are hidden.
                </p>
              </button>

              {/* Detailed format choice */}
              <button
                onClick={() => handleSelectFormat("detailed")}
                className="p-5 border-2 rounded-xl text-left hover:shadow-md hover:border-primary/50 transition-all border-slate-200 dark:border-slate-850 hover:bg-slate-50/20"
              >
                <Badge className="bg-teal-650 text-white mb-2.5">Detailed Payment</Badge>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Full Breakdown Format</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Renders full package inclusions list (checked), selected add-ons with custom quantities in one column, and a separate second column showing standard exclusions (un-checked, marked "Billed separately").
                </p>
              </button>
            </div>

            <div className="pt-4 border-t flex justify-start">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 4: PRINTABLE BILL PREVIEW
      ════════════════════════════════════════════════════════════ */}
      {step === 4 && selectedPackage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Customization Panel (only on screen when format is detailed) */}
          {billingFormat === "detailed" && (
            <div className="lg:col-span-4 space-y-4 print-hide">
              <Card className="glass-panel border-slate-200 shadow-md">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b p-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-850 dark:text-slate-100 font-sans">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                    Edit Exclusions / Add-ons
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  <p className="text-[11px] text-muted-foreground font-sans">
                    Check items to include them as active bill charges. Unchecked items show as exclusions.
                  </p>
                  <div className="space-y-2.5">
                    {detailedItemsList.map((item, idx) => {
                      const sel = detailedSelections[item.name] || { checked: false, qty: 1 }
                      return (
                        <div key={idx} className="flex flex-col p-2.5 border rounded-lg bg-white dark:bg-slate-900 shadow-sm gap-2 font-sans">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={sel.checked}
                              onChange={(e) => {
                                setDetailedSelections(prev => ({
                                  ...prev,
                                  [item.name]: { ...prev[item.name], checked: e.target.checked }
                                }))
                              }}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                {item.name.split("\n").join(" ")}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-primary font-bold">
                                  {item.price > 0 ? formatCurrency(item.price) : "No Charge"}
                                </span>
                                {item.note && (
                                  <span className="text-[9px] text-muted-foreground font-semibold">
                                    ({item.note})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {sel.checked && item.hasQty && (
                            <div className="flex items-center gap-2 justify-end pt-1 border-t border-dashed">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">
                                Qty ({item.qtyLabel}):
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={sel.qty}
                                onChange={(e) => {
                                  const val = Math.max(1, parseInt(e.target.value) || 1)
                                  setDetailedSelections(prev => ({
                                    ...prev,
                                    [item.name]: { ...prev[item.name], qty: val }
                                  }))
                                }}
                                className="w-16 h-7 border rounded text-center text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Printable Invoice Column */}
          <div className={billingFormat === "detailed" ? "lg:col-span-8 w-full space-y-6" : "lg:col-span-12 w-full space-y-6"}>
            
            {/* Action Row - Hidden on print */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 print-hide">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary text-primary font-bold font-sans">
                  Format: {billingFormat === "inline" ? "Inline Payment" : "Detailed Payment"}
                </Badge>
                <span className="text-xs text-muted-foreground font-sans">Verify details below before printing.</span>
              </div>
              
              <div className="flex items-center gap-2.5 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setStep(3)} className="h-9">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 border-slate-250 hover:bg-slate-100">
                  <Printer className="h-4 w-4 mr-1.5" /> Print Bill
                </Button>
                <Button size="sm" onClick={handleConfirmAndGenerate} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm & Generate Bill
                </Button>
              </div>
            </div>

            {/* Hospital Invoice Sheet Container */}
            <div
              id="printable-invoice-container"
              className="a4-invoice-sheet p-8 relative print:p-0 print:border-none print:shadow-none print:rounded-none"
            >
              <div className="flex-grow">
              {/* Letterhead Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo.jpeg" alt="ASCAS Logo" className="h-12 w-12 object-contain" />
                    <div className="flex flex-col">
                      <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight leading-none">
                        ASCAS FERTILITY & WOMEN'S CENTER
                      </h2>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic font-medium leading-none">
                    Doctor-led. Structured systems. Personal touch.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">
                    No 15, Healthcare Colony, GST Road, Chennai, Tamil Nadu
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none">
                    GSTIN: 33ASCAS1234F1Z5 · Tel: +91 44 2244 8888 · support@ascasfertility.in
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-primary text-primary-foreground text-xs font-black px-4 py-1.5 rounded-lg tracking-wider uppercase">
                    ESTIMATE INVOICE
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-semibold font-mono">
                    Bill No: {billNo}
                  </p>
                  <div className="flex items-center gap-1 justify-end text-[10px] text-slate-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>Date: {formatDate(billDate)}</span>
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Block */}
              <div className="grid grid-cols-2 gap-4 border-b py-5 bg-slate-50/50 dark:bg-slate-900/10 px-4 mt-4 rounded-xl">
                <div className="space-y-1 text-xs">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Patient Details</p>
                  <p className="text-sm font-extrabold text-slate-850 dark:text-slate-150">{patientName}</p>
                  <p className="text-slate-500 font-semibold font-mono">File ID: {patientId}</p>
                  <p className="text-slate-500">Age: {age} years</p>
                </div>
                <div className="text-right space-y-1 text-xs">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Clinical details</p>
                  <p className="text-sm font-bold text-slate-750 dark:text-slate-200">Consultant: {getDoctorName()}</p>
                  <p className="text-primary font-semibold text-[11px] mt-2">
                    Format: {billingFormat === "inline" ? "Inline Payment Plan" : "Detailed Statement"}
                  </p>
                </div>
              </div>

              {/* Items calculation summary table */}
              <div className="mt-6">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b-2 pb-2 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="pb-2">Billing Description</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Package item row */}
                    <tr>
                      <td className="py-3.5 pr-4 align-top">
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{selectedPackage.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{selectedPackage.description}</p>
                        
                        {/* INLINE format: Render Billing Note */}
                        {billingFormat === "inline" && selectedPackage.billingNote && (
                          <div className="mt-2 text-[10px] text-primary bg-primary/5 p-2 rounded-lg border border-primary/10">
                            <span className="font-bold uppercase text-[9px] tracking-wide block mb-0.5">Coverage Summary:</span>
                            {selectedPackage.billingNote}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 text-center font-bold align-top">1</td>
                      <td className="py-3.5 text-right font-extrabold text-slate-800 dark:text-slate-100 align-top">
                        {formatCurrency(packageAmount)}
                      </td>
                    </tr>

                    {/* Add-ons / Exclusions rows */}
                    {billingFormat === "detailed" && (
                      detailedItemsList
                        .filter(item => {
                          const sel = detailedSelections[item.name]
                          return sel && sel.checked
                        })
                        .map((item, idx) => {
                          const sel = detailedSelections[item.name]
                          return (
                            <tr key={`det-${idx}`}>
                              <td className="py-3 pr-4">
                                <p className="font-bold text-slate-750 dark:text-slate-200">
                                  {item.name.split("\n").join(" ")}
                                </p>
                                {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
                              </td>
                              <td className="py-3 text-center font-bold">{sel.qty}</td>
                              <td className="py-3 text-right font-bold text-slate-750 dark:text-slate-200">
                                {item.price > 0 ? formatCurrency(item.price * sel.qty) : "As applicable"}
                              </td>
                            </tr>
                          )
                        })
                    )}
                    
                    {selectedAddOns.map(item => (
                      <tr key={item.addon.id}>
                        <td className="py-3 pr-4">
                          <p className="font-bold text-slate-750 dark:text-slate-200">{item.addon.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.addon.category} Add-on</p>
                        </td>
                        <td className="py-3 text-center font-bold">{item.qty}</td>
                        <td className="py-3 text-right font-bold text-slate-750 dark:text-slate-200">
                          {formatCurrency(item.addon.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inclusions & Exclusions — two-column balanced layout */}
              {(selectedPackage.inclusionsList?.length || selectedPackage.freeMonitoringList?.length || exclusions.length) ? (
                <div className="mt-6 grid grid-cols-2 gap-4">

                  {/* LEFT: Inclusions and Free Monitoring */}
                  <div className="flex flex-col gap-4">
                    {selectedPackage.inclusionsList && selectedPackage.inclusionsList.length > 0 && (
                      <div className="border border-emerald-200 bg-emerald-50/30 p-3 rounded-xl">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                          <span>✓</span> Inclusions (All Covered)
                        </p>
                        <ul className="list-none space-y-1">
                          {selectedPackage.inclusionsList.map((inc, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <span className="mt-0.5 shrink-0 h-3.5 w-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                              <span className="leading-snug">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPackage.freeMonitoringList && selectedPackage.freeMonitoringList.length > 0 && (
                      <div className="border border-blue-200 bg-blue-50/30 p-3 rounded-xl">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1">
                          <span>★</span> Free Monitoring
                        </p>
                        <ul className="list-none space-y-1">
                          {selectedPackage.freeMonitoringList.map((inc, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <span className="mt-0.5 shrink-0 h-3.5 w-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">★</span>
                              <span className="leading-snug">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Exclusions and Policies */}
                  <div className="flex flex-col gap-4">
                    {exclusions.length > 0 && (
                      <div className="border border-rose-200 bg-rose-50/30 p-3 rounded-xl">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1">
                          <span>✕</span> Exclusions (Billed Separately)
                        </p>
                        <ul className="list-none space-y-1">
                          {exclusions.map((excl, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                              <span className="mt-0.5 shrink-0 h-3.5 w-3.5 bg-rose-400 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✕</span>
                              <span className="leading-snug">{excl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPackage.policiesList && selectedPackage.policiesList.length > 0 && (
                      <div className="border border-slate-200 bg-slate-50/50 p-3 rounded-xl">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1">
                          <span>ℹ</span> Storage Policy
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          {selectedPackage.policiesList.map((pol, i) => (
                            <li key={i} className="text-[11px] text-slate-600 leading-snug">
                              {pol}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                </div>
              ) : null}



              {/* Calculations Totals block */}
              <div className="mt-6 border-t-2 border-slate-100 pt-4 flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  
                  {billingFormat === "detailed" && (
                    <div className="flex justify-between text-slate-500">
                      <span className="font-semibold">Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-455 font-bold">
                      <span>Discount{discountNote ? ` (${discountNote})` : ""}:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base font-extrabold text-primary border-t pt-2">
                    <span>GRAND TOTAL:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Billing Rule Disclaimer Note (MUST appear on every bill) */}
              <div className="mt-6 border-t pt-4 text-[10px] text-slate-500 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200">
                <p className="font-bold uppercase text-[9px] tracking-wide text-slate-600 mb-1">Clinic Billing Rule:</p>
                <p className="italic leading-normal">
                  Consultation and monitoring scans included in OPU / egg collection packages and FET packages should not be billed separately. Room stay is optional unless specifically advised.
                </p>
                {billingFormat === "detailed" && (
                  <p className="mt-2 font-medium">
                    Note: Final bill may vary only when additional investigations, medications, room stay, or clinician-approved add-on is documented.
                  </p>
                )}
              </div>

              {/* Payment Status Line */}
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b pb-4">
                <span>Payment status:</span>
                <span className="text-amber-600">Pending Reconciliation</span>
              </div>

              </div>{/* end flex-grow */}

              {/* Signatures block — pinned to bottom */}
              <div className="mt-8 grid grid-cols-2 gap-12 text-xs">
                <div className="text-center space-y-6">
                  <div className="h-10" />
                  <div className="border-t border-dashed border-slate-300" />
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Patient / Guardian Signature</p>
                </div>
                <div className="text-center space-y-6">
                  <div className="h-10" />
                  <div className="border-t border-dashed border-slate-300" />
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Authorized Signatory / Reception Desk</p>
                </div>
              </div>

              {/* Footer stamp */}
              <div className="mt-4 border-t pt-2 text-center text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                Computer Generated Invoice Slip · ASCAS Fertility &amp; Women's Center · GST Road, Chennai
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 5: SUCCESS DONE
      ════════════════════════════════════════════════════════════ */}
      {step === 5 && selectedPackage && (
        <Card className="glass-panel border-slate-200 shadow-xl max-w-lg mx-auto print-hide">
          <CardContent className="py-12 space-y-6 text-center">
            
            <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-850 dark:text-slate-100">Invoice Generated successfully!</h2>
              <p className="text-xs text-muted-foreground mt-1">
                The estimate slip was successfully appended to the local billing records.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-5 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Bill No:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{billNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Patient Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Patient File ID:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350">{patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Primary Package:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350 truncate max-w-xs">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Treating Doctor:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350">{getDoctorName()}</span>
              </div>
              <div className="flex justify-between border-t pt-2.5 text-primary text-sm font-extrabold">
                <span>Grand Total:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4">
              <Button onClick={() => navigate("/bills")} className="w-full h-10">
                View All Bills
              </Button>
              <Button variant="outline" onClick={resetWizard} className="w-full h-10">
                Create Another Bill
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="w-full h-10">
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
