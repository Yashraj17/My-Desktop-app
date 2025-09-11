function normalizePermission(raw) {
  return {
    id: raw.id,
    name: raw.name,
    guard_name: raw.guard_name,
    module_id: raw.module_id,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
import axios from "axios";

export async function syncPermissions(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing permissions...");

    const url = `${subdomain}/api/permissions?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const permissions = response.data.data;

      for (let perm of permissions) {
        await window.api.addPermissionBackup(normalizePermission(perm));
      }

      await window.api.saveSyncTime("permissions", toDatetime);
      setStatus?.("✅ Permissions sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No permissions found.");
    }
  } catch (err) {
    console.error("❌ Permissions sync error:", err);
    setStatus?.("❌ Failed to sync permissions.");
    throw err;
  }
}
