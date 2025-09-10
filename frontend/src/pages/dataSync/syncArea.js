import axios from "axios";

export async function syncArea(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    // const url = `${subdomain}/api/table/areas?branch_id=1`;
    const url = `${subdomain}/api/table/areas?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const areas = response.data.data;

      for (let i = 0; i < areas.length; i++) {
        const area = areas[i];

        // ✅ Call backend via IPC (no require/db here)
        await window.api.addAreaBackup({
          id: area.id,
          branch_id: area.branch_id,
          area_name: area.area_name,
          created_at: area.created_at,
          updated_at: area.updated_at,
        
        });
      }
      await window.api.saveSyncTime("areas", toDatetime);
    }
  } catch (err) {
    console.error("❌ Area sync error:", err);
    throw err;
  }
}


