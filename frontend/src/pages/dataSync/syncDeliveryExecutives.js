import axios from "axios";

export async function syncDeliveryExecutives(subdomain, branchId, token,fromDatetime,toDatetime 
    //fromDatetime, toDatetime
) {
  try {
    // ✅ Build base URL
    let url = `${subdomain}/api/delivery-executives?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    // ✅ Add optional datetime filters
    // if (fromDatetime && toDatetime) {
    //   url += `&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;
    // }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const executives = response.data.data;

      for (let i = 0; i < executives.length; i++) {
        const exec = executives[i];

        // ✅ Call backend via IPC (instead of direct DB in frontend)
        await window.api.addDeliveryExecutiveBackup({
          id: exec.id,
          branch_id: exec.branch_id,
          name: exec.name,
          phone: exec.phone,
          photo: exec.photo,
          status: exec.status,
          created_at: exec.created_at,
          updated_at: exec.updated_at,
        });
      }
      await window.api.saveSyncTime("delivery_executives", toDatetime);
    }
  } catch (err) {
    console.error("❌ Delivery Executives sync error:", err);
    throw err;
  }
}
