import axios from "axios";

export async function syncKotPlaces(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/kot-places?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const places = response.data.data;

      for (const rawPlace of places) {
        const place = normalizeKotPlace(rawPlace);
        await window.api.addKotPlaceBackup(place);
      }
      await window.api.saveSyncTime("kot_places", toDatetime);
    }
    
  } catch (err) {
    console.error("❌ KOT Places sync error:", err);
    throw err;
  }
}

function normalizeKotPlace(raw) {
  return {
    ...raw,
    name: raw.name || "",
    type: raw.type || "",
    is_active: raw.is_active ? 1 : 0,
    is_default: raw.is_default ? 1 : 0,
    branch_id: raw.branch_id || null,
  };
}
