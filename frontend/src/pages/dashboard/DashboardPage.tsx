import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockPatients, mockBills } from "../../lib/mockData"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts"
import {
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  UserPlus,
  PlusCircle,
  Search,
  Printer,
  Calendar,
  ChevronRight,
  TrendingDown,
  Activity
} from "lucide-react"

// Mock Chart Data
const revenueData = [
  { name: "Mon", amount: 155000 },
  { name: "Tue", amount: 235000 },
  { name: "Wed", amount: 120000 },
  { name: "Thu", amount: 320000 },
  { name: "Fri", amount: 160000 },
  { name: "Sat", amount: 280000 },
  { name: "Sun", amount: 90000 }
]

const packageRevenueData = [
  { name: "IVF / ICSI", value: 335000, color: "#008080" },
  { name: "Donor Cycle", value: 220000, color: "#0ea5e9" },
  { name: "Surgical", value: 70000, color: "#6366f1" },
  { name: "Cryo Storage", value: 50000, color: "#f59e0b" }
]

export function DashboardPage() {
  const navigate = useNavigate()
  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false)
  const [printSearchQuery, setPrintSearchQuery] = React.useState("")
  const [quickSearchQuery, setQuickSearchQuery] = React.useState("")

  const filteredBills = mockBills.filter(bill =>
    bill.billNo.toLowerCase().includes(printSearchQuery.toLowerCase()) ||
    bill.patientName.toLowerCase().includes(printSearchQuery.toLowerCase())
  )

  const handlePrintDuplicate = (billNo: string) => {
    setIsPrintModalOpen(false)
    navigate(`/bills/${billNo}?print=true`)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-emerald-950 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Activity className="h-64 w-64 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold">Good Day, Hospital Admin Desk</h2>
          <p className="text-xs text-slate-300">Welcome to the ASCAS Inpatient Billing System portal. Manage packages, billings, and collections seamlessly.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg text-xs border border-white/10 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-250">System online & synced</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Bills Today</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">8</h3>
              </div>
              <div className="p-3 neumorphic-inset rounded-xl text-teal-600 dark:text-teal-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="font-semibold">+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Revenue Today</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(440000)}</h3>
              </div>
              <div className="p-3 neumorphic-inset rounded-xl text-sky-600 dark:text-sky-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="font-semibold">+24% from weekly avg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bills This Month</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">124</h3>
              </div>
              <div className="p-3 neumorphic-inset rounded-xl text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-rose-600">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="font-semibold">-3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Payments</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(280000)}</h3>
              </div>
              <div className="p-3 neumorphic-inset rounded-xl text-amber-600 dark:text-amber-450">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-amber-600">
              <span className="font-semibold">2 pending approvals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/patients/new")}
            className="flex items-center gap-3.5 p-4 rounded-xl neumorphic-card neumorphic-card-interactive text-left group"
          >
            <div className="p-2.5 neumorphic-inset text-teal-600 dark:text-teal-400 rounded-lg group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">Register Patient</p>
              <span className="text-[10px] text-muted-foreground">Add new record to database</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/billing/new")}
            className="flex items-center gap-3.5 p-4 rounded-xl neumorphic-card neumorphic-card-interactive text-left group"
          >
            <div className="p-2.5 neumorphic-inset text-sky-600 dark:text-sky-400 rounded-lg group-hover:scale-110 transition-transform">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">Create New Bill</p>
              <span className="text-[10px] text-muted-foreground">Run billing package wizard</span>
            </div>
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-3.5 p-4 rounded-xl neumorphic-card neumorphic-card-interactive text-left group"
          >
            <div className="p-2.5 neumorphic-inset text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">Search Patient</p>
              <span className="text-[10px] text-muted-foreground">Query details via ID or UHID</span>
            </div>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-3.5 p-4 rounded-xl neumorphic-card neumorphic-card-interactive text-left group"
          >
            <div className="p-2.5 neumorphic-inset text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">Print Duplicate Bill</p>
              <span className="text-[10px] text-muted-foreground">Reprint existing receipts</span>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Weekly Collection Trend</CardTitle>
              <p className="text-xs text-muted-foreground">Hospital bill payments captured this week</p>
            </div>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008080" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                <Area type="monotone" dataKey="amount" stroke="#008080" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Package Revenue Share */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Revenue by Package Type</CardTitle>
            <p className="text-xs text-muted-foreground">Category-wise distributions</p>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-between">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {packageRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {packageRevenueData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 border border-slate-100 dark:border-slate-800 p-2 rounded-lg">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground truncate">{item.name}</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Inpatient Admissions</CardTitle>
              <p className="text-xs text-muted-foreground">Recently registered ward patient entries</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1" onClick={() => navigate("/patients")}>
              <span>All Patients</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UHID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Consulting Doctor</TableHead>
                  <TableHead>Admitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.slice(0, 4).map((pat) => (
                  <TableRow key={pat.id} className="cursor-pointer" onClick={() => navigate(`/patients/${pat.id}`)}>
                    <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{pat.uhid}</TableCell>
                    <TableCell className="font-semibold">{pat.name}</TableCell>
                    <TableCell className="text-xs">{pat.doctorName.split(" (")[0]}</TableCell>
                    <TableCell className="text-xs">{formatDate(pat.admissionDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Bills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Billing Slips</CardTitle>
              <p className="text-xs text-muted-foreground">Latest bills processed by reception desk</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1" onClick={() => navigate("/bills")}>
              <span>All Bills</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill No.</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBills.map((bill) => (
                  <TableRow key={bill.billNo} className="cursor-pointer" onClick={() => navigate(`/bills/${bill.billNo}`)}>
                    <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{bill.billNo}</TableCell>
                    <TableCell className="font-semibold">{bill.patientName}</TableCell>
                    <TableCell className="font-semibold text-primary">{formatCurrency(bill.grandTotal)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bill.status === "Paid" ? "success" : bill.status === "Pending" ? "warning" : "info"
                        }
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for printing duplicates */}
      <Dialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Print Duplicate Inpatient Invoice</DialogTitle>
          <DialogDescription>Search through generated patient receipts to select and trigger print layouts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by Bill No. or Patient Name..."
              className="pl-9"
              value={printSearchQuery}
              onChange={(e) => setPrintSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 border rounded-lg">
            {filteredBills.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">No matching invoices found.</div>
            ) : (
              filteredBills.map(bill => (
                <div key={bill.billNo} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{bill.patientName}</p>
                    <span className="text-xs text-muted-foreground font-mono">{bill.billNo} • {formatCurrency(bill.grandTotal)}</span>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handlePrintDuplicate(bill.billNo)}>
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog for Search Patients */}
      <Dialog isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Search Patients Directory</DialogTitle>
          <DialogDescription>Look up inpatient profiles by name or hospital UHID.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by UHID, Patient Name..."
              className="pl-9"
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 border rounded-lg">
            {mockPatients
              .filter(p => p.name.toLowerCase().includes(quickSearchQuery.toLowerCase()) || p.uhid.toLowerCase().includes(quickSearchQuery.toLowerCase()))
              .map(pat => (
                <div 
                  key={pat.id} 
                  className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  onClick={() => {
                    setIsSearchModalOpen(false)
                    navigate(`/patients/${pat.id}`)
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pat.name}</p>
                    <span className="text-xs text-muted-foreground font-mono">{pat.uhid} • Dr. {pat.doctorName.split(" (")[0]}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsSearchModalOpen(false)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
export default DashboardPage
