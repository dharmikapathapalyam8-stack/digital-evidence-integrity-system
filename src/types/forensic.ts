export type UserRole = 'Administrator' | 'Investigator' | 'Forensic Officer' | 'Auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  clearanceLevel: string;
  avatarUrl: string;
}

export type EvidenceStatus = 'VERIFIED' | 'HASH_MISMATCH' | 'METADATA_WARNING' | 'UNDER_REVIEW';

export type IncidentType =
  | 'Digital Fraud'
  | 'Ransomware Extortion'
  | 'Cyber Espionage'
  | 'Insider Threat'
  | 'Intellectual Property Theft'
  | 'Cloud Infrastructure Breach'
  | 'Audio/Video Tampering'
  | 'Crypto Asset Theft';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface CaseRecord {
  id: string;
  name: string;
  incidentType: IncidentType;
  description: string;
  investigator: string;
  evidenceCount: number;
  riskLevel: RiskLevel;
  status: 'Active' | 'Under Review' | 'Archived' | 'Escalated';
  createdDate: string;
  location: string;
  assignedUnit: string;
}

export interface CustodyEvent {
  id: string;
  evidenceId: string;
  timestamp: string;
  person: string;
  role: string;
  action: string;
  location: string;
  reason: string;
  integrityStatus: EvidenceStatus;
  digitalSignature: string;
  badgeId: string;
}

export interface TrustScoreBreakdown {
  hashIntegrity: number; // max 40
  chainOfCustody: number; // max 25
  accessSecurity: number; // max 15
  metadataConsistency: number; // max 20
  total: number; // sum out of 100
}

export interface EvidenceRecord {
  id: string;
  caseId: string;
  caseName: string;
  fileName: string;
  fileType: 'Video' | 'Image' | 'Audio' | 'Document' | 'Disk Image' | 'Database Dump' | 'Log File';
  fileSize: string;
  fileSizeBytes: number;
  sha256: string;
  originalSha256: string;
  evidenceDna: string;
  originalDna: string;
  timestamp: string;
  uploadedBy: string;
  currentHolder: string;
  currentLocation: string;
  status: EvidenceStatus;
  trustScore: number;
  trustScoreBreakdown: TrustScoreBreakdown;
  riskLevel: RiskLevel;
  isTampered: boolean;
  notes?: string;
  custodyHistory: CustodyEvent[];
  metadata: {
    cameraModel?: string;
    operatingSystem?: string;
    fileSystem?: string;
    createdTimestamp: string;
    modifiedTimestamp: string;
    acquisitionTool: string;
    invariantsChecked: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: 'Upload' | 'Transfer' | 'Verify' | 'Download' | 'Tamper Alert' | 'Case Created' | 'Report Generated' | 'Access Revoked';
  evidenceId?: string;
  ipAddress: string;
  sessionToken: string;
  status: 'Success' | 'Alert' | 'Denied' | 'Quarantined';
  details: string;
}

export interface SecurityAlert {
  id: string;
  evidenceId: string;
  type: 'CRITICAL_MISMATCH' | 'METADATA_DISCREPANCY' | 'ANOMALOUS_ACCESS' | 'VERIFICATION_PASS';
  title: string;
  description: string;
  timestamp: string;
  severity: 'red' | 'yellow' | 'green';
  acknowledged: boolean;
}
