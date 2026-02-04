/****************************************************
 * CONFIGURATION
 ****************************************************/
const API_URL = "https://default189de737c93a4f5a8b686f4ca99419.12.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/d4314734ce20444c881f3001a00c8e81/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A0IfGNN7q_BQZqUGjlkmK2Mx4rhVqQ_P96TvUBbPjyA";

/****************************************************
 * DOM ROOT
 ****************************************************/
const appRoot = document.getElementById("app");

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

    renderVisaTypeSummary(data);

  } catch (error) {
    console.error("Dashboard load error:", error);
    appRoot.innerHTML = `<p class="error">Unable to load dashboard data</p>`;
  }
}

/****************************************************
 * VISA TYPE SUMMARY (VALIDATION STEP)
 ****************************************************/
function renderVisaTypeSummary(data) {

  // Total records
  const totalRecords = data.length;

  // Group by Visa Type
  const visaTypeSummary = {};

  data.forEach(row => {
    const visaType = row.application?.Visa_Type || "Unknown";

    visaTypeSummary[visaType] =
      (visaTypeSummary[visaType] || 0) + 1;
  });

  // Build HTML
  let html = `
    <section class="summary">
      <h2>Data Validation Summary</h2>
      <p><strong>Total Records:</strong> ${totalRecords}</p>

      <h3>Records by Visa Type</h3>
      <ul>
  `;

  Object.entries(visaTypeSummary).forEach(([type, count]) => {
    html += `<li><strong>${type}</strong>: ${count}</li>`;
  });

  html += `
      </ul>
    </section>
  `;

  appRoot.innerHTML = html;
}

/****************************************************
 * INITIAL LOAD
 ****************************************************/
loadDashboard();