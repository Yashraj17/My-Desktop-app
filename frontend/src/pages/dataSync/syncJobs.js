import axios from "axios";

export async function syncJobs(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
     const url = `${subdomain}/api/jobs?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    //const url = `${subdomain}/api/jobs?branch_id=1`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const jobs = response.data.data;

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        // ✅ Call backend via IPC
        await window.api.addJobBackup({
          id: job.id,
          queue: job.queue,
          payload: job.payload,
          attempts: job.attempts,
          reserved_at: job.reserved_at,
          available_at: job.available_at,
          created_at: job.created_at,
        });
      }
      await window.api.saveSyncTime("jobs", toDatetime);
    }
  } catch (err) {
    console.error("❌ Jobs sync error:", err);
    throw err;
  }
}
