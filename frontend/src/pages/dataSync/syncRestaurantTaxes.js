import axios from "axios";

// ✅ Sync restaurant_taxes
export async function syncRestaurantTaxes(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Restaurant Taxes...");

    const url = `${subdomain}/api/restaurant-taxes?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const taxes = response.data.data;

      for (let t of taxes) {
        await window.api.addRestaurantTaxBackup(normalizeRestaurantTax(t));
      }

      await window.api.saveSyncTime("restaurant_taxes", toDatetime);
      setStatus?.("✅ Restaurant Taxes sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Restaurant Taxes found.");
    }
  } catch (err) {
    console.error("❌ Restaurant Taxes sync error:", err);
    setStatus?.("❌ Failed to sync Restaurant Taxes.");
    throw err;
  }
}

// ✅ Normalizer
function normalizeRestaurantTax(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    tax_id: raw.tax_id,
    tax_name: raw.tax_name,
    tax_inclusive: raw.tax_inclusive,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}