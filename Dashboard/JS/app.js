/****************************************************
 * CONFIGURATION
 ****************************************************/
const API_URL = "https://default189de737c93a4f5a8b686f4ca99419.12.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/d4314734ce20444c881f3001a00c8e81/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A0IfGNN7q_BQZqUGjlkmK2Mx4rhVqQ_P96TvUBbPjyA";

/****************************************************
 * DOM ELEMENTS
 ****************************************************/
const totalAppsEl = document.getElementById("totalApps");
const approvedEl  = document.getElementById("approved");
const pendingEl   = document.getElementById("pending");
const tableBody   = document.querySelector("#dataTable tbody");

/****************************************************
 * HELPER FUNCTIONS
 ****************************************************/
function getStatusClass(status) {
  if (!status) return "";

  if (status === "Work Permit Approved") return "status-approved";
  if (status.includes("Pending")) return "status-pending";
  if (status.includes("Withdrawn")) return "status-withdrawn";

  return "";
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date)) return value;

  return date.toISOString().split("T")[0];
}

/****************************************************
 * MAIN LOAD FUNCTION
 ****************************************************/
async function loadDashboard() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON format");
    }

    renderKPIs(data);
    renderTable(data);

  } catch (error) {
    console.error("Dashboard load error:", error);
    tableBody.innerHTML =
      `<tr><td colspan="5">Unable to load dashboard data</td></tr>`;
  }
}

/****************************************************
 * KPI RENDERING
 ****************************************************/
function renderKPIs(data) {
  totalAppsEl.innerText = data.length;

  approvedEl.innerText = data.filter(d =>
    d.application?.revisedStatus === "Work Permit Approved"
  ).length;

  pendingEl.innerText = data.filter(d =>
    d.application?.revisedStatus?.includes("Pending")
  ).length;
}

/****************************************************
 * TABLE RENDERING
 ****************************************************/
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(row => {
    const status = row.application?.revisedStatus || "-";
    const statusClass = getStatusClass(status);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.employee?.employeeId || "-"}</td>
      <td>${row.employee?.name || "-"}</td>
      <td class="${statusClass}">${status}</td>
      <td>${row.application?.destinationCountry || "-"}</td>
      <td>${formatDate(row.dates?.govtFilingDate)}</td>
    `;

    tableBody.appendChild(tr);
  });
}

/****************************************************
 * INITIAL LOAD
 ****************************************************/
loadDashboard();