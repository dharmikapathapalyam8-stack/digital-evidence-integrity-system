import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  HardDrive,
  Cpu,
  Clock,
  UserCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { UserRole } from '../../types/forensic';

export const SettingsView: React.FC = () => {
  const { currentUser, switchUserRole } = useForensic();

  const [hashAlgorithm, setHashAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'BLAKE3'>('SHA-256');
  const [scanInterval, setScanInterval] = useState('60s');
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [enforceDualCustody, setEnforceDualCustody] = useState(true);
  const [writeBlockVerification, setWriteBlockVerification] = useState(true);

  const roles: UserRole[] = ['Administrator', 'Investigator', 'Forensic Officer', 'Auditor'];

  const roleClearanceMatrix = {
    Administrator: { ingest: true, transfer: true, tamperSim: true, export: true, manageRoles: true },
    Investigator: { ingest: true, transfer: true, tamperSim: false, export: true, manageRoles: false },
    'Forensic Officer': { ingest: true, transfer: true, tamperSim: true, export: true, manageRoles: false },
    Auditor: { ingest: false, transfer: false, tamperSim: false, export: true, manageRoles: false },
  };

  const activePerms = roleClearanceMatrix[currentUser.role];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              SYSTEM SECURITY & CRYPTOGRAPHIC POLICIES
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure hash algorithm enforcement, continuous verification daemon parameters, and role clearances
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>FIPS 140-3 COMPLIANCE MODE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Security Configurations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Cryptographic Ingestion Standards */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>CRYPTOGRAPHIC ALGORITHM ENFORCEMENT</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Primary Intake Hash Algorithm</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SHA-256', 'SHA-512', 'BLAKE3'] as const).map(algo => (
                    <button
                      key={algo}
                      type="button"
                      onClick={() => setHashAlgorithm(algo)}
                      className={`p-2.5 rounded-md border font-mono text-xs transition-colors cursor-pointer ${
                        hashAlgorithm === algo
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Background Integrity Telemetry Cycle</label>
                <select
                  value={scanInterval}
                  onChange={e => setScanInterval(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="30s">30 Seconds (High Velocity Audit)</option>
                  <option value="60s">60 Seconds (Standard Operational Daemon)</option>
                  <option value="5m">5 Minutes (Energy-Saving Archive Mode)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Tamper Protection & Automated Policy */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
              <Shield className="w-4 h-4 text-red-400" />
              <span>TAMPER RESPONSE & AUTOMATED MITIGATION</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-slate-200 font-medium">Automatic Quarantine on Bit-Flip</div>
                  <div className="text-[11px] text-slate-500">
                    Immediately revoke read/write handles if live SHA-256 diverges from sealed intake hash
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoQuarantine}
                  onChange={e => setAutoQuarantine(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-slate-200 font-medium">Enforce Dual-Custody Signature Handoff</div>
                  <div className="text-[11px] text-slate-500">
                    Require cryptographic sign-off token from both transferor and receiving custodian
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enforceDualCustody}
                  onChange={e => setEnforceDualCustody(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-slate-200 font-medium">Hardware Write-Block Attestation</div>
                  <div className="text-[11px] text-slate-500">
                    Verify physical bridge serial number before mounting bitstream images
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={writeBlockVerification}
                  onChange={e => setWriteBlockVerification(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Active Role & RBAC Clearance Table */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active User Card */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                ACTIVE DUTY CLEARANCE
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{currentUser.badgeNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-100">{currentUser.name}</h4>
                <div className="text-xs text-cyan-400 font-mono">{currentUser.role}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{currentUser.department}</div>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Security Clearance:</span>
                <span className="text-slate-200">{currentUser.clearanceLevel}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session Status:</span>
                <span className="text-emerald-400 font-bold">AUTHENTICATED (MFA)</span>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 font-semibold">
                SIMULATE ROLE CLEARANCE:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => switchUserRole(r)}
                    className={`p-2 rounded text-xs font-mono transition-colors cursor-pointer text-left ${
                      currentUser.role === r
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RBAC Permissions Matrix */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              ROLE PERMISSION MATRIX (FOR CURRENT ROLE)
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Evidence Ingest & Hashing</span>
                <span className={activePerms.ingest ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  {activePerms.ingest ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Chain of Custody Transfer</span>
                <span className={activePerms.transfer ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  {activePerms.transfer ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Controlled Tamper Simulation</span>
                <span className={activePerms.tamperSim ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  {activePerms.tamperSim ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Report & Dossier Generation</span>
                <span className={activePerms.export ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  {activePerms.export ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Disclaimer Note (Required by Section 15) */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300 font-mono uppercase block mb-0.5">
            Legal Admissibility & Jurisdictional Notice
          </strong>
          EVIDENTIA AI provides automated cryptographic telemetry, SHA-256 integrity checks, and empirical
          evidence trust risk scores. This platform prototype is designed for investigative forensics and
          evidence tracking demonstration; it does not replace statutory judicial certification or sworn
          expert-witness forensic testimony in courts of law.
        </div>
      </div>
    </div>
  );
};
