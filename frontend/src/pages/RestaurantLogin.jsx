import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import icon from "/images/icon.ico";
import { syncMasterData } from "./dataSync/syncMasterData";
import axios from "axios";
import Swal from "sweetalert2";

function RestaurantLogin({ setIsAuthenticated }) {
  const [subdomain, setSubdomain] = useState("https://www.prtechit.com");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting sync...");
  const [branches, setBranches] = useState([]);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");

  const syncIntervalRef = useRef(null);
  const navigate = useNavigate();
  const isSyncing = useRef(false);

  // ---------------- Auto Sync Scheduler ----------------
  const startSyncSchedulerOLD = (subdomain, email, password, user) => {
    syncIntervalRef.current = setInterval(async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        const online = await window.api.isOnline(subdomain);
        if (!online) return console.log("⚠️ Skipping sync: No internet");

        console.log("🔑 Logging into server for fresh token...");
        const { token, user: freshUser } = (
          await axios.post(`${subdomain}/api/login`, { email, password })
        ).data;

        const fromDatetime = "2000-08-10 00:00:00";
        const toDatetime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        console.log("🔄 Auto Sync triggered");
        await syncMasterData(
          subdomain,
          token,
          () => {},
          () => {},
          freshUser,
          fromDatetime,
          toDatetime
        );
        console.log("✅ Auto Sync completed");
      } catch (err) {
        console.error("❌ Auto Sync failed:", err.message);
      } finally {
        isSyncing.current = false;
      }
    }, 600000); // every 10 minutes
  };

  const stopSyncSchedulerOLD = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
      console.log("🛑 Auto sync stopped");
    }
  };


  // ---------------- Auto Sync Scheduler ----------------
const startSyncScheduler = (subdomain, email, password, user) => {
  // ✅ Use global reference instead of component ref
  if (window.syncIntervalRef) {
    console.log("⚠️ Auto sync already running");
    return;
  }

  console.log("✅ Auto Sync Scheduler started");

  window.syncIntervalRef = setInterval(async () => {
    if (window.isSyncing) return;
    window.isSyncing = true;

    try {
      const online = await window.api.isOnline(subdomain);
      if (!online) return console.log("⚠️ Skipping sync: No internet");

      console.log("🔑 Logging into server for fresh token...");
      const { token, user: freshUser } = (
        await axios.post(`${subdomain}/api/login`, { email, password })
      ).data;

      const fromDatetime = "2000-08-10 00:00:00";
      const toDatetime = new Date().toISOString().slice(0, 19).replace("T", " ");

      console.log("🔄 Auto Sync triggered");
      await syncMasterData(
        subdomain,
        token,
        () => {},
        () => {},
        freshUser,
        fromDatetime,
        toDatetime
      );
      console.log("✅ Auto Sync completed");
    } catch (err) {
      console.error("❌ Auto Sync failed:", err.message);
    } finally {
      window.isSyncing = false;
    }
  }, 600000); // every 10 minutes

  // Optional immediate first run
  (async () => {
    try {
      const online = await window.api.isOnline(subdomain);
      if (!online) return;
      const { token, user: freshUser } = (
        await axios.post(`${subdomain}/api/login`, { email, password })
      ).data;
      const fromDatetime = "2000-08-10 00:00:00";
      const toDatetime = new Date().toISOString().slice(0, 19).replace("T", " ");
      await syncMasterData(subdomain, token, () => {}, () => {}, freshUser, fromDatetime, toDatetime);
      console.log("✅ Initial Auto Sync completed");
    } catch (err) {
      console.error("❌ Initial Auto Sync failed:", err.message);
    }
  })();
};

