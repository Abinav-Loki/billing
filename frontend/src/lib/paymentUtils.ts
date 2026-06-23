import { PaymentMethod, PaymentType } from "./mockData"

export function generatePaymentId(billNo: string, currentPaymentsCount: number): string {
  return `PYMT-${billNo}-${currentPaymentsCount + 1}`
}

export function generateReceiptNo(existingBills: any[]): string {
  const year = new Date().getFullYear()
  let maxSeq = 0
  
  existingBills.forEach(b => {
    if (b.payments) {
      b.payments.forEach((p: any) => {
        if (p.receiptNo && p.receiptNo.startsWith(`RCPT-${year}-`)) {
          const parts = p.receiptNo.split("-")
          if (parts.length >= 3) {
            const seq = parseInt(parts[2], 10)
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq
            }
          }
        }
      })
    }
  })
  
  const nextSeq = maxSeq + 1
  return `RCPT-${year}-${String(nextSeq).padStart(4, "0")}`
}

export function getMethodRequiresRef(method: PaymentMethod): boolean {
  return ["UPI", "Net Banking", "Cheque", "Bank Transfer"].includes(method)
}

export function getMethodRequiresBank(method: PaymentMethod): boolean {
  return ["Credit Card", "Debit Card", "Net Banking", "Cheque", "Bank Transfer"].includes(method)
}

export function getMethodRequiresCard(method: PaymentMethod): boolean {
  return ["Credit Card", "Debit Card"].includes(method)
}

export function getMethodRequiresCheque(method: PaymentMethod): boolean {
  return method === "Cheque"
}
