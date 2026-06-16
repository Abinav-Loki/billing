import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Select } from "../../components/ui/select"
import { formatCurrency, formatDate } from "../../lib/utils"
import { mockBills, Bill } from "../../lib/mockData"
import { Search, Eye, Printer, Download, Edit3, Calendar, PlusCircle, Filter } from "lucide-react"

export function BillsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  const filteredBills = mockBills.filter(bill => {
    const matchesSearch =
      bill.billNo.toLowerCase().includes(search.toLowerCase()) ||
      bill.patientName.toLowerCase().includes(search.toLowerCase()) ||
      bill.packageName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "All" || bill.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage)
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDownloadPDF = (billNo: string) => {
    alert(`Downloading PDF Invoice for ${billNo} (Feature integration placeholder)`)
  }

  const handlePrint = (billNo: string) => {
    navigate(`/bills/${billNo}?print=true`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Billing Slips Directory</h1>
          <p className="text-sm text-muted-foreground">Monitor generated estimates, active invoices and payments</p>
        </div>
        <Button onClick={() => navigate("/billing/new")} className="gap-2 shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span>New Inpatient Bill</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Bill No., Patient name, or package..."
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
              <span>Status:</span>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-40"
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {paginatedBills.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-350">No invoices found</p>
              <p className="text-xs text-muted-foreground mt-1">Try modifying your filter or search query.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill No.</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Selected Package</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBills.map((bill) => (
                  <TableRow key={bill.billNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{bill.billNo}</TableCell>
                    <TableCell className="font-semibold">{bill.patientName}</TableCell>
                    <TableCell className="text-xs">{bill.packageName}</TableCell>
                    <TableCell className="text-xs flex items-center gap-1.5 mt-2.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(bill.date)}</span>
                    </TableCell>
                    <TableCell className="font-bold text-primary">{formatCurrency(bill.grandTotal)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bill.status === "Paid" ? "success" : bill.status === "Pending" ? "warning" : "info"
                        }
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          onClick={() => navigate(`/bills/${bill.billNo}`)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          onClick={() => handlePrint(bill.billNo)}
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-slate-850"
                          onClick={() => handleDownloadPDF(bill.billNo)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
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
export default BillsListPage
