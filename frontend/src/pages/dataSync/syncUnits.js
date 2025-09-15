import axios from "axios";

export async function syncUnits(subdomain, branchId, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/units?branch_id=${branchId}&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const units = response.data.data;

      for (const unit of units) {
        // ✅ Send each unit to backend via IPC
        await window.api.addUnitBackup({
          id: unit.id,
          branch_id: unit.branch_id,
          name: unit.name,
          symbol: unit.symbol,
          created_at: unit.created_at,
          updated_at: unit.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("units", toDatetime);
    }
  } catch (err) {
    console.error("❌ Units sync error:", err);
    throw err;
  }
}
