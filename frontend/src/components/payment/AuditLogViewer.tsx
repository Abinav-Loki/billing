import * as React from "react"
import { useAuth } from "../../hooks/useAuth"
import { AuditLogEntry } from "../../lib/mockData"
import { Card, CardContent } from "../ui/card"
import { formatDate } from "../../lib/utils"
import { ShieldCheck, ShieldAlert } from "lucide-react"

interface AuditLogViewerProps {
  auditLogs: AuditLogEntry[]
}

export function AuditLogViewer({
  auditLogs
}: AuditLogViewerProps) {
  const { user } = useAuth()

  // Role-based Access Control: Only visible to Admins
  if (user?.role !== "Admin") return null

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Admin Audit Logs (Immutable)
        </h3>
        <span className="text-[10px] uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded">
          Admin View Only
        </span>
      </div>
      <CardContent className="p-0">
        {auditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <ShieldAlert className="h-6 w-6 mb-2 text-slate-350" />
            <p className="text-xs font-semibold">No audit events recorded for this bill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">
                  <th className="px-5 py-3">Event Date/Time</th>
                  <th className="px-5 py-3">Action Type</th>
                  <th className="px-5 py-3">Created By</th>
                  <th className="px-5 py-3">Authorized By</th>
                  <th className="px-5 py-3">Authorization Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                    <td className="px-5 py-3.5 text-slate-500 font-medium">
                      {formatDate(log.createdAt)} at {new Date(log.createdAt).toTimeString().slice(0, 5)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.actionType === "Discount"
                          ? "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400"
                          : log.actionType === "Edit"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-750 dark:text-indigo-400"
                          : log.actionType === "Unlock"
                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-705 dark:text-amber-400"
                          : "bg-rose-55 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                      }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">
                      {log.createdBy}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">
                      {log.authorizedBy || log.createdBy}
                    </td>
                    <td className="px-5 py-3.5 text-slate-550 dark:text-slate-400">
                      {log.actionType === "Edit" ? (
                        <div className="space-y-1.5">
                          <p className="font-semibold italic text-slate-700 dark:text-slate-300">Reason: "{log.reason}"</p>
                          <div className="text-[10px] leading-snug space-y-0.5 border-t pt-1.5 mt-1 font-mono text-slate-500">
                            <div><span className="font-bold text-slate-650">Prev:</span> {log.oldValue}</div>
                            <div><span className="font-bold text-slate-650">Post:</span> {log.newValue}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="italic">"{log.authorizationRemarks || log.reason || "N/A"}"</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
