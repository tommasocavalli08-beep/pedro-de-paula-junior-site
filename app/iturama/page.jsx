import Link from 'next/link';
import { doctor, locations, services, SITE_URL } from '@/app/data';
import { Arrow, JsonLd, PublicShell } from '@/app/ui';
import { getEditorialContent } from '@/lib/editorial';

const loc = locations.iturama;
const examSlugs = ['endoscopia-digestiva','colonoscopia','teste-hidrogenio-expirado'];

export const metadata = {
  title: 'Endoscopia e Colonoscopia em Iturama',
  description: 'Exames com Dr. Pedro de Paula Junior em Iturama (MG), no Hospital Nossa Senhora Aparecida: endoscopia digestiva alta, colonoscopia e teste de hidrogênio expirado.',
  alternates: { canonical: `${SITE_URL}/iturama` },
};

export const dynamic = 'force-dynamic';

export default async function IturamaPage() {
  const editorial = await getEditorialContent({ fresh: true });
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/iturama#location`,
    name: `${doctor.name} — Exames em Iturama`,
    url: `${SITE_URL}/iturama`,
    telephone: loc.phoneE164,
    address: { '@type': 'PostalAddress', streetAddress: loc.streetAddress, addressLocality: loc.locality, addressRegion: loc.region, postalCode: loc.postalCode, addressCountry: 'BR' },
    areaServed: { '@type': 'City', name: 'Iturama' },
    availableService: examSlugs.map((slug) => ({ '@type': 'MedicalProcedure', name: services[slug].title, url: `${SITE_URL}/servicos/${slug}` })),
    member: { '@type': 'Physician', name: doctor.name, url: SITE_URL },
  };
  return (
    <PublicShell>
      <main id="conteudo" className="local-page local-page-iturama">
        <section className="local-hero section-pad">
          <div data-reveal><p className="eyebrow"><span /> Iturama · MG</p><h1>Exames digestivos em <em>Iturama.</em></h1><p>Endoscopia, colonoscopia e investigação funcional com o Dr. Pedro de Paula Junior, conforme indicação e agendamento.</p><div className="hero-actions"><a className="btn btn-dark" href={loc.whatsapp} target="_blank" rel="noreferrer">Falar com a recepção <Arrow /></a><a className="btn btn-ghost" href={loc.maps} target="_blank" rel="noreferrer">Abrir no mapa</a></div></div>
          <div className="address-panel" data-reveal><span>Exames</span><h2>{loc.facility}</h2><p>{loc.streetAddress}<br/>Centro · {loc.city} - {loc.state} · CEP {loc.postalCode}</p><dl><div><dt>Telefone</dt><dd>{loc.phoneDisplay}</dd></div><div><dt>Atendimento</dt><dd>{editorial.practical.ituramaHours}</dd></div><div><dt>E-mail</dt><dd>{loc.email}</dd></div></dl><small>{loc.note}</small></div>
        </section>
        <section className="section-pad local-services"><div><p className="eyebrow"><span /> Exames</p><h2>Investigação do aparelho <em>digestivo.</em></h2></div><div className="local-service-links">{examSlugs.map((slug) => <Link href={`/servicos/${slug}`} key={slug}><span>{services[slug].eyebrow}</span><strong>{services[slug].title}</strong><Arrow /></Link>)}</div></section>
        <section className="section-pad local-copy"><h2>Preparo e indicação fazem parte do exame.</h2><div><p>Cada exame tem indicação e preparo próprios. A equipe orienta jejum, dieta, medicamentos e demais cuidados conforme o procedimento programado.</p><p>Resultados devem ser interpretados junto ao quadro clínico. O conteúdo do site é educativo e não substitui avaliação médica.</p></div></section>
      </main>
      <JsonLd data={schema}/>
    </PublicShell>
  );
}