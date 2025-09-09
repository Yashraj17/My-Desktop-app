import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import ModifierGroupForm from "../../form/menu/ModifierGroupForm";

function ModifierGroupManagement() {
  const [modifierGroups, setModifierGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    const data = await window.api.getModifierGroups();
    setModifierGroups(data);
  };

  const handleSave = async (payload) => {
    try {
      if (formMode === "edit" && editData) {
        await window.api.updateModifierGroup(editData.id, payload);
        Swal.fire({ icon: "success", title: "Group updated", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      } else {
        await window.api.addModifierGroup(payload);
        Swal.fire({ icon: "success", title: "Group added", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      }
      setShowForm(false);
      setEditData(null);
      loadData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Error saving group" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this modifier group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await window.api.deleteModifierGroup(id);
      loadData();
      Swal.fire({ icon: "success", title: "Deleted!", text: "Modifier group deleted successfully.", toast: true, position: "top-end", timer: 2000 });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGroups = modifierGroups.filter((g) =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Modifier Groups</h1>
        <button
          onClick={() => { setFormMode("add"); setEditData(null); setShowForm(true); }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full text-sm"
        >
          Add Modifier Group
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-full px-3 py-2 mb-4 text-sm"
      />

      {/* Table */}
     <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-2">Group Name</th>
              <th className="px-4 py-2">Options</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <tr key={group.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{group.name}</td>
                  <td className="px-4 py-2">
                    {group.options && group.options.length > 0
                      ? group.options.map((opt, i) => (
                          <span key={i} className={`inline-block px-3 py-1 mr-2 mb-1 rounded-full text-xs font-medium ${
                            opt.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {opt.name}: AED{Number(opt.price).toFixed(2)}
                          </span>
                        ))
                      : "--"}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => { setFormMode("edit"); setEditData(group); setShowForm(true); }}
                      className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full border"
                    >
                      <Pencil size={14} className="mr-1" /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="inline-flex items-center px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full"
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="px-4 py-2 text-center text-gray-500">No modifier groups added</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ModifierGroupForm
          formMode={formMode}
          initialData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ModifierGroupManagement;
