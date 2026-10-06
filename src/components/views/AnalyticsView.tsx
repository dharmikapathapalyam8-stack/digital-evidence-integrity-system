import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  ShieldCheck,
  Calendar,
  Filter,
  Layers,
  Clock,
  HardDrive,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';

export const AnalyticsView: React.FC = () => {
  const { cases, evidence } = useForensic();

  const [selectedCase, setSelectedCase] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Q3-Q4-2026');

  // Monthly uploads data
  const monthlyUploads = [
    { month: 'May', uploads: 142, alerts: 2 },
    { month: 'Jun', uploads: 188, alerts: 3 },
    { month: 'Jul', uploads: 215, alerts: 1 },
    { month: 'Aug', uploads: 260, alerts: 4 },
    { month: 'Sep', uploads: 310, alerts: 8 },
    { month: 'Oct', uploads: 133, alerts: 6 },
  ];

  // Evidence access activity heat (hours 00:00 to 20:00)
  const hourlyActivity = [
    { hour: '00:00', accesses: 12, anomaly: false },
    { hour: '04:00', accesses: 28, anomaly: true }, // Anomalous spike!
    { hour: '08:00', accesses: 85, anomaly: false },
    { hour: '12:00', accesses: 142, anomaly: false },
    { hour: '16:00', accesses: 168, anomaly: false },
    { hour: '20:00', accesses: 44, anomaly: false },
  ];

  // Risk distribution
  const riskDistribution = [
    { level: 'Critical', count: 3, pct: 15, color: 'bg-red-500' },
    { level: 'High', count: 6, pct: 30, color: 'bg-amber-500' },
    { level: 'Medium', count: 5, pct: 25, color: 'bg-blue-500' },
    { level: 'Low', count: 6, pct: 30, color: 'bg-emerald-500' },
  ];

  // Category breakdown
  const categoryStats = [
    { name: 'Video Evidence (.mp4, .mkv)', count: 412, size: '280.4 GB', pct: 33 },
    { name: 'Raw Disk Images (.dd, .raw)', count: 320, size: '1.42 TB', pct: 26 },
    { name: 'Documents & Court Files (.pdf)', count: 218, size: '18.2 GB', pct: 17 },
    { name: 'Network & PCAP Logs (.pcap, .log)', count: 184, size: '89.1 GB', pct: 15 },
    { name: 'Database Snapshots (.sql, .db)', count: 74, size: '42.0 GB', pct: 6 },
    { name: 'Audio Wiretaps (.wav)', count: 40, size: '4.8 GB', pct: 3 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              DATA SCIENCE FORENSIC ANALYTICS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical distributions, access frequency velocity, and empirical integrity metrics
          </p>
        </div>

        {/* Global metric callout */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">AVG CUSTODY DURATION</span>
            <span className="text-cyan-400 font-bold">4.2 HOURS / HOP</span>
          </div>
          <div className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">INTEGRITY COMPLIANCE</span>
            <span className="text-emerald-400 font-bold">94.7% CONTINUOUS</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 mr-2 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>FILTERS:</span>
          </div>

          <select
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Cases (24 Cases)</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name.substring(0, 24)}...
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Video">Video Files</option>
            <option value="Disk Image">Disk Images</option>
            <option value="Document">Documents</option>
            <option value="Database Dump">Database Snapshots</option>
            <option value="Log File">Network Logs</option>
          </select>

          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-cyan-300">{selectedTimeRange}</span>
        </div>
      </div>

      {/* Grid of 4 Interactive Statistical Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Monthly Evidence Uploads & Security Alerts */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Monthly Evidence Intake Velocity
              </h3>
              <p className="text-[11px] text-slate-400">Total volume of ingested digital evidence files</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Intake
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Tamper Flags
              </span>
            </div>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyUploads.map(item => {
              const heightPct = (item.uploads / 350) * 100;
              const alertPct = (item.alerts / 10) * 60;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    <div
                      className="w-1/2 bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all cursor-pointer"
                      style={{ height: `${heightPct}%` }}
                      title={`${item.uploads} files ingested`}
                    />
                    <div
                      className="w-1/2 bg-red-500/80 hover:bg-red-400 rounded-t transition-all cursor-pointer"
                      style={{ height: `${alertPct}%` }}
                      title={`${item.alerts} tamper alerts`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Peak intake: September (+310 artifacts)</span>
            <span className="text-cyan-400">+42% Growth</span>
          </div>
        </div>

        {/* Panel 2: Hourly Access Activity Patterns & Anomaly Spikes */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Evidence Access Activity & Velocity
              </h3>
              <p className="text-[11px] text-slate-400">Daily query frequency and off-duty retrieval spikes</p>
            </div>
            <span className="text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
              04:00 AM SPIKE FLAGGED
            </span>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2">
            {hourlyActivity.map(item => {
              const heightPct = (item.accesses / 180) * 100;

              return (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center h-36">
                    <div
                      className={`w-3/4 rounded-t transition-all cursor-pointer ${
                        item.anomaly
                          ? 'bg-red-500 hover:bg-red-400 animate-pulse'
                          : 'bg-blue-500/80 hover:bg-blue-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${item.accesses} accesses at ${item.hour}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Anomalous access at 04:00 correlated with EV-003</span>
            <span className="text-red-400">ISOLATION ENACTED</span>
          </div>
        </div>

        {/* Panel 3: Risk Distribution Histogram */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Evidentiary Risk Classification Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Based on trust score and custody gaps</p>
            </div>
            <span className="font-mono text-xs text-slate-400">20 Primary Targets</span>
          </div>

          <div className="space-y-3">
            {riskDistribution.map(item => (
              <div key={item.level}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{item.level} Risk</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {item.count} items <span className="text-slate-500 text-[10px]">({item.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            85% of repository maintains Low-to-Medium risk profiles.
          </div>
        </div>

        {/* Panel 4: Categories & Storage Volumes */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Storage Allocation By Artifact Type
              </h3>
              <p className="text-[11px] text-slate-400">Total volume: 1.85 TB physical vault capacity</p>
            </div>
            <span className="font-mono text-xs text-cyan-400">1.85 TB TOTAL</span>
          </div>

          <div className="space-y-2.5">
            {categoryStats.map(cat => (
              <div
                key={cat.name}
                className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-slate-200">{cat.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {cat.count} files · {cat.pct}% of library
                  </div>
                </div>
                <span className="font-mono text-slate-300 font-semibold">{cat.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
