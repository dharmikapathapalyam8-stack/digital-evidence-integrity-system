import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { EvidenceRecord } from '../../types/forensic';

interface AiIntelligenceViewProps {
  onOpenReport: () => void;
}

export const AiIntelligenceView: React.FC<AiIntelligenceViewProps> = ({ onOpenReport }) => {
  const {
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
    setActiveTab,
    setIsAiModalOpen,
  } = useForensic();

  const [analyzing, setAnalyzing] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState(selectedEvidenceId || 'EV-003');

  const currentEvidence =
    evidence.find(e => e.id === selectedTargetId) || evidence[0];

  const isHighRisk = currentEvidence.id === 'EV-003' || currentEvidence.isTampered;
  const isMediumRisk = currentEvidence.id === 'EV-019' || currentEvidence.status === 'METADATA_WARNING';

  // AI Risk Score calculation
  const aiRiskScore = isHighRisk ? 88 : isMediumRisk ? 46 : 6;

  const handleRunAiAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              AI EVIDENCE INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning anomaly detection across custody handoffs, temporal gaps, and access frequency
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTargetId}
            onChange={e => setSelectedTargetId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            {evidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.fileName}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer font-mono disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            RUN AI ANOMALY SCAN
          </button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div
        className={`rounded-2xl border-2 p-8 transition-all ${
          isHighRisk
            ? 'bg-gradient-to-b from-red-950/40 to-slate-950 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
            : isMediumRisk
            ? 'bg-gradient-to-b from-amber-950/30 to-slate-950 border-amber-500/50'
            : 'bg-gradient-to-b from-[#0B1220] to-[#080D17] border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.08)]'
        }`}
      >
        {/* Header & Status Verdict */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              NEURAL CUSTODY PATTERN RECOGNITION
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-mono mt-1">
              Evidence Target: {currentEvidence.id} ({currentEvidence.fileName})
            </h2>
          </div>

          <div>
            {isHighRisk ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500 text-red-200 font-mono text-xs font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>🔴 HIGH RISK — REVIEW REQUIRED</span>
              </div>
            ) : isMediumRisk ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500 text-amber-200 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>🟡 MEDIUM RISK — ANOMALY FLAGGED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>🟢 LOW RISK — NOMINAL CUSTODY</span>
              </div>
            )}
          </div>
        </div>

        {/* Pattern Comparison: Normal vs Detected */}
        <div className="my-8 space-y-4">
          <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
            Chain-of-Custody Sequence Modeling
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Normal baseline pattern */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">
                Standard Baseline Pattern (Normal)
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">Officer A</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">Forensic Lab B</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">Investigator C</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Adherent to linear custody transfer with authenticated dual sign-off signatures and matching physical seal serials.
              </p>
            </div>

            {/* Detected Pattern */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isHighRisk
                  ? 'bg-red-950/20 border-red-500/50 text-red-200'
                  : isMediumRisk
                  ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold block">
                {isHighRisk ? '⚠ Detected Pattern (Anomalous)' : 'Detected Pattern (Normal)'}
              </span>

              {isHighRisk ? (
                <div className="flex flex-wrap items-center gap-2 text-red-300">
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Officer A</span>
                  <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="p-1.5 rounded bg-red-950 border border-red-500/60 text-red-300 font-bold">
                    Unknown User
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="p-1.5 rounded bg-red-950 border border-red-500/60 text-red-300 font-bold">
                    Multiple Downloads
                  </span>
                </div>
              ) : isMediumRisk ? (
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800">Officer A</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="p-1.5 rounded bg-amber-950 border border-amber-500/60">
                    Delayed Lab Transfer (6h gap)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Officer A</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Forensic Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Investigator</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {isHighRisk
                  ? 'Deviated from verified operational sequence. Direct remote access detected outside scheduled shift.'
                  : isMediumRisk
                  ? 'Temporal delay recorded between physical field seizure and evidentiary vault check-in.'
                  : 'Strict conformity to ISO 27037 sequential digital forensics workflow.'}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Score & Detected Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-slate-800">
          {/* AI Risk Score gauge */}
          <div className="md:col-span-4 p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold mb-2">
              COMPOSITE AI RISK SCORE
            </span>
            <div
              className={`text-5xl font-extrabold font-mono tabular-nums ${
                isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {aiRiskScore}
              <span className="text-sm text-slate-500 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {isHighRisk
                ? 'High probability of unauthorized alteration'
                : isMediumRisk
                ? 'Moderate procedural variance'
                : 'Zero anomalous vectors discovered'}
            </div>
          </div>

          {/* Detected Factors Checklist */}
          <div className="md:col-span-8 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
              CORRELATED RISK FACTORS
            </span>

            {isHighRisk ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-semibold">Unusual access pattern</span> — 9 binary extractions within 180 seconds
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-semibold">Multiple downloads</span> from unverified IP 194.67.210.15
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-semibold">Custody gap</span> — 38-minute unlogged interval during terminal transfer
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-semibold">Metadata inconsistency</span> — Byte divergence at sector 0x4A20
                </div>
              </div>
            ) : isMediumRisk ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-semibold">Metadata inconsistency</span> — Modification timestamp precedes creation by 14h
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-semibold">Delayed check-in</span> — Exceeded 4-hour field-to-lab threshold
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Continuous hash invariants confirmed without bit-flip</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dual cryptographic custody signoffs present at every hop</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Access restricted strictly to authorized clearance roles</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            Query Copilot Regarding Anomaly Patterns →
          </button>

          <button
            onClick={onOpenReport}
            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono"
          >
            Generate Case Intelligence Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
