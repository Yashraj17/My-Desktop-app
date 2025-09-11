function normalizePersonalAccessToken(raw) {
  return {
    id: raw.id,
    tokenable_type: raw.tokenable_type,
    tokenable_id: raw.tokenable_id,
    name: raw.name,
    token: raw.token,
    abilities: raw.abilities || null,
    last_used_at: raw.last_used_at || null,
    expires_at: raw.expires_at || null,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
import axios from "axios";

export async function syncPersonalAccessTokens(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing personal access tokens...");

    const url = `${subdomain}/api/personal-access-tokens?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const tokens = response.data.data;

      for (let t of tokens) {
        await window.api.addPersonalAccessTokenBackup(normalizePersonalAccessToken(t));
      }

      await window.api.saveSyncTime("personal_access_tokens", toDatetime);
      setStatus?.("✅ Personal access tokens sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No personal access tokens found.");
    }
  } catch (err) {
    console.error("❌ Personal access tokens sync error:", err);
    setStatus?.("❌ Failed to sync personal access tokens.");
    throw err;
  }
}
