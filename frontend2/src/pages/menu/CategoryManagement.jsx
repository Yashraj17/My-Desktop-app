import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import CategoryForm from "../../form/menu/CategoryForm";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    const data = await window.api.getCategories();
    setCategories(data);
  };

  const handleSave = async ({ name, language }) => {
    try {
      if (formMode === "edit" && editData) {
        await window.api.updateCategory(editData.id, name, language);
        Swal.fire({ 
        icon: 'success',
        title: 'Category updated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500 });
      } else {
        await window.api.addCategory(name, language);
        Swal.fire({ 
        icon: 'success',
        title: 'Category added',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500});
      }
      setShowForm(false);
      setEditData(null);
      loadData();
    } catch (error) {
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

  const handleDelete = async (id) => {
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
   <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Item Categories</h1>
        <button
          onClick={() => {
            setFormMode("add");
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full text-sm"
        >
          Add Item Category
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm mb-4"
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
                      onClick={() => {
                        setFormMode("edit");
                        setEditData(cat);
                        setShowForm(true);
                      }}
                      className="inline-flex items-center px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full border"
                    >
                      <Pencil size={14} className="mr-1" /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="inline-flex items-center px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-full"
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No categories added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show Modal */}
      {showForm && (
        <CategoryForm
          formMode={formMode}
          initialData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default CategoryManagement;
