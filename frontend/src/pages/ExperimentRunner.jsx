import { useEffect, useState } from 'react'
import { PageHeader } from './Playground'
import { api } from '../api'

const CONFIGS = [
  { value: 'baseline', label: 'Baseline', desc: 'No governance controls active' },
  { value: 'permission', label: 'Permission Control', desc: 'Agent permission checks only' },
  { value: 'policy', label: 'Policy Control', desc: 'Policy engine only' },
  { value: 'full', label: 'Full Governance', desc: 'All controls combined (PRD §24–27)' },
]

const CATEGORIES = [
  'legitimate',
  'unauthorized_tool',
  'privilege_escalation',
  'parameter_manipulation',
  'prompt_injection',
  'excessive_calls',
]

function MetricCard({ label, value, description, color }) {
  const colorMap = {
    red: { color: 'var(--tier-high, #f87171)' },
    green: { color: 'var(--tier-safe, #4ade80)' },
    yellow: { color: 'var(--tier-medium, #facc15)' },
    blue: { color: 'var(--signal)' },
    default: { color: 'var(--text-primary)' },
  }
  return (
    <div style={styles.metricCard}>
      <div style={{ ...styles.metricValue, ...(colorMap[color] ?? colorMap.default) }}>
        {value != null ? (typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value) : '—'}
      </div>
      <div style={styles.metricLabel}>{label}</div>
      {description && <div style={styles.metricDesc}>{description}</div>}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    completed: { background: 'var(--tier-safe-bg, #0f2e1f)', color: 'var(--tier-safe, #4ade80)' },
    running: { background: 'var(--tier-medium-bg, #2c2000)', color: 'var(--tier-medium, #facc15)' },
    failed: { background: 'var(--tier-high-bg, #2e0f0f)', color: 'var(--tier-high, #f87171)' },
    pending: { background: 'var(--surface-raised)', color: 'var(--text-muted)' },
  }
  const s = map[status?.toLowerCase()] ?? map.pending
  return (
    <span style={{ ...styles.statusBadge, ...s }}>{status ?? '—'}</span>
  )
}

function fmtDate(ts) {
  if (!ts) return '—'
  try { return new Date(ts).toLocaleString() } catch { return ts }
}

