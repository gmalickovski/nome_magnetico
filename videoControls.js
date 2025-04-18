export function configureVideoElement(
  videoElement,
  autoPlay = false,
  tipo = "default"
) {
  if (!videoElement) {
    console.error("Elemento de vídeo não encontrado!");
    return;
  }

  videoElement.removeAttribute("controls");
  videoElement.setAttribute("playsinline", "true");

  const controlsContainer = document.createElement("div");
  controlsContainer.classList.add("custom-video-controls");

  if (videoElement.parentNode) {
    videoElement.parentNode.appendChild(controlsContainer);
  } else {
    console.error("Elemento pai do vídeo não encontrado!");
  }

  const playPauseButton = document.createElement("button");
  const playIcon = document.createElement("img");
  playIcon.src = "Imagens/play-icon.svg";
  playIcon.alt = "Play";
  playPauseButton.appendChild(playIcon);

  playPauseButton.addEventListener("click", () => {
    if (videoElement.paused) {
      videoElement.play();
      playIcon.src = "Imagens/pause-icon.svg";
      scheduleControlsHide();
    } else {
      videoElement.pause();
      playIcon.src = "Imagens/play-icon.svg";
      showControls();
    }
  });

  controlsContainer.appendChild(playPauseButton);

  const muteButton = document.createElement("button");
  const muteIcon = document.createElement("img");

  if (videoElement.muted) {
    muteIcon.src = "Imagens/unmute-icon.svg";
  } else {
    muteIcon.src = "Imagens/mute-icon.svg";
  }
  muteIcon.alt = "Mute/Unmute";
  muteButton.appendChild(muteIcon);

  muteButton.addEventListener("click", () => {
    videoElement.muted = !videoElement.muted;
    muteIcon.src = videoElement.muted
      ? "Imagens/unmute-icon.svg"
      : "Imagens/mute-icon.svg";
    scheduleControlsHide();
  });

  controlsContainer.appendChild(muteButton);

  const hideControls = () => {
    controlsContainer.style.opacity = 0;
  };

  const showControls = () => {
    controlsContainer.style.opacity = 1;
  };

  let controlsTimeout;
  const scheduleControlsHide = () => {
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 2000);
  };

  videoElement.parentNode.addEventListener("mousemove", showControls);
  videoElement.parentNode.addEventListener("mousemove", scheduleControlsHide);

  videoElement.parentNode.addEventListener("touchstart", showControls);
  videoElement.parentNode.addEventListener("touchstart", scheduleControlsHide);

  if (autoPlay) {
    videoElement.muted = true;
    videoElement.play().catch((error) => {
      console.error("Erro ao reproduzir automaticamente:", error);
    });
    showControls();
  } else {
    showControls();
  }

  videoElement.addEventListener("pause", showControls);

  // Configuração específica para o inicialVideo
  if (tipo === "inicial") {
    videoElement.addEventListener("ended", () => {
      controlsContainer.style.display = "none";
      videoElement.parentNode.removeEventListener("mousemove", showControls);
      videoElement.parentNode.removeEventListener("touchstart", showControls);
    });
  }

  // Configuração específica para o finalVideo
  if (tipo === "final") {
    videoElement.addEventListener("ended", () => {
      showControls();
      videoElement.currentTime = 0;
      playIcon.src = "Imagens/play-icon.svg";
    });
  }
}

export function configureSecondVideoElement(videoElement) {
  if (!videoElement) {
    console.error("Elemento de vídeo não encontrado!");
    return;
  }

  videoElement.removeAttribute("controls");
  videoElement.setAttribute("playsinline", "true");

  const controlsContainer = document.createElement("div");
  controlsContainer.classList.add("custom-video-controls");

  if (videoElement.parentNode) {
    videoElement.parentNode.appendChild(controlsContainer);
  } else {
    console.error("Elemento pai do vídeo não encontrado!");
  }

  const muteButton = document.createElement("button");
  const muteIcon = document.createElement("img");

  // Inicia com o som desligado e o ícone de "unmute" visível
  muteIcon.src = "Imagens/unmute-icon.svg";
  muteIcon.alt = "Unmute";
  muteButton.appendChild(muteIcon);

  muteButton.addEventListener("click", () => {
    videoElement.muted = !videoElement.muted;
    muteIcon.src = videoElement.muted
      ? "Imagens/unmute-icon.svg"
      : "Imagens/mute-icon.svg";

    if (!videoElement.muted) {
      // Esconde o ícone de mute assim que o som é ativado
      scheduleControlsHide();
    } else {
      // Mostra o ícone de unmute enquanto o som estiver desligado
      showControls();
    }
  });

  controlsContainer.appendChild(muteButton);

  const hideControls = () => {
    controlsContainer.style.opacity = 0;
  };

  const showControls = () => {
    controlsContainer.style.opacity = 1;
  };

  let controlsTimeout;
  const scheduleControlsHide = () => {
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 2000);
  };

  videoElement.parentNode.addEventListener("mousemove", showControls);
  videoElement.parentNode.addEventListener("mousemove", scheduleControlsHide);

  videoElement.parentNode.addEventListener("touchstart", showControls);
  videoElement.parentNode.addEventListener("touchstart", scheduleControlsHide);

  // Inicializa o vídeo com som desligado
  videoElement.muted = true;
  videoElement.play().catch((error) => {
    console.error("Erro ao reproduzir automaticamente:", error);
  });
  showControls(); // Mostra o ícone de "unmute" no início

  videoElement.addEventListener("pause", showControls);

  // Adicionar evento para remover controles e desativá-los ao finalizar o vídeo
  videoElement.addEventListener("ended", () => {
    controlsContainer.style.display = "none"; // Esconder controles
    muteButton.disabled = true; // Desativar botão de mute/unmute
  });
}

export const initVideoControls = () => {
    console.log('Video controls initialized');
};

initVideoControls();
