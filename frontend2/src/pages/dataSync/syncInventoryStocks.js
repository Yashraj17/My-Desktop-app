import axios from "axios";

export async function syncInventoryStocks(subdomain, branchId, token) {
  try {
    const url = `${subdomain}/api/inventory-stocks?branch_id=${branchId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const stocks = response.data.data;

      for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];

        // ✅ Call backend via IPC
        await window.api.addInventoryStockBackup({
          id: stock.id,
          branch_id: stock.branch_id,
          inventory_item_id: stock.inventory_item_id,
          quantity: stock.quantity,
          created_at: stock.created_at,
          updated_at: stock.updated_at,
        });
      }
    }
  } catch (err) {
    console.error("❌ Inventory Stocks sync error:", err);
    throw err;
  }
}
