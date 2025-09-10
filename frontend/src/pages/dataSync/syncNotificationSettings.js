import axios from "axios";

export async function syncNotificationSettings(subdomain, restaurantId, token) {
  try {
    const url = `${subdomain}/api/notification-settings?restaurant_id=${restaurantId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (const rawSetting of settings) {
        const setting = normalizeNotificationSetting(rawSetting);
        await window.api.addNotificationSettingBackup(setting);
      }
    }
  } catch (err) {
    console.error("❌ Notification Settings sync error:", err);
    throw err;
  }
}

function normalizeNotificationSetting(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    type: raw.type || "",
    send_email: raw.send_email || 0,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

