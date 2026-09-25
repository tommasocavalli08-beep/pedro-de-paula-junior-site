import Image from 'next/image';
import Link from 'next/link';
import { featuredServiceSlugs, homeFaq, locations, services, SITE_URL, doctor } from './data';
import { getEditorialContent } from '@/lib/editorial';
import { Arrow, JsonLd, PublicShell } from './ui';

const physicianSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${doctor.name} | Cirurgia Digestiva`,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#physician` },
    },
    {
      '@type': ['Physician', 'Person'],
      '@id': `${SITE_URL}/#physician`,
      name: doctor.name,
      url: SITE_URL,
      image: `${SITE_URL}/images/pedro-portrait.webp`,
      email: doctor.email,
      jobTitle: 'Cirurgião Geral e do Aparelho Digestivo',
      description: 'Cirurgião geral e do aparelho digestivo com atuação em cirurgia videolaparoscópica, endoscopia e colonoscopia.',
      medicalSpecialty: ['https://schema.org/Surgical', 'https://schema.org/Gastroenterologic'],
      areaServed: [
        { '@type': 'City', name: 'Santa Fé do Sul', containedInPlace: { '@type': 'State', name: 'São Paulo' } },
        { '@type': 'City', name: 'Iturama', containedInPlace: { '@type': 'State', name: 'Minas Gerais' } },
      ],
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'FAMERP — Faculdade de Medicina de São José do Rio Preto' },
      knowsAbout: [
        'Cirurgia do aparelho digestivo', 'Cirurgia videolaparoscópica', 'Endoscopia digestiva alta', 'Colonoscopia',
        'Hérnias da parede abdominal', 'Doenças da vesícula biliar', 'SIBO', 'Doenças anorretais'
      ],
    },
    {
      '@type': 'MedicalClinic',
      '@id': `${SITE_URL}/#santa-fe`,
      name: `${doctor.name} — Consultório em Santa Fé do Sul`,
      url: `${SITE_URL}/santa-fe-do-sul`,
      telephone: locations.santaFe.phoneE164,
      email: doctor.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: locations.santaFe.streetAddress,
        addressLocality: locations.santaFe.locality,
        addressRegion: locations.santaFe.region,
        postalCode: locations.santaFe.postalCode,
        addressCountry: 'BR',
      },
      availableService: featuredServiceSlugs.map((slug) => ({ '@type': 'MedicalProcedure', name: services[slug].title })),
      employee: { '@id': `${SITE_URL}/#physician` },
    },
    {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_URL}/#iturama`,
      name: `${doctor.name} — Exames em Iturama`,
      url: `${SITE_URL}/iturama`,
      telephone: locations.iturama.phoneE164,
      address: {
        '@type': 'PostalAddress',
        streetAddress: locations.iturama.streetAddress,
        addressLocality: locations.iturama.locality,
        addressRegion: locations.iturama.region,
        postalCode: locations.iturama.postalCode,
        addressCountry: 'BR',
      },
      member: { '@id': `${SITE_URL}/#physician` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: homeFaq.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
};

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return 'Conteúdo médico';
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export default async function Home() {
  const editorial = await getEditorialContent({ fresh: true });
  const featuredArticles = [...editorial.articles]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 4);
  return (
    <PublicShell>
      <main id="conteudo">
        <section className="hero-home section-pad" id="inicio">
          <div className="hero-backdrop hero-backdrop-a" />
          <div className="hero-backdrop hero-backdrop-b" />
          <div className="hero-home-copy" data-reveal>
            <p className="eyebrow"><span /> Cirurgia digestiva · Endoscopia · Colonoscopia</p>
            <h1>Entenda a causa dos sintomas e cuide da sua <em>saúde digestiva com segurança.</em></h1>
            <p className="hero-lead">Dor, refluxo, alterações intestinais ou a necessidade de um exame podem gerar dúvidas. Aqui, cada caso é avaliado com explicações claras, investigação criteriosa e orientação individual.</p>
            <div className="hero-actions">
              <a className="btn btn-dark" href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">Falar com a recepção no WhatsApp <Arrow /></a>
              <a className="btn btn-ghost" href="#atuacao">Ver áreas de atuação</a>
            </div>
            <div className="credential-row" aria-label="Registros profissionais">
              <span>{doctor.crmSP}</span><span>{doctor.crmMG}</span><span>{doctor.rqe}</span>
            </div>
          </div>
          <div className="hero-home-visual" data-reveal>
            <div className="hero-photo-frame">
              <Image src="/images/pedro-portrait.webp" alt="Dr. Pedro de Paula Junior" fill priority sizes="(max-width: 860px) 92vw, 43vw" className="cover" />
            </div>
            <div className="hero-card hero-card-top"><span>Formação médica</span><strong>FAMERP · 2003</strong></div>
            <div className="hero-card hero-card-bottom"><span className="status-dot"/><strong>Santa Fé do Sul · Iturama</strong></div>
          </div>
        </section>

        <div className="trust-strip" aria-label="Principais áreas">
          <div><span>Cirurgia videolaparoscópica</span><i>✦</i><span>Endoscopia digestiva</span><i>✦</i><span>Colonoscopia</span><i>✦</i><span>Saúde gastrointestinal</span><i>✦</i><span>Cirurgia de hérnias</span></div>
        </div>

        <section className="section-pad section-light" id="atuacao">
          <div className="section-heading" data-reveal>
            <p className="eyebrow"><span /> Áreas de atuação</p>
            <div className="heading-split"><h2>Avaliação, exames e tratamento com <em>clareza em cada etapa.</em></h2><p>Consulta, investigação e cirurgia são organizadas de acordo com o diagnóstico e o contexto clínico de cada paciente.</p></div>
          </div>
          <div className="services-grid">
            {featuredServiceSlugs.map((slug, index) => {
              const service = services[slug];
              return (
                <Link href={`/servicos/${slug}`} className={`service-card service-tone-${(index % 3) + 1}`} data-reveal key={slug}>
                  <span className="service-index">0{index + 1}</span>
                  <div><p>{service.eyebrow}</p><h3>{service.short}</h3><span className="service-arrow"><Arrow /></span></div>
                  <p>{service.summary}</p>
                </Link>
              );
            })}
          </div>
          <div className="services-more" data-reveal><Link href="/servicos/cirurgia-de-vesicula">Cirurgia de vesícula</Link><Link href="/servicos/refluxo-gastrite-ulceras">Refluxo, gastrites e úlceras</Link><Link href="/servicos/teste-hidrogenio-expirado">Teste de hidrogênio expirado</Link></div>
        </section>

        <section className="home-articles section-pad" id="artigos">
          <div className="home-articles-head" data-reveal>
            <div>
              <p className="eyebrow"><span /> Conteúdo médico</p>
              <h2>Artigos para entender melhor sua <em>saúde digestiva.</em></h2>
            </div>
            <div>
              <p>Informações objetivas sobre sintomas, exames, prevenção e tratamentos.</p>
              <Link className="text-link" href="/artigos">Ver todos os artigos <Arrow /></Link>
            </div>
          </div>
          <div className="home-articles-grid">
            {featuredArticles.map((article, index) => (
              <Link className="home-article-card" href={`/artigos/${article.slug}`} key={article.slug} data-reveal>
                <div className="home-article-number">0{index + 1}</div>
                <div className="home-article-meta">
                  <span>{article.category}</span>
                  <time>{formatDate(article.date)}</time>
                </div>
                <h3>{article.title}</h3>
                <p>{article.description || article.intro}</p>
                <span className="home-article-link">Ler artigo <Arrow /></span>
              </Link>
            ))}
          </div>
          {featuredArticles.length === 0 && (
            <div className="home-articles-empty" data-reveal>
              <p>Novos conteúdos médicos serão publicados em breve.</p>
              <Link className="text-link" href="/artigos">Ir para conteúdos <Arrow /></Link>
            </div>
          )}
        </section>

        <section className="about-section section-pad" id="sobre">
          <div className="about-photo" data-reveal>
            <div className="about-photo-inner"><Image src="/images/pedro-consultation.webp" alt="Dr. Pedro de Paula Junior durante atendimento" fill sizes="(max-width: 860px) 92vw, 46vw" className="cover" /></div>
            <p>Escuta, clareza e decisão compartilhada.</p>
          </div>
          <div className="about-copy" data-reveal>
            <p className="eyebrow eyebrow-light"><span /> Sobre o médico</p>
            <h2>Experiência cirúrgica.<br/><em>Atendimento próximo.</em></h2>
            <p className="about-quote">Consulta com escuta, explicação do diagnóstico e orientação clara sobre os próximos passos.</p>
            <p>O Dr. Pedro de Paula Junior é cirurgião geral e do aparelho digestivo, com atuação em cirurgia videolaparoscópica, endoscopia e colonoscopia. Formou-se pela FAMERP em 2003 e realizou residências em Cirurgia Geral e Cirurgia do Aparelho Digestivo, além de período dedicado à endoscopia e colonoscopia.</p>
            <div className="formation-grid">
              <div><strong>2003</strong><span>Graduação · FAMERP</span></div>
              <div><strong>2 + 2 anos</strong><span>Residências cirúrgicas</span></div>
              <div><strong>1 ano</strong><span>Endoscopia e colonoscopia</span></div>
            </div>
          </div>
        </section>

        <section className="section-pad procedure-section" id="cirurgia">
          <div className="procedure-copy" data-reveal>
            <p className="eyebrow"><span /> Cirurgia</p>
            <h2>Avaliação cirúrgica com <em>indicação individualizada.</em></h2>
            <p>A indicação começa por uma avaliação bem feita. O objetivo é compreender a doença, revisar alternativas e definir a técnica adequada ao caso — incluindo videolaparoscopia quando indicada.</p>
            <div className="chips"><span>Hérnias</span><span>Vesícula</span><span>Estômago e intestino</span><span>Doenças anorretais</span><span>Cisto pilonidal</span></div>
            <Link className="text-link" href="/servicos/cirurgia-digestiva">Entender a cirurgia digestiva <Arrow /></Link>
          </div>
          <div className="procedure-photo" data-reveal>
            <Image src="/images/pedro-surgery.webp" alt="Dr. Pedro de Paula Junior durante procedimento cirúrgico" fill sizes="(max-width: 860px) 92vw, 45vw" className="cover" />
            <div className="photo-label"><span>Cirurgia</span><strong>Planejamento individual</strong></div>
          </div>
        </section>

        <section className="exams-section" id="exames">
          <div className="exams-photo" data-reveal><Image src="/images/pedro-endoscopy.webp" alt="Dr. Pedro de Paula Junior em sala de endoscopia" fill sizes="(max-width: 860px) 100vw, 48vw" className="cover" /></div>
          <div className="exams-copy section-pad" data-reveal>
            <p className="eyebrow eyebrow-light"><span /> Exames digestivos</p>
            <h2>Exames digestivos com <em>orientação antes e depois.</em></h2>
            <p>Endoscopia digestiva alta, colonoscopia e teste de hidrogênio expirado auxiliam na investigação de sintomas e condições gastrointestinais. Antes do exame, é importante entender o preparo, as etapas do procedimento e os cuidados posteriores.</p>
            <div className="exam-reassurance"><strong>Está apreensivo com endoscopia ou colonoscopia?</strong><p>É comum ter dúvidas sobre preparo, desconforto e segurança. A equipe orienta cada etapa previamente e pode esclarecer o que esperar de acordo com o exame e o seu perfil clínico.</p></div><div className="exams-list">
              <Link href="/servicos/endoscopia-digestiva"><span>01</span><strong>Endoscopia digestiva alta</strong><Arrow /></Link>
              <Link href="/servicos/colonoscopia"><span>02</span><strong>Colonoscopia</strong><Arrow /></Link>
              <Link href="/servicos/teste-hidrogenio-expirado"><span>03</span><strong>Teste de hidrogênio expirado</strong><Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="section-pad locations-section" id="locais">
          <div className="section-heading" data-reveal><p className="eyebrow"><span /> Onde atende</p><div className="heading-split"><h2>Consultas e exames em Santa Fé do Sul e <em>exames em Iturama.</em></h2><p>Veja os dados de cada unidade e fale diretamente com a recepção para horários, disponibilidade e orientações de preparo.</p></div></div>
          <div className="locations-grid">
            <article className="location-card location-green" data-reveal>
              <div className="location-meta"><span>SP</span><span>Consultas e exames</span></div>
              <h3>Santa Fé<br/>do Sul</h3>
              <p>{locations.santaFe.address}</p>
              <p className="location-hours">{editorial.practical.santaFeHours}</p>
              <div className="location-actions"><a href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><Link href="/santa-fe-do-sul">Ver unidade</Link></div>
            </article>
            <article className="location-card location-stone" data-reveal>
              <div className="location-meta"><span>MG</span><span>Exames</span></div>
              <h3>Iturama</h3>
              <p><strong>{locations.iturama.facility}</strong><br/>{locations.iturama.address}</p>
              <p className="location-hours">{editorial.practical.ituramaHours}</p>
              <div className="location-actions"><a href={locations.iturama.whatsapp} target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><Link href="/iturama">Ver unidade</Link></div>
            </article>
          </div>
        </section>

        <section className="section-pad faq-section" id="duvidas">
          <div className="faq-heading" data-reveal><p className="eyebrow"><span /> Dúvidas frequentes</p><h2>Informações importantes <em>antes de consultar ou realizar exames.</em></h2></div>
          <div className="faq-list" data-reveal>
            {homeFaq.map(([q, a], index) => <details key={q}><summary><span>0{index + 1}</span><strong>{q}</strong><i>+</i></summary><p>{a}</p></details>)}
          </div>
        </section>

        <section className="final-cta section-pad" data-reveal>
          <p className="eyebrow eyebrow-light"><span /> Agendamento</p>
          <h2>Precisa esclarecer sintomas ou saber <em>qual atendimento procurar?</em></h2>
          <p>Escolha a cidade e fale diretamente com a recepção pelo WhatsApp.</p>
          <div><a href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">Santa Fé do Sul <Arrow /></a><a href={locations.iturama.whatsapp} target="_blank" rel="noreferrer">Iturama <Arrow /></a></div>
        </section>
      </main>
      <JsonLd data={physicianSchema} />
    </PublicShell>
  );
}