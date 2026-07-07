let currentData = null;

function formatNumber(value) {
  const n = Number(value || 0);
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function setStatusClass(element, isSuccess) {
  element.classList.remove("danger", "success");
  element.classList.add(isSuccess ? "success" : "danger");
}

function renderDashboard(data) {
  currentData = data;

  document.getElementById("monthLabel").textContent = data.monthLabel || "";
  document.getElementById("lastUpdate").textContent =
    "Dernière MAJ : " + (data.generatedAt || "-");

  const totals = data.totals || {};
  const objective = Number(data.objective || 20);

  const teamScore = document.getElementById("teamScore");
  const teamPercent = document.getElementById("teamPercent");
  const teamProgress = document.getElementById("teamProgress");

  const teamOk = Number(totals.teamProgress || 0) >= 100;

  teamScore.textContent =
    `${formatNumber(totals.services || 0)} / ${formatNumber(totals.teamObjective || 0)}`;

  teamPercent.textContent =
    `${formatNumber(totals.teamProgress || 0)}%`;

  setStatusClass(teamScore, teamOk);
  setStatusClass(teamPercent, teamOk);
  setStatusClass(teamProgress, teamOk);

  teamProgress.style.width =
    Math.min(100, Number(totals.teamProgress || 0)) + "%";

  document.getElementById("signatureRate").textContent =
    `${formatNumber(totals.signatureRate || 0)}%`;

  document.getElementById("signatureMeta").textContent =
    `${formatNumber(totals.convertedAppointments || 0)} / ${formatNumber(totals.totalAppointments || 0)} RDV`;

  document.getElementById("agentsCount").textContent =
    formatNumber(totals.agentsCount || 0);

  renderChart(data.agents || [], objective);
}

function renderChart(agents, objective) {
  const chart = document.getElementById("agentChart");

  if (!agents.length) {
    chart.innerHTML = `<div class="loading">Aucun agent à afficher.</div>`;
    return;
  }

  const maxValue = Math.max(objective, ...agents.map(a => Number(a.total || 0)), 1);
  const axisMax = Math.ceil(maxValue / 5) * 5;

  const axisValues = [];
  for (let v = axisMax; v >= 0; v -= Math.max(5, axisMax / 4)) {
    axisValues.push(Math.round(v));
  }

  const yAxis = `
    <div class="yAxis">
      ${axisValues.map(v => `<span>${v}</span>`).join("")}
    </div>
  `;

  const bars = agents.map(agent => {
    const value = Number(agent.total || 0);
    const percent = Math.max(0, Math.min(100, (value / axisMax) * 100));
    const ok = value >= objective;
    const label = agent.shortName || agent.agent || "Agent";

    return `
      <div class="barItem" title="${escapeHtml(agent.agent || label)}" onclick='openAgentModalByKey("${escapeHtml(agent.key || agent.agent)}")'>
        <div class="barValue ${ok ? "success" : "danger"}">${formatNumber(value)}</div>
        <div class="bar ${ok ? "success" : "danger"}" style="height:${percent}%; --bar-height:${percent}%"></div>
        <div class="barLabel">${escapeHtml(label)}</div>
      </div>
    `;
  }).join("");

  chart.innerHTML = `
    ${yAxis}
    <div class="bars">
      ${bars}
    </div>
  `;
}

function openAgentModalByKey(key) {
  const agents = currentData?.agents || [];
  const agent = agents.find(a => String(a.key || a.agent) === String(key));

  if (agent) openAgentModal(agent);
}

async function initDashboard() {
  try {
    updateClock();
    setInterval(updateClock, 1000);

    document.getElementById("agentChart").innerHTML =
      `<div class="loading">Chargement du dashboard...</div>`;

    const data = await fetchDashboardData();
    renderDashboard(data);

    setInterval(async () => {
      const refreshed = await fetchDashboardData();
      renderDashboard(refreshed);
    }, 86400000);

  } catch (error) {
    console.error("ERREUR DASHBOARD:", error);

    document.getElementById("agentChart").innerHTML =
      `<div class="error">${String(error.message || error)}</div>`;
  }

document.addEventListener("DOMContentLoaded", initDashboard);
