export function enviarParaWebhook(
  nome,
  hasNegativeSequences,
  resultadoTexto,
  sequenciasBloqueio
) {
  const webhookUrl =
    "https://n8n-automatic-n8n.eicoo9.easypanel.host/webhook/site-nome-magnetico";

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome, // Assegurar que o nome é enviado uma vez
      bloqueios: hasNegativeSequences ? "Possui bloqueios" : "Sem bloqueios",
      resultado: resultadoTexto,
      sequenciasBloqueio: sequenciasBloqueio,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao enviar dados para o webhook no N8N");
      }
      console.log("Requisição enviada ao N8N com sucesso.");
    })
    .catch((error) => {
      console.error("Erro ao enviar ao N8N:", error);
    });
}
