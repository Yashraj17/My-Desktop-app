import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import CategoryForm from "../form/menu/CategoryForm";
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



export function ItemCategory() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // 🔹 search state
    const [categories, setCategories] = useState([]);
    const [formMode, setFormMode] = useState("add");
    const [editData, setEditData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    /// Define table columns
const columns = [
    {
        accessorKey: "category_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Item Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-600">
                {row.getValue("category_name")}
            </div>
        ),
        width: "500px",
    },
    {
        accessorKey: "items_count",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Menu Items
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-gray-600">
                {row.getValue("items_count") || 0} Item(s)
            </div>
        ),
        width: "300px",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
           
            return (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        //onClick={() => handleUpdate(row.original)}
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
                        onClick={() => handleDelete(row.original.id)}
                        className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            );
        },
        width: "200px",
    },
];
    const loadData = async () => {
        try {
            const data = await window.api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    const table = useReactTable({
        data: categories,
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
    return (
        <>
            <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Item Categories
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
                                    placeholder="Search your menu here"
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
                                Add Item Category
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
        </>
    );
}