import React, { useEffect, useRef, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import "./styles.css";
import Swal from 'sweetalert2';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const dialogRef = useRef(null);
  const [language, setLanguage] = useState('English');

  const loadData = async () => {
    const data = await window.api.getCategories();
    setCategories(data);
    console.log(data)
  };

  
  const handleSave = async () => {
  if (!categoryName.trim()) return;

  try {
    if (formMode === "edit" && editId !== null) {
      await window.api.updateCategory(editId, categoryName);
      Swal.fire({
        icon: 'success',
        title: 'Category updated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      await window.api.addCategory(categoryName);
      Swal.fire({
        icon: 'success',
        title: 'Category added',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    }

    // UI reset with slight delay
    setTimeout(() => {
      setCategoryName("");
      setEditId(null);
      dialogRef.current.close();
      loadData();
    }, 100);

  } catch (error) {
    console.error("Error saving category:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error saving category',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
};

  const handleEdit = (cat) => {
    setFormMode("edit");
    setEditId(cat.id);
    setCategoryName(cat.category_name);

    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const handleAddNew = () => {
    setFormMode("add");
    setCategoryName("");
    setEditId(null);

    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

 
 const deleteCategory = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this category?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await window.api.deleteCategory(id);
      await loadData();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Item category deleted successfully.',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to delete category',
      });
    }
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-800">Item Categories</h1>
      <button
        onClick={handleAddNew}
        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
      >
        Add Item Category
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
            <th className="px-4 py-2">Item Category</th>
            <th className="px-4 py-2">Menu Items</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{cat.category_name}</td>
                <td className="px-4 py-2">{cat.items_count ?? 0} Item(s)</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="inline-flex items-center px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border"
                  >
                    <Pencil size={14} className="mr-1" /> Update
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="inline-flex items-center px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    <Trash size={14} className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-2 text-center text-gray-500"
              >
                No Item Category Added
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Modal */}
 <dialog
      id="categoryModal"
      ref={dialogRef}
      className="modal-dialog bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {formMode === "add" ? "Add New Category" : "Update Category"}
        </h3>

        {/* Language Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        {/* Category Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Item Category Name ({language})
          </label>
          <input
            type="text"
            placeholder="e.g., Desserts"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <form method="dialog">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              Cancel
            </button>
          </form>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-[#00006f] rounded hover:bg-[#00005a] dark:bg-blue-500 dark:hover:bg-[#00006f]"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </dialog>

  </div>
);



}

export default CategoryManagement;
