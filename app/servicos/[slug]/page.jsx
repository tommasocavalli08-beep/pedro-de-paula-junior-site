import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicePages, SITE_URL } from '../../data';

export function generateStaticParams() { return Object.keys(servicePages).map((slug) => ({ slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = servicePages[slug];
  if (!item) return {};
  return {
    title: item.title,
    description: item.intro,
    alternates: { canonical: `/servicos/${slug}` },
    openGraph: { title: `${item.title} | Dr. Pedro de Paula Junior`, description: item.intro, url: `${SITE_URL}/servicos/${slug}`, images: [item.image] }
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const item = servicePages[slug];
  if (!item) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'MedicalProcedure', name: item.title, description: item.intro,
    url: `${SITE_URL}/servicos/${slug}`, image: `${SITE_URL}${item.image}`,
    provider: { '@type': 'Physician', name: 'Dr. Pedro de Paula Junior', identifier: 'CRM-SP 112723 · CRM-MG 47662' }
  };
  return <>
    <header className="nav-shell service-nav"><Link className="brand" href="/"><span className="brand-symbol">P</span><span><strong>Dr. Pedro</strong><small>Cirurgia Digestiva</small></span></Link><Link className="nav-cta" href="/#locais">Agendar <span>↗</span></Link></header>
    <main className="service-page">
      <section className="service-hero">
        <div className="service-hero-copy"><p className="eyebrow"><span className="eyebrow-dot"/> {item.kicker}</p><h1>{item.title}</h1><p>{item.intro}</p><Link className="button primary" href="/#locais">Falar com a recepção <span>↗</span></Link></div>
        <div className="service-hero-image"><Image src={item.image} alt={item.imageAlt} fill priority sizes="(max-width: 800px) 94vw, 46vw" className="cover"/></div>
      </section>
      <section className="service-body"><div className="service-text">{item.body.map((p)=><p key={p}>{p}</p>)}</div><aside><span>Atuação</span><ul>{item.points.map(p=><li key={p}>{p}</li>)}</ul></aside></section>
      <section className="service-back"><Link href="/">← Voltar ao site</Link><Link href="/#locais">Agendar avaliação <span>↗</span></Link></section>
    </main>
    <footer className="service-footer"><p>Dr. Pedro de Paula Junior · CRM-SP 112723 · CRM-MG 47662 · RQE 28023 / 28024</p><p>Informação educativa. A indicação depende de avaliação médica individual.</p></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}/>
  </>;
}
