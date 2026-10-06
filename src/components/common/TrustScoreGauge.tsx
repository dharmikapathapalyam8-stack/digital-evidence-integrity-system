import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { TrustScoreBreakdown } from '../../types/forensic';

interface TrustScoreGaugeProps {
  score: number;
  breakdown: TrustScoreBreakdown;
  compact?: boolean;
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  breakdown,
  compact = false,
}) => {
  const getRiskStatus = () => {
    if (score >= 90) {
      return {
        label: 'LOW INTEGRITY RISK',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        icon: ShieldCheck,
      };
    }
    if (score >= 70) {
      return {
        label: 'MEDIUM INTEGRITY RISK',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'HIGH INTEGRITY RISK',
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
      bg: 'bg-red-500/10',
      icon: ShieldAlert,
    };
  };

  const status = getRiskStatus();
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold tabular-nums text-slate-200">
          {score}
          <span className="text-xs text-slate-500">/100</span>
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${status.borderColor} ${status.bg} ${status.color}`}
        >
          {score >= 90 ? 'VERIFIED' : score >= 70 ? 'WARNING' : 'TAMPERED'}
        </span>
      </div>
    );
  }

  // Circular gauge circumference math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Evidence Trust Score
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic & evidentiary compliance composite
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold ${status.borderColor} ${status.bg} ${status.color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{status.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`transition-all duration-700 ${
                  score >= 90 ? 'stroke-cyan-400' : score >= 70 ? 'stroke-amber-400' : 'stroke-red-400'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">/ 100</span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="md:col-span-8 space-y-2.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Hash Integrity</span>
              <span className="font-mono tabular-nums text-slate-400">
                {breakdown.hashIntegrity}/40
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.hashIntegrity === 40 ? 'bg-cyan-400' : 'bg-red-400'
                }`}
                style={{ width: `${(breakdown.hashIntegrity / 40) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Chain of Custody</span>
              <span className="font-mono tabular-nums text-slate-400">
                {breakdown.chainOfCustody}/25
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.chainOfCustody / 25) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Access Security</span>
              <span className="font-mono tabular-nums text-slate-400">
                {breakdown.accessSecurity}/15
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.accessSecurity / 15) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Metadata Consistency</span>
              <span className="font-mono tabular-nums text-slate-400">
                {breakdown.metadataConsistency}/20
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.metadataConsistency / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p>
          This is a system-generated risk indicator and does not determine legal admissibility.
          Calculated in accordance with ISO/IEC 27037 standards.
        </p>
      </div>
    </div>
  );
};
