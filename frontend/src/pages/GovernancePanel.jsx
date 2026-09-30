import { useEffect, useState } from 'react'
import { PageHeader } from './Playground'
import { api } from '../api'

const TABS = ['Agents', 'Tools', 'Permissions', 'Policies']

// ─── Helpers ────────────────────────────────────────────────────────────────

function Spinner() {
  return <span style={styles.spinner}>⟳</span>
}

function ErrorMsg({ msg }) {
  if (!msg) return null
  return <div style={styles.errorMsg}>{msg}</div>
}

function Badge({ text, color }) {
  const map = {
    green: { background: 'var(--tier-safe-bg, #0f2e1f)', color: 'var(--tier-safe, #4ade80)' },
    yellow: { background: 'var(--tier-medium-bg, #2c2000)', color: 'var(--tier-medium, #facc15)' },
    red: { background: 'var(--tier-high-bg, #2e0f0f)', color: 'var(--tier-high, #f87171)' },
    blue: { background: 'var(--signal-dim)', color: 'var(--signal)' },
    gray: { background: 'var(--surface-raised)', color: 'var(--text-muted)' },
  }
  return (
    <span style={{ ...styles.badge, ...(map[color] ?? map.gray) }}>{text}</span>
  )
}

function riskColor(level) {
  if (!level) return 'gray'
  const l = level.toLowerCase()
  if (l === 'high') return 'red'
  if (l === 'medium') return 'yellow'
  if (l === 'low') return 'green'
  return 'gray'
}

// ─── Agents Tab ─────────────────────────────────────────────────────────────

