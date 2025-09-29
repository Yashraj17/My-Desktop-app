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
import ExecutiveForm from "../form/Executive/ExecutiveForm";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
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


export function DeliveryExecutive() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // 🔹 search state
    const [deliveryExecutive, setDeliveryExecutive] = useState([]);
const [formMode, setFormMode] = useState("add");
const [editData, setEditData] = useState(null);
const [showForm, setShowForm] = useState(false);

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
                Delivery Executive Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-600">
                {row.getValue("name")}
            </div>
        ),
        width: "200px",
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Phone
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-gray-600">
    {String(row.getValue("phone")).replace(/\.0$/, "")}
            </div>
        ),
        width: "200px",
    },
    {
        accessorKey: "total_orders",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Total Orders
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
           <Badge className={'bg-gray-200 text-gray-500 hover:bg-gray-200 mr-2'}>
                    {row.getValue("total_orders")}  ORDER
                </Badge>
        ),
        width: "200px",
    },
     {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            
          <Badge
  className={`mr-2 border ${
    row.getValue("status")?.toLowerCase() === "available"
      ? "bg-green-100 text-green-700 border-green-700 hover:bg-green-100"
      : "bg-red-100 text-red-700 border-red-700 hover:bg-red-100"
  }`}
>
  {row.getValue("status")}
</Badge>

        ),
        width: "200px",
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
onClick={() => {
    setFormMode("edit");
    setEditData(row.original);
    setShowForm(true);
  }}                        className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
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
                    </Button>
                </div>
            );
        },
        width: "200px",
    },
];
   
const loadData = async () => {
        try {
            const data = await window.api.getDeliveryExecutives();
            setDeliveryExecutive(data);
            console.log("hello delivery Executive",data)
        } catch (error) {
            console.error("Failed to load customer:", error);
        }
    };

    const table = useReactTable({
        data: deliveryExecutive,
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


    const handleSave = async (executive) => {
  try {
    if (formMode === "edit" && editData) {
      await window.api.updateDeliveryExecutive(editData.id, executive);
      Swal.fire({ icon: "success", title: "Executive updated", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
    } else {
      await window.api.addDeliveryExecutive(executive);
      Swal.fire({ icon: "success", title: "Executive added", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
    }
    setShowForm(false);
    setEditData(null);
    loadData();
  } catch (err) {
    Swal.fire({ icon: "error", title: "Error", text: err.message || "Error saving executive" });
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the executive permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await window.api.deleteDeliveryExecutive(id);
      loadData();
      Swal.fire({ icon: "success", title: "Deleted", text: "Executive deleted successfully", toast: true, position: "top-end", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete executive" });
    }
  }
};



// Export Executives
const handleExport = () => {
  if (!deliveryExecutive.length) {
    Swal.fire({
      icon: "info",
      title: "No data",
      text: "There are no executives to export.",
    });
    return;
  }

  // Prepare data
  const data = deliveryExecutive.map((exec, index) => ({
    "Sr No": index + 1,
    Name: exec.name,
  Phone: String(exec.phone || "").replace(/\.0$/, ""), // ✅ clean phone
    Status: exec.status,
    "Created At": exec.created_at
      ? new Date(exec.created_at).toLocaleString()
      : "",
  }));

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto width calculation
  const maxLength = [];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let max = 10; // minimum width
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const length = cell.v.toString().length;
        if (length > max) max = length;
      }
    }
    maxLength.push({ wch: max + 2 }); // extra padding
  }
  worksheet["!cols"] = maxLength;

  // Bold header row
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = {
      font: { bold: true },
    };
  }

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DeliveryExecutives");

  // Generate filename with current date-time
  const fileName = `delivery-executives_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.xlsx`;

  // Convert workbook to binary string and trigger download automatically
  const wbout = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


    return (
        <>
            <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Delivery Executive
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
                                    placeholder="Search by name phone number"
                                />
                            </div>
                        </div>
                        <div className="inline-flex gap-x-4 mb-4 sm:mb-0">
                            <Button className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"  onClick={handleExport}
>
                                Export
                            </Button>
                            <Button className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white" onClick={() => {
    setFormMode("add");
    setEditData(null);
    setShowForm(true);
  }}>
                                Add Executive
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
  <ExecutiveForm
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