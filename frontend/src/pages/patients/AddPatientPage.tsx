import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { mockPatients, Patient } from "../../lib/mockData"
import { ArrowLeft, UserPlus, Calendar } from "lucide-react"

const schema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters"),
  husbandName: z.string().min(2, "Husband name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Age must be at least 18").max(60, "Age must be less than 60"),
  gender: z.string().min(1, "Please select a gender"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  doctorName: z.string().min(1, "Please select a consulting doctor"),
  admissionDate: z.string().min(1, "Please select admission date"),
  dischargeDate: z.string().optional(),
})

type PatientFormValues = z.infer<typeof schema>

export function AddPatientPage() {
  const navigate = useNavigate()

  // Generate next IDs
  const nextIdVal = mockPatients.length + 1
  const generatedId = `PAT-${String(nextIdVal).padStart(3, "0")}`
  const generatedUhid = `UHID-2026-${String(nextIdVal).padStart(4, "0")}`

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "Female",
      doctorName: "Dr. Anjali Mehta (IVF Specialist)",
      admissionDate: new Date().toISOString().split("T")[0],
    },
  })

  const onSubmit = (data: PatientFormValues) => {
    // Add new patient in-memory for live demo session
    const newPatient = {
      id: generatedId,
      uhid: generatedUhid,
      ...data,
      billingHistory: []
    } as unknown as Patient
    mockPatients.unshift(newPatient) // Add to top of array
    alert(`Patient ${data.name} has been successfully registered with UHID: ${generatedUhid}`)
    navigate("/patients")
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Register New Inpatient</h1>
          <p className="text-sm text-muted-foreground">Register demographic and admission data for hospital intake billing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span>Patient Admission Form</span>
            </CardTitle>
            <CardDescription>All fields are required unless stated otherwise.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Read-only IDs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border">
              <div>
                <label className="text-xs font-semibold text-slate-500">Auto-Generated Patient ID</label>
                <div className="h-9 flex items-center px-3 font-mono text-sm bg-slate-100 dark:bg-slate-800 rounded border mt-1 select-none font-bold text-slate-700 dark:text-slate-300">
                  {generatedId}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Auto-Generated Hospital UHID</label>
                <div className="h-9 flex items-center px-3 font-mono text-sm bg-slate-100 dark:bg-slate-800 rounded border mt-1 select-none font-bold text-slate-700 dark:text-slate-300">
                  {generatedUhid}
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Patient Full Name</label>
                <Input
                  placeholder="e.g. Priyasree Sen"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Husband / Guardian Name</label>
                <Input
                  placeholder="e.g. Soumitra Sen"
                  error={errors.husbandName?.message}
                  {...register("husbandName")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Age</label>
                  <Input
                    type="number"
                    placeholder="30"
                    error={errors.age?.message}
                    {...register("age")}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Gender</label>
                  <Select error={errors.gender?.message} {...register("gender")}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mobile Number (Indian)</label>
                <Input
                  placeholder="e.g. 9876543210"
                  error={errors.mobileNumber?.message}
                  {...register("mobileNumber")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Permanent Address</label>
              <Input
                placeholder="e.g. House No. 12, Park Street, Kolkata"
                error={errors.address?.message}
                {...register("address")}
              />
            </div>

            {/* Admission Information */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Consulting Doctor / Specialist</label>
                <Select error={errors.doctorName?.message} {...register("doctorName")}>
                  <option value="Dr. Anjali Mehta (IVF Specialist)">Dr. Anjali Mehta (IVF Specialist)</option>
                  <option value="Dr. S. K. Sen (Senior Embryologist)">Dr. S. K. Sen (Senior Embryologist)</option>
                  <option value="Dr. Priya Naidu (Gynecologist)">Dr. Priya Naidu (Gynecologist)</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Admission Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    error={errors.admissionDate?.message}
                    {...register("admissionDate")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Expected Discharge Date (Optional)</label>
                <Input
                  type="date"
                  error={errors.dischargeDate?.message}
                  {...register("dischargeDate")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/10">
            <Button type="button" variant="outline" onClick={() => navigate("/patients")}>
              Cancel
            </Button>
            <Button type="submit">
              Register & Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
export default AddPatientPage
