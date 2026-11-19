import { readFile, lstat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import type { DashboardData, LoadedDashboard } from './open-compute-model';

const files = ['dashboard.json', 'requests.json', 'requests.csv', 'methodology.json'] as const;
export const downloadFiles = [...files, 'checksums.json'] as const;
const sha = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const hashPattern = /^[a-f0-9]{64}$/;
async function safeRead(path: string, max = 64 * 1024 * 1024) {
  const stat = await lstat(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > max) throw new Error('Invalid snapshot file.');
  return readFile(path);
}
function directory() {
  // Preview data has no production fallback. No lab path or credential is read.
  const preview = process.env.NODE_ENV === 'development' && process.env.OPEN_COMPUTE_PREVIEW === '1';
  return { root: resolve(process.cwd(), preview ? '.preview/open-compute' : 'data/open-compute'), preview };
}
function validDashboard(value: DashboardData) {
  if (value?.schema_version !== 'public-dashboard-v1' || typeof value.synthetic !== 'boolean' || !value.metadata || !Array.isArray(value.providers) || !value.providers.length) return false;
  const ids = new Set<string>();
  for (const p of value.providers) {
    if (typeof p.provider_id !== 'string' || !/^[a-z0-9_-]+$/.test(p.provider_id) || ids.has(p.provider_id) || typeof p.display_name !== 'string' || typeof p.model_id !== 'string' || !p.qualifications || !p.evidence || !p.workloads || (p.aps !== null && (typeof p.aps !== 'number' || p.aps < 0 || p.aps > 100))) return false;
    ids.add(p.provider_id);
    for (const id of ['small', 'medium', 'large', 'parallel']) {
      const w = p.workloads[id];
      if (!w?.score || !w.aggregate?.counts || !w.aggregate.metrics || !w.aggregate.reliability || !w.aggregate.cost || !w.aggregate.comparability || !Array.isArray(w.aggregate.score_gate_reasons)) return false;
    }
  }
  return true;
}
export async function readSnapshot(root: string, allowPreview = false) {
  const pointerBytes = await safeRead(join(root, 'current.json'), 16384);
  const pointer = JSON.parse(pointerBytes.toString('utf8'));
  if (pointer.schema_version !== 'public-pointer-v1' || !hashPattern.test(pointer.snapshot_id) || typeof pointer.preview !== 'boolean' || (!allowPreview && pointer.preview)) throw new Error('Unapproved snapshot pointer.');
  const dir = join(root, 'snapshots', pointer.snapshot_id);
  if (!(await lstat(dir)).isDirectory() || (await lstat(dir)).isSymbolicLink()) throw new Error('Invalid snapshot directory.');
  const checksumsBytes = await safeRead(join(dir, 'checksums.json'), 16384);
  if (sha(checksumsBytes) !== pointer.snapshot_id) throw new Error('Snapshot identity mismatch.');
  const checksums = JSON.parse(checksumsBytes.toString('utf8'));
  if (checksums.schema_version !== 'public-checksums-v1' || checksums.algorithm !== 'sha256' || !checksums.files || Object.keys(checksums.files).sort().join() !== [...files].sort().join()) throw new Error('Invalid checksum manifest.');
  const artifacts: Record<string, Buffer> = { 'checksums.json': checksumsBytes };
  for (const name of files) {
    const bytes = await safeRead(join(dir, name));
    if (sha(bytes) !== checksums.files[name]) throw new Error('Artifact checksum mismatch.');
    artifacts[name] = bytes;
  }
  const data = JSON.parse(artifacts['dashboard.json'].toString('utf8')) as DashboardData;
  if (!validDashboard(data) || (!allowPreview && (data.synthetic || data.release_state !== 'release_candidate'))) throw new Error('Invalid or unapproved dashboard.');
  return { loaded: { status: 'ready' as const, data, snapshotId: pointer.snapshot_id as string, preview: allowPreview || pointer.preview, importedAt: pointer.imported_at as string, publicationAt: pointer.publication_at as string | null }, artifacts };
}
export async function loadDashboard(): Promise<LoadedDashboard> {
  const { root, preview } = directory();
  try { return (await readSnapshot(root, preview)).loaded; }
  catch (error) {
    // A missing pointer means no release yet; a missing member means a broken release.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try { await lstat(join(root, 'current.json')); } catch { return { status: 'empty' }; }
    }
    return { status: 'error' };
  }
}
export async function loadDownload(snapshotId: string, file: string) {
  if (!hashPattern.test(snapshotId) || !(downloadFiles as readonly string[]).includes(file)) return null;
  const { root, preview } = directory();
  try { const result = await readSnapshot(root, preview); return result.loaded.snapshotId === snapshotId ? result.artifacts[file] : null; } catch { return null; }
}
