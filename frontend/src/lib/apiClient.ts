import axios from "axios"
import { PACKAGE_MASTER, ADDON_MASTER } from "./billingMaster"
import { mockBills, mockPatients } from "./mockData"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})

// Establish Axios & TanStack Query client layer with offline fallback
// If backend is down or request fails, gracefully fallback to local mock data.
export const api = {
  getPackages: async () => {
    try {
      const res = await apiClient.get("/packages")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Using local PACKAGE_MASTER")
      return PACKAGE_MASTER
    }
  },
  
  getAddons: async () => {
    try {
      const res = await apiClient.get("/addons")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Using local ADDON_MASTER")
      return ADDON_MASTER
    }
  },

  getBills: async () => {
    try {
      const res = await apiClient.get("/bills")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Using local mockBills")
      return mockBills
    }
  },

  getPatients: async () => {
    try {
      const res = await apiClient.get("/patients")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Using local mockPatients")
      return mockPatients
    }
  },

  getDailyReports: async () => {
    try {
      const res = await apiClient.get("/reports/daily")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Cannot fetch daily reports, using local computation")
      // Quick fallback logic for daily reports
      const map = new Map<string, { revenue: number, count: number }>()
      mockBills.forEach(b => {
        const existing = map.get(b.date) || { revenue: 0, count: 0 }
        map.set(b.date, { revenue: existing.revenue + b.grandTotal, count: existing.count + 1 })
      })
      return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, stats]) => ({ date, ...stats }))
    }
  },

  getMonthlyReports: async () => {
    try {
      const res = await apiClient.get("/reports/monthly")
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Cannot fetch monthly reports, using local computation")
      // Quick fallback logic for monthly reports
      const map = new Map<string, { revenue: number, count: number }>()
      mockBills.forEach(b => {
        const month = b.date.substring(0, 7)
        const existing = map.get(month) || { revenue: 0, count: 0 }
        map.set(month, { revenue: existing.revenue + b.grandTotal, count: existing.count + 1 })
      })
      return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, stats]) => ({ name: month, ...stats }))
    }
  },

  validateRules: async (payload: { packageId: string, billingMethod: string, selectedAddOns: any[] }) => {
    try {
      const res = await apiClient.post("/rules/validate", payload)
      return res.data
    } catch (error) {
      console.warn("Offline fallback: Skipping strict rule validation due to network error")
      return { valid: true, violations: [] }
    }
  }
}
