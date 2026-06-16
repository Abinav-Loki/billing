import * as React from "react"
import { useAuth } from "../../hooks/useAuth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Building2, ShieldCheck, Palette, HelpCircle, Save, CheckCircle, Moon, Sun } from "lucide-react"

export function SettingsPage() {
  const { user } = useAuth()
  const [activeSec, setActiveSec] = React.useState<"hospital" | "theme" | "profile">("hospital")

  // Hospital Form States
  const [hospName, setHospName] = React.useState("ASCAS Fertility & Women's Center")
  const [hospAddr, setHospAddr] = React.useState("12/A, Hospital Avenue, Near Metro Station, New Delhi")
  const [hospPhone, setHospPhone] = React.useState("+91 11 4321 0987")
  const [hospEmail, setHospEmail] = React.useState("info@ascas.com")
  const [hospGst, setHospGst] = React.useState("07AAAAS9876C1Z0")

  // Profile Form States
  const [profName, setProfName] = React.useState(user?.name || "")
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")

  // Theme state
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains("dark")
  })

  const handleToggleTheme = () => {
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

  const handleSaveHospital = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Hospital configuration updated successfully (Mock)")
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    alert("User profile security parameters updated (Mock)")
    setOldPassword("")
    setNewPassword("")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">System Preferences</h1>
        <p className="text-sm text-muted-foreground">Adjust hospital billing metadata, themes, and manage user profile credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Nav Menu */}
        <Card className="md:col-span-1 h-fit glass-panel">
          <CardContent className="p-3 space-y-1">
            <button
              onClick={() => setActiveSec("hospital")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeSec === "hospital"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Hospital Profile</span>
            </button>
            <button
              onClick={() => setActiveSec("theme")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeSec === "theme"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Themes & Styles</span>
            </button>
            <button
              onClick={() => setActiveSec("profile")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeSec === "profile"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>User Profile & Sec</span>
            </button>
          </CardContent>
        </Card>

        {/* Right content panels */}
        <div className="md:col-span-3">
          {/* Hospital Info panel */}
          {activeSec === "hospital" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Hospital Corporate Information</span>
                </CardTitle>
                <CardDescription>Adjust contact information that populates generated inpatient receipts and billing statements.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveHospital}>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Hospital Legal Entity Name</label>
                    <Input value={hospName} onChange={(e) => setHospName(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Official Physical Address</label>
                    <Input value={hospAddr} onChange={(e) => setHospAddr(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Contact Number</label>
                      <Input value={hospPhone} onChange={(e) => setHospPhone(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">GST Registration Number</label>
                      <Input value={hospGst} onChange={(e) => setHospGst(e.target.value)} className="font-mono" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Corporate Email</label>
                    <Input value={hospEmail} type="email" onChange={(e) => setHospEmail(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/10">
                  <Button type="submit" className="gap-1.5">
                    <Save className="h-4 w-4" />
                    <span>Save Parameters</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Theme panel */}
          {activeSec === "theme" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <span>Styles and Layout Layout</span>
                </CardTitle>
                <CardDescription>Configure the interface theme settings for hospital administrative screens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 border rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Interface Dark Mode</h4>
                    <p className="text-xs text-muted-foreground">Toggle color palette between Light and Dark styles.</p>
                  </div>
                  <Button onClick={handleToggleTheme} variant="outline" className="gap-2">
                    {isDarkMode ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-indigo-500" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile panel */}
          {activeSec === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>User Profile & Security</span>
                </CardTitle>
                <CardDescription>Manage password authorizations and portal display credentials.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Full Display Name</label>
                    <Input value={profName} onChange={(e) => setProfName(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Account Access Role</label>
                    <div className="h-9 flex items-center px-3 text-sm bg-slate-50 dark:bg-slate-900 rounded border select-none capitalize font-semibold text-primary">
                      {user?.role} Portal Privileges
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Current Security Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">New Password Configuration</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/10">
                  <Button type="submit" className="gap-1.5">
                    <Save className="h-4 w-4" />
                    <span>Update Credentials</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
export default SettingsPage
