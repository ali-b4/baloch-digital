import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { readSnapshot, loadDownload } from '../src/lib/open-compute-store.ts';
import { sortProviders, visibleProviders, isStale } from '../src/lib/open-compute-model.ts';
const sha = b => createHash('sha256').update(b).digest('hex');
const provider = (id, aps, status = 'qualified') => ({ provider_id: id, display_name: id, model_id: 'example/model', serving_variant: { value: null, status: 'unknown' }, aps, score_state: 'synthetic', evidence: {}, qualifications: { interactive: { status } }, workloads: Object.fromEntries(['small', 'medium', 'large', 'parallel'].map(id => [id, { aggregate: { counts: {}, metrics: {}, reliability: {}, cost: {}, comparability: {}, score_gate_reasons: [] }, score: {} }])) });
async function snapshot(t, synthetic = true, preview = true) {
 const root = await mkdtemp(join(tmpdir(), 'compute-site-'));
 t.after(() => rm(root, { recursive: true, force: true }));
 const data = { schema_version: 'public-dashboard-v1', synthetic, release_state: synthetic ? 'synthetic_preview' : 'release_candidate', metadata: {}, providers: [provider('fictional', 70)] };
 const artifacts = { 'dashboard.json': JSON.stringify(data), 'requests.json': '[]', 'requests.csv': 'id\n', 'methodology.json': '{}' };
 const checksums = JSON.stringify({ schema_version: 'public-checksums-v1', algorithm: 'sha256', files: Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => [name, sha(bytes)])) });
 const id = sha(checksums); const dir = join(root, 'snapshots', id); await mkdir(dir, { recursive: true });
 await Promise.all(Object.entries({ ...artifacts, 'checksums.json': checksums }).map(([name, bytes]) => writeFile(join(dir, name), bytes)));
 await writeFile(join(root, 'current.json'), JSON.stringify({ schema_version: 'public-pointer-v1', snapshot_id: id, preview, imported_at: '2026-09-16', publication_at: null }));
 return { root, dir, id };
}
test('preview requires explicit permission; simulation cannot enter production even with edited pointer', async t => { const f = await snapshot(t); await assert.rejects(readSnapshot(f.root)); assert.equal((await readSnapshot(f.root, true)).loaded.data.synthetic, true); await writeFile(join(f.root, 'current.json'), JSON.stringify({ schema_version: 'public-pointer-v1', snapshot_id: f.id, preview: false })); await assert.rejects(readSnapshot(f.root)); });
test('approved real snapshot loads with unchanged fixed scores', async t => { const f = await snapshot(t, false, false); const got = await readSnapshot(f.root); assert.equal(got.loaded.data.providers[0].aps, 70); });
test('any tampered downloadable artifact prevents rendering', async t => { const f = await snapshot(t); await writeFile(join(f.dir, 'requests.csv'), 'changed'); await assert.rejects(readSnapshot(f.root, true), /checksum/); });
test('bad checksum identity and traversal are rejected', async t => { const f = await snapshot(t); await writeFile(join(f.dir, 'checksums.json'), '{}'); await assert.rejects(readSnapshot(f.root, true), /identity/); assert.equal(await loadDownload('../secret', '../.env'), null); });
test('filters, sorting and a fifth provider do not recalculate or mutate APS', () => { const providers = [provider('a', 80), provider('b', null), provider('c', 90), provider('d', 60, 'insufficient_evidence'), provider('new-provider', 70)]; const before = JSON.stringify(providers); const filtered = visibleProviders(providers, 'new', 'interactive', false); assert.equal(filtered.length, 1); assert.equal(filtered[0].aps, 70); assert.equal(visibleProviders(providers, '', 'interactive', true).length, 4); assert.deepEqual(sortProviders(providers, 'medium', 'aps', false).map(p => p.provider_id), ['c', 'a', 'new-provider', 'd', 'b']); assert.equal(JSON.stringify(providers), before); });
test('stale label uses collection date, with an explicit seven-day threshold', () => { const now = Date.parse('2026-09-16T12:00:00Z'); assert.equal(isStale('2026-09-08T12:00:00Z', now), true); assert.equal(isStale('2026-09-15T12:00:00Z', now), false); assert.equal(Boolean(isStale(null, now)), false); });
