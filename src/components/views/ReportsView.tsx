import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Eye,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { QrVerificationMatrix } from '../common/QrVerificationMatrix';
import { EvidenceDnaBadge } from '../common/EvidenceDnaBadge';

interface ReportsViewProps {
  onOpenReportModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenReportModal }) => {
  const {
    cases,
    evidence,
    selectedEvidenceId,
    setSelectedEvidenceId,
    selectedCaseId,
    setSelectedCaseId,
  } = useForensic();

  const [selectedCase, setSelectedCase] = useState(selectedCaseId || cases[0]?.id || 'CASE-1024');
  const [selectedEvidence, setSelectedEvidence] = useState(selectedEvidenceId || 'EV-2026-00047');

  const currentCase = cases.find(c => c.id === selectedCase) || cases[0];
  const currentEvidence = evidence.find(e => e.id === selectedEvidence) || evidence[0];

  const handleDownloadTxt = () => {
    const reportText = `
EVIDENTIA AI - DIGITAL FORENSIC EVIDENCE INTEGRITY CERTIFICATE
=============================================================
Report Generated: ${new Date().toISOString()}
Verification Protocol: SHA-256 Bitstream Hash & Chain of Custody Audit
Compliance Standard: ISO/IEC 27037:2012 & NIST SP 800-86

CASE IDENTIFICATION:
- Case ID: ${currentCase.id}
- Case Title: ${currentCase.name}
- Incident Type: ${currentCase.incidentType}
- Lead Investigator: ${currentCase.investigator}
- Jurisdiction: ${currentCase.location}

EVIDENTIARY ARTIFACT RECORD:
- Evidence ID: ${currentEvidence.id}
- Original File Name: ${currentEvidence.fileName}
- Type: ${currentEvidence.fileType}
- Size: ${currentEvidence.fileSize}
- Timestamp: ${currentEvidence.timestamp}
- Cryptographic SHA-256: ${currentEvidence.sha256}
- Evidence DNA Fingerprint: ${currentEvidence.evidenceDna}
- Cryptographic Status: ${currentEvidence.status}
- Trust Score: ${currentEvidence.trustScore} / 100

TRUST SCORE BREAKDOWN:
- Hash Integrity: ${currentEvidence.trustScoreBreakdown.hashIntegrity}/40
- Chain of Custody: ${currentEvidence.trustScoreBreakdown.chainOfCustody}/25
- Access Security: ${currentEvidence.trustScoreBreakdown.accessSecurity}/15
- Metadata Consistency: ${currentEvidence.trustScoreBreakdown.metadataConsistency}/20

CHAIN OF CUSTODY LEDGER (${currentEvidence.custodyHistory.length} Recorded Hops):
${currentEvidence.custodyHistory
  .map(
    (h, idx) =>
      `[Hop ${idx + 1}] ${h.timestamp} | ${h.action} | Custodian: ${h.person} (${h.role}) | Token: ${h.digitalSignature}`
  )
  .join('\n')}

CERTIFICATION STATEMENT:
This document certifies that the digital artifact specified above was ingested
using write-blocked hardware protocols and subjected to continuous algorithmic
integrity verification.

Notary Token: NOTARY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVIDENTIA_REPORT_${currentEvidence.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              EVIDENCE INTEGRITY REPORT GENERATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal court-ready digital evidence dossiers with cryptographic attestations
          </p>
        </div>

        {/* Buttons: GENERATE REPORT, PREVIEW REPORT, DOWNLOAD PDF */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedEvidenceId(selectedEvidence);
              onOpenReportModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            PREVIEW REPORT
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer font-mono"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            PRINT REPORT
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950 cursor-pointer font-mono"
          >
            <FileDown className="w-3.5 h-3.5" />
            DOWNLOAD PDF / CERTIFICATE
          </button>
        </div>
      </div>

      {/* Configuration Strip */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1 font-mono">
            SELECT INVESTIGATION CASE:
          </label>
          <select
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1 font-mono">
            SELECT EVIDENCE ARTIFACT:
          </label>
          <select
            value={selectedEvidence}
            onChange={e => {
              setSelectedEvidence(e.target.value);
              setSelectedEvidenceId(e.target.value);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {evidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.fileName} ({ev.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Document Preview Container */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-8 max-w-4xl mx-auto shadow-2xl text-slate-200 font-sans space-y-6">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-sm font-bold tracking-widest text-slate-100">
                EVIDENTIA<span className="text-cyan-400">AI</span> FORENSIC DOSSIER
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              FORMAL EVIDENCE INTEGRITY NOTARIZATION
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Certified in compliance with Federal Rules of Evidence 902(11) & 902(14)
            </p>
          </div>
          <div className="text-right">
            <QrVerificationMatrix hash={currentEvidence.sha256} size={90} />
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              NOTARY SEAL
            </span>
          </div>
        </div>

        {/* 1. Case Information */}
        <div>
          <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2">
            Section I — Case Jurisdiction & Incident Classification
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/50 p-3 rounded border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Case ID & Title</span>
              <span className="font-semibold text-slate-200">
                {currentCase.id} — {currentCase.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Incident Type</span>
              <span className="text-slate-300">{currentCase.incidentType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Investigating Agent</span>
              <span className="text-slate-300">{currentCase.investigator}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Facility Location</span>
              <span className="text-slate-300">{currentCase.location}</span>
            </div>
          </div>
        </div>

        {/* 2. Evidence Information & SHA-256 */}
        <div>
          <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2">
            Section II — Cryptographic Hash & Digital DNA Seal
          </h3>
          <div className="space-y-2 text-xs bg-slate-900/50 p-3 rounded border border-slate-800">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Evidence ID</span>
                <span className="font-mono font-semibold text-cyan-300">{currentEvidence.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">File Name</span>
                <span className="font-semibold text-slate-200">{currentEvidence.fileName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">File Size & Type</span>
                <span className="font-mono text-slate-300">
                  {currentEvidence.fileSize} ({currentEvidence.fileType})
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] mb-0.5">
                Primary Intake SHA-256 Checksum
              </span>
              <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 break-all">
                {currentEvidence.sha256}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-slate-500 block text-[10px] mb-1">Evidence DNA Signature</span>
                <EvidenceDnaBadge dna={currentEvidence.evidenceDna} originalDna={currentEvidence.originalDna} />
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Evidence Trust Score</span>
                <span className="font-mono text-base font-bold text-slate-100 tabular-nums">
                  {currentEvidence.trustScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Chain of Custody History */}
        <div>
          <h3 className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider mb-2">
            Section III — Chain of Custody & Transfer History ({currentEvidence.custodyHistory.length} Hops)
          </h3>
          <div className="space-y-2">
            {currentEvidence.custodyHistory.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-2.5 rounded bg-slate-900/40 border border-slate-800/80 text-xs"
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
                    Custodian: {step.person} ({step.role}) · Destination: {step.location}
                  </div>
                  <div className="font-mono text-[10px] text-cyan-400 mt-1">
                    Signature: {step.digitalSignature}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed font-mono">
          EVIDENTIA AI is an automated forensic intelligence verification platform. The trust score
          and integrity assessments herein are system-generated telemetry risk indicators and do not
          supersede statutory rules of judicial admissibility.
        </div>
      </div>
    </div>
  );
};
