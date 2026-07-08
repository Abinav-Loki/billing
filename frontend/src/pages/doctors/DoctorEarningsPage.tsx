import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, Bill } from "../../lib/mockData"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Calendar, 
  ShieldCheck,
  CheckCircle,
  FileText,
  UserCheck
} from "lucide-react"

interface DoctorConfig {
  name: string;
  doctorShare: number; // percentage, e.g. 70
  hospitalShare: number; // percentage, e.g. 30
}

const DEFAULT_DOCTOR_CONFIGS: DoctorConfig[] = [
  { name: "Dr. Anjali Mehta", doctorShare: 75, hospitalShare: 25 },
  { name: "Dr. S. K. Sen", doctorShare: 60, hospitalShare: 40 },
  { name: "Dr. Priya Naidu", doctorShare: 70, hospitalShare: 30 },
  { name: "Dr. AP", doctorShare: 80, hospitalShare: 20 }
]

export function DoctorEarningsPage() {
  const [timeframe, setTimeframe] = React.useState<"today" | "weekly" | "monthly" | "yearly">("monthly")
  const [configs, setConfigs] = React.useState<DoctorConfig[]>(() => {
    const saved = localStorage.getItem("ascas_doctor_configs")
    return saved ? JSON.parse(saved) : DEFAULT_DOCTOR_CONFIGS
  })

  const [editingConfig, setEditingConfig] = React.useState<DoctorConfig | null>(null)
  const [editDocShare, setEditDocShare] = React.useState<number>(70)
  const [editHospShare, setEditHospShare] = React.useState<number>(30)

  // Save configs to localStorage
  const saveConfigs = (newConfigs: DoctorConfig[]) => {
    setConfigs(newConfigs)
    localStorage.setItem("ascas_doctor_configs", JSON.stringify(newConfigs))
  }

  // Filter bills by timeframe
  const filteredBills = React.useMemo(() => {
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)

    return mockBills.filter(bill => {
      const billDate = new Date(bill.date)
      const billDateStr = bill.date.slice(0, 10)

      if (timeframe === "today") {
        return billDateStr === todayStr
      } else if (timeframe === "weekly") {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(now.getDate() - 7)
        return billDate >= oneWeekAgo
      } else if (timeframe === "monthly") {
        const oneMonthAgo = new Date()
        oneMonthAgo.setDate(now.getDate() - 30)
        return billDate >= oneMonthAgo
      } else if (timeframe === "yearly") {
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(now.getFullYear() - 1)
        return billDate >= oneYearAgo
      }
      return true
    })
  }, [timeframe])

  // Process data per doctor
  const doctorAnalytics = React.useMemo(() => {
    const result: Record<string, {
      doctorName: string
      patientCount: number
      consultationRevenue: number
      procedureRevenue: number
      totalCharges: number
      doctorShareAmt: number
      hospitalShareAmt: number
    }> = {}

    // Initialize all configured doctors
    configs.forEach(cfg => {
      result[cfg.name] = {
        doctorName: cfg.name,
        patientCount: 0,
        consultationRevenue: 0,
        procedureRevenue: 0,
        totalCharges: 0,
        doctorShareAmt: 0,
        hospitalShareAmt: 0
      }
    })

    filteredBills.forEach(bill => {
      const docName = bill.doctorName.split(" (")[0]
      if (!result[docName]) {
        // Fallback for unexpected doctors
        result[docName] = {
          doctorName: docName,
          patientCount: 0,
          consultationRevenue: 0,
          procedureRevenue: 0,
          totalCharges: 0,
          doctorShareAmt: 0,
          hospitalShareAmt: 0
        }
      }

      const entry = result[docName]
      entry.patientCount += 1

      // 1. Consultant charges from charges array
      if (bill.consultantCharges && bill.consultantCharges.length > 0) {
        bill.consultantCharges.forEach(charge => {
          // Check if charge belongs to this doctor
          const chargeDocName = charge.doctorName.split(" (")[0]
          const targetEntry = result[chargeDocName] || entry // fallback to bill doctor
          
          targetEntry.totalCharges += charge.amount
          if (charge.type.toLowerCase().includes("consultation") || charge.type.toLowerCase().includes("follow")) {
            targetEntry.consultationRevenue += charge.amount
          } else {
            targetEntry.procedureRevenue += charge.amount
          }
        })
      }
    })

    // Compute shares based on configs
    Object.keys(result).forEach(name => {
      const entry = result[name]
      const cfg = configs.find(c => c.name === name) || { doctorShare: 70, hospitalShare: 30 }
      entry.doctorShareAmt = (entry.totalCharges * cfg.doctorShare) / 100
      entry.hospitalShareAmt = (entry.totalCharges * cfg.hospitalShare) / 100
    })

    return Object.values(result)
  }, [filteredBills, configs])

  // Overall analytics totals
  const totals = React.useMemo(() => {
    let patientCount = 0
    let consultationRevenue = 0
    let procedureRevenue = 0
    let totalCharges = 0
    let doctorShareAmt = 0
    let hospitalShareAmt = 0

    doctorAnalytics.forEach(doc => {
      patientCount += doc.patientCount
      consultationRevenue += doc.consultationRevenue
      procedureRevenue += doc.procedureRevenue
      totalCharges += doc.totalCharges
      doctorShareAmt += doc.doctorShareAmt
      hospitalShareAmt += doc.hospitalShareAmt
    })

    return {
      patientCount,
      consultationRevenue,
      procedureRevenue,
      totalCharges,
      doctorShareAmt,
      hospitalShareAmt,
      avgRevenue: patientCount > 0 ? totalCharges / patientCount : 0
    }
  }, [doctorAnalytics])

  const handleOpenEditConfig = (cfg: DoctorConfig) => {
    setEditingConfig(cfg)
    setEditDocShare(cfg.doctorShare)
    setEditHospShare(cfg.hospitalShare)
  }

  const handleSaveConfig = () => {
    if (editDocShare + editHospShare !== 100) {
      alert("Doctor Share and Hospital Share must sum up to exactly 100%.")
      return
    }
    if (!editingConfig) return

    const updated = configs.map(c => {
      if (c.name === editingConfig.name) {
        return {
          ...c,
          doctorShare: editDocShare,
          hospitalShare: editHospShare
        }
      }
      return c
    })
    saveConfigs(updated)
    setEditingConfig(null)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Doctor Earnings Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Track consultant charges, calculate doctor/hospital revenue shares, and configure payouts.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 border border-slate-200/50 dark:border-slate-700/50">
          {(["today", "weekly", "monthly", "yearly"] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-900 shadow-md text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Consultant Revenue</span>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {formatCurrency(totals.totalCharges)}
              </h3>
            </div>
            <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-650 dark:text-teal-450 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Patients Seen</span>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {totals.patientCount}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-455 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Consultation Revenue</span>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {formatCurrency(totals.consultationRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-455 rounded-xl">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Procedure Revenue</span>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {formatCurrency(totals.procedureRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-455 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Doctor Share Configurations Table (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-panel border-slate-200 shadow-xl bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-950/50 border-b p-5">
              <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-primary" />
                Doctor Share Configurations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3.5">
                {configs.map(cfg => (
                  <div 
                    key={cfg.name} 
                    className="p-3.5 border rounded-xl flex items-center justify-between bg-white dark:bg-slate-950 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-150">{cfg.name}</p>
                      <div className="flex gap-3 text-[10px] font-bold text-slate-400">
                        <span>Doc: <strong className="text-teal-650">{cfg.doctorShare}%</strong></span>
                        <span>Hosp: <strong className="text-primary">{cfg.hospitalShare}%</strong></span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleOpenEditConfig(cfg)}
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8 border-slate-200"
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit config form container */}
          {editingConfig && (
            <Card className="glass-panel border-indigo-200 bg-indigo-50/10 dark:bg-slate-950 dark:border-indigo-950/60 shadow-xl">
              <CardHeader className="p-4 border-b border-indigo-100 dark:border-slate-800/80">
                <CardTitle className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400">
                  Update Payout Share: {editingConfig.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Doctor Share (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editDocShare}
                      onChange={e => {
                        const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                        setEditDocShare(val)
                        setEditHospShare(100 - val)
                      }}
                      className="w-full h-8 border rounded px-2 text-xs font-bold font-mono text-center bg-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Hospital Share (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editHospShare}
                      onChange={e => {
                        const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                        setEditHospShare(val)
                        setEditDocShare(100 - val)
                      }}
                      className="w-full h-8 border rounded px-2 text-xs font-bold font-mono text-center bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-indigo-100 dark:border-slate-800/80">
                  <Button size="sm" variant="ghost" onClick={() => setEditingConfig(null)} className="h-8 text-xs">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveConfig} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-750 text-white">
                    Apply Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Individual Doctor Performance Summary (7 columns) */}
        <div className="lg:col-span-7">
          <Card className="glass-panel border-slate-200 shadow-xl">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-950/50 border-b p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Doctor Earnings Breakdown
              </CardTitle>
              <Badge className="bg-primary text-white text-[10px] px-2 py-0.5">
                {timeframe}
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-150 dark:border-slate-800/80 text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">
                      <th className="px-5 py-3">Doctor</th>
                      <th className="px-4 py-3 text-center">Patients</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                      <th className="px-4 py-3 text-right">Doctor Share</th>
                      <th className="px-5 py-3 text-right">Hospital Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                    {doctorAnalytics.map(doc => {
                      const cfg = configs.find(c => c.name === doc.doctorName) || { doctorShare: 70, hospitalShare: 30 }
                      return (
                        <tr key={doc.doctorName} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800 dark:text-slate-150 leading-snug">{doc.doctorName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Config: {cfg.doctorShare}% / {cfg.hospitalShare}%</p>
                          </td>
                          <td className="px-4 py-4 text-center font-bold font-mono text-slate-700 dark:text-slate-300">
                            {doc.patientCount}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-slate-800 dark:text-slate-150 font-mono">
                            {formatCurrency(doc.totalCharges)}
                          </td>
                          <td className="px-4 py-4 text-right font-extrabold text-teal-650 font-mono">
                            {formatCurrency(doc.doctorShareAmt)}
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-primary font-mono">
                            {formatCurrency(doc.hospitalShareAmt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50/40 dark:bg-slate-900/40 border-t-2 font-bold text-slate-800 dark:text-slate-100">
                      <td className="px-5 py-3.5 uppercase font-bold text-[9px] tracking-wide text-slate-400">Total Payouts</td>
                      <td className="px-4 py-3.5 text-center font-black font-mono text-slate-700 dark:text-slate-350">{totals.patientCount}</td>
                      <td className="px-4 py-3.5 text-right font-black font-mono text-slate-800 dark:text-slate-100">{formatCurrency(totals.totalCharges)}</td>
                      <td className="px-4 py-3.5 text-right font-black font-mono text-teal-650">{formatCurrency(totals.doctorShareAmt)}</td>
                      <td className="px-5 py-3.5 text-right font-black font-mono text-primary">{formatCurrency(totals.hospitalShareAmt)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
