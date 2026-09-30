const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

export const api = {
  // ---- Original Detection API ----
  chat: (prompt, sessionId, history = []) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, session_id: sessionId, history }),
    }),

  directChat: (prompt, sessionId, history = []) =>
    request('/chat/direct', {
      method: 'POST',
      body: JSON.stringify({ prompt, session_id: sessionId, history }),
    }),

  detect: (prompt, sessionId = null, source = 'user_message') =>
    request('/detect', {
      method: 'POST',
      body: JSON.stringify({ prompt, session_id: sessionId, source }),
    }),

  simulate: (sessionId, turns) =>
    request('/simulate', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, turns }),
    }),

  getLogs: (tier = null, limit = 200) => {
    const params = new URLSearchParams({ limit })
    if (tier) params.set('tier', tier)
    return request(`/logs?${params.toString()}`)
  },

  clearLogs: () => request('/logs', { method: 'DELETE' }),

  getStatistics: () => request('/statistics'),

  runStressTest: () => request('/stress-test'),

  // ---- Governance API (Prompt Aegis 2.0) ----

  // Agents (FR-01)
  listAgents: () => request('/agents'),
  createAgent: (name, description = '', role = 'default') =>
    request('/agents', { method: 'POST', body: JSON.stringify({ name, description, role }) }),
  deleteAgent: (agentId) => request(`/agents/${agentId}`, { method: 'DELETE' }),

  // Tools (FR-02)
  listTools: () => request('/tools'),
  createTool: (name, category, risk_level, requires_approval = false, description = '') =>
    request('/tools', { method: 'POST', body: JSON.stringify({ name, category, risk_level, requires_approval, description }) }),
  deleteTool: (toolId) => request(`/tools/${toolId}`, { method: 'DELETE' }),

  // Permissions (FR-03)
  getPermissions: (agentId) => request(`/permissions/${agentId}`),
  setPermission: (agentId, toolId, allowed) =>
    request('/permissions', { method: 'POST', body: JSON.stringify({ agent_id: agentId, tool_id: toolId, allowed }) }),

  // Policies (FR-04)
  listPolicies: (enabledOnly = false) => {
    const params = new URLSearchParams({ enabled_only: enabledOnly })
    return request(`/policies?${params.toString()}`)
  },
  createPolicy: (body) => request('/policies', { method: 'POST', body: JSON.stringify(body) }),
  togglePolicy: (policyId, enabled) =>
    request(`/policies/${policyId}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
  deletePolicy: (policyId) => request(`/policies/${policyId}`, { method: 'DELETE' }),

  // Tool Interception (FR-05/06/07)
  intercept: (agentId, toolName, args = {}, config = 'full') =>
    request('/intercept', {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId, tool_name: toolName, arguments: args, configuration: config }),
    }),

  // Audit Log (FR-08)
  getToolCalls: (agentId = null, decision = null, limit = 200) => {
    const params = new URLSearchParams({ limit })
    if (agentId) params.set('agent_id', agentId)
    if (decision) params.set('decision', decision)
    return request(`/tool-calls?${params.toString()}`)
  },

  // Governance Stats
  getGovernanceStats: () => request('/governance/stats'),

  // Seed defaults
  seedDefaults: () => request('/governance/seed', { method: 'POST' }),

  // Experiments (FR-10/11/12/13)
  runExperiment: (configuration, description = '', categories = [], maxScenarios = 0) =>
    request('/experiments/run', {
      method: 'POST',
      body: JSON.stringify({
        configuration,
        description,
        scenario_categories: categories,
        max_scenarios: maxScenarios,
      }),
    }),
  listExperiments: () => request('/experiments'),
  getExperiment: (runId) => request(`/experiments/${runId}`),
  exportExperiment: (runId) => `${BASE_URL}/experiments/${runId}/export`,
}

