import React, { useEffect, useState } from "react";
import { Calendar, Users, Mail, Phone, Clock, Tag } from "lucide-react";

function AssignTableModal({ reservation, onClose, onAssigned }) {
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);
  const [bookedReservations, setBookedReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load areas
  const loadAreas = async () => {
    try {
      const data = await window.api.getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  // Load tables with availability check
  const loadTables = async () => {
    try {
      const data = await window.api.getTable();
      const booked = await window.api.getReservationsByDateTime(
        reservation.reservation_date_time
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
          table.id === reservation.table_id,
        isAssigned: table.id === reservation.table_id,
      }));

      setTables(processedData);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadAreas();
      await loadTables();
      setLoading(false);
    };
    fetchData();
  }, [reservation]);

  const handleAssign = async (table) => {
    if (!table.isAvailable) return;
    await window.api.updateReservation(reservation.id, {
      ...reservation,
      table_id: table.id,
      table_code: table.table_code,
    });
    onAssigned();
    onClose();
  };

  if (loading) return <div>Loading tables...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-6">Available Tables</h3>
  {/* Reserved list */}
        <div className="mt-8 border-t pt-4">
          <h4 className="text-lg font-medium mb-3">
            Reservations:{" "}
            <div className="flex items-center space-x-1 text-gray-500">
                  <Clock size={14} />
                    {new Date(reservation.reservation_date_time).toLocaleString([], {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
          </h4>
          {bookedReservations.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {bookedReservations.map((r) => (
                <li key={r.id}>
                  {r.table_code} — {r.customer_name} ({r.party_size} people)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No table is reserved.</p>
          )}
        </div>
        {/* Area-wise grouping */}
        {areas.map((area) => {
          const areaTables = tables.filter((t) => t.area_id === area.id);
          return (
            <div key={area.id} className="mb-8">
              {/* Area Header */}
              <div className="flex items-center mb-4 space-x-2">
  <h4 className="text-lg font-medium">{area.area_name}</h4>
  <span className="px-2 py-1 text-sm bg-gray-100 rounded-md border">
    {areaTables.length} Table{areaTables.length > 1 ? "s" : ""}
  </span>
</div>


              {/* Grid of tables */}
              <div className="grid grid-cols-5 gap-4">
                {areaTables.map((table) => (
                  <button
                    key={table.id}
                    className={`p-4 border rounded-lg shadow-sm text-center transition ${
                      table.isAssigned
                        ? "bg-blue-100 border-blue-400"
                        : table.isAvailable
                        ? "bg-green-50 hover:bg-green-100 border-green-300"
                        : "bg-red-100 border-red-300 cursor-not-allowed"
                    }`}
                    disabled={!table.isAvailable && !table.isAssigned}
                    onClick={() => handleAssign(table)}
                  >
                    <div
                      className={`text-lg font-semibold ${
                        table.isAssigned ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {table.table_code || "—"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {table.seating_capacity} Seat(s)
                    </div>
                    {table.isAssigned && (
                      <div className="mt-1 text-xs text-blue-700 font-medium">
                        Assigned
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

      

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignTableModal;
