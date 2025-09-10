import axios from "axios";

export async function syncOfflinePlanChanges(subdomain, token) {
  try {
    const url = `${subdomain}/api/offline-plan-changes`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const planChanges = response.data.data;

      for (const rawChange of planChanges) {
        const planChange = normalizeOfflinePlanChange(rawChange);
        await window.api.addOfflinePlanChangeBackup(planChange);
      }
    }
  } catch (err) {
    console.error("❌ Offline Plan Changes sync error:", err);
    throw err;
  }
}
function normalizeOfflinePlanChange(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id || null,
    package_id: raw.package_id,
    package_type: raw.package_type,
    amount: raw.amount || 0,
    pay_date: raw.pay_date || null,
    next_pay_date: raw.next_pay_date || null,
    invoice_id: raw.invoice_id || null,
    offline_method_id: raw.offline_method_id || null,
    file_name: raw.file_name || null,
    status: raw.status || "pending",
    remark: raw.remark || null,
    description: raw.description || "",
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
