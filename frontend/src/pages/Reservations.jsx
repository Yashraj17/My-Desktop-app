import React, { useState, useEffect } from "react";
import { Calendar, Users, Mail, Phone, Clock, Tag } from "lucide-react";
import ReservationForm from "../form/Reservation/ReservationForm";
import AssignTableModal from "../form/Reservation/AssignTableModal";

import Swal from "sweetalert2";
import {
  format,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingData, setEditingData] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"
  // Date filter states
  const [dateRangeType, setDateRangeType] = useState("currentYear");
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(endOfToday());
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Load reservations
  const loadReservations = async () => {
    try {
      const data = await window.api.getReservations();
      setReservations(data);
      setFiltered(data);
      console.log(data, "Reservations");
    } catch (error) {
      console.error("Failed to load reservations:", error);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // Filter by search
  useEffect(() => {
    const data = reservations.filter((res) => {
      const matchSearch =
        res.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.customer_phone?.includes(searchTerm) ||
        res.table_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.reservation_status
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchSearch;
    });

    setFiltered(data);
  }, [searchTerm, reservations]);

  // Save reservation
  const handleSave = async (reservation) => {
    try {
      let customerId = reservation.customer_id;

      if (!customerId && reservation.customer_name) {
        const newCustomer = await window.api.addCustomer({
          restaurant_id: reservation.restaurant_id || 1,
          name: reservation.customer_name,
          phone: reservation.phone || reservation.customer_phone,
          email: reservation.email,
        });
        customerId = newCustomer.id;
      }

      const payload = { ...reservation, customer_id: customerId };

      if (formMode === "add") {
        await window.api.addReservation(payload);
      } else {
        await window.api.updateReservation({ ...editingData, ...payload });
      }

      setDrawerVisible(false);
      setEditingData(null);

      // ✅ Reload all reservations to get updated data including new customer info
      await loadReservations();

      Swal.fire({
        icon: "success",
        title: formMode === "add" ? "Reservation added" : "Reservation updated",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error saving reservation",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // 🔹 Update date range automatically when dropdown changes
  useEffect(() => {
    switch (dateRangeType) {
      case "today":
        setStartDate(startOfToday());
        setEndDate(endOfToday());
        break;
      case "currentWeek":
        setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
        setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
        break;
      case "last7Days":
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
        break;
      case "currentMonth":
        setStartDate(startOfMonth(new Date()));
        setEndDate(endOfMonth(new Date()));
        break;
      case "currentYear":
        setStartDate(startOfYear(new Date()));
        setEndDate(endOfYear(new Date()));
        break;
      default:
        break;
    }
  }, [dateRangeType]);

  // 🔹 Filter reservations by search + date range
  useEffect(() => {
    const data = reservations.filter((res) => {
      const matchSearch =
        res.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.customer_phone?.includes(searchTerm) ||
        res.table_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.reservation_status
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const resDate = new Date(res.reservation_date_time);
      const matchDate =
        (!startDate || resDate >= startDate) &&
        (!endDate || resDate <= endDate);

      return matchSearch && matchDate;
    });

    setFiltered(data);
  }, [searchTerm, reservations, startDate, endDate]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Reservations</h2>
        <button
          onClick={() => {
            setFormMode("add");
            setEditingData(null);
            setDrawerVisible(true);
          }}
          className="px-4 py-2 bg-[#00006f] text-white rounded hover:bg-[#00005a]"
        >
          New Reservation
        </button>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Date Range Type */}
        <select
          value={dateRangeType}
          onChange={(e) => setDateRangeType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="today">Today</option>
          <option value="currentWeek">Current Week</option>
          <option value="last7Days">Last 7 Days</option>
          <option value="currentMonth">Current Month</option>
          <option value="currentYear">Current Year</option>
        </select>

        {/* Custom Date Pickers */}
        <input
          type="date"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Search by name, phone, table, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1 rounded ${
              viewMode === "cards" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded ${
              viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Reservation Display */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Header row */}
              <div className="flex justify-between items-center mb-2">
                <button className="flex items-center px-2 py-1 border rounded text-sm hover:bg-gray-100"  onClick={() => setSelectedReservation(res)}
>
                  🪑 Assign Table
                </button>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    res.reservation_status?.toLowerCase() === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : res.reservation_status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {res.reservation_status?.toUpperCase()}
                </span>
              </div>

              {/* Date + Guests */}
              <div className="flex justify-between items-center text-sm mb-3 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>
                    {new Date(res.reservation_date_time).toLocaleString([], {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{res.party_size} Guests</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Tag size={14} />
                  <span>{res.table_code || "Not Assigned"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {res.customer_name || "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span className="font-medium">
                    {res.email || "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span>{res.customer_phone || "—"}</span>
                </div>
              </div>

              {/* Special Request */}
              <div className="mt-2 text-sm text-gray-500 italic">
                {res.special_requests || "No Special Request"}
              </div>

              {/* Status dropdown */}
              <div className="mt-3">
                <select
                  value={res.reservation_status}
                  onChange={async (e) => {
                    try {
                      await window.api.updateReservation(
                        res.id, // ✅ pass ID separately
                        {
                          ...res,
                          reservation_status: e.target.value,
                        }
                      );

                      // 🔹 Refresh from DB so we always get latest data
                      await loadReservations();

                      Swal.fire({
                        icon: "success",
                        title: "Status updated",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1200,
                      });
                    } catch (err) {
                      console.error("Failed to update status:", err);
                      Swal.fire({
                        icon: "error",
                        title: "Update failed",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    }
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked_In">Checked In</option>
                  <option value="Pending">Pending</option>
                  <option value="No_Show">No Show</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No reservations found
            </div>
          )}
        </div>
      ) : (
        // List View
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date/Time</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Guests</th>
              <th className="p-2 border">Table</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res) => (
              <tr key={res.id} className="text-sm">
                <td className="p-2 border">
                  {new Date(res.reservation_date_time).toLocaleString()}
                </td>
                <td className="p-2 border">{res.customer_name || "—"}</td>
                <td className="p-2 border">{res.customer_phone || "—"}</td>
                <td className="p-2 border">{res.party_size}</td>
                <td className="p-2 border">
                  {res.table_code || "Not Assigned"}
                </td>
                <td className="p-2 border">{res.reservation_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Drawer Form */}
      {drawerVisible && (
        <ReservationForm
          formMode={formMode}
          initialData={editingData}
          onSave={handleSave}
          onCancel={() => setDrawerVisible(false)}
        />
      )}

      {/* Modal */}
     {selectedReservation && (
  <AssignTableModal
    reservation={selectedReservation}
    onClose={() => setSelectedReservation(null)}
    onAssigned={loadReservations}
  />
)}
    </div>
  );
}

export default Reservations;
