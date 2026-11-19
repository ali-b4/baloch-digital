/** The public export contract. No private lab types or credentials enter this module. */
export type Metric = { p5: number | null; p50: number | null; p95: number | null; n: number; coverage: number | null };
export type Evidence = { value: unknown; status: string; source?: string | null; checked_at?: string | null };
export type Workload = {
  aggregate: {
    support_status: string; counts: { planned: number; dispatched: number; successful: number; failed: number; bursts: number };
    reliability: { success_fraction: number | null; score_ceiling: number | null };
    metrics: Record<string, Metric>;
    cost: { mean_successful_request_usd: number | null; successful_cost_coverage: number | null; unknown_billing_count: number; pricing_status: string };
    comparability: { output_length_coverage: number | null; cache_usage_coverage: number | null };
    score_gate_reasons: string[]; zero_reason?: string | null;
  };
  score: { state: string; base_score: number | null; success_fraction: number | null; reliability_multiplier: number | null; workload_score: number | null; aps_contribution: number | null; components: Record<string, { raw: number | null; reference: number | null; normalized: number | null; weight: number }>; reasons: string[] };
};
export type Qualification = { status: string; reasons: string[]; caveats: string[]; projected_monthly_cost_usd: number | null; requirements: { field: string; required: unknown; observed: unknown; hard: boolean; result: string; evidence_status: string; evidence_source: string | null; checked_at: string | null }[] };
export type Pricing = { input_per_1m_tokens: number | null; output_per_1m_tokens: number | null; cache_input_per_1m_tokens: number | null; minimum_request_cost_usd: number | null; source: string | null; checked_at: string | null; status: string; cost_basis: string | null };
export type Provider = { pricing?: Pricing; provider_id: string; display_name: string; model_id: string; serving_variant: Evidence; aps: number | null; score_state: string; rank?: number | null; evidence: Record<string, Evidence>; workloads: Record<string, Workload>; qualifications: Record<string, Qualification> };
export type DashboardData = {
  schema_version: 'public-dashboard-v1'; synthetic: boolean; release_state: string;
  metadata: { collection_id: string; model_family: string; measurement_region: string | null; collection_started_at: string | null; collection_ended_at: string | null; exported_at: string; methodology_version: string; scoring_version: string; work_shapes?: Record<string, { target_input_tokens: number; output_budget_tokens: number; concurrency: number; profile_status?: string }>; [key: string]: unknown };
  providers: Provider[];
};
export type LoadedDashboard = { status: 'ready'; data: DashboardData; snapshotId: string; preview: boolean; importedAt: string; publicationAt: string | null } | { status: 'empty' | 'error' };
export const workloadNames: Record<string, string> = { small: 'Small', medium: 'Medium', large: 'Large', parallel: 'Parallel' };
export const workShapes: Record<string, string> = { small: '1K input · 512 output · 1 request at a time', medium: '10K input · 512 output · 1 request at a time', large: '100K input · 512 output · 1 request at a time', parallel: '1K input · 512 output · 10 simultaneous requests' };
export const labels: Record<string, string> = {
  qualified: 'Qualified', qualified_with_caveats: 'Qualified with caveats', compatible_but_fails_requirements: 'Fails requirements', technically_incompatible: 'Technically incompatible', insufficient_evidence: 'Insufficient evidence',
  ranked: 'Ranked', scoreable: 'Score available', provisional: 'Provisional', unscored: 'Unscored', unsupported: 'Unsupported', all_attempts_failed: 'All attempts failed', synthetic_preview: 'Simulation preview', synthetic: 'Illustrative only', release_candidate: 'Release candidate', unknown: 'Unknown', incomplete: 'Incomplete',
};
export function label(value: string | null | undefined) { return value ? labels[value] ?? value.replaceAll('_', ' ') : 'Unknown'; }
export function number(value: number | null | undefined, digits = 2) { return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }) : '—'; }
export function percent(value: number | null | undefined) { return typeof value === 'number' ? `${number(value * 100, 1)}%` : '—'; }
export function date(value: string | null | undefined) { return value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC' : 'Not recorded'; }
export function isStale(value: string | null, now = Date.now()) { return value && Number.isFinite(Date.parse(value)) ? now - Date.parse(value) > 7 * 86400000 : false; }
export function sortProviders(providers: Provider[], workload: string, key: string, ascending: boolean) {
  const value = (p: Provider) => { const w = p.workloads[workload]?.aggregate; if (key === 'name') return p.display_name; if (key === 'aps') return p.aps; if (key === 'reliability') return w?.reliability.success_fraction; if (key === 'cost') return w?.cost.mean_successful_request_usd; return w?.metrics[key]?.[key === 'output_tokens_per_second' ? 'p5' : 'p95']; };
  return [...providers].sort((a, b) => { const av = value(a), bv = value(b); if (av == null) return bv == null ? a.display_name.localeCompare(b.display_name) : 1; if (bv == null) return -1; const cmp = typeof av === 'string' ? av.localeCompare(String(bv)) : Number(av) - Number(bv); return (ascending ? cmp : -cmp) || a.display_name.localeCompare(b.display_name); });
}
export function visibleProviders(providers: Provider[], query: string, qualification: string, qualifiedOnly: boolean) {
  return providers.filter(p => `${p.display_name} ${p.model_id}`.toLowerCase().includes(query.toLowerCase()) && (!qualifiedOnly || ['qualified', 'qualified_with_caveats'].includes(p.qualifications[qualification]?.status)));
}
