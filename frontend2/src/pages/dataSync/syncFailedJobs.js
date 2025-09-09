import axios from "axios";

export async function syncFailedJobs(subdomain, token) {
  try {
    const url = `${subdomain}/api/failed-jobs`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const jobs = response.data.data;

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        // ✅ Call backend via IPC (same as area backup)
        await window.api.addFailedJobBackup({
          id: job.id,
          uuid: job.uuid,
          connection: job.connection,
          queue: job.queue,
          payload: job.payload,
          exception: job.exception || null,
          failed_at: job.failed_at || new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.error("❌ FailedJobs sync error:", err);
    throw err;
  }
}
