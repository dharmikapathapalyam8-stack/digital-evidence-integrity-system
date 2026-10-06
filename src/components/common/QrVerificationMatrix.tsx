import React from 'react';
import { generateVerificationMatrix } from '../../utils/crypto';
import { ShieldCheck } from 'lucide-react';

interface QrVerificationMatrixProps {
  hash: string;
  size?: number; // pixel size
}

export const QrVerificationMatrix: React.FC<QrVerificationMatrixProps> = ({
  hash,
  size = 140,
}) => {
  const matrix = generateVerificationMatrix(hash);

  return (
    <div
      className="relative p-2.5 bg-slate-950 border border-slate-700/80 rounded-md shadow-inner flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* 10x10 binary grid */}
      <div className="grid grid-cols-10 gap-0.5 w-full h-full p-1 bg-slate-900 rounded">
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-[1px] transition-colors duration-300 ${
                val ? 'bg-cyan-400' : 'bg-slate-950'
              }`}
            />
          ))
        )}
      </div>

      {/* Center cyber crest emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-7 h-7 rounded-sm bg-slate-950/90 border border-cyan-500/60 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