export default function ExperimentRunner() {
  // Config form
  const [config, setConfig] = useState('full')
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [maxScenarios, setMaxScenarios] = useState(0)

  // Run state
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState(null)
  const [currentResult, setCurrentResult] = useState(null)

  // History
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)
  const [expandedData, setExpandedData] = useState({})

  const loadHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await api.listExperiments()
      setHistory(res.experiments ?? res ?? [])
    } catch {
      // silently ignore
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => { loadHistory() }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleRun = async () => {
    setRunning(true)
    setRunError(null)
    setCurrentResult(null)
    try {
      const res = await api.runExperiment(config, description.trim(), selectedCategories, Number(maxScenarios))
      setCurrentResult(res)
      await loadHistory()
    } catch (e) {
      setRunError(e.message)
    } finally {
      setRunning(false)
    }
  }

  const handleExpandRow = async (runId) => {
    if (expandedRow === runId) {
      setExpandedRow(null)
      return
    }
    setExpandedRow(runId)
    if (!expandedData[runId]) {
      try {
        const res = await api.getExperiment(runId)
        setExpandedData((prev) => ({ ...prev, [runId]: res }))
      } catch {
        setExpandedData((prev) => ({ ...prev, [runId]: { error: 'Failed to load details.' } }))
      }
    }
  }

  const metrics = currentResult?.metrics ?? currentResult?.results ?? null

  return (
    <div>
      <PageHeader
        eyebrow="Research"
        title="Research Experiment Runner"
        subtitle="Execute PRD benchmark scenarios (§24–27) to measure governance effectiveness across configurations."
      />

      {/* Seed reminder */}
      <div style={styles.reminderBanner}>
        <span style={styles.reminderIcon}>ℹ</span>
        <span>
          Run <code style={styles.code}>POST /governance/seed</code> first to initialize agents and tools before running experiments.
        </span>
      </div>

      {/* ── Experiment Config ── */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Experiment Configuration</div>

        {/* Config selector */}
        <div style={styles.configGrid}>
          {CONFIGS.map((c) => (
            <label
              key={c.value}
              style={{ ...styles.configOption, ...(config === c.value ? styles.configOptionActive : {}) }}
            >
              <input
                type="radio"
                name="exp-config"
                value={c.value}
                checked={config === c.value}
                onChange={() => setConfig(c.value)}
                style={{ display: 'none' }}
              />
              <div style={styles.configLabel}>{c.label}</div>
              <div style={styles.configDesc}>{c.desc}</div>
            </label>
          ))}
        </div>

        {/* Description */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Description (optional)</label>
          <input
            style={styles.input}
            placeholder="e.g. Baseline evaluation run #1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Scenario Categories (none = all)</label>
          <div style={styles.checkGrid}>
            {CATEGORIES.map((cat) => (
              <label key={cat} style={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span style={styles.checkText}>{cat.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Max scenarios */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Max Scenarios (0 = all)</label>
          <input
            style={{ ...styles.input, maxWidth: 140 }}
            type="number"
            min={0}
            value={maxScenarios}
            onChange={(e) => setMaxScenarios(e.target.value)}
          />
        </div>

        <button style={styles.runBtn} onClick={handleRun} disabled={running}>
          {running ? (
            <span style={styles.runningInner}>
              <span style={styles.spinnerInline}>⟳</span> Running experiment…
            </span>
          ) : '▶ Run Experiment'}
        </button>

        {runError && <div style={styles.errorMsg}>{runError}</div>}
      </div>

      {/* ── Results ── */}
      {currentResult && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>Results — {currentResult.run_id ?? 'Latest Run'}</div>

          {/* Primary metric cards */}
          <div style={styles.metricsGrid}>
            <MetricCard
              label="ASR"
              description="Attack Success Rate"
              value={metrics?.asr ?? metrics?.attack_success_rate}
              color="red"
            />
            <MetricCard
              label="LTCR"
              description="Legitimate Task Completion Rate"
              value={metrics?.ltcr ?? metrics?.legitimate_task_completion_rate}
              color="green"
            />
            <MetricCard
              label="FPR"
              description="False Positive Rate"
              value={metrics?.fpr ?? metrics?.false_positive_rate}
              color="yellow"
            />
            <MetricCard
              label="FNR"
              description="False Negative Rate"
              value={metrics?.fnr ?? metrics?.false_negative_rate}
              color="yellow"
            />
          </div>

          {/* Latency block */}
          {(metrics?.latency ?? metrics?.latency_stats) && (
            <div style={styles.latencyBlock}>
              <div style={styles.latencyTitle}>Latency (ms)</div>
              <div style={styles.latencyRow}>
                {['mean', 'median', 'p95', 'p99'].map((k) => {
                  const lat = metrics?.latency ?? metrics?.latency_stats ?? {}
                  return (
                    <div key={k} style={styles.latencyItem}>
                      <div style={styles.latencyValue}>{lat[k] != null ? lat[k].toFixed(1) : '—'}</div>
                      <div style={styles.latencyLabel}>{k}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* By-category table */}
          {(metrics?.by_category ?? currentResult?.by_category) && (
            <div style={{ marginTop: 20 }}>
              <div style={styles.subTitle}>By-Category Accuracy</div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Category', 'Total', 'Correct', 'Accuracy'].map((h) => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(metrics?.by_category ?? currentResult?.by_category ?? {}).map(([cat, data]) => {
                      const total = data?.total ?? 0
                      const correct = data?.correct ?? 0
                      const acc = total > 0 ? (correct / total * 100).toFixed(1) : '—'
                      return (
                        <tr key={cat} style={styles.tr}>
                          <td style={styles.td}>{cat.replace(/_/g, ' ')}</td>
                          <td style={{ ...styles.td, ...styles.mono }}>{total}</td>
                          <td style={{ ...styles.td, ...styles.mono }}>{correct}</td>
                          <td style={{ ...styles.td, ...styles.mono }}>{acc !== '—' ? `${acc}%` : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export */}
          {currentResult?.run_id && (
            <a
              href={api.exportExperiment(currentResult.run_id)}
              style={styles.exportLink}
              target="_blank"
              rel="noreferrer"
            >
              ⬇ Export CSV
            </a>
          )}
        </div>
      )}

      {/* ── Experiment History ── */}
      <div style={styles.card}>
        <div style={styles.historyHeader}>
          <div style={{ ...styles.cardTitle, margin: 0 }}>Experiment History</div>
          <button style={styles.refreshBtn} onClick={loadHistory} disabled={historyLoading}>
            {historyLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Run ID', 'Configuration', 'Status', 'Scenarios', 'ASR', 'LTCR', 'Started At', ''].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr><td colSpan={8} style={styles.tdCenter}>Loading…</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={8} style={styles.tdCenter}>No experiments run yet.</td></tr>
              ) : history.map((exp) => {
                const m = exp.metrics ?? exp.results ?? {}
                const asr = m?.asr ?? m?.attack_success_rate
                const ltcr = m?.ltcr ?? m?.legitimate_task_completion_rate
                const isExpanded = expandedRow === exp.run_id
                const detail = expandedData[exp.run_id]
                return [
                  <tr key={exp.run_id} style={{ ...styles.tr, cursor: 'pointer' }} onClick={() => handleExpandRow(exp.run_id)}>
                    <td style={{ ...styles.td, ...styles.mono, fontSize: 11.5 }}>{exp.run_id}</td>
                    <td style={styles.td}>{exp.configuration}</td>
                    <td style={styles.td}><StatusBadge status={exp.status} /></td>
                    <td style={{ ...styles.td, ...styles.mono }}>{exp.total_scenarios ?? '—'}</td>
                    <td style={{ ...styles.td, ...styles.mono }}>
                      {asr != null ? `${(asr * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td style={{ ...styles.td, ...styles.mono }}>
                      {ltcr != null ? `${(ltcr * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td style={{ ...styles.td, fontSize: 12 }}>{fmtDate(exp.started_at)}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={styles.expandChevron}>{isExpanded ? '▲' : '▼'}</span>
                        <a
                          href={api.exportExperiment(exp.run_id)}
                          style={styles.exportSmall}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          CSV
                        </a>
                      </div>
                    </td>
                  </tr>,
                  isExpanded && (
                    <tr key={`${exp.run_id}-detail`}>
                      <td colSpan={8} style={styles.expandedTd}>
                        {!detail ? (
                          <div style={styles.tdCenter}>Loading details…</div>
                        ) : detail.error ? (
                          <div style={styles.errorMsg}>{detail.error}</div>
                        ) : (
                          <pre style={styles.detailPre}>
                            {JSON.stringify(detail, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  reminderBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--signal-dim)',
    border: '1px solid var(--signal)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 16px',
    fontSize: 13,
    color: 'var(--text-primary)',
    marginBottom: 22,
    lineHeight: 1.5,
  },
  reminderIcon: { fontSize: 16, color: 'var(--signal)', flexShrink: 0 },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    background: 'rgba(0,0,0,0.3)',
    padding: '1px 5px',
    borderRadius: 4,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    marginBottom: 22,
  },
  cardTitle: { fontSize: 16, fontWeight: 700, marginBottom: 18 },
  configGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 },
  configOption: {
    padding: '14px 16px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--border)',
    background: 'var(--bg)',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  configOptionActive: {
    borderColor: 'var(--signal)',
    background: 'var(--signal-dim)',
  },
  configLabel: { fontSize: 13.5, fontWeight: 700, marginBottom: 4 },
  configDesc: { fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  input: {
    width: '100%',
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '9px 12px',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  checkItem: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
  checkText: { fontSize: 13, color: 'var(--text-primary)' },
  runBtn: {
    background: 'var(--signal)',
    border: 'none',
    color: '#04211D',
    fontWeight: 800,
    fontSize: 14,
    padding: '12px 30px',
    borderRadius: 999,
    cursor: 'pointer',
    marginTop: 6,
  },
  runningInner: { display: 'flex', alignItems: 'center', gap: 8 },
  spinnerInline: { display: 'inline-block', fontSize: 16, animation: 'spin 1s linear infinite' },
  errorMsg: {
    marginTop: 12,
    color: 'var(--tier-high, #f87171)',
    background: 'var(--tier-high-bg, #2e0f0f)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
  },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 },
  metricCard: {
    background: 'var(--bg)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px',
    textAlign: 'center',
  },
  metricValue: { fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800 },
  metricLabel: { fontSize: 14, fontWeight: 700, marginTop: 4, color: 'var(--text-primary)' },
  metricDesc: { fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 },
  latencyBlock: {
    background: 'var(--bg)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 18px',
    marginBottom: 8,
  },
  latencyTitle: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 },
  latencyRow: { display: 'flex', gap: 24 },
  latencyItem: { textAlign: 'center' },
  latencyValue: { fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 },
  latencyLabel: { fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' },
  subTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' },
  exportLink: {
    display: 'inline-block',
    marginTop: 16,
    color: 'var(--signal)',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid var(--signal)',
    padding: '6px 14px',
    borderRadius: 999,
  },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  refreshBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 12.5,
    padding: '7px 14px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },
  tableWrap: { overflowX: 'auto' },
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
  statusBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 999,
    letterSpacing: 0.3,
  },
  expandChevron: { fontSize: 10, color: 'var(--text-muted)' },
  exportSmall: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--signal)',
    border: '1px solid var(--signal)',
    padding: '2px 8px',
    borderRadius: 999,
    textDecoration: 'none',
  },
  expandedTd: {
    padding: '0 0 0 0',
    background: 'var(--bg)',
    borderBottom: '1px solid var(--border)',
  },
  detailPre: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    color: 'var(--text-muted)',
    padding: '14px 18px',
    margin: 0,
    overflowX: 'auto',
    maxHeight: 320,
    lineHeight: 1.6,
  },
}
