const API_BASE_URL =
  typeof window !== 'undefined' && window.__API_URL__
    ? window.__API_URL__
    : typeof process !== 'undefined' && process && process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP error ${res.status}: ${res.statusText}` };
      }
      const error = new Error(errorData.detail || errorData?.error?.message || 'Request failed');
      error.status = res.status;
      error.data = errorData;
      throw error;
    }

    // If expecting blob (for reports)
    if (options.responseType === 'blob') {
      return await res.blob();
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const connErr = new Error('Cannot connect to AI Sentinel backend service (http://127.0.0.1:8000). Ensure the backend is running.');
      connErr.status = 0;
      throw connErr;
    }
    throw error;
  }
}

export const systemApi = {
  getHealth: () => request('/api/health'),
  getReadiness: () => request('/api/ready'),
  testDb: (note) => request('/api/test-db', {
    method: 'POST',
    body: JSON.stringify({ note: note || 'Diagnostic check from frontend' }),
  }),
};

export const modelsApi = {
  getModels: () => request('/api/models'),
  getModel: (id) => request(`/api/models/${id}`),
  createModel: (data) => request('/api/models', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateModel: (id, data) => request(`/api/models/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteModel: (id) => request(`/api/models/${id}`, {
    method: 'DELETE',
  }),
};

export const scansApi = {
  getScans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/scans${query ? `?${query}` : ''}`);
  },
  getScan: (id) => request(`/api/scans/${id}`),
  createScan: (data) => request('/api/scans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  cancelScan: (id) => request(`/api/scans/${id}/cancel`, {
    method: 'POST',
  }),
};

export const findingsApi = {
  getFindings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/findings${query ? `?${query}` : ''}`);
  },
  getFinding: (id) => request(`/api/findings/${id}`),
  updateFinding: (id, data) => request(`/api/findings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

export const complianceApi = {
  getMappings: () => request('/api/compliance'),
  getFunctionDetails: (func) => request(`/api/compliance/${func}`),
};

export const reportsApi = {
  getReports: () => request('/api/reports'),
  generateReport: (data) => request('/api/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  downloadReport: (id, format = 'pdf') => request(`/api/reports/${id}/download?format=${format}`, {
    responseType: 'blob',
  }),
};

export const dashboardApi = {
  getStats: () => request('/api/dashboard/stats'),
};
