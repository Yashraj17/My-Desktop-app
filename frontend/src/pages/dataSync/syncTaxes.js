import axios from "axios";

export async function syncTaxes(subdomain, restaurantId, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/taxes?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const taxes = response.data.data;

      for (const tax of taxes) {
        // ✅ Send each tax to backend via IPC
        await window.api.addTaxBackup({
          id: tax.id,
          restaurant_id: tax.restaurant_id,
          tax_name: tax.tax_name,
          tax_percent: tax.tax_percent,
          tax_inclusive: tax.tax_inclusive,
          created_at: tax.created_at,
          updated_at: tax.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("taxes", toDatetime);
    }
  } catch (err) {
    console.error("❌ Taxes sync error:", err);
    throw err;
  }
}
