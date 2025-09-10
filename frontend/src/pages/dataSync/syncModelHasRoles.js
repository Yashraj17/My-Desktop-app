import axios from "axios";

export async function syncModelHasRoles(subdomain, token) {
  try {
    const url = `${subdomain}/api/model-has-roles`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const roles = response.data.data;

      for (const rawRole of roles) {
        const record = normalizeModelHasRole(rawRole);
        await window.api.addModelHasRoleBackup(record);
      }
    }
  } catch (err) {
    console.error("❌ ModelHasRoles sync error:", err);
    throw err;
  }
}
function normalizeModelHasRole(raw) {
  return {
    role_id: raw.role_id,
    model_type: raw.model_type || "",
    model_id: raw.model_id,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
