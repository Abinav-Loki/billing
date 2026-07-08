export interface Patient {
  id: string
  uhid: string
  name: string
  husbandName: string
  age: number
  gender: string
  mobileNumber: string
  address: string
  doctorName: string
  admissionDate: string
  dischargeDate?: string
  billingHistory?: { billNo: string; date: string; amount: number; status: "Paid" | "Pending" | "Partially Paid" }[]
}

export interface PackageItem {
  id: string
  name: string
  category: "IVF / ICSI / FET" | "Donor Programmes" | "Surgical Procedures" | "Cryostorage" | "Embryo Pooling"
  price: number
  description: string
  inclusions: string[]
}

export interface AddOn {
  id: string
  name: string
  price: number
  category: string
  status: "Active" | "Inactive"
}

export type PaymentMethod =
  | "Cash"
  | "Card"
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Net Banking"
  | "Cheque"
  | "Bank Transfer"
  | "Insurance"

export type PaymentType =
  | "Full Payment"
  | "Advance / Partial"
  | "Final Settlement"

export interface PaymentEntry {
  id?: string              // PYMT-{billNo}-{n}
  receiptNo?: string       // RCPT-{year}-{seq}
  paymentType?: PaymentType
  method: PaymentMethod
  amount: number
  date: string            // ISO date YYYY-MM-DD
  time?: string            // HH:MM 24-hr
  // Method-specific reference fields
  transactionRef?: string // UPI UTR / bank ref / cheque no / net-banking ref
  bankName?: string       // Card / Net Banking / Cheque / Bank Transfer
  last4Digits?: string    // Credit/Debit card last 4 digits
  chequeDate?: string     // Cheque only
  // Common
  receivedBy?: string
  remarks?: string
  // Audit trail
  createdBy?: string
  createdAt?: string

  // Backwards compatibility
  transactionId?: string
  note?: string
}

export interface DiscountDetails {
  applied: boolean
  discountType?: "Percentage" | "Fixed"
  discountValue?: number
  reason?: string
  authorizedBy?: string
  authorizationRemarks?: string
  authorizedAt?: string
  appliedBy?: string
  appliedAt?: string
}

export interface RefundEntry {
  id: string
  refundReceiptNo: string
  amount: number
  reason: string
  method: "Cash" | "UPI" | "Bank Transfer" | "Card Reversal"
  originalPaymentRef: string
  authorizedBy: string
  remarks?: string
  refundedAt: string
  processedBy: string
}

export interface AuditLogEntry {
  id: string
  actionType: "Discount" | "Refund" | "Edit" | "Unlock"
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt?: string
  authorizedBy?: string
  authorizationRemarks?: string
  reason?: string
  oldValue?: string
  newValue?: string
}

export interface Bill {
  billNo: string
  uhid: string
  patientName: string
  packageName: string
  packagePrice: number
  addOns: { name: string; price: number }[]
  roomCharges: number
  additionalCharges: number
  discount: number
  taxAmount: number
  grandTotal: number
  date: string
  status: "Paid" | "Pending" | "Partially Paid"
  billingNotes?: string
  doctorName: string
  roomNo?: string
  billingMethod?: "full_payment" | "item_wise"
  selectedLineItems?: { id: string; name: string; price: number; category: string; qty: number }[]
  categoryName?: string
  exclusions?: string[]
  billingFormat?: "inline" | "detailed"
  // Payment tracking
  payments?: PaymentEntry[]
  amountPaid?: number
  paymentBalance?: number
  discountDetails?: DiscountDetails
  refunds?: RefundEntry[]
  auditLogs?: AuditLogEntry[]
  // Custom bill enhancements
  consultantCharges?: { doctorName: string; type: string; amount: number; remarks?: string }[]
  customLineItems?: { category: string; name: string; description: string; qty: number; price: number; discount: number; gstRate: number; total: number }[]
  totalConsultantCharges?: number
  isUnlockedByAdmin?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Reception"
  status: "Active" | "Inactive"
}

