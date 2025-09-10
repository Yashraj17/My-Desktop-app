import axios from "axios";

export async function syncFileStorageSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/file-storage-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Call backend via IPC
        await window.api.addFileStorageSettingBackup({
          id: setting.id,
          filesystem: setting.filesystem,
          auth_keys: setting.auth_keys,
          status: setting.status,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ File Storage Settings sync error:", err);
    throw err;
  }
}
