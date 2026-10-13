import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SystemStatusProvider } from './context/SystemStatusContext';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { ModelInventory } from './pages/ModelInventory';
import { NewScanWizard } from './pages/NewScanWizard';
import { ScanHistory } from './pages/ScanHistory';
import { RiskFindings } from './pages/RiskFindings';
import { FairnessBias } from './pages/FairnessBias';
import { PrivacyAnalysis } from './pages/PrivacyAnalysis';
import { LLMSecurity } from './pages/LLMSecurity';
import { ComplianceCenter } from './pages/ComplianceCenter';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App = () => {
  return (
    <SystemStatusProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="models" element={<ModelInventory />} />
            <Route path="scans/new" element={<NewScanWizard />} />
            <Route path="scans" element={<ScanHistory />} />
            <Route path="findings" element={<RiskFindings />} />
            <Route path="fairness" element={<FairnessBias />} />
            <Route path="privacy" element={<PrivacyAnalysis />} />
            <Route path="llm-security" element={<LLMSecurity />} />
            <Route path="compliance" element={<ComplianceCenter />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SystemStatusProvider>
  );
};

export default App;
