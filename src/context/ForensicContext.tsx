import React, { createContext, useContext, useState } from 'react';
import {
  CaseRecord,
  EvidenceRecord,
  AuditLogEntry,
  SecurityAlert,
  UserProfile,
  UserRole,
  CustodyEvent,
} from '../types/forensic';
import {
  INITIAL_CASES,
  INITIAL_EVIDENCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS,
  DEMO_USERS,
} from '../data/mockData';
import { generateTamperedDna } from '../utils/crypto';

export type NavigationTab =
  | 'dashboard'
  | 'cases'
  | 'vault'
  | 'passport'
  | 'dna'
  | 'monitor'
  | 'custody'
  | 'ai-intel'
  | 'analytics'
  | 'audit'
  | 'reports'
  | 'settings';

interface ForensicContextType {
  // Navigation & User
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;

  // Selected State
  selectedEvidenceId: string;
  setSelectedEvidenceId: (id: string) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;

  // Data
  cases: CaseRecord[];
  evidence: EvidenceRecord[];
  auditLogs: AuditLogEntry[];
  alerts: SecurityAlert[];

  // Actions
  addCase: (newCase: Omit<CaseRecord, 'id' | 'evidenceCount' | 'createdDate'>) => string;
  addEvidence: (newEvidence: Partial<EvidenceRecord>) => string;
  verifyIntegrity: (evidenceId: string) => void;
  simulateTampering: (evidenceId: string) => void;
  restoreOriginal: (evidenceId: string) => void;
  transferEvidence: (
    evidenceId: string,
    newHolder: string,
    newLocation: string,
    action: string,
    reason: string
  ) => void;
  acknowledgeAlert: (alertId: string) => void;
  
  // AI Modal
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

const ForensicContext = createContext<ForensicContextType | undefined>(undefined);

export const ForensicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('EV-2026-00047');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>(INITIAL_EVIDENCE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  const switchUserRole = (role: UserRole) => {
    const found = DEMO_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      addAuditLogEntry({
        user: found.name,
        role: found.role,
        action: 'Verify',
        status: 'Success',
        details: `Active role switched to ${role} (${found.badgeNumber}). Access permissions adjusted.`,
      });
    }
  };

  const login = (email: string, role: UserRole) => {
    const userMatch = DEMO_USERS.find(u => u.role === role) || {
      ...DEMO_USERS[0],
      email,
      role,
    };
    setCurrentUser(userMatch);
    setIsLoggedIn(true);
    setActiveTab('dashboard');

    addAuditLogEntry({
      user: userMatch.name,
      role: userMatch.role,
      action: 'Verify',
      status: 'Success',
      details: `User session authenticated via secure hardware key. Assigned clearance: ${userMatch.clearanceLevel}.`,
    });
  };

  const logout = () => {
    addAuditLogEntry({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Access Revoked',
      status: 'Success',
      details: `User ${currentUser.name} voluntarily signed out of forensic console. Session destroyed.`,
    });
    setIsLoggedIn(false);
  };

