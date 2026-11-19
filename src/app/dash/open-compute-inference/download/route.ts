import { hasValidDataRoomSession } from '../../../data/session';
import { loadDownload } from '@/lib/open-compute-store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!(await hasValidDataRoomSession())) return new Response('Unauthorized.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const url = new URL(request.url);
  const file = url.searchParams.get('file') ?? '';
  const bytes = await loadDownload(url.searchParams.get('snapshot') ?? '', file);
  if (!bytes) return new Response('The requested verified snapshot is unavailable.', { status: 404 });
  return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': file.endsWith('.csv') ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${file}"`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' } });
}
