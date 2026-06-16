import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { mockUsers, User } from "../../lib/mockData"
import { Plus, Search, Edit2, Shield, UserCog, UserMinus, ToggleLeft, ToggleRight } from "lucide-react"

export function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("All")
  
  // Modals
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  
  const [formData, setFormData] = React.useState<Partial<User>>({
    name: "",
    email: "",
    role: "Reception",
    status: "Active"
  })

  const filteredUsers = users.filter(usr => {
    const matchesSearch = usr.name.toLowerCase().includes(search.toLowerCase()) || usr.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All" || usr.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleOpenAdd = () => {
    setSelectedUser(null)
    setFormData({
      name: "",
      email: "",
      role: "Reception",
      status: "Active"
    })
    setIsOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({ ...user })
    setIsOpen(true)
  }

  const toggleStatus = (user: User) => {
    const updatedStatus = user.status === "Active" ? "Inactive" : "Active"
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: updatedStatus } : u))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert("Name and Email are required")
      return
    }

    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...formData as User } : u))
    } else {
      const newUsr: User = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: formData.name,
        email: formData.email,
        role: formData.role as User["role"],
        status: formData.status as User["status"]
      }
      setUsers(prev => [...prev, newUsr])
    }

    setIsOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">User Administration</h1>
          <p className="text-sm text-muted-foreground">Provision billing accounts, adjust access privileges, and manage system roles</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Add Portal User</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user accounts by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-850 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Role Filter:</span>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-40">
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Reception">Reception</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Access Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(usr => (
                <TableRow key={usr.id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-850 dark:text-slate-200">{usr.id}</TableCell>
                  <TableCell className="font-semibold">{usr.name}</TableCell>
                  <TableCell className="text-xs font-mono">{usr.email}</TableCell>
                  <TableCell>
                    <Badge variant={usr.role === "Admin" ? "default" : "secondary"} className="gap-1 px-2.5 py-0.5">
                      <Shield className="h-3 w-3" />
                      <span>{usr.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usr.status === "Active" ? "success" : "outline"}>
                      {usr.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-primary"
                        onClick={() => handleOpenEdit(usr)}
                        title="Edit User Role"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-amber-500"
                        onClick={() => toggleStatus(usr)}
                        title="Toggle Session Status"
                      >
                        {usr.status === "Active" ? (
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

      {/* User Modal Dialog */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>{selectedUser ? "Modify User Account" : "Register Portal User"}</DialogTitle>
          <DialogDescription>Setup system credentials and map authorization roles.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 my-3 text-xs">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Full Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Subhankar Roy"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Email Address</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. sroy@ascas.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Access Privileges</label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User["role"] }))}
              >
                <option value="Admin">Admin (Full access)</option>
                <option value="Reception">Reception (Billing desk)</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Session Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as User["status"] }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Account</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
export default UsersPage
