import axios from "axios";

// ✅ Sync front FAQ settings from API
export async function syncFrontFaqSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/front-faq-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const faqs = response.data.data;

      for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];

        // ✅ Call backend via IPC (no direct DB access here)
        await window.api.addFrontFaqSettingBackup({
          id: faq.id,
          language_setting_id: faq.language_setting_id,
          question: faq.question,
          answer: faq.answer,
          created_at: faq.created_at,
          updated_at: faq.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Front FAQ settings sync error:", err);
    throw err;
  }
}
