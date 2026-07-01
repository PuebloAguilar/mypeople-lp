const variants = {
  "1": {
    label: "opção 1 / identificação direta",
    eyebrow: "O problema real",
    title: 'Você não está mais codando. <em>Está cobrando agente.</em>',
    intro: [
      "No começo, parece mágica.",
      "Você abre um agente, pede uma feature, ele escreve.",
      "Aí você abre outro para teste. Outro para frontend. Outro para investigar um erro.",
      "Só que depois de alguns minutos, você não está construindo produto. Você está perguntando status, procurando terminal, conferindo entrega e tentando lembrar quem estava fazendo o quê."
    ],
    cards: [
      ["Agente parado sem você perceber", "Você só descobre que travou quando volta no terminal minutos depois."],
      ['"Done" sem prova', "O agente diz que terminou, mas você ainda precisa conferir se existe entrega de verdade."],
      ["Entrega perdida em algum terminal", "O trabalho aconteceu, mas agora você precisa caçar onde ficou."],
      ["Você virou a cola entre tudo", "Cada agente tem um pedaço. Você vira o sistema manual entre todos eles."]
    ]
  },
  "2": {
    label: "opção 2 / reposicionamento",
    eyebrow: "O problema real",
    title: "O problema não é o agente. <em>É a falta de operação.</em>",
    intro: [
      "Um agente sozinho ajuda.",
      "Dois agentes já começam a pedir contexto.",
      "Cinco agentes viram abas abertas, tarefas pela metade e você tentando reconstruir o que aconteceu.",
      "Aí parece que o modelo piorou. Mas muitas vezes o problema é mais simples: não tem Boss, não tem fonte de verdade e não tem um lugar para a entrega voltar."
    ],
    cards: [
      ["Sem chefe", "Ninguém decide prioridade, próximo passo ou quando chamar outro agente."],
      ["Sem fonte de verdade", "Cada terminal sabe um pedaço e você precisa juntar tudo na mão."],
      ["Sem prova de entrega", "A entrega não volta com print, link, vídeo, teste ou explicação."],
      ["Sem próximo passo claro", "Quando algo termina ou trava, a operação fica esperando você perceber."]
    ]
  },
  "3": {
    label: "opção 3 / dor do done",
    eyebrow: "O problema real",
    title: '"Done" não deveria <em>dar medo.</em>',
    intro: [
      'Quando um agente diz "done", o trabalho ainda não acabou.',
      "Done onde?",
      "Testou? Mudou quais arquivos? Tem print? Dá para abrir?",
      "Esse é o problema de agente solto: você continua sendo o auditor manual da entrega."
    ],
    cards: [
      ["Done sem evidência", "Uma frase no terminal não diz se aquilo funciona ou se só parece pronto."],
      ["Teste que ninguém viu", "Você precisa procurar se rodou teste, qual teste rodou e se passou mesmo."],
      ["Arquivo que você precisa caçar", "A entrega pode estar em qualquer lugar do repo ou em qualquer aba."],
      ["Contexto que morre na aba", "O próximo agente não recebe a história. Você precisa recontar tudo."]
    ]
  },
  "4": {
    label: "opção 4 / narrativa VSL",
    eyebrow: "O problema real",
    title: "Foi assim que o vibe coding <em>virou microgerenciamento.</em>",
    intro: [
      "Primeiro você usa um agente.",
      "Depois abre dois. Depois três.",
      "Em algum momento, você percebe que seu trabalho mudou.",
      "Você não está mais pensando no produto. Está pensando em quem travou, quem respondeu, quem terminou, onde ficou a entrega e qual terminal precisa da sua atenção agora."
    ],
    cards: [
      ["Status espalhado", "Você precisa abrir aba por aba para entender a operação."],
      ["Contexto quebrado", "Uma parte da história fica em cada terminal."],
      ["Terminal demais", "O ganho de paralelismo vira uma tela cheia de coisas para cuidar."],
      ["Decisão demais na sua mão", "Tudo volta para você: aprovar, cobrar, retomar, conferir e redistribuir."]
    ]
  },
  "5": {
    label: "opção 5 / premium Plow",
    eyebrow: "O problema real",
    title: "Agentes precisam de um lugar <em>para trabalhar.</em>",
    intro: [
      "Chat é bom para começar.",
      "Terminal é bom para executar.",
      "Mas uma equipe precisa de operação.",
      "Precisa de prioridade clara, coordenação, visibilidade, histórico e prova. Sem isso, cada agente vira uma conversa solta. E você vira o sistema operacional manual entre elas."
    ],
    cards: [
      ["Prioridade", "O trabalho precisa nascer em um lugar claro, não em uma frase perdida."],
      ["Coordenação", "Alguém precisa entender o contexto e decidir quem faz o quê."],
      ["Visibilidade", "Você precisa saber quem está vivo, trabalhando, parado ou travado."],
      ["Prova", "A entrega precisa voltar para a tarefa com evidência suficiente para continuar."]
    ]
  },
  "6": {
    label: "opção 6 / agressiva",
    eyebrow: "O problema real",
    title: "Se você precisa cobrar agente por agente, <em>você ainda não tem uma equipe.</em>",
    intro: [
      "Você pode abrir dez agentes.",
      "Mas se cada um trabalha em uma aba, responde em um terminal e entrega em um lugar diferente, isso não é equipe.",
      "É só mais bagunça em paralelo.",
      "O salto não é abrir mais agentes. É operar todos eles dentro de um sistema."
    ],
    cards: [
      ["Paralelismo sem controle", "Mais agentes não resolvem se você continua sendo o painel de controle."],
      ["Status sem confiança", "Você precisa perguntar de novo porque não tem visibilidade real."],
      ["Entrega sem rastro", "Se a prova não volta para a tarefa, a entrega se perde."],
      ["Contexto sem dono", "Ninguém segura a história da operação inteira."]
    ]
  }
};

function getVariantId() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("variant") || params.get("v") || "2";
  return variants[candidate] ? candidate : "1";
}

function renderProblemVariant() {
  const params = new URLSearchParams(window.location.search);
  const explicitVariant = params.has("variant") || params.has("v");
  const variant = variants[getVariantId()];
  document.title = explicitVariant ? `MyPeople - ${variant.label}` : "MyPeople - Waitlist";
  document.getElementById("problem-eyebrow").textContent = variant.eyebrow;
  const variantPill = document.getElementById("variant-pill");
  variantPill.textContent = variant.label;
  variantPill.hidden = !explicitVariant;
  document.getElementById("problem-title").innerHTML = variant.title;
  document.getElementById("problem-intro").innerHTML = variant.intro
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  document.getElementById("problem-cards").innerHTML = variant.cards
    .map(
      ([title, body], index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>${body}</p>
        </article>
      `
    )
    .join("");
}

renderProblemVariant();
