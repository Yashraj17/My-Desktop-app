import axios from "axios";

export async function syncSuppliers(subdomain, restaurantId, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/suppliers?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const suppliers = response.data.data;

      for (const supplier of suppliers) {
        // ✅ Send each supplier to backend via IPC
        await window.api.addSupplierBackup({
          id: supplier.id,
          restaurant_id: supplier.restaurant_id,
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
          created_at: supplier.created_at,
          updated_at: supplier.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("suppliers", toDatetime);
    }
  } catch (err) {
    console.error("❌ Suppliers sync error:", err);
    throw err;
  }
}
