import axios from "axios";

// ✅ Sync front features from API
export async function syncFrontFeatures(subdomain, token) {
  try {
    const url = `${subdomain}/api/front-features`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const features = response.data.data;

      for (let i = 0; i < features.length; i++) {
        const feature = features[i];

        // ✅ Call backend via IPC (no direct DB here)
        await window.api.addFrontFeatureBackup({
          id: feature.id,
          language_setting_id: feature.language_setting_id,
          title: feature.title,
          description: feature.description,
          image: feature.image,
          icon: feature.icon,
          type: feature.type,
          created_at: feature.created_at,
          updated_at: feature.updated_at,
          image_url: feature.image_url,
        });
      }
    }
  } catch (err) {
    console.error("❌ Front features sync error:", err);
    throw err;
  }
}