  const addAuditLogEntry = (data: Partial<AuditLogEntry>) => {
    const newEntry: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: data.user || currentUser.name,
      role: data.role || currentUser.role,
      action: data.action || 'Verify',
      evidenceId: data.evidenceId,
      ipAddress: data.ipAddress || '10.14.88.' + Math.floor(Math.random() * 80 + 10),
      sessionToken: `SES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-9`,
      status: data.status || 'Success',
      details: data.details || 'Operation recorded in immutable audit ledger.',
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addCase = (newCaseData: Omit<CaseRecord, 'id' | 'evidenceCount' | 'createdDate'>): string => {
    const id = `CASE-${1030 + cases.length + 1}`;
    const createdDate = new Date().toISOString().split('T')[0];
    const newCase: CaseRecord = {
      ...newCaseData,
      id,
      evidenceCount: 0,
      createdDate,
    };

    setCases(prev => [newCase, ...prev]);
    addAuditLogEntry({
      action: 'Case Created',
      status: 'Success',
      details: `Created new case record ${id}: "${newCase.name}" assigned to ${newCase.investigator}.`,
    });
    return id;
  };

  const addEvidence = (newEv: Partial<EvidenceRecord>): string => {
    const year = new Date().getFullYear();
    const id = `EV-${year}-${String(evidence.length + 100).padStart(5, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const fullEvidence: EvidenceRecord = {
      id,
      caseId: newEv.caseId || 'CASE-1024',
      caseName: cases.find(c => c.id === newEv.caseId)?.name || 'Digital Fraud & Wire Embezzlement',
      fileName: newEv.fileName || 'Seized_Digital_Artifact.raw',
      fileType: newEv.fileType || 'Document',
      fileSize: newEv.fileSize || '12.4 MB',
      fileSizeBytes: newEv.fileSizeBytes || 13000000,
      sha256: newEv.sha256 || 'C9A8E7D6C5B4A392817019283746591029384756102938475610293847561029',
      originalSha256: newEv.sha256 || 'C9A8E7D6C5B4A392817019283746591029384756102938475610293847561029',
      evidenceDna: newEv.evidenceDna || 'C9A8-E7D6-C5B4',
      originalDna: newEv.evidenceDna || 'C9A8-E7D6-C5B4',
      timestamp,
      uploadedBy: currentUser.name,
      currentHolder: currentUser.name,
      currentLocation: 'Evidence Vault Alpha - Intake Bay',
      status: 'VERIFIED',
      trustScore: 98,
      trustScoreBreakdown: {
        hashIntegrity: 40,
        chainOfCustody: 25,
        accessSecurity: 15,
        metadataConsistency: 18,
        total: 98,
      },
      riskLevel: 'LOW',
      isTampered: false,
      notes: newEv.notes || 'Evidence ingested and initial cryptographic hash generated.',
      custodyHistory: [
        {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          evidenceId: id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          person: currentUser.name,
          role: currentUser.role,
          action: 'Evidence Ingested & Hashed',
          location: 'Intake Bay Alpha',
          reason: 'Initial digital evidence ingestion',
          integrityStatus: 'VERIFIED',
          digitalSignature: `SIG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-VERIFIED`,
          badgeId: currentUser.badgeNumber,
        },
      ],
      metadata: {
        createdTimestamp: timestamp,
        modifiedTimestamp: timestamp,
        acquisitionTool: 'EVIDENTIA Hardware-Verified Intake Engine',
        invariantsChecked: 16,
      },
    };

    setEvidence(prev => [fullEvidence, ...prev]);

    // Update case evidence count
    setCases(prev =>
      prev.map(c => (c.id === fullEvidence.caseId ? { ...c, evidenceCount: c.evidenceCount + 1 } : c))
    );

    addAuditLogEntry({
      evidenceId: id,
      action: 'Upload',
      status: 'Success',
      details: `New evidence artifact ${id} (${fullEvidence.fileName}) registered. SHA-256 seal computed.`,
    });

    return id;
  };

  const verifyIntegrity = (evidenceId: string) => {
    setEvidence(prev =>
      prev.map(ev => {
        if (ev.id !== evidenceId) return ev;
        const matches = ev.sha256 === ev.originalSha256;
        return {
          ...ev,
          status: matches ? 'VERIFIED' : 'HASH_MISMATCH',
          trustScore: matches ? 95 : 38,
          trustScoreBreakdown: matches
            ? { hashIntegrity: 40, chainOfCustody: 25, accessSecurity: 15, metadataConsistency: 15, total: 95 }
            : { hashIntegrity: 0, chainOfCustody: 18, accessSecurity: 8, metadataConsistency: 12, total: 38 },
        };
      })
    );

    addAuditLogEntry({
      evidenceId,
      action: 'Verify',
      status: 'Success',
      details: `Manual integrity scan performed on ${evidenceId}. Cryptographic parity checked.`,
    });
  };

  const simulateTampering = (evidenceId: string) => {
    setEvidence(prev =>
      prev.map(ev => {
        if (ev.id !== evidenceId) return ev;

        // Generate altered hash by deterministically flipping bytes
        const alteredHash = 'B7C299D144E8901235481749AC78162547182904716253481928374659102938';
        const alteredDna = generateTamperedDna(ev.originalDna);

        return {
          ...ev,
          sha256: alteredHash,
          evidenceDna: alteredDna,
          status: 'HASH_MISMATCH',
          isTampered: true,
          trustScore: 34,
          trustScoreBreakdown: {
            hashIntegrity: 0,
            chainOfCustody: 16,
            accessSecurity: 8,
            metadataConsistency: 10,
            total: 34,
          },
          riskLevel: 'CRITICAL',
          notes: 'SIMULATED TAMPERING: Bitstream modification injected. Cryptographic seal broken.',
        };
      })
    );

    // Add security alert
    const newAlert: SecurityAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      evidenceId,
      type: 'CRITICAL_MISMATCH',
      title: `🔴 ${evidenceId} – Simulated Tampering Triggered`,
      description: `Cryptographic SHA-256 diverged. Baseline vs Active mismatch. Immediate quarantine recommended.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity: 'red',
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev]);

