import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, mockPackages, mockAddOns } from "../../lib/mockData"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts"
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  CreditCard,
  Percent,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  CalendarRange,
  Users
} from "lucide-react"

// Analytics charts Mock Data
const monthlyCollection = [
  { name: "Jan", revenue: 1250000, bills: 45 },
  { name: "Feb", revenue: 1450000, bills: 52 },
  { name: "Mar", revenue: 1950000, bills: 68 },
  { name: "Apr", revenue: 2200000, bills: 75 },
  { name: "May", revenue: 2800000, bills: 92 },
  { name: "Jun", revenue: 3100000, bills: 110 }
]

const packageDistribution = [
  { name: "IVF Cycles", value: 650000, color: "#115e59" },
  { name: "Donor Egg", value: 440000, color: "#0d9488" },
  { name: "ICSI Bundle", value: 370000, color: "#0ea5e9" },
  { name: "Cryostorage", value: 125000, color: "#6366f1" },
  { name: "Pooling Cycles", value: 260000, color: "#a855f7" }
]

const addonUsage = [
  { name: "Laser Hatching", qty: 25, price: 625000 },
  { name: "Blastocyst Cult", qty: 42, price: 630000 },
  { name: "PGS Screen", qty: 12, price: 360000 },
  { name: "OT Sedation", qty: 38, price: 304000 },
  { name: "Specialized Glue", qty: 30, price: 300000 }
]

