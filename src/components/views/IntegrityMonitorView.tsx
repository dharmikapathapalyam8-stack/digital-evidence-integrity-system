import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Binary,
  RefreshCw,
  HardDrive,
  Clock,
  FileText,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { EvidenceRecord } from '../../types/forensic';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface IntegrityMonitorViewProps {
  onOpenTamperModal: () => void;
}

export const IntegrityMonitorView: React.FC<IntegrityMonitorViewProps> = ({
  onOpenTamperModal,
}) => {
  const {
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
    verifyIntegrity,
    restoreOriginal,
  } = useForensic();

  // Selected item to display in the detailed comparator
  const activeRecord =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyCurrent = () => {
    setIsVerifying(true);
    setTimeout(() => {
      verifyIntegrity(activeRecord.id);
      setIsVerifying(false);
    }, 500);
  };

  const getStatusIcon = (status: EvidenceRecord['status']) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="text-emerald-400">🟢</span>;
      case 'HASH_MISMATCH':
        return <span className="text-red-400 animate-pulse">🔴</span>;
      case 'METADATA_WARNING':
        return <span className="text-amber-400">🟡</span>;
      case 'UNDER_REVIEW':
        return <span className="text-blue-400">🔵</span>;
    }
  };

  const isMismatch = activeRecord.status === 'HASH_MISMATCH' || activeRecord.isTampered;
  const isWarning = activeRecord.status === 'METADATA_WARNING';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              CYBERSECURITY INTEGRITY MONITOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous background telemetry comparing sealed original bitstreams with live disk images
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          {activeRecord.isTampered ? (
            <button
              onClick={() => restoreOriginal(activeRecord.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RESTORE GOLDEN MASTER
            </button>
          ) : (
            <button
              onClick={onOpenTamperModal}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-950 cursor-pointer font-mono"
            >
              <Binary className="w-3.5 h-3.5" />
              SIMULATE TAMPERING
            </button>
          )}

          <button
            onClick={handleVerifyCurrent}
            disabled={isVerifying}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isVerifying ? 'animate-spin' : ''}`} />
            RE-VERIFY SHA-256
          </button>
        </div>
      </div>

      {/* Main 2-column layout: Left is stream of evidence records, Right is deep comparison panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Evidence Status List */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-300 font-mono font-semibold">
              <span>LIVE INTEGRITY STREAM</span>
              <span className="text-[10px] text-cyan-400">INTERVAL: 60 SEC</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[580px] overflow-y-auto mt-2 space-y-1">
              {evidence.map(ev => {
                const isSelected = selectedEvidenceId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvidenceId(ev.id)}
                    className={`p-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/30 border border-cyan-500/40 text-slate-100'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(ev.status)}
                      <div>
                        <div className="font-mono text-xs font-semibold text-slate-200">
                          {ev.id}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {ev.fileName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          ev.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : ev.status === 'HASH_MISMATCH'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {ev.trustScore}/100 Trust
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Continuous background integrity active</span>
            <span className="font-mono text-emerald-400">SYS_DAEMON_OK</span>
          </div>
        </div>

        {/* Right Column: Deep Comparison Panel */}
        <div className="lg:col-span-7 bg-[#0B101E] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">
                ACTIVE AUDIT INSPECTION TARGET
              </span>
              <h3 className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {activeRecord.id} — {activeRecord.fileName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Case ID</span>
              <span className="font-mono text-xs text-slate-300 font-medium">
                {activeRecord.caseId}
              </span>
            </div>
          </div>

          {/* Differential Comparison Box */}
          <div className="space-y-4 text-xs font-mono">
            {/* 1. Hashes */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                CRYPTOGRAPHIC SHA-256 CHECK-SUM COMPARISON
              </span>

              <div>
                <span className="text-slate-500 text-[10px] block">Original Hash (Intake Master):</span>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 break-all text-[11px]">
                  {activeRecord.originalSha256}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Current Live Hash (Monitored):</span>
                <div
                  className={`p-2 rounded border break-all text-[11px] ${
                    isMismatch
                      ? 'bg-red-950/30 border-red-500/50 text-red-400 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-cyan-300'
                  }`}
                >
                  {activeRecord.sha256}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-400">Cryptographic Bit-Level Parity:</span>
                <span
                  className={`font-bold ${
                    isMismatch ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isMismatch ? '🔴 DIVERGENT (HASH MISMATCH)' : '🟢 100% BITSTREAM MATCH'}
                </span>
              </div>
            </div>

            {/* 2. File Size & Timestamp Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  File Size Verification
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Original Size:</span>
                  <span className="text-slate-200">{activeRecord.fileSize}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Current Size:</span>
                  <span className={isMismatch ? 'text-red-400 font-bold' : 'text-slate-200'}>
                    {activeRecord.fileSize}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Temporal Timestamp Verification
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Original Intake:</span>
                  <span className="text-slate-200">{activeRecord.timestamp.split(' ')[1] || activeRecord.timestamp}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Current Check:</span>
                  <span className="text-slate-200">Just now</span>
                </div>
              </div>
            </div>

            {/* 3. Metadata Status */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Metadata Header Consistency & Invariants
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isWarning
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isWarning ? '⚠ METADATA WARNING' : '✓ HEADERS CONSISTENT'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>Created: <span className="text-slate-200">{activeRecord.metadata.createdTimestamp}</span></div>
                <div>Modified: <span className={isWarning ? 'text-amber-400 font-bold' : 'text-slate-200'}>{activeRecord.metadata.modifiedTimestamp}</span></div>
                <div>Tool: <span className="text-slate-200 truncate">{activeRecord.metadata.acquisitionTool}</span></div>
                <div>Invariants: <span className="text-cyan-400">{activeRecord.metadata.invariantsChecked} Passed</span></div>
              </div>

              {isWarning && (
                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/40 text-amber-300 text-[11px] font-sans">
                  Temporal warning: Modification timestamp precedes creation timestamp. Probable timeline falsification or clock desynchronization.
                </div>
              )}
            </div>

            {/* 4. Evidence DNA Comparison */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block mb-1">
                  Active Evidence DNA Fingerprint
                </span>
                <EvidenceDnaBadge
                  dna={activeRecord.evidenceDna}
                  originalDna={activeRecord.originalDna}
                  isMismatch={isMismatch}
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Trust Score</span>
                <span className="text-base font-bold text-slate-100 tabular-nums">
                  {activeRecord.trustScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
