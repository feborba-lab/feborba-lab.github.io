/*
  AULA 5 · main.js: a página ganha vida
  --------------------------------------
  Cada bloco abaixo é independente e cuida de uma parte do site.
  Padrão usado em todos: 1) achar os elementos  2) montar o HTML a partir
  dos DADOS  3) ouvir eventos (clique, rolagem, teclado) e reagir.

  Os textos vêm sempre de D(), que devolve DADOS.pt ou DADOS.en conforme o
  idioma escolhido (AULA 8, em js/i18n.js). Quando o idioma muda, cada bloco
  que monta HTML se redesenha: procure por aoTrocarIdioma(...) em cada um.
*/
(function () {
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  const L = () => (window.I18N ? I18N.lingua : 'pt');
  const D = () => window.DADOS[L()];
  const U = () => D().ui;
  const local = () => (L() === 'en' ? 'en-US' : 'pt-BR');
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aoTrocarIdioma = (fn) => document.addEventListener('lingua', fn);
  const doisDigitos = (i) => String(i + 1).padStart(2, '0');

  // Escapa texto antes de colocar dentro de innerHTML (evita HTML injetado)
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Número no formato do idioma: 0,4 em português e 0.4 em inglês
  const num = (v, casas = 0) => new Intl.NumberFormat(local(), { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(v);

  // localStorage pode estar bloqueado (aba anônima etc.). try/catch evita quebrar a página.
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* tudo bem */ } };
  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  const rolarPara = (el, bloco = 'start') => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: bloco });
  };

  // Aviso flutuante ("toast")
  let timerAviso;
  function avisar(texto) {
    const el = $('#aviso');
    el.textContent = texto;
    el.hidden = false;
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => { el.hidden = true; }, 2200);
  }

  /* ---------- 1. Tema claro / escuro ----------
     O CSS tem as cores do tema claro e do escuro. Aqui só trocamos o
     atributo data-theme no <html> e o CSS faz o resto. */
  function temaAtual() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function trocarTema() {
    const novo = temaAtual() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = novo;
    guardar('tema', novo);
  }
  const temaSalvo = ler('tema');
  if (temaSalvo) document.documentElement.dataset.theme = temaSalvo;
  $('#trocar-tema').addEventListener('click', trocarTema);

  /* ---------- 2. Ações que vários lugares usam ----------
     A paleta (Ctrl+K) e a lista "O que eu faço" chamam a mesma função.
     Cada ação é um texto curto, como "ir:sql" ou "executar". */
  function fazer(acao) {
    if (acao.startsWith('ir:')) return rolarPara(acao.slice(3));
    if (acao === 'executar') {
      rolarPara($('.editor'), 'center');
      setTimeout(() => window.executarFluxo && window.executarFluxo(), semMovimento ? 0 : 450);
    }
    if (acao === 'copiar') copiar($('#email').textContent.trim(), $('#email'));
    if (acao === 'linkedin') { const a = $('.contato__item a'); if (a) a.click(); }
    if (acao === 'tema') trocarTema();
    if (acao === 'lingua' && window.I18N) I18N.alternar();
  }

  /* ---------- 3. Números que contam ----------
     IntersectionObserver avisa quando um elemento aparece na tela.
     O número final já está no HTML: se o JS falhar, nada se perde. */
  if (!semMovimento && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((ent) => {
        if (!ent.isIntersecting) return;
        const el = ent.target;
        const fim = Number(el.dataset.conta);
        const inicio = fim > 1000 ? fim - 30 : 0; // 2024 conta a partir de 1994, fica mais bonito
        const t0 = performance.now();
        const passo = (agora) => {
          const t = Math.min((agora - t0) / 1100, 1);
          const suave = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(inicio + (fim - inicio) * suave);
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    $$('[data-conta]').forEach((c) => obs.observe(c));
  }

  /* ---------- 4. O que eu faço ----------
     Cada linha tem um selo dizendo de onde vem (experiência, projeto pessoal
     ou de estudo) e um link para a prova. O link é um <a href="#..."> de
     verdade: funciona até sem JavaScript. Com JavaScript, a rolagem fica suave. */
  const listaFrentes = $('#lista-frentes');
  function desenharFrentes() {
    const selos = U().selos;
    listaFrentes.innerHTML = D().frentes.map((f, i) => {
      const alvo = f.acao.startsWith('ir:') ? f.acao.slice(3) : 'inicio';
      return `
      <li class="frente">
        
        <div class="frente__cabeca">
          <h3>${esc(f.nome)}</h3>
          <span class="selo selo--${f.selo}">${esc(selos[f.selo])}</span>
        </div>
        <p class="frente__texto">${esc(f.texto)}</p>
        <a class="frente__prova" href="#${alvo}" data-acao="${f.acao}">${esc(f.prova)}</a>
      </li>`;
    }).join('');
  }
  listaFrentes.addEventListener('click', (ev) => {
    const a = ev.target.closest('[data-acao]');
    if (!a) return;
    ev.preventDefault();
    fazer(a.dataset.acao);
  });
  desenharFrentes();
  aoTrocarIdioma(desenharFrentes);

  /* ---------- 5. Etapas do fluxo com IA (diagrama clicável) ---------- */
  const trilha = $('#trilha');
  const detalhe = $('#detalhe');
  let passoAtual = 0;
  let autoplay = !semMovimento;
  let timerPasso;

  function desenharTrilha() {
    trilha.innerHTML = D().arquitetura.map((e, i) => `
      <li>
        <button type="button" class="passo" data-i="${i}" data-tipo="${e.tipo}" aria-pressed="false">
          <span class="passo__num">${doisDigitos(i)}</span>
          <span class="passo__nome">${esc(e.titulo)}</span>
          <span class="passo__onde">${esc(e.onde)}</span>
          <span class="passo__barra" aria-hidden="true"></span>
        </button>
      </li>`).join('');
  }

  function abrirPasso(i) {
    passoAtual = i;
    const etapas = D().arquitetura;
    const e = etapas[i];
    $$('.passo', trilha).forEach((b, j) => {
      b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
      b.classList.toggle('passo--feito', j < i);
    });
    detalhe.innerHTML = `
      <p class="rotulo">${esc(e.onde)}</p>
      <h3>${esc(e.titulo)}</h3>
      <p class="detalhe__resumo">${esc(e.resumo)}</p>
      <ul>${e.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <pre><code>${esc(e.codigo)}</code></pre>`;
    // reinicia a animação de entrada
    detalhe.classList.remove('detalhe--entra'); void detalhe.offsetWidth; detalhe.classList.add('detalhe--entra');
    trilha.classList.toggle('trilha--auto', autoplay);
    clearTimeout(timerPasso);
    if (autoplay) timerPasso = setTimeout(() => abrirPasso((passoAtual + 1) % etapas.length), 6000);
  }
  trilha.addEventListener('click', (ev) => {
    const b = ev.target.closest('.passo');
    if (!b) return;
    autoplay = false; // a pessoa assumiu o controle: paramos o automático
    abrirPasso(Number(b.dataset.i));
  });
  // O automático só roda enquanto a seção está visível (economiza bateria)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([ent]) => {
      if (!ent.isIntersecting) clearTimeout(timerPasso);
      else if (autoplay) abrirPasso(passoAtual);
    }, { threshold: 0.3 }).observe(trilha);
  }
  desenharTrilha();
  abrirPasso(0);
  aoTrocarIdioma(() => { desenharTrilha(); abrirPasso(passoAtual); });

  /* ---------- 6. Demo: tente enganar o validador ----------
     O visitante "sabota" o blueprint e vê o validador reagir.
     Cada sabotagem é uma função que altera uma CÓPIA do blueprint.
     Nunca mexemos no original: assim dá para combinar e desfazer à vontade.
     A reunião e o blueprint existem nos dois idiomas (js/discovery-dados.js). */
  const caixaT = $('#transcricao');
  const caixaB = $('#blueprint');
  const veredito = $('#veredito');
  const sabot = $('#sabotagens');
  const X = () => window.DISCOVERY[L()];
  const textoReuniao = () => X().falas.map((f) => `${f.quem}: ${f.fala}`).join('\n');
  const copia = (o) => JSON.parse(JSON.stringify(o)); // jeito simples de clonar um objeto JSON

  // c = D().demo, com os nomes de cada idioma
  const sabotar = {
    inventar: (bp, c) => { bp.campos.push(copia(c.campoInventado)); bp.origem.push({ item: c.campoInventado.nome, trecho: c.trechoInventado }); },
    apagar: (bp, c) => { bp.origem = bp.origem.filter((o) => o.item !== c.provaApagada); },
    encurtar: (bp, c) => { const f = bp.funis.find((x) => x.nome === c.funilCurto); f.etapas = f.etapas.slice(0, 2); },
    etapa: (bp, c) => { bp.campos.find((x) => x.nome === c.campoComEtapa).obrigatorio_na_etapa = c.etapaFalsa; }
  };
  const ativas = new Set();
  let atual = null;                         // blueprint em uso (com as sabotagens aplicadas)
  let selecionado = D().demo.provaApagada;  // item cuja prova aparece marcada na reunião

  function desenharReuniao() {
    const x = X();
    caixaT.innerHTML = `<p class="rotulo">${esc(x.empresa)}</p>` + x.falas.map((f, i) =>
      `<p class="fala" data-i="${i}"><b>${esc(f.quem)}:</b> <span>${esc(f.fala)}</span></p>`).join('');
    sabot.dataset.rotulo = U().sabotar;
    sabot.innerHTML = D().demo.sabotagens.map((s) =>
      `<button type="button" class="chip" data-id="${s.id}" aria-pressed="false">${esc(s.nome)}</button>`).join('') +
      `<button type="button" class="chip chip--limpar" id="restaurar">${esc(U().restaurar)}</button>`;
  }

  // Cada item tem prova? Procura o trecho citado dentro da reunião.
  function prova(nome) {
    const entradas = atual.origem.filter((o) => normalizar(o.item) === normalizar(nome));
    if (!entradas.length) return { estado: 'sem' };
    const texto = normalizar(textoReuniao());
    const achou = entradas.find((o) => texto.includes(normalizar(o.trecho)));
    return achou ? { estado: 'ok', trecho: achou.trecho } : { estado: 'falsa', trecho: entradas[0].trecho };
  }
  const icone = { ok: '✓', sem: '?', falsa: '✗' };
  const item = (nome, extra = '') => {
    const p = prova(nome);
    return `<button type="button" class="item item--${p.estado}" data-item="${esc(nome)}" aria-pressed="${nome === selecionado}">
      <span class="item__icone" aria-hidden="true">${icone[p.estado]}</span><span>${esc(nome)}${extra}</span></button>`;
  };

  function desenharBlueprint() {
    const bp = atual, ui = U();
    const tipo = (mapa, v) => esc(mapa[v] || v);
    caixaB.innerHTML = `
      <p class="rotulo">${esc(ui.blueprintRotulo)}</p>
      ${bp.funis.map((f) => `
        <div class="bp-bloco">
          <p class="bp-titulo">${esc(ui.funil)}: ${esc(f.nome)}</p>
          <div class="bp-etapas">${f.etapas.map((e) => item(e.nome)).join('<span class="seta" aria-hidden="true">→</span>')}</div>
        </div>`).join('')}
      <div class="bp-bloco">
        <p class="bp-titulo">${esc(ui.camposNegocio)}</p>
        <div class="bp-lista">${bp.campos.map((c) => item(c.nome,
          ` <small>${tipo(ui.tiposCampo, c.tipo)}${c.obrigatorio_na_etapa ? ', ' + esc(ui.obrigatorioEm) + ' ' + esc(c.obrigatorio_na_etapa) : ''}</small>`)).join('')}</div>
      </div>
      <div class="bp-bloco">
        <p class="bp-titulo">${esc(ui.automacoesIntegracoes)}</p>
        <div class="bp-lista">${bp.automacoes.map((a) => item(a.nome, ` <small>${tipo(ui.tiposAutomacao, a.tipo)}</small>`)).join('')}${bp.integracoes.map((i) => item(i.sistema, ` <small>${tipo(ui.statusIntegracao, i.status)}</small>`)).join('')}</div>
      </div>`;
  }

  // Marca na reunião o trecho que prova o item escolhido
  function mostrarProva(nome, rolar) {
    selecionado = nome;
    const falas = X().falas;
    $$('.item', caixaB).forEach((b) => b.setAttribute('aria-pressed', b.dataset.item === nome ? 'true' : 'false'));
    $$('.fala', caixaT).forEach((el, i) => { el.classList.remove('fala--prova'); el.querySelector('span').textContent = falas[i].fala; });
    const p = prova(nome);
    if (p.estado !== 'ok') return;
    const alvo = normalizar(p.trecho);
    let primeiro = null;
    falas.forEach((f, i) => {
      if (!normalizar(f.fala).includes(alvo)) return;
      const el = caixaT.querySelector(`.fala[data-i="${i}"]`);
      const span = el.querySelector('span');
      const pos = f.fala.toLowerCase().indexOf(p.trecho.toLowerCase());
      span.innerHTML = pos < 0 ? esc(f.fala)
        : esc(f.fala.slice(0, pos)) + '<mark>' + esc(f.fala.slice(pos, pos + p.trecho.length)) + '</mark>' + esc(f.fala.slice(pos + p.trecho.length));
      el.classList.add('fala--prova');
      primeiro = primeiro || el;
    });
    // rola só a caixa da transcrição, não a página inteira
    if (primeiro) caixaT.scrollTo({ top: primeiro.offsetTop - 40, behavior: rolar && !semMovimento ? 'smooth' : 'auto' });
  }

  function validarAgora() {
    const c = D().demo, ui = U();
    atual = copia(X().blueprint);
    ativas.forEach((id) => sabotar[id](atual, c));
    $$('.chip[data-id]', sabot).forEach((b) => b.setAttribute('aria-pressed', ativas.has(b.dataset.id) ? 'true' : 'false'));
    const t0 = performance.now();
    const r = validar(atual, textoReuniao(), L()); // <- a mesma função do n8n
    const ms = num(performance.now() - t0, 1);
    desenharBlueprint();
    mostrarProva(selecionado, false);
    veredito.className = 'veredito ' + (r.ok ? 'veredito--ok' : 'veredito--erro');
    veredito.innerHTML = `
      <div class="veredito__cab">
        <strong>${esc(r.ok ? ui.aprovado : ui.barrado(r.erros.length))}</strong>
        <span>${esc(ui.resumoValidacao(r.resumo, ms))}</span>
      </div>
      ${r.erros.length ? `<ul class="veredito__erros">${r.erros.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${r.avisos.length ? `<ul class="veredito__avisos">${r.avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
      ${ativas.size === 0 ? `<p class="nota">${esc(ui.dicaSabotar)}</p>` : ''}`;
  }

  sabot.addEventListener('click', (ev) => {
    const b = ev.target.closest('.chip');
    if (!b) return;
    const c = D().demo;
    if (b.id === 'restaurar') ativas.clear();
    else if (ativas.has(b.dataset.id)) ativas.delete(b.dataset.id);
    else ativas.add(b.dataset.id);
    if (b.dataset.id === 'inventar' && ativas.has('inventar')) selecionado = c.campoInventado.nome;
    if (!ativas.has('inventar') && selecionado === c.campoInventado.nome) selecionado = c.provaApagada;
    validarAgora();
  });
  caixaB.addEventListener('click', (ev) => {
    const b = ev.target.closest('.item');
    if (b) mostrarProva(b.dataset.item, true);
  });
  desenharReuniao();
  validarAgora();
  aoTrocarIdioma((ev) => {
    // os nomes mudam de idioma: o campo inventado continua escolhido, o resto volta ao padrão
    const antes = window.DADOS[ev.detail === 'en' ? 'pt' : 'en'].demo;
    selecionado = selecionado === antes.campoInventado.nome ? D().demo.campoInventado.nome : D().demo.provaApagada;
    desenharReuniao();
    validarAgora();
  });

  /* ---------- 7. Console de SQL (AULA 9) ----------
     Um banco SQLite de verdade, rodando dentro da página:

     - O sql.js (o SQLite compilado para JavaScript, ~1,4 MB) só é baixado
       quando a pessoa chega perto da seção. Quem não rola até aqui não paga
       esse peso. Isso se chama "carregamento preguiçoso" (lazy loading).
     - Enquanto ele não chega, a tabela mostra o resultado salvo pelo gerador.
       Quando chega, a consulta roda de novo, agora ao vivo.
     - A base é montada na memória pela mesma função que o Node.js usa no
       projeto (PIPELINE_BASE.montarBase, em js/pipeline-base.js).
     - O editor é um truque clássico: um <pre> colorido atrás e um <textarea>
       com texto transparente na frente. Você digita no textarea e vê as cores
       do pre, porque os dois têm exatamente a mesma fonte e o mesmo tamanho. */
  (function consoleSql() {
    const P = window.PIPELINE, B = window.PIPELINE_BASE;
    const raiz = $('#console-sql');
    if (!raiz || !P || !B) return;

    const URL_SQLJS = 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-asm.js';
    const LIMITE = 200;   // linhas mostradas na tabela
    const TETO = 5000;    // depois disso a gente para de contar
    const el = {
      perguntas: $('#sql-perguntas'), titulo: $('#sql-pergunta'), conceitos: $('#sql-conceitos'),
      texto: $('#sql-texto'), cor: $('#sql-cor'), rodar: $('#sql-rodar'), restaurar: $('#sql-restaurar'),
      resultado: $('#sql-resultado'), rodape: $('#sql-rodape'), leitura: $('#sql-leitura'),
      estado: $('#sql-estado'), tabelas: $('#sql-tabelas')
    };
    const motor = { estado: 'parado', SQL: null, bases: {}, versao: '', promessa: null };
    const edicoes = new Map();   // "pergunta:idioma" → texto que a pessoa editou
    let atual = 0;
    let rodarQuandoPronto = false;

    const S = () => U().sql;
    const C = () => P.consultas[atual];
    const chave = () => `${atual}:${L()}`;
    const original = () => C().sql[L()];
    const editada = () => el.texto.value.trim() !== original().trim();
    const salvo = () => {
      const r = C().resultado[L()];
      return { colunas: r.colunas, linhas: r.linhas, total: r.linhas.length, cortado: false, teto: false };
    };

    // ---- cores do editor ----
    const PALAVRAS = new Set(('SELECT FROM WHERE JOIN LEFT RIGHT INNER OUTER CROSS ON AS AND OR NOT NULL IS IN ' +
      'BETWEEN LIKE GLOB DISTINCT GROUP BY ORDER HAVING LIMIT OFFSET WITH RECURSIVE UNION ALL INTERSECT EXCEPT ' +
      'CASE WHEN THEN ELSE END OVER PARTITION ROWS RANGE UNBOUNDED PRECEDING FOLLOWING CURRENT ROW ASC DESC ' +
      'EXISTS INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW INDEX DROP ALTER ADD PRIMARY KEY ' +
      'REFERENCES INTEGER REAL TEXT BLOB DEFAULT FILTER TRUE FALSE').split(' '));
    const FUNCOES = new Set(('COUNT SUM AVG MIN MAX TOTAL ROUND ABS COALESCE IFNULL NULLIF IIF LOWER UPPER TRIM ' +
      'LTRIM RTRIM LENGTH SUBSTR SUBSTRING REPLACE INSTR PRINTF FORMAT DATE TIME DATETIME JULIANDAY STRFTIME ' +
      'UNIXEPOCH LEAD LAG ROW_NUMBER RANK DENSE_RANK NTILE FIRST_VALUE LAST_VALUE GROUP_CONCAT CAST').split(' '));
    function colorirSql(sql) {
      // comentário | texto entre aspas | número | palavra
      const re = /--[^\n]*|'(?:[^']|'')*'?|\b\d+(?:\.\d+)?\b|[A-Za-z_][A-Za-z0-9_]*/g;
      let html = '', ult = 0, m;
      while ((m = re.exec(sql))) {
        const t = m[0];
        let cls = '';
        if (t.startsWith('--')) cls = 's-com';
        else if (t[0] === "'") cls = 's-str';
        else if (/^\d/.test(t)) cls = 's-num';
        else if (FUNCOES.has(t.toUpperCase()) && /^\s*\(/.test(sql.slice(re.lastIndex, re.lastIndex + 40))) cls = 's-f';
        else if (PALAVRAS.has(t.toUpperCase())) cls = 's-k';
        html += esc(sql.slice(ult, m.index)) + (cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t));
        ult = re.lastIndex;
      }
      return html + esc(sql.slice(ult));
    }
    // o "\n" no fim garante que a última linha vazia também ocupe espaço
    const colorir = () => { el.cor.innerHTML = colorirSql(el.texto.value) + '\n'; };

    // ---- formatação dos valores ----
    function formatar(v, tipo) {
      if (v === null || v === undefined) return '<span class="nulo">NULL</span>';
      if (typeof v !== 'number') return esc(v);
      const nf = (o) => new Intl.NumberFormat(local(), o).format(v);
      if (tipo === 'moeda') return nf({ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
      if (tipo === 'pct') return nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
      if (tipo === 'int' || tipo === 'dias') return nf({ maximumFractionDigits: 0 });
      // consulta editada: número cru, sem separador de milhar (pode ser um id ou um ano)
      return nf({ maximumFractionDigits: 4, useGrouping: false });
    }
    const mesmasColunas = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

    function tabela(res) {
      const ref = C().resultado[L()];
      const tipado = mesmasColunas(res.colunas, ref.colunas);
      const tipos = tipado ? C().tipos : null;
      const barra = tipado ? C().barra : -1;
      const numerica = res.colunas.map((_, j) => (tipos ? tipos[j] !== 'texto' : res.linhas.some((l) => typeof l[j] === 'number')));
      const max = barra < 0 ? 0 : Math.max(0, ...res.linhas.map((l) => (typeof l[barra] === 'number' ? l[barra] : 0)));
      const celula = (v, j) => {
        const txt = formatar(v, tipos && tipos[j]);
        if (j === barra && max > 0) {
          const p = typeof v === 'number' && v > 0 ? v / max : 0;
          return `<td class="com-barra"><div class="celula-barra"><span class="valor">${txt}</span><span class="trilho" aria-hidden="true"><span class="barra" style="--p:${p.toFixed(4)}"></span></span></div></td>`;
        }
        return `<td${numerica[j] ? ' class="num"' : ''}>${txt}</td>`;
      };
      return `<table>
        <thead><tr>${res.colunas.map((c, j) => `<th scope="col"${numerica[j] && j !== barra ? ' class="num"' : ''}>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${res.linhas.map((l) => `<tr>${l.map(celula).join('')}</tr>`).join('')}</tbody>
      </table>`;
    }

    // ---- o que aparece embaixo do editor ----
    function mostrar(res, origem, ms) {
      const s = S();
      if (res.erro) {
        el.resultado.innerHTML = `<div class="sql-erro" role="alert"><strong>${esc(s.erro)}</strong><code>${esc(res.erro)}</code></div>`;
        el.rodape.textContent = '';
        el.leitura.hidden = true;
        return;
      }
      if (res.vazio) {
        el.resultado.innerHTML = `<p class="sql-nota">${esc(s.semLinhas)}</p>`;
        el.rodape.textContent = origem === 'vivo' ? s.aoVivo(0, num(ms, 1)) : '';
        el.leitura.hidden = true;
        return;
      }
      el.resultado.innerHTML = tabela(res);
      const n = res.teto ? `${TETO}+` : res.total;
      let rodape = origem === 'vivo' ? s.aoVivo(n, num(ms, 1)) : s.salvo(n);
      if (res.cortado) rodape += ', ' + s.cortado(LIMITE);
      if (editada()) rodape = s.editada + ', ' + rodape;
      el.rodape.textContent = rodape;
      // A frase de leitura descreve o resultado ORIGINAL: some se a consulta foi editada
      el.leitura.hidden = editada();
      el.leitura.textContent = C().leitura[L()];
    }
    function nota(texto) {
      el.resultado.innerHTML = `<p class="sql-nota">${esc(texto)}</p>`;
      el.rodape.textContent = '';
      el.leitura.hidden = true;
    }

    // ---- o motor (sql.js) ----
    function base() {
      const l = L();
      if (!motor.bases[l]) motor.bases[l] = B.montarBase(motor.SQL, P, l);
      return motor.bases[l];
    }
    function pintarEstado() {
      const s = S();
      el.estado.dataset.estado = motor.estado;
      el.estado.textContent = { parado: '', carregando: s.carregando, pronto: s.pronto(motor.versao), falhou: s.falhou }[motor.estado];
    }
    function carregarMotor() {
      if (motor.promessa) return motor.promessa;
      motor.estado = 'carregando';
      pintarEstado();
      motor.promessa = new Promise((ok, falha) => {
        if (window.initSqlJs) return ok();
        const s = document.createElement('script');
        s.src = URL_SQLJS;
        s.async = true;
        const timer = setTimeout(() => falha(new Error('tempo esgotado')), 20000);
        s.onload = () => { clearTimeout(timer); ok(); };
        s.onerror = () => { clearTimeout(timer); falha(new Error('o arquivo não carregou')); };
        document.head.appendChild(s);
      })
        .then(() => window.initSqlJs())
        .then((SQL) => {
          motor.SQL = SQL;
          motor.versao = base().exec('SELECT sqlite_version()')[0].values[0][0];
          motor.estado = 'pronto';
          pintarEstado();
          conferir();
          // Troca o resultado salvo pelo resultado ao vivo (ou roda o que a pessoa pediu)
          if (!editada() || rodarQuandoPronto) rodar();
          rodarQuandoPronto = false;
        })
        .catch((e) => {
          motor.estado = 'falhou';
          pintarEstado();
          el.texto.readOnly = true; // sem motor, editar não adianta
          if (editada()) nota(S().semMotor);
          console.warn('SQLite não carregou:', e);
        });
      return motor.promessa;
    }
    // Prova para quem abre o console: o SQL ao vivo dá o mesmo resultado que o gerador salvou
    function conferir() {
      const l = L(), db = base();
      const iguais = P.consultas.filter((c) => {
        const [r] = db.exec(c.sql[l]);
        return r && JSON.stringify({ colunas: r.columns, linhas: r.values }) === JSON.stringify(c.resultado[l]);
      }).length;
      console.info(l === 'en'
        ? `SQL: ${iguais}/${P.consultas.length} live queries match the saved results`
        : `SQL: ${iguais}/${P.consultas.length} consultas ao vivo iguais aos resultados salvos`);
    }

    // Roda todas as instruções do texto e mostra a última que devolveu colunas
    function executarAoVivo(sql) {
      const db = base();
      const t0 = performance.now();
      const it = db.iterateStatements(sql);
      let ultimo = null, st = null;
      try {
        for (let r = it.next(); !r.done; r = it.next()) {
          st = r.value;
          const colunas = st.getColumnNames();
          const linhas = [];
          let total = 0, teto = false;
          while (st.step()) {
            total++;
            if (linhas.length < LIMITE) linhas.push(st.get());
            if (total >= TETO) { teto = true; break; }
          }
          if (colunas.length) ultimo = { colunas, linhas, total, cortado: total > linhas.length, teto };
        }
        st = null;
      } catch (e) {
        if (st) { try { st.free(); } catch (_) { /* já liberada */ } }
        return { erro: (e && e.message) || String(e) };
      }
      return { res: ultimo || { vazio: true }, ms: performance.now() - t0 };
    }

    function rodar() {
      if (motor.estado === 'pronto') {
        const r = executarAoVivo(el.texto.value);
        return r.erro ? mostrar(r) : mostrar(r.res, 'vivo', r.ms);
      }
      if (!editada()) mostrar(salvo(), 'salvo');
      if (motor.estado === 'falhou') { if (editada()) nota(S().semMotor); return; }
      if (editada()) { nota(S().esperando); rodarQuandoPronto = true; }
      carregarMotor();
    }
    // Ao trocar de pergunta ou de idioma: ao vivo se der, senão o resultado salvo
    function atualizar() {
      if (motor.estado === 'pronto') return rodar();
      if (!editada()) return mostrar(salvo(), 'salvo');
      nota(motor.estado === 'falhou' ? S().semMotor : S().esperando);
    }

    // ---- montar a tela ----
    function desenharPerguntas() {
      el.perguntas.innerHTML = P.consultas.map((c, i) => `
        <button type="button" class="pergunta" data-i="${i}" aria-pressed="${i === atual}">
          
          <span class="pergunta__texto">${esc(c.pergunta[L()])}</span>
        </button>`).join('');
    }
    function escolher(i) {
      atual = i;
      $$('.pergunta', el.perguntas).forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
      el.titulo.textContent = C().pergunta[L()];
      el.conceitos.innerHTML = `<span>${esc(S().ensina)}:</span> ` + C().conceitos[L()].map((c) => `<code>${esc(c)}</code>`).join(' ');
      el.texto.value = edicoes.has(chave()) ? edicoes.get(chave()) : original();
      colorir();
      atualizar();
    }
    // O painel "Ver as tabelas" é lido do próprio CREATE TABLE: uma fonte só
    function desenharTabelas() {
      const l = L(), s = S();
      const contagens = [P.vendedores.length, P.etapas.length, P.negocios.length, P.historico.length];
      const blocos = [...B.ESQUEMA[l].matchAll(/CREATE TABLE (\w+) \(\n([\s\S]*?)\n\);/g)];
      el.tabelas.innerHTML = blocos.map((m, i) => {
        const colunas = m[2].split('\n').map((linha) => {
          const partes = linha.match(/^\s*(\w+)\s+(\w+)(.*)$/);
          if (!partes) return '';
          const [, nome, tipo, resto] = partes;
          const [defs, comentario] = resto.split('--');
          const ref = /REFERENCES\s+(\w+)/.exec(defs);
          return `<li><code>${esc(nome)}</code><span class="sql-tipo">${esc(tipo.toLowerCase())}</span>` +
            (/PRIMARY KEY/.test(defs) ? `<span class="sql-marca">${esc(s.chave)}</span>` : '') +
            (ref ? `<span class="sql-marca">${esc(s.liga(ref[1]))}</span>` : '') +
            (comentario ? `<small>${esc(comentario.trim())}</small>` : '') + '</li>';
        }).join('');
        return `<div class="sql-tabela"><p class="sql-tabela__nome"><code>${esc(m[1])}</code><span>${esc(s.linhas(num(contagens[i])))}</span></p><ul>${colunas}</ul></div>`;
      }).join('');
    }

    // ---- eventos ----
    el.perguntas.addEventListener('click', (ev) => {
      const b = ev.target.closest('.pergunta');
      if (!b) return;
      escolher(Number(b.dataset.i));
      b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: semMovimento ? 'auto' : 'smooth' });
    });
    el.texto.addEventListener('input', () => {
      if (editada()) edicoes.set(chave(), el.texto.value); else edicoes.delete(chave());
      colorir();
    });
    el.texto.addEventListener('keydown', (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); rodar(); }
    });
    el.texto.addEventListener('focus', () => carregarMotor());
    el.rodar.addEventListener('click', rodar);
    el.restaurar.addEventListener('click', () => {
      edicoes.delete(chave());
      el.texto.value = original();
      colorir();
      // Se a pessoa rodou um DELETE ou um DROP, a base volta inteira
      Object.values(motor.bases).forEach((db) => db.close());
      motor.bases = {};
      atualizar();
      avisar(S().restaurada);
    });

    // Baixa o SQLite quando a seção estiver a ~800px de aparecer
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((ents) => {
        if (ents.some((e) => e.isIntersecting)) { obs.disconnect(); carregarMotor(); }
      }, { rootMargin: '800px 0px' });
      obs.observe(raiz);
    } else carregarMotor();

    desenharPerguntas();
    desenharTabelas();
    escolher(0);
    pintarEstado();
    aoTrocarIdioma(() => { desenharPerguntas(); desenharTabelas(); escolher(atual); pintarEstado(); });
  })();

  /* ---------- 8. Funil do método, guiado pela rolagem ----------
     Calculamos quanto da seção já passou pela tela (0 a 1) e
     escolhemos a coluna. O cartão muda de coluna com a técnica FLIP:
     mede antes, muda, mede depois e anima a diferença. */
  const pista = $('#pista');
  pista.innerHTML = D().metodo.map((m, i) => `
    <div class="coluna" data-i="${i}">
      <p class="coluna__cab"><span class="coluna__num">${doisDigitos(i)}</span> <span class="coluna__nome"></span></p>
      <p class="coluna__texto"></p>
      <div class="coluna__vaga"></div>
    </div>`).join('');
  const cartao = document.createElement('div');
  cartao.className = 'cartao-negocio';
  cartao.innerHTML = `
    <p class="cartao-negocio__tit"></p>
    <p class="cartao-negocio__sub" id="cn-etapa"></p>
    <div class="cartao-negocio__barra"><span id="cn-barra"></span></div>
    <p class="cartao-negocio__pct" id="cn-pct"></p>`;
  let colunaAtual = -1;

  function textosMetodo() {
    const m = D().metodo;
    $$('.coluna', pista).forEach((col, i) => {
      $('.coluna__nome', col).textContent = m[i].nome;
      $('.coluna__texto', col).textContent = m[i].texto;
    });
    $('.cartao-negocio__tit', cartao).textContent = U().cartaoProjeto;
    if (colunaAtual < 0) return;
    const pct = Math.round(((colunaAtual + 1) / m.length) * 100);
    $('#cn-etapa').textContent = m[colunaAtual].nome;
    $('#cn-pct').textContent = colunaAtual === m.length - 1 ? U().golive : U().cronograma(pct);
  }

  function moverCartao(i) {
    if (i === colunaAtual) return;
    const antes = cartao.isConnected ? cartao.getBoundingClientRect() : null;
    $$('.coluna', pista).forEach((c, j) => {
      c.classList.toggle('coluna--ativa', j === i);
      c.classList.toggle('coluna--feita', j < i);
    });
    $('.coluna__vaga', pista.children[i]).appendChild(cartao);
    colunaAtual = i;
    $('#cn-barra').style.width = Math.round(((i + 1) / D().metodo.length) * 100) + '%';
    textosMetodo();
    if (antes && !semMovimento) {
      const depois = cartao.getBoundingClientRect();
      cartao.animate([
        { transform: `translate(${antes.left - depois.left}px, ${antes.top - depois.top}px)` },
        { transform: 'translate(0,0)' }
      ], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  }

  let agendado = false;
  function aoRolar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => { // no máximo 1 cálculo por quadro
      agendado = false;
      const r = $('#funil').getBoundingClientRect();
      const vh = window.innerHeight;
      const progresso = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.1), 0), 0.999);
      moverCartao(Math.floor(progresso * D().metodo.length));
    });
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar);
  textosMetodo();
  moverCartao(0);
  aoRolar();
  aoTrocarIdioma(textosMetodo);

  /* ---------- 9. Ferramentas ----------
     O último grupo (projetos pessoais) ganha outro visual: não é ferramenta
     do dia a dia de trabalho, e a página deixa isso claro. */
  function desenharStack() {
    $('#stack').innerHTML = D().stack.map((g) => `
      <div class="stack__grupo${g.pessoal ? ' stack__grupo--pessoal' : ''}">
        <p class="rotulo">${esc(g.grupo)}</p>
        <ul>${g.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`).join('');
  }
  desenharStack();
  aoTrocarIdioma(desenharStack);

  /* ---------- 10. Copiar e-mail ---------- */
  async function copiar(texto, el) {
    try {
      await navigator.clipboard.writeText(texto);
      avisar(U().copiado);
    } catch (e) {
      // Alguns navegadores bloqueiam: selecionamos o texto para a pessoa copiar
      const sel = window.getSelection(); const faixa = document.createRange();
      faixa.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(faixa);
      avisar(U().selecioneEmail);
    }
  }
  $$('[data-copiar]').forEach((b) => b.addEventListener('click', () => {
    const alvo = document.getElementById(b.dataset.copiar);
    copiar(alvo.textContent.trim(), alvo);
  }));

  /* ---------- 11. Paleta de comandos (Ctrl+K) ----------
     Igual à de editores de código: digita, filtra, Enter executa.
     Os comandos estão em DADOS[idioma].comandos. */
  const paleta = $('#paleta'), busca = $('#paleta-busca'), listaCmd = $('#paleta-lista');
  let filtrados = [], sel = 0, focoAnterior = null;

  // Remove acentos para "metodo" achar "método"
  const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function renderPaleta() {
    const q = normal(busca.value.trim());
    filtrados = D().comandos.filter((c) => normal(c.nome).includes(q));
    sel = Math.min(sel, Math.max(filtrados.length - 1, 0));
    listaCmd.innerHTML = filtrados.length
      ? filtrados.map((c, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}"><span>${esc(c.nome)}</span><small>${esc(c.dica)}</small></li>`).join('')
      : `<li class="vazio">${esc(U().paletaVazia)}</li>`;
  }
  function abrirPaleta() {
    focoAnterior = document.activeElement;
    paleta.hidden = false; busca.value = ''; sel = 0; renderPaleta(); busca.focus();
  }
  function fecharPaleta() { paleta.hidden = true; if (focoAnterior && focoAnterior.focus) focoAnterior.focus(); }
  function rodarComando(i) { const c = filtrados[i]; if (!c) return; fecharPaleta(); fazer(c.acao); }

  $('#abrir-paleta').addEventListener('click', abrirPaleta);
  busca.addEventListener('input', () => { sel = 0; renderPaleta(); });
  listaCmd.addEventListener('click', (ev) => { const li = ev.target.closest('li[data-i]'); if (li) rodarComando(Number(li.dataset.i)); });
  paleta.addEventListener('click', (ev) => { if (ev.target === paleta) fecharPaleta(); });
  document.addEventListener('keydown', (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); paleta.hidden ? abrirPaleta() : fecharPaleta(); return; }
    if (paleta.hidden) return;
    if (ev.key === 'Escape') fecharPaleta();
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); sel = (sel + 1) % Math.max(filtrados.length, 1); renderPaleta(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); sel = (sel - 1 + filtrados.length) % Math.max(filtrados.length, 1); renderPaleta(); }
    else if (ev.key === 'Enter') { ev.preventDefault(); rodarComando(sel); }
  });

  /* ---------- 12. Um recado para quem abre o console (F12) ---------- */
  console.log('%c' + U().consoleOi, 'font: 600 14px sans-serif; color: #7884f2');
  console.log(U().consoleSobre);
})();
