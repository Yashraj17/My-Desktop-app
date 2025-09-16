import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

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
import { Badge } from '../components/ui/badge';
import Swal from "sweetalert2";
import ModifierGroupForm from "../form/menu/ModifierGroupForm";


export function ModifierGroup() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // 🔹 search state
    const [modifierGroups, setModifierGroups] = useState([]);
const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
    const loadData = async () => {
        const data = await window.api.getModifierGroups();
        console.log("hello this is modifier group data", data)
        setModifierGroups(data);
    };

    // Define table columns
const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Group Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-600">
                {row.getValue("name")}
            </div>
        ),
        width: "300px",
    },
    {
        accessorKey: "options",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Options
            </Button>
        ),
        cell: ({ row }) => {
            const options = row.getValue("options");
            return (
                <div>
                    {options?.map((option, index) => (
                        <Badge
                            key={index}
                            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mr-2 mb-1"
                        >
                            {option.name}: AED{option.price.toFixed(2)}
                        </Badge>
                    ))}
                </div>
            );
        },
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
                        onClick={() => { setFormMode("edit"); setEditData(row.original); setShowForm(true); }}

                        className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        //onClick={() => handleDelete(row.original.id)}
                        onClick={() => handleDelete(row.original.id)}

                        className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                    </Button>
                </div>
            );
        },
        width: "200px",
    },
];

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

    const table = useReactTable({
        data: modifierGroups,
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
                            Modifier Groups
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
                                    placeholder="Search your category here"
                                />
                            </div>
                        </div>
                        <div className="inline-flex gap-x-4 mb-4 sm:mb-0">

                            <Button className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white"
                                  onClick={() => { setFormMode("add"); setEditData(null); setShowForm(true); }}
                               >
                                Add Modifier Group
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
                 {showForm && (
        <ModifierGroupForm
          formMode={formMode}
          initialData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
            </div>
        </>
    );
}