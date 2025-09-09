import axios from "axios";

export async function syncCustomers(subdomain, restaurantId, token,
     //fromDatetime, toDatetime
    ) {
  try {
    let url = `${subdomain}/api/customers?restaurant_id=${restaurantId}`;
    // if (fromDatetime && toDatetime) {
    //   url += `&from_datetime=${encodeURIComponent(fromDatetime)}&to_datetime=${encodeURIComponent(toDatetime)}`;
    // }

   
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response,"data costomer..........",url)
    if (response.data.status && response.data.data) {
      const customers = response.data.data;

      for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];

        // ✅ Call backend via IPC
        await window.api.addCustomerBackup({
          id: customer.id,
          restaurant_id: customer.restaurant_id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          email_otp: customer.email_otp,
          created_at: customer.created_at,
          updated_at: customer.updated_at,
          delivery_address: customer.delivery_address,
        });
      }
    }
  } catch (err) {
    console.error("❌ Customers sync error:", err);
    throw err;
  }
}
