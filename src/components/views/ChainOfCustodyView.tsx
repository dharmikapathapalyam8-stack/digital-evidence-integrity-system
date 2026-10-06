import React from 'react';
import {
  GitBranch,
  ArrowRightLeft,
  Camera,
  Microscope,
  UserCheck,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Shield,
  ArrowDown,
  Building,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { CustodyEvent } from '../../types/forensic';

interface ChainOfCustodyViewProps {
  onOpenTransferModal: () => void;
}

export const ChainOfCustodyView: React.FC<ChainOfCustodyViewProps> = ({
  onOpenTransferModal,
}) => {
  const {
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
  } = useForensic();

  const currentEvidence =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];

  const custodySteps = currentEvidence.custodyHistory;

  const getStepIcon = (action: string) => {
    if (action.includes('Collected') || action.includes('Acquisition')) {
      return <Camera className="w-4 h-4 text-cyan-400" />;
    }
    if (action.includes('Lab') || action.includes('Forensic')) {
      return <Microscope className="w-4 h-4 text-blue-400" />;
    }
    if (action.includes('Review') || action.includes('Investigation')) {
      return <UserCheck className="w-4 h-4 text-indigo-400" />;
    }
    if (action.includes('Report') || action.includes('Vault') || action.includes('Court')) {
      return <Scale className="w-4 h-4 text-emerald-400" />;
    }
    return <Shield className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Transfer CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              CHAIN OF CUSTODY TIMELINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable legal ledger tracking physical possession, bitstream handovers, and dual-signoff tokens
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Target Artifact Selector */}
          <select
            value={currentEvidence.id}
            onChange={e => setSelectedEvidenceId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            {evidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.fileName} ({ev.custodyHistory.length} Hops)
              </option>
            ))}
          </select>

          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer font-mono"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            TRANSFER EVIDENCE
          </button>
        </div>
      </div>

      {/* Artifact Summary Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Selected Artifact</span>
          <div className="font-semibold text-slate-100 text-sm">{currentEvidence.id} · {currentEvidence.fileName}</div>
          <div className="text-slate-400 text-[11px] font-sans mt-0.5">
            Case: {currentEvidence.caseId} ({currentEvidence.caseName})
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Current Holder</span>
            <span className="text-cyan-300 font-semibold">{currentEvidence.currentHolder}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Active Location</span>
            <span className="text-slate-300">{currentEvidence.currentLocation}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Continuity Score</span>
            <span className="text-emerald-400 font-bold">25/25 FULL</span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-emerald-500">
        {custodySteps.map((event, idx) => {
          const isVerified = event.integrityStatus === 'VERIFIED';

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-6 md:-left-10 top-2 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] z-10">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Event Card */}
              <div className="bg-[#0B111E] border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-all space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                      {getStepIcon(event.action)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <span>{event.action}</span>
                        <span className="text-slate-500 text-xs font-mono font-normal">
                          [Hop {idx + 1}]
                        </span>
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Time: {event.timestamp} · Location: {event.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono border ${
                        isVerified
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERIFIED
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          UNAUTHORIZED
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Custodian (Person & Role)
                    </span>
                    <span className="text-slate-200 font-medium">{event.person}</span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {event.role} ({event.badgeId})
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Operational Reason / Legal Scope
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {event.reason}
                    </p>
                  </div>
                </div>

                {/* Digital Signature Cryptographic Token */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5 text-cyan-400/90">
                    <Shield className="w-3 h-3" />
                    Cryptographic Seal: {event.digitalSignature}
                  </span>
                  <span>Rule 902(14) Admissible</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
