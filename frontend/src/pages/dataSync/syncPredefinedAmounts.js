import axios from "axios";

export async function syncPredefinedAmounts(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Predefined Amounts...");

    const url = `${subdomain}/api/predefined-amounts?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const amounts = response.data.data;

      for (let a of amounts) {
        await window.api.addPredefinedAmountBackup(normalizePredefinedAmount(a));
      }

      await window.api.saveSyncTime("predefined_amounts", toDatetime);
      setStatus?.("✅ Predefined Amounts sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Predefined Amounts found.");
    }
  } catch (err) {
    console.error("❌ Predefined Amounts sync error:", err);
    setStatus?.("❌ Failed to sync Predefined Amounts.");
    throw err;
  }
}

function normalizePredefinedAmount(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    amount: raw.amount,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

