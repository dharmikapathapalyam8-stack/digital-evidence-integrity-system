import React, { useState } from 'react';
import {
  Database,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IdCard,
  Fingerprint,
  ShieldCheck,
  FileText,
  Video,
  FileCode,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { truncateHash } from '../../utils/crypto';
import { EvidenceRecord, EvidenceStatus } from '../../types/forensic';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface VaultViewProps {
  onOpenUpload: (caseId?: string) => void;
  onOpenReport: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ onOpenUpload, onOpenReport }) => {
  const {
    evidence,
    cases,
    selectedCaseId,
    setSelectedCaseId,
    selectedEvidenceId,
    setSelectedEvidenceId,
    setActiveTab,
    verifyIntegrity,
  } = useForensic();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredEvidence = evidence.filter(ev => {
    const matchesCase = !selectedCaseId || ev.caseId === selectedCaseId;
    const matchesSearch =
      ev.id.toLowerCase().includes(search.toLowerCase()) ||
      ev.fileName.toLowerCase().includes(search.toLowerCase()) ||
      ev.sha256.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || ev.fileType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    return matchesCase && matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED
          </span>
        );
      case 'HASH_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            HASH MISMATCH
          </span>
        );
      case 'METADATA_WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            METADATA WARNING
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            UNDER REVIEW
          </span>
        );
    }
  };

  const getFileTypeIcon = (type: EvidenceRecord['fileType']) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'Log File':
      case 'Database Dump':
        return <FileCode className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleSelectAndNavigate = (id: string, destination: 'passport' | 'dna' | 'monitor' | 'custody') => {
    setSelectedEvidenceId(id);
    setActiveTab(destination);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Upload CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              EVIDENCE VAULT REPOSITORY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable digital evidence container with continuous SHA-256 parity verification
          </p>
        </div>

        <button
          onClick={() => onOpenUpload(selectedCaseId || undefined)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer self-start md:self-auto font-mono"
        >
          <Upload className="w-4 h-4" />
          + INGEST NEW EVIDENCE
        </button>
      </div>

      {/* Case filter pills & Search bar */}
      <div className="space-y-3">
        {/* Case selector strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCaseId(null)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCaseId === null
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Cases ({evidence.length})
          </button>
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCaseId === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {c.id} ({evidence.filter(e => e.caseId === c.id).length})
            </button>
          ))}
        </div>

        {/* Filter inputs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Evidence ID, file name, hash..."
              className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-9 pr-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All File Types</option>
              <option value="Video">Video</option>
              <option value="Disk Image">Disk Image</option>
              <option value="Document">Document</option>
              <option value="Database Dump">Database Dump</option>
              <option value="Log File">Log File</option>
              <option value="Audio">Audio</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="HASH_MISMATCH">Hash Mismatch</option>
              <option value="METADATA_WARNING">Metadata Warning</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Evidence ID</th>
                <th className="py-3 px-4">File Name & Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">SHA-256 Checksum</th>
                <th className="py-3 px-4">Evidence DNA</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEvidence.map(ev => {
                const isSelected = selectedEvidenceId === ev.id;

                return (
                  <tr
                    key={ev.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-cyan-950/10' : ''
                    }`}
                  >
                    {/* Evidence ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-400 whitespace-nowrap">
                      {ev.id}
                      <span className="block text-[10px] text-slate-500 font-sans font-normal">
                        {ev.caseId}
                      </span>
                    </td>

                    {/* File Name & Type */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon(ev.fileType)}
                        <div>
                          <div className="font-medium text-slate-200">{ev.fileName}</div>
                          <div className="text-[10px] text-slate-500">
                            By {ev.uploadedBy}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 font-mono text-slate-300 tabular-nums whitespace-nowrap">
                      {ev.fileSize}
                    </td>

                    {/* SHA-256 */}
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      <span
                        className="cursor-pointer hover:text-cyan-300 transition-colors"
                        title={ev.sha256}
                      >
                        {truncateHash(ev.sha256, 8, 4)}
                      </span>
                    </td>

                    {/* Evidence DNA */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <EvidenceDnaBadge
                        dna={ev.evidenceDna}
                        originalDna={ev.originalDna}
                        size="sm"
                      />
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {ev.timestamp.split(' ')[0]}
                      <span className="block text-[10px] text-slate-500">
                        {ev.timestamp.split(' ')[1] || ''}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(ev.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => verifyIntegrity(ev.id)}
                          title="Verify SHA-256 Integrity"
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSelectAndNavigate(ev.id, 'passport')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 font-mono"
                        >
                          <IdCard className="w-3 h-3" />
                          PASSPORT
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEvidence.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium">No evidence records found matching query</p>
            <p className="text-[11px] text-slate-500 mt-1">Try adjusting your filters or upload a new artifact</p>
          </div>
        )}
      </div>
    </div>
  );
};
