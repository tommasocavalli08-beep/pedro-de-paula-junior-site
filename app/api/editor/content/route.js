import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getEditorialContent, normalizeEditorial, EDITORIAL_PATHNAME } from '@/lib/editorial';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getEditorialContent({ fresh: true });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(request) {
  try {
    const incoming = await request.json();
    const data = normalizeEditorial({ ...incoming, updatedAt: new Date().toISOString() });
    await put(EDITORIAL_PATHNAME, JSON.stringify(data), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json; charset=utf-8',
    });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Armazenamento editorial não conectado. Conecte um Vercel Blob privado ao projeto e tente novamente.',
      detail: error?.message || 'Falha ao salvar',
    }, { status: 503 });
  }
}