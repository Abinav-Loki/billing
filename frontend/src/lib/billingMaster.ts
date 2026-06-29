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
  billingNote?: string
  inclusionsList?: string[]
  freeMonitoringList?: string[]
  exclusionsList?: string[]
  policiesList?: string[]
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

const PKG_CHARITY_ITEMS: BillLineItem[] = [
  { id: "PKG-CHARITY-0", name: "Reduced package cost",           price: 30000, category: "Procedure", isOptional: false },
  { id: "PKG-CHARITY-1", name: "Free monitoring consultations",  price: 30000, category: "Procedure", isOptional: false },
  { id: "PKG-CHARITY-2", name: "Free follicular scans",          price: 30000, category: "Procedure", isOptional: false },
]

export const PACKAGE_MASTER: PackageMaster[] = [

  // ── IVF / ICSI / FET ──────────────────────────────────────────────────────

  {
    id: "PKG-ICSI-BASIC",
    name: "ICSI Basic",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 100000,
    description: "OPU + ICSI + Blastocyst Culture + 1-year storage + Fresh ET.",
    staffNote: "OPU + ICSI + blastocyst culture + 1-year storage + fresh ET. Consultations and follicular scans during stimulation included. Excludes: stimulation medicines, pre-cycle hormones, serology, ECG, Echo, PAC, blood tests, semen workup.",
    billingNote: "OPU + ICSI + blastocyst culture + 1-year storage + fresh ET. Consultations and follicular scans during stimulation included.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation for ICSI",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "Vitrification + 1-year cryostorage (2 cryolocks included)",
      "Fresh embryo transfer — 1 attempt (same cycle, if applicable)",
      "Consumables + pap smear + administrative charges",
      "Monitoring consultations + follicular scans during stimulation"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Pre-cycle hormonal blood tests",
      "Workup blood tests (CBC, coagulation, RFT)",
      "ECG, Echocardiogram, Pre-anaesthesia checkup",
      "Semen analysis + andrology workup",
      "Serology panel (HIV, HBsAg, HCV, VDRL)"
    ],
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
    billingNote: "ICSI Basic + either MF or PICSI. One sperm selection method included.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation — advanced selection",
      "MF (microfluidic) OR PICSI — one selected at consultation (₹10,000 included)",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "Vitrification + 1-year cryostorage (2 cryolocks included)",
      "Fresh embryo transfer — 1 attempt",
      "Consumables + pap smear + administrative charges",
      "Monitoring consultations + follicular scans during stimulation"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Pre-cycle hormonal blood tests",
      "Workup blood tests, ECG, Echo, Pre-anaesthesia checkup",
      "Semen analysis + andrology workup",
      "Serology panel"
    ],
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
    billingNote: "OPU + ICSI + PGT-A package. Add-ons / embryos beyond package inclusion to be billed separately if documented.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation for ICSI",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "PGT-A — biopsy + genetic testing (up to 4 embryos, package rate)",
      "Vitrification + 1-year cryostorage",
      "1 × FET — includes anaesthesia + embryo glue (₹40,000)",
      "Consumables + pap smear",
      "Monitoring consultations + follicular scans during stimulation"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Investigations",
      "MF or PICSI if required"
    ],
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
    billingNote: "Embryo thaw + embryologist + OT + catheter + ultrasound guidance + embryo glue + monitoring.",
    inclusionsList: [
      "Embryo thaw (per cryolock / straw)",
      "Embryologist fee",
      "OT / procedure room charges",
      "Transfer catheter & consumables",
      "Ultrasound guidance during transfer",
      "Embryo glue (EG) — included as standard",
      "Endometrial preparation monitoring scans + consultations"
    ],
    exclusionsList: [
      "Endometrial preparation medications (estradiol, progesterone)",
      "Luteal phase support medications post-transfer",
      "Additional hormonal blood tests (E2, progesterone, beta hCG)",
      "Post-transfer follow-up scan"
    ],
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
    billingNote: "FET package with anaesthetist fee and sedation / anaesthesia drugs included.",
    inclusionsList: [
      "Embryo thaw (per cryolock / straw)",
      "Embryologist fee",
      "OT charges / theatre fee",
      "Anaesthetist fee + anaesthesia drugs",
      "Transfer catheter & consumables",
      "Ultrasound guidance during transfer",
      "Embryo glue (EG) — included as standard",
      "Endometrial preparation monitoring scans + consultations"
    ],
    exclusionsList: [
      "Endometrial preparation medications",
      "Luteal phase support medications",
      "Additional hormonal blood tests",
      "Post-transfer follow-up scan"
    ],
    lineItems: PKG_FET_ANA_ITEMS,
    duplicateBlockList: ["Embryo thaw", "Embryologist", "OT", "Anaesthetist", "Transfer catheter", "Ultrasound guidance", "Embryo glue", "Endometrial preparation"],
  },

  {
    id: "PKG-FET-ROOM",
    name: "FET Room / 15-day stay",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 45000,
    description: "15-day stay package, when opted / advised.",
    staffNote: "15-day stay package when opted/advised. Confirm clinician approval before billing. Includes all FET with anaesthesia components + room stay. Excludes: endometrial preparation medicines, luteal support medicines, additional hormone tests, Beta-hCG, post-transfer scan.",
    billingNote: "15-day stay package, when opted / advised.",
    inclusionsList: [
      "FET procedure (with anaesthesia)",
      "15-day room stay (single room)",
      "Nursing charges during stay",
      "Monitoring scans + consultations during stay"
    ],
    exclusionsList: [
      "Endometrial preparation medications",
      "Luteal phase support medications",
      "Post-transfer follow-up scan"
    ],
    lineItems: PKG_FET_ROOM_ITEMS,
    duplicateBlockList: ["Embryo thaw", "Embryologist", "OT", "Anaesthetist", "Transfer catheter", "Ultrasound guidance", "Embryo glue", "room stay"],
  },

  {
    id: "PKG-ROOM-SINGLE",
    name: "Single room (per day)",
    category: "IVF / ICSI / FET",
    fullPaymentAmount: 5000,
    description: "Single Room (per day).",
    staffNote: "Charged per night. Confirm number of nights at billing.",
    billingNote: "Single room stay per day.",
    inclusionsList: [
      "Single room accommodation (per day)",
      "Nursing support",
      "Room consumables & housekeeping"
    ],
    exclusionsList: [
      "Food & beverages",
      "Medications",
      "Special clinical diagnostics"
    ],
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
    billingNote: "OPU + ICSI + blastocyst culture + 1-year storage + fresh ET + 1 night Single Room stay.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation for ICSI",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "Vitrification + 1-year cryostorage (2 cryolocks included)",
      "Fresh embryo transfer — 1 attempt (same cycle, if applicable)",
      "Consumables + pap smear + administrative charges",
      "Monitoring consultations + follicular scans during stimulation",
      "Single room accommodation (1 night)"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Pre-cycle hormonal blood tests",
      "Workup blood tests (CBC, coagulation, RFT)",
      "ECG, Echocardiogram, Pre-anaesthesia checkup",
      "Semen analysis + andrology workup",
      "Serology panel"
    ],
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
    billingNote: "ICSI Basic + either MF or PICSI + 1 night Single Room stay.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation — advanced selection",
      "MF (microfluidic) OR PICSI — one selected at consultation (₹10,000 included)",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "Vitrification + 1-year cryostorage (2 cryolocks included)",
      "Fresh embryo transfer — 1 attempt",
      "Consumables + pap smear + administrative charges",
      "Monitoring consultations + follicular scans during stimulation",
      "Single room accommodation (1 night)"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Pre-cycle hormonal blood tests",
      "Workup blood tests, ECG, Echo, Pre-anaesthesia checkup",
      "Semen analysis + andrology workup",
      "Serology panel"
    ],
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
    billingNote: "OPU + ICSI + PGT-A package + 1 night Single Room stay.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation for ICSI",
      "ICSI procedure",
      "Blastocyst culture (Day 5 — all fertilised embryos)",
      "PGT-A — biopsy + genetic testing (up to 4 embryos, package rate)",
      "Vitrification + 1-year cryostorage",
      "1 × FET — includes anaesthesia + embryo glue (₹40,000)",
      "Consumables + pap smear",
      "Monitoring consultations + follicular scans during stimulation",
      "Single room accommodation (1 night)"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Investigations",
      "MF or PICSI if required"
    ],
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
    staffNote: "Covered: donor recruitment, screening, stimulation, OPU, ICSI, blastocyst culture, vitrification, 1-year storage. Excludes: recipient medications, recipient serology, recipient hormonal monitoring, FET.",
    billingNote: "Donor recruitment, donor screening, donor stimulation, OPU, ICSI with husband sperm, blastocyst culture, vitrification and 1-year storage. FET excluded and billed separately.",
    inclusionsList: [
      "Donor recruitment, screening & eligibility assessment",
      "Donor blood investigations — hormones, AMH, AFC",
      "Donor serology — HIV, HBsAg, HCV, VDRL",
      "Donor ECG + echocardiogram",
      "Donor pre-anaesthesia / anaesthetic checkup",
      "Donor psychological counselling + consent",
      "Donor ovarian stimulation — all medications included",
      "Donor monitoring consultations + follicular scans",
      "Donor OPU + OT charges + anaesthesia + embryologist fee",
      "ICSI procedure — recipient partner sperm",
      "Blastocyst culture (Day 5)",
      "Embryo vitrification + cryolocks + 1-year cryostorage",
      "Legal & consent documentation (ART Act 2021)",
      "Administrative + coordination charges"
    ],
    exclusionsList: [
      "Recipient endometrial preparation medicines",
      "Recipient post-FET luteal support medicines",
      "Recipient blood tests and serology",
      "FET (billed separately at ₹40,000)"
    ],
    lineItems: PKG_DONOR_EGG_ITEMS,
    duplicateBlockList: ["Donor recruitment", "Donor stimulation", "Donor OPU", "OT charges", "Anaesthetist", "Embryologist", "ICSI", "Blastocyst", "Vitrification", "cryostorage"],
  },

  {
    id: "PKG-DONOR-EMBRYO",
    name: "Donor Embryo Programme",
    category: "Donor Programmes",
    fullPaymentAmount: 320000,
    description: "Donor embryo programme — donor couple recruitment, screening, ICSI cycle or embryos, matching, documentation.",
    staffNote: "⚠ Recipient FET is EXCLUDED. FET must be billed separately. Package covers: donor couple recruitment, screening, donor ICSI cycle or embryos, matching, documentation.",
    billingNote: "Donor couple recruitment / screening, donor ICSI cycle or embryos, matching and documentation. Recipient FET is excluded and billed separately.",
    inclusionsList: [
      "Donor couple recruitment + screening",
      "Matching and documentation",
      "Donor ICSI cycle or embryos",
      "Legal & consent documentation (ART Act 2021)"
    ],
    exclusionsList: [
      "Recipient FET (billed separately at ₹40,000)",
      "Recipient medicines + serology"
    ],
    lineItems: PKG_DONOR_EMBRYO_ITEMS,
    duplicateBlockList: ["Donor couple", "Screening", "ICSI cycle", "Embryo allocation", "Matching", "Administrative", "Recipient endometrial", "Embryologist", "Embryo thaw", "Consumables"],
  },

  {
    id: "PKG-DONOR-ADVANCE",
    name: "Package advance — donor recruitment",
    category: "Donor Programmes",
    fullPaymentAmount: 200000,
    description: "Advance payment collected before donor recruitment begins.",
    staffNote: "Collect before donor recruitment. Non-refundable once recruitment is initiated. Balance of ₹1,00,000 due after recruitment, before donor OPU.",
    billingNote: "Donor recruitment advance payment.",
    inclusionsList: [
      "Donor recruitment screening and matching co-ordination"
    ],
    exclusionsList: [
      "Donor stimulation medications",
      "OPU procedure",
      "ICSI & lab procedures"
    ],
    lineItems: PKG_DONOR_ADVANCE_ITEMS,
    duplicateBlockList: [],
  },

  {
    id: "PKG-DONOR-BALANCE",
    name: "Balance donor recruitment payment",
    category: "Donor Programmes",
    fullPaymentAmount: 100000,
    description: "Balance donor payment collected after recruitment, before donor OPU.",
    staffNote: "Balance donor payment. Full package payment required before donor OPU is scheduled.",
    billingNote: "Balance donor recruitment payment.",
    inclusionsList: [
      "Complete donor stimulation cycle scheduling and coordination"
    ],
    exclusionsList: [
      "Recipient FET (billed separately at ₹40,000)",
      "Recipient medicines"
    ],
    lineItems: PKG_DONOR_BALANCE_ITEMS,
    duplicateBlockList: [],
  },

  // ── Surgical / Procedure Packages ─────────────────────────────────────────

  {
    id: "PKG-DIAG-LAP",
    name: "Diagnostic laparoscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 75000,
    description: "Diagnostic laparoscopy under general anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, GA, anaesthetist, scrub nurse, consumables, day care, nursing, post-op review.",
    billingNote: "Surgeon fee, major OT, GA, anaesthetist, OT staff, consumables, day-care recovery, nursing and 1 post-op review included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges / theatre fee (major)",
      "General anaesthesia (GA)",
      "Anaesthetist fee",
      "Scrub nurse / OT staff",
      "Surgical consumables pack",
      "Day care / recovery room",
      "Nursing charges",
      "Post-op review (1 visit)"
    ],
    exclusionsList: [
      "Histopathology / tissue biopsy",
      "Overnight IP stay — room charges",
      "Operative intervention if findings require"
    ],
    lineItems: PKG_DIAG_LAP_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "General anaesthesia", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Nursing", "Post-op"],
  },

  {
    id: "PKG-DIAG-HYST",
    name: "Diagnostic hysteroscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Diagnostic hysteroscopy under sedation.",
    staffNote: "Package includes: surgeon fee, OT / procedure room, anaesthetist fee, sedation drugs, scrub nurse, consumables, day care, post-op review.",
    billingNote: "Surgeon fee, OT, sedation / GA, anaesthetist, hysteroscope consumables, day-care recovery and nursing included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges / theatre fee",
      "Sedation / GA",
      "Anaesthetist fee",
      "Hysteroscope & consumables",
      "Day care / recovery room",
      "Nursing charges"
    ],
    exclusionsList: [
      "Endometrial biopsy / polypectomy (if operative)",
      "Histopathology"
    ],
    lineItems: PKG_DIAG_HYST_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Post-op"],
  },

  {
    id: "PKG-OP-HYST",
    name: "Operative hysteroscopy",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 50000,
    description: "Operative hysteroscopy under sedation / GA.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee, sedation drugs, scrub nurse, consumables + scope, day care, post-op review.",
    billingNote: "Polypectomy / myomectomy / septum resection. Operative hysteroscope and consumables included. Post-op medications not included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges / theatre fee",
      "General anaesthesia",
      "Anaesthetist fee",
      "Operative hysteroscope & consumables",
      "Day care / recovery room",
      "Nursing charges"
    ],
    exclusionsList: [
      "Histopathology of specimen",
      "Overnight IP stay",
      "Post-op medications"
    ],
    lineItems: PKG_OP_HYST_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Scrub nurse", "Consumables", "Day care", "Post-op"],
  },

  {
    id: "PKG-DNC",
    name: "D&C",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 25000,
    description: "Dilatation and curettage procedure.",
    staffNote: "Package includes: surgeon fee, OT / procedure room, anaesthetist fee, consumables.",
    billingNote: "OT, sedation / GA, anaesthetist, consumables and day-care recovery included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges",
      "Sedation / GA",
      "Anaesthetist fee",
      "Consumables",
      "Day care / recovery"
    ],
    exclusionsList: [
      "Histopathology",
      "Overnight stay"
    ],
    lineItems: PKG_DNC_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Consumables"],
  },

  {
    id: "PKG-CERCLAGE",
    name: "Cervical cerclage",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Cervical cerclage procedure under anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee, consumables + suture.",
    billingNote: "McDonald / Shirodkar. OT, spinal / GA, anaesthetist, suture material, day-care recovery and nursing included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges",
      "Spinal / GA",
      "Anaesthetist fee",
      "Suture material & consumables",
      "Day care / recovery",
      "Nursing charges"
    ],
    exclusionsList: [
      "Post-op medications",
      "Overnight stay"
    ],
    lineItems: PKG_CERCLAGE_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist", "Consumables"],
  },

  {
    id: "PKG-PESA",
    name: "PESA / TESA — Dr. AP",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 40000,
    description: "Percutaneous epididymal / testicular sperm aspiration by Dr. AP.",
    staffNote: "Performed by Dr. AP only. Package includes: surgeon fee, OT / procedure room, anaesthetist fee + sedation.",
    billingNote: "Procedure charges for surgical sperm retrieval.",
    inclusionsList: [
      "Surgical sperm retrieval procedure",
      "OT charges",
      "Anaesthesia",
      "Anaesthetist fee",
      "Consumables",
      "Embryologist handling fee"
    ],
    exclusionsList: [
      "Semen analysis / freezing workup"
    ],
    lineItems: PKG_PESA_ITEMS,
    duplicateBlockList: ["Dr. AP", "OT", "Anaesthetist"],
  },

  {
    id: "PKG-CYST-ASP",
    name: "Ultrasound-guided cyst aspiration",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 15000,
    description: "Ultrasound-guided aspiration of ovarian / pelvic cyst.",
    staffNote: "Package includes: gynaecologist fee, OT / procedure room, ultrasound guidance.",
    billingNote: "Procedure charges, OT, sedation, anaesthetist, consumables, ultrasound guidance and nursing included.",
    inclusionsList: [
      "Procedure charges",
      "OT charges",
      "Sedation",
      "Anaesthetist fee",
      "Consumables",
      "Ultrasound guidance",
      "Nursing charges"
    ],
    exclusionsList: [
      "Histopathology / cyst fluid analysis",
      "Medications post-procedure"
    ],
    lineItems: PKG_CYST_ASP_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Ultrasound"],
  },

  {
    id: "PKG-IUI-ANA",
    name: "IUI under anaesthesia",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 15000,
    description: "Intrauterine insemination performed under sedation / anaesthesia.",
    staffNote: "Package includes: IUI procedure fee, anaesthetist fee + sedation, OT / procedure room.",
    billingNote: "IUI procedure fee, sperm wash, sedation, anaesthetist, consumables and procedure room charges included.",
    inclusionsList: [
      "IUI procedure fee",
      "Sperm wash & preparation",
      "Anaesthesia / sedation",
      "Anaesthetist fee",
      "Consumables / catheter",
      "OT / procedure room charges"
    ],
    exclusionsList: [
      "Semen analysis pre-wash",
      "Follicular monitoring scans",
      "Medications"
    ],
    lineItems: PKG_IUI_ANA_ITEMS,
    duplicateBlockList: ["IUI", "Anaesthetist", "OT"],
  },

  {
    id: "PKG-BARTHOLIN",
    name: "Bartholin cystectomy / marsupialisation",
    category: "Surgical / Procedure Packages",
    fullPaymentAmount: 20000,
    description: "Bartholin cystectomy or marsupialisation under anaesthesia.",
    staffNote: "Package includes: surgeon fee, OT, anaesthetist fee + sedation.",
    billingNote: "Surgeon fee, OT, spinal / GA, anaesthetist, consumables, sutures, day-care recovery and nursing included.",
    inclusionsList: [
      "Surgeon fee",
      "OT charges",
      "Spinal / GA",
      "Anaesthetist fee",
      "Consumables & sutures",
      "Day care / recovery",
      "Nursing charges"
    ],
    exclusionsList: [
      "Histopathology",
      "Overnight IP stay",
      "Post-op antibiotics"
    ],
    lineItems: PKG_BARTHOLIN_ITEMS,
    duplicateBlockList: ["Surgeon", "OT", "Anaesthetist"],
  },

  // ── Cryostorage / Oocyte / Sperm ──────────────────────────────────────────

  {
    id: "PKG-EGG-FRZ",
    name: "Oocyte Vitrification (Egg Freezing)",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 90000,
    description: "Complete cycle including OPU, freezing, and first year storage.",
    staffNote: "Package includes: consultation, reserve assessment, monitoring, OPU, anaesthesia, vitrification, one-year storage.",
    billingNote: "Oocyte vitrification package including stimulation monitoring, OPU, vitrification, and 1st year storage.",
    inclusionsList: [
      "Initial fertility consultation",
      "Ovarian reserve assessment and treatment planning",
      "Monitoring consultations during stimulation",
      "Follicular monitoring scans (TVS)",
      "OPU (Ovum Pick-Up) procedure",
      "OT / theatre charges",
      "Anaesthetist fee",
      "Sedation / anaesthesia medications",
      "Embryologist fee",
      "Oocyte identification and assessment",
      "Oocyte vitrification procedure",
      "First year oocyte cryostorage included"
    ],
    exclusionsList: [
      "Stimulation medications",
      "Pre-cycle hormonal investigations",
      "Additional blood investigations",
      "Serology panel",
      "ECG",
      "Echocardiogram (Echo)",
      "Pre-anaesthetic check-up (PAC)",
      "Future utilisation of frozen oocytes",
      "Additional cryostorage after first year",
      "Emergency thaw and refreeze"
    ],
    policiesList: [
      "First year storage is included.",
      "Annual renewal after Year 1: ₹20,000 per year.",
      "Renewal reminders should be sent before expiry.",
      "Oocytes can be stored long-term as per applicable ART regulations.",
      "Written patient consent is required for: Continued storage, Disposal, Transfer to another centre"
    ],
    lineItems: PKG_EGG_FRZ_ITEMS,
    duplicateBlockList: ["consultation", "assessment", "Monitoring", "OPU", "OT", "Anaesthetist", "Sedation", "Embryologist", "vitrification", "storage"],
  },

  {
    id: "PKG-EMBRYO-CRYO",
    name: "Embryo Cryostorage",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 0,
    description: "First year embryo storage. 1 cryolock included in all ICSI packages.",
    staffNote: "Embryo storage. First year is included in ICSI packages.",
    billingNote: "First year embryo storage included in ICSI.",
    inclusionsList: [
      "First year embryo storage",
      "1 cryolock included in all ICSI packages"
    ],
    exclusionsList: [
      "Annual renewal after first year (₹5,000 per cryolock per year)",
      "Additional cryolock (₹5,000 per cryolock per year)"
    ],
    policiesList: [
      "Renewal invoices sent 30 days before due date",
      "60-day grace period before disposition protocol",
      "Maximum embryo storage: 5 years (extendable on written request)",
      "Maximum oocyte storage: 10 years (extendable on written request)",
      "Patient instructions required for transfer / donate / research / discard",
      "ART Act 2021 governs embryo disposition decisions",
      "Storage tanks monitored 24×7 with alarms and backup systems",
      "Annual storage certificate issued with cryolock count and renewal date"
    ],
    lineItems: [
      { id: "PKG-EMBRYO-CRYO-0", name: "First year embryo storage (included)", price: 0, category: "Storage", isOptional: false }
    ],
    duplicateBlockList: []
  },

  {
    id: "PKG-SPERM-3M",
    name: "Sperm Cryopreservation — 3 months",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 3000,
    description: "Processing + storage included for 3 months.",
    staffNote: "3 months sperm storage.",
    billingNote: "Sperm cryopreservation processing & storage for 3 months.",
    inclusionsList: [
      "Processing + storage included"
    ],
    exclusionsList: [
      "Surgical sperm retrieval (TESA / PESA)",
      "Donor sperm",
      "Sperm transport to another clinic"
    ],
    lineItems: [
      { id: "PKG-SPERM-3M-0", name: "Sperm wash & cryopreservation 3M", price: 3000, category: "Storage", isOptional: false }
    ],
    duplicateBlockList: []
  },

  {
    id: "PKG-SPERM-6M",
    name: "Sperm Cryopreservation — 6 months",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 6000,
    description: "Processing + storage included for 6 months.",
    staffNote: "6 months sperm storage.",
    billingNote: "Sperm cryopreservation processing & storage for 6 months.",
    inclusionsList: [
      "Processing + storage included"
    ],
    exclusionsList: [
      "Surgical sperm retrieval (TESA / PESA)",
      "Donor sperm",
      "Sperm transport to another clinic"
    ],
    lineItems: [
      { id: "PKG-SPERM-6M-0", name: "Sperm wash & cryopreservation 6M", price: 6000, category: "Storage", isOptional: false }
    ],
    duplicateBlockList: []
  },

  {
    id: "PKG-SPERM-1Y",
    name: "Sperm Cryopreservation — 1 year (annual)",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 10000,
    description: "Processing + storage included for 1 year.",
    staffNote: "1 year sperm storage.",
    billingNote: "Sperm cryopreservation processing & storage for 1 year.",
    inclusionsList: [
      "Processing + storage included"
    ],
    exclusionsList: [
      "Surgical sperm retrieval (TESA / PESA)",
      "Donor sperm",
      "Sperm transport to another clinic"
    ],
    lineItems: [
      { id: "PKG-SPERM-1Y-0", name: "Sperm wash & cryopreservation 1Y", price: 10000, category: "Storage", isOptional: false }
    ],
    duplicateBlockList: []
  },
  {
    id: "PKG-SPERM-VD",
    name: "Sperm Cryopreservation — VD",
    category: "Cryostorage / Oocyte / Sperm Cryopreservation",
    fullPaymentAmount: 15000,
    description: "Processing + storage included for VD patients.",
    staffNote: "Sperm storage for VD positive patients.",
    billingNote: "Sperm cryopreservation processing & storage (VD).",
    inclusionsList: [
      "Processing + storage included"
    ],
    exclusionsList: [
      "Surgical sperm retrieval (TESA / PESA)",
      "Donor sperm",
      "Sperm transport to another clinic"
    ],
    lineItems: [
      { id: "PKG-SPERM-VD-0", name: "Sperm wash & cryopreservation VD", price: 15000, category: "Storage", isOptional: false }
    ],
    duplicateBlockList: []
  },

  // ── Embryo Pooling ─────────────────────────────────────────────────────────

  {
    id: "PKG-2CYCLE",
    name: "2-cycle ICSI / embryo pooling",
    category: "Embryo Pooling / Oocyte Accumulation",
    fullPaymentAmount: 210000,
    description: "Two consecutive ICSI cycles for embryo pooling.",
    staffNote: "2 complete OPU + ICSI cycles, blastocyst culture, 1-year storage, 1 FET included.",
    billingNote: "2 complete OPU + ICSI cycles, blastocyst culture, 1-year storage and 1 FET included.",
    inclusionsList: [
      "2 × OPU procedures",
      "2 × OT charges & theatre fees",
      "2 × Anaesthetist fees + sedation",
      "2 × Embryologist fees",
      "2 × Sperm preparation (ICSI)",
      "2 × ICSI procedures",
      "2 × Blastocyst culture (Day 5)",
      "Vitrification + 1-year cryostorage",
      "1 × FET — without anaesthesia (₹35,000 value)",
      "Consumables (both cycles) + pap smear",
      "Monitoring consultations + follicular scans (both cycles)"
    ],
    exclusionsList: [
      "MF or PICSI per cycle ₹10,000",
      "PGT-A per embryo ₹25,000",
      "Additional cryolock ₹5,000",
      "Stimulation medications",
      "Investigations"
    ],
    lineItems: PKG_2CYCLE_ITEMS,
    duplicateBlockList: ["Cycle 1", "Cycle 2", "cryostorage", "FET"],
  },

  {
    id: "PKG-3CYCLE",
    name: "3-cycle ICSI / embryo pooling",
    category: "Embryo Pooling / Oocyte Accumulation",
    fullPaymentAmount: 300000,
    description: "Three consecutive ICSI cycles for embryo pooling.",
    staffNote: "3 complete OPU + ICSI cycles, blastocyst culture, 1-year storage, 2 FETs included.",
    billingNote: "3 complete OPU + ICSI cycles, blastocyst culture, 1-year storage and 2 FETs included.",
    inclusionsList: [
      "3 × OPU procedures",
      "3 × OT charges & theatre fees",
      "3 × Anaesthetist fees + sedation",
      "3 × Embryologist fees",
      "3 × Sperm preparation (ICSI)",
      "3 × ICSI procedures",
      "3 × Blastocyst culture (Day 5)",
      "Vitrification + 1-year cryostorage",
      "2 × FET — without anaesthesia (₹35,000 each)",
      "Consumables (all cycles) + pap smear",
      "Monitoring consultations + follicular scans (all cycles)"
    ],
    exclusionsList: [
      "MF or PICSI per cycle ₹10,000",
      "PGT-A per embryo ₹25,000",
      "Additional cryolock ₹5,000",
      "Additional FET beyond 2 ₹40,000",
      "Stimulation medications",
      "Investigations"
    ],
    lineItems: PKG_3CYCLE_ITEMS,
    duplicateBlockList: ["Cycle 1", "Cycle 2", "Cycle 3", "cryostorage", "FET"],
  },

  // ── Charity ────────────────────────────────────────────────────────────────

  {
    id: "PKG-CHARITY",
    name: "ICSI Charity Package",
    category: "Charity Programme",
    fullPaymentAmount: 90000,
    description: "OPU + ICSI + Blastocyst Culture + 2 Cryolocks (1 Year) + Fresh ET\nAll monitoring during the ICSI cycle is FREE.",
    staffNote: "⚠ Use ONLY after written clinician approval. Reduced package rate. All standard ICSI inclusions apply. Monitoring consultations and follicular scans are complimentary.",
    billingNote: "Charity package: ICSI cycle, scans, OPU, ICSI procedure and embryo transfer.",
    inclusionsList: [
      "OPU (ovum pick-up) procedure",
      "OT charges / theatre fee",
      "Anaesthetist fee + sedation / anaesthesia drugs",
      "Embryologist fee",
      "Sperm preparation for ICSI",
      "ICSI procedure",
      "Blastocyst culture (Day 5 – all fertilised embryos)",
      "Vitrification + 1-year cryostorage (2 cryolocks included)",
      "Fresh embryo transfer – 1 attempt (same cycle, if applicable)",
      "Consumables + pap smear + administrative charges"
    ],
    freeMonitoringList: [
      "Monitoring consultation × 6 visits (Days 2, 5, 7, 9, 11, trigger day)",
      "Follicular scan (TVS) × 6 (One scan during each monitoring visit)"
    ],
    lineItems: PKG_CHARITY_ITEMS,
    duplicateBlockList: ["Reduced", "monitoring", "follicular"],
  },
  {
    id: "PKG-CHARITY-FET",
    name: "FET Charity Package",
    category: "Charity Programme",
    fullPaymentAmount: 35000,
    description: "Frozen Embryo Transfer\nAnaesthesia Included\nEmbryo Glue Included\nMonitoring FREE",
    staffNote: "Charity FET package. Includes monitoring and embryo glue.",
    billingNote: "Charity package: Frozen embryo transfer, including monitoring, anaesthesia and embryo glue.",
    inclusionsList: [
      "Embryo thaw (per cryolock / straw)",
      "Embryologist fee",
      "OT charges / theatre fee",
      "Anaesthetist fee + anaesthesia drugs",
      "Transfer catheter & consumables",
      "Ultrasound guidance during transfer",
      "Embryo glue (EG)"
    ],
    freeMonitoringList: [
      "FET monitoring consultation × 2 visits",
      "Endometrial scan (TVS) × 3 (Days 2, 8, 11)"
    ],
    lineItems: [
      { id: "PKG-CHARITY-FET-0", name: "Charity FET Package Cost", price: 35000, category: "Procedure", isOptional: false }
    ],
    duplicateBlockList: ["thaw", "Embryologist", "OT charges", "Anaesthetist", "catheter", "guidance", "Embryo glue"],
  }
]