export interface NotificationItem {
  id: string
  type: "success" | "info" | "warning"
  message: string
  time: string
  read: boolean
}

export const mockPatients: Patient[] = [
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
  },
  {
    id: "PAT-003",
    uhid: "UHID-2026-0003",
    name: "Kavitha Krishnan",
    husbandName: "Ramesh Krishnan",
    age: 35,
    gender: "Female",
    mobileNumber: "7654321098",
    address: "No 45, Gandhi Road, Adyar, Chennai",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    admissionDate: "2026-06-14",
    billingHistory: [
      { billNo: "BILL-2026-0002", date: "2026-06-14", amount: 235000, status: "Pending" }
    ]
  },
  {
    id: "PAT-004",
    uhid: "UHID-2026-0004",
    name: "Sneha Reddy",
    husbandName: "Vijay Reddy",
    age: 31,
    gender: "Female",
    mobileNumber: "9550123456",
    address: "Jubilee Hills, Road No. 10, Hyderabad",
    doctorName: "Dr. Priya Naidu (Gynecologist)",
    admissionDate: "2026-06-15",
    billingHistory: []
  },
  {
    id: "PAT-005",
    uhid: "UHID-2026-0005",
    name: "Anjali Deshmukh",
    husbandName: "Sanjay Deshmukh",
    age: 34,
    gender: "Female",
    mobileNumber: "9123456789",
    address: "Baner Road, Pune",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    admissionDate: "2026-06-15",
    billingHistory: []
  }
]

export const mockPackages: PackageItem[] = [
  {
    id: "PKG-001",
    name: "Standard IVF Package",
    category: "IVF / ICSI / FET",
    price: 150000,
    description: "Includes initial stimulation, egg retrieval, fertilization, and 1 fresh embryo transfer.",
    inclusions: ["Stimulation Monitoring", "Ultrasound Scans (Up to 5)", "OR Charges", "Embryologist Charges", "Fresh Transfer (1)"]
  },
  {
    id: "PKG-002",
    name: "ICSI Package Add-on Bundle",
    category: "IVF / ICSI / FET",
    price: 185000,
    description: "Intracytoplasmic Sperm Injection complete stimulation package + fertilization.",
    inclusions: ["IVF base procedures", "ICSI Injection technique", "Specialized sperm prep", "Blastocyst culture if suitable"]
  },
  {
    id: "PKG-003",
    name: "Donor Egg Programme - Premium",
    category: "Donor Programmes",
    price: 220000,
    description: "Donor screening, medication matching, retrieval, and standard fertilization.",
    inclusions: ["Donor Compensation & Meds", "Donor Screening Tests", "Recipient Prep", "Fertilization (ICSI)"]
  },
  {
    id: "PKG-004",
    name: "Frozen Embryo Transfer (FET)",
    category: "IVF / ICSI / FET",
    price: 65000,
    description: "Hormonal prep of recipient and thawing/transfer of stored embryos.",
    inclusions: ["Recipient Endometrial Prep", "Thawing of 1 Embryo Straw", "Transfer Procedure", "Post-transfer Scans"]
  },
  {
    id: "PKG-005",
    name: "Cryostorage - Annual Embryo",
    category: "Cryostorage",
    price: 25000,
    description: "Annual renewal fees for embryo storage in liquid nitrogen.",
    inclusions: ["Safe monitoring logs", "Liquid nitrogen top-ups", "12 Months storage safety cover"]
  },
  {
    id: "PKG-006",
    name: "Embryo Pooling Cycle",
    category: "Embryo Pooling",
    price: 130000,
    description: "Successive egg retrievals to pool embryos for low-reserve cases, excluding transfer.",
    inclusions: ["Stimulation checks", "Retrieval cycle", "ICSI and freezing (no transfer)"]
  },
  {
    id: "PKG-007",
    name: "Diagnostic Hysteroscopy",
    category: "Surgical Procedures",
    price: 35000,
    description: "Minimally invasive check of uterine cavity for polyps/fibroids.",
    inclusions: ["Day-care room charges", "OT equipment charges", "Surgeon fee", "Anaesthesia fee"]
  }
]

