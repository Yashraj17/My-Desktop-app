import axios from "axios";

export async function syncDesktopApplications(subdomain,branchId,token, 
   // fromDatetime, toDatetime
) {
  try {
    // ✅ Build base URL
    let url = `${subdomain}/api/desktop-applications`;

    // ✅ Add optional datetime filters
    // if (fromDatetime && toDatetime) {
    //   url += `?from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;
    // }

   const response = await axios.get(url, {
      headers: {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
}
,
    });
    if (response.data.status && response.data.data) {
      const apps = response.data.data;

      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];

        // ✅ Call backend via IPC
        await window.api.addDesktopApplicationBackup({
          id: app.id,
          windows_file_path: app.windows_file_path,
          mac_intel_file_path: app.mac_intel_file_path,
          linux_file_path: app.linux_file_path,
          mac_silicon_file_path: app.mac_silicon_file_path,
          created_at: app.created_at,
          updated_at: app.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Desktop Applications sync error:", err);
    throw err;
  }
}
