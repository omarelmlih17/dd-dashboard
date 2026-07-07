function exportAgentToExcel(agent) {
  if (!agent) return;

  const safeName = (agent.shortName || agent.agent || "agent")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "");

  let html = `
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <table border="1">
          <tr>
            <th colspan="4">${escapeHtml(agent.agent || "")} - ${escapeHtml(currentData.monthLabel || "")}</th>
          </tr>
          <tr>
            <th>Client</th>
            <th>Telco</th>
            <th>Energie</th>
            <th>Total</th>
          </tr>
  `;

  (agent.clients || []).forEach(client => {
    html += `
      <tr>
        <td>${escapeHtml(client.client || "")}</td>
        <td>${formatNumber(client.telco || 0)}</td>
        <td>${formatNumber(client.energie || 0)}</td>
        <td>${formatNumber(client.total || 0)}</td>
      </tr>
    `;
  });

  html += `
          <tr>
            <th>Total agent</th>
            <th>${formatNumber(agent.telco || 0)}</th>
            <th>${formatNumber(agent.energie || 0)}</th>
            <th>${formatNumber(agent.total || 0)}</th>
          </tr>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${safeName}_${(currentData.monthLabel || "mois").replace(/\s+/g, "_")}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
