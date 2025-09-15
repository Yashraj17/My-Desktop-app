import axios from "axios";

export async function syncWaiterRequests(subdomain, branchId, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/waiter-requests?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const waiterRequests = response.data.data;

      for (const request of waiterRequests) {
        // ✅ Send to backend for SQLite insert
        await window.api.addWaiterRequestBackup({
          id: request.id,
          branch_id: request.branch_id,
          table_id: request.table_id,
          status: request.status || "pending",
          created_at: request.created_at,
          updated_at: request.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("waiter_requests", toDatetime);
    }
  } catch (err) {
    console.error("❌ Waiter Requests sync error:", err);
    throw err;
  }
}
