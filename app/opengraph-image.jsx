import { ImageResponse } from 'next/og';

export const alt = 'Dr. Pedro de Paula Junior — Cirurgia Digestiva';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f3f0e9', color: '#203129', position: 'relative', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: 520, background: '#dce5dc', right: -130, top: -150 }} />
      <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: 350, background: '#efdcd2', left: -150, bottom: -180 }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 78px', width: 900, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, textTransform: 'uppercase', letterSpacing: 4, color: '#486052' }}><span style={{ width: 11, height: 11, borderRadius: 11, background: '#b8755d' }} /> Cirurgia Digestiva</div>
        <div style={{ fontSize: 74, fontWeight: 650, letterSpacing: -4, lineHeight: 1.02, marginTop: 30 }}>Dr. Pedro de Paula Junior</div>
        <div style={{ fontSize: 27, color: '#69776f', marginTop: 28 }}>Cirurgia geral e do aparelho digestivo · Endoscopia · Colonoscopia</div>
        <div style={{ fontSize: 21, color: '#486052', marginTop: 34 }}>Santa Fé do Sul · Iturama</div>
      </div>
      <div style={{ position: 'absolute', right: 80, bottom: 72, width: 100, height: 100, borderRadius: 30, background: '#263a31', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 62 }}>P</div>
    </div>,
    size,
  );
}