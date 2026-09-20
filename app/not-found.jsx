import Link from 'next/link';
import { PublicShell } from './ui';
export default function NotFound() { return <PublicShell><main id="conteudo" className="not-found section-pad"><span>404</span><h1>Página não encontrada.</h1><p>O endereço pode ter mudado ou não existir.</p><Link className="btn btn-dark" href="/">Voltar ao início</Link></main></PublicShell>; }