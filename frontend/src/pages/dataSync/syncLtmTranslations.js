import axios from "axios";

export async function syncLtmTranslations(subdomain, token) {
  try {
    const url = `${subdomain}/api/ltm-translations`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const translations = response.data.data;

      for (const rawTranslation of translations) {
        const translation = normalizeLtmTranslation(rawTranslation);
        await window.api.addLtmTranslationBackup(translation);
      }
    }
  } catch (err) {
    console.error("❌ LTM Translations sync error:", err);
    throw err;
  }
}

function normalizeLtmTranslation(raw) {
  return {
    ...raw,
    status: raw.status ? 1 : 0,
    locale: raw.locale || "",
    group: raw.group || "",
    key: raw.key || "",
    value: raw.value || "",
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
  };
}
