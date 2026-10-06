import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { EvidenceRecord } from '../../types/forensic';

interface TransferEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceRecord;
}

export const TransferEvidenceModal: React.FC<TransferEvidenceModalProps> = ({
  isOpen,
  onClose,
  evidence,
}) => {
  const { transferEvidence, currentUser } = useForensic();

  const [newHolder, setNewHolder] = useState('Senior Forensic Specialist Elena Rostova');
  const [newLocation, setNewLocation] = useState('Central Forensic Laboratory - ISO Class 5 Cleanroom');
  const [action, setAction] = useState('Transferred to Forensic Lab');
  const [reason, setReason] = useState('Deep packet payload extraction and bitstream re-hashing');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transferEvidence(evidence.id, newHolder, newLocation, action, reason);
    onClose();
  };

  const actionOptions = [
    'Transferred to Forensic Lab',
    'Investigation Review Handover',
    'Judicial Evidence Locker Deposit',
    'Mobile Faraday Safe Transport',
    'Courtroom Evidentiary Presentation',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Transfer Chain of Custody</h3>
              <p className="text-[11px] text-slate-400">Dual-custody verification ledger sign-off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Evidence context card */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500">Target Artifact</span>
              <div className="font-semibold text-slate-200">{evidence.id} · {evidence.fileName}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500">Current Custodian</span>
              <div className="font-mono text-cyan-400">{evidence.currentHolder}</div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Transfer Action</label>
            <select
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            >
              {actionOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Receiving Custodian (Person & Role)</label>
            <input
              type="text"
              required
              value={newHolder}
              onChange={e => setNewHolder(e.target.value)}
              placeholder="e.g. Senior Forensic Specialist Elena Rostova"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Destination Facility / Room</label>
            <input
              type="text"
              required
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              placeholder="e.g. Central Forensic Lab Room 402"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Operational Reason / Legal Authority</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Official justification for physical or bitstream movement..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans resize-none"
            />
          </div>

          <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-2 text-[11px] text-cyan-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>
              Authorizing Officer: <strong>{currentUser.name}</strong> ({currentUser.badgeNumber}) · Cryptographic token will be signed automatically.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Sign & Execute Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
