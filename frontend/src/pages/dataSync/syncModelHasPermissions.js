import axios from "axios";

export async function syncModelHasPermissions(subdomain, token) {
  try {
    const url = `${subdomain}/api/model-has-permissions`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const permissions = response.data.data;

      for (const rawPermission of permissions) {
        const record = normalizeModelHasPermission(rawPermission);
        await window.api.addModelHasPermissionBackup(record);
      }
    }
  } catch (err) {
    console.error("❌ ModelHasPermissions sync error:", err);
    throw err;
  }
}
function normalizeModelHasPermission(raw) {
  return {
    permission_id: raw.permission_id,
    model_type: raw.model_type || "",
    model_id: raw.model_id,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
