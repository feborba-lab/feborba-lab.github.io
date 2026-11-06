/*
  AULA 9 · SQL de verdade dentro do navegador
  -------------------------------------------
  O SQLite é um banco de dados inteiro num arquivo só. O sql.js é o SQLite
  compilado para JavaScript: o site baixa o sql.js, cria a base na memória do
  navegador com a função abaixo e roda as consultas que o visitante escreve.
  Nada sai do computador de quem está vendo.

  Cópia de projetos/pipeline-sql/base.js, feita pelo gerador (gerar.js).
*/
/*
  Monta a base do pipeline (SQLite) a partir dos dados gerados.
  -------------------------------------------------------------
  O mesmo arquivo roda no navegador (portfólio) e no Node.js (gerador e testes).

  Os dados chegam como listas de números e códigos, para o arquivo ficar pequeno.
  Aqui eles viram tabelas de verdade, com os textos no idioma escolhido:
  em português as tabelas se chamam negocios, etapas...; em inglês, deals, stages...
  Os números são os mesmos nos dois idiomas.
*/
(function (raiz) {
  const ESQUEMA = {
    pt: `CREATE TABLE vendedores (
  id     INTEGER PRIMARY KEY,
  nome   TEXT NOT NULL,
  equipe TEXT NOT NULL
);

CREATE TABLE etapas (
  id            INTEGER PRIMARY KEY,
  nome          TEXT NOT NULL,
  ordem         INTEGER NOT NULL,
  probabilidade INTEGER NOT NULL  -- chance de fechar, em %, usada na previsão
);

CREATE TABLE negocios (
  id                  INTEGER PRIMARY KEY,
  empresa             TEXT NOT NULL,
  vendedor_id         INTEGER NOT NULL REFERENCES vendedores(id),
  origem              TEXT NOT NULL,
  valor               REAL,           -- em R$; às vezes falta (de propósito)
  etapa_id            INTEGER NOT NULL REFERENCES etapas(id),
  status              TEXT NOT NULL,  -- 'aberto', 'ganho' ou 'perdido'
  motivo_perda        TEXT,
  criado_em           TEXT NOT NULL,  -- datas no formato AAAA-MM-DD
  fechado_em          TEXT,
  previsao_fechamento TEXT
);

CREATE TABLE historico_etapas (
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  etapa_id   INTEGER NOT NULL REFERENCES etapas(id),
  entrou_em  TEXT NOT NULL
);`,
    en: `CREATE TABLE reps (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL
);

CREATE TABLE stages (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  position    INTEGER NOT NULL,
  probability INTEGER NOT NULL  -- chance to close, in %, used in the forecast
);

CREATE TABLE deals (
  id             INTEGER PRIMARY KEY,
  company        TEXT NOT NULL,
  rep_id         INTEGER NOT NULL REFERENCES reps(id),
  source         TEXT NOT NULL,
  amount         REAL,           -- in BRL; sometimes missing (on purpose)
  stage_id       INTEGER NOT NULL REFERENCES stages(id),
  status         TEXT NOT NULL,  -- 'open', 'won' or 'lost'
  loss_reason    TEXT,
  created_at     TEXT NOT NULL,  -- dates as YYYY-MM-DD
  closed_at      TEXT,
  expected_close TEXT
);

CREATE TABLE stage_history (
  deal_id    INTEGER NOT NULL REFERENCES deals(id),
  stage_id   INTEGER NOT NULL REFERENCES stages(id),
  entered_at TEXT NOT NULL
);`
  };

  // Os códigos dos dados viram estes textos (a posição na lista é o código)
  const ROTULOS = {
    pt: {
      tabelas: ['vendedores', 'etapas', 'negocios', 'historico_etapas'],
      status: ['aberto', 'ganho', 'perdido'],
      origem: ['Inbound', 'Outbound', 'Indicação', 'Evento'],
      motivo: ['Preço', 'Concorrente', 'Sem orçamento', 'Sem resposta', 'Projeto adiado', 'Fora do perfil'],
      etapa: ['Qualificação', 'Diagnóstico', 'Proposta enviada', 'Negociação'],
      equipe: ['Inside sales', 'Campo']
    },
    en: {
      tabelas: ['reps', 'stages', 'deals', 'stage_history'],
      status: ['open', 'won', 'lost'],
      origem: ['Inbound', 'Outbound', 'Referral', 'Event'],
      motivo: ['Price', 'Competitor', 'No budget', 'No response', 'Project postponed', 'Not a fit'],
      etapa: ['Qualification', 'Discovery', 'Proposal sent', 'Negotiation'],
      equipe: ['Inside sales', 'Field']
    }
  };

  // SQL: o módulo do sql.js (initSqlJs já resolvido) · P: os dados · lingua: 'pt' ou 'en'
  function montarBase(SQL, P, lingua) {
    const R = ROTULOS[lingua] || ROTULOS.pt;
    const [tV, tE, tN, tH] = R.tabelas;
    const db = new SQL.Database();
    db.run(ESQUEMA[lingua] || ESQUEMA.pt);
    // Uma transação deixa centenas de INSERTs muito mais rápidos
    db.run('BEGIN');
    const inserir = (tabela, n, linhas, converter) => {
      const st = db.prepare(`INSERT INTO ${tabela} VALUES (${Array(n).fill('?').join(',')})`);
      linhas.forEach((l) => st.run(converter(l)));
      st.free();
    };
    inserir(tV, 3, P.vendedores, ([id, nome, eq]) => [id, nome, R.equipe[eq]]);
    inserir(tE, 4, P.etapas, ([id, ordem, prob]) => [id, R.etapa[id - 1], ordem, prob]);
    inserir(tN, 11, P.negocios, ([id, emp, vend, ori, valor, etapa, st, mot, criado, fechado, prev]) =>
      [id, emp, vend, R.origem[ori], valor, etapa, R.status[st], mot === null ? null : R.motivo[mot], criado, fechado, prev]);
    inserir(tH, 3, P.historico, (l) => l);
    db.run('COMMIT');
    return db;
  }

  const api = { ESQUEMA, ROTULOS, montarBase };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(raiz, { PIPELINE_BASE: api });
})(typeof window !== 'undefined' ? window : this);
