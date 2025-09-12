import axios from "axios";

function normalizePackageModule(raw) {
  return {
    id: raw.id,
    package_id: raw.package_id,
    module_id: raw.module_id,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

export async function syncPackageModules(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing package modules...");

    const url = `${subdomain}/api/package-modules?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const packageModules = response.data.data;

      for (let pm of packageModules) {
        await window.api.addPackageModuleBackup(normalizePackageModule(pm));
      }

      await window.api.saveSyncTime("package_modules", toDatetime);
      setStatus?.("✅ Package modules sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No package modules found.");
    }
  } catch (err) {
    console.error("❌ Package modules sync error:", err);
    setStatus?.("❌ Failed to sync package modules.");
    throw err;
  }
}
