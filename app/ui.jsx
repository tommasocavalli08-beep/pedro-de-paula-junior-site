import Link from 'next/link';
import { doctor, locations } from './data';

export function Arrow() { return <span className="arrow-glyph" aria-hidden="true">↗</span>; }

export function Brand({ compact = false }) {
  return (
    <Link href="/" className={`brand ${compact ? 'compact' : ''}`} aria-label="Dr. Pedro de Paula Junior — início">
      <span className="brand-mark">P</span>
      <span className="brand-copy">
        <strong>Dr. Pedro de Paula Junior</strong>
        <small>Cirurgia Digestiva</small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Navegação principal">
        <Link href="/#atuacao">Atuação</Link>
        <Link href="/#sobre">Sobre</Link>
        <Link href="/#exames">Exames</Link>
        <Link href="/artigos">Conteúdos</Link>
        <Link href="/#locais">Locais</Link>
      </nav>
      <div className="header-actions">
        <details className="mobile-menu">
          <summary aria-label="Abrir menu">Menu</summary>
          <div className="mobile-menu-panel">
            <Link href="/#atuacao">Atuação</Link>
            <Link href="/#sobre">Sobre</Link>
            <Link href="/#exames">Exames</Link>
            <Link href="/artigos">Conteúdos</Link>
            <Link href="/#locais">Locais</Link>
          </div>
        </details>
        <a className="header-cta" href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">Agendar <Arrow /></a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Brand compact />
          <p className="footer-note">Informações profissionais e educacionais. O conteúdo deste site não substitui consulta médica individual.</p>
        </div>
        <div>
          <span className="footer-kicker">Registro profissional</span>
          <p>{doctor.crmSP}<br/>{doctor.crmMG}<br/>{doctor.rqe}</p>
        </div>
        <div>
          <span className="footer-kicker">Contato</span>
          <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
          <a href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer">Santa Fé: {locations.santaFe.phoneDisplay}</a>
          <a href={locations.iturama.whatsapp} target="_blank" rel="noreferrer">Iturama: {locations.iturama.phoneDisplay}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Dr. Pedro de Paula Junior</span>
        <a href="https://www.nova-web.it/" target="_blank" rel="noreferrer">Made by <strong>NovaWeb</strong></a>
      </div>
    </footer>
  );
}

export function MobileContact() {
  return (
    <div className="mobile-contact" aria-label="Atalhos de contato">
      <a href={locations.santaFe.whatsapp} target="_blank" rel="noreferrer"><span>SP</span> Santa Fé · WhatsApp</a>
      <a href={locations.iturama.whatsapp} target="_blank" rel="noreferrer"><span>MG</span> Iturama · WhatsApp</a>
    </div>
  );
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function PublicShell({ children }) {
  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <SiteHeader />
      {children}
      <Footer />
      <MobileContact />
    </>
  );
}