export const mockAddOns: AddOn[] = [
  { id: "ADD-001", name: "Laser Assisted Hatching (LAH)", price: 25000, category: "Embryology Lab", status: "Active" },
  { id: "ADD-002", name: "Blastocyst Culture", price: 15000, category: "Embryology Lab", status: "Active" },
  { id: "ADD-003", name: "Pre-implantation Genetic Screening (PGS) - Per Embryo", price: 30000, category: "Genetics", status: "Active" },
  { id: "ADD-004", name: "Specialized Embryo Glue", price: 10000, category: "Consumables", status: "Active" },
  { id: "ADD-005", name: "Anesthesia Charges (IV sedation)", price: 8000, category: "OT Charges", status: "Active" },
  { id: "ADD-006", name: "Donor Semen Vial", price: 15000, category: "Donor Programme", status: "Active" },
  { id: "ADD-007", name: "Surgery HPE - Small", price: 1500, category: "Procedure", status: "Active" },
  { id: "ADD-008", name: "Surgery HPE - Mid", price: 2000, category: "Procedure", status: "Active" },
  { id: "ADD-009", name: "Surgery HPE - Big", price: 2500, category: "Procedure", status: "Active" },
  { id: "ADD-010", name: "Sperm cryopreservation – VD", price: 15000, category: "Storage", status: "Active" }
]

