import { NavLink } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  FileText,
  Boxes,
  Sparkles,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  Heart,
  X,
  UserCheck
} from "lucide-react"

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }) {
  const { logout, user } = useAuth()

  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Patients", to: "/patients", icon: Users },
    { name: "New Bill", to: "/billing/new", icon: PlusCircle },
    { name: "Bills", to: "/bills", icon: FileText },
    { name: "Packages", to: "/packages", icon: Boxes },
    { name: "Doctor Earnings", to: "/doctors", icon: UserCheck },
    { name: "Reports", to: "/reports", icon: BarChart3 },
    ...(user?.role === "Admin"
      ? [{ name: "Users", to: "/users", icon: UserCog }]
      : []),
    { name: "Settings", to: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`
        w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        {/* Header / Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 bg-white rounded-full overflow-hidden flex items-center justify-center p-0.5">
              <img src="/logo.jpeg" alt="ASCAS Logo" className="h-full w-full object-contain rounded-full" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight leading-none">ASCAS</h1>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Fertility & Women's</span>
            </div>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen?.(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen?.(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-md translate-x-1"
                    : "hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon className="h-5 w-5 stroke-[1.8]" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile Brief & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/45">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
              <span className="text-[11px] text-muted-foreground truncate block capitalize">{user?.role} Portal</span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
export default Sidebar
