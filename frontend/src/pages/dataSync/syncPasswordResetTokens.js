import axios from "axios";

export async function syncPasswordResetTokens(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing password reset tokens...");

    const url = `${subdomain}/api/password-reset-tokens`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const tokens = response.data.data;

      for (let t of tokens) {
        await window.api.addPasswordResetTokenBackup(normalizePasswordResetToken(t));
      }

      await window.api.saveSyncTime("password_reset_tokens", toDatetime);
      setStatus?.("✅ Password reset tokens sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No password reset tokens found.");
    }
  } catch (err) {
    console.error("❌ Password reset tokens sync error:", err);
    setStatus?.("❌ Failed to sync password reset tokens.");
    throw err;
  }
}

function normalizePasswordResetToken(raw) {
  return {
    email: raw.email,
    token: raw.token,
    created_at: raw.created_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
