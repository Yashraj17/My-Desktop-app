import axios from "axios";

export async function syncJobBatches(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/job-batches?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const batches = response.data.data;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        await window.api.addJobBatchBackup({
          id: batch.id,
          name: batch.name,
          total_jobs: batch.total_jobs,
          pending_jobs: batch.pending_jobs,
          failed_jobs: batch.failed_jobs,
          failed_job_ids: batch.failed_job_ids,
          options: batch.options,
          cancelled_at: batch.cancelled_at,
          created_at: batch.created_at,
          finished_at: batch.finished_at,
          newfield1: batch.newfield1,
          newfield2: batch.newfield2,
          newfield3: batch.newfield3,
        });
      }
      await window.api.saveSyncTime("job_batches", toDatetime);
    }
  } catch (err) {
    console.error("❌ Job Batches sync error:", err);
    throw err;
  }
}
