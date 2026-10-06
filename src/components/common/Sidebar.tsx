import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  Database,
  IdCard,
  Fingerprint,
  Activity,
  GitBranch,
  Bot,
  BarChart3,
  ScrollText,
  FileText,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useForensic, NavigationTab } from '../../context/ForensicContext';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout, alerts } = useForensic();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FolderLock },
    { id: 'vault', label: 'Evidence Vault', icon: Database },
    { id: 'passport', label: 'Evidence Passport', icon: IdCard },
    { id: 'dna', label: 'Evidence DNA', icon: Fingerprint },
    { id: 'monitor', label: 'Integrity Monitor', icon: Activity, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'custody', label: 'Chain of Custody', icon: GitBranch },
    { id: 'ai-intel', label: 'AI Intelligence', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080C16] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Brand Subtitle / Tagline */}
      <div className="p-4 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          FORENSIC INTELLIGENCE SUITE
        </div>
        <p className="text-[11px] text-slate-400 mt-1 italic leading-relaxed">
          “Every File Has a Fingerprint. Every Action Leaves a Trace.”
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tamper Sentinel Status banner */}
      <div className="mx-3 mb-3 p-2.5 rounded-md bg-slate-900/80 border border-slate-800 text-[11px]">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            Integrity Watch
          </span>
          <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 font-mono">
          SHA-256 Daemon active · 60s cycle
        </div>
      </div>

      {/* Bottom User Card & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-cyan-400 font-mono truncate">{currentUser.role}</div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
