import axios from "axios";

export async function syncSubDomainModuleSettings(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/sub-domain-module-settings?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Send to backend for SQLite insert
        await window.api.addSubDomainModuleSettingBackup({
          id: setting.id,
          license_type: setting.license_type,
          purchase_code: setting.purchase_code,
          purchased_on: setting.purchased_on,
          supported_until: setting.supported_until,
          banned_subdomain: setting.banned_subdomain,
          notify_update: setting.notify_update ?? 1,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save sync time
      await window.api.saveSyncTime("sub_domain_module_settings", toDatetime);
    }
  } catch (err) {
    console.error("❌ Sub Domain Module Settings sync error:", err);
    throw err;
  }
}
