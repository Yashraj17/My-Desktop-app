import axios from "axios";

// ✅ Sync reservations
export async function syncReservations(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Reservations...");

    const url = `${subdomain}/api/reservations?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const reservations = response.data.data;

      for (let r of reservations) {
        await window.api.addReservationBackup(normalizeReservation(r));
      }

      await window.api.saveSyncTime("reservations", toDatetime);
      setStatus?.("✅ Reservations sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Reservations found.");
    }
  } catch (err) {
    console.error("❌ Reservations sync error:", err);
    setStatus?.("❌ Failed to sync Reservations.");
    throw err;
  }
}

// ✅ Normalizer for reservations
function normalizeReservation(raw) {
  return {
    id: raw.id,
    branch_id: raw.branch_id,
    table_id: raw.table_id,
    customer_id: raw.customer_id,
    reservation_date_time: raw.reservation_date_time,
    party_size: raw.party_size,
    special_requests: raw.special_requests,
    reservation_status: raw.reservation_status,
    reservation_slot_type: raw.reservation_slot_type,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}