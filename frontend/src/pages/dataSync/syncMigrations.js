
import axios from "axios";

export async function syncMigrations(subdomain, token) {
  try {
    const url = `${subdomain}/api/migrations`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const migrations = response.data.data;

      for (const rawMigration of migrations) {
        const migration = normalizeMigration(rawMigration);
        await window.api.addMigrationBackup(migration);
      }
    }
  } catch (err) {
    console.error("❌ Migrations sync error:", err);
    throw err;
  }
}

// Normalizer
function normalizeMigration(raw) {
  return {
    ...raw,
    migration: raw.migration || "",
    batch: raw.batch || 0,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}