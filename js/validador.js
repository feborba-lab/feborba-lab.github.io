/*
  AULA 7 · O mesmo código em dois lugares
  ----------------------------------------
  Este arquivo é a função validar() do projeto, a mesma que roda no nó
  "Code" do n8n (projetos/discovery-crm/n8n/validador.js). Aqui ela roda
  no navegador, para a demonstração ao vivo. Escrever a regra de negócio
  como uma função "pura" (recebe dados, devolve resultado, não depende de
  onde está rodando) é o que permite esse reaproveitamento.

  Gerado por projetos/discovery-crm/gerar_demo.js. Não edite aqui: edite o
  validador do projeto e rode o gerador de novo.
*/
/*
  Validador do blueprint de CRM
  ------------------------------
  A IA responde no formato certo (o schema garante isso), mas formato certo
  não quer dizer conteúdo certo. Este código confere as REGRAS DE NEGÓCIO:

  ERROS (o blueprint volta para a IA corrigir):
    - funil sem etapas suficientes, etapa repetida
    - campo do tipo lista sem opções
    - campo obrigatório numa etapa que não existe
    - item sem trecho de origem
    - trecho de origem que NÃO está na transcrição (sinal de invenção)
  AVISOS (vão para o consultor humano, não bloqueiam):
    - funil muito longo, campo repetido, integração a confirmar etc.

  O mesmo arquivo roda em dois lugares:
    - no n8n, colado num nó "Code" (usa $input e devolve itens)
    - no computador, com Node.js, para os testes (usa module.exports)

  Idiomas: as mensagens ficam na tabela MENSAGENS, em português e inglês.
  validar(bp, transcricao) usa português; validar(bp, transcricao, 'en'), inglês.
  As regras são as mesmas nos dois idiomas: só o texto muda.
*/

const MENSAGENS = {
  pt: {
    naoObjeto: () => 'A resposta não é um objeto JSON.',
    semFunil: () => 'Nenhum funil foi criado.',
    muitosFunis: (n) => `${n} funis é bastante. Confirme se todos são processos diferentes.`,
    funilRepetido: (f) => `Funil repetido: "${f}".`,
    funilCurto: (f, n) => `O funil "${f}" tem ${n} etapa(s). O mínimo é 3.`,
    funilLongo: (f, n) => `O funil "${f}" tem ${n} etapas. Funil longo costuma travar o time.`,
    etapaRepetida: (f, e) => `Etapa repetida no funil "${f}": "${e}".`,
    etapaTarefa: (e) => `A etapa "${e}" parece uma tarefa. Etapa costuma ser um estado, como "Proposta enviada".`,
    campoRepetido: (ent, c) => `Campo repetido em ${ent}: "${c}".`,
    listaSemOpcoes: (c) => `O campo "${c}" é do tipo lista mas não tem pelo menos 2 opções.`,
    opcoesSemLista: (c) => `O campo "${c}" tem opções mas não é do tipo lista.`,
    etapaInexistente: (c, e) => `O campo "${c}" é obrigatório na etapa "${e}", que não existe em nenhum funil.`,
    aConfirmar: (s) => `Integração com "${s}" ainda precisa ser confirmada.`,
    trechoCurto: (i) => `O trecho de origem de "${i}" é curto demais para conferir.`,
    trechoInventado: (i, t) => `O trecho citado para "${i}" não aparece na transcrição: "${t}". Cite as palavras exatas da reunião ou remova o item.`,
    semOrigem: (tipo, nome) => `${tipo} "${nome}" não tem trecho de origem.`,
    semDuvidas: () => 'Nenhuma dúvida para o cliente. É raro uma reunião não deixar nada em aberto.',
    parouAntes: (motivo) => `A IA parou antes de terminar (stop_reason: ${motivo}).`,
    tipos: { etapa: 'A etapa', campo: 'O campo', automacao: 'A automação', integracao: 'A integração' },
    entidades: { cliente: 'cliente', negocio: 'negócio', proposta: 'proposta' }
  },
  en: {
    naoObjeto: () => 'The response is not a JSON object.',
    semFunil: () => 'No pipeline was created.',
    muitosFunis: (n) => `${n} pipelines is a lot. Check that each one is a different process.`,
    funilRepetido: (f) => `Duplicate pipeline: "${f}".`,
    funilCurto: (f, n) => `The pipeline "${f}" has ${n} stage(s). The minimum is 3.`,
    funilLongo: (f, n) => `The pipeline "${f}" has ${n} stages. Long pipelines tend to slow the team down.`,
    etapaRepetida: (f, e) => `Duplicate stage in pipeline "${f}": "${e}".`,
    etapaTarefa: (e) => `The stage "${e}" looks like a task. A stage is usually a state, like "Proposal sent".`,
    campoRepetido: (ent, c) => `Duplicate field on ${ent}: "${c}".`,
    listaSemOpcoes: (c) => `The field "${c}" is a picklist but has fewer than 2 options.`,
    opcoesSemLista: (c) => `The field "${c}" has options but is not a picklist.`,
    etapaInexistente: (c, e) => `The field "${c}" is required at stage "${e}", which does not exist in any pipeline.`,
    aConfirmar: (s) => `The integration with "${s}" still needs to be confirmed.`,
    trechoCurto: (i) => `The source quote for "${i}" is too short to check.`,
    trechoInventado: (i, t) => `The quote cited for "${i}" does not appear in the transcript: "${t}". Quote the exact words from the meeting or remove the item.`,
    semOrigem: (tipo, nome) => `${tipo} "${nome}" has no source quote.`,
    semDuvidas: () => 'No open questions for the client. A meeting rarely leaves nothing open.',
    parouAntes: (motivo) => `The AI stopped before finishing (stop_reason: ${motivo}).`,
    tipos: { etapa: 'The stage', campo: 'The field', automacao: 'The automation', integracao: 'The integration' },
    entidades: { cliente: 'account', negocio: 'deal', proposta: 'quote' }
  }
};

