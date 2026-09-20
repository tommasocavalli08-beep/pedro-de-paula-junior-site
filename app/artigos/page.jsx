import Link from 'next/link';
import { SITE_URL } from '@/app/data';
import { getEditorialContent } from '@/lib/editorial';
import { Arrow, PublicShell } from '@/app/ui';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Artigos sobre Saúde Digestiva',
  description: 'Conteúdos do Dr. Pedro de Paula Junior sobre cirurgia digestiva, endoscopia, colonoscopia, prevenção e saúde gastrointestinal.',
  alternates: { canonical: `${SITE_URL}/artigos` },
};

function formatDate(value) {
  if (!value) return 'Conteúdo médico';
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
}

export default async function ArticlesPage() {
  const editorial = await getEditorialContent({ fresh: true });
  const articles = [...editorial.articles].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return (
    <PublicShell>
      <main id="conteudo" className="articles-page">
        <section className="articles-hero section-pad" data-reveal>
          <p className="eyebrow"><span /> Conteúdo médico</p>
          <h1>Informação clara sobre <em>saúde digestiva.</em></h1>
          <p>Textos educativos para ajudar pacientes a compreender sintomas, exames, prevenção e opções de tratamento. Não substituem avaliação individual.</p>
        </section>
        <section className="articles-list section-pad">
          {articles.length > 0 ? articles.map((article) => (
            <Link className="article-card" href={`/artigos/${article.slug}`} key={article.slug} data-reveal>
              <div className="article-meta"><span>{article.category}</span><time>{formatDate(article.date)}</time></div>
              <h2>{article.title}</h2>
              <p>{article.description || article.intro}</p>
              <span className="article-read">Ler artigo <Arrow /></span>
            </Link>
          )) : (
            <div className="articles-empty" data-reveal>
              <span>Em preparação</span>
              <h2>Novos conteúdos serão publicados aqui.</h2>
              <p>Enquanto isso, consulte as páginas de serviços para informações sobre cirurgia digestiva, endoscopia, colonoscopia e saúde gastrointestinal.</p>
              <Link className="btn btn-dark" href="/#atuacao">Ver áreas de atuação <Arrow /></Link>
            </div>
          )}
        </section>
      </main>
    </PublicShell>
  );
}