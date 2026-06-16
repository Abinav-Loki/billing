import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { formatDate } from "../../lib/utils"
import { mockPatients } from "../../lib/mockData"
import { Search, UserPlus, Eye, Filter, Calendar } from "lucide-react"

export function PatientListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")
  const [doctorFilter, setDoctorFilter] = React.useState("All")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  const doctors = ["All", ...Array.from(new Set(mockPatients.map(p => p.doctorName.split(" (")[0])))]

  const filteredPatients = mockPatients.filter(pat => {
    const matchesSearch =
      pat.name.toLowerCase().includes(search.toLowerCase()) ||
      pat.uhid.toLowerCase().includes(search.toLowerCase()) ||
      pat.mobileNumber.includes(search)

    const matchesDoc = doctorFilter === "All" || pat.doctorName.startsWith(doctorFilter)

    return matchesSearch && matchesDoc
  })

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Patients Directory</h1>
          <p className="text-sm text-muted-foreground">List and manage inpatient clinical and billing profiles</p>
        </div>
        <Button onClick={() => navigate("/patients/new")} className="gap-2 shrink-0">
          <UserPlus className="h-4 w-4" />
          <span>Register Patient</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, UHID, or mobile number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              <span>Doctor:</span>
            </div>
            <Select
              value={doctorFilter}
              onChange={(e) => {
                setDoctorFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-48"
            >
              {doctors.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          {paginatedPatients.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-350">No patients found</p>
              <p className="text-xs text-muted-foreground mt-1">Try modifying your filters or search query.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UHID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Husband's Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Consulting Doctor</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((pat) => (
                  <TableRow key={pat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{pat.uhid}</TableCell>
                    <TableCell className="font-semibold">{pat.name}</TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-450">
                      {pat.age} Yrs / {pat.gender}
                    </TableCell>
                    <TableCell className="text-xs">{pat.husbandName}</TableCell>
                    <TableCell className="text-xs font-mono">{pat.mobileNumber}</TableCell>
                    <TableCell className="text-xs">{pat.doctorName.split(" (")[0]}</TableCell>
                    <TableCell className="text-xs flex items-center gap-1.5 mt-2.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(pat.admissionDate)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5"
                        onClick={() => navigate(`/patients/${pat.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-850">
              <span className="text-xs text-muted-foreground">
                Showing page <strong className="text-slate-700 dark:text-slate-300">{currentPage}</strong> of <strong className="text-slate-700 dark:text-slate-300">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default PatientListPage
