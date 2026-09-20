import { notFound } from 'next/navigation';
import Link from 'next/link';
import { doctor, SITE_URL } from '@/app/data';
import { getEditorialContent, youtubeEmbedUrl } from '@/lib/editorial';
import { Arrow, JsonLd, PublicShell } from '@/app/ui';

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const editorial = await getEditorialContent({ fresh: true });
  const article = editorial.articles.find((item) => item.slug === slug);
  if (!article) return {};
  const url = `${SITE_URL}/artigos/${slug}`;
  return {
    title: article.title,
    description: article.description || article.intro,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description || article.intro,
      publishedTime: article.date || undefined,
      images: article.coverImage ? [{ url: article.coverImage }] : [{ url: '/og.jpg' }],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const editorial = await getEditorialContent({ fresh: true });
  const article = editorial.articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const video = youtubeEmbedUrl(article.videoUrl);
  const published = formatDate(article.date);
  const url = `${SITE_URL}/artigos/${slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Article', 'MedicalWebPage'],
        '@id': `${url}#article`,
        headline: article.title,
        description: article.description || article.intro,
        datePublished: article.date || undefined,
        dateModified: editorial.updatedAt || article.date || undefined,
        mainEntityOfPage: url,
        author: { '@type': 'Physician', name: doctor.name, url: SITE_URL },
        publisher: { '@type': 'Person', name: doctor.name, url: SITE_URL },
        image: article.coverImage || `${SITE_URL}/og.jpg`,
        inLanguage: 'pt-BR',
      },
      ...(article.faq?.length ? [{ '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }] : []),
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Artigos', item: `${SITE_URL}/artigos` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ] },
    ],
  };

  return (
    <PublicShell>
      <main id="conteudo" className="article-page">
        <article>
          <header className="article-header section-pad" data-reveal>
            <Link className="article-back" href="/artigos">← Todos os conteúdos</Link>
            <p className="eyebrow"><span /> {article.category}</p>
            <h1>{article.title}</h1>
            <p className="article-description">{article.description}</p>
            <div className="article-byline"><strong>{doctor.name}</strong>{published && <><span>•</span><time>{published}</time></>}</div>
          </header>

          {article.coverImage && <div className="article-cover section-pad" data-reveal><img src={article.coverImage} alt={`Imagem de capa: ${article.title}`} /></div>}

          <div className="article-body section-pad">
            {article.intro && <p className="article-intro" data-reveal>{article.intro}</p>}

            {video && <div className="video-shell" data-reveal><div className="video-frame"><iframe src={video} title={`Vídeo: ${article.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><p>Vídeo complementar do Dr. Pedro de Paula Junior.</p></div>}

            {article.sections.map((section, index) => <section className="article-section" key={`${section.heading}-${index}`} data-reveal>{section.heading && <h2>{section.heading}</h2>}{section.text.split(/\n{2,}/).map((p) => <p key={p}>{p}</p>)}</section>)}

            {article.faq?.length > 0 && <section className="article-faq" data-reveal><h2>Dúvidas frequentes</h2><div className="faq-list">{article.faq.map((item, index) => <details key={item.q}><summary><span>0{index + 1}</span><strong>{item.q}</strong><i>+</i></summary><p>{item.a}</p></details>)}</div></section>}

            <aside className="article-disclaimer" data-reveal><strong>Informação médica</strong><p>Este conteúdo tem finalidade educativa e não substitui consulta, exame físico ou diagnóstico individual. Em caso de sintomas ou dúvidas, procure avaliação médica.</p></aside>
          </div>
        </article>
        <section className="article-next section-pad" data-reveal><p>Precisa de avaliação individual?</p><a className="btn btn-dark" href="/#locais">Ver locais de atendimento <Arrow /></a></section>
      </main>
      <JsonLd data={schema}/>
    </PublicShell>
  );
}