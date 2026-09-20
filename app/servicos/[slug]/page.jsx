import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations, services, SITE_URL, doctor } from '@/app/data';
import { Arrow, JsonLd, PublicShell } from '@/app/ui';

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};
  const url = `${SITE_URL}/servicos/${slug}`;
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: url },
    openGraph: { title: `${service.title} | ${doctor.name}`, description: service.summary, url, images: [{ url: service.image }] },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${SITE_URL}/servicos/${slug}#page`,
        url: `${SITE_URL}/servicos/${slug}`,
        name: service.title,
        description: service.summary,
        inLanguage: 'pt-BR',
        about: { '@type': 'MedicalProcedure', name: service.title },
        reviewedBy: { '@type': 'Physician', name: doctor.name, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: service.title, item: `${SITE_URL}/servicos/${slug}` },
        ],
      },
      ...(service.faq?.length ? [{
        '@type': 'FAQPage',
        mainEntity: service.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }] : []),
    ],
  };

  return (
    <PublicShell>
      <main id="conteudo" className="service-page">
        <section className="service-hero section-pad">
          <div className="service-hero-copy" data-reveal>
            <p className="eyebrow"><span /> {service.eyebrow}</p>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <div className="hero-actions"><a className="btn btn-dark" href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <Arrow /></a><Link className="btn btn-ghost" href="/#atuacao">Ver outras áreas</Link></div>
          </div>
          <div className="service-hero-image" data-reveal><Image src={service.image} alt={service.imageAlt} fill priority sizes="(max-width: 860px) 92vw, 44vw" className="cover"/></div>
        </section>

        <section className="service-content section-pad">
          <div className="service-body" data-reveal>
            <p className="service-intro">{service.intro}</p>
            {service.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="medical-note">As informações acima são educativas e não substituem avaliação médica individual. Indicação de exames e tratamentos depende da consulta e do diagnóstico.</p>
          </div>
          <aside className="service-aside" data-reveal>
            <span>Relacionados a esta área</span>
            <ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </aside>
        </section>

        {service.faq?.length > 0 && <section className="service-faq section-pad">
          <div><p className="eyebrow"><span /> Perguntas frequentes</p><h2>Dúvidas sobre <em>{service.short.toLowerCase()}.</em></h2></div>
          <div className="faq-list">{service.faq.map(([q, a], i) => <details key={q}><summary><span>0{i+1}</span><strong>{q}</strong><i>+</i></summary><p>{a}</p></details>)}</div>
        </section>}

        <section className="service-local section-pad" data-reveal>
          <div><span>Consultas</span><h3>Santa Fé do Sul</h3><p>{locations.santaFe.address}</p><Link href="/santa-fe-do-sul">Informações da unidade <Arrow /></Link></div>
          <div><span>Exames</span><h3>Iturama</h3><p>{locations.iturama.facility}<br/>{locations.iturama.address}</p><Link href="/iturama">Informações da unidade <Arrow /></Link></div>
        </section>
      </main>
      <JsonLd data={schema} />
    </PublicShell>
  );
}