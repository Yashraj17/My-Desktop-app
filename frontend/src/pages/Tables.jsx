import { useEffect, useState } from "react";
import {
  List,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  Edit,
  Clock,
  Users,
  CheckSquare,
  DollarSign,
  FileText,
  Eye,
  CreditCard,
  X,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Tables() {
  const [viewMode, setViewMode] = useState("list");
  const [selectedArea, setSelectedArea] = useState("all");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editTable, setEditTable] = useState(null);

  // Load tables and areas on component mount
  useEffect(() => {
    loadTables();
    loadAreas();
  }, []);

  const loadTables = async (areaId = null) => {
    try {
      const data = await window.api.getTable(areaId);
      console.log("hello this is data of get Table",data)
      // Convert string numbers to actual numbers
      const processedData = data.map(table => ({
        ...table,
        area_id: parseFloat(table.area_id),
        seating_capacity: parseFloat(table.seating_capacity)
      }));
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
      loadTables(parseFloat(areaId)); // Convert to number for comparison
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

  const filteredTables =
    selectedArea === "all"
      ? tables
      : tables.filter((table) => table.area_id === parseFloat(selectedArea));

  // Group tables by area
  const groupedTables = areas.map((area) => ({
    ...area,
    tables: filteredTables.filter((table) => table.area_id === area.id),
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600";
      case "running":
        return "text-blue-600";
      case "reserved":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const TableCard = ({ table }) => (
  
     <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-80">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Table Code */}
        <div className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md font-semibold text-lg">{table.table_code}</div>

        {/* Right side info */}
        <div className="text-right">
          <div className="text-gray-600 text-sm mb-1">{table.seating_capacity} Seat(s)</div>
          <div className="font-semibold text-lg text-gray-900">{table?.kot_count} KOT</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-md px-1 py-2  hover:bg-gray-50 bg-transparent">
          Show Order
        </Button>
        <Button className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-md py-2 hover:bg-gray-50 bg-transparent">
          New KOT
        </Button>
        <Button className="p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 bg-transparent">
          <Pencil className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );

  const TableGridCard = ({ table }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <div className="text-xl font-bold text-gray-800 mb-2">
        {table.table_code}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        {table.seating_capacity} Seat(s)
      </div>
       <div className="text-sm text-gray-600 mb-1">
        KOT
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold text-gray-800">Table View</h1>
          <Button
            onClick={() => setIsAddTableOpen(true)}
            className="bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white"
          >
            Add Table
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-white border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white"
                    : "text-gray-600"
                }
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white"
                    : "text-gray-600"
                }
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button 
              variant={viewMode === "layout" ? "default" : "ghost"}
              size="sm" 
              onClick={() => setViewMode("layout")}
              className={
                  viewMode === "layout"
                    ? "bg-[#000080] cursor-pointer hover:bg-[#000080] dark:text-white"
                    : "text-gray-600"
                }
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Layout
              </Button>
            </div>

            <Button variant="outline" className="text-gray-600 bg-transparent">
              Filter by Availability
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 ">
        {/* Area Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={selectedArea === "all" ? "default" : "ghost"}
            onClick={() => handleAreaChange("all")}
            className={
              selectedArea === "all"
                ? "bg-blue-200 text-blue-800 hover:bg-blue-200"
                : "text-gray-600"
            }
          >
            All Areas
          </Button>
          {areas.map((area) => (
            <Button
              key={area.id}
              variant={selectedArea === area.id.toString() ? "default" : "ghost"}
              onClick={() => handleAreaChange(area.id.toString())}
              className={
                selectedArea === area.id.toString()
                  ? "bg-blue-200 text-blue-800 hover:bg-blue-200"
                  : "text-gray-600 bg" 
              }
            >
              {area.area_name}
            </Button>
          ))}
        </div>

        {/* Tables by Area */}
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

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  }
                >
                  {group.tables.map((table) =>
                    viewMode === "grid" ? (
                      <TableGridCard key={table.id} table={table} />
                    ) : (
                      <TableCard key={table.id} table={table} />
                    )
                  )}
                </div>
              </div>
            )
        )}

        {/* Status Legend */}
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Running</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Reserved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Table Drawer */}
      <AddTableDrawer
        isOpen={isAddTableOpen}
        onClose={() => {
          setIsAddTableOpen(false);
          setEditTable(null);
        }}
        onSaved={handleFormSaved}
        table={editTable}
        areas={areas}
      />
    </div>
  );
}

function AddTableDrawer({ isOpen, onClose, onSaved, table, areas }) {
  const [tableCode, setTableCode] = useState(table?.table_code || "");
  const [seatingCapacity, setSeatingCapacity] = useState(
    table?.seating_capacity?.toString() || ""
  );
  const [selectedArea, setSelectedArea] = useState(table?.area_id?.toString() || "");
  const [status, setStatus] = useState(
    table?.status === "inactive" ? "inactive" : "active"
  );

  // Reset form when table prop changes
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

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      const payload = {
        area_id: parseFloat(selectedArea),
        table_code: tableCode,
        seating_capacity: parseFloat(seatingCapacity),
        status: status,
        available_status: "available",
        isSink: 0,
      };

      if (table?.id) {
        await window.api.updateTable(table.id, payload);
      } else {
        await window.api.addTable(payload);
      }

      onSaved();
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };

  const handleCancel = () => {
    setTableCode("");
    setSeatingCapacity("");
    setSelectedArea("");
    setStatus("active");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {table ? "Edit Table" : "Add Table"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto h-full pb-24">
          {/* Choose Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Choose Area
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                required
              >
                <option value="">-- Select Area --</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.area_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Table Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Table Code
            </label>
            <input
              type="text"
              placeholder="e.g. T01"
              value={tableCode}
              onChange={(e) => setTableCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Seating Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Seating Capacity
            </label>
            <input
              type="number"
              placeholder="Enter number of seats (e.g., 4)"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={status === "active" ? "default" : "outline"}
                onClick={() => setStatus("active")}
                className={
                  status === "active"
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : "text-gray-700 border-gray-300"
                }
              >
                Active
              </Button>
              <Button
                type="button"
                variant={status === "inactive" ? "default" : "outline"}
                onClick={() => setStatus("inactive")}
                className={
                  status === "inactive"
                    ? "bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
                    : "text-gray-700 border-gray-300"
                }
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* Form buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="text-gray-700 border-gray-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}