import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Binary,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { EvidenceRecord } from '../../types/forensic';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface TamperSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceRecord;
}

export const TamperSimulationModal: React.FC<TamperSimulationModalProps> = ({
  isOpen,
  onClose,
  evidence,
}) => {
  const { simulateTampering, restoreOriginal } = useForensic();

  // Animation step 0: idle, 1: modifying, 2: computing new hash, 3: comparing, 4: alert fired
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSimulationStep(0);
      setHasRun(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runSimulation = () => {
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
    }, 900);

    setTimeout(() => {
      setSimulationStep(3);
    }, 1800);

    setTimeout(() => {
      setSimulationStep(4);
      simulateTampering(evidence.id);
      setHasRun(true);
    }, 2800);
  };

  const handleRestore = () => {
    restoreOriginal(evidence.id);
    setSimulationStep(0);
    setHasRun(false);
  };

  const originalHash = evidence.originalSha256;
  const alteredHash = 'B7C299D144E8901235481749AC78162547182904716253481928374659102938';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0B101D] border border-red-500/40 rounded-xl w-full max-w-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-red-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-red-500/20 border border-red-500/40 text-red-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Controlled Tamper Simulation Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate bit-flip attack on {evidence.id} ({evidence.fileName}) to verify automated detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Execution Display */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {/* Step 1: Original Evidence */}
            <div
              className={`p-3.5 rounded-lg border transition-all ${
                simulationStep >= 0
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-slate-950 border-slate-900 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px]">
                    1
                  </span>
                  Original Evidence Baseline
                </span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AUTHENTICATED INTAKE
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 break-all border border-slate-800/80">
                SHA-256: {originalHash}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <EvidenceDnaBadge dna={evidence.originalDna} size="sm" />
                <span className="text-[11px] text-slate-400">File Size: {evidence.fileSize}</span>
              </div>
            </div>

            {/* Down Arrow */}
            <div className="flex justify-center text-slate-600">
              <ArrowDown
                className={`w-4 h-4 transition-colors ${
                  simulationStep >= 1 ? 'text-red-400 animate-bounce' : ''
                }`}
              />
            </div>

            {/* Step 2: Simulated Modification */}
            <div
              className={`p-3.5 rounded-lg border transition-all ${
                simulationStep >= 1
                  ? 'bg-red-950/20 border-red-500/40 text-red-200'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-[10px]">
                    2
                  </span>
                  Simulated Binary Modification
                </span>
                {simulationStep >= 1 && (
                  <span className="text-red-400 font-mono text-[11px] animate-pulse">
                    INJECTING BIT-FLIP @ OFFSET 0x4A20...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Altering 2 bytes in file payload to simulate unauthorized modification or malicious injection.
              </p>
            </div>

            {/* Down Arrow */}
            <div className="flex justify-center text-slate-600">
              <ArrowDown
                className={`w-4 h-4 transition-colors ${
                  simulationStep >= 2 ? 'text-red-400 animate-bounce' : ''
                }`}
              />
            </div>

            {/* Step 3: New Hash Calculation & Comparison */}
            <div
              className={`p-3.5 rounded-lg border transition-all ${
                simulationStep >= 2
                  ? 'bg-slate-900 border-red-500/40'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px]">
                    3
                  </span>
                  Live Re-Hashing & Differential Check
                </span>
                {simulationStep >= 3 && (
                  <span className="text-red-400 font-mono text-[11px] font-bold">
                    HASH MISMATCH DETECTED
                  </span>
                )}
              </div>

              {simulationStep >= 2 && (
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-red-300 break-all border border-red-500/30">
                    Live SHA-256: {alteredHash}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Altered DNA Fingerprint:</span>
                    <EvidenceDnaBadge dna="B7C2-99D1-44E8" originalDna={evidence.originalDna} isMismatch />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Security Alert Dispatched */}
            {simulationStep >= 4 && (
              <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/60 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-red-500/20 border border-red-500 text-red-400 shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-200 uppercase tracking-wider font-mono">
                      🔴 SECURITY ALERT TRIGGERED: HASH MISMATCH
                    </h4>
                    <p className="text-xs text-red-300/90 mt-1">
                      Automated Sentinel Flag: Bitstream does not match sealed intake hash. Trust score degraded from 94 to 34.
                      Incident logged in immutable audit ledger with quarantined isolation flag.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Close Window
            </button>

            <div className="flex items-center gap-2">
              {evidence.isTampered || hasRun ? (
                <button
                  type="button"
                  onClick={handleRestore}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restore Golden Master Baseline
                </button>
              ) : (
                <button
                  type="button"
                  disabled={simulationStep > 0 && simulationStep < 4}
                  onClick={runSimulation}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-950 cursor-pointer disabled:opacity-50"
                >
                  <Binary className="w-3.5 h-3.5" />
                  {simulationStep > 0 && simulationStep < 4
                    ? 'Executing Pipeline...'
                    : 'Execute Tamper Simulation'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
