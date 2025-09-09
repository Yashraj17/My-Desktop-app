import axios from "axios";

export async function syncInventorySettings(subdomain, restaurantId, token) {
  try {
    const url = `${subdomain}/api/inventory-settings?restaurant_id=${restaurantId}`;
    //const url = `${subdomain}/api/inventory-settings?restaurant_id=1`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Call backend via IPC
        await window.api.addInventorySettingBackup({
          id: setting.id,
          restaurant_id: setting.restaurant_id,
          allow_auto_purchase: setting.allow_auto_purchase,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Inventory Settings sync error:", err);
    throw err;
  }
}
