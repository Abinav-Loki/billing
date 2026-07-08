import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./hooks/useAuth"
import { ProtectedRoute } from "./components/layout/ProtectedRoute"
import { Layout } from "./components/layout/Layout"

// Pages
import LoginPage from "./pages/auth/LoginPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import PatientListPage from "./pages/patients/PatientListPage"
import AddPatientPage from "./pages/patients/AddPatientPage"
import PatientDetailPage from "./pages/patients/PatientDetailPage"
import BillingWizardPage from "./pages/billing/BillingWizardPage"
import BillsListPage from "./pages/bills/BillsListPage"
import BillDetailPage from "./pages/bills/BillDetailPage"
import PackagesPage from "./pages/packages/PackagesPage"
import AddOnsPage from "./pages/addons/AddOnsPage"
import ReportsPage from "./pages/reports/ReportsPage"
import UsersPage from "./pages/users/UsersPage"
import SettingsPage from "./pages/settings/SettingsPage"
import { DoctorEarningsPage } from "./pages/doctors/DoctorEarningsPage"


// Empty state states
import { ShieldAlert, FileQuestion } from "lucide-react"
import { Button } from "./components/ui/button"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function UnauthorizedPage() {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-4">
      <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-105">Access Unauthorized</h2>
      <p className="text-sm text-muted-foreground">You do not have permissions to access administrative user configuration logs.</p>
      <Button onClick={() => window.location.hash = "#/"}>Return to Dashboard</Button>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-4">
      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-105">Page Not Found</h2>
      <p className="text-sm text-muted-foreground">The screen path you are trying to visit does not exist.</p>
      <Button onClick={() => window.location.hash = "#/"}>Return to Dashboard</Button>
    </div>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Core Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientListPage />} />
                <Route path="/patients/new" element={<AddPatientPage />} />
                <Route path="/patients/:id" element={<PatientDetailPage />} />
                <Route path="/billing/new" element={<BillingWizardPage />} />
                <Route path="/bills" element={<BillsListPage />} />
                <Route path="/bills/:billNo" element={<BillDetailPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/addons" element={<AddOnsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/doctors" element={<DoctorEarningsPage />} />
                
                {/* Admin Only Route */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/users" element={<UsersPage />} />
                </Route>

                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
export default App
