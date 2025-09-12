function normalizePaymentMethod(raw) {
  return {
    id: raw.id,
    branch_id: raw.branch_id || null,
    restaurant_id: raw.restaurant_id,
    name: raw.name,
    value: raw.value,
    description: raw.description || null,
    is_active: raw.is_active ? 1 : 0,
    open_drawer: raw.open_drawer ? 1 : 0,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

import axios from "axios";

export async function syncPaymentMethods(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing payment methods...");

    const url = `${subdomain}/api/payment-methods?restaurant_id=${restaurantId}&is_active=&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const methods = response.data.data;

      for (let m of methods) {
        await window.api.addPaymentMethodBackup(normalizePaymentMethod(m));
      }

      await window.api.saveSyncTime("payment_methods", toDatetime);
      setStatus?.("✅ Payment methods sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No payment methods found.");
    }
  } catch (err) {
    console.error("❌ Payment methods sync error:", err);
    setStatus?.("❌ Failed to sync payment methods.");
    throw err;
  }
}
