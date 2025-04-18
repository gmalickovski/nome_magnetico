// Tabela de conversão cabalística
const tabelaCabalistica = {
  A: 1,
  I: 1,
  Q: 1,
  J: 1,
  Y: 1,
  B: 2,
  K: 2,
  R: 2,
  C: 3,
  G: 3,
  L: 3,
  S: 3,
  D: 4,
  M: 4,
  T: 4,
  X: 4,
  E: 5,
  H: 5,
  N: 5,
  U: 6,
  V: 6,
  W: 6,
  O: 7,
  Z: 7,
  F: 8,
  P: 8,
};

// Função para calcular o valor de uma letra com regras especiais para acentos
function calcularValor(letra) {
  const letraBase = letra.normalize("NFD").charAt(0).toUpperCase();
  let base = tabelaCabalistica[letraBase] || 0;

  if (letra.normalize("NFD").length > 1) {
    const acento = letra.normalize("NFD").charAt(1);
    switch (acento) {
      case "́":
        base += 2;
        break;
      case "̂":
        break;
      case "̃":
        base += 3;
        break;
      case "̀":
        base *= 3;
        break;
    }
  }

  if (letraBase === "Ç") {
    base = 6;
  }

  return base;
}

// Função para reduzir um número a um único dígito, com exceção dos números mestres 11 e 22
function reduzirNumero(numero, permitirMestres = false) {
  while (numero > 9 && !(permitirMestres && (numero === 11 || numero === 22))) {
    numero = String(numero)
      .split("")
      .reduce((acc, val) => acc + parseInt(val), 0);
  }
  return numero;
}

export function converterNomeParaNumeros(nome) {
  return nome
    .split("")
    .map((letra) => calcularValor(letra))
    .filter((n) => n > 0);
}

export function gerarTriangulo(nome) {
  let triangulo = [converterNomeParaNumeros(nome)];
  while (triangulo[triangulo.length - 1].length > 1) {
    let novaLinha = [];
    let ultimaLinha = triangulo[triangulo.length - 1];
    for (let i = 0; i < ultimaLinha.length - 1; i++) {
      let soma = ultimaLinha[i] + ultimaLinha[i + 1];
      novaLinha.push(reduzirNumero(soma, false)); // Reduz sempre, mestre ou não
    }
    triangulo.push(novaLinha);
  }
  return triangulo;
}

// Função para gerar o triângulo em SVG com o nome completo e números
export function gerarTrianguloSVG(nomeCompleto, triangulo) {
  const nomeSemEspacos = nomeCompleto.replace(/\s+/g, "");
  const numerosDoNome = converterNomeParaNumeros(nomeSemEspacos);
  const largura = 100 + (triangulo[0].length - 1) * 50;
  const altura = 80 + triangulo.length * 30;

  let svgString = `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 ${largura + 20} ${altura + 20}" 
    preserveAspectRatio="xMidYMid meet"
    style="width: 100%; height: auto;">`;

  const primeiraLinha = triangulo[0];
  let xInicial = largura / 2 - (primeiraLinha.length * 50) / 2 + 10;

  // Desenhar letras e números iniciais
  numerosDoNome.forEach((numero, index) => {
    const letra = nomeSemEspacos[index].toUpperCase();
    svgString += `<text x="${xInicial}" y="30" font-size="16" font-weight="bold" text-anchor="middle">${letra}</text>`;
    xInicial += 50;
  });

  // Resetar xInicial para desenhar os números e aplicar estilização, inclusive na primeira linha
  xInicial = largura / 2 - (primeiraLinha.length * 50) / 2 + 10;
  let y = 50; // Ajusta a posição dos números na primeira linha

  for (let linha of triangulo) {
    let x = largura / 2 - (linha.length * 50) / 2 + 10;
    for (let i = 0; i < linha.length; i++) {
      let numero = linha[i];

      // Aplicar destaque a toda a sequência de três números
      if (i <= linha.length - 3) {
        const sequencia = linha.slice(i, i + 3).join("");
        if (
          [
            "111",
            "222",
            "333",
            "444",
            "555",
            "666",
            "777",
            "888",
            "999",
          ].includes(sequencia)
        ) {
          for (let j = 0; j < 3; j++) {
            // Adiciona um retângulo colorido atrás dos números da sequência
            svgString += `<rect x="${x - 15}" y="${
              y - 15
            }" width="30" height="20" class="highlight-background"></rect>`;
            svgString += `<text x="${x}" y="${y}" font-size="16" text-anchor="middle" font-weight="bold">${
              linha[i + j]
            }</text>`;
            x += 50;
          }
          i += 2; // Pula os dois números já processados
          continue;
        }
      }

      svgString += `<text x="${x}" y="${y}" font-size="16" text-anchor="middle">${numero}</text>`;
      x += 50;
    }
    y += 30; // Pula para a próxima linha para os próximos números
  }

  svgString += `</svg>`;
  return svgString;
}

