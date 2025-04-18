import { enviarParaWebhook } from "./webhookSender.js";

import {
  converterNomeParaNumeros,
  gerarTriangulo,
  gerarTrianguloSVG,
  interpretarSequencias,
  detectarSequenciasEspeciais,
} from "./formula.js";

import {
  configureVideoElement,
  configureSecondVideoElement,
} from "./videoControls.js";

const chat = document.getElementById("chat");
const profilePicUrl = "Imagens/img perder a cabeça amarelo (2).png";

document.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('chat');
    chat.innerHTML = '<p>Chat iniciado...</p>';
});

function scrollToBottom() {
  setTimeout(() => {
    chat.scrollTop = chat.scrollHeight;
  }, 300);
}

function createProfileImage(src, alt = "Imagem de Perfil") {
  const profileImage = document.createElement("img");
  profileImage.src = src;
  profileImage.alt = alt;
  profileImage.classList.add("profile-pic");
  return profileImage;
}

function createMessageElement(sender, htmlContent) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender, "fade-in-entry");
  messageElement.innerHTML = htmlContent;
  return messageElement;
}

function addMessageToChat(container) {
  chat.appendChild(container);
  scrollToBottom();
}

function showTypingIndicator() {
  const container = document.createElement("div");
  container.classList.add("profile-and-message");
  container.appendChild(createProfileImage(profilePicUrl));

  const typingArea = document.createElement("div");
  typingArea.classList.add("typing-indicator");

  const dots = document.createElement("div");
  dots.classList.add("dots");
  dots.innerHTML = `<div></div><div></div><div></div>`;
  typingArea.appendChild(dots);
  container.appendChild(typingArea);

  addMessageToChat(container);
  return container;
}

function addMessage(sender, htmlContent) {
  const container = document.createElement("div");
  container.classList.add("profile-and-message");

  if (sender === "bot") {
    container.appendChild(createProfileImage(profilePicUrl));
  }

  container.appendChild(createMessageElement(sender, htmlContent));
  addMessageToChat(container);
}

function addActionButton() {
  const container = document.createElement("div");
  container.classList.add("action-button-container");

  const actionButton = document.createElement("button");
  actionButton.textContent = "Analisar meu nome";
  actionButton.classList.add("action-button");

  actionButton.addEventListener("click", () => {
    if (!actionButton.disabled) {
      actionButton.classList.add("clicked");
      actionButton.disabled = true;
      showInputField();
    }
  });

  container.appendChild(actionButton);
  addMessageToChat(container);
}

function showInputField() {
  const typingIndicator = showTypingIndicator();
  setTimeout(() => {
    typingIndicator.remove();
    const introContainer = document.createElement("div");
    introContainer.classList.add("profile-and-message");

    introContainer.appendChild(createProfileImage(profilePicUrl));
    introContainer.appendChild(
      createMessageElement(
        "bot",
        "🎉 Agora, vamos começar o seu teste gratuito!"
      )
    );

    addMessageToChat(introContainer);

    setTimeout(() => {
      const instructionContainer = document.createElement("div");
      instructionContainer.classList.add("profile-and-message");

      const instructionMessage = document.createElement("div");
      instructionMessage.classList.add("message", "bot", "fade-in-entry");
      instructionMessage.innerHTML = `
        <strong>Por favor, insira abaixo somente o seu nome completo de batismo, exatamente como consta na sua certidão de nascimento, com todos os acentos (se houver).</strong><br><br>
        <strong>⚠️ ATENÇÃO!</strong><br>
        Digite apenas o seu nome completo de batismo, nada mais.<br><br>
        <strong>Importante:</strong><br>
        Não escreva sua data de nascimento neste momento.<br>
        Se você inserir qualquer informação além do seu nome completo de batismo, o resultado da análise estará incorreto.
      `;
      instructionContainer.appendChild(instructionMessage);

      addMessageToChat(instructionContainer);

      setTimeout(() => {
        const inputWrapper = document.createElement("div");
        inputWrapper.classList.add("input-wrapper");

        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = "Digite seu nome completo...";

        const submitButton = document.createElement("button");
        submitButton.textContent = "Enviar";
        submitButton.classList.add("submit-button");

        submitButton.addEventListener("click", () => {
          const userInput = inputElement.value.trim();
          if (userInput) {
            inputElement.value = userInput;
            inputElement.disabled = true;
            inputElement.style.backgroundColor = "#e3e2da";
            submitButton.style.display = "none";

            // Chamada adequada da função que realiza cálculos e envia o webhook
            addCalculationsMessage(() => performCalculation(userInput));
          }
        });

        inputWrapper.appendChild(inputElement);
        inputWrapper.appendChild(submitButton);
        addMessageToChat(inputWrapper);
      }, 2000);
    }, 2000);
  }, 2000);
}

