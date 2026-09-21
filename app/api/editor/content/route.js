import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getEditorialContent, normalizeEditorial, EDITORIAL_PATHNAME, hasEditorialStorage } from '@/lib/editorial';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Storage binding refresh

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' };

export async function GET() {
  const storageReady = hasEditorialStorage();
  const data = await getEditorialContent({ fresh: true });
  return NextResponse.json({ ok: true, storageReady, data }, { headers: NO_STORE });
}
export async function PUT(request) {
  try {
    if (!hasEditorialStorage()) {
      return NextResponse.json({
        ok: false,
        code: 'STORAGE_NOT_CONNECTED',
        error: 'Publicação indisponível: o armazenamento do site ainda não está conectado.',
        detail: 'Conecte um Vercel Blob privado ao projeto. O rascunho permanece salvo neste navegador.',
      }, { status: 503, headers: NO_STORE });
    }

    const incoming = await request.json();
    const data = normalizeEditorial({ ...incoming, updatedAt: new Date().toISOString() });

    await put(EDITORIAL_PATHNAME, JSON.stringify(data), {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json; charset=utf-8',
    });

    const persisted = await getEditorialContent({ fresh: true, strict: true });
    const expectedSlugs = data.articles.map((article) => article.slug).sort().join('|');
    const persistedSlugs = persisted.articles.map((article) => article.slug).sort().join('|');

    if (persisted.updatedAt !== data.updatedAt || expectedSlugs !== persistedSlugs) {
      throw new Error('A verificação após o salvamento não corresponde ao conteúdo enviado.');
    }

    return NextResponse.json({
      ok: true,
      storageReady: true,
      verified: true,
      data: persisted,
    }, { headers: NO_STORE });
  } catch (error) {
    console.error('EDITORIAL_SAVE_FAILED', error?.message || error);
    return NextResponse.json({
      ok: false,
      code: 'STORAGE_WRITE_FAILED',
      error: 'Não foi possível publicar o conteúdo.',
      detail: error?.message || 'Falha ao salvar',
    }, { status: 503, headers: NO_STORE });
  }
}