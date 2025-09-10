import axios from "axios";

export async function syncModules(subdomain, token) {
  try {
    const url = `${subdomain}/api/modules`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const modules = response.data.data;

      for (const rawModule of modules) {
        const module = normalizeModule(rawModule);
        await window.api.addModuleBackup(module);
      }
    }
  } catch (err) {
    console.error("❌ Modules sync error:", err);
    throw err;
  }
}
function normalizeModule(raw) {
  return {
    id: raw.id,
    name: raw.name || "",
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
