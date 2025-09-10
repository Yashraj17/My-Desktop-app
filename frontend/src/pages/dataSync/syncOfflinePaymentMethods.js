import axios from "axios";

export async function syncOfflinePaymentMethods(subdomain, restaurantId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/offline-payment-methods?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const methods = response.data.data;

      for (const rawMethod of methods) {
        const method = normalizeOfflinePaymentMethod(rawMethod);
        await window.api.addOfflinePaymentMethodBackup(method);
      }
          await window.api.saveSyncTime("offline_payment_methods", toDatetime);

    }
  } catch (err) {
    console.error("❌ Offline Payment Methods sync error:", err);
    throw err;
  }
}
function normalizeOfflinePaymentMethod(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id || null,
    name: raw.name || "",
    description: raw.description || "",
    status: raw.status || "inactive",
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
