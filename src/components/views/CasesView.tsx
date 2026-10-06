import React, { useState } from 'react';
import {
  FolderLock,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
  Database,
  Building,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { IncidentType, RiskLevel } from '../../types/forensic';

interface CasesViewProps {
  onOpenCreateCase: () => void;
  onOpenUpload: (caseId?: string) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  onOpenCreateCase,
  onOpenUpload,
}) => {
  const { cases, setSelectedCaseId, setActiveTab } = useForensic();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.investigator.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'ALL' || c.incidentType === selectedType;
    const matchesRisk = selectedRisk === 'ALL' || c.riskLevel === selectedRisk;
    return matchesSearch && matchesType && matchesRisk;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('vault');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & New Case CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              CASE MANAGEMENT LEDGER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active digital forensic investigations, judicial scope parameters, and custody bindings
          </p>
        </div>

        <button
          onClick={onOpenCreateCase}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer self-start md:self-auto font-mono"
        >
          <PlusCircle className="w-4 h-4" />
          CREATE NEW CASE
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by Case ID, Case Name, Investigator..."
            className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-9 pr-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Incident Types</option>
            <option value="Digital Fraud">Digital Fraud</option>
            <option value="Ransomware Extortion">Ransomware Extortion</option>
            <option value="Cyber Espionage">Cyber Espionage</option>
            <option value="Intellectual Property Theft">IP Theft</option>
            <option value="Cloud Infrastructure Breach">Cloud Breach</option>
            <option value="Audio/Video Tampering">Audio/Video</option>
          </select>

          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map(c => (
          <div
            key={c.id}
            className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {c.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getRiskBadge(
                    c.riskLevel
                  )}`}
                >
                  {c.riskLevel} RISK
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {c.name}
              </h3>

              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Investigator
                  </span>
                  <span className="text-slate-200 font-medium">{c.investigator}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    Evidence Count
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {c.evidenceCount} Evidence Items
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Registered Date
                  </span>
                  <span className="font-mono text-slate-300">{c.createdDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Jurisdiction
                  </span>
                  <span className="text-slate-300 truncate max-w-[150px]">{c.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleViewCase(c.id)}
                className="flex-1 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <span>VIEW CASE</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>

              <button
                onClick={() => onOpenUpload(c.id)}
                className="py-1.5 px-3 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer font-mono"
              >
                + ADD EVIDENCE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
