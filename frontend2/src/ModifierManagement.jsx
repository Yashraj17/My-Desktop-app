import React, { useEffect, useRef, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import "./styles.css";

function ModifierManagement() {
  const [modifiers, setModifiers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [modifier, setModifier] = useState({
    menu_item_id: "",
    modifier_group_id: "",
    is_required: false,
    allow_multiple_selection: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const dialogRef = useRef(null);

  const loadModifiers = async () => {
    try {
      const data = await window.api.getModifiers();
      setModifiers(data);
    } catch (error) {
      console.error("Error loading modifiers:", error);
    }
  };

  const loadMenuItems = async () => {
    const data = await window.api.getMenuItems();
    setMenuItems(data);
  };

  const loadModifierGroups = async () => {
    const data = await window.api.getModifierGroups();
    setModifierGroups(data);
  };

  const handleSave = async () => {
    try {
      if (formMode === "edit" && editId !== null) {
        await window.api.updateModifier(editId, modifier);
        Swal.fire({ icon: "success", title: "Modifier updated", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      } else {
        await window.api.addModifier(modifier);
        Swal.fire({ icon: "success", title: "Modifier added", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      }
      setTimeout(() => {
        setModifier({ menu_item_id: "", modifier_group_id: "", is_required: false, allow_multiple_selection: false });
        setEditId(null);
        dialogRef.current.close();
        loadModifiers();
      }, 100);
    } catch (error) {
      console.error("Error saving modifier:", error);
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Error saving modifier", toast: true, position: "top-end", showConfirmButton: false, timer: 3000 });
    }
  };

  const handleEdit = (mod) => {
    setFormMode("edit");
    setEditId(mod.id);
    setModifier({
      menu_item_id: menuItems.find(item => item.item_name === mod.item_name)?.id || "",
      modifier_group_id: modifierGroups.find(group => group.name === mod.modifier_group_name)?.id || "",
      is_required: mod.is_required,
      allow_multiple_selection: mod.allow_multiple_selection,
    });
    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const handleAddNew = () => {
    setFormMode("add");
    setModifier({ menu_item_id: "", modifier_group_id: "", is_required: false, allow_multiple_selection: false });
    setEditId(null);
    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const deleteModifier = async (id) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "Do you want to delete this modifier?", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!", cancelButtonText: "Cancel", reverseButtons: true });
    if (result.isConfirmed) {
      try {
        await window.api.deleteModifier(id);
        await loadModifiers();
        Swal.fire({ icon: "success", title: "Deleted!", text: "Modifier deleted successfully.", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      } catch (error) {
        console.error("Failed to delete modifier:", error);
        Swal.fire({ icon: "error", title: "Failed", text: "Failed to delete modifier" });
      }
    }
  };

  useEffect(() => {
    loadModifiers();
    loadMenuItems();
    loadModifierGroups();
  }, []);

  const filteredModifiers = modifiers.filter((mod) =>
    mod.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.modifier_group_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-800">Item Modifiers</h1>
      <button
        onClick={handleAddNew}
        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
      >
        Add Modifier
      </button>
    </div>

    {/* Search */}
    <input
      type="text"
      placeholder="Search modifiers"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />

    {/* Table */}
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
          <tr>
            <th className="px-4 py-2">Item Name</th>
            <th className="px-4 py-2">Modifier Group</th>
            <th className="px-4 py-2">Required</th>
            <th className="px-4 py-2">Allow Multiple</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredModifiers.map((mod) => (
            <tr key={mod.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{mod.item_name}</td>
              <td className="px-4 py-2">{mod.modifier_group_name}</td>
              <td className="px-4 py-2">{mod.is_required ? "Yes" : "No"}</td>
              <td className="px-4 py-2">{mod.allow_multiple_selection ? "Yes" : "No"}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <button
                  onClick={() => handleEdit(mod)}
                  className="inline-flex items-center px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border"
                >
                  <Pencil size={14} className="mr-1" /> Update
                </button>
                <button
                  onClick={() => deleteModifier(mod.id)}
                  className="inline-flex items-center px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  <Trash size={14} className="mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Modal */}
    <dialog ref={dialogRef} className="p-0 rounded-md shadow-lg">
      <div className="p-6 bg-white rounded-md w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          {formMode === "add" ? "Add Modifier" : "Update Modifier"}
        </h3>

        {/* Menu Item Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Menu Item Name</label>
          <select
            value={modifier.menu_item_id}
            onChange={(e) =>
              setModifier({ ...modifier, menu_item_id: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          >
            <option value="">Select Menu Item</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>

        {/* Modifier Group */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Modifier Group</label>
          <select
            value={modifier.modifier_group_id}
            onChange={(e) =>
              setModifier({ ...modifier, modifier_group_id: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          >
            <option value="">Select Modifier Group</option>
            {modifierGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Allow Multiple Selection */}
        <div className="mb-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={modifier.allow_multiple_selection}
              onChange={(e) =>
                setModifier({
                  ...modifier,
                  allow_multiple_selection: e.target.checked,
                })
              }
              className="mr-2"
            />
            Allow Multiple Selection
          </label>
        </div>

        {/* Is Required */}
        <div className="mb-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={modifier.is_required}
              onChange={(e) =>
                setModifier({
                  ...modifier,
                  is_required: e.target.checked,
                })
              }
              className="mr-2"
            />
            Is Required
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <form method="dialog">
            <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border">
              Cancel
            </button>
          </form>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-800 hover:bg-blue-900 text-white rounded-md"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </dialog>
  </div>
);

}

export default ModifierManagement;
