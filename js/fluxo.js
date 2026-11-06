/*
  AULA 4 · O editor de fluxo do topo
  -----------------------------------
  Três ideias de JavaScript aparecem aqui:

  1. Ler a posição dos elementos na tela (getBoundingClientRect) para
     desenhar os fios em SVG entre eles.
  2. Eventos de ponteiro (pointerdown / pointermove / pointerup), que
     funcionam igual para mouse, dedo e caneta. É assim que o arraste funciona.
  3. Animação com requestAnimationFrame: o navegador chama a nossa função
     a cada quadro (~60 vezes por segundo) e nós movemos a "bolinha de dados".

  O conteúdo é ilustrativo: mostra o TIPO de fluxo que eu monto no n8n,
  não um cliente real. Os textos e os payloads de cada etapa ficam em
  js/dados.js (DADOS.pt.fluxo e DADOS.en.fluxo).
*/
(function () {
  const tela = document.getElementById('tela-fluxo');
  const svg = document.getElementById('fios');
  if (!tela || !svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const nos = {};
  tela.querySelectorAll('.no').forEach((el) => { nos[el.dataset.id] = el; });

  // Quem liga em quem. Igual às conexões entre nós do n8n.
  const ligacoes = [
    ['gatilho', 'n8n'],
    ['n8n', 'api'],
    ['n8n', 'aviso']
  ];
  // Em que nó cada etapa acontece (a etapa 0 é o webhook, a 1 é o n8n...)
  const noDaEtapa = ['gatilho', 'n8n', 'api', 'aviso'];

  // Os textos vêm do idioma atual. Repare como o JSON muda de forma entre as
  // etapas: é exatamente o trabalho do nó "Valida e transforma".
  const F = () => window.DADOS[(window.I18N && I18N.lingua) || 'pt'].fluxo;

  // ---------- Desenho dos fios ----------
  const caminhos = {};
  ligacoes.forEach(([a, b]) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('class', 'fio');
    svg.appendChild(p);
    caminhos[a + '>' + b] = p;
  });

  function desenhar() {
    const base = tela.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
    ligacoes.forEach(([a, b]) => {
      const ra = nos[a].getBoundingClientRect();
      const rb = nos[b].getBoundingClientRect();
      // saída: lado direito do nó A · entrada: lado esquerdo do nó B
      const x1 = ra.right - base.left, y1 = ra.top + ra.height / 2 - base.top;
      const x2 = rb.left - base.left,  y2 = rb.top + rb.height / 2 - base.top;
      const curva = Math.max(40, Math.abs(x2 - x1) / 2);
      // Curva de Bézier cúbica: "C" recebe dois pontos de controle e o ponto final
      caminhos[a + '>' + b].setAttribute('d', `M${x1},${y1} C${x1 + curva},${y1} ${x2 - curva},${y2} ${x2},${y2}`);
    });
  }

  // ---------- Arrastar ----------
  Object.values(nos).forEach((el) => {
    let inicio = null;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId); // continua recebendo o movimento mesmo fora do nó
      const r = el.getBoundingClientRect();
      inicio = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      el.classList.add('no--arrastando');
    });
    el.addEventListener('pointermove', (e) => {
      if (!inicio) return;
      const base = tela.getBoundingClientRect();
      // Limita o nó para não sair da tela (Math.min / Math.max)
      const x = Math.min(Math.max(e.clientX - base.left - inicio.dx, 0), base.width - el.offsetWidth);
      const y = Math.min(Math.max(e.clientY - base.top - inicio.dy, 0), base.height - el.offsetHeight);
      // Guardamos em % para continuar certo se a janela mudar de tamanho
      el.style.setProperty('--x', (x / base.width) * 100 + '%');
      el.style.setProperty('--y', (y / base.height) * 100 + '%');
      desenhar();
    });
    const soltar = () => { inicio = null; el.classList.remove('no--arrastando'); };
    el.addEventListener('pointerup', soltar);
    el.addEventListener('pointercancel', soltar);
  });

  // ---------- JSON colorido ----------
  // Transforma o objeto em texto e embrulha cada parte numa <span> com classe.
  function jsonColorido(obj) {
    const texto = JSON.stringify(obj, null, 2)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return texto.replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g,
      (m, str, doisPontos, lit) => {
        if (str) return doisPontos ? `<span class="j-chave">${str}</span>${doisPontos}` : `<span class="j-texto">${str}</span>`;
        if (lit) return `<span class="j-lit">${m}</span>`;
        return `<span class="j-num">${m}</span>`;
      });
  }

  // ---------- Execução ----------
  const botao = document.getElementById('executar-fluxo');
  const saida = document.querySelector('#payload code');
  const rotuloEtapa = document.getElementById('etapa-atual');
  const tempo = document.getElementById('tempo-exec');
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // O que está na tela agora. Guardamos para poder redesenhar em outro idioma.
  const estado = { rodando: false, etapa: -1, ms: null };

  const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

  // Faz uma bolinha percorrer o fio. Retorna uma Promise para podermos usar "await".
  function viajar(caminho) {
    return new Promise((ok) => {
      if (semMovimento) return ok();
      const bola = document.createElementNS(NS, 'circle');
      bola.setAttribute('r', 5);
      bola.setAttribute('class', 'pacote');
      svg.appendChild(bola);
      const total = caminho.getTotalLength();
      const duracao = 650;
      const t0 = performance.now();
      caminho.classList.add('fio--ativo');
      function quadro(agora) {
        const t = Math.min((agora - t0) / duracao, 1);
        const suave = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easing
        const pt = caminho.getPointAtLength(total * suave);
        bola.setAttribute('cx', pt.x);
        bola.setAttribute('cy', pt.y);
        if (t < 1) requestAnimationFrame(quadro);
        else { bola.remove(); ok(); }
      }
      requestAnimationFrame(quadro);
    });
  }

  // Escreve na tela o estado atual, no idioma atual
  function pintar() {
    const f = F();
    if (estado.etapa < 0) {
      rotuloEtapa.textContent = f.aguardando;
      saida.innerHTML = jsonColorido(f.dica);
    } else {
      const e = f.etapas[estado.etapa];
      rotuloEtapa.textContent = e.titulo;
      saida.innerHTML = jsonColorido(e.json);
    }
    tempo.textContent = estado.ms == null ? '' : f.concluido(estado.ms);
    if (!estado.rodando) botao.textContent = estado.ms == null ? f.executar : f.deNovo;
  }

  function mostrar(i) {
    estado.etapa = i;
    Object.values(nos).forEach((n) => n.classList.remove('no--ativo'));
    nos[noDaEtapa[i]].classList.add('no--ativo', 'no--feito');
    pintar();
  }

  // async/await: escreve código assíncrono como se fosse uma receita, passo a passo
  async function executar() {
    if (estado.rodando) return;
    estado.rodando = true;
    estado.ms = null;
    botao.disabled = true;
    Object.values(nos).forEach((n) => n.classList.remove('no--feito'));
    svg.querySelectorAll('.fio').forEach((f) => f.classList.remove('fio--ativo'));
    const t0 = performance.now();

    mostrar(0);
    await esperar(700);
    await viajar(caminhos['gatilho>n8n']);
    mostrar(1);
    await esperar(900);
    // Os dois ramos saem do n8n ao mesmo tempo: Promise.all espera os dois
    await Promise.all([viajar(caminhos['n8n>api']), viajar(caminhos['n8n>aviso'])]);
    mostrar(2);
    await esperar(1100);
    mostrar(3);
    nos.api.classList.add('no--feito');

    estado.rodando = false;
    estado.ms = Math.round(performance.now() - t0);
    botao.disabled = false;
    pintar();
  }

  botao.addEventListener('click', executar);

  // Trocou o idioma: os nós mudam de tamanho (redesenha os fios) e os textos mudam
  document.addEventListener('lingua', () => { pintar(); requestAnimationFrame(desenhar); });

  // Redesenha quando a janela muda de tamanho ou as fontes terminam de carregar
  window.addEventListener('resize', desenhar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhar);
  pintar();
  desenhar();

  // Deixa a função disponível para a paleta de comandos e para "O que eu faço"
  window.executarFluxo = executar;
})();