// ═════════════════════════════════════════════════════════════════════════════
// ADD-ON MASTER
// ═════════════════════════════════════════════════════════════════════════════

export const ADDON_MASTER: AddOnItem[] = [
  { id: "ADD-MF",            name: "MF — microfluidic sperm selection",                      price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-PICSI",         name: "PICSI",                                                   price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-CALCIUM",       name: "Calcium ionophore",                                       price: 10000, category: "Lab",        status: "Active" },
  { id: "ADD-PGTA",          name: "PGT-A (per embryo)",                                      price: 25000, category: "Genetics",   status: "Active" },
  { id: "ADD-LAH",           name: "Laser-assisted hatching (LAH)",                          price: 15000, category: "Lab",        status: "Active" },
  { id: "ADD-SCRATCH",       name: "Endometrial scratch",                                     price: 3000,  category: "Procedure",  status: "Active" },
  { id: "ADD-STYLET",        name: "Stylet used",                                             price: 5000,  category: "Consumables", status: "Active" },
  { id: "ADD-FET",           name: "Additional FET (with anaesthesia)",                       price: 40000, category: "Procedure",  status: "Active" },
  { id: "ADD-CRYO",          name: "Additional cryolock",                                     price: 5000,  category: "Consumables", status: "Active" },
  { id: "ADD-ROOM",          name: "Single room (per day)",                                   price: 5000,  category: "Room",        status: "Active" },

  // Cryostorage separate items (also billable as add-ons)
  { id: "ADD-CRYO-RENEW",    name: "Annual cryolock renewal (per cryolock)",                 price: 5000,  category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-3M",      name: "Sperm cryopreservation – 3 months",                      price: 3000,  category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-6M",      name: "Sperm cryopreservation – 6 months",                      price: 6000,  category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-1Y",      name: "Long-term sperm cryopreservation – 1 year",              price: 10000, category: "Storage",    status: "Active" },
  { id: "ADD-SPERM-VD",      name: "Sperm cryopreservation – VD",                            price: 15000, category: "Storage",    status: "Active" },
  { id: "ADD-EMBRYO-STORAGE", name: "Embryo cryostorage – 1 cryolock (included 1 yr in all ICSI packages)", price: 0, category: "Storage", status: "Active" },
  
  // Surgery HPE separate items
  { id: "ADD-SURG-HPE-S",    name: "Surgery HPE - Small",                                     price: 1500,  category: "Procedure",  status: "Active" },
  { id: "ADD-SURG-HPE-M",    name: "Surgery HPE - Mid",                                       price: 2000,  category: "Procedure",  status: "Active" },
  { id: "ADD-SURG-HPE-B",    name: "Surgery HPE - Big",                                       price: 2500,  category: "Procedure",  status: "Active" },
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