// Deixa o texto comparável: sem acento, minúsculo, espaços únicos, sem pontuação nas pontas
function normalizar(t) {
  return String(t || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[“”"'‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,;:!?…\s]+|[.,;:!?…\s]+$/g, '');
}

function validar(bp, transcricao, lingua) {
  const M = MENSAGENS[lingua] || MENSAGENS.pt;
  const erros = [];
  const avisos = [];
  const texto = normalizar(transcricao);

  if (!bp || typeof bp !== 'object') {
    return { ok: false, erros: [M.naoObjeto()], avisos, resumo: null };
  }
  const funis = bp.funis || [];
  const campos = bp.campos || [];
  const automacoes = bp.automacoes || [];
  const integracoes = bp.integracoes || [];
  const origem = bp.origem || [];

  // ---- Funis e etapas ----
  if (funis.length === 0) erros.push(M.semFunil());
  if (funis.length > 4) avisos.push(M.muitosFunis(funis.length));
  const etapasTodas = new Set();
  const nomesFunis = new Set();
  for (const f of funis) {
    if (nomesFunis.has(normalizar(f.nome))) erros.push(M.funilRepetido(f.nome));
    nomesFunis.add(normalizar(f.nome));
    const etapas = f.etapas || [];
    if (etapas.length < 3) erros.push(M.funilCurto(f.nome, etapas.length));
    if (etapas.length > 10) avisos.push(M.funilLongo(f.nome, etapas.length));
    const vistas = new Set();
    for (const e of etapas) {
      const n = normalizar(e.nome);
      if (vistas.has(n)) erros.push(M.etapaRepetida(f.nome, e.nome));
      vistas.add(n);
      etapasTodas.add(n);
      // começa com verbo de ação? então parece tarefa, não estado
      if (/^(enviar|fazer|ligar|agendar|criar|montar|send|make|call|schedule|create|build)\b/.test(n)) {
        avisos.push(M.etapaTarefa(e.nome));
      }
    }
  }

  // ---- Campos ----
  const nomesCampos = new Set();
  for (const c of campos) {
    const chave = c.entidade + ':' + normalizar(c.nome);
    if (nomesCampos.has(chave)) avisos.push(M.campoRepetido(M.entidades[c.entidade] || c.entidade, c.nome));
    nomesCampos.add(chave);
    if (c.tipo === 'lista' && (!c.opcoes || c.opcoes.length < 2)) erros.push(M.listaSemOpcoes(c.nome));
    if (c.tipo !== 'lista' && c.opcoes && c.opcoes.length) avisos.push(M.opcoesSemLista(c.nome));
    if (c.obrigatorio_na_etapa && !etapasTodas.has(normalizar(c.obrigatorio_na_etapa))) {
      erros.push(M.etapaInexistente(c.nome, c.obrigatorio_na_etapa));
    }
  }

  // ---- Integrações ----
  for (const i of integracoes) {
    if (i.status === 'a_confirmar') avisos.push(M.aConfirmar(i.sistema));
  }

  // ---- Origem: cada item precisa de um trecho, e o trecho precisa existir ----
  const origemPorItem = new Map();
  for (const o of origem) {
    const item = normalizar(o.item);
    if (!origemPorItem.has(item)) origemPorItem.set(item, []);
    origemPorItem.get(item).push(o.trecho);
    const trecho = normalizar(o.trecho);
    if (trecho.length < 8) erros.push(M.trechoCurto(o.item));
    else if (!texto.includes(trecho)) erros.push(M.trechoInventado(o.item, o.trecho));
  }
  const precisamOrigem = [
    ...funis.flatMap((f) => (f.etapas || []).map((e) => ['etapa', e.nome])),
    ...campos.map((c) => ['campo', c.nome]),
    ...automacoes.map((a) => ['automacao', a.nome]),
    ...integracoes.map((i) => ['integracao', i.sistema])
  ];
  for (const [tipo, nome] of precisamOrigem) {
    if (!origemPorItem.has(normalizar(nome))) erros.push(M.semOrigem(M.tipos[tipo], nome));
  }

  // ---- Dúvidas ----
  if (!(bp.duvidas_para_o_cliente || []).length) avisos.push(M.semDuvidas());

  const resumo = {
    funis: funis.length,
    etapas: funis.reduce((s, f) => s + (f.etapas || []).length, 0),
    campos: campos.length,
    automacoes: automacoes.length,
    integracoes: integracoes.length,
    duvidas: (bp.duvidas_para_o_cliente || []).length
  };
  return { ok: erros.length === 0, erros, avisos, resumo };
}
