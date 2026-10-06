import React from 'react';
import {
  FolderLock,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  Upload,
  ShieldCheck,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';

interface DashboardViewProps {
  onOpenCreateCase: () => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateCase,
  onOpenUpload,
  onOpenReport,
}) => {
  const {
    cases,
    evidence,
    alerts,
    setActiveTab,
    setSelectedEvidenceId,
    verifyIntegrity,
  } = useForensic();

  // Metrics from specification
  const totalCases = 24;
  const totalEvidence = 1248;
  const verifiedEvidence = 1182;
  const integrityAlerts = 24;
  const underReview = 42;
  const overallIntegrity = 94; // 94%

  // Evidence distribution data
  const evidenceByType = [
    { type: 'Videos', count: 412, pct: 33, color: 'bg-cyan-500' },
    { type: 'Disk Images', count: 320, pct: 26, color: 'bg-blue-500' },
    { type: 'Documents', count: 218, pct: 17, color: 'bg-indigo-500' },
    { type: 'Log Files', count: 184, pct: 15, color: 'bg-teal-500' },
    { type: 'Databases', count: 74, pct: 6, color: 'bg-sky-500' },
    { type: 'Audio', count: 40, pct: 3, color: 'bg-purple-500' },
  ];

  // Alert trend over time data points (days 1 to 7)
  const alertTrend = [
    { day: 'Mon', count: 2, verified: 48 },
    { day: 'Tue', count: 4, verified: 62 },
    { day: 'Wed', count: 1, verified: 71 },
    { day: 'Thu', count: 5, verified: 55 },
    { day: 'Fri', count: 8, verified: 90 },
    { day: 'Sat', count: 3, verified: 42 },
    { day: 'Sun', count: 1, verified: 35 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Subtitle banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              COMMAND CENTER OVERVIEW
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time digital evidence integrity surveillance and cryptographic telemetry
          </p>
        </div>

        {/* Quick Actions buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreateCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Create Case
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            + Upload Evidence
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verify Evidence
          </button>
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Cases */}
        <div
          onClick={() => setActiveTab('cases')}
          className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Cases</span>
            <FolderLock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-2">
            {totalCases}
          </div>
          <div className="text-[10px] text-cyan-400/90 font-mono mt-1">10 Active in Ledger</div>
        </div>

        {/* Total Evidence */}
        <div
          onClick={() => setActiveTab('vault')}
          className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Evidence</span>
            <Database className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-2">
            1,248
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">+14 ingested this week</div>
        </div>

        {/* Verified Evidence */}
        <div
          onClick={() => setActiveTab('monitor')}
          className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Evidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-2">
            1,182
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">94.7% Hash Parity</div>
        </div>

        {/* Integrity Alerts */}
        <div
          onClick={() => setActiveTab('monitor')}
          className="p-4 rounded-lg bg-slate-900/60 border border-red-500/30 hover:border-red-500/50 transition-colors cursor-pointer bg-red-950/10"
        >
          <div className="flex items-center justify-between text-xs text-red-300">
            <span>Integrity Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 tabular-nums mt-2">
            {integrityAlerts}
          </div>
          <div className="text-[10px] text-red-400/80 font-mono mt-1">2 Critical Mismatches</div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => setActiveTab('ai-intel')}
          className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-2">
            {underReview}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">AI triage scheduled</div>
        </div>
      </div>

      {/* Large Featured Integrity Dial & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Evidence Integrity Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.06)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">
                CORE SYSTEM METRIC
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-200 mt-2">
              Overall Evidence Integrity
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Continuous cryptographic bitstream verification across 24 distributed cases
            </p>
          </div>

          <div className="my-6 flex items-baseline gap-3">
            <span className="text-6xl font-extrabold font-mono text-cyan-300 tracking-tight tabular-nums drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {overallIntegrity}%
            </span>
            <div className="text-xs text-slate-400">
              <div className="text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +1.2% this quarter
              </div>
              <div className="text-[11px] mt-0.5">1,182 of 1,248 bits certified</div>
            </div>
          </div>

          {/* Linear bar representation */}
          <div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: '94%' }} className="bg-cyan-400 rounded-l-full" />
              <div style={{ width: '4%' }} className="bg-amber-400" />
              <div style={{ width: '2%' }} className="bg-red-500 rounded-r-full" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                Verified (94%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Under Review (4%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Alerts (2%)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Recent Alerts</h3>
              <p className="text-[11px] text-slate-400">Real-time tamper indicators and verification events</p>
            </div>
            <button
              onClick={() => setActiveTab('monitor')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              View Monitor <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 my-3">
            {/* Example 1: Red */}
            <div
              onClick={() => {
                setSelectedEvidenceId('EV-003');
                setActiveTab('monitor');
              }}
              className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-start justify-between gap-3 hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 mt-0.5">🔴</span>
                <div>
                  <div className="text-xs font-semibold text-red-200">
                    EV-003 – Hash mismatch detected
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Financial_Database_Dump.sql · Ingestion SHA-256 diverged · Quarantined
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] text-red-400 shrink-0">14:35</span>
            </div>

            {/* Example 2: Yellow */}
            <div
              onClick={() => {
                setSelectedEvidenceId('EV-019');
                setActiveTab('monitor');
              }}
              className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start justify-between gap-3 hover:bg-amber-950/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 mt-0.5">🟡</span>
                <div>
                  <div className="text-xs font-semibold text-amber-200">
                    EV-019 – Metadata inconsistency
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Server_Access_Syslog.log · Modification timestamp precedes creation by 14h
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] text-amber-400 shrink-0">13:10</span>
            </div>

            {/* Example 3: Green */}
            <div
              onClick={() => {
                setSelectedEvidenceId('EV-2026-00047');
                setActiveTab('passport');
              }}
              className="p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/30 flex items-start justify-between gap-3 hover:bg-emerald-950/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">🟢</span>
                <div>
                  <div className="text-xs font-semibold text-emerald-200">
                    EV-2026-00047 – Integrity verified
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    CCTV_Street_01.mp4 · 100% block parity · Unbroken custody
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 shrink-0">11:18</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Auto-refresh active (WebCrypto background daemon)</span>
            <span className="font-mono text-cyan-400">STATUS: NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Evidence by Type */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Evidence By Category
              </h3>
              <p className="text-[11px] text-slate-400">Total volume distribution (1,248 artifacts)</p>
            </div>
            <span className="font-mono text-xs text-slate-400">6 Categories</span>
          </div>

          <div className="space-y-3">
            {evidenceByType.map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{item.type}</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {item.count} <span className="text-slate-500 text-[10px]">({item.pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Security Alerts Over Time */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Security Alerts & Verified Ingests (Past 7 Days)
              </h3>
              <p className="text-[11px] text-slate-400">Daily verification vs anomaly velocity</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Ingests
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Alerts
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 px-2">
            {alertTrend.map(col => {
              const ingestHeight = (col.verified / 100) * 100;
              const alertHeight = (col.count / 10) * 70;

              return (
                <div key={col.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    {/* Ingests bar */}
                    <div
                      className="w-1/2 bg-cyan-500/70 hover:bg-cyan-400 rounded-t transition-all"
                      style={{ height: `${ingestHeight}%` }}
                      title={`${col.verified} verified files`}
                    />
                    {/* Alert bar */}
                    <div
                      className="w-1/2 bg-red-500/80 hover:bg-red-400 rounded-t transition-all"
                      style={{ height: `${alertHeight}%` }}
                      title={`${col.count} alerts`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{col.day}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Peak integrity verification on Friday (+90 files)</span>
            <span className="font-mono text-cyan-400">99.1% RESOLVED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