function AgentsTab() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', role: 'default' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.listAgents()
      setAgents(res.agents ?? res ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await api.createAgent(form.name.trim(), form.description.trim(), form.role)
      setForm({ name: '', description: '', role: 'default' })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return
    setError(null)
    try {
      await api.deleteAgent(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <ErrorMsg msg={error} />

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Agent ID', 'Name', 'Role', 'Description', ''].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={styles.tdCenter}><Spinner /> Loading…</td></tr>
            ) : agents.length === 0 ? (
              <tr><td colSpan={5} style={styles.tdCenter}>No agents registered. Seed defaults or add one below.</td></tr>
            ) : agents.map((a) => (
              <tr key={a.agent_id} style={styles.tr}>
                <td style={{ ...styles.td, ...styles.mono }}>{a.agent_id}</td>
                <td style={styles.td}>{a.name}</td>
                <td style={styles.td}><Badge text={a.role} color="blue" /></td>
                <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: 12.5 }}>{a.description || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(a.agent_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add form */}
      <div style={styles.formBox}>
        <div style={styles.formTitle}>Add Agent</div>
        <form onSubmit={handleAdd} style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            style={styles.select}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {['support', 'admin', 'default', 'baseline'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button type="submit" style={styles.addBtn} disabled={saving}>
            {saving ? 'Adding…' : 'Add Agent'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Tools Tab ───────────────────────────────────────────────────────────────

function ToolsTab() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '', category: '', risk_level: 'low', requires_approval: false, description: '',
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.listTools()
      setTools(res.tools ?? res ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.category.trim()) return
    setSaving(true)
    setError(null)
    try {
      await api.createTool(
        form.name.trim(), form.category.trim(), form.risk_level,
        form.requires_approval, form.description.trim()
      )
      setForm({ name: '', category: '', risk_level: 'low', requires_approval: false, description: '' })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tool?')) return
    setError(null)
    try {
      await api.deleteTool(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <ErrorMsg msg={error} />

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Category', 'Risk Level', 'Approval Required', ''].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={styles.tdCenter}><Spinner /> Loading…</td></tr>
            ) : tools.length === 0 ? (
              <tr><td colSpan={5} style={styles.tdCenter}>No tools registered. Seed defaults or add one below.</td></tr>
            ) : tools.map((t) => (
              <tr key={t.tool_id ?? t.name} style={styles.tr}>
                <td style={{ ...styles.td, fontWeight: 600 }}>{t.name}</td>
                <td style={styles.td}>{t.category}</td>
                <td style={styles.td}><Badge text={t.risk_level} color={riskColor(t.risk_level)} /></td>
                <td style={styles.td}>
                  <Badge text={t.requires_approval ? 'Yes' : 'No'} color={t.requires_approval ? 'yellow' : 'gray'} />
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(t.tool_id ?? t.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add form */}
      <div style={styles.formBox}>
        <div style={styles.formTitle}>Add Tool</div>
        <form onSubmit={handleAdd}>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="Tool name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Category (e.g. file_system)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div style={{ ...styles.formRow, marginTop: 10, alignItems: 'center' }}>
            <div style={styles.radioGroup}>
              <span style={styles.radioLabel}>Risk:</span>
              {['low', 'medium', 'high'].map((r) => (
                <label key={r} style={styles.radioItem}>
                  <input
                    type="radio"
                    name="risk_level"
                    value={r}
                    checked={form.risk_level === r}
                    onChange={() => setForm({ ...form, risk_level: r })}
                  />
                  <Badge text={r} color={riskColor(r)} />
                </label>
              ))}
            </div>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.requires_approval}
                onChange={(e) => setForm({ ...form, requires_approval: e.target.checked })}
              />
              <span style={{ marginLeft: 6 }}>Requires Approval</span>
            </label>
            <button type="submit" style={styles.addBtn} disabled={saving}>
              {saving ? 'Adding…' : 'Add Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Permissions Tab ─────────────────────────────────────────────────────────

function PermissionsTab() {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.listAgents()
      .then((res) => {
        const list = res.agents ?? res ?? []
        setAgents(list)
        if (list.length > 0) setSelectedAgent(list[0].agent_id)
      })
      .catch((e) => setError(e.message))
  }, [])

  const loadPermissions = async (agentId) => {
    if (!agentId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.getPermissions(agentId)
      setPermissions(res.permissions ?? res ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPermissions(selectedAgent) }, [selectedAgent])

  const handleToggle = async (perm) => {
    const key = perm.tool_id ?? perm.tool_name
    setToggling(key)
    setError(null)
    try {
      await api.setPermission(selectedAgent, perm.tool_id ?? perm.tool_name, !perm.allowed)
      await loadPermissions(selectedAgent)
    } catch (e) {
      setError(e.message)
    } finally {
      setToggling(null)
    }
  }

  return (
    <div>
      <div style={styles.permHeader}>
        <label style={styles.fieldLabel}>Agent</label>
        <select
          style={{ ...styles.select, maxWidth: 300 }}
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          {agents.map((a) => (
            <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.role})</option>
          ))}
        </select>
      </div>

      <ErrorMsg msg={error} />

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Tool', 'Category', 'Risk Level', 'Permission', 'Toggle'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={styles.tdCenter}><Spinner /> Loading…</td></tr>
            ) : permissions.length === 0 ? (
              <tr><td colSpan={5} style={styles.tdCenter}>No permissions found for this agent.</td></tr>
            ) : permissions.map((p) => {
              const key = p.tool_id ?? p.tool_name
              return (
                <tr key={key} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{p.tool_name ?? p.tool_id}</td>
                  <td style={styles.td}>{p.category ?? '—'}</td>
                  <td style={styles.td}><Badge text={p.risk_level ?? '—'} color={riskColor(p.risk_level)} /></td>
                  <td style={styles.td}>
                    <Badge text={p.allowed ? 'ALLOWED' : 'DENIED'} color={p.allowed ? 'green' : 'red'} />
                  </td>
                  <td style={styles.td}>
                    <button
                      style={p.allowed ? styles.denyToggleBtn : styles.allowToggleBtn}
                      onClick={() => handleToggle(p)}
                      disabled={toggling === key}
                    >
                      {toggling === key ? '…' : p.allowed ? 'Deny' : 'Allow'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Policies Tab ─────────────────────────────────────────────────────────────

function PoliciesTab() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toggling, setToggling] = useState(null)
  const [form, setForm] = useState({
    name: '', policy_type: 'tool_based', action: 'ALLOW', priority: 50,
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.listPolicies()
      setPolicies(res.policies ?? res ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (p) => {
    setToggling(p.policy_id)
    setError(null)
    try {
      await api.togglePolicy(p.policy_id, !p.enabled)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return
    setError(null)
    try {
      await api.deletePolicy(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await api.createPolicy({
        name: form.name.trim(),
        policy_type: form.policy_type,
        action: form.action,
        priority: Number(form.priority),
        enabled: true,
        conditions: {},
      })
      setForm({ name: '', policy_type: 'tool_based', action: 'ALLOW', priority: 50 })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const actionColor = (action) => {
    if (!action) return 'gray'
    if (action === 'ALLOW') return 'green'
    if (action === 'DENY') return 'red'
    if (action === 'REQUIRE_APPROVAL') return 'yellow'
    if (action === 'RATE_LIMIT') return 'yellow'
    return 'gray'
  }

  return (
    <div>
      <ErrorMsg msg={error} />

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Type', 'Action', 'Priority', 'Enabled', ''].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={styles.tdCenter}><Spinner /> Loading…</td></tr>
            ) : policies.length === 0 ? (
              <tr><td colSpan={6} style={styles.tdCenter}>No policies. Seed defaults or add one below.</td></tr>
            ) : policies.map((p) => (
              <tr key={p.policy_id} style={styles.tr}>
                <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                <td style={{ ...styles.td, ...styles.mono, fontSize: 11.5 }}>{p.policy_type}</td>
                <td style={styles.td}><Badge text={p.action} color={actionColor(p.action)} /></td>
                <td style={{ ...styles.td, ...styles.mono }}>{p.priority}</td>
                <td style={styles.td}>
                  <button
                    style={p.enabled ? styles.enabledToggle : styles.disabledToggle}
                    onClick={() => handleToggle(p)}
                    disabled={toggling === p.policy_id}
                  >
                    {toggling === p.policy_id ? '…' : p.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(p.policy_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Policy form */}
      <div style={styles.formBox}>
        <div style={styles.formTitle}>Add Policy</div>
        <form onSubmit={handleAdd}>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="Policy name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              style={styles.select}
              value={form.policy_type}
              onChange={(e) => setForm({ ...form, policy_type: e.target.value })}
            >
              {['tool_based', 'parameter_based', 'role_based', 'rate_based'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              style={styles.select}
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            >
              {['ALLOW', 'DENY', 'REQUIRE_APPROVAL', 'RATE_LIMIT'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <input
              style={{ ...styles.input, maxWidth: 100 }}
              type="number"
              placeholder="Priority"
              value={form.priority}
              min={0}
              max={1000}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
            <button type="submit" style={styles.addBtn} disabled={saving}>
              {saving ? 'Adding…' : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GovernancePanel() {
  const [activeTab, setActiveTab] = useState('Agents')
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState(null)
  const [seedError, setSeedError] = useState(null)

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg(null)
    setSeedError(null)
    try {
      const res = await api.seedDefaults()
      setSeedMsg(res.message ?? 'Defaults seeded successfully.')
    } catch (e) {
      setSeedError(e.message)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <div style={styles.pageTopRow}>
        <PageHeader
          eyebrow="Governance"
          title="Governance Panel"
          subtitle="Manage agents, tools, permissions, and policies that control what each agent is allowed to do."
        />
        <div style={styles.seedSection}>
          <button style={styles.seedBtn} onClick={handleSeed} disabled={seeding}>
            {seeding ? '⟳ Seeding…' : '⚡ Seed Defaults'}
          </button>
          {seedMsg && <div style={styles.seedSuccess}>{seedMsg}</div>}
          {seedError && <div style={styles.errorMsg}>{seedError}</div>}
        </div>
      </div>

      {/* Tab bar */}
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t}
            style={{ ...styles.tabBtn, ...(activeTab === t ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.tabContent}>
        {activeTab === 'Agents' && <AgentsTab />}
        {activeTab === 'Tools' && <ToolsTab />}
        {activeTab === 'Permissions' && <PermissionsTab />}
        {activeTab === 'Policies' && <PoliciesTab />}
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  pageTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  seedSection: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  seedBtn: {
    background: 'var(--signal)',
    border: 'none',
    color: '#04211D',
    fontWeight: 700,
    fontSize: 13,
    padding: '10px 20px',
    borderRadius: 999,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  seedSuccess: {
    fontSize: 12,
    color: 'var(--tier-safe, #4ade80)',
    background: 'var(--tier-safe-bg, #0f2e1f)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
  },
  tabBar: { display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontSize: 13.5,
    fontWeight: 500,
    padding: '10px 18px',
    cursor: 'pointer',
    marginBottom: -1,
  },
  tabBtnActive: {
    color: 'var(--text-primary)',
    borderBottomColor: 'var(--signal)',
    fontWeight: 700,
  },
  tabContent: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 22,
  },
  tableWrap: { overflowX: 'auto', marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    textAlign: 'left',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '8px 12px',
    borderBottom: '1px solid var(--border)',
  },
  td: { padding: '10px 12px', verticalAlign: 'middle' },
  tdCenter: { padding: '20px 12px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 },
  tr: { borderBottom: '1px solid var(--border-soft)' },
  mono: { fontFamily: 'var(--font-mono)', fontSize: 12 },
  badge: {
    display: 'inline-block',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 999,
    letterSpacing: 0.3,
  },
  deleteBtn: {
    background: 'var(--tier-high-bg, #2e0f0f)',
    border: '1px solid var(--tier-high, #f87171)',
    color: 'var(--tier-high, #f87171)',
    fontSize: 11.5,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  allowToggleBtn: {
    background: 'var(--tier-safe-bg, #0f2e1f)',
    border: '1px solid var(--tier-safe, #4ade80)',
    color: 'var(--tier-safe, #4ade80)',
    fontSize: 11.5,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  denyToggleBtn: {
    background: 'var(--tier-high-bg, #2e0f0f)',
    border: '1px solid var(--tier-high, #f87171)',
    color: 'var(--tier-high, #f87171)',
    fontSize: 11.5,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  enabledToggle: {
    background: 'var(--tier-safe-bg, #0f2e1f)',
    border: '1px solid var(--tier-safe, #4ade80)',
    color: 'var(--tier-safe, #4ade80)',
    fontSize: 11.5,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  disabledToggle: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: 11.5,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  formBox: {
    background: 'var(--bg)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px',
  },
  formTitle: { fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' },
  formRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' },
  input: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    flex: 1,
    minWidth: 140,
    outline: 'none',
  },
  select: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    cursor: 'pointer',
  },
  addBtn: {
    background: 'var(--signal-dim)',
    border: '1px solid var(--signal)',
    color: 'var(--signal)',
    fontWeight: 700,
    fontSize: 13,
    padding: '8px 18px',
    borderRadius: 999,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  errorMsg: {
    marginBottom: 14,
    color: 'var(--tier-high, #f87171)',
    background: 'var(--tier-high-bg, #2e0f0f)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
    marginRight: 6,
    fontSize: 14,
  },
  permHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' },
  radioGroup: { display: 'flex', alignItems: 'center', gap: 10 },
  radioLabel: { fontSize: 12.5, color: 'var(--text-muted)', marginRight: 2 },
  radioItem: { display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 },
  checkLabel: { display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' },
}