export function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<"collection" | "packages" | "addons" | "daily" | "consultants">("daily")
  const [startDate, setStartDate] = React.useState("2026-05-01")
  const [endDate, setEndDate] = React.useState("2026-06-30")
  const [selectedDoctor, setSelectedDoctor] = React.useState<string>("all")
  const [selectedPackage, setSelectedPackage] = React.useState<string>("all")
  const [filterUHID, setFilterUHID] = React.useState("")
  const [filterService, setFilterService] = React.useState("")

  const uniqueDoctors = React.useMemo(() => {
    const set = new Set<string>()
    mockBills.forEach(b => {
      if (b.doctorName) set.add(b.doctorName)
      if (b.consultantCharges) {
        b.consultantCharges.forEach(c => set.add(c.doctorName))
      }
    })
    return Array.from(set)
  }, [])

  const uniquePackages = React.useMemo(() => Array.from(new Set(mockBills.map(b => b.packageName))), [])

  const consultantRevenueRecords = React.useMemo(() => {
    const records: {
      date: string
      doctorName: string
      uhid: string
      patientName: string
      serviceName: string
      category: string
      amount: number
    }[] = []

    mockBills.forEach(bill => {
      // 1. Treatment Package (from the bill's primary doctorName)
      if (bill.doctorName) {
        let packageName = bill.packageName || "Standard IVF Package"
        let packageAmt = bill.packagePrice || 0
        if (bill.packageName === "Custom Bill" && bill.customLineItems) {
          packageAmt = bill.customLineItems.reduce((s, r) => s + r.qty * r.price, 0)
        }
        records.push({
          date: bill.date,
          doctorName: bill.doctorName,
          uhid: bill.uhid,
          patientName: bill.patientName,
          serviceName: packageName,
          category: "Package / Base Service",
          amount: packageAmt
        })
      }

      // 2. Add-ons (from bill.doctorName)
      if (bill.doctorName && bill.addOns && bill.addOns.length > 0) {
        bill.addOns.forEach(addon => {
          records.push({
            date: bill.date,
            doctorName: bill.doctorName,
            uhid: bill.uhid,
            patientName: bill.patientName,
            serviceName: addon.name,
            category: "Add-on",
            amount: addon.price
          })
        })
      }

      // 3. Custom Line Items (from bill.doctorName)
      if (bill.doctorName && bill.customLineItems && bill.customLineItems.length > 0) {
        bill.customLineItems.forEach(item => {
          records.push({
            date: bill.date,
            doctorName: bill.doctorName,
            uhid: bill.uhid,
            patientName: bill.patientName,
            serviceName: item.name,
            category: item.category || "Custom Service",
            amount: item.total || (item.qty * item.price)
          })
        })
      }

      // 4. Consultant Fee Charges (from charge.doctorName)
      if (bill.consultantCharges && bill.consultantCharges.length > 0) {
        bill.consultantCharges.forEach(charge => {
          records.push({
            date: bill.date,
            doctorName: charge.doctorName,
            uhid: bill.uhid,
            patientName: bill.patientName,
            serviceName: charge.type,
            category: "Consultation Fee",
            amount: charge.amount
          })
        })
      }
    })

    return records
  }, [])

  const filteredConsultantRevenue = React.useMemo(() => {
    return consultantRevenueRecords.filter(r => {
      const matchDoc = selectedDoctor === "all" || r.doctorName.toLowerCase().includes(selectedDoctor.toLowerCase())
      const matchDate = r.date >= startDate && r.date <= endDate
      const matchUhid = !filterUHID.trim() || r.uhid.toLowerCase().includes(filterUHID.toLowerCase())
      const matchService = !filterService.trim() || r.serviceName.toLowerCase().includes(filterService.toLowerCase())
      return matchDoc && matchDate && matchUhid && matchService
    })
  }, [consultantRevenueRecords, selectedDoctor, startDate, endDate, filterUHID, filterService])

  const totalConsultantRevenueSum = React.useMemo(() => {
    return filteredConsultantRevenue.reduce((sum, r) => sum + r.amount, 0)
  }, [filteredConsultantRevenue])

  const handleExportConsultantCSV = () => {
    const headers = ["Date", "Consultant Name", "Patient UHID", "Patient Name", "Service / Procedure", "Category", "Amount Collected (INR)"]
    const rows = filteredConsultantRevenue.map(r => [
      r.date,
      `"${r.doctorName.replace(/"/g, '""')}"`,
      r.uhid,
      `"${r.patientName.replace(/"/g, '""')}"`,
      `"${r.serviceName.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      r.amount
    ])
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `consultant_revenue_report_${startDate}_to_${endDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintConsultantReport = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    const tableRowsHtml = filteredConsultantRevenue.map((r, i) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${i + 1}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.date}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; color: #115e59;">${r.doctorName}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">${r.uhid}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.patientName}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.serviceName}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.category}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">₹${r.amount.toLocaleString("en-IN")}</td>
      </tr>
    `).join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Per Consultant Revenue Report</title>
          <style>
            body { font-family: sans-serif; color: #1e293b; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; text-align: left; }
            h2 { color: #0f172a; margin-bottom: 5px; }
            .header-info { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            .totals { margin-top: 20px; text-align: right; font-weight: bold; font-size: 14px; color: #0d9488; }
          </style>
        </head>
        <body>
          <h2>Per Consultant Revenue Report</h2>
          <div class="header-info">
            Period: ${startDate} to ${endDate} | Generated on: ${new Date().toLocaleDateString("en-IN")}
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Date</th>
                <th>Consultant Name</th>
                <th>Patient UHID</th>
                <th>Patient Name</th>
                <th>Service / Procedure</th>
                <th>Category</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          <div class="totals">
            Total Revenue Collected: ₹${totalConsultantRevenueSum.toLocaleString("en-IN")}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const filteredBills = React.useMemo(() => {
    return mockBills.filter(b => {
      const matchDoc = selectedDoctor === "all" || b.doctorName === selectedDoctor
      const matchPkg = selectedPackage === "all" || b.packageName === selectedPackage
      const dateMatch = b.date >= startDate && b.date <= endDate
      return matchDoc && matchPkg && dateMatch
    })
  }, [selectedDoctor, selectedPackage, startDate, endDate])

  const dailyCollection = React.useMemo(() => {
    const map = new Map<string, number>()
    filteredBills.forEach(b => {
      map.set(b.date, (map.get(b.date) || 0) + b.grandTotal)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }))
  }, [filteredBills])

  const dailyCollectionTable = React.useMemo(() => {
    const map = new Map<string, { revenue: number, count: number }>()
    filteredBills.forEach(b => {
      const existing = map.get(b.date) || { revenue: 0, count: 0 }
      map.set(b.date, { revenue: existing.revenue + b.grandTotal, count: existing.count + 1 })
    })
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, data]) => ({ date, ...data }))
  }, [filteredBills])

  // Dynamic Package Distribution
  const packageDistributionDynamic = React.useMemo(() => {
    const map = new Map<string, number>()
    filteredBills.forEach(b => {
      const key = b.packageName || "Custom Bill"
      map.set(key, (map.get(key) || 0) + b.grandTotal)
    })
    const colors = ["#115e59", "#0d9488", "#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"]
    return Array.from(map.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
  }, [filteredBills])

  // Dynamic Addon Usage Log
  const addonUsageDynamic = React.useMemo(() => {
    const map = new Map<string, { qty: number, price: number }>()
    filteredBills.forEach(b => {
      if (b.addOns) {
        b.addOns.forEach(addon => {
          const qtyMatch = addon.name.match(/\(x(\d+)\)/)
          const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1
          const baseName = addon.name.replace(/\s*\(x\d+\)/, "")
          const existing = map.get(baseName) || { qty: 0, price: 0 }
          map.set(baseName, {
            qty: existing.qty + qty,
            price: existing.price + (addon.price || 0)
          })
        })
      }
    })
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data
    }))
  }, [filteredBills])

  // Summary Metrics calculations
  const summaryMetrics = React.useMemo(() => {
    const totalGrandTotal = filteredBills.reduce((s, b) => s + b.grandTotal, 0)
    const totalReconciled = filteredBills.reduce((s, b) => s + (b.amountPaid || 0), 0)
    const clearanceRatio = totalGrandTotal > 0 ? Math.round((totalReconciled / totalGrandTotal) * 100) : 0
    return {
      totalGrandTotal,
      totalReconciled,
      clearanceRatio,
      count: filteredBills.length,
      avgBill: filteredBills.length > 0 ? Math.round(totalGrandTotal / filteredBills.length) : 0
    }
  }, [filteredBills])

  const handleExportCSV = () => {
    let csv = "\uFEFF" // UTF-8 BOM
    csv += "Bill No,Patient Name,Patient UHID,Bill Date,Doctor Name,Package Name,Package Price,Discount Total,GST Total,Grand Total,Reconciled Amount,Pending Balance,Payment Status\n"
    
    filteredBills.forEach(b => {
      const row = [
        b.billNo,
        `"${(b.patientName || "").replace(/"/g, '""')}"`,
        `"${(b.uhid || "").replace(/"/g, '""')}"`,
        b.date,
        `"${(b.doctorName || "").replace(/"/g, '""')}"`,
        `"${(b.packageName || "").replace(/"/g, '""')}"`,
        b.packagePrice || 0,
        b.discount || 0,
        b.taxAmount || 0,
        b.grandTotal || 0,
        b.amountPaid || 0,
        b.paymentBalance || 0,
        b.status
      ].join(",")
      csv += row + "\n"
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", `ASCAS_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Financial Reports & Insights</h1>
          <p className="text-sm text-muted-foreground">Audit inpatient revenue pipelines, collection ratios, and procedure tracking logs</p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          <span>Export Excel/CSV</span>
        </Button>
      </div>

      {/* Date Filtering Bar */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4 text-xs font-semibold text-slate-650 dark:text-slate-350 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span>Filters:</span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <Calendar className="h-3.5 w-3.5" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-32 h-8 text-[11px]"
            />
            <span>to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-32 h-8 text-[11px]"
            />
          </div>

          <div className="flex items-center gap-2 md:ml-4">
            <label>Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All Doctors</option>
              {uniqueDoctors.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label>Package:</label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="h-8 w-40 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All Packages</option>
              {uniquePackages.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs list */}
      <div className="flex gap-2 border-b pb-1">
        <button
          onClick={() => setActiveTab("daily")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === "daily"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-slate-800"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Daily Collection</span>
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === "collection"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-slate-800"
          }`}
        >
          <CalendarRange className="h-4 w-4" />
          <span>Collections Summary</span>
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === "packages"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-slate-800"
          }`}
        >
          <PieIcon className="h-4 w-4" />
          <span>Package Revenues</span>
        </button>
        <button
          onClick={() => setActiveTab("addons")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === "addons"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Add-on Usage Log</span>
        </button>
        <button
          onClick={() => setActiveTab("consultants")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === "consultants"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-slate-800"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Per Consultant Revenue</span>
        </button>
      </div>

      {/* TAB 1: Collections */}
      {activeTab === "collection" && (
        <div className="space-y-6">
          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Period Collections (Paid)</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{formatCurrency(summaryMetrics.totalReconciled)}</h3>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-3">
                  <TrendingUp className="h-3 w-3" /> Reconciled payment logs
                </span>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Estimates Drafted</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{summaryMetrics.count} Bills</h3>
                <span className="text-[10px] text-slate-500 block mt-3">Avg bill size: {formatCurrency(summaryMetrics.avgBill)}</span>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Revenue Value</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{formatCurrency(summaryMetrics.totalGrandTotal)}</h3>
                <span className="text-[10px] text-amber-500 font-semibold block mt-3">{summaryMetrics.clearanceRatio}% Clearance ratio</span>
              </CardContent>
            </Card>
          </div>

          {/* Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Monthly Collection Trend (H1 2026)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyCollection}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={11} stroke="#888888" tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 100000}L`} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Collection" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Package Revenue */}
      {activeTab === "packages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Package Allocations</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={packageDistributionDynamic.length > 0 ? packageDistributionDynamic : packageDistribution} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={70} 
                    paddingAngle={4} 
                    dataKey="value"
                  >
                    {(packageDistributionDynamic.length > 0 ? packageDistributionDynamic : packageDistribution).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Billing Breakdown by Clinical Category</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Treatment Category</TableHead>
                    <TableHead>Total Invoiced</TableHead>
                    <TableHead className="text-right">Share (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(packageDistributionDynamic.length > 0 ? packageDistributionDynamic : packageDistribution).map((item, idx) => {
                    const currentList = packageDistributionDynamic.length > 0 ? packageDistributionDynamic : packageDistribution
                    const totalSum = currentList.reduce((acc, curr) => acc + curr.value, 0)
                    const percent = totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : "0.0"
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-semibold flex items-center gap-2 mt-1">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </TableCell>
                        <TableCell className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(item.value)}</TableCell>
                        <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">{percent}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Add-on Usage */}
      {activeTab === "addons" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Add-on Item Quantities Utilized</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={addonUsageDynamic.length > 0 ? addonUsageDynamic : addonUsage}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="#008080" radius={[4, 4, 0, 0]} name="Qty Ordered" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Procedure Extra Ledger Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Times Triggered</TableHead>
                    <TableHead className="text-right">Estimated Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(addonUsageDynamic.length > 0 ? addonUsageDynamic : addonUsage).map((addon, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{addon.name}</TableCell>
                      <TableCell>{addon.qty} times</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(addon.price)}</TableCell>
                    </TableRow>
                  ))}
                  {(addonUsageDynamic.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4 italic font-semibold">
                        Showing default ledger logs (no active add-on bills matching filters).
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      {/* TAB: Daily Collection */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Daily Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCollection}>
                  <XAxis dataKey="date" fontSize={11} stroke="#888888" tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Daily Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Collection Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Total Bills</TableHead>
                    <TableHead className="text-right">Collection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCollectionTable.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{formatDate(item.date)}</TableCell>
                      <TableCell className="text-center">{item.count}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                  {dailyCollectionTable.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No collections found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: Per Consultant Revenue */}
      {activeTab === "consultants" && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Metric and Export Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Filtered Consultant Revenue</p>
              <h3 className="text-2xl font-black mt-1 text-primary">{formatCurrency(totalConsultantRevenueSum)}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredConsultantRevenue.length} revenue records found</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintConsultantReport}
                className="text-xs font-bold gap-1.5 h-9"
              >
                <span>🖨️</span> Print Report
              </Button>
              <Button
                onClick={handleExportConsultantCSV}
                className="text-xs font-bold gap-1.5 h-9 bg-primary text-white hover:bg-primary-hover"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Sub-Filters: UHID and Service name */}
          <Card className="glass-panel border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b px-5 py-3">
              <CardTitle className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Refine Tabular Records
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Filter by Patient UHID</label>
                <Input
                  type="text"
                  placeholder="e.g. UHID-2026-0001"
                  value={filterUHID}
                  onChange={e => setFilterUHID(e.target.value)}
                  className="h-8.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Filter by Service / Procedure</label>
                <Input
                  type="text"
                  placeholder="e.g. IVF, ICSI, Consultation..."
                  value={filterService}
                  onChange={e => setFilterService(e.target.value)}
                  className="h-8.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-900/40 border-b">
                    <TableRow>
                      <TableHead className="font-bold text-xs w-12 text-center">S.No.</TableHead>
                      <TableHead className="font-bold text-xs">Date</TableHead>
                      <TableHead className="font-bold text-xs">Consultant</TableHead>
                      <TableHead className="font-bold text-xs">Patient Details</TableHead>
                      <TableHead className="font-bold text-xs">Service / Procedure</TableHead>
                      <TableHead className="font-bold text-xs">Revenue Category</TableHead>
                      <TableHead className="font-bold text-xs text-right">Amount Collected</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultantRevenue.map((rec, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 text-xs">
                        <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{formatDate(rec.date)}</TableCell>
                        <TableCell className="font-bold text-teal-850 dark:text-teal-400">{rec.doctorName}</TableCell>
                        <TableCell>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{rec.patientName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{rec.uhid}</p>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700 dark:text-slate-350">{rec.serviceName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                            {rec.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary font-mono">
                          {formatCurrency(rec.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredConsultantRevenue.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground italic">
                          No consultant revenue records found matching the active filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
export default ReportsPage
