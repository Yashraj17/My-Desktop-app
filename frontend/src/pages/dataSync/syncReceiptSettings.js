import axios from "axios";

export async function syncReceiptSettings(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Receipt Settings...");

    const url = `${subdomain}/api/receipt-settings?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const settings = response.data.data;

      for (let rs of settings) {
        await window.api.addReceiptSettingBackup(normalizeReceiptSetting(rs));
      }

      await window.api.saveSyncTime("receipt_settings", toDatetime);
      setStatus?.("✅ Receipt Settings sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Receipt Settings found.");
    }
  } catch (err) {
    console.error("❌ Receipt Settings sync error:", err);
    setStatus?.("❌ Failed to sync Receipt Settings.");
    throw err;
  }
}
function normalizeReceiptSetting(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    show_customer_name: raw.show_customer_name,
    show_customer_address: raw.show_customer_address,
    show_table_number: raw.show_table_number,
    payment_qr_code: raw.payment_qr_code,
    show_payment_qr_code: raw.show_payment_qr_code,
    show_waiter: raw.show_waiter,
    show_total_guest: raw.show_total_guest,
    show_restaurant_logo: raw.show_restaurant_logo,
    show_tax: raw.show_tax,
    show_payment_details: raw.show_payment_details,
    receipt_notes: raw.receipt_notes,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
