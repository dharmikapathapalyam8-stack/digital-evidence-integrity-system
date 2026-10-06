import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { UserRole } from '../../types/forensic';
import { DEMO_USERS } from '../../data/mockData';

export const LoginView: React.FC = () => {
  const { login } = useForensic();

  const [email, setEmail] = useState('sarah.vance@evidentia.defense.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Investigator');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setEmail(demoUser.email);
    setSelectedRole(role);
    login(demoUser.email, role);
  };

  const roles: UserRole[] = ['Administrator', 'Investigator', 'Forensic Officer', 'Auditor'];

  return (
    <div className="min-h-screen w-full bg-[#060911] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background cyber ambient backdrop */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/cyber_evidence_vault_1791260312685.jpg"
          alt="Cyber Vault"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/80 to-[#060911]" />
      </div>

      {/* Grid line overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.12)] p-8 relative z-10 backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-slate-100 font-mono">
            EVIDENTIA<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Digital Evidence Integrity & Forensic Intelligence
          </p>
          <div className="mt-2 text-[11px] font-mono text-cyan-400/90 tracking-wide">
            “Every File Has a Fingerprint. Every Action Leaves a Trace.”
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Forensic Officer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@evidentia.defense.gov"
                className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 pl-9 pr-3 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Access Passcode / Token</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Hardware security key / PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 pl-9 pr-3 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Duty Clearance Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    const matched = DEMO_USERS.find(u => u.role === role);
                    if (matched) setEmail(matched.email);
                  }}
                  className={`p-2 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    selectedRole === role
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{role}</span>
                  {selectedRole === role && <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold tracking-wider uppercase text-xs transition-colors shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <span>LOGIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin(selectedRole)}
              className="w-full py-2.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>DEMO LOGIN (ONE-CLICK ACCESS)</span>
            </button>
          </div>
        </form>

        {/* Security attestation banner */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-500 font-mono">
            SECURED BY HARDWARE WRITE-BLOCK ENGINE & SHA-256 BITSTREAM NOTARY
          </div>
          <div className="text-[10px] text-slate-600 mt-1">
            Compliant with ISO/IEC 27037:2012 & NIST SP 800-86
          </div>
        </div>
      </div>
    </div>
  );
};
