import React, { useEffect, useRef, useState } from "react"; 
import { Pencil, Trash, PlusCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import "./styles.css";

function ModifierGroupManagement() {
  const [modifierGroups, setModifierGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [maxQty, setMaxQty] = useState(1);
  const [modifiers, setModifiers] = useState([{ name: "", price: 0, is_available: true }]);
  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dialogRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState("English");
  const [description, setDescription] = useState("");

  const loadData = async () => {
  const data = await window.api.getModifierGroups();

  const normalized = data.map(g => ({
    ...g,
    name: typeof g.name === "string"
      ? g.name
      : (() => {
          try {
            const parsed = JSON.parse(g.name);
            return parsed.en || "";
          } catch {
            return g.name?.en || "";
          }
        })()
  }));

  setModifierGroups(normalized);
};


  const handleSave = async () => {
    if (!groupName.trim()) return;

    const payload = {
      name: groupName,
      description:description,
      max_quantity: maxQty,
      options: modifiers,
    };

    try {
      if (formMode === "edit" && editId !== null) {
        //await window.api.updateModifierGroup(editId, payload);
         await window.api.updateModifierGroup(editId, {
            name: groupName,
            description:description,
            options: modifiers
           });

        Swal.fire({ icon: "success", title: "Group updated", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      } else {
        await window.api.addModifierGroup(payload);
        Swal.fire({ icon: "success", title: "Group added", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      }
      setTimeout(() => {
        setGroupName("");
        setMaxQty(1);
        setDescription("");
        setModifiers([{ name: "", price: 0, is_available: true }]);
        setEditId(null);
        dialogRef.current.close();
        loadData();
      }, 100);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Error saving group", toast: true, position: "top-end", showConfirmButton: false, timer: 3000 });
    }
  };

const handleEdit = (group) => {
  setFormMode("edit");
  setEditId(group.id);
  setGroupName(group.name);
  setDescription(group.description||"");
  setMaxQty(group.max_quantity || 1);

  // Ensure options is always an array of objects
  let parsedOptions = [];
  if (Array.isArray(group.options)) {
    parsedOptions = group.options;
  } else if (typeof group.options === "string") {
    try {
      parsedOptions = JSON.parse(group.options);
    } catch {
      parsedOptions = [];
    }
  }
  
  // Fill in defaults if any property is missing
  parsedOptions = parsedOptions.map(opt => ({
    name: opt.name || "",
    price: opt.price || 0,
    is_available: opt.is_available !== undefined ? opt.is_available : true
  }));

  setModifiers(parsedOptions.length ? parsedOptions : [{ name: "", price: 0, is_available: true }]);
  
  setTimeout(() => dialogRef.current?.showModal(), 0);
};


  const handleAddNew = () => {
    setFormMode("add");
    setGroupName("");
    setDescription("");
    setMaxQty(1);
    setModifiers([{ name: "", price: 0, is_available: true }]);
    setEditId(null);
    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const deleteGroup = async (id) => {
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
      try {
        await window.api.deleteModifierGroup(id);
        await loadData();
        Swal.fire({ icon: "success", title: "Deleted!", text: "Group deleted successfully.", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Failed", text: "Failed to delete group",error });
      }
    }
  };

  const handleModifierChange = (index, key, value) => {
    const updated = [...modifiers];
    updated[index][key] = value;
    setModifiers(updated);
  };

  const addModifier = () => {
    setModifiers([...modifiers, { name: "", price: 0, is_available: true }]);
  };

  const removeModifier = (index) => {
    const updated = modifiers.filter((_, i) => i !== index);
    setModifiers(updated);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGroups = modifierGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-800">Modifier Groups</h1>
      <button
        onClick={handleAddNew}
        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
      >
        Add Modifier Group
      </button>
    </div>

    {/* Search */}
    <input
      type="text"
      placeholder="Search your item category here"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />

    {/* Table */}
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
          <tr>
            <th className="px-4 py-2">Group Name</th>
            <th className="px-4 py-2">Options</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group) => (
            <tr key={group.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{group.name}</td>
              <td className="px-4 py-2">
                {Array.isArray(group.options) && group.options.length > 0 ? (
                  group.options.map((opt, i) => (
                    <span
                      key={opt.id || i}
                      className={`inline-block px-3 py-1 mr-2 mb-1 rounded-full text-xs font-medium ${
                        opt.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {String(opt?.name ?? "")}: AED{Number(opt?.price ?? 0).toFixed(2)}
                    </span>
                  ))
                ) : (
                  "--"
                )}
              </td>
              <td className="px-4 py-2 text-right space-x-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="inline-flex items-center px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border"
                >
                  <Pencil size={14} className="mr-1" /> Update
                </button>
                <button
                  onClick={() => deleteGroup(group.id)}
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

    {/* Dialog for adding/updating */}
    <dialog ref={dialogRef} className="p-0 rounded-md shadow-lg">
      <div className="p-6 bg-white rounded-md w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          {formMode === "add" ? "Add Modifier Group" : "Update Modifier Group"}
        </h3>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Select Language</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        {/* Modifier Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Modifier Name ({selectedLang})
          </label>
          <input
            type="text"
            placeholder="e.g., Cheese Options"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Description ({selectedLang})
          </label>
          <textarea
            placeholder="e.g., Additional toppings for your pizza."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Modifier Options */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Modifier Options</label>

          {modifiers.map((mod, index) => (
            <div key={index} className="p-3 border rounded-md mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Extra Cheese"
                  value={mod.name}
                  onChange={(e) => handleModifierChange(index, "name", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={mod.price}
                  onChange={(e) =>
                    handleModifierChange(index, "price", parseFloat(e.target.value))
                  }
                  className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeModifier(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XCircle size={18} />
                </button>
              </div>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={mod.is_available}
                  onChange={(e) =>
                    handleModifierChange(index, "is_available", e.target.checked)
                  }
                  className="mr-2"
                />
                Is Available
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addModifier}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <PlusCircle size={18} className="mr-1" /> Add Modifier Option
          </button>
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

export default ModifierGroupManagement;
