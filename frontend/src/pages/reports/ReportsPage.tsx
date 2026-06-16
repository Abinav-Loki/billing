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
  CalendarRange
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
  const [activeTab, setActiveTab] = React.useState<"collection" | "packages" | "addons" | "daily">("daily")
  const [startDate, setStartDate] = React.useState("2026-05-01")
  const [endDate, setEndDate] = React.useState("2026-06-30")
  const [selectedDoctor, setSelectedDoctor] = React.useState<string>("all")
  const [selectedPackage, setSelectedPackage] = React.useState<string>("all")

  const uniqueDoctors = React.useMemo(() => Array.from(new Set(mockBills.map(b => b.doctorName))), [])
  const uniquePackages = React.useMemo(() => Array.from(new Set(mockBills.map(b => b.packageName))), [])

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

  const handleExportCSV = () => {
    alert("Exporting CSV report data (Integration placeholder)...")
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
      </div>

      {/* TAB 1: Collections */}
      {activeTab === "collection" && (
        <div className="space-y-6">
          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Collections</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{formatCurrency(3100000)}</h3>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-3">
                  <TrendingUp className="h-3 w-3" /> +15% vs last month
                </span>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Estimates Drafted</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">110 Bills</h3>
                <span className="text-[10px] text-slate-500 block mt-3">Avg bill size: {formatCurrency(28000)}</span>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Payments Reconciled</p>
                <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{formatCurrency(2820000)}</h3>
                <span className="text-[10px] text-amber-500 font-semibold block mt-3">91% Clearance ratio</span>
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
                  <Pie data={packageDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {packageDistribution.map((entry, idx) => (
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
                  {packageDistribution.map((item, idx) => {
                    const totalSum = packageDistribution.reduce((acc, curr) => acc + curr.value, 0)
                    const percent = ((item.value / totalSum) * 100).toFixed(1)
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
                <BarChart data={addonUsage}>
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
                  {addonUsage.map((addon, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{addon.name}</TableCell>
                      <TableCell>{addon.qty} times</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(addon.price)}</TableCell>
                    </TableRow>
                  ))}
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
    </div>
  )
}
export default ReportsPage
