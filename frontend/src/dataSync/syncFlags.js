import axios from "axios";

export async function syncFlags(subdomain, token) {
  try {
    const url = `${subdomain}/api/flags`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const flags = response.data.data;

      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];

        // ✅ Call backend via IPC
        await window.api.addFlagBackup({
          id: flag.id,
          name: flag.name,
          code: flag.code,
          capital: flag.capital,
          continent: flag.continent,
        });
      }
    }
  } catch (err) {
    console.error("❌ Flags sync error:", err);
    throw err;
  }
}