    addAuditLogEntry({
      evidenceId,
      action: 'Tamper Alert',
      status: 'Alert',
      details: `Simulated file tampering injected into ${evidenceId}. Active hash diverged from original intake baseline.`,
    });
  };

  const restoreOriginal = (evidenceId: string) => {
    setEvidence(prev =>
      prev.map(ev => {
        if (ev.id !== evidenceId) return ev;
        return {
          ...ev,
          sha256: ev.originalSha256,
          evidenceDna: ev.originalDna,
          status: 'VERIFIED',
          isTampered: false,
          trustScore: 96,
          trustScoreBreakdown: {
            hashIntegrity: 40,
            chainOfCustody: 25,
            accessSecurity: 15,
            metadataConsistency: 16,
            total: 96,
          },
          riskLevel: 'LOW',
          notes: 'Evidence bitstream restored from air-gapped golden master backup. Integrity certified.',
        };
      })
    );

    addAuditLogEntry({
      evidenceId,
      action: 'Verify',
      status: 'Success',
      details: `Air-gapped bitstream golden master restored for ${evidenceId}. SHA-256 integrity re-certified.`,
    });
  };

  const transferEvidence = (
    evidenceId: string,
    newHolder: string,
    newLocation: string,
    action: string,
    reason: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: CustodyEvent = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      evidenceId,
      timestamp,
      person: newHolder,
      role: currentUser.role,
      action,
      location: newLocation,
      reason,
      integrityStatus: 'VERIFIED',
      digitalSignature: `SIG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-DUAL-SIGNED`,
      badgeId: currentUser.badgeNumber,
    };

    setEvidence(prev =>
      prev.map(ev => {
        if (ev.id !== evidenceId) return ev;
        return {
          ...ev,
          currentHolder: newHolder,
          currentLocation: newLocation,
          custodyHistory: [...ev.custodyHistory, newEvent],
        };
      })
    );

    addAuditLogEntry({
      evidenceId,
      action: 'Transfer',
      status: 'Success',
      details: `Custody transferred to ${newHolder} at ${newLocation}. Dual cryptographic tokens recorded.`,
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, acknowledged: true } : a)));
  };

  return (
    <ForensicContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        switchUserRole,
        isLoggedIn,
        login,
        logout,
        selectedEvidenceId,
        setSelectedEvidenceId,
        selectedCaseId,
        setSelectedCaseId,
        cases,
        evidence,
        auditLogs,
        alerts,
        addCase,
        addEvidence,
        verifyIntegrity,
        simulateTampering,
        restoreOriginal,
        transferEvidence,
        acknowledgeAlert,
        isAiModalOpen,
        setIsAiModalOpen,
      }}
    >
      {children}
    </ForensicContext.Provider>
  );
};

export const useForensic = () => {
  const context = useContext(ForensicContext);
  if (!context) {
    throw new Error('useForensic must be used within a ForensicProvider');
  }
  return context;
};
