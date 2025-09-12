import axios from "axios";

// ✅ Sync reservation_settings
export async function syncReservationSettings(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Reservation Settings...");

    const url = `${subdomain}/api/reservation-settings?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const settings = response.data.data;

      for (let rs of settings) {
        await window.api.addReservationSettingBackup(normalizeReservationSetting(rs));
      }

      await window.api.saveSyncTime("reservation_settings", toDatetime);
      setStatus?.("✅ Reservation Settings sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Reservation Settings found.");
    }
  } catch (err) {
    console.error("❌ Reservation Settings sync error:", err);
    setStatus?.("❌ Failed to sync Reservation Settings.");
    throw err;
  }
}

// ✅ Normalizer
function normalizeReservationSetting(raw) {
  return {
    id: raw.id,
    branch_id: raw.branch_id,
    day_of_week: raw.day_of_week,
    time_slot_start: raw.time_slot_start,
    time_slot_end: raw.time_slot_end,
    time_slot_difference: raw.time_slot_difference,
    slot_type: raw.slot_type,
    available: raw.available,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}