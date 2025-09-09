import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import foodImage from "/images/food.svg";
import MenuForm from "../../form/menu/MenuForm";
import MenuItemForm from "../../form/menu/MenuItemForm";
import CategoryForm from "../../form/menu/CategoryForm";

function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // modal states
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    const data = await window.api.getMenusWithItems();
    const cats = await window.api.getCategories();

    const menusWithPaths = await Promise.all(
      data.map(async (menu) => {
        const itemsWithPaths = await Promise.all(
          menu.items.map(async (item) => ({
            ...item,
            imagePath: item.image
              ? await window.api.getUploadsPath(item.image)
              : null,
          }))
        );
        return { ...menu, items: itemsWithPaths };
      })
    );

    setMenus(menusWithPaths);
    setCategories(cats);
    if (data.length > 0 && !activeMenuId) setActiveMenuId(data[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  const filteredItems = activeMenu
    ? activeMenu.items.filter((it) =>
        it.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // --- Handlers ---
  const handleDeleteMenu = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this menu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await window.api.deleteMenu(id);
      loadData();
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500 });
    }
  };

  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this menu item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await window.api.deleteMenuItem(id);
      loadData();
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500 });
    }
  };

  const handleSaveItem = async (payload) => {
    try {
      if (formMode === "edit" && editData) {
        await window.api.updateMenuItem(editData.id, payload);
        Swal.fire({
          icon: "success",
          title: "Menu item updated",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await window.api.addMenuItem(payload);
        Swal.fire({
          icon: "success",
          title: "Menu item added",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowItemForm(false);
      setEditData(null);
      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving menu item",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Menus</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800"
            onClick={() => {
              setFormMode("add");
              setEditData(null);
              setShowMenuForm(true);
            }}
          >
            Add Menu
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search menu items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-full"
      />

      {/* Menu Tabs */}

      <div className="flex flex-wrap gap-2 mb-4">
        {menus.map((menu) => (
          <button
            key={menu.id}
            className={`flex items-center gap-2 px-3 py-2 min-w-[150px] rounded-full border text-sm transition ${
              menu.id === activeMenuId
                ? "bg-blue-900 text-white"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActiveMenuId(menu.id)}
          >
            <span className="text-base">📋</span>
            <div className="text-left leading-tight">
              <strong className="text-sm">{menu.name}</strong>
              <br />
              <small
                className={
                  menu.id === activeMenuId
                    ? "text-white text-xs"
                    : "text-gray-500 text-xs"
                }
              >
                {menu.items.length} Item(s)
              </small>
            </div>
          </button>
        ))}
      </div>

      {/* Active Menu */}
      {activeMenu && (
        <>
          <div className="flex items-center justify-start space-x-2 mb-4">
            <h3 className="text-xl font-semibold">{activeMenu.name}</h3>
            <button
              className="px-3 py-1 text-xs bg-gray-100 border rounded-full"
              onClick={() => {
                setFormMode("edit");
                setEditData(activeMenu);
                setShowMenuForm(true);
              }}
            >
              <Pencil size={14} className="inline mr-1" /> Update
            </button>
            <button
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-full"
              onClick={() => handleDeleteMenu(activeMenu.id)}
            >
              <Trash size={14} className="inline mr-1" /> Delete
            </button>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto bg-white rounded-md shadow-sm">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
                <tr>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Menu</th>
                  <th className="px-4 py-2 text-center">Available</th>
                  <th className="px-4 py-2 text-center">
                    Show on Customer Site
                  </th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      {/* Item Image & Name */}
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          <img
                            //src={item.image ? `/uploads/${item.image}` : "/images/food.svg"}
                            src={item.imagePath || foodImage}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <strong className="block text-gray-800">
                              {item.item_name}
                            </strong>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{`AED${Number(
                        item.price
                      ).toFixed(2)}`}</td>
                      <td className="px-4 py-2">{item.category_name}</td>
                      <td className="px-4 py-2">{item.menu_name}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-3 w-3 accent-[#00006f]"
                          checked={!!item.is_available}
                        />
                      </td>

                      {/* Show on Customer Site */}
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-3 w-3 accent-[#00006f]"
                          checked={!!item.show_on_customer_site}
                        />
                      </td>

                      <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setFormMode("edit");
                            setEditData(item);
                            setShowItemForm(true);
                          }}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border rounded-full hover:bg-gray-200 transition-colors duration-150"
                        >
                          <Pencil size={14} className="inline mr-1" /> Update
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-150"
                        >
                          <Trash size={14} className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modals */}
      {showMenuForm && (
        <MenuForm
          formMode={formMode}
          initialData={editData}
          onSave={() => {
            setShowMenuForm(false);
            setEditData(null);
            loadData();
          }}
          onCancel={() => setShowMenuForm(false)}
        />
      )}

      {showItemForm && (
        <MenuItemForm
          formMode={formMode}
          initialData={editData}
          menus={menus}
          categories={categories}
          onSave={handleSaveItem} // ✅ now calls the real save handler
          onCancel={() => setShowItemForm(false)}
          onAddCategory={(cat) => setCategories([...categories, cat])}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          formMode="add"
          onSave={() => {
            setShowCategoryForm(false);
            loadData();
          }}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}
    </div>
  );
}

export default MenuManagement;
