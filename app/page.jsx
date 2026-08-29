'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { SITE_URL } from './data';

const whatsappSantaFe = 'https://wa.me/551736315442?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20com%20o%20Dr.%20Pedro.';
const whatsappIturama = 'https://wa.me/553434119900?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20exames%20com%20o%20Dr.%20Pedro.';

const faqs = [
  ['Quais problemas são avaliados pelo cirurgião digestivo?', 'O Dr. Pedro avalia doenças do aparelho digestivo e condições com possível indicação cirúrgica, incluindo hérnias, doenças da vesícula, refluxo, gastrites, úlceras, alterações intestinais e doenças anorretais. A conduta é definida após avaliação individual.'],
  ['Onde o Dr. Pedro atende?', 'As consultas são realizadas em Santa Fé do Sul (SP), na Clínica Due Vascolare, Rua Cinco, 1198, Centro. Em Iturama (MG), os exames são realizados no Hospital Nossa Senhora Aparecida, Rua Ituiutaba, 712, Centro.'],
  ['O Dr. Pedro realiza cirurgia videolaparoscópica?', 'Sim. A cirurgia videolaparoscópica integra sua área de atuação. A indicação depende do diagnóstico, das condições clínicas e da avaliação médica de cada paciente.'],
  ['Quais exames digestivos são realizados?', 'Entre os exames informados estão endoscopia digestiva alta, colonoscopia e teste de hidrogênio expirado para investigação de intolerâncias alimentares, intolerância à lactose e SIBO.'],
  ['Como agendar uma consulta ou exame?', 'Escolha Santa Fé do Sul ou Iturama na seção de locais e fale diretamente com a recepção pelo WhatsApp ou telefone. A equipe orientará sobre disponibilidade e preparo, quando necessário.']
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty('--scroll-y', `${y}px`);
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const speed = Number(el.dataset.parallax || 0.06);
        el.style.setProperty('--parallax-y', `${center * speed}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const hero = heroRef.current;
    const onMove = (e) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      hero.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    hero?.addEventListener('pointermove', onMove);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      hero?.removeEventListener('pointermove', onMove);
    };
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL,
        name: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva', inLanguage: 'pt-BR'
      },
      {
        '@type': ['Physician', 'Person'], '@id': `${SITE_URL}/#dr-pedro`,
        name: 'Dr. Pedro de Paula Junior', jobTitle: 'Cirurgião Geral e do Aparelho Digestivo',
        description: 'Cirurgião geral e do aparelho digestivo com atuação em cirurgia videolaparoscópica, endoscopia e colonoscopia em Santa Fé do Sul (SP) e Iturama (MG).',
        image: `${SITE_URL}/images/pedro-portrait.webp`,
        medicalSpecialty: ['https://schema.org/Gastroenterologic', 'https://schema.org/Surgical'],
        knowsAbout: ['Cirurgia Geral', 'Cirurgia do Aparelho Digestivo', 'Cirurgia Videolaparoscópica', 'Endoscopia Digestiva Alta', 'Colonoscopia'],
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Faculdade de Medicina de São José do Rio Preto (Famerp)' },
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'CRM-SP', identifier: '112723' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'CRM-MG', identifier: '47662' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'RQE', identifier: '28023 / 28024' }
        ]
      },
      {
        '@type': 'MedicalClinic', '@id': `${SITE_URL}/#santa-fe`, name: 'Consultório Dr. Pedro de Paula Junior — Santa Fé do Sul',
        address: { '@type': 'PostalAddress', streetAddress: 'Rua Cinco, 1198', addressLocality: 'Santa Fé do Sul', addressRegion: 'SP', postalCode: '15775-041', addressCountry: 'BR' },
        telephone: '+55 17 3631-5442', email: 'pedropaulaj@gmail.com', employee: { '@id': `${SITE_URL}/#dr-pedro` }
      },
      {
        '@type': 'Hospital', '@id': `${SITE_URL}/#iturama`, name: 'Hospital Nossa Senhora Aparecida',
        address: { '@type': 'PostalAddress', streetAddress: 'Rua Ituiutaba, 712', addressLocality: 'Iturama', addressRegion: 'MG', postalCode: '38280-000', addressCountry: 'BR' },
        telephone: '+55 34 3411-9900', email: 'recepcao@hospitalnsa.com.br'
      },
      {
        '@type': 'FAQPage', '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
      }
    ]
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="nav-shell">
        <a className="brand" href="#inicio" aria-label="Dr. Pedro — início">
          <span className="brand-symbol">P</span>
          <span><strong>Dr. Pedro</strong><small>Cirurgia Digestiva</small></span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#atuacao">Atuação</a><a href="#sobre">Sobre</a><a href="#exames">Exames</a><a href="#locais">Onde atende</a>
        </nav>
        <a className="nav-cta" href="#locais">Agendar <Arrow /></a>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio" ref={heroRef}>
          <div className="hero-orb orb-one" aria-hidden="true" /><div className="hero-orb orb-two" aria-hidden="true" />
          <div className="hero-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Santa Fé do Sul · Iturama</p>
            <h1><span>Precisão para</span> <em>investigar.</em><br/><span>Experiência para</span> <em>tratar.</em></h1>
            <p className="hero-lead">Cirurgia geral e do aparelho digestivo, endoscopia e colonoscopia com escuta atenta, explicações claras e cuidado em cada etapa.</p>
            <div className="hero-actions">
              <a className="button primary" href="#locais">Agendar avaliação <Arrow /></a>
              <a className="button soft" href="#atuacao">Conhecer a atuação</a>
            </div>
            <div className="credentials">
              <span>CRM-SP 112723</span><span>CRM-MG 47662</span><span>RQE 28023 · 28024</span>
            </div>
          </div>
          <div className="hero-visual" data-reveal data-parallax="0.035">
            <div className="portrait-wrap">
              <Image src="/images/pedro-portrait.webp" alt="Dr. Pedro de Paula Junior" fill priority sizes="(max-width: 760px) 92vw, 42vw" className="cover" />
              <div className="portrait-wash" />
            </div>
            <div className="float-card card-top"><small>Formação</small><strong>FAMERP · 2003</strong></div>
            <div className="float-card card-bottom"><span className="pulse-dot"/><strong>Cirurgia · Endoscopia · Colonoscopia</strong></div>
          </div>
        </section>

        <div className="marquee" aria-label="Áreas de atuação">
          <div className="marquee-track">
            {[0,1].map((loop) => <div className="marquee-set" key={loop} aria-hidden={loop === 1}>
              <span>Cirurgia videolaparoscópica</span><i>✦</i><span>Endoscopia digestiva</span><i>✦</i><span>Colonoscopia</span><i>✦</i><span>Saúde gastrointestinal</span><i>✦</i>
            </div>)}
          </div>
        </div>

        <section className="section intro-section" id="atuacao">
          <div className="section-head" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot"/> Áreas de atuação</p>
            <h2>Do diagnóstico ao tratamento, <em>sem atalhos.</em></h2>
            <p>Uma abordagem integrada para problemas cirúrgicos e doenças gastrointestinais, com indicação individual e comunicação clara.</p>
          </div>
          <div className="service-grid">
            {[
              ['01','Cirurgia geral e digestiva','Hérnias, vesícula, estômago e intestino, com videolaparoscopia quando indicada.','/servicos/cirurgia-digestiva','sage'],
              ['02','Endoscopia digestiva alta','Investigação do esôfago, estômago e duodeno, além de procedimentos terapêuticos.','/servicos/endoscopia-digestiva','ivory'],
              ['03','Colonoscopia','Avaliação do cólon, prevenção, diagnóstico e remoção de pólipos quando indicada.','/servicos/colonoscopia','clay'],
              ['04','Saúde gastrointestinal','Refluxo, gastrites, úlceras, alterações intestinais, disbiose e SIBO.','/servicos/saude-gastrointestinal','mist']
            ].map(([n,title,text,href,tone],i) => (
              <Link href={href} className={`service-card ${tone}`} data-reveal key={title} style={{'--delay': `${i*80}ms`}}>
                <span className="service-num">{n}</span><h3>{title}</h3><p>{text}</p><span className="card-link">Conhecer <Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="story-section" id="sobre">
          <div className="story-image" data-reveal data-parallax="0.045">
            <div className="organic-image landscape">
              <Image src="/images/pedro-consultation.webp" alt="Dr. Pedro de Paula Junior durante atendimento em consultório" fill sizes="(max-width: 800px) 92vw, 50vw" className="cover" />
            </div>
            <span className="image-caption">Cuidado próximo · decisão compartilhada</span>
          </div>
          <div className="story-copy" data-reveal>
            <p className="eyebrow light"><span className="eyebrow-dot"/> Sobre o médico</p>
            <h2>Técnica sólida.<br/><em>Presença humana.</em></h2>
            <p className="story-lead">“Cuidar de alguém vai muito além da técnica: é estar presente, ouvir com atenção e explicar cada etapa com clareza.”</p>
            <p>O Dr. Pedro de Paula Junior é cirurgião geral e do aparelho digestivo. Formado pela Famerp em 2003, completou residência em Cirurgia Geral, residência em Cirurgia do Aparelho Digestivo e período dedicado à endoscopia e colonoscopia.</p>
            <div className="mini-stats"><div><strong>2003</strong><span>Graduação FAMERP</span></div><div><strong>5 anos</strong><span>Residências + endoscopia</span></div></div>
          </div>
        </section>

        <section className="section split-care" id="procedimentos">
          <div className="split-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot"/> Cirurgia e tratamento</p>
            <h2>Experiência quando a decisão precisa ser <em>precisa.</em></h2>
            <p>A indicação cirúrgica é construída a partir do diagnóstico e do perfil de cada paciente. Quando a cirurgia é necessária, a técnica é escolhida de forma individual.</p>
            <ul className="check-list">
              <li>Hérnias da parede abdominal</li><li>Cirurgia de vesícula</li><li>Cirurgias do estômago e intestino</li><li>Doenças anorretais</li><li>Pequenas cirurgias</li>
            </ul>
            <Link className="text-link" href="/servicos/cirurgia-digestiva">Ver cirurgia digestiva <Arrow /></Link>
          </div>
          <div className="split-image" data-reveal data-parallax="0.055">
            <div className="organic-image surgery"><Image src="/images/pedro-surgery.webp" alt="Dr. Pedro de Paula Junior em ambiente cirúrgico" fill sizes="(max-width: 800px) 92vw, 44vw" className="cover" /></div>
            <div className="image-badge"><span>01</span><p>Cirurgia<br/><strong>videolaparoscópica</strong></p></div>
          </div>
        </section>

        <section className="exam-section" id="exames">
          <div className="exam-photo" data-reveal data-parallax="0.04">
            <Image src="/images/pedro-endoscopy.webp" alt="Dr. Pedro de Paula Junior durante procedimento endoscópico" fill sizes="(max-width: 900px) 100vw, 46vw" className="cover" />
          </div>
          <div className="exam-content" data-reveal>
            <p className="eyebrow light"><span className="eyebrow-dot"/> Exames digestivos</p>
            <h2>Ver o que os sintomas <em>nem sempre mostram.</em></h2>
            <p>Exames diagnósticos e terapêuticos para investigar o trato gastrointestinal, acompanhar alterações e apoiar a prevenção.</p>
            <div className="exam-links">
              <Link href="/servicos/endoscopia-digestiva"><span>01</span><div><strong>Endoscopia Digestiva Alta</strong><small>Esôfago · estômago · duodeno</small></div><Arrow /></Link>
              <Link href="/servicos/colonoscopia"><span>02</span><div><strong>Colonoscopia</strong><small>Cólon · prevenção · polipectomia</small></div><Arrow /></Link>
              <div className="exam-static"><span>03</span><div><strong>Teste de Hidrogênio Expirado</strong><small>Intolerâncias · lactose · SIBO</small></div></div>
            </div>
          </div>
        </section>

        <section className="section locations" id="locais">
          <div className="section-head wide" data-reveal><p className="eyebrow"><span className="eyebrow-dot"/> Onde atende</p><h2>Duas cidades.<br/><em>O mesmo cuidado.</em></h2></div>
          <div className="location-grid">
            <article className="location-card santa" data-reveal>
              <div className="location-top"><span>01 / SP</span><span>Consultório</span></div><h3>Santa Fé do Sul</h3>
              <p>Clínica Due Vascolare<br/>Rua Cinco, 1198 — Centro<br/>CEP 15775-041</p>
              <div className="location-actions"><a href={whatsappSantaFe} target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="tel:+551736315442">17 3631-5442</a><a href="https://www.google.com/maps/search/?api=1&query=Rua%20Cinco%2C%201198%2C%20Centro%2C%20Santa%20F%C3%A9%20do%20Sul%20-%20SP%2C%2015775-041" target="_blank" rel="noreferrer">Ver mapa</a></div>
            </article>
            <article className="location-card iturama" data-reveal>
              <div className="location-top"><span>02 / MG</span><span>Exames</span></div><h3>Iturama</h3>
              <p>Hospital Nossa Senhora Aparecida<br/>Rua Ituiutaba, 712 — Centro<br/>CEP 38280-000</p>
              <div className="location-actions"><a href={whatsappIturama} target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="tel:+553434119900">34 3411-9900</a><a href="https://www.google.com/maps/search/?api=1&query=Hospital%20Nossa%20Senhora%20Aparecida%2C%20Rua%20Ituiutaba%2C%20712%2C%20Iturama%20-%20MG" target="_blank" rel="noreferrer">Ver mapa</a></div>
            </article>
          </div>
        </section>

        <section className="section faq-section" id="duvidas">
          <div className="faq-heading" data-reveal><p className="eyebrow"><span className="eyebrow-dot"/> Dúvidas frequentes</p><h2>Informação clara também faz parte do <em>cuidado.</em></h2></div>
          <div className="faq-list" data-reveal>{faqs.map(([q,a],i)=><details key={q}><summary><span>{String(i+1).padStart(2,'0')}</span><strong>{q}</strong><i>+</i></summary><p>{a}</p></details>)}</div>
        </section>

        <section className="final-cta" data-reveal>
          <div className="final-orb" aria-hidden="true"/>
          <p className="eyebrow light"><span className="eyebrow-dot"/> Dê o primeiro passo</p>
          <h2>Escolha a cidade.<br/><em>Fale com a recepção.</em></h2>
          <div className="final-actions"><a href={whatsappSantaFe} target="_blank" rel="noreferrer">Santa Fé do Sul <Arrow /></a><a href={whatsappIturama} target="_blank" rel="noreferrer">Iturama <Arrow /></a></div>
        </section>
      </main>

      <footer>
        <div className="footer-main"><div className="footer-brand"><span className="brand-symbol">P</span><div><strong>Dr. Pedro de Paula Junior</strong><p>Cirurgião Geral e do Aparelho Digestivo</p></div></div><div className="footer-meta"><p>CRM-SP 112723 · CRM-MG 47662</p><p>RQE 28023 · RQE 28024</p></div><div className="footer-contact"><a href="mailto:pedropaulaj@gmail.com">pedropaulaj@gmail.com</a><a href="mailto:recepcao@hospitalnsa.com.br">recepcao@hospitalnsa.com.br</a></div></div>
        <div className="footer-bottom"><p>As informações deste site têm caráter educativo e não substituem a avaliação médica individual. Em caso de urgência, procure um serviço de emergência.</p><p>© 2026 Dr. Pedro de Paula Junior · Desenvolvido por NovaWeb Studio</p></div>
      </footer>
      <div className="mobile-contact"><a href={whatsappSantaFe} target="_blank" rel="noreferrer">Santa Fé</a><a href={whatsappIturama} target="_blank" rel="noreferrer">Iturama</a></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
