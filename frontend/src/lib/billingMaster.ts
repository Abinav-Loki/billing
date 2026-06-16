// ============================================================
// ASCAS FERTILITY & WOMEN'S CENTER – BILLING MASTER
// Aligned with official ASCAS Package Price List (Chennai)
// ============================================================

export type PackageCategory =
  | "IVF / ICSI / FET"
  | "Donor Programmes"
  | "Surgical / Procedure Packages"
  | "Cryostorage / Oocyte / Sperm Cryopreservation"
  | "Embryo Pooling / Oocyte Accumulation"
  | "Charity Programme"
  | "Add-ons / Separate Billing Items"

export type BillingMethod = "full_payment" | "item_wise"

export interface BillLineItem {
  id: string
  name: string
  price: number
  category: string
  isOptional?: boolean
  defaultQty?: number
  note?: string
  exclusiveGroup?: string
}

export interface PackageMaster {
  id: string
  name: string
  category: PackageCategory
  fullPaymentAmount: number
  description: string
  lineItems: BillLineItem[]
  duplicateBlockList?: string[]
  staffNote?: string
}

export interface AddOnItem {
  id: string
  name: string
  price: number
  category: string
  status: "Active" | "Inactive"
}

// ── IVF / ICSI / FET ─────────────────────────────────────────────────────────

