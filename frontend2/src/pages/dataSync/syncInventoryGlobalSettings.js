import axios from "axios";

export async function syncInventoryGlobalSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/inventory-global-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Call backend via IPC
        await window.api.addInventoryGlobalSettingBackup({
          id: setting.id,
          license_type: setting.license_type,
          purchase_code: setting.purchase_code,
          purchased_on: setting.purchased_on,
          supported_until: setting.supported_until,
          notify_update: setting.notify_update,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Inventory Global Settings sync error:", err);
    throw err;
  }
}
