import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  FileCheck2,
  Calendar,
  User,
  Fingerprint,
} from 'lucide-react';
import { EvidenceRecord, CaseRecord } from '../../types/forensic';
import { QrVerificationMatrix } from '../common/QrVerificationMatrix';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceRecord;
  caseRecord?: CaseRecord;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  evidence,
  caseRecord,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportText = `
EVIDENTIA AI - DIGITAL FORENSIC EVIDENCE INTEGRITY CERTIFICATE
=============================================================
Report Generated: ${new Date().toISOString()}
Verification Protocol: SHA-256 Bitstream Hash & Chain of Custody Audit
Compliance Standard: ISO/IEC 27037:2012 & NIST SP 800-86

CASE IDENTIFICATION:
- Case ID: ${evidence.caseId}
- Case Title: ${caseRecord?.name || evidence.caseName}
- Lead Investigator: ${caseRecord?.investigator || 'Specialist S. Vance'}
- Jurisdiction: Metropolitan Cybercrime Division

EVIDENTIARY ARTIFACT RECORD:
- Evidence ID: ${evidence.id}
- Original File Name: ${evidence.fileName}
- Type: ${evidence.fileType}
- Size: ${evidence.fileSize} (${evidence.fileSizeBytes} bytes)
- Ingestion Timestamp: ${evidence.timestamp}
- Cryptographic SHA-256: ${evidence.sha256}
- Baseline SHA-256: ${evidence.originalSha256}
- Evidence DNA Fingerprint: ${evidence.evidenceDna}
- Cryptographic Status: ${evidence.status}
- Evidence Trust Score: ${evidence.trustScore} / 100

TRUST SCORE COMPONENT BREAKDOWN:
- Hash Cryptographic Integrity: ${evidence.trustScoreBreakdown.hashIntegrity} / 40
- Chain of Custody Continuity: ${evidence.trustScoreBreakdown.chainOfCustody} / 25
- Access Security & Quarantine: ${evidence.trustScoreBreakdown.accessSecurity} / 15
- Metadata & Temporal Consistency: ${evidence.trustScoreBreakdown.metadataConsistency} / 20

CHAIN OF CUSTODY LEDGER (${evidence.custodyHistory.length} Recorded Hops):
${evidence.custodyHistory
  .map(
    (h, idx) =>
      `[Hop ${idx + 1}] ${h.timestamp} | ${h.action} | Custodian: ${h.person} (${h.role}) | Sig: ${h.digitalSignature}`
  )
  .join('\n')}

CERTIFICATION STATEMENT:
This document certifies that the digital artifact specified above was ingested
using write-blocked hardware protocols and subjected to continuous algorithmic
integrity verification.

Notary Token: NOTARY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED
EVIDENTIA AI Automated Forensic Certification Authority
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVIDENTIA_FORENSIC_REPORT_${evidence.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B111D] border border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200 font-mono">
              PREVIEW: CERTIFIED EVIDENCE REPORT [{evidence.id}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF / Certificate
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Certificate Body */}
        <div className="p-8 text-slate-200 bg-slate-950 font-sans space-y-6">
          {/* Formal Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-sm font-bold tracking-widest text-slate-100">
                  EVIDENTIA<span className="text-cyan-400">AI</span>
                </span>
              </div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-100 font-mono">
                Digital Evidence Integrity Certificate
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Court-Ready Forensic Verification & Chain of Custody Record
              </p>
            </div>
            <div className="text-right">
              <QrVerificationMatrix hash={evidence.sha256} size={90} />
              <span className="text-[9px] font-mono text-slate-500 block mt-1">
                SEAL: {evidence.id}
              </span>
            </div>
          </div>

          {/* Certificate Metadata strip */}
          <div className="grid grid-cols-3 gap-4 p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Certificate ID</span>
              <span className="font-mono text-slate-200 font-medium">CERT-2026-{evidence.id.replace(/[^0-9]/g, '') || '9910'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Date of Attestation</span>
              <span className="font-mono text-slate-200">{evidence.timestamp}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Integrity Verdict</span>
              <span
                className={`font-mono font-bold ${
                  evidence.status === 'VERIFIED' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {evidence.status === 'VERIFIED' ? '✓ CRYPTOGRAPHICALLY VERIFIED' : '⚠ COMPROMISED / MISMATCH'}
              </span>
            </div>
          </div>

          {/* Case Information */}
          <div>
            <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2 flex items-center gap-1.5">
              <span>01.</span> Case Jurisdiction & Scope
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/40 p-3 rounded border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px]">Case ID & Title</span>
                <span className="font-semibold text-slate-200">
                  {evidence.caseId} — {caseRecord?.name || evidence.caseName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Incident Type</span>
                <span className="text-slate-300">{caseRecord?.incidentType || 'Digital Fraud'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Lead Investigator</span>
                <span className="text-slate-300">{caseRecord?.investigator || 'Specialist S. Vance'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Seizure Facility</span>
                <span className="text-slate-300">{caseRecord?.location || 'Operations Center'}</span>
              </div>
            </div>
          </div>

          {/* Evidence Details */}
          <div>
            <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2 flex items-center gap-1.5">
              <span>02.</span> Evidence Digital Identity & Cryptographic Fingerprint
            </h3>
            <div className="space-y-2 text-xs bg-slate-900/40 p-3 rounded border border-slate-800/80">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Evidence ID</span>
                  <span className="font-mono font-semibold text-cyan-300">{evidence.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Original File Name</span>
                  <span className="font-semibold text-slate-200">{evidence.fileName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">File Size & Type</span>
                  <span className="font-mono text-slate-300">
                    {evidence.fileSize} ({evidence.fileType})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] mb-0.5">
                  Cryptographic SHA-256 Bitstream Hash
                </span>
                <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 break-all">
                  {evidence.sha256}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] mb-1">Evidence DNA Signature</span>
                  <EvidenceDnaBadge dna={evidence.evidenceDna} originalDna={evidence.originalDna} />
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Trust Score Composite</span>
                  <span className="font-mono text-base font-bold text-slate-100 tabular-nums">
                    {evidence.trustScore}
                    <span className="text-xs text-slate-500">/100</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chain of Custody */}
          <div>
            <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2 flex items-center gap-1.5">
              <span>03.</span> Chain of Custody Ledger & Historical Hops
            </h3>
            <div className="space-y-2">
              {evidence.custodyHistory.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 p-2.5 rounded bg-slate-900/30 border border-slate-800/60 text-xs"
                >
                  <div className="w-5 h-5 rounded bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{step.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{step.timestamp}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Custodian: <span className="text-slate-300">{step.person}</span> ({step.role}) · Location: {step.location}
                    </div>
                    <div className="font-mono text-[10px] text-cyan-400/80 mt-1">
                      Token: {step.digitalSignature}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Certification Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div>
              Generated via EVIDENTIA AI Forensic Platform · Version 2026.4
              <br />
              Digital Evidence Integrity & Forensic Intelligence
            </div>
            <div className="text-right">
              Notary Hash: {evidence.sha256.substring(0, 16)}...
              <br />
              Authorized Electronic Signature Affixed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