export function detectarSequenciasEspeciais(triangulo) {
  let sequencias = [];
  for (const linha of triangulo) {
    const sequenciasEncontradas = linha.join("").match(/(\d)\1{2}/g); // Detecta sequências de 3 ou mais números iguais
    if (sequenciasEncontradas) {
      sequencias = sequencias.concat(sequenciasEncontradas);
    }
  }
  return sequencias;
}

export function interpretarSequencias(triangulo) {
  const sequencias = detectarSequenciasEspeciais(triangulo);
  const significados = {
    111: `Indica limitação e falta de coragem para explorar algo novo. A pessoa pode passar por períodos de inatividade, desemprego ou sensação de impotência, permanecendo nesse estado enquanto durar o Arcano dominante. Também aponta tendência a desenvolver distúrbios ou doenças cardíacas.<br><br>`,

    222: `Sugere timidez e indecisão, podendo levar à submissão a pessoas próximas, como amigos, sócios ou colegas de trabalho. Isso resulta em baixa autoestima e limitações nos projetos. Eventualmente, pode surgir alguma doença que gere dependência.<br><br>`,

    333: `Aponta dificuldades de comunicação, especialmente no trabalho e nos relacionamentos pessoais. Há desafios para se impor e convencer os outros. Esta vibração também pode estar associada a doenças respiratórias ou articulares.<br><br>`,

    444: `Reflete obstáculos na realização profissional, com baixa remuneração ou dificuldade em manter-se empregado(a). Pode indicar doenças reumáticas ou arteriais.<br><br>`,

    555: `Indica mudanças indesejadas, como troca de residência, profissão ou ambiente social. Sob esta vibração, a pessoa pode enfrentar altos e baixos constantes, dificuldade em se fixar profissionalmente e afastamento do meio social. Pode haver tendência a doenças de pele.<br><br>`,

    666: `Sugere decepções em relações pessoais, incluindo amizades, sociedade ou casamento. A incompreensão mútua pode gerar frustrações e, eventualmente, doenças cardíacas.<br><br>`,

    777: `Indica afastamento social e tendência ao egocentrismo, tornando a pessoa dependente, vaidosa e arrogante. Isso pode levar à solidão, doenças nervosas, dependências e, em casos extremos, ao desenvolvimento de câncer.<br><br>`,

    888: `Mostra tendência ao isolamento e instabilidade emocional, especialmente em pessoas menos evoluídas espiritualmente. Sob essa vibração, pode haver oscilações financeiras e, devido ao estresse, surgimento de doenças.<br><br>`,

    999: `Indica dificuldades financeiras, perdas de bens e desafios nos negócios, associados a períodos de estagnação. Esses problemas podem impactar negativamente o sistema nervoso e o coração.<br><br>`,
  };

  if (sequencias.length === 0) {
    return ["Parabéns! Você não possui números negativos."];
  }

  // Contagem das sequências
  const contagemSequencias = sequencias.reduce((acc, seq) => {
    acc[seq] = (acc[seq] || 0) + 1;
    return acc;
  }, {});

  // Mapeamento das sequências para suas interpretações
  return Object.entries(contagemSequencias).map(([seq, count]) => {
    const multiplicador = count > 1 ? ` (x${count})` : "";
    const significado = significados[seq] || "Significado desconhecido";
    return `${seq}${multiplicador}: ${significado}`;
  });
}
