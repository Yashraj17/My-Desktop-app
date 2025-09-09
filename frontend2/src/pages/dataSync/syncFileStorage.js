import axios from "axios";

export async function syncFileStorage(subdomain, restaurantId, token) {
  try {
    const url = `${subdomain}/api/file-storage?restaurant_id=${restaurantId}`;
  //const url = `${subdomain}/api/file-storage?restaurant_id=1`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const files = response.data.data;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // ✅ Call backend via IPC to insert/backup file data
        await window.api.addFileStorageBackup({
          id: file.id,
          restaurant_id: file.restaurant_id,
          path: file.path,
          filename: file.filename,
          type: file.type,
          size: file.size,
          storage_location: file.storage_location,
          created_at: file.created_at,
          updated_at: file.updated_at,
          file_url: file.file_url,
          icon: file.icon,
          size_format: file.size_format,
        });
      }
    }
  } catch (err) {
    console.error("❌ File Storage sync error:", err);
    throw err;
  }
}
