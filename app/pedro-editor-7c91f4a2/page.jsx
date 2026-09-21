'use client';

import { useEffect, useMemo, useState } from 'react';

const LOCAL_BACKUP_KEY = 'pedro-editorial-backup-v1';

const blankArticle = () => ({
  slug: '', title: '', category: 'Saúde digestiva', date: new Date().toISOString().slice(0, 10), description: '', intro: '', coverImage: '', videoUrl: '', sections: [{ heading: '', text: '' }], faq: [],
});

function slugify(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);
}

export default function EditorPage() {
  const [data, setData] = useState({ practical: { santaFeHours: '', ituramaHours: '' }, articles: [] });
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(blankArticle());
  const [status, setStatus] = useState('Carregando conteúdo…');
  const [saving, setSaving] = useState(false);
  const [storageReady, setStorageReady] = useState(null);

  async function load() {
    try {
      const res = await fetch('/api/editor/content', { cache: 'no-store' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Falha ao carregar');
      setStorageReady(Boolean(json.storageReady));

      let nextData = json.data;
      try {
        const local = JSON.parse(window.localStorage.getItem(LOCAL_BACKUP_KEY) || 'null');
        if (json.data.articles.length === 0 && local?.articles?.length > 0) {
          nextData = local;
          setStatus('Rascunho recuperado deste navegador. Ainda não está publicado no site.');
        } else {
          setStatus(json.storageReady ? 'Conteúdo carregado e armazenamento conectado.' : 'Editor carregado, mas a publicação está desconectada.');
        }
      } catch {
        setStatus(json.storageReady ? 'Conteúdo carregado.' : 'Editor carregado, mas a publicação está desconectada.');
      }
      setData(nextData);
    } catch (e) { setStatus(e.message); }
  }

  useEffect(() => { load(); }, []);

  const hasSelection = selected !== null && selected >= 0 && selected < data.articles.length;
  const wordCount = useMemo(() => [draft.intro, ...(draft.sections || []).map(s => s.text)].join(' ').trim().split(/\s+/).filter(Boolean).length, [draft]);

  function choose(index) { setSelected(index); setDraft(JSON.parse(JSON.stringify(data.articles[index]))); setStatus('Editando artigo existente.'); }
  function newArticle() { setSelected(-1); setDraft(blankArticle()); setStatus('Novo artigo.'); }
  function patch(field, value) { setDraft((prev) => ({ ...prev, [field]: value, ...(field === 'title' && !prev.slug ? { slug: slugify(value) } : {}) })); }
  function patchSection(index, field, value) { setDraft((prev) => ({ ...prev, sections: prev.sections.map((item, i) => i === index ? { ...item, [field]: value } : item) })); }
  function patchFaq(index, field, value) { setDraft((prev) => ({ ...prev, faq: prev.faq.map((item, i) => i === index ? { ...item, [field]: value } : item) })); }

  function applyDraft() {
    if (!draft.title.trim()) { setStatus('Adicione um título antes de aplicar.'); return null; }
    const article = { ...draft, slug: slugify(draft.slug || draft.title) };
    const articles = [...data.articles];
    if (selected === -1) articles.unshift(article); else if (hasSelection) articles[selected] = article;
    const next = { ...data, articles };
    setData(next);
    try { window.localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(next)); } catch {}
    setSelected(articles.indexOf(article));
    setDraft(article);
    return next;
  }

  async function save(nextData = null) {
    const payload = nextData || applyDraft() || data;
    setSaving(true); setStatus('Salvando e publicando…');
    try {
      const res = await fetch('/api/editor/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.ok || !json.verified) {
        const message = [json.error, json.detail].filter(Boolean).join(' ');
        throw new Error(message || 'Falha ao salvar');
      }
      setStorageReady(true);
      setData(json.data);
      try { window.localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(json.data)); } catch {}
      setStatus(`Publicado e verificado. ${json.data.articles.length} artigo(s) disponível(is) no site.`);
    } catch (e) {
      setStorageReady(false);
      try { window.localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(payload)); } catch {}
      setStatus(`NÃO PUBLICADO — ${e.message} O conteúdo ficou salvo como rascunho neste navegador.`);
    }
    finally { setSaving(false); }
  }

  async function deleteArticle(index) {
    const article = data.articles[index];
    if (!window.confirm(`Excluir “${article.title}”?`)) return;
    const articles = data.articles.filter((_, i) => i !== index);
    const next = { ...data, articles };
    setData(next); setSelected(null); setDraft(blankArticle());
    await save(next);
  }

  return (
    <main className="editor-app">
      <header className="editor-topbar">
        <div><span className="editor-dot"/><strong>Editor · Dr. Pedro</strong><small>acesso direto · não indexado</small></div>
        <div className="editor-status" aria-live="polite">{status}</div>
        <a href="/" target="_blank" rel="noreferrer">Abrir site ↗</a>
      </header>

      <div className={`editor-warning ${storageReady === false ? 'editor-warning-error' : ''}`}>
        <strong>{storageReady === false ? 'Publicação desconectada.' : 'Link reservado.'}</strong>{' '}
        {storageReady === false
          ? 'Os rascunhos ficam preservados neste navegador, mas não aparecem no site até o armazenamento ser conectado.'
          : 'Esta área não tem login por solicitação do proprietário. Qualquer pessoa com este endereço consegue editar o conteúdo; não compartilhe o link.'}
      </div>

      <div className="editor-layout">
        <aside className="editor-sidebar">
          <button className="editor-new" onClick={newArticle}>＋ Novo artigo</button>
          <div className="editor-list-head"><span>Artigos</span><b>{data.articles.length}</b></div>
          <div className="editor-list">
            {data.articles.length === 0 && <p>Nenhum artigo publicado.</p>}
            {data.articles.map((article, index) => <div className={`editor-list-item ${selected === index ? 'active' : ''}`} key={`${article.slug}-${index}`}><button onClick={() => choose(index)}><span>{article.category}</span><strong>{article.title}</strong><small>{article.date || 'Sem data'}</small></button><button className="editor-delete" onClick={() => deleteArticle(index)} aria-label={`Excluir ${article.title}`}>×</button></div>)}
          </div>
          <div className="editor-practical">
            <h3>Informações práticas</h3>
            <label>Horário Santa Fé<input value={data.practical?.santaFeHours || ''} onChange={(e) => setData(prev => ({ ...prev, practical: { ...prev.practical, santaFeHours: e.target.value } }))}/></label>
            <label>Horário Iturama<input value={data.practical?.ituramaHours || ''} onChange={(e) => setData(prev => ({ ...prev, practical: { ...prev.practical, ituramaHours: e.target.value } }))}/></label>
            <button onClick={() => save(data)} disabled={saving}>Salvar horários</button>
          </div>
        </aside>

        <section className="editor-canvas">
          {selected === null ? <div className="editor-empty"><span>P</span><h1>Editor de conteúdo</h1><p>Selecione um artigo ou crie um novo conteúdo. As alterações são publicadas no site assim que você salva.</p></div> : <>
            <div className="editor-titlebar"><div><span>{selected === -1 ? 'Novo conteúdo' : 'Editar conteúdo'}</span><h1>{draft.title || 'Sem título'}</h1></div><div><span className="editor-words">{wordCount} palavras</span><button className="editor-save" onClick={() => save()} disabled={saving}>{saving ? 'Publicando…' : 'Salvar e publicar'}</button></div></div>

            <div className="editor-form">
              <div className="editor-grid two">
                <label>Título<input value={draft.title} onChange={(e) => patch('title', e.target.value)} placeholder="Ex.: Colonoscopia: quando fazer?"/></label>
                <label>Slug<input value={draft.slug} onChange={(e) => patch('slug', slugify(e.target.value))} placeholder="colonoscopia-quando-fazer"/></label>
              </div>
              <div className="editor-grid two-small">
                <label>Categoria<input value={draft.category} onChange={(e) => patch('category', e.target.value)}/></label>
                <label>Data<input type="date" value={draft.date} onChange={(e) => patch('date', e.target.value)}/></label>
              </div>
              <label>Descrição SEO<textarea rows="3" value={draft.description} onChange={(e) => patch('description', e.target.value)} placeholder="Resumo objetivo que aparecerá no Google e na lista de artigos."/></label>
              <label>Introdução<textarea rows="5" value={draft.intro} onChange={(e) => patch('intro', e.target.value)} placeholder="Introdução do artigo…"/></label>
              <div className="editor-grid two">
                <label>Imagem de capa (URL)<input value={draft.coverImage} onChange={(e) => patch('coverImage', e.target.value)} placeholder="https://…"/></label>
                <label>Vídeo YouTube (URL)<input value={draft.videoUrl} onChange={(e) => patch('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=…"/></label>
              </div>

              <div className="editor-block-head"><div><span>Corpo do artigo</span><h2>Seções</h2></div><button onClick={() => setDraft(prev => ({ ...prev, sections: [...prev.sections, { heading: '', text: '' }] }))}>＋ Adicionar seção</button></div>
              <div className="editor-repeater">{draft.sections.map((section, index) => <div className="editor-repeat" key={index}><div className="editor-repeat-top"><strong>Seção {index + 1}</strong>{draft.sections.length > 1 && <button onClick={() => setDraft(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }))}>Remover</button>}</div><label>Subtítulo<input value={section.heading} onChange={(e) => patchSection(index, 'heading', e.target.value)}/></label><label>Texto<textarea rows="8" value={section.text} onChange={(e) => patchSection(index, 'text', e.target.value)} placeholder="Use uma linha em branco para separar parágrafos."/></label></div>)}</div>

              <div className="editor-block-head"><div><span>SEO + respostas rápidas</span><h2>FAQ do artigo</h2></div><button onClick={() => setDraft(prev => ({ ...prev, faq: [...prev.faq, { q: '', a: '' }] }))}>＋ Adicionar pergunta</button></div>
              <div className="editor-repeater">{draft.faq.length === 0 && <p className="editor-muted">Opcional. Perguntas claras ajudam pacientes e mecanismos de busca a entender o conteúdo.</p>}{draft.faq.map((item, index) => <div className="editor-repeat compact" key={index}><div className="editor-repeat-top"><strong>Pergunta {index + 1}</strong><button onClick={() => setDraft(prev => ({ ...prev, faq: prev.faq.filter((_, i) => i !== index) }))}>Remover</button></div><label>Pergunta<input value={item.q} onChange={(e) => patchFaq(index, 'q', e.target.value)}/></label><label>Resposta<textarea rows="4" value={item.a} onChange={(e) => patchFaq(index, 'a', e.target.value)}/></label></div>)}</div>

              <div className="editor-footer-save"><button className="editor-save" onClick={() => save()} disabled={saving}>{saving ? 'Publicando…' : 'Salvar e publicar'}</button></div>
            </div>
          </>}
        </section>
      </div>
    </main>
  );
}