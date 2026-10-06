import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Shield,
  Clock,
  Terminal,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { AuditLogEntry } from '../../types/forensic';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useForensic();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.evidenceId && log.evidenceId.toLowerCase().includes(search.toLowerCase())) ||
      log.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const getStatusBadge = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Success
          </span>
        );
      case 'Alert':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            ⚠ Alert
          </span>
        );
      case 'Quarantined':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Quarantined
          </span>
        );
      case 'Denied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/30">
            Denied
          </span>
        );
    }
  };

  const handleExportLogs = () => {
    const logDump = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logDump], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidentia_audit_ledger_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              IMMUTABLE AUDIT LOG LEDGER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Write-once tamper-evident ledger tracking every user action, verification cycle, and access event
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          EXPORT AUDIT LEDGER (JSON)
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by User, Evidence ID, IP, Action..."
            className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-9 pr-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Actions</option>
            <option value="Upload">Upload</option>
            <option value="Transfer">Transfer</option>
            <option value="Verify">Verify</option>
            <option value="Download">Download</option>
            <option value="Tamper Alert">Tamper Alert</option>
            <option value="Report Generated">Report Generated</option>
            <option value="Case Created">Case Created</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Alert">Alert</option>
            <option value="Quarantined">Quarantined</option>
            <option value="Denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Evidence ID</th>
                <th className="py-3 px-4">IP / Session</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>

                  {/* User */}
                  <td className="py-3 px-4 font-sans font-medium text-slate-200 whitespace-nowrap">
                    {log.user}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-cyan-400/90 whitespace-nowrap text-[11px]">
                    {log.role}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                    {log.action}
                  </td>

                  {/* Evidence ID */}
                  <td className="py-3 px-4 text-cyan-300 whitespace-nowrap font-bold">
                    {log.evidenceId || '—'}
                  </td>

                  {/* IP / Session */}
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {log.ipAddress}
                    <span className="block text-[10px] text-slate-500">{log.sessionToken}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>

                  {/* Details */}
                  <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <ScrollText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium">No audit logs matching current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
