import { useEffect, useState, useRef } from "react";
import {
  List,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Draggable from "react-draggable";

export default function Tables() {
  const [viewMode, setViewMode] = useState("list");
  const [selectedArea, setSelectedArea] = useState("all");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editTable, setEditTable] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    loadTables();
    loadAreas();
  }, []);

  const loadTables = async (areaId = null) => {
    try {
      const data = await window.api.getTable(areaId);
      const processedData = data.map((table) => ({
        ...table,
        area_id: parseFloat(table.area_id),
        seating_capacity: parseFloat(table.seating_capacity),
      }));
      console.log("tables list...",processedData)
      setTables(processedData);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  const loadAreas = async () => {
    try {
      const data = await window.api.getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
    if (areaId === "all") {
      loadTables(null);
    } else {
      loadTables(parseFloat(areaId));
    }
  };

  const handleFormSaved = () => {
    setIsAddTableOpen(false);
    setEditTable(null);
    loadTables(selectedArea === "all" ? null : parseFloat(selectedArea));
  };

  const handleEditTable = (table) => {
    setEditTable(table);
    setIsAddTableOpen(true);
  };

  const applyFilters = () => {
    let result = tables;
    if (selectedArea !== "all") {
      result = result.filter((table) => table.area_id === parseFloat(selectedArea));
    }
    if (availabilityFilter !== "all") {
      result = result.filter(
        (table) => table.available_status?.toLowerCase() === availabilityFilter.toLowerCase()
      );
    }
    return result;
  };

  const filteredTables = applyFilters();

  const groupedTables = areas.map((area) => ({
    ...area,
    tables: filteredTables.filter((table) => table.area_id === area.id),
  }));

  // Status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "available": return "border-green-600 text-green-600";
      case "running": return "border-blue-600 text-blue-600";
      case "reserved": return "border-red-600 text-red-600";
      default: return "border-gray-600 text-gray-600";
    }
  };

  const getTableBg = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "running": return "bg-blue-100 text-blue-700";
      case "reserved": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

const handlePositionChange = async (id, x, y) => {
  // update UI state immediately
  setTables((prev) =>
    prev.map((t) => (t.id === id ? { ...t, x, y } : t))
  );

  try {
    // persist in DB (only updating position)
     await window.api.updateTablePosition(id, { x, y });
    console.log(`✅ Table ${id} position saved: (${x}, ${y})`);
  } catch (error) {
    console.error("❌ Failed to save table position:", error);
  }
};

  const TableCard = ({ table }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-80">
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1.5 rounded-md font-semibold text-lg ${getTableBg(table.available_status)}`}>
          {table.table_code}
        </div>
        <div className="text-right">
          <div className="text-gray-600 text-sm mb-1">{table.seating_capacity} Seat(s)</div>
          <div className={`inline-block border rounded px-2 py-0.5 text-xs font-semibold ${getStatusBadge(table.available_status)}`}>
            {table.available_status}
          </div>
          <div className="font-semibold text-lg text-gray-900 mt-1">{table?.kot_count} KOT</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-md px-1 py-2 hover:bg-gray-50 bg-transparent">Show Order</Button>
        <Button className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-md py-2 hover:bg-gray-50 bg-transparent">New KOT</Button>
        <Button className="p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 bg-transparent" onClick={() => handleEditTable(table)}>
          <Pencil className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );

  const TableGridCardCustomizeOLD = ({ table }) => {
  const nodeRef = useRef(null);

  return (
   <Draggable
  nodeRef={nodeRef}
  defaultPosition={{ x: table.x|| 0, y: table.y || 0 }}
  onStop={(e, data) => handlePositionChange(table.id, data.x, data.y)}
>
<div
  ref={nodeRef}
  className="bg-white border border-gray-200 rounded-lg shadow-md cursor-move 
             w-[120px] h-[120px] flex flex-col items-center justify-center 
             p-2 space-y-1 mb-4 mr-4"
>

    {/* Table Code */}
    <div
      className={`px-3 py-1 rounded-md font-semibold text-base ${getTableBg(
        table.available_status
      )}`}
    >
      {table.table_code}
    </div>

    {/* Seats */}
    <div className="text-xs text-gray-600">{table.seating_capacity} Seat(s)</div>

    {/* KOT */}
    <div className="font-semibold text-sm text-gray-900">{table?.kot_count} KOT</div>

    {/* Status */}
    <div
      className={`inline-block border rounded px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(
        table.available_status
      )}`}
    >
      {table.available_status}
    </div>
  </div>
</Draggable>

  );
};

 // Shape selection based on seating_capacity
const getShapeClass = (capacity) => {
  if (capacity <= 2) return "rounded-full w-[140px] h-[140px]"; // Circle
  if (capacity > 2 && capacity <= 4) return "w-[140px] h-[140px]"; // Square
  if (capacity > 4 && capacity <= 8) return "w-[200px] h-[140px]"; // Rectangle
  return "w-[240px] h-[140px]"; // Big Rectangle
};




const TableGridCardCustomize = ({ table }) => {
  const nodeRef = useRef(null);

  return (
   <Draggable
  nodeRef={nodeRef}
  defaultPosition={{ x: table.x|| 0, y: table.y || 0 }}
  onStop={(e, data) => handlePositionChange(table.id, data.x, data.y)}
>
<div
  ref={nodeRef}
   className={`border border-gray-300 shadow-md cursor-move 
          flex flex-col items-center justify-center p-2 space-y-1 mb-4 mr-4
          ${getShapeClass(table.seating_capacity)} ${getTableBg(table.available_status)}`}
>

    {/* Table Code */}
    <div
      className={`px-3 py-1 rounded-md font-semibold text-base ${getTableBg(
        table.available_status
      )}`}
    >
      {table.table_code}
    </div>

    {/* Seats */}
    <div className="text-xs text-gray-600">{table.seating_capacity} Seat(s)</div>

    {/* KOT */}
    <div className="font-semibold text-sm text-gray-900">{table?.kot_count} KOT</div>

    {/* Status */}
    <div
      className={`inline-block border rounded px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(
        table.available_status
      )}`}
    >
      {table.available_status}
    </div>
  </div>
</Draggable>

  );
};




// ✅ TableGridCard Component
const TableGridCard = ({ table }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
    {/* Table Code with background color */}
    <div
      className={`inline-block px-3 py-1.5 rounded-md font-semibold text-lg mb-3 ${getTableBg(
        table.available_status
      )}`}
    >
      {table.table_code}
    </div>

    <div className="text-sm text-gray-600 mb-1">
      {table.seating_capacity} Seat(s)
    </div>

    <div className="font-semibold text-lg text-gray-900 mb-2">
      {table?.kot_count} KOT
    </div>

    {/* Status badge */}
    <div
      className={`inline-block border rounded px-2 py-0.5 text-xs font-semibold ${getStatusBadge(
        table.available_status
      )}`}
    >
      {table.available_status}
    </div>
  </div>
);


  const TableListRow = ({ table }) => (
    <div className={`border border-gray-200 rounded-lg p-6 text-center shadow-sm w-32 transform transition-transform duration-200 hover:scale-105 ${getTableBg(table.available_status)}`}>
      <div className="font-semibold text-lg mb-2">{table.table_code}</div>
      <div className="text-sm text-gray-600 mb-1">{table.seating_capacity} Seat(s)</div>
      <div className="font-semibold text-lg text-gray-900 mb-2">{table?.kot_count} KOT</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold text-gray-800">Table View</h1>
          <Button onClick={() => setIsAddTableOpen(true)} className="bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white">Add Table</Button>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-white border border-gray-200 rounded-lg p-1">
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white" : "text-gray-600"}><List className="h-4 w-4 mr-2" />List</Button>
              <Button variant={viewMode === "customize_grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("customize_grid")} className={viewMode === "customize_grid" ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white" : "text-gray-600"}><Grid3X3 className="h-4 w-4 mr-2" />Customize Grid</Button>
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white" : "text-gray-600"}><Grid3X3 className="h-4 w-4 mr-2" />Grid</Button>
              <Button variant={viewMode === "layout" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("layout")} className={viewMode === "layout" ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white" : "text-gray-600"}><LayoutGrid className="h-4 w-4 mr-2" />Layout</Button>
            </div>
            <div className="relative inline-block">
              <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="appearance-none border border-gray-300 rounded-md pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white">
                <option value="all">Show All</option>
                <option value="available">🟢 Available</option>
                <option value="running">🔵 Running</option>
                <option value="reserved">🔴 Reserved</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Area Tabs & Tables */}
      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <Button variant={selectedArea === "all" ? "default" : "ghost"} onClick={() => handleAreaChange("all")} className={selectedArea === "all" ? "bg-blue-200 text-blue-800 hover:bg-blue-200" : "text-gray-600"}>All Areas</Button>
          {areas.map((area) => (
            <Button key={area.id} variant={selectedArea === area.id.toString() ? "default" : "ghost"} onClick={() => handleAreaChange(area.id.toString())} className={selectedArea === area.id.toString() ? "bg-blue-200 text-blue-800 hover:bg-blue-200" : "text-gray-600"}>{area.area_name}</Button>
          ))}
        </div>

       {groupedTables.map(
  (group) =>
    group.tables.length > 0 && (
      <div key={group.id} className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            {group.area_name}
          </h2>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            {group.tables.length} Table
            {group.tables.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid / custom grid / layout / list */}
        {viewMode === "customize_grid" ? (
          <div className="relative w-full min-h-[300px] border border-gray-300 bg-gray-50 p-4 mb-8 overflow-hidden">
            {group.tables.map((table) => (
              <TableGridCardCustomize key={table.id} table={{ ...table }} />
            ))}
          </div>
        ) : viewMode === "layout" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {group.tables.map((table) => (
              <TableListRow key={table.id} table={table} />
            ))}
          </div>
        ) : viewMode === "grid" ? (   // 👈 new view added
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {group.tables.map((table) => (
              <TableGridCard key={table.id} table={table} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.tables.map((table) => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        )}
      </div>
    )
)}

      </div>

      {/* Status Legend */}
      <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-green-500 rounded-full"></div><span className="text-gray-700 font-medium">Available</span></div>
          <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-blue-500 rounded-full"></div><span className="text-gray-700 font-medium">Running</span></div>
          <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-red-500 rounded-full"></div><span className="text-gray-700 font-medium">Reserved</span></div>
        </div>
      </div>

      {/* Add/Edit Table Drawer */}
      <AddTableDrawer isOpen={isAddTableOpen} onClose={() => { setIsAddTableOpen(false); setEditTable(null); }} onSaved={handleFormSaved} table={editTable} areas={areas} />
    </div>
  );
}

// Add/Edit Drawer
function AddTableDrawer({ isOpen, onClose, onSaved, table, areas }) {
  const [tableCode, setTableCode] = useState(table?.table_code || "");
  const [seatingCapacity, setSeatingCapacity] = useState(table?.seating_capacity?.toString() || "");
  const [selectedArea, setSelectedArea] = useState(table?.area_id?.toString() || "");
  const [status, setStatus] = useState(table?.status === "inactive" ? "inactive" : "active");

  useEffect(() => {
    if (table) {
      setTableCode(table.table_code || "");
      setSeatingCapacity(table.seating_capacity?.toString() || "");
      setSelectedArea(table.area_id?.toString() || "");
      setStatus(table.status === "inactive" ? "inactive" : "active");
    } else {
      setTableCode("");
      setSeatingCapacity("");
      setSelectedArea("");
      setStatus("active");
    }
  }, [table, isOpen]);

  const handleCancel = () => { setTableCode(""); setSeatingCapacity(""); setSelectedArea(""); setStatus("active"); onClose(); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { area_id: parseFloat(selectedArea), table_code: tableCode.trim(), seating_capacity: parseFloat(seatingCapacity), status, available_status: "available", isSync: 0 };
      if (table?.id) await window.api.updateTable(table.id, payload);
      else await window.api.addTable(payload);
      Swal.fire({ icon: "success", title: table?.id ? "Table updated" : "Table added", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      onSaved(); onClose?.();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Error saving table" });
    }
  };

  return (
    <>
      {isOpen && <div onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out w-full sm:w-[30%] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{table ? "Edit Table" : "Add Table"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1"><X className="h-5 w-5" /></Button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto h-full pb-24">
          {/* Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Choose Area</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} required>
                <option value="">-- Select Area --</option>
                {areas.map((area) => <option key={area.id} value={area.id}>{area.area_name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Table Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Table Code</label>
            <input type="text" placeholder="e.g. T01" value={tableCode} onChange={(e) => setTableCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          {/* Seating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Seating Capacity</label>
            <input type="number" min={1} value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit">{table ? "Update" : "Save"}</Button>
          </div>
        </form>
      </div>
    </>
  );
}