const PKG_ICSI_BASIC_ITEMS: BillLineItem[] = [
  { id: "PKG-ICSI-BASIC-0",  name: "OPU (ovum pick-up) procedure",                              price: 9100, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-1",  name: "OT charges / theatre fee",                                  price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-2",  name: "Anaesthetist fee + sedation / anaesthesia drugs",            price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-3",  name: "Embryologist fee",                                           price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-4",  name: "Sperm preparation for ICSI",                                 price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-5",  name: "ICSI procedure",                                             price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-6",  name: "Blastocyst culture (Day 5 — all fertilised embryos)",        price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-7",  name: "Vitrification + 1-year cryostorage (2 cryolocks included)", price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-8",  name: "Fresh embryo transfer — 1 attempt (same cycle, if applicable)", price: 9090, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-BASIC-9",  name: "Consumables + pap smear + administrative charges",           price: 9090, category: "Procedure",   isOptional: false },
  { id: "PKG-ICSI-BASIC-10", name: "Monitoring consultations + follicular scans during stimulation", price: 9090, category: "Procedure", isOptional: false },
]

const PKG_ICSI_ADV_ITEMS: BillLineItem[] = [
  { id: "PKG-ICSI-ADV-0",  name: "OPU (ovum pick-up) procedure",                               price: 9174, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-1",  name: "OT charges / theatre fee",                                   price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-2",  name: "Anaesthetist fee + sedation / anaesthesia drugs",             price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-3",  name: "Embryologist fee",                                            price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-4",  name: "Sperm preparation — advanced selection",                      price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-5",  name: "MF / Microfluidic sperm selection — selected at consultation", price: 9166, category: "Procedure", isOptional: false, exclusiveGroup: "mf-picsi" },
  { id: "PKG-ICSI-ADV-6",  name: "PICSI — selected at consultation",                            price: 9166, category: "Procedure", isOptional: true,  exclusiveGroup: "mf-picsi" },
  { id: "PKG-ICSI-ADV-7",  name: "ICSI procedure",                                              price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-8",  name: "Blastocyst culture (Day 5 — all fertilised embryos)",         price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-9",  name: "Vitrification + 1-year cryostorage (2 cryolocks included)",  price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-10", name: "Fresh embryo transfer — 1 attempt (same cycle, if applicable)", price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-11", name: "Consumables + pap smear + administrative charges",            price: 9166, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-ADV-12", name: "Monitoring consultations + follicular scans during stimulation", price: 9166, category: "Procedure", isOptional: false },
]

const PKG_ICSI_PGT_ITEMS: BillLineItem[] = [
  { id: "PKG-ICSI-PGT-0",  name: "OPU (ovum pick-up) procedure",                               price: 16676, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-1",  name: "Pick-up & administrative charges",                            price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-2",  name: "OT charges / theatre fee",                                   price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-3",  name: "Anaesthetist fee",                                            price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-4",  name: "Sedation / anaesthesia drugs",                                price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-5",  name: "Embryologist fee",                                            price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-6",  name: "Sperm preparation for ICSI",                                  price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-7",  name: "ICSI procedure",                                              price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-8",  name: "Blastocyst culture (Day 5 — all fertilised embryos)",         price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-9",  name: "PGT-A biopsy + genetic testing (up to 4 embryos)",           price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-10", name: "Vitrification + 1-year cryostorage",                          price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-11", name: "1 × FET including anaesthesia + embryo glue",                 price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-12", name: "Consumables",                                                 price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-13", name: "Pap smear",                                                   price: 16666, category: "Procedure", isOptional: false },
  { id: "PKG-ICSI-PGT-14", name: "Monitoring consultations + follicular scans during stimulation", price: 16666, category: "Procedure", isOptional: false },
]

const PKG_FET_NOANA_ITEMS: BillLineItem[] = [
  { id: "PKG-FET-NOANA-0", name: "Embryo thaw (per cryolock / straw)",                        price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-1", name: "Embryologist fee",                                           price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-2", name: "OT / procedure room charges",                               price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-3", name: "Transfer catheter & consumables",                            price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-4", name: "Ultrasound guidance during transfer",                        price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-5", name: "Embryo glue (EG)",                                           price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-NOANA-6", name: "Endometrial preparation monitoring scans + consultations",   price: 5000, category: "Procedure", isOptional: false },
]

const PKG_FET_ANA_ITEMS: BillLineItem[] = [
  { id: "PKG-FET-ANA-0", name: "Embryo thaw",                                                 price: 4445, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-1", name: "Embryologist fee",                                             price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-2", name: "OT / procedure room charges",                                 price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-3", name: "Transfer catheter & consumables",                              price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-4", name: "Ultrasound guidance",                                          price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-5", name: "Embryo glue",                                                  price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-6", name: "Monitoring scans + consultations",                             price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-7", name: "Anaesthetist fee",                                             price: 4444, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ANA-8", name: "Sedation / anaesthesia drugs",                                 price: 4447, category: "Procedure", isOptional: false },
]

const PKG_FET_ROOM_ITEMS: BillLineItem[] = [
  { id: "PKG-FET-ROOM-0", name: "All FET with anaesthesia inclusions",                        price: 40000, category: "Procedure", isOptional: false },
  { id: "PKG-FET-ROOM-1", name: "15-day single room stay (when opted / advised by clinician)", price: 5000,  category: "Room",      isOptional: false, note: "Rate per day × 15 days" },
]

const PKG_ROOM_SINGLE_ITEMS: BillLineItem[] = [
  { id: "PKG-ROOM-SINGLE-0", name: "Single room (1 night)", price: 5000, category: "Room", isOptional: false },
]

const PKG_ROOM_ICSI_BASIC_ITEMS: BillLineItem[] = [
  { id: "PKG-ROOM-ICSI-BASIC-0", name: "All ICSI Basic inclusions",    price: 35000, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-BASIC-1", name: "Monitoring consultations",      price: 35000, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-BASIC-2", name: "Single room (1 night)",         price: 35000, category: "Room",      isOptional: false },
]

const PKG_ROOM_ICSI_ADV_ITEMS: BillLineItem[] = [
  { id: "PKG-ROOM-ICSI-ADV-0", name: "All ICSI Advanced inclusions",   price: 38334, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-ADV-1", name: "Monitoring consultations",        price: 38333, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-ADV-2", name: "Single room (1 night)",           price: 38333, category: "Room",      isOptional: false },
]

const PKG_ROOM_ICSI_PGT_ITEMS: BillLineItem[] = [
  { id: "PKG-ROOM-ICSI-PGT-0", name: "All ICSI + PGT-A inclusions",    price: 85000, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-PGT-1", name: "Monitoring consultations",        price: 85000, category: "Procedure", isOptional: false },
  { id: "PKG-ROOM-ICSI-PGT-2", name: "Single room (1 night)",           price: 85000, category: "Room",      isOptional: false },
]

// ── Donor Programmes ─────────────────────────────────────────────────────────

const PKG_DONOR_EGG_ITEMS: BillLineItem[] = [
  { id: "PKG-DONOR-EGG-0",  name: "Donor recruitment, screening & eligibility assessment",   price: 27274, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-1",  name: "Donor stimulation cycle",                                 price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-2",  name: "Donor monitoring scans & consultations",                  price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-3",  name: "Donor OPU procedure",                                     price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-4",  name: "OT charges",                                              price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-5",  name: "Anaesthetist fee & sedation drugs",                       price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-6",  name: "Embryologist fee",                                        price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-7",  name: "ICSI using recipient partner (husband) sperm",            price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-8",  name: "Blastocyst culture",                                      price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-9",  name: "Vitrification",                                           price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-10", name: "One-year embryo cryostorage",                             price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EGG-11", name: "Administrative & documentation charges",                  price: 27272, category: "Procedure", isOptional: false },
  // NOTE: FET is NOT included — billed separately
]

const PKG_DONOR_EMBRYO_ITEMS: BillLineItem[] = [
  { id: "PKG-DONOR-EMBRYO-0", name: "Donor couple recruitment",                               price: 35556, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-1", name: "Screening & eligibility assessment",                     price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-2", name: "Donor ICSI cycle or donor embryo allocation",            price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-3", name: "Embryo matching",                                        price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-4", name: "Administrative & legal documentation",                   price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-5", name: "Recipient endometrial preparation monitoring",            price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-6", name: "Embryologist services",                                  price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-7", name: "Embryo thaw",                                            price: 35555, category: "Procedure", isOptional: false },
  { id: "PKG-DONOR-EMBRYO-8", name: "Consumables",                                            price: 35555, category: "Procedure", isOptional: false },
  // NOTE: Recipient FET is NOT included — billed separately
]

const PKG_DONOR_ADVANCE_ITEMS: BillLineItem[] = [
  { id: "PKG-DONOR-ADV-0", name: "Package advance — donor recruitment fee", price: 200000, category: "Admin", isOptional: false,
    note: "Collected before donor recruitment begins. Non-refundable once recruitment is initiated." },
]

const PKG_DONOR_BALANCE_ITEMS: BillLineItem[] = [
  { id: "PKG-DONOR-BAL-0", name: "Balance donor payment (after recruitment)", price: 100000, category: "Admin", isOptional: false,
    note: "Full package balance. Must be paid before donor OPU is scheduled." },
]

// ── Surgical / Procedure Packages ─────────────────────────────────────────────

const SURGICAL_EXCLUSIONS: BillLineItem[] = [
  { id: "SURG-EXCL-0", name: "Histopathology / biopsy (billed separately if required)", price: 0, category: "Exclusion", isOptional: true, note: "Not included. Bill separately at actual cost." },
  { id: "SURG-EXCL-1", name: "Overnight room stay (billed separately if required)",      price: 0, category: "Exclusion", isOptional: true, note: "Not included. Single room @ ₹5,000/night." },
  { id: "SURG-EXCL-2", name: "Post-op medicines / antibiotics (billed separately)",      price: 0, category: "Exclusion", isOptional: true, note: "Not included. Pharmacy billed at actuals." },
  { id: "SURG-EXCL-3", name: "Additional operative intervention (billed separately)",    price: 0, category: "Exclusion", isOptional: true, note: "Not included. Requires separate billing approval." },
]

const PKG_DIAG_LAP_ITEMS: BillLineItem[] = [
  { id: "PKG-DIAG-LAP-0", name: "Surgeon fee",                 price: 8336, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-1", name: "OT charges / theatre fee (major)", price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-2", name: "General anaesthesia (GA)",    price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-3", name: "Anaesthetist fee",            price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-4", name: "Scrub nurse / OT staff",      price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-5", name: "Surgical consumables pack",   price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-6", name: "Day care / recovery room",    price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-7", name: "Nursing charges",             price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-LAP-8", name: "Post-op review (1 visit)",    price: 8333, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_DIAG_HYST_ITEMS: BillLineItem[] = [
  { id: "PKG-DIAG-HYST-0", name: "Surgeon fee",                  price: 6670, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-1", name: "OT / procedure room charges",  price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-2", name: "Anaesthetist fee",             price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-3", name: "Sedation / anaesthesia drugs", price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-4", name: "Scrub nurse / OT staff",       price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-5", name: "Surgical consumables",         price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-6", name: "Day care / recovery",          price: 6666, category: "Procedure", isOptional: false },
  { id: "PKG-DIAG-HYST-7", name: "Post-op review (1 visit)",     price: 6666, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_OP_HYST_ITEMS: BillLineItem[] = [
  { id: "PKG-OP-HYST-0", name: "Surgeon fee",                    price: 8334, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-1", name: "OT / procedure room charges",    price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-2", name: "Anaesthetist fee",               price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-3", name: "Sedation / anaesthesia drugs",   price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-4", name: "Scrub nurse / OT staff",         price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-5", name: "Surgical consumables + scope",   price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-6", name: "Day care / recovery",            price: 8333, category: "Procedure", isOptional: false },
  { id: "PKG-OP-HYST-7", name: "Post-op review (1 visit)",       price: 8333, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_DNC_ITEMS: BillLineItem[] = [
  { id: "PKG-DNC-0", name: "Surgeon fee",                  price: 6250, category: "Procedure", isOptional: false },
  { id: "PKG-DNC-1", name: "OT / procedure room charges",  price: 6250, category: "Procedure", isOptional: false },
  { id: "PKG-DNC-2", name: "Anaesthetist fee",             price: 6250, category: "Procedure", isOptional: false },
  { id: "PKG-DNC-3", name: "Surgical consumables",         price: 6250, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_CERCLAGE_ITEMS: BillLineItem[] = [
  { id: "PKG-CERCLAGE-0", name: "Surgeon fee",                  price: 10000, category: "Procedure", isOptional: false },
  { id: "PKG-CERCLAGE-1", name: "OT / procedure room charges",  price: 10000, category: "Procedure", isOptional: false },
  { id: "PKG-CERCLAGE-2", name: "Anaesthetist fee",             price: 10000, category: "Procedure", isOptional: false },
  { id: "PKG-CERCLAGE-3", name: "Surgical consumables + suture", price: 10000, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_PESA_ITEMS: BillLineItem[] = [
  { id: "PKG-PESA-0", name: "Dr. AP surgeon fee (PESA / TESA)",    price: 13334, category: "Procedure", isOptional: false },
  { id: "PKG-PESA-1", name: "OT / procedure room charges",          price: 13333, category: "Procedure", isOptional: false },
  { id: "PKG-PESA-2", name: "Anaesthetist fee + sedation",          price: 13333, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_CYST_ASP_ITEMS: BillLineItem[] = [
  { id: "PKG-CYST-ASP-0", name: "Surgeon / gynaecologist fee",      price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-CYST-ASP-1", name: "OT / procedure room charges",      price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-CYST-ASP-2", name: "Ultrasound guidance",              price: 5000, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_IUI_ANA_ITEMS: BillLineItem[] = [
  { id: "PKG-IUI-ANA-0", name: "IUI procedure fee",                  price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-IUI-ANA-1", name: "Anaesthetist fee + sedation",        price: 5000, category: "Procedure", isOptional: false },
  { id: "PKG-IUI-ANA-2", name: "OT / procedure room charges",        price: 5000, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

const PKG_BARTHOLIN_ITEMS: BillLineItem[] = [
  { id: "PKG-BARTHOLIN-0", name: "Surgeon fee",                  price: 6667, category: "Procedure", isOptional: false },
  { id: "PKG-BARTHOLIN-1", name: "OT / procedure room charges",  price: 6667, category: "Procedure", isOptional: false },
  { id: "PKG-BARTHOLIN-2", name: "Anaesthetist fee + sedation",  price: 6666, category: "Procedure", isOptional: false },
  ...SURGICAL_EXCLUSIONS,
]

// ── Cryostorage ───────────────────────────────────────────────────────────────

const PKG_EGG_FRZ_ITEMS: BillLineItem[] = [
  { id: "PKG-EGG-FRZ-0",  name: "Pre-cycle consultation",           price: 8190, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-1",  name: "Ovarian reserve assessment",       price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-2",  name: "Monitoring scans",                 price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-3",  name: "Monitoring consultations",         price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-4",  name: "OPU procedure",                    price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-5",  name: "OT charges",                       price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-6",  name: "Anaesthetist fee",                 price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-7",  name: "Sedation drugs",                   price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-8",  name: "Embryologist fee",                 price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-9",  name: "Oocyte vitrification",             price: 8181, category: "Procedure", isOptional: false },
  { id: "PKG-EGG-FRZ-10", name: "One-year storage",                 price: 8181, category: "Procedure", isOptional: false },
]

// ── Embryo Pooling ────────────────────────────────────────────────────────────

const PKG_2CYCLE_ITEMS: BillLineItem[] = [
  { id: "PKG-2CYCLE-0", name: "Cycle 1 OPU",             price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-1", name: "Cycle 1 ICSI",            price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-2", name: "Cycle 1 Blastocyst Culture", price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-3", name: "Cycle 2 OPU",             price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-4", name: "Cycle 2 ICSI",            price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-5", name: "Cycle 2 Blastocyst Culture", price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-6", name: "One-year cryostorage",    price: 26250, category: "Procedure", isOptional: false },
  { id: "PKG-2CYCLE-7", name: "One FET included",        price: 26250, category: "Procedure", isOptional: false },
]

const PKG_3CYCLE_ITEMS: BillLineItem[] = [
  { id: "PKG-3CYCLE-0",  name: "Cycle 1 OPU",              price: 27280, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-1",  name: "Cycle 1 ICSI",             price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-2",  name: "Cycle 1 Blastocyst Culture", price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-3",  name: "Cycle 2 OPU",              price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-4",  name: "Cycle 2 ICSI",             price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-5",  name: "Cycle 2 Blastocyst Culture", price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-6",  name: "Cycle 3 OPU",              price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-7",  name: "Cycle 3 ICSI",             price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-8",  name: "Cycle 3 Blastocyst Culture", price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-9",  name: "One-year cryostorage",     price: 27272, category: "Procedure", isOptional: false },
  { id: "PKG-3CYCLE-10", name: "Two FETs included",        price: 27272, category: "Procedure", isOptional: false },
]

// ── Charity ───────────────────────────────────────────────────────────────────

const PKG_CHARITY_ITEMS: BillLineItem[] = [
  { id: "PKG-CHARITY-0", name: "Reduced package cost",           price: 30000, category: "Procedure", isOptional: false },
  { id: "PKG-CHARITY-1", name: "Free monitoring consultations",  price: 30000, category: "Procedure", isOptional: false },
  { id: "PKG-CHARITY-2", name: "Free follicular scans",          price: 30000, category: "Procedure", isOptional: false },
]

// ═════════════════════════════════════════════════════════════════════════════
// PACKAGE MASTER — Full Registry
// ═════════════════════════════════════════════════════════════════════════════

export const PACKAGE_MASTER: PackageMaster[] = [

  // ── IVF / ICSI / FET ──────────────────────────────────────────────────────

  {
    id: "PKG-ICSI-BASIC",
    name: "ICSI Basic",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 100000,
    description: "OPU + ICSI + Blastocyst Culture + 1-year storage + Fresh ET.",
    staffNote: "OPU + ICSI + blastocyst culture + 1-year storage + fresh ET. Consultations and follicular scans during stimulation included. Excludes: stimulation medicines, pre-cycle hormones, serology, ECG, Echo, PAC, blood tests, semen workup.",
    lineItems: PKG_ICSI_BASIC_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "embryo transfer", "Monitoring"],
  },

  {
    id: "PKG-ICSI-ADV",
    name: "ICSI Advanced",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 110000,
    description: "OPU + MF or PICSI + Blastocyst + Fresh ET.",
    staffNote: "ICSI Basic + either MF or PICSI. One sperm selection method included. Confirm which method (MF / PICSI) at consultation before billing. Excludes: stimulation medicines, pre-cycle hormones, serology, ECG, Echo, PAC, blood tests, semen workup.",
    lineItems: PKG_ICSI_ADV_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "embryo transfer", "Monitoring", "MF", "PICSI"],
  },

  {
    id: "PKG-ICSI-PGT",
    name: "ICSI + PGT-A",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 250000,
    description: "OPU + ICSI + PGT-A (up to 4 embryos) + 1-year storage + 1 FET included.",
    staffNote: "OPU + ICSI + PGT-A package. Embryos beyond the package inclusion (4 embryos) billed separately at ₹25,000 per additional embryo. Excludes: stimulation medicines, pre-cycle hormones, serology, ECG, Echo, PAC, blood tests, semen workup.",
    lineItems: PKG_ICSI_PGT_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "FET", "PGT-A", "Monitoring", "Pap smear"],
  },

  {
    id: "PKG-FET-NOANA",
    name: "FET without anaesthesia",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 35000,
    description: "Embryo thaw + embryologist + OT + consumables + monitoring | No sedation.",
    staffNote: "Embryo thaw + embryologist + OT + catheter + ultrasound guidance + embryo glue + monitoring. Excludes: endometrial preparation medicines, luteal support medicines, additional hormone tests, Beta-hCG, post-transfer scan.",
    lineItems: PKG_FET_NOANA_ITEMS,
    duplicateBlockList: ["Embryo thaw", "Embryologist", "OT", "Transfer catheter", "Ultrasound guidance", "Embryo glue", "Endometrial preparation"],
  },

  {
    id: "PKG-FET-ANA",
    name: "FET with anaesthesia",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 40000,
    description: "Embryo thaw + embryologist + OT + anaesthesia + consumables + monitoring | Sedation included.",
    staffNote: "FET package with anaesthetist fee and sedation / anaesthesia drugs included. Excludes: endometrial preparation medicines, luteal support medicines, additional hormone tests, Beta-hCG, post-transfer scan.",
    lineItems: PKG_FET_ANA_ITEMS,
    duplicateBlockList: ["Embryo thaw", "Embryologist", "OT", "Anaesthetist", "Transfer catheter", "Ultrasound guidance", "Embryo glue", "Endometrial preparation"],
  },

  {
    id: "PKG-FET-ROOM",
    name: "FET Room Package / 15-Day Stay",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 45000,
    description: "FET with 15-day stay when opted / advised by clinician.",
    staffNote: "15-day stay package when opted/advised. Confirm clinician approval before billing. Includes all FET with anaesthesia components + room stay. Excludes: endometrial preparation medicines, luteal support medicines, additional hormone tests, Beta-hCG, post-transfer scan.",
    lineItems: PKG_FET_ROOM_ITEMS,
    duplicateBlockList: ["Embryo thaw", "Embryologist", "OT", "Anaesthetist", "Transfer catheter", "Ultrasound guidance", "Embryo glue", "room stay"],
  },

  {
    id: "PKG-ROOM-SINGLE",
    name: "Single Room",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 5000,
    description: "Single Room (per night).",
    staffNote: "Charged per night. Confirm number of nights at billing.",
    lineItems: PKG_ROOM_SINGLE_ITEMS,
    duplicateBlockList: [],
  },

  {
    id: "PKG-ROOM-ICSI-BASIC",
    name: "ICSI Basic + Room",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 105000,
    description: "All ICSI Basic inclusions + Monitoring consultations + Single room (1 night).",
    staffNote: "Bundled option: ICSI Basic + 1 night single room stay. Use only when room stay is confirmed.",
    lineItems: PKG_ROOM_ICSI_BASIC_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "embryo transfer", "Monitoring", "Single room"],
  },

  {
    id: "PKG-ROOM-ICSI-ADV",
    name: "ICSI Advanced + Room",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 115000,
    description: "All ICSI Advanced inclusions + Monitoring consultations + Single room (1 night).",
    staffNote: "Bundled option: ICSI Advanced + 1 night single room stay. Confirm MF / PICSI selection before billing.",
    lineItems: PKG_ROOM_ICSI_ADV_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "embryo transfer", "Monitoring", "Single room", "MF", "PICSI"],
  },

  {
    id: "PKG-ROOM-ICSI-PGT",
    name: "ICSI + PGT-A + Room",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 255000,
    description: "All ICSI + PGT-A inclusions + Monitoring consultations + Single room (1 night).",
    staffNote: "Bundled option: ICSI + PGT-A + 1 night single room stay. Embryos beyond 4 billed separately.",
    lineItems: PKG_ROOM_ICSI_PGT_ITEMS,
    duplicateBlockList: ["OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI procedure", "Blastocyst", "Vitrification", "FET", "PGT-A", "Monitoring", "Pap smear", "Single room"],
  },

  // ── Donor Programmes ──────────────────────────────────────────────────────

  {
    id: "PKG-DONOR-EGG",
    name: "Donor Egg Programme",
    category: "Donor Programmes",
    fullPaymentAmount: 300000,
    description: "Full donor egg programme — donor recruitment, stimulation, OPU, ICSI, blastocyst culture, vitrification, 1-year storage.",
    staffNote: "⚠ FET IS EXCLUDED. FET must be billed separately. Package covers: donor recruitment, donor screening, donor stimulation, OPU, ICSI with husband sperm, blastocyst culture, vitrification, 1-year storage. Excludes: recipient medicines, recipient serology, recipient hormonal monitoring, FET charges, add-ons beyond included services.",
    lineItems: PKG_DONOR_EGG_ITEMS,
    duplicateBlockList: ["Donor recruitment", "Donor stimulation", "Donor OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI", "Blastocyst", "Vitrification", "cryostorage"],
  },

  {
    id: "PKG-DONOR-EMBRYO",
    name: "Donor Embryo Programme",
    category: "Donor Programmes",
    fullPaymentAmount: 320000,
    description: "Donor embryo programme — donor couple recruitment, screening, ICSI cycle or embryos, matching, documentation.",
    staffNote: "⚠ Recipient FET is EXCLUDED. FET must be billed separately. Package covers: donor couple recruitment, screening, donor ICSI cycle or embryos, matching, documentation. Excludes: recipient medicines, recipient serology, recipient hormonal monitoring, FET charges, add-ons beyond included services.",
    lineItems: PKG_DONOR_EMBRYO_ITEMS,
    duplicateBlockList: ["Donor couple", "Screening", "ICSI cycle", "Embryo allocation", "Matching", "Administrative", "Recipient endometrial", "Embryologist", "Embryo thaw", "Consumables"],
  },

  {
    id: "PKG-DONOR-ADVANCE",
    name: "Package Advance – Donor Recruitment",
    category: "Donor Programmes",
    fullPaymentAmount: 200000,
    description: "Advance payment collected before donor recruitment begins.",
    staffNote: "Collect before donor recruitment. Non-refundable once recruitment is initiated. Balance of ₹1,00,000 due after recruitment, before donor OPU.",
    lineItems: PKG_DONOR_ADVANCE_ITEMS,
    duplicateBlockList: [],
  },

  {
    id: "PKG-DONOR-BALANCE",
    name: "After Donor Recruitment (Balance Payment)",
    category: "Donor Programmes",
    fullPaymentAmount: 100000,
    description: "Balance donor payment collected after recruitment, before donor OPU.",
    staffNote: "Balance donor payment. Full package payment required before donor OPU is scheduled. Do NOT proceed with OPU until this payment is confirmed.",
    lineItems: PKG_DONOR_BALANCE_ITEMS,
    duplicateBlockList: [],
  },

  // ── Surgical / Procedure Packages ─────────────────────────────────────────

  {
    id: "PKG-DIAG-LAP",
    name: "Diagnostic Laparoscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 75000,
    description: "Diagnostic laparoscopy under general anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, GA, anaesthetist, scrub nurse, consumables, day care, nursing, post-op review. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_DIAG_LAP_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "General anaesthesia", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Nursing", "Post-op"],
  },

  {
    id: "PKG-DIAG-HYST",
    name: "Diagnostic Hysteroscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Diagnostic hysteroscopy under sedation.",
    staffNote: "Package includes: surgeon fee, OT / procedure room, anaesthetist fee, sedation drugs, scrub nurse, consumables, day care, post-op review. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_DIAG_HYST_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Post-op"],
  },

  {
    id: "PKG-OP-HYST",
    name: "Operative Hysteroscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 50000,
    description: "Operative hysteroscopy under sedation / GA.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee, sedation drugs, scrub nurse, consumables + scope, day care, post-op review. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_OP_HYST_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Post-op"],
  },

  {
    id: "PKG-DNC",
    name: "D&C",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 25000,
    description: "Dilatation and curettage procedure.",
    staffNote: "Package includes: surgeon fee, OT / procedure room, anaesthetist fee, consumables. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_DNC_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Consumables"],
  },

  {
    id: "PKG-CERCLAGE",
    name: "Cervical Cerclage",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Cervical cerclage procedure under anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee, consumables + suture. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_CERCLAGE_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Consumables"],
  },

  {
    id: "PKG-PESA",
    name: "PESA / TESA – Dr. AP",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Percutaneous epididymal / testicular sperm aspiration by Dr. AP.",
    staffNote: "Performed by Dr. AP only. Package includes: surgeon fee, OT / procedure room, anaesthetist fee + sedation. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_PESA_ITEMS,
    duplicateBlockList: ["Dr. AP", "OT", "Anaesthetist"],
  },

  {
    id: "PKG-CYST-ASP",
    name: "Ultrasound-Guided Cyst Aspiration",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 15000,
    description: "Ultrasound-guided aspiration of ovarian / pelvic cyst.",
    staffNote: "Package includes: gynaecologist fee, OT / procedure room, ultrasound guidance. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_CYST_ASP_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Ultrasound"],
  },

  {
    id: "PKG-IUI-ANA",
    name: "IUI under Anaesthesia",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 15000,
    description: "Intrauterine insemination performed under sedation / anaesthesia.",
    staffNote: "Package includes: IUI procedure fee, anaesthetist fee + sedation, OT / procedure room. Excludes: semen preparation, medication, sperm workup — billed separately.",
    lineItems: PKG_IUI_ANA_ITEMS,
    duplicateBlockList: ["IUI", "Anaesthetist", "OT"],
  },

  {
    id: "PKG-BARTHOLIN",
    name: "Bartholin Cystectomy / Marsupialisation",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 20000,
    description: "Bartholin cystectomy or marsupialisation under anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee + sedation. Excludes: histopathology / biopsy, overnight room stay, post-op medicines / antibiotics, additional operative intervention — all billed separately.",
    lineItems: PKG_BARTHOLIN_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist"],
  },

  // ── Cryostorage / Oocyte / Sperm ──────────────────────────────────────────

  {
    id: "PKG-EGG-FRZ",
    name: "Egg Freezing / Oocyte Vitrification",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 90000,
    description: "Oocyte vitrification — complete cycle including OPU + freezing + 1-year storage.",
    staffNote: "Package includes: pre-cycle consultation, ovarian reserve assessment, monitoring scans, monitoring consultations, OPU procedure, OT, anaesthetist, sedation drugs, embryologist fee, oocyte vitrification, one-year storage. Excludes: stimulation medicines, pre-cycle hormones, serology, blood tests.",
    lineItems: PKG_EGG_FRZ_ITEMS,
    duplicateBlockList: ["Pre-cycle", "Ovarian", "Monitoring", "OPU", "OT", "Anaesthetist", "Sedation", "Embryologist", "vitrification", "storage"],
  },

  // ── Embryo Pooling ─────────────────────────────────────────────────────────

  {
    id: "PKG-2CYCLE",
    name: "2-Cycle ICSI / Embryo Pooling",
    category: "Embryo Pooling / Oocyte Accumulation",
    fullPaymentAmount: 210000,
    description: "Two consecutive ICSI cycles for embryo pooling.",
    staffNote: "2 complete OPU + ICSI cycles, blastocyst culture, 1-year storage, 1 FET included. Excludes: stimulation medicines for both cycles, pre-cycle hormones, serology, blood tests. Additional FETs beyond the included 1 billed separately.",
    lineItems: PKG_2CYCLE_ITEMS,
    duplicateBlockList: ["Cycle 1", "Cycle 2", "cryostorage", "FET"],
  },

  {
    id: "PKG-3CYCLE",
    name: "3-Cycle ICSI / Embryo Pooling",
    category: "Embryo Pooling / Oocyte Accumulation",
    fullPaymentAmount: 300000,
    description: "Three consecutive ICSI cycles for embryo pooling.",
    staffNote: "3 complete OPU + ICSI cycles, blastocyst culture, 1-year storage, 2 FETs included. Excludes: stimulation medicines for all cycles, pre-cycle hormones, serology, blood tests. Additional FETs beyond the included 2 billed separately.",
    lineItems: PKG_3CYCLE_ITEMS,
    duplicateBlockList: ["Cycle 1", "Cycle 2", "Cycle 3", "cryostorage", "FET"],
  },

  // ── Charity ────────────────────────────────────────────────────────────────

  {
    id: "PKG-CHARITY",
    name: "ICSI Charity Package",
    category: "Charity Programme",
    fullPaymentAmount: 90000,
    description: "Use only if clinician approved. Reduced package cost.",
    staffNote: "⚠ Use ONLY after written clinician approval. Reduced package rate. All standard ICSI inclusions apply. Monitoring consultations and follicular scans are complimentary.",
    lineItems: PKG_CHARITY_ITEMS,
    duplicateBlockList: ["Reduced", "monitoring", "follicular"],
  },
]

// ═════════════════════════════════════════════════════════════════════════════
// ADD-ON MASTER
// ═════════════════════════════════════════════════════════════════════════════

export const ADDON_MASTER: AddOnItem[] = [
  { id: "ADD-MF",            name: "MF / Microfluidic sperm selection",                      price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-PICSI",         name: "PICSI",                                                   price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-CALCIUM",       name: "Calcium Ionophore",                                       price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-PGTA",          name: "PGT-A (per additional embryo beyond package inclusion)",  price: 25000, category: "Genetics",   status: "Active" },
  { id: "ADD-LAH",           name: "Laser-assisted hatching (LAH)",                          price: 15000, category: "Lab",        status: "Active" },
  { id: "ADD-SCRATCH",       name: "Endometrial Scratch",                                     price: 3000,  category: "Procedure",  status: "Active" },
  { id: "ADD-STYLET",        name: "Stylet used",                                             price: 5000,  category: "Consumables", status: "Active" },
  { id: "ADD-FET",           name: "Additional FET (beyond included FET)",                   price: 40000, category: "Procedure",  status: "Active" },
  { id: "ADD-CRYO",          name: "Additional Cryolock",                                     price: 5000,  category: "Consumables", status: "Active" },

  // Cryostorage separate items (also billable as add-ons)
  { id: "ADD-CRYO-RENEW",    name: "Annual cryolock renewal (per cryolock)",                 price: 5000,  category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-3M",      name: "Sperm cryopreservation – first vial / 3 months",         price: 5000,  category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-6M",      name: "Sperm cryopreservation – 6 months",                      price: 10000, category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-1Y",      name: "Long-term sperm cryopreservation – 1 year",              price: 20000, category: "Storage",    status: "Active" },
  { id: "ADD-EMBRYO-STORAGE", name: "Embryo cryostorage – 2 cryolocks (included 1 yr in all ICSI packages)", price: 0, category: "Storage", status: "Active" },
]

// ═════════════════════════════════════════════════════════════════════════════
// BILLING RULES ENGINE
// ═════════════════════════════════════════════════════════════════════════════

export interface BillingRuleViolation {
  severity: "error" | "warning"
  message: string
  blockedItem: string
}

export function checkBillingRules(
  packageId: string,
  billingMethod: BillingMethod,
  additionalItemNames: string[]
): BillingRuleViolation[] {
  const pkg = PACKAGE_MASTER.find((p) => p.id === packageId)
  if (!pkg || billingMethod !== "full_payment" || !pkg.duplicateBlockList) return []

  const violations: BillingRuleViolation[] = []
  for (const blockedKeyword of pkg.duplicateBlockList) {
    for (const item of additionalItemNames) {
      if (item.toLowerCase().includes(blockedKeyword.toLowerCase())) {
        violations.push({
          severity: "error",
          message: `"${item}" is already included in the full payment for "${pkg.name}". Duplicate billing is not allowed.`,
          blockedItem: item,
        })
      }
    }
  }
  return violations
}

export function checkExclusiveGroups(
  selectedItemIds: string[],
  lineItems: BillLineItem[]
): { group: string; items: BillLineItem[] }[] {
  const groups = new Map<string, BillLineItem[]>()

  for (const itemId of selectedItemIds) {
    const item = lineItems.find(i => i.id === itemId)
    if (item?.exclusiveGroup) {
      const existing = groups.get(item.exclusiveGroup) || []
      existing.push(item)
      groups.set(item.exclusiveGroup, existing)
    }
  }

  const violations: { group: string; items: BillLineItem[] }[] = []
  for (const [group, items] of groups) {
    if (items.length > 1) {
      violations.push({ group, items })
    }
  }
  return violations
}

export function getPackagesByCategory(category: PackageCategory): PackageMaster[] {
  return PACKAGE_MASTER.filter((p) => p.category === category)
}

export const PACKAGE_CATEGORIES: PackageCategory[] = [
  "IVF / ICSI / FET",
  "Donor Programmes",
  "Surgical / Procedure Packages",
  "Cryostorage / Oocyte / Sperm Cryopreservation",
  "Embryo Pooling / Oocyte Accumulation",
  "Charity Programme",
  "Add-ons / Separate Billing Items",
]
