/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ForensicProvider, useForensic } from './context/ForensicContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { CasesView } from './components/views/CasesView';
import { VaultView } from './components/views/VaultView';
import { PassportView } from './components/views/PassportView';
import { DnaView } from './components/views/DnaView';
import { IntegrityMonitorView } from './components/views/IntegrityMonitorView';
import { ChainOfCustodyView } from './components/views/ChainOfCustodyView';
import { AiIntelligenceView } from './components/views/AiIntelligenceView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { CreateCaseModal } from './components/modals/CreateCaseModal';
import { UploadEvidenceModal } from './components/modals/UploadEvidenceModal';
import { TransferEvidenceModal } from './components/modals/TransferEvidenceModal';
import { TamperSimulationModal } from './components/modals/TamperSimulationModal';
import { ReportPreviewModal } from './components/modals/ReportPreviewModal';
import { AiAssistantModal } from './components/ai/AiAssistantModal';

const AppContent: React.FC = () => {
  const {
    isLoggedIn,
    activeTab,
    selectedEvidenceId,
    evidence,
    cases,
  } = useForensic();

  // Modals state
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPreselectedCase, setUploadPreselectedCase] = useState<string | undefined>();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isTamperModalOpen, setIsTamperModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const activeEvidence =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];
  const activeCase =
    cases.find(c => c.id === activeEvidence.caseId) || cases[0];

  const handleOpenUpload = (caseId?: string) => {
    setUploadPreselectedCase(caseId);
    setIsUploadOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenCreateCase={() => setIsCreateCaseOpen(true)}
            onOpenUpload={() => handleOpenUpload()}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
      case 'cases':
        return (
          <CasesView
            onOpenCreateCase={() => setIsCreateCaseOpen(true)}
            onOpenUpload={handleOpenUpload}
          />
        );
      case 'vault':
        return (
          <VaultView
            onOpenUpload={handleOpenUpload}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
      case 'passport':
        return (
          <PassportView
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
      case 'dna':
        return (
          <DnaView
            onOpenTamperModal={() => setIsTamperModalOpen(true)}
          />
        );
      case 'monitor':
        return (
          <IntegrityMonitorView
            onOpenTamperModal={() => setIsTamperModalOpen(true)}
          />
        );
      case 'custody':
        return (
          <ChainOfCustodyView
            onOpenTransferModal={() => setIsTransferOpen(true)}
          />
        );
      case 'ai-intel':
        return (
          <AiIntelligenceView
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'audit':
        return <AuditLogsView />;
      case 'reports':
        return (
          <ReportsView
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onOpenCreateCase={() => setIsCreateCaseOpen(true)}
            onOpenUpload={() => handleOpenUpload()}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B12] text-slate-100">
      {/* Permanent Left Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
      />

      <UploadEvidenceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        preselectedCaseId={uploadPreselectedCase}
      />

      <TransferEvidenceModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        evidence={activeEvidence}
      />

      <TamperSimulationModal
        isOpen={isTamperModalOpen}
        onClose={() => setIsTamperModalOpen(false)}
        evidence={activeEvidence}
      />

      <ReportPreviewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        evidence={activeEvidence}
        caseRecord={activeCase}
      />

      <AiAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <ForensicProvider>
      <AppContent />
    </ForensicProvider>
  );
}