function addCalculationsMessage(callback) {
  const typingIndicator = showTypingIndicator();
  setTimeout(() => {
    typingIndicator.remove();

    const calculationMessageContainer = document.createElement("div");
    calculationMessageContainer.classList.add("profile-and-message");

    const calculationMessage = createMessageElement(
      "bot",
      `
      🔢 Iniciando os cálculos...<br><br>
      🔄 Enquanto processamos as energias do seu nome, vou explicar como o nome magnético pode transformar a sua vida de maneira significativa.<br><br>
      🎥 Assista a este vídeo com atenção 😊
    `
    );

    calculationMessageContainer.appendChild(createProfileImage(profilePicUrl));
    calculationMessageContainer.appendChild(calculationMessage);
    addMessageToChat(calculationMessageContainer);

    setTimeout(() => {
      addSecondVideoMessage(() => {
        setTimeout(callback, 2000);
      });
    }, 2000);
  }, 2000);
}

function addSecondVideoMessage(callback) {
  const container = document.createElement("div");
  container.classList.add("profile-and-message");

  const videoBackground = document.createElement("div");
  videoBackground.classList.add("video-background", "fade-in-entry");

  const videoElement = document.createElement("video");
  videoElement.setAttribute("preload", "metadata");
  videoElement.src = "Videos/Vídeo 02.mp4";
  videoElement.classList.add("chat-video", "custom-video-class");

  videoBackground.appendChild(videoElement);
  container.appendChild(videoBackground);
  addMessageToChat(container);
  scrollToBottom(); // Corrigido: Garantir que o vídeo seja totalmente visível

  const progressContainerWrapper = document.createElement("div");
  progressContainerWrapper.classList.add("progress-container-wrapper");

  const progressMessageContainer = document.createElement("div");
  progressMessageContainer.classList.add(
    "message",
    "bot",
    "fade-in-entry",
    "container-bar"
  );

  const progressContainer = document.createElement("div");
  progressContainer.classList.add("progress-container");

  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  progressContainer.appendChild(progressBar);

  progressMessageContainer.appendChild(progressContainer);
  progressContainerWrapper.appendChild(progressMessageContainer);
  addMessageToChat(progressContainerWrapper);
  scrollToBottom(); // Corrigido: Garantir que a barra de progresso seja totalmente visível

  if (document.body.contains(videoElement)) {
    configureSecondVideoElement(videoElement);
  } else {
    console.error(
      "O elemento de vídeo não foi adicionado ao DOM corretamente."
    );
  }

  videoElement.addEventListener("timeupdate", () => {
    const progress = (videoElement.currentTime / videoElement.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.floor(progress)}%`;
  });

  videoElement.addEventListener("ended", () => {
    showFinalMessage(callback);
  });
}

function showFinalMessage(callback) {
  const finalContainer = document.createElement("div");
  finalContainer.classList.add("profile-and-message");

  const finalMessage = createMessageElement(
    "bot",
    "Perfeito! Os cálculos já foram concluídos, e o seu resultado está prontinho 😊 🙏🏻 Para visualizar melhor, utilize o gesto de pinça com os dedos na tela para ampliar a imagem 👇🏻"
  );

  finalContainer.appendChild(createProfileImage(profilePicUrl));
  finalContainer.appendChild(finalMessage);
  addMessageToChat(finalContainer);

  if (typeof callback === "function") {
    callback();
  }
}

function addInitialVideoMessage() {
  const container = document.createElement("div");
  container.classList.add("profile-and-message");

  const videoBackground = document.createElement("div");
  videoBackground.classList.add("video-background", "fade-in-entry");

  const videoElement = document.createElement("video");
  videoElement.setAttribute("preload", "metadata");
  videoElement.src = "Videos/Video 01.mp4";
  videoElement.setAttribute("poster", "Imagens/logo-nome-magnetico.svg");
  videoElement.classList.add("chat-video", "custom-video-class");

  videoBackground.appendChild(videoElement);
  container.appendChild(videoBackground);
  addMessageToChat(container);
  scrollToBottom(); // Corrigido: Garantir que o vídeo inicial seja totalmente visível

  if (document.body.contains(videoElement)) {
    configureVideoElement(videoElement, false, "inicial");
  } else {
    console.error(
      "O elemento de vídeo não foi adicionado ao DOM corretamente."
    );
  }

  videoElement.addEventListener("ended", async () => {
    const typingIndicator = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    typingIndicator.remove();
    addMessage("bot", "✨ Agora é só clicar no botão abaixo. 👇");
    addActionButton();
  });
}

function performCalculation(nomeCompleto) {
  const triangulo = gerarTriangulo(nomeCompleto);
  const trianguloSVG = gerarTrianguloSVG(nomeCompleto, triangulo);

  // Detecta sequências negativas e armazena as específicas
  const sequenciasBloqueio = detectarSequenciasEspeciais(triangulo);
  const hasNegativeSequences = sequenciasBloqueio.length > 0;

  // Obtém interpretações das sequências
  const interpretacoes = interpretarSequencias(triangulo);
  const resultadoTexto = interpretacoes.join(" ");

  setTimeout(() => {
    const resultadoDivSVGWrapper = document.createElement("div");
    resultadoDivSVGWrapper.classList.add("full-width-message-wrapper");

    const resultadoDivSVG = document.createElement("div");
    resultadoDivSVG.classList.add(
      "message",
      "bot",
      "full-width-message",
      "fade-in-entry"
    );

    const svgContent = document.createElement("div");
    svgContent.classList.add("svg-container");
    svgContent.innerHTML = trianguloSVG;
    resultadoDivSVG.appendChild(svgContent);

    resultadoDivSVGWrapper.appendChild(resultadoDivSVG);
    addMessageToChat(resultadoDivSVGWrapper);

    if (interpretacoes.length > 0) {
      setTimeout(() => {
        const interpretacoesWrapper = document.createElement("div");
        interpretacoesWrapper.classList.add("full-width-message-wrapper");

        const interpretacoesContainer = document.createElement("div");
        interpretacoesContainer.classList.add(
          "message",
          "bot",
          "full-width-message",
          "fade-in-entry"
        );

        let interpretacaoTexto = "<h3>Interpretação das Sequências:</h3><ul>";
        interpretacoes.forEach((item) => {
          const itemComDestaque = item.replace(
            /(\d+)/g,
            "<span class='highlight'>$1</span>"
          );
          interpretacaoTexto += `<li>${itemComDestaque}</li>`;
        });
        interpretacaoTexto += "</ul>";

        const textoExplicacao = document.createElement("div");
        textoExplicacao.classList.add("texto-explicacao");
        textoExplicacao.innerHTML = interpretacaoTexto;
        interpretacoesContainer.appendChild(textoExplicacao);

        interpretacoesWrapper.appendChild(interpretacoesContainer);
        addMessageToChat(interpretacoesWrapper);

        showInterpretationMessage(hasNegativeSequences);
      }, 2000);

      // Inclui sequências de bloqueio e seu texto correspondente ao enviar para o webhook
      enviarParaWebhook(
        nomeCompleto,
        hasNegativeSequences,
        resultadoTexto,
        sequenciasBloqueio.join(", ")
      );
    }
    scrollToBottom();
  }, 2000);
}

function showInterpretationMessage(hasNegativeSequences) {
  const typingIndicator = showTypingIndicator();
  setTimeout(() => {
    typingIndicator.remove();

    const interpretationContainer = document.createElement("div");
    interpretationContainer.classList.add("profile-and-message");

    const interpretationMessage = document.createElement("div");
    interpretationMessage.classList.add("message", "bot", "fade-in-entry");

    if (hasNegativeSequences) {
      interpretationMessage.innerHTML = `
        Acima ☝️, você encontrará as sequências negativas destacadas em amarelo no Triângulo da Vida.<br><br>
        <strong>O que isso significa?</strong> 🤔<br><br>
        Cada letra do seu nome está associada a um número. Quando um número se repete três ou mais vezes consecutivamente, forma-se uma sequência negativa. Essas repetições apontam desafios específicos que podem impactar aspectos cruciais da sua vida, como finanças, relacionamentos ou saúde. Esses desafios persistirão até que sejam corrigidos.<br><br>
        <strong>Como resolver?</strong> 🔄<br><br>
        Essas energias podem ser ajustadas através do Nome Magnético. Este método não apenas elimina os bloqueios, mas também alinha todos os seus números, permitindo que você atraia mais prosperidade, equilíbrio e harmonia em todas as áreas da sua vida.<br><br>
        🌟 Vou explicar agora como funciona esse processo de correção e como ele pode transformar sua jornada. Pronto para começar?<br><br>
        👉 Clique no <strong>Botão</strong> abaixo e assista ao vídeo para saber mais! 🎥👇
      `;
    } else {
      interpretationMessage.innerHTML = `
       🌟 Que incrível! Seu nome de batismo não contém nenhuma sequência negativa, o que é bastante raro, considerando que cerca de 80% dos nossos clientes apresentam pelo menos uma sequência negativa em seus nomes.<br><br>
        ✨ A correção dessas sequências negativas é apenas uma parte do processo. Vou explicar detalhadamente como funciona esse processo de correção, para que você possa compreender melhor, mesmo não tendo sequências negativas no seu nome.<br><br>
        🔮 Além de eliminar as sequências negativas que podem dificultar nossa vida, é essencial alinhar todos os números, como os da missão e destino, entre outros. Isso é fundamental para se conectar ao fluxo de prosperidade e felicidade, e é especialmente importante fazer isso com seu nome para entrar no fluxo da Riqueza.
        🔍 O fato de não haver sequências negativas no seu nome indica que você enfrenta menos desafios do que aqueles que as têm. No entanto, equilibrar e harmonizar suas energias pode reduzir ainda mais os problemas e aumentar sua prosperidade.<br><br>
        🔥 Também é crucial conhecer sua Missão de Vida, pois ela desempenha um papel vital na jornada rumo ao sucesso e à plenitude.<br><br>
        👉 Clique no <strong>Botão</strong> abaixo e assista ao vídeo para saber mais! 🎥👇
      `;
    }

    interpretationContainer.appendChild(createProfileImage(profilePicUrl));
    interpretationContainer.appendChild(interpretationMessage);
    addMessageToChat(interpretationContainer);

    setTimeout(() => {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("action-button-container");

      const alignEnergyButton = document.createElement("button");
      alignEnergyButton.textContent = "Quero alinhar minhas energias";
      alignEnergyButton.classList.add("action-button", "second-button");

      alignEnergyButton.addEventListener("click", () => {
        if (!alignEnergyButton.disabled) {
          alignEnergyButton.classList.add("clicked");
          alignEnergyButton.disabled = true;
          addFinalVideoMessage();
        }
      });

      buttonContainer.appendChild(alignEnergyButton);
      addMessageToChat(buttonContainer);
    }, 2000);
  }, 6000);
}

function addFinalVideoMessage() {
  const container = document.createElement("div");
  container.classList.add("profile-and-message");

  const videoBackground = document.createElement("div");
  videoBackground.classList.add("video-background", "fade-in-entry");

  const videoElement = document.createElement("video");
  videoElement.setAttribute("preload", "metadata");
  videoElement.src = "Videos/Video 03.mp4";
  videoElement.setAttribute("poster", "Imagens/logo-nome-magnetico.svg");
  videoElement.classList.add("chat-video", "custom-video-class");

  videoBackground.appendChild(videoElement);
  container.appendChild(videoBackground);
  addMessageToChat(container);
  scrollToBottom(); // Corrigido: Garantir que o vídeo final seja totalmente visível

  if (document.body.contains(videoElement)) {
    configureVideoElement(videoElement, false, "final");
  } else {
    console.error(
      "O elemento de vídeo não foi adicionado ao DOM corretamente."
    );
  }

  videoElement.addEventListener("ended", async () => {
    const typingIndicator = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    typingIndicator.remove();

    const firstMessageContainer = document.createElement("div");
    firstMessageContainer.classList.add("profile-and-message");

    const firstMessage = createMessageElement(
      "bot",
      ` 
      Descubra sua <strong>Missão de Vida</strong> 🌟 enquanto harmoniza seus números e ajusta suas energias com o <strong>Nome Magnético</strong>. ✨
      `
    );

    firstMessageContainer.appendChild(createProfileImage(profilePicUrl));
    firstMessageContainer.appendChild(firstMessage);
    addMessageToChat(firstMessageContainer);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const secondTypingIndicator = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    secondTypingIndicator.remove();

    const secondMessageContainer = document.createElement("div");
    secondMessageContainer.classList.add("profile-and-message");

    const secondMessage = createMessageElement(
      "bot",
      `
      Cada indivíduo possui uma missão de vida única 🌟, e a verdadeira <strong>riqueza</strong> 💰 e <strong>felicidade plena</strong> 😊 são alcançadas quando seguimos nosso propósito 🎯 e ajustamos nossas energias 🌈.
      `
    );

    secondMessageContainer.appendChild(createProfileImage(profilePicUrl));
    secondMessageContainer.appendChild(secondMessage);
    addMessageToChat(secondMessageContainer);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const anotherSvgContainer = document.createElement("div");
    anotherSvgContainer.classList.add("custom-svg-container");
    anotherSvgContainer.innerHTML = `<img src="Imagens/promoção-analise+nome-magnetico.svg" alt="Nova Imagem SVG">`;
    addMessageToChat(anotherSvgContainer);
    scrollToBottom(); // Corrigido: Garantir que o contêiner SVG seja totalmente visível

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const thirdTypingIndicator = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    thirdTypingIndicator.remove();

    const thirdMessageContainer = document.createElement("div");
    thirdMessageContainer.classList.add("profile-and-message");

    const thirdMessage = createMessageElement(
      "bot",
      `
      🌟 Se você quer transformar a sua vida, adquira a <strong>ANÁLISE DE PROPÓSITO</strong> e, como bônus, receba seu <strong>NOME MAGNÉTICO</strong>. Basta <strong>CLICAR</strong> no botão 👇
      `
    );

    thirdMessageContainer.appendChild(createProfileImage(profilePicUrl));
    thirdMessageContainer.appendChild(thirdMessage);
    addMessageToChat(thirdMessageContainer);

    setTimeout(() => {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("action-button-container");

      const buttonClassName = "special-promotion-button";

      const purchaseButton = document.createElement("button");
      purchaseButton.textContent = "APROVEITAR A PROMOÇÃO";
      purchaseButton.classList.add(buttonClassName);

      const handleButtonClick = (event) => {
        const newWindow = window.open(
          "https://pay.hotmart.com/A96034251C?checkoutMode=10",
          "_blank"
        );
        if (newWindow) newWindow.focus();
        event.currentTarget.disabled = true;
        event.currentTarget.classList.add("clicked");
      };

      purchaseButton.addEventListener("click", handleButtonClick);

      buttonContainer.appendChild(purchaseButton);
      addMessageToChat(buttonContainer);

      setTimeout(() => {
        const additionalSvgContainer = document.createElement("div");
        additionalSvgContainer.classList.add("custom-svg-container");
        additionalSvgContainer.innerHTML = `<img src="Imagens/passos-compra.svg" alt="Outra Imagem SVG">`;
        addMessageToChat(additionalSvgContainer);
        scrollToBottom(); // Corrigido: Garantir que o contêiner adicional de SVG seja totalmente visível

        setTimeout(async () => {
          const fourthTypingIndicator = showTypingIndicator();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          fourthTypingIndicator.remove();

          const fourthMessageContainer = document.createElement("div");
          fourthMessageContainer.classList.add("profile-and-message");

          const fourthMessage = createMessageElement(
            "bot",
            `
            <strong>OBS</strong>:
            Lembre-se que a <strong>Análise de Propósito</strong> e o <strong>Nome Magnético</strong>, são dois produtos diferentes, vendidos separadamente, mas ambos estão na promoção.
            `
          );

          fourthMessageContainer.appendChild(createProfileImage(profilePicUrl));
          fourthMessageContainer.appendChild(fourthMessage);
          addMessageToChat(fourthMessageContainer);

          await new Promise((resolve) => setTimeout(resolve, 3000));

          const fifthTypingIndicator = showTypingIndicator();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          fifthTypingIndicator.remove();

          const fifthMessageContainer = document.createElement("div");
          fifthMessageContainer.classList.add("profile-and-message");

          const fifthMessage = createMessageElement(
            "bot",
            `
            Corrija suas energias e <strong>DESTRAVE</strong> a <strong>RIQUEZA</strong> na sua vida 🚀
            Estamos aguardando ansiosos para fazer sua <strong>ANÁLISE DE PROPÓSITO</strong> 🙏
            `
          );
          fifthMessageContainer.appendChild(createProfileImage(profilePicUrl));
          fifthMessageContainer.appendChild(fifthMessage);
          addMessageToChat(fifthMessageContainer);

          setTimeout(() => {
            const anotherButtonContainer = document.createElement("div");
            anotherButtonContainer.classList.add("action-button-container");

            const anotherPurchaseButton = document.createElement("button");
            anotherPurchaseButton.textContent = "APROVEITAR A PROMOÇÃO";
            anotherPurchaseButton.classList.add(buttonClassName);

            anotherPurchaseButton.addEventListener("click", handleButtonClick);

            anotherButtonContainer.appendChild(anotherPurchaseButton);
            addMessageToChat(anotherButtonContainer);

            addSupportMessage();
          }, 2000);
        }, 4000);
      }, 4000);
    }, 3000);
  });
}

function addSupportMessage() {
  setTimeout(() => {
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
      typingIndicator.remove();

      const supportMessageContainer = document.createElement("div");
      supportMessageContainer.classList.add("profile-and-message");

      const supportMessage = createMessageElement(
        "bot",
        `🚀 <strong>Precisa de ajuda ou quer mais informações?</strong> Entre em contato conosco através do link: <a href="https://wa.me/5551980430591?text=Olá!+Gostaria+de+obter+mais+informações+sobre+o+produto." target="_blank" style="color: #007bff; text-decoration: underline;">Clique aqui para conversar</a>. Estamos prontos para ajudar! 🤝`
      );

      supportMessageContainer.appendChild(createProfileImage(profilePicUrl));
      supportMessageContainer.appendChild(supportMessage);
      addMessageToChat(supportMessageContainer);
    }, 3000);
  }, 2000);
}

async function simulateChat() {
  const messages = [
    {
      sender: "bot",
      text: "👋 Olá, seja bem-vindo ao site do <strong>NOME MAGNÉTICO!</strong> Aqui, você encontrará uma experiência única e interativa, como um diálogo pensado para compreender e transformar a sua jornada 🚀.",
    },
    {
      sender: "bot",
      text: "✨ Aqui, você terá a oportunidade de desvendar as energias que estão presentes no seu nome completo e compreender como elas influenciam a sua vida 🌈.",
    },
    {
      sender: "bot",
      text: "🔍 Descubra os segredos do nome magnético, capaz de desbloquear a prosperidade 💰, fortalecer seus relacionamentos 🤝 e revelar sua autenticidade 🌟.",
    },
    {
      sender: "bot",
      text: "🎬 Clique no <strong>PLAY</strong> e descubra agora mesmo como liberar todo o potencial da sua vida! 🌟",
    },
  ];

  for (const message of messages) {
    const typingIndicator = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const messageElement = createMessageElement(message.sender, message.text);

    typingIndicator.replaceChild(messageElement, typingIndicator.lastChild);

    scrollToBottom();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (
      message.text.includes(
        "🎬 Clique no <strong>PLAY</strong> e descubra agora mesmo como liberar todo o potencial da sua vida! 🌟"
      )
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addInitialVideoMessage();
    }
  }
}

simulateChat();
