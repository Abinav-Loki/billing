import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { formatCurrency } from "../../lib/utils"
import {
  PACKAGE_MASTER,
  ADDON_MASTER,
  PACKAGE_CATEGORIES,
  PackageMaster,
  AddOnItem,
  PackageCategory,
  getPackagesByCategory,
} from "../../lib/billingMaster"
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Package,
  Sparkles,
  ToggleRight,
  Info,
  Plus,
} from "lucide-react"

export function PackagesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState<PackageCategory | "Add-ons" | "All">("All")
  const [expandedPackages, setExpandedPackages] = React.useState<string[]>([])
  
  const [selectedPackage, setSelectedPackage] = React.useState<PackageMaster | null>(null)
  const [selectedAddons, setSelectedAddons] = React.useState<AddOnItem[]>([])

  const toggleAddon = (addon: AddOnItem) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id)
      if (exists) {
        return prev.filter((a) => a.id !== addon.id)
      } else {
        return [...prev, addon]
      }
    })
  }

  const categoryColors: Record<string, string> = {
    "IVF / ICSI / FET": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    "Donor Programmes": "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
    "Surgical / Procedure Packages": "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    "Cryostorage / Oocyte / Sperm Cryopreservation": "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    "Embryo Pooling / Oocyte Accumulation": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    "Add-ons / Separate Billing Items": "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  }

  const lineItemCategoryColors: Record<string, string> = {
    Professional: "bg-violet-50 text-violet-700 dark:bg-violet-950/30",
    Diagnostics: "bg-sky-50 text-sky-700 dark:bg-sky-950/30",
    OT: "bg-amber-50 text-amber-700 dark:bg-amber-950/30",
    Anaesthesia: "bg-orange-50 text-orange-700 dark:bg-orange-950/30",
    Pharmacy: "bg-green-50 text-green-700 dark:bg-green-950/30",
    Lab: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30",
    Procedure: "bg-rose-50 text-rose-700 dark:bg-rose-950/30",
    Consumables: "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    Room: "bg-teal-50 text-teal-700 dark:bg-teal-950/30",
    Nursing: "bg-pink-50 text-pink-700 dark:bg-pink-950/30",
    Storage: "bg-blue-50 text-blue-700 dark:bg-blue-950/30",
    Genetics: "bg-purple-50 text-purple-700 dark:bg-purple-950/30",
    Donor: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/30",
    Admin: "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300",
    "F&B": "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30",
  }

  const toggleExpand = (id: string) =>
    setExpandedPackages((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))

  const filteredPackages = PACKAGE_MASTER.filter((pkg) => {
    const matchSearch =
      search === "" ||
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.id.toLowerCase().includes(search.toLowerCase()) ||
      pkg.category.toLowerCase().includes(search.toLowerCase())

    const matchCategory =
      activeCategory === "All" ||
      (activeCategory !== "Add-ons" && pkg.category === activeCategory)

    return matchSearch && matchCategory
  })

  const filteredAddOns = ADDON_MASTER.filter(
    (a) =>
      (activeCategory === "All" || activeCategory === "Add-ons") &&
      (search === "" || a.name.toLowerCase().includes(search.toLowerCase()))
  )

  // Stats
  const totalPackages = PACKAGE_MASTER.length
  const totalAddOns = ADDON_MASTER.filter((a) => a.status === "Active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Package & Add-on Master
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            ASCAS billing master — {totalPackages} packages · {totalAddOns} add-ons
          </p>
        </div>
        <Button onClick={() => navigate("/billing/new")} className="gap-2">
          <Plus className="h-4 w-4" /> New Bill
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "IVF / FET", value: getPackagesByCategory("IVF / ICSI / FET").length, color: "text-violet-600" },
          { label: "Donor", value: getPackagesByCategory("Donor Programmes").length, color: "text-pink-600" },
          { label: "Surgical", value: getPackagesByCategory("Surgical / Procedure Packages").length, color: "text-sky-600" },
          { label: "Cryo / Pooling", value: getPackagesByCategory("Cryostorage / Oocyte / Sperm Cryopreservation").length + getPackagesByCategory("Embryo Pooling / Oocyte Accumulation").length, color: "text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label} className="neumorphic-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">packages</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search packages, IDs, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All", ...PACKAGE_CATEGORIES.filter((c) => c !== "Add-ons / Separate Billing Items"), "Add-ons"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat === "Cryostorage / Oocyte / Sperm Cryopreservation"
                ? "Cryostorage"
                : cat === "Embryo Pooling / Oocyte Accumulation"
                ? "Pooling"
                : cat === "Surgical / Procedure Packages"
                ? "Surgical"
                : cat}
            </button>
          )
        )}
      </div>

      {/* Package Cards */}
      {(activeCategory === "All" || activeCategory !== "Add-ons") && (
        <div className="space-y-3">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No packages match your search.</div>
          ) : (
            filteredPackages.map((pkg) => {
              const isExpanded = expandedPackages.includes(pkg.id)
              const isPkgSelected = selectedPackage?.id === pkg.id
              return (
                <Card 
                  key={pkg.id} 
                  className={`overflow-hidden transition-all duration-300 ${
                    isPkgSelected 
                      ? "neumorphic-card border-primary/60 dark:border-primary/50 shadow-md" 
                      : "neumorphic-card"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(pkg.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between p-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">{pkg.id}</span>
                          {isPkgSelected && (
                            <Badge variant="success" className="text-[9px] py-0 px-1.5 h-4">Selected</Badge>
                          )}
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${categoryColors[pkg.category] ?? "bg-slate-100 text-slate-600"}`}>
                            {pkg.category === "Cryostorage / Oocyte / Sperm Cryopreservation"
                              ? "Cryostorage"
                              : pkg.category === "Embryo Pooling / Oocyte Accumulation"
                              ? "Pooling"
                              : pkg.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{pkg.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pkg.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-extrabold text-primary">{formatCurrency(pkg.fullPaymentAmount)}</p>
                        <p className="text-[10px] text-muted-foreground">{pkg.lineItems.length} components</p>
                        <div className="mt-1">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 pb-4 pt-3 space-y-4">
                      {/* Billing methods */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs">
                          <ToggleRight className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">Full Payment</p>
                            <p className="text-primary font-extrabold text-base">{formatCurrency(pkg.fullPaymentAmount)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs">
                          <ToggleRight className="h-4 w-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">Item-wise Billing</p>
                            <p className="text-amber-700 dark:text-amber-400 font-semibold">
                              {formatCurrency(pkg.lineItems.filter(l => !l.isOptional).reduce((s, l) => s + l.price, 0))} base
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Duplicate block list */}
                      {pkg.duplicateBlockList && (
                        <div className="flex items-start gap-2 text-xs text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 p-3 rounded-xl">
                          <Info className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>
                            <strong>Duplicate Block (Full Payment):</strong>{" "}
                            {pkg.duplicateBlockList.join(" · ")}
                          </span>
                        </div>
                      )}

                      {/* Line items table */}
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                          Component Breakdown ({pkg.lineItems.length} items)
                        </p>
                        <div className="border rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                          {pkg.lineItems.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between px-3 py-2 text-xs ${
                                item.isOptional ? "opacity-60" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {item.isOptional ? (
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                ) : (
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                )}
                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                  {item.name}
                                </span>
                                {item.note && (
                                  <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">
                                    — {item.note}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    lineItemCategoryColors[item.category] ?? "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {item.category}
                                </span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 w-20 text-right">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={isPkgSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPackage(isPkgSelected ? null : pkg)
                          }}
                          className={`gap-1.5 text-xs ${isPkgSelected ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0" : ""}`}
                        >
                          {isPkgSelected ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" /> Selected
                            </>
                          ) : (
                            <>
                              <Package className="h-3.5 w-3.5" /> Select Package
                            </>
                          )}
                        </Button>
                        {!isPkgSelected && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/billing/new?packageId=${pkg.id}`)
                            }}
                            className="gap-1.5 text-xs font-bold"
                          >
                            Bill Instantly
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Add-ons section */}
      {(activeCategory === "All" || activeCategory === "Add-ons") && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Add-ons / Separate Billing Items
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAddOns.map((addon) => {
              const isAddonSelected = selectedAddons.some((a) => a.id === addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`w-full text-left rounded-xl transition-all duration-300 neumorphic-card ${
                    isAddonSelected
                      ? "neumorphic-inset border-primary/60 dark:border-primary/55"
                      : "neumorphic-card-interactive"
                  }`}
                >
                  <CardContent className="pt-4 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] font-mono text-muted-foreground">{addon.id}</p>
                          {isAddonSelected && (
                            <Badge variant="success" className="text-[9px] py-0 px-1 h-3.5">Selected</Badge>
                          )}
                        </div>
                        <h4 className={`font-bold text-sm mt-0.5 leading-snug ${isAddonSelected ? "text-primary font-extrabold" : "text-slate-800 dark:text-slate-100"}`}>
                          {addon.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${lineItemCategoryColors[addon.category] ?? "bg-slate-100 text-slate-600"}`}>
                            {addon.category}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${addon.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700"}`}>
                            {addon.status}
                          </span>
                        </div>
                      </div>
                      <p className={`text-base font-extrabold shrink-0 ${isAddonSelected ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>{formatCurrency(addon.price)}</p>
                    </div>
                  </CardContent>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Floating Action Strip for Billing */}
      {(selectedPackage || selectedAddons.length > 0) && (
        <div className="fixed bottom-6 left-6 right-6 md:left-72 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 neumorphic-inset rounded-xl text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Selections for Billing</h4>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                {selectedPackage && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    {selectedPackage.name}
                  </span>
                )}
                {selectedAddons.length > 0 && (
                  <span className="bg-orange-100 dark:bg-orange-950/45 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-semibold">
                    {selectedAddons.length} Add-on{selectedAddons.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedPackage(null)
                setSelectedAddons([])
              }}
              className="text-muted-foreground hover:text-slate-800 dark:hover:text-slate-100"
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                const pkgQuery = selectedPackage ? `packageId=${selectedPackage.id}` : ""
                const addonsQuery = selectedAddons.length > 0 ? `addonIds=${selectedAddons.map(a => a.id).join(",")}` : ""
                const query = [pkgQuery, addonsQuery].filter(Boolean).join("&")
                navigate(`/billing/new?${query}`)
              }}
              className="gap-2 font-bold w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Create Bill
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PackagesPage
