import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockPatients } from "../../lib/mockData"
import { ArrowLeft, PlusCircle, Calendar, Eye, Phone, MapPin, User, Stethoscope } from "lucide-react"

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const patient = mockPatients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowLeft className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Patient Profile Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">The inpatient ID you are trying to view does not exist in the hospital records.</p>
        <Button onClick={() => navigate("/patients")} className="mt-6">
          Back to Directory
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/patients")} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h1>
              <Badge variant="secondary" className="font-mono">{patient.uhid}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Patient ID: {patient.id} • Registered Inpatient Profile</p>
          </div>
        </div>

        <Button onClick={() => navigate(`/billing/new?patientId=${patient.id}`)} className="gap-2 shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span>Generate New Package Bill</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details Profile Card */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Personal Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Husband Name</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.husbandName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Demographics</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.age} Yrs / {patient.gender}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile Contact</p>
                <p className="font-semibold font-mono text-slate-800 dark:text-slate-200">{patient.mobileNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-semibold text-slate-700 dark:text-slate-350 leading-snug">{patient.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admission & Billing History */}
        <div className="md:col-span-2 space-y-6">
          {/* Clinical Admission Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">Clinical Admission Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                <Stethoscope className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Consulting Doctor</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.doctorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Admission Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(patient.admissionDate)}</p>
                </div>
              </div>

              {patient.dischargeDate && (
                <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Discharge Date</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(patient.dischargeDate)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Log Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Invoice Billing History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!patient.billingHistory || patient.billingHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No generated bills found for this patient record.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill No.</TableHead>
                      <TableHead>Billing Date</TableHead>
                      <TableHead>Grand Total</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.billingHistory.map((bill) => (
                      <TableRow key={bill.billNo}>
                        <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{bill.billNo}</TableCell>
                        <TableCell className="text-xs">{formatDate(bill.date)}</TableCell>
                        <TableCell className="font-bold text-primary">{formatCurrency(bill.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={bill.status === "Paid" ? "success" : bill.status === "Pending" ? "warning" : "info"}>
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => navigate(`/bills/${bill.billNo}`)}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Invoice</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default PatientDetailPage
