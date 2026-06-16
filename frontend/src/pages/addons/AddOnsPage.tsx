import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { formatCurrency } from "../../lib/utils"
import { mockAddOns, AddOn } from "../../lib/mockData"
import { Plus, Search, Edit2, ToggleLeft, ToggleRight, Sparkles } from "lucide-react"

export function AddOnsPage() {
  const [addons, setAddons] = React.useState<AddOn[]>(mockAddOns)
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("All")
  
  // Modals
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedAddon, setSelectedAddon] = React.useState<AddOn | null>(null)
  
  const [formData, setFormData] = React.useState<Partial<AddOn>>({
    name: "",
    price: 0,
    category: "Embryology Lab",
    status: "Active"
  })

  const categories = ["All", ...Array.from(new Set(addons.map(a => a.category)))]

  const filteredAddOns = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = categoryFilter === "All" || addon.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const handleOpenAdd = () => {
    setSelectedAddon(null)
    setFormData({
      name: "",
      price: 0,
      category: "Embryology Lab",
      status: "Active"
    })
    setIsOpen(true)
  }

  const handleOpenEdit = (addon: AddOn) => {
    setSelectedAddon(addon)
    setFormData({ ...addon })
    setIsOpen(true)
  }

  const toggleStatus = (addon: AddOn) => {
    const updatedStatus = addon.status === "Active" ? "Inactive" : "Active"
    setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, status: updatedStatus } : a))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      alert("Name and Price are required")
      return
    }

    if (selectedAddon) {
      setAddons(prev => prev.map(a => a.id === selectedAddon.id ? { ...a, ...formData as AddOn } : a))
    } else {
      const newAddon: AddOn = {
        id: `ADD-${String(addons.length + 1).padStart(3, "0")}`,
        name: formData.name,
        price: Number(formData.price),
        category: formData.category || "Embryology Lab",
        status: formData.status as AddOn["status"]
      }
      setAddons(prev => [newAddon, ...prev])
    }

    setIsOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Add-on Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage laboratory procedures, OT products, genetic screenings, and extra charges</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Add Custom Add-on</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search add-on catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-850 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-48">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Add-on ID</TableHead>
                <TableHead>Procedure / Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Standard Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddOns.map(addon => (
                <TableRow key={addon.id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-250">{addon.id}</TableCell>
                  <TableCell className="font-semibold">{addon.name}</TableCell>
                  <TableCell className="text-xs">{addon.category}</TableCell>
                  <TableCell className="font-bold text-primary">{formatCurrency(addon.price)}</TableCell>
                  <TableCell>
                    <Badge variant={addon.status === "Active" ? "success" : "outline"}>
                      {addon.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-primary"
                        onClick={() => handleOpenEdit(addon)}
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-amber-500"
                        onClick={() => toggleStatus(addon)}
                        title="Toggle Status"
                      >
                        {addon.status === "Active" ? (
                          <ToggleRight className="h-4 w-4 text-primary" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add-on Modal Dialog */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>{selectedAddon ? "Edit Add-on Procedure" : "Add Custom Add-on"}</DialogTitle>
          <DialogDescription>Setup standalone procedures that can be billed alongside standard packages.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 my-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Add-on Item Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Endometrial Receptivity Analysis (ERA)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Standard Rate (INR)</label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="20000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Category Group</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Lab, Diagnostics"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Inventory Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AddOn["status"] }))}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Add-on</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
export default AddOnsPage
