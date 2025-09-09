import axios from "axios";

export async function syncExpenseCategories(subdomain, branchId, token) {
  try {
    const url = `${subdomain}/api/expense-categories?branch_id=${branchId}`;
    //const url = `${subdomain}/api/expense-categories?branch_id=7`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
console.log("expence cat data...",response,url)

    if (response.data.status && response.data.data) {
      const categories = response.data.data;

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];

        // ✅ Insert/Update in SQLite
        await window.api.addExpenseCategoryBackup({
          id: cat.id,
          branch_id: cat.branch_id,
          name: cat.name,
          description: cat.description,
          is_active: cat.is_active,
          created_at: cat.created_at,
          updated_at: cat.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Expense Categories sync error:", err);
    throw err;
  }
}
