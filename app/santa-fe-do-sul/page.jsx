import Link from 'next/link';
import { doctor, featuredServiceSlugs, locations, services, SITE_URL } from '@/app/data';
import { Arrow, JsonLd, PublicShell } from '@/app/ui';
import { getEditorialContent } from '@/lib/editorial';

const loc = locations.santaFe;

export const metadata = {
  title: 'Cirurgião Digestivo em Santa Fé do Sul',
  description: 'Consultas com Dr. Pedro de Paula Junior em Santa Fé do Sul (SP): cirurgia geral e digestiva, hérnias, vesícula e saúde gastrointestinal. Rua Cinco, 1198, Centro.',
  alternates: { canonical: `${SITE_URL}/santa-fe-do-sul` },
};

export const dynamic = 'force-dynamic';

export default async function SantaFePage() {
  const editorial = await getEditorialContent({ fresh: true });
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${SITE_URL}/santa-fe-do-sul#clinic`,
    name: `${doctor.name} — Santa Fé do Sul`,
    url: `${SITE_URL}/santa-fe-do-sul`,
    telephone: loc.phoneE164,
    email: doctor.email,
    address: { '@type': 'PostalAddress', streetAddress: loc.streetAddress, addressLocality: loc.locality, addressRegion: loc.region, postalCode: loc.postalCode, addressCountry: 'BR' },
    areaServed: { '@type': 'City', name: 'Santa Fé do Sul' },
    availableService: featuredServiceSlugs.map((slug) => ({ '@type': 'MedicalProcedure', name: services[slug].title, url: `${SITE_URL}/servicos/${slug}` })),
    employee: { '@type': 'Physician', name: doctor.name, url: SITE_URL },
  };
  return (
    <PublicShell>
      <main id="conteudo" className="local-page">
        <section className="local-hero section-pad">
          <div data-reveal><p className="eyebrow"><span /> Santa Fé do Sul · SP</p><h1>Cirurgia digestiva em <em>Santa Fé do Sul.</em></h1><p>Consultas com o Dr. Pedro de Paula Junior para avaliação cirúrgica e acompanhamento de condições gastrointestinais.</p><div className="hero-actions"><a className="btn btn-dark" href={loc.whatsapp} target="_blank" rel="noreferrer">Agendar pelo WhatsApp <Arrow /></a><a className="btn btn-ghost" href={loc.maps} target="_blank" rel="noreferrer">Abrir no mapa</a></div></div>
          <div className="address-panel" data-reveal><span>Consultório</span><h2>{loc.streetAddress}</h2><p>Centro · {loc.city} - {loc.state}<br/>CEP {loc.postalCode}</p><dl><div><dt>Telefone</dt><dd>{loc.phoneDisplay}</dd></div><div><dt>Horário</dt><dd>{editorial.practical.santaFeHours}</dd></div><div><dt>E-mail</dt><dd>{doctor.email}</dd></div></dl><small>{loc.note}</small></div>
        </section>
        <section className="section-pad local-services"><div><p className="eyebrow"><span /> Atuação</p><h2>O que pode ser avaliado em <em>consulta.</em></h2></div><div className="local-service-links">{featuredServiceSlugs.map((slug) => <Link href={`/servicos/${slug}`} key={slug}><span>{services[slug].eyebrow}</span><strong>{services[slug].title}</strong><Arrow /></Link>)}</div></section>
        <section className="section-pad local-copy"><h2>Consulta cirúrgica com informação clara.</h2><div><p>A consulta organiza sintomas, histórico, exame físico e exames já realizados. Quando existe uma condição com possível indicação cirúrgica, são discutidas alternativas, benefícios, limitações e próximos passos.</p><p>Para procedimentos e exames, disponibilidade e local exato devem ser confirmados com a recepção no momento do agendamento.</p></div></section>
      </main>
      <JsonLd data={schema}/>
    </PublicShell>
  );
}