import axios from "axios";

export async function syncTables(subdomain, branchId, token) {
  try {
    const url = `${subdomain}/api/table/table-list?branch_id=${branchId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const tables = response.data.data;

      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        // ✅ Call backend via IPC
        await window.api.addTableBackup({
          id: table.id,
          branch_id: table.branch_id,
          table_code: table.table_code,
          hash: table.hash,
          status: table.status,
          available_status: table.available_status,
          area_id: table.area_id,
          seating_capacity: table.seating_capacity,
          created_at: table.created_at,
          updated_at: table.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Tables sync error:", err);
    throw err;
  }
}
