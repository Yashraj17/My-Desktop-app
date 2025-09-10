import axios from "axios";

// ✅ Sync front review settings from API
export async function syncFrontReviewSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/front-review-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const reviews = response.data.data;

      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];

        // ✅ Call backend via IPC (no direct DB access here)
        await window.api.addFrontReviewSettingBackup({
          id: review.id,
          language_setting_id: review.language_setting_id,
          reviews: review.reviews,
          reviewer_name: review.reviewer_name,
          reviewer_designation: review.reviewer_designation,
          created_at: review.created_at,
          updated_at: review.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Front review settings sync error:", err);
    throw err;
  }
}
