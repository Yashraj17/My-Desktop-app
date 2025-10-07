import React, { useState, useEffect } from "react";

function ReservationForm({ formMode, initialData, onSave, onCancel }) {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [tableCode, setTableCode] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [reservationStatus, setStatus] = useState("confirmed");
  const [slotType, setSlotType] = useState("Lunch");
  const [timeSlots, setTimeSlots] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [tableRequired, setTableRequired] = useState(false);
  const [bookedReservations, setBookedReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Load initial data
  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setCustomerName(initialData.customer_name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setGuestCount(initialData.party_size || 1);
      setTableCode(initialData.table_code || "");
      setReservationTime(initialData.reservation_date_time || "");
      setSpecialRequest(initialData.special_requests || "");
      setStatus(initialData.reservation_status || "confirmed");
      setSelectedCustomerId(initialData.customer_id || null);
    } else {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      setCustomerName("");
      setEmail("");
      setPhone("");
      setGuestCount(1);
      setTableCode("");
      setReservationTime(today + "T12:00"); // default to today + a safe time
      setSpecialRequest("");
      setStatus("confirmed");
      setSelectedCustomerId(null);
    }
  }, [formMode, initialData]);

  // Search customers while typing
  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerName.trim()) {
        const results = await window.api.getCustomer(customerName);
        setCustomerList(results);
      } else {
        setCustomerList([]);
      }
    };
    fetchCustomers();
  }, [customerName]);

  // Load slots when date or slotType changes
  useEffect(() => {
    if (!reservationTime) return;

    const day = new Date(reservationTime).toLocaleString("en-US", {
      weekday: "long",
    });
    console.log("......", day, slotType);
    window.api
      .getReservationSettings(day, slotType)
      .then((settings) => {
        let slots = [];
        settings.forEach((s) => {
          slots = [...slots, ...generateTimeSlots(s)];
        });
        setTimeSlots(slots);
        console.log("slots...", slots);
      })
      .catch((err) => {
        console.error("Error fetching reservation settings:", err);
        setTimeSlots([]);
      });
  }, [reservationTime, slotType]); // <- include slotType in deps

  function generateTimeSlots(setting) {
    const slots = [];
    const [startH, startM] = setting.time_slot_start.split(":").map(Number);
    const [endH, endM] = setting.time_slot_end.split(":").map(Number);

    let start = new Date(2000, 0, 1, startH, startM);
    const end = new Date(2000, 0, 1, endH, endM);
    const diff = setting.time_slot_difference || 60;

    while (start < end) {
      slots.push(
        start.toTimeString().slice(0, 5) // "HH:MM"
      );
      start = new Date(start.getTime() + diff * 60000);
    }

    return slots;
  }

  useEffect(() => {
    async function fetchRestaurant() {
      const results = await window.api.getRestaurants();
      if (results && results.length > 0) {
        const data = results[0];
        setRestaurant(data);
        console.log("getRestaurants...", results);
        setStatus(data.default_table_reservation_status);
        setTableRequired(data.table_required === 1);
      }
    }
    fetchRestaurant();
  }, []);

  useEffect(() => {
    if (!tableRequired || !reservationTime) return;

    const loadTables = async () => {
      try {
        const data = await window.api.getTable();
        const booked = await window.api.getReservationsByDateTime(
          reservationTime
        );
        setBookedReservations(booked);

        const unavailable = booked.map((r) => parseInt(r.table_id, 10));

        const processedData = data.map((table) => ({
          ...table,
          id: parseInt(table.id, 10),
          area_id: parseInt(table.area_id, 10),
          seating_capacity: parseInt(table.seating_capacity, 10),
          isAvailable:
            !unavailable.includes(parseInt(table.id, 10)) ||
            table.table_code === tableCode,
        }));

        setTables(processedData.filter((t) => t.isAvailable));
      } catch (error) {
        console.error("Error loading tables:", error);
        setTables([]);
      }
    };

    loadTables();
  }, [reservationTime, tableRequired]);

  const handleSelectCustomer = (customer) => {
    setCustomerName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setSelectedCustomerId(customer.id);
    setCustomerList([]);
  };

  const handleSubmitOLD = () => {
    if (!customerName.trim() || !reservationTime) return;

    onSave({
      customer_id: selectedCustomerId,
      customer_name: customerName,
      email,
      customer_phone: phone,
      party_size: guestCount,
      table_code: tableCode,
      reservation_date_time: reservationTime,
      special_requests: specialRequest,
      reservation_status: reservationStatus,
      reservation_slot_type: slotType,
      isSync: false,
    });
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !reservationTime) return;

    const selectedTable = tables.find((t) => t.table_code === tableCode);

    onSave({
      customer_id: selectedCustomerId,
      customer_name: customerName,
      email,
      customer_phone: phone,
      party_size: guestCount,
      table_code: tableCode,
      table_id: selectedTable ? selectedTable.id : null,
      reservation_date_time: reservationTime,
      special_requests: specialRequest,
      reservation_status: reservationStatus,
      reservation_slot_type: slotType,
      isSync: false,
    });
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>

      {/* Drawer */}
      <div className="relative bg-white w-full sm:w-[35%] h-full p-6 overflow-y-auto shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {formMode === "add" ? "New Reservation" : "Edit Reservation"}
        </h3>

        {/* Date + Guests + Slot */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            type="date"
            value={reservationTime.split("T")[0] || ""}
            onChange={(e) =>
              setReservationTime(
                e.target.value +
                  "T" +
                  (reservationTime.split("T")[1] || "12:00")
              )
            }
            className="border rounded px-3 py-2 w-full"
          />
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Guests
              </option>
            ))}
          </select>
          <select
            value={slotType}
            onChange={(e) => setSlotType(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Time Slot
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => {
                const datePart = reservationTime
                  ? reservationTime.split("T")[0]
                  : new Date().toISOString().split("T")[0];

                const isActive = reservationTime.endsWith(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    className={`px-3 py-2 rounded border ${
                      isActive
                        ? "bg-[#00006f] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setReservationTime(datePart + "T" + slot)}
                  >
                    {slot}
                  </button>
                );
              })
            ) : (
              <p className="col-span-4 text-gray-500 text-sm">
                No slots available for this day
              </p>
            )}
          </div>
        </div>

        {/* Special Request */}
        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          placeholder="Any special request?"
          className="w-full border rounded p-3 mb-4"
        />

        {/* Customer Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setSelectedCustomerId(null);
            }}
            placeholder="Customer Name"
            className="border rounded p-2 w-full"
          />
          {customerList.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10">
              {customerList.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleSelectCustomer(c)}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {c.name} - {c.phone || "—"} {c.email ? `(${c.email})` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="border rounded p-2 w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="border rounded p-2 w-full"
          />
        </div>

        {/* ✅ Show this only if table_required = 1 */}
        {tableRequired && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Table
            </label>
            <select
              value={tableCode}
              onChange={(e) => setTableCode(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">-- Select Table --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.table_code}>
                  {table.table_code} ({table.seating_capacity} seats)
                </option>
              ))}
            </select>

            {tables.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No available tables for this time slot.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#00006f] text-white rounded hover:bg-[#00005a]"
          >
            {formMode === "add" ? "Add Reservation" : "Update Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;
