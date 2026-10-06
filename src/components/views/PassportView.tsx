import React from 'react';
import {
  IdCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  FileDown,
  RefreshCw,
  Calendar,
  User,
  HardDrive,
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { QrVerificationMatrix } from '../common/QrVerificationMatrix';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';
import { TrustScoreGauge } from '../common/TrustScoreGauge';

interface PassportViewProps {
  onOpenReport: () => void;
}

export const PassportView: React.FC<PassportViewProps> = ({ onOpenReport }) => {
  const {
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
    verifyIntegrity,
    setActiveTab,
  } = useForensic();

  const currentEvidence =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];

  const isVerified = currentEvidence.status === 'VERIFIED';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Evidence Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <IdCard className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              EVIDENCE PASSPORT
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unique cryptographic digital identity card, verifiable token, and trust metrics
          </p>
        </div>

        {/* Dropdown to switch active evidence */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Switch Artifact:</span>
          <select
            value={currentEvidence.id}
            onChange={e => setSelectedEvidenceId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            {evidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.fileName} ({ev.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Passport Identity Certificate Card */}
      <div className="bg-gradient-to-b from-[#0D1424] to-[#0A0E1A] border-2 border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] p-8 relative overflow-hidden">
        {/* Subtle decorative security background elements */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Fingerprint className="w-96 h-96 text-cyan-400" />
        </div>

        {/* Passport Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  OFFICIAL FORENSIC IDENTIFIER
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-mono text-slate-400">ISO/IEC 27037 NOTARIZED</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight mt-0.5">
                {currentEvidence.id}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Integrity Status Pill */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                isVerified
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
              }`}
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✓ VERIFIED INTEGRITY</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>⚠ HASH MISMATCH DETECTED</span>
                </>
              )}
            </div>

            {/* Trust Score Tag */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-slate-200">
              Trust Score:{' '}
              <span className="font-bold text-cyan-400">{currentEvidence.trustScore}/100</span>
            </div>
          </div>
        </div>

        {/* Passport Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 relative z-10">
          {/* Left Column: Metadata Specifications */}
          <div className="lg:col-span-8 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Evidence Type</span>
                <span className="font-semibold text-slate-200 text-sm mt-0.5 block">
                  {currentEvidence.fileType}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Artifact: {currentEvidence.fileName} ({currentEvidence.fileSize})
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Associated Case</span>
                <span className="font-mono text-cyan-400 font-semibold text-sm mt-0.5 block">
                  {currentEvidence.caseId}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block truncate">
                  {currentEvidence.caseName}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Collected Timestamp</span>
                <span className="font-mono text-slate-200 text-sm mt-0.5 block">
                  {currentEvidence.timestamp}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Acquired by {currentEvidence.uploadedBy}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Current Holder</span>
                <span className="font-semibold text-slate-200 text-sm mt-0.5 block">
                  {currentEvidence.currentHolder}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block truncate">
                  Location: {currentEvidence.currentLocation}
                </span>
              </div>
            </div>

            {/* SHA-256 Bitstream Hash Banner */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                  CRYPTOGRAPHIC SHA-256 CHECK-SUM
                </span>
                <span className="text-[10px] font-mono text-emerald-400">256-BIT ENTROPY</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all tracking-wider">
                {currentEvidence.sha256}
              </div>
            </div>

            {/* Evidence DNA section */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-1">
                  EVIDENCE DNA DIGITAL FINGERPRINT
                </span>
                <EvidenceDnaBadge
                  dna={currentEvidence.evidenceDna}
                  originalDna={currentEvidence.originalDna}
                  isMismatch={!isVerified}
                  size="md"
                  showDetails
                />
              </div>
              <button
                onClick={() => setActiveTab('dna')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline font-mono cursor-pointer self-start sm:self-auto"
              >
                Inspect DNA Bitstream →
              </button>
            </div>
          </div>

          {/* Right Column: QR Verification Matrix & Trust Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
            <span className="text-[11px] uppercase font-mono text-slate-400 font-semibold">
              CRYPTOGRAPHIC VERIFICATION SEAL
            </span>

            {/* QR Code Style Visual */}
            <QrVerificationMatrix hash={currentEvidence.sha256} size={150} />

            <div className="text-center font-mono text-[11px] text-slate-400 space-y-0.5">
              <div>TOKEN: NOTARY-{currentEvidence.id}-SEC</div>
              <div className="text-emerald-400 text-[10px]">ECDSA SECP256K1 VERIFIED</div>
            </div>

            <div className="w-full pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
              Scan with courtroom reader terminal to verify against immutable national registry.
            </div>
          </div>
        </div>

        {/* Detailed Trust Score Breakdown */}
        <div className="relative z-10 my-4">
          <TrustScoreGauge
            score={currentEvidence.trustScore}
            breakdown={currentEvidence.trustScoreBreakdown}
          />
        </div>

        {/* Action Buttons: VERIFY, VIEW HISTORY, DOWNLOAD REPORT */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HardDrive className="w-4 h-4 text-slate-500" />
            <span>Dual-write block lock engaged</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => verifyIntegrity(currentEvidence.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              VERIFY
            </button>

            <button
              onClick={() => setActiveTab('custody')}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              VIEW HISTORY
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer font-mono"
            >
              <FileDown className="w-3.5 h-3.5" />
              DOWNLOAD REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
