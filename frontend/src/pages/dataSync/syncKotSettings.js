import axios from "axios";

export async function syncKotSettings(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/kot-settings?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (const rawSetting of settings) {
        const setting = normalizeKotSetting(rawSetting);
        await window.api.addKotSettingBackup(setting);
      }
      await window.api.saveSyncTime("kot_settings", toDatetime);
    }
  } catch (err) {
    console.error("❌ KOT Settings sync error:", err);
    throw err;
  }
}

function normalizeKotSetting(raw) {
  return {
    ...raw,
    default_status: raw.default_status || "pending",
    enable_item_level_status: raw.enable_item_level_status ? 1 : 0,
    branch_id: raw.branch_id || null,
  };
}
