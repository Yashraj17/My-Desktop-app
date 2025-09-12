import axios from "axios";

// ✅ Sync restaurant_charges
export async function syncRestaurantCharges(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Restaurant Charges...");

    const url = `${subdomain}/api/restaurant-charges?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const charges = response.data.data;

      for (let ch of charges) {
        await window.api.addRestaurantChargeBackup(normalizeRestaurantCharge(ch));
      }

      await window.api.saveSyncTime("restaurant_charges", toDatetime);
      setStatus?.("✅ Restaurant Charges sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Restaurant Charges found.");
    }
  } catch (err) {
    console.error("❌ Restaurant Charges sync error:", err);
    setStatus?.("❌ Failed to sync Restaurant Charges.");
    throw err;
  }
}

// ✅ Normalizer
function normalizeRestaurantCharge(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    charge_name: raw.charge_name,
    charge_type: raw.charge_type,
    charge_value: raw.charge_value,
    order_types: raw.order_types || [],
    is_enabled: raw.is_enabled,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}