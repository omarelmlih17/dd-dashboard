let selectedAgent = null;

function openAgentModal(agent) {
  selectedAgent = agent;

  const modal = document.getElementById("agentModal");
  const rows = document.getElementById("modalRows");

  document.getElementById("modalAgentName").textContent =
    agent.agent || agent.shortName || "Agent";

  document.getElementById("modalAgentMeta").textContent =
    `${currentData.monthLabel || ""} · ${formatNumber(agent.total || 0)} services`;

  rows.innerHTML = "";

  const clients = agent.clients || [];

  if (!clients.length) {
    rows.innerHTML = `
      <tr>
        <td colspan="4">Aucun RDV traité pour cet agent.</td>
      </tr>
    `;
  } else {
    clients.forEach(client => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${escapeHtml(client.client || "Client")}</td>
        <td>${formatNumber(client.telco || 0)}</td>
        <td>${formatNumber(client.energie || 0)}</td>
        <td><strong>${formatNumber(client.total || 0)}</strong></td>
      `;

      rows.appendChild(tr);
    });
  }

  document.getElementById("modalTotal").textContent =
    `Total agent : ${formatNumber(agent.total || 0)} services`;

  modal.classList.remove("hidden");
}

function closeAgentModal() {
  document.getElementById("agentModal").classList.add("hidden");
  selectedAgent = null;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeModal").addEventListener("click", closeAgentModal);

  document.getElementById("agentModal").addEventListener("click", event => {
    if (event.target.id === "agentModal") closeAgentModal();
  });

  document.getElementById("exportExcel").addEventListener("click", () => {
    exportAgentToExcel(selectedAgent);
  });
});
