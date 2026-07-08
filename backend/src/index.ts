import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// In-Memory Mock Data Stores (Syncs with the Frontend schemas)
let patients: any[] = [
  {
    id: "PAT-001",
    uhid: "UHID-2026-0001",
    name: "Priyanka Sharma",
    husbandName: "Rajesh Sharma",
    age: 32,
    gender: "Female",
    mobileNumber: "9876543210",
    address: "Flat 402, Royal Enclave, New Delhi",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    admissionDate: "2026-06-10",
    billingHistory: [
      { billNo: "BILL-2026-0001", date: "2026-06-10", amount: 155000, status: "Paid" }
    ]
  },
  {
    id: "PAT-002",
    uhid: "UHID-2026-0002",
    name: "Meera Patel",
    husbandName: "Amit Patel",
    age: 29,
    gender: "Female",
    mobileNumber: "8765432109",
    address: "Sector 15, Vashi, Navi Mumbai",
    doctorName: "Dr. S. K. Sen (Senior Embryologist)",
    admissionDate: "2026-06-12",
    billingHistory: []
  }
]

let bills: any[] = [
  {
    billNo: "BILL-2026-0001",
    uhid: "UHID-2026-0001",
    patientName: "Priyanka Sharma",
    packageName: "Standard IVF Package",
    packagePrice: 150000,
    addOns: [{ name: "Specialized Embryo Glue", price: 10000 }],
    roomCharges: 10000,
    additionalCharges: 5000,
    discount: 15000,
    taxAmount: 5000,
    grandTotal: 160000,
    date: "2026-06-10",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Room 302 (Deluxe)"
  }
]

const packages = [
  {
    id: "PKG-001",
    name: "Standard IVF Package",
    category: "IVF / ICSI / FET",
    price: 150000,
    description: "Includes stimulation, retrieval, fertilization, and transfer.",
    inclusions: ["Stimulation scan", "Retrieval", "Embryologist charges"]
  },
  {
    id: "PKG-002",
    name: "Frozen Embryo Transfer (FET)",
    category: "IVF / ICSI / FET",
    price: 65000,
    description: "Hormonal prep and thawing/transfer of stored embryos.",
    inclusions: ["Transfer procedure", "Thawing scans"]
  }
]

const addOns = [
  {
    id: "ADD-001",
    name: "Specialized Embryo Glue",
    category: "Add-ons / Separate Billing Items",
    price: 10000,
    status: "Active"
  },
  {
    id: "ADD-002",
    name: "Laser Hatching",
    category: "Add-ons / Separate Billing Items",
    price: 25000,
    status: "Active"
  },
  {
    id: "ADD-003",
    name: "Surgery HPE - Small",
    category: "Add-ons / Separate Billing Items",
    price: 1500,
    status: "Active"
  },
  {
    id: "ADD-004",
    name: "Surgery HPE - Mid",
    category: "Add-ons / Separate Billing Items",
    price: 2000,
    status: "Active"
  },
  {
    id: "ADD-005",
    name: "Surgery HPE - Big",
    category: "Add-ons / Separate Billing Items",
    price: 2500,
    status: "Active"
  },
  {
    id: "ADD-006",
    name: "Sperm cryopreservation – VD",
    category: "Add-ons / Separate Billing Items",
    price: 15000,
    status: "Active"
  }
]

// Auth Endpoint
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === "admin@ascas.com" && password === "admin123") {
    return res.json({ token: "mock-jwt-admin-token", role: "Admin", name: "Admin Manager" })
  }
  if (email === "reception@ascas.com" && password === "reception123") {
    return res.json({ token: "mock-jwt-reception-token", role: "Reception", name: "Reconciliation Desk" })
  }
  return res.status(401).json({ error: "Invalid credentials" })
})

// Patients Endpoints
app.get("/api/patients", (req: Request, res: Response) => {
  res.json(patients)
})

app.post("/api/patients", (req: Request, res: Response) => {
  const newPatient = {
    id: `PAT-${String(patients.length + 1).padStart(3, "0")}`,
    uhid: `UHID-2026-${String(patients.length + 1).padStart(4, "0")}`,
    ...req.body,
    billingHistory: []
  }
  patients.unshift(newPatient)
  res.status(201).json(newPatient)
})

// Bills Endpoints
app.get("/api/bills", (req: Request, res: Response) => {
  res.json(bills)
})

app.post("/api/bills", (req: Request, res: Response) => {
  const newBill = {
    billNo: `BILL-2026-${String(bills.length + 1).padStart(4, "0")}`,
    ...req.body,
    date: new Date().toISOString().split("T")[0]
  }
  bills.unshift(newBill)
  res.status(201).json(newBill)
})

app.put("/api/bills/:billNo", (req: Request, res: Response) => {
  const { billNo } = req.params
  const idx = bills.findIndex(b => b.billNo === billNo)
  if (idx !== -1) {
    bills[idx] = {
      ...bills[idx],
      ...req.body
    }
    return res.json(bills[idx])
  }
  return res.status(404).json({ error: "Bill not found" })
})

// Packages Endpoint
app.get("/api/packages", (req: Request, res: Response) => {
  res.json(packages)
})

// Add-ons Endpoint
app.get("/api/addons", (req: Request, res: Response) => {
  res.json(addOns)
})

// Rule Validation Endpoint
app.post("/api/rules/validate", (req: Request, res: Response) => {
  const { packageId, billingMethod, selectedAddOns } = req.body
  const violations: string[] = []
  
  if (billingMethod === "full_payment") {
    const pkg = packages.find(p => p.id === packageId)
    if (pkg && selectedAddOns && selectedAddOns.length > 0) {
      const addOnNames = selectedAddOns.map((a: any) => a.name ? a.name : a)
      if (pkg.name.includes("ICSI") && addOnNames.includes("ICSI (Intracytoplasmic Sperm Injection)")) {
        violations.push("ICSI is already included in the selected package. Cannot add as separate add-on.")
      }
      if (pkg.name.includes("Blastocyst") && addOnNames.includes("Blastocyst Culture")) {
        violations.push("Blastocyst Culture is included in the package.")
      }
    }
  }
  
  res.json({ valid: violations.length === 0, violations })
})

// Reports Endpoints
app.get("/api/reports/daily", (req: Request, res: Response) => {
  const map = new Map<string, { revenue: number, count: number }>()
  bills.forEach(b => {
    const existing = map.get(b.date) || { revenue: 0, count: 0 }
    map.set(b.date, { revenue: existing.revenue + b.grandTotal, count: existing.count + 1 })
  })
  const data = Array.from(map.entries()).map(([date, stats]) => ({ date, ...stats }))
  res.json(data)
})

app.get("/api/reports/monthly", (req: Request, res: Response) => {
  const map = new Map<string, { revenue: number, count: number }>()
  bills.forEach(b => {
    const month = b.date.substring(0, 7)
    const existing = map.get(month) || { revenue: 0, count: 0 }
    map.set(month, { revenue: existing.revenue + b.grandTotal, count: existing.count + 1 })
  })
  const data = Array.from(map.entries()).map(([month, stats]) => ({ month, ...stats }))
  res.json(data)
})

app.get("/", (req: Request, res: Response) => {
  res.send("ASCAS Fertility & Women's Center Inpatient Billing Server is online.")
})

app.listen(PORT, () => {
  console.log(`[server] Server is running on port ${PORT}`)
})
