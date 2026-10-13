import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ScanLine,
  CheckCircle2,
  Cpu,
  Shield,
  Scale,
  EyeOff,
  Bot,
  Sliders,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Play,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SeverityBadge } from '../components/common/Badge';
import { modelsApi, scansApi } from '../services/api';

export const NewScanWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedModelId = searchParams.get('model');

  const [step, setStep] = useState(1);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Scan Configuration State
  const [scanConfig, setScanConfig] = useState({
    name: `Scan-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 900 + 100)}`,
    model_id: preselectedModelId || '',
    intensity: 'comprehensive', // quick, comprehensive, deep
    modules: {
      robustness: true,
      fairness: true,
      privacy: true,
      llm_security: false,
    },
    parameters: {
      epsilon: 0.1,
      attack_type: 'fgsm_perturbation',
      sensitive_attribute: 'gender',
      privacy_sample_rate: 0.2,
      llm_injection_depth: 10,
    },
  });

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoadingModels(true);
        const res = await modelsApi.getModels();
        const list = Array.isArray(res) ? res : [];
        setModels(list);
        if (list.length > 0 && !scanConfig.model_id) {
          setScanConfig((prev) => ({ ...prev, model_id: list[0].id }));
        }
      } catch (err) {
        console.error('Failed to load models:', err);
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, [scanConfig.model_id]);

  const selectedModel = models.find((m) => m.id === scanConfig.model_id);

  const toggleModule = (mod) => {
    setScanConfig((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [mod]: !prev.modules[mod],
      },
    }));
  };

  const handleLaunchScan = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Selected module keys
      const activeModules = Object.keys(scanConfig.modules).filter(
        (k) => scanConfig.modules[k]
      );

      if (activeModules.length === 0) {
        setError('Please select at least one assessment module to execute.');
        setSubmitting(false);
        return;
      }

      const payload = {
        name: scanConfig.name,
        model_id: scanConfig.model_id,
        intensity: scanConfig.intensity,
        modules: activeModules,
        parameters: scanConfig.parameters,
      };

      const result = await scansApi.createScan(payload);
      // Navigate to scan history or scan details
      navigate(`/scans`);
    } catch (err) {
      setError(err.message || 'Failed to submit security scan.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-[#39FF88]" />
          NEW SECURITY SCAN WIZARD
        </h2>
        <p className="text-xs text-[#9CB4A3] mt-0.5">
          Configure and initiate an automated vulnerability, fairness, and safety assessment.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        {[
          { num: 1, label: 'Select Model' },
          { num: 2, label: 'Assessment Modules' },
          { num: 3, label: 'Parameters' },
          { num: 4, label: 'Review & Execute' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded border transition-all ${
              step === s.num
                ? 'bg-[#12271B] border-[#39FF88] text-[#39FF88] shadow-neon-glow'
                : step > s.num
                ? 'bg-[#0E1D15] border-[#20392A] text-[#19C96B]'
                : 'bg-[#08130E] border-[#20392A] text-[#729B81]'
            }`}
          >
            <span className="font-bold mr-1.5">0{s.num}.</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded bg-[#FF4D5A]/15 border border-[#FF4D5A]/30 text-xs font-mono text-[#FF4D5A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Model */}
      {step === 1 && (
        <Card title="STEP 1: SELECT REGISTERED MODEL" subtitle="Target model for risk and security evaluation">
          {loadingModels ? (
            <div className="p-8 text-center text-xs font-mono text-[#729B81] animate-pulse">
              Loading models from MongoDB...
            </div>
          ) : models.length === 0 ? (
            <div className="p-8 text-center">
              <Cpu className="w-8 h-8 text-[#729B81] mx-auto mb-2" />
              <p className="text-xs font-mono text-[#E8F5EC] mb-3">No registered models found in MongoDB.</p>
              <Button onClick={() => navigate('/models')} size="sm" variant="primary">
                Register a Model First
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {models.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setScanConfig((prev) => ({ ...prev, model_id: m.id }))}
                    className={`p-3.5 rounded border cursor-pointer transition-all ${
                      scanConfig.model_id === m.id
                        ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                        : 'bg-[#08130E] border-[#20392A] hover:border-[#729B81]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-[#E8F5EC]">{m.name}</span>
                      <SeverityBadge severity={m.risk_category} />
                    </div>
                    <p className="text-[11px] text-[#9CB4A3] mt-1 line-clamp-1">{m.description}</p>
                    <div className="mt-2 text-[10px] font-mono text-[#729B81] flex gap-3">
                      <span>Type: {m.model_type}</span>
                      <span>v{m.version}</span>
                      <span>{m.environment}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!scanConfig.model_id}
                  variant="primary"
                  size="sm"
                  icon={ChevronRight}
                >
                  Next: Select Modules
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Assessment Modules */}
      {step === 2 && (
        <Card title="STEP 2: ASSESSMENT MODULES" subtitle="Select security and governance probes to execute">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adversarial Robustness */}
            <div
              onClick={() => toggleModule('robustness')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                scanConfig.modules.robustness
                  ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                  : 'bg-[#08130E] border-[#20392A] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#39FF88]" />
                  <span className="text-xs font-bold font-mono text-[#E8F5EC]">Adversarial Robustness</span>
                </div>
                <input
                  type="checkbox"
                  checked={scanConfig.modules.robustness}
                  readOnly
                  className="accent-[#39FF88]"
                />
              </div>
              <p className="text-[11px] text-[#9CB4A3]">
                Evaluates perturbation resilience under simulated adversarial noise (FGSM, boundary attacks).
              </p>
            </div>

            {/* Fairness & Bias */}
            <div
              onClick={() => toggleModule('fairness')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                scanConfig.modules.fairness
                  ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                  : 'bg-[#08130E] border-[#20392A] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#39FF88]" />
                  <span className="text-xs font-bold font-mono text-[#E8F5EC]">Fairness & Bias Auditing</span>
                </div>
                <input
                  type="checkbox"
                  checked={scanConfig.modules.fairness}
                  readOnly
                  className="accent-[#39FF88]"
                />
              </div>
              <p className="text-[11px] text-[#9CB4A3]">
                Measures demographic parity difference and equalized odds across protected attributes.
              </p>
            </div>

            {/* Privacy Risk */}
            <div
              onClick={() => toggleModule('privacy')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                scanConfig.modules.privacy
                  ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                  : 'bg-[#08130E] border-[#20392A] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-[#39FF88]" />
                  <span className="text-xs font-bold font-mono text-[#E8F5EC]">Privacy Risk & Leakage</span>
                </div>
                <input
                  type="checkbox"
                  checked={scanConfig.modules.privacy}
                  readOnly
                  className="accent-[#39FF88]"
                />
              </div>
              <p className="text-[11px] text-[#9CB4A3]">
                Detects PII exposure, training data memorization indicators, and unsafe logging.
              </p>
            </div>

            {/* LLM Security */}
            <div
              onClick={() => toggleModule('llm_security')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                scanConfig.modules.llm_security
                  ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                  : 'bg-[#08130E] border-[#20392A] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#39FF88]" />
                  <span className="text-xs font-bold font-mono text-[#E8F5EC]">LLM Security & Probes</span>
                </div>
                <input
                  type="checkbox"
                  checked={scanConfig.modules.llm_security}
                  readOnly
                  className="accent-[#39FF88]"
                />
              </div>
              <p className="text-[11px] text-[#9CB4A3]">
                Direct prompt injection probes, system prompt extraction, and refusal robustness tests.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setStep(1)} variant="outline" size="sm" icon={ChevronLeft}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} variant="primary" size="sm" icon={ChevronRight}>
              Next: Parameters
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Scan Configuration Parameters */}
      {step === 3 && (
        <Card title="STEP 3: SCAN INTENSITY & PARAMETERS" subtitle="Tailor probe depth and attack thresholds">
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#729B81] mb-1">Scan Identifier Name</label>
              <input
                type="text"
                value={scanConfig.name}
                onChange={(e) => setScanConfig({ ...scanConfig, name: e.target.value })}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#729B81] mb-1">Scan Intensity Profile</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'quick', label: 'Quick Scan', desc: 'Standard baseline probe pass' },
                  { id: 'comprehensive', label: 'Comprehensive', desc: 'Full perturbation & fairness test' },
                  { id: 'deep', label: 'Deep Audit', desc: 'Multi-iteration probe analysis' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setScanConfig({ ...scanConfig, intensity: item.id })}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      scanConfig.intensity === item.id
                        ? 'bg-[#12271B] border-[#39FF88] text-[#39FF88]'
                        : 'bg-[#08130E] border-[#20392A] text-[#9CB4A3]'
                    }`}
                  >
                    <span className="font-bold block">{item.label}</span>
                    <span className="text-[10px] text-[#729B81] mt-0.5 block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#729B81] mb-1">Adversarial Epsilon Budget (&epsilon;)</label>
                <input
                  type="number"
                  step="0.02"
                  min="0.01"
                  max="0.5"
                  value={scanConfig.parameters.epsilon}
                  onChange={(e) =>
                    setScanConfig({
                      ...scanConfig,
                      parameters: { ...scanConfig.parameters, epsilon: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#729B81] mb-1">Sensitive Attribute for Fairness</label>
                <select
                  value={scanConfig.parameters.sensitive_attribute}
                  onChange={(e) =>
                    setScanConfig({
                      ...scanConfig,
                      parameters: { ...scanConfig.parameters, sensitive_attribute: e.target.value },
                    })
                  }
                  className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
                >
                  <option value="gender">Gender</option>
                  <option value="age">Age Group</option>
                  <option value="ethnicity">Ethnicity</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setStep(2)} variant="outline" size="sm" icon={ChevronLeft}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} variant="primary" size="sm" icon={ChevronRight}>
              Next: Review
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review and Submit */}
      {step === 4 && (
        <Card title="STEP 4: REVIEW & EXECUTE SCAN" subtitle="Verify parameters before launching to backend engine">
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-[#08130E] rounded border border-[#20392A] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#729B81]">Scan Name:</span>
                <span className="text-[#39FF88] font-bold">{scanConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#729B81]">Target Model:</span>
                <span className="text-[#E8F5EC]">{selectedModel?.name || scanConfig.model_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#729B81]">Intensity:</span>
                <span className="text-[#E8F5EC] uppercase">{scanConfig.intensity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#729B81]">Active Probes:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.keys(scanConfig.modules)
                    .filter((m) => scanConfig.modules[m])
                    .map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded bg-[#12271B] border border-[#39FF88]/40 text-[#39FF88] text-[10px]">
                        {m.toUpperCase()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setStep(3)} variant="outline" size="sm" icon={ChevronLeft}>
              Back
            </Button>
            <Button
              onClick={handleLaunchScan}
              variant="primary"
              size="md"
              loading={submitting}
              icon={Play}
              className="shadow-neon-glow"
            >
              Submit & Execute Scan
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
