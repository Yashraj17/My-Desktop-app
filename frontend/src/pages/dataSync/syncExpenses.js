import axios from "axios";

export async function syncExpenses(subdomain, branchId, token,fromDatetime,toDatetime
  // fromDatetime, toDatetime
) {
  try {
    // ✅ Build base URL
    let url = `${subdomain}/api/expenses?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    // ✅ Add optional datetime filters (uncomment if needed)
    // if (fromDatetime && toDatetime) {
    //   url += `&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;
    // }
    //let url = `${subdomain}/api/expenses?branch_id=7`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
console.log("expence data...",response,url)
    if (response.data.status && response.data.data) {
      const expenses = response.data.data;

      for (let i = 0; i < expenses.length; i++) {
        const exp = expenses[i];

        // ✅ Call backend via IPC (instead of direct DB in frontend)
        await window.api.addExpenseBackup({
          id: exp.id,
          branch_id: exp.branch_id,
          expense_category_id: exp.expense_category_id,
          expense_title: exp.expense_title,
          description: exp.description,
          amount: exp.amount,
          expense_date: exp.expense_date,
          payment_status: exp.payment_status,
          payment_date: exp.payment_date,
          payment_due_date: exp.payment_due_date,
          payment_method: exp.payment_method,
          receipt_path: exp.receipt_path,
          expense_receipt_url: exp.expense_receipt_url,
          created_at: exp.created_at,
          updated_at: exp.updated_at,
        });
      }
      await window.api.saveSyncTime("expenses", toDatetime);
    }
  } catch (err) {
    console.error("❌ Expenses sync error:", err);
    throw err;
  }
}
