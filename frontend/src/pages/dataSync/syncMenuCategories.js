import axios from "axios";

export async function syncMenuCategories(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    let url = `${subdomain}/api/menu/categories?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.status && response.data.data) {
      const categories = response.data.data;

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];

        // ✅ Insert into DB via IPC
        await window.api.addMenuCategoryBackup({
          id: cat.id,
          branch_id: cat.branch_id,
          category_name:cat.category_name, // <-- store as JSON
          sort_order: String(cat.sort_order || "0"),
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }
      await window.api.saveSyncTime("item_categories", toDatetime);
    }
  } catch (err) {
    console.error("❌ Menu categories sync error:", err);
    throw err;
  }
}



