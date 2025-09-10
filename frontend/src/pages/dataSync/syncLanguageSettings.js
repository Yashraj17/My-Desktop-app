import axios from "axios";

export async function syncLanguageSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/language-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const languages = response.data.data;

      for (const rawLang of languages) {
        const lang = normalizeLanguageSetting(rawLang);
        await window.api.addLanguageSettingBackup(lang);
      }
    }
  } catch (err) {
    console.error("❌ Language Settings sync error:", err);
    throw err;
  }
}

function normalizeLanguageSetting(raw) {
  return {
    ...raw,
    language_code: raw.language_code || "",
    language_name: raw.language_name || "",
    flag_code: raw.flag_code || "",
    active: raw.active ? 1 : 0,
    is_rtl: raw.is_rtl ? 1 : 0,
  };
}
