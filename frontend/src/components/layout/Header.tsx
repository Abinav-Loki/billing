import * as React from "react"
import { useAuth } from "../../hooks/useAuth"
import { mockNotifications, NotificationItem } from "../../lib/mockData"
import { Bell, Search, Sun, Moon, Calendar, ChevronDown, User, ShieldAlert, LogOut, Check, Menu } from "lucide-react"

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const [dateTime, setDateTime] = React.useState(new Date())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(mockNotifications)
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains("dark")
  })

  React.useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleDarkMode = () => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    } else {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true)
    }
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="h-16 border-b border-slate-200/40 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-20 transition-colors duration-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-5">
        {/* Date and Time */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 py-1.5 px-3 rounded-full border border-slate-100 dark:border-slate-800">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {dateTime.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="h-2 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          <span className="font-mono text-slate-600 dark:text-slate-400">
            {dateTime.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-500 animate-spin-slow" /> : <Moon className="h-4 w-4 text-indigo-500" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden z-50 animate-in-up">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">No alerts.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${
                        !notif.read ? "bg-slate-50/50 dark:bg-slate-900/20 font-medium" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-slate-850 dark:text-slate-200">{notif.message}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs uppercase">
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:block">{user?.name?.split(" ")[0]}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1 z-50 animate-in-up">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role} Account</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false)
                  // Route to settings
                  window.location.hash = "#/settings"
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <User className="h-3.5 w-3.5" /> Profile Settings
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