const stopSyncScheduler = () => {
  if (window.syncIntervalRef) {
    clearInterval(window.syncIntervalRef);
    window.syncIntervalRef = null;
    console.log("🛑 Auto sync stopped");
  }
};

  // 🧹 Cleanup when component unmounts
  useEffect(() => {
    return () => stopSyncScheduler();
  }, []);

  // ---------------- Fetch Branches ----------------
  const getBranches = async (restaurantId, token, source) => {
    try {
      if (source === "local") {
        const localBranches = await window.api.getBranches(restaurantId);
        if (localBranches.length) {
          setBranches(localBranches);
          setShowBranchModal(true);
        } else
          Swal.fire({
            icon: "success",
            title: "No branches found locally.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
        return;
      }

      const response = await axios.get(`${subdomain}/api/branches`, {
        params: { restaurant_id: restaurantId },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const branchList = response.data?.data || response.data;
      if (Array.isArray(branchList) && branchList.length) {
        setBranches(branchList);
        setShowBranchModal(true);
      } else
        Swal.fire({
          icon: "success",
          title: "No branches found for this restaurant.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
    } catch (err) {
      console.error("❌ Failed to fetch branches:", err.message);
      Swal.fire({
        icon: "success",
        title: "Failed to load branches.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // ---------------- Handle Login ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setProgress(0);
    setStatus("Logging in...");

    try {
      const { token, user, source } = await window.api.login({
        email,
        password,
        subdomain,
      });

      if (!user?.branch_id) {
        window.tempUser = user;
        window.tempToken = token;
        window.tempSource = source;
        await getBranches(user.restaurant_id, token, source);
        return;
      }

      const branchId = user.branch_id;
      const userName = user.name || "Unknown";
      const restaurant = user.restaurant_id || 1;
      const id = user.id || 1;
      await window.api.saveLogin(branchId, token, userName, restaurant, id);

      const fromDatetime = "2000-08-10 00:00:00";
      const toDatetime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      if (source === "remote") {
        await syncMasterData(
          subdomain,
          token,
          setProgress,
          setStatus,
          user,
          fromDatetime,
          toDatetime
        );
      } else {
        setProgress(100);
        setStatus("Loaded from local storage");
      }

      startSyncScheduler(subdomain, user.email, password, user);

      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Login/Menu sync error:", err.message);
      setError("Login or data sync failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Handle Branch Selection ----------------
  const handleBranchSelect111 = async (subdomain, password) => {
    if (!selectedBranch) return;
    Swal.fire({
      icon: "success",
      title: "Please select a branch first.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });

    const user = window.tempUser;
    const token = window.tempToken;
    const source = window.tempSource || "local";

    if (!user || !token) {
      Swal.fire({
        icon: "success",
        title: "Session expired, please login again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowBranchModal(false);
      return;
    }

    try {
      const updatedUser = { ...user, branch_id: parseInt(selectedBranch, 10) };
      const userName = updatedUser?.name || "Unknown";
      const restaurant = updatedUser?.restaurant_id || 1;
      const id = updatedUser?.id || 1;
      await window.api.saveLogin(
        selectedBranch,
        token,
        userName,
        restaurant,
        id
      );
      Swal.fire({
        icon: "success",
        title: "Branch selected successfully!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowBranchModal(false);

      if (source !== "local") {
        const fromDatetime = "2000-08-10 00:00:00";
        const toDatetime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        setLoading(true);
        setProgress(0);
        setStatus("Syncing data...");

        await syncMasterData(
          subdomain,
          token,
          setProgress,
          setStatus,
          updatedUser,
          fromDatetime,
          toDatetime
        );
      }

      startSyncScheduler(subdomain, updatedUser.email, password, updatedUser);

      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Error setting branch:", err);
      Swal.fire({
        icon: "success",
        title: "Failed to save branch selection.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSelect = async (selectedBranch,subdomain, password) => {
    if (!selectedBranch) return;
    Swal.fire({
      icon: "success",
      title: "Please select a branch first.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });

    const user = window.tempUser;
    const token = window.tempToken;
    if (!user || !token) {
      Swal.fire({
        icon: "success",
        title: "Session expired, please login again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowBranchModal(false);
      return;
    }

    setLoading(true);

    try {
      const updatedUser = { ...user, branch_id: parseInt(selectedBranch, 10) };
      const userName = updatedUser?.name || "Unknown";
      const restaurant = updatedUser?.restaurant_id || 1;
      const id = updatedUser?.id || 1;

      await window.api.saveLogin(
        selectedBranch,
        token,
        userName,
        restaurant,
        id
      );

      Swal.fire({
        icon: "success",
        title: "Branch selected successfully!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowBranchModal(false);

      // 🌐 Check online and sync
      const online = await window.api.isOnline(subdomain);
      if (!online) return console.log("⚠️ Skipping sync: No internet");

      console.log("🔑 Logging into server for fresh token...");
      const { token: newToken } = (
        await axios.post(`${subdomain}/api/login`, { email, password })
      ).data;

      const fromDatetime = "2000-08-10 00:00:00";
      const toDatetime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      console.log("🔄 Auto Sync triggered");
       await syncMasterData(
          subdomain,
          newToken,
          setProgress,
          setStatus,
          user,
          fromDatetime,
          toDatetime
        );

      startSyncScheduler(subdomain, updatedUser.email, password, updatedUser);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Error setting branch:", err);
      Swal.fire({
        icon: "success",
        title: "Failed to save branch selection.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={icon} alt="RestroFox" className="h-12" />
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Restaurant Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
 {showBranchModal && (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-center">
      Select Your Branch
    </h3>
    <select
      className="w-full border p-2 rounded mb-4"
      value={selectedBranch}
      onChange={(e) => {
        setSelectedBranch(e.target.value);
        handleBranchSelect(e.target.value,subdomain, password);
      }}
    >
      <option value="">-- Select Branch --</option>
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name} {b.address ? `(${b.address})` : ""}
        </option>
      ))}
    </select>
  </div>
)}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {status} {progress > 0 ? `${progress}%` : ""}
            </p>
          </div>
        )}
      </div>

      {/* Branch Modal */}
      {/* {showBranchModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Select Your Branch
            </h3>
            <select
              className="w-full border p-2 rounded mb-4"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.address ? `(${b.address})` : ""}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBranchModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBranchSelect(subdomain, password)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default RestaurantLogin;