export const mockBills: Bill[] = [
  {
    billNo: "BILL-2026-0001",
    uhid: "UHID-2026-0001",
    patientName: "Priyanka Sharma",
    packageName: "ICSI Basic",
    packagePrice: 100000,
    addOns: [{ name: "Laser-assisted hatching (LAH) — standard rate", price: 15000 }],
    roomCharges: 0,
    additionalCharges: 5000,
    discount: 10000,
    taxAmount: 0,
    grandTotal: 110000,
    date: "2026-06-01",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Day Care Bed 01",
    billingMethod: "full_payment",
    categoryName: "IVF / ICSI / FET",
    amountPaid: 110000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0001-1",
        receiptNo: "RCPT-2026-0001",
        paymentType: "Advance / Partial",
        method: "Debit Card",
        amount: 60000,
        date: "2026-06-01",
        time: "10:30",
        last4Digits: "4521",
        bankName: "HDFC Bank",
        receivedBy: "Reconciliation Desk",
        remarks: "First installment via debit card",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-01T10:30:00.000Z",
      },
      {
        id: "PYMT-BILL-2026-0001-2",
        receiptNo: "RCPT-2026-0002",
        paymentType: "Final Settlement",
        method: "UPI",
        amount: 50000,
        date: "2026-06-02",
        time: "14:15",
        transactionRef: "TXN-2026-0002-GPY",
        receivedBy: "Reconciliation Desk",
        remarks: "Balance cleared via UPI",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-02T14:15:00.000Z",
      },
    ],
    selectedLineItems: [
      { id: "icsi-basic-01", name: "OPU (ovum pick-up) procedure", price: 12000, category: "Procedure", qty: 1 },
      { id: "icsi-basic-02", name: "OT charges / theatre fee", price: 10000, category: "OT", qty: 1 },
      { id: "icsi-basic-03", name: "Anaesthetist fee + sedation / anaesthesia drugs", price: 8000, category: "Anaesthesia", qty: 1 },
      { id: "icsi-basic-04", name: "Embryologist fee", price: 12000, category: "Professional", qty: 1 },
      { id: "icsi-basic-05", name: "Sperm preparation for ICSI", price: 5000, category: "Lab", qty: 1 },
      { id: "icsi-basic-06", name: "ICSI procedure", price: 15000, category: "Procedure", qty: 1 },
      { id: "icsi-basic-07", name: "Blastocyst culture (Day 5 — all fertilised embryos)", price: 10000, category: "Lab", qty: 1 },
      { id: "icsi-basic-08", name: "Vitrification + 1-year cryostorage (2 cryolocks included)", price: 12000, category: "Lab", qty: 1 },
      { id: "icsi-basic-09", name: "Fresh embryo transfer — 1 attempt (same cycle, if applicable)", price: 8000, category: "Procedure", qty: 1 },
    ],
  },
  {
    billNo: "BILL-2026-0002",
    uhid: "UHID-2026-0003",
    patientName: "Kavitha Krishnan",
    packageName: "Donor Egg Programme",
    packagePrice: 300000,
    addOns: [
      { name: "Laser-assisted hatching (LAH) — standard rate", price: 15000 },
      { name: "Calcium ionophore", price: 10000 },
    ],
    roomCharges: 25000,
    additionalCharges: 10000,
    discount: 20000,
    taxAmount: 0,
    grandTotal: 330000,
    date: "2026-06-03",
    status: "Pending",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Room 305 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "Donor Programmes",
    amountPaid: 0,
    paymentBalance: 330000,
    payments: [],
  },
  {
    billNo: "BILL-2026-0003",
    uhid: "UHID-2026-0002",
    patientName: "Meera Patel",
    packageName: "ICSI Advanced + Single Room",
    packagePrice: 115000,
    addOns: [{ name: "Calcium ionophore", price: 10000 }],
    roomCharges: 0,
    additionalCharges: 2000,
    discount: 5000,
    taxAmount: 0,
    grandTotal: 122000,
    date: "2026-06-05",
    status: "Paid",
    doctorName: "Dr. S. K. Sen (Senior Embryologist)",
    roomNo: "Room 102 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "IVF / ICSI / FET",
    amountPaid: 122000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0003-1",
        receiptNo: "RCPT-2026-0003",
        paymentType: "Full Payment",
        method: "Bank Transfer",
        amount: 122000,
        date: "2026-06-05",
        time: "11:00",
        transactionRef: "NEFT2026060512345",
        bankName: "SBI",
        receivedBy: "Staff Receptionist B",
        remarks: "Full payment via NEFT",
        createdBy: "Staff Receptionist B",
        createdAt: "2026-06-05T11:00:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0004",
    uhid: "UHID-2026-0004",
    patientName: "Sneha Reddy",
    packageName: "FET without Anaesthesia",
    packagePrice: 20000,
    addOns: [],
    roomCharges: 0,
    additionalCharges: 1000,
    discount: 0,
    taxAmount: 0,
    grandTotal: 21000,
    date: "2026-06-08",
    status: "Paid",
    doctorName: "Dr. Priya Naidu (Gynecologist)",
    roomNo: "Day Care Bed 03",
    billingMethod: "item_wise",
    categoryName: "IVF / ICSI / FET",
    amountPaid: 21000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0004-1",
        receiptNo: "RCPT-2026-0004",
        paymentType: "Full Payment",
        method: "Cash",
        amount: 21000,
        date: "2026-06-08",
        time: "09:45",
        receivedBy: "Reconciliation Desk",
        remarks: "Full cash payment at reception",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-08T09:45:00.000Z",
      },
    ],
    selectedLineItems: [
      { id: "fet-noana-01", name: "Embryo thaw (per cryolock / straw)", price: 5000, category: "Lab", qty: 1 },
      { id: "fet-noana-02", name: "Embryologist fee", price: 6000, category: "Professional", qty: 1 },
      { id: "fet-noana-03", name: "OT / procedure room charges", price: 5000, category: "OT", qty: 1 },
      { id: "fet-noana-04", name: "Transfer catheter & consumables", price: 4000, category: "Consumables", qty: 1 },
    ],
  },
  {
    billNo: "BILL-2026-0005",
    uhid: "UHID-2026-0005",
    patientName: "Anjali Deshmukh",
    packageName: "Operative Hysteroscopy",
    packagePrice: 40000,
    addOns: [{ name: "Stylet", price: 5000 }],
    roomCharges: 5000,
    additionalCharges: 0,
    discount: 2000,
    taxAmount: 0,
    grandTotal: 48000,
    date: "2026-06-10",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Room 104 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "Surgical / Procedure Packages",
    amountPaid: 48000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0005-1",
        receiptNo: "RCPT-2026-0005",
        paymentType: "Full Payment",
        method: "UPI",
        amount: 48000,
        date: "2026-06-10",
        time: "13:20",
        transactionRef: "623718293847",
        receivedBy: "Staff Receptionist B",
        remarks: "Full payment via PhonePe",
        createdBy: "Staff Receptionist B",
        createdAt: "2026-06-10T13:20:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0006",
    uhid: "UHID-2026-0001",
    patientName: "Priyanka Sharma",
    packageName: "Sperm Cryopreservation (Processing + First Vial)",
    packagePrice: 3000,
    addOns: [],
    roomCharges: 0,
    additionalCharges: 0,
    discount: 0,
    taxAmount: 0,
    grandTotal: 3000,
    date: "2026-06-12",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Lab Bed",
    billingMethod: "full_payment",
    categoryName: "Cryostorage / Oocyte / Sperm Cryopreservation",
    amountPaid: 3000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0006-1",
        receiptNo: "RCPT-2026-0006",
        paymentType: "Full Payment",
        method: "Cash",
        amount: 3000,
        date: "2026-06-12",
        time: "10:05",
        receivedBy: "Reconciliation Desk",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-12T10:05:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0007",
    uhid: "UHID-2026-0002",
    patientName: "Meera Patel",
    packageName: "D&C",
    packagePrice: 25000,
    addOns: [],
    roomCharges: 0,
    additionalCharges: 1500,
    discount: 1500,
    taxAmount: 0,
    grandTotal: 25000,
    date: "2026-06-12",
    status: "Paid",
    doctorName: "Dr. S. K. Sen (Senior Embryologist)",
    roomNo: "Day Care 04",
    billingMethod: "full_payment",
    categoryName: "Surgical / Procedure Packages",
    amountPaid: 25000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0007-1",
        receiptNo: "RCPT-2026-0007",
        paymentType: "Full Payment",
        method: "Credit Card",
        amount: 25000,
        date: "2026-06-12",
        time: "15:30",
        last4Digits: "7823",
        bankName: "ICICI Bank",
        receivedBy: "Staff Receptionist B",
        remarks: "Paid by credit card",
        createdBy: "Staff Receptionist B",
        createdAt: "2026-06-12T15:30:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0008",
    uhid: "UHID-2026-0003",
    patientName: "Kavitha Krishnan",
    packageName: "FET with Anaesthesia",
    packagePrice: 35000,
    addOns: [{ name: "Additional FET", price: 45000 }],
    roomCharges: 10000,
    additionalCharges: 3000,
    discount: 5000,
    taxAmount: 0,
    grandTotal: 88000,
    date: "2026-06-14",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Room 105 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "IVF / ICSI / FET",
    amountPaid: 88000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0008-1",
        receiptNo: "RCPT-2026-0008",
        paymentType: "Advance / Partial",
        method: "UPI",
        amount: 50000,
        date: "2026-06-14",
        time: "09:00",
        transactionRef: "GPAY2026061450000",
        receivedBy: "Reconciliation Desk",
        remarks: "Advance via Google Pay",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-14T09:00:00.000Z",
      },
      {
        id: "PYMT-BILL-2026-0008-2",
        receiptNo: "RCPT-2026-0009",
        paymentType: "Final Settlement",
        method: "Cash",
        amount: 38000,
        date: "2026-06-15",
        time: "17:45",
        receivedBy: "Staff Receptionist B",
        remarks: "Balance paid at discharge",
        createdBy: "Staff Receptionist B",
        createdAt: "2026-06-15T17:45:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0009",
    uhid: "UHID-2026-0004",
    patientName: "Sneha Reddy",
    packageName: "3-Cycle ICSI",
    packagePrice: 300000,
    addOns: [
      { name: "Calcium ionophore", price: 10000 },
      { name: "Laser-assisted hatching (LAH) — standard rate", price: 15000 },
    ],
    roomCharges: 15000,
    additionalCharges: 10000,
    discount: 25000,
    taxAmount: 0,
    grandTotal: 315000,
    date: "2026-06-15",
    status: "Partially Paid",
    doctorName: "Dr. Priya Naidu (Gynecologist)",
    roomNo: "Room 106 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "Embryo Pooling / Oocyte Accumulation",
    amountPaid: 100000,
    paymentBalance: 215000,
    payments: [
      {
        id: "PYMT-BILL-2026-0009-1",
        receiptNo: "RCPT-2026-0010",
        paymentType: "Advance / Partial",
        method: "Bank Transfer",
        amount: 100000,
        date: "2026-06-15",
        time: "11:30",
        transactionRef: "RTGS2026061510000",
        bankName: "Axis Bank",
        receivedBy: "Reconciliation Desk",
        remarks: "Initial advance via RTGS",
        createdBy: "Reconciliation Desk",
        createdAt: "2026-06-15T11:30:00.000Z",
      },
    ],
  },
  {
    billNo: "BILL-2026-0010",
    uhid: "UHID-2026-0005",
    patientName: "Anjali Deshmukh",
    packageName: "FET Room Package (15-day stay)",
    packagePrice: 20000,
    addOns: [],
    roomCharges: 0,
    additionalCharges: 1000,
    discount: 0,
    taxAmount: 0,
    grandTotal: 21000,
    date: "2026-06-16",
    status: "Paid",
    doctorName: "Dr. Anjali Mehta (IVF Specialist)",
    roomNo: "Room 108 (Single Room)",
    billingMethod: "full_payment",
    categoryName: "IVF / ICSI / FET",
    amountPaid: 21000,
    paymentBalance: 0,
    payments: [
      {
        id: "PYMT-BILL-2026-0010-1",
        receiptNo: "RCPT-2026-0011",
        paymentType: "Full Payment",
        method: "Debit Card",
        amount: 21000,
        date: "2026-06-16",
        time: "12:00",
        last4Digits: "9034",
        bankName: "Kotak Bank",
        receivedBy: "Staff Receptionist B",
        remarks: "Full payment by debit card",
        createdBy: "Staff Receptionist B",
        createdAt: "2026-06-16T12:00:00.000Z",
      },
    ],
  },
]

export const mockUsers: User[] = [
  { id: "USR-001", name: "Admin Manager", email: "admin@ascas.com", role: "Admin", status: "Active" },
  { id: "USR-002", name: "Reconciliation Desk", email: "reception@ascas.com", role: "Reception", status: "Active" },
  { id: "USR-003", name: "Staff Receptionist B", email: "reception2@ascas.com", role: "Reception", status: "Active" }
]

export const mockNotifications: NotificationItem[] = [
  { id: "1", type: "success", message: "New bill generated successfully: BILL-2026-0002", time: "5 mins ago", read: false },
  { id: "2", type: "info", message: "Payment completed for BILL-2026-0001", time: "1 hour ago", read: false },
  { id: "3", type: "info", message: "User Staff Receptionist B added to reception team", time: "2 hours ago", read: true },
  { id: "4", type: "warning", message: "System scheduled maintenance tonight at 12:00 AM", time: "1 day ago", read: true }
]
