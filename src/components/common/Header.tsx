import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Shield,
  ChevronDown,
  UserCheck,
  Check,
  Search,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { UserRole } from '../../types/forensic';

export const Header: React.FC = () => {
  const {
    activeTab,
    currentUser,
    switchUserRole,
    alerts,
    acknowledgeAlert,
    setIsAiModalOpen,
    setSelectedEvidenceId,
    setActiveTab,
  } = useForensic();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  const roles: UserRole[] = ['Administrator', 'Investigator', 'Forensic Officer', 'Auditor'];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Forensic Command Center / Live Overview';
      case 'cases':
        return 'Case Management Ledger';
      case 'vault':
        return 'Evidence Vault Repository';
      case 'passport':
        return 'Evidence Passport & Cryptographic Identity';
      case 'dna':
        return 'Evidence DNA Digital Fingerprint Engine';
      case 'monitor':
        return 'Cybersecurity Integrity Monitor & Tamper Detection';
      case 'custody':
        return 'Chain of Custody Event Ledger';
      case 'ai-intel':
        return 'AI Forensic Anomaly Intelligence';
      case 'analytics':
        return 'Data Science Forensic Analytics';
      case 'audit':
        return 'Immutable Audit Ledger';
      case 'reports':
        return 'Forensic Evidence Certification Reports';
      case 'settings':
        return 'System Cryptographic Policies';
      default:
        return 'System Overview';
    }
  };

  return (
    <header className="h-16 px-6 bg-[#090E18] border-b border-slate-800/80 flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-md">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-base text-slate-100 flex items-center gap-1.5 font-mono">
              EVIDENTIA<span className="text-cyan-400">AI</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
          <span className="text-slate-500 font-mono">SEC-OPS</span>
          <span aria-hidden="true" className="text-slate-700">/</span>
          <span className="text-slate-300 font-medium">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Zone 2: Central search shortcut */}
      <div className="hidden md:flex items-center">
        <div className="relative w-64 lg:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search hash, Case ID, Evidence ID..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all text-xs font-medium cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Ask EVIDENTIA AI</span>
        </button>

        {/* Notifications Alert Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlertMenu(!showAlertMenu);
              setShowRoleMenu(false);
            }}
            className="relative p-2 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Integrity Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Drawer Dropdown */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-84 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Security Alerts ({unreadAlerts.length})
                </span>
                <span className="text-[11px] text-slate-500">Continuous Monitoring</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-3 hover:bg-slate-800/40 transition-colors text-xs flex flex-col gap-1 cursor-pointer"
                    onClick={() => {
                      setSelectedEvidenceId(alert.evidenceId);
                      setActiveTab('monitor');
                      acknowledgeAlert(alert.id);
                      setShowAlertMenu(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{alert.title}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {alert.timestamp.split(' ')[1] || alert.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role & Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowAlertMenu(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden xl:block">
              <div className="text-xs font-medium text-slate-200 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono leading-tight">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Switcher Menu */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Badge: {currentUser.badgeNumber} · {currentUser.clearanceLevel}
                </div>
              </div>
              <div className="p-1">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Active Role (Demo)
                </div>
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      switchUserRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                      currentUser.role === role
                        ? 'bg-cyan-500/10 text-cyan-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {role}
                    </span>
                    {currentUser.role === role && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
