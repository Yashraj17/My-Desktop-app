
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import AreaForm from "../form/Table/AreaForm";

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

export function Areas() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [areas, setAreas] = useState([]);
  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      accessorKey: "area_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
        >
          Area Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-gray-600">
          {row.getValue("area_name")}
        </div>
      ),
      width: "400px",
    },
      {
        accessorKey: "total_tables",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                No of Tables
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-gray-600">
            {row.getValue("total_tables")}
            </div>
        ),
        width: "300px",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
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
      ),
      width: "200px",
    },
  ];

 
  const table = useReactTable({
    data: areas,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const loadData = async () => {
    try {
      const data = await window.api.getAreas();
      setAreas(data);
    } catch (err) {
      console.error("Failed to load areas:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (area) => {
    try {
      if (formMode === "edit" && editData) {
        await window.api.updateAreas(editData.id, area);
        Swal.fire({
          icon: "success",
          title: "Area updated",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await window.api.addAreas(area);
        Swal.fire({
          icon: "success",
          title: "Area added",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setShowForm(false);
      setEditData(null);
      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving area",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this area?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await window.api.deleteAreas(id);
        await loadData();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Area deleted successfully.",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to delete area",
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
              Areas
            </h1>
          </div>

          <div className="items-center justify-between block sm:flex">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                <Input
                  type="text"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search areas..."
                />
              </div>
            </div>
            <div className="inline-flex gap-x-4 mb-4 sm:mb-0">
              <Button
                className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white"
                onClick={() => {
                  setFormMode("add");
                  setEditData(null);
                  setShowForm(true);
                }}
              >
                Add Area
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-[#F3F4F6]">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.column.columnDef.width || "auto" }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-t bg-white">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.columnDef.width || "auto",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Show Form Drawer */}
      {showForm && (
        <AreaForm
          formMode={formMode}
          initialData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}

