import React, { useState } from 'react';
import {
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
  Binary,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface DnaViewProps {
  onOpenTamperModal: () => void;
}

export const DnaView: React.FC<DnaViewProps> = ({ onOpenTamperModal }) => {
  const {
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
    simulateTampering,
    restoreOriginal,
  } = useForensic();

  const currentEvidence =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];

  const isMismatch =
    currentEvidence.isTampered || currentEvidence.evidenceDna !== currentEvidence.originalDna;

  const dnaSegments = currentEvidence.evidenceDna.split('-');
  const origSegments = currentEvidence.originalDna.split('-');

  // Decomposition of DNA factors
  const factors = [
    { name: 'SHA-256 Primary Digest Block', value: currentEvidence.sha256.substring(0, 16), weight: '40%' },
    { name: 'Temporal File Invariant Hash', value: currentEvidence.metadata.createdTimestamp, weight: '25%' },
    { name: 'Filesystem Inode / Attribute Seal', value: `${currentEvidence.fileSizeBytes} B · ${currentEvidence.fileType}`, weight: '20%' },
    { name: 'Acquisition Rig Hardware Signature', value: currentEvidence.metadata.acquisitionTool, weight: '15%' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              EVIDENCE DNA ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic digital fingerprint generator derived from cryptographic hash entropy and acquisition metadata
          </p>
        </div>

        {/* Evidence selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Select Target:</span>
          <select
            value={currentEvidence.id}
            onChange={e => setSelectedEvidenceId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            {evidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.fileName} {ev.isTampered ? '(Tampered)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary DNA Visualization Card */}
      <div
        className={`rounded-2xl border-2 p-8 transition-all ${
          isMismatch
            ? 'bg-gradient-to-b from-red-950/40 to-slate-950 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
            : 'bg-gradient-to-b from-[#0B1220] to-[#080D17] border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.1)]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
              UNIQUE RECORD FINGERPRINT
            </span>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              Artifact: {currentEvidence.id} ({currentEvidence.fileName})
            </div>
          </div>

          <div>
            {isMismatch ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500 text-red-200 font-mono text-xs font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>🔴 EVIDENCE DNA MISMATCH</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ EVIDENCE DNA VERIFIED</span>
              </div>
            )}
          </div>
        </div>

        {/* Large DNA String Display */}
        <div className="my-8 text-center space-y-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            DIGITAL FINGERPRINT SIGNATURE
          </div>

          <div className="inline-flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
            <Fingerprint className={`w-8 h-8 ${isMismatch ? 'text-red-400' : 'text-cyan-400'}`} />
            <div className="flex items-center gap-2 text-2xl md:text-3xl font-mono font-bold tracking-wider tabular-nums">
              {dnaSegments.map((seg, idx) => {
                const changed = isMismatch && seg !== origSegments[idx];
                return (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-3 py-1 rounded-lg border transition-all ${
                        changed
                          ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                          : 'bg-slate-900 text-cyan-300 border-slate-700'
                      }`}
                    >
                      {seg}
                    </span>
                    {idx < dnaSegments.length - 1 && (
                      <span className="text-slate-600 font-mono">-</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 4 Invariant Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Hash generated
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Timestamp recorded
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Metadata captured
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Evidence registered
            </span>
          </div>
        </div>

        {/* If Mismatch State is Active: Show Difference Panel */}
        {isMismatch && (
          <div className="p-5 rounded-xl bg-red-950/30 border border-red-500/50 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-red-300">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                POSSIBLE MODIFICATION DETECTED
              </span>
              <span className="text-red-400">CRYPTOGRAPHIC BIT-FLIP IDENTIFIED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Original Fingerprint</span>
                <span className="text-emerald-400 text-sm font-semibold">{currentEvidence.originalDna}</span>
                <div className="text-[10px] text-slate-500 mt-1">Recorded at initial forensic intake</div>
              </div>

              <div className="p-3 rounded bg-slate-950/80 border border-red-500/40">
                <span className="text-red-400 block text-[10px] uppercase">Current Fingerprint</span>
                <span className="text-red-400 text-sm font-semibold">{currentEvidence.evidenceDna}</span>
                <div className="text-[10px] text-red-300/80 mt-1">Calculated during recent monitor cycle</div>
              </div>
            </div>

            <p className="text-[11px] text-red-200/90 leading-relaxed">
              Discrepancy indicates that the bitstream payload has diverged from the sealed original intake master.
              Automated quarantine has locked read/write handles on this volume.
            </p>
          </div>
        )}

        {/* DNA Decomposition / Entropy Factors Table */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 uppercase font-semibold">
              EVIDENCE DNA VECTOR DECOMPOSITION
            </span>
            <span className="text-slate-500 text-[11px]">Composite weight: 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {factors.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-slate-400 text-[11px]">{f.name}</div>
                  <div className="font-mono text-cyan-300 font-semibold text-xs mt-0.5 truncate max-w-xs">
                    {f.value}
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {f.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tamper Simulation Quick Action */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Simulate a byte alteration to observe instant DNA divergence.
          </div>

          <div className="flex items-center gap-3">
            {isMismatch ? (
              <button
                onClick={() => restoreOriginal(currentEvidence.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                RESTORE ORIGINAL DNA
              </button>
            ) : (
              <button
                onClick={onOpenTamperModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-950 cursor-pointer font-mono"
              >
                <Binary className="w-3.5 h-3.5" />
                SIMULATE MODIFICATION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
