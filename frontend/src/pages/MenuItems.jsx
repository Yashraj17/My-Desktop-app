import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import MenuItemForm from "../form/menu/MenuItemForm";
import CategoryForm from "../form/menu/CategoryForm";

export function MenuItems() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // 🔹 search state
     const [items, setItems] = useState([]);
     const [menus, setMenus] = useState([]);
     const [categories, setCategories] = useState([]);
     const [formMode, setFormMode] = useState("add");
     const [editData, setEditData] = useState(null);
     const [showForm, setShowForm] = useState(false);
     const [showCategoryForm, setShowCategoryForm] = useState(false);
     //Define table columns
const columns = [
  {
    accessorKey: "item_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
        >
          Item Name
          <ArrowUpDown/>
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      const imagePath = item.imagePath || "./images/food.svg";
      
      return (
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={imagePath}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
            alt={item.item_name}
            onError={(e) => {
              e.target.src = "/images/food.svg";
            }}
          />
          <div className="min-w-0 max-w-[200px] flex-1">
            <div className="font-medium text-gray-800 truncate">{item.item_name}</div>
            <p className="text-sm text-gray-500 truncate">{item.description || "No description"}</p>
          </div>
        </div>
      );
    },
    width: "300px",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600 whitespace-nowrap">AED {Number(row.getValue("price")).toFixed(2)}</div>
    ),
    width: "100px",
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("category_name")}</div>
    ),
    width: "120px",
  },
  {
    accessorKey: "menu_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Menu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("menu_name")}</div>
    ),
    width: "120px",
  },
  {
    accessorKey: "is_available",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent text-center"
        >
          Available
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isAvailable = row.getValue("is_available");
      return (
        <div className="text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 accent-[#00006f]"
            checked={!!isAvailable}
            readOnly
          />
        </div>
      );
    },
    width: "100px",
  },
  {
    accessorKey: "show_on_customer_site",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent text-center"
        >
          Show on Site
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const showOnSite = row.getValue("show_on_customer_site");
      return (
        <div className="text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 accent-[#00006f]"
            checked={!!showOnSite}
            readOnly
          />
        </div>
      );
    },
    width: "120px",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // const handleUpdate = () => {
      //   console.log("Update item:", row.original);
      // };

      // const handleDelete = () => {
      //   console.log("Delete item:", row.original);
      // };

      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            //onClick={handleUpdate}
            onClick={() => {
                        setFormMode("edit");
                        setEditData(row.original);
                        setShowForm(true);
                      }}
            className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            //onClick={handleDelete}
            onClick={() => handleDelete(row.original.id)}
            className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      );
    },
    width: "180px",
  }
];

  const loadData = async () => {
    const data = await window.api.getMenuItems();
    const menus = await window.api.getMenusWithItems();
    const cats = await window.api.getCategories();

    const itemsWithPaths = await Promise.all(
      data.map(async (item) => ({
        ...item,
        imagePath: item.image
          ? await window.api.getUploadsPath(item.image)
          : null,
      }))
    );
    console.log("hello this is menu items data", itemsWithPaths);
    setItems(itemsWithPaths);
    setMenus(menus);
    setCategories(cats);
  };


  const handleSave = async (payload) => {
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
        setShowForm(false);
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
  
    const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this menu item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });
  
      if (result.isConfirmed) {
        await window.api.deleteMenuItem(id);
        loadData();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };
  
    // when a new category is added from CategoryForm
    const handleCategorySave = async (categoryName) => {
      try {
        await window.api.addCategory(categoryName);
        Swal.fire({
          icon: "success",
          title: "Category added",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowCategoryForm(false);
        loadData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Error saving category",
        });
      }
    };
    const table = useReactTable({
        data: items,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // 🔹 enables filtering
        state: {
            sorting,
            globalFilter, // 🔹 search applied here
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Menu Items
                        </h1>
                    </div>

                    <div className="items-center justify-between block sm:flex">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                                {/* 🔹 Search input wired to globalFilter */}
                                <Input
                                    type="text"
                                    value={globalFilter ?? ""}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search your menu items here"
                                />
                            </div>
                        </div>
                        <div className="inline-flex gap-x-4 mb-4 sm:mb-0">
                            <Button className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                                Organize Menu Items
                            </Button>

                            <Button className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white"
                            onClick={() => {
            setFormMode("add");
            setEditData(null);
            setShowForm(true);
          }}>
                                Add Menu Item
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* /// table */}
            <div className="w-full">
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-[#F3F4F6] hover:bg-[#F3F4F6] dark:bg-gray-800"
                                >
                                    {headerGroup.headers.map((header) => {
                                        const columnDef = header.column.columnDef;
                                        const width = columnDef.width || "auto";

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="py-1 whitespace-nowrap px-2"
                                                style={{ width }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-t hover:bg-[#f0f1f4] bg-white"
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const columnDef = cell.column.columnDef;
                                            const width = columnDef.width || "auto";

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className="py-2 px-4"
                                                    style={{ width }}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                 {/* Item Form */}
      {showForm && (
        <MenuItemForm
          formMode={formMode}
          initialData={editData}
          menus={menus}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          onAddCategory={(cat) => {
            setCategories([...categories, cat]);
          }}
        />
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <CategoryForm
          formMode="add"
          onSave={handleCategorySave}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}
            </div>
        </>
    );
}