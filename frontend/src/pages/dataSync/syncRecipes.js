import axios from "axios";

// ✅ Sync recipes
export async function syncRecipes(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Recipes...");

    const url = `${subdomain}/api/recipes?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const recipes = response.data.data;

      for (let r of recipes) {
        await window.api.addRecipeBackup(normalizeRecipe(r));
      }

      await window.api.saveSyncTime("recipes", toDatetime);
      setStatus?.("✅ Recipes sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Recipes found.");
    }
  } catch (err) {
    console.error("❌ Recipes sync error:", err);
    setStatus?.("❌ Failed to sync Recipes.");
    throw err;
  }
}

// ✅ Normalizer for recipes
function normalizeRecipe(raw) {
  return {
    id: raw.id,
    menu_item_id: raw.menu_item_id,
    inventory_item_id: raw.inventory_item_id,
    quantity: raw.quantity,
    unit_id: raw.unit_id,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}