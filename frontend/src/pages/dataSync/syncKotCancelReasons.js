import axios from "axios";

export async function syncKotCancelReasons(subdomain, restaurantId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/kot-cancel-reasons?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const reasons = response.data.data;

      for (let i = 0; i < reasons.length; i++) {
        const reason = reasons[i];

        await window.api.addKotCancelReasonBackup({
          id: reason.id,
          restaurant_id: reason.restaurant_id,
          reason: reason.reason,
          cancel_order: reason.cancel_order,
          cancel_kot: reason.cancel_kot,
          created_at: reason.created_at,
          updated_at: reason.updated_at,
          newfield1: reason.newfield1,
          newfield2: reason.newfield2,
          newfield3: reason.newfield3,
        });
      }
      await window.api.saveSyncTime("kot_cancel_reasons", toDatetime);
    }
  } catch (err) {
    console.error("❌ KOT Cancel Reasons sync error:", err);
    throw err;
  }
}
