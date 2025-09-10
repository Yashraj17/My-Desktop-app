import axios from "axios";

// ✅ Sync front details from API
export async function syncFrontDetails(subdomain, token) {
  try {
    const url = `${subdomain}/api/front-details`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const frontDetails = response.data.data;

      for (let i = 0; i < frontDetails.length; i++) {
        const detail = frontDetails[i];

        // ✅ Call backend via IPC (no direct DB here)
        await window.api.addFrontDetailBackup({
          id: detail.id,
          language_setting_id: detail.language_setting_id,
          header_title: detail.header_title,
          header_description: detail.header_description,
          image: detail.image,
          feature_with_image_heading: detail.feature_with_image_heading,
          review_heading: detail.review_heading,
          feature_with_icon_heading: detail.feature_with_icon_heading,
          comments_heading: detail.comments_heading,
          price_heading: detail.price_heading,
          price_description: detail.price_description,
          faq_heading: detail.faq_heading,
          faq_description: detail.faq_description,
          contact_heading: detail.contact_heading,
          footer_copyright_text: detail.footer_copyright_text,
          created_at: detail.created_at,
          updated_at: detail.updated_at,
          image_url: detail.image_url,
        });
      }
    }
  } catch (err) {
    console.error("❌ Front details sync error:", err);
    throw err;
  }
}