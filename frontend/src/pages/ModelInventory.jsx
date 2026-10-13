import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { SeverityBadge, TechBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { modelsApi } from '../services/api';

export const ModelInventory = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    model_type: 'Traditional ML',
    version: '1.0.0',
    framework: 'scikit-learn',
    description: '',
    owner: 'Security & ML Team',
    environment: 'Staging',
    intended_use: 'Risk prediction and classification',
    risk_category: 'Medium',
    source_type: 'Local Weights File',
    api_endpoint: '',
  });

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await modelsApi.getModels();
      setModels(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load models:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateModel = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await modelsApi.createModel(formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        model_type: 'Traditional ML',
        version: '1.0.0',
        framework: 'scikit-learn',
        description: '',
        owner: 'Security & ML Team',
        environment: 'Staging',
        intended_use: 'Risk prediction and classification',
        risk_category: 'Medium',
        source_type: 'Local Weights File',
        api_endpoint: '',
      });
      await loadModels();
    } catch (err) {
      setError(err.message || 'Failed to register model');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModel = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove model "${name}" from the inventory?`)) return;
    try {
      await modelsApi.deleteModel(id);
      await loadModels();
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.framework?.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || m.model_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#39FF88]" />
            AI MODEL INVENTORY
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Centralized registry of governed AI models, risk tiers, and architecture metadata.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          variant="primary"
          className="shadow-neon-glow"
        >
          Register Model
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#0E1D15] p-3 rounded border border-[#20392A]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#729B81] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model name, framework, or use case..."
            className="w-full bg-[#08130E] border border-[#20392A] rounded pl-9 pr-4 py-1.5 text-xs text-[#E8F5EC] placeholder-[#729B81] focus:outline-none focus:border-[#39FF88] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#729B81]">Type:</span>
          {['ALL', 'Traditional ML', 'Deep Learning', 'LLM'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filterType === type
                  ? 'bg-[#12271B] text-[#39FF88] border-[#39FF88]/40 shadow-neon-glow'
                  : 'bg-[#08130E] text-[#9CB4A3] border-[#20392A] hover:border-[#729B81]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded bg-[#FF4D5A]/15 border border-[#FF4D5A]/30 text-xs font-mono text-[#FF4D5A] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Models Grid/List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#729B81] animate-pulse">
          Connecting to MongoDB & fetching model registry...
        </div>
      ) : filteredModels.length === 0 ? (
        <EmptyState
          title="No Models Registered in Database"
          description="Register your machine learning or LLM models to begin running automated adversarial, fairness, and security assessments."
          actionLabel="Register First Model"
          onAction={() => setIsModalOpen(true)}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className="flex flex-col justify-between hover:border-[#39FF88]/50 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-[#E8F5EC] font-mono truncate">
                    {model.name}
                  </h3>
                  <SeverityBadge severity={model.risk_category} />
                </div>
                <p className="text-xs text-[#9CB4A3] line-clamp-2 mb-4">
                  {model.description || 'No description provided.'}
                </p>

                <div className="space-y-1.5 text-xs font-mono border-t border-[#20392A] pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#729B81]">Type:</span>
                    <span className="text-[#E8F5EC]">{model.model_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#729B81]">Framework:</span>
                    <TechBadge label={model.framework} variant="neon" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#729B81]">Version:</span>
                    <span className="text-[#E8F5EC]">v{model.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#729B81]">Environment:</span>
                    <span className="text-[#39FF88]">{model.environment}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#20392A] flex items-center justify-between">
                <Button
                  onClick={() => navigate(`/scans/new?model=${model.id}`)}
                  variant="primary"
                  size="sm"
                  className="text-xs"
                >
                  Scan Model
                </Button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteModel(model.id, model.name)}
                    className="p-1.5 text-[#9CB4A3] hover:text-[#FF4D5A] rounded hover:bg-[#12271B] transition-colors"
                    title="Delete model"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Model Registration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="REGISTER AI MODEL"
        subtitle="Catalog model metadata for automated governance and vulnerability scanning"
      >
        <form onSubmit={handleCreateModel} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#729B81] mb-1">Model Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. CreditRisk-Scorer-v1"
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#729B81] mb-1">Model Architecture *</label>
              <select
                name="model_type"
                value={formData.model_type}
                onChange={handleInputChange}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              >
                <option value="Traditional ML">Traditional ML (sklearn, XGBoost)</option>
                <option value="Deep Learning">Deep Learning (PyTorch, TF)</option>
                <option value="LLM">Large Language Model (API/Local)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#729B81] mb-1">Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#729B81] mb-1">Framework</label>
              <input
                type="text"
                name="framework"
                value={formData.framework}
                onChange={handleInputChange}
                placeholder="scikit-learn, PyTorch, OpenAI"
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#729B81] mb-1">Risk Tier</label>
              <select
                name="risk_category"
                value={formData.risk_category}
                onChange={handleInputChange}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical (High Impact)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#729B81] mb-1">Description & Business Purpose</label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Primary function, target user population, and business decision scope..."
              className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#729B81] mb-1">Model Owner / Team</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#729B81] mb-1">Target Environment</label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleInputChange}
                className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
              >
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#20392A] flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Save to Database
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
