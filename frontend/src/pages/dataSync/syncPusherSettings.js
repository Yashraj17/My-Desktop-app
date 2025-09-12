import axios from "axios";

export async function syncPusherSettings(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Pusher Settings...");

    const url = `${subdomain}/api/pusher-settings?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const settings = response.data.data;

      for (let s of settings) {
        await window.api.addPusherSettingBackup(normalizePusherSetting(s));
      }

      await window.api.saveSyncTime("pusher_settings", toDatetime);
      setStatus?.("✅ Pusher Settings sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Pusher Settings found.");
    }
  } catch (err) {
    console.error("❌ Pusher Settings sync error:", err);
    setStatus?.("❌ Failed to sync Pusher Settings.");
    throw err;
  }
}
function normalizePusherSetting(raw) {
  return {
    id: raw.id,
    beamer_status: raw.beamer_status,
    instance_id: raw.instance_id,
    beam_secret: raw.beam_secret,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    pusher_broadcast: raw.pusher_broadcast,
    pusher_app_id: raw.pusher_app_id,
    pusher_key: raw.pusher_key,
    pusher_secret: raw.pusher_secret,
    pusher_cluster: raw.pusher_cluster,
    is_enabled_pusher_broadcast: raw.is_enabled_pusher_broadcast ? 1 : 0,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
