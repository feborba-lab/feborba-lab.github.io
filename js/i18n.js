/*
  AULA 8 · Dois idiomas sem framework
  ------------------------------------
  Como funciona, em quatro passos:

  1. Todo texto fixo do HTML tem uma "etiqueta": data-t="chave" para o texto,
     data-t-label para o aria-label (o que o leitor de tela fala) e data-t-ph
     para o placeholder de um campo.
  2. Quando a página abre, guardamos o português que já está no HTML.
     O inglês fica em DADOS.en.html, com as mesmas chaves.
  3. Trocar de idioma é só percorrer os elementos etiquetados e colocar o
     texto certo em cada um.
  4. No fim, avisamos o resto do site com um evento chamado "lingua".
     O main.js e o fluxo.js "escutam" esse evento e redesenham o que eles
     montam (listas, demos, o console de SQL).

  A escolha fica guardada no navegador (localStorage). Na primeira visita,
  vale o idioma do navegador da pessoa. Um link com ?lang=en abre direto
  em inglês, útil para mandar para recrutador de fora.
*/
(function () {
  const D = window.DADOS;
  const IDIOMAS = ['pt', 'en'];
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* aba anônima etc. */ } };
  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  // Passo 2: o português original de cada elemento etiquetado
  const originais = new Map();
  document.querySelectorAll('[data-t], [data-t-label], [data-t-ph]').forEach((el) => {
    originais.set(el, {
      html: el.innerHTML,
      label: el.getAttribute('aria-label'),
      ph: el.getAttribute('placeholder')
    });
  });
  // Só trocamos o título da aba se ele for o título do site (a prévia usa outro)
  const tituloOriginal = document.title;
  const trocaTitulo = tituloOriginal === D.pt.titulo;
  const botoes = Array.from(document.querySelectorAll('[data-lingua]'));

  function escolherInicial() {
    const daUrl = new URLSearchParams(location.search).get('lang');
    if (IDIOMAS.includes(daUrl)) return daUrl;
    const salvo = ler('lingua');
    if (IDIOMAS.includes(salvo)) return salvo;
    const doNavegador = (navigator.language || 'pt').toLowerCase();
    return doNavegador.startsWith('pt') ? 'pt' : 'en';
  }

  // Passo 3: colocar o texto do idioma em cada elemento
  function aplicar(l) {
    const T = l === 'en' ? D.en.html : {};
    const texto = (chave, original) => (chave in T ? T[chave] : original);
    originais.forEach((o, el) => {
      if (el.dataset.t) el.innerHTML = texto(el.dataset.t, o.html);
      if (el.dataset.tLabel) el.setAttribute('aria-label', texto(el.dataset.tLabel, o.label));
      if (el.dataset.tPh) el.setAttribute('placeholder', texto(el.dataset.tPh, o.ph));
    });
    document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR';
    if (trocaTitulo) document.title = D[l].titulo;
    botoes.forEach((b) => b.setAttribute('aria-pressed', b.dataset.lingua === l ? 'true' : 'false'));
    I18N.lingua = l;
  }

  // Passo 4: trocar, guardar e avisar quem depende do idioma
  function trocar(l) {
    if (!IDIOMAS.includes(l) || l === I18N.lingua) return;
    aplicar(l);
    guardar('lingua', l);
    document.dispatchEvent(new CustomEvent('lingua', { detail: l }));
  }

  window.I18N = {
    lingua: 'pt',
    trocar,
    alternar: () => trocar(I18N.lingua === 'pt' ? 'en' : 'pt')
  };

  botoes.forEach((b) => b.addEventListener('click', () => trocar(b.dataset.lingua)));

  // Roda antes do main.js: quando ele montar a página, o idioma já está certo
  aplicar(escolherInicial());
})();
