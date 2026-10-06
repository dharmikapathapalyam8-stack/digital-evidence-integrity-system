import React from 'react';
import { Fingerprint, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EvidenceDnaBadgeProps {
  dna: string;
  originalDna?: string;
  isMismatch?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const EvidenceDnaBadge: React.FC<EvidenceDnaBadgeProps> = ({
  dna,
  originalDna,
  isMismatch = false,
  size = 'md',
  showDetails = false,
}) => {
  const segments = dna.split('-');
  const origSegments = originalDna ? originalDna.split('-') : segments;
  const mismatch = isMismatch || (originalDna && dna !== originalDna);

  const getSegmentColor = (index: number, segment: string, origSegment: string) => {
    if (mismatch && segment !== origSegment) {
      return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
    }
    const colors = [
      'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="inline-flex flex-col gap-1.5">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono tracking-wider tabular-nums ${
          mismatch
            ? 'bg-red-950/40 border-red-500/50 text-red-200'
            : 'bg-slate-900/90 border-slate-700/80 text-cyan-300'
        }`}
      >
        <Fingerprint
          className={`shrink-0 ${
            size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
          } ${mismatch ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}
        />

        <div className="flex items-center gap-1.5">
          {segments.map((seg, idx) => (
            <span
              key={idx}
              className={`px-1.5 py-0.5 rounded text-xs border font-semibold ${getSegmentColor(
                idx,
                seg,
                origSegments[idx] || seg
              )}`}
            >
              {seg}
            </span>
          ))}
        </div>

        {mismatch ? (
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 opacity-80" />
        )}
      </div>

      {showDetails && (
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Hash generated
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Timestamp recorded
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Metadata captured
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Evidence registered
          </span>
        </div>
      )}
    </div>
  );
};
