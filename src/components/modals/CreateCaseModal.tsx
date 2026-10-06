import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';
import { IncidentType, RiskLevel } from '../../types/forensic';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose }) => {
  const { addCase, currentUser } = useForensic();

  const [name, setName] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('Digital Fraud');
  const [description, setDescription] = useState('');
  const [investigator, setInvestigator] = useState(currentUser.name);
  const [location, setLocation] = useState('Cybercrime Operations Center');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MEDIUM');
  const [assignedUnit, setAssignedUnit] = useState('Digital Evidence Unit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCase({
      name,
      incidentType,
      description: description || 'Digital forensic case initialized for evidentiary ledger tracking.',
      investigator,
      riskLevel,
      status: 'Active',
      location,
      assignedUnit,
    });

    onClose();
  };

  const incidentOptions: IncidentType[] = [
    'Digital Fraud',
    'Ransomware Extortion',
    'Cyber Espionage',
    'Insider Threat',
    'Intellectual Property Theft',
    'Cloud Infrastructure Breach',
    'Audio/Video Tampering',
    'Crypto Asset Theft',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Create New Forensic Case</h3>
              <p className="text-[11px] text-slate-400">Register incident into immutable custody chain</p>
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
          <div>
            <label className="block text-slate-300 font-medium mb-1">Case Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Automated Wire Ledger Falsification Investigation"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value as IncidentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {incidentOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Risk Classification</label>
              <select
                value={riskLevel}
                onChange={e => setRiskLevel(e.target.value as RiskLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              >
                <option value="CRITICAL">CRITICAL (Immediate Threat)</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lead Investigator</label>
              <input
                type="text"
                value={investigator}
                onChange={e => setInvestigator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Server Farm Cluster 3"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Operational Unit</label>
            <input
              type="text"
              value={assignedUnit}
              onChange={e => setAssignedUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description / Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide context regarding the digital seizure, warrant scope, or system breach..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans resize-none"
            />
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
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold transition-colors shadow-lg shadow-cyan-950 cursor-pointer"
            >
              Initialize Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
