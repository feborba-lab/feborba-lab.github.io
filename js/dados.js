/*
  AULA 3 · Separar DADOS de APRESENTAÇÃO
  ---------------------------------------
  Todo o conteúdo que se repete (frentes, etapas, ferramentas, textos dos
  botões) fica aqui, num objeto JavaScript. O HTML só tem "buracos" e o
  main.js preenche. Para mudar um texto você mexe num lugar só, e o mesmo
  dado pode alimentar várias partes da página.

  Agora o objeto tem dois "andares": DADOS.pt e DADOS.en. Os dois têm
  exatamente as mesmas chaves; só o texto muda. O main.js sempre lê
  DADOS[idioma atual] (veja a AULA 8 em js/i18n.js).

  É a mesma ideia de um payload JSON no n8n: estrutura de um lado,
  quem consome do outro.

  Outros dois arquivos de dados são GERADOS pelos projetos, não editados à mão:
    js/discovery-dados.js  a reunião e o blueprint da demo do validador
    js/pipeline-dados.js   a base fictícia e as consultas de SQL
*/
window.DADOS = {

  /* =====================================================================
     PORTUGUÊS
     ===================================================================== */
  pt: {
    titulo: 'Fernando Borba · CRM, RevOps e automação com IA',

    // "O que eu faço": cada frente diz de onde vem (selo) e leva para a prova
    frentes: [
      {
        nome: 'Implantação de CRM e CPQ', selo: 'exp',
        texto: 'Mais de 100 projetos B2B, do discovery ao go-live: requisitos, desenho da solução, parametrização, treinamento e adoção.',
        prova: 'Ver o método', acao: 'ir:metodo'
      },
      {
        nome: 'CRM Ops e processo comercial', selo: 'exp',
        texto: 'Funis, etapas, campos, fórmulas e regras de negócio configurados a partir do processo de cada cliente, com documentação para o time manter.',
        prova: 'Ver a trajetória', acao: 'ir:trajetoria'
      },
      {
        nome: 'Automação e integrações', selo: 'exp',
        texto: 'Fluxos em n8n com webhooks e API REST, trocando dados em JSON entre o CRM e o resto da operação.',
        prova: 'Executar um fluxo', acao: 'executar'
      },
      {
        nome: 'Análise de pipeline com SQL', selo: 'estudo',
        texto: 'Conversão por etapa, ciclo de venda, previsão e qualidade dos dados, em SQL sobre uma base fictícia de CRM.',
        prova: 'Rodar as consultas', acao: 'ir:sql'
      },
      {
        nome: 'IA aplicada à implantação', selo: 'pessoal',
        texto: 'Um fluxo que lê a reunião de discovery e propõe a configuração do CRM, com um validador que barra o que foi inventado.',
        prova: 'Tentar enganar o validador', acao: 'ir:demo'
      }
    ],

    // Etapas do fluxo do projeto com IA (diagrama clicável). "tipo" decide a cor.
    arquitetura: [
      {
        tipo: 'n8n', onde: 'n8n', titulo: 'Formulário',
        resumo: 'O consultor cola a transcrição da reunião num formulário do próprio n8n.',
        itens: ['O formulário dispara o fluxo. Nada de copiar e colar entre ferramentas.', 'Só entram reuniões fictícias ou com autorização do cliente.'],
        codigo: 'Formulário de discovery\n  Empresa: Grão Norte\n  Transcrição: [texto da reunião]'
      },
      {
        tipo: 'ia', onde: 'API do Claude', titulo: 'IA com formato fixo',
        resumo: 'Um nó HTTP chama a API do Claude com o prompt e um JSON Schema que trava o formato da resposta.',
        itens: ['O schema define funis, etapas, campos, automações, integrações e dúvidas.', 'Cada item precisa vir com o trecho da reunião que o justifica.', 'A chave da API fica numa credencial do n8n, nunca no código.'],
        codigo: 'POST /v1/messages\n"output_config": {\n  "format": { "type": "json_schema", ... }\n}'
      },
      {
        tipo: 'n8n', onde: 'n8n', titulo: 'Validador',
        resumo: 'Um nó Code em JavaScript confere as regras de negócio que o formato sozinho não garante.',
        itens: ['Confere se cada trecho citado existe mesmo na transcrição.', 'Barra funil curto, etapa repetida, lista sem opções e campo obrigatório numa etapa que não existe.', 'Separa erros, que bloqueiam, de avisos, que vão para o consultor.'],
        codigo: '{ "ok": false,\n  "erros": ["O trecho citado para \'Prazo\' não aparece na transcrição"] }'
      },
      {
        tipo: 'ia', onde: 'API do Claude', titulo: 'Correção automática',
        resumo: 'Se houver erro, a resposta volta para a IA com a lista de problemas, uma vez.',
        itens: ['A IA recebe a própria resposta e os erros, e devolve o blueprint completo corrigido.', 'Se ainda falhar, o fluxo para e mostra os erros. Não insiste para sempre.'],
        codigo: 'messages: [pedido, resposta_anterior,\n  "O validador encontrou estes problemas: ..."]'
      },
      {
        tipo: 'pessoa', onde: 'consultor', titulo: 'Revisão do consultor',
        resumo: 'O resumo aparece na tela: funis, etapas, perguntas para o cliente e avisos.',
        itens: ['As dúvidas viram a pauta da próxima reunião com o cliente.', 'Nada vai para o CRM sem essa aprovação.'],
        codigo: 'Funil Produtor rural:\n  Visita feita → Recomendação técnica →\n  Cotação enviada → Negociação → Pedido no ERP'
      },
      {
        tipo: 'futuro', onde: 'fase 2', titulo: 'Criação no Ploomes',
        resumo: 'Próxima fase: com o blueprint aprovado, criar funis, etapas e campos numa conta de teste pela API do Ploomes.',
        itens: ['Mesmo padrão das automações que faço no dia a dia: HTTP Request, JSON e API REST.', 'Relatório no fim com o que foi criado e o que ficou para fazer à mão.'],
        codigo: 'POST /Deals@Pipelines\nPOST /Fields\n→ relatório com os Ids criados'
      }
    ],

    // Demo "Tente enganar o validador": as sabotagens e os nomes que elas usam
    demo: {
      sabotagens: [
        { id: 'inventar', nome: 'Inventar um campo' },
        { id: 'apagar', nome: 'Apagar uma prova' },
        { id: 'encurtar', nome: 'Encurtar um funil' },
        { id: 'etapa', nome: 'Exigir etapa inexistente' }
      ],
      campoInventado: { entidade: 'negocio', nome: 'Prazo de pagamento', tipo: 'lista', opcoes: ['30 dias', '60 dias', '90 dias'], obrigatorio_na_etapa: null, motivo: 'Inventado para o teste' },
      trechoInventado: 'O cliente sempre paga em 90 dias',
      provaApagada: 'Recomendação técnica',
      funilCurto: 'Revenda',
      campoComEtapa: 'Volume (t)',
      etapaFalsa: 'Aprovação financeira'
    },

    // Etapas do método de implantação (seção "Método")
    metodo: [
      { nome: 'Discovery', texto: 'Reuniões para entender o negócio, o funil atual e onde dói.' },
      { nome: 'Requisitos e processos', texto: 'Levantamento de requisitos e mapeamento do processo comercial.' },
      { nome: 'Desenho da solução', texto: 'Definição funcional: funis, campos, regras e o que vira automação.' },
      { nome: 'Parametrização', texto: 'Configuração da plataforma com regras de negócio, fórmulas e automações.' },
      { nome: 'Integrações', texto: 'Fluxos em n8n com webhooks e API REST para ligar o CRM ao resto da operação.' },
      { nome: 'Treinamento', texto: 'Onboarding e treinamento dos usuários, com documentação para o time manter.' },
      { nome: 'Go-live e adoção', texto: 'Virada para produção e acompanhamento próximo da adoção.' }
    ],

    // Ferramentas, agrupadas. O último grupo é de projetos pessoais, não de trabalho.
    stack: [
      { grupo: 'Plataformas', itens: ['Ploomes CRM', 'Ploomes CPQ'] },
      { grupo: 'Automação e integração', itens: ['n8n', 'APIs REST', 'Webhooks', 'JSON'] },
      { grupo: 'Código', itens: ['HTML', 'CSS', 'JavaScript'] },
      { grupo: 'Gestão e dados', itens: ['ClickUp', 'Excel Avançado', 'Google Sheets (avançado)', 'Google Docs/Drive'] },
      { grupo: 'Em projetos pessoais', pessoal: true, itens: ['SQL (SQLite)', 'API do Claude', 'JSON Schema'] }
    ],

    // Comandos da paleta (Ctrl+K). "acao" é tratada no main.js.
    comandos: [
      { nome: 'Ver o que eu faço', dica: 'seção', acao: 'ir:frentes' },
      { nome: 'Ir para o projeto com IA', dica: 'seção', acao: 'ir:projeto' },
      { nome: 'Tentar enganar o validador', dica: 'demo', acao: 'ir:demo' },
      { nome: 'Rodar uma consulta SQL', dica: 'demo', acao: 'ir:sql' },
      { nome: 'Executar o fluxo de automação', dica: 'demo', acao: 'executar' },
      { nome: 'Ver o método de implantação', dica: 'seção', acao: 'ir:metodo' },
      { nome: 'Ver trajetória e ferramentas', dica: 'seção', acao: 'ir:trajetoria' },
      { nome: 'Copiar e-mail', dica: 'ação', acao: 'copiar' },
      { nome: 'Abrir LinkedIn', dica: 'link', acao: 'linkedin' },
      { nome: 'Trocar tema claro / escuro', dica: 'ação', acao: 'tema' },
      { nome: 'View in English', dica: 'idioma', acao: 'lingua' }
    ],

    // O editor de fluxo do topo (js/fluxo.js)
    fluxo: {
      executar: '▶ Executar',
      deNovo: '↻ Executar de novo',
      aguardando: 'aguardando execução',
      concluido: (ms) => `concluído em ${ms} ms, 4 nós`,
      dica: { dica: 'aperte ▶ Executar para ver o payload passando por cada etapa' },
      etapas: [
        { titulo: 'webhook recebido', json: { event: 'deal.won', deal: { id: 48213, title: 'Expansão CPQ · Filial Sul', amount: 86400, stage: 'Ganho' }, owner: { name: 'Marina', email: 'marina@empresa.com' } } },
        { titulo: 'n8n valida e transforma', json: { ok: true, checks: ['amount > 0', 'owner.email válido', 'sem projeto duplicado'], projeto: { nome: 'Implantação · Expansão CPQ · Filial Sul', valor: 'R$ 86.400,00', prazo_dias: 90 } } },
        { titulo: 'POST /projects → 201', json: { status: 201, id: 'prj_7Q2K', etapas_criadas: ['Discovery', 'Parametrização', 'Treinamento', 'Go-live'] } },
        { titulo: 'mensagem enviada', json: { canal: '#implantacoes', texto: 'Novo projeto: Expansão CPQ · Filial Sul (90 dias). Responsável: Marina.' } }
      ]
    },

    // Textos que o JavaScript escreve na página
    ui: {
      selos: { exp: 'experiência', pessoal: 'projeto pessoal', estudo: 'projeto de estudo' },
      copiado: 'E-mail copiado',
      selecioneEmail: 'Selecionei o e-mail. Use Ctrl+C',
      paletaVazia: 'Nada encontrado. Tente "projeto" ou "contato".',

      // demo do validador
      sabotar: 'sabotar:',
      restaurar: 'Restaurar',
      blueprintRotulo: 'blueprint de exemplo',
      funil: 'Funil',
      camposNegocio: 'Campos do negócio',
      automacoesIntegracoes: 'Automações e integrações',
      obrigatorioEm: 'obrigatório em',
      tiposCampo: { texto: 'texto', texto_longo: 'texto longo', numero: 'número', moeda: 'moeda', data: 'data', lista: 'lista', sim_nao: 'sim/não', usuario: 'usuário' },
      tiposAutomacao: { nativa: 'nativa', n8n: 'n8n' },
      statusIntegracao: { confirmada: 'confirmada', a_confirmar: 'a confirmar' },
      aprovado: '✓ Blueprint aprovado pelo validador',
      barrado: (n) => `✗ Barrado: ${n} erro(s). Volta para a IA corrigir`,
      resumoValidacao: (r, ms) => `${r.funis} funis, ${r.etapas} etapas e ${r.campos} campos, validado em ${ms} ms`,
      dicaSabotar: 'Use os botões acima para sabotar o blueprint.',

      // funil do método
      cartaoProjeto: 'Projeto de implantação',
      cronograma: (p) => `${p}% do cronograma`,
      golive: 'go-live ✓',

      // console de SQL
      sql: {
        ensina: 'Ensina',
        carregando: 'carregando o SQLite…',
        pronto: (v) => `SQLite ${v} rodando no seu navegador`,
        falhou: 'O SQLite não carregou. Mostrando os resultados salvos.',
        aoVivo: (n, ms) => `ao vivo, ${n} linha(s) em ${ms} ms`,
        salvo: (n) => `resultado salvo, ${n} linha(s)`,
        cortado: (m) => `mostrando as primeiras ${m} linhas`,
        semLinhas: 'Comando executado. Nenhuma linha voltou.',
        erro: 'Erro do SQLite',
        esperando: 'O SQLite ainda está carregando. Assim que terminar, a consulta roda.',
        semMotor: 'Para rodar uma consulta editada o SQLite precisa carregar, e ele não carregou neste navegador. A consulta original continua com o resultado salvo.',
        editada: 'consulta editada',
        restaurada: 'Consulta e base restauradas',
        linhas: (n) => `${n} linhas`,
        chave: 'chave',
        liga: (t) => `liga em ${t}`
      },

      consoleOi: 'Oi! Se você abriu o console, a gente provavelmente vai se dar bem.',
      consoleSobre: 'Este site é HTML, CSS e JavaScript puro. Sem framework, sem build. Experimente: DADOS.pt.frentes'
    }
  },

  /* =====================================================================
     ENGLISH
     ===================================================================== */
  en: {
    titulo: 'Fernando Borba · CRM, RevOps & AI automation',

    // Textos fixos do HTML em inglês (o português está no próprio index.html)
    html: {
      'pular': 'Skip to content',
      'marca': 'Home',
      'menu': 'Sections',
      'menu.frentes': 'What I do',
      'menu.projetos': 'Projects',
      'menu.metodo': 'Method',
      'menu.trajetoria': 'Experience',
      'menu.contato': 'Contact',
      'lingua': 'Language',
      'paleta.abrir': 'Open menu and commands',
      'tema': 'Toggle light or dark theme',
      'heroi.quem': 'Fernando Borba, consultant in São Paulo, Brazil',
      'heroi.destaque': '&amp; AI automation',
      'heroi.lead': 'From discovery to go-live, for B2B companies. Sales process, automation and integrations with n8n and REST APIs.',
      'heroi.ver': 'See the projects',
      'heroi.falar': 'Get in touch',
      'num.implantacoes': 'CRM and CPQ implementations',
      'num.ciclo': 'Average time to go-live',
      'num.meses': '~<span data-conta="3">3</span> weeks',
      'num.primeiro': 'First Ploomes project',
      'fluxo.label': 'Demo of an automation flow',
      'fluxo.nome': 'Won deal becomes a project',
      'fluxo.tag': 'illustrative example',
      'fluxo.no1': 'Deal won in the CRM',
      'fluxo.no2': 'Validate and transform',
      'fluxo.tipo3': 'REST API',
      'fluxo.no3': 'Create implementation project',
      'fluxo.tipo4': 'Notification',
      'fluxo.no4': 'Notify the team in chat',
      'fluxo.dica': 'Drag the blocks',
      'frentes.rotulo': 'What I do',
      'frentes.titulo': 'From implementation to pipeline data',
      'frentes.lead': 'Each area says where it comes from, professional experience or a personal project, and links to the proof right here on the page.',
      'projeto.rotulo': 'Personal project, built with n8n, the Claude API and JavaScript.',
      'projeto.fase': 'Phase 1 of 3 is done.',
      'projeto.titulo': 'From discovery to a configured CRM',
      'projeto.lead': 'In an implementation, the discovery meeting turns into hours of configuration. I am building an n8n flow that reads the meeting transcript, asks an AI for the CRM blueprint (pipelines, stages, fields and automations) and only accepts what has proof in the conversation itself. The AI proposes, the code checks and the consultant approves.',
      'projeto.trilha': 'Flow steps',
      'regras.titulo': 'Rules before the prompt',
      'regras.lista': '<li>Every item must quote the meeting word for word. No quote, no item.</li><li>Whatever the meeting left unclear becomes a question for the client, not a guess.</li><li>The AI answers in a fixed format, defined by a JSON Schema.</li><li>Nothing is created in the CRM without a person approving it.</li><li>Only fictional or authorized transcripts. Never client data.</li>',
      'trecho.titulo': 'A real excerpt',
      'trecho.comentario': '// validador.js · n8n Code node',
      'trecho.nota': 'A quote that is not in the meeting is a sign of a made-up item: it gets blocked and goes back to the AI to fix.',
      'onde.titulo': 'Where it stands',
      'onde.nos': 'Nodes in the n8n flow',
      'onde.reunioes': 'Fictional meetings for testing',
      'onde.erros': 'Planted errors the validator caught',
      'onde.erros.valor': '4 of 4',
      'onde.proxima': 'Next phase',
      'onde.proxima.valor': 'Ploomes API',
      'demo.rotulo': 'Live demo',
      'demo.titulo': 'Try to fool the validator',
      'demo.texto': 'On the left, a fictional meeting. On the right, a sample blueprint for it. The validator below is the same code that runs in n8n, running right now in your browser. Click an item to see its proof in the conversation.',
      'demo.chips': 'Changes to the blueprint',
      'demo.transcricao': 'Transcript of the fictional meeting',
      'sql.rotulo': 'Study project in SQL.',
      'sql.selo': 'The data is fictional.',
      'sql.titulo': 'The pipeline, answered in SQL',
      'sql.lead': 'A fictional CRM database with 300 deals, 6 reps and the history of every stage change. Each query answers a question a RevOps team asks every week. The SQL really runs in your browser: you can edit it and run it again.',
      'sql.perguntas': 'Questions',
      'sql.editor': 'SQL query, editable',
      'sql.rodar': '▶ Run',
      'sql.restaurar': 'Restore',
      'sql.dica': '<kbd>Ctrl</kbd> + <kbd>Enter</kbd> also runs it',
      'sql.tabelas': 'See the database tables',
      'metodo.rotulo': 'How I run an implementation',
      'metodo.titulo': "From discovery to go-live, on the project's own pipeline",
      'metodo.lead': 'Scroll down and watch the project card move through the stages.',
      'traj.rotulo': 'Experience',
      'traj.titulo': 'Where I learned what I know',
      'traj.c1.quando': 'Mar 2025 to present',
      'traj.c1.cargo': 'Implementation &amp; Customer Success Consultant (CPQ)',
      'traj.c1.onde': 'Ploomes partner company',
      'traj.c1.itens': '<li>Full implementation cycle of the Ploomes CPQ solution, from discovery to go-live.</li><li>n8n automations integrating webhooks and the Ploomes REST API: queries, updates and business rules adapted to each project.</li><li>Platform configuration with business rules, formulas and automations.</li><li>User training, onboarding and adoption follow-up, bridging Sales, Product and Engineering.</li><li>Functional and technical documentation so the team can maintain the solutions.</li>',
      'traj.c2.quando': 'Jan 2024 to Mar 2025',
      'traj.c2.cargo': 'CRM Implementation Consultant (freelance)',
      'traj.c2.onde': 'Ploomes partner',
      'traj.c2.itens': "<li>Ploomes CRM implementation for companies in different industries, from the first negotiation to final delivery.</li><li>Requirements gathering and tailored solutions for each client's sales process.</li><li>Custom documents and proposals in HTML, CSS and JavaScript, self-taught.</li>",
      'contato.rotulo': 'Contact',
      'contato.titulo': "Let's talk",
      'contato.lead': "I'm looking for RevOps, CRM Ops, implementation and automation roles, hands-on with systems and data.",
      'contato.email': 'Email',
      'contato.copiar': 'Copy',
      'contato.abrir': 'Open',
      'contato.conversar': 'Message',
      'rodape': 'Built with plain HTML, CSS and JavaScript, no framework, with help from AI. Press <kbd>Ctrl</kbd> <kbd>K</kbd> to navigate.',
      'paleta.label': 'Command palette',
      'paleta.busca': 'Where do you want to go?',
      'paleta.buscar': 'Search commands',
      'paleta.dica': '<kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close'
    },

    frentes: [
      {
        nome: 'CRM & CPQ implementation', selo: 'exp',
        texto: '100+ B2B projects from discovery to go-live: requirements, solution design, configuration, training and adoption.',
        prova: 'See the method', acao: 'ir:metodo'
      },
      {
        nome: 'CRM Ops & sales process', selo: 'exp',
        texto: "Pipelines, stages, fields, formulas and business rules configured around each client's process, documented so the team can maintain them.",
        prova: 'See experience', acao: 'ir:trajetoria'
      },
      {
        nome: 'Automation & integrations', selo: 'exp',
        texto: 'n8n flows with webhooks and REST APIs, moving JSON between the CRM and the rest of the operation.',
        prova: 'Run a flow', acao: 'executar'
      },
      {
        nome: 'Pipeline analytics with SQL', selo: 'estudo',
        texto: 'Stage conversion, sales cycle, forecast and data quality, in SQL over a fictional CRM database.',
        prova: 'Run the queries', acao: 'ir:sql'
      },
      {
        nome: 'AI applied to implementation', selo: 'pessoal',
        texto: 'A flow that reads the discovery meeting and proposes the CRM setup, with a validator that blocks anything made up.',
        prova: 'Try to fool the validator', acao: 'ir:demo'
      }
    ],

    arquitetura: [
      {
        tipo: 'n8n', onde: 'n8n', titulo: 'Form',
        resumo: 'The consultant pastes the meeting transcript into a form inside n8n.',
        itens: ['The form triggers the flow. No copying and pasting between tools.', 'Only fictional meetings, or ones the client authorized.'],
        codigo: 'Discovery form\n  Company: Grão Norte\n  Transcript: [meeting text]'
      },
      {
        tipo: 'ia', onde: 'Claude API', titulo: 'AI with a fixed format',
        resumo: 'An HTTP node calls the Claude API with the prompt and a JSON Schema that locks the response format.',
        itens: ['The schema defines pipelines, stages, fields, automations, integrations and open questions.', 'Each item must come with the meeting quote that justifies it.', 'The API key lives in an n8n credential, never in the code.'],
        codigo: 'POST /v1/messages\n"output_config": {\n  "format": { "type": "json_schema", ... }\n}'
      },
      {
        tipo: 'n8n', onde: 'n8n', titulo: 'Validator',
        resumo: "A JavaScript Code node checks the business rules that the format alone can't guarantee.",
        itens: ['Checks that each quoted excerpt really exists in the transcript.', "Blocks short pipelines, duplicate stages, picklists without options and fields required at a stage that doesn't exist.", 'Separates errors, which block, from warnings, which go to the consultant.'],
        codigo: '{ "ok": false,\n  "erros": ["The quote cited for \'Payment terms\' does not appear in the transcript"] }'
      },
      {
        tipo: 'ia', onde: 'Claude API', titulo: 'Automatic correction',
        resumo: 'If there are errors, the response goes back to the AI with the list of problems, once.',
        itens: ['The AI gets its own answer plus the errors, and returns the full corrected blueprint.', "If it still fails, the flow stops and shows the errors. It doesn't retry forever."],
        codigo: 'messages: [request, previous_answer,\n  "The validator found these problems: ..."]'
      },
      {
        tipo: 'pessoa', onde: 'consultant', titulo: 'Consultant review',
        resumo: 'The summary shows up on screen: pipelines, stages, questions for the client and warnings.',
        itens: ['The open questions become the agenda for the next client meeting.', 'Nothing goes into the CRM without this approval.'],
        codigo: 'Farmer pipeline:\n  Visit done → Technical recommendation →\n  Quote sent → Negotiation → Order in ERP'
      },
      {
        tipo: 'futuro', onde: 'phase 2', titulo: 'Creation in Ploomes',
        resumo: 'Next phase: once the blueprint is approved, create pipelines, stages and fields in a test account through the Ploomes API.',
        itens: ['The same pattern as the automations I build day to day: HTTP Request, JSON and REST API.', 'A report at the end with what was created and what is left to do by hand.'],
        codigo: 'POST /Deals@Pipelines\nPOST /Fields\n→ report with the created Ids'
      }
    ],

    demo: {
      sabotagens: [
        { id: 'inventar', nome: 'Make up a field' },
        { id: 'apagar', nome: 'Delete a proof' },
        { id: 'encurtar', nome: 'Shorten a pipeline' },
        { id: 'etapa', nome: 'Require a missing stage' }
      ],
      campoInventado: { entidade: 'negocio', nome: 'Payment terms', tipo: 'lista', opcoes: ['30 days', '60 days', '90 days'], obrigatorio_na_etapa: null, motivo: 'Made up for the test' },
      trechoInventado: 'The customer always pays in 90 days',
      provaApagada: 'Technical recommendation',
      funilCurto: 'Reseller',
      campoComEtapa: 'Volume (t)',
      etapaFalsa: 'Financial approval'
    },

    metodo: [
      { nome: 'Discovery', texto: 'Meetings to understand the business, the current pipeline and where it hurts.' },
      { nome: 'Requirements & process', texto: 'Requirements gathering and mapping of the sales process.' },
      { nome: 'Solution design', texto: 'Functional design: pipelines, fields, rules and what becomes automation.' },
      { nome: 'Configuration', texto: 'Platform setup with business rules, formulas and automations.' },
      { nome: 'Integrations', texto: 'n8n flows with webhooks and REST APIs to connect the CRM to the rest of the operation.' },
      { nome: 'Training', texto: 'User onboarding and training, with documentation the team can maintain.' },
      { nome: 'Go-live & adoption', texto: 'Switch to production and close follow-up on adoption.' }
    ],

    stack: [
      { grupo: 'Platforms', itens: ['Ploomes CRM', 'Ploomes CPQ'] },
      { grupo: 'Automation & integration', itens: ['n8n', 'REST APIs', 'Webhooks', 'JSON'] },
      { grupo: 'Code', itens: ['HTML', 'CSS', 'JavaScript'] },
      { grupo: 'Management & data', itens: ['ClickUp', 'Advanced Excel', 'Google Sheets (advanced)', 'Google Docs/Drive'] },
      { grupo: 'In personal projects', pessoal: true, itens: ['SQL (SQLite)', 'Claude API', 'JSON Schema'] }
    ],

    comandos: [
      { nome: 'See what I do', dica: 'section', acao: 'ir:frentes' },
      { nome: 'Go to the AI project', dica: 'section', acao: 'ir:projeto' },
      { nome: 'Try to fool the validator', dica: 'demo', acao: 'ir:demo' },
      { nome: 'Run a SQL query', dica: 'demo', acao: 'ir:sql' },
      { nome: 'Run the automation flow', dica: 'demo', acao: 'executar' },
      { nome: 'See the implementation method', dica: 'section', acao: 'ir:metodo' },
      { nome: 'See experience and tools', dica: 'section', acao: 'ir:trajetoria' },
      { nome: 'Copy email', dica: 'action', acao: 'copiar' },
      { nome: 'Open LinkedIn', dica: 'link', acao: 'linkedin' },
      { nome: 'Toggle light / dark theme', dica: 'action', acao: 'tema' },
      { nome: 'Ver em português', dica: 'language', acao: 'lingua' }
    ],

    fluxo: {
      executar: '▶ Run',
      deNovo: '↻ Run again',
      aguardando: 'waiting to run',
      concluido: (ms) => `finished in ${ms} ms, 4 nodes`,
      dica: { tip: 'press ▶ Run to watch the payload move through each step' },
      etapas: [
        { titulo: 'webhook received', json: { event: 'deal.won', deal: { id: 48213, title: 'CPQ expansion · South branch', amount: 86400, stage: 'Won' }, owner: { name: 'Marina', email: 'marina@company.com' } } },
        { titulo: 'n8n validates and transforms', json: { ok: true, checks: ['amount > 0', 'owner.email is valid', 'no duplicate project'], project: { name: 'Implementation · CPQ expansion · South branch', value: 'R$86,400.00', deadline_days: 90 } } },
        { titulo: 'POST /projects → 201', json: { status: 201, id: 'prj_7Q2K', stages_created: ['Discovery', 'Configuration', 'Training', 'Go-live'] } },
        { titulo: 'message sent', json: { channel: '#implementations', text: 'New project: CPQ expansion · South branch (90 days). Owner: Marina.' } }
      ]
    },

    ui: {
      selos: { exp: 'experience', pessoal: 'personal project', estudo: 'study project' },
      copiado: 'Email copied',
      selecioneEmail: 'Email selected. Press Ctrl+C',
      paletaVazia: 'Nothing found. Try "project" or "contact".',

      sabotar: 'sabotage:',
      restaurar: 'Restore',
      blueprintRotulo: 'sample blueprint',
      funil: 'Pipeline',
      camposNegocio: 'Deal fields',
      automacoesIntegracoes: 'Automations and integrations',
      obrigatorioEm: 'required at',
      tiposCampo: { texto: 'text', texto_longo: 'long text', numero: 'number', moeda: 'currency', data: 'date', lista: 'picklist', sim_nao: 'yes/no', usuario: 'user' },
      tiposAutomacao: { nativa: 'native', n8n: 'n8n' },
      statusIntegracao: { confirmada: 'confirmed', a_confirmar: 'to confirm' },
      aprovado: '✓ Blueprint approved by the validator',
      barrado: (n) => `✗ Blocked: ${n} error(s). Sent back to the AI to fix`,
      resumoValidacao: (r, ms) => `${r.funis} pipelines, ${r.etapas} stages and ${r.campos} fields, checked in ${ms} ms`,
      dicaSabotar: 'Use the buttons above to sabotage the blueprint.',

      cartaoProjeto: 'Implementation project',
      cronograma: (p) => `${p}% of the schedule`,
      golive: 'go-live ✓',

      sql: {
        ensina: 'Teaches',
        carregando: 'loading SQLite…',
        pronto: (v) => `SQLite ${v} running in your browser`,
        falhou: 'SQLite did not load. Showing the saved results.',
        aoVivo: (n, ms) => `live, ${n} row(s) in ${ms} ms`,
        salvo: (n) => `saved result, ${n} row(s)`,
        cortado: (m) => `showing the first ${m} rows`,
        semLinhas: 'Statement executed. No rows returned.',
        erro: 'SQLite error',
        esperando: 'SQLite is still loading. The query will run as soon as it is ready.',
        semMotor: 'Running an edited query needs SQLite, and it did not load in this browser. The original query still shows its saved result.',
        editada: 'edited query',
        restaurada: 'Query and database restored',
        linhas: (n) => `${n} rows`,
        chave: 'key',
        liga: (t) => `links to ${t}`
      },

      consoleOi: "Hi! If you opened the console, we'll probably get along.",
      consoleSobre: 'This site is plain HTML, CSS and JavaScript. No framework, no build step. Try: DADOS.en.frentes'
    }
  }
};
